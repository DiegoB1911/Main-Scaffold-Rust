"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TemplateCodePreviewProps {
  templateId: string
}

export function TemplateCodePreview({ templateId }: TemplateCodePreviewProps) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(activeTab === "contract" ? contractCode : frontendCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [activeTab, setActiveTab] = useState("contract")

  return (
    <div className="rounded-md border bg-muted">
      <Tabs defaultValue="contract" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="contract">Smart Contract</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={copyCode}>
              {copied ? "Copied!" : "Copy"}
              <Copy className="ml-2 h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <TabsContent value="contract" className="p-0">
          <div className="flex items-center px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">src/contracts/marketplace.rs</span>
            </div>
          </div>
          <div className="p-4 overflow-auto font-mono text-sm">
            <pre className="text-muted-foreground">
              <code>{contractCode}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="frontend" className="p-0">
          <div className="flex items-center px-4 py-2 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">src/components/product-card.tsx</span>
            </div>
          </div>
          <div className="p-4 overflow-auto font-mono text-sm">
            <pre className="text-muted-foreground">
              <code>{frontendCode}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      <Collapsible>
        <div className="border-t px-4 py-2">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-4 w-4" />
            <span>View additional files</span>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="border-t">
            <div className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>src/contracts/token.rs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>src/components/marketplace-list.tsx</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>src/pages/marketplace.tsx</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>src/hooks/use-stellar-wallet.ts</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ChevronDown className="h-4 w-4" />
                <span>src/lib/stellar-client.ts</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

const contractCode = `use soroban_sdk::{
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
    
    pub fn get_listings_by_owner(
        env: &Env,
        owner: Address,
        limit: u32,
        offset: u32,
    ) -> Vec<(u32, NFTListing)> {
        // Implementation would filter listings by owner
        // This is a simplified version
        Vec::new(env)
    }
}`

const frontendCode = `import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistance } from "date-fns";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  owner: string;
  createdAt: Date;
  tokenId: string;
  tokenIdentifier: string;
}

export function ProductCard({
  id,
  title,
  description,
  price,
  image,
  owner,
  createdAt,
  tokenId,
  tokenIdentifier,
}: ProductCardProps) {
  const router = useRouter();
  const { wallet, isConnected, connect } = useStellarWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the smart contract to buy the NFT
      // Using mock contract IDs instead of environment variables
      const MOCK_MARKETPLACE_CONTRACT_ID = "CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2";
      const MOCK_PAYMENT_TOKEN_ID = "GBXDVFQ4NSGN5CSPNBWQAVIBXVG5LPGBZJMRJVYRZPKXRWWM4QI5VZ6G";

      const result = await wallet.callContract({
        contractId: MOCK_MARKETPLACE_CONTRACT_ID,
        method: "buy_nft",
        args: [
          id,
          wallet.publicKey,
          MOCK_PAYMENT_TOKEN_ID,
        ],
      });
      
      toast({
        title: "Purchase successful!",
        description: "You have successfully purchased this NFT.",
      });
      
      // Redirect to the user's collection
      router.push("/collection");
    } catch (error) {
      console.error("Purchase failed:", error);
      toast({
        title: "Purchase failed",
        description: "There was an error processing your purchase.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = () => {
    router.push(\`/marketplace/\${id}\`);
  };

  const truncateAddress = (address: string) => {
    return \`\${address.slice(0, 6)}...\${address.slice(-4)}\`;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2">
            NFT
          </Badge>
          <Badge variant="secondary">{price} XLM</Badge>
        </div>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <span>Owned by {truncateAddress(owner)}</span>
          <span className="mx-2">•</span>
          <span>{formatDistance(createdAt, new Date(), { addSuffix: true })}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleViewDetails}
        >
          Details
        </Button>
        <Button 
          size="sm" 
          className="flex-1"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? <Skeleton className="h-4 w-16" /> : "Buy Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}`

