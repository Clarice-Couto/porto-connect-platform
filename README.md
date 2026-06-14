# Porto Connect 🚀
### Pontes Inteligentes entre Talentos Iniciantes e o Mercado de Trabalho

---

## 📌 A Problemática
O mercado de tecnologia enfrenta um gap crítico: empresas têm dificuldade em validar as competências práticas de candidatos em início de carreira (estagiários e juniores), enquanto estudantes talentosos lutam para ganhar visibilidade em meio a processos seletivos baseados em currículos estáticos que não refletem seu real potencial técnico.

**Os principais desafios identificados foram:**
*   **Triagem Ineficiente:** RHs gastam horas analisando currículos que não atendem aos requisitos técnicos.
*   **Falta de Evidências:** Portfólios de alunos muitas vezes ficam dispersos, dificultando a análise técnica rápida pela empresa.
*   **Desconexão de Perfil:** Candidatos se aplicam a vagas sem saber se possuem o perfil técnico desejado, gerando frustração em ambos os lados.

## 🎯 O Objetivo
O **Porto Connect** nasce para transformar essa realidade através de uma plataforma de recrutamento ativa. Nosso objetivo é simplificar a conexão entre a necessidade técnica da empresa e a habilidade prática do aluno, reduzindo o tempo de contratação e aumentando a transparência dos processos.

## 💡 A Solução: Recrutamento Ativo e Filtros Dinâmicos
Nossa solução vai além de um simples portal de vagas. Desenvolvemos um ecossistema onde:

### 1. Banco de Talentos Global (Hunting)
O Porto Connect permite que as empresas realizem o "Hunting" (prospecção ativa). Recrutadores podem navegar por toda a base de alunos, utilizando filtros por nome e competências técnicas para localizar perfis específicos, mesmo que o aluno ainda não tenha se candidatado.

### 2. Gestão Simplificada de Candidaturas
As empresas possuem um painel de controle para gerenciar inscritos, alterar status de processos seletivos e visualizar o portfólio completo de cada candidato em um clique.

### 3. Portfólio Integrado
Centralizamos os projetos e experiências dos alunos em uma visão focada em competências, permitindo que a empresa valide o código e a prática antes mesmo da primeira entrevista.

---

## 🏗️ Arquitetura do Projeto
A aplicação foi estruturada seguindo o modelo de **Navegação Modular** e funções **Serverless**, garantindo alta performance e escalabilidade:

```text
porto-connect/
├── 📂 api/                # Backend (Vercel Functions + Integração Redis)
│   └── db.js              # Lógica Serverless e Persistência de Dados
├── 📂 js/                 # Motor Principal (Core)
│   └── db.js              # Cliente API e Regras de Negócio
├── 📂 pages/              # Módulos de Interface (UI)
│   ├── home_aluno.html    # Dashboard do Aluno
│   ├── home_empresa.html  # Dashboard de Recrutamento da Empresa
│   ├── vagas.html         # Painel de Vagas
│   └── portfolio.html     # Vitrine de Competências (Portfólio)
├── 📂 css/                # Identidade Visual e Estilos
├── 📂 assets/             # Recursos de Marca e Ícones
└── vercel.json            # Configuração de Deploy e Roteamento
```

---

## 👥 Equipe — Squad 41

Alexciane Lima · Alycia Maia · Alysson Rodrigo · Amanda Estephany · Caio Esdras · Clarice Couto · Christiano Victor · Cristiano Alves · Daniel de Melo · Débora Rafaelle · Fernanda Mello · Yasmin Alvarez

---

*Faculdade Senac Recife · Análise e Desenvolvimento de Sistemas · Residência 2026*
