export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: {
                module: 'commonjs'
            }
        }],
        "^.+\\.js$": ["ts-jest", {
            tsconfig: {
                module: 'commonjs'
            }
        }]
    },
    testRegex: "(/__tests__/.*\\.(test|spec))\\.ts$",
    testPathIgnorePatterns: ["/src/", "/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    collectCoverage: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

