# Porto Connect

> Plataforma de matchmaking inteligente que conecta estudantes de tecnologia a oportunidades reais no ecossistema do Porto Digital.

---

## Sobre o projeto

O mercado de tecnologia enfrenta um paradoxo: empresas com vagas abertas e estudantes qualificados que não conseguem se encontrar. O problema não está na falta de talento nem na falta de oportunidades — está na ausência de uma ponte eficiente entre os dois lados.

O **Porto Connect** resolve isso. A plataforma analisa o perfil técnico de cada estudante — suas hard skills, projetos práticos e nível de maturidade — e gera um ranking de compatibilidade com as vagas disponíveis nas empresas parceiras do Porto Digital. O resultado é um processo seletivo mais ágil, mais justo e baseado em evidências reais de capacidade técnica, e não apenas em currículos tradicionais.

A solução beneficia três perfis:

- **Estudantes** que ganham visibilidade real para o mercado, com recomendações de vagas compatíveis com seu nível e um portfólio guiado para apresentar seus projetos.
- **Recrutadores** que acessam uma base de talentos validados, com indicadores técnicos confiáveis e visualização prática dos projetos de cada candidato.
- **Coordenadores de residência** que passam a ter uma visão centralizada do progresso dos alunos e conseguem conectar pessoas e empresas com muito mais eficiência.

---

## Este repositório

Este repositório contém o **front-end** do Porto Connect, desenvolvido com **HTML, CSS e JavaScript puro** — sem frameworks, sem dependências externas, sem etapa de build.

A interface cobre os principais fluxos da plataforma: cadastro e edição de perfil, portfólio de projetos, descoberta e filtragem de vagas, candidatura e acompanhamento de processos seletivos.

---

## Estrutura

```
porto-connect/
├── index.html           # Tela inicial
├── pages/               # Demais telas da aplicação
│   ├── login.html
│   ├── home.html
│   ├── perfil.html
│   ├── vagas.html
│   └── portfolio.html
├── css/
│   └── style.css        # Estilos globais
├── js/
│   └── script.js        # Scripts compartilhados
└── assets/
    └── images/          # Imagens e ícones
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
| Estilização | CSS3 |
| Interatividade | JavaScript |
| Versionamento | Git + GitHub |
| Editor | VS Code |

---

## Equipe — Squad 41

Alexciane Lima · Alycia Maia · Alysson Rodrigo · Amanda Estephany · Caio Esdras · Clarice Couto · Christiano Victor · Cristiano Alves · Daniel de Melo · Débora Rafaelle · Fernanda Melo · Yasmin Alvarez

---

*Faculdade Senac Recife · Análise e Desenvolvimento de Sistemas · Residência 2026*
