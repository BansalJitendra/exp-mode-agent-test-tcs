export default function decorate(block) {
  const rows = [...block.children];
  let picture = null;
  let videoSrc = null;
  const contentElements = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      const videoLink = cell.querySelector('a[href$=".mp4"], a[href$=".webm"]');

      if (videoLink) {
        videoSrc = videoLink.href;
        if (pic) picture = pic;
      } else if (pic && !cell.textContent.trim().replace(pic.textContent, '').trim()) {
        picture = pic;
      } else {
        [...cell.children].forEach((child) => contentElements.push(child));
      }
    });
    row.remove();
  });

  if (videoSrc) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.setAttribute('muted', '');
    video.loop = true;
    video.playsInline = true;
    if (picture) {
      const img = picture.querySelector('img');
      if (img) video.poster = img.src;
    }
    const source = document.createElement('source');
    source.src = videoSrc;
    source.type = 'video/mp4';
    video.append(source);
    block.append(video);
    block.classList.add('hero-video');
  } else if (picture) {
    block.append(picture);
  }

  if (contentElements.length) {
    const contentDiv = document.createElement('div');
    contentElements.forEach((el) => contentDiv.append(el));
    block.append(contentDiv);
  }
}
