precision mediump float;

attribute vec3 aPosition;

varying vec2 coord;

void main() {
    coord = vec2(1.0, 1.0);
    gl_Position = vec4(aPosition, 1.0);
}
