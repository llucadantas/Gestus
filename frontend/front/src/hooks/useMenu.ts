import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SessaoDestaque, Teatro, Usuario } from "../types/menu";
import { teatroService } from "@/src/services/teatroService";
import { dashboardService } from "@/src/services/dashboardService";
import { DashboardResponse } from "../types/dashboard";

export function useMenu() {
    const router = useRouter();
    
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [teatro, setTeatro] = useState<Teatro | null>(null);
    
    const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
    
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        const inicializarDashboard = async () => {
            setCarregando(true);
            setErro(null);
            
            const userSalvo = localStorage.getItem('usuarioGestus');
            if (!userSalvo) {
                router.push('/login');
                return;
            }
            setUsuario(JSON.parse(userSalvo));

            try {
                const dadosTeatro = await teatroService.getTeatro();
                setTeatro(dadosTeatro);
                
                const dadosDashboard = await dashboardService.getDashboard();
                setDashboardData(dadosDashboard);

            } catch (error: any) {
                console.error("Erro ao inicializar dashboard:", error);
                if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 501) {
                    localStorage.removeItem('usuarioGestus');
                    router.push('/login');
                } else {
                    setErro("Não foi possível carregar as informações do painel.");
                }
            } finally {
                setCarregando(false);
            }
        };

        inicializarDashboard();
    }, [router]);

    return {
        usuario,
        teatro,
        dashboardData,
        carregando,
        erro
    };
}
