import { useState, useCallback, useEffect } from 'react';
import { Coluna } from '@/src/types/coluna';
import { Assento } from '@/src/types/assento';
import { mapAssentoService } from '@/src/services/mapAssentoService';

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
            setError(err.message || 'Erro ao carregar dados do teatro.');
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
            setError(err.message || 'Erro ao criar fileira.');
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
            setError(err.message || 'Erro ao deletar fileira.');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Função para atualizar assento via API
    const updateSeat = useCallback(
        async (id: number, tipo: string, status: string) => {
            setError(null);
            // Aqui não usarei isLoading para não travar a tela inteira por causa de 1 assento, 
            // mas você pode criar um estado de loading específico se quiser.
            try {
                // 1. Atualiza no back-end
                const updatedSeat = await mapAssentoService.updateAssento(id, tipo, status);

                // 2. Atualiza na UI
                setColumns((prevColumns) =>
                    prevColumns.map((column) => {
                        // Verifica se a coluna contém o assento que queremos atualizar
                        const hasSeat = column.assentos.some(a => a.id === id);
                        if (!hasSeat) return column; // Se não tem, ignora essa coluna

                        // Se tem, mapeia os assentos trocando apenas o que foi atualizado
                        const updatedAssentos = column.assentos.map((assento) =>
                            assento.id === id ? updatedSeat : assento
                        );

                        // Retorna a coluna com o array novo, usando a chave correta 'assentos'
                        return { ...column, assentos: updatedAssentos };
                    })
                );
            } catch (err: any) {
                setError(err.message || 'Erro ao salvar o assento.');
                throw err;
            }
        },
        []
    );

    return {
        columns,
        isLoading,
        error,
        adicionarColuna,
        deleteColumn,
        updateSeat,
        reload: carregarColunas // Útil caso queira colocar um botão de "Atualizar" na tela
    };
}