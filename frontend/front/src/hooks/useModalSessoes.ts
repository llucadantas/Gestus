import { useCallback, useEffect, useState } from "react";
import { sessaoService } from "../services/sessaoService";
import { SessaoDestaque } from "../types/menu";

export function useModalSessoes(){
    const [sessoesPaginadas, setSessoesPaginadas] = useState<SessaoDestaque[]>([]);
    const [carregando, setCarregando] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const carregarSessoesModal = useCallback(async (pagina: number) => {
        setCarregando(true);
        try {
            const response = await sessaoService.getSessoesResumo(pagina, 5);
            setSessoesPaginadas(response.content || response);
            setPaginaAtual(pagina);
            setTotalPaginas(response.totalPages || 1); 
        } catch (error) {
            console.error("Erro ao carregar todas as sessões:", error);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarSessoesModal(0);
    }, [carregarSessoesModal]);

    return {
        sessoesPaginadas,
        carregando,
        paginaAtual,
        totalPaginas,
        carregarSessoesModal
    }
}