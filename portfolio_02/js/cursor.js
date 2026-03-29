/* ─── Custom Cursor ─── */
(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let fx = window.innerWidth / 2;
  let fy = window.innerHeight / 2;
  let cx = fx, cy = fy;

  document.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  // Smooth follower
  function updateFollower() {
    fx += (cx - fx) * 0.12;
    fy += (cy - fy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Hover state for interactive elements
  const hoverEls = document.querySelectorAll('a, button, .skill-chip, .project-card, .contact-item, input, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
})();
