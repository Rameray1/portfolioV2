// Lu par astro.config.mjs : aucun import `astro:*` ici.
import type { satteri } from '@astrojs/markdown-satteri';
import { en, fr } from '../i18n/ui';

// Conventions d'écriture des fiches projet (`CONTENU.md` §6) :
// - une citation (`> …`) devient une note du commentateur ; si elle commence par `!`, `!?` ou
//   `!!`, ce symbole se place dans la marge ;
// - une image seule dans son paragraphe, avec un titre (`![alt](src "Légende")`), devient une
//   figure légendée.
interface Text {
  type: 'text';
  value: string;
}

interface Element {
  type: 'element';
  tagName: string;
  properties: Record<string, unknown>;
  children: Node[];
}

type Node = Text | Element | { type: string };

type HastPlugin = NonNullable<
  NonNullable<Parameters<typeof satteri>[0]>['hastPlugins']
>[number];

interface Context {
  fileURL: URL | undefined;
}

const meanings = {
  '!': 'eval.good',
  '!?': 'eval.bet',
  '!!': 'eval.brilliant',
} as const;

const element = (
  tagName: string,
  properties: Record<string, unknown>,
  children: Node[],
): Element => ({ type: 'element', tagName, properties, children });

const elements = (node: Element) =>
  node.children.filter((child): child is Element => child.type === 'element');

function dictionaryOf(ctx: Context): typeof fr | undefined {
  const path = ctx.fileURL?.pathname ?? '';
  if (!path.includes('/content/projects/')) return undefined;
  return path.includes('/content/projects/en/') ? en : fr;
}

function annotate(paragraph: Element, dictionary: typeof fr): Element {
  const [first, ...rest] = paragraph.children;
  const match =
    first?.type === 'text' && (first as Text).value.match(/^(!!|!\?|!)\s+/);
  if (!match) return paragraph;
  const symbol = match[1] as keyof typeof meanings;
  const colon = dictionary === fr ? ' : ' : ': ';
  return {
    ...paragraph,
    children: [
      element(
        'span',
        { className: ['note-mark'], dataEval: symbol, ariaHidden: 'true' },
        [{ type: 'text', value: symbol }],
      ),
      element('span', { className: ['visually-hidden'] }, [
        { type: 'text', value: dictionary[meanings[symbol]] + colon },
      ]),
      { type: 'text', value: (first as Text).value.slice(match[0].length) },
      ...rest,
    ],
  };
}

// Types hast écrits ici plutôt qu'importés de `@types/hast`, non déclaré dans le projet.
export const projectMarkdown = {
  name: 'project-markdown',
  element: [
    {
      filter: ['blockquote'],
      visit(node: Element, ctx: Context) {
        const dictionary = dictionaryOf(ctx);
        if (!dictionary) return;
        return element(
          'div',
          { className: ['note'] },
          elements(node).map((block, index) =>
            index === 0 && block.tagName === 'p'
              ? annotate(block, dictionary)
              : block,
          ),
        );
      },
    },
    {
      filter: ['p'],
      visit(node: Element, ctx: Context) {
        if (!dictionaryOf(ctx)) return;
        const [image, ...others] = elements(node);
        const caption = image?.properties.title;
        if (others.length > 0 || image?.tagName !== 'img' || !caption) return;
        const { title: _title, ...properties } = image.properties;
        return element('figure', {}, [
          { ...image, properties },
          element('figcaption', {}, [{ type: 'text', value: String(caption) }]),
        ]);
      },
    },
  ],
} as unknown as HastPlugin;
