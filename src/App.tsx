import { RBACProvider } from "@/shared/providers/RBACProvider";
import { ProtectedRoute } from "@/shared/components/rbac/ProtectedRoute";
import DashboardDemo from "@/features/roles/pages/DashboardDemo";
import Login from "@/features/auth/pages/Login";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RBACProvider>
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </RBACProvider>
    ),
    children: [
      {
        path: "/",
        element: <DashboardDemo />,
      },
      {
        path: "/auth/login",
        element: <Login />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
