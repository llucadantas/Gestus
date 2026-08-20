/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Mantido caso você crie a pasta src depois
  ],
  theme: {
    extend: {
      // 1. Configurando as cores do tema Gestus
      colors: {
        gestus: {
          DEFAULT: '#7e22ce', // Roxo principal
          light: '#a855f7',   // Roxo mais claro
          dark: '#581c87',    // Roxo escuro
          accent: '#d8b4fe',  // Cor de destaque
        }
      },
      // 2. Configurando a animação que você usou na tag <main>
      keyframes: {
        'fade-in-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}