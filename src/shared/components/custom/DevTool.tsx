// import {
//   Copy,
//   Eye,
//   EyeOff,
//   History,
//   RefreshCw,
//   Settings,
//   X,
// } from "lucide-react"
// import { useEffect, useMemo, useState } from "react"
// import { useNavigate } from "react-router"
// import { toast } from "sonner"
// import useLogin from "~/routes/auth/hooks/useLogin"
// import { client } from "~/sdk/sdk.gen"
// import { type UsersEntity } from "~/sdk/types.gen"
// import { useLang } from "~/shared/hooks/useLang"
// import useOtp from "~/shared/hooks/useOtp"
// import useRefreshUserData from "~/shared/hooks/useRefreshUserData"
// import cookiesStorage from "~/shared/lib/cookieStorage"
// import { useUserStore } from "~/shared/store/user-store"
// import { Input } from "./ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

// interface SavedSession {
//   user: UsersEntity
//   token: string
//   email: string
//   timestamp: number
// }

// const SAVED_SESSIONS_KEY = "dev_tool_saved_sessions"

// const getRoleBadgeStyle = (role: string) => {
//   const baseStyle = "px-2 py-0.5 rounded-full text-xs font-medium"

//   // Main role colors
//   switch (role?.toLowerCase()) {
//     case "admin":
//       return `${baseStyle} bg-red-100 text-red-800`
//     case "partner":
//       return `${baseStyle} bg-blue-100 text-blue-800`
//     case "individual_investor":
//       return `${baseStyle} bg-green-100 text-green-800`
//     case "institutional_investor":
//       return `${baseStyle} bg-purple-100 text-purple-800`
//     case "supplier":
//       return `${baseStyle} bg-yellow-100 text-yellow-800`
//     default:
//       return `${baseStyle} bg-gray-100 text-gray-800`
//   }
// }

// const DevTool = () => {
//   // Only show if TOOL=true in .env
//   if (import.meta.env.VITE_TOOL !== "true") {
//     return null
//   }
//   const navigate = useNavigate()
//   const { lang } = useLang()
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [savedSessions, setSavedSessions] = useState<SavedSession[]>([])
//   const [showUserData, setShowUserData] = useState<string | null>(null)
//   const [showCurrentUserData, setShowCurrentUserData] = useState(false)
//   const {
//     setUser,
//     user: currentUser,
//     accessToken,
//     isAuthenticated,
//   } = useUserStore()
//   const { refreshUserData } = useRefreshUserData()

//   // Login hook
//   const login = useLogin()

//   // Get current user data from store
//   const getCurrentUserData = () => {
//     // Get fresh state from store to ensure we have the latest data
//     const storeState = useUserStore.getState()

//     // Use fresh store state instead of React state which might be stale
//     if (!storeState.user || !storeState.accessToken) {
//       return null
//     }

//     return {
//       user: storeState.user,
//       token: storeState.accessToken,
//     }
//   }

//   // Memoize current user data to avoid repeated calls during render
//   const currentUserData = useMemo(
//     () => getCurrentUserData(),
//     [currentUser, accessToken],
//   )

//   // OTP hook for auto-verification
//   const { handleOtpSubmit } = useOtp({
//     data: { identifier: "" }, // Initialize with empty, we'll pass the real identifier when submitting
//     onOtpSubmit: () => {},
//     onContinueClick: async data => {
//       try {
//         console.log("OTP verification successful, refreshing user data...")
//         const result = await refreshUserData(data.tokens)

//         if (result.success) {
//           // Update the access token in the user store
//           const { setAccessToken, setRefreshToken } = useUserStore.getState()
//           setAccessToken(data.tokens.access_token)
//           setRefreshToken(data.tokens.refresh_token)

//           console.log("User data refreshed, tokens set in store")

//           // Wait a bit longer for the user store to update, then save session
//           setTimeout(() => {
//             console.log("Attempting to save session for:", email)
//             saveCurrentSession(email)
//           }, 1000)

//           toast.success("Login completed successfully!")
//           navigate(`/${lang}/dashboard`)
//         } else {
//           throw new Error("Failed to refresh user data")
//         }
//       } catch (error) {
//         console.error("Error completing login:", error)
//         toast.error("Failed to complete login")
//       }
//     },
//   })

//   useEffect(() => {
//     const sessions = localStorage.getItem(SAVED_SESSIONS_KEY)
//     if (sessions) {
//       try {
//         const parsedSessions = JSON.parse(sessions)
//         setSavedSessions(parsedSessions)
//         console.log("Loaded saved sessions:", parsedSessions.length)
//       } catch (error) {
//         console.error("Error parsing saved sessions:", error)
//         localStorage.removeItem(SAVED_SESSIONS_KEY)
//       }
//     } else {
//       console.log("No saved sessions found")
//     }
//   }, [])

//   const saveCurrentSession = (sessionEmail: string) => {
//     const currentData = getCurrentUserData()
//     if (!currentData) {
//       console.log("No current user data available to save")
//       return
//     }

//     const { user, token } = currentData
//     const newSession: SavedSession = {
//       user,
//       token,
//       email: sessionEmail,
//       timestamp: Date.now(),
//     }

//     // Check if session already exists
//     const existingSessionIndex = savedSessions.findIndex(
//       session => session.email === sessionEmail,
//     )

//     let updatedSessions: SavedSession[]
//     if (existingSessionIndex !== -1) {
//       // Update existing session
//       updatedSessions = [...savedSessions]
//       updatedSessions[existingSessionIndex] = newSession
//       console.log("Updated existing session for:", sessionEmail)
//     } else {
//       // Add new session
//       updatedSessions = [...savedSessions, newSession]
//       console.log("Added new session for:", sessionEmail)
//     }

//     setSavedSessions(updatedSessions)
//     localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(updatedSessions))
//     console.log("Saved sessions updated:", updatedSessions.length)
//   }

//   const removeSession = (email: string) => {
//     const updatedSessions = savedSessions.filter(
//       session => session.email !== email,
//     )
//     setSavedSessions(updatedSessions)
//     localStorage.setItem(SAVED_SESSIONS_KEY, JSON.stringify(updatedSessions))
//   }

//   const switchToSession = async (session: SavedSession) => {
//     try {
//       console.log("Switching to session:", session.email)
//       console.log("Session token:", session.token)

//       // Update user store with the session data
//       setUser(session.user)

//       // Set access token in the user store using the store actions
//       const { setAccessToken, setRefreshToken } = useUserStore.getState()
//       setAccessToken(session.token)

//       // Also update cookies since the store uses cookies for persistence
//       cookiesStorage.setItem("access_token", session.token)
//       // Note: We might not have refresh token in saved session, but if we did:
//       // cookiesStorage.setItem("refresh_token", session.refreshToken)

//       // Update SDK client headers
//       client.setConfig({
//         headers: {
//           Authorization: `Bearer ${session.token}`,
//         },
//       })

//       // Navigate to dashboard
//       navigate(`/${lang}/dashboard`)

//       // Reset states
//       setShowCurrentUserData(false)
//       setShowUserData(null)

//       toast.success("Switched to session successfully")

//       // Verify the switch worked
//       setTimeout(() => {
//         const currentData = getCurrentUserData()
//         console.log("After session switch - current data:", currentData)
//         const freshStoreState = useUserStore.getState()
//         console.log(
//           "After session switch - fresh store state:",
//           freshStoreState,
//         )
//       }, 100)
//     } catch (error) {
//       toast.error("Failed to switch session")
//       console.error("Session switch error:", error)
//     }
//   }

//   const handleLogout = () => {
//     const { clearUser } = useUserStore.getState()
//     clearUser()
//     navigate(`/${lang}/auth/login`)
//   }

//   const handleLogin = () => {
//     navigate(`/${lang}/auth/login`)
//   }

//   const handleQuickLogin = async () => {
//     if (!email) {
//       toast.error("Please enter an email")
//       return
//     }

//     if (!password) {
//       toast.error("Please enter a password")
//       return
//     }

//     try {
//       // Set phone number (identifier) in login store
//       login.setPhoneNumber(email)
//       login.setPassword(password)

//       // Send signin request
//       await login.handleCredentialsSubmit()

//       toast.success("Login initiated, auto-verifying with OTP 1234...")

//       // Auto-verify with hardcoded OTP after a short delay
//       setTimeout(async () => {
//         try {
//           await handleOtpSubmit("1234", { identifier: email })
//         } catch (error) {
//           console.error("Auto OTP verification failed:", error)
//           toast.error("Auto OTP verification failed, please verify manually")
//         }
//       }, 1000)
//     } catch (error) {
//       console.error("Quick login failed:", error)
//       toast.error("Quick login failed")
//     }
//   }

//   const copyToClipboard = async (text: string, message: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast.success(message)
//     } catch (err) {
//       toast.error("Failed to copy to clipboard")
//     }
//   }

//   const handleRefreshToken = async (sessionEmail: string) => {
//     if (!password) {
//       toast.error("Please enter a password first")
//       return
//     }

//     try {
//       login.setPhoneNumber(sessionEmail)
//       login.setPassword(password)
//       await login.handleCredentialsSubmit()

//       toast.success("Token refresh initiated, auto-verifying...")

//       // Auto-verify with hardcoded OTP after a short delay
//       setTimeout(async () => {
//         try {
//           await handleOtpSubmit("1234", { identifier: sessionEmail })
//           // Update the saved session after successful refresh
//           setTimeout(() => {
//             console.log(
//               "Updating session after token refresh for:",
//               sessionEmail,
//             )
//             saveCurrentSession(sessionEmail)
//             toast.success("Token refreshed successfully")
//           }, 1500) // Wait a bit longer for user store to update
//         } catch (error) {
//           console.error("Auto OTP verification failed:", error)
//           toast.error("Token refresh OTP verification failed")
//         }
//       }, 1000)
//     } catch (error) {
//       toast.error("Failed to refresh token")
//       console.error("Token refresh error:", error)
//     }
//   }

//   return (
//     <div className='fixed bottom-4 right-4 z-50'>
//       <Popover>
//         <PopoverTrigger asChild>
//           <button className='bg-primary text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all'>
//             <Settings className='w-6 h-6' />
//           </button>
//         </PopoverTrigger>
//         <PopoverContent
//           className='p-4 bg-white rounded-lg shadow-lg max-w-[400px] w-fit max-h-[80vh] overflow-y-auto border-none'
//           side='top'
//           align='end'
//           sideOffset={16}
//         >
//           {/* Current User Section */}
//           {currentUserData && (
//             <div className='mb-4'>
//               <div className='flex items-center justify-between p-2'>
//                 {" "}
//                 <div className='flex items-center space-x-3'>
//                   {currentUserData?.user?.name ? (
//                     <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600'>
//                       {currentUserData?.user?.name?.[0]?.toUpperCase() || "U"}
//                     </div>
//                   ) : (
//                     <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600'>
//                       {currentUserData?.user?.name?.[0]?.toUpperCase() || "U"}
//                     </div>
//                   )}
//                   <div>
//                     <div className='font-medium text-gray-900'>
//                       {currentUserData?.user?.name || "Unknown User"}
//                     </div>
//                     <div className='text-sm text-gray-500'>
//                       {currentUserData?.user?.email}
//                     </div>
//                     <div className='flex items-center gap-1 mt-1 flex-wrap'>
//                       <span
//                         className={getRoleBadgeStyle(
//                           currentUserData?.user?.user_role?.name || "user",
//                         )}
//                       >
//                         {currentUserData?.user?.user_role?.name || "user"}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className='flex items-center gap-2'>
//                   <button
//                     onClick={() => setShowCurrentUserData(!showCurrentUserData)}
//                     className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                     title='View Current User Data'
//                   >
//                     {showCurrentUserData ? (
//                       <EyeOff className='w-4 h-4' />
//                     ) : (
//                       <Eye className='w-4 h-4' />
//                     )}
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (currentUserData) {
//                         copyToClipboard(
//                           currentUserData.token,
//                           "Current token copied to clipboard",
//                         )
//                       }
//                     }}
//                     className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                     title='Copy Current Token'
//                   >
//                     <Copy className='w-4 h-4' />
//                   </button>
//                   <button
//                     onClick={() =>
//                       handleRefreshToken(currentUserData?.user?.email || "")
//                     }
//                     className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                     title='Refresh Token'
//                   >
//                     <RefreshCw className='w-4 h-4' />
//                   </button>
//                 </div>
//               </div>
//               {showCurrentUserData && (
//                 <div className='mt-2 p-2 bg-gray-50 rounded-md'>
//                   <div className='flex justify-end mb-2'>
//                     <button
//                       onClick={() => {
//                         if (currentUserData) {
//                           copyToClipboard(
//                             JSON.stringify(currentUserData.user, null, 2),
//                             "Current user data copied to clipboard",
//                           )
//                         }
//                       }}
//                       className='px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700'
//                     >
//                       Copy User Data
//                     </button>
//                   </div>
//                   <pre className='text-xs overflow-x-auto whitespace-pre-wrap text-gray-700'>
//                     {JSON.stringify(currentUserData?.user, null, 2)}
//                   </pre>
//                 </div>
//               )}
//               <div className='mt-2 border-b' />
//             </div>
//           )}

//           {/* Quick Login Section */}
//           <div className='space-y-4 mb-4'>
//             <Input
//               type='email'
//               placeholder='Enter email'
//               value={email}
//               onChange={e => setEmail(e.target.value)}
//               className='w-full'
//             />
//             <Input
//               type='password'
//               placeholder='Enter password'
//               value={password}
//               onChange={e => setPassword(e.target.value)}
//               className='w-full'
//             />
//             <button
//               onClick={handleQuickLogin}
//               className='w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90'
//             >
//               Quick Login
//             </button>
//             {currentUserData && (
//               <button
//                 onClick={() =>
//                   saveCurrentSession(
//                     email || currentUserData?.user?.email || "current-user",
//                   )
//                 }
//                 className='w-full text-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-opacity-90'
//               >
//                 Save Current Session
//               </button>
//             )}
//             <div className='text-xs text-gray-500 text-center'>
//               OTP will be auto-filled as 1234
//             </div>
//           </div>

//           {/* Saved Sessions Button with Popover */}
//           {savedSessions.length > 0 && (
//             <Popover>
//               <PopoverTrigger asChild>
//                 <button className='w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200'>
//                   <History className='w-4 h-4' />
//                   View Saved Sessions ({savedSessions.length})
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent
//                 className='p-0 bg-white border border-gray-200 mr-4 mb-14 min-w-[320px] shadow-lg animate-in fade-in-0 zoom-in-95 w-fit rounded-xl'
//                 side='right'
//                 align='start'
//                 sideOffset={8}
//               >
//                 <div className='py-2 max-h-[90vh] overflow-y-auto'>
//                   {savedSessions.map((session, index) => {
//                     return (
//                       <div key={session.email + index} className='px-2'>
//                         <div
//                           className='flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer group'
//                           onClick={() => switchToSession(session)}
//                         >
//                           <div className='flex items-center space-x-3'>
//                             <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600'>
//                               {session.user.name?.[0]?.toUpperCase() || "U"}
//                             </div>
//                             <div>
//                               <div className='font-medium text-gray-900 group-hover:text-gray-900'>
//                                 {session.user?.name || session.email}
//                               </div>
//                               <div className='text-sm text-gray-500 group-hover:text-gray-700'>
//                                 {session.user?.email || session.email}
//                               </div>
//                               <div className='flex items-center gap-1 mt-1 flex-wrap'>
//                                 <span
//                                   className={getRoleBadgeStyle(
//                                     session.user.user_role?.name || "user",
//                                   )}
//                                 >
//                                   {session.user.user_role?.name || "user"}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className='flex items-center gap-2'>
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation()
//                                 copyToClipboard(
//                                   session.token,
//                                   "Token copied to clipboard",
//                                 )
//                               }}
//                               className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                               title='Copy Token'
//                             >
//                               <Copy className='w-4 h-4' />
//                             </button>
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation()
//                                 handleRefreshToken(session.email)
//                               }}
//                               className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                               title='Refresh Token'
//                             >
//                               <RefreshCw className='w-4 h-4' />
//                             </button>
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation()
//                                 setShowUserData(
//                                   showUserData === session.email
//                                     ? null
//                                     : session.email,
//                                 )
//                               }}
//                               className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                               title='View User Data'
//                             >
//                               {showUserData === session.email ? (
//                                 <EyeOff className='w-4 h-4' />
//                               ) : (
//                                 <Eye className='w-4 h-4' />
//                               )}
//                             </button>
//                             <button
//                               onClick={e => {
//                                 e.stopPropagation()
//                                 removeSession(session.email)
//                               }}
//                               className='p-1 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700'
//                             >
//                               <X className='w-4 h-4' />
//                             </button>
//                           </div>
//                         </div>
//                         {showUserData === session.email && (
//                           <div className='mt-2 mx-2 p-2 bg-gray-50 rounded-md'>
//                             <div className='flex justify-end mb-2'>
//                               <button
//                                 onClick={() =>
//                                   copyToClipboard(
//                                     JSON.stringify(session.user, null, 2),
//                                     "User data copied to clipboard",
//                                   )
//                                 }
//                                 className='px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700'
//                               >
//                                 Copy User Data
//                               </button>
//                             </div>
//                             <pre className='text-xs overflow-x-auto whitespace-pre-wrap text-gray-700'>
//                               {JSON.stringify(session.user, null, 2)}
//                             </pre>
//                           </div>
//                         )}
//                       </div>
//                     )
//                   })}
//                 </div>
//               </PopoverContent>
//             </Popover>
//           )}

//           {/* Navigation Buttons */}
//           <div className='border-t pt-2'>
//             <button
//               onClick={handleLogout}
//               className='w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md'
//             >
//               Logout
//             </button>
//             <button
//               onClick={handleLogin}
//               className='w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md'
//             >
//               Go to Login
//             </button>
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   )
// }

// export default DevTool
