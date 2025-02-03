import { eslint } from '@siberiacancode/eslint';

export default eslint({
  typescript: true,
  ignores: ['src/types/*'],
  rules: {
    'ts/no-use-before-define': ['off'],
    'no-useless-catch': ['off'],
    'perfectionist/sort-imports': ['warn'],
    'node/prefer-global/buffer': ['error', 'always'],
    'node/prefer-global/process': ['error', 'always']
  }
});
