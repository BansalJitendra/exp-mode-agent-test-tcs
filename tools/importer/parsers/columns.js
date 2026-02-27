/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Columns block
 *
 * Source: https://www.tcs.com/
 * Base Block: columns
 * Selectors: .interactiveHubPannel, .textWithAsset
 *
 * Handles multiple column patterns on TCS site:
 * 1. Interactive Hub Panel (.interactiveHubPannel) - 3 category cards side by side
 * 2. Text With Asset (.textWithAsset) - text on one side, image on other
 *
 * Block Structure (from markdown example):
 * - Row with N columns, each containing image + text + CTA
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Interactive Hub Panel (.interactiveHubPannel) - 3 columns
  // VALIDATED: Found .interactive-hub-card elements in captured DOM
  const hubCards = element.querySelectorAll('.interactive-hub-card');
  if (hubCards.length > 0) {
    const row = [];
    hubCards.forEach((card) => {
      // VALIDATED: Found img, .interactive-card-title, .interactive-card-description, a
      const img = card.querySelector('img') ||
                  card.querySelector('[class*="interactive"] img');
      const title = card.querySelector('.interactive-card-title') ||
                    card.querySelector('h3, h4');
      const desc = card.querySelector('.interactive-card-description') ||
                   card.querySelector('p');
      const cta = card.querySelector('a[class*="interactive"]') ||
                  card.querySelector('a');

      const cellContent = [];
      if (img) cellContent.push(img);
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        cellContent.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cellContent.push(p);
      }
      if (cta) cellContent.push(cta);

      row.push(cellContent);
    });
    cells.push(row);
  }

  // Pattern 2: Text With Asset (.textWithAsset) - 2 columns
  // VALIDATED: Found .asset-text-col and .asset-img-col in captured DOM
  const textCol = element.querySelector('.asset-text-col, .text-intro-box');
  const imgCol = element.querySelector('.asset-img-col img, .asset-image-box img');
  if (textCol || imgCol) {
    const leftCell = [];
    const rightCell = [];

    if (textCol) {
      // VALIDATED: Found .intro-tag, h2/h3, p, a in text column
      const label = textCol.querySelector('.intro-tag') ||
                    textCol.querySelector('.tag-label');
      const heading = textCol.querySelector('h2, h3, h1');
      const desc = textCol.querySelector('p:not(.intro-tag)') ||
                   textCol.querySelector('.intro-description');
      const cta = textCol.querySelector('a[class*="cta"]') ||
                  textCol.querySelector('a.tcs-primary-btn') ||
                  textCol.querySelector('a');

      if (label) {
        const strong = document.createElement('strong');
        strong.textContent = label.textContent.trim();
        leftCell.push(strong);
      }
      if (heading) {
        const strong = document.createElement('strong');
        strong.textContent = heading.textContent.trim();
        leftCell.push(strong);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        leftCell.push(p);
      }
      if (cta) leftCell.push(cta);
    }

    if (imgCol) {
      rightCell.push(imgCol);
    }

    cells.push([leftCell, rightCell]);
  }

  // Only create block if we found columns
  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
  }
}
