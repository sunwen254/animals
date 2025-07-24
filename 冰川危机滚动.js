// 滚动驱动区块淡入动效
function onScrollFadeInSections() {
  const sections = document.querySelectorAll('.ice-section, .ice-fact-section');
  const wh = window.innerHeight;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if(rect.top < wh*0.85) {
      sec.classList.add('visible');
      // 懒加载图片
      const img = sec.querySelector('img.hidden');
      if(img) img.classList.remove('hidden');
    }
  });
}
window.addEventListener('scroll', onScrollFadeInSections);
window.addEventListener('resize', onScrollFadeInSections); 