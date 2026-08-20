'use client';
import Input from '@/src/components/login/Input';
import AuthSidebar from '@/src/components/login/AuthSidebar';
import { use, useState } from 'react';
import { authService } from '../services/authService';
import Button from '@/src/components/login/Button';

export default function Cadastro() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('')
    const [nomeTeatro, setNomeTeatro] = useState('')
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const register = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const dados = await authService.register(nome, password, nomeTeatro, email);
            console.log('Cadastro realizado com sucesso!', dados);

        } catch (error: any) {
            console.error('Erro ao cadastrar:', error);
            setErrorMessage(error.response?.data?.message || "Erro de Requisição");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <main className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row fade-in-up">

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
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cadastre seu Teatro</h2>
                            <p className="text-gray-500">Preencha os dados abaixo para iniciar sua gestão.</p>
                        </header>

                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={register} method='POST' className="space-y-6">

                            <Input
                                label="Nome do Administrador"
                                id="name"
                                type="text"
                                icon="fa-user"
                                placeholder="Seu nome completo"
                                onChange={(e) => setNome(e.target.value)}
                                value={nome}
                            />

                            <Input
                                label="Nome do Teatro"
                                id="theaterName"
                                type="text"
                                icon="fa-building"
                                placeholder="Ex: Teatro Municipal"
                                onChange={(e) => setNomeTeatro(e.target.value)}
                                value={nomeTeatro}
                            />

                            <Input
                                label="E-mail Administrativo"
                                id="email"
                                type="email"
                                icon="fa-envelope"
                                placeholder="admin@seuteatro.com.br"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <Input
                                    label="Senha"
                                    id="password"
                                    type="password"
                                    icon="fa-lock"
                                    placeholder="••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>


                            <Button type="submit" icon="fa-arrow-right">
                                {loading ? 'Carregando...' : 'Cadastrar'}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-3">Já possui um teatro cadastrado?</p>
                            <a href="/login" className="w-full sm:w-auto text-center px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-gestus hover:text-gestus transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/30 flex justify-center items-center gap-2 text-sm sm:text-base">
                                <i className="fa-solid fa-arrow-right-to-bracket"></i>
                                <span>Fazer Login</span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}