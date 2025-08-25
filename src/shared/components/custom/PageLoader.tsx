import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import { Loader } from "./Loader";
import LogoSvg from "/logo.svg";

export function PageLoader({
  className = "min-h-screen flex flex-col items-center justify-center bg-background",
}: {
  className?: string;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="mb-8 animate-pulse">
        {/* Inline SVG logo for best performance */}
        <img src={LogoSvg} alt="logo" width={100} height={100} />
      </div>
      <Loader />
    </motion.div>
  );
}
