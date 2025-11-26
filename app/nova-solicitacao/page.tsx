"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MapPin, Upload, X } from "lucide-react"
import { createSolicitacao, getCategorias, getBairros, getAuthToken } from "@/lib/api"
import type { Categoria, Bairro } from "@/lib/api"
import { AuthHeader } from "@/components/auth-header"

export default function NovaSolicitacaoPage() {
  const router = useRouter()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [bairros, setBairros] = useState<Bairro[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      alert("Você precisa estar logado para criar uma solicitação")
      router.push("/entrar")
      return
    }

    const tokenParts = token.split(".")
    if (tokenParts.length !== 3) {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      alert("Sua sessão expirou. Por favor, faça login novamente.")
      router.push("/entrar")
      return
    }

    Promise.all([getCategorias(), getBairros()])
      .then(([categoriasRes, bairrosRes]) => {
        setCategorias(categoriasRes.categorias)
        setBairros(bairrosRes.bairros)
      })
      .catch((error) => {
        console.error("Error loading data:", error)
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const token = getAuthToken()

    if (!token) {
      alert("Você precisa estar logado para criar uma solicitação. Redirecionando para login...")
      router.push("/entrar")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)

      const bairroSelect = formData.get("bairro") as string
      const categoriaValue = formData.get("categoria") as string

      if (!categoriaValue || categoriaValue === "") {
        alert("Por favor, selecione uma categoria")
        setLoading(false)
        return
      }

      const data = {
        titulo: formData.get("titulo") as string,
        categoria_id: Number.parseInt(categoriaValue),
        descricao: formData.get("descricao") as string,
        endereco: formData.get("endereco") as string,
        bairro: bairroSelect,
        cep: formData.get("cep") as string,
        anonimo: formData.get("anonimo") === "on",
      }

      const result = await createSolicitacao(data)

      alert("Solicitação enviada com sucesso!")
      router.push("/dashboard")
    } catch (error: any) {
      if (error.message.includes("token") || error.message.includes("expired") || error.message.includes("Invalid")) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        alert("Sua sessão expirou. Por favor, faça login novamente.")
        router.push("/entrar")
        return
      }

      alert(`Erro ao criar solicitação: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthHeader />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Link>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-balance">Nova Solicitação</h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Relate um problema ou demanda da sua região. Sua solicitação será analisada pelos vereadores da sua
              cidade.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information Card */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Informações Básicas</h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label htmlFor="titulo" className="block text-sm font-medium mb-2">
                    Título da Solicitação <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    placeholder="Ex: Buraco na Rua das Flores"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Seja claro e objetivo no título</p>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium mb-2">
                    Categoria <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="categoria"
                    name="categoria"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium mb-2">
                    Descrição Detalhada <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={5}
                    placeholder="Descreva o problema ou demanda com o máximo de detalhes possível..."
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Quanto mais detalhes, melhor será o atendimento
                  </p>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Localização</h2>

              <div className="space-y-5">
                {/* Neighborhood */}
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium mb-2">
                    Bairro <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="bairro"
                    name="bairro"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Selecione o bairro</option>
                    {bairros.map((bairro) => (
                      <option key={bairro.id} value={bairro.nome}>
                        {bairro.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium mb-2">
                    Endereço <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    placeholder="Ex: Rua das Flores, 123"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* CEP */}
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="00000-000"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Map Placeholder */}
                <div>
                  <label className="block text-sm font-medium mb-2">Marcar no Mapa</label>
                  <div className="bg-muted rounded-lg aspect-video flex items-center justify-center border border-dashed">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground mb-1">Clique para marcar a localização</p>
                      <p className="text-xs text-muted-foreground">Integração com Google Maps/OpenStreetMap</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Fotos e Documentos</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Adicione fotos para ajudar a ilustrar o problema (opcional)
              </p>

              {/* Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Clique para fazer upload ou arraste arquivos aqui</p>
                <p className="text-xs text-muted-foreground">PNG, JPG ou PDF até 10MB</p>
              </div>

              {/* Preview Area (would show uploaded images) */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Example uploaded image preview */}
                <div className="relative group">
                  <div className="aspect-square bg-muted rounded-lg border flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">Preview</span>
                  </div>
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">Informações de Contato</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Para que possamos retornar sobre o andamento da solicitação
              </p>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium mb-2">
                    Nome Completo <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2.5 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Opcional</p>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <input type="checkbox" id="anonimo" name="anonimo" className="mt-1" />
                  <div>
                    <label htmlFor="anonimo" className="text-sm font-medium cursor-pointer">
                      Manter solicitação anônima
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">Seu nome não será exibido publicamente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-muted/50 border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="termos" name="termos" className="mt-1" required />
                <label htmlFor="termos" className="text-sm cursor-pointer">
                  Li e concordo com os{" "}
                  <Link href="/termos" className="text-primary font-medium hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacidade" className="text-primary font-medium hover:underline">
                    política de privacidade
                  </Link>
                  . Estou ciente que esta é uma solicitação pública e será analisada pelos vereadores da minha cidade.{" "}
                  <span className="text-destructive">*</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                {loading ? "Enviando..." : "Enviar Solicitação"}
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent" size="lg" asChild>
                <Link href="/">Cancelar</Link>
              </Button>
            </div>

            {/* Info Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">O que acontece após enviar?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>Sua solicitação será publicada no mapa e ficará visível para todos os cidadãos</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>Outros cidadãos poderão apoiar sua demanda</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>Os vereadores analisarão e poderão assumir a solicitação</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">4.</span>
                      <span>Você receberá atualizações por e-mail sobre o andamento</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
