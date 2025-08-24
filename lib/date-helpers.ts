export function getChicagoToday(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }));
}

export function getChicagoTodayISO(): string {
  return getChicagoToday().toISOString().split('T')[0];
}

export function getTenYearStartDate(): string {
  const today = getChicagoToday();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  return tenYearsAgo.toISOString().split('T')[0];
}

export function getYesterdayISO(): string {
  const today = getChicagoToday();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MONTH_EMOJIS = [
  '❄️', '💝', '🌸', '🌷', '🌺', '🌻',
  '🌞', '🏖️', '🍂', '🎃', '🦃', '🎄'
];

export function getMonthLabel(month: number): string {
  return MONTH_LABELS[month - 1];
}

export function getMonthEmoji(month: number): string {
  return MONTH_EMOJIS[month - 1];
}

export function getMonthFromDate(dateString: string): number {
  return new Date(dateString).getMonth() + 1;
}
