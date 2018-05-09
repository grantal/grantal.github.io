uniform vec3 uColor;
uniform float uDropoff;
varying vec3 vPos;

void main() {
    // it should be brighter closer to the edges of the cube
    float xDiff = min(length(1.0 - vPos.x), length(-1.0 - vPos.x));
    float yDiff = min(length(1.0 - vPos.y), length(-1.0 - vPos.y));
    float zDiff = min(length(1.0 - vPos.z), length(-1.0 - vPos.z));
    float xy = xDiff + yDiff;
    float yz = yDiff + zDiff;
    float xz = xDiff + zDiff;
    float brightness = min(xy, yz);
    brightness = 1.0 - (uDropoff*min(brightness, xz));
    gl_FragColor = vec4(brightness*uColor, 1.0);
}
