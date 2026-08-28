'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { teatroService } from '../services/teatroService';
import { sessaoService } from '@/src/app/services/sessaoService';
import Sidebar from '@/src/components/util/sideBar';

export default function Dashboard() {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // =========================================================================
    // ESTADOS PRINCIPAIS
    // =========================================================================
    const [usuario, setUsuario] = useState<any>(null);
    const [teatro, setTeatro] = useState<any>(null);
    const [carregando, setCarregando] = useState(true);

    // Estados da Tabela do Dashboard (Prévia)
    const [sessoesDestaque, setSessoesDestaque] = useState<any[]>([]);
    const [carregandoSessoes, setCarregandoSessoes] = useState(true);

    // Estados do Modal "Ver Todas" (Paginação)
    const [modalSessoesAberto, setModalSessoesAberto] = useState(false);
    const [sessoesPaginadas, setSessoesPaginadas] = useState<any[]>([]);
    const [carregandoModal, setCarregandoModal] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    // =========================================================================
    // EFEITOS (Carregamento Inicial)
    // =========================================================================
    
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

    useEffect(() => {
        // Carrega apenas 5 itens para a prévia do Dashboard
        carregarSessoesDashboard();
    }, []);

    // =========================================================================
    // FUNÇÕES
    // =========================================================================
    
    const carregarSessoesDashboard = async () => {
        setCarregandoSessoes(true);
        try {
            // Supondo que seu service aceite (pagina, tamanho)
            const response = await sessaoService.getSessoes(0, 5);
            // Se o backend retorna Page<T>, pegamos o .content. Se retornar lista direto, pegamos a response.
            setSessoesDestaque(response.content || response); 
        } catch (error) {
            console.error("Erro ao carregar sessões em destaque:", error);
        } finally {
            setCarregandoSessoes(false);
        }
    };

    const abrirModalVerTodas = () => {
        setModalSessoesAberto(true);
        carregarSessoesModal(0); // Sempre abre na primeira página
    };

    const carregarSessoesModal = async (pagina: number) => {
        setCarregandoModal(true);
        try {
            // Busca 10 itens por vez para o modal
            const response = await sessaoService.getSessoes(pagina, 5);
            
            setSessoesPaginadas(response.content || response);
            setPaginaAtual(pagina);
            setTotalPaginas(response.totalPages || 1); 
        } catch (error) {
            console.error("Erro ao carregar todas as sessões:", error);
        } finally {
            setCarregandoModal(false);
        }
    };

    const formatarDataBR = (dataIso: string) => {
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
            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-4">
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
                                    <button 
                                        onClick={abrirModalVerTodas}
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
                MODAL: TODAS AS SESSÕES (PAGINADO)
                ========================================================================= */}
            {modalSessoesAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
                        {/* Header Modal */}
                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-gray-800">Todas as Sessões</h3>
                            <button 
                                onClick={() => setModalSessoesAberto(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        
                        {/* Body Modal (Tabela) */}
                        <div className="flex-1 overflow-y-auto p-0">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-white shadow-sm">
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Peça</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Artista</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Horário</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {carregandoModal ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                <i className="fa-solid fa-circle-notch fa-spin text-gestus text-2xl mb-2"></i>
                                                <p>Buscando sessões...</p>
                                            </td>
                                        </tr>
                                    ) : sessoesPaginadas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                Nenhuma sessão encontrada.
                                            </td>
                                        </tr>
                                    ) : (
                                        sessoesPaginadas.map((sessao, index) => (
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

                        {/* Footer Modal (Controles de Paginação) */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Página <span className="font-semibold text-gray-700">{paginaAtual + 1}</span> de <span className="font-semibold text-gray-700">{totalPaginas === 0 ? 1 : totalPaginas}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <button 
                                    disabled={paginaAtual === 0 || carregandoModal}
                                    onClick={() => carregarSessoesModal(paginaAtual - 1)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    <i className="fa-solid fa-chevron-left mr-1"></i> Anterior
                                </button>
                                <button 
                                    disabled={paginaAtual >= totalPaginas - 1 || carregandoModal}
                                    onClick={() => carregarSessoesModal(paginaAtual + 1)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    Próxima <i className="fa-solid fa-chevron-right ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}