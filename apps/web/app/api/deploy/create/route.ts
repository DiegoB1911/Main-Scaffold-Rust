import { NextResponse } from 'next/server';
import * as StellarSdk from '@stellar/stellar-sdk';
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
    const server = new StellarSdk.rpc.Server(rpcUrl, { allowHttp: true });
    const networkPassphrase = network === 'testnet' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.FUTURENET;

    try {
      // Get the user's account
      console.log('Fetching account for public key:', publicKey);
      const account = await server.getAccount(publicKey);
      console.log('Account found:', account.accountId());

      // Create a random salt for unique contract ID
      const salt = crypto.randomBytes(32);
      console.log('Generated salt for contract ID');

      // Create contract transaction
      console.log('Creating contract deployment transaction...');
      const source = new StellarSdk.Account(publicKey, account.sequenceNumber());
      
      // Create the contract using the wasm hash that was already uploaded
      // First convert the hex string wasmId to a Buffer
      const wasmHash = Buffer.from(wasmId, 'hex');
      
      console.log(`Creating contract with WASM hash: ${wasmId}, salt length: ${salt.length}`);
      
      // Create a deployment transaction that will deploy a contract instance
      const tx = new StellarSdk.TransactionBuilder(source, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase
      })
      .addOperation(
        StellarSdk.Operation.createCustomContract({
          wasmHash, // Use the already uploaded WASM hash
          address: StellarSdk.Address.fromString(publicKey),
          salt
        })
      )
      .setTimeout(30)
      .build();

      // Prepare the transaction
      console.log('Preparing contract creation transaction...');
      try {
        // Prepare and simulate the transaction
        const preparedTransaction = await server.prepareTransaction(tx);
        console.log('Contract creation transaction prepared successfully');

        return NextResponse.json({
          createTx: preparedTransaction.toXDR()
        });
      } catch (simError) {
        console.error('Error preparing contract creation transaction:', simError);
        return NextResponse.json({ 
          error: simError instanceof Error ? simError.message : 'Failed to prepare contract creation transaction',
          details: simError
        }, { status: 500 });
      }
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