// aurora-effect.js - SVG极光动画
function createAuroraSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'aurora-svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 1200 120');
  svg.innerHTML = `
    <defs>
      <linearGradient id="aurora-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#7fffd4"/>
        <stop offset="40%" stop-color="#38bdf8"/>
        <stop offset="80%" stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#f472b6"/>
      </linearGradient>
    </defs>
    <path id="aurora-path" fill="url(#aurora-gradient)" opacity="0.7" d="M0,80 Q300,40 600,80 T1200,80 V120 H0Z"/>
  `;
  return svg;
}

function animateAurora() {
  const path = document.getElementById('aurora-path');
  if (!path) return;
  let t = 0;
  function animate() {
    t += 0.03;
    // 动态生成Q点和T点的y值，制造波动感
    const qy = 40 + Math.sin(t) * 18 + Math.cos(t*0.7) * 10;
    const ty = 80 + Math.sin(t*0.6) * 16 - Math.cos(t*0.9) * 8;
    path.setAttribute('d', `M0,80 Q300,${qy} 600,${ty} T1200,80 V120 H0Z`);
    requestAnimationFrame(animate);
  }
  animate();
}

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.aurora-effect');
  if (container) {
    container.appendChild(createAuroraSVG());
    setTimeout(animateAurora, 100);
  }
}); 