import { PERMISSION_KEYS } from "@/shared/config/permissions";
import {
  type Permission,
  type RoleConfig,
  type SidebarItem,
} from "@/shared/types/rbac";
import {
  BadgeCent,
  BookmarkX,
  Calendar,
  CreditCard,
  FileText,
  GitBranch,
  Home,
  Landmark,
  Medal,
  MessageCircleMore,
  Rss,
  Settings,
  Shield,
  Star,
  StickyNote,
  Tags,
  Ticket,
  Tickets,
  User,
  UserRound,
  Users,
} from "lucide-react";

// Default sidebar items based on permissions
const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    path: "/dashboard",
    icon: Home,
    label: "Home",
    requiredPermissions: [PERMISSION_KEYS.DASHBOARD.VIEW],
    exactMatch: true,
  },
  {
    path: "/dashboard/categories",
    icon: Tags,
    label: "Categories",
    requiredPermissions: [PERMISSION_KEYS.CATEGORIES.VIEW],
  },
  {
    path: "/dashboard/projects",
    icon: GitBranch,
    label: "Cycles",
    requiredPermissions: [PERMISSION_KEYS.PROJECTS.VIEW],
    children: [
      {
        path: "/dashboard/projects",
        icon: Calendar,
        label: "Projects",
        requiredPermissions: [PERMISSION_KEYS.PROJECTS.VIEW],
        children: [
          {
            path: "/dashboard/projects/reviews",
            icon: Star,
            label: "Reviews",
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/contracts",
    icon: FileText,
    label: "Contracts",
    requiredPermissions: [
      PERMISSION_KEYS.CONTRACTS.VIEW,
      PERMISSION_KEYS.CONTRACTS.VIEW_CANCELED_CONTRACTS,
    ],
    children: [
      {
        path: "/dashboard/contracts",
        icon: FileText,
        label: "Contracts",
        requiredPermissions: [PERMISSION_KEYS.CONTRACTS.VIEW],
      },
      {
        path: "/dashboard/cancelled-contracts",
        icon: BookmarkX,
        label: "Cancelled Contracts",
        requiredPermissions: [
          PERMISSION_KEYS.CONTRACTS.VIEW_CANCELED_CONTRACTS,
        ],
      },
    ],
    // requiredPermissions: [PERMISSION_KEYS.CONTRACTS.VIEW],
  },
  {
    path: "/dashboard/users",
    icon: User,
    label: "Users",
    requiredPermissions: [PERMISSION_KEYS.USERS.VIEW],
  },

  {
    path: "/dashboard/chat/messages",
    icon: MessageCircleMore,
    label: "Messages",
    // requiredPermissions: [PERMISSION_KEYS.MESSAGES.VIEW],
    children: [
      {
        path: "/dashboard/chat/messages",
        icon: MessageCircleMore,
        label: "Message Users",
        // requiredPermissions: [PERMISSION_KEYS.MESSAGES.VIEW],
      },
      {
        path: "/dashboard/chat/user-to-user",
        icon: UserRound,
        label: "User-to-User Chat",
        requiredPermissions: [PERMISSION_KEYS.MESSAGES.FROM_TO],
      },
    ],
  },

  {
    path: "/dashboard/support",
    icon: Tickets,
    label: "Support",
    requiredPermissions: [
      PERMISSION_KEYS.COMPLAINTS.VIEW,
      PERMISSION_KEYS.TICKETS.VIEW,
    ],
    children: [
      {
        path: "/dashboard/complaints",
        icon: Tickets,
        label: "Complaints",
        requiredPermissions: [PERMISSION_KEYS.COMPLAINTS.VIEW],
      },
      {
        path: "/dashboard/tickets",
        icon: Ticket,
        label: "Tickets",
        requiredPermissions: [PERMISSION_KEYS.TICKETS.VIEW],
      },
    ],
  },
  {
    path: "/dashboard/transactions",
    icon: Landmark,
    label: "Financial",
    requiredPermissions: [
      PERMISSION_KEYS.TRANSACTIONS.VIEW,
      PERMISSION_KEYS.FUND_TRANSACTIONS.VIEW,
    ],
    children: [
      {
        path: "/dashboard/transactions",
        icon: CreditCard,
        label: "Transactions",
        requiredPermissions: [PERMISSION_KEYS.TRANSACTIONS.VIEW],
      },
      {
        path: "/dashboard/subscriptions",
        icon: Rss,
        label: "Subscriptions",
        requiredPermissions: [PERMISSION_KEYS.TRANSACTIONS.VIEW],
      },
      {
        path: "/dashboard/fund-transactions",
        icon: BadgeCent,
        label: "Payouts",
        requiredPermissions: [PERMISSION_KEYS.FUND_TRANSACTIONS.VIEW],
      },
    ],
  },
  {
    path: "/dashboard/ranks",
    icon: Medal,
    label: "Ranks",
    requiredPermissions: [PERMISSION_KEYS.RANKS.VIEW],
  },
  {
    path: "/dashboard/custom-pages",
    icon: StickyNote,
    label: "Custom Pages",
    requiredPermissions: [PERMISSION_KEYS.CUSTOM_PAGES.VIEW],
  },
  {
    path: "/dashboard/roles",
    icon: Shield,
    label: "Roles",
    requiredPermissions: [PERMISSION_KEYS.ROLES.VIEW],
  },
  {
    path: "/dashboard/admins",
    icon: Users,
    label: "Admins",
    requiredPermissions: [PERMISSION_KEYS.ADMINS.VIEW],
  },
  {
    path: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
    requiredPermissions: [PERMISSION_KEYS.SETTINGS.VIEW],
  },
];

// Default theme for dynamic roles
const DEFAULT_THEME = {
  primaryColor: "blue",
  accentColor: "blue-600",
  sidebarStyle: "default" as const,
  sidebar: {
    backgroundColor: "bg-white",
    hoverTextColor: "text-muted",
    selectedBackgroundColor: "bg-secondary",
    logoColor: "primary",
  },
};

/**
 * Generate features object based on permissions
 */
function generateFeatures(permissions: Permission[]): Record<string, boolean> {
  const permissionKeys = permissions.map((p) => p);

  return {
    canManageUsers: permissionKeys.some(
      (key) => key.includes("users") && key.includes("manage")
    ),
    canManageRoles: permissionKeys.some(
      (key) => key.includes("roles") && key.includes("manage")
    ),
    canManagePermissions: permissionKeys.some(
      (key) => key.includes("permissions") && key.includes("manage")
    ),
    canViewAnalytics: permissionKeys.some(
      (key) => key.includes("dashboard") && key.includes("view")
    ),
    canManageProjects: permissionKeys.some(
      (key) => key.includes("projects") && key.includes("manage")
    ),
    canManageCategories: permissionKeys.some(
      (key) => key.includes("categories") && key.includes("manage")
    ),
    canManageAdmins: permissionKeys.some(
      (key) => key.includes("admins") && key.includes("manage")
    ),
    canSendMessages: permissionKeys.some(
      (key) => key.includes("messages") && key.includes("send")
    ),
    canManageChat: permissionKeys.some(
      (key) => key.includes("chat") && key.includes("manage")
    ),
  };
}

/**
 * Filter sidebar items based on user permissions
 */
function filterSidebarItems(
  items: SidebarItem[],
  permissions: Permission[]
): SidebarItem[] {
  const permissionKeys = permissions.map((p) => p);

  return items.filter((item) => {
    // If item has no required permissions, show it
    if (!item.requiredPermissions || item.requiredPermissions.length === 0) {
      return true;
    }

    // Check if user has any of the required permissions
    const hasPermission = item.requiredPermissions.some((reqPerm) =>
      permissionKeys.includes(reqPerm)
    );

    if (hasPermission) {
      // If item has children, filter them recursively
      if (item.children) {
        item.children = filterSidebarItems(item.children, permissions);
      }
      return true;
    }

    return false;
  });
}

/**
 * Recursively find the first accessible route path from sidebar items
 */
function findFirstAccessiblePath(items: SidebarItem[]): string | null {
  for (const item of items) {
    if (item.path && !item.children) {
      return item.path;
    }
    if (item.children && item.children.length > 0) {
      const childPath = findFirstAccessiblePath(item.children);
      if (childPath) return childPath;
    }
    // If item has both path and children, prefer the path
    if (item.path && item.children && item.children.length > 0) {
      return item.path;
    }
  }
  return null;
}

/**
 * Generate a dynamic role configuration based on role key and permissions
 */
export function generateDynamicRoleConfig(
  roleKey: string,
  permissions: Permission[]
): RoleConfig {
  const filteredSidebar = filterSidebarItems(SIDEBAR_ITEMS, permissions);
  const features = generateFeatures(permissions);

  return {
    role: roleKey,
    displayName:
      roleKey.charAt(0).toUpperCase() + roleKey.slice(1).toLowerCase(),
    defaultRoute: "/dashboard/home",
    theme: DEFAULT_THEME,
    sidebar: filteredSidebar,
    features,
    isStatic: false,
  };
}

/**
 * Check if a role has access to a specific route
 */
export function hasRouteAccess(
  route: string,
  permissions: Permission[]
): boolean {
  const permissionKeys = permissions.map((p) => p);

  // Find the sidebar item for this route
  const findRouteItem = (items: SidebarItem[]): SidebarItem | null => {
    for (const item of items) {
      if (item.path === route) {
        return item;
      }
      if (item.children) {
        const childItem = findRouteItem(item.children);
        if (childItem) return childItem;
      }
    }
    return null;
  };

  const routeItem = findRouteItem(SIDEBAR_ITEMS);
  if (!routeItem || !routeItem.requiredPermissions) {
    return true; // No specific permissions required
  }

  return routeItem.requiredPermissions.some((reqPerm) =>
    permissionKeys.includes(reqPerm)
  );
}

/**
 * Get the first accessible dashboard route for the user based on permissions
 */
export function getFirstAccessibleDashboardRoute(
  permissions: Permission[]
): string {
  const filteredSidebar = filterSidebarItems(SIDEBAR_ITEMS, permissions);
  const firstPath = findFirstAccessiblePath(filteredSidebar);
  // Fallback to /dashboard if nothing found
  return firstPath || "/dashboard";
}
