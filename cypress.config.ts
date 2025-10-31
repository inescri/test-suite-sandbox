import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 20_000,
  e2e: {
    specPattern: "e2e-tests/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      return config;
    },
  },
});
