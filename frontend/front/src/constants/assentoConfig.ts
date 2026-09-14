import { Armchair, Star, Accessibility } from 'lucide-react';

export const SEAT_TYPES: Record<string, any> = {
  standard: { id: 'standard', label: 'Padrão', icon: Armchair, color: 'text-[#A1A1AA]' },
  vip: { id: 'vip', label: 'VIP', icon: Star, color: 'text-amber-400' },
  pcd: { id: 'pcd', label: 'PCD', icon: Accessibility, color: 'text-blue-400' }
};

export const SEAT_STATUS: Record<string, any> = {
  ok: {
    id: 'ok',
    label: 'Ok',
    bg: 'bg-[#120B18] hover:bg-[#7C3AED]/10',
    activeBg: 'bg-[#120B18]',
    border: 'border-violet-500/30 hover:border-[#7C3AED]',
    activeBorder: 'border-[#7C3AED]',
    text: 'text-[#F8F8F8]'
  },
  maintenance: {
    id: 'maintenance',
    label: 'Manutenção',
    bg: 'bg-stone-900/50 hover:bg-stone-800',
    activeBg: 'bg-stone-900',
    border: 'border-stone-700 hover:border-stone-500',
    activeBorder: 'border-stone-500',
    text: 'text-stone-400'
  }
};