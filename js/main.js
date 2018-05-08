function $(s) {
    /* dumb jQuery polyfill */
    return [document.querySelector(s)];
};

function Demo() {
    var igloo      = this.igloo = new Igloo($('#my-canvas')[0]);
    this.positions = igloo.array(new Float32Array([
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ]));
    // indices into this.positions
    // each set of 3 indices will draw a triangle between the
    // points corresponding to those indices in this.positions
    this.indices = igloo.elements(new Float32Array([
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ]));
    this.program = igloo.program('glsl/project.vert', 'glsl/tint.frag');
    this.tick    = 0;
}

Demo.prototype.draw = function() {
    this.program.use()
        .attrib('aPosition', this.positions, 3)
        .draw(this.igloo.gl.TRIANGLE_STRIP, 24);
    this.tick++;
};

var demo = null;
window.addEventListener('load', function() {
    demo = new Demo();
    function go() {
        demo.draw();
        requestAnimationFrame(go);
    }
    go();
});
