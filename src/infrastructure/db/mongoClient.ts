import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(uri: string, dbName: string) {
  if (db) return db;
  client = new MongoClient(uri, {
    // pool tuning (opcional)
    minPoolSize: Number(process.env.MONGO_MIN_POOL ?? 0),
    maxPoolSize: Number(process.env.MONGO_MAX_POOL ?? 20),
  });
  await client.connect();
  db = client.db(dbName);
  await ensureIndexes(db);
  return db;
}

export function getDb(): Db {
  if (!db) throw new Error('Mongo DB not initialized. Call connectMongo first.');
  return db;
}

export async function closeMongo() {
  if (client) await client.close();
  client = null; db = null;
}

async function ensureIndexes(database: Db) {
  const deliveries = database.collection('deliveries');
  await deliveries.createIndex({ deliveryId: 1 }, { unique: true, name: 'ux_deliveryId' });
  await deliveries.createIndex({ providerShipmentId: 1 }, { name: 'ix_providerShipmentId' });
  await deliveries.createIndex({ 'status.code': 1, updatedAt: -1 }, { name: 'ix_status_updatedAt' });
}
