import { api } from "@/src/services/api"

export const authService = {
    login: async (email: String, senha: String) => {
      
      const response = await api.post('/v1/auth/login', { email, senha });
      const dadosUsuario = response.data;
      localStorage.setItem('usuarioGestus', JSON.stringify(dadosUsuario));
      return dadosUsuario
    },

    register: async (nome: string, senha: string, nomeTeatro: string, email: string) => {
      const response = await api.post('/v1/auth/register', { email, senha, nome, nomeTeatro });
      return response.status;
    },

    logout: async() => {
      const response = await api.post('/v1/auth/logout');
      return response.status;
    }
  };