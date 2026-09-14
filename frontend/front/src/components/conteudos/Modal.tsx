interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    titulo: string;
    children: React.ReactNode;
    larguraMaxima?: string; // Ex: "max-w-md", "max-w-2xl"
}

export function Modal({ isOpen, onClose, titulo, children, larguraMaxima = "max-w-2xl" }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000000]/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
            <div className={`bg-[#120B18] border border-violet-500/20 rounded-[2rem] shadow-2xl w-full ${larguraMaxima} max-h-[90vh] overflow-y-auto flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200 custom-scrollbar`}>
                
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[100px] opacity-[0.15] pointer-events-none"></div>

                {/* Header do Modal */}
                <div className="px-6 py-5 border-b border-violet-500/10 flex justify-between items-center sticky top-0 bg-[#120B18]/95 backdrop-blur z-10">
                    <h2 className="text-xl font-bold text-[#F8F8F8] tracking-tight">{titulo}</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/5 transition-colors">
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Corpo do Modal */}
                <div className="p-6 relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}