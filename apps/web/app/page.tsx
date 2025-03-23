import Link from "next/link"
import { ArrowRight, Code, Cpu, Database, GitBranch, Globe, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { TemplateShowcase } from "@/components/template-showcase"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />

      {/* Feature Section */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Powerful Features for Stellar Developers
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to build, test, and deploy smart contracts on the Stellar blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Code className="h-10 w-10" />}
            title="Complete Dapp Templates"
            description="Pre-configured web3 applications with both frontend and smart contracts for the Stellar blockchain."
          />
          <FeatureCard
            icon={<Globe className="h-10 w-10" />}
            title="One-Click Deployment"
            description="Instantly spin up a full-stack dapp with frontend, backend, and blockchain integration."
          />
          <FeatureCard
            icon={<Database className="h-10 w-10" />}
            title="Admin Dashboard"
            description="Monitor your dapp's performance, user activity, and blockchain interactions."
          />
          <FeatureCard
            icon={<Cpu className="h-10 w-10" />}
            title="Live Debugging"
            description="Interactive simulator to test your entire application before deployment."
          />
          <FeatureCard
            icon={<GitBranch className="h-10 w-10" />}
            title="Multi-Network Support"
            description="Seamlessly deploy to Testnet or Mainnet with environment-specific configurations."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10" />}
            title="Security Audits"
            description="Built-in security analysis for both frontend and smart contracts."
          />
        </div>
      </section>

      {/* Template Showcase */}
      <section className="w-full py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Popular Templates</h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started quickly with our pre-built templates
            </p>
          </div>

          <TemplateShowcase />

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/templates">
                Browse All Templates <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="rounded-lg bg-primary p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to build on Stellar?
          </h2>
          <p className="mt-4 text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Start building your Stellar smart contracts with Scaffold RUST today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              View Documentation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

