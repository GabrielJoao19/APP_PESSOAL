import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { FinancasService } from './financas.service.js';

describe('FinancasService', () => {
  let service: FinancasService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      envelope: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      gasto: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    service = new FinancasService(mockPrisma);
  });

  it('deve criar um novo envelope orçamentário', async () => {
    const dto = { nome: 'Alimentação', limite: 500, usuarioId: 1 };
    const criado = { id: 1, ...dto, valor_gasto: 0 };
    mockPrisma.envelope.create.mockResolvedValue(criado);

    const resultado = await service.criarEnvelope(dto as any);
    expect(resultado).toEqual(criado);
    expect(mockPrisma.envelope.create).toHaveBeenCalledWith({
      data: dto,
      include: { usuario: true },
    });
  });

  it('deve lançar NotFoundException ao buscar envelope inexistente', async () => {
    mockPrisma.envelope.findUnique.mockResolvedValue(null);

    await expect(service.buscarEnvelope(999)).rejects.toThrow(NotFoundException);
  });

  it('deve registrar um gasto vinculado a um envelope', async () => {
    const dto = { descricao: 'Almoço', valor: 35, envelopeId: 1, usuarioId: 1 };
    const gastoMock = { id: 10, ...dto };
    mockPrisma.gasto.create.mockResolvedValue(gastoMock);

    const resultado = await service.criarGasto(dto as any);
    expect(resultado).toEqual(gastoMock);
    expect(mockPrisma.gasto.create).toHaveBeenCalled();
  });
});
