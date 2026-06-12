<!-- Check out [this markdown page](?test) -->
<div style="text-align:center; opacity:0.7; margin-top:40px;">
Desde Ciudad de Mexico hacia donde me estes leyendo
<a href="https://www.instagram.com/barocio_fer/" target="_blank">Fernando</a>.
</div>

<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>

<script>
window.addEventListener('load', () => {

  const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: [
      '#F8C8DC',
      '#FFD6E8',
      '#FFF0F5',
      '#E6E6FA',
      '#FFF8DC'
    ]
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ['star']
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ['circle']
    });
  }

  setTimeout(shoot, 0);
  setTimeout(shoot, 250);
  setTimeout(shoot, 500);
  setTimeout(shoot, 750);

});
</script>
