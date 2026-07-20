const CANDIDATES = [
  process.env.BLAZE_HISTORY_URL
].filter(Boolean);

function extractArray(data) {
  if (Array.isArray(data)) return data;
  for (const key of ['records','results','data','history']) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

exports.handler = async () => {
  const attempts = [];

  for (const url of CANDIDATES) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'accept': 'application/json,text/plain,*/*',
          'user-agent': 'Mozilla/5.0 (compatible; BrancoStats/1.2)'
        },
        signal: AbortSignal.timeout(9000)
      });

      attempts.push({url,status:response.status});
      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('json') && !contentType.includes('text')) continue;

      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { continue; }

      const arr = extractArray(data);
      if (!arr.length) continue;

      return {
        statusCode: 200,
        headers: {
          'content-type':'application/json; charset=utf-8',
          'cache-control':'no-store',
          'access-control-allow-origin':'*'
        },
        body: JSON.stringify({
          source:url,
          fetched_at:new Date().toISOString(),
          results:arr
        })
      };
    } catch (error) {
      attempts.push({url,error:error.message});
    }
  }

  return {
    statusCode: 502,
    headers: {
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
      'access-control-allow-origin':'*'
    },
    body: JSON.stringify({
      error:'Nenhuma fonte configurada respondeu com resultados válidos.',
      detail:'Configure BLAZE_HISTORY_URL no Netlify com uma fonte JSON autorizada e estável.',
      attempts,
      configuration:'No Netlify, defina BLAZE_HISTORY_URL com uma fonte JSON autorizada.'
    })
  };
};