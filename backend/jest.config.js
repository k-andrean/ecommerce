// jest.config.cjs
export default  {
  testEnvironment: 'node',
  // transform: {
  //   '^.+\\.[t|j]sx?$': 'babel-jest',
  // },
  transform : {},
  setupFilesAfterEnv: ['./jest.setup.js'], 
  moduleFileExtensions: ['js', 'mjs'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: 'coverage',
};