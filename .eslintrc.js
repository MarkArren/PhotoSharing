module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['react'],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],

        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'jsx-quotes': [2, 'prefer-single'],

        'jsx-a11y/label-has-associated-control': ['error', {
            required: {
                some: ['nesting', 'id'],
            },
        }],

        // Development
        'no-console': 'off',
        'no-unused-vars': 'off',
    },
};
