/**
 * scene3d — deep module for the hero's 3D centerpiece.
 *
 * Public interface is deliberately tiny: detect support, mount, steer with
 * the pointer, dispose. Callers never touch Three.js concepts.
 */
export { isWebGLAvailable } from "./support";
export { mountKeycapScene } from "./KeycapScene";
export type { SceneHandle, SceneOptions } from "./KeycapScene";
