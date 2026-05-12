"use client";

import { useEffect, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  AxesHelper,
  Box3,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  GridHelper,
  Group,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const CYAN = new Color(0x00e5ff);
const GOLD = new Color(0xffaa00);

// ─── Pure helpers (no React) ──────────────────────────────────────────────────
function createScene() {
  const scene = new Scene();
  scene.background = new Color(0x050a0f);
  scene.fog = new FogExp2(0x050a0f, 0.02);
  return scene;
}

function createCamera(w, h) {
  const cam = new PerspectiveCamera(45, w / h, 0.01, 500);
  cam.position.set(0, 0.5, 8); // Increased initial distance for better zoom range
  return cam;
}

function createRenderer(canvas, w, h) {
  const testCtx = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!testCtx) throw new Error("WebGL not supported in this browser.");

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.outputColorSpace = SRGBColorSpace;
  return renderer;
}

function createLights(scene) {
  // Ambient base
  scene.add(new AmbientLight(0x1a2a3a, 1.8));

  // Main key light - casts shadows
  const keyLight = new DirectionalLight(0xffeedd, 3.5);
  keyLight.position.set(3, 8, 4);
  keyLight.castShadow = true;
  keyLight.receiveShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 5;
  keyLight.shadow.camera.bottom = -5;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.normalBias = 0.02;
  scene.add(keyLight);

  // Fill light from opposite side
  const fillLight = new DirectionalLight(0x446688, 1.8);
  fillLight.position.set(-4, 3, -3);
  fillLight.castShadow = true;
  fillLight.shadow.mapSize.width = 1024;
  fillLight.shadow.mapSize.height = 1024;
  fillLight.shadow.camera.near = 0.5;
  fillLight.shadow.camera.far = 40;
  fillLight.shadow.bias = -0.0005;
  scene.add(fillLight);

  // Cyan rim light for edge definition
  const rimLight1 = new PointLight(0x00e5ff, 1.2);
  rimLight1.position.set(-2, 4, -5);
  scene.add(rimLight1);

  const rimLight2 = new PointLight(0x3366aa, 0.8);
  rimLight2.position.set(4, 3, -4);
  scene.add(rimLight2);

  // Under-lighting for dramatic effect
  const underLight = new PointLight(0x225588, 0.6);
  underLight.position.set(0, -1, 2);
  scene.add(underLight);
}

function createAdvancedGrid(scene) {
  const group = new Group();

  // Main holographic grid floor
  const gridSize = 12;
  const divisions = 40;

  // Primary grid (cyan)
  const gridHelper1 = new GridHelper(gridSize, divisions, 0x00e5ff, 0x1a3a5a);
  gridHelper1.position.y = -1.2;
  group.add(gridHelper1);

  // Secondary grid (gold/amber) - rotated for complexity
  const gridHelper2 = new GridHelper(
    gridSize * 1.2,
    divisions * 1.5,
    0xffaa00,
    0x2a1a0a,
  );
  gridHelper2.position.y = -1.19;
  gridHelper2.rotation.y = Math.PI / 4;
  group.add(gridHelper2);

  // Circular reference rings
  const rings = createCircularRings();
  rings.position.y = -1.18;
  group.add(rings);

  // Outer boundary ring
  const boundaryRing = new Mesh(
    new TorusGeometry(5.8, 0.02, 16, 100),
    new MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: new Color(0x004466),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3,
    }),
  );
  boundaryRing.rotation.x = Math.PI / 2;
  boundaryRing.position.y = -1.17;
  group.add(boundaryRing);

  // Corner markers
  const corners = createCornerMarkers();
  corners.position.y = -1.18;
  group.add(corners);

  // Central platform (receives shadows beautifully)
  const platform = new Mesh(
    new CylinderGeometry(2.2, 2.2, 0.05, 32),
    new MeshStandardMaterial({
      color: 0x0a1a2a,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0.7,
      emissive: new Color(0x112233),
      emissiveIntensity: 0.3,
    }),
  );
  platform.position.y = -1.2;
  platform.receiveShadow = true;
  group.add(platform);

  // Add floating particles around the grid
  const particles = createGridParticles();
  particles.position.y = -1.15;
  group.add(particles);

  scene.add(group);
  return group;
}

function createCircularRings() {
  const group = new Group();
  const radii = [2.5, 3.8, 5.0];

  radii.forEach((r, i) => {
    const ring = new Mesh(
      new TorusGeometry(r, 0.008, 8, 64),
      new MeshStandardMaterial({
        color: i === 1 ? 0xffaa00 : 0x00e5ff,
        emissive: i === 1 ? new Color(0x553300) : new Color(0x004466),
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.15 + i * 0.1,
      }),
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
  });

  return group;
}

function createCornerMarkers() {
  const group = new Group();
  const positions = [
    [-5.5, 0, -5.5],
    [5.5, 0, -5.5],
    [-5.5, 0, 5.5],
    [5.5, 0, 5.5],
  ];

  positions.forEach((pos) => {
    const marker = new Mesh(
      new BoxGeometry(0.15, 0.02, 0.15),
      new MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: new Color(0x004466),
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.6,
      }),
    );
    marker.position.set(pos[0], 0, pos[2]);
    group.add(marker);
  });

  return group;
}

function createGridParticles() {
  const geometry = new BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 4.5 + Math.random() * 2;
    positions[i] = Math.cos(angle) * radius;
    positions[i + 1] = 0;
    positions[i + 2] = Math.sin(angle) * radius;
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    color: 0x00e5ff,
    size: 0.015,
    transparent: true,
    opacity: 0.4,
    blending: AdditiveBlending,
  });

  return new Points(geometry, material);
}

function createControls(camera, domElement) {
  const ctrl = new OrbitControls(camera, domElement);

  // Basic settings
  ctrl.enableDamping = true;
  ctrl.dampingFactor = 0.05;

  // Zoom settings - CRITICAL FIX
  ctrl.enableZoom = true;
  ctrl.zoomSpeed = 2.5; // Increased zoom sensitivity
  ctrl.enableRotate = true;
  ctrl.rotateSpeed = 1.0;
  ctrl.enablePan = true;
  ctrl.panSpeed = 0.8;

  // Distance limits - EXTENDED FOR BETTER ZOOM
  ctrl.minDistance = 0.1; // Allow very close zoom
  ctrl.maxDistance = 20; // Allow very far zoom

  // Auto-rotate
  ctrl.autoRotate = true;
  ctrl.autoRotateSpeed = 0.8;

  // Screen space panning
  ctrl.screenSpacePanning = true;

  return ctrl;
}

function autoFitModel(gltf) {
  const root = gltf.scene;

  const box1 = new Box3().setFromObject(root);
  const size1 = new Vector3();
  box1.getSize(size1);
  const maxDim = Math.max(size1.x, size1.y, size1.z);

  if (maxDim > 0) root.scale.setScalar(2.2 / maxDim);

  const box2 = new Box3().setFromObject(root);
  const center = new Vector3();
  box2.getCenter(center);
  root.position.sub(center);

  // Position feet at y = 0
  root.position.y -= box2.min.y;

  return root;
}

function collectMeshes(root) {
  const list = [];
  root.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;

      // Enhance materials for better visualization
      if (obj.material) {
        const mats = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        mats.forEach((mat) => {
          if (mat) {
            mat.roughness = 0.45;
            mat.metalness = 0.15;
            mat.envMapIntensity = 1.2;

            // Store original colors for highlighting
            if (!mat.userData._origColor) {
              mat.userData._origColor = mat.color.clone();
              mat.userData._origEmissive = mat.emissive.clone();
            }
          }
        });
      }

      list.push(obj);
    }
  });
  return list;
}

function disposeMesh(obj) {
  if (!obj.isMesh) return;
  obj.geometry?.dispose();
  const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
  mats.forEach((m) => {
    if (!m) return;
    Object.values(m).forEach((v) => {
      if (v?.isTexture) v.dispose();
    });
    m.dispose();
  });
}

// ─── Enhanced Highlight helpers ────────────────────────────────────────────────
function applyHighlight(mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    if (!m) return;

    // Store original values
    if (!m.userData._origColor) {
      m.userData._origColor = m.color.clone();
      m.userData._origEmissive = m.emissive.clone();
      m.userData._origRoughness = m.roughness;
    }

    // Apply premium highlight effect
    m.color.lerp(CYAN, 0.7);
    m.emissive.copy(GOLD);
    m.emissiveIntensity = 0.4;
    m.roughness = 0.3;

    if (m.emissive) {
      m.needsUpdate = true;
    }
  });
}

function removeHighlight(mesh) {
  const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  mats.forEach((m) => {
    if (!m) return;

    if (m.userData._origColor) {
      m.color.copy(m.userData._origColor);
      m.emissive.copy(m.userData._origEmissive);
      m.roughness = m.userData._origRoughness || 0.45;
      m.emissiveIntensity = 0;
      m.needsUpdate = true;
    }
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SkeletonViewer({ showDebug = false }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const [info, setInfo] = useState({
    phase: "loading",
    pct: 0,
    bone: null,
    error: null,
  });

  useEffect(() => {
    const wrapper = mountRef.current;
    if (!wrapper) return;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "display:block;width:100%;height:100%;";
    wrapper.appendChild(canvas);

    const W = wrapper.clientWidth || window.innerWidth;
    const H = wrapper.clientHeight || window.innerHeight;

    let scene, camera, renderer, controls;
    try {
      scene = createScene();
      camera = createCamera(W, H);
      renderer = createRenderer(canvas, W, H);
      controls = createControls(camera, renderer.domElement);
    } catch (err) {
      console.error("[SkeletonViewer] Init error:", err);
      setInfo({ phase: "error", error: err.message });
      canvas.remove();
      return;
    }

    createLights(scene);
    const gridGroup = createAdvancedGrid(scene);

    if (showDebug) {
      scene.add(new AxesHelper(1.5));
      const debugGrid = new GridHelper(8, 20, 0xff0000, 0x330000);
      debugGrid.position.y = -1.15;
      scene.add(debugGrid);
    }

    // Add subtle environment reflection
    const envLight = new HemisphereLight(0x446688, 0x223344, 1.2);
    scene.add(envLight);

    stateRef.current = {
      scene,
      camera,
      renderer,
      controls,
      meshes: [],
      selected: null,
      gridGroup,
    };

    // ── Load GLB ─────────────────────────────────────────────────────────────
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    let alive = true;

    loader.load(
      "/skeleton-optimized.glb",
      (gltf) => {
        if (!alive) return;

        const model = autoFitModel(gltf);
        const meshes = collectMeshes(model);
        scene.add(model);
        stateRef.current.meshes = meshes;

        const box = new Box3().setFromObject(model);
        const size = new Vector3();
        box.getSize(size);
        camera.position.set(2, size.y * 0.6, size.z * 4.5); // Increased distance for better zoom range
        controls.target.set(0, size.y * 0.4, 0);
        controls.update();

        setInfo({ phase: "ready", pct: 100, bone: null, error: null });
        console.log("[SkeletonViewer] Model loaded — meshes:", meshes.length);
      },
      ({ loaded, total }) => {
        if (!alive) return;
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;
        setInfo((p) => ({ ...p, pct }));
      },
      (err) => {
        if (!alive) return;
        console.error("[SkeletonViewer] Load error:", err);
        setInfo({
          phase: "error",
          error: "Cannot load /public/skeleton.glb — check the file exists.",
        });
      },
    );

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = wrapper.clientWidth || window.innerWidth;
      const h = wrapper.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(wrapper);
    window.addEventListener("resize", onResize);

    // ── Raycast / click ───────────────────────────────────────────────────────
    const raycaster = new Raycaster();
    const mouse = new Vector2();

    const onClick = (e) => {
      const { meshes, selected } = stateRef.current;
      if (!meshes.length) return;

      const rect = canvas.getBoundingClientRect();
      mouse.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ((e.clientY - rect.top) / rect.height) * -2 + 1,
      );

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes, false);

      if (hits.length) {
        const hit = hits[0].object;
        if (selected && selected !== hit) removeHighlight(selected);
        applyHighlight(hit);
        stateRef.current.selected = hit;
        const name = hit.name || hit.parent?.name || "unnamed";
        console.log("[SkeletonViewer] Selected:", name);
        setInfo((p) => ({ ...p, bone: name }));

        // Temporarily disable auto-rotate on selection
        controls.autoRotate = false;
        setTimeout(() => {
          controls.autoRotate = true;
        }, 3000);
      } else {
        if (selected) removeHighlight(selected);
        stateRef.current.selected = null;
        setInfo((p) => ({ ...p, bone: null }));
      }
    };

    // Fix for wheel/zoom event
    const onWheel = (e) => {
      // Don't prevent default - let OrbitControls handle it
      e.stopPropagation();
    };

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("wheel", onWheel, { passive: false });

    // ── Render loop with auto-rotate ───────────────────────────────────────────
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      // Subtle grid animation
      if (gridGroup) {
        gridGroup.children.forEach((child, index) => {
          if (child.isMesh && child.material.transparent) {
            const time = Date.now() * 0.001;
            child.material.opacity = 0.15 + Math.sin(time * 0.5 + index) * 0.1;
          }
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("wheel", onWheel);
      controls.dispose();
      scene.traverse(disposeMesh);
      renderer.dispose();
      try {
        renderer.forceContextLoss();
      } catch (_) {
        console.log(_);
      }
      canvas.remove();
    };
  }, [showDebug]);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  const ready = info.phase === "ready";
  const loading = info.phase === "loading";
  const error = info.phase === "error";

  return (
    <div ref={mountRef} style={S.wrapper}>
      <div style={S.scanlines} />
      <div style={S.vignette} />

      {loading && (
        <div style={S.overlay}>
          <div style={S.spinner} />
          <p style={S.loaderText}>
            INITIALIZING SKELETON{info.pct > 0 ? ` · ${info.pct}%` : "…"}
          </p>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${info.pct}%` }} />
          </div>
        </div>
      )}

      {error && (
        <div style={S.overlay}>
          <p style={S.errText}>⚠ SYSTEM ERROR</p>
          <p style={S.errSub}>{info.error}</p>
          <p style={S.errHint}>
            Place <code>skeleton.glb</code> in <code>/public/</code>
          </p>
        </div>
      )}

      {ready && (
        <>
          <aside style={S.panel}>
            <div style={S.divider} />
            <Row
              label="SELECTED"
              value={info.bone ?? "—"}
              valueColor={info.bone ? "#ffaa00" : "#2a4a5a"}
            />
            {info.bone && (
              <div style={S.highlightIndicator}>
                <span style={S.highlightDot}>◆</span>
                <span style={S.highlightText}>HIGHLIGHT ACTIVE</span>
              </div>
            )}
          </aside>

          <footer style={S.footer}>
            <Hint icon="⟳" label="Drag · Rotate" />
            <Hint icon="⊕" label="Scroll · Zoom" />
            <Hint icon="⌖" label="Right · Pan" />
            <Hint icon="◎" label="Click · Select" />
            <Hint icon="⬤" label="Auto-Rotate" />
          </footer>
        </>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function Row({ label, value, valueColor }) {
  return (
    <div style={S.row}>
      <span style={S.rowLabel}>{label}</span>
      <span style={{ ...S.rowValue, color: valueColor }}>{value}</span>
    </div>
  );
}

function Hint({ icon, label }) {
  return (
    <div style={S.hint}>
      <span style={S.hintIcon}>{icon}</span>
      <span style={S.hintLabel}>{label}</span>
    </div>
  );
}

// ─── Enhanced Styles ──────────────────────────────────────────────────────────
const S = {
  wrapper: {
    position: "relative", // ← CHANGED from "fixed"
    width: "100%",
    height: "100vh",
    minHeight: "500px", // ← ADDED minimum height
    background: "radial-gradient(circle at 50% 30%, #0a1a2a, #050a0f)",
    fontFamily: "'Share Tech Mono','Courier New',monospace",
    overflow: "hidden",
    userSelect: "none",
    touchAction: "none",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    backgroundImage:
      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,.008) 2px, rgba(0,229,255,.008) 4px)",
  },
  vignette: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 1,
    background:
      "radial-gradient(circle at 50% 50%, transparent 40%, rgba(5,10,15,0.4) 100%)",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    background: "rgba(5,10,15,.85)",
    backdropFilter: "blur(8px)",
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    border: "2px solid rgba(0,229,255,.1)",
    borderTop: "2px solid #00e5ff",
    borderRight: "2px solid #ffaa00",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    color: "#00e5ff",
    fontSize: 12,
    letterSpacing: "0.25em",
    margin: 0,
    textShadow: "0 0 10px rgba(0,229,255,0.5)",
  },
  progressBar: {
    width: 200,
    height: 2,
    background: "rgba(0,229,255,.1)",
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00e5ff, #ffaa00)",
    transition: "width 0.3s ease",
  },
  errText: {
    color: "#ff4466",
    fontSize: 14,
    letterSpacing: "0.15em",
    margin: 0,
    textShadow: "0 0 10px rgba(255,68,102,0.5)",
  },
  errSub: {
    color: "#4a6a7a",
    fontSize: 11,
    letterSpacing: "0.08em",
    margin: 0,
  },
  errHint: {
    color: "#2a4a5a",
    fontSize: 10,
    letterSpacing: "0.06em",
    margin: 0,
    marginTop: 10,
  },
  panel: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 260,
    padding: "16px 20px",
    background: "rgba(8,14,20,.92)",
    border: "1px solid rgba(0,229,255,.2)",
    borderRadius: 4,
    backdropFilter: "blur(16px)",
    zIndex: 10,
    boxShadow: "0 0 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,229,255,0.05) inset",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  panelTitle: {
    color: "#00e5ff",
    fontSize: 11,
    letterSpacing: "0.2em",
    fontWeight: "bold",
  },
  statusDot: {
    color: "#00ff88",
    fontSize: 8,
    animation: "pulse 2s ease-in-out infinite",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
  },
  rowLabel: {
    color: "#3a6a8a",
    fontSize: 9,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  rowValue: {
    fontSize: 11,
    letterSpacing: "0.08em",
    maxWidth: 140,
    textAlign: "right",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    background:
      "linear-gradient(90deg, transparent, rgba(0,229,255,.15), transparent)",
    margin: "10px 0",
  },
  highlightIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    padding: "6px 8px",
    background: "rgba(255,170,0,0.08)",
    border: "1px solid rgba(255,170,0,0.2)",
    borderRadius: 2,
  },
  highlightDot: {
    color: "#ffaa00",
    fontSize: 8,
    animation: "pulse 1.5s ease-in-out infinite",
  },
  highlightText: {
    color: "#ffaa00",
    fontSize: 8,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 24,
    padding: "10px 28px",
    background: "rgba(8,14,20,.88)",
    border: "1px solid rgba(0,229,255,.15)",
    borderRadius: 30,
    backdropFilter: "blur(16px)",
    zIndex: 10,
    boxShadow: "0 0 30px rgba(0,0,0,0.4)",
  },
  hint: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    opacity: 0.8,
  },
  hintIcon: {
    color: "#00e5ff",
    fontSize: 13,
    textShadow: "0 0 8px rgba(0,229,255,0.5)",
  },
  hintLabel: {
    color: "#4a7a9a",
    fontSize: 9,
    letterSpacing: "0.12em",
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  },
};
