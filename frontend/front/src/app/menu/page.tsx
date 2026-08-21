'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { teatroService } from '../services/teatroService';
import Sidebar from '@/src/components/util/sideBar';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const [usuario, setUsuario] = useState<any>(null);
    const [teatro, setTeatro] = useState<any>(null); // Estado para o teatro
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
    const carregarDados = async () => {
        const userSalvo = localStorage.getItem('usuarioGestus');
    
        if (!userSalvo) {
            router.push('/login');
            return;
        }
        setUsuario(JSON.parse(userSalvo));

        try {
            const dadosTeatro = await teatroService.getTeatro();
            setTeatro(dadosTeatro);
        } catch (error: any) {
            console.error("Erro ao carregar dados do teatro:", error);
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('usuarioGestus');
                router.push('/login');
            }
        } finally {
            setCarregando(false);
        }
    };
    carregarDados();
}, [router]);

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                Carregando...
            </div>
        );
    }
    // =========================================================================
    // DADOS FICTÍCIOS (MOCK) - Substitua depois pelos dados vindos do seu DAO/API
    // =========================================================================
    const kpis = [
        { title: "Ingressos Vendidos", value: "1.248", icon: "fa-ticket", color: "text-blue-500", bg: "bg-blue-100" },
        { title: "Aluguéis Ativos", value: "3", icon: "fa-building", color: "text-purple-500", bg: "bg-purple-100" },
        { title: "Sessões na Semana", value: "12", icon: "fa-calendar-check", color: "text-green-500", bg: "bg-green-100" },
        { title: "Receita Prevista", value: "R$ 45.900", icon: "fa-wallet", color: "text-emerald-600", bg: "bg-emerald-100" }
    ];

    const pecasEmCartaz = [
        { id: 1, nome: "O Fantasma da Ópera", data: "Hoje, 20:00", ocupacao: "85%", status: "Confirmado" },
        { id: 2, nome: "Comédia em Pé", data: "Sexta, 21:00", ocupacao: "40%", status: "Vendas Abertas" },
        { id: 3, nome: "Festival de Dança", data: "Sábado, 19:00", ocupacao: "95%", status: "Quase Esgotado" },
    ];

    const ultimosAlugueis = [
        { id: 1, produtor: "Cia. Teatral XYZ", periodo: "20 a 25 de Ago", valor: "R$ 15.000", status: "Pago" },
        { id: 2, produtor: "Escola de Música", periodo: "01 de Setembro", valor: "R$ 3.500", status: "Pendente" },
    ];
    // =========================================================================

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">

            <Sidebar/>

            {/* Área de Conteúdo Principal */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header do Dashboard */}
                <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        {/* Botão Hambúrguer para Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gestus focus:outline-none"
                        >
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
                                {usuario?.nome[0]}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold text-gray-800">{usuario?.nome}</p>
                                <p className="text-gray-500 text-xs">{teatro?.nome}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Conteúdo Rolável (Scroll) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">

                    {/* Linha de KPIs (Cards superiores) */}
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

                    {/* Área de Tabelas/Informações */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Coluna Principal: Peças e Sessões (Ocupa 2 colunas no desktop) */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-800">Sessões em Destaque</h3>
                                    <button className="text-sm font-medium text-gestus hover:text-gestus-dark transition-colors">Ver todas</button>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-white">
                                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Espetáculo / Evento</th>
                                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Data & Hora</th>
                                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Ocupação</th>
                                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pecasEmCartaz.map((peca) => (
                                                <tr key={peca.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-800">{peca.nome}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{peca.data}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[4rem]">
                                                                <div className="bg-gestus h-2 rounded-full" style={{ width: peca.ocupacao }}></div>
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-700">{peca.ocupacao}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${peca.status === 'Confirmado' ? 'bg-green-100 text-green-700' :
                                                            peca.status === 'Vendas Abertas' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-orange-100 text-orange-700'
                                                            }`}>
                                                            {peca.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Coluna Lateral: Contratos e Aluguéis (Ocupa 1 coluna) */}
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
                                    <button className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-medium hover:border-gestus hover:text-gestus transition-colors text-sm">
                                        + Novo Contrato
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );


}