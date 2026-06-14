# Porto Connect

> Plataforma de matchmaking inteligente que conecta estudantes de tecnologia a oportunidades reais no ecossistema do Porto Digital.

---

## Sobre o projeto

O mercado de tecnologia enfrenta um paradoxo: empresas com vagas abertas e estudantes qualificados que não conseguem se encontrar. O problema não está na falta de talento nem na falta de oportunidades, está na ausência de uma ponte eficiente entre os dois lados.

O **Porto Connect** resolve isso. A plataforma analisa o perfil técnico de cada estudante, suas hard skills e projetos práticos, gerando um ambiente de conexão mais orgânico com as vagas disponíveis nas empresas parceiras do Porto Digital. O resultado é um processo seletivo mais ágil, mais justo e baseado em evidências reais de capacidade técnica, e não apenas em currículos tradicionais.

A solução beneficia três perfis:

- **Estudantes** que ganham visibilidade real para o mercado, com um portfólio guiado para apresentar seus projetos e acesso a um mural de vagas filtráveis.
- **Recrutadores** que acessam uma base de talentos, com visualização prática dos projetos de cada candidato, além da gestão simplificada de suas vagas publicadas.
- **Coordenadores de residência** que passam a ter uma visão centralizada para conectar pessoas e empresas com muito mais eficiência.

---

## Este repositório

Este repositório contém o **Front-end** do Porto Connect, desenvolvido com **HTML, CSS (Vanilla) e JavaScript**.

A interface cobre os principais fluxos da plataforma: 
- Cadastro e login para Alunos e Empresas
- Dashboard inteligente para gestão de vagas e talentos
- Edição de perfil com persistência no banco (Vercel KV)
- Portfólio de projetos
- Descoberta e filtragem de vagas
- Visualização de detalhes dos candidatos

---

## Estrutura do Projeto

```text
porto-connect/
├── index.html                 # Ponto de entrada (Landing Page)
├── login.html                 # Escolha de perfil (Estudante/Empresa)
├── pages/                     # Telas da aplicação
│   ├── cadastro_aluno.html
│   ├── cadastro_empresa.html
│   ├── login_aluno.html
│   ├── login_empresa.html
│   ├── home_aluno.html        
│   ├── home_empresa.html     
│   ├── perfil_aluno.html
│   ├── perfil_empresa.html
│   ├── detalhes_candidato.html
│   ├── vagas.html           
│   ├── vagas_empresa.html  
│   ├── nova_vaga.html
│   ├── editar_vaga.html
│   ├── portfolio.html
│   ├── novo_projeto.html
│   └── recuperar_senha.html
├── css/                      
│   ├── home_aluno.css       
│   ├── style_principal.css  
│   ├── login_aluno.css
│   ├── login_empresa.css
│   ├── perfil.css
│   └── portfolio.css
├── js/
│   ├── db.js
│   ├── script_dashboard.js
│   └── script.js
├── api/
│   └── db.js
```

---

## Como publicar (GitHub + Vercel)

### 1. Commit e push

```bash
cd porto-connect-platform
git add .
git commit -m "Migrar banco para API Vercel com Upstash Redis"
git push origin main
```

### 2. Deploy na Vercel

Se o repositório ainda não estiver conectado:

1. Acesse [vercel.com](https://vercel.com/) e importe o repo `Clarice-Couto/porto-connect-platform`
2. Deixe as configurações padrão (sem build command) e clique em **Deploy**

Se já estiver conectado, o push na `main` dispara o deploy automaticamente.

### 3. Ativar o banco compartilhado (obrigatório para produção)

1. No projeto Vercel: **Storage → Marketplace → Upstash Redis**
2. Crie o banco e **conecte ao projeto** (a Vercel configura as variáveis sozinha)
3. Vá em **Deployments → Redeploy** no último deploy

Pronto. Sem Supabase, sem SQL, sem variáveis manuais.

> Localmente (Live Server), o app usa localStorage. Na Vercel, usa Redis via `/api/db`.

---

## Como rodar localmente

**Pré-requisito:** VS Code com [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

```bash
git clone https://github.com/Clarice-Couto/porto-connect-platform.git
cd porto-connect-platform
code .
```

Com a pasta aberta no VS Code, clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**. O projeto abrirá automaticamente no navegador em `http://127.0.0.1:5500`.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Marcação | HTML5 |
| Estilização | CSS3 Vanilla |
| Interatividade | JavaScript (Vanilla) + Upstash Redis |
| Versionamento | Git + GitHub |
| Ícones | Lucide + FontAwesome |

---

## Equipe — Squad 41

Alexciane Lima · Alycia Maia · Alysson Rodrigo · Amanda Estephany · Caio Esdras · Clarice Couto · Christiano Victor · Cristiano Alves · Daniel de Melo · Débora Rafaelle · Fernanda Mello · Yasmin Alvarez

---

*Faculdade Senac Recife · Análise e Desenvolvimento de Sistemas · Residência 2026*
