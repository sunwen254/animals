// threats-interact.js - 极地保护承诺墙互动模块
const promiseForm = document.getElementById('promise-form');
const promiseInput = document.getElementById('promise-input');
const promiseWallList = document.getElementById('promise-wall-list');

let promiseArr = [];

function renderPromiseWall() {
  promiseWallList.innerHTML = '';
  promiseArr.slice(-10).forEach(item => {
    const div = document.createElement('div');
    div.className = 'promise-item';
    div.textContent = item;
    promiseWallList.appendChild(div);
  });
  promiseWallList.scrollTop = promiseWallList.scrollHeight;
}

if (promiseForm) {
  promiseForm.onsubmit = function(e) {
    e.preventDefault();
    const val = promiseInput.value.trim();
    if (val) {
      promiseArr.push(val);
      renderPromiseWall();
      promiseInput.value = '';
    }
  };
} 