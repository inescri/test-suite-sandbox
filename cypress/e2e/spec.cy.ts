import { DelegationChain } from "@dfinity/identity";
import { createIdentity } from "../../auth-utils";

Cypress.Commands.add("createIdentitySession", (username: string) => {
  cy.session(
    `user-${username}`,
    () => {
      cy.then(() => createIdentity()).then(
        ({ identity, wallet, sessionIdentity }) => {
          cy.log(
            `Created identity for user: ${username}:${identity
              .getPrincipal()
              .toText()}`
          );
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
      },
    }
  );
});

describe("template spec", () => {
  it("visits the app", () => {
    cy.createIdentitySession("user-test");
    cy.visit("http://localhost:5173/profile");
  });
});
