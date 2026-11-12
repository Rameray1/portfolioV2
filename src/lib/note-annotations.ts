// Lu par astro.config.mjs : aucun import `astro:*` ici.
import type { satteri } from '@astrojs/markdown-satteri';
import { en, fr } from '../i18n/ui';

// Convention d'écriture des fiches projet : une citation Markdown (`> …`) devient une note du
// commentateur. Si elle commence par `!`, `!?` ou `!!`, ce symbole se place dans la marge.
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

const meanings = {
  '!': 'eval.good',
  '!?': 'eval.bet',
  '!!': 'eval.brilliant',
} as const;

const span = (properties: Record<string, unknown>, value: string): Element => ({
  type: 'element',
  tagName: 'span',
  properties,
  children: [{ type: 'text', value }],
});

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
      span(
        { className: ['note-mark'], dataEval: symbol, ariaHidden: 'true' },
        symbol,
      ),
      span(
        { className: ['visually-hidden'] },
        dictionary[meanings[symbol]] + colon,
      ),
      { type: 'text', value: (first as Text).value.slice(match[0].length) },
      ...rest,
    ],
  };
}

// Types hast écrits ici plutôt qu'importés de `@types/hast`, non déclaré dans le projet.
export const noteAnnotations = {
  name: 'note-annotations',
  element: {
    filter: ['blockquote'],
    visit(node: Element, ctx: { fileURL: URL | undefined }) {
      const path = ctx.fileURL?.pathname ?? '';
      if (!path.includes('/content/projects/')) return;
      const dictionary = path.includes('/content/projects/en/') ? en : fr;
      const blocks = node.children.filter(
        (child): child is Element => child.type === 'element',
      );
      return {
        type: 'element',
        tagName: 'div',
        properties: { className: ['note'] },
        children: blocks.map((block, index) =>
          index === 0 && block.tagName === 'p'
            ? annotate(block, dictionary)
            : block,
        ),
      } satisfies Element;
    },
  },
} as unknown as HastPlugin;
