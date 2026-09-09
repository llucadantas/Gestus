export interface Usuario{
    nome: String,
    email: String
}

export interface Teatro{
    nome: String
}

export interface SessaoDestaque{
    nomePeca: String;
    nomeArtista: String;
    data: String;
    horarioInicioPeca: string;
    horarioFimPeca: string;
}