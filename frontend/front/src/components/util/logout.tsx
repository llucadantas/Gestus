import { authService } from "@/src/app/services/authService";
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
        <div className="p-4 border-t border-white/10">
            <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 w-full text-purple-200 hover:text-white hover:bg-white/10 rounded-xl font-medium transition-colors text-left">
                <i className="fa-solid fa-arrow-right-from-bracket w-5 text-center"></i>
                <span>Sair do Sistema</span>
            </button>
        </div>
    </>
}