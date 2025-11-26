"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Bell,
  MapPin,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  LogOut,
  User,
  MessageSquare,
  Calendar,
} from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { getSolicitacoes, type Solicitacao } from "@/lib/api"

export default function CidadaoDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [minhasSolicitacoes, setMinhasSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push("/entrar")
          return
        }

        if (currentUser.tipo_usuario === "vereador") {
          router.push("/vereador/dashboard")
          return
        }

        setUser(currentUser)

        const { solicitacoes } = await getSolicitacoes()
        setMinhasSolicitacoes(solicitacoes.slice(0, 5))
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = {
    total: minhasSolicitacoes.length,
    abertas: minhasSolicitacoes.filter((s) => s.status === "aberta").length,
    emAndamento: minhasSolicitacoes.filter((s) => s.status === "em_andamento").length,
    resolvidas: minhasSolicitacoes.filter((s) => s.status === "resolvida").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary">
              CidadãoAtivo
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {user.nome?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{user.nome}</div>
                  <div className="text-xs text-muted-foreground">Cidadão</div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Olá, {user.nome}!</h1>
          <p className="text-muted-foreground">Acompanhe suas solicitações e participe da sua cidade</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total de Solicitações</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-chart-4" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.abertas}</div>
            <div className="text-sm text-muted-foreground">Abertas</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <MessageSquare className="w-8 h-8 text-chart-2" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.emAndamento}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-8 h-8 text-chart-1" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.resolvidas}</div>
            <div className="text-sm text-muted-foreground">Resolvidas</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-6">
              <h2 className="text-xl font-bold mb-2">Tem algum problema na sua região?</h2>
              <p className="mb-4 opacity-90">Relate e acompanhe soluções para a sua cidade</p>
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                <Link href="/nova-solicitacao">
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Solicitação
                </Link>
              </Button>
            </div>

            {/* Minhas Solicitações */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Minhas Solicitações</h2>
                <Link href="/" className="text-sm text-primary hover:underline">
                  Ver Todas
                </Link>
              </div>

              {minhasSolicitacoes.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Você ainda não fez nenhuma solicitação</p>
                  <Button asChild>
                    <Link href="/nova-solicitacao">Fazer Primeira Solicitação</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {minhasSolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{solicitacao.titulo}</h3>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                solicitacao.status === "resolvida"
                                  ? "bg-chart-1/10 text-chart-1"
                                  : solicitacao.status === "em_andamento"
                                    ? "bg-chart-2/10 text-chart-2"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {solicitacao.status === "resolvida"
                                ? "Resolvida"
                                : solicitacao.status === "em_andamento"
                                  ? "Em Andamento"
                                  : "Aberta"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{solicitacao.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{solicitacao.bairro}</span>
                            </div>
                            <span>•</span>
                            <span>{solicitacao.categoria}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(solicitacao.created_at).toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                          {solicitacao.vereador_nome && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Assumida por:{" "}
                              <span className="font-medium text-foreground">{solicitacao.vereador_nome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {user.nome?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h3 className="font-bold">{user.nome}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/perfil">
                  <User className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Link>
              </Button>
            </div>

            {/* Quick Links */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/">
                    <MapPin className="w-4 h-4 mr-2" />
                    Mapa de Solicitações
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/transparencia">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Transparência
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/sobre">Sobre o Projeto</Link>
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Dicas</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>✓ Seja específico ao descrever o problema</p>
                <p>✓ Adicione fotos para melhor visualização</p>
                <p>✓ Informe o endereço exato quando possível</p>
                <p>✓ Acompanhe o status das suas solicitações</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
