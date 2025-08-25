import DashboardLayout from "./DashboardLayout";
import { AlertTriangle } from "lucide-react";

export function NotAllowedPage() {
  return (
    <DashboardLayout className="flex-1">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md ">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold ">Access Denied</h1>
          </div>
          <div className="text-center space-y-4 mt-2">
            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your
              administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
