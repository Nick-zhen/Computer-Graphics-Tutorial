in vec2 v_UV;
in vec4 lightSpaceCoords;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;

void main() {
    // vec3 dividedCoords = lightSpaceCoords.xyz / lightSpaceCoords.w;
    float depth = texture(tDepth, v_UV).r;
    gl_FragColor = vec4(vec3(depth), 1.0);
}