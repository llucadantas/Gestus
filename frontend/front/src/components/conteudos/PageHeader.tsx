import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    titulo: string;
    descricao: string;
    textoBotaoAcao?: string;
    iconeBotaoAcao?: string; // Ex: "fa-plus"
    aoClicarAcao?: () => void;
}

export function PageHeader({ titulo, descricao, textoBotaoAcao, iconeBotaoAcao = "fa-plus", aoClicarAcao }: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#C4B5FD] transition-colors mb-4 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-[#F8F8F8] tracking-tight">{titulo}</h1>
                <p className="text-sm text-[#A1A1AA] mt-1">{descricao}</p>
            </div>
            
            {textoBotaoAcao && aoClicarAcao && (
                <button
                    onClick={aoClicarAcao}
                    className="bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] active:scale-[0.98]"
                >
                    <i className={`fa-solid ${iconeBotaoAcao}`}></i>
                    {textoBotaoAcao}
                </button>
            )}
        </div>
    );
}