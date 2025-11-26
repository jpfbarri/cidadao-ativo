"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react"
import { getSolicitacoes, getRecentSolicitacoes, getCategorias, getBairros, getVereadoresStats } from "@/lib/api"
import type { Solicitacao, Categoria, Bairro } from "@/lib/api"
import { SolicitacoesMap } from "@/components/solicitacoes-map"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [bairros, setBairros] = useState<Bairro[]>([])
  const [recentRequests, setRecentRequests] = useState<Solicitacao[]>([])
  const [stats, setStats] = useState({
    total_solicitacoes: 0,
    cidadaos_atendidos: 0,
    tempo_medio_resolucao: 0,
    taxa_resolucao: 0,
  })
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)
  const [allSolicitacoes, setAllSolicitacoes] = useState<Solicitacao[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockCategorias = [
      { id: 1, nome: "Pavimentação" },
      { id: 2, nome: "Iluminação" },
      { id: 3, nome: "Saúde" },
      { id: 4, nome: "Educação" },
      { id: 5, nome: "Saneamento" },
      { id: 6, nome: "Segurança" },
    ]

    const mockBairros = [
      { id: 1, nome: "Centro" },
      { id: 2, nome: "Jardim América" },
      { id: 3, nome: "Vila Nova" },
      { id: 4, nome: "Bela Vista" },
    ]

    const mockRequests = [
      {
        id: 1,
        titulo: "Buraco na Rua das Flores",
        categoria: "Pavimentação",
        categoria_id: 1,
        descricao: "Grande buraco na via principal causando acidentes",
        endereco: "Rua das Flores, 123",
        bairro: "Centro",
        bairro_id: 1,
        fotos: [],
        status: "aberta" as const,
        anonimo: false,
        vereador_nome: "Carlos Lima",
        created_at: "23 apoios",
        updated_at: "",
      },
      {
        id: 2,
        titulo: "Iluminação deficiente na Praça Central",
        categoria: "Iluminação",
        categoria_id: 2,
        descricao: "Várias lâmpadas queimadas comprometem a segurança",
        endereco: "Praça Central",
        bairro: "Centro",
        bairro_id: 1,
        fotos: [],
        status: "em_andamento" as const,
        anonimo: false,
        vereador_nome: "Carlos Lima",
        created_at: "45 apoios",
        updated_at: "",
      },
    ]

    Promise.all([getCategorias(), getBairros(), getRecentSolicitacoes(5), getVereadoresStats(), getSolicitacoes({})])
      .then(([categoriasRes, bairrosRes, recentRes, statsRes, allSolicitacoesRes]) => {
        console.log("[v0] Homepage - Loaded stats:", statsRes)
        setCategorias(categoriasRes.categorias)
        setBairros(bairrosRes.bairros)
        setRecentRequests(recentRes.solicitacoes)
        setStats({
          total_solicitacoes: statsRes.total_solicitacoes || 0,
          cidadaos_atendidos: statsRes.cidadaos_atendidos || 0,
          tempo_medio_resolucao: statsRes.tempo_medio_resolucao || 0,
          taxa_resolucao: statsRes.taxa_resolucao || 0,
        })
        setAllSolicitacoes(allSolicitacoesRes.solicitacoes || [])
        setBackendConnected(true)
        console.log("[v0] Successfully connected to backend")
      })
      .catch((error) => {
        console.log("[v0] Backend not available, using mock data:", error.message)
        setCategorias(mockCategorias)
        setBairros(mockBairros)
        setRecentRequests(mockRequests)
        setAllSolicitacoes(mockRequests)
        setStats({
          total_solicitacoes: mockRequests.length,
          cidadaos_atendidos: 0,
          tempo_medio_resolucao: 0,
          taxa_resolucao: 0,
        })
        setBackendConnected(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleSearch = async () => {
    try {
      const filters: any = {}
      if (searchTerm) filters.search = searchTerm
      if (category && category !== "Todas") filters.categoria = category
      if (neighborhood && neighborhood !== "Todos") filters.bairro = neighborhood

      const result = await getSolicitacoes(filters)
      console.log("[v0] Search results:", result)
      alert(`Encontradas ${result.total} solicitações`)
    } catch (error) {
      console.error("[v0] Search error:", error)
      alert("Erro ao buscar solicitações. Verifique se o backend está rodando.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberta":
        return "border-destructive text-destructive bg-destructive/10"
      case "em_andamento":
        return "border-chart-4 text-chart-4 bg-chart-4/10"
      case "resolvida":
        return "border-green-600 text-green-600 bg-green-50 dark:bg-green-950/30"
      default:
        return "border-muted-foreground text-muted-foreground bg-muted"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberta":
        return "Aberta"
      case "em_andamento":
        return "Em Andamento"
      case "resolvida":
        return "Resolvida"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {backendConnected === false && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm">
          <strong>⚠️ Backend desconectado.</strong> Mostrando dados de exemplo. Para usar dados reais, inicie o servidor
          Python: <code className="bg-black/20 px-2 py-1 rounded">cd backend && python app.py</code>
        </div>
      )}

      {/* Header */}
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
            <div className="flex items-center gap-3">
              <Button asChild variant="default" size="sm">
                <Link href="/nova-solicitacao">+ Nova Solicitação</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/entrar">Entrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Conecte-se com seus Vereadores</h1>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 text-pretty">
              Reporte problemas, acompanhe soluções e promova a transparência na sua cidade
            </p>

            {/* Stats */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-primary-foreground/70">Carregando estatísticas...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.total_solicitacoes}</div>
                  <div className="text-sm text-primary-foreground/80">Solicitações Ativas</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <Users className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.cidadaos_atendidos}</div>
                  <div className="text-sm text-primary-foreground/80">Cidadãos Engajados</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.tempo_medio_resolucao} dias</div>
                  <div className="text-sm text-primary-foreground/80">Tempo Médio Resolução</div>
                </div>
                <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-6">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-3 text-primary-foreground" />
                  <div className="text-3xl font-bold mb-1">{stats.taxa_resolucao}%</div>
                  <div className="text-sm text-primary-foreground/80">Taxa de Resolução</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <h2 className="text-xl font-semibold">Mapa de Solicitações</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Visualize as demandas da sua região no mapa interativo
                </p>

                {/* Map Placeholder */}
                <div className="rounded-lg aspect-[16/10] overflow-hidden">
                  <SolicitacoesMap solicitacoes={allSolicitacoes} center={[-23.5505, -46.6333]} zoom={13} />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-card rounded-lg border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="font-semibold">Filtros</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Buscar</label>
                    <input
                      type="text"
                      placeholder="Buscar solicitações..."
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.nome}>
                          {cat.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Bairro</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    >
                      <option value="">Todos</option>
                      {bairros.map((bairro) => (
                        <option key={bairro.id} value={bairro.nome}>
                          {bairro.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button className="w-full" size="default" onClick={handleSearch}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Buscar
                  </Button>
                </div>
              </div>

              {/* Recent Requests */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-4">Solicitações Recentes</h3>
                <div className="space-y-4">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <div key={request.id} className={`border-l-4 pl-3 py-2 ${getStatusColor(request.status)}`}>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{request.titulo}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                            {getStatusLabel(request.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{request.descricao}</p>
                        <div className="text-xs text-muted-foreground">
                          {request.bairro} • {request.categoria}
                        </div>
                        {request.vereador_nome && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Assumida por: {request.vereador_nome}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma solicitação recente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
