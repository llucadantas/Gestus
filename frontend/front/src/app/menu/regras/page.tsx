'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { regrasService } from '../../services/regrasService';

// Constantes mapeando os Enums do Java para exibição no Frontend
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

export default function RegrasPreco() {
    // Estados gerais
    const [carregando, setCarregando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);

    // Estado da lista de regras (Agora usando os nomes do Backend)
    const [regras, setRegras] = useState<any[]>([]);

    // Estados do Formulário
    const [preco, setPreco] = useState('');
    const [selectedDias, setSelectedDias] = useState<string[]>([]);
    const [selectedMeses, setSelectedMeses] = useState<string[]>([]);
    const [selectedTurnos, setSelectedTurnos] = useState<string[]>([]);

    useEffect(() => {
        const carregarDados = async () => {
            const userSalvo = localStorage.getItem('usuarioGestus');

            if (!userSalvo) {
                router.push('/login');
                return;
            }
            setUsuario(JSON.parse(userSalvo));

            try {
                const dadosRegras = await regrasService.getRegras();

                // Mapeia os dados garantindo que lemos "valor" e "dia" (ou as antigas se houver)
                setRegras(dadosRegras.map((regra: any) => ({
                    id: regra.id,
                    valor: regra.valor || regra.preco || 0,
                    dia: regra.dia || regra.diaSemana || [],
                    mes: regra.mes || [],
                    turno: regra.turno || []
                })));

            } catch (error: any) {
                console.error("Erro ao carregar dados das regras:", error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    localStorage.removeItem('usuarioGestus');
                    router.push('/login');
                }
            } finally {
                setCarregando(false);
            }
        };

        carregarDados();
    }, [router]);

    if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
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
            // Chamada para a API
            const novaRegraBackend = await regrasService.cadastrarRegra(
                parseFloat(preco),
                selectedDias,
                selectedMeses,
                selectedTurnos
            );
            
            console.log("Salvo com sucesso:", novaRegraBackend);

            // Atualiza a tabela local usando os nomes 'valor' e 'dia'
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
            console.error("Erro ao salvar a regra:", error);
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

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">

            {/* Cabecalho da Página */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gestus transition-colors mb-6 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Regras de Preço</h1>
                    <p className="text-sm text-gray-500">Gerencie os valores de aluguel por período e sazonalidade.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gestus hover:bg-gestus-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <i className="fa-solid fa-plus"></i>
                    Nova Regra
                </button>
            </div>

            {/* Tabela de Regras */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Dias da Semana</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Meses</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider">Turnos</th>
                                <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {regras.map((regra) => (
                                <tr key={regra.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-bold text-gray-800 text-lg">{formatarMoeda(regra.valor)}</div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {/* Usando ?. para proteger contra null/undefined */}
                                            {!regra.dia?.length ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">Todos os dias</span>
                                            ) : (
                                                regra.dia.map((d: string) => (
                                                    <span key={d} className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-md">
                                                        {DIAS_SEMANA.find(x => x.id === d)?.label}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {!regra.mes?.length ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">O ano todo</span>
                                            ) : (
                                                regra.mes.map((m: string) => (
                                                    <span key={m} className="px-2 py-1 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-md">
                                                        {MESES.find(x => x.id === m)?.label}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {!regra.turno?.length ? (
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">Qualquer turno</span>
                                            ) : (
                                                regra.turno.map((t: string) => (
                                                    <span key={t} className="px-2 py-1 text-xs font-bold bg-purple-50 text-purple-600 rounded-md">
                                                        {TURNOS.find(x => x.id === t)?.label}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Excluir regra">
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!regras || regras.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Nenhuma regra de preço cadastrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================================================
                MODAL DE CADASTRO
            ========================================================= */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">

                        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                            <h2 className="text-xl font-bold text-gray-800">Nova Regra de Preço</h2>
                            <button onClick={fecharModal} className="text-gray-400 hover:text-gray-600">
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSalvar} className="p-6 space-y-8">

                            {/* Preço */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Valor do Aluguel (R$)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 font-medium">R$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={preco}
                                        onChange={(e) => setPreco(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-gestus focus:border-transparent transition-all outline-none"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <p className="text-sm text-purple-800 flex items-start gap-2">
                                    <i className="fa-solid fa-circle-info mt-1"></i>
                                    Deixe as opções abaixo desmarcadas se a regra for válida para <strong>Todos</strong> (todos os dias, o ano todo, qualquer turno).
                                </p>
                            </div>

                            {/* Dias da Semana */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Dias da Semana</label>
                                <div className="flex flex-wrap gap-2">
                                    {DIAS_SEMANA.map((diaItem) => (
                                        <button
                                            key={diaItem.id}
                                            type="button"
                                            onClick={() => toggleSelection(diaItem.id, selectedDias, setSelectedDias)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedDias.includes(diaItem.id)
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
                                                }`}
                                        >
                                            {diaItem.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Turnos */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Turnos</label>
                                <div className="flex flex-wrap gap-2">
                                    {TURNOS.map((turnoItem) => (
                                        <button
                                            key={turnoItem.id}
                                            type="button"
                                            onClick={() => toggleSelection(turnoItem.id, selectedTurnos, setSelectedTurnos)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedTurnos.includes(turnoItem.id)
                                                ? 'bg-purple-500 border-purple-500 text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300'
                                                }`}
                                        >
                                            {turnoItem.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meses */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Meses</label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {MESES.map((mesItem) => (
                                        <button
                                            key={mesItem.id}
                                            type="button"
                                            onClick={() => toggleSelection(mesItem.id, selectedMeses, setSelectedMeses)}
                                            className={`py-2 rounded-lg text-sm font-medium border transition-colors text-center ${selectedMeses.includes(mesItem.id)
                                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'
                                                }`}
                                        >
                                            {mesItem.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ações do form */}
                            <div className="pt-4 flex items-center justify-end gap-3 sticky bottom-0 bg-white mt-auto">
                                <button
                                    type="button"
                                    onClick={fecharModal}
                                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-gestus hover:bg-gestus-dark text-white font-medium rounded-xl shadow-sm transition-colors"
                                >
                                    Salvar Regra
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}