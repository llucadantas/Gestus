export default function AuthSidebar() {
    return (
        <aside className="hidden md:flex flex-col md:w-5/12 bg-gestus text-white p-8 lg:p-12 justify-between relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-gestus-light rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 bg-gestus-dark rounded-full mix-blend-multiply filter blur-2xl opacity-50"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white text-gestus rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        <i className="fa-solid fa-masks-theater"></i>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestus</h1>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-semibold mb-4 leading-snug">
                    O palco principal da sua gestão.
                </h2>
                <p className="text-purple-200 text-sm lg:text-base leading-relaxed">
                    Sistema completo para administração de teatros. Controle sua bilheteria, gerencie locações e tenha tudo em um só lugar.
                </p>
            </div>

            <div className="relative z-10 mt-12 hidden md:block">
                <div className="flex items-center gap-4 bg-gestus-dark/40 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <i className="fa-solid fa-ticket text-3xl text-gestus-accent"></i>
                    <p className="text-sm font-medium">Controle de ingressos, mapas de assentos e borderôs simplificados.</p>
                </div>
            </div>
        </aside>
    );
}