"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowRight, Check, Github } from "lucide-react"

export function NewProjectForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleCreate = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard/projects")
    }, 1500)
  }

  const templates = [
    {
      id: "marketplace",
      title: "NFT Marketplace",
      description: "Complete dapp for buying, selling, and trading NFTs on Stellar",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "dao",
      title: "DAO Governance",
      description: "Complete governance system with proposal and voting mechanisms",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "defi-exchange",
      title: "DeFi Exchange",
      description: "Decentralized exchange with liquidity pools and token swapping",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "crowdfunding",
      title: "Crowdfunding Platform",
      description: "Decentralized fundraising with milestone-based releases",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "identity",
      title: "Decentralized Identity",
      description: "Self-sovereign identity system with verifiable credentials",
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "gaming",
      title: "Web3 Game Platform",
      description: "Gaming platform with in-game assets and rewards on Stellar",
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="mb-8 w-full">
          <TabsTrigger value="template" className="flex-1">
            From Template
          </TabsTrigger>
          <TabsTrigger value="github" className="flex-1">
            From GitHub
          </TabsTrigger>
          <TabsTrigger value="scratch" className="flex-1">
            From Scratch
          </TabsTrigger>
        </TabsList>

        <TabsContent value="template">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="aspect-video relative rounded-md overflow-hidden mb-2">
                        <Image
                          src={template.image || "/placeholder.svg"}
                          alt={template.title}
                          fill
                          className="object-cover"
                        />
                        {selectedTemplate === template.id && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check className="h-8 w-8 text-primary" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <CardDescription>{template.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} disabled={!selectedTemplate}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>
                  Configure your new project based on the {templates.find((t) => t.id === selectedTemplate)?.title}{" "}
                  template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input id="project-name" placeholder="My Awesome Dapp" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea id="project-description" placeholder="Describe your project" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <Select defaultValue="testnet">
                      <SelectTrigger id="network">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="testnet">Testnet</SelectItem>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="local">Local Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select defaultValue="private">
                      <SelectTrigger id="visibility">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template Customization</Label>
                  <RadioGroup defaultValue="default">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="default" />
                      <Label htmlFor="default">Default configuration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="minimal" id="minimal" />
                      <Label htmlFor="minimal">Minimal (core features only)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complete" id="complete" />
                      <Label htmlFor="complete">Complete (all features)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleCreate} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="github">
          <Card>
            <CardHeader>
              <CardTitle>Import from GitHub</CardTitle>
              <CardDescription>Connect your GitHub repository to create a new project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center p-6">
                <Button size="lg" className="gap-2">
                  <Github className="h-5 w-5" />
                  Connect to GitHub
                </Button>
              </div>

              <div className="text-center text-muted-foreground">
                <p>After connecting, you'll be able to select a repository to import</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scratch">
          <Card>
            <CardHeader>
              <CardTitle>Create from Scratch</CardTitle>
              <CardDescription>Start with a blank project and build your dapp from the ground up</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name-scratch">Project Name</Label>
                <Input id="project-name-scratch" placeholder="My Awesome Dapp" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-description-scratch">Description</Label>
                <Textarea id="project-description-scratch" placeholder="Describe your project" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="network-scratch">Network</Label>
                  <Select defaultValue="testnet">
                    <SelectTrigger id="network-scratch">
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                      <SelectItem value="local">Local Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility-scratch">Visibility</Label>
                  <Select defaultValue="private">
                    <SelectTrigger id="visibility-scratch">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Structure</Label>
                <RadioGroup defaultValue="basic">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="basic" id="basic" />
                    <Label htmlFor="basic">Basic (frontend only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full-stack" id="full-stack" />
                    <Label htmlFor="full-stack">Full-stack (frontend + smart contracts)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="contracts" id="contracts" />
                    <Label htmlFor="contracts">Smart contracts only</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleCreate} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Project"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

