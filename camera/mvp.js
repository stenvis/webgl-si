import Matrix4 from '../matrix.js';

const 
   N_LA = 6,
   N_T = 3,
   N_D = 1;

class MVP {
   _matrix;
   _lookAt = new Float32Array(N_LA);
   _translate = new Float32Array(N_T);
   _distance = new Float32Array(N_D);

   constructor() {
      this._matrix = new Matrix4();
   }

   get lookAt() { return this._lookAt; }
   get translate() { return this._translate; }
   get distance() { return this._distance; }
   get matrix() { return this._matrix; }

   set lookAt(arr) {
      for (let i = 0; i < N_LA; i++ ) this._lookAt[i] = arr[i];
   }
   set translate(arr) {
      for (let i = 0; i < N_T; i++ ) this._translate[i] = arr[i];
   }
   set distance(arr) {
      this.distance[0] = arr[0];
   }

   setMVP(aspect) {
     this._matrix.setPerspective(...this._distance, aspect, 1.0, 400.0);
     this._matrix.translate(...this._translate);
     this._matrix.lookAt(...this._lookAt, 0.0, 1.0, 0.0);
   }

   clone() {
      return {
         lookAt: new Float32Array(this._lookAt),
         translate: new Float32Array(this._translate),
         distnace: new Float32Array(this._distance),
      }
   }
   // function clone() {
   //    const mvp = {};

   //    for (const key in _mvp)
   //       mvp[key] = [..._mvp[key]];

   //    return mvp;
   // };
}

export default MVP;