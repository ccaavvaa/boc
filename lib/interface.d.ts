import { ModelMetadata } from './model-metadata';
import { IObjectStore } from 'boc-interfaces';
export interface IContainerSettings {
    modelMetadata: ModelMetadata;
    objectStore: IObjectStore;
}
