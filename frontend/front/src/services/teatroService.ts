import { api } from "@/src/services/api"

export const teatroService = {
    getTeatro: async () => {
      const response = await api.get('/v1/teatro');
      const dadosTeatro = response.data;
      return dadosTeatro;
    }
  };