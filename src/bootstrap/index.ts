import 'dotenv/config';
import { connectMongo } from '../infrastructure/db/mongoClient';
import { MongoDeliveryRepository } from '../infrastructure/db/MongoDeliveryRepository';
import { CreateDelivery } from '../application/use-cases/CreateDelivery';
import { GetDeliveryStatus } from '../application/use-cases/GetDeliveryStatus';
import { ProcessWebhookStatus } from '../application/use-cases/ProcessWebhookStatus';
import { UpdateStatusFromPolling } from '../application/use-cases/UpdateStatusFromPolling';
import { TLSProviderAdapter } from '../infrastructure/providers/TLSProviderAdapter';
import { NRWProviderAdapter } from '../infrastructure/providers/NRWProviderAdapter';
import { startPollingNRW } from '../infrastructure/scheduling/pollingJob';
import { buildServer } from '../infrastructure/http/server';

(async () => {
  const db = await connectMongo(process.env.MONGO_URL!, process.env.MONGO_DB!);

  const repo = new MongoDeliveryRepository(db);
  const tls = new TLSProviderAdapter(process.env.PROVIDERS_TLS_BASEURL!);
  const nrw = new NRWProviderAdapter(process.env.PROVIDERS_NRW_BASEURL!);

  const createDelivery = new CreateDelivery(repo, [nrw, tls]);
  const getDeliveryStatus = new GetDeliveryStatus(repo);
  const processWebhookStatus = new ProcessWebhookStatus({
    // Usa el método real del repo
    updateStatus: repo.updateStatus.bind(repo),
    // Para buscar por shipmentId, tiramos del propio repo
    findByProviderShipmentId: repo.findByProviderShipmentId.bind(repo)
  } as any); // si prefieres, reescribe ProcessWebhookStatus para recibir el repo completo

  // Si reescribes ProcessWebhookStatus para usar repo directly:
  // const processWebhookStatus = new ProcessWebhookStatus(repo);

  // Arranca cron NRW
  const pollUseCase = new UpdateStatusFromPolling(repo, nrw);
  startPollingNRW(db, pollUseCase, process.env.POLL_CRON ?? '0 * * * *');

  const app = await buildServer({ createDelivery, getDeliveryStatus, processWebhookStatus });
  await app.listen({ port: Number(process.env.PORT ?? 3000), host: '0.0.0.0' });
})();
