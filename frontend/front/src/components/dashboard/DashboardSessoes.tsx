import React from 'react';
import { SessaoDestaqueDto } from '@/src/types/dashboard';

interface Props {
    sessoes: SessaoDestaqueDto[];
}

export default function DashboardSessoes({ sessoes }: Props) {
    const formatarDataBR = (dataIso: string) => {
        if (!dataIso) return '';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    return (
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#120B18] rounded-2xl border border-violet-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="px-6 py-5 border-b border-violet-500/20 flex justify-between items-center bg-[#0B0710]/50">
                    <h3 className="text-lg font-bold text-[#F8F8F8]">Sessões em Destaque</h3>
                </div>
                <div className="p-0 overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-violet-500/10 bg-[#120B18]">
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Peça</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Artista</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-500/10">
                            {sessoes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-[#A1A1AA]">Nenhuma sessão programada.</td>
                                </tr>
                            ) : (
                                sessoes.map((sessao, index) => (
                                    <tr key={index} className="hover:bg-[#0B0710]/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-[#F8F8F8]">{sessao.nomePeca}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#A1A1AA]">{sessao.nomeArtista}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[#A1A1AA]">{formatarDataBR(sessao.data)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#7C3AED]/10 text-[#C4B5FD] border border-[#7C3AED]/20">
                                                {sessao.horario?.substring(0, 5) || sessao.horario}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}