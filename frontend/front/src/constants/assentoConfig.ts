import { Armchair, Star, Accessibility } from 'lucide-react';

export const SEAT_TYPES: Record<string, any> = {
  standard: { id: 'standard', label: 'Padrão', icon: Armchair, color: 'text-slate-400' },
  vip: { id: 'vip', label: 'VIP', icon: Star, color: 'text-amber-500' },
  pcd: { id: 'pcd', label: 'PCD', icon: Accessibility, color: 'text-blue-500' }
};

export const SEAT_STATUS: Record<string, any> = {
  ok: {
    id: 'ok',
    label: 'Ok',
    bg: 'bg-slate-100 hover:bg-slate-200',
    activeBg: 'bg-slate-100',
    border: 'border-slate-300',
    activeBorder: 'border-slate-400',
    text: 'text-slate-700'
  },
  maintenance: {
    id: 'maintenance',
    label: 'Manutenção',
    bg: 'bg-stone-200 hover:bg-stone-300',
    activeBg: 'bg-stone-200',
    border: 'border-stone-400',
    activeBorder: 'border-stone-500',
    text: 'text-stone-500'
  }
};