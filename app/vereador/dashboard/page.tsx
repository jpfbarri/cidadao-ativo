"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, TrendingUp, Clock, CheckCircle2, AlertCircle, MapPin, LogOut } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { getSolicitacoes, updateSolicitacao, type Solicitacao } from "@/lib/api"

export default function VereadorDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [novasSolicitacoes, setNovasSolicitacoes] = useState<Solicitacao[]>([])
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

        if (currentUser.tipo_usuario !== "vereador") {
          router.push("/dashboard")
          return
        }

        setUser(currentUser)

        const { solicitacoes: novas } = await getSolicitacoes({ status: "aberta" })
        setNovasSolicitacoes(novas.filter((s) => !s.vereador_id))

        const { solicitacoes: minhas } = await getSolicitacoes({ vereador_id: currentUser.vereador_id })
        setMinhasSolicitacoes(minhas)
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

  const handleAssumir = async (solicitacaoId: number) => {
    try {
      await updateSolicitacao(solicitacaoId, {
        vereador_id: user.vereador_id,
        status: "em_andamento",
      })

      const { solicitacoes: novas } = await getSolicitacoes({ status: "aberta" })
      setNovasSolicitacoes(novas.filter((s) => !s.vereador_id))

      const { solicitacoes: minhas } = await getSolicitacoes({ vereador_id: user.vereador_id })
      setMinhasSolicitacoes(minhas)
    } catch (error) {
      console.error("Error assuming solicitação:", error)
    }
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
    assumidas: minhasSolicitacoes.length,
    resolvidas: minhasSolicitacoes.filter((s) => s.status === "resolvida").length,
    emAndamento: minhasSolicitacoes.filter((s) => s.status === "em_andamento").length,
    taxaResolucao:
      minhasSolicitacoes.length > 0
        ? Math.round(
            (minhasSolicitacoes.filter((s) => s.status === "resolvida").length / minhasSolicitacoes.length) * 100,
          )
        : 0,
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
                {novasSolicitacoes.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {user.nome
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase() || "V"}
                </div>
                <div className="text-sm">
                  <div className="font-semibold">{user.nome}</div>
                  <div className="text-xs text-muted-foreground">Vereador</div>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-chart-2" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.assumidas}</div>
            <div className="text-sm text-muted-foreground">Assumidas</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 className="w-8 h-8 text-chart-1" />
              <span className="text-xs bg-chart-1/10 text-chart-1 px-2 py-1 rounded">{stats.taxaResolucao}%</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.resolvidas}</div>
            <div className="text-sm text-muted-foreground">Resolvidas</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-chart-4" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.emAndamento}</div>
            <div className="text-sm text-muted-foreground">Em Andamento</div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-1">{novasSolicitacoes.length}</div>
            <div className="text-sm text-muted-foreground">Novas Disponíveis</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Novas Solicitações */}
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Novas Solicitações</h2>
                  <p className="text-sm text-muted-foreground">Solicitações aguardando assumir</p>
                </div>
              </div>

              {novasSolicitacoes.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Não há novas solicitações no momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {novasSolicitacoes.slice(0, 5).map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{solicitacao.titulo}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{solicitacao.descricao}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{solicitacao.bairro}</span>
                            </div>
                            <span>•</span>
                            <span>{solicitacao.categoria}</span>
                            <span>•</span>
                            <span>{new Date(solicitacao.created_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end pt-3 border-t">
                        <Button size="sm" onClick={() => handleAssumir(solicitacao.id)}>
                          Assumir Solicitação
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Minhas Solicitações */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Minhas Solicitações</h2>
              {minhasSolicitacoes.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Você ainda não assumiu nenhuma solicitação</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {minhasSolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
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
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>{solicitacao.categoria}</span>
                            <span>•</span>
                            <span>{solicitacao.bairro}</span>
                            <span>•</span>
                            <span>Assumida em {new Date(solicitacao.updated_at).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                      {solicitacao.status !== "resolvida" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={async () => {
                              await updateSolicitacao(solicitacao.id, { status: "resolvida" })
                              const { solicitacoes: minhas } = await getSolicitacoes({ vereador_id: user.vereador_id })
                              setMinhasSolicitacoes(minhas)
                            }}
                          >
                            Marcar como Resolvida
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Summary */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Resumo de Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Taxa de Resolução</span>
                    <span className="text-sm font-bold">{stats.taxaResolucao}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${stats.taxaResolucao}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-bold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/">
                    <MapPin className="w-4 h-4 mr-2" />
                    Ver Mapa de Demandas
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/transparencia">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Transparência Pública
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
