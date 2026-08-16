// NAV scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.sobre__grid, .nicho__card, .step, .dep__card, .contato__grid, .hero__stats'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== CARROSSEL DE DEPOIMENTOS =====
(function() {
  const track   = document.getElementById('carouselTrack');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const dotsWrap = document.getElementById('carouselDots');

  if (!track) return;

  const cards = track.querySelectorAll('.depo__card');
  let current = 0;
  let perView = window.innerWidth < 700 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  // Definir largura dos cards
  function setCardWidth() {
    perView = window.innerWidth < 700 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const gap = 24;
    const wrapW = track.parentElement.offsetWidth;
    const cardW = (wrapW - gap * (perView - 1)) / perView;
    cards.forEach(c => { c.style.minWidth = cardW + 'px'; c.style.maxWidth = cardW + 'px'; });
    goTo(current);
  }

  const totalSlides = Math.ceil(cards.length / perView);

  // Criar pontos
  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function goTo(idx) {
    const total = Math.ceil(cards.length / perView);
    current = (idx + total) % total;
    const gap = 24;
    const cardW = cards[0].offsetWidth;
    const offset = current * (cardW + gap) * perView;
    track.style.transform = `translateX(-${offset}px)`;
    dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  btnNext.addEventListener('click', () => goTo(current + 1));
  btnPrev.addEventListener('click', () => goTo(current - 1));

  // Swipe no mobile
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
  });

  window.addEventListener('resize', () => { setCardWidth(); buildDots(); });

  setCardWidth();
  buildDots();

  // Auto-play
  setInterval(() => goTo(current + 1), 4000);
})();

// Form → WhatsApp
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nome     = this.querySelector('input[type="text"]').value.trim();
  const tel      = this.querySelector('input[type="tel"]').value.trim();
  const situacao = this.querySelector('select').value;
  const msg      = this.querySelector('textarea').value.trim();

  const text = encodeURIComponent(
    `Olá Marcos! Me chamo *${nome}* e vi seu site.\n` +
    `📱 Meu WhatsApp: ${tel}\n` +
    `📋 Situação: ${situacao}` +
    (msg ? `\n💬 ${msg}` : '')
  );
  window.open(`https://wa.me/5543988341571?text=${text}`, '_blank');
});
