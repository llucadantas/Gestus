'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { contratoService } from '../../../services/contratoService';

export default function ContratoAluguel() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    
    // Controle da etapa atual (1 = Peça, 2 = Contrato, 3 = Artista)
    const [etapa, setEtapa] = useState(1);

    // =========================================================================
    // ESTADO GLOBAL DO FORMULÁRIO (Guarda tudo até o envio final)
    // =========================================================================
    const [formData, setFormData] = useState({
        // Dados da Peça
        pecaModo: 'selecionar', // 'selecionar' ou 'nova'
        pecaId: '',
        pecaNome: '',
        pecaDescricao: '',
        
        // Dados do Contrato
        dataContrato: '',
        turnoContrato: '', // 'MANHA', 'TARDE' ou 'NOITE'
        
        // Dados do Artista
        artistaModo: 'selecionar', // 'selecionar' ou 'novo'
        artistaId: '',
        artistaNome: '',
        artistaEmail: '' 
    });

    // =========================================================================
    // DADOS MOCKADOS (Substitua por chamadas Axios no useEffect)
    // =========================================================================
    const pecasExistentes = [
        { id: 1, nome: "O Fantasma da Ópera" },
        { id: 2, nome: "Comédia em Pé" }
    ];

    const artistasExistentes = [
        { id: 1, nome: "Cia Teatral XYZ" },
        { id: 2, nome: "Os Barbixas" }
    ];

    // =========================================================================
    // FUNÇÕES DE NAVEGAÇÃO, ATUALIZAÇÃO E VALIDAÇÃO
    // =========================================================================
    const handleChange = (campo: string, valor: string) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    // Trava os botões se os campos obrigatórios não estiverem preenchidos
    const isEtapaValida = () => {
        if (etapa === 1) {
            return formData.pecaModo === 'selecionar' 
                ? formData.pecaId !== '' 
                : formData.pecaNome.trim() !== '';
        }
        if (etapa === 2) {
            return formData.dataContrato !== '' && formData.turnoContrato !== '';
        }
        if (etapa === 3) {
            return formData.artistaModo === 'selecionar' 
                ? formData.artistaId !== '' 
                : (formData.artistaNome.trim() !== '' && formData.artistaEmail.trim() !== '');
        }
        return false;
    };

    const avancarEtapa = () => {
        if (isEtapaValida()) setEtapa(prev => prev + 1);
    };
    
    const voltarEtapa = () => setEtapa(prev => prev - 1);

    const handleFinalizar = async () => {
        if (!isEtapaValida()) return;

        setCarregando(true);
        try {
            const payload = {
                peca: formData.pecaModo === 'selecionar' 
                    ? { id: formData.pecaId } 
                    : { nome: formData.pecaNome, descricao: formData.pecaDescricao },
                
                contrato: {
                    data: formData.dataContrato,
                    turno: formData.turnoContrato
                },
                
                artista: formData.artistaModo === 'selecionar'
                    ? { id: formData.artistaId }
                    : { nome: formData.artistaNome, email: formData.artistaEmail }
            };
            
            console.log("Enviando Payload Final:", payload);
            
            await contratoService.cadastrarContrato(payload.peca, payload.contrato, payload.artista);
            
            alert("Contrato, Peça e Artista cadastrados com sucesso!");
            router.push('/menu/');
            
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao finalizar o cadastro.");
        } finally {
            setCarregando(false);
        }
    };

    // =========================================================================
    // RENDERIZAÇÃO DAS ETAPAS
    // =========================================================================
    const renderEtapa1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. Definição da Peça</h2>
            
            <div className="flex gap-4 mb-6">
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'selecionar')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.pecaModo === 'selecionar' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:border-purple-200'}`}
                >
                    Selecionar Existente
                </button>
                <button 
                    type="button"
                    onClick={() => handleChange('pecaModo', 'nova')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.pecaModo === 'nova' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:border-purple-200'}`}
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                    >
                        <option value="">Selecione...</option>
                        {pecasExistentes.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome da Peça <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.pecaNome}
                            onChange={(e) => handleChange('pecaNome', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                            placeholder="Ex: O Rei Leão"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                        <textarea 
                            value={formData.pecaDescricao}
                            onChange={(e) => handleChange('pecaDescricao', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none resize-none h-24"
                            placeholder="Breve resumo da apresentação..."
                        ></textarea>
                    </div>
                </div>
            )}
        </div>
    );

    const renderEtapa2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. Detalhes do Contrato</h2>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data do Aluguel <span className="text-red-500">*</span></label>
                <input 
                    type="date" 
                    value={formData.dataContrato}
                    onChange={(e) => handleChange('dataContrato', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Turno da Apresentação <span className="text-red-500">*</span></label>
                <select 
                    value={formData.turnoContrato}
                    onChange={(e) => handleChange('turnoContrato', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                >
                    <option value="">Selecione o turno...</option>
                    <option value="MANHA">Manhã</option>
                    <option value="TARDE">Tarde</option>
                    <option value="NOITE">Noite</option>
                </select>
            </div>
        </div>
    );

    const renderEtapa3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">3. Dados do Artista / Produtor</h2>
            
            <div className="flex gap-4 mb-6">
                <button 
                    type="button"
                    onClick={() => handleChange('artistaModo', 'selecionar')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.artistaModo === 'selecionar' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:border-purple-200'}`}
                >
                    Selecionar Existente
                </button>
                <button 
                    type="button"
                    onClick={() => handleChange('artistaModo', 'novo')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${formData.artistaModo === 'novo' ? 'border-gestus bg-purple-50 text-gestus' : 'border-gray-200 text-gray-500 hover:border-purple-200'}`}
                >
                    Cadastrar Novo
                </button>
            </div>

            {formData.artistaModo === 'selecionar' ? (
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Artista <span className="text-red-500">*</span></label>
                    <select 
                        value={String(formData.artistaId)}
                        onChange={(e) => handleChange('artistaId', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                    >
                        <option value="">Selecione...</option>
                        {artistasExistentes.map(a => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo / Grupo <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.artistaNome}
                            onChange={(e) => handleChange('artistaNome', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                            placeholder="Ex: Companhia de Dança XYZ"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email / Documento <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            value={formData.artistaEmail}
                            onChange={(e) => handleChange('artistaEmail', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                            placeholder="contato@exemplo.com"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            
            {/* Header Simples */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gestus transition-colors mb-4 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Novo Contrato de Aluguel</h1>
                <p className="text-sm text-gray-500">Preencha as etapas para firmar um novo aluguel de espaço.</p>
            </div>

            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Stepper Lateral */}
                <div className="bg-gestus-dark text-white p-8 md:w-1/3 flex flex-col gap-8">
                    {[
                        { num: 1, label: "Peça", icon: "fa-masks-theater" },
                        { num: 2, label: "Contrato", icon: "fa-file-signature" },
                        { num: 3, label: "Artista", icon: "fa-user-tie" }
                    ].map((step) => (
                        <div key={step.num} className={`flex items-center gap-4 transition-opacity ${etapa === step.num ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 ${etapa === step.num ? 'bg-white text-gestus-dark border-white' : 'border-white text-white'}`}>
                                {etapa > step.num ? <i className="fa-solid fa-check"></i> : step.num}
                            </div>
                            <div className="font-medium">{step.label}</div>
                        </div>
                    ))}
                </div>

                {/* Área do Formulário */}
                <div className="p-8 md:w-2/3 flex flex-col min-h-[400px]">
                    
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
                            disabled={etapa === 1}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-colors ${etapa === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Anterior
                        </button>
                        
                        {etapa < 3 ? (
                            <button 
                                type="button"
                                onClick={avancarEtapa}
                                disabled={!isEtapaValida()}
                                className={`px-6 py-2.5 font-medium rounded-xl shadow-sm transition-colors ${isEtapaValida() ? 'bg-gestus hover:bg-gestus-dark text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                Próximo
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