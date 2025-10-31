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
import { createIdentity } from "../../auth-utils";
import { SampleWallet } from "../../auth-utils/sampe-wallet";
import "./commands";

// Augment the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to create a user identity and cache the session.
       * @example cy.createSessionFromWallet(wallet)
       */
      createSessionFromWallet(wallet: SampleWallet): Chainable<void>;
    }
  }
}


Cypress.Commands.add("createSessionFromWallet", (wallet: SampleWallet) => {
  cy.session(
    wallet.address,
    () => {
      cy.then(() => createIdentity(wallet)).then(
        ({ identity, wallet, sessionIdentity }) => {
          window.localStorage.setItem(
            "siwbIdentity",
            JSON.stringify({
              address: wallet.address,
              sessionIdentity: sessionIdentity.toJSON(),
              delegationChain: identity.getDelegation().toJSON(),
              providerKey: "xverse",
            })
          );
          window.localStorage.setItem("connection_provider", "siwb");
          window.localStorage.setItem("siwb_login_method", "external-app");
        }
      );
    },
    {
      validate() {
        //Check that the token is still in local storage
        cy.window().its("localStorage.siwbIdentity").should("be.a", "string");
        cy.window()
          .its("localStorage.siwb_login_method")
          .should("be.a", "string");
        cy.window()
          .its("localStorage.connection_provider")
          .should("be.a", "string");
      },
    }
  );
});