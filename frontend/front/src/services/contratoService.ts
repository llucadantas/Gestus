import { api } from './api';

export const contratoService = {
    getContratos: async () => {
        const response = await api.get('/v1/aluguel');
        return response.data;
    },

    cadastrarContrato: async (idPeca: Number, emailArtista: String, dataInicio: Date, dataFim: Date, horarioInicio: String, horarioFim: String) => {
        const payload = {
            idPeca: idPeca,
            emailArtista: emailArtista,
            dataInicio: dataInicio,
            dataFim: dataFim,
            inicioPeca: horarioInicio,
            fimPeca: horarioFim
        };
        const response = await api.post('/v1/aluguel', payload);
        return response.data;
    },

    renovarContrato: async (idContrato: number, novaData: string) => {
        const response = await api.post(`/v1/contratos/${idContrato}/renovar`, null, {
            params: { novaData }
        });
        return response.data;
    },

    excluirContrato: async (idContrato: number) => {
        const response = await api.delete(`/v1/aluguel/${idContrato}`);
        return response.data;
    }
};