"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, ChevronDown, ExternalLink, Search } from "lucide-react"

interface AnalyticsTableProps {
  type?: "overview" | "transactions" | "users" | "contracts"
}

export function AnalyticsTable({ type = "overview" }: AnalyticsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Generate data based on type
  const data =
    type === "transactions"
      ? transactionData
      : type === "users"
        ? userData
        : type === "contracts"
          ? contractData
          : overviewData

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              {type === "transactions"
                ? "Recent Transactions"
                : type === "users"
                  ? "Active Users"
                  : type === "contracts"
                    ? "Contract Activity"
                    : "Recent Activity"}
            </CardTitle>
            <CardDescription>
              {type === "transactions"
                ? "Latest transactions across all projects"
                : type === "users"
                  ? "Most active users on the platform"
                  : type === "contracts"
                    ? "Smart contract usage and performance"
                    : "Recent activity across your dapps"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Export <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem>Export as JSON</DropdownMenuItem>
                <DropdownMenuItem>Print</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            {type === "transactions" && (
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Amount <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            )}

            {type === "users" && (
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Wallet Address</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Transactions <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Volume <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            )}

            {type === "contracts" && (
              <TableRow>
                <TableHead>Contract</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Calls <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Network</TableHead>
                <TableHead></TableHead>
              </TableRow>
            )}

            {type === "overview" && (
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            )}
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                {Object.keys(item).map((key, i) => {
                  if (key === "action") return null
                  return (
                    <TableCell key={i}>
                      {key === "status" ? (
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item[key] === "Success"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : item[key] === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                        >
                          {item[key]}
                        </div>
                      ) : (
                        item[key]
                      )}
                    </TableCell>
                  )
                })}
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Sample data for different table types
const transactionData = [
  {
    hash: "3a7e...f92d",
    project: "NFT Marketplace",
    type: "Purchase",
    amount: "125 XLM",
    status: "Success",
    time: "2 min ago",
    action: "",
  },
  {
    hash: "8c2f...a1b3",
    project: "Community DAO",
    type: "Vote",
    amount: "0 XLM",
    status: "Success",
    time: "15 min ago",
    action: "",
  },
  {
    hash: "5d9a...c4e2",
    project: "StellarSwap",
    type: "Swap",
    amount: "500 XLM",
    status: "Success",
    time: "1 hour ago",
    action: "",
  },
  {
    hash: "2b7d...e9f1",
    project: "Fund My Project",
    type: "Funding",
    amount: "1,000 XLM",
    status: "Pending",
    time: "3 hours ago",
    action: "",
  },
  {
    hash: "9e3c...b8a7",
    project: "NFT Marketplace",
    type: "Listing",
    amount: "0 XLM",
    status: "Success",
    time: "5 hours ago",
    action: "",
  },
]

const userData = [
  {
    user: "Alex Johnson",
    wallet: "GBXD...VZ6G",
    transactions: 42,
    volume: "2,845 XLM",
    lastActive: "Just now",
    action: "",
  },
  {
    user: "Sarah Williams",
    wallet: "GCRD...KBF6V",
    transactions: 38,
    volume: "1,932 XLM",
    lastActive: "5 min ago",
    action: "",
  },
  {
    user: "Michael Brown",
    wallet: "GATS...PQAN",
    transactions: 27,
    volume: "5,421 XLM",
    lastActive: "1 hour ago",
    action: "",
  },
  {
    user: "Emily Davis",
    wallet: "CDXF...CAT2",
    transactions: 19,
    volume: "892 XLM",
    lastActive: "3 hours ago",
    action: "",
  },
  {
    user: "David Wilson",
    wallet: "GBXD...VZ6G",
    transactions: 15,
    volume: "3,210 XLM",
    lastActive: "1 day ago",
    action: "",
  },
]

const contractData = [
  {
    contract: "NFT Token Contract",
    address: "CDXF...CAT2",
    project: 'NFT Marketplace", calls: 1,245, network: "Testnet',
    action: "",
  },
  {
    contract: "DAO Voting Contract",
    address: "GCRD...KBF6V",
    project: "Community DAO",
    calls: 892,
    network: "Mainnet",
    action: "",
  },
  {
    contract: "Token Swap Contract",
    address: "GBXD...VZ6G",
    project: 'StellarSwap", calls: 3,421, network: "Testnet',
    action: "",
  },
  {
    contract: "Escrow Contract",
    address: "GATS...PQAN",
    project: "Fund My Project",
    calls: 567,
    network: "Testnet",
    action: "",
  },
  {
    contract: "Game Assets Contract",
    address: "GBXD...VZ6G",
    project: "Cosmic Racers",
    calls: 321,
    network: "Development",
    action: "",
  },
]

const overviewData = [
  {
    event: "NFT Purchase",
    project: "NFT Marketplace",
    user: "Alex Johnson",
    type: "Transaction",
    time: "2 min ago",
    action: "",
  },
  {
    event: "Proposal Vote",
    project: "Community DAO",
    user: "Sarah Williams",
    type: "Governance",
    time: "15 min ago",
    action: "",
  },
  {
    event: "Token Swap",
    project: "StellarSwap",
    user: "Michael Brown",
    type: "Transaction",
    time: "1 hour ago",
    action: "",
  },
  {
    event: "Project Funding",
    project: "Fund My Project",
    user: "Emily Davis",
    type: "Transaction",
    time: "3 hours ago",
    action: "",
  },
  {
    event: "NFT Listing",
    project: "NFT Marketplace",
    user: "David Wilson",
    type: "Listing",
    time: "5 hours ago",
    action: "",
  },
]

