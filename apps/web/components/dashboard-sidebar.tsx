"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, FileCode, Home, LineChart, LogOut, PlusCircle, Settings, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col border-r bg-muted/40 w-64">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="h-6 w-6" />
          <span className="font-bold">Scaffold RUST</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <div className="mb-4">
            <Button className="w-full justify-start" asChild>
              <Link href="/dashboard/new-project">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          <nav className="space-y-1">
            <Button
              variant={pathname === "/dashboard/projects" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/projects">
                <Home className="mr-2 h-4 w-4" />
                Projects
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/contracts" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/contracts">
                <FileCode className="mr-2 h-4 w-4" />
                Contracts
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/debug" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/debug">
                <Terminal className="mr-2 h-4 w-4" />
                Debug
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/analytics">
                <LineChart className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </nav>

          <div className="mt-6 space-y-1">
            <div className="px-3 text-xs font-medium text-muted-foreground">Settings</div>
            <Button
              variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

