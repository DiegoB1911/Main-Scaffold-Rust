import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Scaffold Rust</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Build, test, and deploy smart contracts on the Stellar blockchain using Rust with our powerful
                templates, modular components, and efficient toolset.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href="/templates">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-lg border bg-background p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background border-0 rounded-lg">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              </div>
              <div className="relative z-10 h-full w-full rounded-lg bg-background/80 backdrop-blur-sm p-4 flex flex-col">
                <div className="flex items-center h-6 gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-muted-foreground">stellar_escrow.rs</div>
                </div>
                <div className="mt-4 flex-1 overflow-hidden font-mono text-xs">
                  <pre className="text-muted-foreground">
                    <code>{`// Smart Contract (marketplace.rs)
pub fn list_nft(
    env: &Env,
    owner: Address,
    token_id: Address,
    token_identifier: u128,
    price: i128,
) -> NFTListing {
    // Create listing and transfer NFT to contract
}

// Frontend Integration (use-marketplace.ts)
export function useMarketplace() {
  const { wallet } = useStellarWallet();
  
  const listNFT = async (tokenId, identifier, price) => {
    return wallet.callContract({
      contractId: MARKETPLACE_CONTRACT_ID,
      method: "list_nft",
      args: [wallet.publicKey, tokenId, identifier, price],
    });
  };
  
  return { listNFT };
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

