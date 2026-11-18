import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * Teste de Performance, Carga e Estresse (Grafana k6) — LifeOS
 *
 * Modos de execução (controlados pela variável de ambiente K6_PROFILE):
 * 1. smoke (Padrão em todo commit no Gate de Homologação):
 *    - 20 usuários virtuais simultâneos por 45 segundos (rápido para não travar o deploy).
 * 2. stress (Executado na esteira agendada da madrugada — Nightly Cron):
 *    - Rampa pesada chegando a 500 usuários simultâneos para testar resiliência máxima.
 */
const profile = __ENV.K6_PROFILE || 'smoke';
const baseUrl = __ENV.BASE_URL || 'http://localhost:8080/api';

export const options =
  profile === 'stress'
    ? {
        stages: [
          { duration: '2m', target: 100 }, // Aquecimento até 100 usuários simultâneos
          { duration: '5m', target: 300 }, // Carga alta sustentada (300 VUs)
          { duration: '3m', target: 500 }, // Pico de estresse (500 VUs)
          { duration: '2m', target: 0 },   // Recuperação (Scale-down)
        ],
        thresholds: {
          http_req_duration: ['p(95)<500'], // 95% das respostas abaixo de 500ms sob estresse extremo
          http_req_failed: ['rate<0.02'],   // Menos de 2% de falhas toleradas no pico
        },
      }
    : {
        stages: [
          { duration: '15s', target: 20 }, // Sobe para 20 usuários simultâneos
          { duration: '20s', target: 20 }, // Mantém 20 usuários simultâneos
          { duration: '10s', target: 0 },  // Desce para 0
        ],
        thresholds: {
          http_req_duration: ['p(95)<300'], // 95% das respostas devem responder em menos de 300ms
          http_req_failed: ['rate<0.01'],   // Taxa de erro inferior a 1%
        },
      };

export default function () {
  // 1. Healthcheck da API
  const healthRes = http.get(`${baseUrl}/`);
  check(healthRes, {
    'status 200 no healthcheck': (r) => r.status === 200,
    'latência < 200ms': (r) => r.timings.duration < 200,
  });

  // 2. Teste de Autenticação / Proteção JWT nas rotas privadas
  const envelopesRes = http.get(`${baseUrl}/financas/envelopes`);
  check(envelopesRes, {
    'rota protegida responde rápido (200 ou 401)': (r) => r.status === 200 || r.status === 401,
  });

  sleep(1);
}
