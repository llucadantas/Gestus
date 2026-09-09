import React, { useState } from 'react';
import { Armchair, X, CheckCircle2, Save } from 'lucide-react';
import { Assento } from '@/src/types/assento';
import { SEAT_STATUS, SEAT_TYPES } from '@/src/constants/assentoConfig';

interface EditSeatModalProps {
  assento: Assento;
  onClose: () => void;
  onSave: (tipo: string, status: string) => Promise<void>;
}

export function EditSeatModal({ assento, onClose, onSave }: EditSeatModalProps) {
  // Inicia o formulário local com os dados atuais do assento
  const [tipo, setTipo] = useState(assento.tipo);
  const [status, setStatus] = useState(assento.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(tipo, status);
      // O Modal será fechado pelo componente pai ao finalizar
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={onClose} />

      {/* MODAL */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 text-purple-700 p-2 rounded-xl">
              <Armchair size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              Edição de Assento <span className="text-[#5D1B85]">{assento.codigoPosicao}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 bg-slate-100 hover:bg-slate-200 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* SELETOR DE TIPO */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Tipo de Assento
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(SEAT_TYPES).map((typeOpt) => {
                const Icon = typeOpt.icon;
                const isSelected = tipo === typeOpt.id;

                return (
                  <button
                    key={typeOpt.id}
                    onClick={() => setTipo(typeOpt.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={20} className={isSelected ? typeOpt.color : 'opacity-70'} />
                    <span className="text-xs font-semibold">{typeOpt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELETOR DE SITUAÇÃO */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
              Situação Atual
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(SEAT_STATUS).map((statusOpt) => {
                const isSelected = status === statusOpt.id;

                return (
                  <button
                    key={statusOpt.id}
                    onClick={() => setStatus(statusOpt.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${statusOpt.activeBg} ${statusOpt.activeBorder} ${statusOpt.text} shadow-sm`
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm font-semibold">{statusOpt.label}</span>
                    {isSelected && <CheckCircle2 size={18} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-5 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-medium bg-[#5D1B85] hover:bg-[#4a156b] text-white flex items-center gap-2 shadow-md shadow-purple-900/10 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}