'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import {
    Ticket,
    Armchair,
    ShoppingCart,
    User,
    Mail,
    CheckCircle2,
    Trash2,
    Calendar,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { sessaoService } from '@/src/services/sessaoService';
import { ingressoService } from '@/src/services/ingressoService';
import Header from '@/src/components/menu/Header';

// --- Tipagens baseadas no seu Backend Java ---
type AssentoSessao = {
    id: number;
    codigoPosicao: string;
    fileira: string;
    disponivel: boolean;
};

type Sessao = {
    id: number;
    nomePeca: string;
    data: string;
    horarioInicio: string;
    valorIngresso: number;
    assentos: AssentoSessao[];
};

export default function PDV() {
    // --- ESTADOS DE DADOS DA API ---
    const [sessions, setSessions] = useState<Sessao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- ESTADOS DO PDV ---
    const [selectedSession, setSelectedSession] = useState<Sessao | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<AssentoSessao[]>([]);

    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- BUSCAR SESSÕES AO CARREGAR A PÁGINA (AXIOS) ---
    useEffect(() => {
        const fetchSessoes = async () => {
            try {
                setIsLoading(true);

                const response = await sessaoService.getSessoes();
                setSessions(response.content || response);

            } catch (err: any) {
                console.error("Erro na requisição Axios:", err);
                setError(err.response?.data?.message || 'Não foi possível carregar as sessões no momento.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessoes();
    }, []);

    // Validação do formulário
    useEffect(() => {
        const isValid =
            customerName.trim().length > 0 &&
            customerEmail.includes('@') &&
            selectedSeats.length > 0;
        setIsFormValid(isValid);
    }, [customerName, customerEmail, selectedSeats]);

    const handleSelectSession = (session: Sessao) => {
        if (selectedSession?.id === session.id) return;
        setSelectedSession(session);
        setSelectedSeats([]); // Reseta os assentos ao trocar de sessão
    };

    const handleToggleSeat = (assento: AssentoSessao) => {
        if (!assento.disponivel) return;

        setSelectedSeats(prev => {
            const isAlreadySelected = prev.some(seat => seat.id === assento.id);
            if (isAlreadySelected) {
                return prev.filter(seat => seat.id !== assento.id);
            } else {
                return [...prev, assento];
            }
        });
    };

    const handleFinalize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid || !selectedSession) return;
        
        setIsSubmitting(true);

        try {
            // Em Gestus, o endpoint exige 1 requisição por ingresso. 
            // Fazemos todas em paralelo.
            const userContext = JSON.parse(localStorage.getItem('usuarioGestus') || '{}');
            const idTeatro = userContext.teatroId || 1; // Fallback se não estiver no storage
            
            const promessasVenda = selectedSeats.map(seat => 
                ingressoService.realizarVenda(
                    idTeatro, 
                    selectedSession.id, 
                    seat.id, 
                    customerEmail, 
                    customerName
                )
            );

            await Promise.all(promessasVenda);

            // Sucesso (201)! Atualizar a tela sem recarregar
            setSessions(prevSessions => prevSessions.map(session => {
                if (session.id === selectedSession.id) {
                    return {
                        ...session,
                        assentos: session.assentos.map(assento => {
                            // Se este assento estava nos selecionados, agora está ocupado
                            if (selectedSeats.some(s => s.id === assento.id)) {
                                return { ...assento, disponivel: false };
                            }
                            return assento;
                        })
                    };
                }
                return session;
            }));
            
            // Atualiza também a sessão selecionada atual
            setSelectedSession(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    assentos: prev.assentos.map(assento => {
                        if (selectedSeats.some(s => s.id === assento.id)) {
                            return { ...assento, disponivel: false };
                        }
                        return assento;
                    })
                };
            });

            // Abre o modal de sucesso
            setIsModalOpen(true);
        } catch (err: any) {
            console.error("Erro ao processar venda via Axios:", err);
            // Capturando erro de concorrência e injetando a mensagem do backend
            const errorMessage = err.response?.data?.message || 'Ops! Este assento acabou de ser reservado por outra pessoa. Por favor, escolha outro.';
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
        setSelectedSeats([]);
        setCustomerName('');
        setCustomerEmail('');
        // Aqui você pode chamar fetchSessoes() de novo se quiser atualizar os assentos
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const groupedSeats = selectedSession?.assentos.reduce((acc, assento) => {
        if (!acc[assento.fileira]) {
            acc[assento.fileira] = [];
        }
        acc[assento.fileira].push(assento);
        return acc;
    }, {} as Record<string, AssentoSessao[]>) || {};

    const rowKeys = Object.keys(groupedSeats).sort();
    const currentTicketPrice = selectedSession?.valorIngresso || 0;
    const totalPrice = selectedSeats.length * currentTicketPrice;
    const sortedSelectedSeats = [...selectedSeats].sort((a, b) => a.codigoPosicao.localeCompare(b.codigoPosicao));

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <Sidebar activePage='tickets' />
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-100 font-sans">
                <Header titulo="Ponto de Venda (PDV)" descricao="Selecione a sessão e os assentos para realizar a venda." />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
                    {/* Left Column: Sessions & Seat Map */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">

                        {/* Step 1: Sessions */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="bg-purple-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Selecione a Sessão
                            </h3>

                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-purple-800" />
                                    <p>Buscando sessões disponíveis...</p>
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && sessions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhuma sessão disponível no momento.
                                </div>
                            )}

                            {!isLoading && !error && sessions.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {sessions.map(session => {
                                        const isSelected = selectedSession?.id === session.id;
                                        return (
                                            <div
                                                key={session.id}
                                                onClick={() => handleSelectSession(session)}
                                                className={`
                                                cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col h-full
                                                ${isSelected ? 'border-purple-800 bg-purple-50 shadow-sm' : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'}
                                            `}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="inline-block px-2 py-1 bg-white rounded text-xs font-semibold text-gray-500 border border-gray-200 shadow-sm">
                                                        {session.horarioInicio}
                                                    </span>
                                                    {isSelected && <CheckCircle className="text-purple-800 h-5 w-5 fill-purple-800 text-white" />}
                                                </div>
                                                <h4 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-2">{session.nomePeca}</h4>
                                                <p className="text-sm text-gray-500 mt-auto flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" /> {session.data}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        {/* Step 2: Seat Map */}
                        {selectedSession && (
                            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col animate-in fade-in duration-300">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <span className="bg-purple-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                        Selecione os Assentos
                                    </h3>

                                    {/* Legend */}
                                    <div className="flex gap-4 text-sm hidden sm:flex">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-white border border-gray-300"></div>
                                            <span className="text-gray-600">Disponível</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-purple-800 border border-purple-900"></div>
                                            <span className="text-gray-600">Selecionado</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-gray-300 border border-gray-400"></div>
                                            <span className="text-gray-600">Ocupado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container */}
                                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-8 flex flex-col items-center justify-center overflow-x-auto relative">

                                    <div className="w-full max-w-2xl h-16 bg-gray-900 rounded-t-3xl flex items-center justify-center text-white font-bold tracking-[0.3em] mb-12 shadow-lg relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>
                                        P A L C O
                                    </div>

                                    <div className="flex flex-col gap-6 items-center pb-4">
                                        {rowKeys.map(fileira => (
                                            <div key={fileira} className="flex items-center gap-4 w-full justify-center group">
                                                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-700 bg-white shadow-sm shrink-0 group-hover:border-purple-800 group-hover:text-purple-800 transition-colors">
                                                    {fileira}
                                                </div>

                                                <div className="flex gap-2 p-2 rounded-xl bg-white border border-gray-100 shadow-sm flex-wrap justify-center">
                                                    {groupedSeats[fileira]
                                                        .sort((a, b) => a.codigoPosicao.localeCompare(b.codigoPosicao))
                                                        .map((assento) => {
                                                            const isOccupied = !assento.disponivel;
                                                            const isSelected = selectedSeats.some(s => s.id === assento.id);

                                                            return (
                                                                <button
                                                                    key={assento.id}
                                                                    disabled={isOccupied}
                                                                    onClick={() => handleToggleSeat(assento)}
                                                                    title={isOccupied ? 'Assento Ocupado' : `Assento ${assento.codigoPosicao}`}
                                                                    className={`
                                                                    w-12 h-12 rounded-lg border flex flex-col items-center justify-center gap-0.5 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-1 transition-transform active:scale-95
                                                                    ${isOccupied ? 'cursor-not-allowed bg-gray-100 border-gray-300' : 'cursor-pointer hover:scale-105'}
                                                                    ${isSelected ? 'bg-purple-800 border-purple-900 text-white shadow-md' : ''}
                                                                    ${!isOccupied && !isSelected ? 'bg-white border-gray-300 hover:border-purple-800 hover:bg-purple-50 text-gray-600' : ''}
                                                                `}
                                                                >
                                                                    <Armchair
                                                                        className="h-5 w-5"
                                                                        color={isSelected ? "white" : (isOccupied ? "#9ca3af" : "currentColor")}
                                                                        fill={isSelected || isOccupied ? "currentColor" : "none"}
                                                                    />
                                                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : (isOccupied ? 'text-gray-400' : 'text-gray-700')}`}>
                                                                        {assento.codigoPosicao}
                                                                    </span>
                                                                    {isOccupied && (
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                            <div className="w-full h-px bg-gray-400 rotate-45"></div>
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column: Cart & Checkout */}
                    <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col h-full max-h-[calc(100vh-140px)] sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
                                <ShoppingCart className="h-6 w-6 text-purple-800" />
                                Resumo do Pedido
                            </h3>

                            <div className="flex-1 overflow-y-auto pr-1 -mr-1 mb-4 space-y-3">
                                {selectedSeats.length === 0 ? (
                                    <div className="text-center text-gray-400 py-8 flex flex-col items-center gap-2">
                                        <Ticket className="h-10 w-10 mb-2 opacity-50" />
                                        <p>Nenhum assento selecionado.</p>
                                        <p className="text-sm">Selecione uma sessão e assentos para começar.</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {sortedSelectedSeats.map(seat => (
                                            <li key={seat.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group animate-in slide-in-from-right-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center text-purple-800">
                                                        <Ticket className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">Assento {seat.codigoPosicao}</p>
                                                        <p className="text-xs text-gray-500">Inteira</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-gray-700">{formatCurrency(currentTicketPrice)}</span>
                                                    <button
                                                        onClick={() => handleToggleSeat(seat)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="mt-auto border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-600 font-medium">Total:</span>
                                    <span className="text-2xl font-bold text-purple-800">{formatCurrency(totalPrice)}</span>
                                </div>

                                {selectedSeats.length > 0 && (
                                    <form onSubmit={handleFinalize} className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Dados do Cliente</h4>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1" htmlFor="customerName">Nome Completo *</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="customerName"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent transition-all"
                                                    placeholder="Ex: João da Silva"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1" htmlFor="customerEmail">E-mail *</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="customerEmail"
                                                    value={customerEmail}
                                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                                    className="pl-10 w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent transition-all"
                                                    placeholder="joao@exemplo.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!isFormValid || isSubmitting}
                                            className="mt-4 w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-3 px-4 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
                                        >
                                            {isSubmitting ? 'Processando...' : 'Finalizar Venda'}
                                            {!isSubmitting && <CheckCircle2 className="h-5 w-5" />}
                                            {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {/* Success Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Venda Concluída!</h2>
                            <p className="text-center text-gray-600 mb-6">Os ingressos foram gerados com sucesso.</p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Cliente:</span>
                                    <span className="font-medium text-gray-800">{customerName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Sessão:</span>
                                    <span className="font-medium text-gray-800">{selectedSession?.nomePeca}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Qtd Ingressos:</span>
                                    <span className="font-medium text-gray-800">
                                        {selectedSeats.length} ({sortedSelectedSeats.map(s => s.codigoPosicao).join(', ')})
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-bold border-t border-gray-200 pt-2 mt-2">
                                    <span className="text-gray-700">Valor Total:</span>
                                    <span className="text-purple-800">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                            >
                                Nova Venda
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}