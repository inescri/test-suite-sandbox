import * as bip32 from '@scure/bip32';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import * as btc from '@scure/btc-signer';
import { hex } from '@scure/base';
import * as sha2 from '@noble/hashes/sha2';
import { encode } from 'varuint-bitcoin';

const NETWORK = btc.NETWORK;
const DEFAULT_DERIVATION_PATH = "m/86'/0'/0'/0/0";

export type SampleWallet = {
  address: string;
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  derivationPath: string;
  signMessage: (message: string) => Promise<string>;
};

/**
 * BIP0322 message hashing
 */
function bip0322Hash(message: string) {
  const tag = 'BIP0322-signed-message';
  const tagHash = sha2.sha256(Buffer.from(tag));
  const result = sha2.sha256(Buffer.concat([tagHash, tagHash, Buffer.from(message)]));
  return hex.encode(result);
}

/**
 * Encode variable-length string for BIP322
 */
function encodeVarString(b: Uint8Array) {
  return Buffer.concat([encode(b.byteLength), b]);
}

/**
 * Sign a message using BIP322 format (adapted from odin/utils/bip322.ts)
 */
export async function signBip322MessageWithKey({
  message,
  privateKeyHex,
}: {
  message: string;
  privateKeyHex: string;
}): Promise<string> {
  const secp256k1 = await import('@noble/secp256k1');

  const privateKeyBytes = hex.decode(privateKeyHex);
  const publicKeyBytes = secp256k1.schnorr.getPublicKey(privateKeyBytes);

  const txScript = btc.p2tr(publicKeyBytes, undefined, NETWORK);

  const inputHash = hex.decode('0000000000000000000000000000000000000000000000000000000000000000');
  const txVersion = 0;
  const inputIndex = 4294967295;
  const sequence = 0;
  const scriptSig = btc.Script.encode(['OP_0', hex.decode(bip0322Hash(message))]);

  const txToSpend = new btc.Transaction({
    allowUnknownOutputs: true,
    version: txVersion,
  });
  txToSpend.addOutput({
    amount: BigInt(0),
    script: txScript.script,
  });
  txToSpend.addInput({
    txid: inputHash,
    index: inputIndex,
    sequence,
    finalScriptSig: scriptSig,
  });

  const txToSign = new btc.Transaction({
    allowUnknownOutputs: true,
    version: txVersion,
  });
  txToSign.addInput({
    txid: txToSpend.id,
    index: 0,
    sequence,
    tapInternalKey: publicKeyBytes,
    witnessUtxo: {
      script: txScript.script,
      amount: BigInt(0),
    },
    redeemScript: Buffer.alloc(0),
  });
  txToSign.addOutput({
    script: btc.Script.encode(['RETURN']),
    amount: BigInt(0),
  });

  txToSign.sign(privateKeyBytes);
  txToSign.finalize();

  const firstInput = txToSign.getInput(0);
  if (firstInput.finalScriptWitness?.length) {
    const len = encode(firstInput.finalScriptWitness?.length);
    const result = Buffer.concat([
      len,
      ...firstInput.finalScriptWitness.map(w => encodeVarString(w)),
    ]);
    return result.toString('base64');
  }
  return '';
}

/**
 * Generates P2TR (Taproot) address and keypair from a derived HDKey node
 */
async function getP2TRFromNode(node: bip32.HDKey) {
  const secp256k1 = await import('@noble/secp256k1');

  if (!node.privateKey) {
    throw new Error('HDKey node does not contain a private key.');
  }

  const privateKeyHex = hex.encode(node.privateKey);
  const publicKey = secp256k1.schnorr.getPublicKey(privateKeyHex);

  const p2tr = btc.p2tr(publicKey, undefined, NETWORK);

  return {
    p2tr,
    keyPair: {
      publicKey: hex.encode(publicKey),
      privateKey: privateKeyHex,
    },
  };
}

/**
 * Creates a master HDKey and derives a child HDKey using the provided derivation path
 */
function createHDNodeFromMnemonic(mnemonic: string, derivationPath: string) {
  if (!validateMnemonic(mnemonic, wordlist)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = mnemonicToSeedSync(mnemonic);
  const masterNode = bip32.HDKey.fromMasterSeed(seed);
  const derivedNode = masterNode.derive(derivationPath);

  return { derivedNode, seedHex: Buffer.from(seed).toString('hex') };
}

/**
 * Creates a sample wallet for testing and examples
 * If mnemonic is not provided, a new one is generated
 */
export async function createSampleWallet(
  mnemonic?: string,
  derivationPath?: string
): Promise<SampleWallet> {
  const phrase = mnemonic || generateMnemonic(wordlist);
  const path = derivationPath || DEFAULT_DERIVATION_PATH;

  const { derivedNode } = createHDNodeFromMnemonic(phrase, path);
  const { p2tr, keyPair } = await getP2TRFromNode(derivedNode);

  const wallet: SampleWallet = {
    address: p2tr.address!,
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    mnemonic: phrase,
    derivationPath: path,
    signMessage: async (message: string) => {
      return signBip322MessageWithKey({
        message,
        privateKeyHex: keyPair.privateKey,
      });
    },
  };

  return wallet;
}

/**
 * Create a sample wallet from an existing mnemonic
 */
export async function createSampleWalletFromMnemonic(
  mnemonic: string,
  derivationPath?: string
): Promise<SampleWallet> {
  return createSampleWallet(mnemonic, derivationPath);
}

/**
 * Generate a new mnemonic phrase
 */
export function generateSampleMnemonic(): string {
  return generateMnemonic(wordlist);
}

/**
 * Validate a mnemonic phrase
 */
export function validateSampleMnemonic(mnemonic: string): boolean {
  return validateMnemonic(mnemonic, wordlist);
}