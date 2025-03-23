"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, CheckCircle2, Copy, FileCode, Github, Search, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function DocsPage() {
  const pathname = usePathname()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const docsNav = [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs/introduction",
          isActive: pathname === "/docs" || pathname === "/docs/introduction",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Quick Start",
          href: "/docs/quick-start",
        },
      ],
    },
    {
      title: "Core Concepts",
      items: [
        {
          title: "Stellar Blockchain",
          href: "/docs/stellar-blockchain",
        },
        {
          title: "Smart Contracts",
          href: "/docs/smart-contracts",
        },
        {
          title: "Soroban",
          href: "/docs/soroban",
        },
        {
          title: "Rust for Blockchain",
          href: "/docs/rust-for-blockchain",
        },
      ],
    },
    {
      title: "Templates",
      items: [
        {
          title: "NFT Marketplace",
          href: "/docs/templates/nft-marketplace",
        },
        {
          title: "DAO Governance",
          href: "/docs/templates/dao-governance",
        },
        {
          title: "DeFi Exchange",
          href: "/docs/templates/defi-exchange",
        },
        {
          title: "Crowdfunding",
          href: "/docs/templates/crowdfunding",
        },
      ],
    },
    {
      title: "Guides",
      items: [
        {
          title: "Creating a Project",
          href: "/docs/guides/creating-project",
        },
        {
          title: "Writing Smart Contracts",
          href: "/docs/guides/writing-contracts",
        },
        {
          title: "Testing",
          href: "/docs/guides/testing",
        },
        {
          title: "Deployment",
          href: "/docs/guides/deployment",
        },
        {
          title: "Frontend Integration",
          href: "/docs/guides/frontend-integration",
        },
      ],
    },
    {
      title: "API Reference",
      items: [
        {
          title: "Stellar SDK",
          href: "/docs/api/stellar-sdk",
        },
        {
          title: "Soroban SDK",
          href: "/docs/api/soroban-sdk",
        },
        {
          title: "Scaffold RUST API",
          href: "/docs/api/scaffold-rust",
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          title: "Troubleshooting",
          href: "/docs/resources/troubleshooting",
        },
        {
          title: "FAQs",
          href: "/docs/resources/faqs",
        },
        {
          title: "Community",
          href: "/docs/resources/community",
        },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3">
        <div className="container">
          <div className="relative w-64 ml-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documentation..." className="w-full pl-8" />
          </div>
        </div>
      </div>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <Tabs defaultValue="docs" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="docs"
                  className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  Docs
                </TabsTrigger>
                <TabsTrigger
                  value="api"
                  className="rounded-none border-b-2 border-b-transparent bg-transparent px-4 py-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                >
                  API
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="mt-4">
              {docsNav.map((section) => (
                <div key={section.title} className="py-4">
                  <h4 className="mb-1 text-sm font-medium">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block rounded-md px-2 py-1 text-sm ${
                            item.isActive
                              ? "bg-muted font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Introduction</h1>
              <p className="text-xl text-muted-foreground">
                Welcome to Scaffold RUST, the Vercel-like platform for building, testing, and deploying smart contracts
                on the Stellar blockchain.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
                What is Scaffold RUST?
              </h2>
              <p className="leading-7">
                Scaffold RUST is a comprehensive development platform designed to simplify the process of building
                decentralized applications (dApps) on the Stellar blockchain using Rust and Soroban. It provides a set
                of tools, templates, and services that enable developers to create, test, and deploy smart contracts
                with ease.
              </p>
              <p className="leading-7">
                Whether you're building an NFT marketplace, a DAO governance system, or a DeFi application, Scaffold
                RUST provides the infrastructure and tools you need to bring your ideas to life.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">For Developers</CardTitle>
                  <CardDescription>Build and deploy smart contracts with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 my-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>Pre-built templates for common use cases</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>Integrated testing and debugging tools</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>One-click deployment to testnet or mainnet</span>
                    </li>
                  </ul>
                  <Button className="mt-2" asChild>
                    <Link href="/docs/quick-start">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">For Projects</CardTitle>
                  <CardDescription>Scale your blockchain project efficiently</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 my-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>Analytics and monitoring for your dApps</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>Collaboration tools for teams</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-primary mt-1" />
                      <span>Security auditing and best practices</span>
                    </li>
                  </ul>
                  <Button className="mt-2" variant="outline" asChild>
                    <Link href="/docs/guides/deployment">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Quick Installation</AlertTitle>
              <AlertDescription>
                Get started with Scaffold RUST in seconds using our CLI tool:
                <div className="mt-2 relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>npm create scaffold-stellar my-dapp</code>
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Key Features</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Complete Templates</h3>
                  <p className="text-muted-foreground">
                    Start with pre-built templates for NFT marketplaces, DAOs, DeFi applications, and more.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Integrated Tooling</h3>
                  <p className="text-muted-foreground">
                    Debug, test, and deploy your smart contracts with our comprehensive toolset.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Monitor your dApp's performance, user activity, and blockchain interactions.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Getting Started</h2>
              <Tabs defaultValue="npm">
                <TabsList>
                  <TabsTrigger value="npm">npm</TabsTrigger>
                  <TabsTrigger value="yarn">yarn</TabsTrigger>
                  <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                </TabsList>
                <TabsContent value="npm" className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>npm create scaffold-stellar my-dapp --template=marketplace</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>cd my-dapp && npm run dev</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="yarn" className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>yarn create scaffold-stellar my-dapp --template=marketplace</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>cd my-dapp && yarn dev</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="pnpm" className="space-y-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>pnpm create scaffold-stellar my-dapp --template=marketplace</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                      <code>cd my-dapp && pnpm dev</code>
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute right-2 top-3">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Available Templates</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>NFT Marketplace</CardTitle>
                      <Badge>Popular</Badge>
                    </div>
                    <CardDescription>Complete dapp for buying, selling, and trading NFTs on Stellar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/docs/templates/nft-marketplace">Documentation</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/templates/marketplace">Use Template</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>DAO Governance</CardTitle>
                    <CardDescription>Complete governance system with proposal and voting mechanisms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/docs/templates/dao-governance">Documentation</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href="/templates/dao">Use Template</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/templates">View All Templates</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Documentation</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileCode className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Smart Contracts</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn how to write, test, and deploy smart contracts on Stellar using Rust and Soroban.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/smart-contracts">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">CLI Reference</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore the Scaffold RUST CLI commands and options for managing your projects.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/cli-reference">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Github className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">GitHub Integration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your GitHub repository to Scaffold RUST for seamless development workflow.
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/docs/github-integration">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Community & Support</h2>
              <p className="leading-7">
                Join our community to get help, share your projects, and contribute to the Scaffold RUST ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <Link href="https://github.com/scaffold-rust" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://discord.gg/scaffold-rust" target="_blank" rel="noopener noreferrer">
                    Discord
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="https://twitter.com/scaffold_rust" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Last updated: March 21, 2023</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Edit this page
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

