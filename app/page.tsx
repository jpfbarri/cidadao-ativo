"use client"

import { useState } from "react"
import { MapPin, Plus, Search, Filter, TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const solicitacoes = [
  {
    id: 1,
    titulo: "Buraco na Rua das Flores",
    descricao: "Grande buraco na via principal causando acidentes",
    categoria: "Pavimentação",
    bairro: "Centro",
    apoios: 23,
    status: "Aberta",
    data: "2024-01-15",
    autor: "Maria Silva",
    vereador: null,
  },
  {
    id: 2,
    titulo: "Iluminação deficiente na Praça Central",
    descricao: "Várias lâmpadas queimadas comprometem a segurança",
    categoria: "Iluminação",
    bairro: "Centro",
    apoios: 45,
    status: "Em Andamento",
    data: "2024-01-10",
    autor: "João Santos",
    vereador: "Vereador Carlos Lima",
  },
  {
    id: 3,
    titulo: "Falta de saneamento na Vila Nova",
    descricao: "Esgoto a céu aberto causando problemas de saúde",
    categoria: "Saneamento",
    bairro: "Vila Nova",
    apoios: 67,
    status: "Resolvida",
    data: "2024-01-05",
    autor: "Ana Costa",
    vereador: "Vereadora Maria Oliveira",
  },
]

const estatisticas = [
  { label: "Solicitações Ativas", valor: "156", icone: TrendingUp },
  { label: "Cidadãos Engajados", valor: "1,234", icone: Users },
  { label: "Tempo Médio Resolução", valor: "18 dias", icone: Clock },
  { label: "Taxa de Resolução", valor: "78%", icone: CheckCircle },
]

export default function HomePage() {
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroBairro, setFiltroBairro] = useState("todos")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aberta":
        return "bg-red-100 text-red-800"
      case "Em Andamento":
        return "bg-yellow-100 text-yellow-800"
      case "Resolvida":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-600">CidadãoAtivo</h1>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-900 font-medium">
                  Início
                </Link>
                <Link href="/dashboard-publico" className="text-gray-600 hover:text-gray-900">
                  Transparência
                </Link>
                <Link href="/sobre" className="text-gray-600 hover:text-gray-900">
                  Sobre
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/nova-solicitacao">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Solicitação
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Entrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Conecte-se com seus Vereadores</h2>
          <p className="text-xl mb-8 text-blue-100">
            Reporte problemas, acompanhe soluções e promova a transparência na sua cidade
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {estatisticas.map((stat, index) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mapa Placeholder */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Mapa de Solicitações
                </CardTitle>
                <CardDescription>Visualize as demandas da sua região no mapa interativo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <p>Mapa Interativo</p>
                    <p className="text-sm">Integração com Google Maps/OpenStreetMap</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Lista */}
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Buscar</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input placeholder="Buscar solicitações..." className="pl-10" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                      <SelectItem value="iluminacao">Iluminação</SelectItem>
                      <SelectItem value="saneamento">Saneamento</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Bairro</label>
                  <Select value={filtroBairro} onValueChange={setFiltroBairro}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="vila-nova">Vila Nova</SelectItem>
                      <SelectItem value="jardim-america">Jardim América</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Solicitações Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Solicitações Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {solicitacoes.map((solicitacao) => (
                  <div key={solicitacao.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm">{solicitacao.titulo}</h4>
                      <Badge className={getStatusColor(solicitacao.status)}>{solicitacao.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{solicitacao.descricao}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>
                        {solicitacao.bairro} • {solicitacao.categoria}
                      </span>
                      <span>{solicitacao.apoios} apoios</span>
                    </div>
                    {solicitacao.vereador && (
                      <div className="mt-2 text-xs text-blue-600">Assumida por: {solicitacao.vereador}</div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
