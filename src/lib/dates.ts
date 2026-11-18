import type { Locale } from '../i18n/ui';

// `value` est un mois `AAAA-MM`, déjà validé par le schéma des collections.
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
