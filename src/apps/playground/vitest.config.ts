
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: -1,
    onConsoleLog(message, type) {
      console.log(message);
    }
  },
})
