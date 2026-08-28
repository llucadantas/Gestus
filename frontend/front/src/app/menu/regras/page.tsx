'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { regrasService } from '@/src/app/services/regrasService';
import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import { Modal } from '@/src/components/conteudos/Modal';
import { Badge } from '@/src/components/conteudos/Bradge';

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
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regras, setRegras] = useState<any[]>([]);

    // Form States
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [selectedDias, setSelectedDias] = useState<string[]>([]);
    const [selectedMeses, setSelectedMeses] = useState<string[]>([]);

    useEffect(() => {
        carregarRegras();
    }, []);

    const carregarRegras = async () => {
        try {
            const dados = await regrasService.getRegras();
            setRegras(dados.map((regra: any) => ({
                id: regra.id,
                descricao: regra.descricao,
                valor: regra.valor,
                diasSemana: regra.diasSemana || [],
                meses: regra.mes || []
            }))
        
        );
        console.log(dados);
        } catch (error: any) {
            console.error("Erro ao carregar regras:", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('usuarioGestus');
                router.push('/login');
            }
        } finally {
            setCarregando(false);
        }
    };

    const toggleSelection = (id: string, list: string[], setList: (val: string[]) => void) => {
        if (list.includes(id)) {
            setList(list.filter(item => item !== id));
        } else {
            setList([...list, id]);
        }
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const novaRegraBackend = await regrasService.cadastrarRegra(
                descricao,
                parseFloat(preco),
                selectedDias,
                selectedMeses
            );
            
            const novaRegraFormatada = {
                id: novaRegraBackend?.id || Date.now(),
                descricao: descricao,
                valor: parseFloat(preco),
                diasSemana: selectedDias,
                meses: selectedMeses
            };

            setRegras([...regras, novaRegraFormatada]);
            fecharModal();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Não foi possível salvar a regra.");
        }
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setDescricao('');
        setPreco('');
        setSelectedDias([]);
        setSelectedMeses([]);
    };

    const handleExcluir = async (id: number) => {
        const confirmacao = window.confirm("Deseja realmente excluir esta regra?");
        if (!confirmacao) return;

        try {
            await regrasService.deletarRegra(id);
            setRegras(regras.filter(regra => regra.id !== id)); 
        } catch (error) {
            console.error("Erro ao excluir a regra:", error);
            alert("Não foi possível excluir a regra.");
        }
    };

    const formatarMoeda = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando regras...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            <PageHeader 
                titulo="Regras de Preço"
                descricao="Gerencie os valores de aluguel e as condições da regra."
                textoBotaoAcao="Nova Regra"
                aoClicarAcao={() => setIsModalOpen(true)}
            />

            <TableContainer>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Dias da Semana</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Meses</th>
                            {/* Nova coluna para as ações alinhada à direita */}
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {regras.map((regra) => (
                            <tr key={regra.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    {regra.descricao}
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800 text-lg">
                                    {formatarMoeda(regra.valor)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {!regra.diasSemana?.length ? <Badge texto="Todos os dias" cor="gray" /> : 
                                            regra.diasSemana.map((d: string) => <Badge key={d} texto={DIAS_SEMANA.find(x => x.id === d)?.label || d} cor="blue" />)
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {!regra.meses?.length ? <Badge texto="O ano todo" cor="gray" /> : 
                                            regra.meses.map((m: string) => <Badge key={m} texto={MESES.find(x => x.id === m)?.label || m} cor="emerald" />)
                                        }
                                    </div>
                                </td>
                                {/* Novo botão de Excluir */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button 
                                        onClick={() => handleExcluir(regra.id)}
                                        className="w-9 h-9 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        title="Excluir Regra"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {(!regras || regras.length === 0) && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhuma regra cadastrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </TableContainer>

            <Modal isOpen={isModalOpen} onClose={fecharModal} titulo="Nova Regra de Preço">
                <form onSubmit={handleSalvar} className="space-y-6">
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição da Regra</label>
                        <input
                            type="text"
                            required
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gestus"
                            placeholder="Ex: Finais de Semana - Alta Temporada"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Valor do Aluguel (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gestus"
                            placeholder="0,00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Dias da Semana</label>
                        <div className="flex flex-wrap gap-2">
                            {DIAS_SEMANA.map((dia) => (
                                <button
                                    key={dia.id}
                                    type="button"
                                    onClick={() => toggleSelection(dia.id, selectedDias, setSelectedDias)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedDias.includes(dia.id) ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white text-gray-600 hover:border-blue-300'}`}
                                >
                                    {dia.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meses</label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {MESES.map((mes) => (
                                <button
                                    key={mes.id}
                                    type="button"
                                    onClick={() => toggleSelection(mes.id, selectedMeses, setSelectedMeses)}
                                    className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-colors ${selectedMeses.includes(mes.id) ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'bg-white text-gray-600 hover:border-emerald-300'}`}
                                >
                                    {mes.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={fecharModal} className="px-5 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 bg-gestus hover:bg-gestus-dark text-white font-medium rounded-xl shadow-sm transition-colors">Salvar Regra</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}