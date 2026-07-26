// test/performance-test.js
//
// Teste automatizado de NFR (Performance), inspirado no "Example 1" do artigo:
// Yu, L., Alégroth, E., Chatzipetrou, P., Gorschek, T. (2023).
// "Automated NFR testing in continuous integration environments:
//  a multi-case study of Nordic companies". Empirical Software Engineering, 28(144).
//
// Reproduz as mesmas 5 etapas descritas no artigo para a métrica de performance:
//   1. Implementar casos de teste para medir a métrica (aqui: MRT).
//   2. O "CI server" (neste caso, o próprio script/workflow) executa os testes
//      e coleta os dados (tempos de resposta de N requisições).
//   3. Calcular o resultado da métrica: MRT = (A1 + A2 + ... + An) / n
//      (mesma fórmula da Tabela 6 do artigo, para Mean Response Time).
//   4. Notificar o desenvolvedor sobre o impacto de qualidade (aqui: log no console
//      + exit code que quebra o pipeline se o limite for excedido).
//   5. (No artigo, o resultado é monitorado num "cloud platform"; aqui, fica
//      registrado no log do GitHub Actions, que cumpre esse papel de forma simples.)

const { spawn } = require('child_process');
const http = require('http');

const PORT = 3000;
const URL = `http://localhost:${PORT}/produtos`;
const NUM_REQUISICOES = Number(process.env.NUM_REQUISICOES || 20);
const LIMITE_MRT_MS = Number(process.env.LIMITE_MRT_MS || 100); // limiar de aceitação da NFR

function medirRequisicao() {
  return new Promise((resolve, reject) => {
    const inicio = Date.now();
    http.get(URL, (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        const tempoMs = Date.now() - inicio;
        resolve(tempoMs);
      });
    }).on('error', reject);
  });
}

function esperarServidorSubir(tentativasRestantes = 20) {
  return new Promise((resolve, reject) => {
    const tentar = () => {
      http.get(`http://localhost:${PORT}/`, () => resolve())
        .on('error', () => {
          if (tentativasRestantes <= 0) return reject(new Error('Servidor não respondeu a tempo.'));
          setTimeout(() => esperarServidorSubir(tentativasRestantes - 1).then(resolve, reject), 200);
        });
    };
    tentar();
  });
}

async function main() {
  console.log('== Teste automatizado de NFR: Performance ==');
  console.log(`Endpoint sob teste: ${URL}`);
  console.log(`Número de requisições (n): ${NUM_REQUISICOES}`);
  console.log(`Limite aceitável de MRT: ${LIMITE_MRT_MS} ms\n`);

  // Passo 2 do modelo do artigo: subir o "produto" e coletar os dados via CI
  console.log('[CI] Subindo a aplicação (source code -> execução)...');
  const servidor = spawn('node', ['server.js'], { stdio: 'inherit' });

  try {
    await esperarServidorSubir();
    console.log('[CI] Servidor no ar. Iniciando coleta de dados de performance...\n');

    const tempos = [];
    for (let i = 1; i <= NUM_REQUISICOES; i++) {
      const tempoMs = await medirRequisicao();
      tempos.push(tempoMs);
      console.log(`  Requisição ${i}/${NUM_REQUISICOES}: ${tempoMs} ms`);
    }

    // Passo 3: cálculo da métrica MRT, igual à fórmula do artigo (Tabela 6)
    const somaTempos = tempos.reduce((acc, t) => acc + t, 0);
    const mrt = somaTempos / tempos.length;

    console.log('\n== Resultado da métrica ==');
    console.log(`MRT = (${tempos.join(' + ')}) / ${tempos.length}`);
    console.log(`MRT = ${mrt.toFixed(2)} ms`);

    // Passo 4: notificação de impacto de qualidade
    if (mrt > LIMITE_MRT_MS) {
      console.log(`\n[CI] ❌ FALHA: MRT (${mrt.toFixed(2)} ms) excedeu o limite de ${LIMITE_MRT_MS} ms.`);
      console.log('[CI] O pipeline será marcado como falho para notificar a equipe.');
      encerrarServidor(servidor, 1);
    } else {
      console.log(`\n[CI] ✅ OK: MRT (${mrt.toFixed(2)} ms) dentro do limite de ${LIMITE_MRT_MS} ms.`);
      encerrarServidor(servidor, 0);
    }
  } catch (erro) {
    console.error('Erro ao executar o teste de performance:', erro);
    encerrarServidor(servidor, 1);
  }
}

function encerrarServidor(servidor, codigoSaida) {
  servidor.kill();
  process.exitCode = codigoSaida;
}

main();
