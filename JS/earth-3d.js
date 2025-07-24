// three.js地球渲染
const container = document.getElementById('earth-3d-container');
if(container){
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0,0,3.5);
  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // 地球贴图
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('./static/images/earthmap4k.jpg');
  const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
  const earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture});
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // 灯光
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight.position.set(5,2,5);
  scene.add(dirLight);

  // 控制器
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  // 动物分布点（Sprite）
  const animalPoints = [
    { lat: 80, lon: 0, animal: 'polar-bear', icon: './static/images/animal-icons/polar-bear.png' },
    { lat: 75, lon: 60, animal: 'arctic-fox', icon: './static/images/animal-icons/arctic-fox.png' },
    { lat: 70, lon: 120, animal: 'walrus', icon: './static/images/animal-icons/walrus.png' },
    { lat: -80, lon: 0, animal: 'emperor-penguin', icon: './static/images/animal-icons/emperor-penguin.png' },
    { lat: -75, lon: 60, animal: 'antarctic-seal', icon: './static/images/animal-icons/antarctic-seal.png' }
  ];
  animalPoints.forEach(pt => {
    const texture = new THREE.TextureLoader().load(pt.icon);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      color: 0xffffff,
      opacity: 1
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    // 经纬度转球面坐标
    const phi = (90-pt.lat)*Math.PI/180;
    const theta = (pt.lon+180)*Math.PI/180;
    const r = 1.05;
    sprite.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    sprite.scale.set(0.22,0.22,0.22);
    sprite.userData.animal = pt.animal;
    sprite.onClick = function(){
      const icon = document.querySelector(`.animal-icon[data-animal='${pt.animal}']`);
      if(icon) icon.click();
    };
    scene.add(sprite);
  });
  // 监听点击事件
  renderer.domElement.addEventListener('pointerdown', function(event){
    const mouse = new THREE.Vector2(
      (event.offsetX/container.offsetWidth)*2-1,
      -(event.offsetY/container.offsetHeight)*2+1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    for(const obj of intersects){
      if(obj.object.type==='Sprite' && obj.object.onClick){
        obj.object.onClick();
        break;
      }
    }
  });

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
} 