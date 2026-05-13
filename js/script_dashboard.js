if (window.lucide) lucide.createIcons();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

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

document.getElementById('seeAllJobs')?.addEventListener('click', () => {
  alert('Carregando todas as vagas disponíveis...');
});

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

document.querySelectorAll('.link').forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    alert('Listando todos os projetos...');
  });
});

window.addEventListener('load', () => {
  const bar = document.querySelector('.progress span');
  if (bar) {
    const w = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(() => { bar.style.width = w; });
  }
});
