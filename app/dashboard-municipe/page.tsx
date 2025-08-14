"use client"

import { useState } from "react"
import {
  Bell,
  Plus,
  Search,
  MapPin,
  Heart,
  MessageSquare,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ThumbsUp,
  Share2,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data das solicitações do usuário
const minhasSolicitacoes = [
  {
    id: 1,
    titulo: "Buraco na Rua das Flores, 123",
    descricao: "Grande buraco na via principal causando acidentes e danos aos veículos",
    categoria: "Pavimentação",
    bairro: "Centro",
    endereco: "Rua das Flores, 123 - Centro",
    status: "Em Andamento",
    data: "2024-01-15",
    apoios: 23,
    comentarios: 8,
    vereador: "Vereador Carlos Lima",
    ultimaAtualizacao: "Reunião marcada com a Secretaria de Obras para próxima semana",
    dataUltimaAtualizacao: "2024-01-20",
    fotos: ["/placeholder.svg?height=100&width=100"],
    jaApoiei: true,
  },
  {
    id: 2,
    titulo: "Falta de iluminação na Praça Central",
    descricao: "Várias lâmpadas queimadas comprometem a segurança dos pedestres durante a noite",
    categoria: "Iluminação",
    bairro: "Centro",
    endereco: "Praça Central - Centro",
    status: "Aguardando Vereador",
    data: "2024-01-10",
    apoios: 45,
    comentarios: 12,
    vereador: null,
    ultimaAtualizacao: null,
    dataUltimaAtualizacao: null,
    fotos: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    jaApoiei: false,
  },
]

// Mock data de outras solicitações que o usuário pode apoiar
const outrassolicitacoes = [
  {
    id: 3,
    titulo: "Limpeza do córrego da Vila Nova",
    descricao: "Córrego entupido causando mau cheiro e risco de alagamentos",
    categoria: "Saneamento",
    bairro: "Vila Nova",
    endereco: "Córrego da Vila Nova",
    status: "Resolvida",
    data: "2024-01-05",
    autor: "Ana Costa",
    apoios: 67,
    comentarios: 15,
    vereador: "Vereadora Maria Oliveira",
    jaApoiei: false,
    distancia: "1.2 km",
  },
  {
    id: 4,
    titulo: "Semáforo com defeito no cruzamento",
    descricao: "Semáforo intermitente causando congestionamento e risco de acidentes",
    categoria: "Trânsito",
    bairro: "Jardim América",
    endereco: "Av. Principal com Rua das Palmeiras",
    status: "Aberta",
    data: "2024-01-18",
    autor: "Roberto Silva",
    apoios: 12,
    comentarios: 3,
    vereador: null,
    jaApoiei: false,
    distancia: "2.5 km",
  },
]

// Mock data de notificações
const notificacoes = [
  {
    id: 1,
    tipo: "atualizacao",
    titulo: "Atualização na sua solicitação",
    descricao: "Vereador Carlos Lima adicionou uma atualização sobre o buraco na Rua das Flores",
    data: "2024-01-20",
    lida: false,
  },
  {
    id: 2,
    tipo: "apoio",
    titulo: "Nova pessoa apoiou sua causa",
    descricao: "Sua solicitação sobre iluminação recebeu mais 3 apoios",
    data: "2024-01-19",
    lida: false,
  },
  {
    id: 3,
    tipo: "comentario",
    titulo: "Novo comentário",
    descricao: "Alguém comentou na solicitação que você apoia",
    data: "2024-01-18",
    lida: true,
  },
]

export default function DashboardMunicipePage() {
  const [filtroStatus, setFiltroStatus] = useState("todas")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [novoComentario, setNovoComentario] = useState("")
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aguardando Vereador":
        return "bg-orange-100 text-orange-800"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Resolvida":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aguardando Vereador":
        return <Clock className="w-4 h-4" />
      case "Em Andamento":
        return <AlertCircle className="w-4 h-4" />
      case "Resolvida":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const apoiarSolicitacao = (id: number) => {
    alert(`Você apoiou a solicitação ${id}!`)
  }

  const adicionarComentario = (id: number) => {
    if (novoComentario.trim()) {
      alert(`Comentário adicionado à solicitação ${id}`)
      setNovoComentario("")
    }
  }

  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-blue-600">
                CidadãoAtivo
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard-municipe" className="text-gray-900 font-medium">
                  Meu Painel
                </Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Explorar
                </Link>
                <Link href="/dashboard-publico" className="text-gray-600 hover:text-gray-900">
                  Transparência
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

              {/* Notificações */}
              <Dialog open={notificacoesAbertas} onOpenChange={setNotificacoesAbertas}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="relative bg-transparent">
                    <Bell className="w-4 h-4" />
                    {notificacoesNaoLidas > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notificacoesNaoLidas}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notificações</DialogTitle>
                    <DialogDescription>Atualizações sobre suas solicitações</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {notificacoes.map((notificacao) => (
                      <div
                        key={notificacao.id}
                        className={`p-3 rounded-lg border ${
                          !notificacao.lida ? "bg-blue-50 border-blue-200" : "bg-gray-50"
                        }`}
                      >
                        <h4 className="font-medium text-sm">{notificacao.titulo}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notificacao.descricao}</p>
                        <p className="text-xs text-gray-500 mt-2">{notificacao.data}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <span className="font-medium">Maria Silva</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Olá, Maria! 👋</h1>
          <p className="text-gray-600">
            Acompanhe suas solicitações e descubra outras causas para apoiar na sua região
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Minhas Solicitações</p>
                  <p className="text-2xl font-bold text-gray-900">{minhasSolicitacoes.length}</p>
                </div>
                <Plus className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Causas que Apoio</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Apoios Recebidos</p>
                  <p className="text-2xl font-bold text-gray-900">68</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolvidas</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="minhas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="minhas">Minhas Solicitações</TabsTrigger>
            <TabsTrigger value="explorar">Explorar & Apoiar</TabsTrigger>
          </TabsList>

          {/* Minhas Solicitações */}
          <TabsContent value="minhas" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Suas Solicitações</CardTitle>
                    <CardDescription>Acompanhe o progresso das suas demandas</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todos os Status</SelectItem>
                        <SelectItem value="aguardando">Aguardando Vereador</SelectItem>
                        <SelectItem value="andamento">Em Andamento</SelectItem>
                        <SelectItem value="resolvida">Resolvida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {minhasSolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                            <Badge className={getStatusColor(solicitacao.status)}>
                              {getStatusIcon(solicitacao.status)}
                              <span className="ml-1">{solicitacao.status}</span>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{solicitacao.descricao}</p>

                          {/* Informações básicas */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {solicitacao.bairro}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {solicitacao.data}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {solicitacao.apoios} apoios
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {solicitacao.comentarios} comentários
                            </div>
                          </div>

                          {/* Vereador responsável */}
                          {solicitacao.vereador && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-blue-800">
                                <strong>Assumida por:</strong> {solicitacao.vereador}
                              </p>
                            </div>
                          )}

                          {/* Última atualização */}
                          {solicitacao.ultimaAtualizacao && (
                            <div className="bg-green-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-green-800">
                                <strong>Última atualização ({solicitacao.dataUltimaAtualizacao}):</strong>
                              </p>
                              <p className="text-sm text-green-700 mt-1">{solicitacao.ultimaAtualizacao}</p>
                            </div>
                          )}

                          {/* Fotos */}
                          {solicitacao.fotos && solicitacao.fotos.length > 0 && (
                            <div className="flex space-x-2 mb-4">
                              {solicitacao.fotos.map((foto, index) => (
                                <img
                                  key={index}
                                  src={foto || "/placeholder.svg"}
                                  alt={`Foto ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                          </Button>
                        </div>

                        {/* Seção de comentários */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Comentar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{solicitacao.titulo}</DialogTitle>
                              <DialogDescription>Adicione um comentário ou acompanhe a discussão</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="max-h-60 overflow-y-auto space-y-3">
                                {/* Comentários mockados */}
                                <div className="flex space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback>JS</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">João Silva</p>
                                    <p className="text-sm text-gray-600">
                                      Esse buraco realmente está causando muitos problemas. Já vi vários carros com
                                      pneus furados.
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">há 2 dias</p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex space-x-2">
                                <Textarea
                                  value={novoComentario}
                                  onChange={(e) => setNovoComentario(e.target.value)}
                                  placeholder="Adicione seu comentário..."
                                  rows={3}
                                />
                                <Button onClick={() => adicionarComentario(solicitacao.id)}>Enviar</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Explorar & Apoiar */}
          <TabsContent value="explorar" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Solicitações na sua Região</CardTitle>
                    <CardDescription>Descubra e apoie outras causas importantes</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Buscar por localização..." className="pl-10 w-64" />
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
                        <SelectItem value="transito">Trânsito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outrassolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="border rounded-lg p-6 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{solicitacao.titulo}</h3>
                            <Badge className={getStatusColor(solicitacao.status)}>
                              {getStatusIcon(solicitacao.status)}
                              <span className="ml-1">{solicitacao.status}</span>
                            </Badge>
                            <Badge variant="outline">{solicitacao.distancia}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{solicitacao.descricao}</p>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {solicitacao.bairro}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {solicitacao.data}
                            </div>
                            <div>
                              <strong>Por:</strong> {solicitacao.autor}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {solicitacao.apoios} apoios
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              {solicitacao.comentarios} comentários
                            </div>
                          </div>

                          {solicitacao.vereador && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                              <p className="text-sm text-blue-800">
                                <strong>Assumida por:</strong> {solicitacao.vereador}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Comentar
                          </Button>
                        </div>

                        <Button
                          onClick={() => apoiarSolicitacao(solicitacao.id)}
                          className={`${
                            solicitacao.jaApoiei
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                          size="sm"
                        >
                          <Heart className={`w-4 h-4 mr-2 ${solicitacao.jaApoiei ? "fill-current" : ""}`} />
                          {solicitacao.jaApoiei ? "Apoiando" : "Apoiar Causa"}
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
