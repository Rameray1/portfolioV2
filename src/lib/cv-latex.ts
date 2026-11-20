import template from '../cv/template.tex?raw';
import { useTranslations } from '../i18n/utils';
import { shortUrl, type Cv, type CvEntry } from './cv';

const MARKER = '%% CONTENT %%';

const special: Record<string, string> = {
  '\\': '\\textbackslash{}',
  '{': '\\{',
  '}': '\\}',
  $: '\\$',
  '&': '\\&',
  '#': '\\#',
  _: '\\_',
  '%': '\\%',
  '^': '\\textasciicircum{}',
  '~': '\\textasciitilde{}',
  '\u00a0': '~',
  '\u202f': '\\,',
  // Les lettres en exposant du français (1ʳᵉ, 3ᵉ) manquent à Pagella.
  ʳ: '\\textsuperscript{r}',
  ᵉ: '\\textsuperscript{e}',
};

export function latex(text: string): string {
  return text.replace(/[\\{}$&#_%^~\u00a0\u202fʳᵉ]/g, (char) => special[char]);
}

function href(url: string, text: string): string {
  return `\\href{${url.replace(/[%#\\{}]/g, (char) => `\\${char}`)}}{${latex(text)}}`;
}

function section(title: string, body: string[]): string[] {
  return [`\\section{\\textbf{${latex(title)}}}`, '\\vspace{-0.4mm}', ...body];
}

function items(lines: string[]): string[] {
  return lines.length === 0
    ? []
    : [
        '\\resumeItemListStart',
        ...lines.map((line) => `  \\item ${latex(line)}`),
        '\\resumeItemListEnd',
      ];
}

function timeline(entries: CvEntry[]): string[] {
  return [
    '\\resumeSubHeadingListStart',
    ...entries.flatMap((entry) => [
      `\\resumeSubheading{${latex(entry.title)}}{}{${latex(entry.place)}}{${latex(`${entry.from} – ${entry.to}`)}}`,
      ...items([entry.detail, ...entry.highlights]),
    ]),
    '\\resumeSubHeadingListEnd',
    '\\vspace{-6mm}',
  ];
}

function skillLines(rows: { label: string; value: string }[]): string[] {
  return [
    '\\resumeHeadingSkillStart',
    ...rows.map(
      (row) => ` \\resumeSubItem{${latex(row.label)}}{${latex(row.value)}}`,
    ),
    '\\resumeHeadingSkillEnd',
  ];
}

export function renderCvLatex(cv: Cv): string {
  if (!template.includes(MARKER)) {
    throw new Error(`src/cv/template.tex : marqueur « ${MARKER} » absent`);
  }
  const t = useTranslations(cv.locale);
  // Deux-points composés à la française : espace fine insécable avant.
  const colon = cv.locale === 'fr' ? ' : ' : ': ';
  const { profile } = cv;

  const body = [
    `\\hypersetup{pdftitle={${latex(`${cv.name} – ${t('cv.title')}`)}}, pdfauthor={${latex(cv.name)}}, pdflang={${cv.locale}}}`,
    `\\begin{center}{\\Huge\\textbf{${latex(cv.name)}}}\\end{center}`,
    '\\vspace{-6mm}',
    `\\begin{center}\\large{${latex(cv.title)}}\\end{center}`,
    '\\vspace{-5mm}',
    `\\begin{center}\\small{${href(`mailto:${cv.email}`, cv.email)} | ${latex(cv.city)}}\\end{center}`,
    '\\vspace{-5mm}',
    // Seul le site a besoin d'un libellé : LinkedIn et GitHub se lisent dans leur adresse.
    `\\begin{center}\\small{${cv.links
      .map(
        (link) =>
          `${link.kind === 'website' ? latex(`${t('cv.portfolio')}${colon}`) : ''}${href(link.href, link.label)}`,
      )
      .join(' | ')}}\\end{center}`,
    '\\vspace{-4mm}',
    `\\section{\\textbf{${latex(t('cv.profile'))}}}`,
    '\\vspace{1mm}',
    `\\small{${latex(profile.pitch)}${
      profile.availability
        ? ` \\textbf{${latex(profile.availability.status)}}. ${latex(profile.availability.detail)}.`
        : ''
    }}`,
    '\\vspace{-2mm}',
  ];

  if (cv.experience.length > 0) {
    body.push(...section(t('background.experience'), timeline(cv.experience)));
  }
  if (cv.education.length > 0) {
    body.push(...section(t('background.education'), timeline(cv.education)));
  }
  if (cv.projects.length > 0) {
    body.push(
      ...section(t('cv.projects'), [
        '\\resumeSubHeadingListStart',
        ...cv.projects.flatMap((project) => [
          `\\resumeProject{${latex(project.title)}}{${latex(project.tech.join(', '))}}{${project.year}}{${href(project.url, shortUrl(project.url))}}`,
          ...items([project.summary]),
        ]),
        '\\resumeSubHeadingListEnd',
        '\\vspace{-6mm}',
      ]),
    );
  }
  if (cv.skills.length > 0) {
    body.push(
      ...section(
        t('cv.skills'),
        skillLines(
          cv.skills.map((group) => ({
            label: `${group.domain}${colon}`,
            value: group.names.join(', '),
          })),
        ),
      ),
      '\\vspace{-2mm}',
    );
  }
  body.push(
    ...section(
      t('cv.languages'),
      skillLines([
        {
          label: '',
          value: cv.languages
            .map((language) => `${language.name} (${language.level})`)
            .join(', '),
        },
      ]),
    ),
  );

  return template.replace(MARKER, body.join('\n'));
}
