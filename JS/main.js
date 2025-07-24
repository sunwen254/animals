// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 雪花动画
(function snowInit() {
  if (document.querySelector('.snowfall-layer')) return;
  const snowLayer = document.createElement('div');
  snowLayer.className = 'snowfall-layer';
  document.body.appendChild(snowLayer);
  const snowChars = ['❄','✻','✼','❅','❆'];
  function random(min, max) { return Math.random() * (max - min) + min; }
  function createSnowflake() {
    const snow = document.createElement('span');
    snow.className = 'snowflake';
    snow.textContent = snowChars[Math.floor(Math.random()*snowChars.length)];
    snow.style.left = random(0, 100) + 'vw';
    snow.style.fontSize = random(16, 32) + 'px';
    snow.style.opacity = random(0.6, 1);
    snow.style.animationDuration = random(4, 10) + 's';
    snow.style.animationDelay = random(0, 2) + 's';
    snowLayer.appendChild(snow);
    // 动画
    const duration = parseFloat(snow.style.animationDuration);
    const start = Date.now();
    function fall() {
      const elapsed = (Date.now() - start) / 1000;
      const percent = elapsed / duration;
      if (percent < 1) {
        snow.style.top = (percent * 100) + 'vh';
        snow.style.transform = `translateX(${Math.sin(percent*6)*20}px)`;
        requestAnimationFrame(fall);
      } else {
        snow.remove();
      }
    }
    fall();
  }
  setInterval(() => {
    if (document.querySelectorAll('.snowflake').length < 40) createSnowflake();
  }, 350);
})();

// 数据统计卡片数字动画
if(document.querySelector('.stats-flip-cards')){
  document.querySelectorAll('.stats-flip-cards .stat-value').forEach(el=>{
    const target = parseInt(el.getAttribute('data-target'));
    let n = 0;
    const step = Math.max(1, Math.floor(target/40));
    function grow(){
      if(n<target){ n+=step; el.textContent = n; setTimeout(grow, 18);}
      else{ el.textContent = target; }
    }
    grow();
  });
  // 新增：点击卡片翻转
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // 防止多次冒泡
      if(e.target.closest('.flip-card-inner')){
        this.querySelector('.flip-card-inner').classList.toggle('flipped');
      }
    });
  });
  // 为翻转后按钮添加点击事件
  document.querySelectorAll('.stat-back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      let msg = '';
      if(this.textContent.includes('了解更多')){
        msg = '极地保护项目涵盖科研、救助、宣传、国际合作等多方面，欢迎加入我们的行动！';
      } else if(this.textContent.includes('动物故事')){
        msg = '每一只受益动物背后都有感人的故事，欢迎关注我们的公众号了解更多案例。';
      } else if(this.textContent.includes('成为志愿者')){
        msg = '欢迎报名成为极地保护志愿者！请访问“联系我们”页面填写申请表。';
      } else {
        msg = '感谢您的关注与支持！';
      }
      // 使用自定义模态弹窗
      const modal = document.getElementById('stat-modal');
      const msgBox = modal.querySelector('.stat-modal-message');
      msgBox.innerHTML = msg;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      e.stopPropagation();
    });
  });
  // 关闭自定义弹窗
  const statModal = document.getElementById('stat-modal');
  if(statModal){
    statModal.querySelector('.stat-modal-close').onclick = function(){
      statModal.classList.remove('active');
      document.body.style.overflow = '';
    };
    statModal.onclick = function(e){
      if(e.target === statModal){
        statModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    };
  }
}

// 地图动物弹窗功能
if(document.querySelector('.animal-modal')){
  const animalData = {
    'polar-bear': { title: '北极熊', img: './static/images/北极熊.jpg', population: '约26000只', status: '易危(VU)', threats: '海冰消融、食物短缺、环境污染', desc: '北极熊是北极地区的顶级掠食者，依赖海冰捕猎海豹。随着全球变暖导致北极海冰面积减少，它们的栖息地不断萎缩，生存面临严重威胁。' },
    'arctic-fox': { title: '北极狐', img: './static/images/北极狐.jpg', population: '约100000只', status: '无危(LC)', threats: '气候变化、食物竞争、栖息地破坏', desc: '北极狐适应了极端寒冷的环境，拥有浓密的白色皮毛。随着北极变暖，赤狐向北扩张，与北极狐形成竞争，导致其生存空间被压缩。' },
    'walrus': { title: '海象', img: './static/images/海豹.jpg', population: '约230000只', status: '易危(VU)', threats: '海冰消失、人类活动干扰、食物减少', desc: '海象依赖海冰休息和繁殖。随着海冰减少，它们被迫聚集在岸边，导致拥挤和资源竞争，幼崽存活率下降。' },
    'emperor-penguin': { title: '帝企鹅', img: './static/images/帝企鹅.jpg', population: '约595000只', status: '濒危(EN)', threats: '海冰不稳定、气候变化、食物短缺', desc: '帝企鹅是最大的企鹅物种，仅分布在南极。它们依赖稳定的海冰繁殖，气温上升导致海冰提前破裂，幼鸟存活率大幅下降。' },
    'adelie-penguin': { title: '阿德利企鹅', img: './static/images/帝企鹅.jpg', population: '约3790000对', status: '易危(VU)', threats: '栖息地丧失、磷虾减少、气候变暖', desc: '阿德利企鹅以磷虾为主要食物。南极升温导致海冰减少，磷虾数量下降，同时天敌增加，导致其种群数量急剧减少。' },
    'antarctic-seal': { title: '南极海豹', img: './static/images/海豹.jpg', population: '约7500000只', status: '近危(NT)', threats: '气候变化、海洋污染、渔业竞争', desc: '南极海豹包括多种物种，是南极生态系统的重要组成部分。海冰减少直接影响其生存环境，导致栖息地丧失。' }
  };
  const modal = document.querySelector('.animal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImg = document.getElementById('modal-img');
  const modalPopulation = document.getElementById('modal-population');
  const modalStatus = document.getElementById('modal-status');
  const modalThreats = document.getElementById('modal-threats');
  const modalDesc = document.getElementById('modal-desc');
  const closeButtons = document.querySelectorAll('.close-modal, .close-btn');

  document.querySelectorAll('.animal-icon').forEach(icon => {
    icon.onclick = function() {
      const animalId = this.getAttribute('data-animal');
      const animal = animalData[animalId];
      if(animal){
        modalTitle.textContent = animal.title;
        modalImg.src = animal.img;
        modalPopulation.textContent = animal.population;
        modalStatus.textContent = animal.status;
        modalThreats.textContent = animal.threats;
        modalDesc.textContent = animal.desc;
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };
  });
  closeButtons.forEach(btn => {
    btn.onclick = function() {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    };
  });
  modal.onclick = function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }, 300);
    }
  };
}

// 动态分割条特效
(function dividerEffect(){
  const canvas = document.getElementById('divider-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  let t = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // 渐变色
    const grad = ctx.createLinearGradient(0,0,canvas.width,0);
    grad.addColorStop(0, '#38bdf8');
    grad.addColorStop(0.5, '#a78bfa');
    grad.addColorStop(1, '#f472b6');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    for(let x=0;x<=canvas.width;x+=4){
      const y = canvas.height/2 + Math.sin((x/120)+t)*18 + Math.cos((x/60)-t*1.2)*8;
      if(x===0) ctx.moveTo(x,y);
      else ctx.lineTo(x,y);
    }
    ctx.stroke();
    t += 0.03;
    requestAnimationFrame(draw);
  }
  draw();
})();

// 标题波动动画
(function titleWaveEffect(){
  const title = document.getElementById('stats-flip-title');
  if(!title) return;
  let t = 0;
  function animate(){
    t += 0.03;
    const y = Math.sin(t) * 12 + Math.cos(t*1.2) * 6;
    title.style.transform = `translateY(${y}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();