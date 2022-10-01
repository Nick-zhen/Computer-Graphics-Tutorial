// Textures are passed in as uniforms
uniform sampler2D colorMap;

in vec2 texCoord;

void main() {
    
    //gl_FragColor = vec4(texture2D(colorMap, texCoord), 1.0);
    gl_FragColor = texture2D(colorMap, texCoord);
}