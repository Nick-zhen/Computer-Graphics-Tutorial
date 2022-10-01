in vec3 vcsNormal;
in vec3 vcsPosition;

uniform vec3 lightDirection;

uniform samplerCube skybox;


uniform mat4 matrixWorld;

vec3 reflect(vec3 w, vec3 n) {
	return n*(dot(w,n)*2.0) - w; // bounce vector
}

void main( void ) {
  	// Qd : Calculate the vector that can be used to sample from the cubemap
	vec3 viewDirection = normalize(vec3(-vcsPosition));
	vec3 reflected = reflect(viewDirection, vcsNormal);
	// transfer bounce vector to world frame
	reflected = vec3((matrixWorld) * vec4(reflected, 0.0));
	// reflected *= mat3(vec3(-1,0,0), vec3(0,1,0),vec3(0,0,1));
	vec4 texColor0 = textureCube(skybox, reflected);
	// vec4 a = vec4(1.0,1.0,1.0,1.0);
	gl_FragColor = vec4(texColor0.r, texColor0.g, texColor0.b, 1.0);
}