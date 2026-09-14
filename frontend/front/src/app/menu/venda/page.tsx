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
        <div className="flex min-h-screen w-full bg-[#000000] relative overflow-hidden font-sans text-[#F8F8F8]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <Sidebar color="#0B0710" activePage='tickets' />
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
                <Header titulo="Ponto de Venda (PDV)" descricao="Selecione a sessão e os assentos para realizar a venda." />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 custom-scrollbar">
                    {/* Left Column: Sessions & Seat Map */}
                    <div className="flex-1 flex flex-col gap-6 min-w-0">

                        {/* Step 1: Sessions */}
                        <section className="bg-[#120B18] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 p-5 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-[#F8F8F8] mb-4 flex items-center gap-2">
                                <span className="bg-[#7C3AED] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg shadow-purple-500/30">1</span>
                                Selecione a Sessão
                            </h3>

                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-8 text-[#A1A1AA]">
                                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-[#7C3AED]" />
                                    <p>Buscando sessões disponíveis...</p>
                                </div>
                            )}

                            {!isLoading && error && (
                                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-center">
                                    {error}
                                </div>
                            )}

                            {!isLoading && !error && sessions.length === 0 && (
                                <div className="text-center py-8 text-[#A1A1AA]">
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
                                                cursor-pointer p-4 rounded-xl border transition-all duration-300 flex flex-col h-full
                                                ${isSelected ? 'border-[#7C3AED] bg-[#7C3AED]/10 shadow-[0_0_15px_rgba(124,58,237,0.15)]' : 'border-violet-500/10 hover:border-violet-500/30 hover:bg-[#0B0710]/50'}
                                            `}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="inline-block px-2 py-1 bg-[#120B18] border border-violet-500/20 rounded text-xs font-semibold text-[#C4B5FD] shadow-sm">
                                                        {session.horarioInicio}
                                                    </span>
                                                    {isSelected && <CheckCircle className="h-5 w-5 fill-[#7C3AED] text-white" />}
                                                </div>
                                                <h4 className="font-bold text-[#F8F8F8] leading-tight mb-1 line-clamp-2">{session.nomePeca}</h4>
                                                <p className="text-sm text-[#A1A1AA] mt-auto flex items-center gap-1">
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
                            <section className="bg-[#120B18] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 p-6 flex-1 flex flex-col animate-in fade-in duration-300 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-6 border-b border-violet-500/10 pb-4">
                                    <h3 className="text-lg font-semibold text-[#F8F8F8] flex items-center gap-2">
                                        <span className="bg-[#7C3AED] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg shadow-purple-500/30">2</span>
                                        Selecione os Assentos
                                    </h3>

                                    {/* Legend */}
                                    <div className="flex gap-4 text-sm hidden sm:flex">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-[#120B18] border border-violet-500/30"></div>
                                            <span className="text-[#A1A1AA]">Disponível</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-[#7C3AED] border border-[#7C3AED]"></div>
                                            <span className="text-[#F8F8F8]">Selecionado</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-4 h-4 rounded bg-[#0B0710] border border-white/5 opacity-50"></div>
                                            <span className="text-[#A1A1AA]">Ocupado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Container */}
                                <div className="flex-1 bg-[#0B0710]/50 rounded-xl border border-violet-500/10 p-8 flex flex-col items-center justify-center overflow-x-auto relative">

                                    <div className="w-full max-w-2xl h-16 bg-gradient-to-b from-[#120B18] to-[#000000] border border-violet-500/20 rounded-t-3xl flex items-center justify-center text-[#F8F8F8] font-bold tracking-[0.3em] mb-12 shadow-[0_10px_30px_rgba(124,58,237,0.1)] relative overflow-hidden">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#7C3AED] opacity-50 blur-sm"></div>
                                        P A L C O
                                    </div>

                                    <div className="flex flex-col gap-6 items-center pb-4">
                                        {rowKeys.map(fileira => (
                                            <div key={fileira} className="flex items-center gap-4 w-full justify-center group">
                                                <div className="w-10 h-10 rounded-lg border border-violet-500/20 flex items-center justify-center font-bold text-[#F8F8F8] bg-[#120B18] shadow-sm shrink-0 group-hover:border-[#7C3AED] group-hover:text-[#C4B5FD] transition-colors">
                                                    {fileira}
                                                </div>

                                                <div className="flex gap-2 p-2 rounded-xl bg-[#120B18] border border-violet-500/10 shadow-sm flex-wrap justify-center">
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
                                                                    w-12 h-12 rounded-lg border flex flex-col items-center justify-center gap-0.5 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-1 focus:ring-offset-[#120B18] transition-all active:scale-95
                                                                    ${isOccupied ? 'cursor-not-allowed bg-[#0B0710] border-white/5 opacity-50' : 'cursor-pointer hover:scale-105 hover:shadow-[0_0_10px_rgba(124,58,237,0.2)]'}
                                                                    ${isSelected ? 'bg-[#7C3AED] border-[#8B5CF6] text-[#FFFFFF] shadow-md shadow-purple-900/40' : ''}
                                                                    ${!isOccupied && !isSelected ? 'bg-[#120B18] border-violet-500/30 hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 text-[#C4B5FD]' : ''}
                                                                `}
                                                                >
                                                                    <Armchair
                                                                        className="h-5 w-5"
                                                                        color={isSelected ? "white" : (isOccupied ? "#A1A1AA" : "currentColor")}
                                                                        fill={isSelected || isOccupied ? "currentColor" : "none"}
                                                                    />
                                                                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white' : (isOccupied ? 'text-[#A1A1AA]' : 'text-[#A1A1AA]')}`}>
                                                                        {assento.codigoPosicao}
                                                                    </span>
                                                                    {isOccupied && (
                                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                                            <div className="w-full h-px bg-[#A1A1AA]/30 rotate-45"></div>
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
                        <section className="bg-[#120B18] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 p-5 flex flex-col h-full max-h-[calc(100vh-140px)] sticky top-6 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-[#F8F8F8] mb-4 pb-4 border-b border-violet-500/10 flex items-center gap-2">
                                <ShoppingCart className="h-6 w-6 text-[#7C3AED]" />
                                Resumo do Pedido
                            </h3>

                            <div className="flex-1 overflow-y-auto pr-1 -mr-1 mb-4 space-y-3 custom-scrollbar">
                                {selectedSeats.length === 0 ? (
                                    <div className="text-center text-[#A1A1AA] py-8 flex flex-col items-center gap-2">
                                        <Ticket className="h-10 w-10 mb-2 opacity-50" />
                                        <p>Nenhum assento selecionado.</p>
                                        <p className="text-sm">Selecione uma sessão e assentos para começar.</p>
                                    </div>
                                ) : (
                                    <ul className="space-y-3">
                                        {sortedSelectedSeats.map(seat => (
                                            <li key={seat.id} className="flex justify-between items-center p-3 bg-[#0B0710]/50 rounded-lg border border-violet-500/20 group animate-in slide-in-from-right-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-[#120B18] border border-violet-500/30 flex items-center justify-center text-[#C4B5FD]">
                                                        <Ticket className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#F8F8F8]">Assento {seat.codigoPosicao}</p>
                                                        <p className="text-xs text-[#A1A1AA]">Inteira</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-[#C4B5FD]">{formatCurrency(currentTicketPrice)}</span>
                                                    <button
                                                        onClick={() => handleToggleSeat(seat)}
                                                        className="text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors p-1"
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

                            <div className="mt-auto border-t border-violet-500/10 pt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[#A1A1AA] font-medium">Total:</span>
                                    <span className="text-2xl font-bold text-[#F8F8F8]">{formatCurrency(totalPrice)}</span>
                                </div>

                                {selectedSeats.length > 0 && (
                                    <form onSubmit={handleFinalize} className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
                                        <h4 className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider mb-1">Dados do Cliente</h4>

                                        <div>
                                            <label className="block text-xs text-[#F8F8F8] font-medium mb-1.5" htmlFor="customerName">Nome Completo *</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <User className="h-4 w-4 text-[#A1A1AA]" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="customerName"
                                                    value={customerName}
                                                    onChange={(e) => setCustomerName(e.target.value)}
                                                    className="pl-10 w-full bg-[#0B0710] border border-violet-500/20 hover:border-violet-500/40 focus:border-[#7C3AED] rounded-lg py-2.5 px-3 text-sm text-[#F8F8F8] placeholder-[#A1A1AA]/50 focus:outline-none focus:ring-0 transition-all"
                                                    placeholder="Ex: João da Silva"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-[#F8F8F8] font-medium mb-1.5" htmlFor="customerEmail">E-mail *</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail className="h-4 w-4 text-[#A1A1AA]" />
                                                </div>
                                                <input
                                                    type="email"
                                                    id="customerEmail"
                                                    value={customerEmail}
                                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                                    className="pl-10 w-full bg-[#0B0710] border border-violet-500/20 hover:border-violet-500/40 focus:border-[#7C3AED] rounded-lg py-2.5 px-3 text-sm text-[#F8F8F8] placeholder-[#A1A1AA]/50 focus:outline-none focus:ring-0 transition-all"
                                                    placeholder="joao@exemplo.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!isFormValid || isSubmitting}
                                            className="mt-4 w-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[0_4px_14px_rgba(124,58,237,0.39)] active:scale-[0.98]"
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
                    <div className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-[#120B18] border border-violet-500/20 rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200 relative overflow-hidden">
                            <div className="absolute top-[-20%] left-[-20%] w-32 h-32 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>

                            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-center text-[#F8F8F8] mb-2 tracking-tight">Venda Concluída!</h2>
                            <p className="text-center text-[#A1A1AA] mb-6">Os ingressos foram gerados com sucesso.</p>

                            <div className="bg-[#0B0710]/50 rounded-xl p-5 mb-6 border border-violet-500/10 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Cliente:</span>
                                    <span className="font-semibold text-[#F8F8F8]">{customerName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Sessão:</span>
                                    <span className="font-semibold text-[#F8F8F8] text-right">{selectedSession?.nomePeca}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#A1A1AA]">Qtd Ingressos:</span>
                                    <span className="font-semibold text-[#F8F8F8]">
                                        {selectedSeats.length} ({sortedSelectedSeats.map(s => s.codigoPosicao).join(', ')})
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-bold border-t border-violet-500/10 pt-3 mt-3">
                                    <span className="text-[#F8F8F8]">Valor Total:</span>
                                    <span className="text-[#C4B5FD]">{formatCurrency(totalPrice)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full bg-[#120B18] hover:bg-[#7C3AED]/10 border border-violet-500/30 text-[#C4B5FD] hover:text-[#FFFFFF] hover:border-[#7C3AED] font-semibold py-3 px-4 rounded-xl transition-all duration-300"
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