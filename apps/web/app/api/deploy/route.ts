import { NextResponse } from 'next/server';
import * as StellarSDK from '@stellar/stellar-sdk';
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import crypto from 'crypto';

const TESTNET_URL = 'https://soroban-testnet.stellar.org:443';
const FUTURENET_URL = 'https://rpc-futurenet.stellar.org:443';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { wasm, network, publicKey, signedUploadTx, signedCreateTx } = await req.json();
    console.log('Received request with:', { 
      hasWasm: !!wasm, 
      network, 
      publicKey, 
      hasSignedUploadTx: !!signedUploadTx, 
      hasSignedCreateTx: !!signedCreateTx 
    });

    const rpcUrl = network === 'testnet' ? TESTNET_URL : FUTURENET_URL;
    const server = new StellarSDK.rpc.Server(rpcUrl, { allowHttp: true });
    const networkPassphrase = network === 'testnet' ? StellarSDK.Networks.TESTNET : StellarSDK.Networks.FUTURENET;

    // If we have a signed upload transaction, process it
    if (signedUploadTx) {
      console.log('Processing upload transaction...');

      try {
        // Send upload transaction
        console.log('Sending upload transaction...');
        console.log('Signed XDR:', signedUploadTx);
        const signedXDR = typeof signedUploadTx === 'string' ? signedUploadTx : signedUploadTx.signedTxXdr;
        const transaction = StellarSDK.TransactionBuilder.fromXDR(signedXDR, networkPassphrase);
        const uploadResponse = await server.sendTransaction(transaction);
        console.log('Upload transaction response:', uploadResponse);

        if (uploadResponse.status !== 'PENDING') {
          throw new Error(`Upload transaction failed with status: ${uploadResponse.status}`);
        }

        // Wait for upload transaction to complete
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
                let uploadResult;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          console.log(`Checking upload transaction status (attempt ${attempts + 1}/${maxAttempts})...`);
          uploadResult = await server.getTransaction(uploadResponse.hash);
          
          if (uploadResult.status === 'SUCCESS') {
            break;
          // biome-ignore lint/style/noUselessElse: <explanation>
          } else if (uploadResult.status !== 'NOT_FOUND') {
            throw new Error(`Upload transaction failed with status: ${uploadResult.status}`);
          }
          
          await sleep(3000);
          attempts++;
        }

        if (!uploadResult || uploadResult.status !== 'SUCCESS') {
          throw new Error('Upload transaction failed or timed out');
        }

        console.log('Upload transaction successful');
        console.log('Upload result:', uploadResult);

        // Get the WASM hash from the upload result
        const wasmId = uploadResult.returnValue?.bytes()?.toString('hex');
        if (!wasmId) {
          throw new Error('Failed to get WASM ID from upload result');
        }
        console.log('WASM ID from upload:', wasmId);

        // Return the WASM ID for the next step
        return NextResponse.json({
          status: 'success',
          wasmId
        });
      } catch (txError) {
        console.error('Upload transaction error:', txError);
        return NextResponse.json({ 
          error: txError instanceof Error ? txError.message : 'Upload transaction failed',
          details: txError
        }, { status: 500 });
      }
    }

    // If we have a signed create transaction, process it
    if (signedCreateTx) {
      console.log('Processing create contract transaction...');

      try {
        // Send create contract transaction
        console.log('Sending create contract transaction...');
        console.log('Signed XDR:', signedCreateTx);
        const signedCreateXDR = typeof signedCreateTx === 'string' ? signedCreateTx : signedCreateTx.signedTxXdr;
        
        // Declarar la variable createResponse y hash fuera del bloque try/catch
        let transactionHash: string;
        let usingHorizon = false;

        // Usamos una estrategia diferente: convertir la transacción a un objeto Transaction
        // pero capturamos cualquier error y continuamos con un enfoque directo si falla
        try {
          const createTransaction = StellarSDK.TransactionBuilder.fromXDR(signedCreateXDR, networkPassphrase);
          const rpcResponse = await server.sendTransaction(createTransaction);
          console.log('Create contract response (RPC):', rpcResponse);
          
          if (rpcResponse.status !== 'PENDING') {
            throw new Error(`Create contract transaction failed with status: ${rpcResponse.status}`);
          }
          
          transactionHash = rpcResponse.hash;
        } catch (parseError) {
          console.warn('Error parsing XDR, attempting to send raw XDR:', parseError);
          
          // Fallback: Intentamos enviar la transacción directamente al servidor Horizon
          usingHorizon = true;
          const horizonServerUrl = network === 'testnet' 
            ? 'https://horizon-testnet.stellar.org' 
            : 'https://horizon-futurenet.stellar.org';
          
          const horizonServer = new StellarSDK.Horizon.Server(horizonServerUrl);
          const horizonResponse = await horizonServer.submitTransaction(signedCreateXDR);
          console.log('Create contract response (Horizon):', horizonResponse);
          
          if (!horizonResponse.successful) {
            throw new Error(`Create contract transaction failed: ${horizonResponse.result_xdr}`);
          }
          
          transactionHash = horizonResponse.hash;
        }

        // Wait for create transaction to complete
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
                let createResult;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          console.log(`Checking create transaction status (attempt ${attempts + 1}/${maxAttempts})...`);
          try {
            if (usingHorizon) {
              // Si estamos usando Horizon, necesitamos esperar y luego verificar con RPC
              await sleep(3000);
              createResult = await server.getTransaction(transactionHash);
            } else {
              createResult = await server.getTransaction(transactionHash);
            }
            
            if (createResult.status === 'SUCCESS') {
              break;
            // biome-ignore lint/style/noUselessElse: <explanation>
            } else if (createResult.status !== 'NOT_FOUND') {
              throw new Error(`Create transaction failed with status: ${createResult.status}`);
            }
          } catch (error) {
            console.log('Error checking transaction status, retrying...', error);
          }
          
          await sleep(3000);
          attempts++;
        }

        if (!createResult || createResult.status !== 'SUCCESS') {
          throw new Error('Create transaction failed or timed out');
        }

        console.log('Create transaction successful');

        // Log the full result for debugging
        console.log('Full create result:', JSON.stringify(createResult, null, 2));

        // Extract contract ID from the result
        let contractIdHex: string | undefined;

        // Try to get the contract ID from the result meta XDR
        if (createResult.resultMetaXdr) {
          try {
            // Get the return value from the transaction result
            const returnValue = createResult.returnValue;
            
            if (returnValue) {
              console.log('Return value:', returnValue);
              const xdr = returnValue.toXDR('base64');
              console.log('Return value XDR:', xdr);
              
              const scVal = StellarSDK.xdr.ScVal.fromXDR(xdr, 'base64');
              if (scVal.address()) {
                contractIdHex = scVal.address().contractId().toString('hex');
              }
            }
          } catch (e) {
            console.log('Error extracting contract ID:', e);
            console.log('Return value:', createResult.returnValue);
          }
        }

        if (!contractIdHex) {
          throw new Error('Could not extract contract ID from transaction result');
        }

        // Convert hex contract ID to StrKey format
        const contractIdBytes = Buffer.from(contractIdHex, 'hex');
        const contractId = StellarSDK.StrKey.encodeContract(contractIdBytes);
        
        console.log('Contract ID (hex):', contractIdHex);
        console.log('Successfully deployed contract with ID:', contractId);

        return NextResponse.json({
          status: 'success',
          contractId,
          contractIdHex
        });
      } catch (txError) {
        console.error('Create transaction error:', txError);
        return NextResponse.json({ 
          error: txError instanceof Error ? txError.message : 'Create transaction failed',
          details: txError
        }, { status: 500 });
      }
    }

    // If we don't have signed transactions, prepare the upload transaction
    console.log('Preparing upload transaction...');

    if (!wasm) {
      return NextResponse.json({ error: 'No WASM file provided' }, { status: 400 });
    }

    if (!publicKey) {
      return NextResponse.json({ error: 'No public key provided' }, { status: 400 });
    }

    try {
      // Get the user's account
      console.log('Fetching account for public key:', publicKey);
      const account = await server.getAccount(publicKey);
      console.log('Account found:', account.accountId());

      // Create upload transaction
      console.log('Creating upload transaction...');
      const uploadTx = new StellarSDK.TransactionBuilder(account, {
        fee: StellarSDK.BASE_FEE,
        networkPassphrase
      })
      .addOperation(StellarSDK.Operation.uploadContractWasm({
        wasm: Buffer.from(wasm, 'base64')
      }))
      .setTimeout(180)
      .build();

      // Prepare the upload transaction
      console.log('Preparing upload transaction...');
      const preparedUploadTx = await server.prepareTransaction(uploadTx);
      console.log('Upload transaction prepared');

      return NextResponse.json({
        uploadTx: preparedUploadTx.toXDR()
      });
    } catch (prepError) {
      console.error('Error preparing upload transaction:', prepError);
      return NextResponse.json({ 
        error: prepError instanceof Error ? prepError.message : 'Failed to prepare upload transaction',
        details: prepError
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in deploy endpoint:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to deploy contract',
      details: error
    }, { status: 500 });
  }
} 