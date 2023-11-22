module.exports = {
  env: {
    node: true,
    jest: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        useTabs: false,
        semi: false,
        singleQuote: true,
        'react/prop-types': 'off',
        'react/display-name': 'off',
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
    quotes: [0, 'double'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'on',
  }
}
