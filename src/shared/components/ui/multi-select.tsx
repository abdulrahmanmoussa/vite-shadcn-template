"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  fixed?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface MultiSelectProps {
  value?: string[];
  defaultValue?: string[];
  options: Option[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  popoverClassName?: string;
  triggerClassName?: string;
  itemClassName?: string;
  maxDisplayItems?: number;
  maxLabelLength?: number;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      value,
      defaultValue,
      options,
      onChange,
      placeholder = "Select options",
      disabled = false,
      // className,
      popoverClassName,
      triggerClassName,
      itemClassName,
      maxDisplayItems = 2,
      maxLabelLength = 24,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
      value || defaultValue || []
    );
    const [open, setOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const [width, setWidth] = React.useState<number | undefined>(undefined);

    // Update internal state when value prop changes
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValues(value);
      }
    }, [value]);

    const handleSelect = (optionValue: string, isChecked: boolean) => {
      const newSelectedValues = isChecked
        ? [...selectedValues, optionValue]
        : selectedValues.filter((v) => v !== optionValue);

      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    const selectedLabels = options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.label);

    // Format display text to avoid overflow with many selections
    const getDisplayText = () => {
      if (selectedLabels.length === 0) {
        return placeholder;
      }

      // Function to truncate long text values
      const truncateText = (text: string) => {
        return text.length > maxLabelLength
          ? `${text.substring(0, maxLabelLength)}...`
          : text;
      };

      if (selectedLabels.length <= maxDisplayItems) {
        return selectedLabels.map((label) => truncateText(label)).join(", ");
      }

      const visibleLabels = selectedLabels.slice(0, maxDisplayItems);
      const remainingCount = selectedLabels.length - maxDisplayItems;
      return `${visibleLabels
        .map((label) => truncateText(label))
        .join(", ")}, +${remainingCount} more`;
    };

    // Update width when popover opens
    React.useEffect(() => {
      if (open && triggerRef.current) {
        setWidth(triggerRef.current.getBoundingClientRect().width);
      }
    }, [open]);

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger
          ref={(node) => {
            // Handle both the forwarded ref and our local ref
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            triggerRef.current = node;
          }}
          disabled={disabled}
          className={cn(
            "border-input w-full flex items-center justify-between gap-2 rounded-full border bg-white px-3 py-2 text-sm shadow-xs transition-all duration-200 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-12",
            // open && "border-primary",
            triggerClassName
          )}
        >
          <span className="truncate text-left">{getDisplayText()}</span>
          <ChevronDownIcon className="size-4 opacity-50 flex-shrink-0" />
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="center"
            sideOffset={4}
            style={{ width: width ? `${width}px` : "auto" }}
            className={cn(
              "z-50 overflow-hidden rounded-md border border-border bg-white shadow-md",
              "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05),0px_4px_6px_-2px_rgba(0,0,0,0.05),0px_10px_15px_-3px_rgba(0,0,0,0.1)]",
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              popoverClassName
            )}
          >
            <div className="flex flex-col">
              {options.map((option, index) => (
                <React.Fragment key={option.value}>
                  {index > 0 && <div className="h-[1px] w-full bg-[#F3F4F6]" />}
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-border/30 transition-all duration-200",
                      "animate-in fade-in-50 slide-in-from-top-1",
                      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                      { "animation-delay-100": index === 1 },
                      { "animation-delay-150": index === 2 },
                      { "animation-delay-200": index === 3 },
                      { "animation-delay-300": index > 3 },
                      itemClassName
                    )}
                    onClick={() => {
                      if (!option.disabled) {
                        handleSelect(
                          option.value,
                          !selectedValues.includes(option.value)
                        );
                      }
                    }}
                  >
                    <CheckboxPrimitive.Root
                      checked={selectedValues.includes(option.value)}
                      disabled={option.disabled}
                      onCheckedChange={(checked) =>
                        handleSelect(option.value, checked === true)
                      }
                      className={cn(
                        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                    >
                      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current transition-none">
                        <CheckIcon className="size-3.5" />
                      </CheckboxPrimitive.Indicator>
                    </CheckboxPrimitive.Root>
                    <span className="text-sm font-medium text-[#374151]">
                      {option.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
