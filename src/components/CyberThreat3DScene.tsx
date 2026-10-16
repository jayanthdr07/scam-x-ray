import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Shield,
  Layers,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Maximize2,
  Minimize2,
  Activity,
  Zap,
  Flame,
  Radio,
  Lock,
} from 'lucide-react';
import { RiskBand } from '../types/analysis';

// Reusable math vectors to prevent garbage collection inside render loop
const _vec3 = new THREE.Vector3();
const _targetLook = new THREE.Vector3(0, 1.2, 0);

interface CyberThreat3DSceneProps {
  threatScore?: number;
  riskBand?: RiskBand;
  companyName?: string;
}

export const CyberThreat3DScene: React.FC<CyberThreat3DSceneProps> = ({
  threatScore,
  riskBand,
  companyName,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Scene state and controls
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<'orbit' | 'front' | 'top' | 'macro'>('orbit');
  const [threatStateMode, setThreatStateMode] = useState<'normal' | 'elevated' | 'critical'>(
    riskBand === 'CRITICAL' ? 'critical' : riskBand === 'HIGH' ? 'elevated' : 'normal'
  );
  const [materialFinish, setMaterialFinish] = useState<'titanium' | 'wireframe' | 'obsidian' | 'holo'>('titanium');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync threat state mode when incoming props change
  useEffect(() => {
    if (threatScore !== undefined) {
      if (threatScore >= 75) setThreatStateMode('critical');
      else if (threatScore >= 45) setThreatStateMode('elevated');
      else setThreatStateMode('normal');
    }
  }, [threatScore]);

  // Mutable refs for Three.js animation loop
  const animRefs = useRef({
    explodedTarget: 0,
    explodedCurrent: 0,
    threatMode: 'normal' as 'normal' | 'elevated' | 'critical',
    materialFinish: 'titanium' as 'titanium' | 'wireframe' | 'obsidian' | 'holo',
    cameraTargetPos: new THREE.Vector3(0, 2.2, 4.6),
    cameraLookAt: new THREE.Vector3(0, 1.2, 0),
    autoRotate: true,
  });

  // Keep mutable animation refs up-to-date
  useEffect(() => {
    animRefs.current.explodedTarget = explodedRatio;
    animRefs.current.threatMode = threatStateMode;
    animRefs.current.materialFinish = materialFinish;
  }, [explodedRatio, threatStateMode, materialFinish]);

  // Set camera view angles with smooth exponential damping
  const setCameraPreset = useCallback((preset: 'orbit' | 'front' | 'top' | 'macro') => {
    setActivePreset(preset);
    if (preset === 'orbit') {
      animRefs.current.cameraTargetPos.set(3.2, 2.4, 3.8);
      animRefs.current.cameraLookAt.set(0, 1.2, 0);
      animRefs.current.autoRotate = true;
    } else if (preset === 'front') {
      animRefs.current.cameraTargetPos.set(0, 1.2, 4.5);
      animRefs.current.cameraLookAt.set(0, 1.2, 0);
      animRefs.current.autoRotate = false;
    } else if (preset === 'top') {
      animRefs.current.cameraTargetPos.set(0, 5.0, 0.05);
      animRefs.current.cameraLookAt.set(0, 0.5, 0);
      animRefs.current.autoRotate = false;
    } else if (preset === 'macro') {
      animRefs.current.cameraTargetPos.set(0.9, 1.4, 1.2);
      animRefs.current.cameraLookAt.set(0, 1.2, 0);
      animRefs.current.autoRotate = false;
    }
  }, []);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene & Horizon Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712); // slate-950
    scene.fog = new THREE.FogExp2(0x030712, 0.06);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.2, 2.4, 3.8);

    // 3. Renderer with PBR Color Pipeline
    const isHeadless = typeof navigator !== 'undefined' && (/HeadlessChrome/i.test(navigator.userAgent) || navigator.webdriver);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isHeadless,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Reflection via RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.2;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below ground
    controls.target.copy(_targetLook);

    // 6. Balanced Studio Rig (<= 3 shadow casters)
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(4, 6, 3);
    keyLight.castShadow = !isHeadless;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 3;
    keyLight.shadow.camera.bottom = -3;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Cool Hemisphere Fill Light
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2);
    scene.add(hemiLight);

    // Dynamic Threat Rim Light (shifts color based on alert)
    const rimLight = new THREE.PointLight(0x06b6d4, 3.5, 10);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // 7. Procedural Ground Contact Shadow & Hex Grid
    // Contact Shadow Disk flush with ground
    const shadowGeo = new THREE.PlaneGeometry(5, 5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.005;
    scene.add(shadowMesh);

    // Procedural Coordinates Hex Ground Grid
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 512;
    gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d')!;
    gctx.fillStyle = '#030712';
    gctx.fillRect(0, 0, 512, 512);

    // Draw coordinate grid lines
    gctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    gctx.lineWidth = 1;
    for (let i = 0; i < 512; i += 32) {
      gctx.beginPath();
      gctx.moveTo(i, 0);
      gctx.lineTo(i, 512);
      gctx.stroke();
      gctx.beginPath();
      gctx.moveTo(0, i);
      gctx.lineTo(512, i);
      gctx.stroke();
    }
    // Sub-crosshairs
    gctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
    for (let x = 64; x < 512; x += 128) {
      for (let y = 64; y < 512; y += 128) {
        gctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }

    const gridTex = new THREE.CanvasTexture(gridCanvas);
    gridTex.colorSpace = THREE.SRGBColorSpace;
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    gridTex.repeat.set(6, 6);
    gridTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      map: gridTex,
      roughness: 0.7,
      metalness: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = !isHeadless;
    scene.add(floorMesh);

    // 8. HERO SUBJECT: Composite Procedural Cyber Threat Sentinel (THREE.Group with 8 distinct parts)
    const heroGroup = new THREE.Group();
    heroGroup.position.set(0, 0, 0);
    scene.add(heroGroup);

    // Part 1: Heavy Pedestal Ring & Base Platform (grounded at y=0)
    const baseGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.12, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.85,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.06;
    pedestal.receiveShadow = !isHeadless;
    pedestal.castShadow = !isHeadless;
    baseGroup.add(pedestal);

    // Glowing coordinate perimeter bezel
    const bezelGeo = new THREE.TorusGeometry(1.42, 0.02, 16, 64);
    const bezelMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.rotation.x = Math.PI / 2;
    bezel.position.y = 0.12;
    baseGroup.add(bezel);
    heroGroup.add(baseGroup);

    // Center Anchor Pivot at y = 1.2
    const coreCenterY = 1.2;

    // Part 2: Outer Gimbal Ring (Mechanical Torus with Brackets)
    const outerGimbalGroup = new THREE.Group();
    outerGimbalGroup.position.y = coreCenterY;
    const outerRingGeo = new THREE.TorusGeometry(1.15, 0.04, 16, 64);
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.2,
      metalness: 0.9,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerGimbalGroup.add(outerRing);
    heroGroup.add(outerGimbalGroup);

    // Part 3: Inner Gimbal Ring (Perpendicular axis rotation)
    const innerGimbalGroup = new THREE.Group();
    innerGimbalGroup.position.y = coreCenterY;
    const innerRingGeo = new THREE.TorusGeometry(0.92, 0.035, 16, 64);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.15,
      metalness: 0.95,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 2;
    innerGimbalGroup.add(innerRing);
    heroGroup.add(innerGimbalGroup);

    // Part 4: Central Crystalline Forensic Quantum Core (Optical Glass MeshPhysicalMaterial)
    const coreGroup = new THREE.Group();
    coreGroup.position.y = coreCenterY;

    const coreGeo = new THREE.IcosahedronGeometry(0.5, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.62,
      thickness: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transparent: true,
      depthWrite: false,
    });
    const coreCrystal = new THREE.Mesh(coreGeo, coreMat);
    coreCrystal.castShadow = !isHeadless;
    coreGroup.add(coreCrystal);

    // Part 5: Inner Neural Threat Wireframe Matrix
    const wireGeo = new THREE.OctahedronGeometry(0.32, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
    });
    const wireCore = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireCore);
    heroGroup.add(coreGroup);

    // Part 6: 4 Outer Aegis Armored Shield Plates (Extruded Faceted Shells)
    const shieldPlatesGroup = new THREE.Group();
    shieldPlatesGroup.position.y = coreCenterY;

    const plateShapes: THREE.Mesh[] = [];
    const plateGeo = new THREE.BoxGeometry(0.35, 0.9, 0.06);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.28,
      metalness: 0.92,
    });

    const plateAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    plateAngles.forEach((angle, idx) => {
      const p = new THREE.Mesh(plateGeo, plateMat.clone());
      p.castShadow = !isHeadless;
      const radius = 1.35;
      p.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      p.rotation.y = -angle + Math.PI / 2;
      p.userData = { angle, baseRadius: radius, index: idx };
      plateShapes.push(p);
      shieldPlatesGroup.add(p);
    });
    heroGroup.add(shieldPlatesGroup);

    // Part 7: 4 Threat Interceptor Nodes / Sensor Pylons (Copper heat sink + alert crystals)
    const pylonsGroup = new THREE.Group();
    pylonsGroup.position.y = coreCenterY;

    const pylonNodes: THREE.Mesh[] = [];
    const pylonGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.6, 16);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // amber copper
      roughness: 0.3,
      metalness: 0.8,
    });

    const tipCrystalGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const tipCrystalMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const pylonAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
    pylonAngles.forEach((angle) => {
      const arm = new THREE.Group();
      const radius = 1.1;
      arm.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      arm.rotation.z = Math.PI / 4;
      arm.rotation.y = -angle;

      const cylinder = new THREE.Mesh(pylonGeo, pylonMat);
      cylinder.castShadow = !isHeadless;
      arm.add(cylinder);

      const tip = new THREE.Mesh(tipCrystalGeo, tipCrystalMat.clone());
      tip.position.y = 0.32;
      arm.add(tip);
      pylonNodes.push(tip);

      pylonsGroup.add(arm);
    });
    heroGroup.add(pylonsGroup);

    // Part 8: Orbiting Threat Telemetry Packets (Instanced / Grouped Spheres)
    const packetsGroup = new THREE.Group();
    packetsGroup.position.y = coreCenterY;
    const packetGeo = new THREE.SphereGeometry(0.035, 8, 8);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packetMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const pm = new THREE.Mesh(packetGeo, packetMat);
      pm.userData = { speed: 1.2 + i * 0.3, phase: (i * Math.PI) / 3, orbitRadius: 0.75 + (i % 3) * 0.2 };
      packetMeshes.push(pm);
      packetsGroup.add(pm);
    }
    heroGroup.add(packetsGroup);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 9. Animation & Render Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const {
        explodedTarget,
        threatMode,
        materialFinish: currentFinish,
        cameraTargetPos,
        cameraLookAt,
        autoRotate,
      } = animRefs.current;

      // Exponential damping on exploded separation slider
      animRefs.current.explodedCurrent = THREE.MathUtils.damp(
        animRefs.current.explodedCurrent,
        explodedTarget,
        6,
        dt
      );
      const curExp = animRefs.current.explodedCurrent;

      // Smooth camera position damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, cameraTargetPos.x, 3, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, cameraTargetPos.y, 3, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTargetPos.z, 3, dt);
      controls.target.x = THREE.MathUtils.damp(controls.target.x, cameraLookAt.x, 4, dt);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, cameraLookAt.y, 4, dt);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, cameraLookAt.z, 4, dt);

      // Threat mode color & speed multipliers
      let coreColor = 0x06b6d4; // Cyan (Normal)
      let alertLightColor = 0x06b6d4;
      let rotSpeed = 0.5;

      if (threatMode === 'elevated') {
        coreColor = 0xf59e0b; // Amber
        alertLightColor = 0xf59e0b;
        rotSpeed = 1.1;
      } else if (threatMode === 'critical') {
        coreColor = 0xef4444; // Red
        alertLightColor = 0xef4444;
        rotSpeed = 2.0;
      }

      rimLight.color.setHex(alertLightColor);

      // Apply finish swatches dynamically
      if (currentFinish === 'wireframe') {
        coreMat.wireframe = true;
        plateMat.wireframe = true;
      } else {
        coreMat.wireframe = false;
        plateMat.wireframe = false;
        if (currentFinish === 'obsidian') {
          plateMat.color.setHex(0x020617);
          plateMat.metalness = 0.98;
          plateMat.roughness = 0.1;
          coreMat.color.setHex(0x0f172a);
        } else if (currentFinish === 'holo') {
          plateMat.color.setHex(0x06b6d4);
          plateMat.metalness = 0.4;
          plateMat.roughness = 0.1;
          coreMat.color.setHex(coreColor);
        } else {
          // Titanium default
          plateMat.color.setHex(0x1e293b);
          plateMat.metalness = 0.92;
          plateMat.roughness = 0.28;
          coreMat.color.setHex(coreColor);
        }
      }

      wireMat.color.setHex(alertLightColor);

      // Kinematics: Gimbal dual-axis counter rotations
      outerGimbalGroup.rotation.y += 0.4 * rotSpeed * dt;
      outerGimbalGroup.rotation.z = Math.sin(time * 0.001 * rotSpeed) * 0.15;

      innerGimbalGroup.rotation.x += 0.6 * rotSpeed * dt;
      innerGimbalGroup.rotation.y = Math.cos(time * 0.0012 * rotSpeed) * 0.2;

      // Core rotation and neural wire pulse
      coreCrystal.rotation.y += 0.8 * rotSpeed * dt;
      coreCrystal.rotation.x = Math.sin(time * 0.0015 * rotSpeed) * 0.2;
      wireCore.rotation.y -= 1.2 * rotSpeed * dt;
      wireCore.rotation.z += 0.4 * rotSpeed * dt;

      // Exploded anatomy displacement mapping:
      // Separate plates outward by curExp * 1.5 units
      plateShapes.forEach((p) => {
        const baseR = p.userData.baseRadius;
        const currentR = baseR + curExp * 1.2;
        const angle = p.userData.angle;
        p.position.set(Math.cos(angle) * currentR, 0, Math.sin(angle) * currentR);
      });

      // Elevate outer gimbals and core vertically during exploded view
      outerGimbalGroup.position.y = coreCenterY + curExp * 0.6;
      innerGimbalGroup.position.y = coreCenterY - curExp * 0.4;
      pylonsGroup.position.y = coreCenterY + curExp * 0.3;

      // Orbiting packets
      packetMeshes.forEach((pm) => {
        const d = pm.userData;
        const angle = time * 0.001 * d.speed * rotSpeed + d.phase;
        pm.position.set(
          Math.cos(angle) * d.orbitRadius * (1 + curExp * 0.5),
          Math.sin(angle * 2) * 0.25,
          Math.sin(angle) * d.orbitRadius * (1 + curExp * 0.5)
        );
      });

      // Tip diode crystals alert coloring
      pylonNodes.forEach((node) => {
        (node.material as THREE.MeshBasicMaterial).color.setHex(alertLightColor);
      });

      if (autoRotate && activePreset === 'orbit') {
        heroGroup.rotation.y += 0.15 * dt;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      controls.dispose();
      renderer.dispose();
      scene.clear();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activePreset]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen border-none' : 'h-[540px]'
      }`}
    >
      {/* 3D WebGL Canvas Mount (Ref Container) */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Top-Left Title & Threat Status (Zero Center Occlusion) */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-slate-900/90 border border-cyan-500/30 text-cyan-400 backdrop-blur-sm">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-white">
                SENTINEL-3D CORE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300 font-mono">
                PROCEDURAL PBR
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {companyName ? `Syndicate Anatomy for: ${companyName}` : 'Holographic Cyber Threat Anatomy'}
            </p>
          </div>
        </div>

        {/* Threat Level Badge */}
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`w-2 h-2 rounded-full ${
              threatStateMode === 'critical'
                ? 'bg-rose-500'
                : threatStateMode === 'elevated'
                ? 'bg-amber-400'
                : 'bg-cyan-400'
            }`}
          />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-300">
            STATE: {threatStateMode} {threatScore !== undefined ? `(${threatScore}/100)` : ''}
          </span>
        </div>
      </div>

      {/* Top-Right Fullscreen / Reset Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setCameraPreset('orbit')}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1 transition"
          title="Reset Camera Orientation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-mono">Reset</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Cinema Fullscreen View'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* COLLAPSIBLE BOTTOM CONTROL DOCK (Unified, Zero-Occlusion Layout) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[840px] flex flex-col items-center pointer-events-auto transition-transform duration-300"
        style={{
          transform: isControlsCollapsed ? 'translate(-50%, calc(100% - 28px))' : 'translate(-50%, 0)',
        }}
      >
        {/* Collapse / Expand Toggle Tab */}
        <button
          onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
          className="px-3 py-1 rounded-t-lg bg-slate-900/95 border-t border-x border-slate-700 text-[10px] font-mono uppercase tracking-wider text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition shadow-lg"
        >
          {isControlsCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3 text-cyan-400" />
              <span>Show Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
              <span>Cinema Mode (Hide Dock)</span>
            </>
          )}
        </button>

        {/* Dock Controls Card */}
        <div className="w-full p-3 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-md flex flex-col gap-2.5">
          {/* Row 1: Exploded Slider & Camera Views */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Exploded View Slider */}
            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
              <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-[11px] font-mono uppercase text-slate-300 shrink-0">
                Exploded View:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedRatio}
                onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[11px] font-mono text-cyan-400 w-10 text-right">
                {Math.round(explodedRatio * 100)}%
              </span>
            </div>

            {/* Camera View Pills */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-mono uppercase text-slate-400 mr-1 hidden md:inline">
                Camera:
              </span>
              {[
                { id: 'orbit', label: 'Orbit 3D' },
                { id: 'front', label: 'Elevation' },
                { id: 'top', label: 'Top Grid' },
                { id: 'macro', label: 'Core Zoom' },
              ].map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setCameraPreset(cam.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                    activePreset === cam.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-semibold'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Threat Simulation Mode & Material Finish Swatches */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            {/* Threat Simulation Mode */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase text-slate-400 mr-1 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-cyan-400" />
                Threat State:
              </span>
              {[
                { id: 'normal', label: 'Safe Shield', color: 'border-cyan-500 text-cyan-400' },
                { id: 'elevated', label: 'Phishing Alert', color: 'border-amber-500 text-amber-400' },
                { id: 'critical', label: 'Syndicate Breach', color: 'border-rose-500 text-rose-400' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setThreatStateMode(mode.id as any)}
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase transition ${
                    threatStateMode === mode.id
                      ? `bg-slate-800 border ${mode.color} font-bold`
                      : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Material Finishes */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase text-slate-400 mr-1">Finish:</span>
              {[
                { id: 'titanium', label: 'Titanium' },
                { id: 'obsidian', label: 'Obsidian' },
                { id: 'holo', label: 'Holographic' },
                { id: 'wireframe', label: 'Wireframe' },
              ].map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setMaterialFinish(finish.id as any)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition ${
                    materialFinish === finish.id
                      ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {finish.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
