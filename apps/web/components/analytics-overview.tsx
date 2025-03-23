import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, Users, Activity, Wallet, BarChart3 } from "lucide-react"

export function AnalyticsOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2,853</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500 font-medium">12%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">14,592</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500 font-medium">8%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245,382 XLM</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
            <span className="text-green-500 font-medium">18%</span> from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground flex items-center">
            <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
            <span className="text-red-500 font-medium">3%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

