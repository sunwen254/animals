// 动态水流线
// 初始化流水线容器
function initFlowContainer() {
  console.log('Initializing flow container...'); // 调试日志
  const iceScrollSections = document.getElementById('iceScrollSections');
  if (!iceScrollSections) {
    console.error('iceScrollSections not found!');
    return null;
  }

  // 创建新的流水线容器
  const flowContainer = document.createElement('div');
  flowContainer.className = 'flow-container';
  
  // 移除所有现有的流水线容器
  const oldContainers = iceScrollSections.querySelectorAll('.flow-container');
  oldContainers.forEach(container => container.remove());
  
  // 添加新容器
  iceScrollSections.appendChild(flowContainer);
  console.log('Flow container created');
  return flowContainer;
}

function createFlowLine() {
  console.log('Creating flow line...');
  const flowContainer = initFlowContainer();
  if (!flowContainer) return;

  const centers = getImageCenters();
  console.log('Image centers found:', centers.length);
  
  if (centers.length < 2) {
    console.warn('Not enough image centers found');
    return;
  }

  for (let i = 0; i < centers.length - 1; i++) {
    const start = centers[i];
    const end = centers[i + 1];
    
    // 创建节点
    const node = document.createElement('div');
    node.className = 'flow-node';
    node.style.left = `${start.x}px`;
    node.style.top = `${start.y}px`;
    flowContainer.appendChild(node);
    
    // 如果是最后一个点，还需要创建终点节点
    if (i === centers.length - 2) {
      const endNode = document.createElement('div');
      endNode.className = 'flow-node';
      endNode.style.left = `${end.x}px`;
      endNode.style.top = `${end.y}px`;
      flowContainer.appendChild(endNode);
    }
    
    // 创建连接线
    const line = document.createElement('div');
    line.className = 'flow-line';
    
    // 计算线的长度和角度
    const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    
    // 设置线的位置和变换
    line.style.left = `${start.x}px`;
    line.style.top = `${start.y}px`;
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}rad)`;

    // 添加水波纹效果（简化为单层）
    const waterRipple = document.createElement('div');
    waterRipple.className = 'water-ripple';
    line.appendChild(waterRipple);
    
    flowContainer.appendChild(line);
  }

  // 显示流水线
  requestAnimationFrame(() => {
    flowContainer.classList.add('show');
    console.log('Flow line displayed');
  });
}

function getImageCenters() {
  console.log('Getting image centers...');
  const sections = document.querySelectorAll('.ice-section.s-curve');
  const iceScrollSections = document.getElementById('iceScrollSections');
  console.log('Found sections:', sections.length);
  
  // 获取容器的位置信息
  const containerRect = iceScrollSections.getBoundingClientRect();
  const containerTop = containerRect.top + window.pageYOffset;
  
  const centers = [];
  sections.forEach((section, index) => {
    const img = section.querySelector('.ice-img-wrap img');
    if (img) {
      const rect = img.getBoundingClientRect();
      console.log(`Image ${index} rect:`, rect);
      
      // 计算相对于容器的位置
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2 + window.pageYOffset - containerTop;
      
      let centerX = x;
      
      // 根据section的类型调整X坐标
      if (section.classList.contains('odd')) {
        centerX += 100;
      } else {
        centerX -= 50;
      }
      
      centers.push({ x: centerX, y: y });
      console.log(`Image ${index} center:`, { x: centerX, y: y });
    }
  });
  
  return centers;
}

// 添加防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 更新流水线位置的防抖版本
const debouncedCreateFlowLine = debounce(createFlowLine, 100);

// 监听滚动和调整窗口大小事件
window.addEventListener('scroll', () => {
  requestAnimationFrame(debouncedCreateFlowLine);
});

window.addEventListener('resize', () => {
  requestAnimationFrame(debouncedCreateFlowLine);
});

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Content Loaded');
  
  // 监听开始按钮点击事件
  const startBtn = document.getElementById('startBtn');
  if (startBtn) {
    console.log('Start button found');
    startBtn.addEventListener('click', () => {
      console.log('Start button clicked');
      // 确保图片已加载
      const images = document.querySelectorAll('.ice-img-wrap img');
      let loadedImages = 0;
      const totalImages = images.length;
      console.log('Total images:', totalImages);

      function checkAllImagesLoaded() {
        loadedImages++;
        console.log(`Images loaded: ${loadedImages}/${totalImages}`);
        if (loadedImages === totalImages) {
          console.log('All images loaded, creating flow line...');
          setTimeout(createFlowLine, 100);
        }
      }

      images.forEach(img => {
        if (img.complete) {
          console.log('Image already loaded:', img.src);
          checkAllImagesLoaded();
        } else {
          console.log('Waiting for image to load:', img.src);
          img.addEventListener('load', checkAllImagesLoaded);
        }
      });
    });
  } else {
    console.error('Start button not found!');
  }
});

// 解锁滚动并显示区块
function unlockScrollAndShowSections() {
  document.body.classList.remove('lock-scroll');
  document.documentElement.classList.remove('lock-scroll');
  const sections = document.getElementById('iceScrollSections');
  if(sections) {
    sections.style.display = 'block';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
  
  // 监听区块显示
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {threshold: 0.2});
  
  document.querySelectorAll('.ice-section.s-curve, .ice-fact-section').forEach(sec => {
    observer.observe(sec);
  });
}

// 图片弹窗
function closeIceImgModal() {
  const modal = document.getElementById('iceImgModal');
  if(modal) {
    modal.style.display = 'none';
  }
}

document.querySelectorAll('.ice-img-wrap img').forEach(img => {
  img.onclick = function() {
    const modal = document.getElementById('iceImgModal');
    const modalImg = document.getElementById('iceImgModalPic');
    const modalCaption = document.getElementById('iceImgModalCaption');
    if(modal && modalImg && modalCaption) {
      modalImg.src = this.src;
      modalCaption.innerText = this.alt;
      modal.style.display = 'flex';
    }
  }
}); 