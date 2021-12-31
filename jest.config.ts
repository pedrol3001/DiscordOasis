import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: false,
  coverageReporters: [['html-spa', { subdir: './spa' }]],
};

export default config;
