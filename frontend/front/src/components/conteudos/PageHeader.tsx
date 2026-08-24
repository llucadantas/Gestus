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
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gestus transition-colors mb-4 text-sm font-medium"
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    Voltar
                </button>
                <h1 className="text-2xl font-bold text-gray-800">{titulo}</h1>
                <p className="text-sm text-gray-500">{descricao}</p>
            </div>
            
            {textoBotaoAcao && aoClicarAcao && (
                <button
                    onClick={aoClicarAcao}
                    className="bg-gestus hover:bg-gestus-dark text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                    <i className={`fa-solid ${iconeBotaoAcao}`}></i>
                    {textoBotaoAcao}
                </button>
            )}
        </div>
    );
}