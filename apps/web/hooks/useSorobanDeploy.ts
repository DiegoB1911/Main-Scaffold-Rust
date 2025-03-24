import { useState } from 'react';
import type { NetworkType } from '@/types/types';
import { isConnected, signTransaction } from '@stellar/freighter-api';
import { Networks, TransactionBuilder } from '@stellar/stellar-sdk';

interface UseSorobanDeployProps {
  network: NetworkType;
  publicKey: string;
}

export interface DeployStatus {
  isDeploying: boolean;
  error: string | null;
  contractId: string | null;
}

export function useSorobanDeploy({ network, publicKey }: UseSorobanDeployProps) {
  const [status, setStatus] = useState<DeployStatus>({
    isDeploying: false,
    error: null,
    contractId: null
  });

  const deployContract = async (wasmBase64: string) => {
    try {
      setStatus({ isDeploying: true, error: null, contractId: null });

      // Check if Freighter is connected
      const isWalletConnected = await isConnected();
      if (!isWalletConnected) {
        throw new Error('Freighter wallet is not connected');
      }

      const networkPassphrase = network === 'testnet' ? Networks.TESTNET : Networks.FUTURENET;

      // Step 1: Upload WASM
      console.log('Preparing WASM upload...');
      const uploadResponse = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wasm: wasmBase64,
          network,
          publicKey
        }),
      });

      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to prepare WASM upload');
      }

      // Sign and submit upload transaction
      console.log('Signing upload transaction...');
      const signedUploadTxXDR = await signTransaction(uploadData.uploadTx, {
        networkPassphrase
      });

      if (!signedUploadTxXDR) {
        throw new Error('Failed to sign upload transaction');
      }

      console.log('Signed upload transaction:', signedUploadTxXDR);

      // Submit signed upload transaction
      console.log('Submitting upload transaction...');
      const uploadResult = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network,
          publicKey,
          signedUploadTx: signedUploadTxXDR
        }),
      });

      const uploadResultData = await uploadResult.json();

      if (!uploadResult.ok) {
        throw new Error(uploadResultData.error || 'Failed to upload WASM');
      }

      if (!uploadResultData.wasmId) {
        throw new Error('No WASM ID returned from upload');
      }

      // Step 2: Create contract
      console.log('Preparing contract creation...');
      const createResponse = await fetch('/api/deploy/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wasmId: uploadResultData.wasmId,
          network,
          publicKey
        }),
      });

      const createData = await createResponse.json();
      
      if (!createResponse.ok) {
        throw new Error(createData.error || 'Failed to prepare contract creation');
      }

      // Sign and submit create transaction
      console.log('Signing create transaction...');
      const signedCreateTxXDR = await signTransaction(createData.createTx, {
        networkPassphrase
      });

      if (!signedCreateTxXDR) {
        throw new Error('Failed to sign create transaction');
      }

      console.log('Signed create transaction:', signedCreateTxXDR);

      // Submit signed create transaction
      console.log('Submitting create transaction...');
      const createResult = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network,
          publicKey,
          signedCreateTx: signedCreateTxXDR
        }),
      });

      const createResultData = await createResult.json();

      if (!createResult.ok) {
        throw new Error(createResultData.error || 'Failed to create contract');
      }

      if (!createResultData.contractId) {
        throw new Error('No contract ID returned from creation');
      }

      setStatus({
        isDeploying: false,
        error: null,
        contractId: createResultData.contractId
      });

    } catch (error) {
      console.error('Error deploying contract:', error);
      setStatus({
        isDeploying: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        contractId: null
      });
    }
  };

  return {
    deployContract,
    status
  };
} 