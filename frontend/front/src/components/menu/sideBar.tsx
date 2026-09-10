import React from 'react';
import {
  Armchair,
  LayoutDashboard,
  Ticket,
  ScrollText,
  FileSignature,
  LogOut,
} from 'lucide-react';
import Logo from './logo';

export type Page = 'menu' | 'tickets' | 'seats' | 'pricing' | 'contracts';

interface SidebarProps {
  color?: string;
  activePage: Page;
}

// Estrutura de dados para alimentar o menu dinamicamente
const MENU_GERAL = [
  { id: 'menu', label: 'Menu', icon: LayoutDashboard, href: '../menu' },
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
  
  // Função auxiliar para renderizar os links e aplicar o estado ativo corretamente
  const renderNavLink = (item: typeof MENU_GERAL[number] | typeof MENU_GESTAO[number]) => {
    const isActive = activePage === item.id;
    const Icon = item.icon;

    return (
      <li key={item.id}>
        <a
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
        </a>
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
        
        {/* SESSÃO: GERAL */}
        <div>
          <p className="text-xs font-bold text-purple-300 mb-3 px-3 uppercase tracking-wider">
            Geral
          </p>
          <ul className="space-y-1">
            {MENU_GERAL.map(renderNavLink)}
          </ul>
        </div>

        {/* SESSÃO: GESTÃO E EVENTOS */}
        <div>
          <p className="text-xs font-bold text-purple-300 mb-3 px-3 uppercase tracking-wider">
            Gestão e Eventos
          </p>
          <ul className="space-y-1">
            {MENU_GESTAO.map(renderNavLink)}
          </ul>
        </div>
      </nav>

      {/* SESSÃO: SAIR */}
      <div className="p-4 border-t border-white/10">
        <button
          type="button"
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-purple-200 hover:bg-white/10 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900/40 flex items-center justify-center border border-white/10">
            <LogOut size={14} />
          </div>
          <span className="font-medium text-sm">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;