module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
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
    'jsx-quotes': [2, 'prefer-single'],
    'react/react-in-jsx-scope': 0,
    'react/display-name': 0,
    'react/prop-types': 0
  }
}
