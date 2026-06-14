# Porto Connect 🚀
### Gestão Inteligente de Talentos e Oportunidades

---

## 📌 A Problemática
O mercado de tecnologia enfrenta um desafio constante: a conexão eficiente entre empresas com vagas em aberto e estudantes qualificados em busca da primeira oportunidade. Muitas vezes, o processo de triagem é manual, lento e baseado em currículos estáticos que não demonstram as habilidades práticas do candidato.

**Os principais desafios identificados foram:**
*   **Gestão Ineficiente de Candidatos:** Dificuldade para acompanhar o status de múltiplos inscritos em diferentes processos.
*   **Falta de Portfólio Integrado:** Recrutadores precisam navegar por links externos para validar a capacidade técnica do aluno.
*   **Comunicação Lenta:** Processos seletivos que perdem agilidade por falta de uma plataforma centralizada de acompanhamento.

## 🎯 O Objetivo
O **Porto Connect** tem como objetivo centralizar e simplificar a jornada de recrutamento. Nossa plataforma oferece um ambiente robusto para que empresas gerenciem suas candidaturas de forma transparente e para que alunos apresentem seus projetos de forma profissional, agilizando o fechamento de vagas.

## 💡 A Solução: Gestão de Candidaturas e Portfólio Digital
Nossa solução foca na eficiência operacional do recrutamento:

### 1. Painel de Controle para Empresas
As empresas possuem um Dashboard intuitivo para gerenciar todos os alunos inscritos em suas vagas. É possível filtrar candidatos por nome e alterar o status da candidatura (Pendente, Entrevista, Contratado, Recusado) em tempo real, mantendo o processo organizado.

### 2. Mural de Vagas para Alunos
Os estudantes têm acesso a um mural atualizado com as oportunidades do ecossistema Porto Connect, podendo se candidatar com apenas um clique e acompanhar o progresso de suas inscrições diretamente no seu perfil.

### 3. Portfólio Técnico Integrado
Centralizamos os projetos, links de repositórios e habilidades dos alunos. O recrutador pode acessar o perfil completo do candidato dentro da plataforma, validando competências técnicas de forma rápida e segura.

---

## 🏗️ Arquitetura do Projeto
A aplicação foi estruturada seguindo o modelo de **Navegação Modular** e funções **Serverless**, garantindo alta performance e segurança dos dados:

```text
porto-connect/
├── 📂 api/                # Backend (Vercel Functions + Integração Redis)
│   └── db.js              # Persistência de Dados em Nuvem
├── 📂 js/                 # Motor Principal (Core)
│   └── db.js              # Lógica de Negócio e Cliente API
├── 📂 pages/              # Módulos de Interface (UI)
│   ├── home_aluno.html    # Dashboard de Candidaturas do Aluno
│   ├── home_empresa.html  # Gestão de Candidatos da Empresa
│   ├── detalhes_candidato.html # Perfil Detalhado do Candidato
│   ├── vagas.html         # Mural de Oportunidades
│   └── portfolio.html     # Vitrine de Projetos do Aluno
├── 📂 css/                # Estilização e Identidade Visual
├── 📂 assets/             # Recursos de Marca
├── index.html             # Landing Page
└── login.html             # Portal de Entrada
```

---

## 👥 Equipe — Squad 41

Alexciane Lima · Alycia Maia · Alysson Rodrigo · Amanda Estephany · Caio Esdras · Clarice Couto · Christiano Victor · Cristiano Alves · Daniel de Melo · Débora Rafaelle · Fernanda Mello · Yasmin Alvarez

---

*Faculdade Senac Recife · Análise e Desenvolvimento de Sistemas · Residência 2026*
