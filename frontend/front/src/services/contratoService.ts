import { api } from './api';
import { ContratoAluguelRequest } from '../types/contrato';

export const contratoService = {
    getContratos: async () => {
        const response = await api.get('/v1/aluguel');
        return response.data;
    },

    cadastrarContrato: async (payload: ContratoAluguelRequest) => {

        const response = await api.post('/v1/aluguel', payload);
        return response.data;
    },

    excluirContrato: async (idContrato: number) => {
        const response = await api.put(`/v1/aluguel/${idContrato}`);
        return response.data;
    }
};