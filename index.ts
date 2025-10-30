import {  prepare } from "./core/prepare";
import { login } from "./core/login";
import { createSampleWallet } from "./sampe-wallet";
import { authenticateCallback } from "./core/auth-callback";

(async () => {

    const wallet = await createSampleWallet();
    const result = await prepare(wallet.address);

    const signature = await wallet.signMessage(result.message);

    const identity = await login({
        address: wallet.address,
        message: result.message,
        signature: signature,
        publicKey: wallet.publicKey,
        signatureType: 'Bip322Simple',
    });

    const token = await authenticateCallback(identity);

    console.log({
        token: token,
        principal: identity.getPrincipal().toString(),
        identity: identity.getDelegation().toJSON(),
    })
})();