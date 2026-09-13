'use client';


import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import useContrato from '@/src/hooks/useContrato';
import { useCallback, useEffect } from 'react';
import { mapAssentoService } from '@/src/services/mapAssentoService';

export default function ContratosPage() {
    const {
        handleExcluir,
        carregarContratos,
        podeExcluir,
        contratos,
        carregando,
        setCarregando,
        router
    } = useContrato();

    const carregarAssento = useCallback(async () => {
        setCarregando(true);
        try {
            const dados = await mapAssentoService.getColunas();
            if (dados.length === 0 || !dados) {
                router.push('/menu/mapeamento');
            }
        } catch (error) {
            router.push('/menu/mapeamento');
        }
    }, [router]);

    useEffect(() => {
        carregarAssento();
    }, [carregarAssento]);

    const formatarData = (dataIso: string | Date | null) => {
        if (!dataIso) return 'Data indefinida';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    const formatarMoeda = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);


    if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando contratos...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            <PageHeader
                titulo="Aluguéis e Contratos"
                descricao="Gerencie o histórico e agendamentos de apresentações."
                textoBotaoAcao="Novo Contrato"
                aoClicarAcao={() => router.push('/menu/contrato/cadastrar')}
            />

            <TableContainer>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Peça</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Artista / Produtor</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Período e Turno</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contratos.map((c) => {
                            // Verifica se a dataInicio é no futuro para habilitar o botão de exclusão
                            const liberado = podeExcluir(c.dataInicio);


                            // Função auxiliar para renderizar a cor do status dinamicamente
                            const renderStatus = (status: string) => {
                                switch (status) {
                                    case 'ATIVO':
                                        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Ativo</span>;
                                    case 'EM_ANALISE':
                                        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wider">Em Análise</span>;
                                    case 'CANCELADO':
                                        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Cancelado</span>;
                                    case 'FINALIZADO':
                                        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">Finalizado</span>;
                                    default:
                                        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wider">{status || 'N/A'}</span>;
                                }
                            };

                            return (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">{c.nomePeca}</td>
                                    <td className="px-6 py-4 text-gray-600">{c.nomeArtista}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-700">
                                                {formatarData(c.dataInicio)} a {formatarData(c.dataFim)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Nova célula de Status */}
                                    <td className="px-6 py-4">
                                        {renderStatus(c.status)}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-gray-800">{formatarMoeda(c.valor)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleExcluir(c.id)}
                                                disabled={!liberado}
                                                title={liberado ? "Excluir" : "Não permitido em contratos passados ou vigentes"}
                                                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${liberado ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-200 cursor-not-allowed'}`}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {contratos.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    Nenhum contrato encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </TableContainer>
        </div>
    );
}