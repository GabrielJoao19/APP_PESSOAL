# ✅ Status de Infraestrutura, DevOps e Guia de Testes (`feito.md`)

Este documento consolida **tudo o que já está 100% pronto na infraestrutura e automação DevOps** do projeto **LifeOS (`APP_PESSOAL`)**, além de estruturar o **Guia Completo de Testes de Software e Seus Tipos** que vamos implementar juntos hoje à noite.

---

## 🏗️ 1. Tudo o que já está FEITO de Infraestrutura e DevOps

Toda a estrutura de código para containerização, proxy reverso, redes isoladas e pipelines CI/CD já está criada, testada localmente e publicada no GitHub (`branch main`).

### 1.1. Containerização Otimizada (Multi-Stage Dockerfiles)
- **Backend ([backend/Dockerfile](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/Dockerfile)):**
  - Construído em **Multi-Stage Build** com `node:24-slim`.
  - **Stage 1 (`builder`):** Instala dependências, gera o Prisma Client (`npx prisma generate`) e compila o código TypeScript do NestJS (`npm run build`).
  - **Stage 2 (`runner`):** Imagem enxuta apenas com artefatos de produção (`dist/`, `node_modules` e `prisma`), expondo a porta `3000`.
  - Antes de subir o servidor (`node dist/src/main.js`), executa automaticamente `npx prisma migrate deploy` para garantir que o banco PostgreSQL esteja sempre sincronizado com o schema mais recente.
- **Frontend ([frontend/Dockerfile](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/Dockerfile)):**
  - Construído em **Multi-Stage Build** com `node:24-slim` + `nginx:alpine`.
  - **Stage 1 (`builder`):** Compila a aplicação Angular 19 em modo produção (`npm run build`).
  - **Stage 2 (`runner`):** Servidor web Nginx super leve servindo o bundle estático na porta `80`.

### 1.2. Servidor Web e Proxy Reverso ([frontend/nginx.conf](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/nginx.conf))
- **Roteamento SPA (Angular Router):** Configurado com `try_files $uri $uri/ /index.html;` para evitar erros `404` ao recarregar rotas internas (`/financas`, `/saude`, `/metas`, etc.).
- **Proxy Reverso (`/api/`):** Redireciona automaticamente todas as chamadas de `/api/...` para `http://backend:3000/` usando o DNS interno da rede Docker (`--network-alias backend`). Assim, o banco e o backend não ficam expostos diretamente na internet.
- **Performance e Segurança:** Compressão `gzip` ativa, cache de 1 ano para assets estáticos com hash e headers de segurança (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

### 1.3. Arquitetura de Redes e Containers Independentes (Sem Docker Compose em Produção)
Em produção e homologação na VM da Azure, **não utilizamos `docker-compose.yml`**. Cada camada roda em seu próprio container independente conectado por uma **Rede Bridge Isolada**:
- **Redes Docker:**
  - `lifeos-prod-net` (Ambiente de Produção — Porta `80`)
  - `lifeos-homolog-net` (Ambiente de Homologação — Porta `8080`)
- **Os 3 Containers por Ambiente:**
  1. **Banco de Dados (`lifeos-postgres` / `lifeos-postgres-homolog`):** Imagem `postgres:16-alpine`, alias de rede `postgres`, volume persistente (`pgdata_prod` / `pgdata_homolog`).
  2. **API Backend (`lifeos-backend` / `lifeos-backend-homolog`):** Imagem `joaogabriel199/app-pessoal-backend`, alias de rede `backend`, conecta em `postgres:5432`.
  3. **Frontend + Nginx (`lifeos-frontend` / `lifeos-frontend-homolog`):** Imagem `joaogabriel199/app-pessoal-frontend`, publica a porta externa (`80` ou `8080`) e conversa com `http://backend:3000/`.

> 💡 *Nota:* O arquivo [docker-compose.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/docker-compose.yml) na raiz foi mantido **exclusivamente para desenvolvimento local rápido**.

### 1.4. Repositórios no Docker Hub
Configurados na conta `joaogabriel199`:
- **`joaogabriel199/app-pessoal-backend`**
- **`joaogabriel199/app-pessoal-frontend`**
- Versionamento automático configurado nas pipelines gerando duas tags a cada execução: `$(Build.BuildId)` (ex: `:42`) e `:latest`.

### 1.5. Pipelines CI/CD no Azure DevOps
Duas pipelines independentes acionadas apenas quando a respectiva pasta sofre alterações (`paths.include`):
- **Pipeline do Backend ([backend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/azure-pipelines.yml)):**
  1. **Stage `CI`:** Instala Node 24 -> `npm ci` -> `npx prisma generate` -> Roda Testes Unitários (`npm test` com Vitest) -> Roda Build -> Faz `buildAndPush` da imagem para `joaogabriel199/app-pessoal-backend`.
  2. **Stage `CD_Homolog`:** Conecta via SSH na VM, cria a rede/banco de homologação se não existirem, faz `docker pull` e recria `lifeos-backend-homolog`.
  3. **Stage `CD_Prod`:** Conecta via SSH na VM e atualiza o container `lifeos-backend` na rede `lifeos-prod-net` (executando migrations automaticamente).
- **Pipeline do Frontend ([frontend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/azure-pipelines.yml)):**
  1. **Stage `CI`:** Instala Node 24 -> `npm ci` -> Roda Testes Unitários em Chrome Headless (`npx ng test --watch=false --browsers=ChromeHeadless`) -> Build de Produção -> Faz `buildAndPush` para `joaogabriel199/app-pessoal-frontend`.
  2. **Stage `CD_Homolog`:** Deploy via SSH na porta `8080` (`lifeos-frontend-homolog`).
  3. **Stage `CD_Prod`:** Deploy via SSH na porta `80` (`lifeos-frontend`).

### 1.6. Documentação DevOps Completa
- [ORQUESTRADOR_DOCS.md](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/ORQUESTRADOR_DOCS.md): Índice mestre e trilha de leitura.
- [ARQUITETURA_DEVOPS.md](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/ARQUITETURA_DEVOPS.md): Fluxograma Mermaid e explicação técnica detalhada.
- [GUIA_PASSO_A_PASSO_DEVOPS.md](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/GUIA_PASSO_A_PASSO_DEVOPS.md): Tutorial clique a clique (Docker Hub, VM Azure e Service Connections).
- [COMANDOS_DOCKER.md](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/COMANDOS_DOCKER.md): Catálogo de comandos `docker network` e `docker run` sem Docker Compose.

### ⏳ O que falta fazer apenas no Painel Web (Quando formos subir a VM):
- [ ] Finalizar a criação da VM Ubuntu 24.04 LTS na Azure (liberando portas `22`, `80` e `8080`) e instalar o Docker nela.
- [ ] Criar as 2 Service Connections no Azure DevOps (`docker-registry-connection` com o Token do Docker Hub e `ssh-vm-connection` com a chave SSH da VM).
- [ ] Criar o Variable Group `lifeos-secrets` na Library do Azure DevOps (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`).

---

## 🧪 2. Guia de Testes de Software e Seus Tipos (Plano para Hoje à Noite)

Baseado na pirâmide e matriz de qualidade moderna, abaixo estão os **6 principais tipos de testes**, o que cada um valida, as ferramentas ideais para nossa stack (**Angular + NestJS + PostgreSQL + Docker**) e o que vamos construir hoje à noite.

| # | Tipo de Teste | O que ele valida? | Ferramenta no LifeOS | Status no Projeto |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Testes Unitários (Unidade)** | Funções isoladas, cálculos e regras de negócio puras (sem banco de dados real ou rede). | **Vitest** (Backend) / **Jasmine + Karma** (Frontend) | ✅ **Já implementado (17 testes passando no CI)** |
| **2** | **Testes de Integração / API** | Se o backend conversa direito com o banco de dados, filas, microsserviços, autenticação JWT e rotas HTTP. | **Supertest + Vitest E2E + Prisma (Test DB)** | 🌙 **Implementar hoje à noite** |
| **3** | **Testes End-to-End (E2E)** | A jornada completa do usuário no navegador (Frontend + Backend + Banco rodando juntos). | **Playwright** (ou Cypress) | 🌙 **Implementar hoje à noite** |
| **4** | **Testes de Performance / Carga** | Como o sistema se comporta com múltiplos usuários simultâneos (ex: 1.000 a 10.000 reqs, latência p95, gargalos, quedas). | **Grafana k6** (ou Artillery) | 🌙 **Implementar hoje à noite** |
| **5** | **Testes de Segurança (SAST / DAST)** | Vulnerabilidades no código-fonte (SAST), dependências, containers ou na aplicação rodando (DAST: SQL Injection, XSS, segredos expostos). | **npm audit / Trivy / Semgrep (SAST)** e **OWASP ZAP (DAST)** | 🌙 **Implementar hoje à noite** |
| **6** | **Testes Mobile / Dispositivos** | Layout responsivo e aplicação rodando em viewports Android/iOS ou emuladores. | **Playwright Mobile Viewports** (iPhone / Pixel) | 🌙 **Implementar hoje à noite** |

---

### 🔍 Detalhamento de Cada Tipo de Teste no Nosso Projeto

#### 1️⃣ Testes Unitários (Unidade) — *Já Ativos!*
- **Conceito:** Testam a menor parte testável do código (um método de um Service ou Component) de forma 100% isolada. O banco de dados (`PrismaService`) e chamadas HTTP (`HttpClient`) são substituídos por **Mocks / Spies** (`vi.fn()` no Vitest ou `HttpTestingController` no Angular).
- **O que já temos rodando hoje:**
  - **Backend (4 arquivos / 9 testes com Vitest):**
    - [auth.service.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/src/auth/auth.service.spec.ts): Valida hash de senha no cadastro, bloqueio de e-mail duplicado e geração de token JWT no login.
    - [financas.service.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/src/financas/financas.service.spec.ts): Valida criação de envelopes, cálculo de porcentagem gasta e incremento/decremento automático do `valor_gasto` ao criar ou excluir uma compra.
    - [produtividade.service.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/src/produtividade/produtividade.service.spec.ts): Valida criação de hábitos, toggle de hábito concluído e cálculo da penalidade diária de erros.
    - [app.controller.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/src/app.controller.spec.ts): Healthcheck do controller raiz.
  - **Frontend (3 arquivos / 8 testes com Karma + Jasmine):**
    - [auth.service.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/src/app/core/services/auth.service.spec.ts): Valida persistência do JWT no `localStorage` e estado reativo de login/logout.
    - [financas.service.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/src/app/features/financas/services/financas.service.spec.ts): Valida chamadas HTTP `GET`, `POST` e `DELETE` para envelopes e gastos.
    - [app.component.spec.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/src/app/app.component.spec.ts): Valida montagem da árvore raiz e `<router-outlet>`.

---

#### 2️⃣ Testes de Integração / API — *Plano para Hoje à Noite*
- **Conceito:** Ao contrário do teste unitário (que usa mocks), o teste de integração sobe a aplicação NestJS real em memória (`Test.createTestingModule` + `app.init()`), dispara requisições HTTP reais com **Supertest** (`POST /auth/register`, `POST /financas/envelopes`, `POST /financas/gastos`) e verifica se os registros foram gravados de verdade no banco de dados PostgreSQL de teste e se os Guards JWT bloqueiam acessos sem token (`401 Unauthorized`).
- **O que faremos à noite:**
  - Aproveitar o arquivo [backend/vitest.config.e2e.ts](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/vitest.config.e2e.ts) já presente no projeto.
  - Criar a suíte completa em `backend/test/` testando o fluxo real HTTP + Banco:
    1. Cadastro e Login retornando JWT válido.
    2. Proteção de rotas privadas (`JwtAuthGuard`).
    3. Criação de Envelope + Lançamento de Gasto validando no PostgreSQL se o saldo foi atualizado.
    4. Criação de Meta Fitness + Registro de Progresso.

---

#### 3️⃣ Testes End-to-End (E2E) — *Plano para Hoje à Noite*
- **Conceito:** Simula um usuário real abrindo o navegador Chrome, clicando nos botões da tela do Angular, preenchendo formulários e verificando se a interface atualiza após a resposta do Backend e do Banco de Dados.
- **O que faremos à noite:**
  - Configurar o **Playwright** no projeto.
  - Criar cenários automatizados cobrindo a jornada crítica:
    1. Abrir a tela de Registro/Login -> Criar conta -> Entrar no Dashboard.
    2. Navegar até a aba **Finanças** -> Criar um envelope "Alimentação" de R$ 1.000 -> Lançar um gasto de R$ 150 -> Verificar se a barra de progresso na tela mudou para 15%.
    3. Navegar até **Saúde** e **Diários** -> Registrar um hábito e uma entrada de diário -> Verificar se o Score Global no topo da tela aumentou.

---

#### 4️⃣ Testes de Performance / Carga — *Plano para Hoje à Noite*
- **Conceito:** Avalia como a API NestJS + PostgreSQL se comporta sob estresse (múltiplos usuários simultâneos fazendo login, listando dashboard e registrando gastos ao mesmo tempo). Mede **latência média**, **percentil 95 (`p95`)**, **taxa de erros HTTP** e **limite de vazão (RPS - Requests Per Second)**.
- **O que faremos à noite:**
  - Criar scripts de teste de carga com **Grafana k6** (ou **Artillery**) em uma pasta `tests/performance/`:
    - **Smoke Load:** 10 usuários simultâneos por 30s.
    - **Stress / Spike Test:** Rampa de 50 até 500+ usuários simultâneos batendo nas rotas `/auth/login` e `/financas/envelopes`, com *thresholds* automáticos (ex: `http_req_duration p(95) < 300ms` e taxa de falha `< 1%`).

---

#### 5️⃣ Testes de Segurança (SAST & DAST) — *Plano para Hoje à Noite*
- **Conceito:**
  - **SAST (*Static Application Security Testing*):** Analisa o código-fonte, dependências (`package-lock.json`) e imagens Docker de forma estática (sem precisar rodar o sistema) em busca de pacotes com CVEs conhecidas, chaves vazadas no código ou falhas de escrita.
  - **DAST (*Dynamic Application Security Testing*):** Ataca a aplicação **enquanto ela está rodando** (como um *pentester* automatizado), testando *SQL Injection*, *NoSQL Injection*, *Cross-Site Scripting (XSS)*, falta de headers de segurança no Nginx e quebra de autenticação JWT.
- **O que faremos à noite:**
  - **SAST na Pipeline CI:** Adicionar auditoria de dependências (`npm audit`), escaneamento de segredos/código estático e scan de vulnerabilidades da imagem Docker com **Trivy**.
  - **DAST e Testes de Intrusão na API:** Criar suíte de testes de segurança validando payloads maliciosos (SQLi/XSS nos inputs do Prisma/NestJS, tokens JWT adulterados/expirados) e verificar os Security Headers do `nginx.conf` via **OWASP ZAP Baseline**.

---

#### 6️⃣ Testes Mobile / Responsividade — *Plano para Hoje à Noite*
- **Conceito:** Garante que a interface do LifeOS funcione perfeitamente em telas de smartphones (Android e iOS), validando se a Sidebar recolhe no modo mobile, se os modais de Novo Gasto/Hábito cabem na tela sem quebrar o layout e se o toque nos botões funciona.
- **O que faremos à noite:**
  - Configurar perfis de dispositivos móveis no **Playwright** (`Desktop Chrome`, `iPhone 14` e `Pixel 7`) para rodar os testes E2E validando a experiência mobile.

---

## 🚀 Roteiro Prático para Hoje à Noite

Quando você voltar hoje à noite, podemos seguir exatamente esta ordem prática:
1. **Passo 1 (Integração / API):** Implementar os testes de integração com **Supertest + Vitest** no Backend e adicionar na pipeline.
2. **Passo 2 (E2E + Mobile):** Configurar o **Playwright** testando Frontend + Backend juntos (Desktop e Mobile).
3. **Passo 3 (Performance / Carga):** Criar o script do **k6** e rodar um teste de estresse ao vivo contra os containers para ver quantas requisições por segundo o LifeOS aguenta.
4. **Passo 4 (Segurança SAST/DAST):** Adicionar **Trivy + SAST/DAST** nas pipelines do Azure DevOps para blindar o deploy.
