'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import { useMenu } from '@/src/hooks/useMenu';
import ModalTodasSessoes from '@/src/components/menu/ModalTodasSessoes';
import router from 'next/router';

export default function Menu() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Injeção de Dependência: A View consome o Hook
    const {
        usuario,
        teatro,
        sessoesDestaque,
        carregando,
        carregandoSessoes
    } = useMenu();

    const [modalSessoesAberto, setModalSessoesAberto] = useState(false);

    const formatarDataBR = (dataIso: String) => {
        if (!dataIso) return '';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Carregando...
            </div>
        );
    }

    const kpis = [
        { title: "Ingressos Vendidos", value: "1.248", icon: "fa-ticket", color: "text-blue-500", bg: "bg-blue-100" },
        { title: "Aluguéis Ativos", value: "3", icon: "fa-building", color: "text-purple-500", bg: "bg-purple-100" },
        { title: "Sessões na Semana", value: "12", icon: "fa-calendar-check", color: "text-green-500", bg: "bg-green-100" },
        { title: "Receita Prevista", value: "R$ 45.900", icon: "fa-wallet", color: "text-emerald-600", bg: "bg-emerald-100" }
    ];

    const ultimosAlugueis = [
        { id: 1, produtor: "Cia. Teatral XYZ", periodo: "20 a 25 de Ago", valor: "R$ 15.000", status: "Pago" },
        { id: 2, produtor: "Escola de Música", periodo: "01 de Setembro", valor: "R$ 3.500", status: "Pendente" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans relative">
            <Sidebar
                color="#5D1B85"
                activePage="menu"
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* HEADER */}
                <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gestus focus:outline-none">
                            <i className="fa-solid fa-bars text-xl"></i>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Visão Geral</h2>
                            <p className="text-sm text-gray-500 hidden sm:block">Acompanhe o desempenho do seu teatro.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors relative">
                            <i className="fa-solid fa-bell"></i>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="w-10 h-10 rounded-full bg-gestus text-white flex items-center justify-center font-bold">
                                {usuario?.nome?.[0] || 'U'}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-800">{usuario?.nome}</p>
                                <p className="text-gray-500 text-xs">{teatro?.nome}</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* KPIS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {kpis.map((kpi, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className={`w-14 h-14 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center text-2xl shrink-0`}>
                                    <i className={`fa-solid ${kpi.icon}`}></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{kpi.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* TABELA DASHBOARD - SESSÕES EM DESTAQUE */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-800">Sessões em Destaque</h3>

                                    {/* AQUI NÓS MUDAMOS O ESTADO PARA ABRIR O MODAL */}
                                    <button
                                        onClick={() => setModalSessoesAberto(true)}
                                        className="text-sm font-medium text-gestus hover:text-gestus-dark transition-colors">
                                        Ver todas
                                    </button>
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
                                            {carregandoSessoes ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                        Carregando sessões...
                                                    </td>
                                                </tr>
                                            ) : sessoesDestaque.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                        Nenhuma sessão programada.
                                                    </td>
                                                </tr>
                                            ) : (
                                                sessoesDestaque.map((sessao, index) => (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{sessao.nomePeca}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{sessao.nomeArtista}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatarDataBR(sessao.data)}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700">
                                                                {sessao.horarioInicioPeca} às {sessao.horarioFimPeca}
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

                        {/* LISTA ALUGUÉIS */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-800">Aluguéis Recentes</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    {ultimosAlugueis.map((aluguel) => (
                                        <div key={aluguel.id} className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-gestus flex items-center justify-center shrink-0">
                                                <i className="fa-solid fa-file-signature"></i>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-800 truncate">{aluguel.produtor}</p>
                                                <p className="text-xs text-gray-500">{aluguel.periodo}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-sm font-bold text-gray-800">{aluguel.valor}</p>
                                                <p className={`text-xs font-semibold ${aluguel.status === 'Pago' ? 'text-emerald-600' : 'text-orange-500'}`}>
                                                    {aluguel.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => router.push('/menu/contrato/cadastrar')}
                                        className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-medium hover:border-gestus hover:text-gestus transition-colors text-sm"
                                    >
                                        + Novo Contrato
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* =========================================================================
                RENDERIZAÇÃO DO MODAL EXTRAÍDO
            ========================================================================= */}
            {modalSessoesAberto && (
                <ModalTodasSessoes onClose={() => setModalSessoesAberto(false)} />
            )}

        </div>
    );
}