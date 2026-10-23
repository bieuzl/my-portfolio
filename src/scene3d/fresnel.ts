import * as THREE from "three";

/**
 * Graphite surface with an electric-blue fresnel rim and a faint cyan
 * transition band. Ambient lift guarantees no face falls to pure black.
 * Shared by every sculpture in the site so they read as one family.
 */
export function makeFresnelMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDark: { value: new THREE.Color("#1c1c26") },
      uGraphite: { value: new THREE.Color("#32323e") },
      uCyan: { value: new THREE.Color("#38e1ff") },
      uBlue: { value: new THREE.Color("#3d8bff") },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vNormal = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uDark;
      uniform vec3 uGraphite;
      uniform vec3 uCyan;
      uniform vec3 uBlue;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec3 n = normalize(vNormal);
        float facing = abs(dot(n, normalize(vViewDir)));
        float fresnel = pow(1.0 - facing, 2.2);
        /* top faces read lighter, sides darker — but never black */
        float top = clamp(n.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 color = mix(uDark, uGraphite, 0.5 + 0.5 * top);
        color = mix(color, uCyan, smoothstep(0.3, 0.75, fresnel) * 0.35);
        color = mix(color, uBlue, smoothstep(0.5, 1.0, fresnel));
        gl_FragColor = vec4(color, 1.0);
        /* uniforms enter in linear space (THREE.ColorManagement); without
           this chunk the raw linear values hit the canvas and read black */
        #include <colorspace_fragment>
      }
    `,
  });
}
