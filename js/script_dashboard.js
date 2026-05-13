// Inicializa ícones Lucide
if (window.lucide) lucide.createIcons();

// Toggle do menu mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Navegação ativa
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (link.classList.contains('logout')) {
      e.preventDefault();
      if (confirm('Deseja realmente sair?')) alert('Sessão encerrada.');
      return;
    }
    e.preventDefault();
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
    navLinks.classList.remove('open');
  });
});

// Botão "Ver todas as vagas"
document.getElementById('seeAllJobs')?.addEventListener('click', () => {
  alert('Carregando todas as vagas disponíveis...');
});

// Cliques nos cards de projetos / vagas / candidaturas
document.querySelectorAll('.icon-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const label = btn.getAttribute('aria-label') || 'Abrir';
    alert(`${label} — em breve!`);
  });
});

document.querySelectorAll('.project, .job, .application').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent || 'Item';
    console.log('Selecionado:', title);
  });
});

// Link "Ver todos"
document.querySelectorAll('.link').forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    alert('Listando todos os projetos...');
  });
});

// Animação inicial da barra de progresso
window.addEventListener('load', () => {
  const bar = document.querySelector('.progress span');
  if (bar) {
    const w = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(() => { bar.style.width = w; });
  }
});
