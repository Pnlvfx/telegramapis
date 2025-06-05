import eslint from '@eslint/js';
import globals from 'globals';
import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import rules from '@goatjs/eslint/node/rules';

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  eslint.configs.recommended,
  unicorn.configs.all,
  sonarjs.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { rules },
  {
    files: ['src/**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
