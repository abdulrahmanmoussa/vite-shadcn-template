import { api } from "@/shared/hooks/apiInstance";

export const getProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    const mockToken =
      typeof window !== "undefined" && localStorage.getItem("token");
    if (!mockToken) {
      throw error;
    }
    return {
      data: {
        _id: "demo-user-1",
        name: "Demo User",
        username: "demo",
        email: "demo@example.com",
        phoneNumber: { number: "+000000000" },
        type: "demo",
        status: "active",
        isBlocked: { value: false },
        role: {
          _id: "role-admin",
          key: "admin",
          permissions: [
            { key: "dashboard.view", resource: "dashboard", action: "read" },
            { key: "users.view", resource: "users", action: "read" },
            { key: "users.edit", resource: "users", action: "write" },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
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
      },
    } as any;
  }
};
