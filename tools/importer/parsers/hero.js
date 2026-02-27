/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Hero block
 *
 * Source: https://www.tcs.com/
 * Base Block: hero
 * Selector: .heroBanner
 *
 * Source HTML Pattern:
 * <div class="heroBanner">
 *   <div class="hero-banner-content-div">
 *     <span class="visually-hidden">Video description text</span>
 *     <a href="..." class="new-hero-banner tcs-primary-btn">Learn more</a>
 *   </div>
 *   <div class="hero-video-container">
 *     <video>...</video>
 *   </div>
 * </div>
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (text + CTA)
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  // Extract hero background image (video poster or first significant image)
  // VALIDATED: Found img.story-card-image in hero area, also video poster
  const heroImage = element.querySelector('.hero-video-container img') ||
                    element.querySelector('img[class*="hero"]') ||
                    element.querySelector('img:not([src*="data:"])');

  // Extract video description text (serves as hero text)
  // VALIDATED: Found span.visually-hidden with video description in captured DOM
  const descriptionSpan = element.querySelector('.hero-banner-content-div .visually-hidden');

  // Extract CTA link
  // VALIDATED: Found a.new-hero-banner.tcs-primary-btn in captured DOM
  const ctaLink = element.querySelector('a.new-hero-banner') ||
                  element.querySelector('a.tcs-primary-btn') ||
                  element.querySelector('.hero-banner-content-div a');

  const cells = [];

  // Row 1: Background image (optional)
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Content cell - description text + CTA
  const contentCell = [];
  if (descriptionSpan) {
    const p = document.createElement('p');
    p.textContent = descriptionSpan.textContent.trim();
    contentCell.push(p);
  }
  if (ctaLink) {
    contentCell.push(ctaLink);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
