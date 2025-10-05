import { Fragment, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OnboardingState = {
  dialCode?: string;
  phoneNumber?: string;
  identity?: string;
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const clampDate = (date: Date) => {
  const min = new Date(1940, 0, 1);
  const max = new Date();
  if (date < min) return min;
  if (date > max) return max;
  return date;
};

const getCalendarMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks: Array<Array<{ value: number; currentMonth: boolean }>> = [];
  let currentDay = 1 - firstWeekday;

  while (currentDay <= daysInMonth) {
    const week: Array<{ value: number; currentMonth: boolean }> = [];
    for (let i = 0; i < 7; i += 1) {
      const dayDate = new Date(year, month, currentDay);
      const inCurrentMonth = dayDate.getMonth() === month;
      week.push({ value: dayDate.getDate(), currentMonth: inCurrentMonth });
      currentDay += 1;
    }
    weeks.push(week);
  }

  return weeks;
};

export const BirthdaySelector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseState = (location.state as OnboardingState) ?? {};

  const [viewDate, setViewDate] = useState(() => new Date(1995, 6, 11));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const calendar = useMemo(() => getCalendarMatrix(year, month), [year, month]);

  const handleChangeMonth = (offset: number) => {
    const next = new Date(year, month + offset, 1);
    setViewDate(clampDate(next));
  };

  const handleSelectDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;
    const nextSelected = new Date(year, month, day);
    setSelectedDate(nextSelected);
  };

  const handleSkip = () => {
    navigate("/onboarding/passions", { replace: true, state: baseState });
  };

  const handleSave = () => {
    if (!selectedDate) return;
    navigate("/onboarding/passions", {
      replace: true,
      state: { ...baseState, birthday: selectedDate.toISOString() },
    });
  };

  const selectedDay = selectedDate?.getDate();
  const selectedMonth = selectedDate?.getMonth();
  const selectedYear = selectedDate?.getFullYear();

  return (
    <div className="flex min-h-screen w-full justify-center bg-white">
      <div className="flex w-full max-w-md flex-1 flex-col px-6 pb-16 pt-10">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] border border-[#EFEFF4] bg-white text-[#1F1F33] shadow-sm transition-colors hover:border-[#E94057] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94057]/40"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm font-semibold text-[#E94057]"
          >
            Skip
          </button>
        </div>

        <div className="flex-1">
          <div className="rounded-[32px] bg-white shadow-[0_25px_45px_rgba(17,17,17,0.08)]">
            <div className="flex flex-col items-center gap-5 px-8 pt-10 text-center">
              <div>
                <p className="text-5xl font-semibold text-[#1F1F33]">{year}</p>
                <p className="mt-1 text-base font-medium text-[#E94057]">{MONTHS[month]}</p>
              </div>
              <div className="flex items-center gap-8 text-[#E94057]">
                <button
                  type="button"
                  onClick={() => handleChangeMonth(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3D0D8] text-lg"
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <span className="text-sm font-semibold uppercase tracking-[0.4em] text-[#C3C4D1]">
                  {MONTHS[month].slice(0, 3)}
                </span>
                <button
                  type="button"
                  onClick={() => handleChangeMonth(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F3D0D8] text-lg"
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-6 px-8 pb-10">
              <div className="grid grid-cols-7 gap-y-4 text-center text-xs font-semibold uppercase tracking-wide text-[#C3C4D1]">
                {WEEK_DAYS.map((day, index) => (
                  <span key={`${day}-${index}`}>{day}</span>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-y-4 text-center text-lg font-medium">
                {calendar.map((week, weekIndex) => (
                  <Fragment key={`week-${weekIndex}`}>
                    {week.map(({ value, currentMonth }, dayIndex) => {
                      const isSelected =
                        selectedDay === value &&
                        selectedMonth === month &&
                        selectedYear === year &&
                        currentMonth;
                      return (
                        <button
                          key={`${weekIndex}-${dayIndex}-${value}`}
                          type="button"
                          disabled={!currentMonth}
                          onClick={() => handleSelectDay(value, currentMonth)}
                          className={cn(
                            "mx-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                            currentMonth ? "text-[#1F1F33]" : "text-[#D6D7E1]",
                            isSelected && "bg-[#E94057] text-white shadow-[0_8px_18px_rgba(233,64,87,0.3)]"
                          )}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!selectedDate}
            className={cn(
              "h-14 w-full rounded-[24px] bg-[#E94057] text-lg font-semibold text-white shadow-[0_18px_30px_rgba(233,64,87,0.35)] transition-transform duration-200",
              !selectedDate && "opacity-60"
            )}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

