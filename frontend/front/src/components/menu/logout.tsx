'use client';
import { authService } from "@/src/services/authService"
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();
    const handleLogout = async () => {
    try {
        await authService.logout();
    } catch (error) {
        console.error("Erro na rota de logout:", error);
    } finally {
        localStorage.removeItem('usuarioGestus');
        router.push('/login');
    }
};
    return <>
        <div className="p-4 border-t border-violet-500/20">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl font-medium transition-all duration-300 text-left">
                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                <span className="text-sm">Sair do Sistema</span>
            </button>
        </div>
    </>
}