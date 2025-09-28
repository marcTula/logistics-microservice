import Fastify from 'fastify';

const app = Fastify({ logger: true });

// Crea etiqueta
app.post('/shipments', async (req, reply) => {
  const shipmentId = `nrw_${Date.now()}`;
  (app as any).states = (app as any).states ?? {};
  (app as any).states[shipmentId] = [{ code: 'CREATED', at: new Date().toISOString(), description: 'NRW created' }];
  return reply.code(201).send({
    shipmentId,
    label: {
      format: 'PDF',
      contentBase64: Buffer.from(`LABEL NRW ${shipmentId}`).toString('base64')
    }
  });
});

// Devuelve estado "más reciente" (simula progreso)
app.get('/shipments/:id/status', async (req, reply) => {
  const id = (req.params as any).id;
  (app as any).states = (app as any).states ?? {};
  const arr = (app as any).states[id] ?? [];
  // progreso: CREATED -> IN_TRANSIT -> DELIVERED
  const current = arr[arr.length - 1]?.code ?? 'CREATED';
  let next = 'IN_TRANSIT';
  if (current === 'IN_TRANSIT') next = 'DELIVERED';
  if (current === 'DELIVERED') next = 'DELIVERED';
  if (arr.length === 0) {
    (app as any).states[id] = [{ code: 'CREATED', at: new Date().toISOString() }];
  } else if (current !== 'DELIVERED') {
    arr.push({ code: next, at: new Date().toISOString(), description: `NRW -> ${next}` });
  }
  const latest = (app as any).states[id][(app as any).states[id].length - 1];
  return { shipmentId: id, status: latest };
});

app.listen({ port: 4020, host: '0.0.0.0' });
