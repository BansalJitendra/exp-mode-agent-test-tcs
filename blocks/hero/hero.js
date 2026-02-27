export default function decorate(block) {
  // Standard EDS hero pattern: move picture to be a direct child of the block
  // and flatten the row/cell structure into a single content wrapper
  const rows = [...block.children];
  let picture = null;
  const contentElements = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !cell.textContent.trim().replace(pic.textContent, '').trim()) {
        // This cell only contains a picture
        picture = pic;
      } else {
        // This cell has text/link content - collect its children
        [...cell.children].forEach((child) => contentElements.push(child));
      }
    });
    row.remove();
  });

  // Rebuild: picture first, then a single content div
  if (picture) {
    block.append(picture);
  }

  if (contentElements.length) {
    const contentDiv = document.createElement('div');
    contentElements.forEach((el) => contentDiv.append(el));
    block.append(contentDiv);
  }
}
