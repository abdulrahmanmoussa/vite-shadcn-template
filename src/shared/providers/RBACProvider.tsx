/* eslint-disable react-refresh/only-export-components */
import { PageLoader } from "@/shared/components/custom/PageLoader";
import {
  canAccess,
  hasAnyPermission,
  hasPermission,
  hasResource,
} from "@/shared/config/permissions";
import { getRoleConfig } from "@/shared/config/roles";
import { useAuthStore } from "@/features/auth/auth.store";
import {
  type Permission,
  type RBACContext,
  type UserRole,
} from "@/shared/types/rbac";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router";

const RBACContext = createContext<RBACContext | null>(null);

interface RBACProviderProps {
  children: React.ReactNode;
}

export function RBACProvider({ children }: RBACProviderProps) {
  const location = useLocation();
  const { user, permissions, isLoading, error, fetchProfile, isAuthenticated } =
    useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const role = user?.role?.key as UserRole | null;

  const contextValue = useMemo<RBACContext>(
    () => ({
      role,
      permissions,
      hasPermission: (permissionKey: string) =>
        hasPermission(permissions, permissionKey),
      hasAnyPermission: (permissionKeys: string[]) =>
        hasAnyPermission(permissions, permissionKeys),
      hasResource: (resource) => hasResource(permissions, resource),
      canAccess: (requiredPermissions) =>
        canAccess(permissions, requiredPermissions),
    }),
    [role, permissions]
  );

  if (isLoading) {
    return <PageLoader />;
  }

  // if (error && !isLoading) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }

  // if (!isAuthenticated && !isLoading) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }

  return (
    <RBACContext.Provider value={contextValue}>{children}</RBACContext.Provider>
  );
}

export function useRBAC(): RBACContext {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}

export function useRole(): UserRole | null {
  const rbac = useRBAC();
  return rbac.role;
}

export function usePermissions(): Permission[] {
  const { permissions } = useRBAC();
  return permissions;
}

export function useHasPermission(permissionKey: string): boolean {
  const { hasPermission } = useRBAC();
  return hasPermission(permissionKey);
}

export function useHasAnyPermission(permissionKeys: string[]): boolean {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(permissionKeys);
}

export function useCanAccess(requiredPermissions?: string[]): boolean {
  const { canAccess } = useRBAC();
  return canAccess(requiredPermissions);
}

export function useRoleConfig() {
  const role = useRole();
  const permissions = usePermissions();
  return role ? getRoleConfig(role, permissions) : null;
}

export function useRoleSidebar() {
  const roleConfig = useRoleConfig();
  return roleConfig?.sidebar || [];
}
