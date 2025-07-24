// gallery-timeline.js - 动物知识时间轴
const timelineList = document.getElementById('timelineList');
const timelineImg = document.getElementById('timelineImg');
const timelineImgCaption = document.getElementById('timelineImgCaption');
const timelineItems = Array.from(timelineList.querySelectorAll('li'));
const timelineUp = document.querySelector('.timeline-up');
const timelineDown = document.querySelector('.timeline-down');
let timelineIdx = 0;
function showTimeline(idx) {
  timelineItems.forEach((li,i)=>li.classList.toggle('active',i===idx));
  const li = timelineItems[idx];
  timelineImg.src = './static/images/' + li.getAttribute('data-img');
  timelineImg.alt = li.textContent;
  timelineImgCaption.textContent = li.textContent;
}
timelineItems.forEach((li,i)=>{
  li.onclick = ()=>{ timelineIdx=i; showTimeline(i); };
});
timelineUp.onclick = ()=>{
  timelineIdx = (timelineIdx-1+timelineItems.length)%timelineItems.length;
  showTimeline(timelineIdx);
};
timelineDown.onclick = ()=>{
  timelineIdx = (timelineIdx+1)%timelineItems.length;
  showTimeline(timelineIdx);
};
showTimeline(0); 