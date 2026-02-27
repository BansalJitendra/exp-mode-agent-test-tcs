import { createOptimizedPicture } from '../../scripts/aem.js';

function createNavButtons() {
  const nav = document.createElement('div');
  nav.className = 'cards-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'cards-nav-btn cards-nav-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.disabled = true;
  prevBtn.innerHTML = '<span>\u2190</span>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cards-nav-btn cards-nav-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<span>\u2192</span>';

  nav.append(prevBtn, nextBtn);
  return nav;
}

function updateNavState(ul, nav) {
  const prevBtn = nav.querySelector('.cards-nav-prev');
  const nextBtn = nav.querySelector('.cards-nav-next');
  const { scrollLeft, scrollWidth, clientWidth } = ul;

  prevBtn.disabled = scrollLeft <= 1;
  nextBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
}

function scrollByCard(ul, direction) {
  const card = ul.querySelector('li');
  if (!card) return;
  const gap = parseInt(getComputedStyle(ul).gap, 10) || 0;
  const scrollAmount = (card.offsetWidth + gap) * direction;
  ul.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img
      .closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);

  /* Add carousel navigation */
  const section = block.closest('.section');
  const heading = section?.querySelector('.default-content-wrapper');
  if (heading) {
    const nav = createNavButtons();
    heading.style.display = 'flex';
    heading.style.alignItems = 'center';
    heading.style.justifyContent = 'space-between';
    heading.append(nav);

    nav.querySelector('.cards-nav-prev').addEventListener('click', () => {
      scrollByCard(ul, -1);
    });
    nav.querySelector('.cards-nav-next').addEventListener('click', () => {
      scrollByCard(ul, 1);
    });

    ul.addEventListener('scroll', () => updateNavState(ul, nav), { passive: true });

    /* Update nav state when layout changes (CSS may load after decorate) */
    new ResizeObserver(() => updateNavState(ul, nav)).observe(ul);
  }
}
