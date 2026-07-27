# Demonstração: Pipeline de CI com Teste Automatizado de Performance
 
Este projeto é uma demonstração prática de um **pipeline de Integração
Contínua (CI)** que executa, automaticamente, um teste de performance a
cada `push` no repositório. O teste mede o **Tempo Médio de Resposta (MRT —
Mean Response Time)** de uma API e reprova o pipeline caso esse tempo
ultrapasse um limite definido.
 
## O que tem aqui
 
- `server.js` — uma API mínima em Express com a rota `GET /produtos`.
- `test/performance-test.js` — script que sobe a API, faz N requisições,
  calcula o **MRT** (`MRT = (A1 + A2 + ... + An) / n`), e falha o processo
  (`exit code 1`) se o MRT passar de um limite definido.
- `.github/workflows/ci.yml` — workflow do GitHub Actions que executa esse
  teste automaticamente a cada `push`, simulando um servidor de CI.

## Como funciona
 
A cada `push` no repositório, o GitHub Actions:
 
1. instala as dependências do projeto;
2. sobe a API definida em `server.js`;
3. faz N requisições à rota `/produtos`, medindo o tempo de resposta de
   cada uma;
4. calcula o MRT com base nesses tempos;
5. compara o MRT com um limite definido (`LIMITE_MRT_MS`) e finaliza o
   pipeline com sucesso (✅) ou falha (❌), dependendo do resultado.
Se a API responder dentro do limite aceitável, o pipeline passa. Se uma
latência artificial for adicionada em `server.js` (parâmetro
`LATENCIA_MS`), o MRT calculado ultrapassa o limite e o pipeline falha
automaticamente, sinalizando o problema de performance.

## Ajustando os parâmetros

No workflow (`ci.yml`) ou localmente via variáveis de ambiente:

- `NUM_REQUISICOES` — quantas requisições compõem a amostra (n da fórmula).
- `LIMITE_MRT_MS` — limite aceitável de MRT, em milissegundos.
- `LATENCIA_MS` (em `server.js`) — latência artificial simulada pela API.

## Como rodar localmente

```bash
npm install
npm run test:performance
```