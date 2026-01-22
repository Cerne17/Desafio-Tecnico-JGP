# Desafio Técnico - JGP Crédito

Este repositório contém a minha solução para o desafio técnico de estágio em desenvolvimento Fullstack na JGP Crédito.

O projeto consiste em uma aplicação completa para gestão de ofertas do mercado primário, abrangendo desde a ingestão de dados (ETL) até a visualização em um dashboard interativo.

## Como Executar

O projeto foi totalmente containerizado para garantir consistência e facilidade de execução. Você não precisa instalar Python, Node ou bibliotecas locais.

### Pré-requisitos

- **Docker** e **Docker Compose** instalados.

### Passo a Passo

1. Clone o repositório:
   ```bash
   # Com HTTPS
   git clone https://github.com/Cerne17/Desafio-Tecnico-JGP.git

   # Ou com SSH
   git clone git@github.com:Cerne17/Desafio-Tecnico-JGP.git

   cd Desafio-Tecnico-JGP
   ```
2. Suba o ambiente com um único comando:
    ```bash
    # MacOS
    docker-compose up --build

    # WSL
    docker compose up --build
    ```
3. Acesse a aplicação:
    * **Frontend (Interface):** http://localhost:80
    * **Backend (API):** http://localhost:3000

## Arquitetura do Projeto

Adotei uma arquitetura orientada a serviços utilizando **Docker Compose** para orquestrar três containers distintos, garantindo separação de responsabilidades:

* **ETL (Service):** Um container Python efêmero que executa uma pipeline completa: leitura do Excel, validação de integridade via API da CVM e aplicação de correções automáticas.
* **Backend (API):** Um servidor Node.js/Express persistente que serve os dados via REST.
* **Frontend (Client):** Uma aplicação React servida por Nginx (via Multi-stage build) para alta performance.

**Estrutura de Diretórios**

```text
.
├── docker-compose.yml          # Orquestrador dos serviços
├── data/                       # Volume compartilhado (Persistência do SQLite)
├── backend/                    # API Node.js + Express (MVC)
│   ├── src/
│   │   ├── controllers/        # Regras de entrada/saída
│   │   ├── models/             # Queries SQL e lógica de dados
│   │   ├── routes/             # Definição de endpoints
│   │   └── lib/                # Configuração do banco
│   └── database/               # Schema SQL
├── frontend/                   # Interface Web (Vite + React + TS)
│   ├── src/
│   │   ├── components/         # UI (shadcn) e Widgets
│   │   ├── services/           # Integração com API
│   │   └── ...
└── etl/                        # Script de Ingestão de Dados
    ├── scripts/
    │   ├── run_pipeline.sh     # Orquestrador da pipeline (Import -> Validate -> Fix)
    │   ├── import_data.py      # Ingestão de dados bruta do Excel
    │   ├── validate_data.py    # Comparação com API oficial da CVM
    │   ├── fix_data.py         # Aplicação de correções de integridade
    │   └── scraper.py          # Módulo de comunicação com a API CVM
    └── input/                  # Arquivos brutos (.xlsx)
```

## Stack Tecnológica

### 1. ETL (Extract, Transform, Load)

Responsável por sanitizar e estruturar os dados brutos.

* **Python 3.12:** Linguagem base.
* **Pandas:** Manipulação e limpeza de dados.
* **Openpyxl:** Leitura de arquivos .xlsx.
* **Lógica:** Normalização de emissores e tipos para garantir integridade referencial.

### 2. Backend (API)

* **Node.js & Express:** API REST performática.
* **SQLite:** Banco de dados relacional leve (requisito do desafio).
* **Arquitetura MVC:** Separação clara entre Rotas, Controllers e Models.
* **SQLite3 Driver:** Interação direta com o banco para performance.

### 3. Frontend (UI/UX)

* **React & Vite:** SPA rápida e moderna.
* **TypeScript:** Tipagem estática para maior segurança e manutenibilidade.
* **Tailwind CSS:** Estilização utilitária.
* **shadcn/ui:** Componentes acessíveis e robustos (baseados em Radix UI).
* **TanStack Table:** Gerenciamento avançado de tabelas (ordenação, filtros, paginação).
* **Recharts:** Biblioteca de gráficos para o dashboard.
* **Zod & React Hook Form:** Validação robusta de formulários.
* **Sonner:** Notificações (toasts) elegantes para feedback do usuário.
* **Docker Multi-stage:** O container final usa Nginx para servir arquivos estáticos, simulando um ambiente de produção real.

## 🔐 Autenticação e Segurança

Para proteger a integridade dos dados financeiros, implementei uma camada de segurança nas operações de escrita:

*   **Tecnologia:** JSON Web Token (JWT).
*   **Funcionamento:** As rotas de leitura (`GET`) são públicas. Operações de modificação (`PUT`) exigem um token válido no header `Authorization`.
*   **Persistência:** O token é armazenado de forma segura no `localStorage` do navegador.
*   **Interface:** Se o usuário tentar editar sem estar autenticado, um modal de login é disparado automaticamente. O sistema também conta com botões explícitos de "Entrar" e "Sair" na barra superior.

> [!IMPORTANT]
> **Credenciais de Acesso (Modo Admin):**
> *   **Usuário:** `admin`
> *   **Senha:** `admin`

## 🚀 API Reference (Endpoints)

A API do backend segue os princípios REST e está documentada abaixo:

### 1. Autenticação
*   `POST /auth/login`: Autentica o usuário e retorna o token JWT.
    *   **Body:** `{ "username": "...", "password": "..." }`

### 2. Emissões (Mercado Primário)
*   `GET /emissoes`: Lista todas as ofertas cadastradas. Suporta filtragem via query params.
    *   **Query Params:** `emissor` (prefixo do nome).
*   `GET /emissoes/:id`: Busca detalhes de uma oferta específica.
*   `PUT /emissoes/:id` [PROTEGIDO]: Atualiza data, valor ou link de uma oferta.
    *   **Header:** `Authorization: Bearer <token>`
    *   **Body:** `{ "data": "YYYY-MM-DD", "valor": 1234.56, "link": "..." }`

### 3. Estatísticas e Dashboard
*   `GET /stats`: Agregados para construção do Dashboard.
    *   **Retorno:** KPIs gerais, top 10 emissores e distribuição por tipo de ativo.
*   `GET /stats/emissor/:nome`: Estatísticas detalhadas de um emissor específico.

## Integridade de Dados e Validação (CVM)

Um dos diferenciais deste projeto é a garantia de integridade dos dados financeiros. Como a base bruta (Excel) pode conter divergências, implementei um sistema de validação automática:

1. **Scraping Oficial:** O sistema consulta a API REST interna da CVM para cada oferta financeira.
2. **Resiliência:** O scraper utiliza múltiplos endpoints (`requerimento` e `informacoesGerais`) e possui salvaguardas para ignorar valores nulos/zeros da API que poderiam corromper dados válidos.
3. **Correção Automática:** Se o valor oficial da CVM divergir do Excel, o sistema prioriza a informação oficial e atualiza o banco de dados automaticamente durante a pipeline de subida do Docker.

> [!TIP]
> Essa etapa garante que o dashboard reflita valores 100% íntegros e auditados pelo órgão regulador.

## Modelagem do Banco de Dados

Para garantir a integridade dos dados e evitar redundâncias, normalizei a tabela original do Excel em três entidades relacionais.

```mermaid
erDiagram
    Emissor ||--|{ Primario : gera
    Tipo ||--o{ Primario : inclui
    Emissor {
        int id PK
        string nome "Unique"
    }
    Tipo {
        int id PK
        string codigo "Unique"
    }
    Primario {
        int id PK
        int id_tipo FK
        int id_emissor FK
        date data "ISO8601"
        bigint valor "Centavos"
        string link 
    }
```

**Decisões Técnicas Importantes**

1. **Valores Monetários (`bigint`):** Optei por armazenar os valores como inteiros (**centavos**) em vez de `float` ou `decimal`. Isso evita problemas clássicos de arredondamento de ponto flutuante em sistemas financeiros. O Frontend converte para visualização (`Intl.NumberFormat`), mas o banco mantém a precisão matemática.
2. **Normalização (Emissor/Tipo):** Ao separar `Emissor` e `Tipo` em tabelas próprias, evitamos redundância de texto e facilitamos estatísticas agrupadas. Se o nome de um emissor mudar, atualizamos apenas um registro.
3. **Dockerização do ETL:** O script de importação não é rodado manualmente. O Docker garante que o banco seja criado e populado automaticamente antes mesmo da API iniciar, garantindo um ambiente de teste sempre "pronto para uso".

## Funcionalidades do Frontend

A interface foi projetada para ser intuitiva e simular uma ferramenta real de gestão:

* **Dashboard Executivo:** Cards com KPIs (Total, Volume, Ticket Médio) e gráfico de barras dos maiores emissores.
* **Tabela Interativa:**
    * **Ordenação:** Clique nos cabeçalhos (Data, Valor) para ordenar.
    * **Busca Multinível:** Filtros dedicados por Nome do Emissor e Tipo de Ativo.
    * **Paginação Inteligente:** Navegação fluida com indicação de total de páginas.
    * **Link CVM Direto:** Coluna dedicada para acessar a oferta original na fonte com um clique.
* **Edição Controlada:**
    * Modal para edição de ofertas.
    * Validação de dados (ex: impede valores negativos ou datas inválidas) usando **Zod**.
    * Atualização em tempo real do dashboard após edição.

## Testes Automatizados

Implementei uma suite de testes unitários para garantir a confiabilidade das regras de negócio.

### Backend (Jest)
Para rodar os testes do backend:
```bash
cd backend
npm test
```
Os testes cobrem:
* **Models:** Queries SQL, promessas e tratamento de dados.
* **Controllers:** Endpoints da API, status codes (200, 404, 500) e integração com mocks de banco.

### ETL (Pytest)
Para rodar os testes do ETL, é necessário garantir que as dependências estejam instaladas localmente:

1. Navegue até a pasta: `cd etl`
2. (Opcional) Crie e ative um ambiente virtual:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate # Linux/Mac
   .venv\Scripts\activate # Windows
   ```
3. Instale as dependências necessárias (incluindo o pytest):
   ```bash
   pip install -r requirements.txt
   ```
4. Execute os testes:
   ```bash
   pytest scripts/test_import_data.py
   ```
Os testes cobrem:
* **Limpeza de dados:** Conversão de valores monetários para centavos e formatação de datas.

## Melhorias Futuras
1. **Persistência de Usuários:** Migrar a autenticação mockada para uma tabela de usuários com senhas hasheadas (bcrypt).
2. **Filtros Combinados via Servidor:** Implementar paginação e filtros diretamente no banco de dados para escalar para milhões de registros.
3. **Enriquecimento dos dados:** Integrar dados de setores econômicos (CVM) para visualização de exposição setorial no dashboard.
4. **Exportação de Relatórios:** Botão para download de visões filtradas em PDF ou Excel.
5. **CI/CD:** Pipeline de deployment automatizado em nuvem (Render/AWS).

---

*Desenvolvido por [Miguel Cerne](https://www.cerne.pro/)*
