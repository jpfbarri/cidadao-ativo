"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Target, Award, Heart, ArrowLeft } from "lucide-react"
import { AuthHeader } from "@/components/auth-header"

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AuthHeader />

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-balance">Sobre o CidadãoAtivo</h1>
          <p className="text-xl text-primary-foreground/90 text-balance">
            Uma plataforma que conecta cidadãos aos seus representantes, promovendo transparência e participação ativa
            na gestão pública municipal.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Início
        </Link>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Nossa Missão</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-neutral-700 text-lg leading-relaxed mb-4">
                O CidadãoAtivo é uma plataforma digital criada para fortalecer a democracia participativa em nível
                municipal. Acreditamos que a transparência e o engajamento cidadão são fundamentais para construir
                cidades mais justas, eficientes e responsivas às necessidades da população.
              </p>
              <p className="text-neutral-700 text-lg leading-relaxed">
                Nossa missão é facilitar a comunicação entre cidadãos e vereadores, permitindo que todos acompanhem o
                desempenho dos representantes eleitos, relatem problemas urbanos e participem ativamente da construção
                de soluções para suas comunidades.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Transparência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  Todas as solicitações e o desempenho dos vereadores são públicos e acessíveis. Acreditamos que a
                  transparência é a base para a confiança entre governo e cidadãos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Participação Cidadã</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  Empoderamos os cidadãos a relatar problemas, acompanhar soluções e cobrar resultados dos seus
                  representantes de forma simples e acessível.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  Promovemos a prestação de contas por meio de métricas claras que mostram quantas solicitações cada
                  vereador assumiu e resolveu, e em quanto tempo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Compromisso Social</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600 leading-relaxed">
                  Trabalhamos para que cada solicitação seja tratada com seriedade, conectando demandas reais da
                  população com ações concretas dos gestores públicos.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-6">Como Funciona</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 mb-2">Cidadão Relata o Problema</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Qualquer cidadão pode criar uma solicitação descrevendo problemas urbanos como buracos nas ruas,
                      falta de iluminação, necessidade de melhorias em áreas públicas e muito mais. A solicitação inclui
                      localização, categoria e descrição detalhada.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 mb-2">Vereador Assume a Demanda</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      Os vereadores acessam o dashboard com todas as solicitações abertas e podem assumir aquelas que
                      estão dentro de sua área de atuação ou região. Ao assumir, o vereador se compromete publicamente a
                      trabalhar naquela demanda.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900 mb-2">Acompanhamento e Resolução</h3>
                    <p className="text-neutral-600 leading-relaxed">
                      O cidadão recebe atualizações sobre o status da sua solicitação (aberta, em andamento, resolvida).
                      Todo o processo é transparente e as estatísticas de desempenho de cada vereador ficam disponíveis
                      publicamente na página de transparência.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Pronto para Participar?</h2>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto text-balance">
            Faça parte da mudança que você quer ver na sua cidade. Relate problemas, acompanhe soluções e ajude a
            construir uma gestão pública mais transparente e eficiente.
          </p>
          <Button size="lg" asChild>
            <Link href="/nova-solicitacao">Criar Nova Solicitação</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
