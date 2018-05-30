import * as Mongodb from 'mongodb';
export declare class BaseServices<T> {
    private collectionName;
    debug: Function;
    logError: Function;
    constructor(collectionName: string);
    getDb(): Promise<Mongodb.Db>;
    getCollection(db: Mongodb.Db): Mongodb.Collection;
    release(db: Mongodb.Db): void;
    /**
     * 查询，返回游标
     * @param selector
     * @param sort
     */
    query(selector: object, sort?: object, fields?: any): Promise<Mongodb.Cursor<T>>;
    findByLimit(selector: object, sort?: object, limit?: number): Promise<T[]>;
    find(selector: object, sort?: object, fields?: any): Promise<T[]>;
    findOne(selector: object, fields?: any): Promise<any>;
    exists(selector: object): Promise<boolean>;
    count(selector: object): Promise<number>;
    insertMany(docs: T[]): Promise<boolean>;
    insertOne(doc: T): Promise<T | null>;
    updateOne(selector: object, doc: any, upsert?: boolean): Promise<boolean>;
    updateMany(selector: object, docs: T[], upsert?: boolean): Promise<boolean>;
    deleteOne(selector: object): Promise<boolean>;
    deleteMany(selector: object): Promise<boolean>;
    /**
     *  如果索引不存在 ，则添加索引
     * @param name id_index
     * @param fields {id:-1}
     * @param unique true|false
     */
    ensureIndex(name: string, fields: any, unique: boolean): Promise<void>;
    dropIndex(name: string): Promise<void>;
    existsCollection(name: string): Promise<boolean>;
}
