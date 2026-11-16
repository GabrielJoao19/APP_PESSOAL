import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o Seed do Banco de Dados...');

  // 1. Criar Usuário Padrão
  const senhaHasheada = await bcrypt.hash('123456', 10);
  const usuario = await prisma.usuario.upsert({
    where: { email: 'joao@email.com' },
    update: {},
    create: {
      nome: 'João Gabriel',
      email: 'joao@email.com',
      senha: senhaHasheada,
      limite_diario: 50
    }
  });

  console.log('Usuário criado:', usuario.email);

  // 2. Criar Envelopes
  const countEnvelopes = await prisma.envelope.count({ where: { usuarioId: usuario.id } });
  if (countEnvelopes === 0) {
    const envUber = await prisma.envelope.create({
      data: { nome: 'Uber', limite: 200, valor_gasto: 155, usuarioId: usuario.id }
    });
    const envLazer = await prisma.envelope.create({
      data: { nome: 'Lazer', limite: 300, valor_gasto: 80, usuarioId: usuario.id }
    });
    const envAlim = await prisma.envelope.create({
      data: { nome: 'Alimentação', limite: 200, valor_gasto: 225, usuarioId: usuario.id }
    });

    // Gastos
    await prisma.gasto.create({
      data: { descricao: 'Corridas da semana', valor: 155, envelopeId: envUber.id, usuarioId: usuario.id }
    });
    await prisma.gasto.create({
      data: { descricao: 'Cinema e lanches', valor: 80, envelopeId: envLazer.id, usuarioId: usuario.id }
    });
    await prisma.gasto.create({
      data: { descricao: 'Mercado do mês', valor: 225, envelopeId: envAlim.id, usuarioId: usuario.id }
    });
    console.log('Envelopes e gastos criados com sucesso!');
  }

  // 3. Criar Tarefas
  const countTarefas = await prisma.tarefa.count({ where: { usuarioId: usuario.id } });
  if (countTarefas === 0) {
    await prisma.tarefa.createMany({
      data: [
        { titulo: 'Treino de Força', valor_diario: 15, concluida: true, usuarioId: usuario.id },
        { titulo: 'Dormir 7h+', valor_diario: 10, concluida: true, usuarioId: usuario.id },
        { titulo: 'Trabalho Focado (4h)', valor_diario: 20, concluida: false, usuarioId: usuario.id }
      ]
    });
    console.log('Tarefas criadas com sucesso!');
  }

  // 4. Criar Categorias e Falhas
  const countCategorias = await prisma.categoriaFalha.count();
  if (countCategorias === 0) {
    const catDisciplina = await prisma.categoriaFalha.create({
      data: { nome: 'Disciplina', valor: 15 }
    });
    const catFinanceiro = await prisma.categoriaFalha.create({
      data: { nome: 'Financeiro', valor: 30 }
    });

    await prisma.falha.createMany({
      data: [
        { descricao: 'Refeição fora da dieta', valor_diario: 15, categoriaId: catDisciplina.id, usuarioId: usuario.id },
        { descricao: 'Procrastinação no trabalho', valor_diario: 15, categoriaId: catDisciplina.id, usuarioId: usuario.id },
        { descricao: 'Estourou orçamento diário', valor_diario: 30, categoriaId: catFinanceiro.id, usuarioId: usuario.id }
      ]
    });
    console.log('Falhas e categorias criadas com sucesso!');
  }

  // 5. Criar Saúde e Fitness
  const countMetas = await prisma.meta_Fitness.count({ where: { usuarioId: usuario.id } });
  if (countMetas === 0) {
    const metaPeso = await prisma.meta_Fitness.create({
      data: {
        nome: 'Emagrecimento',
        unidade: 'kg',
        valor_atual: 78.5,
        valor_alvo: 70.0,
        usuarioId: usuario.id
      }
    });

    await prisma.historicoFitness.create({
      data: { valor_registrado: 78.5, metaId: metaPeso.id }
    });
    console.log('Metas e histórico de saúde criados!');
  }

  // 6. Criar Diário
  const countDiarios = await prisma.diario.count({ where: { usuarioId: usuario.id } });
  if (countDiarios === 0) {
    await prisma.diario.create({
      data: {
        titulo: 'Registro Diário',
        conteudo: 'Dia produtivo e focado em alta performance!',
        usuarioId: usuario.id
      }
    });
    console.log('Diário inicial criado!');
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
