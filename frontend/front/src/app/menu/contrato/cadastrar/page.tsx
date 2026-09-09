'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { pecaService } from '@/src/services/PecaService';
import { artistaService } from '@/src/services/ArtistaService';
import { contratoService } from '@/src/services/contratoService';

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
        horarioInicioPeca: '',
        horarioFimPeca: ''
    });

    useEffect(() => {
        const carregarPecas = async () => {
            try {
                const pecas = await pecaService.getPecas();
                setPecasExistentes(pecas);
            } catch (error:any) {
                setErrorMessage(error.response?.data?.message)
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
            setErrorMessage(error.response?.data?.message)
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
            return formData.dataInicio !== '' && 
                   formData.dataFim !== '' &&
                   formData.horarioInicioPeca !== '' &&
                   formData.horarioFimPeca !== '';
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
            setErrorMessage(error.response?.data?.message)
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
            // Como as etapas 1 e 2 já cuidaram de cadastrar/selecionar,
            // aqui temos a garantia de que pecaId e emailBuscaArtista existem no banco.
            await contratoService.cadastrarContrato(
                Number(formData.pecaId),
                formData.emailBuscaArtista,
                formData.dataInicio as any, 
                formData.dataFim as any,
                formData.horarioInicioPeca,
                formData.horarioFimPeca
            );
            
            alert("Contrato validado e cadastrado com sucesso no sistema!");
            router.push('/menu/');
            
        } catch (error:any) {
            console.error("Erro ao fechar o contrato:", error);
            setErrorMessage(error.response?.data?.message)
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================================
    // RENDERIZAÇÃO DAS ETAPAS
    // =========================================================================
    
    const renderEtapa1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. Identificação do Artista</h2>
            
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail do Artista / Responsável <span className="text-red-500">*</span></label>
                    <input 
                        type="email" 
                        value={formData.emailBuscaArtista}
                        onChange={(e) => handleChange('emailBuscaArtista', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus outline-none"
                        placeholder="contato@exemplo.com"
                    />
                </div>
                <button 
                    onClick={handleBuscarEmail}
                    disabled={carregando}
                    className="px-6 py-3 bg-gestus hover:bg-gestus-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                    {carregando ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={formData.artistaNome}
                        onChange={(e) => handleChange('artistaNome', e.target.value)}
                        disabled={formData.artistaEncontrado}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl disabled:bg-gray-100 disabled:text-gray-500 outline-none"
                    />
                </div>
            </div>
        </div>
    );

    const renderEtapa2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. Definição da Peça</h2>
            
            <div className="flex gap-4 mb-6">
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'selecionar')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.pecaModo === 'selecionar' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Selecionar Existente
                </button>
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'nova')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.pecaModo === 'nova' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                    Cadastrar Nova Peça
                </button>
            </div>

            {formData.pecaModo === 'selecionar' ? (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione a Peça <span className="text-red-500">*</span></label>
                    <select 
                        value={String(formData.pecaId)}
                        onChange={(e) => handleChange('pecaId', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
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
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Peça <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.pecaNome}
                            onChange={(e) => handleChange('pecaNome', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            placeholder="Ex: O Auto da Compadecida"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição (Sinopse)</label>
                        <textarea 
                            value={formData.pecaDescricao}
                            onChange={(e) => handleChange('pecaDescricao', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none resize-none h-24"
                            placeholder="Breve resumo sobre a peça..."
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const renderEtapa3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. Agenda e Horários</h2>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Início <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        value={formData.dataInicio}
                        onChange={(e) => handleChange('dataInicio', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Data de Fim <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        value={formData.dataFim}
                        onChange={(e) => handleChange('dataFim', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Horário Início da Peça <span className="text-red-500">*</span></label>
                    <input 
                        type="time" 
                        value={formData.horarioInicioPeca}
                        onChange={(e) => handleChange('horarioInicioPeca', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Horário Fim da Peça <span className="text-red-500">*</span></label>
                    <input 
                        type="time" 
                        value={formData.horarioFimPeca}
                        onChange={(e) => handleChange('horarioFimPeca', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                    />
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 mt-4">
                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5"></i>
                <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Informações Automáticas:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>O sistema reservará 1 hora antes e depois destes horários.</li>
                        <li>O teatro será vinculado automaticamente ao seu perfil logado.</li>
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gestus transition-colors mb-4 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i> Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Novo Contrato de Aluguel</h1>
                <p className="text-sm text-gray-500">Preencha as etapas para firmar um novo aluguel de espaço.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Stepper Lateral */}
                <div className="bg-gestus-dark text-white p-8 md:w-1/3 flex flex-col gap-8">
                    {[
                        { num: 1, label: "Artista", icon: "fa-envelope" },
                        { num: 2, label: "Peça", icon: "fa-masks-theater" },
                        { num: 3, label: "Agenda", icon: "fa-calendar-days" }
                    ].map((step) => (
                        <div key={step.num} className={`flex items-center gap-4 transition-opacity ${etapa === step.num ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${etapa === step.num ? 'bg-white text-gestus-dark border-white' : 'border-white text-white'}`}>
                                {etapa > step.num ? <i className="fa-solid fa-check"></i> : step.num}
                            </div>
                            <div className="font-medium">
                                <span className="block text-xs font-normal opacity-70">Etapa {step.num}</span>
                                {step.label}
                            </div>
                        </div>
                    ))}
                </div>
                

                {/* Área do Formulário */}
                <div className="p-8 md:w-2/3 flex flex-col min-h-[450px]">
                {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        )}
                    
                    <div className="flex-1">
                        {etapa === 1 && renderEtapa1()}
                        {etapa === 2 && renderEtapa2()}
                        {etapa === 3 && renderEtapa3()}
                    </div>

                    {/* Botões de Ação */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button 
                            type="button"
                            onClick={voltarEtapa}
                            disabled={etapa === 1 || carregando}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${etapa === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Anterior
                        </button>
                        
                        {etapa < 3 ? (
                            <button 
                                type="button"
                                onClick={handleProximo}
                                disabled={!isEtapaValida() || carregando}
                                className={`px-6 py-2.5 font-medium rounded-xl shadow-sm transition-colors ${isEtapaValida() ? 'bg-gestus hover:bg-gestus-dark text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                {carregando ? 'Salvando...' : 'Próximo'}
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={handleFinalizar}
                                disabled={carregando || !isEtapaValida()}
                                className={`px-6 py-2.5 font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 ${isEtapaValida() ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
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