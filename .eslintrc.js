module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        'import/prefer-default-export': 'off',
        trailingComma: 'none',
        quoteProps: 'as-needed',
        bracketSpacing: true,
        arrowParens: 'avoid',
        'no-duplicate-variable': [true, 'check-parameters'],
        'no-var-keyword': true,
        endOfLine: 'lf'
      }
    ],
    'no-debugger': 'warn',
    quotes: [0, 'double']
  }
}
