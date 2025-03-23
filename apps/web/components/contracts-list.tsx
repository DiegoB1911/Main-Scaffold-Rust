"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Code, Copy, ExternalLink, FileCode, MoreHorizontal, Play, Search, Settings, Trash2 } from "lucide-react"

export function ContractsList() {
  const [searchQuery, setSearchQuery] = useState("")

  // This would normally fetch contracts from an API
  const contracts = [
    {
      id: "nft-contract",
      name: "NFT Token Contract",
      description: "Implements the NFT standard for Stellar",
      language: "Rust",
      status: "deployed",
      network: "testnet",
      lastUpdated: "2 days ago",
      address: "CDXF5NBHVSN6HBVLKP4GZPTYERDZQ4WYTFPBZ6NNLFWVHJKPVAUTCAT2",
    },
    {
      id: "marketplace-contract",
      name: "NFT Marketplace Contract",
      description: "Handles listing, buying, and selling of NFTs",
      language: "Rust",
      status: "deployed",
      network: "testnet",
      lastUpdated: "2 days ago",
      address: "GBXDVFQ4NSGN5CSPNBWQAVIBXVG5LPGBZJMRJVYRZPKXRWWM4QI5VZ6G",
    },
    {
      id: "dao-voting",
      name: "DAO Voting Contract",
      description: "Handles proposal creation and voting",
      language: "Rust",
      status: "deployed",
      network: "mainnet",
      lastUpdated: "1 week ago",
      address: "GCRDTBFS4IMLPJQBFIJZFBXVWJFUHDXJVFXKGIDUYA3WZFMNXLMKBF6V",
    },
    {
      id: "dao-treasury",
      name: "DAO Treasury Contract",
      description: "Manages DAO funds with multi-signature security",
      language: "Rust",
      status: "deployed",
      network: "mainnet",
      lastUpdated: "1 week ago",
      address: "GATSLAPZF7CJZF6ATSDIUPHDKPL4JHTIJNWDKBWD7QZWVDGBVTVQPQAN",
    },
    {
      id: "token-swap",
      name: "Token Swap Contract",
      description: "Handles token swapping with liquidity pools",
      language: "Rust",
      status: "deployed",
      network: "testnet",
      lastUpdated: "3 days ago",
      address: "GBXDVFQ4NSGN5CSPNBWQAVIBXVG5LPGBZJMRJVYRZPKXRWWM4QI5VZ6G",
    },
    {
      id: "escrow-contract",
      name: "Escrow Contract",
      description: "Handles secure transactions between parties",
      language: "Rust",
      status: "development",
      lastUpdated: "1 day ago",
    },
    {
      id: "game-assets",
      name: "Game Assets Contract",
      description: "Manages in-game assets and rewards",
      language: "Rust",
      status: "development",
      lastUpdated: "Just now",
    },
  ]

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contracts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deployed">Deployed</TabsTrigger>
            <TabsTrigger value="development">In Development</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContracts.map((contract) => (
          <Card key={contract.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="line-clamp-1">{contract.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{contract.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="flex items-center gap-1">
                  <FileCode className="h-3 w-3" />
                  {contract.language}
                </Badge>
                {contract.status === "deployed" ? (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                  >
                    {contract.network === "mainnet" ? "Mainnet" : "Testnet"}
                  </Badge>
                ) : (
                  <Badge variant="outline">Development</Badge>
                )}
              </div>
              {contract.status === "deployed" && (
                <div className="flex items-center gap-2 mb-2">
                  <code className="text-xs text-muted-foreground truncate">{contract.address}</code>
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="text-sm text-muted-foreground">Last updated: {contract.lastUpdated}</div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/contracts/${contract.id}`}>
                  <Code className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              {contract.status === "deployed" ? (
                <Button size="sm" asChild>
                  <Link href={`/dashboard/contracts/${contract.id}/explorer`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Explorer
                  </Link>
                </Button>
              ) : (
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Deploy
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

