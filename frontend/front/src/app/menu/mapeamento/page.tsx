'use client';
import React, { useState } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import { useMapAssentos } from '@/src/hooks/useMapAssentos';
import { Assento } from '@/src/types/assento';

// Importação dos seus componentes menores (SRP)
import { AddColumnForm } from '@/src/components/mapeamento/formularioColuna';
import { SeatItem } from '@/src/components/mapeamento/assentoRenderizacao';

export default function TheaterManager() {
  // 1. Consumindo o Hook
  const {
    columns,
    isLoading,
    error,
    adicionarColuna,
    deleteColumn,
    updateSeat,
    reload
  } = useMapAssentos();

  console.log("Dados do back-end:", columns);

  // 2. Estado puramente visual da tela (Modal de edição)
  const [seatToEdit, setSeatToEdit] = useState<Assento | null>(null);

  // 3. Handlers para a UI
  const handleEditRequest = (assento: Assento) => {
    setSeatToEdit(assento); // Abre o modal
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      <Sidebar color="#5D1B85" activePage="seats" />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* HEADER BÁSICO */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h2 className="text-xl font-bold">Gerenciamento de Assentos</h2>
            <p className="text-sm text-slate-500">Configure o mapa do seu teatro.</p>
          </div>

          {isLoading && (
            <span className="text-sm text-purple-600 font-semibold animate-pulse">
              Carregando mapa...
            </span>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={reload} className="text-sm font-bold underline">
                Tentar novamente
              </button>
            </div>
          )}

          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* PAINEL LATERAL (FORMULÁRIO E LEGENDA) */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <AddColumnForm
                  onAdd={adicionarColuna}
                  isLoading={isLoading} // Desabilita o botão enquanto salva
                />
              </div>
            </div>

            {/* MAPA DE ASSENTOS */}
            <div className="flex-1 bg-white rounded-3xl p-6 lg:p-10 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
              {/* Efeito sutil de fundo no topo */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-50 to-white pointer-events-none" />

              {/* Opacidade visual caso esteja carregando */}
              <div className={`relative z-10 transition-all duration-300 flex flex-col flex-1 ${isLoading && columns.length === 0 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

                {/* --- REPRESENTAÇÃO DO PALCO --- */}
                {columns.length > 0 && (
                  <div className="w-full min-w-max flex justify-center mb-14 px-10">
                    <div className="w-3/4 max-w-3xl relative">
                      {/* Efeito de luz do palco (opcional) */}
                      <div className="absolute -inset-x-10 -bottom-16 h-32 bg-indigo-400/10 blur-3xl rounded-t-full -z-10" />

                      {/* Palco */}
                      <div className="h-12 sm:h-16 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-[3rem] shadow-xl flex items-center justify-center border-b-4 border-slate-950">
                        <span className="text-slate-300 font-bold tracking-[0.4em] uppercase text-xs sm:text-sm drop-shadow-md">
                          Palco
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- ESTADO VAZIO --- */}
                {columns.length === 0 && !isLoading ? (
                  <div className="text-center text-slate-400 m-auto flex flex-col items-center justify-center h-full py-20">
                    <svg className="w-16 h-16 mb-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-lg font-medium text-slate-500">Nenhuma fileira cadastrada.</p>
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
                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold text-slate-600 shrink-0 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                              {column.identificador}
                            </div>

                            {/* CAIXA COM OS ASSENTOS */}
                            <div className="flex gap-3 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 group-hover:bg-slate-50 transition-colors">
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
                              className="p-2.5 text-slate-300 hover:text-white hover:bg-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
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