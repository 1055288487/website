import * as Mongodb from 'mongodb';
import config from '../config';
import * as  DEBUG from 'debug';
const _debug = DEBUG('BaseRepository:debug'),
    _logError = DEBUG('BaseRepository:error'),
    genericPool = require('generic-pool'),
    MongoClient = Mongodb.MongoClient,
    factory = {
        name: 'mongodb',
        create: () => {
            _debug('begin connect ', config.mongodb.connection);
            return MongoClient.connect(config.mongodb.connection);
        },
        destroy: (client: Mongodb.Db) => {
            _debug('mongodb connection close.');
            return client.close()
        }
    },
    opts = { max: 16, min: 4, idleTimeoutMillis: 30000 },
    pool = genericPool.createPool(factory, opts);

pool.on('factoryCreateError', (err: Error) => {
    _logError('factoryCreateError:%s', err);
});
pool.on('factoryDestroyError', (err: Error) => {
    _logError('factoryDestroyError:%s', err);
});


export class BaseServices<T> {

    debug: Function;
    logError: Function;
    constructor(private collectionName: string) {

        this.debug = _debug;
        this.logError = _logError;
    }

    async getDb(): Promise<Mongodb.Db> {
        return await pool.acquire();
    }
    getCollection(db: Mongodb.Db): Mongodb.Collection {
        return db.collection(this.collectionName);
    }

    release(db: Mongodb.Db): void {
        pool.release(db).catch(this.logError);
    }


    /**
     * 查询，返回游标
     * @param selector
     * @param sort
     */
    async query(selector: object, sort?: object, fields?: any): Promise<Mongodb.Cursor<T>> {

        let db = await this.getDb();
        let collection = this.getCollection(db);
        fields = fields || {};
        fields['_id'] = 0;


        let query = await collection.find<T>(selector).project(fields);
        if (sort)
            query = query.sort(sort);
        this.release(db);
        return query;
    }

    async findByLimit(selector: object, sort?: object, limit?: number) {
        if (!limit)
            limit = 10000;
        let query: Mongodb.Cursor<T> = await this.query(selector, sort);
        return query.limit(limit).toArray();
    }

    async find(selector: object, sort?: object, fields?: any): Promise<T[]> {
        let query = await this.query(selector, sort, fields);
        return query.toArray();
    }

    // async findPaging(selector: object, sort?: object, index?: number, size?: number): Promise<IPaging<T>> {
    //     if (!index) index = 1;
    //     if (!size) size = 10;

    //     let query: Mongodb.Cursor<T> = await this.query(selector, sort);
    //     let total = await this.count(selector);
    //     return {
    //         index: index,
    //         size: size,
    //         total: total,
    //         pages: Math.ceil(total / size),
    //         items: await query.skip((index - 1) * size).limit(size).toArray()
    //     }
    // }

    async findOne(selector: object, fields?: any): Promise<any> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        if (!fields) fields = {};
        fields['_id'] = 0;
        let result = await collection.findOne<T>(selector, { fields: fields });
        this.release(db);
        return result;
    }

    async exists(selector: object): Promise<boolean> {
        return (await this.count(selector)) > 0
    }

    async count(selector: object): Promise<number> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let result = await collection.count(selector);
        this.release(db);
        return result;
    }

    async insertMany(docs: T[]): Promise<boolean> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let result = await collection.insertMany(docs);
        this.release(db);
        return result.insertedCount === docs.length;
    }

    async insertOne(doc: T): Promise<T | null> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let value: any = doc;
        let result = await collection.insert(value);
        this.release(db);
        if (result.insertedCount === 1) {
            delete value['_id'];
            return value;
        }
        return null;
    }

    async updateOne(selector: object, doc: any, upsert?: boolean): Promise<boolean> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let _upsert = upsert || false;
        let result = await collection.updateOne(selector, { '$set': doc }, { upsert: _upsert });
        this.release(db);
        if (_upsert)
            return result.upsertedCount === 1;
        return result.modifiedCount === 1;
    }

    async updateMany(selector: object, docs: T[], upsert?: boolean): Promise<boolean> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let _upsert = upsert || false;
        let result = await collection.updateMany(selector, docs, { upsert: _upsert });
        this.release(db);
        return result.upsertedCount > 0 || result.modifiedCount > 0;
    }

    async deleteOne(selector: object): Promise<boolean> {
        let db = await this.getDb();
        let collection = this.getCollection(db);
        let result = await collection.deleteOne(selector);
        this.release(db);
        return result.deletedCount === 1;
    }

    async deleteMany(selector: object): Promise<boolean> {
        let db = await this.getDb();
        let collection = this.getCollection(db);

        let result = await collection.deleteMany(selector);
        this.release(db);
        if (result && result.deletedCount)
            return result.deletedCount > 0;
        return false;
    }


    /**
     *  如果索引不存在 ，则添加索引
     * @param name id_index
     * @param fields {id:-1}
     * @param unique true|false
     */
    async ensureIndex(name: string, fields: any, unique: boolean) {

        let db = await this.getDb();
        let existsCollection = await this.existsCollection(this.collectionName);
        if (!existsCollection) return;
        let collection = this.getCollection(db);
        let exists = await collection.indexExists(name);
        if (!exists) {
            await collection.createIndex(fields, { name, unique });
            _debug('add index key:%s,fields:%j,unique:%s', name, fields, unique)
        }
        this.release(db);
    }


    async dropIndex(name: string) {

        let db = await this.getDb();
        let existsCollection = await this.existsCollection(this.collectionName);
        if (!existsCollection) return;
        let collection = this.getCollection(db);

        await collection.dropIndex(name);

        this.release(db);
    }

    async existsCollection(name: string): Promise<boolean> {
        let db = await this.getDb();
        let collections: Mongodb.Collection[] = await db.collections();
        let result = collections.some(e => e.collectionName === name);
        this.release(db);
        return result;
    }

}
