import { Actor, HttpAgent } from "@dfinity/agent";
import { DEFAULT_IC_HOST, SIWB_CANISTER_ID } from "../constants/canister";
import { idlFactory as SIWBIdlFactory } from "../canister/ic_siwb_provider.idl";
import {
  SIWBActor,
  SIWBGetDelegationResponse,
  SIWBLoginResponse,
  SIWBSignMessageType,
} from "../types/siwb";
import { SignatureType } from "../types/siwb";
import { Ed25519KeyIdentity, DelegationIdentity, DelegationChain } from "@dfinity/identity";
import { createDelegationChain } from "../utils/auth";

/**
 * Parameters for completing the login process
 */
export interface LoginParams {
  /** Bitcoin address */
  address: string;

  /** Original message that was signed */
  message: string;

  /** Signed message from wallet */
  signature: string;

  /** Bitcoin public key */
  publicKey: string;

  /** Type of signature used */
  signatureType: SignatureType;

  /** Optional referrer code */
  referrer?: string;
}

/**
 * Phase 2: Complete authentication with signed message
 */
export const login = async (
  params: LoginParams
): Promise<{
  sessionIdentity: Ed25519KeyIdentity;
  identity: DelegationIdentity;
}> => {
  // Step 1: Create anonymous agent and SIWB actor
  const agent = new HttpAgent({ host: DEFAULT_IC_HOST });
  const siwbActor = Actor.createActor(SIWBIdlFactory, {
    agent,
    canisterId: SIWB_CANISTER_ID,
  }) as SIWBActor;

  // Step 2: Generate session identity
  const sessionIdentity = Ed25519KeyIdentity.generate();
  const sessionPublicKey = sessionIdentity.getPublicKey().toDer();

  // Step 3: Call siwb_login
  const signMessageType: SIWBSignMessageType = { Bip322Simple: null };

  const loginResponse: SIWBLoginResponse = await siwbActor.siwb_login(
    params.signature, // Keep as string (base64)
    params.address, // Keep as string
    params.publicKey, // Keep as string (hex)
    new Uint8Array(sessionPublicKey),
    signMessageType
  );

  if ("Err" in loginResponse) {
    throw new Error(`SIWB login failed: ${loginResponse.Err}`);
  }

  const delegationResponse: SIWBGetDelegationResponse =
    await siwbActor.siwb_get_delegation(
      params.address,
      new Uint8Array(sessionPublicKey),
      loginResponse.Ok.expiration
    );

  if ("Err" in delegationResponse) {
    throw new Error(`SIWB get delegation failed: ${delegationResponse.Err}`);
  }

  //  Create delegation chain
  const delegationChain = createDelegationChain(
    delegationResponse.Ok,
    loginResponse.Ok.user_canister_pubkey
  );

  // Step 5: Create delegation identity
  const identity = DelegationIdentity.fromDelegation(
    sessionIdentity,
    delegationChain
  );

  return {
    sessionIdentity,
    identity,
  };
};
