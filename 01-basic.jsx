import { useEffect } from 'react';
import { render } from 'react-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
const Page = () => {
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // 创建3D场景
    const scene = new THREE.Scene();
    // 创建辅助坐标系
    const axesHelper = new THREE.AxesHelper();
    // 创建辅助平面
    const gridHelper = new THREE.GridHelper();
    scene.add(axesHelper, gridHelper);

    // 添加全局光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(ambientLight, directionalLight);
    // 创建立方体的几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // 每个面设置不同颜色‘
    const faces = [];
    for (let index = 0; index < geometry.groups.length; index++) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
      });
      faces.push(material);
    }
    const mesh = new THREE.Mesh(geometry, faces);

    // // 创建立方体的基础材质
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x1890ff,
    //   //   wireframe: true,
    // });
    // // 创建3D物体对象
    // const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    // 创建相机对象
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // 设置相机位置
    camera.position.set(2, 2, 3);
    //设置相机朝向
    camera.lookAt(scene.position);
    // 将相机添加到场景中
    scene.add(camera);
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // 抗锯齿
    });
    // 设置渲染器屏幕像素比
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 执行渲染
    renderer.render(scene, camera);

    // 创建轨道控制器
    const orbitControls = new OrbitControls(camera, canvas);
    // 惯性
    orbitControls.enableDamping = true;

    // 添加性能监视器
    const stats = new Stats();
    stats.setMode(0);
    document.body.appendChild(stats.domElement);

    // THREE 时钟参数
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime(); // 递增的时间参数

      // 1.让物体运动
      //   mesh.rotation.y = elapsedTime / 1000; //自转
      //   mesh.position.x = elapsedTime / 1000;
      // mesh.scale.x += elapsedTime / 1000; // x方向逐渐拉伸
      // mesh.scale.y += elapsedTime / 1000; // y方向逐渐拉伸
      // mesh.scale.z += elapsedTime / 1000; // z方向逐渐拉伸

      //   mesh.position.x = Math.cos(elapsedTime);
      //   mesh.position.y = Math.sin(elapsedTime);

      // 2.让相机运动
      camera.position.x = Math.cos(elapsedTime);
      camera.position.y = Math.sin(elapsedTime);

      // 更新轨道控制器
      orbitControls.update();
      // 更新性能监视器
      stats.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    };
    tick();

    // 自适应屏幕大小
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return (
    <>
      <canvas id="canvas" />
    </>
  );
};

export default Page;
