in vec3 interpolateNormal;
void main() {

 	// HINT: Q1b, Set final rendered color surface normals
  	gl_FragColor = vec4(interpolateNormal, 1); // REPLACE ME

}
