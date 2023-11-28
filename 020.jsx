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
        // // 创建立方体的几何体
        // const geometry = new THREE.BufferGeometry();
        // console.log('geometry', geometry);
        // const vertices = new Float32Array([
        //   -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0,

        //   1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
        // ]); // 两组三角形的顶点
        // const index = new Uint16Array([0, 1, 2, 3, 4, 5, 2, 4, 5]);
        // geometry.setAttribute(
        //   'position',
        //   new THREE.BufferAttribute(vertices, 3)
        // );
        // geometry.index = new THREE.BufferAttribute(index, 1);
        // const material = new THREE.PointsMaterial({
        //   color: 0xff0000,
        //   //   wireframe: true,
        // });
        // const mesh = new THREE.Line(geometry, material);

        // const plane = new THREE.BoxGeometry(1, 1, 1);
        // const mesh1 = new THREE.Mesh(plane, material);
        // console.log('plane', plane);
        // this.scene.add(mesh, mesh1);

        const plane = new THREE.PlaneGeometry(1, 1, 1);
        const material = new THREE.PointsMaterial({
          color: 0x1890ff,
          //   wireframe: true,
          side: THREE.DoubleSide, // THREE默认只渲染一面 这个参数设置两面都渲染
        });
        const mesh = new THREE.Mesh(plane, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = -0.5;
        mesh.scale.x = 2;

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const box = new THREE.Mesh(boxGeometry, material);
        box.position.x = -2;

        const coneGeometry = new THREE.ConeGeometry(1, 2, 32);
        const cone = new THREE.Mesh(coneGeometry, material);
        cone.position.x = 2;

        const cylinderGeometry = new THREE.CylinderGeometry(
          1,
          1,
          2,
          32,
          32,
          32
        );
        const cylinder = new THREE.Mesh(cylinderGeometry, material);
        cylinder.position.x = 4;

        this.scene.add(mesh, box, cone, cylinder);
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
        camera.position.set(0, 1, 5);
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
      },
    };
    $.init();
  }, []);

  return <canvas id="canvas" />;
};

export default Page;
