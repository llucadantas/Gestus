import { api } from './api';

export const contratoService = {
    // Busca todos os contratos
    getContratos: async () => {
        const response = await api.get('/v1/aluguel');
        return response.data;
    },

    // Cadastra um novo (O que já fizemos antes)
    cadastrarContrato: async (peca: any, contrato: any, artista: any) => {
        const payload = { peca, contrato, artista };
        const response = await api.post('/v1/aluguel', payload);
        return response.data;
    },

    // Renova o contrato (Duplica com nova data)
    renovarContrato: async (idContrato: number, novaData: string) => {
        // Exemplo: POST /v1/contratos/1/renovar?novaData=2026-10-15
        const response = await api.post(`/v1/contratos/${idContrato}/renovar`, null, {
            params: { novaData }
        });
        return response.data;
    },

    // Exclui um contrato
    excluirContrato: async (idContrato: number) => {
        const response = await api.delete(`/v1/aluguel/${idContrato}`);
        return response.data;
    }
};