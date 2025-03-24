import { NextResponse } from 'next/server';
import * as StellarSDK from '@stellar/stellar-sdk';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from 'crypto';

const TESTNET_URL = 'https://soroban-testnet.stellar.org:443';
const FUTURENET_URL = 'https://rpc-futurenet.stellar.org:443';

export async function POST(req: Request) {
  try {
    const { network, publicKey, wasmId } = await req.json();
    console.log('Received create contract request with:', { network, publicKey, wasmId });

    if (!wasmId) {
      return NextResponse.json({ error: 'No WASM ID provided' }, { status: 400 });
    }

    if (!publicKey) {
      return NextResponse.json({ error: 'No public key provided' }, { status: 400 });
    }

    const rpcUrl = network === 'testnet' ? TESTNET_URL : FUTURENET_URL;
    const server = new StellarSDK.rpc.Server(rpcUrl, { allowHttp: true });
    const networkPassphrase = network === 'testnet' ? StellarSDK.Networks.TESTNET : StellarSDK.Networks.FUTURENET;

    try {
      // Get the user's account
      console.log('Fetching account for public key:', publicKey);
      const account = await server.getAccount(publicKey);
      console.log('Account found:', account.accountId());

      // Create a random salt for unique contract ID
      const salt = crypto.randomBytes(32);

      // Create contract transaction
      console.log('Creating contract transaction...');
      const createTx = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase
      })
      .addOperation(StellarSDK.Operation.createCustomContract({
        wasmHash: Buffer.from(wasmId, 'hex'),
        address: StellarSDK.Address.fromString(publicKey),
        salt: salt
      }))
      .setTimeout(180)
      .build();

      // Prepare the create transaction
      console.log('Preparing create transaction...');
      const preparedCreateTx = await server.prepareTransaction(createTx);
      console.log('Create transaction prepared');

      return NextResponse.json({
        createTx: preparedCreateTx.toXDR()
      });
    } catch (prepError) {
      console.error('Error preparing create transaction:', prepError);
      return NextResponse.json({ 
        error: prepError instanceof Error ? prepError.message : 'Failed to prepare create transaction',
        details: prepError
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in create contract endpoint:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create contract',
      details: error
    }, { status: 500 });
  }
}  