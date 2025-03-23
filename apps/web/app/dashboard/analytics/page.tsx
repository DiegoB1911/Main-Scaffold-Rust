import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AnalyticsOverview } from "@/components/analytics-overview"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { AnalyticsTable } from "@/components/analytics-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Monitor performance and usage metrics for your dapps and smart contracts
            </p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <AnalyticsOverview />
                <AnalyticsCharts />
                <AnalyticsTable />
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="space-y-6">
                <AnalyticsCharts type="transactions" />
                <AnalyticsTable type="transactions" />
              </div>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-6">
                <AnalyticsCharts type="users" />
                <AnalyticsTable type="users" />
              </div>
            </TabsContent>

            <TabsContent value="contracts">
              <div className="space-y-6">
                <AnalyticsCharts type="contracts" />
                <AnalyticsTable type="contracts" />
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

