import type React from "react"
import { Inter } from "next/font/google"
import { GoogleAnalytics } from '@next/third-parties/google'
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WalletKitContextProvider } from "@/components/WalletKitContextProvider"
import { StoreProvider } from "@/store/StoreProvider"
import { LayoutContextProvider } from "@/components/layout/LayoutContextProvider"
import { QueryProvider } from "@/query/QueryProvider"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Scaffold RUST - The Platform for Stellar Smart Contracts",
  description: "Build, test, and deploy smart contracts on the Stellar blockchain using Rust",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>
            <QueryProvider>
              <WalletKitContextProvider>
                <LayoutContextProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                  </div>
                </LayoutContextProvider>
              </WalletKitContextProvider>
            </QueryProvider>
          </StoreProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-7S99TQ46SJ" />
      </body>
    </html>
  )
}
