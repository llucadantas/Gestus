import { useEffect, useState } from 'react';
import { sessaoService } from '@/src/services/sessaoService';
import { SessaoDestaque } from '@/src/types/menu';
import { useModalSessoes } from '@/src/hooks/useModalSessoes';

interface ModalProps {
    onClose: () => void; // Contrato para fechar o modal
}

export default function ModalTodasSessoes({ onClose }: ModalProps) {
    
    const{
        sessoesPaginadas,
        paginaAtual,
        carregando,
        totalPaginas,
        carregarSessoesModal
    } = useModalSessoes();

    const formatarDataBR = (dataIso: string) => {
        if (!dataIso) return '';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
                {/* Header Modal */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-gray-800">Todas as Sessões</h3>
                    <button 
                        onClick={onClose} // Chama a função que o Dashboard passou para fechar
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                
                {/* Body Modal (Tabela) */}
                <div className="flex-1 overflow-y-auto p-0">
                    {/* ... Seu código HTML da tabela usando 'sessoesPaginadas' e 'carregando' ... */}
                </div>

                {/* Footer Modal (Controles de Paginação) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Página <span className="font-semibold text-gray-700">{paginaAtual + 1}</span> de <span className="font-semibold text-gray-700">{totalPaginas === 0 ? 1 : totalPaginas}</span>
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={paginaAtual === 0 || carregando}
                            onClick={() => carregarSessoesModal(paginaAtual - 1)}
                            className="...">
                            <i className="fa-solid fa-chevron-left mr-1"></i> Anterior
                        </button>
                        <button 
                            disabled={paginaAtual >= totalPaginas - 1 || carregando}
                            onClick={() => carregarSessoesModal(paginaAtual + 1)}
                            className="...">
                            Próxima <i className="fa-solid fa-chevron-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}