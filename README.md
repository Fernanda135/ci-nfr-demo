# Demonstração: Teste Automatizado de NFR (Performance)

Demonstração prática referente ao artigo:

> Yu, L., Alégroth, E., Chatzipetrou, P., Gorschek, T. (2023). *Automated NFR
> testing in continuous integration environments: a multi-case study of
> Nordic companies*. Empirical Software Engineering, 28(144).

Este projeto reproduz, de forma simplificada, o **Example 1** descrito na
Seção 4.2 do artigo: as 5 etapas de medição de uma NFR (no caso, Performance,
usando a métrica **MRT — Mean Response Time**) dentro de um ambiente de CI.

## O que tem aqui

- `server.js` — uma API mínima em Express com a rota `GET /produtos`.
- `test/performance-test.js` — script que sobe a API, faz N requisições,
  calcula o **MRT** com a mesma fórmula da Tabela 6 do artigo
  (`MRT = (A1 + A2 + ... + An) / n`), e falha o processo (`exit code 1`)
  se o MRT passar de um limite definido.
- `.github/workflows/ci.yml` — workflow do GitHub Actions que executa esse
  teste automaticamente a cada `push`, simulando o "CI server" do artigo.

## Como rodar localmente

```bash
npm install
npm run test:performance
```

## Ajustando os parâmetros

No workflow (`ci.yml`) ou localmente via variáveis de ambiente:

- `NUM_REQUISICOES` — quantas requisições compõem a amostra (n da fórmula).
- `LIMITE_MRT_MS` — limite aceitável de MRT, em milissegundos.
- `LATENCIA_MS` (em `server.js`) — latência artificial simulada pela API.
