import { Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateGrid } from "@/components/template-grid"
import { TemplateFilters } from "@/components/template-filters"

export default function TemplatesPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Template Gallery</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse our collection of complete web3 dapp templates. Each template includes both frontend components and
          smart contracts for building decentralized applications on Stellar.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-8">
        <div className="md:w-64 flex-shrink-0">
          <div className="sticky top-20">
            <TemplateFilters />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search templates..." className="w-full sm:w-[300px] pl-8" />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="sm:hidden w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
                <Tabs defaultValue="popular" className="w-full sm:w-auto">
                  <TabsList>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <TemplateGrid />
          </div>
        </div>
      </div>
    </div>
  )
}

