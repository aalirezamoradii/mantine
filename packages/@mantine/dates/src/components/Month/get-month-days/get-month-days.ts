import {DayOfWeek} from '../../../types';
import {shiftTimezone} from '../../../utils';
import {getEndOfWeek} from '../get-end-of-week/get-end-of-week';
import {getStartOfWeek} from '../get-start-of-week/get-start-of-week';

interface GetMonthDaysInput {
  month: Date;
  firstDayOfWeek: DayOfWeek | undefined;
  timezone: string | undefined;
  consistentWeeks: boolean | undefined;
  locale?: string;
}

export function getMonthDays({
                               month,
                               firstDayOfWeek = 1,
                               timezone = undefined,
                               consistentWeeks,
                               locale
                             }: GetMonthDaysInput): Date[][] {
  const currentMonth = month.getMonth();

  const startOfMonthJalali: any = (date: any) => {
    const dayDateJalali = parseInt(
      new Intl.DateTimeFormat('en-US-u-ca-persian', {day: 'numeric'}).format(date),
      10
    );
    const d = dayDateJalali - 1;
    return date.setDate(date.getDate() - d);
  };

  const endOfMonthJalali: any = (date: any) => {
    const daysMonthJalali = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    const dayDateJalali = parseInt(
      new Intl.DateTimeFormat('en-US-u-ca-persian', {day: 'numeric'}).format(date),
      10
    );

    const monthDateJalali = parseInt(
      new Intl.DateTimeFormat('en-US-u-ca-persian', {
        month: 'numeric',
      }).format(date),
      10
    );
    const d = daysMonthJalali[monthDateJalali] - dayDateJalali;
    return date.setDate(date.getDate() + d);
  };

  const startOfMonth = locale && locale === 'fa'
    ? startOfMonthJalali(month)
    : shiftTimezone(
      'add',
      new Date(month.getFullYear(), currentMonth, 1),
      timezone
    );
  const endOfMonth = locale && locale === 'fa'
    ? endOfMonthJalali(month)
    : shiftTimezone(
      'add',
      new Date(month.getFullYear(), month.getMonth() + 1, 0),
      timezone
    );
  const endDate = getEndOfWeek(endOfMonth, firstDayOfWeek);
  const date = getStartOfWeek(startOfMonth, firstDayOfWeek);
  const weeks: Date[][] = [];

  while (date <= endDate) {
    const days: Date[] = [];

    for (let i = 0; i < 7; i += 1) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    weeks.push(days);
  }

  if (consistentWeeks && weeks.length < 6) {
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek[lastWeek.length - 1];
    const nextDay = new Date(lastDay);
    nextDay.setDate(nextDay.getDate() + 1);

    while (weeks.length < 6) {
      const days: Date[] = [];

      for (let i = 0; i < 7; i += 1) {
        days.push(new Date(nextDay));
        nextDay.setDate(nextDay.getDate() + 1);
      }

      weeks.push(days);
    }
  }

  return weeks;
}
