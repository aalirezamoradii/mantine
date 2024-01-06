export function isSameMonth(date: Date, comparison: Date, locale?: string) {
    function year(yearDate: any) {
        return parseInt(
            new Intl.DateTimeFormat('en-US-u-ca-persian', { year: 'numeric' }).format(yearDate),
            10
        );
    }

    function month(monthDate: any) {
        return parseInt(
            new Intl.DateTimeFormat('en-US-u-ca-persian', { month: 'numeric' }).format(monthDate),
            10
        );
    }

    return locale && locale === 'fa'
      ? year(date) === year(comparison) &&
        month(date) === month(comparison)
      : date.getFullYear() === comparison.getFullYear() &&
        date.getMonth() === comparison.getMonth();
}
