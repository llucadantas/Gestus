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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Sessões em Destaque</h3>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-white">
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Peça</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Artista</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sessoes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Nenhuma sessão programada.</td>
                                </tr>
                            ) : (
                                sessoes.map((sessao, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{sessao.nomePeca}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{sessao.nomeArtista}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatarDataBR(sessao.data)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700">
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