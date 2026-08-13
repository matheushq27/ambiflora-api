---
description: Regras de Negócio e Sistema do Domínio Ambiflora
---

# Regras de Negócio: Ambiflora API

O sistema é focado em B2B para o mercado brasileiro, atuando como um **Gestor e Monitorador de Processos** (minerários ou ambientais).

## 1. Identidade e Acesso (RBAC)

Existem duas esferas principais para entender quem opera no sistema:

### Companies (Empresas)
Representa o tenant/cliente master que contrata a plataforma.
- `postal_code`, `city`, `location_number`. 

### Users (Usuários de Sistema)
Usuários sempre pertencem a uma `Company`. Os papéis (`userType`) definem níveis de permissão:
- **SUPER_ADMIN**: Responsável master pela empresa, acesso total (root).
- **ADMIN**: Administrador do tenant.
- **DEVELOPER**: Para integração e suporte.
- **USER**: Operador / consultor comum, cujas permissões de edição ou visualização dependem de restrições de pastas/processos.

## 2. A Entidade Customer (Cliente)
O `Customer` é o cliente final da `Company` (ex: a mineradora ou fazenda que contratou a consultoria).
- Eles podem ser de dois tipos (`CusomerType`):
  - **NATURAL_PERSON**: Pessoa Física (utiliza CPF).
  - **CORPORATE_ENTITY**: Pessoa Jurídica (utiliza CNPJ).

## 3. Gestão de Processos (Core do Domínio)
O processo minerário/legal (`Processo`) é o eixo central do sistema.
1. **Pastas (Folders)**: Usuários organizam processos através de `Folders`.
2. **Monitoramento**: A tabela `MonitoredProcesses` acompanha alterações. O campo `last_event_id` indica em qual estágio legal ou evento o processo se encontrava na última verificação. Background jobs (com Bull) buscam novidades.
3. **Anatomia do Processo (`Processo`)**:
   - Possui fases (`FaseProcesso`), Eventos (`ProcessoEvento`).
   - Associa Pessoas e Órgãos (`ProcessoPessoa`, `Municipio`, `UnidadeAdministrativaRegional`).
   - Gerencia Substâncias Minerais (`ProcessoSubstancia`).
   - Contém Títulos e Licenças Legais vinculadas (`ProcessoTitulo`).

> [!WARNING]
> Quando codificar novos controllers para `Processo`, certifique-se de carregar (include) os dicionários necessários se a tela do front-end exigir o nome descritivo ao invés do ID raw.
