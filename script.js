// Tracking básico de clics
document.querySelectorAll('.cta').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log('Click en botón de aporte');
  });
});
