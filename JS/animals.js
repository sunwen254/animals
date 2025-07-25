document.addEventListener('DOMContentLoaded', function() {
    const animalData = {
        '北极熊': {
            name: '北极熊', latin: 'Ursus maritimus',
            model: 'static/models/polar_bear/scene.gltf',
            desc: '北极熊是北极地区的顶级掠食者，拥有厚厚的脂肪层和防水毛发，能在极寒环境中生存。',
            stats: [{label:'体重', value: '700kg'},{label:'寿命', value:'30年'},{label:'现状', value:'濒危'}],
            status: '濒危', color: '#00eaff', scale: 1.18
        },
        '帝企鹅': {
            name: '帝企鹅', latin: 'Aptenodytes forsteri',
            model: 'static/models/emperor_penguin/scene.gltf',
            desc: '帝企鹅是南极最大的企鹅，能在零下60℃的环境下孵化幼崽，群居生活，耐寒能力极强。',
            stats: [{label:'体重', value: '40kg'},{label:'寿命', value:'20年'},{label:'现状', value:'稳定'}],
            status: '稳定', color: '#ffb300', scale: 0.82
        },
        '海狮': {
            name: '海狮', latin: 'Otariinae',
            model: 'static/models/eared_seal_statuette/scene.gltf',
            desc: '海狮是极地重要的哺乳动物，适应寒冷水域，皮毛厚实，善于游泳和潜水。',
            stats: [{label:'体重', value: '300kg'},{label:'寿命', value:'25年'},{label:'现状', value:'易危'}],
            status: '易危', color: '#38bdf8', scale: 1.0
        },
        '海象': {
            name: '海象', latin: 'Odobenus rosmarus',
            model: 'static/models/walrus_horniman_museum_and_gardens/scene.gltf',
            desc: '海象以其巨大的獠牙和胡须著称，主要分布在北极圈附近的浅海区域。',
            stats: [{label:'体重', value: '1200kg'},{label:'寿命', value:'40年'},{label:'现状', value:'易危'}],
            status: '易危', color: '#b8a77a', scale: 0.85
        },
        '鲸鱼': {
            name: '鲸鱼', latin: 'Balaenidae',
            model: 'static/models/whale_3d_model/scene.gltf',
            desc: '鲸鱼是极地海洋中体型最大的动物，善于长距离迁徙，寿命极长。',
            stats: [{label:'体重', value: '100000kg'},{label:'寿命', value:'90年'},{label:'现状', value:'受威胁'}],
            status: '受威胁', color: '#2563eb', scale: 1.7, verticalOffset: -0.6
        }
    };

    const scriptTag = document.querySelector('script[data-animal]');
    const animalName = scriptTag ? scriptTag.getAttribute('data-animal') : null;
    const animal = animalData[animalName];

    if (!animal) {
        console.error('未找到动物数据: ' + animalName);
        return;
    }

    let renderer, scene, camera, controls, currentModel;

    function init3D() {
        const canvas = document.getElementById('animal-3d-canvas');
        if (!canvas) return;

        const view = document.querySelector('.animal-3d-view');
        const viewWidth = view.clientWidth;
        const viewHeight = view.clientHeight;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, viewWidth / viewHeight, 0.1, 1000);
        camera.position.set(0, 1, 3.5);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvas });
        renderer.setSize(viewWidth, viewHeight);
        renderer.setClearColor(0x000000, 0);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 2;
        controls.maxDistance = 8;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.7;

        scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 10, 7);
        scene.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0xa5f3fc, 0.3);
        fillLight.position.set(-5, -10, -7);
        scene.add(fillLight);

        const loader = new THREE.GLTFLoader();
        loader.load(animal.model, function(gltf) {
            currentModel = gltf.scene;
            currentModel.position.set(0, 0, 0);
            currentModel.rotation.y = Math.PI / 2;

            const box = new THREE.Box3().setFromObject(currentModel);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            let scale = 2.5 / maxDim;
            scale *= (animal.scale || 1.0);
            currentModel.scale.setScalar(scale);

            const center = new THREE.Vector3();
            box.getCenter(center);
            currentModel.position.x -= center.x * scale;
            currentModel.position.y -= center.y * scale;
            currentModel.position.z -= center.z * scale;
            
            if (animal.verticalOffset) {
                currentModel.position.y += animal.verticalOffset;
            }

            scene.add(currentModel);
            animate();
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function updateInfo() {
        document.querySelector('.animal-status').textContent = animal.status;
        document.querySelector('.animal-title').innerHTML = `${animal.name}<span class="animal-latin">${animal.latin}</span>`;
        document.querySelector('.animal-desc').textContent = animal.desc;
        const statElements = document.querySelectorAll('.stat-item');
        animal.stats.forEach((stat, i) => {
            if (statElements[i]) {
                statElements[i].querySelector('.stat-label').textContent = stat.label;
                statElements[i].querySelector('.stat-value').textContent = stat.value;
            }
        });
    }

    window.addEventListener('resize', function() {
        const view = document.querySelector('.animal-3d-view');
        if (view && renderer && camera) {
            const width = view.clientWidth;
            const height = view.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
    });

    init3D();
    updateInfo();
});