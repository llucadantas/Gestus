import { api } from "@/src/services/api"

export const regrasService = {

    getRegras: async () => {
      const response = await api.get('/v1/regra');
      return response.data;
    },
    cadastrarRegra: async (descricao: string ,precoNumero: number, dias: string[], meses: string[]) => {
        const payload = {
            descricao: descricao,
            valor: precoNumero, // Mapeia para 'BigDecimal valor'
            diasSemana: dias,          // Mapeia para 'Set<DayOfWeek> dia'
            meses: meses     // Mapeia para 'Set<Month> mes'
        };

        const response = await api.post('/v1/regra', payload);

        return response.data; 
    },

    deletarRegra:  async (id: number) =>{
        const response = await api.delete('/v1/regra/'+id);
        return response.status;
    }
  };