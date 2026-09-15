# Guia de Setup: Angular + NestJS + Prisma + Postgres

Este guia é o passo a passo completo (trabalho braçal) para inicializar a fundação do seu aplicativo. Como estamos usando tecnologias distintas para front e back, vamos criar uma arquitetura de pastas com dois projetos independentes (`frontend` e `backend`) dentro do seu repositório atual.

## 1. Pré-requisitos globais
Antes de começar, certifique-se de ter os CLIs globais instalados na sua máquina:

```bash
# Instalar o CLI do Angular
npm install -g @angular/cli

# Instalar o CLI do NestJS
npm install -g @nestjs/cli
```

## 2. Estrutura de Pastas
Abra o seu terminal na pasta raiz do seu projeto (`APP_PESSOAL`) e vamos criar os dois mundos.

---

## 3. Setup do Backend (NestJS + Prisma + Postgres)

### 3.1 Criar o projeto NestJS
```bash
# Cria a pasta 'backend' com um projeto NestJS padrão (escolha 'npm' quando perguntado)
nest new backend
```

### 3.2 Instalar o Prisma e configurar o Banco de Dados
```bash
cd backend

# Instala as ferramentas do Prisma
npm install prisma --save-dev
npm install @prisma/client

# Inicializa o Prisma (isso cria a pasta 'prisma' e o arquivo '.env')
npx prisma init
```

### 3.3 Configurar o PostgreSQL (`.env`)
Abra o arquivo `backend/.env` que acabou de ser gerado e configure a URL de conexão do seu banco PostgreSQL local:
```env
# Exemplo de URL (Troque 'usuario', 'senha' e 'nome_do_banco' pelos seus dados locais)
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/app_pessoal?schema=public"
```

> [!TIP]
> **Dica do Postgres Local:** Se você usa Docker, pode subir um banco rapidamente com:
> `docker run --name app-postgres -e POSTGRES_PASSWORD=suasenha -e POSTGRES_DB=app_pessoal -p 5432:5432 -d postgres`

### 3.4 Primeira Migration e Setup do Prisma Service
Agora vamos validar a conexão. Abra o arquivo `backend/prisma/schema.prisma` e adicione um modelo de teste só para validar:

```prisma
// backend/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelo inicial de teste
model UserSettings {
  id                String   @id @default(uuid())
  nome              String
  limiteGastoDiario Float    @default(50.0)
  createdAt         DateTime @default(now())
}
```

Rode o comando para sincronizar o banco e criar as tabelas:
```bash
npx prisma migrate dev --name init
```

Para usar o Prisma dentro do NestJS, gere o módulo e o serviço base:
```bash
# Cria o módulo do prisma
nest g module prisma

# Cria o serviço do prisma
nest g service prisma
```

No arquivo `backend/src/prisma/prisma.service.ts`, adicione a lógica de conexão:
```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```
*Lembre-se de exportar o `PrismaService` no `PrismaModule` para poder injetá-lo em outros lugares.*

### 3.5 Habilitar CORS no NestJS
Como o Angular vai rodar em outra porta, você precisa habilitar o CORS no arquivo `backend/src/main.ts`:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- Habilita a comunicação com o Frontend
  await app.listen(3000);
}
bootstrap();
```

---

## 4. Setup do Frontend (Angular)

Abra **outra aba do terminal** na raiz do projeto (`APP_PESSOAL`).

### 4.1 Criar o projeto Angular
```bash
# Cria a pasta 'frontend' com um projeto Angular (escolha SCSS como formato de estilo)
ng new frontend
```

### 4.2 Instalação de ícones (Lucide)
Como usamos os ícones do Lucide no nosso protótipo:
```bash
cd frontend
npm install lucide-angular
```

### 4.3 Configuração de chamadas HTTP (API Backend)
No Angular moderno (Standalone Components), configuramos o provedor HTTP no arquivo `frontend/src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // <--- Importe isto

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // <--- Habilite isto para fazer GET/POST pro NestJS
  ]
};
```

---

## 5. Fluxo de Trabalho (Como rodar tudo)

No dia a dia do desenvolvimento, você vai precisar de dois terminais abertos:

**Terminal 1 (Backend - Porta 3000):**
```bash
cd backend
npm run start:dev
```

**Terminal 2 (Frontend - Porta 4200):**
```bash
cd frontend
npm start
```

Pronto! A estrutura fundacional (O "esqueleto" e o sistema circulatório do seu App) está pronta. 
A partir daqui, é a arquitetura clássica: 
1. Criar o modelo no `schema.prisma`.
2. Criar os endpoints no `NestJS` (Controllers/Services).
3. Consumir e renderizar no `Angular`.

Quando quiser que eu gere os blocos de código específicos (ex: _"Gere o componente Angular com aquele HTML do Balanço Diário e o SCSS"_ ou _"Gere o `schema.prisma` completo de todas as nossas regras de negócio"_), é só falar!
