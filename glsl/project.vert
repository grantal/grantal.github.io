precision mediump float;

attribute vec3 aPosition;

varying vec4 vColor;

void main() {
    gl_Position = vec4(aPosition, 1.0);
    vColor = vec4(1.0,0.0,0.0,1.0);
}
