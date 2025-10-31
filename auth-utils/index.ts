import { prepare } from "./core/prepare";
import { login } from "./core/login";
import { createSampleWallet } from "./sampe-wallet";
import { authenticateCallback } from "./core/auth-callback";

export const createIdentity = async () => {


  const wallet = await createSampleWallet();
  const result = await prepare(wallet.address);

  const signature = await wallet.signMessage(result.message);

  const { identity, sessionIdentity} = await login({
    address: wallet.address,
    message: result.message,
    signature: signature,
    publicKey: wallet.publicKey,
    signatureType: "Bip322Simple",
  });

  const token = await authenticateCallback(identity);

  return {
    identity,
    wallet,
    sessionIdentity,
    token
  };
};
