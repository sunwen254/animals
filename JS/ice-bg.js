// ice-bg.js - 平铺大冰面+多向裂纹+始终最底层
(function(){
const canvas = document.getElementById('ice-bg-canvas') || document.createElement('canvas');
canvas.id = 'ice-bg-canvas';
if (!document.getElementById('ice-bg-canvas')) document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
let cracks = [];
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawIceTiled();
  cracks.forEach(drawCrack);
}
function drawIceTiled() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // 平铺六边形冰块
  const w = canvas.width, h = canvas.height;
  const size = 120, dx = size * 3/2, dy = Math.sqrt(3) * size;
  for(let y=0; y<h+dy; y+=dy) {
    for(let x=0; x<w+dx; x+=dx) {
      let offset = ((Math.floor(y/dy))%2) ? size*0.75 : 0;
      drawHex(x+offset, y, size);
    }
  }
  // 冰面高光
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.ellipse(w/2, h*0.22, w*0.38, h*0.09, 0, 0, Math.PI*2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.restore();
}
function drawHex(cx, cy, r) {
  ctx.save();
  ctx.beginPath();
  for(let i=0;i<6;i++){
    let angle = Math.PI/3*i-Math.PI/6;
    let x = cx + r*Math.cos(angle);
    let y = cy + r*Math.sin(angle);
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  }
  ctx.closePath();
  // 渐变色
  const grad = ctx.createLinearGradient(cx, cy-r, cx, cy+r);
  grad.addColorStop(0,'rgba(180,220,255,0.82)');
  grad.addColorStop(0.5,'rgba(120,180,255,0.38)');
  grad.addColorStop(1,'rgba(180,220,255,0.82)');
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(80,180,255,0.10)';
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;
  // 六边形边缘
  ctx.strokeStyle = 'rgba(120,180,255,0.22)';
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.restore();
}
function drawCrack(crack) {
  ctx.save();
  ctx.strokeStyle = 'rgba(80,120,180,0.85)';
  ctx.lineWidth = 2.2;
  for(let branch of crack.branches){
    ctx.beginPath();
    ctx.moveTo(crack.x, crack.y);
    for(let i=0;i<branch.length;i++){
      ctx.lineTo(branch[i].x, branch[i].y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function addCrack(x,y) {
  // 8个方向分支裂纹
  let branches = [];
  for(let d=0;d<8;d++){
    let lines = [];
    let angle = d*Math.PI/4 + (Math.random()-0.5)*0.18;
    let len = 60+Math.random()*60;
    let segs = 5+Math.floor(Math.random()*3);
    let px = x, py = y;
    for(let i=0;i<segs;i++){
      angle += (Math.random()-0.5)*0.4;
      let l = len*(0.7+Math.random()*0.3)/segs;
      px += Math.cos(angle)*l;
      py += Math.sin(angle)*l;
      lines.push({x:px,y:py});
    }
    branches.push(lines);
  }
  cracks.push({x,y,branches});
  drawIceTiled();
  cracks.forEach(drawCrack);
}
// canvas始终最底层且可点
canvas.style.position = 'fixed';
canvas.style.left = '0';
canvas.style.top = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '0';
canvas.style.pointerEvents = 'auto';
canvas.style.background = 'transparent';
canvas.style.opacity = '0.92';
// 只监听canvas自身点击
canvas.addEventListener('click',function(e){
  const rect = canvas.getBoundingClientRect();
  addCrack(e.clientX-rect.left, e.clientY-rect.top);
});
window.addEventListener('resize',resize);
resize();
})(); 