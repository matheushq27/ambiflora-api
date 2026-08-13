# Workflow: Documentação de Rotas

## Regra de Ouro

Toda e qualquer rota criada, mapeada ou refatorada deve ter obrigatoriamente um workflow documentando o que ela faz, localizado em `.agent/workflows/routes/`. 
**Sem exceções.**

---

## Localização

```
.agent/workflows/routes/
  GET-users.md
  POST-companies.md
  ...
```

O nome do arquivo segue rigidamente o padrão: `{METHOD}-{path-com-hifens}.md`  
Exemplos: `GET-users.md`, `POST-auth-login.md`, `GET-monitored-processes-id.md`

---

## Estrutura obrigatória do arquivo

Cada arquivo de rota deve seguir este exato template markdown:

```markdown
# {METHOD} /{rota}

## O que faz
[Descrição simples do propósito da rota. Explicar o porquê dela existir e quem consome.]

## Parâmetros (Params / Query / Body)
[Tabela com nome, tipo, se é obrigatório e descrição]

## Cenários e Respostas
[Descreva os fluxos de sucesso e fluxos de erro previstos (ex: 404, 403)]

## Retorno
[Exemplo completo do JSON retornado. Lembre-se que rotas GET precisam retornar na chave 'data']

## Onde está implementado
[Caminhos dos arquivos: controller, usecase e repository]
```

## Índice Geral de Rotas da API
Ao final da criação, registrar a rota no índice abaixo:

| Arquivo | Rota | Descrição curta |
|---|---|---|
| *(Nenhuma rota documentada ainda)* | ... | ... |
