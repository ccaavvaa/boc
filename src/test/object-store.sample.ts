import { Container } from '../container';
import { IObjectStore } from '../interface';
import { IdType, ModelObject } from '../model-object';

export class ObjectStore implements IObjectStore {
    private  data: Map<any, Map<IdType, any>> = new Map<any, Map<IdType, any>>();
    public getInMemById<C extends ModelObject>(constr: any, id: IdType): C {
        let byClass = this.data.get(constr);
        if(byClass) {
            return byClass.get(id);
        } else {
            return null;
        }

    }
    public getOne<C extends ModelObject>(constr: any, filter: any): Promise<C> {
        
    }
    getMany<C extends ModelObject>(constr: any, filter: any): Promise<Array<C>>;
    getNewId(classInfo: ClassInfo): Promise<IdType>;
    store<C extends ModelObject>(o: C): void;
     
}
