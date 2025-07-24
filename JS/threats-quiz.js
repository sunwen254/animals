// threats-quiz.js - 极地动物威胁知识问答游戏
const quizData = [
  {
    question: '全球变暖对北极熊的最大威胁是什么？',
    options: ['海冰减少', '食物短缺', '环境污染', '外来物种入侵'],
    answer: 0,
    explain: '全球变暖导致北极海冰减少，直接影响北极熊的捕猎和生存。'
  },
  {
    question: '下列哪项不是极地动物面临的主要威胁？',
    options: ['气候变化', '环境污染', '过度捕猎', '森林砍伐'],
    answer: 3,
    explain: '森林砍伐主要影响热带和温带地区，极地动物主要受气候、污染、捕猎等威胁。'
  },
  {
    question: '塑料污染对极地动物的影响主要体现在？',
    options: ['影响繁殖', '影响免疫系统', '进入食物链', '以上都是'],
    answer: 3,
    explain: '塑料污染会影响繁殖、免疫系统，并通过食物链影响顶级掠食者。'
  },
  {
    question: '外来物种入侵会带来哪些问题？',
    options: ['捕食本地物种', '破坏栖息地', '引入新疾病', '以上都是'],
    answer: 3,
    explain: '外来物种可能捕食本地物种、破坏栖息地或引入新疾病。'
  },
  {
    question: '人类活动对极地生态的影响不包括？',
    options: ['噪音污染', '石油泄漏', '旅游干扰', '增加海冰面积'],
    answer: 3,
    explain: '人类活动不会增加海冰面积，反而因开发等导致生态压力。'
  }
];

let current = 0;
let score = 0;

function renderQuiz() {
  const q = quizData[current];
  document.getElementById('quiz-question').textContent = `Q${current + 1}：${q.question}`;
  const optionsDiv = document.getElementById('quiz-options');
  optionsDiv.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.textContent = opt;
    btn.onclick = () => selectOption(idx);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next-btn').style.display = 'none';
}

function selectOption(idx) {
  const q = quizData[current];
  const feedback = document.getElementById('quiz-feedback');
  const optionBtns = document.querySelectorAll('.quiz-option-btn');
  optionBtns.forEach(btn => btn.disabled = true);
  if (idx === q.answer) {
    feedback.textContent = '回答正确！' + (q.explain ? ' ' + q.explain : '');
    feedback.className = 'quiz-feedback correct';
    score++;
  } else {
    feedback.textContent = '回答错误。' + (q.explain ? ' ' + q.explain : '');
    feedback.className = 'quiz-feedback';
  }
  document.getElementById('quiz-next-btn').style.display = 'inline-block';
  if (current === quizData.length - 1) {
    document.getElementById('quiz-next-btn').textContent = '查看成绩';
  } else {
    document.getElementById('quiz-next-btn').textContent = '下一题';
  }
}

document.getElementById('quiz-next-btn').onclick = function() {
  current++;
  if (current < quizData.length) {
    renderQuiz();
  } else {
    showScore();
  }
};

function showScore() {
  document.getElementById('quiz-question').textContent = '答题结束！';
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-feedback').textContent = '';
  document.getElementById('quiz-next-btn').style.display = 'none';
  document.getElementById('quiz-score').textContent = `您的得分：${score} / ${quizData.length}。${score === quizData.length ? '太棒了！全部答对！' : '可以再试试哦~'}`;
}

document.addEventListener('DOMContentLoaded', function() {
  renderQuiz();
}); 