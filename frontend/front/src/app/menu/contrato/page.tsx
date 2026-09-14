'use client';

import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import useContrato from '@/src/hooks/useContrato';
import { useCallback, useEffect } from 'react';
import { mapAssentoService } from '@/src/services/mapAssentoService';
import Sidebar from '@/src/components/menu/sideBar';

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

    if (carregando) return (
        <div className="flex h-screen bg-[#000000]">
            <Sidebar color="#0B0710" activePage="contracts" />
            <div className="flex-1 flex flex-col items-center justify-center text-[#A1A1AA]">Carregando contratos...</div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#000000] font-sans relative overflow-hidden text-[#F8F8F8]">
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <Sidebar color="#0B0710" activePage="contracts" />

            <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative z-10">
                <PageHeader
                    titulo="Aluguéis e Contratos"
                    descricao="Gerencie o histórico e agendamentos de apresentações."
                    textoBotaoAcao="Novo Contrato"
                    aoClicarAcao={() => router.push('/menu/contrato/cadastrar')}
                />

                <TableContainer>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-violet-500/10 bg-[#0B0710]/50">
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Peça</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Artista / Produtor</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Período e Turno</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-500/10">
                            {contratos.map((c) => {
                                // Verifica se a dataInicio é no futuro para habilitar o botão de exclusão
                                const liberado = podeExcluir(c.dataInicio);

                                // Função auxiliar para renderizar a cor do status dinamicamente
                                const renderStatus = (status: string) => {
                                    switch (status) {
                                        case 'ATIVO':
                                            return <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">Ativo</span>;
                                        case 'EM_ANALISE':
                                            return <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">Em Análise</span>;
                                        case 'CANCELADO':
                                            return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md text-[10px] font-bold uppercase tracking-wider">Cancelado</span>;
                                        case 'FINALIZADO':
                                            return <span className="px-3 py-1 bg-[#0B0710] text-[#A1A1AA] border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider">Finalizado</span>;
                                        default:
                                            return <span className="px-3 py-1 bg-[#0B0710] text-[#A1A1AA] border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-wider">{status || 'N/A'}</span>;
                                    }
                                };

                                return (
                                    <tr key={c.id} className="hover:bg-[#0B0710]/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-[#F8F8F8]">{c.nomePeca}</td>
                                        <td className="px-6 py-4 text-[#A1A1AA]">{c.nomeArtista}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-medium text-[#F8F8F8]">
                                                    {formatarData(c.dataInicio)} a {formatarData(c.dataFim)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStatus(c.status)}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[#C4B5FD]">{formatarMoeda(c.valor)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleExcluir(c.id)}
                                                    disabled={!liberado}
                                                    title={liberado ? "Excluir" : "Não permitido em contratos passados ou vigentes"}
                                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all border border-transparent ${liberado ? 'text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20' : 'text-white/10 cursor-not-allowed'}`}
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
                                    <td colSpan={6} className="px-6 py-12 text-center text-[#A1A1AA]">
                                        Nenhum contrato encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TableContainer>
            </main>
        </div>
    );
}