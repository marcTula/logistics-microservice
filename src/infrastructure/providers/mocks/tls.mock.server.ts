import Fastify from 'fastify';

const app = Fastify({ logger: true });

// Crea etiqueta (devuelve shipmentId + fake label)
app.post('/shipments', async (req, reply) => {
  const shipmentId = `tls_${Date.now()}`;
  return reply.code(201).send({
    shipmentId,
    label: {
      format: 'PDF',
      contentBase64: Buffer.from(`LABEL TLS ${shipmentId}`).toString('base64')
    }
  });
});

//  (webhook)
app.post('/simulate-webhook', async (req, reply) => {
  const { appWebhookUrl, shipmentId, code = 'IN_TRANSIT', description = 'TLS push update' } = (req.body as any) ?? {};
  if (!appWebhookUrl || !shipmentId) return reply.code(400).send({ error: 'appWebhookUrl and shipmentId required' });

  await fetch(appWebhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      shipmentId,
      status: { code, at: new Date().toISOString(), description }
    })
  });

  return { ok: true };
});

app.listen({ port: 4010, host: '0.0.0.0' });
