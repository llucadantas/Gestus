interface BadgeProps {
    texto: string;
    cor: 'blue' | 'emerald' | 'purple' | 'gray';
}

export function Badge({ texto, cor }: BadgeProps) {
    // Mapeamento das cores do Tailwind para evitar que o compilador se perca
    const cores = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
        gray: 'bg-gray-100 text-gray-600'
    };

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${cores[cor]}`}>
            {texto}
        </span>
    );
}