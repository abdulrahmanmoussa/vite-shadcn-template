import { type Permission } from "@/shared/types/rbac";
import { create } from "zustand";
import { getProfile } from "./api/auth.api";

interface UserRole {
  _id: string;
  key: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  profileImage?: string;
  coverImage?: string;
  username: string;
  email: string;
  phoneNumber: {
    number: string;
  };
  type: string;
  status: string;
  createdAt?: string;
  isBlocked: {
    value: boolean;
  };
  role: UserRole;
  user_role?: UserRole;
  isOnline: boolean;
  isAvaliableToInstantProjects: boolean;
  pricePerHour: number;
  isVerified: boolean;
  isDeleted: boolean;
  isFollow: boolean;
  followCount: {
    followers: number;
    following: number;
  };
  address: {
    type: string;
    coordinates: number[];
  };
  categories: string[];
  acceptedProjectsCounter: number;
  profileViews: number;
  about: string;
  rate: {
    ratersCounter: number;
    totalRates: number;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  permissions: Permission[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setPermissions: (permissions: Permission[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  permissions: [],
  isLoading: true,
  error: null,

  setUser: (user) => {
    const permissions = user?.role?.permissions || [];
    set({
      user,
      isAuthenticated: !!user,
      permissions,
    });
  },

  setPermissions: (permissions) => set({ permissions }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getProfile();
      const userData = response?.data?.data;

      if (userData) {
        get().setUser(userData as any);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      set({
        error: "Failed to fetch profile",
        isAuthenticated: false,
        user: null,
        permissions: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      permissions: [],
      isLoading: false,
      error: null,
    }),
}));
