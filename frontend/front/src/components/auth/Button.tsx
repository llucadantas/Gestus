interface ButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    icon?: string;
}

export default function Button({ children, type = 'submit', icon }: ButtonProps) {
    return (
        <button 
            type={type} 
            className="w-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-[#FFFFFF] font-semibold py-3.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(124,58,237,0.39)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.23)] transform transition-all duration-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C4B5FD] focus:ring-offset-2 focus:ring-offset-[#120B18] flex justify-center items-center gap-2"
        >
            <span>{children}</span>
            {icon && <i className={`fa-solid ${icon}`}></i>}
        </button>
    );
}