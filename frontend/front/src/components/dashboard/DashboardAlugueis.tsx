import React from 'react';
import { AluguelRecenteDto } from '@/src/types/dashboard';
import { useRouter } from 'next/navigation';

interface Props {
    alugueis: AluguelRecenteDto[];
}

export default function DashboardAlugueis({ alugueis }: Props) {
    const router = useRouter();

    const formatarDataBR = (dataIso: string) => {
        if (!dataIso) return '';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ATIVO': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'EM_ANALISE': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'CANCELADO': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-[#A1A1AA] bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-[#120B18] rounded-2xl border border-violet-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="px-6 py-5 border-b border-violet-500/20 flex justify-between items-center bg-[#0B0710]/50">
                    <h3 className="text-lg font-bold text-[#F8F8F8]">Aluguéis Recentes</h3>
                </div>
                <div className="p-6 space-y-6">
                    {alugueis.length === 0 ? (
                        <p className="text-sm text-[#A1A1AA] text-center py-4">Nenhum contrato recente.</p>
                    ) : (
                        alugueis.map((aluguel) => (
                            <div key={aluguel.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#0B0710]/50 transition-colors border border-transparent hover:border-violet-500/10">
                                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#C4B5FD] border border-[#7C3AED]/20 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-file-signature"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#F8F8F8] truncate">{aluguel.nomePeca}</p>
                                    <p className="text-xs text-[#A1A1AA]">{formatarDataBR(aluguel.dataInicio)} a {formatarDataBR(aluguel.dataFim)}</p>
                                </div>
                                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                                    <p className="text-sm font-bold text-[#F8F8F8]">{formatarMoeda(aluguel.valor)}</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getStatusColor(aluguel.status)}`}>
                                        {aluguel.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                    <button 
                        onClick={() => router.push('/menu/contrato/cadastrar')}
                        className="w-full py-3 border border-dashed border-violet-500/30 text-[#C4B5FD] bg-[#7C3AED]/5 rounded-xl font-medium hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all text-sm flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        Novo Contrato
                    </button>
                </div>
            </div>
        </div>
    );
}