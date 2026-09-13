'use client';

import { useState } from 'react';
import Sidebar from '@/src/components/menu/sideBar';
import { useMenu } from '@/src/hooks/useMenu';
import Header from '@/src/components/menu/Header';
import DashboardKpis from '@/src/components/dashboard/DashboardKpis';
import DashboardSessoes from '@/src/components/dashboard/DashboardSessoes';
import DashboardAlugueis from '@/src/components/dashboard/DashboardAlugueis';

export default function Menu() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        usuario,
        teatro,
        dashboardData,
        carregando,
        erro
    } = useMenu();

    if (carregando) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-gestus"></i>
                <p className="text-gray-500 font-medium">Carregando painel...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500"></i>
                <p className="text-gray-500 font-medium">{erro}</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-gestus text-white px-6 py-2 rounded-lg font-medium">Tentar novamente</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans relative">
            <Sidebar
                color="#5D1B85"
                activePage="menu"
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header titulo="Visão Geral" descricao="Acompanhe o desempenho do seu teatro." />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <DashboardKpis kpis={dashboardData?.kpis} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <DashboardSessoes 
                            sessoes={dashboardData?.sessoesDestaque || []} 
                        />
                        <DashboardAlugueis 
                            alugueis={dashboardData?.alugueisRecentes || []} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}