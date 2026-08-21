import { api } from "@/src/app/services/api"

export const teatroService = {
    getTeatro: async () => {
      const response = await api.get('/v1/teatro');
      const dadosTeatro = response.data;
      return dadosTeatro;
    },

    putTeatro: async (nome: any) => {
      const response = await api.post('/v1/teatro', { nome });
      return response.status;
    }
  };