# Finance Z

Sistema de gerenciamento financeiro com funcionalidades de transferência de valores, dashboard com saldo e histórico de transações.

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e execução

```bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Rodar testes (execução única)
npm run test

# Rodar testes em modo watch
npm run test:watch
```

O servidor de desenvolvimento será iniciado em `http://localhost:5173/financejobz`.

### Credenciais de teste

Na tela de login, clique no botão de credenciais mock para preencher automaticamente:
- **Email:** user@financez.com
- **Senha:** user123


# Arquitetura do Projeto

## 1. Separação de responsabilidades

Temos as **Pages** como componentes de nível de rota, atuando como pontos de entrada para cada funcionalidade, **Componentes** como fluxos reutilizáveis e **Layouts** como estrutura compartilhada entre páginas autenticadas, além dos **UI tokens** como elementos reutilizáveis. Esta separação garante que cada camada tenha uma única responsabilidade, facilitando manutenção e testes.

---

## 2. Gerenciamento de estados

**React Query** pra lidar com dados que vêm da API (saldo, transações) e **Zustand** pra coisas mais locais (se o usuário tá logado, qual etapa do fluxo ele está). Se o dado vem do servidor, deixe o React Query gerenciar; se é estado da interface, Zustand.

Campos possuem formatação em tempo real para evitar exploits e erros do usuário.

---

## 3. Proteger rotas de um jeito simples

O `ProtectedRoute` é basicamente um "porteiro": se o usuário não está logado, ele é mandado pro login. É simples, mas garante que ninguém entre onde não deveria.

---

## 4. Fluxo de transação

Os passos são controlados por um store, não por rotas. Com o store, o fluxo é sempre linear e os dados ficam preservados entre um passo e outro. O usuário não consegue se perder (nem pular etapas sem querer).

---


# Fluxo testado

Fluxo de transferência

# Segurança 

Poderíamos adotar algumas práticas para proteger o app:

### Contra engenharia reversa

- **Ofuscação de código** no bundle de produção (Terser/SWC) para dificultar a leitura da lógica
- **Regras de negócio no backend** — validações como saldo e limites ficariam no servidor, o frontend só receberia o resultado
- **CSP com nonces** para prevenir injeção de código malicioso

### Contra vazamento de dados

- **JWT com refresh token rotativo** — access token em memória (nunca em localStorage), refresh token em cookie httpOnly + secure
- **Sanitização de inputs** com DOMPurify para prevenir XSS
- **Validação em duas camadas** — frontend pra UX, backend pra segurança de verdade
- **Proteção CSRF** via cookies com `SameSite=Strict`
- **Logs e monitoramento** para detectar tentativas de acesso indevido

A ideia é o princípio de **defesa em profundidade**: nenhuma camada única é responsável pela segurança. O backend guarda as regras críticas e o frontend minimiza sua superfície de exposição.
