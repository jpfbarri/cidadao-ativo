"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, MapPin, Upload, Camera } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NovaSolicitacaoPage() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [categoria, setCategoria] = useState("")
  const [endereco, setEndereco] = useState("")
  const [arquivos, setArquivos] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de envio
    console.log({ titulo, descricao, categoria, endereco, arquivos })
    alert("Solicitação enviada com sucesso!")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Nova Solicitação</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Descreva sua Solicitação</CardTitle>
                <CardDescription>
                  Forneça informações detalhadas para que os vereadores possam entender e resolver o problema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="titulo">Título da Solicitação *</Label>
                    <Input
                      id="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      placeholder="Ex: Buraco na Rua das Flores"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={categoria} onValueChange={setCategoria} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pavimentacao">Pavimentação</SelectItem>
                        <SelectItem value="iluminacao">Iluminação Pública</SelectItem>
                        <SelectItem value="saneamento">Saneamento</SelectItem>
                        <SelectItem value="limpeza">Limpeza Urbana</SelectItem>
                        <SelectItem value="transporte">Transporte Público</SelectItem>
                        <SelectItem value="saude">Saúde</SelectItem>
                        <SelectItem value="educacao">Educação</SelectItem>
                        <SelectItem value="seguranca">Segurança</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="endereco">Localização *</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="endereco"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        placeholder="Endereço completo ou ponto de referência"
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Seja específico para facilitar a localização do problema
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="descricao">Descrição Detalhada *</Label>
                    <Textarea
                      id="descricao"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      placeholder="Descreva o problema em detalhes, quando começou, como afeta a comunidade..."
                      rows={6}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="arquivos">Fotos e Vídeos</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="arquivos"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="arquivos" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Clique para adicionar fotos ou vídeos</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, MP4 até 10MB cada</p>
                      </label>
                    </div>
                    {arquivos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">{arquivos.length} arquivo(s) selecionado(s)</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link href="/">
                      <Button variant="outline">Cancelar</Button>
                    </Link>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Enviar Solicitação
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com Dicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Dicas para uma boa solicitação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">📍 Seja específico na localização</h4>
                  <p className="text-sm text-gray-600">
                    Inclua endereço completo, pontos de referência e número da casa quando possível.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">📸 Adicione fotos</h4>
                  <p className="text-sm text-gray-600">Imagens ajudam os vereadores a entender melhor o problema.</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">📝 Descreva o impacto</h4>
                  <p className="text-sm text-gray-600">Explique como o problema afeta você e sua comunidade.</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">⏰ Seja paciente</h4>
                  <p className="text-sm text-gray-600">
                    Os vereadores precisam de tempo para analisar e resolver as demandas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Como funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm">Você envia sua solicitação</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm">Outros cidadãos podem apoiar</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm">Um vereador assume a causa</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <p className="text-sm">Você acompanha o progresso</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <p className="text-sm">Problema resolvido!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
