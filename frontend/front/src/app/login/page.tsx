'use client';

import Input from '@/src/components/auth/Input';
import Button from '@/src/components/auth/Button';
import AuthSidebar from '@/src/components/auth/AuthSidebar';
import UseLogin from '@/src/hooks/useLogin';

export default function Login() {
    const{
        email,
        setEmail,
        setPassword,
        password,
        loading,
        errorMessage,
        handleLogin
    } = UseLogin();


    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[#7C3AED] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.08] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-[#8B5CF6] rounded-full mix-blend-screen filter blur-[150px] opacity-[0.05] pointer-events-none"></div>

            <main className="w-full max-w-5xl bg-[#120B18] rounded-[2rem] border border-violet-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 fade-in-up backdrop-blur-xl">
                
                <AuthSidebar />

                <section className="w-full md:w-7/12 p-8 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#120B18]">
                    <div className="max-w-md w-full mx-auto">
                        
                        <div className="md:hidden flex items-center justify-center gap-3 mb-10">
                            <div className="w-12 h-12 bg-[#120B18] border border-violet-500/20 text-[#C4B5FD] rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                                <i className="fa-solid fa-masks-theater"></i>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-[#FFFFFF]">Gestus</h1>
                        </div>

                        <header className="mb-8 text-center md:text-left">
                            <h2 className="text-3xl font-bold text-[#F8F8F8] mb-2 tracking-tight">Bem-vindo de volta</h2>
                            <p className="text-[#A1A1AA]">Acesse sua conta para continuar.</p>
                        </header>

                        {errorMessage && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleLogin} method='POST' className="space-y-5">
                            
                            <Input 
                                label="E-mail"
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

                            <div className="pt-2">
                                <Button type="submit" icon="fa-arrow-right">
                                    {loading ? 'Entrando...' : 'Entrar'}
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
                            <p className="text-sm text-[#A1A1AA] mb-4">Não possui uma conta?</p>
                            <a href="/cadastro" className="w-full sm:w-auto text-center px-6 py-3 border border-violet-500/20 bg-[#0B0710]/50 text-[#C4B5FD] font-medium rounded-xl hover:bg-[#7C3AED]/10 hover:border-[#7C3AED]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 flex justify-center items-center gap-2 text-sm sm:text-base shadow-sm">
                                <span>Cadastre-se</span>
                                <i className="fa-solid fa-arrow-right text-xs"></i>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}