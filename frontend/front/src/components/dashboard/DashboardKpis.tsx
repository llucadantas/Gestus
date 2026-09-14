import React from 'react';
import { KpisDto } from '@/src/types/dashboard';

interface Props {
    kpis?: KpisDto;
}

export default function DashboardKpis({ kpis }: Props) {
    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
    };

    const kpisData = [
        { title: "Ingressos Vendidos", value: kpis?.ingressosVendidos || "0", icon: "fa-ticket", color: "text-[#C4B5FD]", bg: "bg-[#7C3AED]/10", border: "border-[#7C3AED]/20" },
        { title: "Aluguéis Ativos", value: kpis?.alugueisAtivos || "0", icon: "fa-building", color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
        { title: "Sessões na Semana", value: kpis?.sessoesSemana || "0", icon: "fa-calendar-check", color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
        { title: "Receita Prevista", value: formatarMoeda(kpis?.receitaPrevista || 0), icon: "fa-wallet", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpisData.map((kpi, index) => (
                <div key={index} className="bg-[#120B18] rounded-2xl p-6 border border-violet-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-5 hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300">
                    <div className={`${kpi.bg} ${kpi.color} ${kpi.border} border w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                        <i className={`fa-solid ${kpi.icon}`}></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#A1A1AA] mb-1">{kpi.title}</p>
                        <h3 className="text-2xl font-bold text-[#F8F8F8] tracking-tight">{kpi.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}