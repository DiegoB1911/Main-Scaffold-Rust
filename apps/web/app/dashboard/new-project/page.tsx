import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { NewProjectForm } from "@/components/new-project-form"

export default function NewProjectPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground">Start building your web3 dapp on the Stellar blockchain</p>
          </div>

          <NewProjectForm />
        </main>
      </div>
    </div>
  )
}

