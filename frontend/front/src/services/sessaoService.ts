import { api } from "./api";

export const sessaoService = {
    getSessoesResumo: async (pagina: Number, tamanho: Number) => {
        const response = await api.get('/v1/sessao/resumo?pagina=' + pagina + '&tamanho=' + tamanho);
        return response.data;
    },

    getSessoes: async () => {
        const response = await api.get('/v1/sessao');
        return response.data;
    }
}