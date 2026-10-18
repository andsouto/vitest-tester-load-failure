# A tester module that fails to load waits out Vitest's iframe timeout

In Vitest's browser mode, when one of the tester's own modules fails to load, the run waits the whole 60 s iframe timeout and then fails without saying what failed. A load failure in the test file's own imports fails the file at once instead.

```sh
npm install
npx playwright install --only-shell chromium
npx vitest run                                           # passes
FAIL_PATTERN=chai- npx vitest run                        # waits 60 s: "did not become ready"
FAIL_PATTERN=vitest_n_vite_module-runner npx vitest run  # waits 60 s
FAIL_PATTERN=__vitest_browser__/tester- npx vitest run   # waits 60 s
FAIL_PATTERN=helper.js npx vitest run                    # fails at once: "Failed to import test file"
```

`vitest.config.js` has a Vite plugin that answers the first request whose URL contains `FAIL_PATTERN` with a 500, once. It stands in for a request the browser loses, as Chromium does with `net::ERR_NETWORK_CHANGED` when a Docker container starts.
