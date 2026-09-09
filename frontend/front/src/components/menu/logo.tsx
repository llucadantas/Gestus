export default function Logo() {
    return <>
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
            <div className="w-10 h-10 bg-white text-gestus rounded-xl flex items-center justify-center text-xl shadow-lg">
                <i className="fa-solid fa-masks-theater"></i>
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gestus</h1>
                <p className="text-xs text-purple-200">Painel do Teatro</p>
            </div>
        </div>
    </>
}