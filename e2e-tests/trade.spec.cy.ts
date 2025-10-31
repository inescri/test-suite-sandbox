import { OdinConfig } from "./config";
import { testWallet } from "./test-wallet";

describe("buy spec", () => {
  beforeEach(() => {
    cy.createSessionFromWallet(testWallet);
  });

  it("should visit token page", () => {
    // Visit token page
    cy.viewport("macbook-13");
    cy.visit(`${OdinConfig.pageUrl}/token/2jjj`);
    cy.get('[data-testid="token-input-field"]')
      .should("be.visible")
      .type("0.01");
    cy.get('[data-trade-confirm="buy"]').should(
      "contain.text",
      "Insufficient Funds"
    );
  });

  it("should visit the token page with sell action", () => {
    cy.viewport("macbook-13");
    // Visit token page with sell action
    cy.visit(`${OdinConfig.pageUrl}/token/2jjj?action=sell`);
    cy.get('[data-testid="token-input-field"]')
      .should("be.visible")
      .type("600");
    cy.get('[data-trade-confirm="sell"]').should(
      "contain.text",
      "Insufficient Funds"
    );
  });

  it("should show trade dialog on mobile", () => {
    cy.viewport("iphone-x");
    cy.visit(`${OdinConfig.pageUrl}/token/2jjj`);
    cy.get('[data-testid="mobile-trade-button"]').click();
    cy.get('[data-testid="trade-dialog"]').should("be.visible");
    cy.get('[data-testid="token-input-field"]')
      .should("be.visible")
      .type(".01");
    cy.get('[data-trade-confirm="buy"]').should(
      "contain.text",
      "Insufficient Funds"
    );
  });
});
