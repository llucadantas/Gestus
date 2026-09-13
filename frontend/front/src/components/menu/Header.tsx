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
        <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
            <div className="flex items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
                    {descricao && <p className="text-sm text-gray-500 hidden sm:block">{descricao}</p>}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {children}
                <div className="flex items-center gap-3 pl-4 border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gestus text-white flex items-center justify-center font-bold uppercase">
                        {usuario?.nome?.[0] || 'U'}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-800">{usuario?.nome || 'Usuário'}</p>
                        <p className="text-gray-500 text-xs">{teatro?.nome || 'Teatro'}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}