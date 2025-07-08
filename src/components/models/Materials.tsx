import * as THREE from 'three'
import { frag as bigCloud } from '../../shader/fragment/BigCloud.frag'
import { frag as bigCloudBG } from '../../shader/fragment/BigCloudBG.frag'
import { vert as simpleVert } from '../../shader/vertex/simple.vert'
import { useMemo } from 'react'
import { useLoader } from '@react-three/fiber'
import { RE_Direct_ToonPhysical } from '@/shader/chunk/RE_Direct_ToonPhysical.chunk'
import { default as lights_fragment_beginToon } from '@/shader/chunk/lights_fragment_beginToon'
import { ACES_fog_fragment } from '@/shader/chunk/ACES_fog_fragment.chunk'
import { RE_Direct_ToonPhysical_Road } from '@/shader/chunk/RE_Direct_ToonPhysical.chunk_Road'
import { patch } from '@/shader/chunk/patch.chunk'

export function useBigCloudMaterial() {
  const texture = useLoader(THREE.TextureLoader, '/Genshin/Login/Textures/Tex_0063.png')
  const isTextureLoaded = !!texture && texture.image && texture.image.width > 0

  return useMemo(() => {
    if (!isTextureLoaded) return null
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudTexture: { value: texture },
      },
      fragmentShader: bigCloud,
      vertexShader: simpleVert,
      transparent: true,
      depthWrite: false,
    })
  }, [isTextureLoaded, texture])
}

export function useBigCloudBGMaterial() {
  const texture = useLoader(THREE.TextureLoader, '/Genshin/Login/Textures/Tex_0067b.png')
  const isTextureLoaded = !!texture && texture.image && texture.image.width > 0

  return useMemo(() => {
    if (!isTextureLoaded) return null
    return new THREE.ShaderMaterial({
      uniforms: {
        cloudTexture: { value: texture },
      },
      fragmentShader: bigCloudBG,
      vertexShader: simpleVert,
      transparent: true,
      depthWrite: false,
    })
  }, [isTextureLoaded, texture])
}

/**
 * https://github.com/mrdoob/three.js/blob/181e04eea8b569dc09048f9dc644310ed6b745a6/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js#L145
 */
export class ToonMaterials {
  public getToonMaterial_Column(originMaterial: any) {
    originMaterial.metalness = 0.3;
    originMaterial.side = THREE.FrontSide;
    originMaterial.onBeforeCompile = function (shader: any) {
      let fragment = shader.fragmentShader

      // console.log(fragment)
      fragment = fragment.replace("#include <lights_physical_pars_fragment>", `
          #include <lights_physical_pars_fragment>
          vec3 fresnelCol = vec3(0x11,0x2e,0xae)/255.*5.;
          
          ${patch}
          ${RE_Direct_ToonPhysical}
          `)
     
      fragment = fragment.replace("#include <lights_fragment_begin>", `
          ${lights_fragment_beginToon}
          `)
     
      fragment = fragment.replace("#include <fog_fragment>", `
          ${ACES_fog_fragment}
          `)
      shader.fragmentShader = fragment;
    }
    return originMaterial;
  }
  public getToonMaterial_Road(originMaterial: any, renderer: THREE.WebGLRenderer) {
    originMaterial.color.multiply(new THREE.Color("#fffcfe").add(new THREE.Color().setRGB(0.015, 0, 0)))
    originMaterial.normalMap.minFilter = THREE.LinearMipmapLinearFilter;
    originMaterial.normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2;
    originMaterial.roughnessMap.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2;
    originMaterial.map.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2;
    originMaterial.roughness = 5
    originMaterial.metalness = 0.;
    originMaterial.side = THREE.FrontSide;

    originMaterial.onBeforeCompile = function (shader: any) {
      let fragment = shader.fragmentShader

      fragment = fragment.replace("#include <lights_physical_pars_fragment>", `

          #include <lights_physical_pars_fragment>
          //vec3 fresnelCol = vec3(254., 103., 57.)/255.;
          vec3 fresnelCol = vec3(0.)/255.;

          ${patch}
          ${RE_Direct_ToonPhysical_Road}
          `)

      fragment = fragment.replace("#include <lights_fragment_begin>", `
          ${lights_fragment_beginToon}
          `)

      shader.fragmentShader = fragment;
    }
    originMaterial.needsUpdate = true
    return originMaterial;
  }
  // public getToonMaterial_Door(originMaterial: MeshPhysicalMaterial, renderer: WebGLRenderer) {
  //     originMaterial.metalness = 0.15;
  //     originMaterial.color = new Color("#454545")
  //     originMaterial.onBeforeCompile = function (shader) {
  //         let fragment = shader.fragmentShader
  //         fragment = fragment.replace("#include <lights_physical_pars_fragment>", `
  //         #include <lights_physical_pars_fragment>
  //         vec3 fresnelCol = vec3(254., 103., 57.)/255.;
  //         ${RE_Direct_ToonPhysical_Road}
  //         `)
  //         fragment = fragment.replace("#include <lights_fragment_begin>", `
  //         ${lights_fragment_beginToon}
  //         `)

  //         shader.fragmentShader = fragment;
  //     }
  //     originMaterial.needsUpdate = true
  //     return originMaterial;
  // }
}
export const toonMaterials = new ToonMaterials();