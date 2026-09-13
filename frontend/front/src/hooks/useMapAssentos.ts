import { useState, useCallback, useEffect } from 'react';
import { Coluna } from '@/src/types/coluna';
import { Assento } from '@/src/types/assento';
import { mapAssentoService } from '@/src/services/mapAssentoService';
import router from 'next/router';

export function useMapAssentos() {
    const [columns, setColumns] = useState<Coluna[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const carregarColunas = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await mapAssentoService.getColunas();
            setColumns(data);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Erro ao carregar dados do teatro.');
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('usuarioGestus');
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carrega automaticamente ao montar o componente (opcional)
    useEffect(() => {
        carregarColunas();
    }, [carregarColunas]);

    const adicionarColuna = useCallback(async (id: string, qntd: number) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Envia para o back-end
            const newColumn = await mapAssentoService.salvarColuna(id, qntd);

            // 2. Atualiza a UI com o retorno real do banco
            setColumns((prev) => [...prev, newColumn]);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Erro ao criar fileira.');
            throw err; // Repassa o erro caso o componente queira exibir um Toast/Alerta
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Função para deletar coluna via API
    const deleteColumn = useCallback(async (id: number) => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Deleta no back-end
            await mapAssentoService.deleteColuna(id);

            // 2. Remove da UI
            setColumns((prev) => prev.filter((column) => column.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Erro ao deletar fileira.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);
    

    return {
        columns,
        isLoading,
        error,
        adicionarColuna,
        deleteColumn,
        reload: carregarColunas // Útil caso queira colocar um botão de "Atualizar" na tela
    };
}