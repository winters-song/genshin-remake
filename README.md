
# About Shaders

ThreeJS Shader源码地址: 
https://github.com/mrdoob/three.js/blob/181e04eea8b569dc09048f9dc644310ed6b745a6/src/renderers/shaders/ShaderChunk/lights_fragment_begin.glsl.js

版本原因，三渲二shader源码有部分调整：

lights_fragment_beginToon中
```
GeometricContext geometry;
geometry.position = - vViewPosition;
geometry.normal = normal;
geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
#ifdef USE_CLEARCOAT
    geometry.clearcoatNormal = clearcoatNormal;
#endif
```
调整为下面方式。参考官方源码：lights_fragment_begin.glsl.js
```
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal;
```

另外，metalnessFactor参数来源为metalnessmap_fragment.glsl.js

