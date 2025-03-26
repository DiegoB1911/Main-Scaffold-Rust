'use client';

import { useState, useCallback, useContext } from 'react';
import { Card, Input, Button, Select, Icon, Text } from '@stellar/design-system';
import { FileText, Upload, Check, AlertTriangle, Globe, Copy } from 'lucide-react';
import { useSorobanDeploy } from '@/hooks/useSorobanDeploy';
import { useWallet } from '@/hooks/use-wallet';
import { LayoutContentContainer } from '@/components/layout/LayoutContentContainer';
import { PageCard } from '@/components/layout/PageCard';
import { useStore } from '@/store/useStore';
import type { NetworkType } from '@/types/types';

export default function DeployContractPage() {
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('testnet');
  const [projectFiles, setProjectFiles] = useState<File[]>([]);
  const { account } = useStore();
  const { walletKitPubKey } = account;
  const { isConnected, connect } = useWallet();
  
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
      console.log("Wallet not connected, initiating connection");
      await connect();
      return;
    }

    const wasmFile = projectFiles.find(file => file.name.endsWith('.wasm'));
    if (!wasmFile) {
      alert('Please select a .wasm file');
      return;
    }

    console.log("Deploying contract with wallet:", walletKitPubKey);
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string)?.split(',')[1];
      if (base64) {
        await deployContract(base64);
      }
    };
    reader.readAsDataURL(wasmFile);
  }, [walletKitPubKey, connect, projectFiles, deployContract]);

  return (
    <LayoutContentContainer>
      <div className="deploy-header">
        <h1>Deploy Stellar Smart Contract</h1>
        <p>Deploy your Soroban contract to the Stellar network in just a few clicks</p>
      </div>

      <div className="deploy-content">
        {/* Columna izquierda - Instrucciones */}
        <div className="deploy-card">
          <div className="card-header">
            <FileText size={20} />
            <h2>Deployment Process</h2>
          </div>

          <div className="steps-container">
            <div className="step-box">
              <div className="step-number">1</div>
              <div className="step-details">
                <h3>Compile Contract</h3>
                <p>Compile your contract locally using:</p>
                <div className="code-box">
                  <code>soroban contract build</code>
                  <button 
                    type="button"
                    className="copy-button" 
                    onClick={() => navigator.clipboard.writeText('soroban contract build')}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="step-box">
              <div className="step-number">2</div>
              <div className="step-details">
                <h3>Locate WASM File</h3>
                <p>Find the compiled WASM file at:</p>
                <div className="code-box">
                  <code>target/wasm32-unknown-unknown/release/your_contract.wasm</code>
                  <button 
                    type="button"
                    className="copy-button" 
                    onClick={() => navigator.clipboard.writeText('target/wasm32-unknown-unknown/release/your_contract.wasm')}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="step-box">
              <div className="step-number">3</div>
              <div className="step-details">
                <h3>Select Network</h3>
                <p>Choose the Stellar network where you want to deploy your contract</p>
              </div>
            </div>

            <div className="step-box">
              <div className="step-number">4</div>
              <div className="step-details">
                <h3>Upload & Deploy</h3>
                <p>Upload your WASM file and click the Deploy button</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Área de acción */}
        <div className="deploy-card">
          <div className="card-header">
            <Upload size={20} />
            <h2>Deploy Your Contract</h2>
          </div>
          
          <div className="upload-section">
            <input
              type="file"
              id="wasm-input"
              accept=".wasm"
              onChange={handleFileChange}
              className="hidden-input"
            />
            <label htmlFor="wasm-input" className="upload-box">
              <Upload size={24} />
              <div className="upload-text">
                <p>{projectFiles.length > 0 ? projectFiles[0].name : 'Drag & drop or click to upload'}</p>
                <p className="upload-subtext">Select your .wasm file</p>
              </div>
            </label>

            {projectFiles.length > 0 && (
              <div className="file-box">
                <div className="file-header">
                  <Check size={16} />
                  <p>File Selected</p>
                </div>
                {projectFiles.map((file) => (
                  <div key={file.name} className="file-item">
                    <FileText size={16} />
                    <div>
                      <p>{file.name}</p>
                      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="network-section">
            <label htmlFor="network-select" className="network-label">
              <Globe size={16} />
              <span>Network</span>
            </label>
            <div className="select-container">
              <select
                id="network-select"
                className="network-select"
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value as NetworkType)}
              >
                <option value="testnet">Testnet (Test Network)</option>
                <option value="futurenet">Futurenet (Development)</option>
                <option value="mainnet">Mainnet (Production)</option>
              </select>
              <div className="select-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="button-section">
            <button
              type="button"
              onClick={handleDeploy}
              className={`custom-deploy-button ${status.isDeploying ? 'loading' : ''}`}
              disabled={status.isDeploying}
            >
              {status.isDeploying ? (
                <div className="loading-spinner" />
              ) : (
                <span>{!walletKitPubKey ? 'Connect Wallet' : 'Deploy Contract'}</span>
              )}
            </button>
          </div>

          {(status.error || status.contractId) && (
            <div className={`status-box ${status.error ? 'error-box' : 'success-box'}`}>
              {status.error ? (
                <>
                  <div className="status-icon error-icon">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <p className="status-title">Deployment Failed</p>
                    <p>Error: {status.error}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="status-icon success-icon">
                    <Check size={20} />
                  </div>
                  <div>
                    <p className="status-title">Contract Deployed Successfully</p>
                    <p>Contract ID:</p>
                    <div className="contract-id-box">
                      <code>{status.contractId}</code>
                      <button 
                        type="button"
                        className="copy-button"
                        onClick={() => navigator.clipboard.writeText(status.contractId || '')}
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .deploy-header {
          margin-bottom: 30px;
          text-align: center;
          color: white;
        }

        .deploy-header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 10px;
          color: white;
        }

        .deploy-header p {
          font-size: 16px;
          opacity: 0.9;
          color: #ccc;
        }

        .deploy-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .deploy-card {
          background-color: #1e1e1e;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          color: white;
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #3a3a3a;
          color: white;
        }

        .card-header h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 0;
          margin-left: 12px;
          color: white;
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-box {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          background-color: #252525;
          color: white;
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background-color: #2d7ff9;
          color: white;
          border-radius: 50%;
          font-weight: bold;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .step-details {
          flex: 1;
        }

        .step-details h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #2d7ff9;
        }

        .step-details p {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #ccc;
        }

        .code-box {
          position: relative;
          background-color: #121212;
          color: #f0f0f0;
          padding: 12px 40px 12px 16px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 13px;
          overflow-x: auto;
          border: 1px solid #333;
        }

        .copy-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #f0f0f0;
          cursor: pointer;
          padding: 4px;
          opacity: 0.6;
        }

        .copy-button:hover {
          opacity: 1;
        }

        .upload-section {
          margin-bottom: 24px;
        }

        .hidden-input {
          display: none;
        }

        .upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          border: 1px dashed #3a3a3a;
          border-radius: 8px;
          background-color: #252525;
          cursor: pointer;
          text-align: center;
          color: white;
        }

        .upload-box:hover {
          border-color: #2d7ff9;
          background-color: #2b3647;
        }

        .upload-text {
          margin-top: 16px;
          color: white;
        }

        .upload-text p {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          color: white;
        }

        .upload-subtext {
          font-size: 13px !important;
          opacity: 0.8;
          margin-top: 4px !important;
          color: #999;
        }

        .file-box {
          margin-top: 16px;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          overflow: hidden;
          background-color: #252525;
        }

        .file-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background-color: #2b3647;
          border-bottom: 1px solid #3a3a3a;
          color: white;
        }

        .file-header p {
          margin: 0 0 0 8px;
          font-size: 14px;
          font-weight: 500;
          color: white;
        }

        .file-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #3a3a3a;
          color: white;
        }

        .file-item div {
          margin-left: 12px;
        }

        .file-item p {
          margin: 0;
          font-size: 14px;
          color: white;
        }

        .file-size {
          font-size: 12px !important;
          opacity: 0.8;
          color: #999;
        }

        .network-section {
          margin-bottom: 24px;
        }

        .network-label {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          color: white;
        }

        .network-label span {
          margin-left: 8px;
          font-size: 15px;
          font-weight: 500;
          color: white;
        }

        .button-section {
          margin-bottom: 24px;
        }

        .deploy-button {
          width: 100%;
        }
        
        .custom-deploy-button {
          width: 70%;
          margin: 0 auto;
          background-color: #2d7ff9;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          text-transform: none;
        }

        .custom-deploy-button:hover {
          background-color: #1a6eea;
          transform: translateY(-1px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .custom-deploy-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .custom-deploy-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .status-box {
          display: flex;
          align-items: flex-start;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          border: 1px solid;
        }

        .error-box {
          background-color: rgba(255, 87, 87, 0.1);
          border-color: rgba(255, 87, 87, 0.5);
          color: #ff5757;
        }

        .success-box {
          background-color: rgba(40, 167, 69, 0.1);
          border-color: rgba(40, 167, 69, 0.5);
          color: #28a745;
        }

        .status-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          margin-right: 16px;
          flex-shrink: 0;
        }

        .error-icon {
          background-color: rgba(255, 87, 87, 0.2);
          color: #ff5757;
        }

        .success-icon {
          background-color: rgba(40, 167, 69, 0.2);
          color: #28a745;
        }

        .status-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: inherit;
        }

        .status-box p {
          color: #ccc;
        }

        .contract-id-box {
          position: relative;
          background-color: #121212;
          color: #f0f0f0;
          padding: 12px 40px 12px 16px;
          border-radius: 6px;
          margin-top: 8px;
          font-family: monospace;
          font-size: 13px;
          overflow-x: auto;
          border: 1px solid #333;
        }

        .select-container {
          position: relative;
          width: 36%;
        }
        
        .network-select {
          width: 100%;
          background-color:rgb(17, 16, 16);
          color: white;
          border: 1px solid #3a3a3a;
          border-radius: 6px;
          padding: 12px 16px;
          padding-right: 40px;
          font-size: 15px;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          cursor: pointer;
          outline: none;
        }
        
        .network-select:focus {
          border-color: #4a4a4a;
        }
        
        .network-select option {
          background-color: #000000;
          color: white;
          padding: 8px;
        }
        
        .select-arrow {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          pointer-events: none;
          color: white;
        }

        @media (max-width: 900px) {
          .deploy-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </LayoutContentContainer>
  );
}