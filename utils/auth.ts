import { PublicKey } from '../canister/service.interface';
import { Delegation, DelegationChain } from '@dfinity/identity';

const asSignature = (signature: any): any => {
    const arrayBuffer = signature.buffer;
    const s = arrayBuffer;
    s.__signature__ = void 0;
    return s;
};
  
const asDerEncodedPublicKey = (publicKey: any) => {
    const arrayBuffer = publicKey.buffer;
    const pk = arrayBuffer;
    pk.__derEncodedPublicKey__ = void 0;
    return pk;
};

export const createDelegationChain = (signedDelegation: any, publicKey: PublicKey) => { 
    const delegations = [
        {
        delegation: new Delegation(
            signedDelegation.delegation.pubkey.buffer,
            signedDelegation.delegation.expiration,
            signedDelegation.delegation.targets[0]
        ),
        signature: asSignature(signedDelegation.signature),
        },
    ];
    return DelegationChain.fromDelegations(delegations, asDerEncodedPublicKey(publicKey));
};