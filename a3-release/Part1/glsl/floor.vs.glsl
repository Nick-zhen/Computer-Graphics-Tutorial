out vec2 texCoord;
uniform sampler2D normalTexture;
void main() {
    // HINT: pass texture coords to fragment shader
    texCoord = vec2(uv);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}