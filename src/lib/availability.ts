import { campaign } from '../data/campaign';
import type { Locale } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { formatStart } from './dates';

export interface Availability {
  status: string;
  start?: string;
  place: string;
  // Début et modalités en une phrase, pour le bandeau et le CV.
  detail: string;
}

export function getAvailability(locale: Locale): Availability | undefined {
  const { visible, status, start, place } = campaign.availability;
  if (!visible) return undefined;
  const t = useTranslations(locale);
  const date = start && formatStart(start, locale);
  return {
    status: status[locale],
    start: date,
    place: place[locale],
    detail: `${date ? `${t('availability.from')} ${date}, ` : ''}${place[locale]}`,
  };
}
