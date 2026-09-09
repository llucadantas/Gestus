import { api } from "@/src/services/api"

export const pecaService = {
    getPeca: async (id:number) => {
      const response = await api.get('/v1/peca/'+id);
      return response.data;
    },

    postPeca: async(nome: String, descricao: String) => {
      const payload = {
        nome: nome,
        descricao: descricao
      };
      const response = await api.post('/v1/peca', payload);
      return response.data;
    },

    getPecas: async() => {
      const response = await api.get('/v1/peca')
      return response.data
    }
  };