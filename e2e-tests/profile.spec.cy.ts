import { OdinConfig } from "./config";
import { testWallet } from "./test-wallet";

describe("profile spec", () => {

  beforeEach(() => {
    cy.viewport("macbook-13");
    cy.createSessionFromWallet(testWallet);
  });

  it("should visit profile page", () => {
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile`);
    // Check that tokens tab is active
    cy.get('[data-profile-tab="tokens"]>.nav-item').should("have.class", "active");
  });

  it.skip("should update username", () => {
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
    // Check that created tokens tab is active
    cy.get('[data-profile-tab="created-tokens"]>.nav-item').should("have.class", "active");
  });

  it("should visit achievements page", () => {
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile?tab=achievements`);
    // Check that achievements tab is active
    cy.get('[data-profile-tab="achievements"]>.nav-item').should("have.class", "active");
  });

  it("should visit activity page", () => {
    // Visit profile page
    cy.visit(`${OdinConfig.pageUrl}/profile?tab=activity`);
    // Check that activity tab is active
    cy.get('[data-profile-tab="activity"]>.nav-item').should("have.class", "active");
  });

});
