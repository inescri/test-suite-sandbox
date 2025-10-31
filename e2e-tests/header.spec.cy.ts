import { OdinConfig } from "./config";
import { testWallet } from "./test-wallet";

describe("profile spec", () => {
  beforeEach(() => {
    cy.createSessionFromWallet(testWallet);
  });

  it("should display header correctly", () => {
    cy.viewport("iphone-x");
    cy.visit(`${OdinConfig.pageUrl}/faq`);
    cy.get('[data-testid="desktop-navigation"]').should("not.be.visible");
    cy.get('[data-testid="mobile-navigation"]').should("be.visible");
    cy.get('[data-gtm="click-username"]').should("not.be.visible");
    cy.get('[data-gtm="btc-balance-button"]').should("be.visible").click();
    cy.get('[data-testid="wallet-dialog"]').should("be.visible");
  });

  it("should display header correctly on desktop", () => {
    cy.viewport("macbook-13");
    cy.visit(`${OdinConfig.pageUrl}/faq`);
    cy.get('[data-testid="desktop-navigation"]').should("be.visible");
    cy.get('[data-testid="mobile-navigation"]').should("not.be.visible");
    cy.get('[data-gtm="click-username"]').should("be.visible");
    cy.get('[data-gtm="btc-balance-button"]').should("be.visible").click();
    cy.get('[data-testid="wallet-dialog"]').should("be.visible");
  });
});
