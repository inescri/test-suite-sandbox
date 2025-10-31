import { SampleWallet, signBip322MessageWithKey } from "../auth-utils/sampe-wallet";

const WALLET = {
  address: "bc1pu6rvj2qaljtfzjp5n70k4gesdpcxk4xr8v3xpkjyu3nhvx8m2ucq0xll9c",
  publicKey: "7b055c3fbc12b3321df60a3073bd57449bfcb19ee1507e43ff8cca98a8350108",
  privateKey:
    "69c7ad3ba34f2bf2692eaa516b7372889b09f77b3fb363979ab6dff6e2be4435",
  mnemonic:
    "elbow cube access muscle spike power jaguar biology fee burger sea sibling",
  derivationPath: "m/86'/0'/0'/0/0",
};

export const testWallet: SampleWallet = {
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