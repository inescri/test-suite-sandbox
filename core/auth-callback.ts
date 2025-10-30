import { DelegationIdentity, Ed25519KeyIdentity } from "@dfinity/identity";

const ODIN_API_URL = 'https://api.odin.fun/dev'; // https://api.odin.fun/v1 for prod
  /**
   * Helper function to check if identity is a DelegationIdentity
   */
  const isDelegationIdentity = (
    identity: DelegationIdentity | Ed25519KeyIdentity
  ): identity is DelegationIdentity => {
    return 'getDelegation' in identity;
  }

/**
   * Exchange delegation identity for JWT token via API
   * Based on authenticateCallback from siwbapi.ts
   */
export const authenticateCallback = async (
    identity: DelegationIdentity | Ed25519KeyIdentity
  ): Promise<string> => {
    if (!identity) {
      throw new Error('No Identity provided for authentication');
    }

    // Step 1: Sign timestamp with identity
    const timestamp = Date.now().toString();
    const signatureBuffer = await identity.sign(
      new TextEncoder().encode(timestamp)
    );
    const publicKey = Buffer.from(identity.getPublicKey().toDer()).toString('base64');

    // Step 2: Create payload - match siwbapi.ts structure exactly
    const payload: any = {
      timestamp,
      signature: Buffer.from(signatureBuffer).toString('base64'),
    };

    // Add delegation for DelegationIdentity, publickey for Ed25519KeyIdentity
    if (isDelegationIdentity(identity)) {
      payload.delegation = JSON.stringify(identity.getDelegation().toJSON());
    } else {
      payload.publickey = publicKey;
    }

    // Step 3:  API endpoint
    const endpoint = `${ODIN_API_URL}/auth`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Expected JSON response, got: ${contentType}`);
    }

    const authResponse = await response.json();

    return authResponse.token;
  }