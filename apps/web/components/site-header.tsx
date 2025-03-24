"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Wallet, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useWallet } from "@/hooks/use-wallet"
import { Badge } from "./ui/badge"

const navigation = [
  { name: "Templates", href: "/templates" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Docs", href: "/docs" },
  { name: "Pricing", href: "/pricing" },
  { name: "Deploy", href: "/deploy-contract" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isConnected, publicKey, connect, disconnect } = useWallet();

  useEffect(() => {
    console.log("Wallet connection state changed:", isConnected);
    console.log("Public key:", publicKey);
  }, [isConnected, publicKey]);

  const handleWalletClick = async () => {
    try {
      if (isConnected) {
        console.log("Disconnecting wallet...");
        await disconnect();
      } else {
        console.log("Connecting wallet...");
        await connect();
      }
    } catch (error) {
      console.error("Error managing wallet connection:", error);
    }
  };

  const formatPublicKey = (key: string | undefined) => {
    if (!key) return '';
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center mr-6">
          <span className="hidden font-bold sm:inline-block">SCAFFOLD RUST</span>
        </Link>

        <div className="hidden md:flex md:gap-x-6 md:flex-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-4">
          <div className="hidden md:flex md:items-center md:gap-x-4">
            <ThemeToggle />
            
            {/* Wallet Connect Button */}
            {isConnected ? (
              <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors" onClick={handleWalletClick}>
                <Wallet className="h-4 w-4 text-green-500" />
                <span>{formatPublicKey(publicKey)}</span>
              </Badge>
            ) : (
              <Button variant="outline" size="sm" onClick={handleWalletClick} className="hover:border-primary">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>

          <div className="flex md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 py-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-medium ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Wallet Connect Button (Mobile) */}
            {isConnected ? (
              <div className="py-2 text-base font-medium">
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-muted transition-colors" onClick={handleWalletClick}>
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span>{formatPublicKey(publicKey)}</span>
                </Badge>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleWalletClick}
                className="w-full mt-2 mb-2 hover:border-primary"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

