/**
 * SIWB Canister Types
 */

import { PublicKey } from '../canister/ic_siwb_provider';


export type SIWBAddress = string;
export type SIWBSignature = string; // Base64 encoded signature string
export type SIWBPublicKey = string; // Hex encoded public key string
export type SIWBSessionKey = Uint8Array;

export type SignatureType = 'Bip322Simple';

export interface SIWBLoginDetails {
  user_canister_pubkey: PublicKey;
  expiration: bigint;
}

export type SIWBPrepareLoginResponse =
  | {
      Ok: string;
    }
  | {
      Err: string;
    };

export type SIWBLoginResponse =
  | {
      Ok: SIWBLoginDetails;
    }
  | {
      Err: string;
    };

export interface SIWBDelegation {
  signature: SIWBSignature;
  delegation: {
    pubkey: SIWBPublicKey;
    expiration: bigint;
    targets?: Array<import('@dfinity/principal').Principal>;
  };
}

export type SIWBGetDelegationResponse =
  | {
      Ok: SIWBDelegation;
    }
  | {
      Err: string;
    };

export type SIWBSignMessageType = {
  Bip322Simple: null;
};

/**
 * SIWB Actor Interface
 */
export interface SIWBActor {
  siwb_prepare_login: (address: SIWBAddress) => Promise<SIWBPrepareLoginResponse>;
  siwb_login: (
    signature: SIWBSignature,
    address: SIWBAddress,
    publicKey: SIWBPublicKey,
    sessionKey: SIWBSessionKey,
    signMessageType: SIWBSignMessageType
  ) => Promise<SIWBLoginResponse>;
  siwb_get_delegation: (
    address: SIWBAddress,
    sessionKey: SIWBSessionKey,
    expiration: bigint
  ) => Promise<SIWBGetDelegationResponse>;
}