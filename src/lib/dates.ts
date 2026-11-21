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

// Formatée au build : une date invalide fait échouer la génération.
export function formatDate(value: string, locale: Locale): string {
  const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
  const [year, month, day] = match
    ? [Number(match[1]), Number(match[2]), match[3] ? Number(match[3]) : 1]
    : [NaN, NaN, NaN];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    !match ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`date invalide : « ${value} »`);
  }
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: match[3] ? 'numeric' : undefined,
    timeZone: 'UTC',
  }).format(date);
}

// Jour du build, AAAA-MM-JJ : la date de mise à jour du site, jamais écrite à la main.
export const buildDate = new Date().toISOString().slice(0, 10);
