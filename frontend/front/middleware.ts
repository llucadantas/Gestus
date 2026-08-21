import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Pega o caminho exato que o usuário tentou acessar (ex: /dashboard/regras-preco)
    const pathname = request.nextUrl.pathname;
    
    // 2. Busca o cookie de autenticação
    const token = request.cookies.get('jwt_gestus')?.value;

    // 3. Se a URL começar com /dashboard (qualquer sub-rota) E não tiver token
    if (pathname.startsWith('/menu') && !token) {
        
        // Redireciona imediatamente para o login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// O matcher aqui serve apenas para otimização de performance agora,
// dizendo ao Next para não rodar esse código em imagens ou arquivos estáticos.
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};