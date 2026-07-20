exports.handler = async () => ({
  statusCode: 200,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store'},
  body: JSON.stringify({
    ok: true,
    app: 'Branco Stats',
    version: '1.3.0',
    function_runtime: 'online',
    source_configured: Boolean(process.env.BLAZE_HISTORY_URL),
    checked_at: new Date().toISOString()
  })
});
