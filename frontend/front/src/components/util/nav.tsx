export default function Nav() {
    return <>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 mt-4 px-3">Geral</p>

            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-gestus rounded-xl text-white font-medium transition-colors">
                <i className="fa-solid fa-chart-pie w-5 text-center"></i>
                <span>Dashboard</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-purple-100 hover:bg-white/10 rounded-xl font-medium transition-colors group mt-4 border border-purple-400/30 hover:border-purple-300/50">
                <i className="fa-solid fa-ticket-simple w-5 text-center text-gestus-accent group-hover:scale-110 transition-transform"></i>
                <span>Vender Ingressos</span>
            </a>

            <p className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 mt-8 px-3">Gestão e Eventos</p>

            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-purple-100 hover:bg-white/10 rounded-xl font-medium transition-colors">
                <i className="fa-solid fa-calendar-days w-5 text-center"></i>
                <span>Definir Sessões</span>
            </a>

            <a href="/menu/regras" className="flex items-center gap-3 px-3 py-2.5 text-purple-100 hover:bg-white/10 rounded-xl font-medium transition-colors">
                <i className="fa-solid fa-tags w-5 text-center"></i>
                <span>Regras de Preço</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-purple-100 hover:bg-white/10 rounded-xl font-medium transition-colors">
                <i className="fa-solid fa-file-contract w-5 text-center"></i>
                <span>Contratos de Aluguel</span>
            </a>
        </nav>
    </>
} 