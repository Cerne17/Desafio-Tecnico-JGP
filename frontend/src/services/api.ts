import type { Emissao } from "@/components/emissions/columns";

const API_URL = "http://localhost:3000";

export const api = {
  // Busca todas as emissões
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

  // Busca estatísticas
  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error("Falha ao buscar estatísticas");
    return response.json();
  },

  // Atualiza uma emissão (para o Modal de Edição)
  updateEmissao: async (id: number, data: Partial<Emissao>) => {
    const response = await fetch(`${API_URL}/emissoes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Falha ao atualizar emissão");
    return response.json();
  }
};
