# Branco Stats V3.0

Projeto preparado para deploy automático pelo GitHub.

## Cloudflare Worker

Configuração:
- Production branch: `main`
- Root directory: `/`
- Build command: vazio
- Deploy command: `npx wrangler deploy`

Após o primeiro deploy, configure no Cloudflare:

`BLAZE_HISTORY_URL`

Rotas:
- `/health`
- `/history`

## Interface

Os arquivos do PWA permanecem na raiz para publicação da interface.
