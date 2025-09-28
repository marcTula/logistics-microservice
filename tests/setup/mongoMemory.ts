import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectMongo, closeMongo } from '../../src/infrastructure/db/mongoClient';

let mongod: MongoMemoryServer;

export async function startMongoTest(dbName = 'testdb') {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await connectMongo(uri, dbName);
}

export async function stopMongoTest() {
  await closeMongo();
  if (mongod) await mongod.stop();
}
