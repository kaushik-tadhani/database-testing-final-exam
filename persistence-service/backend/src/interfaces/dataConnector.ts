import Result from "../utils/result";

export default interface DataConnector<T, R> {
    findById: (filteringOptions: R) => Promise<T | null>;
    create: (entity: T) => Promise<T>;
    update: (entity: T) => Promise<T>;
    delete: (id: number) => Promise<void>;
    getAll: () => Promise<T[]>;
}