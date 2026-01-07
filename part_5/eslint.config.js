
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import cypressPlugin from 'eslint-plugin-cypress'
import vitest from '@vitest/eslint-plugin'

export default [
    { ignores: ['dist', 'cypress.config.js', 'coverage'] },
    {
        files: ['**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        settings: { react: { version: 'detect' } },
        plugins: {
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
        ...js.configs.recommended.rules,
        ...react.configs.recommended.rules,
        ...react.configs['jsx-runtime'].rules,
        ...reactHooks.configs.recommended.rules,
        'react/jsx-no-target-blank': 'off',
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
        'react/prop-types': 0,
        },
    },
    {
        files: ['cypress/**/*.js'],
        plugins: {
            cypress: cypressPlugin,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...cypressPlugin.configs.globals.languageOptions.globals,
            },
        },
        rules: {
            ...cypressPlugin.configs.recommended.rules,
        },
    },
    {
        files: ['**/*.test.{js,jsx}'],
        plugins: {
            vitest
        },
        rules: {
            ...vitest.configs.recommended.rules,
        },
        languageOptions: {
            globals: {
                ...vitest.environments.env.globals,
            },
        },
    }
]
