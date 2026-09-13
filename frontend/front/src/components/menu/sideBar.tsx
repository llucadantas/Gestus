'use client';
import React from 'react';
import Link from 'next/link'; // Importação essencial para Next.js
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
// import Logout from './logout'; // Comentado para não dar aviso de variável não usada, caso não seja um botão direto.

export type Page = 'menu' | 'tickets' | 'seats' | 'pricing' | 'contracts';

interface SidebarProps {
  color?: string;
  activePage: Page;
}

// Caminho do "Menu" corrigido para a rota absoluta
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
  color = '#5D1B85', 
  activePage 
}) => {
  
  const renderNavLink = (item: typeof MENU_GERAL[number] | typeof MENU_GESTAO[number]) => {
    const isActive = activePage === item.id;
    const Icon = item.icon;

    return (
      <li key={item.id}>
        {/* Substituído <a> por <Link> do Next.js para navegação rápida (SPA) */}
        <Link
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isActive
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-purple-200 hover:bg-white/10'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon size={18} />
          <span className="font-medium text-sm">{item.label}</span>
        </Link>
      </li>
    );
  };

  return (
    <aside
      className="w-64 text-white flex flex-col shrink-0"
      style={{ backgroundColor: color }}
    >
      <Logo />

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
        
        <div>
          <p className="text-xs font-bold text-purple-300 mb-3 px-3 uppercase tracking-wider">
            Geral
          </p>
          <ul className="space-y-1">
            {MENU_GERAL.map(renderNavLink)}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold text-purple-300 mb-3 px-3 uppercase tracking-wider">
            Gestão e Eventos
          </p>
          <ul className="space-y-1">
            {MENU_GESTAO.map(renderNavLink)}
          </ul>
        </div>
      </nav>

        {/* Caso o seu './logout' seja o componente do botão inteiro, você pode substituir o <button> abaixo por <Logout /> */}
        <Logout />
    </aside>
  );
};

export default Sidebar;