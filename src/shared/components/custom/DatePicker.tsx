import { format, formatDate } from "date-fns";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";

export default function DatePicker({
  date,
  onSelect,
  placeholder,
  className,
  startMonth,
  endMonth,
  ...props
}: {
  date?: Date;
  onSelect?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  startMonth?: Date;
  endMonth?: Date;
}) {
  const defaultPlaceholder = "Pick a date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"lg"}
          className={cn(
            "w-[240px] rounded-md h-12 shadow-none px-4 py-0 justify-between text-start font-normal transition-colors duration-default border-input",
            !date && "text-muted-foreground",
            className
          )}
        >
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{placeholder || defaultPlaceholder}</span>
          )}
          <CalendarIcon className={cn("h-4 text-primary w-4", "me-2")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 min-w-fit" align={"center"}>
        <Button
          onClick={() => onSelect && onSelect(undefined)}
          variant={"ghost"}
          size={"lg"}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors duration-default"
        >
          Reset
        </Button>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            const formattedDate = date
              ? formatDate(date, "yyyy-MM-dd")
              : undefined;
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            onSelect &&
              onSelect(formattedDate ? new Date(formattedDate) : undefined);
          }}
          autoFocus
          startMonth={startMonth || new Date(1970, 11)}
          endMonth={endMonth}
          disabled={{
            before: startMonth || new Date(1970, 11),
            after: endMonth,
          }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
