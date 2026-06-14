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
│   ├── script_dashboard.js   
│   └── script.js
└── assets/
    └── images/         
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

## Configurar Supabase e deploy (Netlify)

1. Crie um projeto no Supabase e configure as tabelas mínimas: `students`, `companies`, `vacancies`, `applications` (colunas usadas pelo frontend: email, nome, status, created_at, etc.).
2. No frontend, o arquivo `js/init-supabase.js` contém placeholders `%%SUPABASE_URL%%` e `%%SUPABASE_ANON_KEY%%`.
    - Locally: substitua manualmente esses valores pelo `URL` e `anon key` do seu projeto.
    - Netlify: adicione as variáveis de ambiente `SUPABASE_URL` e `SUPABASE_ANON_KEY` e, durante o build, substitua os placeholders (ex.: usando `sed` no comando de build) ou gere um arquivo `init-supabase.js` a partir dessas variáveis.

Exemplo simples para Netlify (como comando de build):

```bash
# substitui os placeholders no arquivo antes de publicar
sed -i "s|%%SUPABASE_URL%%|$SUPABASE_URL|g" ./js/init-supabase.js
sed -i "s|%%SUPABASE_ANON_KEY%%|$SUPABASE_ANON_KEY|g" ./js/init-supabase.js
npm run build-or-empty || true
```

3. Deploy no Netlify: conecte o repositório e defina as variáveis de ambiente. Certifique-se que `js/init-supabase.js` no build final contenha as chaves substituídas.

4. Testes pós-deploy: acesse o site publicado, registre uma empresa/aluno e crie uma vaga; verifique no Supabase que os registros foram inseridos nas tabelas correspondentes.

Observação: a `anon key` do Supabase é pensada para uso no cliente (front-end). Proteja a `service_role`/chaves administrativas — não as inclua no frontend.

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
