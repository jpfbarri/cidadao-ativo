"use client"

import { useState } from "react"
import { Bell, CheckCircle, Clock, MessageSquare, Plus, Search, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Mock data
const solicitacoesPendentes = [
  {
    id: 1,
    titulo: "Buraco na Rua das Flores",
    descricao: "Grande buraco na via principal causando acidentes",
    categoria: "Pavimentação",
    bairro: "Centro",
    apoios: 23,
    data: "2024-01-15",
    autor: "Maria Silva",
    urgencia: "Alta",
  },
  {
    id: 2,
    titulo: "Falta de iluminação na Praça do Trabalhador",
    descricao: "Várias lâmpadas queimadas comprometem a segurança dos pedestres",
    categoria: "Iluminação",
    bairro: "Vila Nova",
    apoios: 45,
    data: "2024-01-12",
    autor: "João Santos",
    urgencia: "Média",
  },
]

const minhasSolicitacoes = [
  {
    id: 3,
    titulo: "Limpeza do córrego da Vila Nova",
    descricao: "Córrego entupido causando alagamentos",
    categoria: "Saneamento",
    bairro: "Vila Nova",
    apoios: 67,
    status: "Em Andamento",
    data: "2024-01-05",
    autor: "Ana Costa",
    ultimaAtualizacao: "Reunião marcada com a Secretaria de Obras para próxima semana",
  },
]

const estatisticas = [
  { label: "Solicitações Assumidas", valor: "12", icone: TrendingUp, cor: "text-blue-600" },
  { label: "Resolvidas este Mês", valor: "8", icone: CheckCircle, cor: "text-green-600" },
  { label: "Tempo Médio Resolução", valor: "15 dias", icone: Clock, cor: "text-orange-600" },
  { label: "Cidadãos Atendidos", valor: "234", icone: Users, cor: "text-purple-600" },
]

export default function DashboardVereadorPage() {
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroUrgencia, setFiltroUrgencia] = useState("todas")
  const [novaAtualizacao, setNovaAtualizacao] = useState("")

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const assumirSolicitacao = (id: number) => {
    alert(`Solicitação ${id} assumida com sucesso!`)
  }

  const adicionarAtualizacao = (id: number) => {
    if (novaAtualizacao.trim()) {
      alert(`Atualização adicionada à solicitação ${id}`)
      setNovaAtualizacao("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-600">Dashboard - Vereador</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  CL
                </div>
                <span className="font-medium">Carlos Lima</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {estatisticas.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.valor}</p>
                  </div>
                  <stat.icone className={`w-8 h-8 ${stat.cor}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pendentes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pendentes">Solicitações Pendentes</TabsTrigger>
            <TabsTrigger value="minhas">Minhas Solicitações</TabsTrigger>
          </TabsList>

          {/* Solicitações Pendentes */}
          <TabsContent value="pendentes" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Solicitações Aguardando Análise</CardTitle>
                    <CardDescription>Solicitações que ainda não foram assumidas por nenhum vereador</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Buscar..." className="pl-10 w-64" />
                    </div>
                    <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                        <SelectItem value="iluminacao">Iluminação</SelectItem>
                        <SelectItem value="saneamento">Saneamento</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filtroUrgencia} onValueChange={setFiltroUrgencia}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {solicitacoesPendentes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                            <Badge className={getUrgenciaColor(solicitacao.urgencia)}>{solicitacao.urgencia}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{solicitacao.descricao}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>📍 {solicitacao.bairro}</span>
                            <span>🏷️ {solicitacao.categoria}</span>
                            <span>👤 {solicitacao.autor}</span>
                            <span>📅 {solicitacao.data}</span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {solicitacao.apoios} apoios
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{solicitacao.titulo}</DialogTitle>
                                <DialogDescription>Detalhes completos da solicitação</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>{solicitacao.descricao}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <strong>Categoria:</strong> {solicitacao.categoria}
                                  </div>
                                  <div>
                                    <strong>Bairro:</strong> {solicitacao.bairro}
                                  </div>
                                  <div>
                                    <strong>Autor:</strong> {solicitacao.autor}
                                  </div>
                                  <div>
                                    <strong>Data:</strong> {solicitacao.data}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            onClick={() => assumirSolicitacao(solicitacao.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            Assumir Causa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Minhas Solicitações */}
          <TabsContent value="minhas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Solicitações que Assumi</CardTitle>
                <CardDescription>Gerencie o progresso das solicitações sob sua responsabilidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {minhasSolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                            <Badge className="bg-yellow-100 text-yellow-800">{solicitacao.status}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{solicitacao.descricao}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>📍 {solicitacao.bairro}</span>
                            <span>🏷️ {solicitacao.categoria}</span>
                            <span>👤 {solicitacao.autor}</span>
                            <span>📅 {solicitacao.data}</span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {solicitacao.apoios} apoios
                            </span>
                          </div>
                          {solicitacao.ultimaAtualizacao && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Última atualização:</strong> {solicitacao.ultimaAtualizacao}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Adicionar Atualização
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Adicionar Atualização</DialogTitle>
                              <DialogDescription>Informe o progresso desta solicitação aos cidadãos</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="atualizacao">Atualização</Label>
                                <Textarea
                                  id="atualizacao"
                                  value={novaAtualizacao}
                                  onChange={(e) => setNovaAtualizacao(e.target.value)}
                                  placeholder="Descreva o progresso, próximos passos ou informações relevantes..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancelar</Button>
                                <Button onClick={() => adicionarAtualizacao(solicitacao.id)}>
                                  Publicar Atualização
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Select defaultValue={solicitacao.status}>
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                            <SelectItem value="Aguardando Informações">Aguardando Info</SelectItem>
                            <SelectItem value="Resolvida">Resolvida</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Anexar Documento
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
