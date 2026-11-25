// Vercel Serverless Function: Webhook para recibir pedidos desde comercios u otras apps
export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      return res.status(200).json({
        success: true,
        message: 'Pedido recibido con éxito por Go Delivery Repartidor',
        receivedAt: new Date().toISOString(),
        orderId: body.id || `GD-${Math.floor(1000 + Math.random() * 9000)}`
      });
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Formato JSON inválido'
      });
    }
  }

  return res.status(200).json({
    status: 'online',
    endpoint: '/api/orders/receive',
    method: 'POST',
    description: 'Webhook para conectar app de pedidos con Go Delivery Repartidor'
  });
}
