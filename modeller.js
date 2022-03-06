import Matrix4 from './matrix.js';

const API = {
   prepareState,
   drawLines,
   drawPoints,
   rotate,
   alpha,
   multiplyMatrix,
};

class Modeller {
   system;

   constructor(system) {
      this.system = system;
   }

   createModel(vertices, shaders, d_count) {
      return new Model(this.system, vertices, shaders, d_count);
   }
};

class Model {
   system;
   program;
   uniforms;
   buffer;
   vert_count;
   d_count;
   matrix;
   presets;

   constructor(system, presetsList, vertices, shaders, d_count = 3) {
      this.system = system;
      this.d_count = d_count;
      this.program = system.createProgram(shaders);
      this.uniforms = this.program.uniforms;
      this.buffer = system.createBuffer();
      this.vert_count = vertices.length / d_count;
      this.system.setBufferData(this.buffer, vertices);
      this.matrix = new Matrix4();

      for (const key of presetsList)
         this[key] = API[key].bind(this);
   }
};

function prepareState() {
   this.program.use();
   this.system.bindArrayBuffer(this.buffer, this.d_count);
};   

function multiplyMatrix(mat) {
   const mvp = mat.multiply(this.matrix);
   this.system.setMatrix('4f', this.uniforms.mvp, mvp.elements);
};

function drawLines() {
   this.system.drawLines(this.vert_count);
};

function drawPoints() {
   this.system.drawPoints(this.vert_count);
};

function rotate(angle, axes) { 
   this.matrix.setRotate(angle, ...axes);
};

function alpha(n) {
   this.system.setUniform('1f', this.uniforms.alpha, n);
};

export default Modeller;