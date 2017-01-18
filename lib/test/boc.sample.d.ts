import { Container } from '../container';
import { IRuleExecutionResult, Message } from '../message';
import { ModelObject } from '../model-object';
import { HasMany, IRoleDeclaration } from '../relation';
import { IdType } from 'boc-interfaces';
export declare class ClientVente extends ModelObject {
    static defineRoles(): IRoleDeclaration[];
    constructor(container: Container);
    set_codeTiers(value: string): Promise<IRuleExecutionResult[]>;
    readonly codeTiers: string;
    vente(): Promise<Vente>;
    set_vente(value: Vente): Promise<IRuleExecutionResult[]>;
    idVente(): IdType;
}
export declare enum StatutVente {
    NonDefini = 0,
    Accord = 1,
    Definitive = 2,
    Annulee = 3,
}
export declare class Vente extends ModelObject {
    static defineRoles(): IRoleDeclaration[];
    clients: HasMany<Vente, ClientVente>;
    constructor(container: Container);
    readonly statut: StatutVente;
    set_statut(value: StatutVente): Promise<IRuleExecutionResult[]>;
    readonly dateAccord: Date;
    set_dateAccord(value: Date): Promise<IRuleExecutionResult[]>;
    readonly prix: number;
    set_prix(value: number): Promise<IRuleExecutionResult[]>;
}
export declare class VenteRules {
    static Vente1(target: Vente, msg: Message): Promise<void>;
}
