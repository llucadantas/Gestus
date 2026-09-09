import { Assento } from "./assento";

export interface Coluna{
    id: number,
    identificador: string,
    qntd: number,
    assentos: Assento[]
}