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
        { title: "Ingressos Vendidos", value: kpis?.ingressosVendidos || "0", icon: "fa-ticket", color: "text-blue-500", bg: "bg-blue-100" },
        { title: "Aluguéis Ativos", value: kpis?.alugueisAtivos || "0", icon: "fa-building", color: "text-purple-500", bg: "bg-purple-100" },
        { title: "Sessões na Semana", value: kpis?.sessoesSemana || "0", icon: "fa-calendar-check", color: "text-green-500", bg: "bg-green-100" },
        { title: "Receita Prevista", value: formatarMoeda(kpis?.receitaPrevista || 0), icon: "fa-wallet", color: "text-emerald-600", bg: "bg-emerald-100" }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpisData.map((kpi, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={`${kpi.bg}${kpi.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                        <i className={`fa-solid ${kpi.icon}`}></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">{kpi.title}</p>
                        <h3 className="text-2xl font-bold text-gray-800">{kpi.value}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
}