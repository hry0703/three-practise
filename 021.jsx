import { useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import gsap from 'gsap';
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
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 64);

        // 创建立方体的基础材质
        const material = new THREE.MeshLambertMaterial({
          color: 0x1890ff,
          //   wireframe: true,
        });
        // 创建3D物体对象
        const mesh = new THREE.Mesh(sphereGeometry, material);

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
      datGui() {
        const _this = this;
        const gui = new dat.GUI();
        const params = {
          x: 0,
          widthSegments: this.mesh.geometry.parameters.widthSegments,
          heightSegments: this.mesh.geometry.parameters.heightSegments,
          generateGeometry() {
            _this.mesh.geometry.dispose();
            const geometry = new THREE.SphereGeometry(
              1,
              params.widthSegments,
              params.heightSegments
            );
            console.log(geometry);
            _this.mesh.geometry = geometry;
          },
          rotation() {
            // 绕y轴旋转半周
            gsap.to(_this.mesh.rotation, {
              duration: 1,
              delay: 0,
              y: _this.mesh.rotation.y + Math.PI,
            });
          },
        };

        gui.add(this.orbitControls, 'enabled');
        gui.add(this.mesh, 'visible');
        gui.add(this.mesh.material, 'wireframe');
        gui.add(params, 'widthSegments', 3, 100, 1).onChange((val) => {
          params.widthSegments = val;
          params.generateGeometry();
        });
        gui.add(params, 'heightSegments', 3, 100, 1).onChange((val) => {
          params.heightSegments = val;
          params.generateGeometry();
        });
        gui.add(params, 'rotation').onChange((val) => {
          params.rotation();
        });
        gui.add(this.mesh.position, 'x', -3, 3, 0.05);
        gui
          .add(params, 'x', -3, 3, 0.05)
          .name('tranlateX')
          .onChange((val) => {
            params.x = val;
            _this.mesh.geometry.translate(params.x, 0, 0);
            console.log(_this.mesh.position);
            console.log(_this.mesh.geometry);
          });
        gui.add(this.mesh.scale, 'x', 0, 3, 0.1).name('scaleX');
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
