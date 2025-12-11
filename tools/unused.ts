import { findUnusedExports } from '@goatjs/ts-unused-exports';
import path from 'node:path';

const unused = await findUnusedExports({
  ignoreFiles: ['telegram.ts', 'eslint.config.js', 'jest.config.ts'],
  ignoreFolders: [path.join('src', 'types')],
});

if (unused) {
  throw new Error(`The following exports are unused, add them on the ignore or remove the exports to continue.\n${JSON.stringify(unused)}`);
}
