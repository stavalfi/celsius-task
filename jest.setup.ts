import '@testing-library/jest-dom/extend-expect'

jest.setTimeout(process.env.CI ? 50 * 1000 : 2000 * 1000)

// eslint-disable-next-line no-process-env
process.env.IS_TEST_MODE = 'true'
