// Tracking básico de botones
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Click en botón de aporte');

    // Para futuro (Google Analytics / Meta Pixel)
    // gtag('event', 'click_aporte', { method: 'mercadopago' });
  });
});


// Opcional: detectar dispositivo (para mejoras futuras)
const isMobile = window.innerWidth < 768;

if (isMobile) {
  console.log("Usuario en mobile");
} else {
  console.log("Usuario en desktop");
}
