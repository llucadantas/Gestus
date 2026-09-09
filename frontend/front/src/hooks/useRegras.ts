import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Regra } from "../types/regra";
import { regrasService } from "../services/regrasService";

export function useRegras() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regras, setRegras] = useState<Regra[]>([]);

    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [selectedDias, setSelectedDias] = useState<string[]>([]);
    const [selectedMeses, setSelectedMeses] = useState<string[]>([]);

    const carregarRegras = useCallback(async () => {
        try {
            const dados = await regrasService.getRegras();
            setRegras(dados.map((regra: Regra) => ({
                id: regra.id,
                descricao: regra.descricao,
                valor: regra.valor,
                diasSemana: regra.diasSemana || [],
                meses: regra.meses || []
            })));
        } catch (error: any) {
            console.error("Erro ao carregar regras:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('usuarioGestus');
                router.push('/login');
            }
        } finally {
            setCarregando(false);
        }
    }, [router]); // Adicionado 'router' no array de dependências

    // O useEffect DEVE ficar na raiz do Hook, nunca dentro de outra função
    useEffect(() => {
        carregarRegras();
    }, [carregarRegras]);

    // Otimizado para usar a versão mais segura de atualização de estado (prev)
    const toggleSelection = (id: string, list: string[], setList: (val: string[]) => void) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const novaRegraBackend = await regrasService.cadastrarRegra(
                descricao,
                parseFloat(preco),
                selectedDias,
                selectedMeses
            );
            
            const novaRegraFormatada = {
                id: novaRegraBackend?.id || Date.now(),
                descricao: descricao,
                valor: parseFloat(preco),
                diasSemana: selectedDias,
                meses: selectedMeses
            };

            // Usando prevRegras para garantir que pega o estado mais recente
            setRegras(prevRegras => [...prevRegras, novaRegraFormatada]);
            fecharModal();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Não foi possível salvar a regra.");
        }
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setDescricao('');
        setPreco('');
        setSelectedDias([]);
        setSelectedMeses([]);
    };

    const handleExcluir = async (id: number) => {
        const confirmacao = window.confirm("Deseja realmente excluir esta regra?");
        if (!confirmacao) return;

        try {
            await regrasService.deletarRegra(id);
            // Atualiza o estado local removendo o item, sem precisar recarregar tudo do servidor
            setRegras(prevRegras => prevRegras.filter(regra => regra.id !== id)); 
        } catch (error) {
            console.error("Erro ao excluir a regra:", error);
            alert("Não foi possível excluir a regra.");
        }
    };

    return {
        carregando,
        setCarregando,
        setDescricao,
        setIsModalOpen,
        setPreco,
        setRegras,
        setSelectedDias,
        setSelectedMeses,
        isModalOpen,
        regras,
        descricao,
        preco,
        selectedDias,
        selectedMeses,
        handleExcluir,
        handleSalvar,
        carregarRegras,
        toggleSelection,
        fecharModal
    };
}