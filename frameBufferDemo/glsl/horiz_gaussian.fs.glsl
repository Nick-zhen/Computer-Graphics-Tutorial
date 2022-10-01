in vec2 vUV;

uniform sampler2D sceneInput;
uniform float screenWidth;

// gaussian blur filter (1D pass)
uniform float weights[7];

void main() {
    int borderWidth = 3;
    float pixelSize = 1.0 / (screenWidth * 0.07); 
    float offset;
    vec2 newCoord;
    vec4 outColor = vec4(0.0);
    for (int i = -borderWidth; i <= borderWidth; i++) {
        offset = pixelSize * float(i);
        newCoord = vUV + vec2(offset, 0.0);
        if (newCoord.x >= 0.0 && newCoord.x <= 1.0 ) 
            outColor += weights[i + 3] * texture2D(sceneInput, newCoord);
	}
    gl_FragColor = outColor;
}