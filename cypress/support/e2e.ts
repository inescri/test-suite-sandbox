// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Augment the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to create a user identity and cache the session.
       * @example cy.createIdentity('user@example.com', 'password123')
       */
      createIdentitySession(username: string): Chainable<void>;
    }
  }
}
