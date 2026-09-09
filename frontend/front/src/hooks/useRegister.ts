import { useRouter } from "next/navigation";
import { useState } from "react";
import { authService } from "../services/authService";

export default function useRegister() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('')
    const [nomeTeatro, setNomeTeatro] = useState('')
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const dados = await authService.register(nome, password, nomeTeatro, email);
            console.log('Cadastro realizado com sucesso!', dados);
            router.push('/login');
            

        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            setErrorMessage(error.response?.data?.message || "Erro de Requisição");
        } finally {
            setLoading(false);
        }
    }
    

    return {
        email,
        setEmail,       // 2. Correção: Faltava retornar o SetEmail
        password,
        setPassword,
        nome,
        setNome,
        nomeTeatro,
        setNomeTeatro,    // 2. Correção: Faltava retornar o SetPassword
        loading,
        errorMessage,
        handleRegister     // 2. Correção: Faltava retornar a função de submit!
    }
}

