'use client';

import Input from '@/src/components/auth/Input';
import Button from '@/src/components/auth/Button';
import AuthSidebar from '@/src/components/auth/AuthSidebar';

import { useState } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

export default function Login() {
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
            router.push('/menu')
            
        } catch (error: any) {
            console.error('Erro ao logar:', error);
            setErrorMessage(error.response?.data?.message || 'E-mail ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <main className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row fade-in-up">
                
                <AuthSidebar />

                <section className="w-full md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md w-full mx-auto">
                        
                        <div className="md:hidden flex items-center justify-center gap-3 mb-8 text-gestus">
                            <div className="w-12 h-12 bg-purple-100 text-gestus rounded-xl flex items-center justify-center text-2xl shadow-sm">
                                <i className="fa-solid fa-masks-theater"></i>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight">Gestus</h1>
                        </div>

                        <header className="mb-8 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h2>
                            <p className="text-gray-500">Por favor, insira seus dados para continuar.</p>
                        </header>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleLogin} method='POST' className="space-y-6">
                            
                            <Input 
                                label="E-mail ou Usuário"
                                id="email"
                                type="email"
                                icon="fa-envelope"
                                placeholder="admin@seuteatro.com.br"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                
                            />

                            <Input 
                                label="Senha"
                                id="password"
                                type="password"
                                icon="fa-lock"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            

                            <Button type="submit" icon="fa-arrow-right">
                                {loading ? 'Carregando...' : 'Acessar o Sistema'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-3">Novo no Gestus?</p>
                            <a href="/cadastro" className="w-full sm:w-auto text-center px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gestus hover:text-gestus transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 flex justify-center items-center gap-2 text-sm sm:text-base">
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                <span>Crie sua conta:</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}