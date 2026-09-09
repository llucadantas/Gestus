import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SessaoDestaque, Teatro, Usuario } from "../types/menu";
import { mapAssentoService } from "@/src/services/mapAssentoService";
import { teatroService } from "@/src/services/teatroService";
import { sessaoService } from "@/src/services/sessaoService";

export function useMenu(){
    const router = useRouter();
    
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [teatro, setTeatro] = useState<Teatro | null>(null);
    const [sessoesDestaque, setSessoesDestaque] = useState<SessaoDestaque[]>([]);
    
    const [carregando, setCarregando] = useState(true);
    const [carregandoSessoes, setCarregandoSessoes] = useState(true);

    useEffect(() => {
        const inicializarDashboard = async () => {
            setCarregando(true);
            
            const userSalvo = localStorage.getItem('usuarioGestus');
            if (!userSalvo) {
                router.push('/login');
                return;
            }
            setUsuario(JSON.parse(userSalvo));

            try {
                // const dadosColuna = await mapAssentoService.getColunas();
                // if (!dadosColuna || dadosColuna.length === 0) {
                //     router.push('/menu/mapeamento');
                //     return;
                // }

                const dadosTeatro = await teatroService.getTeatro();
                setTeatro(dadosTeatro);
                
                carregarSessoesDestaque();

            } catch (error: any) {
                console.error("Erro ao inicializar dashboard:", error);
                if ([401, 403, 501].includes(error.response?.status)) {
                    localStorage.removeItem('usuarioGestus');
                    router.push('/login');
                }
            } finally {
                setCarregando(false);
            }
        };

        inicializarDashboard();
    }, [router]);

    const carregarSessoesDestaque = async () => {
        setCarregandoSessoes(true);
        try {
            const response = await sessaoService.getSessoes(0, 5);
            setSessoesDestaque(response.content || response); 
        } catch (error) {
            console.error("Erro ao carregar sessões em destaque:", error);
        } finally {
            setCarregandoSessoes(false);
        }
    };

    return {
        usuario,
        teatro,
        sessoesDestaque,
        carregando,
        carregandoSessoes
    };
}
