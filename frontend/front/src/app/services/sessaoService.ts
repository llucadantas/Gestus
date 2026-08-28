import { api } from "./api";

export const sessaoService ={
    getSessoes: async (pagina: Number, tamanho: Number) => {
            const response = await api.get('/v1/sessao/resumo?pagina='+pagina+'&tamanho='+tamanho);
            return response.data;
        }
}