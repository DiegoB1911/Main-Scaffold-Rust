'use client';

import { useState, useCallback, useContext } from 'react';
import { Card, Input, Button, Select, Icon, Text } from '@stellar/design-system';
import { useSorobanDeploy } from '@/hooks/useSorobanDeploy';
import { WalletKitContext } from '@/components/WalletKitContextProvider';
import { LayoutContentContainer } from '@/components/layout/LayoutContentContainer';
import { PageCard } from '@/components/layout/PageCard';
import { useStore } from '@/store/useStore';
import type { NetworkType } from '@/types/types';

export default function DeployContractPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('testnet');
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const { account } = useStore();
  const { walletKitPubKey } = account;
  const walletKitInstance = useContext(WalletKitContext);
  
  const { deployContract, status } = useSorobanDeploy({
    network: selectedNetwork,
    publicKey: walletKitPubKey || ''
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setProjectFiles(Array.from(files));
    }
  }, []);

  const handleDeploy = useCallback(async () => {
    if (!walletKitPubKey) {
      await walletKitInstance.walletKit?.openModal({
        onWalletSelected: async () => {
          const wasmFile = projectFiles.find(file => file.name.endsWith('.wasm'));
          if (!wasmFile) {
            alert('Please select a .wasm file');
            return;
          }
          
          // Convert file to base64
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64 = (e.target?.result as string)?.split(',')[1];
            if (base64) {
              await deployContract(base64);
            }
          };
          reader.readAsDataURL(wasmFile);
        },
        onClosed: () => {
          console.log('Wallet selection cancelled');
        },
      });
      return;
    }

    const wasmFile = projectFiles.find(file => file.name.endsWith('.wasm'));
    if (!wasmFile) {
      alert('Please select a .wasm file');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string)?.split(',')[1];
      if (base64) {
        await deployContract(base64);
      }
    };
    reader.readAsDataURL(wasmFile);
  }, [walletKitPubKey, walletKitInstance.walletKit, projectFiles, deployContract]);

  return (
    <LayoutContentContainer>
      <PageCard heading="Deploy Stellar Smart Contract">
        <div className="deploy-container">
          <div className="instructions">
            <Text as="p" size="lg" weight="medium">
              Steps to Deploy your Contract
            </Text>
            <ol className="steps-list">
              <li>
                <Text as="p" size="sm">
                  1. Compile your contract locally using the Soroban CLI:
                  <code className="command">soroban contract build</code>
                </Text>
              </li>
              <li>
                <Text as="p" size="sm">
                  2. Locate the compiled WASM file in:
                  <code className="path">target/wasm32-unknown-unknown/release/your_contract.wasm</code>
                </Text>
              </li>
              <li>
                <Text as="p" size="sm">
                  3. Select the network where you want to deploy
                </Text>
              </li>
              <li>
                <Text as="p" size="sm">
                  4. Upload the WASM file and click Deploy
                </Text>
              </li>
            </ol>
          </div>

          <div className="file-upload">
            <Text as="p" size="md" weight="medium">
              Select the compiled WASM file
            </Text>
            
            <label htmlFor="wasm-input" className="upload-label">
              <Icon.Upload01 /> {projectFiles.length > 0 ? projectFiles[0].name : 'Select WASM file'}
              <input
                type="file"
                id="wasm-input"
                accept=".wasm"
                onChange={handleFileChange}
                className="hidden-input"
              />
            </label>
          </div>

          {projectFiles.length > 0 && (
            <div className="selected-files">
              <Text size="sm" as="p">Selected files:</Text>
              {projectFiles.map((file) => (
                <Text key={file.name} size="sm" as="p">
                  {file.name}
                </Text>
              ))}
            </div>
          )}

          <div className="network-select">
            <Select
              id="network-select"
              label="Stellar Network"
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value as NetworkType)}
              fieldSize="lg"
            >
              <option value="testnet">Testnet (Test Network)</option>
              <option value="futurenet">Futurenet (Development)</option>
              <option value="mainnet">Mainnet (Production)</option>
            </Select>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleDeploy}
            isLoading={status.isDeploying}
          >
            {!walletKitPubKey ? 'Connect Wallet' : 'Deploy Contract'}
          </Button>

          {(status.error || status.contractId) && (
            <div className={`deploy-status ${status.error ? 'error' : 'completed'}`}>
              {status.error && (
                <Text size="sm" as="p" color="var(--color-error)">
                  Error: {status.error}
                </Text>
              )}
              {status.contractId && (
                <div className="contract-info">
                  <Text size="sm" as="p">
                    Contract ID: <code>{status.contractId}</code>
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>

        <style jsx>{`
          .deploy-container {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .instructions {
            background: var(--color-gray-0);
            padding: 1.5rem;
            border-radius: 0.5rem;
            border: 1px solid var(--color-gray-20);
          }
          .steps-list {
            margin: 1rem 0 0 1.5rem;
            padding: 0;
          }
          .steps-list li {
            margin-bottom: 1rem;
          }
          code {
            display: block;
            margin: 0.5rem 0;
            padding: 0.5rem;
            background: var(--color-gray-10);
            border-radius: 0.25rem;
            font-family: monospace;
          }
          .file-upload {
            padding: 2rem;
            border: 2px dashed var(--color-gray-40);
            border-radius: 0.5rem;
            text-align: center;
          }
          .upload-label {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: var(--color-gray-0);
            border: 1px solid var(--color-gray-40);
            border-radius: 0.25rem;
            cursor: pointer;
            transition: all 0.2s;
          }
          .upload-label:hover {
            border-color: var(--color-gray-60);
            background: var(--color-gray-10);
          }
          .hidden-input {
            display: none;
          }
          .network-select {
            max-width: 400px;
          }
          .selected-files {
            padding: 1rem;
            background: var(--color-gray-0);
            border-radius: 0.5rem;
            border: 1px solid var(--color-gray-20);
          }
          .deploy-status {
            padding: 1rem;
            border-radius: 0.5rem;
            background: var(--color-gray-0);
            border: 1px solid var(--color-gray-20);
          }
          .deploy-status.error {
            background: var(--color-error-10);
            border-color: var(--color-error);
          }
          .deploy-status.completed {
            background: var(--color-success-10);
            border-color: var(--color-success);
          }
          .contract-info {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--color-gray-20);
          }
        `}</style>
      </PageCard>
    </LayoutContentContainer>
  );
} 