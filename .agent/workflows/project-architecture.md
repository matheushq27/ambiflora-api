---
description: Estrutura do Projeto e Diretrizes de Arquitetura e Resposta
---
# Arquitetura do Projeto: Ambiflora API

A aplicação utiliza os princípios de arquitetura em camadas (Clean Architecture/DDD), visando alta manutenibilidade e separação de responsabilidades.

## Bibliotecas e Stack Tecnológico
- **Linguagem**: TypeScript (Node.js)
- **Framework Opcional/Transporte Http**: NestJS v10
- **Banco de Dados**: PostgreSQL (Porta padrão local em Docker: 5432)
- **ORM Mapeador**: Prisma v6.5+
- **Background Jobs e Filas**: Bull e Redis (`@nestjs/bull`, `@keyv/redis`)
- **Autenticação e Segurança**: JWT, Passport (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcryptjs`)
- **Validação Abstrata de Pipes**: `zod`, `class-validator`, `class-transformer`
- **Documentação Nativa**: Swagger UI (`@nestjs/swagger`)

## Estrutura de Diretórios e Escopos
- `src/domain/`: A base da aplicação. Regras puras, enums e contratos (interfaces) de repositórios.
- `src/application/`: Camada de orquestração. Contém os Casos de Uso (Use Cases) e Controladores (Controllers) ou serviços que executam o fluxo de negócio, injetando dependências do domínio.
- `src/infrastructure/`: Camada suja e conectável. Detém implementações externas (ex: Prisma Repositories, integração com filas do Bull, web scraping com Puppeteer, disparos de e-mail com Nodemailer).
- `src/common/`: Códigos utilitários, filtros globais de exceção, formatadores e decoradores.

## Padrões de Tipagem e TypeScript

Para garantir a robustez e manutenibilidade do sistema, seguimos regras estritas de tipagem:

### 1. Proibição do `any`
- O uso de `any` é **terminantemente proibido** em todo o projeto. Utilize `unknown` caso o formato da carga seja dinâmico.

### 2. Validação e DTOs (Zod + Class-validator)
- Todo Controller HTTP deve usar classes de DTOs fortemente tipadas.
- Todas as propriedades devem ser documentadas visivelmente no Swagger.

### 3. Padrões de Resposta de API Obrigatórios
- **TODAS as rotas de consulta (`GET`) DEVEM retornar os dados principais dentro de uma chave `data`.** (Regra de Ouro do Projeto).
- Exemplo Padrão: `{ "data": { ...objeto } }` ou `{ "data": [ ...array ] }`.
- Caso seja paginada: `{ "data": [...], "pagination": { ... } }`.
