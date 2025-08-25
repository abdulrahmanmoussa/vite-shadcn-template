import { useRBAC } from "@/shared/providers/RBACProvider";
import {
  type PermissionAction,
  type PermissionResource,
} from "@/shared/types/rbac";
import React from "react";

interface ProtectedComponentProps {
  children: React.ReactNode;

  // Permission-based access control
  permissionKey?: string;
  permissionKeys?: string[];

  // Resource-based access control
  resource?: PermissionResource;
  action?: PermissionAction;

  // Role-based access control
  roles?: string[];

  // Fallback UI when access is denied
  fallback?: React.ReactNode;

  // Whether to show fallback or hide completely
  showFallback?: boolean;
}

export function ProtectedComponent({
  children,
  permissionKey,
  permissionKeys,
  resource,
  action,
  roles,
  fallback = null,
  showFallback = false,
}: ProtectedComponentProps) {
  const { role, hasPermission, hasAnyPermission, hasResource } = useRBAC();

  // Check role-based access
  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  // Check single permission
  if (permissionKey) {
    if (!hasPermission(permissionKey)) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  // Check multiple permissions (any of them)
  if (permissionKeys && permissionKeys.length > 0) {
    if (!hasAnyPermission(permissionKeys)) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  // Check resource-based permission
  if (resource && action) {
    if (!hasResource(resource, action)) {
      return showFallback ? <>{fallback}</> : null;
    }
  }

  return <>{children}</>;
}

// Convenience hook for permission checking
export function usePermissionCheck() {
  const { hasPermission, hasAnyPermission, hasResource, canAccess } = useRBAC();

  return {
    hasPermission,
    hasAnyPermission,
    hasResource,
    canAccess,
  };
}
