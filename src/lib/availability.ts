import { campaign } from '../data/campaign';
import type { Locale } from '../i18n/ui';
import { useTranslations } from '../i18n/utils';
import { formatStart } from './dates';

export interface Availability {
  status: string;
  detail: string;
}

export function getAvailability(locale: Locale): Availability | undefined {
  const { visible, status, start, place } = campaign.availability;
  if (!visible) return undefined;
  const t = useTranslations(locale);
  const from = start
    ? `${t('availability.from')} ${formatStart(start, locale)}, `
    : '';
  return { status: status[locale], detail: `${from}${place[locale]}` };
}
