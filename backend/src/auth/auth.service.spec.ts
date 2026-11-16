import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import * as bcrypt from 'bcrypt';

vi.mock('bcrypt', () => ({
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsuariosService: any;
  let mockJwtService: any;

  beforeEach(() => {
    mockUsuariosService = {
      buscarUsuarioEmail: vi.fn(),
    };
    mockJwtService = {
      sign: vi.fn().mockReturnValue('mock-jwt-token'),
    };
    authService = new AuthService(mockUsuariosService, mockJwtService);
  });

  it('deve autenticar usuário válido e retornar access_token', async () => {
    const usuarioMock = {
      id: 1,
      nome: 'João Gabriel',
      email: 'joao@lifeos.com',
      senha: 'hashed-password',
      limite_diario: 50,
    };

    mockUsuariosService.buscarUsuarioEmail.mockResolvedValue(usuarioMock);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const resultado = await authService.login('joao@lifeos.com', '123456');

    expect(resultado.access_token).toBe('mock-jwt-token');
    expect(resultado.usuario.email).toBe('joao@lifeos.com');
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'joao@lifeos.com',
    });
  });

  it('deve lançar UnauthorizedException se o e-mail não existir', async () => {
    mockUsuariosService.buscarUsuarioEmail.mockResolvedValue(null);

    await expect(
      authService.login('inexistente@lifeos.com', '123456'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
    mockUsuariosService.buscarUsuarioEmail.mockResolvedValue({
      id: 1,
      email: 'joao@lifeos.com',
      senha: 'hashed-password',
    });
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    await expect(
      authService.login('joao@lifeos.com', 'senha-errada'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
