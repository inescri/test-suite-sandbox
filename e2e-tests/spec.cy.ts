import { createIdentity } from "../auth-utils";
import {
  SampleWallet,
  signBip322MessageWithKey,
} from "../auth-utils/sampe-wallet";

const WALLET = {
  address: "bc1pu6rvj2qaljtfzjp5n70k4gesdpcxk4xr8v3xpkjyu3nhvx8m2ucq0xll9c",
  publicKey: "7b055c3fbc12b3321df60a3073bd57449bfcb19ee1507e43ff8cca98a8350108",
  privateKey:
    "69c7ad3ba34f2bf2692eaa516b7372889b09f77b3fb363979ab6dff6e2be4435",
  mnemonic:
    "elbow cube access muscle spike power jaguar biology fee burger sea sibling",
  derivationPath: "m/86'/0'/0'/0/0",
};

const walletObject: SampleWallet = {
  address: WALLET.address,
  publicKey: WALLET.publicKey,
  privateKey: WALLET.privateKey,
  mnemonic: WALLET.mnemonic,
  derivationPath: WALLET.derivationPath,
  signMessage: async (message: string) => {
    return signBip322MessageWithKey({
      message,
      privateKeyHex: WALLET.privateKey,
    });
  },
};

Cypress.Commands.add("createIdentitySession", (wallet: SampleWallet) => {
  cy.session(
    wallet.address,
    () => {
      cy.then(() => createIdentity(wallet)).then(
        ({ identity, wallet, sessionIdentity }) => {
          cy.log(
            `Created identity for user: ${wallet.address}:${identity
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
    cy.createIdentitySession(walletObject);
  });
  it("should update username", () => {
    const username = `name-user-${Math.floor(Math.random() * 1000)}`;
    cy.visit("http://localhost:5173/profile");
    cy.get('[data-testid="edit-username-button"]').click();
    cy.get('input[name="username"]').clear().type(`${username}{enter}`);
    console.log(cy.get('[data-testid="username-display"]').children);
    cy.get('[data-testid="username-display"]').should("contain.text", username);
  });
});
