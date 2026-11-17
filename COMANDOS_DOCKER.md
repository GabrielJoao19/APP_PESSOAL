# 🐳 Catálogo de Comandos Docker & Redes Virtuais — LifeOS (`APP_PESSOAL`)

Este documento reúne e explica **todos os comandos Docker** usados nas pipelines ([backend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/azure-pipelines.yml) e [frontend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/azure-pipelines.yml)) e como os **3 containers se comunicam pela rede interna do Docker** dentro da VPS.

---

## 🌐 1. Como funciona a Rede Virtual do Docker na VPS?

Não existe uma rede separada para o Front, outra para o Back e outra para o Banco. Pelo contrário: **os 3 containers do mesmo ambiente ficam conectados na MESMA rede virtual interna** para conseguirem conversar entre si pelo nome (DNS interno do Docker).

A separação de redes acontece **entre os ambientes** (uma rede para **Produção** e outra rede para **Homologação**):

```mermaid
flowchart TB
    subgraph VPS ["☁️ VPS da Azure (Docker Engine)"]
        direction LR

        subgraph NET_PROD ["🟢 Rede Virtual 1: lifeos-prod-net (Produção)"]
            direction LR
            P_FE["📦 lifeos-frontend\n(Porta Externa 80 -> 80)"]
            P_BE["📦 lifeos-backend\n--network-alias backend\n(:3000 interno)"]
            P_DB[("📦 lifeos-postgres\n--network-alias postgres\n(:5432 interno)")]
            P_FE -- "http://backend:3000" --> P_BE -- "postgres:5432" --> P_DB
        end

        subgraph NET_HML ["🟡 Rede Virtual 2: lifeos-homolog-net (Homologação)"]
            direction LR
            H_FE["📦 lifeos-frontend-hml\n(Porta Externa 8080 -> 80)"]
            H_BE["📦 lifeos-backend-hml\n--network-alias backend\n(:3000 interno)"]
            H_DB[("📦 lifeos-postgres-hml\n--network-alias postgres\n(:5432 interno)")]
            H_FE -- "http://backend:3000" --> H_BE -- "postgres:5432" --> H_DB
        end
    end
```

### Por que usamos `--network` e `--network-alias`?
* **`--network lifeos-prod-net`**: coloca o Front, o Back e o Banco dentro do mesmo "cabo de rede virtual" isolado do resto da máquina.
* **`--network-alias backend`**: dá o apelido fixo `backend` ao container do NestJS dentro daquela rede. Assim, o [frontend/nginx.conf](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/nginx.conf#L17) pode sempre apontar para `http://backend:3000/`, tanto em Homologação quanto em Produção!
* **`--network-alias postgres`**: dá o apelido fixo `postgres` ao container do banco dentro daquela rede. Assim, a `DATABASE_URL` do NestJS sempre conecta em `@postgres:5432`.

---

## 🔗 2. Comandos da Pipeline que Fazem a Comunicação e o Deploy (CD via SSH)

### 2.1. Criação da Rede Virtual (Se ainda não existir)
Executado no início do deploy via SSH tanto na pipeline do Backend quanto na do Frontend:

```bash
# Verifica se a rede já existe; se não existir (||), cria a rede bridge isolada
docker network inspect lifeos-prod-net >/dev/null 2>&1 || docker network create lifeos-prod-net
```

| Parte do Comando | O que faz |
| :--- | :--- |
| `docker network inspect lifeos-prod-net` | Consulta se a rede `lifeos-prod-net` já está criada no Docker da VPS. |
| `|| docker network create lifeos-prod-net` | Só cria a rede se o comando anterior retornar que ela ainda não existe. |

---

### 2.2. Subida do Container 3: Banco de Dados (`lifeos-postgres`)
Executado na [backend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/azure-pipelines.yml#L145-L157) apenas se o container do banco ainda não estiver rodando:

```bash
docker run -d \
  --name lifeos-postgres \
  --restart always \
  --network lifeos-prod-net \
  --network-alias postgres \
  -e POSTGRES_USER=$(POSTGRES_USER_PROD) \
  -e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD_PROD) \
  -e POSTGRES_DB=app_pessoal \
  -v postgres_prod_data:/var/lib/postgresql/data \
  postgres:16-alpine
```

| Flag / Parâmetro | O que faz |
| :--- | :--- |
| `-d` | Roda o container em segundo plano (*detached mode*). |
| `--name lifeos-postgres` | Define o nome do container na VPS. |
| `--restart always` | Se a VPS reiniciar ou o processo cair, o Docker sobe o banco de novo sozinho. |
| `--network lifeos-prod-net` | Conecta o banco na rede interna de produção. |
| `--network-alias postgres` | Permite que o Backend encontre o banco pelo hostname `postgres`. |
| `-v postgres_prod_data:/var/lib/postgresql/data` | Salva os dados das tabelas num volume persistente no disco da VPS (fora do container). |
| *(Sem `-p 5432:5432`)* | Como não tem `-p`, o banco **não fica exposto na internet**, só aceita conexão da rede interna `lifeos-prod-net`. |

---

### 2.3. Atualização do Container 2: Backend NestJS (`lifeos-backend`)
Executado na [backend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/backend/azure-pipelines.yml#L160-L174):

```bash
# 1. Baixa a imagem recém-compilada do seu Docker Hub com a tag do Build
docker pull joaogabriel199/lifeos-backend:$(Build.BuildId)

# 2. Para e remove o container antigo do Backend (o "|| true" evita erro no 1º deploy)
docker stop lifeos-backend || true
docker rm lifeos-backend || true

# 3. Sobe o novo container do Backend na mesma rede do Banco e do Nginx
docker run -d \
  --name lifeos-backend \
  --restart always \
  --network lifeos-prod-net \
  --network-alias backend \
  -e PORT=3000 \
  -e DATABASE_URL="postgresql://$(POSTGRES_USER_PROD):$(POSTGRES_PASSWORD_PROD)@postgres:5432/app_pessoal?schema=public" \
  -e JWT_SECRET="$(JWT_SECRET_PROD)" \
  joaogabriel199/lifeos-backend:$(Build.BuildId)
```

| Flag / Parâmetro | O que faz |
| :--- | :--- |
| `--network lifeos-prod-net` | Coloca o Backend na mesma rede virtual onde estão o `postgres` e o `frontend`. |
| `--network-alias backend` | Faz o container responder pelo endereço `http://backend:3000` para o Nginx. |
| `@postgres:5432` na `DATABASE_URL` | Usa o DNS interno do Docker para achar o container `lifeos-postgres` sem precisar de IP fixo. |

---

### 2.4. Atualização do Container 1: Frontend + Proxy Reverso Nginx (`lifeos-frontend`)
Executado na [frontend/azure-pipelines.yml](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/frontend/azure-pipelines.yml#L139-L149):

```bash
# 1. Baixa a imagem nova do Frontend/Nginx do seu Docker Hub
docker pull joaogabriel199/lifeos-frontend:$(Build.BuildId)

# 2. Para e remove o container antigo do Frontend
docker stop lifeos-frontend || true
docker rm lifeos-frontend || true

# 3. Sobe o novo container abrindo a porta 80 da VPS para a internet
docker run -d \
  --name lifeos-frontend \
  --restart always \
  --network lifeos-prod-net \
  -p 80:80 \
  joaogabriel199/lifeos-frontend:$(Build.BuildId)
```

| Flag / Parâmetro | O que faz |
| :--- | :--- |
| `--network lifeos-prod-net` | Conecta o Nginx na mesma rede do Backend para que o `proxy_pass http://backend:3000/;` funcione. |
| `-p 80:80` | É o **único container** com `-p`: abre a porta `80` da VPS para o navegador do usuário acessar o site (em Homologação usa `-p 8080:80`). |

---

## 🧹 3. Comandos de Limpeza, Build e Diagnóstico

```bash
# Remove imagens antigas que ficaram sem uso na VPS após atualizar um container
docker image prune -f

# Lista todos os containers que estão rodando agora na VPS (nomes, portas e status)
docker ps

# Lista as redes virtuais do Docker e mostra quais containers estão conectados na rede
docker network ls
docker network inspect lifeos-prod-net

# Mostra os logs em tempo real do Backend ou do Nginx (ótimo para debug)
docker logs -f lifeos-backend
docker logs -f lifeos-frontend
```
