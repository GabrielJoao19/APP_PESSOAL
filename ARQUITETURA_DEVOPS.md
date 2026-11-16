# 🚀 Arquitetura DevOps & CI/CD — LifeOS (`APP_PESSOAL`)

Este documento centraliza toda a arquitetura de **Infraestrutura, Containers, Pipelines CI/CD (Azure DevOps), Docker Hub, Proxy Reverso (Nginx) e Comandos Operacionais** do projeto **LifeOS**.

> [!IMPORTANT]
> **Atualização Contínua:** Este documento é mantido automaticamente pela skill [`devops-doc-updater`](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/.agents/skills/devops-doc-updater/SKILL.md) sempre que houver alterações em Dockerfiles, Nginx, Pipelines ou infraestrutura.

---

## ⚡ 1. Fluxograma Resumido (Visão Geral Macro)

Visão direta do caminho que o código percorre desde o `git push` até rodar nos 3 containers independentes na VM da Azure:

```mermaid
flowchart LR
    GIT["💻 1. Git Push\n(Código Front / Back)"]
    CI["🧪 2. Azure Pipelines (CI)\nTestes + Docker Build"]
    HUB[("🐳 3. Docker Hub\nImagens Prontas")]
    CD["🔑 4. Deploy via SSH (CD)\nHomolog (:8080) | Prod (:80)"]

    subgraph VM ["☁️ 5. VM da Azure (3 Containers Independentes)"]
        direction TB
        FE["🌐 Container 1: Nginx + Angular\n(Proxy Reverso /api/)"]
        BE["⚙️ Container 2: NestJS API\n(Porta 3000 interna)"]
        DB[("🐘 Container 3: PostgreSQL 16\n(Porta 5432 + Volume)")]
        FE --> BE --> DB
    end

    GIT --> CI -- "docker push" --> HUB -- "docker pull" --> CD -- "docker run" --> VM
```

---

## 🗺️ 2. Fluxograma Detalhado da Infraestrutura (Ponta a Ponta)

```mermaid
flowchart TB
    subgraph DEV ["💻 1. Desenvolvimento & Código-Fonte (Git)"]
        CODE_FE["📁 frontend/\nAngular 19 + Nginx\n(frontend/Dockerfile)"]
        CODE_BE["📁 backend/\nNestJS + Prisma ORM\n(backend/Dockerfile)"]
    end

    subgraph AZDO ["⚙️ 2. Azure DevOps (2 Pipelines Independentes)"]
        direction TB
        subgraph PIPE_FE ["Pipeline Frontend (frontend/azure-pipelines.yml)"]
            CI_FE["Stage 1 (CI):\n1. npm ci\n2. ng test (ChromeHeadless)\n3. docker build & push"]
            CD_FE_HML["Stage 2 (CD Homolog):\nEnvironment: homologacao\nSSH -> docker pull & run (:8080)"]
            CD_FE_PROD["Stage 3 (CD Produção):\nEnvironment: producao\nSSH -> docker pull & run (:80)"]
            CI_FE --> CD_FE_HML --> CD_FE_PROD
        end

        subgraph PIPE_BE ["Pipeline Backend (backend/azure-pipelines.yml)"]
            CI_BE["Stage 1 (CI):\n1. npm ci & prisma generate\n2. npm test (Vitest)\n3. docker build & push"]
            CD_BE_HML["Stage 2 (CD Homolog):\nEnvironment: homologacao\nSSH -> docker pull & run"]
            CD_BE_PROD["Stage 3 (CD Produção):\nEnvironment: producao\nSSH -> docker pull & run"]
            CI_BE --> CD_BE_HML --> CD_BE_PROD
        end
    end

    subgraph HUB ["🐳 3. Docker Hub (Repositório de Imagens Imutáveis)"]
        IMG_FE[("📦 joaogabriel199/lifeos-frontend\nTags: :BuildId, :latest")]
        IMG_BE[("📦 joaogabriel199/lifeos-backend\nTags: :BuildId, :latest")]
    end

    subgraph AZURE_VM ["☁️ 4. VM da Azure (Execução via Containers Independentes sem Docker Compose)"]
        direction TB
        subgraph HML_ENV ["🧪 Ambiente de Homologação (Rede: lifeos-homolog-net)"]
            H_FE["Container 1: lifeos-frontend-hml\nNginx + Angular (Porta 8080:80)"]
            H_BE["Container 2: lifeos-backend-hml\nNestJS (:3000 interno)"]
            H_DB[("Container 3: lifeos-postgres-hml\nPostgreSQL 16 (:5432 interno)\nVolume: postgres_hml_data")]
            H_FE -- "Proxy Reverso /api/" --> H_BE --> H_DB
        end

        subgraph PROD_ENV ["🚀 Ambiente de Produção (Rede: lifeos-prod-net)"]
            P_FE["Container 1: lifeos-frontend\nNginx + Angular (Porta 80:80)"]
            P_BE["Container 2: lifeos-backend\nNestJS (:3000 interno)"]
            P_DB[("Container 3: lifeos-postgres\nPostgreSQL 16 (:5432 interno)\nVolume: postgres_prod_data")]
            P_FE -- "Proxy Reverso /api/" --> P_BE --> P_DB
        end
    end

    CODE_FE --> CI_FE
    CODE_BE --> CI_BE
    CI_FE -- "docker push" --> IMG_FE
    CI_BE -- "docker push" --> IMG_BE
    IMG_FE -. "docker pull" .-> CD_FE_HML & CD_FE_PROD
    IMG_BE -. "docker pull" .-> CD_BE_HML & CD_BE_PROD
    CD_FE_HML & CD_BE_HML == "Task SSH@0" ==> HML_ENV
    CD_FE_PROD & CD_BE_PROD == "Task SSH@0" ==> PROD_ENV
```

---

## 🧱 2. Componentes da Arquitetura

### 2.1. Os 3 Containers Independentes
Em produção e homologação, **não usamos `docker-compose.yml`**. Cada camada roda em seu próprio container isolado, criado via `docker run` e conectado por uma rede bridge do Docker:
1. **Container 1 — Frontend + Proxy Reverso (`lifeos-frontend`):**
   * Baseado no [frontend/Dockerfile](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/Dockerfile) (Multi-stage: compila o Angular 19 no `node:24-slim` e copia os estáticos para o `nginx:alpine`).
   * Configurado pelo [frontend/nginx.conf](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/nginx.conf): serve a SPA em `/` (com Gzip, cache de assets e `try_files`) e faz **Proxy Reverso** de todas as chamadas `/api/` para `http://backend:3000/`.
2. **Container 2 — Backend API (`lifeos-backend`):**
   * Baseado no [backend/Dockerfile](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/Dockerfile) (Multi-stage: compila NestJS + Prisma Client no `node:24-slim` e executa em imagem enxuta apenas com dependências de produção `--omit=dev`).
   * O próprio NestJS possui servidor HTTP nativo (Express), dispensando Gunicorn. Ao subir, sincroniza o schema (`npx prisma db push`), executa o seed e inicia `node dist/main.js` na porta interna `3000`.
3. **Container 3 — Banco de Dados (`lifeos-postgres`):**
   * Imagem oficial `postgres:16-alpine` com volume persistente no disco da VM (`postgres_prod_data` / `postgres_hml_data`).
   * Fica inacessível diretamente pela internet, aceitando conexões apenas do container `backend` pela rede interna do Docker.

---

### 2.2. As Duas Pipelines no Azure DevOps
* **Pipeline Backend ([backend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/azure-pipelines.yml)):**
  * **Gatilho (`trigger`):** alterações dentro de `backend/**` nas branches `homolog`, `develop`, `main` ou `master`.
  * **Stage 1 (CI):** instala dependências, gera o Prisma Client, roda os testes unitários com **Vitest** (`npm test`) e publica a imagem `joaogabriel199/lifeos-backend` no **Docker Hub**.
  * **Stage 2 (CD Homologação):** conecta via SSH e atualiza o container `lifeos-backend-hml` no ambiente `homologacao`.
  * **Stage 3 (CD Produção):** exclusivo para `main`/`master`, conecta via SSH e atualiza o container `lifeos-backend` no ambiente `producao`.
* **Pipeline Frontend ([frontend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/azure-pipelines.yml)):**
  * **Gatilho (`trigger`):** alterações dentro de `frontend/**` nas branches `homolog`, `develop`, `main` ou `master`.
  * **Stage 1 (CI):** instala dependências, roda os testes unitários em **Chrome Headless** (`npx ng test --watch=false --browsers=ChromeHeadless`) e publica a imagem `joaogabriel199/lifeos-frontend` no **Docker Hub**.
  * **Stage 2 (CD Homologação):** atualiza via SSH o container `lifeos-frontend-hml` (porta `8080`).
  * **Stage 3 (CD Produção):** atualiza via SSH o container `lifeos-frontend` (porta `80`).

---

## 💻 3. Guia de Comandos Principais (Cheatsheet DevOps)

### 3.1. Testes Automatizados (Local e CI)
```bash
# Rodar as 4 suítes de testes unitários do Backend (Vitest)
cd backend && npm test

# Rodar as 3 suítes de testes unitários do Frontend em modo Headless (Karma + Jasmine)
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless
```

### 3.2. Build e Publicação Manual no Docker Hub
```bash
# Login no Docker Hub
docker login

# Build e Push da imagem do Backend
docker build -t joaogabriel199/lifeos-backend:latest ./backend
docker push joaogabriel199/lifeos-backend:latest

# Build e Push da imagem do Frontend (Nginx + Angular)
docker build -t joaogabriel199/lifeos-frontend:latest ./frontend
docker push joaogabriel199/lifeos-frontend:latest
```

### 3.3. Comandos Executados via SSH na VM da Azure (Sem Docker Compose)
```bash
# 1. Criar a rede isolada para os 3 containers conversarem pelo nome (DNS interno do Docker)
docker network create lifeos-prod-net

# 2. Subir o Container 3 (Banco de Dados PostgreSQL com Volume Persistente)
docker run -d \
  --name lifeos-postgres \
  --restart always \
  --network lifeos-prod-net \
  --network-alias postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=senha_segura \
  -e POSTGRES_DB=app_pessoal \
  -v postgres_prod_data:/var/lib/postgresql/data \
  postgres:16-alpine

# 3. Atualizar/Subir o Container 2 (Backend NestJS + Prisma)
docker pull joaogabriel199/lifeos-backend:latest
docker stop lifeos-backend || true && docker rm lifeos-backend || true
docker run -d \
  --name lifeos-backend \
  --restart always \
  --network lifeos-prod-net \
  --network-alias backend \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://postgres:senha_segura@postgres:5432/app_pessoal?schema=public" \
  -e JWT_SECRET="segredo_jwt_producao" \
  joaogabriel199/lifeos-backend:latest

# 4. Atualizar/Subir o Container 1 (Frontend Angular + Proxy Reverso Nginx na Porta 80)
docker pull joaogabriel199/lifeos-frontend:latest
docker stop lifeos-frontend || true && docker rm lifeos-frontend || true
docker run -d \
  --name lifeos-frontend \
  --restart always \
  --network lifeos-prod-net \
  -p 80:80 \
  joaogabriel199/lifeos-frontend:latest

# 5. Inspecionar containers ativos, logs e limpar imagens antigas
docker ps
docker logs -f lifeos-backend
docker image prune -f
```
