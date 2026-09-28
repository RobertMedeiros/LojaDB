# LojaDB - ASP.NET Core + Next.js

Estrutura:

- `exemplo02/`: backend ASP.NET Core recebido na atividade.
- `frontend/`: frontend Next.js com TypeScript e App Router.

## 1. Rodar o backend

Abra um terminal em `exemplo02`:

```bash
dotnet run --launch-profile http
```

O backend deve ficar disponível em:

```text
http://localhost:5236
```

## 2. Rodar o frontend

Abra outro terminal em `frontend`:

```bash
npm install
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Conexão com a API

O navegador chama somente `/api/...` no Next.js. O arquivo `next.config.ts` faz o proxy para o backend.

Por padrão:

```text
BACKEND_URL=http://localhost:5236
```

Se o backend usar outra porta ou computador, crie `frontend/.env.local`:

```env
BACKEND_URL=http://localhost:OUTRA_PORTA
```

Depois reinicie `npm run dev`.

Isso evita configuração de CORS no ASP.NET Core durante o desenvolvimento.

## Telas implementadas

- Dashboard
- Categorias: CRUD
- Produtos: CRUD com categoria, preço, estoque e status
- Clientes: CRUD

O backend atual possui modelos de Pedido e ItemPedido, mas não possui Controllers para esses recursos. Eles podem ser adicionados posteriormente sem alterar a arquitetura do frontend.
