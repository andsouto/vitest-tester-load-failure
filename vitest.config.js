import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

/**
 * Answers the first request whose URL contains FAIL_PATTERN with a 500, once,
 * standing in for a request the browser loses on its way to the dev server.
 */
function failOnce(pattern) {
  let failed = false;

  return {
    name: 'fail-once',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (pattern && !failed && req.url?.includes(pattern)) {
          failed = true;
          console.error(`[fail-once] 500 for ${req.url}`);
          res.statusCode = 500;
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [failOnce(process.env.FAIL_PATTERN)],
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: 'chromium' }],
      provider: playwright(),
    },
  },
});
