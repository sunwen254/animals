// 移除海平面相关代码，保留其他功能
document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const content = document.getElementById('content');
  const descText = document.getElementById('descText');
  const subtitleText = document.getElementById('subtitleText');
  const crisisTitle = document.getElementById('crisisTitle');
  const turningText = document.getElementById('turningText');
  const crisisShowcase = document.getElementById('crisisShowcase');
  const mainFlowCanvas = document.getElementById('mainFlowCanvas');
  const iceScrollSections = document.getElementById('iceScrollSections');

  // 初始化状态
  document.body.classList.add('lock-scroll');

  // 1. 首先显示标题
  setTimeout(() => {
    content.classList.add('show');
    
    // 显示副标题
    const subtitle = "每一片冰川的消融，都在诉说着极地生态的脆弱，每一个生命的挣扎，都在呼唤着人类的觉醒";
    const chars = subtitle.split('');
    let html = '';
    chars.forEach(char => {
      html += `<span>${char}</span>`;
    });
    subtitleText.innerHTML = html;
    
    const spans = subtitleText.querySelectorAll('span');
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add('show');
      }, i * 120);
    });
    
    // 2. 显示危机图片
    setTimeout(() => {
      showCrisisImages();
    }, 1500 + subtitle.length * 120);
  }, 500);

  // 显示危机图片的函数
  function showCrisisImages() {
    const crisisData = [
      {img:'./static/images/冰川断裂.jpg', text:'冰川正在以惊人的速度消失，极地生态系统岌岌可危'},
      {img:'./static/images/浮冰上的北极熊.jpg', text:'北极熊失去家园，饥饿难耐'},
      {img:'./static/images/浮冰上的企鹅.jpg', text:'企鹅繁殖地被海水吞噬'},
      {img:'./static/images/浮冰上的海豹.jpg', text:'海豹的家园正在消失'},
      {img:'./static/images/冰面裂缝延伸.jpg', text:'冰面裂缝不断蔓延，危机加剧'}
    ];
    
    let idx = 0;
    crisisShowcase.style.display = 'flex';

    function showNext() {
      if(idx >= crisisData.length) {
        // 所有图片展示完毕，清空内容并显示按钮
        setTimeout(() => {
          crisisShowcase.innerHTML = '';
          crisisShowcase.style.display = 'none';
          
          // 显示开始按钮
          startBtn.style.display = 'block';
          setTimeout(() => {
            startBtn.classList.add('show');
          }, 100);
        }, 1000);
        return;
      }
      
      crisisShowcase.innerHTML = `
        <div class="crisis-group">
          <img src="${crisisData[idx].img}" alt="${crisisData[idx].text}">
          <div class="crisis-text">${crisisData[idx].text}</div>
        </div>
      `;
      
      // 添加show类触发淡入动画
      setTimeout(() => {
        const group = crisisShowcase.querySelector('.crisis-group');
        if(group) group.classList.add('show');
      }, 50);
      
      idx++;
      setTimeout(() => {
        const group = crisisShowcase.querySelector('.crisis-group');
        if(group) group.classList.remove('show');
        setTimeout(showNext, 300);
      }, 2000);
    }
    
    showNext();
  }

  // 开始按钮点击事件
  startBtn.addEventListener('click', () => {
    startBtn.classList.remove('show');
    setTimeout(() => {
      startBtn.style.display = 'none';
          document.body.classList.remove('lock-scroll');
      
      // 显示滚动内容
      iceScrollSections.style.display = 'block';
      iceScrollSections.classList.add('show');
      
      // 确保图片已加载
      const images = document.querySelectorAll('.ice-img-wrap img');
      let loadedImages = 0;
      const totalImages = images.length;
      
      function checkAllImagesLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
          // 移除hidden类
          images.forEach(img => img.classList.remove('hidden'));
          
          // 等待图片显示动画完成后创建流水线
          setTimeout(() => {
            if (typeof createFlowLine === 'function') {
              createFlowLine();
            }
            
            if (typeof onScrollFadeInSections === 'function') {
              onScrollFadeInSections();
            }
          }, 500);
        }
      }
      
      images.forEach(img => {
        if (img.complete) {
          checkAllImagesLoaded();
        } else {
          img.addEventListener('load', checkAllImagesLoaded);
        }
      });
    }, 800);
  });

  // 文字渐显动画
  function showText() {
    const text = '极地冰川正在以惊人的速度消失，这不仅威胁着极地动物的生存，也影响着全球气候。让我们一起了解冰川消融对极地动物的影响，并思考如何保护它们的家园。';
    const chars = text.split('');
    let html = '';
    chars.forEach(char => {
      html += `<span>${char}</span>`;
    });
    descText.innerHTML = html;
    
    const spans = descText.querySelectorAll('span');
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.style.opacity = '1';
      }, i * 100);
    });
  }

  // 监听滚动事件，显示图片
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('hidden');
      }
    });
  }, {
    threshold: 0.5
  });

  document.querySelectorAll('.ice-img-wrap img').forEach(img => {
    observer.observe(img);
  });
}); 