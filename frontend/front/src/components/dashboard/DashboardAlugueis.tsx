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

    // Função auxiliar para definir a cor do status
    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'ATIVO': return 'text-green-600';
            case 'EM_ANALISE': return 'text-yellow-600';
            case 'CANCELADO': return 'text-red-600';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Aluguéis Recentes</h3>
                </div>
                <div className="p-6 space-y-6">
                    {alugueis.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhum contrato recente.</p>
                    ) : (
                        alugueis.map((aluguel) => (
                            <div key={aluguel.id} className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-gestus flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-file-signature"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{aluguel.nomePeca}</p>
                                    <p className="text-xs text-gray-500">{formatarDataBR(aluguel.dataInicio)} a {formatarDataBR(aluguel.dataFim)}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-gray-800">{formatarMoeda(aluguel.valor)}</p>
                                    <p className={`text-xs font-semibold ${getStatusColor(aluguel.status)}`}>
                                        {aluguel.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <button 
                        onClick={() => router.push('/menu/contrato/cadastrar')}
                        className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-medium hover:border-gestus hover:text-gestus transition-colors text-sm"
                    >
                        + Novo Contrato
                    </button>
                </div>
            </div>
        </div>
    );
}