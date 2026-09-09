import { useCallback, useEffect, useState } from "react";
import { contratoService } from "../services/contratoService";
import { Contrato } from "../types/contrato";
import { useRouter } from "next/navigation";
import { mapAssentoService } from "../services/mapAssentoService";

export default function useContrato() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [contratos, setContratos] = useState<Contrato[]>([]);

    const [modalRenovar, setModalRenovar] = useState(false);
    const [contratoSelecionado, setContratoSelecionado] = useState<any>(null);
    const [novaData, setNovaData] = useState('');
    const [salvandoRenovacao, setSalvandoRenovacao] = useState(false);

    
    const carregarContratos = useCallback(async () => {
        try {
            const dados = await contratoService.getContratos();
            setContratos(dados);
        } catch (error) {
            console.error("Erro ao carregar contratos:", error);
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

    const abrirRenovacao = (contrato: any) => {
        setContratoSelecionado(contrato);
        setNovaData('');
        setModalRenovar(true);
    };

    const handleConfirmarRenovacao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvandoRenovacao(true);
        try {
            await contratoService.renovarContrato(contratoSelecionado.id, novaData);
            alert("Contrato renovado com sucesso!");
            setModalRenovar(false);
            carregarContratos();
        } catch (error) {
            console.error("Erro ao renovar:", error);
            alert("Não foi possível renovar o contrato.");
        } finally {
            setSalvandoRenovacao(false);
        }
    };

    const handleExcluir = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir este contrato?")) return;
        try {
            await contratoService.excluirContrato(id);
            setContratos(contratos.filter(c => c.id !== id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Não foi possível excluir o contrato.");
        }
    };

    return{
        handleExcluir,
        carregarContratos,
        podeExcluir,
        handleConfirmarRenovacao,
        abrirRenovacao,
        contratos,
        setContratos,
        modalRenovar,
        setModalRenovar,
        contratoSelecionado,
        setContratoSelecionado,
        novaData,
        setNovaData,
        salvandoRenovacao,
        setSalvandoRenovacao,
        carregando,
        setCarregando,
        router    }
}