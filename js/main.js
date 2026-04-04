/* ═══════════════════════════════════════════════════════
   CineVault — main.js
   Базова інтерактивність: мобільне меню, анімації
════════════════════════════════════════════════════════ */

'use strict';

// ── Мобільне меню ────────────────────────────────────
const burger = document.querySelector('.nav__burger');
const navMenu = document.querySelector('.nav__menu');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!isOpen));
    navMenu.classList.toggle('nav__menu--open');
  });
}

// ── Липкий хедер — зміна стилю при скролі ────────────
const header = document.querySelector('.site-header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('site-header--scrolled');
  } else {
    header.classList.remove('site-header--scrolled');
  }
}, { passive: true });

// ── Кнопки «Список» та «Улюблені» ────────────────────
document.querySelectorAll('.movie-card__btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.classList.toggle('movie-card__btn--active');
    if (btn.classList.contains('movie-card__btn--heart')) {
      btn.style.color = btn.classList.contains('movie-card__btn--active')
        ? '#C0392B' : '';
    }
  });
});

// ── Жанрові пігулки ───────────────────────────────────
document.querySelectorAll('.genre-pill').forEach(pill => {
  pill.addEventListener('click', (e) => {
    document.querySelectorAll('.genre-pill').forEach(p => {
      p.classList.remove('genre-pill--active');
      p.removeAttribute('aria-current');
    });
    pill.classList.add('genre-pill--active');
    pill.setAttribute('aria-current', 'true');
  });
});
