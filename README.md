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

![alt text](download.svg)