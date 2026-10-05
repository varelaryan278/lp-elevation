# Elevation

Site do movimento Elevation em Next.js. Todos os convites de participação levam diretamente ao grupo do WhatsApp configurado em `content/marca.ts`, sem cadastro obrigatório. Os pedidos de patrocínio são salvos no Upstash Redis e consultados pela organização em `/painel/`.

O painel exibe os pedidos mais recentes primeiro, com data, nome, empresa, WhatsApp, mensagem, total recebido e paginação. Cada contato tem um link para responder pelo WhatsApp. Os registros indicam interesse em patrocinar; não representam membros do grupo nem confirmação de entrada no WhatsApp.

## Configuração

1. Instale as dependências com `pnpm install`.
2. Copie `.env.example` para `.env.local`.
3. Preencha `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN` com as credenciais REST de um banco Upstash Redis da organização. O token precisa permitir leitura, escrita e execução de scripts. Na Vercel, a integração Upstash pode provisionar essas variáveis pelo Marketplace.
4. Configure `ADMIN_TOKEN` com um token exclusivo de pelo menos 32 caracteres. Ao abrir `/painel/`, informe esse token na tela de acesso. Gere um token com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
5. Rode `pnpm dev` e abra `http://localhost:3000`.

As variáveis de acesso são exclusivas do servidor. Não use o prefixo `NEXT_PUBLIC_` e não publique `.env.local`. Configure as mesmas variáveis no servidor de produção e use HTTPS. Use um banco separado para testes e previews.

Sem credenciais Redis, o formulário informa indisponibilidade e não confirma o envio. Sem credenciais administrativas válidas, o painel permanece bloqueado. O grupo continua acessível independentemente do Redis.

## Fluxos

- Grupo: os botões do topo, menu mobile, página inicial, página do evento e rodapé abrem o convite em nova aba.
- Patrocínio: ao clicar em “Patrocinar”, o formulário solicita nome, empresa, WhatsApp com DDD e mensagem. O servidor valida e normaliza os dados, grava no Redis e só então confirma o recebimento. Se houver falha, os campos ficam preenchidos para tentar novamente.
- Painel: acesso por token em `/painel/acesso/`, com sessão assinada de 8 horas em cookie HttpOnly, SameSite Strict e Secure em produção. O token não aparece na URL e não é salvo em localStorage. O botão “Sair” encerra a sessão no navegador. Também é possível autenticar requisições com `Authorization: Bearer <ADMIN_TOKEN>`. O servidor verifica novamente a autorização antes de ler dados, desativa o cache e exclui o painel do sitemap. Alterar `ADMIN_TOKEN` invalida todas as sessões existentes.

Os pedidos são armazenados na lista `elevation:patrocinios`. Um script Redis impede pedidos idênticos por 24 horas e limita novos envios por origem durante uma hora. Na Vercel, a origem usa o IP encaminhado pela plataforma; em outros servidores o limite é compartilhado (20 pedidos/hora). Os dados dos pedidos permanecem no banco; somente as chaves de controle expiram.

A integração usa a [API REST oficial do Upstash](https://upstash.com/docs/redis/features/restapi) com `fetch` no servidor. As operações de salvamento e controle são executadas juntas via `EVAL`.

## Meta Pixel e API de Conversões

O Pixel `2593484331065033` registra `PageView` nas páginas públicas. O evento padrão `Lead` dispara somente ao clicar no convite do grupo ou após salvar um novo pedido de patrocínio. Os leads são diferenciados por `content_name`: `Grupo WhatsApp` e `Patrocinio`. Visitar uma página ou abrir o formulário não gera lead. O clique no convite indica intenção; não confirma entrada no grupo.

Configure `META_CONVERSIONS_ACCESS_TOKEN` em `.env.local` e nas variáveis privadas da hospedagem para enviar esses eventos também pela API de Conversões. O token nunca é enviado ao navegador. Para verificar recebimento na Meta sem registrar conversões reais, configure `META_CONVERSIONS_TEST_EVENT_CODE` com o código fornecido na opção “Testar eventos” do Gerenciador de Eventos; remova-o após a verificação.

Os eventos do navegador e do servidor usam o mesmo `event_id` para deduplicação. O endpoint público aceita somente visitas e cliques no grupo (identificados internamente como `GroupLead` e enviados à Meta como `Lead`); leads de patrocínio são gerados pelo servidor após salvar um novo pedido. O envio usa cookies `_fbp`/`_fbc`, agente do navegador e IP encaminhado pela Vercel quando disponíveis. Não envia nome, telefone, empresa nem mensagem. Falhas da Meta não bloqueiam o formulário nem a abertura do grupo. O painel administrativo fica fora do rastreamento.

Quando Redis está configurado, o endpoint limita eventos do navegador a 120 por minuto por origem e ignora IDs já enviados por 24 horas. Sem IP confiável, a origem é compartilhada. Sem Redis, os eventos continuam sendo enviados, sem esse controle adicional.

Referências: [eventos e deduplicação no SDK oficial da Meta](https://github.com/facebook/facebook-nodejs-business-sdk/blob/main/src/objects/serverside/server-event.js), [requisição e código de teste](https://github.com/facebook/facebook-nodejs-business-sdk/blob/main/src/objects/serverside/event-request.js).

## Verificação e produção

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm start`

O projeto requer uma hospedagem com servidor Next.js, como a Vercel ou Node.js. A exportação estática foi removida para permitir a API e o painel privado. O build usa fontes do Google e precisa conseguir acessar `fonts.googleapis.com` e `fonts.gstatic.com`.
