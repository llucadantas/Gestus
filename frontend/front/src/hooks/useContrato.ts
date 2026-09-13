import { useCallback, useEffect, useState } from "react";
import { contratoService } from "../services/contratoService";
import { Contrato } from "../types/contrato";
import { useRouter } from "next/navigation";
import { mapAssentoService } from "../services/mapAssentoService";

export default function useContrato() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [contratos, setContratos] = useState<Contrato[]>([]);
    
    const carregarContratos = useCallback(async () => {
        try {
            const dados = await contratoService.getContratos();
            setContratos(dados.content || dados);
        } catch (error:any) {
            console.error("Erro ao carregar contratos:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('usuarioGestus');
                router.push('/login');
            }
        } finally {
            setCarregando(false);
        }
    }, [router]);

    useEffect(() => {
        carregarContratos();
    }, [carregarContratos]);

    const podeExcluir = (dataInicioIso: Date) => {
        if (!dataInicioIso) return false;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return new Date(dataInicioIso + 'T00:00:00') > hoje;
    };

    const handleExcluir = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir este contrato?")) return;
        try {
            await contratoService.excluirContrato(id);
            setContratos(contratos.filter(c => c.id !== id));
        } catch (error: any) {
            console.error("Erro ao excluir:", error);
            const errorMessage = error.response?.data?.message || "Não foi possível excluir o contrato.";
            alert(errorMessage);
        }
    };

    return{
        handleExcluir,
        carregarContratos,
        podeExcluir,
        contratos,
        setContratos,
        carregando,
        setCarregando,
        router    
    }
}