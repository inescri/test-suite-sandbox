import { Actor, HttpAgent } from "@dfinity/agent";
import { DEFAULT_IC_HOST, SIWB_CANISTER_ID } from "../constants/canister";
import { idlFactory as SIWBIdlFactory } from '../canister/ic_siwb_provider.idl';
import { SIWBActor, SIWBPrepareLoginResponse } from "../types/siwb";

/**
 * Result from the prepare authentication phase
 */
export interface PrepareResult {
    /** Bitcoin address used for authentication */
    address: string;
  
    /** Message to be signed by the wallet */
    message: string;
  }

/**
   * Phase 1: Prepare authentication and get message to sign
   */
export const prepare = async (address: string): Promise<PrepareResult> => {
    // Create anonymous agent for SIWB canister
    const agent = new HttpAgent({ host: DEFAULT_IC_HOST });

    // Create SIWB actor
    const siwbActor = Actor.createActor(SIWBIdlFactory, {
      agent,
      canisterId: SIWB_CANISTER_ID,
    }) as SIWBActor;

    // Call the SIWB canister's prepare login method
    const response: SIWBPrepareLoginResponse = await siwbActor.siwb_prepare_login(address);

    if ('Err' in response) {
      throw new Error(`SIWB prepare login failed: ${response.Err}`);
    }

    const message = response.Ok;

    return {
      address,
      message,
    };
  }