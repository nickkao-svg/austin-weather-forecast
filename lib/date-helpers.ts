export function getCityToday(timezone: string): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
}

export function getCityTodayISO(timezone: string): string {
  return getCityToday(timezone).toISOString().split('T')[0];
}

// Legacy functions for backward compatibility
export function getChicagoToday(): Date {
  return getCityToday("America/Chicago");
}

export function getChicagoTodayISO(): string {
  return getCityTodayISO("America/Chicago");
}

export function getTenYearStartDate(timezone: string): string {
  const today = getCityToday(timezone);
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  return tenYearsAgo.toISOString().split('T')[0];
}

export function getYesterdayISO(timezone: string): string {
  const today = getCityToday(timezone);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}



export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function getMonthLabel(month: number): string {
  return MONTH_LABELS[month - 1];
}

export function getMonthFromDate(dateString: string): number {
  return new Date(dateString).getMonth() + 1;
}
