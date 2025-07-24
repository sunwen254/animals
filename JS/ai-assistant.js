// AI助手入口弹窗
const btn = document.querySelector('.ai-assistant-btn');
if(btn){
  let panel = document.createElement('div');
  panel.className = 'ai-assistant-panel';
  panel.innerHTML = `
    <div class='ai-assistant-header'>极地动物百科AI助手 <span class='ai-assistant-close'>×</span></div>
    <div class='ai-assistant-body'><div class='ai-msg ai-msg-bot'>你好，我是极地百科AI助手，有什么想了解的吗？</div></div>
    <div class='ai-assistant-input'><input type='text' placeholder='请输入问题...'><button>发送</button></div>
  `;
  document.body.appendChild(panel);
  panel.style.display = 'none';
  btn.onclick = ()=>{ panel.style.display = 'block'; };
  panel.querySelector('.ai-assistant-close').onclick = ()=>{ panel.style.display = 'none'; };
  const input = panel.querySelector('input');
  const sendBtn = panel.querySelector('button');
  const body = panel.querySelector('.ai-assistant-body');
  function reply(msg){
    // 简单静态问答
    let answer = '很抱歉，我暂时只能回答极地动物相关问题。';
    if(/北极熊|polar bear/.test(msg)) answer = '北极熊是北极地区的顶级掠食者，主要以海豹为食。';
    if(/企鹅|penguin/.test(msg)) answer = '企鹅生活在南极，是不会飞但善于游泳的鸟类。';
    if(/北极狐|arctic fox/.test(msg)) answer = '北极狐拥有季节性换毛能力，能在极寒环境生存。';
    if(/鲸鱼|whale/.test(msg)) answer = '鲸鱼是极地海洋中体型最大的动物，寿命极长。';
    if(/海豹|seal/.test(msg)) answer = '海豹适应寒冷水域，善于游泳和潜水。';
    setTimeout(()=>{
      body.innerHTML += `<div class='ai-msg ai-msg-bot'>${answer}</div>`;
      body.scrollTop = body.scrollHeight;
    }, 600);
  }
  sendBtn.onclick = ()=>{
    const val = input.value.trim();
    if(val){
      body.innerHTML += `<div class='ai-msg ai-msg-user'>${val}</div>`;
      body.scrollTop = body.scrollHeight;
      reply(val);
      input.value = '';
    }
  };
  input.onkeydown = e=>{ if(e.key==='Enter') sendBtn.onclick(); };
}
// 样式
const style = document.createElement('style');
style.innerHTML = `
.ai-assistant-btn{position:fixed;right:32px;bottom:32px;z-index:9999;background:#fffbe6;border-radius:50%;box-shadow:0 2px 12px #b8a77a88;width:64px;height:64px;display:flex;align-items:center;justify-content:center;font-size:2.2rem;cursor:pointer;transition:box-shadow 0.2s;}
.ai-assistant-btn:hover{box-shadow:0 4px 24px #7a5c3688;}
.ai-assistant-panel{position:fixed;right:32px;bottom:110px;width:340px;background:#fffbe6;border-radius:18px;box-shadow:0 8px 32px #b8a77a88;z-index:99999;display:flex;flex-direction:column;}
.ai-assistant-header{padding:14px 18px;font-weight:bold;color:#7a5c36;border-bottom:1px solid #e8e0c7;display:flex;justify-content:space-between;align-items:center;}
.ai-assistant-close{cursor:pointer;font-size:1.3rem;}
.ai-assistant-body{padding:16px 18px;height:180px;overflow-y:auto;font-size:1rem;}
.ai-msg{margin-bottom:10px;max-width:90%;word-break:break-all;}
.ai-msg-bot{background:#f3e9c7;color:#7a5c36;padding:8px 14px;border-radius:12px 12px 12px 4px;align-self:flex-start;}
.ai-msg-user{background:#b8a77a;color:#fff;padding:8px 14px;border-radius:12px 12px 4px 12px;align-self:flex-end;text-align:right;}
.ai-assistant-input{display:flex;padding:10px 12px;border-top:1px solid #e8e0c7;}
.ai-assistant-input input{flex:1;border:none;background:#f8f5e6;border-radius:8px;padding:8px 10px;font-size:1rem;outline:none;}
.ai-assistant-input button{margin-left:8px;background:#b8a77a;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:1rem;cursor:pointer;}
.ai-assistant-input button:hover{background:#7a5c36;}`;
document.head.appendChild(style); 