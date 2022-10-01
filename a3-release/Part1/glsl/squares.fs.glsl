// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform float ticks;
// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {
    if (mod(vertexPosition.x, 0.1) < 0.02 || mod(vertexPosition.y+ticks*0.5, 0.1) < 0.03){
        discard;
    }
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector.
    float intensity = max(0.0, dot(interpolatedNormal, lightDirection));


    // HINT: Pick any two colors and blend them based on light intensity
    // to give the 3D model some color and depth.
    vec3 out_Stripe = vec3(mix(vec3(0.9, 0.2, 1.0), vec3(0.0, 1, 1), intensity));

    // HINT: Set final rendered colour
    gl_FragColor = vec4(out_Stripe, 1.0);
}
