"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, User, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("municipe")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui seria implementada a lógica de autenticação
    console.log({ email, password, tipoUsuario })
    
    // Simulação de redirecionamento baseado no tipo de usuário
    if (tipoUsuario === "vereador") {
      window.location.href = "/dashboard-vereador"
    } else {
      window.location.href = "/"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">CidadãoAtivo</h1>
          <p className="text-gray-600">Conectando cidadãos e vereadores</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Entrar na Plataforma</CardTitle>
            <CardDescription>
              Acesse sua conta para participar da democracia local
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tipoUsuario} onValueChange={setTipoUsuario} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="municipe">Munícipe</TabsTrigger>
                <TabsTrigger value="vereador">Vereador</TabsTrigger>
              </TabsList>
              
              <TabsContent value="municipe" className="mt-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Como munícipe, você pode criar solicitações, apoiar causas e acompanhar o progresso
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="vereador" className="mt-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Lock className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-green-800">
                    Como vereador, você pode assumir solicitações, gerenciar demandas e prestar contas
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">\
