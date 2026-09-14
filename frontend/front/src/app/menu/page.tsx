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
            <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.1] pointer-events-none"></div>
                <i className="fa-solid fa-circle-notch fa-spin text-4xl text-[#C4B5FD]"></i>
                <p className="text-[#A1A1AA] font-medium z-10">Carregando painel...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-red-500 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>
                <i className="fa-solid fa-triangle-exclamation text-4xl text-red-500 z-10"></i>
                <p className="text-[#A1A1AA] font-medium z-10">{erro}</p>
                <button onClick={() => window.location.reload()} className="mt-4 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-[0_4px_15px_rgba(124,58,237,0.4)] transition-all z-10">
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#000000] flex font-sans relative overflow-hidden text-[#F8F8F8]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <Sidebar
                color="#0B0710"
                activePage="menu"
            />

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <Header titulo="Visão Geral" descricao="Acompanhe o desempenho do seu teatro." />

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
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