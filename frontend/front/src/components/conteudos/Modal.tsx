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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className={`bg-white rounded-3xl shadow-2xl w-full ${larguraMaxima} max-h-[90vh] overflow-y-auto flex flex-col`}>
                
                {/* Header do Modal */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                    <h2 className="text-xl font-bold text-gray-800">{titulo}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                {/* Corpo do Modal */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}