import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ProjectsOverview } from "@/components/projects-overview"
import { ProjectsList } from "@/components/projects-list"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <main className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
              <p className="text-muted-foreground">Manage your web3 dapp projects built with Scaffold RUST</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/new-project">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          <ProjectsOverview />
          <ProjectsList />
        </main>
      </div>
    </div>
  )
}

