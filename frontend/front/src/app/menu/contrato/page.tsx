'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { contratoService } from '../../services/contratoService';
import { PageHeader } from '@/src/components/conteudos/PageHeader';
import { TableContainer } from '@/src/components/conteudos/TableCointeiner';
import { Modal } from '@/src/components/conteudos/Modal';
import { Badge } from '@/src/components/conteudos/Bradge';

export default function ContratosPage() {
    const router = useRouter();
    const [carregando, setCarregando] = useState(true);
    const [contratos, setContratos] = useState<any[]>([]);

    const [modalRenovar, setModalRenovar] = useState(false);
    const [contratoSelecionado, setContratoSelecionado] = useState<any>(null);
    const [novaData, setNovaData] = useState('');
    const [salvandoRenovacao, setSalvandoRenovacao] = useState(false);

    useEffect(() => {
        carregarContratos();
    }, []);

    const carregarContratos = async () => {
        try {
            const dados = await contratoService.getContratos();
            setContratos(dados);
        } catch (error) {
            console.error("Erro ao carregar contratos:", error);
        } finally {
            setCarregando(false);
        }
    };

    // A exclusão agora se baseia na data de INÍCIO do contrato.
    // Só é possível excluir se a peça ainda não tiver começado.
    const podeExcluir = (dataInicioIso: string) => {
        if (!dataInicioIso) return false;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return new Date(dataInicioIso + 'T00:00:00') > hoje;
    };

    const formatarData = (dataIso: string) => {
        if (!dataIso) return '';
        return new Intl.DateTimeFormat('pt-BR').format(new Date(dataIso + 'T00:00:00'));
    };

    const formatarMoeda = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

    const abrirRenovacao = (contrato: any) => {
        setContratoSelecionado(contrato);
        setNovaData('');
        setModalRenovar(true);
    };

    const handleConfirmarRenovacao = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvandoRenovacao(true);
        try {
            await contratoService.renovarContrato(contratoSelecionado.id, novaData);
            alert("Contrato renovado com sucesso!");
            setModalRenovar(false);
            carregarContratos();
        } catch (error) {
            console.error("Erro ao renovar:", error);
            alert("Não foi possível renovar o contrato.");
        } finally {
            setSalvandoRenovacao(false);
        }
    };

    const handleExcluir = async (id: number) => {
        if (!window.confirm("Deseja realmente excluir este contrato?")) return;
        try {
            await contratoService.excluirContrato(id);
            setContratos(contratos.filter(c => c.id !== id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Não foi possível excluir o contrato.");
        }
    };

    if (carregando) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando contratos...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-8 font-sans">
            <PageHeader 
                titulo="Aluguéis e Contratos"
                descricao="Gerencie o histórico e agendamentos de apresentações."
                textoBotaoAcao="Novo Contrato"
                aoClicarAcao={() => router.push('/menu/contrato/cadastrar')}
            />

            <TableContainer>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Peça</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Artista / Produtor</th>
                            {/* Ajustado o título da coluna */}
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Período e Turno</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-4 font-semibold text-sm text-gray-500 uppercase text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contratos.map((c) => {
                            // Verifica se a dataInicio é no futuro para habilitar o botão de exclusão
                            const liberado = podeExcluir(c.dataInicio);
                            return (
                                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-800">{c.nomePeca}</td>
                                    <td className="px-6 py-4 text-gray-600">{c.nomeArtista}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {/* Exibindo Início e Fim */}
                                            <span className="font-medium text-gray-700">
                                                {formatarData(c.dataInicio)} a {formatarData(c.dataFim)}
                                            </span>
                                            {/* Mantemos o Badge caso o backend ainda retorne o turno predominante */}
                                            {c.turno && (
                                                <div className="self-start">
                                                    <Badge texto={c.turno} cor="purple" />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{formatarMoeda(c.valor)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => abrirRenovacao(c)} 
                                                title="Renovar Contrato"
                                                className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50"
                                            >
                                                <i className="fa-solid fa-copy"></i>
                                            </button>
                                            <button 
                                                onClick={() => handleExcluir(c.id)} 
                                                disabled={!liberado}
                                                title={liberado ? "Excluir" : "Não permitido em contratos passados ou vigentes"}
                                                className={`w-9 h-9 flex items-center justify-center rounded-lg ${liberado ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-200 cursor-not-allowed'}`}
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {contratos.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Nenhum contrato encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </TableContainer>

            <Modal isOpen={modalRenovar} onClose={() => setModalRenovar(false)} titulo="Renovar Contrato" larguraMaxima="max-w-md">
                <form onSubmit={handleConfirmarRenovacao} className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Renovando contrato de <strong>{contratoSelecionado?.nomePeca}</strong>.
                    </p>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nova Data de Início</label>
                        <input 
                            type="date" 
                            required
                            value={novaData}
                            onChange={(e) => setNovaData(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-gestus"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={() => setModalRenovar(false)} className="px-4 py-2 text-gray-600 rounded-xl hover:bg-gray-100">Cancelar</button>
                        <button type="submit" disabled={salvandoRenovacao} className="px-5 py-2 bg-gestus hover:bg-gestus-dark text-white rounded-xl font-medium">
                            {salvandoRenovacao ? 'Salvando...' : 'Confirmar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}