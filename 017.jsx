import { useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HeartCurve } from 'three/examples/jsm/curves/CurveExtras';
import * as dat from 'dat.gui';
const Page = () => {
  useEffect(() => {
    const $ = {
      cameraIndex: 0,

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
        mesh.geometry.computeBoundingBox();
        console.log(mesh);
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
        pCamera.position.set(0, 0, 20); // 红色X轴  绿色Y轴
        pCamera.lookAt(this.scene.position);
        this.scene.add(pCamera);
        this.pCamera = pCamera;
        this.camera = pCamera;

        const watcherCamera = new THREE.PerspectiveCamera(
          75, // fov 可视范围
          this.width / this.height,
          0.1,
          1000
        );
        watcherCamera.position.set(0, 0, 20);
        watcherCamera.lookAt(this.scene.position);
        this.scene.add(watcherCamera);
        this.watcherCamera = watcherCamera;
        // this.camera = watcherCamera;

        // 通过camera计算出视锥
        const frustum = new THREE.Frustum();
        this.camera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果
        frustum.setFromProjectionMatrix(
          new THREE.Matrix4().multiplyMatrices(
            this.pCamera.projectionMatrix,
            this.pCamera.matrixWorldInverse
          )
        ); // 得到视锥体的矩阵
        const result = frustum.intersectsBox(this.mesh.geometry.boundingBox);
        console.log(result);
      },
      curveGenerator() {
        const curve = new HeartCurve(1);
        const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.01, 8, true);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ff00,
        });
        const tubeMesh = new THREE.Mesh(tubeGeometry, material);
        // 把曲线分割成3000段
        this.points = curve.getPoints(3000);

        this.scene.add(tubeMesh);
        this.curve = curve;

        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.copy(this.pCamera.position);
        tubeMesh.rotation.x = -Math.PI / 2; // 桃心旋转90度 变成水平
        this.scene.add(sphereMesh);
        this.sphereMesh = sphereMesh;
      },
      datGui() {
        const _this = this;
        const gui = new dat.GUI();
        const params = {
          wireframe: false,
          color: 0x1890ff,
          switchCamera() {
            _this.orbitControls.dispose(); // 销毁旧的控制器
            if (_this.cameraIndex === 0) {
              _this.camera = _this.watcherCamera;
              _this.cameraIndex = 1;
            } else {
              _this.camera = _this.pCamera;
              _this.cameraIndex = 0;
            }
            _this.orbitControls = new OrbitControls(_this.camera, _this.canvas);
          },
        };
        // gui.add(this.camera.position, 'x', 0.1, 10, 0.1).name('positionX'); // 最小 最大 步长
        gui
          .add(this.camera.position, 'x')
          .min(-10)
          .max(10)
          .step(0.1)
          .name('positionX');
        gui.add(this.pCamera, 'near', 0.01, 10, 0.01).onChange((val) => {
          this.camera.near = val;
          this.camera.updateProjectionMatrix();

          // 通过camera计算出视锥
          const frustum = new THREE.Frustum();
          this.pCamera.updateProjectionMatrix(); // 更新以保证拿到最正确的结果
          frustum.setFromProjectionMatrix(
            new THREE.Matrix4().multiplyMatrices(
              this.pCamera.projectionMatrix,
              this.pCamera.matrixWorldInverse
            )
          ); // 得到视锥体的矩阵
          const result = frustum.intersectsBox(this.mesh.geometry.boundingBox); // 判断视锥是否与相机相交
          console.log(result);
        });
        gui.add(this.camera, 'far', 1, 100, 1).onChange((val) => {
          this.camera.far = val;
          this.camera.updateProjectionMatrix();
        });
        //  gui.add(this.pCamera, 'near', 0.01, 10, 0.01).onChange((val) => {
        //    this.pCamera.near = val;
        //    this.pCamera.updateProjectionMatrix();
        //  });
        //  gui.add(this.pCamera, 'far', 1, 100, 1).onChange((val) => {
        //    this.pCamera.far = val;
        //    this.pCamera.updateProjectionMatrix();
        //  });
        gui.add(this.camera, 'zoom', 0.1, 10, 0.1).onChange((val) => {
          this.camera.zoom = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(params, 'wireframe').onChange((val) => {
          this.mesh.material.wireframe = val;
        });
        gui.add(this.camera, 'fov', 40, 150, 1).onChange((val) => {
          this.camera.fov = val;
          this.camera.updateProjectionMatrix();
        });
        gui.add(params, 'switchCamera');
        gui.addColor(params, 'color').onChange((val) => {
          this.mesh.material.color.set(val);
        });
      },
      helpers() {
        // 创建辅助坐标系
        const axesHelper = new THREE.AxesHelper();
        const cameraHelper = new THREE.CameraHelper(this.pCamera);
        // 创建辅助平面
        const gridHelper = new THREE.GridHelper();
        this.scene.add(axesHelper, cameraHelper);
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
      count: 0, // 当前点的索引
      moveCamera() {
        const index = this.count % this.points.length;
        const point = this.points[index];
        const nextPoint =
          this.points[index + 1 >= this.points.length ? 0 : index + 1];
        this.pCamera.position.set(point.x, 0, -point.y);
        this.pCamera.lookAt(nextPoint.x, 0, -nextPoint.y); // 让人眼视角沿着路径观察
        this.sphereMesh.position.set(point.x, 0, -point.y);
        this.count++;
      },
      tick() {
        this.mesh.rotation.y += 0.01;
        this.orbitControls.update();
        this.moveCamera();
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
        this.curveGenerator();
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
