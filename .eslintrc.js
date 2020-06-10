module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    project: __dirname + '/tsconfig.json',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // The rules we'd like to enable:

    // It's quite tricky to set up this right, and our code doesn't follow
    // strict naming conventions right now.
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   { selector: 'variableLike', format: ['camelCase', 'PascalCase'] }
    // ],

    // We'd like these overrides to go:

    // The reasoning here is good enough: https://eslint.org/docs/rules/guard-for-in.
    'guard-for-in': 'off',
    // I'm not sure this rule doesn't give false-positives, but we should review
    // our regex expressions anyway.
    'no-useless-escape': 'off',
    // Obvious evil imo, but unfortunately there are a lot of such methods in our code. :(
    '@typescript-eslint/explicit-function-return-type': 'off',
    // I doubt we'll ever make it go, but let me just dream about it. :D
    '@typescript-eslint/no-explicit-any': 'off',
    // There's really no need to write like this: `let myBool: boolean = true;`.
    '@typescript-eslint/no-inferrable-types': 'off',
    // Suggested alternative is optional chaining and introducing an unwrap/expect function
    // that would throw a runtime exception. `unwrap(optional: T | null | undefined): T`
    '@typescript-eslint/no-non-null-assertion': 'off',
    // Unused variables potentially indicate a bug. If they are left unused on purpose,
    // the possibles solutions are either suppressing the linter where needed
    // or underscoring a variable.
    '@typescript-eslint/no-unused-vars': 'off',

    // The overrides that are supposedly good:

    'arrow-body-style': 'off',
    curly: 'error',
    'dot-notation': 'error',
    eqeqeq: ['error', 'smart'],
    'id-blacklist': ['error', 'String', 'Boolean', 'Undefined'],
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-console': 'error',
    'no-constant-condition': ['error', {checkLoops: false}],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-eval': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-wrappers': 'error',
    // Watch https://github.com/typescript-eslint/typescript-eslint/pull/1898.
    'no-shadow': [
      'error',
      {
        hoist: 'all',
      },
    ],
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unused-expressions': 'error',
    'no-prototype-builtins': 'off',
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    radix: 'error',
    'spaced-comment': 'error',
    '@typescript-eslint/camelcase': 'off',
    // Is done by prettier.
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'no-public',
      },
    ],
    '@typescript-eslint/indent': 'off',
    // Allows to explicitly discard the promise with `void` keyword.
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-floating-promises': ['error', {ignoreVoid: true}],
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
  },
};
