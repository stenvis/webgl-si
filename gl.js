const API = {
   createProgram,
   compileShader,
   createBuffer,
   createBuffers,
   createStub,
   setUniforms,
   setBufferData,
   setBuffersData,
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
   ctx;
   shaderTypes = {};

   constructor(ctx, list = Object.keys(API)) {
      this.ctx = ctx;
      this.shaderTypes.vs = ctx.VERTEX_SHADER;
      this.shaderTypes.fs = ctx.FRAGMENT_SHADER;
      this.drawElements = drawElements;
      
      for (const key of list) 
         this[key] = API[key].bind(this);
   }
};

class GLProgram {
   ctx;

   constructor(vs, fs, ctx) {
      this.ctx = ctx;
      this.uniforms = {};
      this.program = ctx.createProgram();
      ctx.attachShader(this.program, vs);
      ctx.attachShader(this.program, fs);
      ctx.linkProgram(this.program);

      if (!ctx.getProgramParameter(this.program, ctx.LINK_STATUS)) {
         throw ctx.getProgramInfoLog(this.program);
      }

      const uniformCount = ctx.getProgramParameter(
         this.program,
         ctx.ACTIVE_UNIFORMS
      );

      for (let i = 0; i < uniformCount; i++) {
         const uniformName = ctx.getActiveUniform(this.program, i).name;
         this.uniforms[uniformName] = ctx.getUniformLocation(
         this.program,
         uniformName
         );
      }
  }

  use() {
     this.ctx.useProgram(this.program);
  }
};

function createProgram(shaders, program = {}) {
   for (const name in shaders['fs']) program[name] = new GLProgram(shaders['vs'].base, shaders['fs'][name], this.ctx);
   return program;
};

function createBuffer() {
   return this.ctx.createBuffer();
};

function createBuffers(collection, list, n) {
   if (!list) {
      for (let i = 0; i < n; i++) {
         collection.push(this.ctx.createBuffer());
      };
      return;
   };

   list.forEach(name => {
      collection[name] = this.ctx.createBuffer();
   });
};

function createStub(kernel) {
   kernel.push(this.stub);
   return kernel.length - 1;
};

function stub() {
   return;
};

function compileShader(type, source) {
   const shader = this.ctx.createShader(this.shaderTypes[type]);
   this.ctx.shaderSource(shader, source);
   this.ctx.compileShader(shader);
   if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) throw this.ctx.getShaderInfoLog(shader);
   return shader;
};

function setUniforms(programs, presets) {
   const types = {
      '1f': (program, data) => { this.ctx.uniform1f(program, data); },
      '2f': (program, data) => { this.ctx.uniform2f(program, ...data); },
      '3f': (program, data) => { this.ctx.uniform3f(program, ...data); },
      '4f': (program, data) => { this.ctx.uniform4f(program, ...data); },

      '1i': (program, fbo) => { this.ctx.uniform1i(program, fbo[0].bind(fbo[1])); },
   };

   Object.keys(presets).forEach(name => {
      programs[name].use();
      const program = programs[name].uniforms;
      presets[name].forEach(args => { types[args[0]](program[args[1]], args[2]); });
   });
};

function setBufferData(buffer, data, bufferType = this.ctx.ARRAY_BUFFER) {
   this.ctx.bindBuffer(bufferType, buffer);
   this.ctx.bufferData(
      bufferType,
      data,
      this.ctx.STATIC_DRAW
   );
};

function setBuffersData(scene, buffer, bufferType) {
   Object.keys(scene).forEach(model => {
      if (!buffer[model]) return;
      this.setBufferData(buffer[model], scene[model], bufferType);
      buffer[model].n = scene[model].length / 3;
   });
};

function enableVertexAttribArray(index = 0) {
   this.ctx.enableVertexAttribArray(index);
};

function bindAttribPointer(size, arrType, stride, offset, index = 0) {
   this.ctx.vertexAttribPointer(index, size, arrType, false, stride, offset);
};

function bindBuffer(bufferType, buffer) {
   this.ctx.bindBuffer(bufferType, buffer);
};

function bindFBO(bufferType, fbo) {
   this.ctx.bindFramebuffer(bufferType, fbo);
};

function drawArrays(figureType, offset, n) {
   this.ctx.drawArrays(figureType, offset, n);
};

function drawElements(figureType, indexCount, indexType, offset) {
   this.ctx.drawElements(figureType, indexCount, indexType, offset);
};

function clear() {
   this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);
};

export default GL;
