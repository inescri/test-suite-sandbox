import { login } from "./core/login";
import { prepare } from "./core/prepare";
import { createSampleWallet } from "./sampe-wallet";


(async () => {

    const wallet = await createSampleWallet();
    const result = await prepare(wallet.address);
    
    const signature = await wallet.signMessage(result.message);

    const loginResult = await login({
        address: wallet.address,
        message: result.message,
        signature: signature,
        publicKey: wallet.publicKey,
        signatureType: 'Bip322Simple',
    });

    console.log(loginResult.getPrincipal().toString());
    console.log(loginResult.getDelegation().toJSON())
})();