// 可旋转3D地球（three.js）
const container = document.getElementById('earth-container');
if(container){
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0,0,3.2);
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // 地球贴图（本地）
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('static/images/earthmap4k.jpg');
  const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
  const earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // 高亮极地（北极圈）
  const polarGeometry = new THREE.SphereGeometry(1.01, 64, 64, 0, Math.PI*2, 0, Math.PI/8);
  const polarMaterial = new THREE.MeshBasicMaterial({color:'#00eaff',transparent:true,opacity:0.35});
  const polarMesh = new THREE.Mesh(polarGeometry, polarMaterial);
  scene.add(polarMesh);
  // 南极圈
  const southPolarGeometry = new THREE.SphereGeometry(1.01, 64, 64, 0, Math.PI*2, Math.PI-Math.PI/8, Math.PI/8);
  const southPolarMesh = new THREE.Mesh(southPolarGeometry, polarMaterial.clone());
  scene.add(southPolarMesh);

  // 光源
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5,2,5);
  scene.add(dirLight);

  // 控制器
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.2;
  controls.maxDistance = 6;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

// --- 书本与地球互动 ---
// 书本动物与极地区域映射
const animalPolarMap = [
  { // 北极狐
    lat: 75, lon: 0, color: '#00eaff', label: '北极圈'
  },
  { // 北极熊
    lat: 85, lon: 60, color: '#00eaff', label: '北极圈'
  },
  { // 海豹
    lat: 70, lon: 120, color: '#00eaff', label: '北极圈'
  },
  { // 鲸鱼
    lat: -70, lon: -60, color: '#ffb300', label: '南极圈'
  },
  { // 企鹅
    lat: -85, lon: 0, color: '#ffb300', label: '南极圈'
  }
];
// 高亮点球体上的极地
let highlightMarker = null;
function highlightPolar(idx){
  if(!earthMesh || !scene) return;
  // 移除旧高亮
  if(highlightMarker){ scene.remove(highlightMarker); highlightMarker = null; }
  const info = animalPolarMap[idx];
  if(!info) return;
  // 在球体上加高亮点
  const phi = (90-info.lat)*Math.PI/180;
  const theta = (info.lon+180)*Math.PI/180;
  const r = 1.03;
  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.cos(phi);
  const z = r * Math.sin(phi) * Math.sin(theta);
  const markerGeo = new THREE.SphereGeometry(0.06, 24, 24);
  const markerMat = new THREE.MeshBasicMaterial({color:info.color,transparent:true,opacity:0.85});
  highlightMarker = new THREE.Mesh(markerGeo, markerMat);
  highlightMarker.position.set(x,y,z);
  scene.add(highlightMarker);
  // 绘制知识连线
  drawBookEarthLink(idx);
}
// 监听书本页变化
window.highlightPolar = highlightPolar;

// --- 知识连线SVG动画 ---
function drawBookEarthLink(idx){
  const svg = document.getElementById('book-earth-link');
  if(!svg) return;
  svg.innerHTML = '';
  // 书本右侧锚点
  const x1 = 0, y1 = 120+idx*32;
  // 地球左侧锚点
  const x2 = 170, y2 = 200+Math.sin(idx)*60;
  // 曲线
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',`M${x1},${y1} C${x1+60},${y1+40} ${x2-60},${y2-40} ${x2},${y2}`);
  path.setAttribute('stroke', animalPolarMap[idx].color);
  path.setAttribute('stroke-width','4');
  path.setAttribute('fill','none');
  path.setAttribute('opacity','0.85');
  svg.appendChild(path);
  // 动画效果
  path.style.strokeDasharray = path.getTotalLength();
  path.style.strokeDashoffset = path.getTotalLength();
  path.style.transition = 'stroke-dashoffset 0.7s cubic-bezier(.25,1.7,.45,.87)';
  setTimeout(()=>{ path.style.strokeDashoffset = 0; }, 30);
  // 终点圆点
  const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
  circle.setAttribute('cx',x2);
  circle.setAttribute('cy',y2);
  circle.setAttribute('r','8');
  circle.setAttribute('fill',animalPolarMap[idx].color);
  circle.setAttribute('opacity','0.7');
  svg.appendChild(circle);
} 