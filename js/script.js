document.addEventListener('DOMContentLoaded', () => {
  const cardEstudante = document.getElementById('cardEstudante');
  const cardEmpresa = document.getElementById('cardEmpresa');

  if (cardEstudante && cardEmpresa) {
    const selectCard = (activeCard, inactiveCard) => {
      inactiveCard.classList.remove('active');
      activeCard.classList.add('active');

      const existingTopBar = document.querySelector('.card-top-bar');
      if (existingTopBar) {
        existingTopBar.remove();
      }

      const newTopBar = document.createElement('div');
      newTopBar.className = 'card-top-bar';
      activeCard.prepend(newTopBar);
    };

    cardEstudante.addEventListener('click', () => selectCard(cardEstudante, cardEmpresa));
    cardEmpresa.addEventListener('click', () => selectCard(cardEmpresa, cardEstudante));
  }
});
