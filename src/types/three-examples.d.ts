declare module "three/examples/jsm/controls/OrbitControls.js" {
  import { EventDispatcher, PerspectiveCamera, Vector3 } from "three";

  export class OrbitControls extends EventDispatcher {
    constructor(object: PerspectiveCamera, domElement?: HTMLElement);
    enabled: boolean;
    enableDamping: boolean;
    dampingFactor: number;
    enableZoom: boolean;
    zoomSpeed: number;
    enableRotate: boolean;
    rotateSpeed: number;
    enablePan: boolean;
    panSpeed: number;
    minDistance: number;
    maxDistance: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    screenSpacePanning: boolean;
    target: Vector3;
    domElement: HTMLElement;
    update(): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/DRACOLoader.js" {
  export class DRACOLoader {
    setDecoderPath(path: string): void;
    dispose(): void;
  }
}

declare module "three/examples/jsm/loaders/GLTFLoader.js" {
  import { Group, LoadingManager } from "three";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

  export type GLTF = {
    scene: Group;
  };

  export class GLTFLoader {
    constructor(manager?: LoadingManager);
    setDRACOLoader(dracoLoader: DRACOLoader): void;
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: { loaded: number; total?: number }) => void,
      onError?: (error: ErrorEvent | Error | unknown) => void,
    ): void;
  }
}
