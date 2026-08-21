import { api } from "@/src/app/services/api"

export const regrasService = {

    getRegras: async () => {
      const response = await api.get('/v1/regra');
      return response.data;
    },
    cadastrarRegra: async (precoNumero: number, dias: string[], meses: string[], turnos: string[]) => {
        const payload = {
            valor: precoNumero, // Mapeia para 'BigDecimal valor'
            dia: dias,          // Mapeia para 'Set<DayOfWeek> dia'
            mes: meses,         // Mapeia para 'Set<Month> mes'
            turno: turnos       // Mapeia para 'Set<Turno> turno'
        };

        const response = await api.post('/v1/regra', payload);
        return response.data; 
    },

    deletarRegra:  async (id: any) =>{
        const response = await api.post('/v1/regra/'+id);
        return response.status;
    }
  };