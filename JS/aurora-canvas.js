// 顶部极光动画
const aurora = document.getElementById('aurora-canvas');
if(aurora){
  aurora.width = window.innerWidth;
  aurora.height = 180;
  const ctx = aurora.getContext('2d');
  function drawAurora(){
    ctx.clearRect(0,0,aurora.width,aurora.height);
    for(let i=0;i<3;i++){
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.12*i;
      let grad = ctx.createLinearGradient(0,0,aurora.width,aurora.height);
      grad.addColorStop(0,'#00eaff');
      grad.addColorStop(0.3,'#aeefff');
      grad.addColorStop(0.7,'#b8f7d4');
      grad.addColorStop(1,'#fffbe6');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0,100+Math.sin(Date.now()/1200+i*2)*18);
      for(let x=0;x<=aurora.width;x+=16){
        let y = 100 + Math.sin(Date.now()/1200 + x/180 + i*2)*18 + Math.cos(Date.now()/900 + x/300 + i)*12;
        ctx.lineTo(x,y);
      }
      ctx.lineTo(aurora.width,aurora.height);
      ctx.lineTo(0,aurora.height);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    requestAnimationFrame(drawAurora);
  }
  drawAurora();
  window.addEventListener('resize',()=>{
    aurora.width = window.innerWidth;
  });
} 