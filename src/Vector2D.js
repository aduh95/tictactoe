/*

Simple 2D JavaScript Vector Class

Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js

*/

function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
  add(...vectors) {
    for (const v of vectors) {
      this.x += v.x;
      this.y += v.y;
    }
  },

  multiply(v) {
    if (typeof v !== "number") {
      this.x *= v.x;
      this.y *= v.y;
    } else {
      this.x *= v;
      this.y *= v;
    }
    return this;
  },
  divide(v) {
    if (typeof v !== "number") {
      if (v.x != 0) this.x /= v.x;
      if (v.y != 0) this.y /= v.y;
    } else {
      if (v != 0) {
        this.x /= v;
        this.y /= v;
      }
    }
    return this;
  },
  equals(v) {
    return this.x == v.x && this.y == v.y;
  },
  dot(v) {
    return this.x * v.x + this.y * v.y;
  },
  cross(v) {
    return this.x * v.y - this.y * v.x;
  },
  get length() {
    return Math.sqrt(this.dot(this));
  },
  normalize() {
    return this.divide(this.length);
  },

  clone() {
    return new Vector(this.x, this.y);
  },
};

/* STATIC */
Vector.NUL = Object.freeze({
  x: 0,
  y: 0,
  clone() {
    return new Vector();
  },
});

export default Vector;
