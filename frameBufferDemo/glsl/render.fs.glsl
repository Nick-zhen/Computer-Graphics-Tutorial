in vec2 v_UV;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;

void main() {
    gl_FragColor = texture2D(tDiffuse, v_UV);
}