import React from 'react';
import { Ticket } from 'lucide-react';

export default function AuthSidebar() {
  return (
    <aside className="hidden md:flex flex-col md:w-5/12 bg-[#5D1B85] text-white p-8 lg:p-12 justify-between relative overflow-hidden">
      
      {/* Efeitos de fundo (Blobs) substituindo as antigas variáveis do Tailwind */}
      <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 bg-[#3a0f54] rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

      <div className="relative z-10">
        
        {/* Logo - Estrutura e ícone originais mantidos, apenas com a cor adaptada para o hex exato */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white text-[#5D1B85] rounded-xl flex items-center justify-center text-2xl shadow-lg">
            <i className="fa-solid fa-masks-theater"></i>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Gestus</h1>
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4 leading-snug">
          O palco principal da sua gestão.
        </h2>
        <p className="text-purple-200 text-sm lg:text-base leading-relaxed">
          Sistema completo para administração de teatros. Controle sua bilheteria, gerencie locações e tenha tudo em um só lugar.
        </p>
      </div>

      <div className="relative z-10 mt-12 hidden md:block">
        
        {/* Card informativo adaptado com o estilo de fundo glassmorphism (white/10) do painel */}
        <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-sm border border-purple-400/20 shadow-sm">
          
          <div className="p-3 bg-white/10 rounded-xl shrink-0">
            <Ticket size={28} className="text-purple-200 stroke-[1.5]" />
          </div>
          
          <p className="text-sm font-medium text-purple-100 leading-snug">
            Controle de ingressos, mapas de assentos e borderôs simplificados.
          </p>
          
        </div>
      </div>
    </aside>
  );
}