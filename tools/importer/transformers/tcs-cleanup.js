/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for TCS website cleanup
 * Purpose: Remove non-content elements, widgets, and fix HTML issues
 * Applies to: www.tcs.com (all templates)
 * Generated: 2026-02-27
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.tcs.com/
 * - cleaned.html analysis from page scraping phase
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove header/navigation (handled by separate navigation skill)
    // EXTRACTED: Found <header> with class "cmp-experiencefragment--header" in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.cmp-experiencefragment--header',
    ]);

    // Remove footer (handled separately)
    // EXTRACTED: Found <footer> with class "cmp-experiencefragment--footer" in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.cmp-experiencefragment--footer',
    ]);

    // Remove Dynamic Media video player controls (not content)
    // EXTRACTED: Found multiple elements with id prefix "dynamicmedia_" in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '[id^="dynamicmedia_"]',
      '.s7emaildialog',
      '.s7embeddialog',
      '.s7linkdialog',
    ]);

    // Remove swiper navigation controls (UI chrome, not content)
    // EXTRACTED: Found ".swiper-button-next", ".swiper-button-prev", ".swiper-pagination" in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.swiper-button-next',
      '.swiper-button-prev',
      '.swiper-pagination',
      '.solution-swiper-pagination-btn',
    ]);

    // Remove interactive overlay menus from hub panel
    // EXTRACTED: Found ".interactive-card-overlay" in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.interactive-card-overlay',
    ]);

    // Remove accordion close buttons (UI chrome)
    // EXTRACTED: Found ".close-icon" buttons in horizontal accordion in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.close-icon',
      '.horizontal-accordion-close-btn',
    ]);

    // Re-enable scrolling if body has overflow hidden
    if (element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up tracking/analytics attributes
    // EXTRACTED: Found data-cmp-*, data-sly-*, onclick attributes in captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-cmp-clickable');
      el.removeAttribute('data-sly-unwrap');
    });
  }
}
