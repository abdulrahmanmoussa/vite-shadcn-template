import { Loader } from "@/shared/components/custom/Loader";
import type React from "react";
import DashboardLayout from "./DashboardLayout";
import logo from "/logo.svg";

function DashboardLoader(
  props: Omit<React.ComponentProps<typeof DashboardLayout>, "children">
) {
  return (
    <DashboardLayout {...props}>
      <div className="flex flex-col items-center justify-center gap-4 py-4 ">
        <img src={logo} alt="logo" className="w-32 h-fit mx-auto " />
        <Loader />
      </div>
    </DashboardLayout>
  );
}

export default DashboardLoader;
