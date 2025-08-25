import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useRBAC, useRoleSidebar } from "@/shared/providers/RBACProvider";
import { MoreHorizontal } from "lucide-react";
import { Link, useLocation } from "react-router";

function DashboardSidebar() {
  const { isMobile } = useSidebar();
  const { canAccess } = useRBAC();
  const sidebarItems = useRoleSidebar();

  const { pathname } = useLocation();

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Filter sidebar items based on permissions
  const filterSidebarItems = (items: typeof sidebarItems) => {
    return items.filter((item) => {
      if (!item.requiredPermissions) return true;
      return canAccess(item.requiredPermissions);
    });
  };

  const filteredSidebarItems = filterSidebarItems(sidebarItems);

  return (
    <Sidebar side={"left"} className="bg-card border-r-0">
      <SidebarContent className="gap-8 bg-card border-none py-4">
        <div className="p-4 px-8">
          <Link to={`/dashboard`} className="z-10">
            <img src="/logo.svg" alt="logo" />
          </Link>
        </div>
        <SidebarMenu className="px-4">
          {filteredSidebarItems.map((link, index) => (
            <SidebarMenuItem key={index}>
              {link.children && link.children.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className={`data-[state=open]:bg-sidebar-accent h-12 data-[state=open]:text-sidebar-accent-foreground w-full text-left flex items-center justify-between ${
                        isActive(link.path)
                          ? `bg-secondary font-bold text-primary hover:bg-secondary`
                          : ``
                      }`}
                    >
                      <div className="flex items-center gap-2 h-12 w-full">
                        <div
                          className={`flex items-center justify-center w-8 h-8 mr-1 ${
                            isActive(link.path) ? "bg-secondary" : ""
                          }`}
                        >
                          <link.icon className="h-6 w-6" />
                        </div>
                        <span className="text-base">{link.label}</span>
                        <MoreHorizontal className="ml-auto h-4 w-4" />
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                    className="min-w-56 rounded-lg"
                  >
                    {link.children
                      .filter((child) => {
                        if (!child.requiredPermissions) return true;
                        return canAccess(child.requiredPermissions);
                      })
                      .map((child, childIdx) => (
                        <DropdownMenuItem
                          asChild
                          key={childIdx}
                          className="cursor-pointer"
                        >
                          <Link
                            to={child.path}
                            className={`w-full ${
                              isActive(child.path)
                                ? "bg-muted font-semibold "
                                : ""
                            }`}
                          >
                            <div className="flex items-center  w-full">
                              <div className="flex items-center justify-center w-8 h-8 mr-1">
                                <child.icon className="h-6 w-6" />
                              </div>
                              <span className="text-base">{child.label}</span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <SidebarMenuButton
                  asChild
                  className={` w-full text-left flex items-center justify-start ${
                    isActive(link.path)
                      ? `bg-secondary font-bold text-primary hover:bg-secondary`
                      : ``
                  }`}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center h-12 w-full ${isActive(
                      link.path
                    )}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 mr-1 ${
                        isActive(link.path) ? "bg-secondary" : ""
                      }`}
                    >
                      <link.icon className="h-6 w-6" />
                    </div>
                    <span className="text-base">{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="flex items-center w-full gap-3 px-4 mt-10 border-t pt-4">
          {/* <div className="flex-shrink-0">
            <img src="/icons/sharia-icon.svg" alt="sharia-icon" />
          </div> */}
          {/* <div className="text-xs text-muted-foreground">
            <p>Sharia Approved</p>
          </div> */}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export default DashboardSidebar;
