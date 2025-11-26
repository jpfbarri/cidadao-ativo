const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface Solicitacao {
  id: number
  titulo: string
  categoria: string
  categoria_id: number
  descricao: string
  endereco: string
  bairro: string
  bairro_id: number
  cep?: string
  latitude?: number
  longitude?: number
  fotos: string[]
  status: "aberta" | "em_andamento" | "resolvida"
  anonimo: boolean
  vereador_id?: number
  vereador_nome?: string
  created_at: string
  updated_at: string
  tempo_resolucao?: number
}

export interface Vereador {
  id: number
  nome: string
  partido: string
  foto_url?: string
  solicitacoes_assumidas: number
  solicitacoes_resolvidas: number
  tempo_medio_resolucao: number
  taxa_resolucao: number
  principais_areas?: Array<{ area: string; count: number }>
}

export interface Categoria {
  id: number
  nome: string
  icone?: string
}

export interface Bairro {
  id: number
  nome: string
}

// Auth helpers
export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken")
  }
  return null
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token)
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken()
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// API functions
export async function getSolicitacoes(filters?: {
  categoria?: string
  bairro?: string
  status?: string
  search?: string
  vereador_id?: number
}): Promise<{ solicitacoes: Solicitacao[]; total: number }> {
  const params = new URLSearchParams()
  if (filters?.categoria) params.append("categoria", filters.categoria)
  if (filters?.bairro) params.append("bairro", filters.bairro)
  if (filters?.status) params.append("status", filters.status)
  if (filters?.search) params.append("search", filters.search)
  if (filters?.vereador_id) params.append("vereador_id", filters.vereador_id.toString())

  const response = await fetch(`${API_BASE_URL}/api/solicitacoes?${params.toString()}`)
  if (!response.ok) throw new Error("Failed to fetch solicitações")
  return response.json()
}

export async function getSolicitacao(id: number): Promise<{ solicitacao: Solicitacao }> {
  const response = await fetch(`${API_BASE_URL}/api/solicitacoes/${id}`)
  if (!response.ok) throw new Error("Failed to fetch solicitação")
  return response.json()
}

export async function createSolicitacao(data: {
  titulo: string
  categoria_id: number
  descricao: string
  endereco?: string
  bairro?: string
  cep?: string
  latitude?: number
  longitude?: number
  fotos?: string[]
  anonimo?: boolean
}): Promise<{ message: string; solicitacao: Solicitacao }> {
  const token = getAuthToken()

  if (!token) throw new Error("Authentication required")

  try {
    const response = await fetch(`${API_BASE_URL}/api/solicitacoes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })

    const responseText = await response.text()

    if (!response.ok) {
      let error
      try {
        error = JSON.parse(responseText)
      } catch {
        error = { error: responseText || `HTTP ${response.status}: ${response.statusText}` }
      }
      throw new Error(error.error || error.msg || `Failed to create solicitação (${response.status})`)
    }

    const result = JSON.parse(responseText)
    return result
  } catch (error: any) {
    if (error.message.includes("Failed to fetch") || error.name === "TypeError") {
      throw new Error(
        "Backend não está disponível. Certifique-se de que o servidor Python está rodando em localhost:5000",
      )
    }
    throw error
  }
}

export async function updateSolicitacao(
  id: number,
  data: {
    status?: string
    vereador_id?: number
    descricao?: string
  },
): Promise<{ message: string; solicitacao: Solicitacao }> {
  const token = getAuthToken()

  if (!token) throw new Error("Authentication required")

  const response = await fetch(`${API_BASE_URL}/api/solicitacoes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update solicitação")
  }

  return response.json()
}

export async function getRecentSolicitacoes(limit = 10): Promise<{ solicitacoes: Solicitacao[] }> {
  const response = await fetch(`${API_BASE_URL}/api/solicitacoes/recent?limit=${limit}`)
  if (!response.ok) throw new Error("Failed to fetch recent solicitações")
  return response.json()
}

export async function getVereadores(): Promise<{ vereadores: Vereador[]; total: number }> {
  const response = await fetch(`${API_BASE_URL}/api/vereadores`)
  if (!response.ok) throw new Error("Failed to fetch vereadores")
  return response.json()
}

export async function getVereador(id: number): Promise<{ vereador: Vereador }> {
  const response = await fetch(`${API_BASE_URL}/api/vereadores/${id}`)
  if (!response.ok) throw new Error("Failed to fetch vereador")
  return response.json()
}

export async function getVereadorSolicitacoes(
  id: number,
  status?: string,
): Promise<{ solicitacoes: Solicitacao[]; total: number }> {
  const params = new URLSearchParams()
  if (status) params.append("status", status)

  const response = await fetch(`${API_BASE_URL}/api/vereadores/${id}/solicitacoes?${params.toString()}`)
  if (!response.ok) throw new Error("Failed to fetch vereador solicitações")
  return response.json()
}

export async function getVereadoresStats(): Promise<{
  total_solicitacoes: number
  solicitacoes_resolvidas: number
  tempo_medio_resolucao: number
  taxa_resolucao: number
  cidadaos_atendidos: number
  status_breakdown: { aberta: number; em_andamento: number; resolvida: number }
}> {
  const response = await fetch(`${API_BASE_URL}/api/vereadores/stats`)
  if (!response.ok) throw new Error("Failed to fetch stats")
  return response.json()
}

export async function getCategorias(): Promise<{ categorias: Categoria[] }> {
  const response = await fetch(`${API_BASE_URL}/api/categorias`)
  if (!response.ok) throw new Error("Failed to fetch categorias")
  return response.json()
}

export async function getBairros(): Promise<{ bairros: Bairro[] }> {
  const response = await fetch(`${API_BASE_URL}/api/bairros`)
  if (!response.ok) throw new Error("Failed to fetch bairros")
  return response.json()
}
