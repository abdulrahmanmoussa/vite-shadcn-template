export type UserRole = string; // Support dynamic roles
export type PermissionAction =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "block"
  | "unblock"
  | "approve"
  | "reject"
  | "pause"
  | "send"
  | "manage";

export type PermissionResource =
  | "dashboard"
  | "users"
  | "admins"
  | "projects"
  | "categories"
  | "roles"
  | "messages"
  | "chat"
  | "notifications"
  | "terms_and_conditions"
  | "permissions"
  | "investor_segmentations"
  | "investor_questions"
  | "individual_investors"
  | "institutional_investors"
  | "partners"
  | "suppliers"
  | "roles_permissions"
  | "industries"
  | "opportunities";


export type Permission = string;

export interface SidebarItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiredPermissions?: string[];
  exactMatch?: boolean;
  children?: SidebarItem[];
}

export interface RoleConfig {
  role: UserRole;
  displayName: string;
  defaultRoute: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    sidebarStyle?: "default" | "compact" | "minimal";
    sidebar?: {
      backgroundColor?: string;
      textColor?: string;
      hoverTextColor?: string;
      selectedTextColor?: string;
      hoverBackgroundColor?: string;
      selectedBackgroundColor?: string;
      logoColor?: string;
    };
  };
  sidebar: SidebarItem[];
  features?: {
    [key: string]: boolean;
  };
  isStatic?: boolean; // Flag to indicate if this is a static or dynamic role
}

export interface RBACContext {
  role: UserRole | null;
  permissions: Permission[];
  hasPermission: (permissionKey: string) => boolean;
  hasAnyPermission: (permissionKeys: string[]) => boolean;
  hasResource: (
    resource: PermissionResource,
    action: PermissionAction
  ) => boolean;
  canAccess: (requiredPermissions?: string[]) => boolean;
}
