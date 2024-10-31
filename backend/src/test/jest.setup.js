//src / test / jest.setup.js
import { jest, beforeAll, afterAll } from '@jest/globals'
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterAll(() => {
  console.error.mockRestore()
})
