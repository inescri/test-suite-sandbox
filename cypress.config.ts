import { defineConfig } from "cypress";
import { createIdentity } from "./auth-utils";

export default defineConfig({
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    setupNodeEvents(on, config) {
    
      return config;
    },
  },
});
