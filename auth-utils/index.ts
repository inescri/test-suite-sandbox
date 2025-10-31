import { prepare } from "./core/prepare";
import { login } from "./core/login";
import { createSampleWallet, generateSampleMnemonic } from "./sampe-wallet";

export const createIdentity = async (mnemonic?: string) => {
  const wallet = await createSampleWallet(mnemonic);
  const result = await prepare(wallet.address);
  const signature = await wallet.signMessage(result.message);
  const { identity, sessionIdentity } = await login({
    address: wallet.address,
    message: result.message,
    signature: signature,
    publicKey: wallet.publicKey,
    signatureType: "Bip322Simple",
  });

  return {
    identity,
    wallet,
    sessionIdentity,
  };
};
