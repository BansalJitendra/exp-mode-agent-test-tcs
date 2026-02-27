/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Cards block
 *
 * Source: https://www.tcs.com/
 * Base Block: cards
 * Selectors: .storyCardCarousel, .solutionCard, .horizontalAccordion, .featureCard
 *
 * Handles multiple card patterns on TCS site:
 * 1. Story Card Carousel (.storyCardCarousel) - news items with image, title, desc, CTA
 * 2. Solution Card (.solutionCard) - customer stories with image, title, desc, CTA
 * 3. Horizontal Accordion (.horizontalAccordion) - events with flag, title, date, CTA
 * 4. Feature Card (.featureCard) - category cards with image, title, desc, CTA
 *
 * Block Structure (from markdown example):
 * - Each row: [image cell] [text cell with title, description, CTA]
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Story Card Carousel (.storyCardCarousel)
  // VALIDATED: Found .swiper-slide with .story-card-swiper-slider in captured DOM
  const storyCards = element.querySelectorAll('.swiper-slide .story-card-swiper-slider');
  if (storyCards.length > 0) {
    storyCards.forEach((card) => {
      // VALIDATED: Found img.story-card-image, p.story-card-title, p.story-card-description, a.story-cta-link
      const img = card.querySelector('img.story-card-image') ||
                  card.querySelector('.story-image-section img');
      const title = card.querySelector('p.story-card-title') ||
                    card.querySelector('.story-card-mid-container p:first-child');
      const desc = card.querySelector('p.story-card-description') ||
                   card.querySelector('.story-card-mid-container p:last-child');
      const cta = card.querySelector('a.story-cta-link') ||
                  card.querySelector('.story-card-inner-container a');

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (cta) textCell.push(cta);

      cells.push([img || '', textCell]);
    });
  }

  // Pattern 2: Solution Card / Customer Stories (.solutionCard)
  // VALIDATED: Found .swiper-slide with .solution-card-slider in captured DOM
  const solutionCards = element.querySelectorAll('.swiper-slide .solution-card-slider');
  if (solutionCards.length > 0) {
    solutionCards.forEach((card) => {
      // VALIDATED: Found img in card, .solution-card-title, .solution-card-description, a.solution-card-cta
      const img = card.querySelector('img') ||
                  card.querySelector('[class*="solution-card"] img');
      const title = card.querySelector('.solution-card-title') ||
                    card.querySelector('h3, h4');
      const desc = card.querySelector('.solution-card-description') ||
                   card.querySelector('p');
      const cta = card.querySelector('a.solution-card-cta') ||
                  card.querySelector('a[class*="solution"]') ||
                  card.querySelector('a');

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (cta) textCell.push(cta);

      cells.push([img || '', textCell]);
    });
  }

  // Pattern 3: Horizontal Accordion / Events (.horizontalAccordion)
  // VALIDATED: Found .accordion-item in captured DOM
  const accordionItems = element.querySelectorAll('.accordion-item');
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      // VALIDATED: Found img.accordion-icon-img, .horizontal-accordion-title, .accordion-description, a
      const img = item.querySelector('.accordion-body img:not(.accordion-icon-img)') ||
                  item.querySelector('.accordion-body img') ||
                  item.querySelector('img');
      const title = item.querySelector('.horizontal-accordion-title') ||
                    item.querySelector('h3, h4, .accordion-header');
      const desc = item.querySelector('.accordion-description') ||
                   item.querySelector('.accordion-body p');
      const cta = item.querySelector('.accordion-body a') ||
                  item.querySelector('a[class*="cta"]');

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (cta) textCell.push(cta);

      cells.push([img || '', textCell]);
    });
  }

  // Pattern 4: Feature Card / News & Insights (.featureCard)
  // VALIDATED: Found .feature-card-item in captured DOM
  const featureCards = element.querySelectorAll('.feature-card-item');
  if (featureCards.length > 0) {
    featureCards.forEach((card) => {
      // VALIDATED: Found img, .feature-card-title, .feature-card-description, a
      const img = card.querySelector('img') ||
                  card.querySelector('[class*="feature-card"] img');
      const title = card.querySelector('.feature-card-title') ||
                    card.querySelector('h3, h4');
      const desc = card.querySelector('.feature-card-description') ||
                   card.querySelector('p');
      const cta = card.querySelector('a[class*="feature-card-cta"]') ||
                  card.querySelector('a');

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }
      if (cta) textCell.push(cta);

      cells.push([img || '', textCell]);
    });
  }

  // Only create block if we found cards
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
  }
}
