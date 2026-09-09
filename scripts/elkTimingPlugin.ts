/**
 * DEV-ONLY, TEMPORARY (2026-09-09). Delete with `src/explore/graph-core/elkTiming.ts`.
 *
 * Collects how long ELK actually takes, to settle empirically whether the
 * "Computing layout…" overlay is justified. The browser cannot write files, so
 * the canvas POSTs each timing here and this appends it to a JSONL log.
 *
 * `apply: 'serve'` — never part of a production build.
 */

import { appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

const LOG = resolve(process.cwd(), 'temp/elk-timings.jsonl');

export function elkTimingPlugin(): Plugin {
  return {
    name: 'elk-timing',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__elk-timing', (req, res) => {
        if (req.method !== 'POST') { res.statusCode = 405; res.end(); return; }
        let body = '';
        req.on('data', (c: Buffer) => { body += c; });
        req.on('end', () => {
          void appendFile(LOG, `${body.trim()}\n`)
            .catch((e: unknown) => server.config.logger.error(`elk-timing: ${String(e)}`));
          res.statusCode = 204;
          res.end();
        });
      });
      server.config.logger.info(`elk-timing: logging to ${LOG}`);
    },
  };
}
