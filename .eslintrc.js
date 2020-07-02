module.exports = {
    env: {
        browser: true,
        es2020: true,
    },
    plugins: ['prettier'],
    extends: [
        'airbnb-base',
        'eslint:recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module',
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'off',
    },
};
