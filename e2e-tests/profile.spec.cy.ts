import { OdinConfig } from "./config";
import { testWallet } from "./test-wallet";

describe("profile spec", () => {

  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.createSessionFromWallet(testWallet);
  });

  it("should update username", () => {
    const username = `name-user-${Math.floor(Math.random() * 1000)}`;
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile`);
    // toggle edit username
    cy.get('[data-testid="edit-username-button"]').click();
    // update username input and submit
    cy.get('input[name="username"]').clear().type(`${username}{enter}`);
    // check that username is updated
    cy.get('[data-testid="username-display"]').should("contain.text", username);
  });

  it("should visit created tokens page", () => {
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile?tab=created-tokens`);

  });

  it("should visit achievements page", () => {
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile?tab=achievements`);
  });

});
