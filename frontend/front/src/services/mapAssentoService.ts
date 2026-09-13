
import { Coluna } from '../types/coluna';
import { api } from './api';

export const mapAssentoService = {
    getColunas: async () => {
        const response = await api.get('/v1/colunas');
        return response.data;
    },

    salvarColuna: async(identificador: string, qntd: number) => {
        const response = await api.post('/v1/colunas', {identificador, qntd});
        return response.data;
    },
    deleteColuna: async(id: number)=>{
        const response = await api.delete(`/v1/colunas/excluir/${id}`)
        return response.data;
    }
}