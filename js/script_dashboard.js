if (window.lucide) lucide.createIcons();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Navegação controlada pelo HTML (hrefs)

document.getElementById('seeAllJobs')?.addEventListener('click', () => {
  alert('Carregando todas as vagas disponíveis...');
});

// Botões de ícones tratados individualmente no HTML

document.querySelectorAll('.project, .job, .application').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent || 'Item';
    console.log('Selecionado:', title);
  });
});

// Links Ver Todas tratados pelo HTML

window.addEventListener('load', () => {
  const bar = document.querySelector('.progress span');
  if (bar) {
    const w = bar.style.width;
    bar.style.width = '0%';
    requestAnimationFrame(() => { bar.style.width = w; });
  }
});
