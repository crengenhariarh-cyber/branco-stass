# Branco Stats V1.2 — Conexão corrigida

## Entrega
Pacote completo pronto para publicação no Netlify.

## Correções
- Inclui novamente `manifest.webmanifest`, `sw.js`, ícone, `netlify.toml` e a função Netlify.
- A função testa várias rotas conhecidas de histórico.
- Diagnóstico visível com HTTP, fonte tentada e quantidade de registros reconhecidos.
- Preserva os dados já carregados quando a conexão falha.
- Permite configurar `BLAZE_HISTORY_URL` no Netlify.
- Inclui modo manual de segurança.
- Mantém histórico de 48 horas e estimativa heurística da próxima rodada.

## Publicação
1. Descompacte este arquivo.
2. No Netlify, publique a pasta completa.
3. Aguarde o deploy concluir.
4. Abra o site e toque em **Atualizar agora**.
5. Abra **Configuração da fonte de dados** para conferir o diagnóstico.

## Fonte personalizada
Caso nenhuma rota automática funcione:

1. Acesse **Site configuration > Environment variables** no Netlify.
2. Crie:
   `BLAZE_HISTORY_URL=https://endereco-da-fonte-json-autorizada`
3. Faça um novo deploy.

A resposta pode ser uma lista direta ou conter `records`, `results`, `data` ou `history`.

## Observação
A Blaze não disponibiliza documentação pública estável para esta integração. Portanto, não é possível garantir que uma rota não documentada permaneça funcionando. A estimativa exibida é heurística e não garante o resultado da próxima rodada.
