export type DateTimeFormat =
  | "dateOnly"
  | "timeOnly"
  | "dateAndTime"
  | "dateShort"
  | "dateSlash"
  | "custom";

interface DateTimeDisplayProps {
  date: string | Date;
  format?: DateTimeFormat;
  className?: string;
  locale?: string;
  customOptions?: Intl.DateTimeFormatOptions;
  fallback?: string;
}

const formatOptions: Record<
  Exclude<DateTimeFormat, "custom">,
  Intl.DateTimeFormatOptions
> = {
  dateOnly: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  timeOnly: {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  },
  dateAndTime: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  },
  dateShort: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
  dateSlash: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  },
};

export function DateTimeDisplay({
  date,
  format = "dateAndTime",
  className,
  locale,
  customOptions,
  fallback = "Invalid Date",
}: DateTimeDisplayProps) {
  const dateObject = typeof date === "string" ? new Date(date) : date;

  if (!dateObject || isNaN(dateObject.getTime())) {
    console.log("dateObject", dateObject);
    return <span className={className}>{fallback}</span>;
  }

  const displayLocale = locale || "en-US";

  try {
    let formattedDate: string;

    // Handle special formats that need custom formatting
    if (format === "dateShort") {
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      formattedDate = `${year}-${month}-${day}`;
    } else if (format === "dateSlash") {
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      formattedDate = `${year}/${month}/${day}`;
    } else {
      // Use Intl.DateTimeFormat for other formats
      const options =
        format === "custom" && customOptions
          ? customOptions
          : formatOptions[
              format as Exclude<
                DateTimeFormat,
                "custom" | "dateShort" | "dateSlash"
              >
            ];

      formattedDate = dateObject.toLocaleDateString(displayLocale, options);
    }

    return <span className={className}>{formattedDate}</span>;
  } catch (error) {
    console.warn("Error formatting date:", error);
    return <span className={className}>{fallback}</span>;
  }
}
