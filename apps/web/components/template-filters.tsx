import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function TemplateFilters() {
  return (
    <div className="space-y-4">
      <div className="font-medium">Filters</div>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="text-sm font-medium">Categories</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {[
              "Marketplace",
              "DeFi",
              "Social",
              "Finance",
              "Governance",
              "Gaming",
              "Identity",
              "Enterprise",
              "Content",
            ].map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox id={`category-${category.toLowerCase()}`} />
                <Label htmlFor={`category-${category.toLowerCase()}`} className="text-sm font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="text-sm font-medium">Difficulty</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox id={`difficulty-${level.toLowerCase()}`} />
                <Label htmlFor={`difficulty-${level.toLowerCase()}`} className="text-sm font-normal">
                  {level}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
          <h3 className="text-sm font-medium">Features</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {["Multi-signature", "Time-locked", "Upgradeable", "Fee estimation", "Test suite"].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox id={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`} />
                <Label
                  htmlFor={`feature-${feature.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-normal"
                >
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Button variant="outline" size="sm" className="w-full">
        Reset Filters
      </Button>
    </div>
  )
}

