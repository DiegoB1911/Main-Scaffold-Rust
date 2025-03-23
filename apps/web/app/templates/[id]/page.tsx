import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Copy, Download, ExternalLink, Github, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateCodePreview } from "@/components/template-code-preview"
import { TemplateVisualizer } from "@/components/template-visualizer"
import { TemplateMetrics } from "@/components/template-metrics"
import { RelatedTemplates } from "@/components/related-templates"
import { TemplateScreenshots } from "@/components/template-screenshots"
import { TemplateFeatures } from "@/components/template-features"
import { TemplateCustomization } from "@/components/template-customization"

export default function TemplatePage({ params }: { params: { id: string } }) {
  // This would normally fetch the template data based on the ID
  const template = {
    id: params.id,
    title:
      params.id === "marketplace"
        ? "NFT Marketplace"
        : params.id === "defi-exchange"
          ? "DeFi Exchange"
          : params.id === "dao"
            ? "DAO Governance"
            : "Web3 Dapp Template",
    description:
      "A complete decentralized application with both frontend and smart contracts for creating an NFT marketplace on the Stellar blockchain. This template provides everything needed to build, deploy, and run a fully functional marketplace.",
    difficulty:
      params.id === "marketplace"
        ? "Intermediate"
        : params.id === "defi-exchange"
          ? "Advanced"
          : params.id === "dao"
            ? "Advanced"
            : "Intermediate",
    stars: 156,
    category:
      params.id === "marketplace"
        ? "Marketplace"
        : params.id === "defi-exchange"
          ? "DeFi"
          : params.id === "dao"
            ? "Governance"
            : "Social",
    author: "Scaffold RUST Team",
    lastUpdated: "2 weeks ago",
    npmCommand: `npm create scaffold-stellar my-${params.id}-app --template=${params.id}`,
    image: "/placeholder.svg?height=400&width=800",
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/templates"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to templates
          </Link>
        </div>

        {/* Template Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{template.category}</Badge>
            <Badge
              variant={
                template.difficulty === "Beginner"
                  ? "secondary"
                  : template.difficulty === "Intermediate"
                    ? "outline"
                    : "destructive"
              }
            >
              {template.difficulty}
            </Badge>
            <div className="flex items-center text-muted-foreground ml-auto">
              <Star className="h-4 w-4 fill-primary stroke-primary mr-1" />
              <span className="text-sm">{template.stars}</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{template.title}</h1>

          <p className="text-muted-foreground max-w-3xl">{template.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>By {template.author}</span>
            <span>Updated {template.lastUpdated}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image src={template.image || "/placeholder.svg"} alt={template.title} fill className="object-cover" />
        </div>

        {/* NPM Command Section */}
        <div className="bg-muted rounded-lg p-4 border">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Get started with npm</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-background p-2 rounded text-sm overflow-x-auto">{template.npmCommand}</code>
              <Button variant="ghost" size="icon" title="Copy to clipboard">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Template Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="screenshots">
              <TabsList className="mb-4">
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
                <TabsTrigger value="customize">Customize</TabsTrigger>
              </TabsList>

              <TabsContent value="screenshots">
                <TemplateScreenshots templateId={params.id} />
              </TabsContent>

              <TabsContent value="features">
                <TemplateFeatures templateId={params.id} />
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <TemplateCodePreview templateId={params.id} />
              </TabsContent>

              <TabsContent value="architecture">
                <TemplateVisualizer templateId={params.id} />
              </TabsContent>

              <TabsContent value="customize">
                <TemplateCustomization templateId={params.id} />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Actions</h3>
                <div className="grid grid-cols-1 gap-2">
                  <Button className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Metrics</h3>
                <TemplateMetrics templateId={params.id} />
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Tech Stack</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Frontend</span>
                    <span className="text-muted-foreground">Next.js</span>
                    <span className="text-muted-foreground">React</span>
                    <span className="text-muted-foreground">TailwindCSS</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">Backend</span>
                    <span className="text-muted-foreground">Stellar SDK</span>
                    <span className="text-muted-foreground">Soroban</span>
                    <span className="text-muted-foreground">Rust</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Templates */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Templates</h2>
          <RelatedTemplates currentTemplateId={params.id} />
        </div>
      </div>
    </div>
  )
}

