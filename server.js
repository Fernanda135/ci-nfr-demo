// server.js
// API mínima em Express, usada como alvo do teste de performance (NFR: Performance).
// Rota GET /produtos simula uma consulta simples, com uma pequena latência artificial
// para tornar a métrica de tempo de resposta mais interessante na demonstração.

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// "Banco de dados" fake em memória
const produtos = [
  { id: 1, nome: 'Teclado mecânico', preco: 250.0 },
  { id: 2, nome: 'Mouse sem fio', preco: 90.0 },
  { id: 3, nome: 'Monitor 24"', preco: 780.0 },
  { id: 4, nome: 'Headset gamer', preco: 320.0 },
];

// Latência artificial (ms) para simular processamento/consulta ao banco.
// Pode ser aumentada para forçar o teste de performance a falhar na demonstração.
const LATENCIA_MS = Number(process.env.LATENCIA_MS || 150);

app.get('/produtos', (req, res) => {
  setTimeout(() => {
    res.status(200).json(produtos);
  }, LATENCIA_MS);
});

app.get('/', (req, res) => {
  res.send('API de demonstração no ar. Use GET /produtos');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
