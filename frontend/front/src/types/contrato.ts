export interface Contrato {
    id: number;
    valor: number;
    nomePeca: string;
    nomeArtista: string;
    dataInicio: Date;
    dataFim: string;
    status: string;
    valorIngresso: number;
}

export interface ContratoAluguelRequest {
    idPeca: number;
    emailArtista: string;
    dataInicio: string;
    dataFim: string;
    inicioPeca: string;
    fimPeca: string;
    valorIngresso: number;
}