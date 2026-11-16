import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FinancasService } from './financas.service';

describe('FinancasService', () => {
  let service: FinancasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FinancasService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(FinancasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve carregar a lista de envelopes e atualizar o signal', () => {
    const mockEnvelopes = [
      { id: 1, nome: 'Mercado', limite: 600, valor_gasto: 150, usuarioId: 1 },
    ];

    service.carregarEnvelopes().subscribe();

    const req = httpMock.expectOne('/api/financas/envelopes');
    expect(req.request.method).toBe('GET');
    req.flush(mockEnvelopes);

    expect(service.envelopes().length).toBe(1);
    expect(service.envelopes()[0].nome).toBe('Mercado');
  });

  it('deve criar um novo envelope e adicioná-lo ao signal', () => {
    const novoEnvelope = { id: 2, nome: 'Lazer', limite: 200, valor_gasto: 0, usuarioId: 1 };

    service.criarEnvelope('Lazer', 200, 1).subscribe();

    const req = httpMock.expectOne('/api/financas/envelopes');
    expect(req.request.method).toBe('POST');
    req.flush(novoEnvelope);

    expect(service.envelopes()).toContain(novoEnvelope);
  });
});
