import { createIdentity } from "../auth-utils";

Cypress.Commands.add("createIdentitySession", (username: string) => {
  cy.session(
    username,
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
        cy.window()
          .its("localStorage.connection_provider")
          .should("be.a", "string");
      },
    }
  );
});

describe("template spec", () => {
  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.createIdentitySession(
      "seat civil cargo question coral long crop flavor travel win symptom start"
    );
  });
  it("visits the app", () => {
    cy.visit("http://localhost:5173");
  });
  it("visits the profile page", () => {
    cy.visit("http://localhost:5173/profile");
    cy.get('[data-testid="edit-username-button"]').click();
    cy.get('input[name="username"]').clear().type("Cypress User");

  });
});
