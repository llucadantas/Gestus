'use client';

import { useRouter } from 'next/navigation';
import { Ticket, CalendarDays, Armchair, ChevronRight, BarChart3, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#000000] font-sans text-[#F8F8F8] relative overflow-hidden selection:bg-[#7C3AED]/30 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[180px] opacity-[0.07] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[180px] opacity-[0.05] pointer-events-none"></div>
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[60rem] h-[30rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[200px] opacity-[0.03] pointer-events-none"></div>

      {/* Navbar Minimalista */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-violet-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#120B18] border border-violet-500/20 text-[#C4B5FD] rounded-xl flex items-center justify-center text-xl shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <i className="fa-solid fa-masks-theater"></i>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F8F8F8]">Gestus</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 text-sm font-medium text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
          >
            Entrar
          </button>
          <button
            onClick={() => router.push('/cadastro')}
            className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] transition-all active:scale-95"
          >
            Criar Conta Grátis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#C4B5FD] text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></span>
          A Revolução na Gestão Teatral
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#F8F8F8] mb-6 max-w-4xl leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Gerencie seu teatro com uma experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD]">Premium.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Venda de ingressos, mapeamento interativo de assentos, gestão de contratos e regras de preço dinâmicas em uma única plataforma minimalista e poderosa.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <button
            onClick={() => router.push('/cadastro')}
            className="w-full sm:w-auto px-8 py-4 bg-[#F8F8F8] text-[#000000] hover:bg-[#E4E4E7] font-bold rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all active:scale-95 flex items-center justify-center gap-2 group"
          >
            Começar Agora
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto px-8 py-4 bg-[#120B18] text-[#F8F8F8] hover:bg-[#7C3AED]/10 border border-violet-500/30 hover:border-[#7C3AED] font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center"
          >
            Acessar Sistema
          </button>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {/* Card 1 */}
          <div className="bg-[#120B18]/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-8 text-left hover:border-[#7C3AED]/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#0B0710] rounded-2xl border border-violet-500/30 flex items-center justify-center mb-6 group-hover:border-[#7C3AED] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all">
              <Armchair className="w-7 h-7 text-[#C4B5FD]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F8F8] mb-3">Mapeamento Visual</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Crie a planta do seu teatro, bloqueie poltronas, defina áreas VIP e acompanhe a ocupação em tempo real de forma interativa.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#120B18]/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-8 text-left hover:border-[#7C3AED]/50 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-[#0B0710] rounded-2xl border border-violet-500/30 flex items-center justify-center mb-6 group-hover:border-[#7C3AED] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all relative z-10">
              <Ticket className="w-7 h-7 text-[#C4B5FD]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F8F8] mb-3 relative z-10">Ponto de Venda (PDV)</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed relative z-10">
              Venda ingressos presencialmente de forma rápida. Interface focada em performance e sem recarregamentos (Single Page App).
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#120B18]/80 backdrop-blur-md border border-violet-500/20 rounded-3xl p-8 text-left hover:border-[#7C3AED]/50 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#0B0710] rounded-2xl border border-violet-500/30 flex items-center justify-center mb-6 group-hover:border-[#7C3AED] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all">
              <CalendarDays className="w-7 h-7 text-[#C4B5FD]" />
            </div>
            <h3 className="text-xl font-bold text-[#F8F8F8] mb-3">Agenda e Contratos</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">
              Gestão automatizada de artistas e aluguéis. O sistema previne choques de horário garantindo 1 hora de margem de segurança.
            </p>
          </div>
        </div>

        {/* Mini Status / Social Proof */}
        <div className="mt-24 pt-12 border-t border-violet-500/10 flex flex-wrap justify-center gap-12 text-[#A1A1AA]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
            <span className="text-sm font-medium">Dashboard KPI Inteligente</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Alta Segurança & Performance</span>
          </div>
        </div>
      </main>
    </div>
  );
}
