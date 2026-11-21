import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import type { AstroIntegration } from 'astro';
import { locales } from '../i18n/ui.ts';

const run = promisify(execFile);
const FILES = locales.map((locale) => `cv-${locale}`);

async function compile(dir: string, name: string) {
  const tex = join(dir, `${name}.tex`);
  const log = join(dir, `${name}.log`);
  try {
    await run('tectonic', [
      '--keep-logs',
      '--chatter',
      'minimal',
      '--outdir',
      dir,
      tex,
    ]);
  } catch (error) {
    const { code, stderr } = error as { code?: string; stderr?: string };
    if (code === 'ENOENT') {
      throw new Error(
        'tectonic introuvable : brew install tectonic (ou sh scripts/install-tectonic.sh)',
      );
    }
    throw new Error(
      `${name}.pdf : la compilation LaTeX a échoué\n${(stderr ?? '').trim().slice(-1500)}`,
    );
  }
  // XeTeX retire sans erreur un caractère absent de la police : le journal le signale.
  const missing = (await readFile(log, 'utf8'))
    .split('\n')
    .filter((line) => line.startsWith('Missing character'));
  if (missing.length > 0) {
    throw new Error(
      `${name}.pdf : caractère absent de la police\n${missing.join('\n')}`,
    );
  }
  if (!existsSync(join(dir, `${name}.pdf`))) {
    throw new Error(`${name}.pdf : fichier non produit`);
  }
  await Promise.all([rm(tex), rm(log)]);
}

export function cvPdf(): AstroIntegration {
  return {
    name: 'cv-pdf',
    hooks: {
      // Sans ce relais, le serveur de dev renverrait une 404 en HTML, enregistrée en « .pdf ».
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          const name = FILES.find((file) => req.url === `/${file}.pdf`);
          if (!name) return next();
          const dir = await mkdtemp(join(tmpdir(), 'cv-pdf-'));
          try {
            const source = await fetch(
              `http://${req.headers.host}/${name}.tex`,
            );
            if (!source.ok)
              throw new Error(`${name}.tex : HTTP ${source.status}`);
            await writeFile(join(dir, `${name}.tex`), await source.text());
            await compile(dir, name);
            res.setHeader('Content-Type', 'application/pdf');
            res.end(await readFile(join(dir, `${name}.pdf`)));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(String(error));
          } finally {
            await rm(dir, { recursive: true, force: true });
          }
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        for (const name of FILES) {
          await compile(out, name);
          logger.info(`${name}.pdf`);
        }
      },
    },
  };
}
