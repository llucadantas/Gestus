import React, { ReactNode } from 'react';
import { useMenu } from '@/src/hooks/useMenu';

interface HeaderProps {
    titulo: string;
    descricao?: string;
    children?: ReactNode;
}

export default function Header({ titulo, descricao, children }: HeaderProps) {
    const { usuario, teatro } = useMenu();

    return (
        <header className="bg-[#0B0710]/80 backdrop-blur-md border-b border-violet-500/20 px-6 py-5 flex items-center justify-between sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-[#F8F8F8] tracking-tight">{titulo}</h2>
                    {descricao && <p className="text-sm text-[#A1A1AA] hidden sm:block mt-1">{descricao}</p>}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {children}
                <div className="flex items-center gap-3 pl-4 border-l border-violet-500/20">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#8B5CF6] shadow-[0_0_10px_rgba(124,58,237,0.3)] text-white flex items-center justify-center font-bold uppercase">
                        {usuario?.nome?.[0] || 'U'}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-[#F8F8F8]">{usuario?.nome || 'Usuário'}</p>
                        <p className="text-[#A1A1AA] text-xs">{teatro?.nome || 'Teatro'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}