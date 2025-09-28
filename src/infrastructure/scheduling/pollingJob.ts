import cron from 'node-cron';
import type { Db } from 'mongodb';
import type { UpdateStatusFromPolling } from '../../application/use-cases/UpdateStatusFromPolling';

export function startPollingNRW(db: Db, pollUseCase: UpdateStatusFromPolling, cronExpr: string) {
  
  const task = cron.schedule(cronExpr, async () => {
    const col = db.collection('deliveries');
    const cursor = col.find({ provider: 'NRW', 'status.code': { $in: ['CREATED', 'IN_TRANSIT'] } }, { projection: { deliveryId: 1, providerShipmentId: 1 } });
    for await (const d of cursor) {
      await pollUseCase.exec({ deliveryId: d.deliveryId, providerShipmentId: d.providerShipmentId });
    }
  }, { timezone: 'UTC' });

  return task; 
}
