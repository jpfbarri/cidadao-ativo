export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: User
  message?: string
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("authToken")
  localStorage.removeItem("user")
  window.location.href = "/entrar"
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    logout()
    throw new Error("Sessão expirada. Por favor, faça login novamente.")
  }

  return response
}

export async function login(email: string, password: string): Promise<any> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || "Falha ao fazer login")
    }

    const data = await response.json()

    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return data.user
  } catch (error) {
    throw error
  }
}

export async function register(userData: {
  nome: string
  email: string
  password: string
  telefone?: string
  tipo_usuario?: string
}): Promise<any> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || "Falha ao criar conta")
  }

  const data = await response.json()

  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
  }

  return data.user
}
