// gallery-3d.js - 3D图片轮播
const slides = Array.from(document.querySelectorAll('.carousel-3d-slide'));
let current3d = 0;
function update3dCarousel() {
  slides.forEach((slide, i) => {
    const offset = i - current3d;
    slide.classList.toggle('active', i === current3d);
    slide.style.transform = `translate(-50%,-50%) rotateY(${offset*40}deg) translateZ(${Math.max(0,180-Math.abs(offset)*60)}px) scale(${i===current3d?1:0.85})`;
    slide.style.opacity = Math.abs(offset) > 2 ? 0 : (i===current3d?1:0.7);
    slide.style.zIndex = 3-Math.abs(offset);
    slide.style.pointerEvents = i===current3d?'auto':'none';
  });
}
document.querySelector('.carousel-3d-prev').onclick = function() {
  current3d = (current3d - 1 + slides.length) % slides.length;
  update3dCarousel();
};
document.querySelector('.carousel-3d-next').onclick = function() {
  current3d = (current3d + 1) % slides.length;
  update3dCarousel();
};
update3dCarousel(); 