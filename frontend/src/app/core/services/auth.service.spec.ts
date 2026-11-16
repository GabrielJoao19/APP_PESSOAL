import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve iniciar deslogado quando não há token salvo', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });

  it('deve autenticar via POST /api/auth/login e atualizar os signals', () => {
    const mockResponse = {
      access_token: 'jwt-valido-123',
      usuario: { id: 1, nome: 'João', email: 'joao@lifeos.com', limite_diario: 50 },
    };

    service.login('joao@lifeos.com', '123456').subscribe((res) => {
      expect(res.access_token).toBe('jwt-valido-123');
    });

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getToken()).toBe('jwt-valido-123');
    expect(service.currentUser()?.nome).toBe('João');
  });

  it('deve limpar o token e redirecionar no logout', () => {
    spyOn(router, 'navigate');
    localStorage.setItem('lifeos_token', 'token-antigo');

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(localStorage.getItem('lifeos_token')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
