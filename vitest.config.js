import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    poolOptions: {
      threads: {
        execArgv: ["--experimental-network-imports", "--no-warnings=ExperimentalWarning"],
      },
    },
    server: {
      deps: {
        external: [/^https:/],
      },
    },
  },
});
