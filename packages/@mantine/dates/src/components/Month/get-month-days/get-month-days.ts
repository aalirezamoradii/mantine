import dayjs from 'dayjs';
import { DayOfWeek } from '../../../types';
import { getEndOfWeek } from '../get-end-of-week/get-end-of-week';
import { getStartOfWeek } from '../get-start-of-week/get-start-of-week';

interface GetMonthDaysInput {
  month: Date;
  firstDayOfWeek: DayOfWeek | undefined;
  consistentWeeks: boolean | undefined;
  locale?: string;
}

export function getMonthDays(_props: GetMonthDaysInput): Date[][] {
  const { month, firstDayOfWeek = 1, consistentWeeks, locale } = _props;

  const startOfMonthJalali = (date: Date) => dayjs(date).startOf('month').set('hours', 0).toDate();

  const endOfMonthJalali = (date: Date) => dayjs(date).endOf('month').set('hours', 0).toDate();

  const currentMonth = month.getMonth();
  const startOfMonth = locale && locale === 'fa'
    ? startOfMonthJalali(month)
    : new Date(month.getFullYear(), currentMonth, 1);
  const endOfMonth = locale && locale === 'fa'
    ? endOfMonthJalali(month)
    : new Date(month.getFullYear(), month.getMonth() + 1, 0);

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
