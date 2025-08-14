"use client"

import { useState } from "react"
import { BarChart3, CheckCircle, Clock, TrendingUp, Users, Award, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Mock data dos vereadores
const vereadores = [
  {
    id: 1,
    nome: "Carlos Lima",
    partido: "PSDB",
    foto: "/placeholder.svg?height=80&width=80",
    solicitacoesAssumidas: 24,
    solicitacoesResolvidas: 18,
    tempoMedioResolucao: 12,
    taxaResolucao: 75,
    categorias: {
      Pavimentação: 8,
      Iluminação: 5,
      Saneamento: 3,
      Limpeza: 2,
    },
    ranking: 1,
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    partido: "PT",
    foto: "/placeholder.svg?height=80&width=80",
    solicitacoesAssumidas: 22,
    solicitacoesResolvidas: 20,
    tempoMedioResolucao: 10,
    taxaResolucao: 91,
    categorias: {
      Saúde: 7,
      Educação: 6,
      Saneamento: 4,
      Transporte: 3,
    },
    ranking: 2,
  },
  {
    id: 3,
    nome: "João Santos",
    partido: "PMDB",
    foto: "/placeholder.svg?height=80&width=80",
    solicitacoesAssumidas: 18,
    solicitacoesResolvidas: 12,
    tempoMedioResolucao: 18,
    taxaResolucao: 67,
    categorias: {
      Segurança: 5,
      Pavimentação: 4,
      Iluminação: 2,
      Outros: 1,
    },
    ranking: 3,
  },
]

const estatisticasGerais = [
  { label: "Total de Solicitações", valor: "342", icone: TrendingUp, cor: "text-blue-600" },
  { label: "Solicitações Resolvidas", valor: "256", icone: CheckCircle, cor: "text-green-600" },
  { label: "Tempo Médio Geral", valor: "14 dias", icone: Clock, cor: "text-orange-600" },
  { label: "Cidadãos Atendidos", valor: "1,234", icone: Users, cor: "text-purple-600" },
]

export default function DashboardPublicoPage() {
  const [periodoFiltro, setPeriodoFiltro] = useState("semestre")
  const [ordenacao, setOrdenacao] = useState("ranking")

  const getRankingIcon = (ranking: number) => {
    switch (ranking) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `${ranking}º`
    }
  }

  const vereadoressOrdenados = [...vereadores].sort((a, b) => {
    switch (ordenacao) {
      case "ranking":
        return a.ranking - b.ranking
      case "resolucoes":
        return b.solicitacoesResolvidas - a.solicitacoesResolvidas
      case "taxa":
        return b.taxaResolucao - a.taxaResolucao
      case "tempo":
        return a.tempoMedioResolucao - b.tempoMedioResolucao
      default:
        return a.ranking - b.ranking
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-600">Transparência Municipal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Compartilhar</Button>
              <Button variant="outline">Exportar Dados</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Raio-X do Mandato dos Vereadores</h2>
          <p className="text-xl mb-8 text-blue-100">
            Acompanhe o desempenho e a transparência dos seus representantes eleitos
          </p>

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {estatisticasGerais.map((stat, index) => (
              <div key={index} className="bg-blue-700 rounded-lg p-4">
                <stat.icone className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stat.valor}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Desempenho dos Vereadores</h3>
            <p className="text-gray-600">Dados baseados em solicitações assumidas e resolvidas</p>
          </div>
          <div className="flex space-x-4">
            <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trimestre">Último Trimestre</SelectItem>
                <SelectItem value="semestre">Último Semestre</SelectItem>
                <SelectItem value="ano">Último Ano</SelectItem>
                <SelectItem value="mandato">Todo o Mandato</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ranking">Ranking Geral</SelectItem>
                <SelectItem value="resolucoes">Mais Resoluções</SelectItem>
                <SelectItem value="taxa">Maior Taxa de Resolução</SelectItem>
                <SelectItem value="tempo">Menor Tempo Médio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Cards dos Vereadores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {vereadoressOrdenados.map((vereador) => (
            <Card key={vereador.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={vereador.foto || "/placeholder.svg"}
                      alt={vereador.nome}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {getRankingIcon(vereador.ranking)}
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{vereador.nome}</CardTitle>
                    <CardDescription>{vereador.partido}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Métricas Principais */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{vereador.solicitacoesAssumidas}</div>
                    <div className="text-sm text-gray-600">Assumidas</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{vereador.solicitacoesResolvidas}</div>
                    <div className="text-sm text-gray-600">Resolvidas</div>
                  </div>
                </div>

                {/* Taxa de Resolução */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Taxa de Resolução</span>
                    <span className="text-sm font-bold">{vereador.taxaResolucao}%</span>
                  </div>
                  <Progress value={vereador.taxaResolucao} className="h-2" />
                </div>

                {/* Tempo Médio */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tempo Médio de Resolução</span>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {vereador.tempoMedioResolucao} dias
                  </Badge>
                </div>

                {/* Categorias Principais */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Principais Áreas de Atuação</h4>
                  <div className="space-y-1">
                    {Object.entries(vereador.categorias)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([categoria, quantidade]) => (
                        <div key={categoria} className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">{categoria}</span>
                          <span className="font-medium">{quantidade}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Botão Ver Detalhes */}
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Ver Perfil Completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seção de Comparação */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Comparativo de Desempenho
            </CardTitle>
            <CardDescription>Visualize o desempenho comparativo dos vereadores em diferentes métricas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Gráfico de Solicitações Resolvidas */}
              <div>
                <h4 className="font-medium mb-4">Solicitações Resolvidas</h4>
                <div className="space-y-3">
                  {vereadores.map((vereador) => (
                    <div key={vereador.id} className="flex items-center space-x-4">
                      <div className="w-32 text-sm">{vereador.nome}</div>
                      <div className="flex-1">
                        <Progress
                          value={
                            (vereador.solicitacoesResolvidas /
                              Math.max(...vereadores.map((v) => v.solicitacoesResolvidas))) *
                            100
                          }
                          className="h-3"
                        />
                      </div>
                      <div className="w-12 text-sm font-medium text-right">{vereador.solicitacoesResolvidas}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de Taxa de Resolução */}
              <div>
                <h4 className="font-medium mb-4">Taxa de Resolução (%)</h4>
                <div className="space-y-3">
                  {vereadores.map((vereador) => (
                    <div key={vereador.id} className="flex items-center space-x-4">
                      <div className="w-32 text-sm">{vereador.nome}</div>
                      <div className="flex-1">
                        <Progress value={vereador.taxaResolucao} className="h-3" />
                      </div>
                      <div className="w-12 text-sm font-medium text-right">{vereador.taxaResolucao}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Como Interpretar os Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-sm">Taxa de Resolução</h4>
                <p className="text-sm text-gray-600">
                  Percentual de solicitações assumidas que foram efetivamente resolvidas
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Tempo Médio</h4>
                <p className="text-sm text-gray-600">
                  Tempo médio entre assumir uma solicitação e marcá-la como resolvida
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm">Ranking</h4>
                <p className="text-sm text-gray-600">
                  Baseado em uma combinação de taxa de resolução, quantidade e tempo médio
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Destaques do Período
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🏆</div>
                <div>
                  <h4 className="font-medium text-sm">Maior Taxa de Resolução</h4>
                  <p className="text-sm text-gray-600">Maria Oliveira - 91%</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-medium text-sm">Resolução Mais Rápida</h4>
                  <p className="text-sm text-gray-600">Maria Oliveira - 10 dias</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📊</div>
                <div>
                  <h4 className="font-medium text-sm">Mais Solicitações Assumidas</h4>
                  <p className="text-sm text-gray-600">Carlos Lima - 24 solicitações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
