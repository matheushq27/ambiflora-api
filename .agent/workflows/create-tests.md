---
description: Como criar testes unitários padrão NestJS
---

# Testes Unitários no Ambiflora API

Este workflow descreve o padrão exigido na aplicação para cobertura de testes.

### 1. Localização e Nomes
- Os arquivos de teste devem ser criados lado a lado ao arquivo fonte (no mesmo diretório).
- O nome deve terminar com `.spec.ts` (ex: `auth.service.spec.ts`).

### 2. Scaffold (Estrutura do Teste)
- Usamos a biblioteca de testes oficial do framework (`@nestjs/testing`).
- A injeção de dependência de instâncias complexas (como o `PrismaService` ou repositórios de banco de dados) **deve ser mockada** obrigatoriamente. Nenhuma inserção em banco real é feita no teste unitário.

Exemplo de Template:
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from './create-user.usecase';
import { PrismaService } from '../../infrastructure/database/prisma.service';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockPrisma: any;

  beforeEach(async () => {
    // Definindo o mock de banco de dados
    mockPrisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('deve injetar e estar definido corretamente', () => {
    expect(useCase).toBeDefined();
  });
});
```

### 3. Rodando os Testes
- Rode `npm run test` para executar a suíte inteira.
- Rode `npm run test:cov` para visualizar as estatísticas de cobertura de testes.
