import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const popularTemplates = [
  {
    id: "marketplace",
    title: "NFT Marketplace",
    description: "Complete dapp for buying, selling, and trading NFTs on Stellar",
    difficulty: "Intermediate",
    stars: 156,
    category: "Marketplace",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "defi-exchange",
    title: "DeFi Exchange",
    description: "Decentralized exchange with liquidity pools and token swapping",
    difficulty: "Advanced",
    stars: 124,
    category: "DeFi",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "dao",
    title: "DAO Governance",
    description: "Complete governance system with proposal and voting mechanisms",
    difficulty: "Advanced",
    stars: 112,
    category: "Governance",
    image: "/placeholder.svg?height=200&width=400",
  },
]

export function TemplateShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {popularTemplates.map((template) => (
        <Link href={`/templates/${template.id}`} key={template.id} className="group">
          <Card className="h-full transition-all hover:shadow-md overflow-hidden">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={template.image || "/placeholder.svg"}
                alt={template.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-3 left-3">
                  <Badge variant="outline" className="bg-black text-white border-none">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="group-hover:text-primary transition-colors text-white">
                  {template.title}
                </CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <Star className="h-4 w-4 fill-primary stroke-primary mr-1" />
                  <span className="text-sm">{template.stars}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{template.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
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
              <span className="text-sm text-muted-foreground flex items-center group-hover:text-primary transition-colors">
                View template <ArrowUpRight className="ml-1 h-3 w-3" />
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

