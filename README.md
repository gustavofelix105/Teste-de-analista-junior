# Order Management API

Esta é uma API REST para gerenciamento de pedidos (criação, leitura, atualização, listagem e exclusão). 
Desenvolvida com Node.js, Express e SQLite como banco de dados embarcado para fácil execução.

## Funcionalidades
- **Criar Pedido**: `POST /order`
- **Buscar Pedido**: `GET /order/:orderId`
- **Listar Pedidos**: `GET /order/list`
- **Atualizar Pedido**: `PUT /order/:orderId`
- **Deletar Pedido**: `DELETE /order/:orderId`

## Transformação de Dados
A API recebe o payload JSON no formato do cliente (com campos como `numeroPedido`, `valorTotal`, `dataCriacao` e `items`). 
Esses dados são automaticamente mapeados e armazenados no banco de dados com a nomenclatura `orderId`, `value`, `creationDate`, `productId`, `quantity` e `price`. Ao realizar o GET no pedido, os dados são retornados convertidos, cumprindo o desafio de transformação!

## Como Executar Localmente

### Pré-requisitos
- Node.js (versão 14+ sugerida)
- NPM

### Passos
1. Abra o terminal na raiz do projeto (`order-api`).
2. Utilize o comando para instalar as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
   *Ou utilize `npm run dev` para desenvolvimento/nodemon.*
4. O servidor será exposto em: `http://localhost:3000`

## Documentação API (Swagger)
A interface Swagger UI está disponível!
Com o servidor rodando, acesse a URL no seu navegador:
- [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Você pode testar todas as APIs diretamente pelo Swagger!
