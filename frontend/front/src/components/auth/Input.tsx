'use client'; // Necessário no Next.js pois usaremos useState para a senha

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
        <div>
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700">{label}</label>
                
            </div>
            <div className="relative input-focus rounded-xl border border-gray-300 transition-all duration-200 bg-gray-50 overflow-hidden flex items-center">
                <div className="pl-4 text-gray-400">
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <input 
                    type={inputType} 
                    id={id} 
                    name={id} 
                    required 
                    placeholder={placeholder} 
                    className="w-full p-3.5 pl-3 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 focus:ring-0"
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button 
                        type="button" 
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
                        className="pr-4 text-gray-400 hover:text-gestus focus:outline-none" 
                        aria-label="Mostrar senha"
                    >
                        <i className={`fa-regular ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                )}
            </div>
        </div>
    );
}