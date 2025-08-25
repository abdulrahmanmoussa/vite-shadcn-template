import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/shared/components/ui/sidebar";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Moon } from "lucide-react";

export function DashboardHeader({
  title = "Dashboard",
  className,
}: {
  title?: string;
  className?: string;
}) {
  const { open, isMobile } = useSidebar();
  const isOpen = open && !isMobile;

  const handleToggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <motion.header
      animate={{
        left: isOpen ? "256px" : "0",
        width: isOpen ? "calc(100% - 256px)" : "100%",
      }}
      initial={{
        left: isOpen ? "256px" : "0",
        width: isOpen ? "calc(100% - 256px)" : "100%",
      }}
      transition={{ duration: 0.2, ease: "linear" }}
      className={cn(
        "fixed top-0 h-[60px] shrink-0 z-50 bg-background items-center gap-2 border-b",
        className
      )}
    >
      <div className="flex  h-full  w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleToggleTheme}>
            <Moon className="w-6 h-6" />
          </Button>
          {/* <div className="flex items-center gap-2 hover:bg-secondary rounded-md p-2">
            <h2 className="text-sm">Dark Mode</h2>
            <ThemeToggle />
          </div> */}
          {/* Quick Search */}
          {/* <div className="relative">
            <Input
              type="text"
              placeholder="Quick Search... "
              className="relative  rounded-md bg-secondary hover:bg-secondary focus:outline-none cursor-pointer border-none min-w-[200px] py-1"
              aria-label="Quick Search"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <kbd className="rounded-md bg-muted px-1 py-0.5 text-xs font-semibold text-muted-foreground">
                Ctrl+K
              </kbd>
            </span>
          </div> */}

          {/* <button
            ref={buttonRef}
            className="relative p-2 rounded-full hover:bg-secondary focus:outline-none"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsDropdown
            open={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            anchorRef={buttonRef}
          />
          <LogoutButton /> */}
        </div>
      </div>
    </motion.header>
  );
}
