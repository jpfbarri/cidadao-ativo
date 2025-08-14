"use client"

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Cidadão Ativo</h1>
          <p className="text-gray-600">Acompanhe, apoie e participe das soluções da sua cidade</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Acessar conta</CardTitle>
            <CardDescription>Entre com seu e-mail e senha ou crie uma conta</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-sm">E-mail</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="email" type="email" placeholder="seu@email.com" className="pl-9" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm">Senha</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-9 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
                  </div>

                  <Button className="w-full">Entrar</Button>

                  <p className="text-xs text-center text-gray-500">
                    Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm">Nome completo</Label>
                    <Input id="name" placeholder="Seu nome" />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="text-sm">E-mail</Label>
                    <Input id="signup-email" type="email" placeholder="seu@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="text-sm">Senha</Label>
                    <Input id="signup-password" type="password" placeholder="Crie uma senha" />
                  </div>
                  <Button className="w-full">Criar conta</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
