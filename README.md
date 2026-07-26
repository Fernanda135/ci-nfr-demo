# Demonstração: Teste Automatizado de NFR (Performance) em um Pipeline de CI

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

## Como rodar localmente (antes da apresentação, para testar)

```bash
npm install
npm run test:performance
```

Você verá no terminal cada requisição sendo medida, e o cálculo do MRT ao final.

## Roteiro sugerido para a demonstração (5 min)

1. **Mostrar o código** rapidamente: a rota `/produtos` em `server.js` e a
   fórmula do MRT em `test/performance-test.js` — apontando que é a mesma
   fórmula da Tabela 6 do artigo.

2. **Mostrar o workflow** `.github/workflows/ci.yml` e explicar que ele
   reproduz o papel do "CI server" do modelo do artigo (Fig. 4): o CI
   executa os testes automaticamente e produz a métrica.

3. **Fazer um `git push` ao vivo** (com o teste passando) e mostrar a aba
   *Actions* do GitHub rodando o job e finalizando com sucesso (✅), com o
   log mostrando o valor do MRT calculado.

4. **Provocar uma falha de propósito**, para mostrar o CI "notificando a
   equipe sobre o impacto de qualidade" (Etapa 4 do modelo do artigo):
   - Edite `server.js` e aumente a latência artificial, por exemplo:
     ```js
     const LATENCIA_MS = Number(process.env.LATENCIA_MS || 150);
     ```
   - Faça outro `git push`.
   - Mostre o Actions agora falhando (❌), com o log indicando que o MRT
     excedeu o limite de 100 ms definido no workflow.

5. **Fechar a fala** conectando com o artigo: assim como nos casos
   estudados pelos autores (Projeto B, Exemplo 1), o CI não só executa o
   teste, mas também **produz o dado**, **calcula a métrica** e **notifica
   a equipe** — automatizando um processo que, feito manualmente, seria
   lento e sujeito a erro humano (um dos problemas centrais discutidos na
   Contextualização do artigo).

## Ajustando os parâmetros

No workflow (`ci.yml`) ou localmente via variáveis de ambiente:

- `NUM_REQUISICOES` — quantas requisições compõem a amostra (n da fórmula).
- `LIMITE_MRT_MS` — limite aceitável de MRT, em milissegundos.
- `LATENCIA_MS` (em `server.js`) — latência artificial simulada pela API.

## Como subir isso para um repositório no GitHub

```bash
cd ci-nfr-demo
git init
git add .
git commit -m "Demonstração: NFR testing (performance) em pipeline de CI"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

Depois do primeiro push, o workflow já roda automaticamente — é só acessar
a aba **Actions** do repositório no GitHub.
