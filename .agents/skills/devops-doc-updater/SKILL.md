---
name: devops-doc-updater
description: >-
  Mantém o arquivo ARQUITETURA_DEVOPS.md sempre atualizado automaticamente com
  o fluxograma Mermaid, explicação das pipelines CI/CD, configuração de containers,
  Docker Hub, Nginx e catálogo dos comandos principais a cada mudança na infraestrutura
  ou DevOps do projeto.
---

# Skill: Atualização Contínua da Documentação DevOps (`ARQUITETURA_DEVOPS.md`)

## Propósito
Sempre que qualquer arquivo ou decisão de DevOps/Infraestrutura do projeto **LifeOS (`APP_PESSOAL`)** for criado, alterado ou evoluído (incluindo `azure-pipelines.yml`, `Dockerfile`, `nginx.conf`, scripts de deploy SSH, variáveis de ambiente, testes no CI ou comandos Docker), você **deve obrigatoriamente** atualizar o documento central:
- [`ARQUITETURA_DEVOPS.md`](file:///c:/Users/Joao%20Gabriel/Desktop/APP_PESSOAL/APP_PESSOAL/ARQUITETURA_DEVOPS.md)

## O que deve ser mantido sincronizado em `ARQUITETURA_DEVOPS.md`
1. **Fluxograma Mermaid (`flowchart TB`):** refletindo exatamente os estágios de CI/CD, o repositório de imagens (Docker Hub), as branches/ambientes (Homologação e Produção) e os containers na VM.
2. **Explicação dos Componentes e Pipelines:** detalhamento de cada estágio, gatilhos e papel de cada container.
3. **Catálogo de Comandos Principais:** todos os comandos novos de Docker, SSH, testes ou Azure DevOps introduzidos durante o desenvolvimento.
