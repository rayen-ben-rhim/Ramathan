import {
  differenceInDays,
  parseISO,
  startOfDay,
} from "date-fns";

const RAMADAN_DAYS = 30;

export type RamadanState =
  | { day: number }
  | { before: number }
  | { after: true }
  | null;

/**
 * Returns the current Ramadan state based on VITE_RAMADAN_FIRST_DAY (YYYY-MM-DD).
 * Uses the user's local date so the day rolls over at local midnight.
 */
export function getRamadanDay(): RamadanState {
  const raw = import.meta.env.VITE_RAMADAN_FIRST_DAY;
  if (typeof raw !== "string" || !raw.trim()) {
    return null;
  }

  let startDate: Date;
  try {
    startDate = startOfDay(parseISO(raw));
    if (Number.isNaN(startDate.getTime())) {
      return null;
    }
  } catch {
    return null;
  }

  const today = startOfDay(new Date());
  const daysSinceStart = differenceInDays(today, startDate);

  if (daysSinceStart < 0) {
    return { before: -daysSinceStart };
  }

  if (daysSinceStart < RAMADAN_DAYS) {
    return { day: daysSinceStart + 1 };
  }

  return { after: true };
}
