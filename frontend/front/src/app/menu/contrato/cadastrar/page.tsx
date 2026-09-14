'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { pecaService } from '@/src/services/PecaService';
import { artistaService } from '@/src/services/ArtistaService';
import { contratoService } from '@/src/services/contratoService';
import { ContratoAluguelRequest } from '@/src/types/contrato';

export default function ContratoAluguel() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [etapa, setEtapa] = useState(1);
    const [pecasExistentes, setPecasExistentes] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        emailBuscaArtista: '',
        artistaEncontrado: false,
        artistaNome: '',
        artistaCpf: '', 
        artistaTelefone: '',
        artistaGenero: '',
        artistaDataNascimento: '',

        pecaModo: 'selecionar', 
        pecaId: '',
        pecaNome: '',
        pecaDescricao: '',
        pecaPrecoTicket: '',
        
        dataInicio: '',
        dataFim: '',
        inicioPeca: '',
        fimPeca: '',
        valorIngresso: ''
    });

    useEffect(() => {
        const carregarPecas = async () => {
            try {
                const pecas = await pecaService.getPecas();
                setPecasExistentes(pecas);
            } catch (error:any) {
                setErrorMessage(error.response?.data?.message || "Erro inesperado");
            }
        };
        carregarPecas();
    }, []);

    const handleChange = (campo: string, valor: string) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handleBuscarEmail = async () => {
        if (!formData.emailBuscaArtista.includes('@')) {
            alert("Digite um e-mail válido.");
            return;
        }

        setCarregando(true);
        try {
            const artistas = await artistaService.getArtistas();
            const artistaEncontrado = artistas.find((a: any) => a.email === formData.emailBuscaArtista);

            if (artistaEncontrado) {
                setFormData(prev => ({
                    ...prev,
                    artistaEncontrado: true,
                    artistaNome: artistaEncontrado.nome || '',
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    artistaEncontrado: false,
                    artistaNome: '',
                }));
                alert("Artista não encontrado. Preencha os dados para realizar um novo cadastro.");
            }
        } catch (error:any) {
            console.error("Erro ao buscar artista:", error);
            setErrorMessage(error.response?.data?.message || "Erro inesperado");
        } finally {
            setCarregando(false);
        }
    };

    const isEtapaValida = () => {
        if (etapa === 1) {
            return formData.emailBuscaArtista.trim() !== '' && 
                   formData.artistaNome.trim() !== '';
        }
        if (etapa === 2) {
            return formData.pecaModo === 'selecionar' 
                ? formData.pecaId !== '' 
                : formData.pecaNome.trim() !== ''; 
        }
        if (etapa === 3) {
            const cronologiaValida = formData.dataInicio <= formData.dataFim;
            return formData.dataInicio !== '' && 
                   formData.dataFim !== '' &&
                   formData.inicioPeca !== '' &&
                   cronologiaValida &&
                   formData.fimPeca !== '' &&
                   formData.valorIngresso !== '';
        }
        return false;
    };

    const handleProximo = async () => {
        if (!isEtapaValida()) return;
        setCarregando(true);

        try {
            if (etapa === 1) {
                if (!formData.artistaEncontrado) {
                    await artistaService.postArtista(formData.artistaNome, formData.emailBuscaArtista);
                    handleChange('artistaEncontrado', 'true'); 
                }
                setEtapa(2);
            } 
            else if (etapa === 2) {
                // Se escolheu cadastrar nova peça, cadastra agora
                if (formData.pecaModo === 'nova') {
                    const novaPecaSalva = await pecaService.postPeca(formData.pecaNome, formData.pecaDescricao);
                    
                    // Adiciona a nova peça na lista e muda o modo para "selecionar"
                    // Assim, se ele clicar em "Anterior", a peça já estará salva e selecionada no dropdown
                    setPecasExistentes(prev => [...prev, novaPecaSalva]);
                    setFormData(prev => ({
                        ...prev,
                        pecaId: novaPecaSalva.id,
                        pecaModo: 'selecionar'
                    }));
                }
                setEtapa(3);
            }
        } catch (error:any) {
            console.error("Erro ao processar etapa:", error);
            setErrorMessage(error.response?.data?.message || "Erro inesperado");
        } finally {
            setCarregando(false);
        }
    };
    
    const voltarEtapa = () => setEtapa(prev => prev - 1);

    // =========================================================================
    // FINALIZAR CONTRATO: Agora muito mais simples e seguro
    // =========================================================================
    const handleFinalizar = async () => {
        if (!isEtapaValida()) return;
        setCarregando(true);

        try {
            const payload: ContratoAluguelRequest = {
                idPeca: Number(formData.pecaId),
                emailArtista: formData.emailBuscaArtista,
                dataInicio: formData.dataInicio,
                dataFim: formData.dataFim,
                inicioPeca: formData.inicioPeca,
                fimPeca: formData.fimPeca,
                valorIngresso: Number(formData.valorIngresso)
            };
            await contratoService.cadastrarContrato(payload);
            
            alert("Contrato validado e cadastrado com sucesso no sistema!");
            router.push('/menu/');
            
        } catch (error:any) {
            console.error("Erro ao fechar o contrato:", error);
            setErrorMessage(error.response?.data?.message || "Erro inesperado");
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================================
    // RENDERIZAÇÃO DAS ETAPAS
    // =========================================================================
    
    const renderEtapa1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-[#F8F8F8] border-b border-violet-500/10 pb-2">1. Identificação do Artista</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">E-mail do Artista / Responsável <span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        value={formData.emailBuscaArtista}
                        onChange={(e) => handleChange('emailBuscaArtista', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 outline-none transition-all focus:ring-0"
                        placeholder="contato@exemplo.com"
                    />
                </div>
                <button 
                    onClick={handleBuscarEmail}
                    disabled={carregando}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-medium rounded-xl transition-all shadow-[0_4px_14px_rgba(124,58,237,0.39)] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100"
                >
                    {carregando ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Nome Completo <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={formData.artistaNome}
                        onChange={(e) => handleChange('artistaNome', e.target.value)}
                        disabled={formData.artistaEncontrado}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 outline-none transition-all focus:ring-0 disabled:bg-white/5 disabled:text-[#A1A1AA]/50 disabled:border-transparent"
                    />
                </div>
            </div>
        </div>
    );

    const renderEtapa2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-[#F8F8F8] border-b border-violet-500/10 pb-2">2. Definição da Peça</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'selecionar')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${formData.pecaModo === 'selecionar' ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]' : 'border-violet-500/20 text-[#A1A1AA] hover:bg-[#0B0710]/50 hover:border-violet-500/40'}`}
                >
                    Selecionar Existente
                </button>
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'nova')}
                    className={`flex-1 py-3 px-4 rounded-xl border font-medium transition-all ${formData.pecaModo === 'nova' ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]' : 'border-violet-500/20 text-[#A1A1AA] hover:bg-[#0B0710]/50 hover:border-violet-500/40'}`}
                >
                    Cadastrar Nova Peça
                </button>
            </div>

            {formData.pecaModo === 'selecionar' ? (
                <div>
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Selecione a Peça <span className="text-red-500">*</span></label>
                    <select 
                        value={String(formData.pecaId)}
                        onChange={(e) => handleChange('pecaId', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0"
                    >
                        <option value="">Selecione...</option>
                        {pecasExistentes.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Nome da Peça <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.pecaNome}
                            onChange={(e) => handleChange('pecaNome', e.target.value)}
                            className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 outline-none transition-all focus:ring-0"
                            placeholder="Ex: O Auto da Compadecida"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Descrição (Sinopse)</label>
                        <textarea 
                            value={formData.pecaDescricao}
                            onChange={(e) => handleChange('pecaDescricao', e.target.value)}
                            className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 outline-none transition-all focus:ring-0 resize-none h-24"
                            placeholder="Breve resumo sobre a peça..."
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const renderEtapa3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-[#F8F8F8] border-b border-violet-500/10 pb-2">3. Agenda e Horários</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Data de Início <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        value={formData.dataInicio}
                        onChange={(e) => handleChange('dataInicio', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0 color-scheme-dark"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Data de Fim <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        value={formData.dataFim}
                        onChange={(e) => handleChange('dataFim', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0 color-scheme-dark"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Horário Início da Peça <span className="text-red-500">*</span></label>
                    <input 
                        type="time" 
                        value={formData.inicioPeca}
                        onChange={(e) => handleChange('inicioPeca', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0 color-scheme-dark"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Horário Fim da Peça <span className="text-red-500">*</span></label>
                    <input 
                        type="time" 
                        value={formData.fimPeca}
                        onChange={(e) => handleChange('fimPeca', e.target.value)}
                        className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0 color-scheme-dark"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Valor do Ingresso <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] font-medium">R$</span>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            value={formData.valorIngresso}
                            onChange={(e) => handleChange('valorIngresso', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] transition-all focus:ring-0"
                            placeholder="0,00"
                        />
                    </div>
                </div>
            </div>
            
            <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                <i className="fa-solid fa-circle-info text-[#C4B5FD] mt-0.5"></i>
                <div className="text-sm text-[#C4B5FD]">
                    <p className="font-semibold mb-1">Informações Automáticas:</p>
                    <ul className="list-disc list-inside space-y-1 opacity-80">
                        <li>O sistema reservará 1 hora antes e depois destes horários.</li>
                        <li>O teatro será vinculado automaticamente ao seu perfil logado.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#000000] p-6 lg:p-8 font-sans relative overflow-hidden text-[#F8F8F8]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <div className="mb-8 relative z-10">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#C4B5FD] transition-colors mb-4 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i> Voltar
                </button>
                <h1 className="text-2xl font-bold text-[#F8F8F8] tracking-tight">Novo Contrato de Aluguel</h1>
                <p className="text-sm text-[#A1A1AA] mt-1">Preencha as etapas para firmar um novo aluguel de espaço.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-[#120B18] rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 overflow-hidden flex flex-col md:flex-row relative z-10 backdrop-blur-xl">
                
                {/* Stepper Lateral */}
                <div className="bg-[#0B0710]/50 border-r border-violet-500/10 text-[#F8F8F8] p-8 md:w-1/3 flex flex-col gap-8">
                    {[
                        { num: 1, label: "Artista", icon: "fa-envelope" },
                        { num: 2, label: "Peça", icon: "fa-masks-theater" },
                        { num: 3, label: "Agenda", icon: "fa-calendar-days" }
                    ].map((step) => (
                        <div key={step.num} className={`flex items-center gap-4 transition-all duration-300 ${etapa === step.num ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${etapa === step.num ? 'bg-[#7C3AED] text-white border-[#8B5CF6] shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'border-white/20 text-[#A1A1AA]'}`}>
                                {etapa > step.num ? <i className="fa-solid fa-check text-emerald-400"></i> : step.num}
                            </div>
                            <div className="font-medium">
                                <span className="block text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider mb-0.5 opacity-80">Etapa {step.num}</span>
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Área do Formulário */}
                <div className="p-8 md:w-2/3 flex flex-col min-h-[450px]">
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {errorMessage}
                        </div>
                    )}
                    
                    <div className="flex-1">
                        {etapa === 1 && renderEtapa1()}
                        {etapa === 2 && renderEtapa2()}
                        {etapa === 3 && renderEtapa3()}
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 pt-6 border-t border-violet-500/10 flex justify-between items-center">
                        <button 
                            type="button"
                            onClick={voltarEtapa}
                            disabled={etapa === 1 || carregando}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${etapa === 1 ? 'text-white/10 cursor-not-allowed' : 'text-[#A1A1AA] hover:text-[#F8F8F8] hover:bg-white/5'}`}
                        >
                            Anterior
                        </button>
                        
                        {etapa < 3 ? (
                            <button 
                                type="button"
                                onClick={handleProximo}
                                disabled={!isEtapaValida() || carregando}
                                className={`px-6 py-2.5 font-medium rounded-xl shadow-sm transition-all duration-300 ${isEtapaValida() ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white hover:shadow-[0_4px_14px_rgba(124,58,237,0.39)] active:scale-95' : 'bg-white/5 text-[#A1A1AA]/50 cursor-not-allowed'}`}
                            >
                                {carregando ? 'Salvando...' : 'Próximo'}
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={handleFinalizar}
                                disabled={carregando || !isEtapaValida()}
                                className={`px-6 py-2.5 font-bold rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2 ${isEtapaValida() ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white shadow-[0_4px_14px_rgba(52,211,153,0.39)] active:scale-95' : 'bg-white/5 text-[#A1A1AA]/50 cursor-not-allowed'}`}
                            >
                                {carregando ? 'Salvando...' : 'Finalizar Contrato'}
                                {(!carregando && isEtapaValida()) && <i className="fa-solid fa-check"></i>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}