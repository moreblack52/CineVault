/* ═══════════════════════════════════════════════════════════════
   CineVault — main.js
   Лабораторна робота: Програмування мовою JavaScript
   ───────────────────────────────────────────────────────────────
   Покриває всі 7 пунктів завдання:
   1. Структура скрипту, змінні, типи даних
   2. Синтаксис та конструкції мови
   3. Цикли та управляючі оператори
   4. Методи роботи з об'єктами документа (DOM)
   5. alert(), confirm(), prompt()
   6. Обробка подій та інтерактивність
   7. Вдосконалення сайту CineVault
════════════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. ЗМІННІ ТА СТРУКТУРИ ДАНИХ
   (демонструє: const, let, об'єкти, масиви, шаблонні рядки)
────────────────────────────────────────────────────────────────*/

// Конфігурація сайту
const SITE_CONFIG = {
  name: 'CineVault',
  version: '1.0',
  maxRating: 10,
  toastDuration: 3000,
  searchMinLength: 2,
};

// База даних фільмів (масив об'єктів)
const MOVIES_DB = [
  { id: 1,  title: 'Гра в кальмара 2',     year: 2024, genre: 'thriller',    rating: 8.9, type: 'series'  },
  { id: 2,  title: 'Дюна: Частина 2',       year: 2024, genre: 'scifi',       rating: 8.5, type: 'movie'   },
  { id: 3,  title: 'Оппенгаймер',           year: 2023, genre: 'drama',       rating: 8.9, type: 'movie'   },
  { id: 4,  title: 'Офіс (US)',             year: 2005, genre: 'comedy',      rating: 9.0, type: 'series'  },
  { id: 5,  title: 'Одні з нас',            year: 2023, genre: 'thriller',    rating: 8.8, type: 'series'  },
  { id: 6,  title: 'Справжній детектив',    year: 2014, genre: 'crime',       rating: 9.0, type: 'series'  },
  { id: 7,  title: 'Муфаса',               year: 2024, genre: 'animation',   rating: 7.2, type: 'movie'   },
  { id: 8,  title: 'Моана 2',              year: 2024, genre: 'animation',   rating: 7.0, type: 'movie'   },
  { id: 9,  title: 'Alien: Romulus',        year: 2024, genre: 'horror',      rating: 7.4, type: 'movie'   },
  { id: 10, title: 'Дедпул 3',             year: 2024, genre: 'action',      rating: 8.0, type: 'movie'   },
  { id: 11, title: 'Джокер 2',             year: 2024, genre: 'drama',       rating: 5.8, type: 'movie'   },
  { id: 12, title: 'Головоломка 2',         year: 2024, genre: 'animation',   rating: 7.8, type: 'movie'   },
];

// Стан застосунку
const appState = {
  watchlist:    JSON.parse(localStorage.getItem('cv_watchlist')  || '[]'),
  favorites:    JSON.parse(localStorage.getItem('cv_favorites')  || '[]'),
  watched:      JSON.parse(localStorage.getItem('cv_watched')    || '[]'),
  searchQuery:  '',
  currentGenre: 'all',
  isMenuOpen:   false,
};

/* ──────────────────────────────────────────────────────────────
   2. ДОПОМІЖНІ ФУНКЦІЇ (синтаксис, стрілкові функції)
────────────────────────────────────────────────────────────────*/

// Зберегти стан у localStorage
const saveState = () => {
  localStorage.setItem('cv_watchlist', JSON.stringify(appState.watchlist));
  localStorage.setItem('cv_favorites', JSON.stringify(appState.favorites));
  localStorage.setItem('cv_watched',   JSON.stringify(appState.watched));
};

// Перевірити чи фільм у списку
const isInList = (list, movieId) => list.includes(movieId);

// Додати / видалити зі списку (toggle)
function toggleList(list, movieId) {
  const idx = list.indexOf(movieId);
  if (idx === -1) {
    list.push(movieId);
    return true;   // додано
  } else {
    list.splice(idx, 1);
    return false;  // видалено
  }
}

// Форматування числа рейтингу
const formatRating = (rating) => parseFloat(rating).toFixed(1);

// Отримати поточну дату
const getCurrentDate = () => {
  const now = new Date();
  const day   = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year  = now.getFullYear();
  return `${day}.${month}.${year}`;
};

/* ──────────────────────────────────────────────────────────────
   3. ЦИКЛИ ТА УПРАВЛЯЮЧІ ОПЕРАТОРИ
────────────────────────────────────────────────────────────────*/

// Підрахунок статистики колекції через цикл for..of
function calcStats() {
  let totalRating = 0;
  let moviesCount = 0;
  let seriesCount = 0;

  for (const movie of MOVIES_DB) {
    totalRating += movie.rating;

    if (movie.type === 'movie') {
      moviesCount++;
    } else if (movie.type === 'series') {
      seriesCount++;
    }
  }

  const avgRating = totalRating / MOVIES_DB.length;

  return {
    total:      MOVIES_DB.length,
    movies:     moviesCount,
    series:     seriesCount,
    avgRating:  formatRating(avgRating),
    watchlist:  appState.watchlist.length,
    favorites:  appState.favorites.length,
  };
}

// Фільтрація фільмів через цикл + умовний оператор
function filterMovies(query, genre) {
  const results = [];

  for (let i = 0; i < MOVIES_DB.length; i++) {
    const movie = MOVIES_DB[i];
    const matchesQuery = query.length < SITE_CONFIG.searchMinLength
      ? true
      : movie.title.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = (genre === 'all') ? true : (movie.genre === genre);

    if (matchesQuery && matchesGenre) {
      results.push(movie);
    }
  }

  // Сортування за рейтингом (метод sort)
  results.sort((a, b) => b.rating - a.rating);

  return results;
}

// Топ-3 фільми через цикл while
function getTop3() {
  const sorted = [...MOVIES_DB].sort((a, b) => b.rating - a.rating);
  const top = [];
  let i = 0;

  while (i < 3 && i < sorted.length) {
    top.push(sorted[i]);
    i++;
  }

  return top;
}

/* ──────────────────────────────────────────────────────────────
   4. РОБОТА З DOM (Document Object Model)
────────────────────────────────────────────────────────────────*/

// Знайти елементи
const header      = document.querySelector('.site-header');
const navMenu     = document.querySelector('.nav__menu');
const burger      = document.querySelector('.nav__burger');
const searchInput = document.querySelector('.nav__search-input');
const movieCards  = document.querySelectorAll('.movie-card');

// Створити Toast-повідомлення (createElement, appendChild)
function createToast(message, type = 'info') {
  // Видалити попередній toast якщо є
  const existing = document.querySelector('.cv-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `cv-toast cv-toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span class="cv-toast__icon">${icon}</span><span>${message}</span>`;

  document.body.appendChild(toast);

  // Анімація появи
  requestAnimationFrame(() => toast.classList.add('cv-toast--visible'));

  // Автоматичне зникнення
  setTimeout(() => {
    toast.classList.remove('cv-toast--visible');
    setTimeout(() => toast.remove(), 400);
  }, SITE_CONFIG.toastDuration);
}

// Оновити лічильник у кнопці watchlist
function updateCounterBadge() {
  let badge = document.querySelector('.cv-counter');

  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cv-counter';
    const navActions = document.querySelector('.nav__actions');
    if (navActions) navActions.prepend(badge);
  }

  const total = appState.watchlist.length + appState.favorites.length;
  badge.textContent = total > 0 ? `♥ ${total}` : '';
  badge.style.display = total > 0 ? 'inline-flex' : 'none';
}

// Динамічно вставити блок статистики в footer
function renderStatsBlock() {
  const footer = document.querySelector('.footer__brand');
  if (!footer || document.querySelector('.cv-stats')) return;

  const stats = calcStats();
  const statsEl = document.createElement('div');
  statsEl.className = 'cv-stats';
  statsEl.innerHTML = `
    <p class="cv-stats__title">📊 Статистика каталогу</p>
    <ul class="cv-stats__list">
      <li>Фільмів: <strong>${stats.movies}</strong></li>
      <li>Серіалів: <strong>${stats.series}</strong></li>
      <li>Середній рейтинг: <strong>★ ${stats.avgRating}</strong></li>
    </ul>
  `;
  footer.appendChild(statsEl);
}

// Підсвітити активний жанр у навігації
function setActiveGenre(genreName) {
  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.classList.remove('genre-pill--active');
    pill.removeAttribute('aria-current');
  });

  const activePill = document.querySelector(
    `.genre-pill[href*="${genreName}"], .genre-pill[href="catalog.html"]`
  );
  if (activePill) {
    activePill.classList.add('genre-pill--active');
    activePill.setAttribute('aria-current', 'true');
  }
}

/* ──────────────────────────────────────────────────────────────
   5. alert(), confirm(), prompt()
────────────────────────────────────────────────────────────────*/

// Вітальне повідомлення для нового відвідувача
function greetNewVisitor() {
  const visited = localStorage.getItem('cv_visited');

  if (!visited) {
    localStorage.setItem('cv_visited', 'true');

    // setTimeout щоб не блокувати рендер сторінки
    setTimeout(() => {
      const wantsToRegister = confirm(
        `Ласкаво просимо до ${SITE_CONFIG.name}! 🎬\n\n` +
        `Це твоя персональна кінотека.\n` +
        `Хочеш створити безкоштовний акаунт щоб зберігати фільми?`
      );

      if (wantsToRegister) {
        window.location.href = 'register.html';
      } else {
        createToast('Ти завжди можеш зареєструватися пізніше', 'info');
      }
    }, 1500);
  }
}

// Пошук з prompt() — запасний варіант якщо інпут не знайдено
function promptSearch() {
  const query = prompt('🔍 Введи назву фільму або серіалу:');

  if (query === null) return; // скасовано

  if (query.trim().length < SITE_CONFIG.searchMinLength) {
    alert(`Введи щонайменше ${SITE_CONFIG.searchMinLength} символи для пошуку.`);
    return;
  }

  const results = filterMovies(query.trim(), 'all');

  if (results.length === 0) {
    alert(`За запитом «${query}» нічого не знайдено.\nСпробуй іншу назву.`);
  } else {
    const titles = results.map((m, i) => `${i + 1}. ${m.title} (${m.year}) — ★ ${m.rating}`).join('\n');
    alert(`Знайдено ${results.length} результат(ів):\n\n${titles}`);
  }
}

/* ──────────────────────────────────────────────────────────────
   6. ОБРОБКА ПОДІЙ (addEventListener)
────────────────────────────────────────────────────────────────*/

// ── Мобільне меню ─────────────────────────────────────────────
function initMobileMenu() {
  if (!burger || !navMenu) return;

  burger.addEventListener('click', () => {
    appState.isMenuOpen = !appState.isMenuOpen;
    burger.setAttribute('aria-expanded', String(appState.isMenuOpen));
    navMenu.classList.toggle('nav__menu--open', appState.isMenuOpen);
    burger.classList.toggle('nav__burger--open', appState.isMenuOpen);
  });

  // Закрити меню при кліку поза ним
  document.addEventListener('click', (e) => {
    if (appState.isMenuOpen && !header.contains(e.target)) {
      appState.isMenuOpen = false;
      burger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('nav__menu--open');
      burger.classList.remove('nav__burger--open');
    }
  });
}

// ── Скрол хедера ──────────────────────────────────────────────
function initScrollHeader() {
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('site-header--scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Живий пошук ───────────────────────────────────────────────
function initSearch() {
  if (!searchInput) return;

  // Пошук при введенні (debounce 300ms)
  let searchTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const query = e.target.value.trim();
      appState.searchQuery = query;

      if (query.length >= SITE_CONFIG.searchMinLength) {
        showSearchResults(query);
      } else {
        removeSearchDropdown();
      }
    }, 300);
  });

  // Закрити при Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      appState.searchQuery = '';
      removeSearchDropdown();
    }
  });

  // Закрити при кліку поза пошуком
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__search')) {
      removeSearchDropdown();
    }
  });
}

// Показати dropdown з результатами пошуку
function showSearchResults(query) {
  removeSearchDropdown();

  const results = filterMovies(query, 'all').slice(0, 5);
  if (results.length === 0) return;

  const dropdown = document.createElement('div');
  dropdown.className = 'cv-search-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.setAttribute('aria-label', 'Результати пошуку');

  results.forEach(movie => {
    const item = document.createElement('a');
    item.className = 'cv-search-item';
    item.href = `movie.html?id=${movie.id}`;
    item.setAttribute('role', 'option');
    item.innerHTML = `
      <span class="cv-search-item__title">${highlightMatch(movie.title, query)}</span>
      <span class="cv-search-item__meta">${movie.year} · ★ ${movie.rating}</span>
    `;
    dropdown.appendChild(item);
  });

  const searchBox = document.querySelector('.nav__search');
  if (searchBox) {
    searchBox.style.position = 'relative';
    searchBox.appendChild(dropdown);
  }
}

// Видалити dropdown
function removeSearchDropdown() {
  document.querySelector('.cv-search-dropdown')?.remove();
}

// Підсвітити знайдений текст у результатах
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// ── Кнопки на картках фільмів ──────────────────────────────────
function initMovieCards() {
  movieCards.forEach(card => {
    const addBtn   = card.querySelector('.movie-card__btn:not(.movie-card__btn--heart)');
    const heartBtn = card.querySelector('.movie-card__btn--heart');
    const title    = card.querySelector('.movie-card__title')?.textContent || 'Фільм';

    // Знайти movieId (беремо порядковий номер)
    const allCards = [...document.querySelectorAll('.movie-card')];
    const movieId  = allCards.indexOf(card) + 1;

    // Кнопка "+ Список"
    if (addBtn) {
      // Відновити стан зі збереженого
      if (isInList(appState.watchlist, movieId)) {
        addBtn.textContent = '✓ У списку';
        addBtn.classList.add('movie-card__btn--active');
      }

      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const added = toggleList(appState.watchlist, movieId);
        addBtn.textContent = added ? '✓ У списку' : '+ Список';
        addBtn.classList.toggle('movie-card__btn--active', added);
        saveState();
        updateCounterBadge();
        createToast(
          added ? `«${title}» додано до списку` : `«${title}» видалено зі списку`,
          added ? 'success' : 'info'
        );
      });
    }

    // Кнопка "♥ Улюблені"
    if (heartBtn) {
      if (isInList(appState.favorites, movieId)) {
        heartBtn.style.color = '#E03030';
        heartBtn.setAttribute('aria-label', 'Видалити з улюблених');
      }

      heartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const added = toggleList(appState.favorites, movieId);
        heartBtn.style.color = added ? '#E03030' : '';
        heartBtn.setAttribute('aria-label', added ? 'Видалити з улюблених' : 'Додати до улюблених');
        saveState();
        updateCounterBadge();
        createToast(
          added ? `«${title}» додано до улюблених ♥` : `«${title}» видалено з улюблених`,
          added ? 'success' : 'info'
        );
      });
    }
  });
}

// ── Жанрові пігулки ───────────────────────────────────────────
function initGenrePills() {
  document.querySelectorAll('.genre-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const genre = pill.href?.includes('genre=') 
        ? new URL(pill.href).searchParams.get('genre')
        : 'all';

      appState.currentGenre = genre;
      setActiveGenre(genre);
    });
  });
}

// ── Клавіатурні скорочення ─────────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K або "/" — фокус на пошук
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
      e.preventDefault();
      searchInput?.focus();
    }
  });
}

// ── Плавна прокрутка для якірних посилань ─────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Анімація появи секцій при скролі (Intersection Observer) ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('cv-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.movies-section, .promo, .features').forEach(el => {
    el.classList.add('cv-fade');
    observer.observe(el);
  });
}

/* ──────────────────────────────────────────────────────────────
   7. ВДОСКОНАЛЕННЯ САЙТУ CINEVAULT
   (Додаткові функції що роблять сайт кращим)
────────────────────────────────────────────────────────────────*/

// ── Поточна дата у футері ──────────────────────────────────────
function renderCurrentDate() {
  const copyEl = document.querySelector('.footer__copy');
  if (copyEl) {
    const year = new Date().getFullYear();
    copyEl.textContent = `© ${year} CineVault. Всі права захищені.`;
  }
}

// ── Лічильник переглядів сторінки (localStorage) ───────────────
function trackPageViews() {
  const key   = 'cv_page_views';
  const views = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, String(views));

  // Кожні 10 відвідувань показуємо підказку
  if (views % 10 === 0 && views > 0) {
    setTimeout(() => {
      createToast(`Ти вже відвідав CineVault ${views} разів! 🎬`, 'success');
    }, 2000);
  }
}

// ── Кнопка "Повернутись нагору" ────────────────────────────────
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className    = 'cv-back-to-top';
  btn.textContent  = '↑';
  btn.setAttribute('aria-label', 'Повернутись нагору');
  btn.title        = 'Повернутись нагору';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('cv-back-to-top--visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Показати топ-3 фільми у консолі (для демонстрації) ─────────
function logTop3ToConsole() {
  const top3 = getTop3();
  console.group(`%c🎬 ${SITE_CONFIG.name} — Топ-3 фільми`, 'color:#E03030;font-weight:bold');
  top3.forEach((movie, i) => {
    console.log(`${i + 1}. ${movie.title} (${movie.year}) — ★ ${movie.rating}`);
  });
  console.groupEnd();

  const stats = calcStats();
  console.group('%c📊 Статистика каталогу', 'color:#E8724A;font-weight:bold');
  console.table(stats);
  console.groupEnd();
}

// ── Lazy-reveal для карток ─────────────────────────────────────
function initCardHoverEffects() {
  movieCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '2';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   ІНІЦІАЛІЗАЦІЯ — запуск усіх модулів після завантаження DOM
────────────────────────────────────────────────────────────────*/

document.addEventListener('DOMContentLoaded', () => {

  // 4. DOM
  renderCurrentDate();
  renderStatsBlock();
  updateCounterBadge();

  // 5. alert / confirm / prompt
  greetNewVisitor();

  // 6. події
  initMobileMenu();
  initScrollHeader();
  initSearch();
  initMovieCards();
  initGenrePills();
  initKeyboardShortcuts();
  initSmoothScroll();
  initScrollAnimations();

  // 7. вдосконалення CineVault
  initBackToTop();
  initCardHoverEffects();
  trackPageViews();

  // Лог у консоль (демонстрація роботи з даними)
  logTop3ToConsole();

  console.log(
    `%c${SITE_CONFIG.name} v${SITE_CONFIG.version} — JavaScript ініціалізовано ✓`,
    'color:#E03030;font-size:13px;font-weight:bold'
  );
});
