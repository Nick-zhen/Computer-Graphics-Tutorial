out vec2 v_UV;

void main() {
    v_UV = uv;    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
}