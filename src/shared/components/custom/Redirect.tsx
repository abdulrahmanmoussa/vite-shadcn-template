"use client";

import * as React from "react";
import { Link } from "react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface RedirectProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /**
   * The URL to redirect to
   */
  href: string;
  /**
   * Whether the link should open in a new tab
   * @default true
   */
  external?: boolean;
  /**
   * The size of the redirect component
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /**
   * The label for the link that will be read by screen readers
   */
  label?: string;
  /**
   * Display text next to the icon
   */
  text?: string;
  /**
   * Show an icon alongside the text
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom classes for the icon
   */
  iconClassName?: string;
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional tooltip text to show on hover
   */
  tooltip?: string;
  /**
   * Color for the SVG paths (icon)
   * @default "#181C1F"
   */
  pathColor?: string;
  /**
   * State data to pass to the route
   */
  state?: any;
}

/**
 * A Redirect component for navigating to internal or external links
 */
export function Redirect({
  className,
  href,
  external = true,
  size = "md",
  label,
  text,
  showIcon = true,
  iconClassName,
  disabled = false,
  tooltip,
  pathColor = "#181C1F",
  state,
  ...props
}: RedirectProps) {
  const ariaLabel = label || (text ? undefined : "Open Link");

  const linkComponent = (
    <Link
      to={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-md border",
        pathColor ? `border-[${pathColor}]` : `border`,
        "p-2 text-foreground transition-all",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        size === "sm" && "text-sm",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      aria-label={ariaLabel}
      state={state}
      {...props}
    >
      {text && <span>{text}</span>}
      {showIcon && (
        <svg
          fontSize={size === "sm" ? 16 : size === "md" ? 20 : 24}
          className={cn("shrink-0", iconClassName)}
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.4"
            d="M3.41667 18.9998H17.5833C17.9167 18.9998 18.25 18.7498 18.25 18.3332C18.25 17.9165 18 17.6665 17.5833 17.6665H3.41667C3.08333 17.6665 2.75 17.9165 2.75 18.3332C2.75 18.7498 3.08333 18.9998 3.41667 18.9998Z"
            fill={pathColor}
          />
          <path
            d="M4.66667 15.1667C4.83333 15.1667 5 15.0833 5.08333 15L16.75 3.33333C17 3.08333 17 2.75 16.75 2.5C16.5 2.25 16.0833 2.25 15.8333 2.5L4.16667 14.1667C3.91667 14.4167 3.91667 14.8333 4.16667 15.0833C4.33333 15.1667 4.5 15.1667 4.66667 15.1667Z"
            fill={pathColor}
          />
          <path
            d="M16.3333 12.0833C16.6667 12.0833 17 11.8333 17 11.4167V2.91667C17 2.58333 16.75 2.25 16.3333 2.25H7.75C7.41667 2.25 7.08333 2.5 7.08333 2.91667C7.08333 3.33333 7.33333 3.58333 7.75 3.58333H15.6667V11.5C15.6667 11.8333 16 12.0833 16.3333 12.0833Z"
            fill={pathColor}
          />
        </svg>
      )}
    </Link>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkComponent}</TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return linkComponent;
}
