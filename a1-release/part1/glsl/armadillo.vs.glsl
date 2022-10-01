// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;

// This is a "varying" variable and interpolated between vertices and across fragments.
// The shared variable is initialized in the vertex shader and passed to the fragment shader.
out float vcolor;
out float orbDistance;

// I add variable
vec3 armadilloNormal;
vec3 lightDirection;
void main() {
    //modelMatrix * vec4(position, 1.0)
    armadilloNormal = normal;
    // Q1C:
    // HINT: GLSL PROVIDES THE DOT() FUNCTION 
  	// HINT: SHADING IS CALCULATED BY TAKING THE DOT PRODUCT OF THE NORMAL AND LIGHT DIRECTION VECTORS
    // vcolor = 0.5; // REPLACE ME
    vec3 temp = vec3(inverse(modelMatrix) * vec4(orbPosition,1.0));
    lightDirection = normalize(temp - position);
    vcolor = dot(armadilloNormal, lightDirection);

    // Q1D:
    // HINT: Compute distance in World coordinate to make the magnitude easier to interpret
    // HINT: GLSL has a build-in distance() function
    vec3 worldArma = vec3(modelMatrix * vec4(position, 1.0));
    orbDistance = (distance(worldArma, orbPosition));

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
