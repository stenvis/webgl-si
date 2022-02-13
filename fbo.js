class FBO {
   ctx;
   types;
   halfFloat;

   constructor(ctx, canvas, texture) {
      this.ctx = ctx;
      this.types = {
         'linear': ctx.LINEAR,
         'nearest': ctx.NEAREST,
         'canvasWidth': canvas.getCanvasWidth, 
         'canvasHeight': canvas.getCanvasHeight,
         'textureWidth': texture.getTextureWidth,
         'textureHeight': texture.getTextureHeight,
      };
      this.halfFloat = texture.halfFloat;
   }

   create(param, w, h) {
      const ctx = this.ctx;
      const _texture = ctx.createTexture(), fbo = ctx.createFramebuffer(); 
      const width = this.types[w](), height = this.types[h](), tex_wrap = this.types[param];
      ctx.bindTexture(ctx.TEXTURE_2D, _texture);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, tex_wrap);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, tex_wrap);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, width, height, 0, ctx.RGBA, this.halfFloat, null);
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo);
      ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, _texture, 0);
      ctx.viewport(0, 0, width, height);
      ctx.bindFramebuffer(ctx.FRAMEBUFFER, null);

      return {
         fbo,
         width,
         height,
         bind(i = 0) { 
            ctx.activeTexture(ctx.TEXTURE0 + i);
            ctx.bindTexture(ctx.TEXTURE_2D, _texture);
            return i;
         },
      };
   }

   createDouble(param, w, h) {
      let fbo1 = this.create(param, w, h), fbo2 = this.create(param, w, h);

      return {
         get src() {
            return fbo1;
         },
         get dst() {
            return fbo2;
         },
         swap: () => { [fbo1, fbo2] = [fbo2, fbo1] },
      };
   }

   resizeDouble(fbo1, fbo2) {
      return {
         get src() {
            return fbo1;
         },
         get dst() {
            return fbo2;
         },
         swap: () => { [fbo1, fbo2] = [fbo2, fbo1] },
      };
   }
};

export default FBO;
