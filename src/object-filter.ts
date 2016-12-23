export class ObjectFilter {
    public static forKey<C>(propKey: keyof C, keyValue: string): any {
        let filter: any = {};
        filter[propKey] = keyValue;
        return filter;
    };
}
