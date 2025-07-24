// threats-modules.js - 悬浮互动入口与模块切换
const floatingBtn = document.getElementById('floatingInteractBtn');
const sidebar = document.getElementById('interactSidebar');
const sidebarClose = document.getElementById('interactSidebarClose');
const navBtns = document.querySelectorAll('.interact-nav-btn');
const modules = document.querySelectorAll('.interact-module');

function showModule(moduleId) {
  modules.forEach(m => m.classList.remove('active'));
  document.getElementById('module-' + moduleId).classList.add('active');
  navBtns.forEach(btn => btn.classList.remove('active'));
  document.querySelector('.interact-nav-btn[data-target="' + moduleId + '"]').classList.add('active');
  // 切换时初始化内容
  if (moduleId === 'match') renderMatchGame();
  if (moduleId === 'fast') renderFastQuiz();
}

if (floatingBtn && sidebar) {
  floatingBtn.onclick = function() {
    sidebar.classList.toggle('active');
    // 默认显示第一个模块
    if (sidebar.classList.contains('active')) showModule('quiz');
  };
}
if (sidebarClose) {
  sidebarClose.onclick = function() {
    sidebar.classList.remove('active');
  };
}
navBtns.forEach(btn => {
  btn.onclick = function() {
    showModule(btn.getAttribute('data-target'));
  };
});
// 页面加载默认显示知识问答
showModule('quiz');

// --- 极地动物连连看 ---
const matchPairs = [
  { animal: '北极熊', threat: '海冰减少' },
  { animal: '帝企鹅', threat: '繁殖地丧失' },
  { animal: '北极狐', threat: '外来物种入侵' },
  { animal: '鲸鱼', threat: '环境污染' }
];
let matchState = { selectedAnimal: null, matched: [] };
function renderMatchGame() {
  const area = document.getElementById('match-game-area');
  if (!area) return;
  area.innerHTML = '';
  // 随机打乱
  const animals = matchPairs.map(p => p.animal).sort(() => Math.random() - 0.5);
  const threats = matchPairs.map(p => p.threat).sort(() => Math.random() - 0.5);
  const col1 = document.createElement('div'); col1.className = 'match-col';
  const col2 = document.createElement('div'); col2.className = 'match-col';
  animals.forEach(animal => {
    const btn = document.createElement('div');
    btn.className = 'match-item';
    btn.textContent = animal;
    btn.onclick = () => selectAnimal(animal, btn);
    if (matchState.matched.find(m => m.animal === animal)) btn.classList.add('matched');
    col1.appendChild(btn);
  });
  threats.forEach(threat => {
    const btn = document.createElement('div');
    btn.className = 'match-target';
    btn.textContent = threat;
    btn.onclick = () => selectThreat(threat, btn);
    if (matchState.matched.find(m => m.threat === threat)) btn.classList.add('matched');
    col2.appendChild(btn);
  });
  area.appendChild(col1); area.appendChild(col2);
  document.getElementById('match-feedback').textContent = '';
}
function selectAnimal(animal, btn) {
  if (btn.classList.contains('matched')) return;
  document.querySelectorAll('.match-item').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  matchState.selectedAnimal = animal;
}
function selectThreat(threat, btn) {
  if (btn.classList.contains('matched') || !matchState.selectedAnimal) return;
  const pair = matchPairs.find(p => p.animal === matchState.selectedAnimal && p.threat === threat);
  if (pair) {
    matchState.matched.push(pair);
    renderMatchGame();
    document.getElementById('match-feedback').textContent = '配对正确！';
    document.getElementById('match-feedback').style.color = '#22c55e';
  } else {
    document.getElementById('match-feedback').textContent = '配对错误，请重试。';
    document.getElementById('match-feedback').style.color = '#e67c73';
  }
  matchState.selectedAnimal = null;
  document.querySelectorAll('.match-item').forEach(b => b.classList.remove('selected'));
  if (matchState.matched.length === matchPairs.length) {
    document.getElementById('match-feedback').textContent = '全部配对成功！';
    document.getElementById('match-feedback').style.color = '#22c55e';
  }
}
document.getElementById('match-restart-btn').onclick = function() {
  matchState = { selectedAnimal: null, matched: [] };
  renderMatchGame();
};
// --- 快问快答 ---
const fastQuizData = [
  { q: '北极熊主要依赖什么生存？', o: ['海冰', '森林', '沙漠', '草原'], a: 0 },
  { q: '极地动物面临的最大威胁是？', o: ['气候变化', '森林砍伐', '城市扩张', '过度放牧'], a: 0 },
  { q: '企鹅属于哪类动物？', o: ['哺乳动物', '鸟类', '爬行动物', '鱼类'], a: 1 },
  { q: '鲸鱼的主要威胁是？', o: ['环境污染', '过度捕猎', '气候变化', '以上都是'], a: 3 },
  { q: '北极狐冬季毛色？', o: ['白色', '灰色', '棕色', '黑色'], a: 0 }
];
let fastIdx = 0, fastScore = 0, fastTimer = null, fastTime = 0;
function renderFastQuiz() {
  const q = fastQuizData[fastIdx];
  document.getElementById('fastquiz-question').textContent = `Q${fastIdx+1}：${q.q}`;
  const opts = document.getElementById('fastquiz-options');
  opts.innerHTML = '';
  q.o.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'fastquiz-option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectFastOption(i);
    opts.appendChild(btn);
  });
  document.getElementById('fastquiz-feedback').textContent = '';
  document.getElementById('fastquiz-score').textContent = '';
  document.getElementById('fastquiz-restart-btn').style.display = 'none';
  document.getElementById('fastquiz-timer').textContent = '剩余时间：30秒';
  fastTime = 30;
  if (fastTimer) clearInterval(fastTimer);
  fastTimer = setInterval(() => {
    fastTime--;
    document.getElementById('fastquiz-timer').textContent = `剩余时间：${fastTime}秒`;
    if (fastTime <= 0) endFastQuiz();
  }, 1000);
}
function selectFastOption(idx) {
  const q = fastQuizData[fastIdx];
  const btns = document.querySelectorAll('.fastquiz-option-btn');
  btns.forEach(b => b.disabled = true);
  if (idx === q.a) {
    fastScore++;
    document.getElementById('fastquiz-feedback').textContent = '正确！';
    document.getElementById('fastquiz-feedback').style.color = '#22c55e';
  } else {
    document.getElementById('fastquiz-feedback').textContent = '错误！';
    document.getElementById('fastquiz-feedback').style.color = '#e67c73';
  }
  setTimeout(() => {
    fastIdx++;
    if (fastIdx < fastQuizData.length && fastTime > 0) {
      renderFastQuiz();
    } else {
      endFastQuiz();
    }
  }, 700);
}
function endFastQuiz() {
  if (fastTimer) clearInterval(fastTimer);
  document.getElementById('fastquiz-question').textContent = '快问快答结束！';
  document.getElementById('fastquiz-options').innerHTML = '';
  document.getElementById('fastquiz-timer').textContent = '';
  document.getElementById('fastquiz-feedback').textContent = '';
  document.getElementById('fastquiz-score').textContent = `得分：${fastScore} / ${fastQuizData.length}`;
  document.getElementById('fastquiz-restart-btn').style.display = 'inline-block';
}
document.getElementById('fastquiz-restart-btn').onclick = function() {
  fastIdx = 0; fastScore = 0; fastTime = 30;
  renderFastQuiz();
};
// 初始化
if (document.getElementById('module-match')) renderMatchGame();
if (document.getElementById('module-fast')) renderFastQuiz(); 