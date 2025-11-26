"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, LogOut } from "lucide-react"
import { getCurrentUser, logout, type User } from "@/lib/auth"

interface AuthUser extends User {
  tipo_usuario?: string
  nome?: string
}

export function AuthHeader() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function checkAuth() {
      try {
        const currentUser = getCurrentUser() as AuthUser | null
        setUser(currentUser)
      } catch (error) {
        console.log("No user logged in")
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    router.push("/")
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            CidadãoAtivo
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/transparencia" className="text-sm font-medium hover:text-primary transition-colors">
              Transparência
            </Link>
            <Link href="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </Link>
          </nav>

          {loading ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <Link
                href={user.tipo_usuario === "vereador" ? "/vereador/dashboard" : "/dashboard"}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {user.nome?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-sm hidden sm:block">
                  <div className="font-semibold">{user.nome}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.tipo_usuario === "vereador" ? "Vereador" : "Cidadão"}
                  </div>
                </div>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/entrar">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
