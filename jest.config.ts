import type { Config } from 'jest';

export default {
    preset: 'jest-preset-angular',
    setupFiles: ['<rootDir>/setup-jest.ts'],
    testEnvironment: 'jsdom',
    testMatch: ['**/*.spec.ts'],
    transform: {
        '^.+\\.(ts|js|html|svg)$': [
            'jest-preset-angular',
            {
                tsconfig: '<rootDir>/tsconfig.spec.json',
                stringifyContentPathRegex: '\\.(html|svg)$',
            },
        ],
    },
    moduleNameMapper: {
        '^@core/(.*)$': '<rootDir>/src/app/core/$1',
        '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
        '^@features/(.*)$': '<rootDir>/src/app/features/$1',
        '^@layout/(.*)$': '<rootDir>/src/app/layout/$1',
        '^@env/(.*)$': '<rootDir>/src/environments/$1',
    },
    collectCoverageFrom: [
        'src/app/**/*.ts',
        '!src/app/**/*.spec.ts',
        '!src/app/**/*.routes.ts',
        '!src/main.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text-summary', 'lcov'],
} satisfies Config;