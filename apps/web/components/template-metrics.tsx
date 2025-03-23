"use client"

import { Gauge, Shield, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TemplateMetricsProps {
  templateId: string
}

export function TemplateMetrics({ templateId }: TemplateMetricsProps) {
  // This would normally fetch metrics based on the template ID
  const metrics = {
    complexity: templateId === "escrow" ? 35 : templateId === "multi-sig" ? 65 : 50,
    security: templateId === "escrow" ? 85 : templateId === "multi-sig" ? 95 : 75,
    cost: templateId === "escrow" ? 0.0025 : templateId === "multi-sig" ? 0.0045 : 0.0035,
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Complexity</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Low</span>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <Progress value={metrics.complexity} className="h-2" />
          <div className="mt-1 text-xs text-right text-muted-foreground">{metrics.complexity}/100</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Security Score</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Low</span>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <Progress value={metrics.security} className="h-2" />
          <div className="mt-1 text-xs text-right text-muted-foreground">{metrics.security}/100</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Estimated Cost</span>
          </div>
          <div className="mt-2 text-center">
            <span className="text-2xl font-bold">{metrics.cost} XLM</span>
            <p className="text-xs text-muted-foreground mt-1">per transaction (average)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

