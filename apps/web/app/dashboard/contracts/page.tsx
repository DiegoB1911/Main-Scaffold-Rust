import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ContractsList } from "@/components/contracts-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ContractsPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Contracts</h1>
              <p className="text-muted-foreground">Manage and deploy your Stellar smart contracts</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/contracts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Contract
              </Link>
            </Button>
          </div>

          <ContractsList />
        </main>
      </div>
    </div>
  )
}

