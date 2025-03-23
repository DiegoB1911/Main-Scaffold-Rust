import { Check, Code, Database, Globe, Layout, Lock, Server, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TemplateFeatureProps {
  templateId: string
}

export function TemplateFeatures({ templateId }: TemplateFeatureProps) {
  // This would normally fetch features based on the template ID
  const features =
    templateId === "marketplace"
      ? [
          {
            title: "User Authentication",
            description: "Complete authentication system with wallet connection and profile management",
            icon: <Users className="h-5 w-5" />,
          },
          {
            title: "NFT Listing & Discovery",
            description: "Browse, search, and filter NFTs with advanced discovery features",
            icon: <Layout className="h-5 w-5" />,
          },
          {
            title: "Bidding System",
            description: "Real-time bidding with notifications and auction management",
            icon: <Globe className="h-5 w-5" />,
          },
          {
            title: "Smart Contract Integration",
            description: "Secure NFT transactions with escrow and verification",
            icon: <Code className="h-5 w-5" />,
          },
          {
            title: "Creator Dashboard",
            description: "Analytics and management tools for NFT creators",
            icon: <Database className="h-5 w-5" />,
          },
          {
            title: "Security Features",
            description: "Fraud prevention and secure transaction handling",
            icon: <Lock className="h-5 w-5" />,
          },
        ]
      : templateId === "dao"
        ? [
            {
              title: "Governance System",
              description: "Proposal creation, voting, and execution mechanisms",
              icon: <Users className="h-5 w-5" />,
            },
            {
              title: "Token Management",
              description: "Governance token distribution and voting power calculation",
              icon: <Database className="h-5 w-5" />,
            },
            {
              title: "Treasury Management",
              description: "DAO treasury with multi-signature security and spending proposals",
              icon: <Lock className="h-5 w-5" />,
            },
            {
              title: "Member Dashboard",
              description: "Personalized dashboard showing voting power and proposal history",
              icon: <Layout className="h-5 w-5" />,
            },
            {
              title: "Smart Contract Integration",
              description: "Automated proposal execution and governance rules",
              icon: <Code className="h-5 w-5" />,
            },
            {
              title: "Analytics & Reporting",
              description: "Governance metrics and participation analytics",
              icon: <Server className="h-5 w-5" />,
            },
          ]
        : [
            {
              title: "User Authentication",
              description: "Complete authentication system with wallet connection",
              icon: <Users className="h-5 w-5" />,
            },
            {
              title: "Frontend Components",
              description: "Responsive UI components built with React and TailwindCSS",
              icon: <Layout className="h-5 w-5" />,
            },
            {
              title: "API Integration",
              description: "Connection to Stellar blockchain with transaction handling",
              icon: <Server className="h-5 w-5" />,
            },
            {
              title: "Smart Contracts",
              description: "Pre-built Rust smart contracts for core functionality",
              icon: <Code className="h-5 w-5" />,
            },
            {
              title: "Data Management",
              description: "State management and data persistence solutions",
              icon: <Database className="h-5 w-5" />,
            },
            {
              title: "Security Features",
              description: "Best practices for web3 application security",
              icon: <Lock className="h-5 w-5" />,
            },
          ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="bg-primary/10 p-2 rounded-full text-primary">{feature.icon}</div>
              <div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
          <CardDescription>
            This template provides everything you need to build and deploy a complete web3 application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Responsive frontend components</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Smart contract implementations</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">API integration layer</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Authentication system</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Deployment configuration</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Testing framework</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Documentation</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">Security best practices</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

