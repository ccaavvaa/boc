export class ObjectFilter {
    public static forKey<C>(propKey: keyof C, keyValue: string): any {
        return {propKey: keyValue};
    };
}
