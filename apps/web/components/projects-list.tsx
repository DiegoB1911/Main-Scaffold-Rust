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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Code, Copy, ExternalLink, Github, MoreHorizontal, Play, Settings, Trash2 } from "lucide-react"

export function ProjectsList() {
  const [activeTab, setActiveTab] = useState("all")

  // This would normally fetch projects from an API
  const projects = [
    {
      id: "nft-marketplace",
      name: "Stellar NFT Marketplace",
      description: "A marketplace for buying and selling NFTs on the Stellar blockchain",
      template: "marketplace",
      status: "deployed",
      network: "testnet",
      lastUpdated: "2 days ago",
      deploymentUrl: "https://nft-marketplace.example.com",
      githubUrl: "https://github.com/example/nft-marketplace",
    },
    {
      id: "dao-governance",
      name: "Community DAO",
      description: "Decentralized governance platform for community decision making",
      template: "dao",
      status: "deployed",
      network: "mainnet",
      lastUpdated: "1 week ago",
      deploymentUrl: "https://community-dao.example.com",
      githubUrl: "https://github.com/example/community-dao",
    },
    {
      id: "defi-exchange",
      name: "StellarSwap",
      description: "Decentralized exchange for Stellar-based tokens",
      template: "defi-exchange",
      status: "deployed",
      network: "testnet",
      lastUpdated: "3 days ago",
      deploymentUrl: "https://stellarswap.example.com",
      githubUrl: "https://github.com/example/stellarswap",
    },
    {
      id: "crowdfunding",
      name: "Fund My Project",
      description: "Crowdfunding platform with milestone-based releases",
      template: "crowdfunding",
      status: "deployed",
      network: "testnet",
      lastUpdated: "5 days ago",
      deploymentUrl: "https://fundmyproject.example.com",
      githubUrl: "https://github.com/example/fund-my-project",
    },
    {
      id: "identity-app",
      name: "Stellar ID",
      description: "Self-sovereign identity system with verifiable credentials",
      template: "identity",
      status: "development",
      lastUpdated: "1 day ago",
      githubUrl: "https://github.com/example/stellar-id",
    },
    {
      id: "gaming-platform",
      name: "Cosmic Racers",
      description: "Web3 gaming platform with in-game assets and rewards",
      template: "gaming",
      status: "development",
      lastUpdated: "Just now",
      githubUrl: "https://github.com/example/cosmic-racers",
    },
    {
      id: "content-platform",
      name: "Creator Hub",
      description: "Platform for creators to monetize content directly",
      template: "content-platform",
      status: "development",
      lastUpdated: "3 days ago",
      githubUrl: "https://github.com/example/creator-hub",
    },
  ]

  const filteredProjects =
    activeTab === "all"
      ? projects
      : activeTab === "deployed"
        ? projects.filter((p) => p.status === "deployed")
        : projects.filter((p) => p.status === "development")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="deployed">Deployed</TabsTrigger>
            <TabsTrigger value="development">In Development</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Github className="mr-2 h-4 w-4" />
              Import from GitHub
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deployed" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="development" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    template: string
    status: string
    network?: string
    lastUpdated: string
    deploymentUrl?: string
    githubUrl?: string
  }
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <CardDescription className="line-clamp-2">{project.description}</CardDescription>
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
          <Badge variant="outline">
            {project.template
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
          {project.status === "deployed" ? (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              {project.network === "mainnet" ? "Mainnet" : "Testnet"}
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Development
            </Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">Last updated: {project.lastUpdated}</div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/projects/${project.id}`}>
            <Code className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        {project.status === "deployed" ? (
          <Button size="sm" asChild>
            <a href={project.deploymentUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              View
            </a>
          </Button>
        ) : (
          <Button size="sm">
            <Play className="mr-2 h-4 w-4" />
            Deploy
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

