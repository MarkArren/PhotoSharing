module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'google',
        'airbnb',
    ],
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-console': 'off',
        'no-unused-vars': 'off',
    },
};
