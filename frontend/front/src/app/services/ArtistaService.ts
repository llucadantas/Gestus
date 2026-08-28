import { api } from "@/src/app/services/api"

export const artistaService = {
    getArtista: async (id:number) => {
      const response = await api.get('/api/artistas/'+id);
      return response.data;
    },

    postArtista: async(nome: String, email: String) => {
      const payload = {
        nome: nome,
        email: email
      };
      const response = await api.post('/api/artistas', payload);
      return response.data;
    },

    getArtistas: async() => {
      const response = await api.get('/api/artistas')
      return response.data
    }
  };