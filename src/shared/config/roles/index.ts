import {
  type Permission,
  type RoleConfig,
  type UserRole,
} from "@/shared/types/rbac";
import { generateDynamicRoleConfig } from "./dynamic-config";

export const STATIC_ROLE_CONFIGS: Record<string, RoleConfig> = {};

export function getRoleConfig(
  role: UserRole,
  permissions?: Permission[]
): RoleConfig {
  // First check if it's a static role
  if (STATIC_ROLE_CONFIGS[role]) {
    return STATIC_ROLE_CONFIGS[role];
  }

  // If not static and we have permissions, generate dynamic config
  if (permissions && permissions.length > 0) {
    return generateDynamicRoleConfig(role, permissions);
  }

  // Fallback: create basic config with no permissions
  return generateDynamicRoleConfig(role, []);
}

export function getDefaultRoute(
  role: UserRole,
  permissions?: Permission[]
): string {
  return getRoleConfig(role, permissions).defaultRoute;
}

export function getRoleDisplayName(
  role: UserRole,
  permissions?: Permission[]
): string {
  return getRoleConfig(role, permissions).displayName;
}

export function getRoleTheme(role: UserRole, permissions?: Permission[]) {
  return getRoleConfig(role, permissions).theme;
}

export function getRoleSidebar(role: UserRole, permissions?: Permission[]) {
  return getRoleConfig(role, permissions).sidebar;
}

export function getRoleFeatures(role: UserRole, permissions?: Permission[]) {
  return getRoleConfig(role, permissions).features;
}
