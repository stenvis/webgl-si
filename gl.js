const API = {
   createProgram,
   createPrograms,
   createBuffer,
   createBuffers,
   createStub,
   setUniforms,
   setBufferData,
   setBuffersData,
   setViewPort,
   enableVertexAttribArray,
   bindAttribPointer,
   bindBuffer,
   bindFBO,
   drawArrays,
   drawElements,
   clear,
   stub,
}; 

class GL {
   gl;
   programs = {};

   constructor(gl, presetsList = Object.keys(API)) {
      this.gl = gl;
      
      for (const key of presetsList)
         this[key] = API[key].bind(this);
      
      this.setClearColor();
   }

   setClearColor(color = [0.03, 0.03, 0.08, 1.0]) {
      this.gl.clearColor(...color);
   }
};

class GLProgram {
   gl;

   constructor(vs, fs, gl) {
      this.gl = gl;
      this.uniforms = {};
      this.program = gl.createProgram();
      gl.attachShader(this.program, vs);
      gl.attachShader(this.program, fs);
      gl.linkProgram(this.program);
   
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
         throw gl.getProgramInfoLog(this.program);
      }

      const uniformCount = gl.getProgramParameter(
         this.program,
         gl.ACTIVE_UNIFORMS
      );

      for (let i = 0; i < uniformCount; i++) {
         const uniformName = gl.getActiveUniform(this.program, i).name;
         this.uniforms[uniformName] = gl.getUniformLocation(
         this.program,
         uniformName
         );
      }
  }

  use() {
     this.gl.useProgram(this.program);
  }
};

const compileShader = (src, type, gl) => {
   const shader = gl.createShader(type);
   gl.shaderSource(shader, src);
   gl.compileShader(shader);
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw gl.getShaderInfoLog(shader);
   return shader;
};

function createProgram(shaders, name) {
   const 
      gl = this.gl,
      keys = Object.keys(shaders),
      vs = compileShader(shaders[keys[0]], gl.VERTEX_SHADER, gl);

   for (let i = 1; i < keys.length; i++) {
      const fs = compileShader(shaders[keys[i]], gl.FRAGMENT_SHADER, gl);
      this.programs[name] = new GLProgram(vs, fs, gl);
   };
};

function createPrograms(programs) {
   for (const name in programs) 
      this.createProgram(programs[name], name);
};

function createBuffer() {
   return this.gl.createBuffer();
};

function createBuffers(collection, list, n) {
   if (!list) {
      for (let i = 0; i < n; i++) {
         collection.push(this.gl.createBuffer());
      };
      return;
   };

   list.forEach(name => {
      collection[name] = this.gl.createBuffer();
   });
};

function createStub(kernel) {
   kernel.push(this.stub);
   return kernel.length - 1;
};

function stub() {
   return;
};

function setUniforms(programs, presets) {
   const types = {
      '1f': (program, data) => { this.gl.uniform1f(program, data); },
      '2f': (program, data) => { this.gl.uniform2f(program, ...data); },
      '3f': (program, data) => { this.gl.uniform3f(program, ...data); },
      '4f': (program, data) => { this.gl.uniform4f(program, ...data); },

      '1i': (program, fbo) => { this.gl.uniform1i(program, fbo[0].bind(fbo[1])); },
   };

   Object.keys(presets).forEach(name => {
      programs[name].use();
      const program = programs[name].uniforms;
      presets[name].forEach(args => { types[args[0]](program[args[1]], args[2]); });
   });
};

function setBufferData(buffer, data, bufferType = this.gl.ARRAY_BUFFER) {
   this.gl.bindBuffer(bufferType, buffer);
   this.gl.bufferData(
      bufferType,
      data,
      this.gl.STATIC_DRAW
   );
};

function setBuffersData(scene, buffer, bufferType) {
   Object.keys(scene).forEach(model => {
      if (!buffer[model]) return;
      this.setBufferData(buffer[model], scene[model], bufferType);
      buffer[model].n = scene[model].length / 3;
   });
};

function setViewPort(w, h) {
   this.gl.viewport(0, 0, w, h);
};

function enableVertexAttribArray(index = 0) {
   this.gl.enableVertexAttribArray(index);
};

function bindAttribPointer(size, arrType, stride, offset, index = 0) {
   this.gl.vertexAttribPointer(index, size, arrType, false, stride, offset);
};

function bindBuffer(bufferType, buffer) {
   this.gl.bindBuffer(bufferType, buffer);
};

function bindFBO(bufferType, fbo) {
   this.gl.bindFramebuffer(bufferType, fbo);
};

function drawArrays(figureType, offset, n) {
   this.gl.drawArrays(figureType, offset, n);
};

function drawElements(figureType, indexCount, indexType, offset) {
   this.gl.drawElements(figureType, indexCount, indexType, offset);
};

function clear() {
   this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

export default GL;