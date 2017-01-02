import * as sift from 'sift';
export class ObjectFilter {
    public static forKey<C>(propKey: keyof C, keyValue: string): any {
        let filter: any = {};
        filter[propKey] = keyValue;
        return filter;
    };

    public static getPredicate<T>(expression: any): (o: T) => boolean {
        return sift<T>(expression) as (o: T) => boolean;
    }

    public static filter<T>(expression: any, target: Iterable<T>): Array<T> {
        let predicate = this.getPredicate<T>(expression);

        let result = [];
        for (let item of target) {
            if (predicate(item)) {
                result.push(item);
            }
        }
        return result as Array<T>;
    }

    public static first<T>(expression: any, target: Iterable<T>): T {
        let predicate = this.getPredicate<T>(expression);

        for (let item of target) {
            if (predicate(item)) {
                return item;
            }
        }
        return null;
    }
}
