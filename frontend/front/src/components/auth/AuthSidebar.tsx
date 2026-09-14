import React from 'react';
import { Ticket } from 'lucide-react';

export default function AuthSidebar() {
  return (
    <aside className="hidden md:flex flex-col md:w-5/12 bg-[#0B0710]/50 border-r border-violet-500/10 p-8 lg:p-12 justify-between relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[120px] opacity-10"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-[#120B18] border border-violet-500/20 text-[#C4B5FD] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            <i className="fa-solid fa-masks-theater"></i>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#FFFFFF]">Gestus</h1>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-snug text-[#F8F8F8]">
          O palco principal da sua gestão.
        </h2>
        <p className="text-[#A1A1AA] text-sm lg:text-base leading-relaxed">
          Sistema completo para administração de teatros. Controle sua bilheteria, gerencie locações e tenha tudo em um só lugar.
        </p>
      </div>

      <div className="relative z-10 mt-12 hidden md:block">
        <div className="flex items-center gap-4 bg-[#120B18]/60 p-5 rounded-2xl backdrop-blur-md border border-violet-500/20 shadow-lg">
          <div className="p-3 bg-[#7C3AED]/10 rounded-xl shrink-0 border border-[#7C3AED]/20">
            <Ticket size={28} className="text-[#C4B5FD] stroke-[1.5]" />
          </div>
          <p className="text-sm font-medium text-[#E4E4E7] leading-snug">
            Controle de ingressos, mapas de assentos e borderôs simplificados.
          </p>
        </div>
      </div>
    </aside>
  );
}