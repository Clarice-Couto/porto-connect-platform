if (window.lucide) lucide.createIcons();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.getElementById('seeAllJobs')?.addEventListener('click', () => {
  alert('Carregando todas as vagas disponíveis...');
});

document.querySelectorAll('.project, .job, .application').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const title = card.querySelector('h3')?.textContent || 'Item';

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
