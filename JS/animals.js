// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 3D交互效果实现
    const animalCards = document.querySelectorAll('.animal-card');
    let currentContainer = null;
    let startX, startY;
    let currentRotateX = 0, currentRotateY = 0;
    let isDragging = false;

    // 初始化所有卡片的3D效果
    animalCards.forEach(card => {
        const container = card.querySelector('.animal-3d-container');

        // 鼠标/触摸事件监听
        container.addEventListener('mousedown', startDrag);
        container.addEventListener('touchstart', startDrag, { passive: false });

        // 离开卡片区域时重置旋转
        container.addEventListener('mouseleave', () => {
            if (!isDragging) resetRotation(container);
        });
    });

    // 全局事件监听
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);

    // 开始拖动
    function startDrag(e) {
        isDragging = true;
        currentContainer = this;

        // 获取初始位置（区分鼠标和触摸事件）
        if (e.type === 'mousedown') {
            startX = e.clientX;
            startY = e.clientY;
        } else {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault(); // 防止触摸滚动
        }
    }

    // 拖动中（计算旋转角度）
    function drag(e) {
        if (!isDragging || !currentContainer) return;

        let clientX, clientY;
        if (e.type === 'mousemove') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
            e.preventDefault(); // 防止触摸滚动
        }

        // 计算移动差值
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;

        // 计算旋转角度（限制最大旋转范围）
        currentRotateY = Math.max(-15, Math.min(15, currentRotateY + deltaX * 0.15));
        currentRotateX = Math.max(-15, Math.min(15, currentRotateX - deltaY * 0.15));

        // 应用旋转
        currentContainer.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        // 更新起点位置
        startX = clientX;
        startY = clientY;
    }

    // 结束拖动
    function stopDrag() {
        if (!isDragging) return;

        isDragging = false;
        // 缓慢恢复到初始状态
        setTimeout(() => {
            if (currentContainer) {
                resetRotation(currentContainer);
            }
        }, 500);
    }

    // 重置旋转角度
    function resetRotation(container) {
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
        currentRotateX = 0;
        currentRotateY = 0;
    }

    // 卡片进入/离开视口时的动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 初始化所有卡片的入场动画
    animalCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // 3D动物模型与介绍数据
    const animalModels = [
      {
        name: '北极熊', latin: 'Ursus maritimus',
        model: './static/models/polar_bear/scene.gltf',
        desc: '北极熊是北极地区的顶级掠食者，拥有厚厚的脂肪层和防水毛发，能在极寒环境中生存。',
        stats: [{label:'体重', value: '700kg'},{label:'寿命', value:'30年'},{label:'现状', value:'濒危'}],
        status: '濒危',
        color: '#00eaff'
      },
      {
        name: '帝企鹅', latin: 'Aptenodytes forsteri',
        model: './static/models/emperor_penguin/scene.gltf',
        desc: '帝企鹅是南极最大的企鹅，能在零下60℃的环境下孵化幼崽，群居生活，耐寒能力极强。',
        stats: [{label:'体重', value: '40kg'},{label:'寿命', value:'20年'},{label:'现状', value:'稳定'}],
        status: '稳定',
        color: '#ffb300'
      },
      {
        name: '海狮', latin: 'Otariinae',
        model: './static/models/eared_seal_statuette/scene.gltf',
        desc: '海狮是极地重要的哺乳动物，适应寒冷水域，皮毛厚实，善于游泳和潜水。',
        stats: [{label:'体重', value: '300kg'},{label:'寿命', value:'25年'},{label:'现状', value:'易危'}],
        status: '易危',
        color: '#38bdf8'
      },
      {
        name: '海象', latin: 'Odobenus rosmarus',
        model: './static/models/walrus_horniman_museum_and_gardens/scene.gltf',
        desc: '海象以其巨大的獠牙和胡须著称，主要分布在北极圈附近的浅海区域。',
        stats: [{label:'体重', value: '1200kg'},{label:'寿命', value:'40年'},{label:'现状', value:'易危'}],
        status: '易危',
        color: '#b8a77a'
      },
      {
        name: '鲸鱼', latin: 'Balaenidae',
        model: './static/models/whale_3d_model/scene.gltf',
        desc: '鲸鱼是极地海洋中体型最大的动物，善于长距离迁徙，寿命极长。',
        stats: [{label:'体重', value: '100000kg'},{label:'寿命', value:'90年'},{label:'现状', value:'受威胁'}],
        status: '受威胁',
        color: '#2563eb'
      }
    ];
    let animalIdx = 0;
    let renderer, scene, camera, controls, currentModel;

    function loadAnimalModel(idx) {
      const container = document.getElementById('animal-3d-container');
      if (!container) return;
      // 清空旧渲染器
      container.innerHTML = '';
      if(renderer && renderer.domElement) renderer.dispose && renderer.dispose();
      // three.js基本场景
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
      camera.position.set(0, 1, 3.5);
      renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setSize(400, 400);
      container.appendChild(renderer.domElement);
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.minDistance = 2;
      controls.maxDistance = 8;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.7;
      // 灯光
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      // 加载模型
      const loader = new THREE.GLTFLoader();
      loader.load(animalModels[idx].model, function(gltf){
        currentModel = gltf.scene;
        currentModel.position.set(0,0,0);
        currentModel.rotation.y = Math.PI/2;
        // 自动缩放和居中
        const box = new THREE.Box3().setFromObject(currentModel);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        let scale = 2.5 / maxDim;
        // 鲸鱼和北极熊分别放大
        let extraScale = 1;
        if(animalModels[idx].name === '鲸鱼'){
          extraScale = 1.7;
        } else if(animalModels[idx].name === '北极熊'){
          extraScale = 1.18;
        } else if(animalModels[idx].name === '海象'){
          extraScale = 0.85;
        }
        scale *= extraScale;
        currentModel.scale.setScalar(scale);
        // 居中
        const center = new THREE.Vector3();
        box.getCenter(center);
        currentModel.position.x -= center.x * scale;
        currentModel.position.y -= center.y * scale;
        currentModel.position.z -= center.z * scale;
        // 特殊处理：鲸鱼再向下偏移，企鹅缩小居中
        if(animalModels[idx].name === '鲸鱼'){
          currentModel.position.y -= 1.2;
        }
        // 下边缘与卡片底部齐平
        if(!['鲸鱼','北极熊','海狮','海象','帝企鹅'].includes(animalModels[idx].name)){
          currentModel.position.y -= (box.min.y * scale);
        }
        // 整体右下偏移（只有北极狐等动物偏移）
        if(!['鲸鱼','北极熊','海狮','海象','帝企鹅'].includes(animalModels[idx].name)){
          currentModel.position.x += 1.1;
          currentModel.position.y -= 1.1;
        }
        // 企鹅缩小
        if(animalModels[idx].name === '帝企鹅'){
          currentModel.scale.setScalar(scale * 0.82);
        }
        scene.add(currentModel);
        animate();
      });
      function animate(){
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
    }

    function renderAnimalInfo(idx) {
      const info = animalModels[idx];
      const panel = document.getElementById('animalInfoPanel');
      if (!panel) return;
      panel.innerHTML = `
        <div class="animal-info-card">
          <div class="animal-status" style="background: linear-gradient(90deg,${info.color} 0%,#ffed85 100%);">${info.status}</div>
          <h2 class="animal-title">${info.name} <span class="animal-latin">${info.latin}</span></h2>
          <div class="animal-desc typewriter">${info.desc}</div>
          <div class="animal-stats">
            ${info.stats.map(s=>`<div class="stat-item"><span class="stat-label">${s.label}</span><span class="stat-value" data-value="${s.value.replace(/[^\d]/g,'')}">${s.value}</span></div>`).join('')}
          </div>
          <button class="animal-more-btn">查看更多</button>
        </div>
      `;
      // 打字机动画
      const desc = panel.querySelector('.animal-desc');
      if(desc){
        const text = info.desc;
        desc.textContent = '';
        let i = 0;
        function type(){
          if(i<=text.length){ desc.textContent = text.slice(0,i); i++; setTimeout(type, 22); }
        }
        type();
      }
      // 数字滚动动画
      panel.querySelectorAll('.stat-value').forEach(el=>{
        const val = el.getAttribute('data-value');
        if(val && !isNaN(val)){
          let n = 0, target = parseInt(val), unit = el.textContent.replace(/\d/g,'');
          const step = Math.max(1, Math.floor(target/40));
          function grow(){
            if(n<target){ n+=step; el.textContent = n+unit; setTimeout(grow, 18); }
            else{ el.textContent = target+unit; }
          }
          grow();
        }
      });
      // 更多按钮交互
      panel.querySelector('.animal-more-btn').onclick = ()=>{
        showAnimalDetailModal(info);
      };
      // 新增：点击整个介绍卡片弹窗
      panel.onclick = function(e){
        if(e.target.classList.contains('animal-more-btn')) return;
        showAnimalDetailModal(info);
      };
    }
    // 新增：弹窗函数
    function showAnimalDetailModal(info){
      let modal = document.getElementById('animal-detail-modal');
      if(!modal){
        modal = document.createElement('div');
        modal.id = 'animal-detail-modal';
        modal.className = 'stat-modal';
        modal.innerHTML = `<div class='stat-modal-content'><span class='stat-modal-close'>&times;</span><div class='stat-modal-message'></div></div>`;
        document.body.appendChild(modal);
      }
      const msgBox = modal.querySelector('.stat-modal-message');
      msgBox.innerHTML = `<h2 style='color:${info.color};margin-bottom:12px;'>${info.name} <span style='font-size:1.1rem;color:#b8a77a;'>${info.latin}</span></h2><p style='font-size:1.1rem;margin-bottom:18px;'>${info.desc}</p><ul style='text-align:left;margin:0 auto;max-width:320px;'>${info.stats.map(s=>`<li><b>${s.label}：</b>${s.value}</li>`).join('')}</ul>`;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      modal.querySelector('.stat-modal-close').onclick = function(){
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };
      modal.onclick = function(e){
        if(e.target === modal){
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      };
    }

    function switchAnimal(dir){
      animalIdx = (animalIdx + dir + animalModels.length) % animalModels.length;
      loadAnimalModel(animalIdx);
      renderAnimalInfo(animalIdx);
    }

    document.querySelector('.animal-switch-left').onclick = ()=>switchAnimal(-1);
    document.querySelector('.animal-switch-btn.animal-switch-right').onclick = ()=>switchAnimal(1);

    // 初始化
    loadAnimalModel(animalIdx);
    renderAnimalInfo(animalIdx);
});