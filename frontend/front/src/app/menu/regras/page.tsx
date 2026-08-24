'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { regrasService } from '@/src/app/services/regrasService';
import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import { Modal } from '@/src/components/conteudos/Modal';
import { Badge } from '@/src/components/conteudos/Bradge';

const DIAS_SEMANA = [
    { id: 'MONDAY', label: 'Segunda' }, { id: 'TUESDAY', label: 'Terça' },
    { id: 'WEDNESDAY', label: 'Quarta' }, { id: 'THURSDAY', label: 'Quinta' },
    { id: 'FRIDAY', label: 'Sexta' }, { id: 'SATURDAY', label: 'Sábado' }, { id: 'SUNDAY', label: 'Domingo' }
];

const MESES = [
    { id: 'JANUARY', label: 'Jan' }, { id: 'FEBRUARY', label: 'Fev' }, { id: 'MARCH', label: 'Mar' },
    { id: 'APRIL', label: 'Abr' }, { id: 'MAY', label: 'Mai' }, { id: 'JUNE', label: 'Jun' },
    { id: 'JULY', label: 'Jul' }, { id: 'AUGUST', label: 'Ago' }, { id: 'SEPTEMBER', label: 'Set' },
    { id: 'OCTOBER', label: 'Out' }, { id: 'NOVEMBER', label: 'Nov' }, { id: 'DECEMBER', label: 'Dez' }
];

const TURNOS = [
    { id: 'MANHA', label: 'Manhã' }, { id: 'TARDE', label: 'Tarde' }, { id: 'NOITE', label: 'Noite' }
];

export default function RegrasPage() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [regras, setRegras] = useState<any[]>([]);

    const [preco, setPreco] = useState('');
    const [selectedDias, setSelectedDias] = useState<string[]>([]);
    const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
    const [selectedTurnos, setSelectedTurnos] = useState<string[]>([]);

    useEffect(() => {
        carregarRegras();
    }, []);

    const carregarRegras = async () => {
        try {
            const dados = await regrasService.getRegras();
            setRegras(dados.map((regra: any) => ({
                id: regra.id,
                valor: regra.valor || regra.preco || 0,
                dia: regra.dia || regra.diaSemana || [],
                mes: regra.mes || [],
                turno: regra.turno || []
            })));
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
                parseFloat(preco),
                selectedDias,
                selectedMeses,
                selectedTurnos
            );
            
            const novaRegraFormatada = {
                id: novaRegraBackend?.id || Date.now(),
                valor: parseFloat(preco),
                dia: selectedDias,
                mes: selectedMeses,
                turno: selectedTurnos
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
        setPreco('');
        setSelectedDias([]);
        setSelectedMeses([]);
        setSelectedTurnos([]);
    };

    const formatarMoeda = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando regras...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            <PageHeader 
                titulo="Regras de Preço"
                descricao="Gerencie os valores de aluguel por período e sazonalidade."
                textoBotaoAcao="Nova Regra"
                aoClicarAcao={() => setIsModalOpen(true)}
            />

            <TableContainer>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Dias da Semana</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Meses</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Turnos</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {regras.map((regra) => (
                            <tr key={regra.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-800 text-lg">
                                    {formatarMoeda(regra.valor)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {!regra.dia?.length ? <Badge texto="Todos os dias" cor="gray" /> : 
                                            regra.dia.map((d: string) => <Badge key={d} texto={DIAS_SEMANA.find(x => x.id === d)?.label || d} cor="blue" />)
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {!regra.mes?.length ? <Badge texto="O ano todo" cor="gray" /> : 
                                            regra.mes.map((m: string) => <Badge key={m} texto={MESES.find(x => x.id === m)?.label || m} cor="emerald" />)
                                        }
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {!regra.turno?.length ? <Badge texto="Qualquer turno" cor="gray" /> : 
                                            regra.turno.map((t: string) => <Badge key={t} texto={TURNOS.find(x => x.id === t)?.label || t} cor="purple" />)
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!regras || regras.length === 0) && (
                            <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-500">Nenhuma regra cadastrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </TableContainer>

            <Modal isOpen={isModalOpen} onClose={fecharModal} titulo="Nova Regra de Preço">
                <form onSubmit={handleSalvar} className="space-y-6">
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
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${selectedDias.includes(dia.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    {dia.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Turnos</label>
                        <div className="flex flex-wrap gap-2">
                            {TURNOS.map((turno) => (
                                <button
                                    key={turno.id}
                                    type="button"
                                    onClick={() => toggleSelection(turno.id, selectedTurnos, setSelectedTurnos)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${selectedTurnos.includes(turno.id) ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    {turno.label}
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
                                    className={`py-1.5 rounded-lg text-xs font-medium border text-center ${selectedMeses.includes(mes.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white text-gray-600'}`}
                                >
                                    {mes.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={fecharModal} className="px-5 py-2.5 text-gray-600 rounded-xl hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="px-6 py-2.5 bg-gestus hover:bg-gestus-dark text-white font-medium rounded-xl">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}