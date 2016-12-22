import { IRuleDeclarationOptions, RuleDeclaration, ruleDeclarations } from './rule';

function checkRuleDeclaration(ruleOptions: IRuleDeclarationOptions): void {
    if (!ruleOptions.id) {
        throw new Error('Rule id is mandatory');
    }

    if (!ruleOptions.triggers || ruleOptions.triggers.length === 0) {
        throw new Error('Rules must declare triggers');
    }
}

export function Rule(ruleOptions: IRuleDeclarationOptions): MethodDecorator {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        checkRuleDeclaration(ruleOptions);

        let ruleDeclaration = new RuleDeclaration();
        ruleDeclaration.id = ruleOptions.id;
        ruleDeclaration.description = ruleOptions.description || '';
        ruleDeclaration.isStatic = typeof target !== 'object';
        ruleDeclaration.constr = ruleDeclaration.isStatic ? target : target.constructor;
        ruleDeclaration.rule = descriptor.value;
        ruleDeclaration.level = ruleOptions.level || 0;
        ruleDeclaration.triggers = ruleOptions.triggers;

        ruleDeclaration.triggers.forEach(t => {
            if (!t.constr) {
                t.constr = ruleDeclaration.constr;
            }
        });

        ruleDeclarations.push(ruleDeclaration);
    };
}
