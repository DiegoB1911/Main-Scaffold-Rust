import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ContractDebuggingUI } from "@/components/contract-debugging-ui"

export default function DebugPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <ContractDebuggingUI />
        </main>
      </div>
    </div>
  )
}

