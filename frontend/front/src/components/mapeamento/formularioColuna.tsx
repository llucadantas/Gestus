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
      setError(err.message || 'Falha ao adicionar a fileira.');
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
          <Settings2 size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Nova Fileira/Coluna</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
            Identificador (Ex: A)
          </label>
          <input
            type="text"
            value={newColId}
            onChange={(e) => setNewColId(e.target.value.toUpperCase())}
            placeholder="A"
            maxLength={5}
            disabled={isLoading}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all uppercase placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder:text-slate-400"
          />
        </div>

        {error && (
          <div className="text-rose-600 text-sm flex items-start gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 bg-[#5D1B85] hover:bg-[#4a156b] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-purple-900/10 disabled:opacity-70 disabled:active:scale-100"
        >
          <Plus size={18} />
          <span>{isLoading ? 'Cadastrando...' : 'Cadastrar Fileira'}</span>
        </button>
      </form>
    </>
  );
}