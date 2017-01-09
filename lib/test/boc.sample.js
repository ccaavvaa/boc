"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const boc_tools_1 = require("../boc-tools");
const decorators_1 = require("../decorators");
const message_1 = require("../message");
const model_object_1 = require("../model-object");
const relation_1 = require("../relation");
const type_1 = require("../type");
class ClientVente extends model_object_1.ModelObject {
    static defineRoles() {
        return [
            {
                constr: relation_1.Reference,
                settings: {
                    key: 'idVente',
                    oppositeConstr: Vente,
                    oppositeRoleProp: 'clients',
                    roleProp: 'vente',
                },
            },
        ];
    }
    constructor(container) {
        super(container);
    }
    set_codeTiers(value) {
        return this.setProp('codeTiers', value);
    }
    get codeTiers() {
        return this.getProp('codeTiers');
    }
    vente() {
        return this.getRoleProp('vente');
    }
    set_vente(value) {
        return this.setRoleProp('vente', value);
    }
    idVente() {
        return this.getProp('idVente');
    }
}
exports.ClientVente = ClientVente;
var StatutVente;
(function (StatutVente) {
    StatutVente[StatutVente["NonDefini"] = 0] = "NonDefini";
    StatutVente[StatutVente["Accord"] = 1] = "Accord";
    StatutVente[StatutVente["Definitive"] = 2] = "Definitive";
    StatutVente[StatutVente["Annulee"] = 3] = "Annulee";
})(StatutVente = exports.StatutVente || (exports.StatutVente = {}));
class Vente extends model_object_1.ModelObject {
    constructor(container) {
        super(container);
    }
    static defineRoles() {
        return [
            {
                constr: relation_1.HasMany,
                settings: {
                    oppositeConstr: ClientVente,
                    oppositeRoleProp: 'vente',
                    roleProp: 'clients',
                },
            },
        ];
    }
    get statut() {
        return this.getProp('statut');
    }
    set_statut(value) {
        return this.setProp('statut', value);
    }
    get dateAccord() {
        return this.getProp('dateAccord');
    }
    set_dateAccord(value) {
        return this.setProp('dateAccord', value);
    }
    get prix() {
        return this.getProp('prix');
    }
    set_prix(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.setProp('prix', value);
        });
    }
}
__decorate([
    type_1.DataType('money', 'positive', { max: 1000000000 }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Vente.prototype, "prix", null);
exports.Vente = Vente;
class VenteRules {
    static Vente1(target, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (target.statut === StatutVente.Accord) {
                if (!target.dateAccord) {
                    yield target.set_dateAccord(boc_tools_1.BocTools.today());
                }
            }
        });
    }
}
__decorate([
    decorators_1.Rule({
        description: 'date accord initialisée avec la date du jour quand le statut change',
        id: 'Vente.1',
        level: 0,
        triggers: [
            {
                body: {
                    propName: 'statut',
                },
                constr: Vente,
                kind: message_1.MessageType.PropChanged,
            },
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Vente, message_1.Message]),
    __metadata("design:returntype", Promise)
], VenteRules, "Vente1", null);
exports.VenteRules = VenteRules;
//# sourceMappingURL=boc.sample.js.map