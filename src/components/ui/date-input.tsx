import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function DateInput({
  name,
  value,
  onChange,
  placeholder = "Select date",
  error = false,
  className = "",
}: DateInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value) {
      const date = new Date(value + "T00:00:00");
      setSelectedDate(date);
    } else {
      setSelectedDate(undefined);
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const syntheticEvent = {
        target: {
          name,
          value: formattedDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
      setOpen(false);
    }
  };

  const displayValue = value && selectedDate ? format(selectedDate, "MMM dd, yyyy") : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full px-4 py-3 pr-10 bg-background border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all cursor-pointer text-left",
            error ? "border-red-500 focus:border-red-500" : "border-primary/50 focus:border-primary",
            !displayValue && "text-gray-500",
            className
          )}
        >
          <span className={displayValue ? "text-white" : "text-gray-500"}>
            {displayValue || placeholder}
          </span>
          <CalendarIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={20}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <style>{`
          .rdp-day_selected,
          .rdp-day_selected[aria-selected="true"] {
            background-color: #FFEE00 !important;
            background: #FFEE00 !important;
            color: #1F2233 !important;
            border: 2px solid #FFEE00 !important;
            border-radius: 0.375rem !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .rdp-day_today {
            background-color: #FFEE00 !important;
            background: #FFEE00 !important;
            color: #1F2233 !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          .rdp-day:focus,
          .rdp-day:focus-visible {
            outline: 2px solid #FFEE00 !important;
            outline-offset: 0 !important;
            border-color: #FFEE00 !important;
          }
          .rdp button {
            border-color: transparent !important;
          }
          .rdp button:focus,
          .rdp button:focus-visible {
            outline-color: #FFEE00 !important;
            border-color: #FFEE00 !important;
          }
          @media (max-width: 640px) {
            .rdp {
              font-size: 0.75rem;
              width: 100%;
              max-width: 100%;
            }
            .rdp-month {
              width: 100%;
              max-width: 100%;
            }
            .rdp-table {
              width: 100%;
              max-width: 100%;
            }
            .rdp-day,
            .rdp-day_selected,
            .rdp-day_today {
              height: 1.75rem !important;
              width: 1.75rem !important;
              font-size: 0.75rem !important;
              min-width: 1.75rem !important;
            }
            .rdp-head_cell {
              height: 1.75rem !important;
              width: 1.75rem !important;
              min-width: 1.75rem !important;
              font-size: 0.7rem !important;
            }
            .rdp-cell {
              height: 1.75rem !important;
              width: 1.75rem !important;
              min-width: 1.75rem !important;
            }
          }
        `}</style>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="p-2 sm:p-3"
          classNames={{
            months: "flex flex-col",
            month: "space-y-2 sm:space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-xs sm:text-sm font-medium text-white",
            nav: "space-x-1 flex items-center",
            nav_button: "h-6 w-6 sm:h-7 sm:w-7 bg-transparent border border-primary/50 rounded text-white p-0 opacity-70 hover:opacity-100 hover:border-primary transition-all text-xs sm:text-base",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1 max-w-full",
            head_row: "flex w-full",
            head_cell: "text-gray-400 rounded-md w-7 h-7 sm:w-9 sm:h-9 font-normal text-[0.7rem] sm:text-[0.8rem] flex items-center justify-center flex-1 min-w-0",
            row: "flex w-full mt-1 sm:mt-2",
            cell: "h-7 w-7 sm:h-9 sm:w-9 text-center text-xs sm:text-sm p-0 relative flex-1 min-w-0 [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            day: "h-7 w-7 sm:h-9 sm:w-9 p-0 font-normal text-white hover:bg-primary/20 hover:text-white rounded-md transition-all text-xs sm:text-sm w-full max-w-full",
            day_selected: "bg-primary text-dark hover:bg-primary hover:text-dark focus:bg-primary focus:text-dark font-semibold border-2 border-primary",
            day_today: "bg-primary text-dark font-semibold",
            day_outside: "text-gray-500 opacity-50",
            day_disabled: "text-gray-600 opacity-30 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-white",
            day_hidden: "invisible",
          }}
          styles={{
            nav_button: {
              color: "var(--primary)",
            },
            day_selected: {
              backgroundColor: "var(--primary)",
              color: "var(--text-dark)",
              border: "2px solid var(--primary)",
            },
            day_today: {
              backgroundColor: "var(--primary)",
              color: "var(--text-dark)",
            },
            day: {
              color: "white",
            },
          }}
          components={{
            Chevron: ({ orientation }) => {
              const Icon = orientation === "left" ? (
                <span className="text-primary text-lg">‹</span>
              ) : (
                <span className="text-primary text-lg">›</span>
              );
              return Icon;
            },
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
