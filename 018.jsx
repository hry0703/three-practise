import { useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras';
import * as dat from 'dat.gui';
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
        const pCamera = new THREE.PerspectiveCamera(
          75, // fov 可视范围
          this.width / this.height,
          0.1,
          1000
        );
        pCamera.position.set(0, 1, 2); // 红色X轴  绿色Y轴
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;
      },
      datGui() {
        const _this = this;
        const gui = new dat.GUI();
        gui.add(_this.orbitControls, 'enabled');
        console.log(_this.orbitControls);
        gui.add(_this.orbitControls, 'dampingFactor', 0.01, 0.2, 0.01); // 阻尼系数
        gui.add(_this.orbitControls, 'enablePan'); // 启用相机平移
        gui.add(_this.orbitControls, 'panSpeed', 1, 10, 1); // 相机平移的速度
        gui.add(_this.orbitControls, 'autoRotate'); // 绕目标自动旋转
        gui.add(_this.orbitControls, 'autoRotateSpeed', 1, 10, 1); // 绕目标自动旋转速度
        gui.add(_this.orbitControls, 'enableZoom'); // 启用缩放
        gui.add(_this.orbitControls, 'zoomSpeed', 1, 10, 1); // 缩放速度
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        this.scene.add(axesHelper);
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
        console.log(orbitControls);

        //拖拽控制器
        const dragControls = new DragControls(
          [this.mesh], // 拖拽的目标
          this.camera,
          this.canvas
        );
        this.dragControls = dragControls;
        dragControls.addEventListener('dragstart', () => {
          orbitControls.enabled = false;
        });
        dragControls.addEventListener('dragend', () => {
          orbitControls.enabled = true;
        });
      },
      tick() {
        // this.mesh.rotation.y += 0.01;
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
        this.datGui();
      },
    };
    $.init();
  }, []);

  return <canvas id="canvas" />;
};

export default Page;
