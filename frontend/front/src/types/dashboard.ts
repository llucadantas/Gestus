export interface KpisDto {
    ingressosVendidos: number;
    alugueisAtivos: number;
    sessoesSemana: number;
    receitaPrevista: number;
}

export interface SessaoDestaqueDto {
    nomePeca: string;
    nomeArtista: string;
    data: string;
    horario: string;
}

export interface AluguelRecenteDto {
    id: number;
    nomePeca: string;
    dataInicio: string;
    dataFim: string;
    valor: number;
    status: string;
}

export interface DashboardResponse {
    kpis: KpisDto;
    sessoesDestaque: SessaoDestaqueDto[];
    alugueisRecentes: AluguelRecenteDto[];
}