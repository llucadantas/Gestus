'use client';

import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import { Modal } from '@/src/components/conteudos/Modal';
import { Badge } from '@/src/components/conteudos/Bradge';
import { useRegras } from '@/src/hooks/useRegras';
import Sidebar from '@/src/components/menu/sideBar';

// CORRIGIDO: Retirado o 'Ç' de TERCA
const DIAS_SEMANA = [
    { id: 'SEGUNDA', label: 'Segunda' }, { id: 'TERCA', label: 'Terça' },
    { id: 'QUARTA', label: 'Quarta' }, { id: 'QUINTA', label: 'Quinta' },
    { id: 'SEXTA', label: 'Sexta' }, { id: 'SABADO', label: 'Sábado' }, { id: 'DOMINGO', label: 'Domingo' }
];

// CORRIGIDO: Todos os meses em Português e sem acento (MARCO invés de MARÇO)
const MESES = [
    { id: 'JANEIRO', label: 'Jan' }, { id: 'FEVEREIRO', label: 'Fev' }, { id: 'MARCO', label: 'Mar' },
    { id: 'ABRIL', label: 'Abr' }, { id: 'MAIO', label: 'Mai' }, { id: 'JUNHO', label: 'Jun' },
    { id: 'JULHO', label: 'Jul' }, { id: 'AGOSTO', label: 'Ago' }, { id: 'SETEMBRO', label: 'Set' },
    { id: 'OUTUBRO', label: 'Out' }, { id: 'NOVEMBRO', label: 'Nov' }, { id: 'DEZEMBRO', label: 'Dez' }
];

export default function RegrasPage() {
    const{
        carregando,
        setCarregando,
        setDescricao,
        setIsModalOpen,
        setPreco,
        setRegras,
        setSelectedDias,
        setSelectedMeses,
        isModalOpen,
        regras,
        descricao,
        preco,
        selectedDias,
        selectedMeses,
        handleExcluir,
        handleSalvar,
        carregarRegras,
        toggleSelection,
        fecharModal
    } = useRegras();

    const formatarMoeda = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    if (carregando) return (
        <div className="flex h-screen bg-[#000000]">
            <Sidebar color="#0B0710" activePage="pricing" />
            <div className="flex-1 flex flex-col items-center justify-center text-[#A1A1AA]">Carregando regras...</div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#000000] font-sans relative overflow-hidden text-[#F8F8F8]">
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <Sidebar color="#0B0710" activePage="pricing" />

            <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative z-10">
                <PageHeader 
                    titulo="Regras de Preço"
                    descricao="Gerencie os valores de contrato e as condições da regra."
                    textoBotaoAcao="Nova Regra"
                    aoClicarAcao={() => setIsModalOpen(true)}
                />

                <TableContainer>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-violet-500/10 bg-[#0B0710]/50">
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Dias da Semana</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider">Meses</th>
                                <th className="px-6 py-4 font-semibold text-xs text-[#A1A1AA] uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-violet-500/10">
                            {regras.map((regra) => (
                                <tr key={regra.id} className="hover:bg-[#0B0710]/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#F8F8F8]">
                                        {regra.descricao}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#C4B5FD] text-lg">
                                        {formatarMoeda(regra.valor)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {!regra.diasSemana?.length ? <Badge texto="Todos os dias" cor="gray" /> : 
                                                regra.diasSemana.map((d: any) => <Badge key={d} texto={DIAS_SEMANA.find(x => x.id === d)?.label || d} cor="purple" />)
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {!regra.meses?.length ? <Badge texto="O ano todo" cor="gray" /> : 
                                                regra.meses.map((m: any) => <Badge key={m} texto={MESES.find(x => x.id === m)?.label || m} cor="emerald" />)
                                            }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button 
                                            onClick={() => handleExcluir(regra.id)}
                                            className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                            title="Excluir Regra"
                                        >
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!regras || regras.length === 0) && (
                                <tr><td colSpan={5} className="px-6 py-12 text-center text-[#A1A1AA]">Nenhuma regra cadastrada.</td></tr>
                            )}
                        </tbody>
                    </table>
                </TableContainer>

                <Modal isOpen={isModalOpen} onClose={fecharModal} titulo="Nova Regra de Preço">
                    <form onSubmit={handleSalvar} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Descrição da Regra</label>
                            <input
                                type="text"
                                required
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="w-full px-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 transition-all focus:ring-0"
                                placeholder="Ex: Finais de Semana - Alta Temporada"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Valor do Aluguel (R$)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A1A1AA]">R$</div>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-[#0B0710] border border-violet-500/20 rounded-xl outline-none focus:border-[#7C3AED] hover:border-violet-500/40 text-[#F8F8F8] placeholder-[#A1A1AA]/50 transition-all focus:ring-0"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Dias da Semana</label>
                            <div className="flex flex-wrap gap-2">
                                {DIAS_SEMANA.map((dia) => (
                                    <button
                                        key={dia.id}
                                        type="button"
                                        onClick={() => toggleSelection(dia.id, selectedDias, setSelectedDias)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedDias.includes(dia.id) ? 'bg-[#7C3AED] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' : 'bg-[#0B0710] text-[#A1A1AA] border-violet-500/20 hover:border-[#7C3AED] hover:text-[#C4B5FD]'}`}
                                    >
                                        {dia.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#A1A1AA] mb-2">Meses</label>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {MESES.map((mes) => (
                                    <button
                                        key={mes.id}
                                        type="button"
                                        onClick={() => toggleSelection(mes.id, selectedMeses, setSelectedMeses)}
                                        className={`py-2 rounded-lg text-xs font-medium border text-center transition-all ${selectedMeses.includes(mes.id) ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]' : 'bg-[#0B0710] text-[#A1A1AA] border-violet-500/20 hover:border-emerald-500/50 hover:text-emerald-400'}`}
                                    >
                                        {mes.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-violet-500/10">
                            <button type="button" onClick={fecharModal} className="px-5 py-2.5 text-[#A1A1AA] font-medium rounded-xl hover:bg-white/5 transition-colors">Cancelar</button>
                            <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] transition-all active:scale-[0.98]">Salvar Regra</button>
                        </div>
                    </form>
                </Modal>
            </main>
        </div>
    );
}