'use client';
import React, { useState } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import { useMapAssentos } from '@/src/hooks/useMapAssentos';
import { Assento } from '@/src/types/assento';

// Importação dos seus componentes menores (SRP)
import { AddColumnForm } from '@/src/components/mapeamento/formularioColuna';
import { SeatLegend } from '@/src/components/mapeamento/legendaAssento';
import { SeatItem } from '@/src/components/mapeamento/assentoRenderizacao';
import { EditSeatModal } from '@/src/components/mapeamento/modal';

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

  const handleSaveSeat = async (tipo: string, status: string) => {
    if (seatToEdit) {
      try {
        await updateSeat(seatToEdit.id, tipo, status);
        setSeatToEdit(null); // Fecha o modal após sucesso
      } catch (err) {
        // Opcional: Mostrar um toast de erro aqui
        console.error("Falha ao salvar assento", err);
      }
    }
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

          {/* Mostra um indicador de carregamento global no header, se quiser */}
          {isLoading && (
            <span className="text-sm text-purple-600 font-semibold animate-pulse">
              Carregando mapa...
            </span>
          )}
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 custom-scrollbar">

          {/* MENSAGEM DE ERRO GLOBAL */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex justify-between items-center">
              <span>{error}</span>
              <button onClick={reload} className="text-sm font-bold underline">Tentar novamente</button>
            </div>
          )}

          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">

            {/* PAINEL LATERAL (FORMULÁRIO E LEGENDA) */}
            <div className="w-full lg:w-[320px] flex flex-col gap-6 shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <AddColumnForm
                  onAdd={adicionarColuna}
                  isLoading={isLoading} // Para desabilitar o botão enquanto salva
                />
              </div>
              <SeatLegend />
            </div>

            {/* MAPA DE ASSENTOS */}
            <div className="flex-1 bg-white rounded-2xl p-6 lg:p-10 border border-slate-100 flex flex-col relative">

              {/* Opacidade visual caso esteja carregando */}
              <div className={`transition-opacity ${isLoading && columns.length === 0 ? 'opacity-50' : 'opacity-100'}`}>

                {columns.length === 0 && !isLoading ? (
                  <div className="text-center text-slate-400 mt-20">
                    <p className="text-lg">Nenhuma fileira cadastrada.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-x-auto pb-8 custom-scrollbar">
                    <div className="min-w-max mx-auto flex flex-col gap-5">
                      {/* Substitua o map das colunas por este: */}
                      {columns.map((column, index) => (
                        <div
                          key={column.identificador ?? `coluna-${index}`}
                          className="flex items-center gap-6 group"
                        >

                          {/* CAIXA COM A LETRA DA FILEIRA (Ex: A) */}
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 shadow-sm shrink-0">
                            {column.identificador}
                          </div>

                          <div className="flex gap-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                            {column.assentos?.map((assento, seatIndex) => (
                              <SeatItem
                                key={assento.id ?? `seat-${index}-${seatIndex}`}
                                assento={assento}
                                onClick={() => handleEditRequest(assento)}
                              />
                            ))}
                          </div>

                          <button
                            // Se a sua API deleta pelo ID numérico, mantenha column.id. 
                            // Se deleta pela letra, mude para column.identificador
                            onClick={() => deleteColumn(column.id!)}
                            className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl border border-transparent hover:border-rose-600 transition-all"
                          >
                            Excluir
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
      </main>

      {/* MODAL DE EDIÇÃO DE ASSENTO */}
      {seatToEdit && (
        <EditSeatModal
          assento={seatToEdit}
          onClose={() => setSeatToEdit(null)}
          onSave={handleSaveSeat}
        />
      )}
    </div>
  );
}