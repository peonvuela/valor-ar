// Animaciones
const elements = document.querySelectorAll('.fade-in');

const reveal = () => {
  const trigger = window.innerHeight * 0.85;

  elements.forEach(el => {
    const top = el.getBoundingClientRect().top;

    if (top < trigger) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', reveal);
reveal();

// Tracking básico
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Click CTA - Valor.AR');

    // Ejemplo para futuro:
    // gtag('event', 'click_cta_valorar');
  });
});
