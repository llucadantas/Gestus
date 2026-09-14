interface BadgeProps {
    texto: String;
    cor: 'blue' | 'emerald' | 'purple' | 'gray';
}

export function Badge({ texto, cor }: BadgeProps) {
    const cores = {
        blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        purple: 'bg-[#7C3AED]/10 text-[#C4B5FD] border border-[#7C3AED]/20',
        gray: 'bg-[#0B0710] text-[#A1A1AA] border border-white/10'
    };

    return (
        <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${cores[cor]}`}>
            {texto}
        </span>
    );
}