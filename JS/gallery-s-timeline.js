// gallery-s-timeline.js - S型时间轴
const sNodes = Array.from(document.querySelectorAll('.s-timeline-node'));
const sImg = document.getElementById('sTimelineImg');
const sCaption = document.getElementById('sTimelineImgCaption');
// S型曲线分布
const sY = [0, 90, 210, 330, 430];
const sX = [0, 30, -30, 30, 0];
sNodes.forEach((node,i)=>{
  node.style.top = sY[i]+"px";
  node.style.left = `calc(50% + ${sX[i]}px)`;
  node.onmouseenter = ()=>{
    sNodes.forEach(n=>n.classList.remove('active'));
    node.classList.add('active');
    sImg.src = './static/images/' + node.getAttribute('data-img');
    sImg.alt = node.textContent;
    sCaption.textContent = node.getAttribute('data-caption');
    sImg.classList.add('active');
  };
  node.onmouseleave = ()=>{
    sImg.classList.remove('active');
  };
});
sNodes[0].classList.add('active'); 