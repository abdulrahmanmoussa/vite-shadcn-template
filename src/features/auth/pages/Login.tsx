import { useAuthStore } from "@/features/auth/auth.store";
import DashboardLayout from "@/shared/components/layout/DashboardLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";

export default function Login() {
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState("demo");

  function handleLogin() {
    localStorage.setItem("token", "demo-token");
    setUser({
      _id: "demo-user-1",
      name: username || "Demo User",
      username: username || "demo",
      email: "demo@example.com",
      phoneNumber: { number: "+000000000" },
      type: "demo",
      status: "active",
      isBlocked: { value: false },
      role: {
        _id: "role-admin",
        key: "admin",
        permissions: [
          {
            key: "dashboard.view",
            resource: "dashboard",
            action: "read",
          } as any,
          { key: "users.view", resource: "users", action: "read" } as any,
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() as any,
      isOnline: true,
      isAvaliableToInstantProjects: true,
      pricePerHour: 0,
      isVerified: true,
      isDeleted: false,
      isFollow: false,
      followCount: { followers: 0, following: 0 },
      address: { type: "Point", coordinates: [0, 0] },
      categories: [],
      acceptedProjectsCounter: 0,
      profileViews: 0,
      about: "Demo profile",
      rate: { ratersCounter: 0, totalRates: 0 },
    } as any);
    window.location.href = "/";
  }

  return (
    // <DashboardLayout title="Login">
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Demo Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="w-full" onClick={handleLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
    // </DashboardLayout>
  );
}
