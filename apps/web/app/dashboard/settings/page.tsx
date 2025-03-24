import { Suspense } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SettingsTabs } from "@/components/settings-tabs"

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Suspense fallback={<div>Loading settings...</div>}>
            <SettingsTabs />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

