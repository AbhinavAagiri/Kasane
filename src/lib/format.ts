import type { Trip } from '@/data/types';

const dateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

export const formatDate = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
};

export const formatDateRange = (start: string, end: string) => {
  if (!start || !end) return 'Dates not set';
  return `${formatDate(start)} – ${formatDate(end)}`;
};

export const formatDayDate = (startDate: string, index: number) => {
  const date = new Date(`${startDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + index);
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  }).format(date);
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);

export const tripCost = (trip: Pick<Trip, 'days'>) =>
  trip.days.reduce(
    (total, day) =>
      total + day.activities.reduce((dayTotal, activity) => dayTotal + (activity.cost ?? 0), 0),
    0,
  );

export const pluralize = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;

export const readingTime = (minutes: number) => `${minutes} min read`;
