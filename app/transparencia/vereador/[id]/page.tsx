"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, TrendingUp, MapPin, Calendar, AlertCircle } from "lucide-react"
import { getVereador, getVereadorSolicitacoes } from "@/lib/api"
import type { Vereador, Solicitacao } from "@/lib/api"

export default function VereadorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const [vereadorId, setVereadorId] = useState<number | null>(null)
  const [vereador, setVereador] = useState<Vereador | null>(null)
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    params.then(({ id }) => {
      setVereadorId(Number.parseInt(id))
    })
  }, [params])

  useEffect(() => {
    if (!vereadorId) return

    Promise.all([getVereador(vereadorId), getVereadorSolicitacoes(vereadorId)])
      .then(([vereadorRes, solicitacoesRes]) => {
        setVereador(vereadorRes.vereador)
        setSolicitacoes(solicitacoesRes.solicitacoes)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading vereador data:", error)
        setLoading(false)
      })
  }, [vereadorId])

  const filteredSolicitacoes =
    filterStatus === "all" ? solicitacoes : solicitacoes.filter((s) => s.status === filterStatus)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando perfil...</p>
      </div>
    )
  }

  if (!vereador) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Vereador não encontrado</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/transparencia" className="text-xl font-bold text-primary">
              Transparência Municipal
            </Link>
          </div>
        </div>
      </header>

      {/* Profile Hero */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/transparencia"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Transparência
          </Link>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {vereador.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{vereador.nome}</h1>
              <p className="text-lg text-primary-foreground/80">{vereador.partido}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-card border rounded-lg p-6">
              <TrendingUp className="w-8 h-8 text-chart-2 mb-3" />
              <div className="text-3xl font-bold mb-1">{vereador.solicitacoes_assumidas}</div>
              <div className="text-sm text-muted-foreground">Solicitações Assumidas</div>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <CheckCircle2 className="w-8 h-8 text-chart-1 mb-3" />
              <div className="text-3xl font-bold mb-1">{vereador.solicitacoes_resolvidas}</div>
              <div className="text-sm text-muted-foreground">Solicitações Resolvidas</div>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <Clock className="w-8 h-8 text-chart-3 mb-3" />
              <div className="text-3xl font-bold mb-1">{vereador.tempo_medio_resolucao}</div>
              <div className="text-sm text-muted-foreground">Dias (Tempo Médio)</div>
            </div>
            <div className="bg-card border rounded-lg p-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-lg font-bold text-primary">{vereador.taxa_resolucao}%</span>
              </div>
              <div className="text-3xl font-bold mb-1">{vereador.taxa_resolucao}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Resolução</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Areas of Work */}
      {vereador.principais_areas && vereador.principais_areas.length > 0 && (
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Principais Áreas de Atuação</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {vereador.principais_areas.map((area) => (
                <div key={area.area} className="bg-card border rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg mb-1">{area.area}</div>
                      <div className="text-sm text-muted-foreground">
                        {area.count} {area.count === 1 ? "solicitação" : "solicitações"}
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-primary">{area.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solicitações List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Solicitações Assumidas</h2>
            <select
              className="px-4 py-2 border rounded-md bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todas ({solicitacoes.length})</option>
              <option value="aberta">Abertas ({solicitacoes.filter((s) => s.status === "aberta").length})</option>
              <option value="em_andamento">
                Em Andamento ({solicitacoes.filter((s) => s.status === "em_andamento").length})
              </option>
              <option value="resolvida">
                Resolvidas ({solicitacoes.filter((s) => s.status === "resolvida").length})
              </option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredSolicitacoes.length === 0 ? (
              <div className="text-center py-12 bg-card border rounded-lg">
                <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
              </div>
            ) : (
              filteredSolicitacoes.map((solicitacao) => (
                <div key={solicitacao.id} className="bg-card border rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{solicitacao.titulo}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            solicitacao.status === "resolvida"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : solicitacao.status === "em_andamento"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {solicitacao.status === "resolvida"
                            ? "Resolvida"
                            : solicitacao.status === "em_andamento"
                              ? "Em Andamento"
                              : "Aberta"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{solicitacao.descricao}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {solicitacao.bairro && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{solicitacao.bairro}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{solicitacao.categoria}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(solicitacao.created_at).toLocaleDateString("pt-BR")}</span>
                        </div>
                        {solicitacao.tempo_resolucao && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Resolvida em {solicitacao.tempo_resolucao} dias</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
