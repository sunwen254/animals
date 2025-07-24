// 数据可视化倒计时动画
function animateCount(id, from, to, duration) {
  const el = document.getElementById(id);
  if(!el) return;
  let start = null;
  function step(ts) {
    if(!start) start = ts;
    const progress = Math.min((ts-start)/duration,1);
    const value = Math.floor(from + (to-from)*progress);
    el.textContent = value;
    if(progress<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// 示例：数字跳动强化紧迫感
setTimeout(()=>{
  animateCount('polarBearNum',25000,24780,3200);
  animateCount('penguinNum',220000,219200,3200);
  animateCount('whaleNum',12000,11920,3200);
}, 1200); 

// 冰川消融倒计时动画
let glacierSeconds = 754; // 示例剩余秒数
function updateGlacierCountdown() {
  const el = document.getElementById('glacierCountdown');
  if (!el) return;
  let s = glacierSeconds;
  let h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
  el.textContent = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  // 进度条动画
  const progress = document.getElementById('glacierProgress');
  if(progress) progress.style.width = (s/1000*100).toFixed(1) + '%';
  if (glacierSeconds > 0) glacierSeconds--;
}
setInterval(updateGlacierCountdown, 1000);
updateGlacierCountdown();

// 北极熊数量动态递减
let polarBearNum = 25000;
function updatePolarBearNum() {
  const el = document.getElementById('polarBearNumBig');
  if (!el) return;
  el.textContent = polarBearNum;
  if (polarBearNum > 24000) polarBearNum -= Math.floor(Math.random()*2); // 模拟递减
}
setInterval(updatePolarBearNum, 2000);
updatePolarBearNum();

// 捐款金额动态增长
let donateAmount = 0;
function updateDonateAmount() {
  const el = document.getElementById('donateAmount');
  if (!el) return;
  donateAmount += Math.floor(Math.random()*100+50);
  el.textContent = donateAmount.toLocaleString();
  // 进度条
  const progress = document.getElementById('donateProgress');
  if(progress) progress.style.width = Math.min(donateAmount/100000*100,100) + '%';
}
setInterval(updateDonateAmount, 1500);
updateDonateAmount();

// 成果区数字动态增长
let penguinRate = 0;
function updatePenguinRate() {
  const el = document.getElementById('penguinRate');
  if (!el) return;
  if (penguinRate < 37) {
    penguinRate++;
    el.textContent = `+${penguinRate}%`;
  }
}
setInterval(updatePenguinRate, 80);

// 横向滑动功能卡片
const cards = document.querySelector('.function-cards');
if(cards) {
  cards.addEventListener('wheel', e => {
    if(Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
    e.preventDefault();
    cards.scrollLeft += e.deltaX;
  }, {passive:false});
}

// 故事卡片hover音频和点击展开
const storyCards = document.querySelectorAll('.story-card');
storyCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    // 播放音频，路径留空
    // let audio = new Audio(''); audio.play();
  });
  card.addEventListener('mouseleave', () => {
    // 停止音频
    // audio.pause();
  });
  card.addEventListener('click', () => {
    alert('展开完整故事（此处可弹窗展示）');
  });
});

// 新闻卡片点击弹出视频浮层
const newsCovers = document.querySelectorAll('.news-cover');
newsCovers.forEach(cover => {
  cover.addEventListener('click', () => {
    // 创建浮层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    // 视频元素
    const video = document.createElement('video');
    video.src = '';
    video.controls = true;
    video.autoplay = true;
    video.style.width = '320px';
    video.style.borderRadius = '16px';
    overlay.appendChild(video);
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.body.appendChild(overlay);
    video.onended = () => document.body.removeChild(overlay);
  });
});

// 保护知识问答交互
const qaBlock = document.querySelector('.qa-block');
if(qaBlock) {
  qaBlock.addEventListener('click', () => {
    const answer = prompt('你知道哪项行动能直接帮助极地动物？\nA.减少碳排放 B.购买野生动物制品 C.乱扔垃圾');
    if(answer && answer.trim().toUpperCase() === 'A') {
      alert('答对啦！已为你生成守护证书！');
      // 这里可生成证书图片或弹窗
    } else {
      alert('再想想哦！');
    }
  });
} 

// 拼图块点击弹窗
const puzzleBlocks = document.querySelectorAll('.achievement-puzzle img');
puzzleBlocks.forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;
    const modal = document.createElement('div');
    modal.style.background = '#fff';
    modal.style.borderRadius = '16px';
    modal.style.padding = '32px 24px';
    modal.style.maxWidth = '340px';
    modal.style.boxShadow = '0 4px 24px #1976d2cc';
    modal.innerHTML = '<div style="font-weight:bold;color:#1976d2;font-size:1.1em;margin-bottom:10px;">冰川修复区：3年努力，冰层增厚2米</div><div style="color:#3a3a3a;font-size:1em;margin-bottom:8px;">修复故事：科学家和志愿者团队持续监测与修复，极地生态逐步恢复。</div><div style="color:#888;font-size:0.96em;">科考团队：极地守护者联盟</div>';
    overlay.appendChild(modal);
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  });
}); 