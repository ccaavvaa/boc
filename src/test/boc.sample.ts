import { BocTools } from '../boc-tools';
import { Container } from '../container';
import { Rule } from '../decorators';
import { IRuleExecutionResult, Message, MessageType } from '../message';
import { ModelObject } from '../model-object';
import { HasMany, IRelationSettings, IRoleDeclaration, Reference } from '../relation';
import { DataType } from '../type';

import { IdType } from 'boc-interfaces';

export class ClientVente extends ModelObject {
    public static defineRoles(): IRoleDeclaration[] {
        return [
            {
                constr: Reference,
                settings: {
                    key: 'idVente',
                    oppositeConstr: Vente,
                    oppositeRoleProp: 'clients',
                    roleProp: 'vente',
                } as IRelationSettings<ClientVente, Vente>,
            } as IRoleDeclaration,

        ];
    }

    constructor(container: Container) {
        super(container);
    }

    public set_codeTiers(value: string): Promise<IRuleExecutionResult[]> {
        return this.setProp('codeTiers', value);
    }

    public get codeTiers(): string {
        return this.getProp('codeTiers');
    }

    public vente(): Promise<Vente> {
        return this.getRoleProp('vente');
    }

    public set_vente(value: Vente): Promise<IRuleExecutionResult[]> {
        return this.setRoleProp('vente', value);
    }

    public idVente(): IdType {
        return this.getProp('idVente');
    }
}

export enum StatutVente {
    NonDefini = 0,
    Accord = 1,
    Definitive = 2,
    Annulee = 3,
}

export class Vente extends ModelObject {
    public static defineRoles(): IRoleDeclaration[] {
        return [
            {
                constr: HasMany,
                settings: {
                    oppositeConstr: ClientVente,
                    oppositeRoleProp: 'vente',
                    roleProp: 'clients',
                } as IRelationSettings<Vente, ClientVente>,
            } as IRoleDeclaration,
        ];
    }
    public clients: HasMany<Vente, ClientVente>;

    constructor(container: Container) {
        super(container);
    }

    public get statut(): StatutVente {
        return this.getProp('statut');
    }

    public set_statut(value: StatutVente): Promise<IRuleExecutionResult[]> {
        return this.setProp('statut', value);
    }

    public get dateAccord(): Date {
        return this.getProp('dateAccord');
    }

    public set_dateAccord(value: Date): Promise<IRuleExecutionResult[]> {
        return this.setProp('dateAccord', value);
    }

    @DataType('money', 'positive', { max: 1000000000 })
    public get prix(): number {
        return this.getProp('prix');
    }

    public async set_prix(value: number): Promise<IRuleExecutionResult[]> {
        return this.setProp('prix', value);
    }
}

export class VenteRules {
    @Rule({
        description: 'date accord initialisée avec la date du jour quand le statut change',
        id: 'Vente.1',
        level: 0,
        triggers: [
            {
                body: {
                    propName: 'statut',
                },
                constr: Vente,
                kind: MessageType.PropChanged,
            },
        ],
    })

    public static async Vente1(target: Vente, msg: Message): Promise<void> {
        if (target.statut === StatutVente.Accord) {
            if (!target.dateAccord) {
                await target.set_dateAccord(BocTools.today());
            }
        } else if (target.statut === StatutVente.Definitive) {
            if (!target.dateAccord) {
                target.errors.addError(new Error('Date accord non définie'), 'statut');
            }
        }
    }
}
