const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store"
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" }
  });
}

function extractArray(data) {
  if (Array.isArray(data)) return data;
  for (const key of ["records", "results", "data", "history"]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({
        ok: true,
        app: "Branco Stats API",
        version: "3.0.0",
        source_configured: Boolean(env.BLAZE_HISTORY_URL),
        checked_at: new Date().toISOString()
      });
    }

    if (url.pathname !== "/history") {
      return json({
        ok: true,
        routes: ["/health", "/history"]
      });
    }

    if (!env.BLAZE_HISTORY_URL) {
      return json({
        error: "Fonte não configurada.",
        detail: "Crie a variável BLAZE_HISTORY_URL no Cloudflare Worker."
      }, 503);
    }

    try {
      const upstream = await fetch(env.BLAZE_HISTORY_URL, {
        headers: {
          "Accept": "application/json,text/plain,*/*",
          "User-Agent": "Mozilla/5.0 (compatible; BrancoStats/3.0)"
        },
        redirect: "follow"
      });

      const text = await upstream.text();

      if (!upstream.ok) {
        return json({
          error: "A fonte respondeu com erro.",
          upstream_status: upstream.status,
          preview: text.slice(0, 300)
        }, 502);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return json({
          error: "A fonte não retornou JSON válido.",
          preview: text.slice(0, 300)
        }, 502);
      }

      const results = extractArray(data);
      if (!results.length) {
        return json({
          error: "A fonte respondeu, mas nenhuma lista de resultados foi reconhecida.",
          accepted_keys: ["records", "results", "data", "history"]
        }, 502);
      }

      return json({
        source: env.BLAZE_HISTORY_URL,
        fetched_at: new Date().toISOString(),
        results
      });
    } catch (error) {
      return json({
        error: "Falha ao consultar a fonte.",
        detail: error.message
      }, 502);
    }
  }
};