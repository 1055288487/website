"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongodb = require("mongodb");
const config_1 = require("../config");
const DEBUG = require("debug");
const _debug = DEBUG('BaseRepository:debug'), _logError = DEBUG('BaseRepository:error'), genericPool = require('generic-pool'), MongoClient = Mongodb.MongoClient, factory = {
    name: 'mongodb',
    create: () => {
        _debug('begin connect ', config_1.default.mongodb.connection);
        return MongoClient.connect(config_1.default.mongodb.connection);
    },
    destroy: (client) => {
        _debug('mongodb connection close.');
        return client.close();
    }
}, opts = { max: 16, min: 4, idleTimeoutMillis: 30000 }, pool = genericPool.createPool(factory, opts);
pool.on('factoryCreateError', (err) => {
    _logError('factoryCreateError:%s', err);
});
pool.on('factoryDestroyError', (err) => {
    _logError('factoryDestroyError:%s', err);
});
class BaseServices {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.debug = _debug;
        this.logError = _logError;
    }
    getDb() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield pool.acquire();
        });
    }
    getCollection(db) {
        return db.collection(this.collectionName);
    }
    release(db) {
        pool.release(db).catch(this.logError);
    }
    /**
     * 查询，返回游标
     * @param selector
     * @param sort
     */
    query(selector, sort, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            fields = fields || {};
            fields['_id'] = 0;
            let query = yield collection.find(selector).project(fields);
            if (sort)
                query = query.sort(sort);
            this.release(db);
            return query;
        });
    }
    findByLimit(selector, sort, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!limit)
                limit = 10000;
            let query = yield this.query(selector, sort);
            return query.limit(limit).toArray();
        });
    }
    find(selector, sort, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = yield this.query(selector, sort, fields);
            return query.toArray();
        });
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
    findOne(selector, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            if (!fields)
                fields = {};
            fields['_id'] = 0;
            let result = yield collection.findOne(selector, { fields: fields });
            this.release(db);
            return result;
        });
    }
    exists(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.count(selector)) > 0;
        });
    }
    count(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let result = yield collection.count(selector);
            this.release(db);
            return result;
        });
    }
    insertMany(docs) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let result = yield collection.insertMany(docs);
            this.release(db);
            return result.insertedCount === docs.length;
        });
    }
    insertOne(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let value = doc;
            let result = yield collection.insert(value);
            this.release(db);
            if (result.insertedCount === 1) {
                delete value['_id'];
                return value;
            }
            return null;
        });
    }
    updateOne(selector, doc, upsert) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let _upsert = upsert || false;
            let result = yield collection.updateOne(selector, { '$set': doc }, { upsert: _upsert });
            this.release(db);
            if (_upsert)
                return result.upsertedCount === 1;
            return result.modifiedCount === 1;
        });
    }
    updateMany(selector, docs, upsert) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let _upsert = upsert || false;
            let result = yield collection.updateMany(selector, docs, { upsert: _upsert });
            this.release(db);
            return result.upsertedCount > 0 || result.modifiedCount > 0;
        });
    }
    deleteOne(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let result = yield collection.deleteOne(selector);
            this.release(db);
            return result.deletedCount === 1;
        });
    }
    deleteMany(selector) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collection = this.getCollection(db);
            let result = yield collection.deleteMany(selector);
            this.release(db);
            if (result && result.deletedCount)
                return result.deletedCount > 0;
            return false;
        });
    }
    /**
     *  如果索引不存在 ，则添加索引
     * @param name id_index
     * @param fields {id:-1}
     * @param unique true|false
     */
    ensureIndex(name, fields, unique) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let existsCollection = yield this.existsCollection(this.collectionName);
            if (!existsCollection)
                return;
            let collection = this.getCollection(db);
            let exists = yield collection.indexExists(name);
            if (!exists) {
                yield collection.createIndex(fields, { name, unique });
                _debug('add index key:%s,fields:%j,unique:%s', name, fields, unique);
            }
            this.release(db);
        });
    }
    dropIndex(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let existsCollection = yield this.existsCollection(this.collectionName);
            if (!existsCollection)
                return;
            let collection = this.getCollection(db);
            yield collection.dropIndex(name);
            this.release(db);
        });
    }
    existsCollection(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let db = yield this.getDb();
            let collections = yield db.collections();
            let result = collections.some(e => e.collectionName === name);
            this.release(db);
            return result;
        });
    }
}
exports.BaseServices = BaseServices;
//# sourceMappingURL=baseServices.js.map