import { useState } from "react";
import Logo from "./logo";
import Logout from "./logout";
import Nav from "./nav";

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return <>
        {isSidebarOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}
        <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gestus-dark text-white flex flex-col transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
            {/* Logo e Título */}
            <Logo />

            {/* Links de Navegação */}
            <Nav />

            {/* Área de Perfil / Logout inferior */}
            <Logout />
        </aside>
    </>
}