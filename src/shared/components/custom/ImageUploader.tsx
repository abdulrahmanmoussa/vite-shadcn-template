import { cn } from "@/shared/lib/utils";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Image } from "../ui/image";

export type ImageUploaderProps = {
  value?: string | File;
  onChange: (file: File | string | null) => void;
  label?: string;
  accept?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  maxSize?: number;
};

export function ImageUploader({
  value,
  onChange,
  label = "Image",
  accept = "image/jpeg,image/png,image/gif,image/webp,image/jpg",
  className = "",
  disabled = false,
  maxSize = 10 * 1024 * 1024,
  placeholder = "Drop an image here or click to browse",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      if (typeof value === "string") {
        setPreview(value);
      } else if (value instanceof File) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreview(ev.target?.result as string);
        };
        reader.readAsDataURL(value);
      }
    } else {
      setPreview(undefined);
    }
  }, [value]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (file && !disabled && file.size <= maxSize) {
      processFile(file);
    } else {
      toast.error(
        `File size exceeds the maximum allowed size of ${
          maxSize / 1024 / 1024
        }MB`
      );
    }
  }

  function processFile(file: File) {
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds the maximum allowed size of ${
          maxSize / 1024 / 1024
        }MB`
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setPreview(undefined);
    onChange(null);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  }

  function handleClick() {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className={cn("space-y-2 w-fit", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative group cursor-pointer transition-all duration-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <Image
              className="h-32 w-32 rounded-md object-cover"
              imageClassName="object-cover aspect-square"
              src={preview}
            />

            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors duration-200 shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col items-center justify-center h-32 px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all duration-200",
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500",
              "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            <div className="flex flex-col items-center justify-center">
              <div
                className={cn(
                  "mb-2 transition-colors duration-200",
                  isDragging ? "text-blue-500" : "text-gray-400"
                )}
              >
                {isDragging ? (
                  <Upload className="h-8 w-8" />
                ) : (
                  <ImageIcon className="h-8 w-8" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {isDragging ? "Drop to upload" : placeholder}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
