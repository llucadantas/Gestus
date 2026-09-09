import { useRouter } from "next/navigation";
import { authService } from "../services/authService";
import { useState } from "react";

export default function useLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            await authService.login(email, password);
            router.push('/menu');
        } catch (error: any) {
            console.error('Erro ao logar:', error);
            setErrorMessage(error.response?.data?.message || 'E-mail ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    }

    return {
        email,
        setEmail,       // 2. Correção: Faltava retornar o SetEmail
        password,
        setPassword,    // 2. Correção: Faltava retornar o SetPassword
        loading,
        errorMessage,
        handleLogin     // 2. Correção: Faltava retornar a função de submit!
    };
}