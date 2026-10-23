/**
 * scene3d — deep module for the decorative 3D sculpture.
 *
 * Public interface is deliberately tiny: detect support, mount, steer with
 * pointer and scroll, dispose. Callers never touch Three.js concepts.
 */
export { isWebGLAvailable } from "./support";
export { mountSculptureScene } from "./SculptureScene";
export type { SceneHandle, SceneOptions } from "./SculptureScene";
