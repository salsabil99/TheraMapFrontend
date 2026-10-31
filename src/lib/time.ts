export type PartOfDay = 'morning' | 'afternoon' | 'evening';

export function partOfDay(date = new Date()): PartOfDay {
  const h = date.getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}
