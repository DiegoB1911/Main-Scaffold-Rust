import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedTemplatesProps {
  currentTemplateId: string
}

export function RelatedTemplates({ currentTemplateId }: RelatedTemplatesProps) {
  // This would normally fetch related templates based on the current template ID
  const relatedTemplates = [
    {
      id: "defi-exchange",
      title: "DeFi Exchange",
      description: "Decentralized exchange with liquidity pools and token swapping",
      difficulty: "Advanced",
      category: "DeFi",
    },
    {
      id: "gaming",
      title: "Web3 Game Platform",
      description: "Gaming platform with in-game assets and rewards on Stellar",
      difficulty: "Advanced",
      category: "Gaming",
    },
    {
      id: "content-platform",
      title: "Creator Content Platform",
      description: "Monetize creative content with direct creator-to-fan payments",
      difficulty: "Beginner",
      category: "Content",
    },
  ]
    .filter((template) => template.id !== currentTemplateId)
    .slice(0, 3)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedTemplates.map((template) => (
        <Link href={`/templates/${template.id}`} key={template.id} className="group">
          <Card className="h-full transition-all hover:shadow-md overflow-hidden">
            <CardHeader className="pb-2">
              <Badge variant="outline" className="mb-2 w-fit">
                {template.category}
              </Badge>
              <CardTitle className="group-hover:text-primary transition-colors">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{template.description}</p>
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

