export const frag=/*glsl */`varying vec3 vPosition;
varying vec2 vUv;
uniform sampler2D cloudTexture;

void main() {
    vec4 col = texture(cloudTexture,vUv);
    vec3 mask = col.rgb;

    vec3 col_r = mix(vec3(23., 145., 250.)/255.,vec3(0.93),vec3(pow(mask.r,0.4)));
    
    col = vec4(col_r,col.a);

    gl_FragColor = vec4(col);
}`