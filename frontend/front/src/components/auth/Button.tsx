interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    icon?: string;
}

export default function Button({ children, type = 'submit', icon }: ButtonProps) {
    return (
        <button 
            type={type} 
            className="w-full bg-gestus hover:bg-gestus-dark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 transform transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-purple-500/50 flex justify-center items-center gap-2"
        >
            <span>{children}</span>
            {icon && <i className={`fa-solid ${icon}`}></i>}
        </button>
    );
}