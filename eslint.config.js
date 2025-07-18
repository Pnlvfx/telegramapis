import { goateslint } from '@goatjs/node-eslint';

export default goateslint({ ignores: ['dist'], tsconfigRootDir: import.meta.dirname });
