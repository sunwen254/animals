// gallery-accordion.js - 3D波纹百叶窗手风琴轮播
const accordionItems = Array.from(document.querySelectorAll('.accordion-3d-item'));
const carousel = document.getElementById('accordion3dCarousel');
let accordionActive = 2;
function updateAccordion(pos) {
  accordionItems.forEach((item, i) => {
    item.classList.remove('active','left','right','far-left','far-right');
    if (i === pos) item.classList.add('active');
    else if (i === pos-1) item.classList.add('left');
    else if (i === pos+1) item.classList.add('right');
    else if (i === pos-2) item.classList.add('far-left');
    else if (i === pos+2) item.classList.add('far-right');
  });
}
updateAccordion(accordionActive);
accordionItems.forEach((item,i)=>{
  item.onmouseenter = ()=>{ updateAccordion(i); };
});
carousel.onmouseleave = ()=>{ updateAccordion(accordionActive); };
carousel.onclick = e => {
  const idx = accordionItems.indexOf(e.target.closest('.accordion-3d-item'));
  if (idx !== -1) accordionActive = idx;
  updateAccordion(accordionActive);
}; 