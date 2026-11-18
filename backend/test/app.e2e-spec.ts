import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';

describe('LifeOS API — Testes de Integração HTTP (Supertest + NestJS)', () => {
  let app: INestApplication<App>;
  let jwtToken: string;

  const dbState = {
    usuarios: [] as any[],
    envelopes: [
      { id: 1, nome: 'Essenciais', valor_orcado: 2000, valor_gasto: 500, icone: 'home', cor: '#10B981', usuarioId: 1 },
    ],
    gastos: [] as any[],
    tarefas: [] as any[],
    metasFitness: [
      { id: 1, titulo: 'Correr 50km', categoria: 'Cardio', valor_meta: 50, valor_atual: 10, unidade: 'km', concluida: false },
    ],
  };

  const prismaMock = {
    usuario: {
      create: async ({ data }: any) => {
        const novo = { id: dbState.usuarios.length + 1, ...data };
        dbState.usuarios.push(novo);
        return novo;
      },
      findUnique: async ({ where }: any) => {
        if (where.email) return dbState.usuarios.find((u) => u.email === where.email) || null;
        if (where.id) return dbState.usuarios.find((u) => u.id === where.id) || null;
        return null;
      },
      findMany: async () => dbState.usuarios,
    },
    envelope: {
      create: async ({ data }: any) => {
        const novo = { id: dbState.envelopes.length + 1, valor_gasto: 0, ...data };
        dbState.envelopes.push(novo);
        return novo;
      },
      findMany: async () => dbState.envelopes,
      findUnique: async ({ where }: any) => dbState.envelopes.find((e) => e.id === where.id) || null,
      update: async ({ where, data }: any) => {
        const env = dbState.envelopes.find((e) => e.id === where.id);
        if (!env) return null;
        if (data.valor_gasto?.increment) {
          env.valor_gasto += Number(data.valor_gasto.increment);
        } else if (data.valor_gasto?.decrement) {
          env.valor_gasto -= Number(data.valor_gasto.decrement);
        } else {
          Object.assign(env, data);
        }
        return env;
      },
    },
    gasto: {
      create: async ({ data }: any) => {
        const novo = { id: dbState.gastos.length + 1, ...data };
        dbState.gastos.push(novo);
        return novo;
      },
      findMany: async () => dbState.gastos,
      findUnique: async ({ where }: any) => dbState.gastos.find((g) => g.id === where.id) || null,
      delete: async ({ where }: any) => {
        const idx = dbState.gastos.findIndex((g) => g.id === where.id);
        const [removido] = dbState.gastos.splice(idx, 1);
        return removido;
      },
    },
    tarefa: {
      create: async ({ data }: any) => {
        const nova = { id: dbState.tarefas.length + 1, concluida: false, ...data };
        dbState.tarefas.push(nova);
        return nova;
      },
      findMany: async () => dbState.tarefas,
    },
    meta_Fitness: {
      findMany: async () => dbState.metasFitness,
      findUnique: async ({ where }: any) => dbState.metasFitness.find((m) => m.id === where.id) || null,
    },
  };

  beforeAll(async () => {
    const senhaHash = await bcrypt.hash('SenhaSegura123', 10);
    dbState.usuarios.push({
      id: 1,
      nome: 'João Gabriel',
      email: 'admin@lifeos.com',
      senha: senhaHash,
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. [GET /] Healthcheck deve retornar 200 OK', async () => {
    await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('2. [POST /auth/login] Deve rejeitar credenciais inválidas com 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lifeos.com', senha: 'senha-errada' })
      .expect(401);
  });

  it('3. [POST /auth/login] Deve autenticar com sucesso e retornar access_token JWT válido', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lifeos.com', senha: 'SenhaSegura123' })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(typeof res.body.access_token).toBe('string');
    jwtToken = res.body.access_token;
  });

  it('4. [GET /financas/envelopes] Deve bloquear requisição sem token JWT (401 Unauthorized)', async () => {
    await request(app.getHttpServer())
      .get('/financas/envelopes')
      .expect(401);
  });

  it('5. [POST /financas/gastos] Deve validar DTO, criar gasto e atualizar saldo do envelope via HTTP', async () => {
    const resGasto = await request(app.getHttpServer())
      .post('/financas/gastos')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        descricao: 'Supermercado Semanal',
        valor: 250,
        usuarioId: 1,
        envelopeId: 1,
      })
      .expect(201);

    expect(resGasto.body.descricao).toBe('Supermercado Semanal');

    const resEnvelopes = await request(app.getHttpServer())
      .get('/financas/envelopes')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const envelope = resEnvelopes.body.find((e: any) => e.id === 1);
    expect(envelope.valor_gasto).toBe(750);
  });

  it('6. [GET /saude/metas-fitness] Deve listar metas fitness autenticado via JWT', async () => {
    const res = await request(app.getHttpServer())
      .get('/saude/metas-fitness')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].titulo).toBe('Correr 50km');
  });
});
