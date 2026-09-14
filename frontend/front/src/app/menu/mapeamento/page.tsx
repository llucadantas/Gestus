'use client';
import React, { useState } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import { useMapAssentos } from '@/src/hooks/useMapAssentos';
import { Assento } from '@/src/types/assento';

// Importação dos seus componentes menores (SRP)
import { AddColumnForm } from '@/src/components/mapeamento/formularioColuna';
import { SeatItem } from '@/src/components/mapeamento/assentoRenderizacao';
import Header from '@/src/components/menu/Header';

export default function TheaterManager() {
  // 1. Consumindo o Hook
  const {
    columns,
    isLoading,
    error,
    adicionarColuna,
    deleteColumn,
    reload
  } = useMapAssentos();



  // 2. Estado puramente visual da tela (Modal de edição)
  const [seatToEdit, setSeatToEdit] = useState<Assento | null>(null);

  // 3. Handlers para a UI
  const handleEditRequest = (assento: Assento) => {
    setSeatToEdit(assento); // Abre o modal
  };

  return (
    <div className="flex h-screen bg-[#000000] font-sans text-[#F8F8F8] relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

      <Sidebar color="#0B0710" activePage="seats" />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Header titulo="Gerenciamento de Assentos" descricao="Configure o mapa do seu teatro.">
          {isLoading && (
            <span className="text-sm text-[#C4B5FD] font-semibold animate-pulse">
              Carregando mapa...
            </span>
          )}
        </Header>

        <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={reload} className="text-sm font-bold underline hover:text-red-300 transition-colors">
                Tentar novamente
              </button>
            </div>
          )}

          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* PAINEL LATERAL (FORMULÁRIO E LEGENDA) */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
              <div className="bg-[#120B18] rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 backdrop-blur-sm">
                <AddColumnForm
                  onAdd={adicionarColuna}
                  isLoading={isLoading} // Desabilita o botão enquanto salva
                />
              </div>
            </div>

            {/* MAPA DE ASSENTOS */}
            <div className="flex-1 bg-[#120B18] rounded-3xl p-6 lg:p-10 border border-violet-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col relative overflow-hidden backdrop-blur-sm">
              {/* Efeito sutil de fundo no topo */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0B0710]/50 to-transparent pointer-events-none" />

              {/* Opacidade visual caso esteja carregando */}
              <div className={`relative z-10 transition-all duration-300 flex flex-col flex-1 ${isLoading && columns.length === 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                {/* --- REPRESENTAÇÃO DO PALCO --- */}
                {columns.length > 0 && (
                  <div className="w-full min-w-max flex justify-center mb-16 px-10">
                    <div className="w-3/4 max-w-3xl relative">
                      {/* Efeito de luz do palco (opcional) */}
                      <div className="absolute -inset-x-10 -bottom-16 h-32 bg-[#7C3AED]/20 blur-[60px] rounded-t-full -z-10" />

                      {/* Palco */}
                      <div className="h-12 sm:h-16 bg-gradient-to-b from-[#1A0F2E] to-[#0B0710] rounded-t-[3rem] shadow-[0_10px_30px_rgba(124,58,237,0.15)] flex items-center justify-center border-b-4 border-violet-500/30 relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#7C3AED] opacity-50 blur-sm"></div>
                        <span className="text-[#F8F8F8] font-bold tracking-[0.4em] uppercase text-xs sm:text-sm drop-shadow-md">
                          Palco
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- ESTADO VAZIO --- */}
                {columns.length === 0 && !isLoading ? (
                  <div className="text-center text-[#A1A1AA] m-auto flex flex-col items-center justify-center h-full py-20">
                    <svg className="w-16 h-16 mb-4 text-[#A1A1AA]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium text-[#F8F8F8]">Nenhuma fileira cadastrada.</p>
                    <p className="text-sm mt-1">Adicione fileiras para começar a montar o mapa de assentos.</p>
                  </div>
                ) :
                  (

                    < div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
                      <div className="min-w-max mx-auto flex flex-col gap-6 items-center">
                        {columns.map((column, index) => (
                          <div
                            key={column.identificador ?? `coluna-${index}`}
                            className="flex items-center gap-4 group"
                          >
                            {/* CAIXA COM A LETRA DA FILEIRA */}
                            <div className="w-12 h-12 rounded-xl bg-[#0B0710] border border-violet-500/20 shadow-sm flex items-center justify-center text-lg font-bold text-[#F8F8F8] shrink-0 group-hover:border-[#7C3AED] group-hover:text-[#C4B5FD] transition-colors">
                              {column.identificador}
                            </div>

                            {/* CAIXA COM OS ASSENTOS */}
                            <div className="flex gap-3 p-3 bg-[#0B0710]/50 rounded-2xl border border-violet-500/10 group-hover:border-violet-500/30 transition-colors">
                              {column.assentos?.map((assento, seatIndex) => (
                                <SeatItem
                                  key={assento.id ?? `seat-${index}-${seatIndex}`}
                                  assento={assento}
                                  onClick={() => handleEditRequest(assento)}
                                />
                              ))}
                            </div>

                            {/* BOTÃO DE EXCLUIR */}
                            <button
                              onClick={() => deleteColumn(column.id!)}
                              title="Excluir fileira"
                              className="p-2.5 text-[#A1A1AA] hover:text-white hover:bg-red-500/80 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </main >

      
    </div >
  );
}