// Animaciones al hacer scroll
const elements = document.querySelectorAll('.fade-in');

const showOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;

  elements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', showOnScroll);
showOnScroll();


// Tracking básico de CTA (útil para medir conversiones)
const ctas = document.querySelectorAll('.cta');

ctas.forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('CTA click - Sumarme');

    // Si después querés conectar con analytics:
    // gtag('event', 'click', { event_category: 'CTA', event_label: 'Sumarme' });
  });
});


// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});
