export default function Logo() {
    return <>
        <div className="p-6 flex items-center gap-3 border-b border-violet-500/20">
            <div className="w-10 h-10 bg-[#120B18] border border-violet-500/20 text-[#C4B5FD] rounded-xl flex items-center justify-center text-xl shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                <i className="fa-solid fa-masks-theater"></i>
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[#FFFFFF]">Gestus</h1>
            </div>
        </div>
    </>
}