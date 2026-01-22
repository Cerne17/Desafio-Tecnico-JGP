import type { Emissao } from "@/components/emissions/columns";

const API_URL = "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jgp-auth-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

export const api = {
  getEmissoes: async (): Promise<Emissao[]> => {
    const response = await fetch(`${API_URL}/emissoes`);
    if (!response.ok) throw new Error("Falha ao buscar emissões");
    return response.json();
  },

  getEmissao: async (id: number): Promise<Emissao> => {
    const response = await fetch(`${API_URL}/emissoes/${id}`);
    if (!response.ok) throw new Error("Falha ao buscar emissão");
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error("Falha ao buscar estatísticas");
    return response.json();
  },

  updateEmissao: async (id: number, data: Partial<Emissao>) => {
    const response = await fetch(`${API_URL}/emissoes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      localStorage.removeItem("jgp-auth-token");
      throw new Error("Não autorizado. Faça login novamente.");
    }

    if (!response.ok) throw new Error("Falha ao atualizar emissão");
    return response.json();
  },

  login: async (username: string, password: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Credenciais inválidas");

    const data = await response.json();
    localStorage.setItem("jgp-auth-token", data.token);
    return data.token;
  },

  logout: () => {
    localStorage.removeItem("jgp-auth-token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("jgp-auth-token");
  }
};
