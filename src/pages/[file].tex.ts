import type { APIRoute, GetStaticPaths } from 'astro';
import { locales, type Locale } from '../i18n/ui';
import { getCv } from '../lib/cv';
import { renderCvLatex } from '../lib/cv-latex';

// Source du PDF : l'intégration cv-pdf compile ces fichiers puis les retire de dist/.
export const getStaticPaths = (() =>
  locales.map((locale) => ({
    params: { file: `cv-${locale}` },
    props: { locale },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<{ locale: Locale }> = async ({ props }) =>
  new Response(renderCvLatex(await getCv(props.locale)), {
    headers: { 'Content-Type': 'application/x-tex; charset=utf-8' },
  });
