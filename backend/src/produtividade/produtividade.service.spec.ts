import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { ProdutividadeService } from './produtividade.service.js';

describe('ProdutividadeService', () => {
  let service: ProdutividadeService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      tarefa: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      diario: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    service = new ProdutividadeService(mockPrisma);
  });

  it('deve criar uma nova tarefa diária', async () => {
    const dto = { titulo: 'Estudar DevOps', valor_diario: 20, usuarioId: 1 };
    mockPrisma.tarefa.create.mockResolvedValue({ id: 1, concluida: false, ...dto });

    const resultado = await service.criarTarefa(dto as any);
    expect(resultado.titulo).toBe('Estudar DevOps');
    expect(mockPrisma.tarefa.create).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException ao atualizar tarefa inexistente', async () => {
    mockPrisma.tarefa.findUnique.mockResolvedValue(null);

    await expect(
      service.atualizarTarefa(404, { concluida: true } as any),
    ).rejects.toThrow(NotFoundException);
  });
});
