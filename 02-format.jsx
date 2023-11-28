import { useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const Page = () => {
  useEffect(() => {
    const $ = {
      createScene() {
        const canvas = document.getElementById('canvas');
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        this.width = width;
        this.height = height;
        this.canvas = canvas;

        // 创建3D场景
        const scene = new THREE.Scene();
        this.scene = scene;
      },
      createLights() {
        // 添加全局光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(ambientLight, directionalLight);
      },
      createObjects() {
        // 创建立方体的几何体
        const geometry = new THREE.BoxGeometry(1, 1, 1);

        // 创建立方体的基础材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
          //   wireframe: true,
        });
        // 创建3D物体对象
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
        this.mesh = mesh;
      },
      createCamera() {
        // 创建相机对象
        const camera = new THREE.PerspectiveCamera(
          75,
          this.width / this.height,
          0.1,
          1000
        );
        // 设置相机位置
        camera.position.set(2, 2, 3);
        //设置相机朝向
        camera.lookAt(this.scene.position);
        // 将相机添加到场景中
        this.scene.add(camera);
        this.camera = camera;
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        // 创建辅助平面
        const gridHelper = new THREE.GridHelper();
        this.scene.add(axesHelper, gridHelper);
      },
      render() {
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true, // 抗锯齿
        });
        // 设置渲染器屏幕像素比
        renderer.setPixelRatio(window.devicePixelRatio || 1);
        // 设置渲染器大小
        renderer.setSize(this.width, this.height);
        // 执行渲染
        renderer.render(this.scene, this.camera);
        this.renderer = renderer;
      },
      controls() {
        // 创建轨道控制器
        const orbitControls = new OrbitControls(this.camera, this.canvas);
        // 惯性
        orbitControls.enableDamping = true;
        this.orbitControls = orbitControls;
      },
      tick() {
        this.mesh.rotation.y += 0.01;
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(() => this.tick());
      },
      fitView() {
        // 自适应屏幕大小
        window.addEventListener(
          'resize',
          () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
          },
          false
        );
      },
      init() {
        this.createScene();
        this.createLights();
        this.createObjects();
        this.createCamera();
        this.helpers();
        this.render();
        this.controls();
        this.tick();
        this.fitView();
      },
    };
    $.init();
  }, []);

  return <canvas id="canvas" />;
};

export default Page;
