out vec3 vcsNormal;
out vec3 vcsPosition;

out vec2 texCoord;

void main() {
	vcsNormal = normalize(normalMatrix * normal);
    vcsPosition = vec3(viewMatrix * modelMatrix * vec4(position, 1.0));
	// Qe pass varying variables to fs in view coordinate system
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}