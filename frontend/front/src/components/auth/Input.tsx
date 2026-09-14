'use client';

import { useState } from 'react';

interface InputProps {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    icon: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, id, type, placeholder, icon, value, onChange }: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    
    const isPassword = type === 'password';
    
    const inputType = isPassword && isPasswordVisible ? 'text' : type;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-[#F8F8F8]">
                {label}
            </label>
            <div className="relative flex items-center bg-[#0B0710] rounded-xl border border-violet-500/20 hover:border-violet-500/40 focus-within:border-[#7C3AED] focus-within:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all duration-300 overflow-hidden">
                <div className="pl-4 text-[#A1A1AA]">
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <input 
                    type={inputType} 
                    id={id} 
                    name={id} 
                    required 
                    placeholder={placeholder} 
                    className="w-full p-3.5 pl-3 bg-transparent border-none outline-none text-[#FFFFFF] placeholder-[#A1A1AA]/50 focus:ring-0"
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                        className="pr-4 text-[#A1A1AA] hover:text-[#C4B5FD] transition-colors focus:outline-none" 
                        aria-label="Mostrar senha"
                    >
                        <i className={`fa-regular ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                )}
            </div>
        </div>
    );
}