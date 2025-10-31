import { prepare } from "./core/prepare";
import { login } from "./core/login";
import { createSampleWallet, generateSampleMnemonic, SampleWallet } from "./sampe-wallet";

export const createIdentity = async (wallet?: SampleWallet) => {
  if (!wallet) {
    wallet = await createSampleWallet();
  }
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