"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  Check,
  Code,
  Copy,
  FileCode,
  Play,
  Plus,
  RefreshCw,
  Save,
  Terminal,
  Upload,
  Eye,
  Pencil,
  ChevronDown,
  Maximize2,
  Minimize2,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ContractDebuggingUI() {
  const [activeTab, setActiveTab] = useState("deploy")
  const [isLoading, setIsLoading] = useState(false)
  const [contractId, setContractId] = useState("")
  const [wasmFile, setWasmFile] = useState<File | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [deploymentSuccess, setDeploymentSuccess] = useState(false)
  const [invokeSuccess, setInvokeSuccess] = useState(false)

  const [currentFile, setCurrentFile] = useState("marketplace.rs")
  const [isEditing, setIsEditing] = useState(false)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  // Modificar la variable de estado isCodeFullscreen por isCodeModal
  const [isCodeModal, setIsCodeModal] = useState(false)
  const [codeEditorHeight, setCodeEditorHeight] = useState("h-[calc(100vh-30rem)]")

  // Añadir estado para controlar la conexión de la wallet
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  // Ajustar la altura del editor de código cuando cambia el estado del panel
  useEffect(() => {
    if (isPanelCollapsed) {
      setCodeEditorHeight("h-[calc(100vh-15rem)]")
    } else {
      setCodeEditorHeight("h-[calc(100vh-30rem)]")
    }
  }, [isPanelCollapsed])

  // Ajustar la altura cuando está en pantalla completa
  useEffect(() => {
    if (isCodeModal) {
      setCodeEditorHeight("h-[calc(100vh-10rem)]")
    } else if (isPanelCollapsed) {
      setCodeEditorHeight("h-[calc(100vh-15rem)]")
    } else {
      setCodeEditorHeight("h-[calc(100vh-30rem)]")
    }
  }, [isCodeModal, isPanelCollapsed])

  const [contractFiles, setContractFiles] = useState({
    "marketplace.rs": `use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Error, Symbol, Vec,
  };
  
  #[contracttype]
  #[derive(Clone, Debug, Eq, PartialEq)]
  pub enum NFTStatus {
    Listed,
    Sold,
    Canceled,
  }
  
  #[contracttype]
  pub struct NFTListing {
    owner: Address,
    token_id: Address,
    token_identifier: u128,
    price: i128,
    status: NFTStatus,
    created_at: u64,
  }
  
  #[contract]
  pub struct NFTMarketplace;
  
  #[contractimpl]
  impl NFTMarketplace {
    pub fn list_nft(
        env: &Env,
        owner: Address,
        token_id: Address,
        token_identifier: u128,
        price: i128,
    ) -> NFTListing {
        // Validate inputs
        if price <= 0 {
            panic!("price must be positive");
        }
        
        // Verify the caller is the owner
        owner.require_auth();
        
        // Create the listing
        let listing = NFTListing {
            owner: owner.clone(),
            token_id: token_id.clone(),
            token_identifier,
            price,
            status: NFTStatus::Listed,
            created_at: env.ledger().timestamp(),
        };
        
        // Transfer NFT to the marketplace contract
        let token_client = token::Client::new(env, &token_id);
        token_client.transfer(
            &owner,
            &env.current_contract_address(),
            &token_identifier,
        );
        
        // Log the listing creation
        env.events().publish(
            Symbol::new(env, "nft_listed"),
            (owner, token_id, token_identifier, price),
        );
        
        listing
    }
    
    pub fn buy_nft(
        env: &Env,
        listing_id: u32,
        buyer: Address,
        payment_token_id: Address,
    ) -> Result<(), Error> {
        // Get the listing
        let mut listing = env.storage().get::<u32, NFTListing>(listing_id)
            .ok_or(Error::from_contract_error(1))?; // Not found
        
        // Verify the listing is still active
        if listing.status != NFTStatus::Listed {
            return Err(Error::from_contract_error(2)); // Invalid state
        }
        
        // Verify the buyer
        buyer.require_auth();
        
        // Transfer payment from buyer to seller
        let payment_token = token::Client::new(env, &payment_token_id);
        payment_token.transfer(
            &buyer,
            &listing.owner,
            &listing.price,
        );
        
        // Transfer NFT from contract to buyer
        let nft_token = token::Client::new(env, &listing.token_id);
        nft_token.transfer(
            &env.current_contract_address(),
            &buyer,
            &listing.token_identifier,
        );
        
        // Update listing status
        listing.status = NFTStatus::Sold;
        env.storage().set(listing_id, listing.clone());
        
        // Log the sale
        env.events().publish(
            Symbol::new(env, "nft_sold"),
            (listing_id, buyer, listing.price),
        );
        
        Ok(())
    }
    
    pub fn cancel_listing(
        env: &Env,
        listing_id: u32,
        owner: Address,
    ) -> Result<(), Error> {
        // Get the listing
        let mut listing = env.storage().get::<u32, NFTListing>(listing_id)
            .ok_or(Error::from_contract_error(1))?; // Not found
        
        // Verify the listing is still active
        if listing.status != NFTStatus::Listed {
            return Err(Error::from_contract_error(2)); // Invalid state
        }
        
        // Verify the caller is the owner
        if listing.owner != owner {
            return Err(Error::from_contract_error(3)); // Unauthorized
        }
        owner.require_auth();
        
        // Transfer NFT back to the owner
        let token_client = token::Client::new(env, &listing.token_id);
        token_client.transfer(
            &env.current_contract_address(),
            &owner,
            &listing.token_identifier,
        );
        
        // Update listing status
        listing.status = NFTStatus::Canceled;
        env.storage().set(listing_id, listing.clone());
        
        // Log the cancellation
        env.events().publish(
            Symbol::new(env, "nft_listing_canceled"),
            (listing_id, owner),
        );
        
        Ok(())
    }
    
    pub fn get_listing(
        env: &Env,
        listing_id: u32,
    ) -> Option<NFTListing> {
        env.storage().get(listing_id)
    }
  }`,
    "token.rs": `use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, String, Symbol, Vec,
  };
  
  #[contracttype]
  pub struct TokenMetadata {
    name: String,
    symbol: String,
    decimals: u32,
  }
  
  #[contract]
  pub struct StellarToken;
  
  #[contractimpl]
  impl StellarToken {
    pub fn initialize(
        env: &Env,
        admin: Address,
        name: String,
        symbol: String,
        decimals: u32,
    ) {
        // Initialize token with metadata
        env.storage().set(&Symbol::new(env, "admin"), &admin);
        env.storage().set(
            &Symbol::new(env, "metadata"),
            &TokenMetadata {
                name,
                symbol,
                decimals,
            },
        );
    }
  
    pub fn mint(env: &Env, to: Address, amount: i128) {
        // Verify admin
        let admin: Address = env.storage().get(&Symbol::new(env, "admin")).unwrap();
        admin.require_auth();
  
        // Update balance
        let key = (Symbol::new(env, "balance"), to.clone());
        let balance: i128 = env.storage().get(&key).unwrap_or(0);
        env.storage().set(&key, &(balance + amount));
  
        // Log mint event
        env.events().publish(
            Symbol::new(env, "mint"),
            (to, amount),
        );
    }
  
    pub fn transfer(env: &Env, from: Address, to: Address, amount: i128) {
        // Verify sender
        from.require_auth();
  
        // Update balances
        let from_key = (Symbol::new(env, "balance"), from.clone());
        let to_key = (Symbol::new(env, "balance"), to.clone());
        
        let from_balance: i128 = env.storage().get(&from_key).unwrap_or(0);
        if from_balance < amount {
            panic!("insufficient balance");
        }
        
        let to_balance: i128 = env.storage().get(&to_key).unwrap_or(0);
        
        env.storage().set(&from_key, &(from_balance - amount));
        env.storage().set(&to_key, &(to_balance + amount));
  
        // Log transfer event
        env.events().publish(
            Symbol::new(env, "transfer"),
            (from, to, amount),
        );
    }
  
    pub fn balance(env: &Env, account: Address) -> i128 {
        let key = (Symbol::new(env, "balance"), account);
        env.storage().get(&key).unwrap_or(0)
    }
  
    pub fn get_metadata(env: &Env) -> TokenMetadata {
        env.storage().get(&Symbol::new(env, "metadata")).unwrap()
    }
  }`,
    "types.rs": `use soroban_sdk::{
    contracttype, Address, Env, String, Symbol, Vec,
  };
  
  #[contracttype]
  #[derive(Clone, Debug, Eq, PartialEq)]
  pub enum NFTStatus {
    Listed,
    Sold,
    Canceled,
  }
  
  #[contracttype]
  pub struct NFTListing {
    owner: Address,
    token_id: Address,
    token_identifier: u128,
    price: i128,
    status: NFTStatus,
    created_at: u64,
  }
  
  #[contracttype]
  pub struct TokenMetadata {
    name: String,
    symbol: String,
    decimals: u32,
  }`,
    "errors.rs": `use soroban_sdk::contracterror;
  
  #[contracterror]
  #[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
  #[repr(u32)]
  pub enum Error {
    NotFound = 1,
    InvalidState = 2,
    Unauthorized = 3,
    InsufficientBalance = 4,
    InvalidAmount = 5,
  }`,
    "lib.rs": `pub mod marketplace;
  pub mod token;
  pub mod types;
  pub mod errors;
  
  pub use marketplace::NFTMarketplace;
  pub use token::StellarToken;
  `,
  })

  const handleCodeChange = (newCode: string) => {
    setContractFiles({
      ...contractFiles,
      [currentFile]: newCode,
    })
  }

  const handleSaveFile = () => {
    // Simulate saving the file
    setLogs((prev) => [...prev, `File ${currentFile} saved successfully.`])
    setIsEditing(false)
  }

  // Mock contract functions for the interaction tab
  const contractFunctions = [
    {
      name: "list_nft",
      description: "List an NFT for sale",
      params: [
        { name: "owner", type: "Address" },
        { name: "token_id", type: "Address" },
        { name: "token_identifier", type: "u128" },
        { name: "price", type: "i128" },
      ],
    },
    {
      name: "buy_nft",
      description: "Buy a listed NFT",
      params: [
        { name: "listing_id", type: "u32" },
        { name: "buyer", type: "Address" },
        { name: "payment_token_id", type: "Address" },
      ],
    },
    {
      name: "cancel_listing",
      description: "Cancel an NFT listing",
      params: [
        { name: "listing_id", type: "u32" },
        { name: "owner", type: "Address" },
      ],
    },
    {
      name: "get_listing",
      description: "Get details of a listing",
      params: [{ name: "listing_id", type: "u32" }],
    },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setWasmFile(e.target.files[0])
    }
  }

  const handleDeploy = () => {
    if (!wasmFile) return

    setIsLoading(true)
    setLogs([
      `Deploying contract from WASM file: ${wasmFile.name}...`,
      "Initializing deployment...",
      "Uploading WASM to Stellar network...",
      "Waiting for confirmation...",
    ])

    // Simulate deployment delay
    setTimeout(() => {
      const mockContractId = "CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2"
      setContractId(mockContractId)
      setLogs((prev) => [...prev, `Contract deployed successfully!`, `Contract ID: ${mockContractId}`])
      setIsLoading(false)
      setDeploymentSuccess(true)

      // Auto switch to invoke tab after successful deployment
      setTimeout(() => {
        setActiveTab("invoke")
      }, 1000)
    }, 2000)
  }

  const handleInvoke = () => {
    if (!contractId) return

    setIsLoading(true)
    setLogs([
      `Invoking contract: ${contractId}...`,
      "Initializing contract...",
      "Preparing contract environment...",
      "Waiting for confirmation...",
    ])

    // Simulate invoke delay
    setTimeout(() => {
      setLogs((prev) => [...prev, `Contract invoked successfully!`, `Contract is now ready for interaction`])
      setIsLoading(false)
      setInvokeSuccess(true)

      // Auto switch to interact tab after successful invocation
      setTimeout(() => {
        setActiveTab("interact")
      }, 1000)
    }, 2000)
  }

  const handleInteract = (functionName: string) => {
    setIsLoading(true)
    setLogs([
      `Calling function: ${functionName}...`,
      "Preparing parameters...",
      "Sending transaction to network...",
      "Waiting for confirmation...",
    ])

    // Simulate function call delay
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `Function ${functionName} executed successfully!`,
        `Transaction hash: ${"0x" + Math.random().toString(16).substring(2, 10)}`,
        `Result: { "status": "success", "data": { "id": ${Math.floor(Math.random() * 1000)} } }`,
      ])
      setIsLoading(false)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Reemplazar la función toggleCodeFullscreen con toggleCodeModal
  const toggleCodeModal = () => {
    setIsCodeModal(!isCodeModal)
  }

  // Añadir useEffect para manejar la tecla Escape y el bloqueo del scroll
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCodeModal) {
        setIsCodeModal(false)
      }
    }

    // Bloquear el scroll del body cuando el modal está abierto
    if (isCodeModal) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleEscapeKey)
    }

    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isCodeModal])

  // Añadir función para manejar la conexión/desconexión de la wallet
  const handleWalletConnection = () => {
    if (!isWalletConnected) {
      // Simular conexión de wallet
      setIsLoading(true)
      setTimeout(() => {
        const mockAddress = "GBXDVFQ4NSGN5CSPNBWQAVIBXVG5LPGBZJMRJVYRZPKXRWWM4QI5VZ6G"
        setWalletAddress(mockAddress)
        setIsWalletConnected(true)
        setIsLoading(false)
        setLogs((prev) => [...prev, `Wallet connected: ${mockAddress}`])
      }, 1000)
    } else {
      // Simular desconexión
      setWalletAddress("")
      setIsWalletConnected(false)
      setLogs((prev) => [...prev, "Wallet disconnected"])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Contract Debugger</h1>
          <p className="text-muted-foreground">Deploy, invoke, and interact with your Stellar smart contracts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isWalletConnected ? "default" : "outline"}
            className={isWalletConnected ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={handleWalletConnection}
          >
            {isLoading && !isWalletConnected ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            {isWalletConnected ? "Connected" : "Connect Wallet"}
          </Button>
          {isWalletConnected && (
            <div className="bg-muted px-3 py-1 rounded-md flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="font-mono truncate max-w-[120px]">{walletAddress}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(walletAddress)}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Session
          </Button>
          <Button variant="outline">
            <Terminal className="mr-2 h-4 w-4" />
            Clear Logs
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="deploy" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>1. Deploy</span>
              {deploymentSuccess && <Check className="h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="invoke" className="flex items-center gap-2" disabled={!deploymentSuccess}>
              <Play className="h-4 w-4" />
              <span>2. Invoke</span>
              {invokeSuccess && <Check className="h-4 w-4 text-green-500" />}
            </TabsTrigger>
            <TabsTrigger value="interact" className="flex items-center gap-2" disabled={!invokeSuccess}>
              <Code className="h-4 w-4" />
              <span>3. Interact</span>
            </TabsTrigger>
          </TabsList>
          <Select defaultValue="testnet">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local Sandbox</SelectItem>
              <SelectItem value="testnet">Testnet</SelectItem>
              <SelectItem value="mainnet">Mainnet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isCodeModal && (
          <div
            className={`rounded-lg border transition-all duration-300 ${isPanelCollapsed ? "min-h-[60px]" : "min-h-[600px]"}`}
          >
            <div className="flex items-center justify-between border-b p-3">
              <h3 className="text-sm font-medium">
                {activeTab === "deploy"
                  ? "Deploy Contract"
                  : activeTab === "invoke"
                    ? "Invoke Contract"
                    : "Interact with Contract"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                className="h-7 w-7 p-0"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isPanelCollapsed ? "rotate-180" : ""}`} />
              </Button>
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${isPanelCollapsed ? "max-h-0" : "max-h-[600px]"}`}
            >
              <div className="h-full">
                <TabsContent value="deploy" className="h-full">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Deploy Contract</h2>
                      <p className="text-sm text-muted-foreground">Upload and deploy your compiled WASM contract</p>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="wasm-file">Contract WASM File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="wasm-file"
                              type="file"
                              accept=".wasm"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            {wasmFile && (
                              <Badge variant="outline" className="gap-1">
                                <FileCode className="h-3 w-3" />
                                {wasmFile.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload your compiled WebAssembly (.wasm) contract file
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Deployment Parameters</Label>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="init-params">
                              <AccordionTrigger>Constructor Parameters (Optional)</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="param-name">Parameter Name</Label>
                                      <Input id="param-name" placeholder="e.g., owner" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="param-value">Parameter Value</Label>
                                      <Input id="param-value" placeholder="e.g., GBXDVFQ4NSG..." />
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Plus className="h-3 w-3" />
                                    Add Parameter
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="advanced">
                              <AccordionTrigger>Advanced Options</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="gas-limit">Gas Limit</Label>
                                    <Input id="gas-limit" type="number" defaultValue="100000000" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="storage-limit">Storage Limit</Label>
                                    <Input id="storage-limit" type="number" defaultValue="10000" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        <div className="pt-4">
                          <Button onClick={handleDeploy} disabled={!wasmFile || isLoading} className="w-full">
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Deploy Contract
                              </>
                            )}
                          </Button>
                        </div>

                        {deploymentSuccess && (
                          <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle>Deployment Successful</AlertTitle>
                            <AlertDescription className="flex flex-col gap-2">
                              <p>Your contract has been deployed successfully.</p>
                              <div className="flex items-center gap-2 bg-muted p-2 rounded text-sm font-mono">
                                <span className="truncate">{contractId}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(contractId)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button size="sm" className="mt-2 w-fit" onClick={() => setActiveTab("invoke")}>
                                Continue to Invoke
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="invoke" className="h-full">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Invoke Contract</h2>
                      <p className="text-sm text-muted-foreground">Initialize your contract for interaction</p>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="contract-id">Contract ID</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="contract-id"
                              value={contractId}
                              onChange={(e) => setContractId(e.target.value)}
                              placeholder="e.g., CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2"
                              className="flex-1 font-mono"
                            />
                            <Button variant="outline" size="icon" onClick={() => copyToClipboard(contractId)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">The contract ID obtained after deployment</p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label>Invocation Settings</Label>
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="auth">
                              <AccordionTrigger>Authentication</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="signer">Signer Account</Label>
                                    <Input id="signer" placeholder="e.g., GBXDVFQ4NSG..." />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="network-passphrase">Network Passphrase</Label>
                                    <Select defaultValue="testnet-passphrase">
                                      <SelectTrigger id="network-passphrase">
                                        <SelectValue placeholder="Select network passphrase" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="testnet-passphrase">Testnet Passphrase</SelectItem>
                                        <SelectItem value="mainnet-passphrase">Mainnet Passphrase</SelectItem>
                                        <SelectItem value="custom">Custom Passphrase</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="advanced-invoke">
                              <AccordionTrigger>Advanced Options</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-4 pt-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                                    <Input id="timeout" type="number" defaultValue="30" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="fee">Max Fee (stroops)</Label>
                                    <Input id="fee" type="number" defaultValue="100" />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        <div className="pt-4">
                          <Button onClick={handleInvoke} disabled={!contractId || isLoading} className="w-full">
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Invoking...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Invoke Contract
                              </>
                            )}
                          </Button>
                        </div>

                        {invokeSuccess && (
                          <Alert className="mt-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertTitle>Invocation Successful</AlertTitle>
                            <AlertDescription className="flex flex-col gap-2">
                              <p>Your contract has been successfully invoked and is ready for interaction.</p>
                              <Button size="sm" className="mt-2 w-fit" onClick={() => setActiveTab("interact")}>
                                Continue to Interact
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="interact" className="h-full">
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-medium">Interact with Contract</h2>
                      <p className="text-sm text-muted-foreground">Call functions on your deployed contract</p>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <ScrollArea className="h-[calc(100vh-250px)]">
                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label>Contract Functions</Label>
                              <div className="space-y-4">
                                {contractFunctions.map((func) => (
                                  <Card key={func.name}>
                                    <CardHeader className="pb-2">
                                      <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-mono">{func.name}</CardTitle>
                                        <Badge variant="outline">{func.params.length} params</Badge>
                                      </div>
                                      <CardDescription>{func.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                      <div className="space-y-4">
                                        {func.params.map((param) => (
                                          <div key={param.name} className="grid grid-cols-4 gap-4 items-center">
                                            <Label htmlFor={`${func.name}-${param.name}`} className="col-span-1">
                                              {param.name}:
                                            </Label>
                                            <div className="col-span-3">
                                              <Input id={`${func.name}-${param.name}`} placeholder={`${param.type}`} />
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </CardContent>
                                    <CardFooter>
                                      <Button
                                        onClick={() => handleInteract(func.name)}
                                        disabled={isLoading}
                                        variant="outline"
                                        className="w-full"
                                      >
                                        {isLoading ? (
                                          <>
                                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                            Executing...
                                          </>
                                        ) : (
                                          <>
                                            <Play className="mr-2 h-4 w-4" />
                                            Execute {func.name}
                                          </>
                                        )}
                                      </Button>
                                    </CardFooter>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        )}

        {/* Reemplazar la sección del editor de código (aproximadamente en la línea 700) con esta implementación */}
        {isCodeModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-hidden"
            onClick={() => setIsCodeModal(false)} // Cerrar al hacer clic en el overlay
          >
            <div
              className="bg-background rounded-lg border shadow-lg w-[90%] h-[90%] flex flex-col animate-in fade-in-0 zoom-in-95"
              onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro del modal
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {currentFile === "marketplace.rs"
                      ? "src/contracts/marketplace.rs"
                      : currentFile === "token.rs"
                        ? "src/contracts/token.rs"
                        : currentFile === "types.rs"
                          ? "src/contracts/types.rs"
                          : currentFile === "errors.rs"
                            ? "src/contracts/errors.rs"
                            : "src/lib.rs"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </>
                    ) : (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSaveFile} disabled={!isEditing}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsCodeModal(false)}>
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {isEditing ? (
                  <Textarea
                    className="font-mono text-sm w-full h-full min-h-[calc(100%-2rem)] resize-none"
                    value={contractFiles[currentFile]}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <pre className="text-muted-foreground font-mono text-sm h-full overflow-auto">
                    <code>{contractFiles[currentFile]}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`mt-8 rounded-lg border relative ${isCodeModal ? "z-10" : ""}`}>
          <Tabs defaultValue="code">
            <div className="border-b p-4 flex justify-between items-center">
              <TabsList className="w-full">
                <TabsTrigger value="code">Contract Code</TabsTrigger>
                <TabsTrigger value="logs">Execution Logs</TabsTrigger>
                <TabsTrigger value="state">Contract State</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" onClick={toggleCodeModal} className="ml-2">
                {isCodeModal ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>

            <TabsContent value="code" className="p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Select defaultValue="marketplace.rs" onValueChange={(value) => setCurrentFile(value)}>
                      <SelectTrigger className="w-[280px]">
                        <div className="flex items-center gap-2 w-full overflow-hidden">
                          <FileCode className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <SelectValue className="truncate" placeholder="Select file" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketplace.rs">src/contracts/marketplace.rs</SelectItem>
                        <SelectItem value="token.rs">src/contracts/token.rs</SelectItem>
                        <SelectItem value="types.rs">src/contracts/types.rs</SelectItem>
                        <SelectItem value="errors.rs">src/contracts/errors.rs</SelectItem>
                        <SelectItem value="lib.rs">src/lib.rs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </>
                      ) : (
                        <>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleSaveFile} disabled={!isEditing}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      New File
                    </Button>
                  </div>
                </div>
                <ScrollArea className={isPanelCollapsed ? "h-[calc(100vh-15rem)]" : "h-[calc(100vh-30rem)]"}>
                  {isEditing ? (
                    <div className="p-4">
                      <Textarea
                        className={`font-mono text-sm resize-none ${isPanelCollapsed ? "min-h-[calc(100vh-17rem)]" : "min-h-[calc(100vh-32rem)]"}`}
                        value={contractFiles[currentFile]}
                        onChange={(e) => handleCodeChange(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="p-4 font-mono text-sm">
                      <pre className="text-muted-foreground">
                        <code>{contractFiles[currentFile]}</code>
                      </pre>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Execution Logs</span>
                </div>
                <Button variant="ghost" size="sm">
                  Clear
                </Button>
              </div>
              <ScrollArea className={isPanelCollapsed ? "h-[calc(100vh-15rem)]" : "h-[calc(100vh-30rem)]"}>
                <div className="p-4 font-mono text-sm">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div key={index} className="py-1">
                        <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No logs available. Deploy, invoke, or interact with your contract to see logs.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="state" className="p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Contract State</span>
                </div>
                <Button variant="ghost" size="sm">
                  Refresh
                </Button>
              </div>
              <ScrollArea className={isPanelCollapsed ? "h-[calc(100vh-15rem)]" : "h-[calc(100vh-30rem)]"}>
                <div className="p-4">
                  {contractId ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Contract Information</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium">Contract ID:</div>
                            <div className="col-span-2 font-mono truncate">{contractId}</div>

                            <div className="font-medium">Network:</div>
                            <div className="col-span-2">Testnet</div>

                            <div className="font-medium">Status:</div>
                            <div className="col-span-2">
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              >
                                Active
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Storage Entries</h3>
                        <div className="bg-muted p-3 rounded-md">
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="font-medium">Key:</div>
                              <div className="col-span-2 font-mono">0x01</div>

                              <div className="font-medium">Type:</div>
                              <div className="col-span-2">NFTListing</div>

                              <div className="font-medium">Value:</div>
                              <div className="col-span-2">
                                <Textarea
                                  readOnly
                                  className="font-mono text-xs h-24"
                                  value={JSON.stringify(
                                    {
                                      owner: "GBXDVFQ4NSGN5CSPNBWQAVIBXVG5LPGBZJMRJVYRZPKXRWWM4QI5VZ6G",
                                      token_id: "CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2",
                                      token_identifier: "123456789",
                                      price: "100000000",
                                      status: "Listed",
                                      created_at: "1679142400",
                                    },
                                    null,
                                    2,
                                  )}
                                />
                              </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-3 gap-2 text-sm">
                              <div className="font-medium">Key:</div>
                              <div className="col-span-2 font-mono">0x02</div>

                              <div className="font-medium">Type:</div>
                              <div className="col-span-2">NFTListing</div>

                              <div className="font-medium">Value:</div>
                              <div className="col-span-2">
                                <Textarea
                                  readOnly
                                  className="font-mono text-xs h-24"
                                  value={JSON.stringify(
                                    {
                                      owner: "GCRDTBFS4IMLPJQBFIJZFBXVWJFUHDXJVFXKGIDUYA3WZFMNXLMKBF6V",
                                      token_id: "CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2",
                                      token_identifier: "987654321",
                                      price: "50000000",
                                      status: "Sold",
                                      created_at: "1679142500",
                                    },
                                    null,
                                    2,
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No contract state available. Deploy and invoke a contract to view its state.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </Tabs>
    </div>
  )
}

