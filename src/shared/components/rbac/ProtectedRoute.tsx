import { getFirstAccessibleDashboardRoute } from "@/shared/config/roles/dynamic-config";
import { useRBAC } from "@/shared/providers/RBACProvider";
import {
  type PermissionAction,
  type PermissionResource,
} from "@/shared/types/rbac";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;

  // Permission-based access control
  permissionKey?: string;
  permissionKeys?: string[];

  // Resource-based access control
  resource?: PermissionResource;
  action?: PermissionAction;

  // Role-based access control
  roles?: string[];

  // Whether to require all permissions or just one
  requireAll?: boolean;
}

export function ProtectedRoute({
  children,
  permissionKey,
  permissionKeys,
  resource,
  action,
  roles,
  requireAll = false,
}: ProtectedRouteProps) {
  const { role, permissions, hasPermission, hasAnyPermission, hasResource } =
    useRBAC();
  const fallbackRoute = getFirstAccessibleDashboardRoute(permissions);

  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // Check single permission
  if (permissionKey) {
    if (!hasPermission(permissionKey)) {
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // Check multiple permissions
  if (permissionKeys && permissionKeys.length > 0) {
    const hasAccess = requireAll
      ? permissionKeys.every((key) => hasPermission(key))
      : hasAnyPermission(permissionKeys);

    if (!hasAccess) {
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  // Check resource-based permission
  if (resource && action) {
    if (!hasResource(resource, action)) {
      return <Navigate to={fallbackRoute} replace />;
    }
  }

  return <>{children}</>;
}
