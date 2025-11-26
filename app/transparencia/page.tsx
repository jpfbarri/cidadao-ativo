"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, CheckCircle2, Clock, Users, ArrowLeft } from "lucide-react"
import { getVereadores, getVereadoresStats } from "@/lib/api"
import type { Vereador } from "@/lib/api"

export default function TransparenciaPage() {
  const [vereadores, setVereadores] = useState<Vereador[]>([])
  const [stats, setStats] = useState({
    total_solicitacoes: 0,
    solicitacoes_resolvidas: 0,
    tempo_medio_resolucao: 0,
    cidadaos_atendidos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [vereadoresRes, statsRes] = await Promise.all([getVereadores(), getVereadoresStats()])
        setVereadores(vereadoresRes.vereadores)
        setStats(statsRes)
      } catch (error) {
        console.error("Error loading transparencia data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-primary">
              Transparência Municipal
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                Compartilhar
              </Button>
              <Button variant="ghost" size="sm">
                Exportar Dados
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Raio-X do Mandato dos Vereadores</h1>
            <p className="text-lg text-primary-foreground/90 mb-12 text-pretty">
              Acompanhe o desempenho e a transparência dos seus representantes eleitos
            </p>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-primary-foreground/70">Carregando estatísticas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.total_solicitacoes}</div>
                  <div className="text-sm text-primary-foreground/80">Total de Solicitações</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.solicitacoes_resolvidas}</div>
                  <div className="text-sm text-primary-foreground/80">Solicitações Resolvidas</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.tempo_medio_resolucao} dias</div>
                  <div className="text-sm text-primary-foreground/80">Tempo Médio Geral</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <Users className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.cidadaos_atendidos}</div>
                  <div className="text-sm text-primary-foreground/80">Cidadãos Atendidos</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Link>

          <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Desempenho dos Vereadores</h2>
              <p className="text-muted-foreground">Dados baseados em solicitações assumidas e resolvidas</p>
            </div>
            <div className="flex gap-3">
              <select className="px-4 py-2 border rounded-md bg-background">
                <option>Todo Período</option>
                <option>Último Semestre</option>
                <option>Último Ano</option>
              </select>
              <select className="px-4 py-2 border rounded-md bg-background">
                <option>Ranking Geral</option>
                <option>Por Taxa de Resolução</option>
                <option>Por Tempo Médio</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando dados dos vereadores...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vereadores.map((vereador, index) => (
                <div key={vereador.id} className="bg-card border rounded-lg p-6 relative">
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {vereador.nome
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{vereador.nome}</h3>
                      <p className="text-sm text-muted-foreground">{vereador.partido}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-chart-2">{vereador.solicitacoes_assumidas}</div>
                      <div className="text-xs text-muted-foreground mt-1">Assumidas</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-chart-1">{vereador.solicitacoes_resolvidas}</div>
                      <div className="text-xs text-muted-foreground mt-1">Resolvidas</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Taxa de Resolução</span>
                        <span className="text-sm font-bold">{vereador.taxa_resolucao}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${vereador.taxa_resolucao}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t">
                      <span className="text-sm text-muted-foreground">Tempo Médio de Resolução</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{vereador.tempo_medio_resolucao} dias</span>
                      </div>
                    </div>
                  </div>

                  {vereador.principais_areas && vereador.principais_areas.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Principais Áreas de Atuação</h4>
                      <div className="space-y-2">
                        {vereador.principais_areas.map((area) => (
                          <div key={area.area} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{area.area}</span>
                            <span className="font-medium">{area.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={`/transparencia/vereador/${vereador.id}`}>
                    <Button variant="outline" className="w-full mt-6 bg-transparent">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="text-xl font-bold">Comparativo de Desempenho</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Visualize o desempenho comparativo dos vereadores em diferentes métricas
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Solicitações Resolvidas</span>
                </div>
                <div className="space-y-2">
                  {vereadores.map((v) => (
                    <div key={v.id} className="flex items-center gap-3">
                      <span className="text-sm w-32 truncate">{v.nome}</span>
                      <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden">
                        <div
                          className="h-full bg-primary flex items-center justify-end pr-2 text-xs font-medium text-primary-foreground transition-all"
                          style={{
                            width: `${
                              vereadores.length > 0
                                ? (
                                    v.solicitacoes_resolvidas /
                                      Math.max(...vereadores.map((x) => x.solicitacoes_resolvidas))
                                  ) * 100
                                : 0
                            }%`,
                          }}
                        >
                          {v.solicitacoes_resolvidas}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
