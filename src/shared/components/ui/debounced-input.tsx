import lodash from "lodash";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "./input";

const { debounce } = lodash;

interface DebouncedInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  className?: string;
  debounceTime?: number;
  type?: string;
  value?: string | number | readonly string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const DebouncedInput = React.forwardRef<HTMLInputElement, DebouncedInputProps>(
  (
    { className, value, onChange, debounceTime = 500, type = "text", ...props },
    ref
  ) => {
    const [inputValue, setInputValue] =
      useState<DebouncedInputProps["value"]>(value);

    const debouncedOnChange = useMemo(
      () =>
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(event);
          }
        }, debounceTime),
      [onChange, debounceTime]
    );

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      return () => {
        debouncedOnChange.cancel();
      };
    }, [debouncedOnChange]);

    return (
      <Input
        type={type}
        className={cn("", className)}
        ref={ref}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          debouncedOnChange(e);
        }}
        aria-label={props["aria-label"] || "Debounced Input"}
        {...props}
      />
    );
  }
);

DebouncedInput.displayName = "DebouncedInput";

export { DebouncedInput };
