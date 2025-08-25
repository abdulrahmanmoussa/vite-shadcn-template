import React from "react";
import { cn } from "@/shared/lib/utils";
import LogoSvg from "/logo.svg";
import { Image } from "../ui/image";

interface LogoProps {
  variant?: "default" | "mini" | "full";
  className?: string;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Logo Component
 *
 * A reusable component for displaying the Cashmeout logo
 * with customizable size, color and variant.
 */
export function Logo({
  variant = "default",
  className,
  size = "md",
  style,
  onClick,
}: LogoProps) {
  // Map sizes to actual dimensions
  const sizeMap = {
    sm:
      variant === "mini"
        ? "w-6 h-4"
        : variant === "full"
        ? "w-60 h-14"
        : "w-20 h-6",
    md:
      variant === "mini"
        ? "w-8 h-6"
        : variant === "full"
        ? "w-80 h-20"
        : "w-32 h-10",
    lg:
      variant === "mini"
        ? "w-12 h-9"
        : variant === "full"
        ? "w-96 h-24"
        : "w-48 h-14",
  };

  if (variant === "mini") {
    return (
      <div className={cn(sizeMap[size], className)}>
        <Image
          src={LogoSvg}
          alt="Logo"
          className={cn(sizeMap[size], className)}
          style={style}
          onClick={onClick}
          imageClassName="object-cover"
        />
      </div>
    );
  }

  // Default or full logo
  return (
    <div className={cn(sizeMap[size], className)}>
      <Image
        src={LogoSvg}
        alt="Logo"
        className={cn(sizeMap[size], className)}
        style={style}
        onClick={onClick}
        imageClassName="object-cover"
      />
    </div>
  );
}
