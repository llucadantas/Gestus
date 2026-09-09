
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
    },
    updateAssento: async(id: number, status: string, tipo: string)=>{
        const payload = {
            id: id,
            status: status,
            tipo: tipo
        }
        const response = await api.patch('/v1/colunas', payload);
        return response.data;
    }
}