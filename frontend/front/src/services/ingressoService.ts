import { api } from './api';

export const ingressoService = {
    realizarVenda: async (
        idTeatroContexto: number,
        idSessao: number,
        idAssento: number,
        email: string,
        nome: string
    ) => {
        let headers: Record<string, string> = {};

        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('usuarioGestus');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user.token) {
                        // Corrigido: uso de template literal com crase
                        headers = { Authorization: `Bearer ${user.token}` };
                    }
                } catch (e) {
                    console.error("Erro ao ler token do localStorage:", e);
                }
            }
        }

        const payload = { idSessao, idAssento, email, nome };

        // Corrigido: crases na rota e withCredentials para tráfego do cookie seguro
        const response = await api.post(
            `/ingressos/teatro/${idTeatroContexto}`,
            payload,
            { 
                headers,
                withCredentials: true 
            }
        );

        return response.data;
    }
};