interface TableContainerProps {
    children: React.ReactNode;
}

export function TableContainer({ children }: TableContainerProps) {
    return (
        <div className="bg-[#120B18] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-violet-500/20 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
}