import React, { useState } from 'react';
import { Settings2, Info, Plus } from 'lucide-react';

interface AddColumnFormProps {
  onAdd: (id: string, count: number) => Promise<void>;
  isLoading: boolean;
}

export function AddColumnForm({ onAdd, isLoading }: AddColumnFormProps) {
  const [newColId, setNewColId] = useState('');
  const [newColSeats, setNewColSeats] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const id = newColId.trim().toUpperCase();
    const seatsCount = parseInt(newColSeats, 10);

    if (!id) return setError('O identificador é obrigatório (ex: A, B).');
    if (isNaN(seatsCount) || seatsCount <= 0 || seatsCount > 100) {
      return setError('A quantidade deve ser entre 1 e 100.');
    }

    try {
      await onAdd(id, seatsCount);
      // Limpa os campos após o sucesso
      setNewColId('');
      setNewColSeats('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Falha ao adicionar a fileira.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#7C3AED]/10 text-[#C4B5FD] border border-[#7C3AED]/20 rounded-lg">
          <Settings2 size={20} />
        </div>
        <h3 className="font-bold text-[#F8F8F8]">Nova Fileira/Coluna</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
            Identificador (Ex: A)
          </label>
          <input
            type="text"
            value={newColId}
            onChange={(e) => setNewColId(e.target.value.toUpperCase())}
            placeholder="A"
            maxLength={5}
            disabled={isLoading}
            className="w-full bg-[#0B0710] border border-violet-500/20 rounded-xl px-4 py-2.5 text-[#F8F8F8] focus:outline-none focus:ring-0 focus:border-[#7C3AED] hover:border-violet-500/40 transition-all uppercase placeholder:text-[#A1A1AA]/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
            Qtd. de Cadeiras
          </label>
          <input
            type="number"
            value={newColSeats}
            onChange={(e) => setNewColSeats(e.target.value)}
            placeholder="Ex: 12"
            min="1"
            max="100"
            disabled={isLoading}
            className="w-full bg-[#0B0710] border border-violet-500/20 rounded-xl px-4 py-2.5 text-[#F8F8F8] focus:outline-none focus:ring-0 focus:border-[#7C3AED] hover:border-violet-500/40 transition-all placeholder:text-[#A1A1AA]/50"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm flex items-start gap-2 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] disabled:opacity-70 disabled:active:scale-100 disabled:shadow-none"
        >
          <Plus size={18} />
          <span>{isLoading ? 'Cadastrando...' : 'Cadastrar Fileira'}</span>
        </button>
      </form>
    </>
  );
}