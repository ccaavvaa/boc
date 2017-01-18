import { IdType } from 'boc-interfaces';
export declare class ObjectFilter {
    static forKey<C>(propKey: keyof C, keyValue: IdType): any;
    static getPredicate<T>(expression: any): (o: T) => boolean;
    static filter<T>(expression: any, target: Iterable<T>): Array<T>;
    static first<T>(expression: any, target: Iterable<T>): T;
}
