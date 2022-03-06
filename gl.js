const { keys } = Object;

const API = {
   createProgram,
   createPrograms,
   createBuffer,
   createBuffers,
   createStub,
   setMatrix,
   setUniform,
   setBufferData,
   setBuffersData,
   setViewPort,
   bindArrayBuffer,
   bindFBO,
   drawLines,
   drawPoints,
   drawElements,
   clear,
   stub,
}; 

class GL {
   gl;
   programs = {};

   constructor(gl, presetsList = keys(API)) {
      this.gl = gl;
      
      for (const key of presetsList)
         this[key] = API[key].bind(this);
      
      this.setClearColor();
   }

   setClearColor(color = [.03, .04, .07, 1.]) {
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

function createProgram(shaders) {
   const keys_ = keys(shaders);

   if (keys_.length > 2) return this.createPrograms(shaders);

   const 
      gl = this.gl,
      vs = compileShader(shaders[keys_[0]], gl.VERTEX_SHADER, gl),
      fs = compileShader(shaders[keys_[1]], gl.FRAGMENT_SHADER, gl);

   return new GLProgram(vs, fs, gl);
};

function createPrograms(shaders) {
   const 
      gl = this.gl,
      keys_ = keys(shaders),
      vs = compileShader(shaders[keys_[0]], gl.VERTEX_SHADER, gl),
      programs = {};
 
   for (let i = 1; i < keys_.length; i++) {
      const fs = compileShader(shaders[keys_[i]], gl.FRAGMENT_SHADER, gl);
      programs[keys_[i]] = new GLProgram(vs, fs, gl);
   };

   return programs;
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

function setMatrix(type, location, elements) {
   const UNIFORM_TYPES = {
      '4f': () => { this.gl.uniformMatrix4fv(location, false, elements); },
   };

   UNIFORM_TYPES[type]();
};

function setUniform(type, location, data) {
   const UNIFORM_TYPES = {
      '1f': () => { this.gl.uniform1f(location, data); },
      '2f': () => { this.gl.uniform2f(location, ...data); },
      '3f': () => { this.gl.uniform3f(location, ...data); },
      '4f': () => { this.gl.uniform4f(location, ...data); },
   };

   UNIFORM_TYPES[type]();
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
   keys(scene).forEach(model => {
      if (!buffer[model]) return;
      this.setBufferData(buffer[model], scene[model], bufferType);
      buffer[model].n = scene[model].length / 3;
   });
};

function setViewPort(w, h) {
   this.gl.viewport(0, 0, w, h);
};

function bindArrayBuffer(buffer, n, index = 0) {
   this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
   this.gl.vertexAttribPointer(index, n, this.gl.FLOAT, false, 0, 0);
   this.gl.enableVertexAttribArray(index);
};

function bindFBO(bufferType, fbo) {
   this.gl.bindFramebuffer(bufferType, fbo);
};

function drawLines(n, offset) {
   this.gl.drawArrays(this.gl.LINES, offset, n);
};

function drawPoints(n, offset) {
   this.gl.drawArrays(this.gl.POINTS, offset, n);
};

function drawElements(figureType, indexCount, indexType, offset) {
   this.gl.drawElements(figureType, indexCount, indexType, offset);
};

function clear() {
   this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

export default GL;