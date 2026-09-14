# Gestus — Sistema de Gestão Teatral

O Gestus é uma plataforma web desenvolvida para otimizar e centralizar a administração de teatros e espaços culturais. O sistema resolve o problema da fragmentação de processos na gestão teatral, oferecendo um ambiente único para gerenciar o mapeamento de assentos, criação de sessões, contratos de aluguel, regras de preço e o controle de ingressos através de um Ponto de Venda (PDV) integrado.

---

## 2. Sobre o Projeto

O objetivo principal do Gestus é fornecer uma ferramenta profissional para produtores e administradores de teatros. Na utilização diária, o sistema elimina planilhas manuais e sistemas genéricos de controle, atendendo necessidades como:

* Evitar *overbooking* ou venda duplicada de poltronas específicas.
* Controlar contratos de terceiros (aluguel de pauta) em um único dashboard.
* Criar layouts de assentos que refletem o ambiente físico real do teatro.
* Acompanhar a saúde financeira (ingressos vendidos, aluguéis ativos e receita prevista) em tempo real.

---

## 3. Funcionalidades

### Dashboard / Visão Geral
* **KPIs em tempo real:** Acompanhamento de ingressos vendidos, aluguéis ativos, sessões na semana e receita prevista.
* **Sessões em Destaque:** Visualização das peças programadas com data, horário e artista.
* **Aluguéis Recentes:** Acompanhamento do status de contratos ativos e cancelados.

### Venda de Ingressos (PDV)
* Seleção visual e interativa dos assentos disponíveis no momento da compra.
* Verificação rigorosa de concorrência no backend para evitar que duas pessoas comprem a mesma cadeira simultaneamente.

### Mapa de Assentos
* Configuração física do teatro por fileiras e colunas.
* Adição e exclusão dinâmica das seções para refletir a planta do espaço.
* Representação visual do palco para orientação no momento da configuração e venda.

### Regras de Preço
* Cadastro e gestão de regras que afetam dinamicamente os valores de bilheteria com base no tipo de público ou dias promocionais.

### Contratos de Aluguel
* Cadastro seguro de aluguel do teatro, informando dados da peça, artista, período de uso do espaço e o valor de ingresso base acordado.
* **Evento Assíncrono:** Ao criar um contrato, o sistema dispara um evento interno (`ContratoCriadoEvent`) que gerencia o envio de comunicação (e-mails) com layout padronizado, completamente desacoplado da transação de persistência.

### Sessões
* Configuração do cronograma de peças e alocação de horários.
* Validação automática de conflitos de data e encerramento, impedindo cadastro de datas incoerentes.

### Autenticação e Segurança
* Acesso restrito por login.
* Isolamento lógico por Teatro (`Tenant`). Todas as requisições vinculam a carga de dados diretamente ao `idTeatro` do administrador logado, extraído de maneira segura via Token e `@AuthenticationPrincipal` no backend.

---

## 4. Tecnologias Utilizadas

### Backend

| Tecnologia | Finalidade |
| :--- | :--- |
| **Java 21** | Linguagem principal do servidor |
| **Spring Boot 3.2.4** | Framework backend e orquestração de dependências |
| **Spring Security** | Validação, interceptação e regras de autenticação |
| **JJWT (0.13.0)** | Geração e validação de tokens JWT |
| **JPA (JPA Puro)** | Especificação de persistência e Entity Manager |
| **PostgreSQL** | Banco de Dados Relacional principal |
| **Maven** | Gerenciamento de dependências e build do projeto |
| **Lombok** | Redução de *boilerplate* (Getters, Setters, Builders) |

### Frontend

| Tecnologia | Finalidade |
| :--- | :--- |
| **React 19.2** | Biblioteca base para construção da interface de usuário |
| **Next.js 16.3** | Framework frontend utilizando *App Router* |
| **TypeScript** | Tipagem forte para prevenção de erros em tempo de compilação |
| **Tailwind CSS 3.4** | Estilização utilitária de componentes e responsividade |
| **Axios 1.19** | Cliente HTTP para consumo da API REST |
| **Lucide React** | Biblioteca de ícones vetoriais modernos |

---

## 5. Arquitetura do Sistema

O Gestus segue uma arquitetura Cliente-Servidor clássica com isolamento estrito de domínios (Domain-Driven Design simplificado):

**Frontend (Next.js) → Requisições HTTP (Axios) → API REST (Spring Boot) → Services → DAOs (JPA Puro) → PostgreSQL**

### Camadas do Backend
* **Controllers:** Portas de entrada da API, responsáveis pela validação semântica (`@Valid`) dos requests e devolução de `ResponseEntity`.
* **Services:** Concentram as regras de negócio puras, como cálculos, verificações de concorrência e publicação de eventos (`ApplicationEventPublisher`).
* **DAOs (Data Access Objects):** O projeto optou pelo uso de **JPA Puro** com `EntityManager` explícito, em vez do *Spring Data JPA* (não há `JpaRepository`). As DAOs executam JPQL e *Constructor Expressions* (`SELECT new com.dto...`) para evitar problemas de N+1 e _Overfetching_.
* **Security:** Os endpoints validam a autenticação via `JwtAuthenticationFilter`, que repassa os claims para o SecurityContext através do `UserDto`.
* **Events:** Adoção do padrão Observer. Serviços emitem sinais de negócio que são escutados passivamente por Listeners (`ContratoEventListener`), garantindo o SRP (Princípio de Responsabilidade Única).

---

## 6. Estrutura do Projeto

```text
Gestus/
├── backend/
│   ├── src/main/java/com/
│   │   ├── config/        # Configurações do Spring, CORS e Filtros JWT
│   │   ├── controller/    # Endpoints REST (Aluguel, Dashboard, Assentos)
│   │   ├── database/      # Classes de persistência (DAOs) e Entidades
│   │   ├── dto/           # Records e classes de transferência de dados (Projections)
│   │   ├── events/        # Eventos de domínio assíncronos e Listeners (ex: E-mails)
│   │   ├── exception/     # Tratamento global de falhas e exceções de negócio
│   │   └── services/      # Lógica central (ContratoService, DashboardService, etc)
│   └── pom.xml            # Dependências Maven
│
└── frontend/
    └── front/
        ├── src/
        │   ├── app/       # App Router (Páginas principais: menu, contrato, login)
        │   ├── components/# Componentes reutilizáveis (UI, Header, Modal, Dashboard)
        │   ├── constants/ # Objetos estáticos, como configurações base de assentos
        │   ├── hooks/     # Custom Hooks (useMenu, useContrato) encapsulando lógica
        │   ├── services/  # Configuração do Axios e chamadas à API
        │   └── types/     # Interfaces globais do TypeScript
        ├── tailwind.config.js
        └── package.json
```

---

## 7. Pré-requisitos

Para rodar este projeto na sua máquina, certifique-se de possuir:

* **Java 21** (JDK 21) instalado.
* **Maven** instalado e na variável de ambiente.
* **Node.js** (Versão 20+ recomendada).
* **NPM** (Vem incluso com o Node.js).
* **PostgreSQL** instalado e rodando (ou Docker para utilizar o `compose.yaml`).
* **Git** para versionamento.

---

## 8. Instalação e Configuração

### 8.1 Clone do projeto

```bash
git clone <URL_DO_REPOSITORIO>
cd Gestus
```

### 8.2 Configuração do Backend
Navegue até a pasta do backend:
```bash
cd backend
```
A configuração primária fica em `src/main/resources/application.yml`. As propriedades sensíveis devem ser injetadas por variáveis de ambiente ou através de um arquivo `.env` na raiz do backend (conforme `config.import: "optional:file:.env"`):

**Exemplo de `.env` (backend):**
```env
POSTGRES_URL=jdbc:postgresql://localhost:5432/gestus
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha
JWT_KEY=UmaChaveSecretaMuitoForteParaOJWTDePeloMenos256Bits
JWT_EXPIRATION=86400000
EMAIL_USERNAME=seu-email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
```

---

## 9. Executando o Backend

Dentro da pasta `backend`, rode o Maven (você pode utilizar a sua IDE de preferência como IntelliJ ou o terminal):

```bash
mvn spring-boot:run
```

* **Porta Padrão:** `8080`
* **URL Base da API:** `http://localhost:8080/v1`
* Ao iniciar, o banco de dados e as tabelas devem ser geradas automaticamente (devido à propriedade `ddl-auto: update` no `application.yml`).

---

## 10. Configuração do Frontend

Abra um novo terminal e navegue para a pasta do front:
```bash
cd frontend/front
```

Verifique no arquivo `src/services/api.ts` se a URL base bate com a execução do backend. A configuração padrão do Axios já aponta para:
```typescript
baseURL: 'http://localhost:8080',
withCredentials: true // Crucial para o recebimento do HttpOnly Cookie
```

---

## 11. Executando o Frontend

Instale as dependências com NPM e execute o servidor de desenvolvimento do Next.js:

```bash
npm install
npm run dev
```

* **Acesso Web:** A interface gráfica estará acessível no navegador através de `http://localhost:3000`.

---

## 12. Configuração do Banco de Dados

* **Banco Utilizado:** PostgreSQL.
* **Criação:** Basta criar um schema/database vazio com o nome definido na variável `POSTGRES_URL` (ex: `CREATE DATABASE gestus;` no PGAdmin).
* **Tabelas:** A estratégia adotada em ambiente de desenvolvimento é `hibernate.ddl-auto: update`, onde o próprio Hibernate avalia as entidades (`@Entity`) presentes no projeto e traduz para as tabelas necessárias automaticamente.

---

## 13. Autenticação e Segurança

A aplicação adota um nível alto de segurança utilizando **HttpOnly Cookies**. O ciclo de autenticação funciona da seguinte maneira:

1. O usuário realiza o Login fornecendo credenciais.
2. O Backend gera um **JWT** e empacota este token em um Cookie com os atributos `HttpOnly=true` e `SameSite=Strict`. O cookie se chama `jwt_gestus`.
3. O Backend retorna uma cópia dos dados não sensíveis do usuário via Body (para preencher o Header do frontend).
4. Todas as requisições REST subsequentes enviam automaticamente esse Cookie protegido.
5. O `JwtAuthenticationFilter` intercepta o pacote HTTP, extrai o Token do Cookie e autentica o perfil do administrador perante os Endpoints.

**Isolamento:** Toda entidade de modelo está rigidamente conectada ao Teatro (`idTeatro`). Os DAOs filtram as buscas atrelando-as ao contexto do usuário logado, erradicando qualquer vulnerabilidade de BOLA/IDOR (Insecure Direct Object Reference). O frontend *nunca* precisa passar o `id` do teatro no corpo da requisição de forma vulnerável.

---

## 14. Como Usar o Sistema (Quick Start)

1. Acesse `http://localhost:3000/login` e clique na opção para registrar uma nova conta/teatro.
2. Após o cadastro, você cairá no Dashboard (Visão Geral), inicialmente sem dados numéricos.
3. Acesse a aba **Mapeamento** pelo Sidebar e configure as fileiras e assentos da sua estrutura física, criando o mapa do seu teatro.
4. Acesse a aba **Contratos** e grave o aluguel para a produtora da primeira peça em exibição.
5. Vá em **PDV** (Venda). Você verá a sessão gerada e os assentos mapeados dinamicamente para essa sessão. Efetue uma venda preenchendo as poltronas.
6. Volte à **Visão Geral** para ver a geração instantânea das novas Receitas Previstas e KPIs!

---

## 15. API (Endpoints Principais)

### Autenticação (`/v1/auth`)
* `POST /register`: Recebe Payload de registro e inicializa a conta.
* `POST /login`: Valida as credenciais e injeta o `jwt_gestus` nos Cookies.
* `POST /logout`: Invalida o token matando o tempo de vida do Cookie (`maxAge=0`).

### Dashboard (`/v1/dashboard`)
* `GET /`: Endpoint de performance. Com apenas 1 Request ele orquestra múltiplos DAOs retornando KPIs agregados, Aluguéis Recentes e Sessões Destaque usando `Constructor Expressions` do JPA.

### Mapeamento e Assentos (`/v1/assento`)
* `GET /colunas`: Carrega todo o esqueleto do palco, incluindo a disposição de disponibilidade.
* `POST /colunas`: Salva a infraestrutura das cadeiras baseadas num eixo X e Y.

### Contrato (`/v1/aluguel`)
* `POST /`: Registra o contrato base, calculando as datas e emitindo um evento assíncrono para notificação por e-mail (Tokenização da assinatura).
* `GET /`: Busca todos os aluguéis relativos ao teatro vigente.

---

## 16. Troubleshooting

* **Erro 403 / 401 em todas as abas do Frontend:** Isso ocorre quando o Cookie `jwt_gestus` não está sendo trafegado. Em ambientes de desenvolvimento, garantir que o CORS permita `Credentials` no Spring Boot, e que `localhost` esteja mapeado corretamente, já que os Cookies `SameSite=Strict` podem ser sensíveis à forma como o localhost:3000 dialoga com localhost:8080.
* **Campos "Any" causando lentidão:** Garantir que dependências Node estejam devidamente instaladas (`npm i`). A tipagem TypeScript foi rigidamente mapeada para prevenir falhas de serialização no lado do Front.
* **B.O na criação das tabelas (PostgreSQL):** Caso haja falha ao subir o Spring Boot, confirme que o usuário `postgres` tem permissão de DDL (Data Definition Language) no banco escolhido, para que o comando `update` do Hibernate possa criar as colunas.

---

## 17. Desenvolvimento

Para novos desenvolvedores entrando no Gestus:
* **Novos Endpoints:** Crie em `com.controller`. Nunca coloque lógica de banco ou validação complexa no Controller.
* **Nova Regra de Negócio:** Coloque no pacote `com.services`. Injete apenas DAOs, nunca repositórios externos e não vaze entidades puras diretamente se puder evitar (utilize Records DTO em `com.dto`).
* **Queries no JPA:** Não crie interfaces do Spring Data. Abra a classe respectiva no pacote `com.database.dao` e orquestre o `EntityManager` de forma tradicional, visando otimização com Construtores DTO no `SELECT`.
* **Componentização Front:** Páginas vão para `app/`. UI isolada vai para `components/`. Funções complexas de Reactivity e chamadas repetitivas de API vão em *Custom Hooks* (`hooks/use*`).

---

## 18. Boas Práticas Adotadas no Código

* **DTOs Imutáveis:** Utilização do recurso Record (Java 16+) para payloads seguros de resposta e request sem sobrecarga de memória.
* **Princípio da Responsabilidade Única (UI):** Páginas extensas de React sofrem refatoração e *split* para arquivos secundários (ex: `<DashboardKpis />` separado do `page.tsx`).
* **Type-Safety Total:** As transações HTTP trafegam através de requisições rigorosamente tipadas por interfaces do TS (ex: `ContratoAluguelRequest`). Eliminação de `any` para evitar _Bad Requests_ silenciosos.

---

## 19. Status do Projeto

### Implementado
* Isolamento lógico de Teatro (Multi-Tenant manual).
* Mapeamento interativo de Assentos e Fileiras.
* Gerenciamento de Aluguéis (Contratos) disparando eventos assíncronos desacoplados.
* Motor de reserva contra concorrência (Venda via PDV).
* Painel sintético de métricas empresariais.

### Planejado / Futuro
* Emissão de Notas.
* Exportação de Relatórios Gerenciais PDF (Fechamento e Liquidação Diária).
* Pagamento Integrado.

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2442.7240000000006 723" width="2442.7240000000006" height="723" style="--bg:#1F1F1F;--fg:#CCCCCC;--line:#CCCCCC;--accent:#0078D4;--muted:#CCCCCCCC;--surface:#181818;--border:#CCCCCC;background:var(--bg)">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;display=swap');
  text { font-family: 'Inter', system-ui, sans-serif; }
  .mono { font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', ui-monospace, monospace; }
  svg {
    /* Derived from --bg and --fg (overridable via --line, --accent, etc.) */
    --_text:          var(--fg);
    --_text-sec:      var(--muted, color-mix(in srgb, var(--fg) 60%, var(--bg)));
    --_text-muted:    var(--muted, color-mix(in srgb, var(--fg) 40%, var(--bg)));
    --_text-faint:    color-mix(in srgb, var(--fg) 25%, var(--bg));
    --_line:          var(--line, color-mix(in srgb, var(--fg) 50%, var(--bg)));
    --_arrow:         var(--accent, color-mix(in srgb, var(--fg) 85%, var(--bg)));
    --_node-fill:     var(--surface, color-mix(in srgb, var(--fg) 3%, var(--bg)));
    --_node-stroke:   var(--border, color-mix(in srgb, var(--fg) 20%, var(--bg)));
    --_group-fill:    var(--bg);
    --_group-hdr:     color-mix(in srgb, var(--fg) 5%, var(--bg));
    --_inner-stroke:  color-mix(in srgb, var(--fg) 12%, var(--bg));
    --_key-badge:     color-mix(in srgb, var(--fg) 10%, var(--bg));
  }
</style>
<defs>
</defs>
<polyline class="er-relationship" data-entity1="ADMINISTRADOR" data-entity2="TEATRO" data-cardinality1="one" data-cardinality2="zero-one" data-identifying="true" data-label="gerencia (1:1)" points="180,293 427.26800000000003,293" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="TEATRO" data-entity2="COLUNA" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="possui (1:N)" points="574.068,268 584.068,268 584.068,101 832.028,101" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="COLUNA" data-entity2="ASSENTO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="contem (1:N)" points="1038.228,101 1280.7440000000001,101" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="TEATRO" data-entity2="REGRA_PRECO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="possui (1:N)" points="574.068,293 832.028,293" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="TEATRO" data-entity2="CONTRATO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="sedia (1:N)" points="574.068,318 584.068,318 584.068,428.7 762.028,428.7 762.028,539 838.628,539" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="ARTISTA" data-entity2="CONTRATO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="assina (1:N)" points="574.068,633 838.628,633" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="PECA" data-entity2="CONTRATO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="apresenta (1:N)" points="574.068,463 752.028,463 752.028,586 838.628,586" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="CONTRATO" data-entity2="SESSAO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="inclui (1:N)" points="1018.428,586 1280.7440000000001,586" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="SESSAO" data-entity2="ASSENTO_SESSAO" data-cardinality1="one" data-cardinality2="zero-many" data-identifying="true" data-label="disponibiliza (1:N)" points="1500.1440000000002,586 1768.7960000000003,586" fill="none" stroke="var(--_line)" stroke-width="1" />
<polyline class="er-relationship" data-entity1="ASSENTO_SESSAO" data-entity2="INGRESSO_VENDIDO" data-cardinality1="one" data-cardinality2="zero-one" data-identifying="true" data-label="garante (1:1)" points="1981.5960000000002,586 2222.9240000000004,586" fill="none" stroke="var(--_line)" stroke-width="1" />
<g class="entity" data-id="ADMINISTRADOR" data-label="ADMINISTRADOR">
  <rect x="40" y="232" width="140" height="122" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="40" y="232" width="140" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="110" y="249" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">ADMINISTRADOR</text>
  <line x1="40" y1="266" x2="180" y2="266" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="46" y="270" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="57.155" y="277" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="76.31" y="277" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="172" y="277" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <g><title>Unique</title>
  <text x="48" y="299" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="172" y="299" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">email</tspan></text>
  </g>
  <text x="48" y="321" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="172" y="321" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nome</tspan></text>
  <text x="48" y="343" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="172" y="343" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">senha</tspan></text>
</g>
<g class="entity" data-id="TEATRO" data-label="TEATRO">
  <rect x="427.26800000000003" y="243" width="146.8" height="100" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="427.26800000000003" y="243" width="146.8" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="500.668" y="260" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">TEATRO</text>
  <line x1="427.26800000000003" y1="277" x2="574.068" y2="277" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="433.26800000000003" y="281" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="444.423" y="288" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="463.57800000000003" y="288" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="566.068" y="288" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="435.26800000000003" y="310" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="566.068" y="310" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nome</tspan></text>
  <g><title>Owner do Relacionamento</title>
  <rect x="433.26800000000003" y="325" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="444.423" y="332" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="463.57800000000003" y="332" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="566.068" y="332" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">admin_id</tspan></text>
  </g>
</g>
<g class="entity" data-id="COLUNA" data-label="COLUNA">
  <rect x="832.028" y="40" width="206.2" height="122" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="832.028" y="40" width="206.2" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="935.128" y="57" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">COLUNA</text>
  <line x1="832.028" y1="74" x2="1038.228" y2="74" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="838.028" y="78" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="849.183" y="85" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="868.338" y="85" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1030.228" y="85" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="840.028" y="107" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="1030.228" y="107" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">identificadorColuna</tspan></text>
  <text x="840.028" y="129" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Integer</tspan></text>
  <text x="1030.228" y="129" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">qntdAssento</tspan></text>
  <rect x="838.028" y="144" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="849.183" y="151" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="868.338" y="151" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1030.228" y="151" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id_teatro</tspan></text>
</g>
<g class="entity" data-id="ASSENTO" data-label="ASSENTO">
  <rect x="1280.7440000000001" y="40" width="166.6" height="122" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="1280.7440000000001" y="40" width="166.6" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="1364.044" y="57" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">ASSENTO</text>
  <line x1="1280.7440000000001" y1="74" x2="1447.344" y2="74" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="1286.7440000000001" y="78" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1297.8990000000001" y="85" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="1317.054" y="85" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1439.344" y="85" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="1288.7440000000001" y="107" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Integer</tspan></text>
  <text x="1439.344" y="107" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nAssento</tspan></text>
  <text x="1288.7440000000001" y="129" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="1439.344" y="129" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">codigoPosicao</tspan></text>
  <rect x="1286.7440000000001" y="144" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1297.8990000000001" y="151" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="1317.054" y="151" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1439.344" y="151" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id_coluna</tspan></text>
</g>
<g class="entity" data-id="REGRA_PRECO" data-label="REGRA_PRECO">
  <rect x="832.028" y="232" width="153.39999999999998" height="122" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="832.028" y="232" width="153.39999999999998" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="908.7280000000001" y="249" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">REGRA_PRECO</text>
  <line x1="832.028" y1="266" x2="985.428" y2="266" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="838.028" y="270" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="849.183" y="277" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="868.338" y="277" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="977.428" y="277" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="840.028" y="299" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="977.428" y="299" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">descricao</tspan></text>
  <text x="840.028" y="321" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">BigDecimal</tspan></text>
  <text x="977.428" y="321" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">valor</tspan></text>
  <rect x="838.028" y="336" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="849.183" y="343" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="868.338" y="343" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="977.428" y="343" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">teatro_id</tspan></text>
</g>
<g class="entity" data-id="CONTRATO" data-label="CONTRATO">
  <rect x="838.628" y="492" width="179.79999999999998" height="188" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="838.628" y="492" width="179.79999999999998" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="928.528" y="509" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">CONTRATO</text>
  <line x1="838.628" y1="526" x2="1018.428" y2="526" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="844.628" y="530" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="855.783" y="537" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="874.938" y="537" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1010.428" y="537" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="846.628" y="559" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">BigDecimal</tspan></text>
  <text x="1010.428" y="559" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">valorTotal</tspan></text>
  <text x="846.628" y="581" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">StatusContrato</tspan></text>
  <text x="1010.428" y="581" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">status</tspan></text>
  <text x="846.628" y="603" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="1010.428" y="603" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">tokenAssinatura</tspan></text>
  <rect x="844.628" y="618" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="855.783" y="625" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="874.938" y="625" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1010.428" y="625" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">teatro_id</tspan></text>
  <rect x="844.628" y="640" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="855.783" y="647" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="874.938" y="647" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1010.428" y="647" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">peca_id</tspan></text>
  <rect x="844.628" y="662" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="855.783" y="669" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="874.938" y="669" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1010.428" y="669" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">artista_id</tspan></text>
</g>
<g class="entity" data-id="ARTISTA" data-label="ARTISTA">
  <rect x="434.06800000000004" y="583" width="140" height="100" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="434.06800000000004" y="583" width="140" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="504.06800000000004" y="600" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">ARTISTA</text>
  <line x1="434.06800000000004" y1="617" x2="574.068" y2="617" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="440.06800000000004" y="621" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="451.223" y="628" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="470.37800000000004" y="628" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="566.068" y="628" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="442.06800000000004" y="650" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="566.068" y="650" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nome</tspan></text>
  <g><title>Unique</title>
  <text x="442.06800000000004" y="672" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="566.068" y="672" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">email</tspan></text>
  </g>
</g>
<g class="entity" data-id="PECA" data-label="PECA">
  <rect x="433.86800000000005" y="413" width="140.2" height="100" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="433.86800000000005" y="413" width="140.2" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="503.9680000000001" y="430" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">PECA</text>
  <line x1="433.86800000000005" y1="447" x2="574.068" y2="447" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="439.86800000000005" y="451" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="451.023" y="458" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="470.17800000000005" y="458" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="566.068" y="458" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <g><title>Unique</title>
  <text x="441.86800000000005" y="480" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="566.068" y="480" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nome</tspan></text>
  </g>
  <text x="441.86800000000005" y="502" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="566.068" y="502" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">descricao</tspan></text>
</g>
<g class="entity" data-id="SESSAO" data-label="SESSAO">
  <rect x="1280.7440000000001" y="503" width="219.4" height="166" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="1280.7440000000001" y="503" width="219.4" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="1390.4440000000002" y="520" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">SESSAO</text>
  <line x1="1280.7440000000001" y1="537" x2="1500.1440000000002" y2="537" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="1286.7440000000001" y="541" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1297.8990000000001" y="548" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="1317.054" y="548" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1492.1440000000002" y="548" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="1288.7440000000001" y="570" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">LocalDate</tspan></text>
  <text x="1492.1440000000002" y="570" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">dataExibicao</tspan></text>
  <text x="1288.7440000000001" y="592" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">LocalTime</tspan></text>
  <text x="1492.1440000000002" y="592" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">horarioInicioPeca</tspan></text>
  <text x="1288.7440000000001" y="614" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">BigDecimal</tspan></text>
  <text x="1492.1440000000002" y="614" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">valorIngresso</tspan></text>
  <text x="1288.7440000000001" y="636" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">StatusSessao</tspan></text>
  <text x="1492.1440000000002" y="636" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">statusSessao</tspan></text>
  <rect x="1286.7440000000001" y="651" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1297.8990000000001" y="658" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="1317.054" y="658" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1492.1440000000002" y="658" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">proposta_aluguel_id</tspan></text>
</g>
<g class="entity" data-id="ASSENTO_SESSAO" data-label="ASSENTO_SESSAO">
  <rect x="1768.7960000000003" y="503" width="212.79999999999998" height="166" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="1768.7960000000003" y="503" width="212.79999999999998" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="1875.1960000000004" y="520" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">ASSENTO_SESSAO</text>
  <line x1="1768.7960000000003" y1="537" x2="1981.5960000000002" y2="537" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="1774.7960000000003" y="541" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1785.9510000000002" y="548" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="1805.1060000000002" y="548" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1973.5960000000002" y="548" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="1776.7960000000003" y="570" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Integer</tspan></text>
  <text x="1973.5960000000002" y="570" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nAssento</tspan></text>
  <text x="1776.7960000000003" y="592" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="1973.5960000000002" y="592" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">codigoPosicao</tspan></text>
  <text x="1776.7960000000003" y="614" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">StatusAssento</tspan></text>
  <text x="1973.5960000000002" y="614" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">estadoAssento</tspan></text>
  <g><title>Controle Concorrência</title>
  <text x="1776.7960000000003" y="636" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1973.5960000000002" y="636" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">version</tspan></text>
  </g>
  <rect x="1774.7960000000003" y="651" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="1785.9510000000002" y="658" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="1805.1060000000002" y="658" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="1973.5960000000002" y="658" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id_sessao</tspan></text>
</g>
<g class="entity" data-id="INGRESSO_VENDIDO" data-label="INGRESSO_VENDIDO">
  <rect x="2222.9240000000004" y="514" width="179.79999999999998" height="144" rx="0" ry="0" fill="var(--_node-fill)" stroke="var(--_node-stroke)" stroke-width="1" />
  <rect x="2222.9240000000004" y="514" width="179.79999999999998" height="34" rx="0" ry="0" fill="var(--_group-hdr)" stroke="var(--_node-stroke)" stroke-width="1" />
  <text x="2312.8240000000005" y="531" text-anchor="middle" font-size="13" font-weight="700" fill="var(--_text)" dy="4.55">INGRESSO_VENDIDO</text>
  <line x1="2222.9240000000004" y1="548" x2="2402.7240000000006" y2="548" stroke="var(--_node-stroke)" stroke-width="0.75" />
  <rect x="2228.9240000000004" y="552" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="2240.0790000000006" y="559" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">PK</text>
  <text x="2259.2340000000004" y="559" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="2394.7240000000006" y="559" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id</tspan></text>
  <text x="2230.9240000000004" y="581" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">BigDecimal</tspan></text>
  <text x="2394.7240000000006" y="581" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">valor</tspan></text>
  <text x="2230.9240000000004" y="603" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="2394.7240000000006" y="603" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">email_comprador</tspan></text>
  <text x="2230.9240000000004" y="625" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">String</tspan></text>
  <text x="2394.7240000000006" y="625" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">nome_cliente</tspan></text>
  <g><title>Unique Constraint</title>
  <rect x="2228.9240000000004" y="640" width="22.31" height="14" rx="2" ry="2" fill="var(--_key-badge)" />
  <text x="2240.0790000000006" y="647" text-anchor="middle" dy="0.35em" font-size="9" font-weight="600" fill="var(--_text-sec)">FK</text>
  <text x="2259.2340000000004" y="647" class="mono" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-muted)">Long</tspan></text>
  <text x="2394.7240000000006" y="647" class="mono" text-anchor="end" dy="0.35em" font-size="11" font-weight="400"><tspan fill="var(--_text-sec)">id_assento</tspan></text>
  </g>
</g>
<line x1="184" y1="287" x2="184" y2="299" stroke="var(--_line)" stroke-width="1.25" />
<line x1="188" y1="287" x2="188" y2="299" stroke="var(--_line)" stroke-width="1.25" />
<line x1="423.26800000000003" y1="299" x2="423.26800000000003" y2="287" stroke="var(--_line)" stroke-width="1.25" />
<line x1="419.26800000000003" y1="299" x2="419.26800000000003" y2="287" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="415.26800000000003" cy="293" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="578.068" y1="262" x2="578.068" y2="274" stroke="var(--_line)" stroke-width="1.25" />
<line x1="582.068" y1="262" x2="582.068" y2="274" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="108" x2="816.028" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="101" x2="816.028" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="94" x2="816.028" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="812.028" cy="101" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1042.228" y1="95" x2="1042.228" y2="107" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1046.228" y1="95" x2="1046.228" y2="107" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="108" x2="1264.7440000000001" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="101" x2="1264.7440000000001" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="94" x2="1264.7440000000001" y2="101" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="1260.7440000000001" cy="101" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="578.068" y1="287" x2="578.068" y2="299" stroke="var(--_line)" stroke-width="1.25" />
<line x1="582.068" y1="287" x2="582.068" y2="299" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="300" x2="816.028" y2="293" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="293" x2="816.028" y2="293" stroke="var(--_line)" stroke-width="1.25" />
<line x1="828.028" y1="286" x2="816.028" y2="293" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="812.028" cy="293" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="578.068" y1="312" x2="578.068" y2="324" stroke="var(--_line)" stroke-width="1.25" />
<line x1="582.068" y1="312" x2="582.068" y2="324" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="546" x2="822.628" y2="539" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="539" x2="822.628" y2="539" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="532" x2="822.628" y2="539" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="818.628" cy="539" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="578.068" y1="627" x2="578.068" y2="639" stroke="var(--_line)" stroke-width="1.25" />
<line x1="582.068" y1="627" x2="582.068" y2="639" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="640" x2="822.628" y2="633" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="633" x2="822.628" y2="633" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="626" x2="822.628" y2="633" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="818.628" cy="633" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="578.068" y1="457" x2="578.068" y2="469" stroke="var(--_line)" stroke-width="1.25" />
<line x1="582.068" y1="457" x2="582.068" y2="469" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="593" x2="822.628" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="586" x2="822.628" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="834.628" y1="579" x2="822.628" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="818.628" cy="586" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1022.428" y1="580" x2="1022.428" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1026.4279999999999" y1="580" x2="1026.4279999999999" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="593" x2="1264.7440000000001" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="586" x2="1264.7440000000001" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1276.7440000000001" y1="579" x2="1264.7440000000001" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="1260.7440000000001" cy="586" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1504.1440000000002" y1="580" x2="1504.1440000000002" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1508.1440000000002" y1="580" x2="1508.1440000000002" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1764.7960000000003" y1="593" x2="1752.7960000000003" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1764.7960000000003" y1="586" x2="1752.7960000000003" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1764.7960000000003" y1="579" x2="1752.7960000000003" y2="586" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="1748.7960000000003" cy="586" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1985.5960000000002" y1="580" x2="1985.5960000000002" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="1989.5960000000002" y1="580" x2="1989.5960000000002" y2="592" stroke="var(--_line)" stroke-width="1.25" />
<line x1="2218.9240000000004" y1="592" x2="2218.9240000000004" y2="580" stroke="var(--_line)" stroke-width="1.25" />
<line x1="2214.9240000000004" y1="592" x2="2214.9240000000004" y2="580" stroke="var(--_line)" stroke-width="1.25" />
<circle cx="2210.9240000000004" cy="586" r="4" fill="var(--bg)" stroke="var(--_line)" stroke-width="1.25" />
<rect x="270" y="282.85" width="67.26800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="303.634" y="293" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">gerencia (1:1)</text>
<rect x="588.884" y="90.85" width="61.32800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="619.548" y="101" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">possui (1:N)</text>
<rect x="1128.228" y="90.85" width="62.516000000000005" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="1159.486" y="101" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">contem (1:N)</text>
<rect x="672.384" y="282.85" width="61.32800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="703.048" y="293" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">possui (1:N)</text>
<rect x="678.4540000000001" y="418.55" width="55.38800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="706.148" y="428.7" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">sedia (1:N)</text>
<rect x="675.684" y="622.85" width="61.32800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="706.348" y="633" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">assina (1:N)</text>
<rect x="713.048" y="468.67" width="77.96000000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="752.028" y="478.82" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">apresenta (1:N)</text>
<rect x="1122.486" y="575.85" width="54.20000000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="1149.586" y="586" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">inclui (1:N)</text>
<rect x="1590.1440000000002" y="575.85" width="88.65200000000003" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="1634.4700000000003" y="586" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">disponibiliza (1:N)</text>
<rect x="2071.596" y="575.85" width="61.32800000000001" height="20.3" rx="2" ry="2" fill="var(--bg)" stroke="var(--_inner-stroke)" stroke-width="0.5" />
<text x="2102.26" y="586" text-anchor="middle" font-size="11" font-weight="400" fill="var(--_text-muted)" dy="3.8499999999999996">garante (1:1)</text>
</svg>
