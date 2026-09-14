'use client';
import React from 'react';
import Link from 'next/link'; 
import {
  Armchair,
  LayoutDashboard,
  Ticket,
  ScrollText,
  FileSignature,
  LogOut,
} from 'lucide-react';
import Logo from './logo';
import Logout from './logout';

export type Page = 'menu' | 'tickets' | 'seats' | 'pricing' | 'contracts';

interface SidebarProps {
  color?: string;
  activePage: Page;
}

const MENU_GERAL = [
  { id: 'menu', label: 'Menu', icon: LayoutDashboard, href: '/menu' },
  { id: 'tickets', label: 'Vender Ingressos', icon: Ticket, href: '/menu/venda' },
  { id: 'seats', label: 'Mapa de Assentos', icon: Armchair, href: '/menu/mapeamento' },
] as const;

const MENU_GESTAO = [
  { id: 'pricing', label: 'Regras de Preço', icon: ScrollText, href: '/menu/regras' },
  { id: 'contracts', label: 'Contratos de Aluguel', icon: FileSignature, href: '/menu/contrato' },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ 
  color = '#0B0710', 
  activePage 
}) => {
  
  const renderNavLink = (item: typeof MENU_GERAL[number] | typeof MENU_GESTAO[number]) => {
    const isActive = activePage === item.id;
    const Icon = item.icon;

    return (
      <li key={item.id}>
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
            isActive
              ? 'bg-[#120B18] border border-violet-500/20 text-[#C4B5FD] shadow-[0_0_10px_rgba(124,58,237,0.1)]'
              : 'text-[#A1A1AA] hover:bg-[#120B18]/50 hover:text-[#F8F8F8] border border-transparent'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon size={18} className={isActive ? 'text-[#7C3AED]' : 'text-[#A1A1AA] group-hover:text-[#F8F8F8]'} />
          <span className="font-medium text-sm">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      className="w-64 flex flex-col shrink-0 border-r border-violet-500/20 bg-[#0B0710]/80 backdrop-blur-xl relative z-20"
    >
      <Logo />

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        
        <div>
          <p className="text-[11px] font-bold text-[#7C3AED] mb-3 px-2 uppercase tracking-wider">
            Geral
          </p>
          <ul className="space-y-2">
            {MENU_GERAL.map(renderNavLink)}
          </ul>
        </div>

        <div>
          <p className="text-[11px] font-bold text-[#7C3AED] mb-3 px-2 uppercase tracking-wider">
            Gestão e Eventos
          </p>
          <ul className="space-y-2">
            {MENU_GESTAO.map(renderNavLink)}
          </ul>
        </div>
      </nav>

        <Logout />
    </aside>
  );
};

export default Sidebar;