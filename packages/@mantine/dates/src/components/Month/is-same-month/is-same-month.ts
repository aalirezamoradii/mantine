import dayjs from 'dayjs';

export function isSameMonth(date: Date, comparison: Date, locale?: string) {
    function year(yearDate: any) {
        return dayjs(yearDate).year();
    }

    function month(monthDate: any) {
        return dayjs(monthDate).month();
    }

    return locale && locale === 'fa'
      ? year(date) === year(comparison) &&
        month(date) === month(comparison)
      : date.getFullYear() === comparison.getFullYear() &&
        date.getMonth() === comparison.getMonth();
}
