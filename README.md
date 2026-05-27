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
- Edição de perfil com salvamento em LocalStorage
- Portfólio de projetos
- Descoberta e filtragem de vagas
- Visualização de detalhes dos candidatos

---

## Estrutura do Projeto

```text
porto-connect/
├── index.html                 # Ponto de entrada (Landing Page)
├── login1.html                # Escolha de perfil (Estudante/Empresa)
├── pages/                     # Telas da aplicação
│   ├── cadastro_aluno.html
│   ├── cadastro_empresa.html
│   ├── login_aluno.html
│   ├── login_empresa.html
│   ├── home_aluno.html        # Dashboard do Aluno
│   ├── home_empresa.html      # Dashboard da Empresa
│   ├── perfil_aluno.html
│   ├── perfil_empresa.html
│   ├── detalhes_candidato.html
│   ├── vagas.html             # Vagas disponíveis (Visão do Aluno)
│   ├── vagas_empresa.html     # Gestão de vagas (Visão da Empresa)
│   ├── nova_vaga.html
│   ├── editar_vaga.html
│   ├── portfolio.html
│   ├── novo_projeto.html
│   └── recuperar_senha.html
├── css/                       # Estilos modulares
│   ├── home_aluno.css         # CSS base do sistema e navbar
│   ├── style_principal.css    # Landing page
│   ├── login_aluno.css
│   ├── login_empresa.css
│   ├── perfil.css
│   └── portfolio.css
├── js/
│   ├── script_dashboard.js    # Lógica de navegação
│   └── script.js
└── assets/
    └── images/                # Logo e recursos visuais
```

---

## Como rodar localmente

**Pré-requisito:** ter o VS Code com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) instalada.

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/porto-connect.git

# Abra a pasta no VS Code
code porto-connect
```

Com a pasta aberta no VS Code, clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**. O projeto abrirá automaticamente no navegador em `http://127.0.0.1:5500`.

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Marcação | HTML5 |
| Estilização | CSS3 Vanilla |
| Interatividade | JavaScript (Vanilla) + LocalStorage |
| Versionamento | Git + GitHub |
| Ícones | Lucide + FontAwesome |

---

## Equipe — Squad 41

Alexciane Lima · Alycia Maia · Alysson Rodrigo · Amanda Estephany · Caio Esdras · Clarice Couto · Christiano Victor · Cristiano Alves · Daniel de Melo · Débora Rafaelle · Fernanda Mello · Yasmin Alvarez

---

*Faculdade Senac Recife · Análise e Desenvolvimento de Sistemas · Residência 2026*
