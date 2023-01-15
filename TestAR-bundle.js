(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn2, res) => function __init() {
    return fn2 && (res = (0, fn2[__getOwnPropNames(fn2)[0]])(fn2 = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name3 in all)
      __defProp(target, name3, { get: all[name3], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // js/8thwall-camera.js
  var require_thwall_camera = __commonJS({
    "js/8thwall-camera.js"() {
      var KEY = "yR1LXGhTTT8fGrN7qpVRX4iUodRhJCnfYVMEgfvLd7SEOy3ddy53HINPjR9Bg8apg31fxs";
      function loadXR8(scriptURL) {
        return new Promise((res, rej) => {
          const s = document.createElement("script");
          window.addEventListener("xrloaded", () => res(s));
          s.onerror = rej;
          s.setAttribute("crossorigin", "anonymous");
          s.src = scriptURL;
          document.body.appendChild(s);
        });
      }
      WL.registerComponent("8thwall-camera0", {}, {
        name: "wonderland-engine-8thwall-camera",
        started: false,
        view: null,
        // cache camera
        position: [0, 0, 0],
        // cache 8thwall cam position
        rotation: [0, 0, 0, -1],
        // cache 8thwall cam rotation
        GlTextureRenderer: null,
        // cache XR8.GlTextureRenderer.pipelineModule
        init: function() {
          this.view = this.object.getComponent("view");
          this.onUpdate = this.onUpdate.bind(this);
          this.onAttach = this.onAttach.bind(this);
        },
        start: async function() {
          WL.scene.colorClearEnabled = false;
          await loadXR8("//apps.8thwall.com/xrweb?appKey=" + KEY);
          XR8.XrController.configure({
            // enableLighting: true,
            disableWorldTracking: false
          });
          this.GlTextureRenderer = XR8.GlTextureRenderer.pipelineModule();
          XR8.addCameraPipelineModules([
            this.GlTextureRenderer,
            // Draws the camera feed.
            XR8.XrController.pipelineModule(),
            // Enables SLAM tracking.
            this
          ]);
          const config = {
            cameraConfig: {
              direction: XR8.XrConfig.camera().BACK
            },
            canvas: Module.canvas,
            allowedDevices: XR8.XrConfig.device().ANY,
            ownRunLoop: false
          };
          XR8.run(config);
        },
        onAttach: function(params) {
          this.started = true;
          const gl = WL.canvas.getContext("webgl2");
          const rot = this.object.rotationWorld;
          const pos = this.object.getTranslationWorld([]);
          this.position = Array.from(pos);
          this.rotation = Array.from(rot);
          XR8.XrController.updateCameraProjectionMatrix({
            origin: { x: pos[0], y: pos[1], z: pos[2] },
            facing: { x: rot[0], y: rot[1], z: rot[2], w: rot[3] }
            // TODO: should we include this? Does not have any effect, threejs pipeline does not use it. But Babylon does
            // cam: { pixelRectWidth: Module.canvas.width, pixelRectHeight: Module.canvas.height, nearClipPlane: 0.01, farClipPlane: 100 }
          });
          WL.scene.onPreRender.push(() => {
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
            XR8.runPreRender(Date.now());
            XR8.runRender();
          });
          WL.scene.onPostRender.push(() => {
            XR8.runPostRender(Date.now());
          });
        },
        onUpdate: function(e) {
          if (!e.processCpuResult.reality)
            return;
          const { rotation, position, intrinsics } = e.processCpuResult.reality;
          this.rotation[0] = rotation.x;
          this.rotation[1] = rotation.y;
          this.rotation[2] = rotation.z;
          this.rotation[3] = rotation.w;
          this.position[0] = position.x;
          this.position[1] = position.y;
          this.position[2] = position.z;
          if (intrinsics) {
            for (let i = 0; i < 16; i++) {
              if (Number.isFinite(intrinsics[i])) {
                this.view.projectionMatrix[i] = intrinsics[i];
              }
            }
          }
          if (position && rotation) {
            this.object.resetTransform();
            this.object.rotate(this.rotation);
            this.object.translate(this.position);
          }
        }
      });
    }
  });

  // node_modules/gl-matrix/cjs/common.js
  var require_common = __commonJS({
    "node_modules/gl-matrix/cjs/common.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.setMatrixArrayType = setMatrixArrayType;
      exports.toRadian = toRadian;
      exports.equals = equals;
      exports.RANDOM = exports.ARRAY_TYPE = exports.EPSILON = void 0;
      var EPSILON = 1e-6;
      exports.EPSILON = EPSILON;
      var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
      exports.ARRAY_TYPE = ARRAY_TYPE;
      var RANDOM = Math.random;
      exports.RANDOM = RANDOM;
      function setMatrixArrayType(type) {
        exports.ARRAY_TYPE = ARRAY_TYPE = type;
      }
      var degree = Math.PI / 180;
      function toRadian(a) {
        return a * degree;
      }
      function equals(a, b2) {
        return Math.abs(a - b2) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(b2));
      }
      if (!Math.hypot)
        Math.hypot = function() {
          var y2 = 0, i = arguments.length;
          while (i--) {
            y2 += arguments[i] * arguments[i];
          }
          return Math.sqrt(y2);
        };
    }
  });

  // node_modules/gl-matrix/cjs/mat2.js
  var require_mat2 = __commonJS({
    "node_modules/gl-matrix/cjs/mat2.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.copy = copy;
      exports.identity = identity;
      exports.fromValues = fromValues;
      exports.set = set;
      exports.transpose = transpose;
      exports.invert = invert;
      exports.adjoint = adjoint;
      exports.determinant = determinant;
      exports.multiply = multiply;
      exports.rotate = rotate;
      exports.scale = scale;
      exports.fromRotation = fromRotation;
      exports.fromScaling = fromScaling;
      exports.str = str;
      exports.frob = frob;
      exports.LDU = LDU;
      exports.add = add;
      exports.subtract = subtract;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.multiplyScalar = multiplyScalar;
      exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
      exports.sub = exports.mul = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(4);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
        }
        out[0] = 1;
        out[3] = 1;
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(4);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
      }
      function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      }
      function fromValues(m00, m01, m10, m11) {
        var out = new glMatrix2.ARRAY_TYPE(4);
        out[0] = m00;
        out[1] = m01;
        out[2] = m10;
        out[3] = m11;
        return out;
      }
      function set(out, m00, m01, m10, m11) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m10;
        out[3] = m11;
        return out;
      }
      function transpose(out, a) {
        if (out === a) {
          var a1 = a[1];
          out[1] = a[2];
          out[2] = a1;
        } else {
          out[0] = a[0];
          out[1] = a[2];
          out[2] = a[1];
          out[3] = a[3];
        }
        return out;
      }
      function invert(out, a) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var det = a0 * a3 - a2 * a1;
        if (!det) {
          return null;
        }
        det = 1 / det;
        out[0] = a3 * det;
        out[1] = -a1 * det;
        out[2] = -a2 * det;
        out[3] = a0 * det;
        return out;
      }
      function adjoint(out, a) {
        var a0 = a[0];
        out[0] = a[3];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = a0;
        return out;
      }
      function determinant(a) {
        return a[0] * a[3] - a[2] * a[1];
      }
      function multiply(out, a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b22 + a2 * b3;
        out[3] = a1 * b22 + a3 * b3;
        return out;
      }
      function rotate(out, a, rad) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        return out;
      }
      function scale(out, a, v2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var v0 = v2[0], v1 = v2[1];
        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        return out;
      }
      function fromRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        return out;
      }
      function fromScaling(out, v2) {
        out[0] = v2[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = v2[1];
        return out;
      }
      function str(a) {
        return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
      }
      function frob(a) {
        return Math.hypot(a[0], a[1], a[2], a[3]);
      }
      function LDU(L2, D2, U2, a) {
        L2[2] = a[2] / a[0];
        U2[0] = a[0];
        U2[1] = a[1];
        U2[3] = a[3] - L2[2] * U2[1];
        return [L2, D2, U2];
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        out[3] = a[3] - b2[3];
        return out;
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
      }
      function multiplyScalar(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        return out;
      }
      function multiplyScalarAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        out[3] = a[3] + b2[3] * scale2;
        return out;
      }
      var mul = multiply;
      exports.mul = mul;
      var sub = subtract;
      exports.sub = sub;
    }
  });

  // node_modules/gl-matrix/cjs/mat2d.js
  var require_mat2d = __commonJS({
    "node_modules/gl-matrix/cjs/mat2d.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.copy = copy;
      exports.identity = identity;
      exports.fromValues = fromValues;
      exports.set = set;
      exports.invert = invert;
      exports.determinant = determinant;
      exports.multiply = multiply;
      exports.rotate = rotate;
      exports.scale = scale;
      exports.translate = translate;
      exports.fromRotation = fromRotation;
      exports.fromScaling = fromScaling;
      exports.fromTranslation = fromTranslation;
      exports.str = str;
      exports.frob = frob;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiplyScalar = multiplyScalar;
      exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.sub = exports.mul = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(6);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
          out[4] = 0;
          out[5] = 0;
        }
        out[0] = 1;
        out[3] = 1;
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(6);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        return out;
      }
      function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        return out;
      }
      function fromValues(a, b2, c, d2, tx, ty) {
        var out = new glMatrix2.ARRAY_TYPE(6);
        out[0] = a;
        out[1] = b2;
        out[2] = c;
        out[3] = d2;
        out[4] = tx;
        out[5] = ty;
        return out;
      }
      function set(out, a, b2, c, d2, tx, ty) {
        out[0] = a;
        out[1] = b2;
        out[2] = c;
        out[3] = d2;
        out[4] = tx;
        out[5] = ty;
        return out;
      }
      function invert(out, a) {
        var aa = a[0], ab = a[1], ac = a[2], ad = a[3];
        var atx = a[4], aty = a[5];
        var det = aa * ad - ab * ac;
        if (!det) {
          return null;
        }
        det = 1 / det;
        out[0] = ad * det;
        out[1] = -ab * det;
        out[2] = -ac * det;
        out[3] = aa * det;
        out[4] = (ac * aty - ad * atx) * det;
        out[5] = (ab * atx - aa * aty) * det;
        return out;
      }
      function determinant(a) {
        return a[0] * a[3] - a[1] * a[2];
      }
      function multiply(out, a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5];
        out[0] = a0 * b0 + a2 * b1;
        out[1] = a1 * b0 + a3 * b1;
        out[2] = a0 * b22 + a2 * b3;
        out[3] = a1 * b22 + a3 * b3;
        out[4] = a0 * b4 + a2 * b5 + a4;
        out[5] = a1 * b4 + a3 * b5 + a5;
        return out;
      }
      function rotate(out, a, rad) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = a0 * c + a2 * s;
        out[1] = a1 * c + a3 * s;
        out[2] = a0 * -s + a2 * c;
        out[3] = a1 * -s + a3 * c;
        out[4] = a4;
        out[5] = a5;
        return out;
      }
      function scale(out, a, v2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        var v0 = v2[0], v1 = v2[1];
        out[0] = a0 * v0;
        out[1] = a1 * v0;
        out[2] = a2 * v1;
        out[3] = a3 * v1;
        out[4] = a4;
        out[5] = a5;
        return out;
      }
      function translate(out, a, v2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        var v0 = v2[0], v1 = v2[1];
        out[0] = a0;
        out[1] = a1;
        out[2] = a2;
        out[3] = a3;
        out[4] = a0 * v0 + a2 * v1 + a4;
        out[5] = a1 * v0 + a3 * v1 + a5;
        return out;
      }
      function fromRotation(out, rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = -s;
        out[3] = c;
        out[4] = 0;
        out[5] = 0;
        return out;
      }
      function fromScaling(out, v2) {
        out[0] = v2[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = v2[1];
        out[4] = 0;
        out[5] = 0;
        return out;
      }
      function fromTranslation(out, v2) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = v2[0];
        out[5] = v2[1];
        return out;
      }
      function str(a) {
        return "mat2d(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ")";
      }
      function frob(a) {
        return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], 1);
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        out[4] = a[4] + b2[4];
        out[5] = a[5] + b2[5];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        out[3] = a[3] - b2[3];
        out[4] = a[4] - b2[4];
        out[5] = a[5] - b2[5];
        return out;
      }
      function multiplyScalar(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        out[4] = a[4] * b2;
        out[5] = a[5] * b2;
        return out;
      }
      function multiplyScalarAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        out[3] = a[3] + b2[3] * scale2;
        out[4] = a[4] + b2[4] * scale2;
        out[5] = a[5] + b2[5] * scale2;
        return out;
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5));
      }
      var mul = multiply;
      exports.mul = mul;
      var sub = subtract;
      exports.sub = sub;
    }
  });

  // node_modules/gl-matrix/cjs/mat3.js
  var require_mat3 = __commonJS({
    "node_modules/gl-matrix/cjs/mat3.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.fromMat4 = fromMat4;
      exports.clone = clone;
      exports.copy = copy;
      exports.fromValues = fromValues;
      exports.set = set;
      exports.identity = identity;
      exports.transpose = transpose;
      exports.invert = invert;
      exports.adjoint = adjoint;
      exports.determinant = determinant;
      exports.multiply = multiply;
      exports.translate = translate;
      exports.rotate = rotate;
      exports.scale = scale;
      exports.fromTranslation = fromTranslation;
      exports.fromRotation = fromRotation;
      exports.fromScaling = fromScaling;
      exports.fromMat2d = fromMat2d;
      exports.fromQuat = fromQuat;
      exports.normalFromMat4 = normalFromMat4;
      exports.projection = projection;
      exports.str = str;
      exports.frob = frob;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiplyScalar = multiplyScalar;
      exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.sub = exports.mul = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(9);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[5] = 0;
          out[6] = 0;
          out[7] = 0;
        }
        out[0] = 1;
        out[4] = 1;
        out[8] = 1;
        return out;
      }
      function fromMat4(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[4];
        out[4] = a[5];
        out[5] = a[6];
        out[6] = a[8];
        out[7] = a[9];
        out[8] = a[10];
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(9);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
      }
      function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        var out = new glMatrix2.ARRAY_TYPE(9);
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m10;
        out[4] = m11;
        out[5] = m12;
        out[6] = m20;
        out[7] = m21;
        out[8] = m22;
        return out;
      }
      function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m10;
        out[4] = m11;
        out[5] = m12;
        out[6] = m20;
        out[7] = m21;
        out[8] = m22;
        return out;
      }
      function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
      }
      function transpose(out, a) {
        if (out === a) {
          var a01 = a[1], a02 = a[2], a12 = a[5];
          out[1] = a[3];
          out[2] = a[6];
          out[3] = a01;
          out[5] = a[7];
          out[6] = a02;
          out[7] = a12;
        } else {
          out[0] = a[0];
          out[1] = a[3];
          out[2] = a[6];
          out[3] = a[1];
          out[4] = a[4];
          out[5] = a[7];
          out[6] = a[2];
          out[7] = a[5];
          out[8] = a[8];
        }
        return out;
      }
      function invert(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2];
        var a10 = a[3], a11 = a[4], a12 = a[5];
        var a20 = a[6], a21 = a[7], a22 = a[8];
        var b01 = a22 * a11 - a12 * a21;
        var b11 = -a22 * a10 + a12 * a20;
        var b21 = a21 * a10 - a11 * a20;
        var det = a00 * b01 + a01 * b11 + a02 * b21;
        if (!det) {
          return null;
        }
        det = 1 / det;
        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;
        return out;
      }
      function adjoint(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2];
        var a10 = a[3], a11 = a[4], a12 = a[5];
        var a20 = a[6], a21 = a[7], a22 = a[8];
        out[0] = a11 * a22 - a12 * a21;
        out[1] = a02 * a21 - a01 * a22;
        out[2] = a01 * a12 - a02 * a11;
        out[3] = a12 * a20 - a10 * a22;
        out[4] = a00 * a22 - a02 * a20;
        out[5] = a02 * a10 - a00 * a12;
        out[6] = a10 * a21 - a11 * a20;
        out[7] = a01 * a20 - a00 * a21;
        out[8] = a00 * a11 - a01 * a10;
        return out;
      }
      function determinant(a) {
        var a00 = a[0], a01 = a[1], a02 = a[2];
        var a10 = a[3], a11 = a[4], a12 = a[5];
        var a20 = a[6], a21 = a[7], a22 = a[8];
        return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
      }
      function multiply(out, a, b2) {
        var a00 = a[0], a01 = a[1], a02 = a[2];
        var a10 = a[3], a11 = a[4], a12 = a[5];
        var a20 = a[6], a21 = a[7], a22 = a[8];
        var b00 = b2[0], b01 = b2[1], b02 = b2[2];
        var b10 = b2[3], b11 = b2[4], b12 = b2[5];
        var b20 = b2[6], b21 = b2[7], b22 = b2[8];
        out[0] = b00 * a00 + b01 * a10 + b02 * a20;
        out[1] = b00 * a01 + b01 * a11 + b02 * a21;
        out[2] = b00 * a02 + b01 * a12 + b02 * a22;
        out[3] = b10 * a00 + b11 * a10 + b12 * a20;
        out[4] = b10 * a01 + b11 * a11 + b12 * a21;
        out[5] = b10 * a02 + b11 * a12 + b12 * a22;
        out[6] = b20 * a00 + b21 * a10 + b22 * a20;
        out[7] = b20 * a01 + b21 * a11 + b22 * a21;
        out[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
      }
      function translate(out, a, v2) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x2 = v2[0], y2 = v2[1];
        out[0] = a00;
        out[1] = a01;
        out[2] = a02;
        out[3] = a10;
        out[4] = a11;
        out[5] = a12;
        out[6] = x2 * a00 + y2 * a10 + a20;
        out[7] = x2 * a01 + y2 * a11 + a21;
        out[8] = x2 * a02 + y2 * a12 + a22;
        return out;
      }
      function rotate(out, a, rad) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c * a00 + s * a10;
        out[1] = c * a01 + s * a11;
        out[2] = c * a02 + s * a12;
        out[3] = c * a10 - s * a00;
        out[4] = c * a11 - s * a01;
        out[5] = c * a12 - s * a02;
        out[6] = a20;
        out[7] = a21;
        out[8] = a22;
        return out;
      }
      function scale(out, a, v2) {
        var x2 = v2[0], y2 = v2[1];
        out[0] = x2 * a[0];
        out[1] = x2 * a[1];
        out[2] = x2 * a[2];
        out[3] = y2 * a[3];
        out[4] = y2 * a[4];
        out[5] = y2 * a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
      }
      function fromTranslation(out, v2) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = v2[0];
        out[7] = v2[1];
        out[8] = 1;
        return out;
      }
      function fromRotation(out, rad) {
        var s = Math.sin(rad), c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = 0;
        out[3] = -s;
        out[4] = c;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
      }
      function fromScaling(out, v2) {
        out[0] = v2[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = v2[1];
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
      }
      function fromMat2d(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = 0;
        out[3] = a[2];
        out[4] = a[3];
        out[5] = 0;
        out[6] = a[4];
        out[7] = a[5];
        out[8] = 1;
        return out;
      }
      function fromQuat(out, q2) {
        var x2 = q2[0], y2 = q2[1], z2 = q2[2], w2 = q2[3];
        var x22 = x2 + x2;
        var y22 = y2 + y2;
        var z22 = z2 + z2;
        var xx = x2 * x22;
        var yx = y2 * x22;
        var yy = y2 * y22;
        var zx = z2 * x22;
        var zy = z2 * y22;
        var zz = z2 * z22;
        var wx = w2 * x22;
        var wy = w2 * y22;
        var wz = w2 * z22;
        out[0] = 1 - yy - zz;
        out[3] = yx - wz;
        out[6] = zx + wy;
        out[1] = yx + wz;
        out[4] = 1 - xx - zz;
        out[7] = zy - wx;
        out[2] = zx - wy;
        out[5] = zy + wx;
        out[8] = 1 - xx - yy;
        return out;
      }
      function normalFromMat4(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
          return null;
        }
        det = 1 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
      }
      function projection(out, width, height) {
        out[0] = 2 / width;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = -2 / height;
        out[5] = 0;
        out[6] = -1;
        out[7] = 1;
        out[8] = 1;
        return out;
      }
      function str(a) {
        return "mat3(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ")";
      }
      function frob(a) {
        return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        out[4] = a[4] + b2[4];
        out[5] = a[5] + b2[5];
        out[6] = a[6] + b2[6];
        out[7] = a[7] + b2[7];
        out[8] = a[8] + b2[8];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        out[3] = a[3] - b2[3];
        out[4] = a[4] - b2[4];
        out[5] = a[5] - b2[5];
        out[6] = a[6] - b2[6];
        out[7] = a[7] - b2[7];
        out[8] = a[8] - b2[8];
        return out;
      }
      function multiplyScalar(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        out[4] = a[4] * b2;
        out[5] = a[5] * b2;
        out[6] = a[6] * b2;
        out[7] = a[7] * b2;
        out[8] = a[8] * b2;
        return out;
      }
      function multiplyScalarAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        out[3] = a[3] + b2[3] * scale2;
        out[4] = a[4] + b2[4] * scale2;
        out[5] = a[5] + b2[5] * scale2;
        out[6] = a[6] + b2[6] * scale2;
        out[7] = a[7] + b2[7] * scale2;
        out[8] = a[8] + b2[8] * scale2;
        return out;
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5] && a[6] === b2[6] && a[7] === b2[7] && a[8] === b2[8];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7], b8 = b2[8];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8));
      }
      var mul = multiply;
      exports.mul = mul;
      var sub = subtract;
      exports.sub = sub;
    }
  });

  // node_modules/gl-matrix/cjs/mat4.js
  var require_mat4 = __commonJS({
    "node_modules/gl-matrix/cjs/mat4.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.copy = copy;
      exports.fromValues = fromValues;
      exports.set = set;
      exports.identity = identity;
      exports.transpose = transpose;
      exports.invert = invert;
      exports.adjoint = adjoint;
      exports.determinant = determinant;
      exports.multiply = multiply;
      exports.translate = translate;
      exports.scale = scale;
      exports.rotate = rotate;
      exports.rotateX = rotateX;
      exports.rotateY = rotateY;
      exports.rotateZ = rotateZ;
      exports.fromTranslation = fromTranslation;
      exports.fromScaling = fromScaling;
      exports.fromRotation = fromRotation;
      exports.fromXRotation = fromXRotation;
      exports.fromYRotation = fromYRotation;
      exports.fromZRotation = fromZRotation;
      exports.fromRotationTranslation = fromRotationTranslation;
      exports.fromQuat2 = fromQuat2;
      exports.getTranslation = getTranslation;
      exports.getScaling = getScaling;
      exports.getRotation = getRotation;
      exports.fromRotationTranslationScale = fromRotationTranslationScale;
      exports.fromRotationTranslationScaleOrigin = fromRotationTranslationScaleOrigin;
      exports.fromQuat = fromQuat;
      exports.frustum = frustum;
      exports.perspectiveNO = perspectiveNO;
      exports.perspectiveZO = perspectiveZO;
      exports.perspectiveFromFieldOfView = perspectiveFromFieldOfView;
      exports.orthoNO = orthoNO;
      exports.orthoZO = orthoZO;
      exports.lookAt = lookAt;
      exports.targetTo = targetTo;
      exports.str = str;
      exports.frob = frob;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiplyScalar = multiplyScalar;
      exports.multiplyScalarAndAdd = multiplyScalarAndAdd;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.sub = exports.mul = exports.ortho = exports.perspective = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(16);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
          out[4] = 0;
          out[6] = 0;
          out[7] = 0;
          out[8] = 0;
          out[9] = 0;
          out[11] = 0;
          out[12] = 0;
          out[13] = 0;
          out[14] = 0;
        }
        out[0] = 1;
        out[5] = 1;
        out[10] = 1;
        out[15] = 1;
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(16);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        var out = new glMatrix2.ARRAY_TYPE(16);
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
      }
      function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
      }
      function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function transpose(out, a) {
        if (out === a) {
          var a01 = a[1], a02 = a[2], a03 = a[3];
          var a12 = a[6], a13 = a[7];
          var a23 = a[11];
          out[1] = a[4];
          out[2] = a[8];
          out[3] = a[12];
          out[4] = a01;
          out[6] = a[9];
          out[7] = a[13];
          out[8] = a02;
          out[9] = a12;
          out[11] = a[14];
          out[12] = a03;
          out[13] = a13;
          out[14] = a23;
        } else {
          out[0] = a[0];
          out[1] = a[4];
          out[2] = a[8];
          out[3] = a[12];
          out[4] = a[1];
          out[5] = a[5];
          out[6] = a[9];
          out[7] = a[13];
          out[8] = a[2];
          out[9] = a[6];
          out[10] = a[10];
          out[11] = a[14];
          out[12] = a[3];
          out[13] = a[7];
          out[14] = a[11];
          out[15] = a[15];
        }
        return out;
      }
      function invert(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
          return null;
        }
        det = 1 / det;
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
      }
      function adjoint(out, a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
        out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        return out;
      }
      function determinant(a) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        var b00 = a00 * a11 - a01 * a10;
        var b01 = a00 * a12 - a02 * a10;
        var b02 = a00 * a13 - a03 * a10;
        var b03 = a01 * a12 - a02 * a11;
        var b04 = a01 * a13 - a03 * a11;
        var b05 = a02 * a13 - a03 * a12;
        var b06 = a20 * a31 - a21 * a30;
        var b07 = a20 * a32 - a22 * a30;
        var b08 = a20 * a33 - a23 * a30;
        var b09 = a21 * a32 - a22 * a31;
        var b10 = a21 * a33 - a23 * a31;
        var b11 = a22 * a33 - a23 * a32;
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
      }
      function multiply(out, a, b2) {
        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
        out[0] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
        b0 = b2[4];
        b1 = b2[5];
        b22 = b2[6];
        b3 = b2[7];
        out[4] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
        b0 = b2[8];
        b1 = b2[9];
        b22 = b2[10];
        b3 = b2[11];
        out[8] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
        b0 = b2[12];
        b1 = b2[13];
        b22 = b2[14];
        b3 = b2[15];
        out[12] = b0 * a00 + b1 * a10 + b22 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b22 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b22 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b22 * a23 + b3 * a33;
        return out;
      }
      function translate(out, a, v2) {
        var x2 = v2[0], y2 = v2[1], z2 = v2[2];
        var a00, a01, a02, a03;
        var a10, a11, a12, a13;
        var a20, a21, a22, a23;
        if (a === out) {
          out[12] = a[0] * x2 + a[4] * y2 + a[8] * z2 + a[12];
          out[13] = a[1] * x2 + a[5] * y2 + a[9] * z2 + a[13];
          out[14] = a[2] * x2 + a[6] * y2 + a[10] * z2 + a[14];
          out[15] = a[3] * x2 + a[7] * y2 + a[11] * z2 + a[15];
        } else {
          a00 = a[0];
          a01 = a[1];
          a02 = a[2];
          a03 = a[3];
          a10 = a[4];
          a11 = a[5];
          a12 = a[6];
          a13 = a[7];
          a20 = a[8];
          a21 = a[9];
          a22 = a[10];
          a23 = a[11];
          out[0] = a00;
          out[1] = a01;
          out[2] = a02;
          out[3] = a03;
          out[4] = a10;
          out[5] = a11;
          out[6] = a12;
          out[7] = a13;
          out[8] = a20;
          out[9] = a21;
          out[10] = a22;
          out[11] = a23;
          out[12] = a00 * x2 + a10 * y2 + a20 * z2 + a[12];
          out[13] = a01 * x2 + a11 * y2 + a21 * z2 + a[13];
          out[14] = a02 * x2 + a12 * y2 + a22 * z2 + a[14];
          out[15] = a03 * x2 + a13 * y2 + a23 * z2 + a[15];
        }
        return out;
      }
      function scale(out, a, v2) {
        var x2 = v2[0], y2 = v2[1], z2 = v2[2];
        out[0] = a[0] * x2;
        out[1] = a[1] * x2;
        out[2] = a[2] * x2;
        out[3] = a[3] * x2;
        out[4] = a[4] * y2;
        out[5] = a[5] * y2;
        out[6] = a[6] * y2;
        out[7] = a[7] * y2;
        out[8] = a[8] * z2;
        out[9] = a[9] * z2;
        out[10] = a[10] * z2;
        out[11] = a[11] * z2;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
      }
      function rotate(out, a, rad, axis) {
        var x2 = axis[0], y2 = axis[1], z2 = axis[2];
        var len = Math.hypot(x2, y2, z2);
        var s, c, t;
        var a00, a01, a02, a03;
        var a10, a11, a12, a13;
        var a20, a21, a22, a23;
        var b00, b01, b02;
        var b10, b11, b12;
        var b20, b21, b22;
        if (len < glMatrix2.EPSILON) {
          return null;
        }
        len = 1 / len;
        x2 *= len;
        y2 *= len;
        z2 *= len;
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
        a00 = a[0];
        a01 = a[1];
        a02 = a[2];
        a03 = a[3];
        a10 = a[4];
        a11 = a[5];
        a12 = a[6];
        a13 = a[7];
        a20 = a[8];
        a21 = a[9];
        a22 = a[10];
        a23 = a[11];
        b00 = x2 * x2 * t + c;
        b01 = y2 * x2 * t + z2 * s;
        b02 = z2 * x2 * t - y2 * s;
        b10 = x2 * y2 * t - z2 * s;
        b11 = y2 * y2 * t + c;
        b12 = z2 * y2 * t + x2 * s;
        b20 = x2 * z2 * t + y2 * s;
        b21 = y2 * z2 * t - x2 * s;
        b22 = z2 * z2 * t + c;
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
        if (a !== out) {
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }
        return out;
      }
      function rotateX(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];
        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];
        if (a !== out) {
          out[0] = a[0];
          out[1] = a[1];
          out[2] = a[2];
          out[3] = a[3];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
      }
      function rotateY(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];
        if (a !== out) {
          out[4] = a[4];
          out[5] = a[5];
          out[6] = a[6];
          out[7] = a[7];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
      }
      function rotateZ(out, a, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];
        if (a !== out) {
          out[8] = a[8];
          out[9] = a[9];
          out[10] = a[10];
          out[11] = a[11];
          out[12] = a[12];
          out[13] = a[13];
          out[14] = a[14];
          out[15] = a[15];
        }
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
      }
      function fromTranslation(out, v2) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = v2[0];
        out[13] = v2[1];
        out[14] = v2[2];
        out[15] = 1;
        return out;
      }
      function fromScaling(out, v2) {
        out[0] = v2[0];
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = v2[1];
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = v2[2];
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function fromRotation(out, rad, axis) {
        var x2 = axis[0], y2 = axis[1], z2 = axis[2];
        var len = Math.hypot(x2, y2, z2);
        var s, c, t;
        if (len < glMatrix2.EPSILON) {
          return null;
        }
        len = 1 / len;
        x2 *= len;
        y2 *= len;
        z2 *= len;
        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;
        out[0] = x2 * x2 * t + c;
        out[1] = y2 * x2 * t + z2 * s;
        out[2] = z2 * x2 * t - y2 * s;
        out[3] = 0;
        out[4] = x2 * y2 * t - z2 * s;
        out[5] = y2 * y2 * t + c;
        out[6] = z2 * y2 * t + x2 * s;
        out[7] = 0;
        out[8] = x2 * z2 * t + y2 * s;
        out[9] = y2 * z2 * t - x2 * s;
        out[10] = z2 * z2 * t + c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function fromXRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = c;
        out[6] = s;
        out[7] = 0;
        out[8] = 0;
        out[9] = -s;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function fromYRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = c;
        out[1] = 0;
        out[2] = -s;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = s;
        out[9] = 0;
        out[10] = c;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function fromZRotation(out, rad) {
        var s = Math.sin(rad);
        var c = Math.cos(rad);
        out[0] = c;
        out[1] = s;
        out[2] = 0;
        out[3] = 0;
        out[4] = -s;
        out[5] = c;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function fromRotationTranslation(out, q2, v2) {
        var x2 = q2[0], y2 = q2[1], z2 = q2[2], w2 = q2[3];
        var x22 = x2 + x2;
        var y22 = y2 + y2;
        var z22 = z2 + z2;
        var xx = x2 * x22;
        var xy = x2 * y22;
        var xz = x2 * z22;
        var yy = y2 * y22;
        var yz = y2 * z22;
        var zz = z2 * z22;
        var wx = w2 * x22;
        var wy = w2 * y22;
        var wz = w2 * z22;
        out[0] = 1 - (yy + zz);
        out[1] = xy + wz;
        out[2] = xz - wy;
        out[3] = 0;
        out[4] = xy - wz;
        out[5] = 1 - (xx + zz);
        out[6] = yz + wx;
        out[7] = 0;
        out[8] = xz + wy;
        out[9] = yz - wx;
        out[10] = 1 - (xx + yy);
        out[11] = 0;
        out[12] = v2[0];
        out[13] = v2[1];
        out[14] = v2[2];
        out[15] = 1;
        return out;
      }
      function fromQuat2(out, a) {
        var translation = new glMatrix2.ARRAY_TYPE(3);
        var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7];
        var magnitude = bx * bx + by * by + bz * bz + bw * bw;
        if (magnitude > 0) {
          translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2 / magnitude;
          translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2 / magnitude;
          translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2 / magnitude;
        } else {
          translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
          translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
          translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        }
        fromRotationTranslation(out, a, translation);
        return out;
      }
      function getTranslation(out, mat2) {
        out[0] = mat2[12];
        out[1] = mat2[13];
        out[2] = mat2[14];
        return out;
      }
      function getScaling(out, mat2) {
        var m11 = mat2[0];
        var m12 = mat2[1];
        var m13 = mat2[2];
        var m21 = mat2[4];
        var m22 = mat2[5];
        var m23 = mat2[6];
        var m31 = mat2[8];
        var m32 = mat2[9];
        var m33 = mat2[10];
        out[0] = Math.hypot(m11, m12, m13);
        out[1] = Math.hypot(m21, m22, m23);
        out[2] = Math.hypot(m31, m32, m33);
        return out;
      }
      function getRotation(out, mat2) {
        var scaling = new glMatrix2.ARRAY_TYPE(3);
        getScaling(scaling, mat2);
        var is1 = 1 / scaling[0];
        var is2 = 1 / scaling[1];
        var is3 = 1 / scaling[2];
        var sm11 = mat2[0] * is1;
        var sm12 = mat2[1] * is2;
        var sm13 = mat2[2] * is3;
        var sm21 = mat2[4] * is1;
        var sm22 = mat2[5] * is2;
        var sm23 = mat2[6] * is3;
        var sm31 = mat2[8] * is1;
        var sm32 = mat2[9] * is2;
        var sm33 = mat2[10] * is3;
        var trace = sm11 + sm22 + sm33;
        var S2 = 0;
        if (trace > 0) {
          S2 = Math.sqrt(trace + 1) * 2;
          out[3] = 0.25 * S2;
          out[0] = (sm23 - sm32) / S2;
          out[1] = (sm31 - sm13) / S2;
          out[2] = (sm12 - sm21) / S2;
        } else if (sm11 > sm22 && sm11 > sm33) {
          S2 = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
          out[3] = (sm23 - sm32) / S2;
          out[0] = 0.25 * S2;
          out[1] = (sm12 + sm21) / S2;
          out[2] = (sm31 + sm13) / S2;
        } else if (sm22 > sm33) {
          S2 = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
          out[3] = (sm31 - sm13) / S2;
          out[0] = (sm12 + sm21) / S2;
          out[1] = 0.25 * S2;
          out[2] = (sm23 + sm32) / S2;
        } else {
          S2 = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
          out[3] = (sm12 - sm21) / S2;
          out[0] = (sm31 + sm13) / S2;
          out[1] = (sm23 + sm32) / S2;
          out[2] = 0.25 * S2;
        }
        return out;
      }
      function fromRotationTranslationScale(out, q2, v2, s) {
        var x2 = q2[0], y2 = q2[1], z2 = q2[2], w2 = q2[3];
        var x22 = x2 + x2;
        var y22 = y2 + y2;
        var z22 = z2 + z2;
        var xx = x2 * x22;
        var xy = x2 * y22;
        var xz = x2 * z22;
        var yy = y2 * y22;
        var yz = y2 * z22;
        var zz = z2 * z22;
        var wx = w2 * x22;
        var wy = w2 * y22;
        var wz = w2 * z22;
        var sx = s[0];
        var sy = s[1];
        var sz = s[2];
        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[7] = 0;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[11] = 0;
        out[12] = v2[0];
        out[13] = v2[1];
        out[14] = v2[2];
        out[15] = 1;
        return out;
      }
      function fromRotationTranslationScaleOrigin(out, q2, v2, s, o) {
        var x2 = q2[0], y2 = q2[1], z2 = q2[2], w2 = q2[3];
        var x22 = x2 + x2;
        var y22 = y2 + y2;
        var z22 = z2 + z2;
        var xx = x2 * x22;
        var xy = x2 * y22;
        var xz = x2 * z22;
        var yy = y2 * y22;
        var yz = y2 * z22;
        var zz = z2 * z22;
        var wx = w2 * x22;
        var wy = w2 * y22;
        var wz = w2 * z22;
        var sx = s[0];
        var sy = s[1];
        var sz = s[2];
        var ox = o[0];
        var oy = o[1];
        var oz = o[2];
        var out0 = (1 - (yy + zz)) * sx;
        var out1 = (xy + wz) * sx;
        var out2 = (xz - wy) * sx;
        var out4 = (xy - wz) * sy;
        var out5 = (1 - (xx + zz)) * sy;
        var out6 = (yz + wx) * sy;
        var out8 = (xz + wy) * sz;
        var out9 = (yz - wx) * sz;
        var out10 = (1 - (xx + yy)) * sz;
        out[0] = out0;
        out[1] = out1;
        out[2] = out2;
        out[3] = 0;
        out[4] = out4;
        out[5] = out5;
        out[6] = out6;
        out[7] = 0;
        out[8] = out8;
        out[9] = out9;
        out[10] = out10;
        out[11] = 0;
        out[12] = v2[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
        out[13] = v2[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
        out[14] = v2[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
        out[15] = 1;
        return out;
      }
      function fromQuat(out, q2) {
        var x2 = q2[0], y2 = q2[1], z2 = q2[2], w2 = q2[3];
        var x22 = x2 + x2;
        var y22 = y2 + y2;
        var z22 = z2 + z2;
        var xx = x2 * x22;
        var yx = y2 * x22;
        var yy = y2 * y22;
        var zx = z2 * x22;
        var zy = z2 * y22;
        var zz = z2 * z22;
        var wx = w2 * x22;
        var wy = w2 * y22;
        var wz = w2 * z22;
        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[3] = 0;
        out[4] = yx - wz;
        out[5] = 1 - xx - zz;
        out[6] = zy + wx;
        out[7] = 0;
        out[8] = zx + wy;
        out[9] = zy - wx;
        out[10] = 1 - xx - yy;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
      }
      function frustum(out, left, right, bottom, top, near, far) {
        var rl = 1 / (right - left);
        var tb = 1 / (top - bottom);
        var nf = 1 / (near - far);
        out[0] = near * 2 * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = near * 2 * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
      }
      function perspectiveNO(out, fovy, aspect, near, far) {
        var f = 1 / Math.tan(fovy / 2), nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
          nf = 1 / (near - far);
          out[10] = (far + near) * nf;
          out[14] = 2 * far * near * nf;
        } else {
          out[10] = -1;
          out[14] = -2 * near;
        }
        return out;
      }
      var perspective = perspectiveNO;
      exports.perspective = perspective;
      function perspectiveZO(out, fovy, aspect, near, far) {
        var f = 1 / Math.tan(fovy / 2), nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;
        if (far != null && far !== Infinity) {
          nf = 1 / (near - far);
          out[10] = far * nf;
          out[14] = far * near * nf;
        } else {
          out[10] = -1;
          out[14] = -near;
        }
        return out;
      }
      function perspectiveFromFieldOfView(out, fov, near, far) {
        var upTan = Math.tan(fov.upDegrees * Math.PI / 180);
        var downTan = Math.tan(fov.downDegrees * Math.PI / 180);
        var leftTan = Math.tan(fov.leftDegrees * Math.PI / 180);
        var rightTan = Math.tan(fov.rightDegrees * Math.PI / 180);
        var xScale = 2 / (leftTan + rightTan);
        var yScale = 2 / (upTan + downTan);
        out[0] = xScale;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = yScale;
        out[6] = 0;
        out[7] = 0;
        out[8] = -((leftTan - rightTan) * xScale * 0.5);
        out[9] = (upTan - downTan) * yScale * 0.5;
        out[10] = far / (near - far);
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near / (near - far);
        out[15] = 0;
        return out;
      }
      function orthoNO(out, left, right, bottom, top, near, far) {
        var lr2 = 1 / (left - right);
        var bt2 = 1 / (bottom - top);
        var nf = 1 / (near - far);
        out[0] = -2 * lr2;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt2;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr2;
        out[13] = (top + bottom) * bt2;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
      }
      var ortho = orthoNO;
      exports.ortho = ortho;
      function orthoZO(out, left, right, bottom, top, near, far) {
        var lr2 = 1 / (left - right);
        var bt2 = 1 / (bottom - top);
        var nf = 1 / (near - far);
        out[0] = -2 * lr2;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt2;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = nf;
        out[11] = 0;
        out[12] = (left + right) * lr2;
        out[13] = (top + bottom) * bt2;
        out[14] = near * nf;
        out[15] = 1;
        return out;
      }
      function lookAt(out, eye, center, up) {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        var eyex = eye[0];
        var eyey = eye[1];
        var eyez = eye[2];
        var upx = up[0];
        var upy = up[1];
        var upz = up[2];
        var centerx = center[0];
        var centery = center[1];
        var centerz = center[2];
        if (Math.abs(eyex - centerx) < glMatrix2.EPSILON && Math.abs(eyey - centery) < glMatrix2.EPSILON && Math.abs(eyez - centerz) < glMatrix2.EPSILON) {
          return identity(out);
        }
        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);
        if (!len) {
          x0 = 0;
          x1 = 0;
          x2 = 0;
        } else {
          len = 1 / len;
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }
        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);
        if (!len) {
          y0 = 0;
          y1 = 0;
          y2 = 0;
        } else {
          len = 1 / len;
          y0 *= len;
          y1 *= len;
          y2 *= len;
        }
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
        return out;
      }
      function targetTo(out, eye, target, up) {
        var eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
        var z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
        var len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
          z0 *= len;
          z1 *= len;
          z2 *= len;
        }
        var x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
          len = 1 / Math.sqrt(len);
          x0 *= len;
          x1 *= len;
          x2 *= len;
        }
        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
      }
      function str(a) {
        return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")";
      }
      function frob(a) {
        return Math.hypot(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8], a[9], a[10], a[11], a[12], a[13], a[14], a[15]);
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        out[4] = a[4] + b2[4];
        out[5] = a[5] + b2[5];
        out[6] = a[6] + b2[6];
        out[7] = a[7] + b2[7];
        out[8] = a[8] + b2[8];
        out[9] = a[9] + b2[9];
        out[10] = a[10] + b2[10];
        out[11] = a[11] + b2[11];
        out[12] = a[12] + b2[12];
        out[13] = a[13] + b2[13];
        out[14] = a[14] + b2[14];
        out[15] = a[15] + b2[15];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        out[3] = a[3] - b2[3];
        out[4] = a[4] - b2[4];
        out[5] = a[5] - b2[5];
        out[6] = a[6] - b2[6];
        out[7] = a[7] - b2[7];
        out[8] = a[8] - b2[8];
        out[9] = a[9] - b2[9];
        out[10] = a[10] - b2[10];
        out[11] = a[11] - b2[11];
        out[12] = a[12] - b2[12];
        out[13] = a[13] - b2[13];
        out[14] = a[14] - b2[14];
        out[15] = a[15] - b2[15];
        return out;
      }
      function multiplyScalar(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        out[4] = a[4] * b2;
        out[5] = a[5] * b2;
        out[6] = a[6] * b2;
        out[7] = a[7] * b2;
        out[8] = a[8] * b2;
        out[9] = a[9] * b2;
        out[10] = a[10] * b2;
        out[11] = a[11] * b2;
        out[12] = a[12] * b2;
        out[13] = a[13] * b2;
        out[14] = a[14] * b2;
        out[15] = a[15] * b2;
        return out;
      }
      function multiplyScalarAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        out[3] = a[3] + b2[3] * scale2;
        out[4] = a[4] + b2[4] * scale2;
        out[5] = a[5] + b2[5] * scale2;
        out[6] = a[6] + b2[6] * scale2;
        out[7] = a[7] + b2[7] * scale2;
        out[8] = a[8] + b2[8] * scale2;
        out[9] = a[9] + b2[9] * scale2;
        out[10] = a[10] + b2[10] * scale2;
        out[11] = a[11] + b2[11] * scale2;
        out[12] = a[12] + b2[12] * scale2;
        out[13] = a[13] + b2[13] * scale2;
        out[14] = a[14] + b2[14] * scale2;
        out[15] = a[15] + b2[15] * scale2;
        return out;
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5] && a[6] === b2[6] && a[7] === b2[7] && a[8] === b2[8] && a[9] === b2[9] && a[10] === b2[10] && a[11] === b2[11] && a[12] === b2[12] && a[13] === b2[13] && a[14] === b2[14] && a[15] === b2[15];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
        var a8 = a[8], a9 = a[9], a10 = a[10], a11 = a[11];
        var a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
        var b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7];
        var b8 = b2[8], b9 = b2[9], b10 = b2[10], b11 = b2[11];
        var b12 = b2[12], b13 = b2[13], b14 = b2[14], b15 = b2[15];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7)) && Math.abs(a8 - b8) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a8), Math.abs(b8)) && Math.abs(a9 - b9) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a9), Math.abs(b9)) && Math.abs(a10 - b10) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a10), Math.abs(b10)) && Math.abs(a11 - b11) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a11), Math.abs(b11)) && Math.abs(a12 - b12) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a12), Math.abs(b12)) && Math.abs(a13 - b13) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a13), Math.abs(b13)) && Math.abs(a14 - b14) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a14), Math.abs(b14)) && Math.abs(a15 - b15) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a15), Math.abs(b15));
      }
      var mul = multiply;
      exports.mul = mul;
      var sub = subtract;
      exports.sub = sub;
    }
  });

  // node_modules/gl-matrix/cjs/vec3.js
  var require_vec3 = __commonJS({
    "node_modules/gl-matrix/cjs/vec3.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.length = length;
      exports.fromValues = fromValues;
      exports.copy = copy;
      exports.set = set;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiply = multiply;
      exports.divide = divide;
      exports.ceil = ceil;
      exports.floor = floor;
      exports.min = min;
      exports.max = max;
      exports.round = round;
      exports.scale = scale;
      exports.scaleAndAdd = scaleAndAdd;
      exports.distance = distance;
      exports.squaredDistance = squaredDistance;
      exports.squaredLength = squaredLength;
      exports.negate = negate;
      exports.inverse = inverse;
      exports.normalize = normalize;
      exports.dot = dot;
      exports.cross = cross;
      exports.lerp = lerp;
      exports.hermite = hermite;
      exports.bezier = bezier;
      exports.random = random;
      exports.transformMat4 = transformMat4;
      exports.transformMat3 = transformMat3;
      exports.transformQuat = transformQuat;
      exports.rotateX = rotateX;
      exports.rotateY = rotateY;
      exports.rotateZ = rotateZ;
      exports.angle = angle;
      exports.zero = zero;
      exports.str = str;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(3);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
        }
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(3);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        return out;
      }
      function length(a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        return Math.hypot(x2, y2, z2);
      }
      function fromValues(x2, y2, z2) {
        var out = new glMatrix2.ARRAY_TYPE(3);
        out[0] = x2;
        out[1] = y2;
        out[2] = z2;
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        return out;
      }
      function set(out, x2, y2, z2) {
        out[0] = x2;
        out[1] = y2;
        out[2] = z2;
        return out;
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        return out;
      }
      function multiply(out, a, b2) {
        out[0] = a[0] * b2[0];
        out[1] = a[1] * b2[1];
        out[2] = a[2] * b2[2];
        return out;
      }
      function divide(out, a, b2) {
        out[0] = a[0] / b2[0];
        out[1] = a[1] / b2[1];
        out[2] = a[2] / b2[2];
        return out;
      }
      function ceil(out, a) {
        out[0] = Math.ceil(a[0]);
        out[1] = Math.ceil(a[1]);
        out[2] = Math.ceil(a[2]);
        return out;
      }
      function floor(out, a) {
        out[0] = Math.floor(a[0]);
        out[1] = Math.floor(a[1]);
        out[2] = Math.floor(a[2]);
        return out;
      }
      function min(out, a, b2) {
        out[0] = Math.min(a[0], b2[0]);
        out[1] = Math.min(a[1], b2[1]);
        out[2] = Math.min(a[2], b2[2]);
        return out;
      }
      function max(out, a, b2) {
        out[0] = Math.max(a[0], b2[0]);
        out[1] = Math.max(a[1], b2[1]);
        out[2] = Math.max(a[2], b2[2]);
        return out;
      }
      function round(out, a) {
        out[0] = Math.round(a[0]);
        out[1] = Math.round(a[1]);
        out[2] = Math.round(a[2]);
        return out;
      }
      function scale(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        return out;
      }
      function scaleAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        return out;
      }
      function distance(a, b2) {
        var x2 = b2[0] - a[0];
        var y2 = b2[1] - a[1];
        var z2 = b2[2] - a[2];
        return Math.hypot(x2, y2, z2);
      }
      function squaredDistance(a, b2) {
        var x2 = b2[0] - a[0];
        var y2 = b2[1] - a[1];
        var z2 = b2[2] - a[2];
        return x2 * x2 + y2 * y2 + z2 * z2;
      }
      function squaredLength(a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        return x2 * x2 + y2 * y2 + z2 * z2;
      }
      function negate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        return out;
      }
      function inverse(out, a) {
        out[0] = 1 / a[0];
        out[1] = 1 / a[1];
        out[2] = 1 / a[2];
        return out;
      }
      function normalize(out, a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        var len2 = x2 * x2 + y2 * y2 + z2 * z2;
        if (len2 > 0) {
          len2 = 1 / Math.sqrt(len2);
        }
        out[0] = a[0] * len2;
        out[1] = a[1] * len2;
        out[2] = a[2] * len2;
        return out;
      }
      function dot(a, b2) {
        return a[0] * b2[0] + a[1] * b2[1] + a[2] * b2[2];
      }
      function cross(out, a, b2) {
        var ax = a[0], ay = a[1], az = a[2];
        var bx = b2[0], by = b2[1], bz = b2[2];
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
      }
      function lerp(out, a, b2, t) {
        var ax = a[0];
        var ay = a[1];
        var az = a[2];
        out[0] = ax + t * (b2[0] - ax);
        out[1] = ay + t * (b2[1] - ay);
        out[2] = az + t * (b2[2] - az);
        return out;
      }
      function hermite(out, a, b2, c, d2, t) {
        var factorTimes2 = t * t;
        var factor1 = factorTimes2 * (2 * t - 3) + 1;
        var factor2 = factorTimes2 * (t - 2) + t;
        var factor3 = factorTimes2 * (t - 1);
        var factor4 = factorTimes2 * (3 - 2 * t);
        out[0] = a[0] * factor1 + b2[0] * factor2 + c[0] * factor3 + d2[0] * factor4;
        out[1] = a[1] * factor1 + b2[1] * factor2 + c[1] * factor3 + d2[1] * factor4;
        out[2] = a[2] * factor1 + b2[2] * factor2 + c[2] * factor3 + d2[2] * factor4;
        return out;
      }
      function bezier(out, a, b2, c, d2, t) {
        var inverseFactor = 1 - t;
        var inverseFactorTimesTwo = inverseFactor * inverseFactor;
        var factorTimes2 = t * t;
        var factor1 = inverseFactorTimesTwo * inverseFactor;
        var factor2 = 3 * t * inverseFactorTimesTwo;
        var factor3 = 3 * factorTimes2 * inverseFactor;
        var factor4 = factorTimes2 * t;
        out[0] = a[0] * factor1 + b2[0] * factor2 + c[0] * factor3 + d2[0] * factor4;
        out[1] = a[1] * factor1 + b2[1] * factor2 + c[1] * factor3 + d2[1] * factor4;
        out[2] = a[2] * factor1 + b2[2] * factor2 + c[2] * factor3 + d2[2] * factor4;
        return out;
      }
      function random(out, scale2) {
        scale2 = scale2 || 1;
        var r = glMatrix2.RANDOM() * 2 * Math.PI;
        var z2 = glMatrix2.RANDOM() * 2 - 1;
        var zScale = Math.sqrt(1 - z2 * z2) * scale2;
        out[0] = Math.cos(r) * zScale;
        out[1] = Math.sin(r) * zScale;
        out[2] = z2 * scale2;
        return out;
      }
      function transformMat4(out, a, m2) {
        var x2 = a[0], y2 = a[1], z2 = a[2];
        var w2 = m2[3] * x2 + m2[7] * y2 + m2[11] * z2 + m2[15];
        w2 = w2 || 1;
        out[0] = (m2[0] * x2 + m2[4] * y2 + m2[8] * z2 + m2[12]) / w2;
        out[1] = (m2[1] * x2 + m2[5] * y2 + m2[9] * z2 + m2[13]) / w2;
        out[2] = (m2[2] * x2 + m2[6] * y2 + m2[10] * z2 + m2[14]) / w2;
        return out;
      }
      function transformMat3(out, a, m2) {
        var x2 = a[0], y2 = a[1], z2 = a[2];
        out[0] = x2 * m2[0] + y2 * m2[3] + z2 * m2[6];
        out[1] = x2 * m2[1] + y2 * m2[4] + z2 * m2[7];
        out[2] = x2 * m2[2] + y2 * m2[5] + z2 * m2[8];
        return out;
      }
      function transformQuat(out, a, q2) {
        var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3];
        var x2 = a[0], y2 = a[1], z2 = a[2];
        var uvx = qy * z2 - qz * y2, uvy = qz * x2 - qx * z2, uvz = qx * y2 - qy * x2;
        var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
        var w2 = qw * 2;
        uvx *= w2;
        uvy *= w2;
        uvz *= w2;
        uuvx *= 2;
        uuvy *= 2;
        uuvz *= 2;
        out[0] = x2 + uvx + uuvx;
        out[1] = y2 + uvy + uuvy;
        out[2] = z2 + uvz + uuvz;
        return out;
      }
      function rotateX(out, a, b2, rad) {
        var p = [], r = [];
        p[0] = a[0] - b2[0];
        p[1] = a[1] - b2[1];
        p[2] = a[2] - b2[2];
        r[0] = p[0];
        r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
        r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad);
        out[0] = r[0] + b2[0];
        out[1] = r[1] + b2[1];
        out[2] = r[2] + b2[2];
        return out;
      }
      function rotateY(out, a, b2, rad) {
        var p = [], r = [];
        p[0] = a[0] - b2[0];
        p[1] = a[1] - b2[1];
        p[2] = a[2] - b2[2];
        r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
        r[1] = p[1];
        r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad);
        out[0] = r[0] + b2[0];
        out[1] = r[1] + b2[1];
        out[2] = r[2] + b2[2];
        return out;
      }
      function rotateZ(out, a, b2, rad) {
        var p = [], r = [];
        p[0] = a[0] - b2[0];
        p[1] = a[1] - b2[1];
        p[2] = a[2] - b2[2];
        r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
        r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
        r[2] = p[2];
        out[0] = r[0] + b2[0];
        out[1] = r[1] + b2[1];
        out[2] = r[2] + b2[2];
        return out;
      }
      function angle(a, b2) {
        var ax = a[0], ay = a[1], az = a[2], bx = b2[0], by = b2[1], bz = b2[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a, b2) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
      }
      function zero(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        return out;
      }
      function str(a) {
        return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22));
      }
      var sub = subtract;
      exports.sub = sub;
      var mul = multiply;
      exports.mul = mul;
      var div = divide;
      exports.div = div;
      var dist = distance;
      exports.dist = dist;
      var sqrDist = squaredDistance;
      exports.sqrDist = sqrDist;
      var len = length;
      exports.len = len;
      var sqrLen = squaredLength;
      exports.sqrLen = sqrLen;
      var forEach = function() {
        var vec = create();
        return function(a, stride, offset, count, fn2, arg) {
          var i, l;
          if (!stride) {
            stride = 3;
          }
          if (!offset) {
            offset = 0;
          }
          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }
          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            fn2(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
          }
          return a;
        };
      }();
      exports.forEach = forEach;
    }
  });

  // node_modules/gl-matrix/cjs/vec4.js
  var require_vec4 = __commonJS({
    "node_modules/gl-matrix/cjs/vec4.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.fromValues = fromValues;
      exports.copy = copy;
      exports.set = set;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiply = multiply;
      exports.divide = divide;
      exports.ceil = ceil;
      exports.floor = floor;
      exports.min = min;
      exports.max = max;
      exports.round = round;
      exports.scale = scale;
      exports.scaleAndAdd = scaleAndAdd;
      exports.distance = distance;
      exports.squaredDistance = squaredDistance;
      exports.length = length;
      exports.squaredLength = squaredLength;
      exports.negate = negate;
      exports.inverse = inverse;
      exports.normalize = normalize;
      exports.dot = dot;
      exports.cross = cross;
      exports.lerp = lerp;
      exports.random = random;
      exports.transformMat4 = transformMat4;
      exports.transformQuat = transformQuat;
      exports.zero = zero;
      exports.str = str;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.forEach = exports.sqrLen = exports.len = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(4);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
          out[3] = 0;
        }
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(4);
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
      }
      function fromValues(x2, y2, z2, w2) {
        var out = new glMatrix2.ARRAY_TYPE(4);
        out[0] = x2;
        out[1] = y2;
        out[2] = z2;
        out[3] = w2;
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
      }
      function set(out, x2, y2, z2, w2) {
        out[0] = x2;
        out[1] = y2;
        out[2] = z2;
        out[3] = w2;
        return out;
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        out[2] = a[2] - b2[2];
        out[3] = a[3] - b2[3];
        return out;
      }
      function multiply(out, a, b2) {
        out[0] = a[0] * b2[0];
        out[1] = a[1] * b2[1];
        out[2] = a[2] * b2[2];
        out[3] = a[3] * b2[3];
        return out;
      }
      function divide(out, a, b2) {
        out[0] = a[0] / b2[0];
        out[1] = a[1] / b2[1];
        out[2] = a[2] / b2[2];
        out[3] = a[3] / b2[3];
        return out;
      }
      function ceil(out, a) {
        out[0] = Math.ceil(a[0]);
        out[1] = Math.ceil(a[1]);
        out[2] = Math.ceil(a[2]);
        out[3] = Math.ceil(a[3]);
        return out;
      }
      function floor(out, a) {
        out[0] = Math.floor(a[0]);
        out[1] = Math.floor(a[1]);
        out[2] = Math.floor(a[2]);
        out[3] = Math.floor(a[3]);
        return out;
      }
      function min(out, a, b2) {
        out[0] = Math.min(a[0], b2[0]);
        out[1] = Math.min(a[1], b2[1]);
        out[2] = Math.min(a[2], b2[2]);
        out[3] = Math.min(a[3], b2[3]);
        return out;
      }
      function max(out, a, b2) {
        out[0] = Math.max(a[0], b2[0]);
        out[1] = Math.max(a[1], b2[1]);
        out[2] = Math.max(a[2], b2[2]);
        out[3] = Math.max(a[3], b2[3]);
        return out;
      }
      function round(out, a) {
        out[0] = Math.round(a[0]);
        out[1] = Math.round(a[1]);
        out[2] = Math.round(a[2]);
        out[3] = Math.round(a[3]);
        return out;
      }
      function scale(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        return out;
      }
      function scaleAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        out[2] = a[2] + b2[2] * scale2;
        out[3] = a[3] + b2[3] * scale2;
        return out;
      }
      function distance(a, b2) {
        var x2 = b2[0] - a[0];
        var y2 = b2[1] - a[1];
        var z2 = b2[2] - a[2];
        var w2 = b2[3] - a[3];
        return Math.hypot(x2, y2, z2, w2);
      }
      function squaredDistance(a, b2) {
        var x2 = b2[0] - a[0];
        var y2 = b2[1] - a[1];
        var z2 = b2[2] - a[2];
        var w2 = b2[3] - a[3];
        return x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2;
      }
      function length(a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        var w2 = a[3];
        return Math.hypot(x2, y2, z2, w2);
      }
      function squaredLength(a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        var w2 = a[3];
        return x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2;
      }
      function negate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = -a[3];
        return out;
      }
      function inverse(out, a) {
        out[0] = 1 / a[0];
        out[1] = 1 / a[1];
        out[2] = 1 / a[2];
        out[3] = 1 / a[3];
        return out;
      }
      function normalize(out, a) {
        var x2 = a[0];
        var y2 = a[1];
        var z2 = a[2];
        var w2 = a[3];
        var len2 = x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2;
        if (len2 > 0) {
          len2 = 1 / Math.sqrt(len2);
        }
        out[0] = x2 * len2;
        out[1] = y2 * len2;
        out[2] = z2 * len2;
        out[3] = w2 * len2;
        return out;
      }
      function dot(a, b2) {
        return a[0] * b2[0] + a[1] * b2[1] + a[2] * b2[2] + a[3] * b2[3];
      }
      function cross(out, u, v2, w2) {
        var A2 = v2[0] * w2[1] - v2[1] * w2[0], B2 = v2[0] * w2[2] - v2[2] * w2[0], C2 = v2[0] * w2[3] - v2[3] * w2[0], D2 = v2[1] * w2[2] - v2[2] * w2[1], E2 = v2[1] * w2[3] - v2[3] * w2[1], F2 = v2[2] * w2[3] - v2[3] * w2[2];
        var G2 = u[0];
        var H2 = u[1];
        var I2 = u[2];
        var J2 = u[3];
        out[0] = H2 * F2 - I2 * E2 + J2 * D2;
        out[1] = -(G2 * F2) + I2 * C2 - J2 * B2;
        out[2] = G2 * E2 - H2 * C2 + J2 * A2;
        out[3] = -(G2 * D2) + H2 * B2 - I2 * A2;
        return out;
      }
      function lerp(out, a, b2, t) {
        var ax = a[0];
        var ay = a[1];
        var az = a[2];
        var aw = a[3];
        out[0] = ax + t * (b2[0] - ax);
        out[1] = ay + t * (b2[1] - ay);
        out[2] = az + t * (b2[2] - az);
        out[3] = aw + t * (b2[3] - aw);
        return out;
      }
      function random(out, scale2) {
        scale2 = scale2 || 1;
        var v1, v2, v3, v4;
        var s1, s2;
        do {
          v1 = glMatrix2.RANDOM() * 2 - 1;
          v2 = glMatrix2.RANDOM() * 2 - 1;
          s1 = v1 * v1 + v2 * v2;
        } while (s1 >= 1);
        do {
          v3 = glMatrix2.RANDOM() * 2 - 1;
          v4 = glMatrix2.RANDOM() * 2 - 1;
          s2 = v3 * v3 + v4 * v4;
        } while (s2 >= 1);
        var d2 = Math.sqrt((1 - s1) / s2);
        out[0] = scale2 * v1;
        out[1] = scale2 * v2;
        out[2] = scale2 * v3 * d2;
        out[3] = scale2 * v4 * d2;
        return out;
      }
      function transformMat4(out, a, m2) {
        var x2 = a[0], y2 = a[1], z2 = a[2], w2 = a[3];
        out[0] = m2[0] * x2 + m2[4] * y2 + m2[8] * z2 + m2[12] * w2;
        out[1] = m2[1] * x2 + m2[5] * y2 + m2[9] * z2 + m2[13] * w2;
        out[2] = m2[2] * x2 + m2[6] * y2 + m2[10] * z2 + m2[14] * w2;
        out[3] = m2[3] * x2 + m2[7] * y2 + m2[11] * z2 + m2[15] * w2;
        return out;
      }
      function transformQuat(out, a, q2) {
        var x2 = a[0], y2 = a[1], z2 = a[2];
        var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3];
        var ix = qw * x2 + qy * z2 - qz * y2;
        var iy = qw * y2 + qz * x2 - qx * z2;
        var iz = qw * z2 + qx * y2 - qy * x2;
        var iw = -qx * x2 - qy * y2 - qz * z2;
        out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        out[3] = a[3];
        return out;
      }
      function zero(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        return out;
      }
      function str(a) {
        return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3));
      }
      var sub = subtract;
      exports.sub = sub;
      var mul = multiply;
      exports.mul = mul;
      var div = divide;
      exports.div = div;
      var dist = distance;
      exports.dist = dist;
      var sqrDist = squaredDistance;
      exports.sqrDist = sqrDist;
      var len = length;
      exports.len = len;
      var sqrLen = squaredLength;
      exports.sqrLen = sqrLen;
      var forEach = function() {
        var vec = create();
        return function(a, stride, offset, count, fn2, arg) {
          var i, l;
          if (!stride) {
            stride = 4;
          }
          if (!offset) {
            offset = 0;
          }
          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }
          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            vec[2] = a[i + 2];
            vec[3] = a[i + 3];
            fn2(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
            a[i + 2] = vec[2];
            a[i + 3] = vec[3];
          }
          return a;
        };
      }();
      exports.forEach = forEach;
    }
  });

  // node_modules/gl-matrix/cjs/quat.js
  var require_quat = __commonJS({
    "node_modules/gl-matrix/cjs/quat.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.identity = identity;
      exports.setAxisAngle = setAxisAngle;
      exports.getAxisAngle = getAxisAngle;
      exports.getAngle = getAngle;
      exports.multiply = multiply;
      exports.rotateX = rotateX;
      exports.rotateY = rotateY;
      exports.rotateZ = rotateZ;
      exports.calculateW = calculateW;
      exports.exp = exp;
      exports.ln = ln2;
      exports.pow = pow;
      exports.slerp = slerp;
      exports.random = random;
      exports.invert = invert;
      exports.conjugate = conjugate;
      exports.fromMat3 = fromMat3;
      exports.fromEuler = fromEuler;
      exports.str = str;
      exports.setAxes = exports.sqlerp = exports.rotationTo = exports.equals = exports.exactEquals = exports.normalize = exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.lerp = exports.dot = exports.scale = exports.mul = exports.add = exports.set = exports.copy = exports.fromValues = exports.clone = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      var mat3 = _interopRequireWildcard(require_mat3());
      var vec39 = _interopRequireWildcard(require_vec3());
      var vec4 = _interopRequireWildcard(require_vec4());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(4);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
          out[2] = 0;
        }
        out[3] = 1;
        return out;
      }
      function identity(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
      }
      function setAxisAngle(out, axis, rad) {
        rad = rad * 0.5;
        var s = Math.sin(rad);
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(rad);
        return out;
      }
      function getAxisAngle(out_axis, q2) {
        var rad = Math.acos(q2[3]) * 2;
        var s = Math.sin(rad / 2);
        if (s > glMatrix2.EPSILON) {
          out_axis[0] = q2[0] / s;
          out_axis[1] = q2[1] / s;
          out_axis[2] = q2[2] / s;
        } else {
          out_axis[0] = 1;
          out_axis[1] = 0;
          out_axis[2] = 0;
        }
        return rad;
      }
      function getAngle(a, b2) {
        var dotproduct = dot(a, b2);
        return Math.acos(2 * dotproduct * dotproduct - 1);
      }
      function multiply(out, a, b2) {
        var ax = a[0], ay = a[1], az = a[2], aw = a[3];
        var bx = b2[0], by = b2[1], bz = b2[2], bw = b2[3];
        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
      }
      function rotateX(out, a, rad) {
        rad *= 0.5;
        var ax = a[0], ay = a[1], az = a[2], aw = a[3];
        var bx = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
      }
      function rotateY(out, a, rad) {
        rad *= 0.5;
        var ax = a[0], ay = a[1], az = a[2], aw = a[3];
        var by = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
      }
      function rotateZ(out, a, rad) {
        rad *= 0.5;
        var ax = a[0], ay = a[1], az = a[2], aw = a[3];
        var bz = Math.sin(rad), bw = Math.cos(rad);
        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
      }
      function calculateW(out, a) {
        var x2 = a[0], y2 = a[1], z2 = a[2];
        out[0] = x2;
        out[1] = y2;
        out[2] = z2;
        out[3] = Math.sqrt(Math.abs(1 - x2 * x2 - y2 * y2 - z2 * z2));
        return out;
      }
      function exp(out, a) {
        var x2 = a[0], y2 = a[1], z2 = a[2], w2 = a[3];
        var r = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
        var et2 = Math.exp(w2);
        var s = r > 0 ? et2 * Math.sin(r) / r : 0;
        out[0] = x2 * s;
        out[1] = y2 * s;
        out[2] = z2 * s;
        out[3] = et2 * Math.cos(r);
        return out;
      }
      function ln2(out, a) {
        var x2 = a[0], y2 = a[1], z2 = a[2], w2 = a[3];
        var r = Math.sqrt(x2 * x2 + y2 * y2 + z2 * z2);
        var t = r > 0 ? Math.atan2(r, w2) / r : 0;
        out[0] = x2 * t;
        out[1] = y2 * t;
        out[2] = z2 * t;
        out[3] = 0.5 * Math.log(x2 * x2 + y2 * y2 + z2 * z2 + w2 * w2);
        return out;
      }
      function pow(out, a, b2) {
        ln2(out, a);
        scale(out, out, b2);
        exp(out, out);
        return out;
      }
      function slerp(out, a, b2, t) {
        var ax = a[0], ay = a[1], az = a[2], aw = a[3];
        var bx = b2[0], by = b2[1], bz = b2[2], bw = b2[3];
        var omega, cosom, sinom, scale0, scale1;
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        if (cosom < 0) {
          cosom = -cosom;
          bx = -bx;
          by = -by;
          bz = -bz;
          bw = -bw;
        }
        if (1 - cosom > glMatrix2.EPSILON) {
          omega = Math.acos(cosom);
          sinom = Math.sin(omega);
          scale0 = Math.sin((1 - t) * omega) / sinom;
          scale1 = Math.sin(t * omega) / sinom;
        } else {
          scale0 = 1 - t;
          scale1 = t;
        }
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
      }
      function random(out) {
        var u1 = glMatrix2.RANDOM();
        var u2 = glMatrix2.RANDOM();
        var u3 = glMatrix2.RANDOM();
        var sqrt1MinusU1 = Math.sqrt(1 - u1);
        var sqrtU1 = Math.sqrt(u1);
        out[0] = sqrt1MinusU1 * Math.sin(2 * Math.PI * u2);
        out[1] = sqrt1MinusU1 * Math.cos(2 * Math.PI * u2);
        out[2] = sqrtU1 * Math.sin(2 * Math.PI * u3);
        out[3] = sqrtU1 * Math.cos(2 * Math.PI * u3);
        return out;
      }
      function invert(out, a) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        var dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        var invDot = dot2 ? 1 / dot2 : 0;
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
      }
      function conjugate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = a[3];
        return out;
      }
      function fromMat3(out, m2) {
        var fTrace = m2[0] + m2[4] + m2[8];
        var fRoot;
        if (fTrace > 0) {
          fRoot = Math.sqrt(fTrace + 1);
          out[3] = 0.5 * fRoot;
          fRoot = 0.5 / fRoot;
          out[0] = (m2[5] - m2[7]) * fRoot;
          out[1] = (m2[6] - m2[2]) * fRoot;
          out[2] = (m2[1] - m2[3]) * fRoot;
        } else {
          var i = 0;
          if (m2[4] > m2[0])
            i = 1;
          if (m2[8] > m2[i * 3 + i])
            i = 2;
          var j = (i + 1) % 3;
          var k2 = (i + 2) % 3;
          fRoot = Math.sqrt(m2[i * 3 + i] - m2[j * 3 + j] - m2[k2 * 3 + k2] + 1);
          out[i] = 0.5 * fRoot;
          fRoot = 0.5 / fRoot;
          out[3] = (m2[j * 3 + k2] - m2[k2 * 3 + j]) * fRoot;
          out[j] = (m2[j * 3 + i] + m2[i * 3 + j]) * fRoot;
          out[k2] = (m2[k2 * 3 + i] + m2[i * 3 + k2]) * fRoot;
        }
        return out;
      }
      function fromEuler(out, x2, y2, z2) {
        var halfToRad = 0.5 * Math.PI / 180;
        x2 *= halfToRad;
        y2 *= halfToRad;
        z2 *= halfToRad;
        var sx = Math.sin(x2);
        var cx = Math.cos(x2);
        var sy = Math.sin(y2);
        var cy = Math.cos(y2);
        var sz = Math.sin(z2);
        var cz = Math.cos(z2);
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        return out;
      }
      function str(a) {
        return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
      }
      var clone = vec4.clone;
      exports.clone = clone;
      var fromValues = vec4.fromValues;
      exports.fromValues = fromValues;
      var copy = vec4.copy;
      exports.copy = copy;
      var set = vec4.set;
      exports.set = set;
      var add = vec4.add;
      exports.add = add;
      var mul = multiply;
      exports.mul = mul;
      var scale = vec4.scale;
      exports.scale = scale;
      var dot = vec4.dot;
      exports.dot = dot;
      var lerp = vec4.lerp;
      exports.lerp = lerp;
      var length = vec4.length;
      exports.length = length;
      var len = length;
      exports.len = len;
      var squaredLength = vec4.squaredLength;
      exports.squaredLength = squaredLength;
      var sqrLen = squaredLength;
      exports.sqrLen = sqrLen;
      var normalize = vec4.normalize;
      exports.normalize = normalize;
      var exactEquals = vec4.exactEquals;
      exports.exactEquals = exactEquals;
      var equals = vec4.equals;
      exports.equals = equals;
      var rotationTo = function() {
        var tmpvec3 = vec39.create();
        var xUnitVec3 = vec39.fromValues(1, 0, 0);
        var yUnitVec3 = vec39.fromValues(0, 1, 0);
        return function(out, a, b2) {
          var dot2 = vec39.dot(a, b2);
          if (dot2 < -0.999999) {
            vec39.cross(tmpvec3, xUnitVec3, a);
            if (vec39.len(tmpvec3) < 1e-6)
              vec39.cross(tmpvec3, yUnitVec3, a);
            vec39.normalize(tmpvec3, tmpvec3);
            setAxisAngle(out, tmpvec3, Math.PI);
            return out;
          } else if (dot2 > 0.999999) {
            out[0] = 0;
            out[1] = 0;
            out[2] = 0;
            out[3] = 1;
            return out;
          } else {
            vec39.cross(tmpvec3, a, b2);
            out[0] = tmpvec3[0];
            out[1] = tmpvec3[1];
            out[2] = tmpvec3[2];
            out[3] = 1 + dot2;
            return normalize(out, out);
          }
        };
      }();
      exports.rotationTo = rotationTo;
      var sqlerp = function() {
        var temp1 = create();
        var temp2 = create();
        return function(out, a, b2, c, d2, t) {
          slerp(temp1, a, d2, t);
          slerp(temp2, b2, c, t);
          slerp(out, temp1, temp2, 2 * t * (1 - t));
          return out;
        };
      }();
      exports.sqlerp = sqlerp;
      var setAxes = function() {
        var matr = mat3.create();
        return function(out, view, right, up) {
          matr[0] = right[0];
          matr[3] = right[1];
          matr[6] = right[2];
          matr[1] = up[0];
          matr[4] = up[1];
          matr[7] = up[2];
          matr[2] = -view[0];
          matr[5] = -view[1];
          matr[8] = -view[2];
          return normalize(out, fromMat3(out, matr));
        };
      }();
      exports.setAxes = setAxes;
    }
  });

  // node_modules/gl-matrix/cjs/quat2.js
  var require_quat2 = __commonJS({
    "node_modules/gl-matrix/cjs/quat2.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.fromValues = fromValues;
      exports.fromRotationTranslationValues = fromRotationTranslationValues;
      exports.fromRotationTranslation = fromRotationTranslation;
      exports.fromTranslation = fromTranslation;
      exports.fromRotation = fromRotation;
      exports.fromMat4 = fromMat4;
      exports.copy = copy;
      exports.identity = identity;
      exports.set = set;
      exports.getDual = getDual;
      exports.setDual = setDual;
      exports.getTranslation = getTranslation;
      exports.translate = translate;
      exports.rotateX = rotateX;
      exports.rotateY = rotateY;
      exports.rotateZ = rotateZ;
      exports.rotateByQuatAppend = rotateByQuatAppend;
      exports.rotateByQuatPrepend = rotateByQuatPrepend;
      exports.rotateAroundAxis = rotateAroundAxis;
      exports.add = add;
      exports.multiply = multiply;
      exports.scale = scale;
      exports.lerp = lerp;
      exports.invert = invert;
      exports.conjugate = conjugate;
      exports.normalize = normalize;
      exports.str = str;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.sqrLen = exports.squaredLength = exports.len = exports.length = exports.dot = exports.mul = exports.setReal = exports.getReal = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      var quat5 = _interopRequireWildcard(require_quat());
      var mat43 = _interopRequireWildcard(require_mat4());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var dq = new glMatrix2.ARRAY_TYPE(8);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          dq[0] = 0;
          dq[1] = 0;
          dq[2] = 0;
          dq[4] = 0;
          dq[5] = 0;
          dq[6] = 0;
          dq[7] = 0;
        }
        dq[3] = 1;
        return dq;
      }
      function clone(a) {
        var dq = new glMatrix2.ARRAY_TYPE(8);
        dq[0] = a[0];
        dq[1] = a[1];
        dq[2] = a[2];
        dq[3] = a[3];
        dq[4] = a[4];
        dq[5] = a[5];
        dq[6] = a[6];
        dq[7] = a[7];
        return dq;
      }
      function fromValues(x1, y1, z1, w1, x2, y2, z2, w2) {
        var dq = new glMatrix2.ARRAY_TYPE(8);
        dq[0] = x1;
        dq[1] = y1;
        dq[2] = z1;
        dq[3] = w1;
        dq[4] = x2;
        dq[5] = y2;
        dq[6] = z2;
        dq[7] = w2;
        return dq;
      }
      function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
        var dq = new glMatrix2.ARRAY_TYPE(8);
        dq[0] = x1;
        dq[1] = y1;
        dq[2] = z1;
        dq[3] = w1;
        var ax = x2 * 0.5, ay = y2 * 0.5, az = z2 * 0.5;
        dq[4] = ax * w1 + ay * z1 - az * y1;
        dq[5] = ay * w1 + az * x1 - ax * z1;
        dq[6] = az * w1 + ax * y1 - ay * x1;
        dq[7] = -ax * x1 - ay * y1 - az * z1;
        return dq;
      }
      function fromRotationTranslation(out, q2, t) {
        var ax = t[0] * 0.5, ay = t[1] * 0.5, az = t[2] * 0.5, bx = q2[0], by = q2[1], bz = q2[2], bw = q2[3];
        out[0] = bx;
        out[1] = by;
        out[2] = bz;
        out[3] = bw;
        out[4] = ax * bw + ay * bz - az * by;
        out[5] = ay * bw + az * bx - ax * bz;
        out[6] = az * bw + ax * by - ay * bx;
        out[7] = -ax * bx - ay * by - az * bz;
        return out;
      }
      function fromTranslation(out, t) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = t[0] * 0.5;
        out[5] = t[1] * 0.5;
        out[6] = t[2] * 0.5;
        out[7] = 0;
        return out;
      }
      function fromRotation(out, q2) {
        out[0] = q2[0];
        out[1] = q2[1];
        out[2] = q2[2];
        out[3] = q2[3];
        out[4] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        return out;
      }
      function fromMat4(out, a) {
        var outer = quat5.create();
        mat43.getRotation(outer, a);
        var t = new glMatrix2.ARRAY_TYPE(3);
        mat43.getTranslation(t, a);
        fromRotationTranslation(out, outer, t);
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        return out;
      }
      function identity(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        out[4] = 0;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        return out;
      }
      function set(out, x1, y1, z1, w1, x2, y2, z2, w2) {
        out[0] = x1;
        out[1] = y1;
        out[2] = z1;
        out[3] = w1;
        out[4] = x2;
        out[5] = y2;
        out[6] = z2;
        out[7] = w2;
        return out;
      }
      var getReal = quat5.copy;
      exports.getReal = getReal;
      function getDual(out, a) {
        out[0] = a[4];
        out[1] = a[5];
        out[2] = a[6];
        out[3] = a[7];
        return out;
      }
      var setReal = quat5.copy;
      exports.setReal = setReal;
      function setDual(out, q2) {
        out[4] = q2[0];
        out[5] = q2[1];
        out[6] = q2[2];
        out[7] = q2[3];
        return out;
      }
      function getTranslation(out, a) {
        var ax = a[4], ay = a[5], az = a[6], aw = a[7], bx = -a[0], by = -a[1], bz = -a[2], bw = a[3];
        out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
        out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
        out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
        return out;
      }
      function translate(out, a, v2) {
        var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3], bx1 = v2[0] * 0.5, by1 = v2[1] * 0.5, bz1 = v2[2] * 0.5, ax2 = a[4], ay2 = a[5], az2 = a[6], aw2 = a[7];
        out[0] = ax1;
        out[1] = ay1;
        out[2] = az1;
        out[3] = aw1;
        out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
        out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
        out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
        out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
        return out;
      }
      function rotateX(out, a, rad) {
        var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
        quat5.rotateX(out, a, rad);
        bx = out[0];
        by = out[1];
        bz = out[2];
        bw = out[3];
        out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
        out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
        out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
        out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
        return out;
      }
      function rotateY(out, a, rad) {
        var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
        quat5.rotateY(out, a, rad);
        bx = out[0];
        by = out[1];
        bz = out[2];
        bw = out[3];
        out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
        out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
        out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
        out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
        return out;
      }
      function rotateZ(out, a, rad) {
        var bx = -a[0], by = -a[1], bz = -a[2], bw = a[3], ax = a[4], ay = a[5], az = a[6], aw = a[7], ax1 = ax * bw + aw * bx + ay * bz - az * by, ay1 = ay * bw + aw * by + az * bx - ax * bz, az1 = az * bw + aw * bz + ax * by - ay * bx, aw1 = aw * bw - ax * bx - ay * by - az * bz;
        quat5.rotateZ(out, a, rad);
        bx = out[0];
        by = out[1];
        bz = out[2];
        bw = out[3];
        out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
        out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
        out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
        out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
        return out;
      }
      function rotateByQuatAppend(out, a, q2) {
        var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], ax = a[0], ay = a[1], az = a[2], aw = a[3];
        out[0] = ax * qw + aw * qx + ay * qz - az * qy;
        out[1] = ay * qw + aw * qy + az * qx - ax * qz;
        out[2] = az * qw + aw * qz + ax * qy - ay * qx;
        out[3] = aw * qw - ax * qx - ay * qy - az * qz;
        ax = a[4];
        ay = a[5];
        az = a[6];
        aw = a[7];
        out[4] = ax * qw + aw * qx + ay * qz - az * qy;
        out[5] = ay * qw + aw * qy + az * qx - ax * qz;
        out[6] = az * qw + aw * qz + ax * qy - ay * qx;
        out[7] = aw * qw - ax * qx - ay * qy - az * qz;
        return out;
      }
      function rotateByQuatPrepend(out, q2, a) {
        var qx = q2[0], qy = q2[1], qz = q2[2], qw = q2[3], bx = a[0], by = a[1], bz = a[2], bw = a[3];
        out[0] = qx * bw + qw * bx + qy * bz - qz * by;
        out[1] = qy * bw + qw * by + qz * bx - qx * bz;
        out[2] = qz * bw + qw * bz + qx * by - qy * bx;
        out[3] = qw * bw - qx * bx - qy * by - qz * bz;
        bx = a[4];
        by = a[5];
        bz = a[6];
        bw = a[7];
        out[4] = qx * bw + qw * bx + qy * bz - qz * by;
        out[5] = qy * bw + qw * by + qz * bx - qx * bz;
        out[6] = qz * bw + qw * bz + qx * by - qy * bx;
        out[7] = qw * bw - qx * bx - qy * by - qz * bz;
        return out;
      }
      function rotateAroundAxis(out, a, axis, rad) {
        if (Math.abs(rad) < glMatrix2.EPSILON) {
          return copy(out, a);
        }
        var axisLength = Math.hypot(axis[0], axis[1], axis[2]);
        rad = rad * 0.5;
        var s = Math.sin(rad);
        var bx = s * axis[0] / axisLength;
        var by = s * axis[1] / axisLength;
        var bz = s * axis[2] / axisLength;
        var bw = Math.cos(rad);
        var ax1 = a[0], ay1 = a[1], az1 = a[2], aw1 = a[3];
        out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
        out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
        out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
        out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
        var ax = a[4], ay = a[5], az = a[6], aw = a[7];
        out[4] = ax * bw + aw * bx + ay * bz - az * by;
        out[5] = ay * bw + aw * by + az * bx - ax * bz;
        out[6] = az * bw + aw * bz + ax * by - ay * bx;
        out[7] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        out[2] = a[2] + b2[2];
        out[3] = a[3] + b2[3];
        out[4] = a[4] + b2[4];
        out[5] = a[5] + b2[5];
        out[6] = a[6] + b2[6];
        out[7] = a[7] + b2[7];
        return out;
      }
      function multiply(out, a, b2) {
        var ax0 = a[0], ay0 = a[1], az0 = a[2], aw0 = a[3], bx1 = b2[4], by1 = b2[5], bz1 = b2[6], bw1 = b2[7], ax1 = a[4], ay1 = a[5], az1 = a[6], aw1 = a[7], bx0 = b2[0], by0 = b2[1], bz0 = b2[2], bw0 = b2[3];
        out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
        out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
        out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
        out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
        out[4] = ax0 * bw1 + aw0 * bx1 + ay0 * bz1 - az0 * by1 + ax1 * bw0 + aw1 * bx0 + ay1 * bz0 - az1 * by0;
        out[5] = ay0 * bw1 + aw0 * by1 + az0 * bx1 - ax0 * bz1 + ay1 * bw0 + aw1 * by0 + az1 * bx0 - ax1 * bz0;
        out[6] = az0 * bw1 + aw0 * bz1 + ax0 * by1 - ay0 * bx1 + az1 * bw0 + aw1 * bz0 + ax1 * by0 - ay1 * bx0;
        out[7] = aw0 * bw1 - ax0 * bx1 - ay0 * by1 - az0 * bz1 + aw1 * bw0 - ax1 * bx0 - ay1 * by0 - az1 * bz0;
        return out;
      }
      var mul = multiply;
      exports.mul = mul;
      function scale(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        out[2] = a[2] * b2;
        out[3] = a[3] * b2;
        out[4] = a[4] * b2;
        out[5] = a[5] * b2;
        out[6] = a[6] * b2;
        out[7] = a[7] * b2;
        return out;
      }
      var dot = quat5.dot;
      exports.dot = dot;
      function lerp(out, a, b2, t) {
        var mt2 = 1 - t;
        if (dot(a, b2) < 0)
          t = -t;
        out[0] = a[0] * mt2 + b2[0] * t;
        out[1] = a[1] * mt2 + b2[1] * t;
        out[2] = a[2] * mt2 + b2[2] * t;
        out[3] = a[3] * mt2 + b2[3] * t;
        out[4] = a[4] * mt2 + b2[4] * t;
        out[5] = a[5] * mt2 + b2[5] * t;
        out[6] = a[6] * mt2 + b2[6] * t;
        out[7] = a[7] * mt2 + b2[7] * t;
        return out;
      }
      function invert(out, a) {
        var sqlen = squaredLength(a);
        out[0] = -a[0] / sqlen;
        out[1] = -a[1] / sqlen;
        out[2] = -a[2] / sqlen;
        out[3] = a[3] / sqlen;
        out[4] = -a[4] / sqlen;
        out[5] = -a[5] / sqlen;
        out[6] = -a[6] / sqlen;
        out[7] = a[7] / sqlen;
        return out;
      }
      function conjugate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = a[3];
        out[4] = -a[4];
        out[5] = -a[5];
        out[6] = -a[6];
        out[7] = a[7];
        return out;
      }
      var length = quat5.length;
      exports.length = length;
      var len = length;
      exports.len = len;
      var squaredLength = quat5.squaredLength;
      exports.squaredLength = squaredLength;
      var sqrLen = squaredLength;
      exports.sqrLen = sqrLen;
      function normalize(out, a) {
        var magnitude = squaredLength(a);
        if (magnitude > 0) {
          magnitude = Math.sqrt(magnitude);
          var a0 = a[0] / magnitude;
          var a1 = a[1] / magnitude;
          var a2 = a[2] / magnitude;
          var a3 = a[3] / magnitude;
          var b0 = a[4];
          var b1 = a[5];
          var b2 = a[6];
          var b3 = a[7];
          var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
          out[0] = a0;
          out[1] = a1;
          out[2] = a2;
          out[3] = a3;
          out[4] = (b0 - a0 * a_dot_b) / magnitude;
          out[5] = (b1 - a1 * a_dot_b) / magnitude;
          out[6] = (b2 - a2 * a_dot_b) / magnitude;
          out[7] = (b3 - a3 * a_dot_b) / magnitude;
        }
        return out;
      }
      function str(a) {
        return "quat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ")";
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1] && a[2] === b2[2] && a[3] === b2[3] && a[4] === b2[4] && a[5] === b2[5] && a[6] === b2[6] && a[7] === b2[7];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7];
        var b0 = b2[0], b1 = b2[1], b22 = b2[2], b3 = b2[3], b4 = b2[4], b5 = b2[5], b6 = b2[6], b7 = b2[7];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b22) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b22)) && Math.abs(a3 - b3) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a3), Math.abs(b3)) && Math.abs(a4 - b4) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a4), Math.abs(b4)) && Math.abs(a5 - b5) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a5), Math.abs(b5)) && Math.abs(a6 - b6) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a6), Math.abs(b6)) && Math.abs(a7 - b7) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a7), Math.abs(b7));
      }
    }
  });

  // node_modules/gl-matrix/cjs/vec2.js
  var require_vec2 = __commonJS({
    "node_modules/gl-matrix/cjs/vec2.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.create = create;
      exports.clone = clone;
      exports.fromValues = fromValues;
      exports.copy = copy;
      exports.set = set;
      exports.add = add;
      exports.subtract = subtract;
      exports.multiply = multiply;
      exports.divide = divide;
      exports.ceil = ceil;
      exports.floor = floor;
      exports.min = min;
      exports.max = max;
      exports.round = round;
      exports.scale = scale;
      exports.scaleAndAdd = scaleAndAdd;
      exports.distance = distance;
      exports.squaredDistance = squaredDistance;
      exports.length = length;
      exports.squaredLength = squaredLength;
      exports.negate = negate;
      exports.inverse = inverse;
      exports.normalize = normalize;
      exports.dot = dot;
      exports.cross = cross;
      exports.lerp = lerp;
      exports.random = random;
      exports.transformMat2 = transformMat2;
      exports.transformMat2d = transformMat2d;
      exports.transformMat3 = transformMat3;
      exports.transformMat4 = transformMat4;
      exports.rotate = rotate;
      exports.angle = angle;
      exports.zero = zero;
      exports.str = str;
      exports.exactEquals = exactEquals;
      exports.equals = equals;
      exports.forEach = exports.sqrLen = exports.sqrDist = exports.dist = exports.div = exports.mul = exports.sub = exports.len = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
      function create() {
        var out = new glMatrix2.ARRAY_TYPE(2);
        if (glMatrix2.ARRAY_TYPE != Float32Array) {
          out[0] = 0;
          out[1] = 0;
        }
        return out;
      }
      function clone(a) {
        var out = new glMatrix2.ARRAY_TYPE(2);
        out[0] = a[0];
        out[1] = a[1];
        return out;
      }
      function fromValues(x2, y2) {
        var out = new glMatrix2.ARRAY_TYPE(2);
        out[0] = x2;
        out[1] = y2;
        return out;
      }
      function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        return out;
      }
      function set(out, x2, y2) {
        out[0] = x2;
        out[1] = y2;
        return out;
      }
      function add(out, a, b2) {
        out[0] = a[0] + b2[0];
        out[1] = a[1] + b2[1];
        return out;
      }
      function subtract(out, a, b2) {
        out[0] = a[0] - b2[0];
        out[1] = a[1] - b2[1];
        return out;
      }
      function multiply(out, a, b2) {
        out[0] = a[0] * b2[0];
        out[1] = a[1] * b2[1];
        return out;
      }
      function divide(out, a, b2) {
        out[0] = a[0] / b2[0];
        out[1] = a[1] / b2[1];
        return out;
      }
      function ceil(out, a) {
        out[0] = Math.ceil(a[0]);
        out[1] = Math.ceil(a[1]);
        return out;
      }
      function floor(out, a) {
        out[0] = Math.floor(a[0]);
        out[1] = Math.floor(a[1]);
        return out;
      }
      function min(out, a, b2) {
        out[0] = Math.min(a[0], b2[0]);
        out[1] = Math.min(a[1], b2[1]);
        return out;
      }
      function max(out, a, b2) {
        out[0] = Math.max(a[0], b2[0]);
        out[1] = Math.max(a[1], b2[1]);
        return out;
      }
      function round(out, a) {
        out[0] = Math.round(a[0]);
        out[1] = Math.round(a[1]);
        return out;
      }
      function scale(out, a, b2) {
        out[0] = a[0] * b2;
        out[1] = a[1] * b2;
        return out;
      }
      function scaleAndAdd(out, a, b2, scale2) {
        out[0] = a[0] + b2[0] * scale2;
        out[1] = a[1] + b2[1] * scale2;
        return out;
      }
      function distance(a, b2) {
        var x2 = b2[0] - a[0], y2 = b2[1] - a[1];
        return Math.hypot(x2, y2);
      }
      function squaredDistance(a, b2) {
        var x2 = b2[0] - a[0], y2 = b2[1] - a[1];
        return x2 * x2 + y2 * y2;
      }
      function length(a) {
        var x2 = a[0], y2 = a[1];
        return Math.hypot(x2, y2);
      }
      function squaredLength(a) {
        var x2 = a[0], y2 = a[1];
        return x2 * x2 + y2 * y2;
      }
      function negate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        return out;
      }
      function inverse(out, a) {
        out[0] = 1 / a[0];
        out[1] = 1 / a[1];
        return out;
      }
      function normalize(out, a) {
        var x2 = a[0], y2 = a[1];
        var len2 = x2 * x2 + y2 * y2;
        if (len2 > 0) {
          len2 = 1 / Math.sqrt(len2);
        }
        out[0] = a[0] * len2;
        out[1] = a[1] * len2;
        return out;
      }
      function dot(a, b2) {
        return a[0] * b2[0] + a[1] * b2[1];
      }
      function cross(out, a, b2) {
        var z2 = a[0] * b2[1] - a[1] * b2[0];
        out[0] = out[1] = 0;
        out[2] = z2;
        return out;
      }
      function lerp(out, a, b2, t) {
        var ax = a[0], ay = a[1];
        out[0] = ax + t * (b2[0] - ax);
        out[1] = ay + t * (b2[1] - ay);
        return out;
      }
      function random(out, scale2) {
        scale2 = scale2 || 1;
        var r = glMatrix2.RANDOM() * 2 * Math.PI;
        out[0] = Math.cos(r) * scale2;
        out[1] = Math.sin(r) * scale2;
        return out;
      }
      function transformMat2(out, a, m2) {
        var x2 = a[0], y2 = a[1];
        out[0] = m2[0] * x2 + m2[2] * y2;
        out[1] = m2[1] * x2 + m2[3] * y2;
        return out;
      }
      function transformMat2d(out, a, m2) {
        var x2 = a[0], y2 = a[1];
        out[0] = m2[0] * x2 + m2[2] * y2 + m2[4];
        out[1] = m2[1] * x2 + m2[3] * y2 + m2[5];
        return out;
      }
      function transformMat3(out, a, m2) {
        var x2 = a[0], y2 = a[1];
        out[0] = m2[0] * x2 + m2[3] * y2 + m2[6];
        out[1] = m2[1] * x2 + m2[4] * y2 + m2[7];
        return out;
      }
      function transformMat4(out, a, m2) {
        var x2 = a[0];
        var y2 = a[1];
        out[0] = m2[0] * x2 + m2[4] * y2 + m2[12];
        out[1] = m2[1] * x2 + m2[5] * y2 + m2[13];
        return out;
      }
      function rotate(out, a, b2, rad) {
        var p0 = a[0] - b2[0], p1 = a[1] - b2[1], sinC = Math.sin(rad), cosC = Math.cos(rad);
        out[0] = p0 * cosC - p1 * sinC + b2[0];
        out[1] = p0 * sinC + p1 * cosC + b2[1];
        return out;
      }
      function angle(a, b2) {
        var x1 = a[0], y1 = a[1], x2 = b2[0], y2 = b2[1], mag = Math.sqrt(x1 * x1 + y1 * y1) * Math.sqrt(x2 * x2 + y2 * y2), cosine = mag && (x1 * x2 + y1 * y2) / mag;
        return Math.acos(Math.min(Math.max(cosine, -1), 1));
      }
      function zero(out) {
        out[0] = 0;
        out[1] = 0;
        return out;
      }
      function str(a) {
        return "vec2(" + a[0] + ", " + a[1] + ")";
      }
      function exactEquals(a, b2) {
        return a[0] === b2[0] && a[1] === b2[1];
      }
      function equals(a, b2) {
        var a0 = a[0], a1 = a[1];
        var b0 = b2[0], b1 = b2[1];
        return Math.abs(a0 - b0) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix2.EPSILON * Math.max(1, Math.abs(a1), Math.abs(b1));
      }
      var len = length;
      exports.len = len;
      var sub = subtract;
      exports.sub = sub;
      var mul = multiply;
      exports.mul = mul;
      var div = divide;
      exports.div = div;
      var dist = distance;
      exports.dist = dist;
      var sqrDist = squaredDistance;
      exports.sqrDist = sqrDist;
      var sqrLen = squaredLength;
      exports.sqrLen = sqrLen;
      var forEach = function() {
        var vec = create();
        return function(a, stride, offset, count, fn2, arg) {
          var i, l;
          if (!stride) {
            stride = 2;
          }
          if (!offset) {
            offset = 0;
          }
          if (count) {
            l = Math.min(count * stride + offset, a.length);
          } else {
            l = a.length;
          }
          for (i = offset; i < l; i += stride) {
            vec[0] = a[i];
            vec[1] = a[i + 1];
            fn2(vec, vec, arg);
            a[i] = vec[0];
            a[i + 1] = vec[1];
          }
          return a;
        };
      }();
      exports.forEach = forEach;
    }
  });

  // node_modules/gl-matrix/cjs/index.js
  var require_cjs = __commonJS({
    "node_modules/gl-matrix/cjs/index.js"(exports) {
      "use strict";
      function _typeof(obj) {
        "@babel/helpers - typeof";
        if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
          _typeof = function _typeof2(obj2) {
            return typeof obj2;
          };
        } else {
          _typeof = function _typeof2(obj2) {
            return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
          };
        }
        return _typeof(obj);
      }
      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.vec4 = exports.vec3 = exports.vec2 = exports.quat2 = exports.quat = exports.mat4 = exports.mat3 = exports.mat2d = exports.mat2 = exports.glMatrix = void 0;
      var glMatrix2 = _interopRequireWildcard(require_common());
      exports.glMatrix = glMatrix2;
      var mat2 = _interopRequireWildcard(require_mat2());
      exports.mat2 = mat2;
      var mat2d = _interopRequireWildcard(require_mat2d());
      exports.mat2d = mat2d;
      var mat3 = _interopRequireWildcard(require_mat3());
      exports.mat3 = mat3;
      var mat43 = _interopRequireWildcard(require_mat4());
      exports.mat4 = mat43;
      var quat5 = _interopRequireWildcard(require_quat());
      exports.quat = quat5;
      var quat25 = _interopRequireWildcard(require_quat2());
      exports.quat2 = quat25;
      var vec2 = _interopRequireWildcard(require_vec2());
      exports.vec2 = vec2;
      var vec39 = _interopRequireWildcard(require_vec3());
      exports.vec3 = vec39;
      var vec4 = _interopRequireWildcard(require_vec4());
      exports.vec4 = vec4;
      function _getRequireWildcardCache(nodeInterop) {
        if (typeof WeakMap !== "function")
          return null;
        var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
        var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
        return (_getRequireWildcardCache = function _getRequireWildcardCache2(nodeInterop2) {
          return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
        })(nodeInterop);
      }
      function _interopRequireWildcard(obj, nodeInterop) {
        if (!nodeInterop && obj && obj.__esModule) {
          return obj;
        }
        if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
          return { "default": obj };
        }
        var cache = _getRequireWildcardCache(nodeInterop);
        if (cache && cache.has(obj)) {
          return cache.get(obj);
        }
        var newObj = {};
        var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
        for (var key in obj) {
          if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
              Object.defineProperty(newObj, key, desc);
            } else {
              newObj[key] = obj[key];
            }
          }
        }
        newObj["default"] = obj;
        if (cache) {
          cache.set(obj, newObj);
        }
        return newObj;
      }
    }
  });

  // node_modules/@wonderlandengine/components/8thwall-camera.js
  var require_thwall_camera2 = __commonJS({
    "node_modules/@wonderlandengine/components/8thwall-camera.js"() {
      WL.registerComponent("8thwall-camera", {
        /** Choose front/back camera */
        camera: { type: WL.Type.Enum, values: ["auto", "back", "front"], default: "auto" }
      }, {
        name: "wonderland-engine",
        init: function() {
          this.position = [0, 0, 0, 0];
          this.rotation = [0, 0, 0, 0];
          this.started = false;
          const vals = ["auto", "back", "front"];
          this.camera = vals[this.camera];
          if (this.camera == "auto") {
            this.camera = "back";
          }
          this.onStart = this.onStart.bind(this);
          this.onUpdate = this.onUpdate.bind(this);
          XR8.addCameraPipelineModules([
            /* Draw the camera feed */
            XR8.GlTextureRenderer.pipelineModule(),
            XR8.XrController.pipelineModule(),
            this
          ]);
          if (this.camera == "back") {
            XR8.run({ canvas: Module["canvas"], ownRunLoop: false });
          } else if (this.camera == "back") {
            XR8.XrController.configure({ disableWorldTracking: true });
            XR8.run({ canvas: Module["canvas"], ownRunLoop: false, cameraConfig: {
              direction: XR8.XrConfig.camera().FRONT
            } });
          } else {
            console.error("[8thwall-camera] Invalid camera setting:", this.camera);
          }
        },
        update: function() {
          if (this.started) {
            if (WL.scene.onPostRender.length == 0) {
              WL.scene.onPreRender.push(function() {
                XR8.runPreRender(Date.now());
                _wl_reset_context();
              });
              WL.scene.onPostRender.push(function() {
                XR8.runPostRender(Date.now());
              });
            }
            if (this.rotation[0] == 0 && this.rotation[1] == 0 && this.rotation[2] == 0 && this.rotation[3] == 0) {
              return;
            }
            this.object.resetTransform();
            this.object.rotate(this.rotation);
            this.object.translate(this.position);
          }
        },
        /* XR8 CameraPipelineModule functions
         * See: https://www.8thwall.com/docs/web/#camerapipelinemodule */
        onUpdate: function(data) {
          if (!data.processCpuResult.reality)
            return;
          let r = data.processCpuResult.reality.rotation;
          this.rotation[0] = r.x;
          this.rotation[1] = r.y;
          this.rotation[2] = r.z;
          this.rotation[3] = r.w;
          let p = data.processCpuResult.reality.position;
          this.position[0] = p.x;
          this.position[1] = p.y;
          this.position[2] = p.z;
        },
        onStart: function() {
          this.started = true;
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/cursor-target.js
  var require_cursor_target = __commonJS({
    "node_modules/@wonderlandengine/components/cursor-target.js"() {
      WL.registerComponent("cursor-target", {}, {
        init: function() {
          this.hoverFunctions = [];
          this.unHoverFunctions = [];
          this.clickFunctions = [];
          this.moveFunctions = [];
          this.downFunctions = [];
          this.upFunctions = [];
        },
        onHover: function(object, cursor) {
          for (let f of this.hoverFunctions)
            f(object, cursor);
        },
        onUnhover: function(object, cursor) {
          for (let f of this.unHoverFunctions)
            f(object, cursor);
        },
        onClick: function(object, cursor) {
          for (let f of this.clickFunctions)
            f(object, cursor);
        },
        onMove: function(object, cursor) {
          for (let f of this.moveFunctions)
            f(object, cursor);
        },
        onDown: function(object, cursor) {
          for (let f of this.downFunctions)
            f(object, cursor);
        },
        onUp: function(object, cursor) {
          for (let f of this.upFunctions)
            f(object, cursor);
        },
        addHoverFunction: function(f) {
          this._validateCallback(f);
          this.hoverFunctions.push(f);
        },
        removeHoverFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.hoverFunctions, f);
        },
        addUnHoverFunction: function(f) {
          this._validateCallback(f);
          this.unHoverFunctions.push(f);
        },
        removeUnHoverFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.unHoverFunctions, f);
        },
        addClickFunction: function(f) {
          this._validateCallback(f);
          this.clickFunctions.push(f);
        },
        removeClickFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.clickFunctions, f);
        },
        addMoveFunction: function(f) {
          this._validateCallback(f);
          this.moveFunctions.push(f);
        },
        removeMoveFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.moveFunctions, f);
        },
        addDownFunction: function(f) {
          this._validateCallback(f);
          this.downFunctions.push(f);
        },
        removeDownFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.downFunctions, f);
        },
        addUpFunction: function(f) {
          this._validateCallback(f);
          this.upFunctions.push(f);
        },
        removeUpFunction: function(f) {
          this._validateCallback(f);
          this._removeItemOnce(this.upFunctions, f);
        },
        _removeItemOnce: function(arr, value) {
          var index = arr.indexOf(value);
          if (index > -1)
            arr.splice(index, 1);
          return arr;
        },
        _validateCallback: function(f) {
          if (typeof f !== "function") {
            throw new TypeError(this.object.name + ".cursor-target: Argument needs to be a function");
          }
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/cursor.js
  var cursor_exports = {};
  var import_gl_matrix;
  var init_cursor = __esm({
    "node_modules/@wonderlandengine/components/cursor.js"() {
      import_gl_matrix = __toESM(require_cjs());
      WL.registerComponent("cursor", {
        /** Collision group for the ray cast. Only objects in this group will be affected by this cursor. */
        collisionGroup: { type: WL.Type.Int, default: 1 },
        /** (optional) Object that visualizes the cursor's ray. */
        cursorRayObject: { type: WL.Type.Object },
        /** Axis along which to scale the `cursorRayObject`. */
        cursorRayScalingAxis: { type: WL.Type.Enum, values: ["x", "y", "z", "none"], default: "z" },
        /** (optional) Object that visualizes the cursor's hit location. */
        cursorObject: { type: WL.Type.Object },
        /** Handedness for VR cursors to accept trigger events only from respective controller. */
        handedness: { type: WL.Type.Enum, values: ["input component", "left", "right", "none"], default: "input component" },
        /** Mode for raycasting, whether to use PhysX or simple collision components */
        rayCastMode: { type: WL.Type.Enum, values: ["collision", "physx"], default: "collision" },
        /** Whether to set the CSS style of the mouse cursor on desktop */
        styleCursor: { type: WL.Type.Bool, default: true }
      }, {
        init: function() {
          this.session = null;
          this.collisionMask = 1 << this.collisionGroup;
          this.maxDistance = 100;
          const sceneLoaded = this.onDestroy.bind(this);
          WL.onSceneLoaded.push(sceneLoaded);
          this.onDestroyCallbacks = [() => {
            const index = WL.onSceneLoaded.indexOf(sceneLoaded);
            if (index >= 0)
              WL.onSceneLoaded.splice(index, 1);
          }];
        },
        start: function() {
          if (this.handedness == 0) {
            const inputComp = this.object.getComponent("input");
            if (!inputComp) {
              console.warn(
                "cursor component on object",
                this.object.name,
                'was configured with handedness "input component", but object has no input component.'
              );
            } else {
              this.handedness = inputComp.handedness;
              this.input = inputComp;
            }
          } else {
            this.handedness = ["left", "right"][this.handedness - 1];
          }
          this.globalTarget = this.object.addComponent("cursor-target");
          this.origin = new Float32Array(3);
          this.cursorObjScale = new Float32Array(3);
          this.direction = [0, 0, 0];
          this.tempQuat = new Float32Array(4);
          this.viewComponent = this.object.getComponent("view");
          if (this.viewComponent != null) {
            const onClick = this.onClick.bind(this);
            WL.canvas.addEventListener("click", onClick);
            const onPointerMove = this.onPointerMove.bind(this);
            WL.canvas.addEventListener("pointermove", onPointerMove);
            const onPointerDown = this.onPointerDown.bind(this);
            WL.canvas.addEventListener("pointerdown", onPointerDown);
            const onPointerUp = this.onPointerUp.bind(this);
            WL.canvas.addEventListener("pointerup", onPointerUp);
            this.projectionMatrix = new Float32Array(16);
            import_gl_matrix.mat4.invert(this.projectionMatrix, this.viewComponent.projectionMatrix);
            const onViewportResize = this.onViewportResize.bind(this);
            window.addEventListener("resize", onViewportResize);
            this.onDestroyCallbacks.push(() => {
              WL.canvas.removeEventListener("click", onClick);
              WL.canvas.removeEventListener("pointermove", onPointerMove);
              WL.canvas.removeEventListener("pointerdown", onPointerDown);
              WL.canvas.removeEventListener("pointerup", onPointerUp);
              window.removeEventListener("resize", onViewportResize);
            });
          }
          this.isHovering = false;
          this.visible = true;
          this.isDown = false;
          this.lastIsDown = false;
          this.cursorPos = new Float32Array(3);
          this.hoveringObject = null;
          const onXRSessionStart = this.setupVREvents.bind(this);
          WL.onXRSessionStart.push(onXRSessionStart);
          this.onDestroyCallbacks.push(() => {
            const index = WL.onXRSessionStart.indexOf(onXRSessionStart);
            if (index >= 0)
              WL.onXRSessionStart.splice(index, 1);
          });
          if (this.cursorRayObject) {
            this.cursorRayScale = new Float32Array(3);
            this.cursorRayScale.set(this.cursorRayObject.scalingLocal);
            this.object.getTranslationWorld(this.origin);
            this.object.getForward(this.direction);
            this._setCursorRayTransform([
              this.origin[0] + this.direction[0],
              this.origin[1] + this.direction[1],
              this.origin[2] + this.direction[2]
            ]);
          }
        },
        onViewportResize: function() {
          if (!this.viewComponent)
            return;
          import_gl_matrix.mat4.invert(this.projectionMatrix, this.viewComponent.projectionMatrix);
        },
        _setCursorRayTransform: function(hitPosition) {
          if (!this.cursorRayObject)
            return;
          const dist = import_gl_matrix.vec3.dist(this.origin, hitPosition);
          this.cursorRayObject.setTranslationLocal([0, 0, -dist / 2]);
          if (this.cursorRayScalingAxis != 4) {
            this.cursorRayObject.resetScaling();
            this.cursorRayScale[this.cursorRayScalingAxis] = dist / 2;
            this.cursorRayObject.scale(this.cursorRayScale);
          }
        },
        _setCursorVisibility: function(visible) {
          if (this.visible == visible)
            return;
          this.visible = visible;
          if (!this.cursorObject)
            return;
          if (visible) {
            this.cursorObject.resetScaling();
            this.cursorObject.scale(this.cursorObjScale);
          } else {
            this.cursorObjScale.set(this.cursorObject.scalingLocal);
            this.cursorObject.scale([0, 0, 0]);
          }
        },
        update: function() {
          this.doUpdate(false);
        },
        doUpdate: function(doClick) {
          if (this.session) {
            if (this.arTouchDown && this.input && WL.xrSession.inputSources[0].handedness === "none" && WL.xrSession.inputSources[0].gamepad) {
              const p = WL.xrSession.inputSources[0].gamepad.axes;
              this.direction = [p[0], -p[1], -1];
              this.updateDirection();
            } else {
              this.object.getTranslationWorld(this.origin);
              this.object.getForward(this.direction);
            }
            const rayHit = this.rayHit = this.rayCastMode == 0 ? WL.scene.rayCast(this.origin, this.direction, this.collisionMask) : WL.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);
            if (rayHit.hitCount > 0) {
              this.cursorPos.set(rayHit.locations[0]);
            } else {
              this.cursorPos.fill(0);
            }
            this.hoverBehaviour(rayHit, doClick);
          }
          if (this.cursorObject) {
            if (this.hoveringObject && (this.cursorPos[0] != 0 || this.cursorPos[1] != 0 || this.cursorPos[2] != 0)) {
              this._setCursorVisibility(true);
              this.cursorObject.setTranslationWorld(this.cursorPos);
              this._setCursorRayTransform(this.cursorPos);
            } else {
              this._setCursorVisibility(false);
            }
          }
        },
        hoverBehaviour: function(rayHit, doClick) {
          if (rayHit.hitCount > 0) {
            if (!this.hoveringObject || !this.hoveringObject.equals(rayHit.objects[0])) {
              if (this.hoveringObject) {
                const cursorTarget3 = this.hoveringObject.getComponent("cursor-target");
                if (cursorTarget3)
                  cursorTarget3.onUnhover(this.hoveringObject, this);
                this.globalTarget.onUnhover(this.hoveringObject, this);
              }
              this.hoveringObject = rayHit.objects[0];
              if (this.styleCursor)
                WL.canvas.style.cursor = "pointer";
              let cursorTarget2 = this.hoveringObject.getComponent("cursor-target");
              if (cursorTarget2) {
                this.hoveringObjectTarget = cursorTarget2;
                cursorTarget2.onHover(this.hoveringObject, this);
              }
              this.globalTarget.onHover(this.hoveringObject, this);
            }
            if (this.hoveringObjectTarget) {
              this.hoveringObjectTarget.onMove(this.hoveringObject, this);
            }
            const cursorTarget = this.hoveringObject.getComponent("cursor-target");
            if (this.isDown !== this.lastIsDown) {
              if (this.isDown) {
                if (cursorTarget)
                  cursorTarget.onDown(this.hoveringObject, this);
                this.globalTarget.onDown(this.hoveringObject, this);
              } else {
                if (cursorTarget)
                  cursorTarget.onUp(this.hoveringObject, this);
                this.globalTarget.onUp(this.hoveringObject, this);
              }
            }
            if (doClick) {
              if (cursorTarget)
                cursorTarget.onClick(this.hoveringObject, this);
              this.globalTarget.onClick(this.hoveringObject, this);
            }
          } else if (this.hoveringObject && rayHit.hitCount == 0) {
            const cursorTarget = this.hoveringObject.getComponent("cursor-target");
            if (cursorTarget)
              cursorTarget.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);
            this.hoveringObject = null;
            this.hoveringObjectTarget = null;
            if (this.styleCursor)
              WL.canvas.style.cursor = "default";
          }
          this.lastIsDown = this.isDown;
        },
        /**
         * Setup event listeners on session object
         * @param s WebXR session
         *
         * Sets up 'select' and 'end' events and caches the session to avoid
         * Module object access.
         */
        setupVREvents: function(s) {
          this.session = s;
          const onSessionEnd = function(e) {
            this.session = null;
          }.bind(this);
          s.addEventListener("end", onSessionEnd);
          const onSelect = this.onSelect.bind(this);
          s.addEventListener("select", onSelect);
          const onSelectStart = this.onSelectStart.bind(this);
          s.addEventListener("selectstart", onSelectStart);
          const onSelectEnd = this.onSelectEnd.bind(this);
          s.addEventListener("selectend", onSelectEnd);
          this.onDestroyCallbacks.push(() => {
            if (!this.session)
              return;
            s.removeEventListener("end", onSessionEnd);
            s.removeEventListener("select", onSelect);
            s.removeEventListener("selectstart", onSelectStart);
            s.removeEventListener("selectend", onSelectEnd);
          });
          this.onViewportResize();
        },
        /** 'select' event listener */
        onSelect: function(e) {
          if (e.inputSource.handedness != this.handedness)
            return;
          this.doUpdate(true);
        },
        /** 'selectstart' event listener */
        onSelectStart: function(e) {
          this.arTouchDown = true;
          if (e.inputSource.handedness == this.handedness)
            this.isDown = true;
        },
        /** 'selectend' event listener */
        onSelectEnd: function(e) {
          this.arTouchDown = false;
          if (e.inputSource.handedness == this.handedness)
            this.isDown = false;
        },
        /** 'pointermove' event listener */
        onPointerMove: function(e) {
          if (!e.isPrimary)
            return;
          const bounds = e.target.getBoundingClientRect();
          const rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);
          this.hoverBehaviour(rayHit, false);
        },
        /** 'click' event listener */
        onClick: function(e) {
          const bounds = e.target.getBoundingClientRect();
          const rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);
          this.hoverBehaviour(rayHit, true);
        },
        /** 'pointerdown' event listener */
        onPointerDown: function(e) {
          if (!e.isPrimary || e.button !== 0)
            return;
          const bounds = e.target.getBoundingClientRect();
          const rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);
          this.isDown = true;
          this.hoverBehaviour(rayHit, false);
        },
        /** 'pointerup' event listener */
        onPointerUp: function(e) {
          if (!e.isPrimary || e.button !== 0)
            return;
          const bounds = e.target.getBoundingClientRect();
          const rayHit = this.updateMousePos(e.clientX, e.clientY, bounds.width, bounds.height);
          this.isDown = false;
          this.hoverBehaviour(rayHit, false);
        },
        /**
         * Update mouse position in non-VR mode and raycast for new position
         * @returns @ref WL.RayHit for new position.
         */
        updateMousePos: function(clientX, clientY, w2, h) {
          const left = clientX / w2;
          const top = clientY / h;
          this.direction = [left * 2 - 1, -top * 2 + 1, -1];
          return this.updateDirection();
        },
        updateDirection: function() {
          this.object.getTranslationWorld(this.origin);
          import_gl_matrix.vec3.transformMat4(
            this.direction,
            this.direction,
            this.projectionMatrix
          );
          import_gl_matrix.vec3.normalize(this.direction, this.direction);
          import_gl_matrix.vec3.transformQuat(this.direction, this.direction, this.object.transformWorld);
          const rayHit = this.rayHit = this.rayCastMode == 0 ? WL.scene.rayCast(this.origin, this.direction, this.collisionMask) : WL.physics.rayCast(this.origin, this.direction, this.collisionMask, this.maxDistance);
          if (rayHit.hitCount > 0) {
            this.cursorPos.set(rayHit.locations[0]);
          } else {
            this.cursorPos.fill(0);
          }
          return rayHit;
        },
        onDeactivate: function() {
          this._setCursorVisibility(false);
          if (this.hoveringObject) {
            const target = this.hoveringObject.getComponent("cursor-target");
            if (target)
              target.onUnhover(this.hoveringObject, this);
            this.globalTarget.onUnhover(this.hoveringObject, this);
          }
          if (this.cursorRayObject)
            this.cursorRayObject.scale([0, 0, 0]);
        },
        onActivate: function() {
          this._setCursorVisibility(true);
        },
        onDestroy: function() {
          for (const f of this.onDestroyCallbacks)
            f();
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/debug-object.js
  var require_debug_object = __commonJS({
    "node_modules/@wonderlandengine/components/debug-object.js"() {
      WL.registerComponent("debug-object", {
        /** A second object to print the name of */
        obj: { type: WL.Type.Object }
      }, {
        start: function() {
        },
        init: function() {
          let origin = [0, 0, 0];
          glMatrix.quat2.getTranslation(origin, this.object.transformWorld);
          console.log("Debug Object:", this.object.name);
          console.log("Other object:", this.obj.name);
          console.log("	translation", origin);
          console.log("	transformWorld", this.object.transformWorld);
          console.log("	transformLocal", this.object.transformLocal);
        },
        update: function() {
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/device-orientation-look.js
  var require_device_orientation_look = __commonJS({
    "node_modules/@wonderlandengine/components/device-orientation-look.js"() {
      function quatFromEulerYXZ(out, x2, y2, z2) {
        const c1 = Math.cos(x2 / 2);
        const c2 = Math.cos(y2 / 2);
        const c3 = Math.cos(z2 / 2);
        const s1 = Math.sin(x2 / 2);
        const s2 = Math.sin(y2 / 2);
        const s3 = Math.sin(z2 / 2);
        out[0] = s1 * c2 * c3 + c1 * s2 * s3;
        out[1] = c1 * s2 * c3 - s1 * c2 * s3;
        out[2] = c1 * c2 * s3 - s1 * s2 * c3;
        out[3] = c1 * c2 * c3 + s1 * s2 * s3;
      }
      WL.registerComponent("device-orientation-look", {}, {
        start: function() {
          this.rotationX = 0;
          this.rotationY = 0;
          this.lastClientX = -1;
          this.lastClientY = -1;
        },
        init: function() {
          this.deviceOrientation = [0, 0, 0, 1];
          this.screenOrientation = window.innerHeight > window.innerWidth ? 0 : 90;
          this._origin = [0, 0, 0];
          window.addEventListener("deviceorientation", function(e) {
            let alpha = e.alpha || 0;
            let beta = e.beta || 0;
            let gamma = e.gamma || 0;
            const toRad = Math.PI / 180;
            quatFromEulerYXZ(this.deviceOrientation, beta * toRad, alpha * toRad, -gamma * toRad);
          }.bind(this));
          window.addEventListener("orientationchange", function(e) {
            this.screenOrientation = window.orientation || 0;
          }.bind(this), false);
        },
        update: function() {
          if (Module["webxr_session"] != null)
            return;
          glMatrix.quat2.getTranslation(this._origin, this.object.transformLocal);
          this.object.resetTransform();
          if (this.screenOrientation != 0) {
            this.object.rotateAxisAngleDeg([0, 0, -1], this.screenOrientation);
          }
          this.object.rotate([-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)]);
          this.object.rotate(this.deviceOrientation);
          this.object.translate(this._origin);
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/finger-cursor.js
  var require_finger_cursor = __commonJS({
    "node_modules/@wonderlandengine/components/finger-cursor.js"() {
      WL.registerComponent("finger-cursor", {}, {
        init: function() {
          this.lastTarget = null;
        },
        start: function() {
          this.tip = this.object.getComponent("collision");
        },
        update: function() {
          const overlaps = this.tip.queryOverlaps();
          let overlapFound = null;
          for (let i = 0; i < overlaps.length; ++i) {
            const o = overlaps[i].object;
            const target = o.getComponent("cursor-target");
            if (target) {
              if (!target.equals(this.lastTarget)) {
                target.onHover(o, this);
                target.onClick(o, this);
              }
              overlapFound = target;
              break;
            }
          }
          if (!overlapFound) {
            if (this.lastTarget)
              this.lastTarget.onUnhover(this.lastTarget.object, this);
            this.lastTarget = null;
            return;
          } else {
            this.lastTarget = overlapFound;
          }
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/fixed-foveation.js
  var require_fixed_foveation = __commonJS({
    "node_modules/@wonderlandengine/components/fixed-foveation.js"() {
      WL.registerComponent("fixed-foveation", {
        /** Amount to apply from 0 (none) to 1 (full) */
        fixedFoveation: { type: WL.Type.Float, default: 0.5 }
      }, {
        start: function() {
          if (WL.xrSession) {
            this.setFixedFoveation();
          } else {
            WL.onXRSessionStart.push(this.setFixedFoveation.bind(this));
          }
        },
        setFixedFoveation: function() {
          if ("webxr_baseLayer" in Module) {
            Module.webxr_baseLayer.fixedFoveation = this.fixedFoveation;
          }
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/hand-tracking.js
  var hand_tracking_exports = {};
  var import_gl_matrix2;
  var init_hand_tracking = __esm({
    "node_modules/@wonderlandengine/components/hand-tracking.js"() {
      import_gl_matrix2 = __toESM(require_cjs());
      WL.registerComponent("hand-tracking", {
        /** Handedness determining whether to receive tracking input from right or left hand */
        handedness: { type: WL.Type.Enum, default: "left", values: ["left", "right"] },
        /** (optional) Mesh to use to visualize joints */
        jointMesh: { type: WL.Type.Mesh, default: null },
        /** Material to use for display. Applied to either the spawned skinned mesh or the joint spheres. */
        jointMaterial: { type: WL.Type.Material, default: null },
        /** (optional) Skin to apply tracked joint poses to. If not present, joint spheres will be used for display instead. */
        handSkin: { type: WL.Type.Skin, default: null },
        /** Deactivate children if no pose was tracked */
        deactivateChildrenWithoutPose: { type: WL.Type.Bool, default: true },
        /** Controller objects to activate including children if no pose is available */
        controllerToDeactivate: { type: WL.Type.Object }
      }, {
        ORDERED_JOINTS: [
          "wrist",
          "thumb-metacarpal",
          "thumb-phalanx-proximal",
          "thumb-phalanx-distal",
          "thumb-tip",
          "index-finger-metacarpal",
          "index-finger-phalanx-proximal",
          "index-finger-phalanx-intermediate",
          "index-finger-phalanx-distal",
          "index-finger-tip",
          "middle-finger-metacarpal",
          "middle-finger-phalanx-proximal",
          "middle-finger-phalanx-intermediate",
          "middle-finger-phalanx-distal",
          "middle-finger-tip",
          "ring-finger-metacarpal",
          "ring-finger-phalanx-proximal",
          "ring-finger-phalanx-intermediate",
          "ring-finger-phalanx-distal",
          "ring-finger-tip",
          "pinky-finger-metacarpal",
          "pinky-finger-phalanx-proximal",
          "pinky-finger-phalanx-intermediate",
          "pinky-finger-phalanx-distal",
          "pinky-finger-tip"
        ],
        init: function() {
          this.handedness = ["left", "right"][this.handedness];
        },
        start: function() {
          this.joints = [];
          this.session = null;
          this.hasPose = false;
          this._childrenActive = true;
          if (!("XRHand" in window)) {
            console.warn("WebXR Hand Tracking not supported by this browser.");
            this.active = false;
            return;
          }
          if (this.handSkin) {
            let skin = this.handSkin;
            let jointIds = skin.jointIds;
            this.joints[this.ORDERED_JOINTS[0]] = new WL.Object(jointIds[0]);
            for (let j = 0; j < jointIds.length; ++j) {
              let joint = new WL.Object(jointIds[j]);
              this.joints[joint.name] = joint;
            }
            return;
          }
          for (let j = 0; j <= this.ORDERED_JOINTS.length; ++j) {
            let joint = WL.scene.addObject(this.object.parent);
            let mesh = joint.addComponent("mesh");
            mesh.mesh = this.jointMesh;
            mesh.material = this.jointMaterial;
            this.joints[this.ORDERED_JOINTS[j]] = joint;
          }
        },
        update: function(dt2) {
          if (!this.session) {
            if (WL.xrSession)
              this.setupVREvents(WL.xrSession);
          }
          if (!this.session)
            return;
          this.hasPose = false;
          if (this.session && this.session.inputSources) {
            for (let i = 0; i <= this.session.inputSources.length; ++i) {
              const inputSource = this.session.inputSources[i];
              if (!inputSource || !inputSource.hand || inputSource.handedness != this.handedness)
                continue;
              this.hasPose = true;
              if (inputSource.hand.get("wrist") !== null) {
                const p = Module["webxr_frame"].getJointPose(inputSource.hand.get("wrist"), WebXR.refSpaces[WebXR.refSpace]);
                if (p) {
                  this.object.resetTranslationRotation();
                  this.object.transformLocal.set([
                    p.transform.orientation.x,
                    p.transform.orientation.y,
                    p.transform.orientation.z,
                    p.transform.orientation.w
                  ]);
                  this.object.translate([
                    p.transform.position.x,
                    p.transform.position.y,
                    p.transform.position.z
                  ]);
                }
              }
              let invTranslation = new Float32Array(3);
              let invRotation = new Float32Array(4);
              import_gl_matrix2.quat.invert(invRotation, this.object.transformLocal);
              this.object.getTranslationLocal(invTranslation);
              for (let j = 0; j < this.ORDERED_JOINTS.length; ++j) {
                const jointName = this.ORDERED_JOINTS[j];
                const joint = this.joints[jointName];
                if (joint == null)
                  continue;
                let jointPose = null;
                if (inputSource.hand.get(jointName) !== null) {
                  jointPose = Module["webxr_frame"].getJointPose(inputSource.hand.get(jointName), WebXR.refSpaces[WebXR.refSpace]);
                }
                if (jointPose !== null) {
                  if (this.handSkin) {
                    joint.resetTranslationRotation();
                    joint.translate([
                      jointPose.transform.position.x - invTranslation[0],
                      jointPose.transform.position.y - invTranslation[1],
                      jointPose.transform.position.z - invTranslation[2]
                    ]);
                    joint.rotate(invRotation);
                    joint.rotateObject([
                      jointPose.transform.orientation.x,
                      jointPose.transform.orientation.y,
                      jointPose.transform.orientation.z,
                      jointPose.transform.orientation.w
                    ]);
                  } else {
                    joint.resetTransform();
                    joint.transformLocal.set([
                      jointPose.transform.orientation.x,
                      jointPose.transform.orientation.y,
                      jointPose.transform.orientation.z,
                      jointPose.transform.orientation.w
                    ]);
                    joint.translate([
                      jointPose.transform.position.x,
                      jointPose.transform.position.y,
                      jointPose.transform.position.z
                    ]);
                    const r = jointPose.radius || 7e-3;
                    joint.scale([r, r, r]);
                  }
                } else {
                  if (!this.handSkin)
                    joint.scale([0, 0, 0]);
                }
              }
            }
          }
          if (!this.hasPose && this._childrenActive) {
            this._childrenActive = false;
            if (this.deactivateChildrenWithoutPose) {
              this.setChildrenActive(false);
            }
            if (this.controllerToDeactivate) {
              this.controllerToDeactivate.active = true;
              this.setChildrenActive(true, this.controllerToDeactivate);
            }
          } else if (this.hasPose && !this._childrenActive) {
            this._childrenActive = true;
            if (this.deactivateChildrenWithoutPose) {
              this.setChildrenActive(true);
            }
            if (this.controllerToDeactivate) {
              this.controllerToDeactivate.active = false;
              this.setChildrenActive(false, this.controllerToDeactivate);
            }
          }
        },
        setChildrenActive: function(active, object) {
          object = object || this.object;
          const children = object.children;
          for (const o of children) {
            o.active = active;
            this.setChildrenActive(active, o);
          }
        },
        isGrabbing: function() {
          const indexTipPos = [0, 0, 0];
          import_gl_matrix2.quat2.getTranslation(indexTipPos, this.joints["index-finger-tip"].transformLocal);
          const thumbTipPos = [0, 0, 0];
          import_gl_matrix2.quat2.getTranslation(thumbTipPos, this.joints["thumb-tip"].transformLocal);
          return import_gl_matrix2.vec3.sqrDist(thumbTipPos, indexTipPos) < 1e-3;
        },
        setupVREvents: function(s) {
          this.session = s;
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/hit-test-location.js
  var hit_test_location_exports = {};
  var import_gl_matrix3;
  var init_hit_test_location = __esm({
    "node_modules/@wonderlandengine/components/hit-test-location.js"() {
      import_gl_matrix3 = __toESM(require_cjs());
      WL.registerComponent("hit-test-location", {}, {
        init: function() {
          WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
          WL.onXRSessionStart.push(this.xrSessionEnd.bind(this));
          this.tempScaling = new Float32Array(3);
          this.tempScaling.set(this.object.scalingLocal);
          this.visible = false;
          this.object.scale([0, 0, 0]);
        },
        update: function(dt2) {
          const wasVisible = this.visible;
          if (this.xrHitTestSource) {
            const frame = Module["webxr_frame"];
            if (!frame)
              return;
            let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
            if (hitTestResults.length > 0) {
              let pose = hitTestResults[0].getPose(this.xrViewerSpace);
              this.visible = true;
              import_gl_matrix3.quat2.fromMat4(this.object.transformLocal, pose.transform.matrix);
              this.object.setDirty();
            } else {
              this.visible = false;
            }
          }
          if (this.visible != wasVisible) {
            if (!this.visible) {
              this.tempScaling.set(this.object.scalingLocal);
              this.object.scale([0, 0, 0]);
            } else {
              this.object.scalingLocal.set(this.tempScaling);
              this.object.setDirty();
            }
          }
        },
        xrSessionStart: function(session) {
          session.requestReferenceSpace("viewer").then(function(refSpace) {
            this.xrViewerSpace = refSpace;
            session.requestHitTestSource({ space: this.xrViewerSpace }).then(function(hitTestSource) {
              this.xrHitTestSource = hitTestSource;
            }.bind(this)).catch(console.error);
          }.bind(this)).catch(console.error);
        },
        xrSessionEnd: function() {
          if (!this.xrHitTestSource)
            return;
          this.xrHitTestSource.cancel();
          this.xrHitTestSource = null;
        }
      });
    }
  });

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          /**
           * Initialize the global Howler object.
           * @return {Howler}
           */
          init: function() {
            var self2 = this || Howler2;
            self2._counter = 1e3;
            self2._html5AudioPool = [];
            self2.html5PoolSize = 10;
            self2._codecs = {};
            self2._howls = [];
            self2._muted = false;
            self2._volume = 1;
            self2._canPlayEvent = "canplaythrough";
            self2._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self2.masterGain = null;
            self2.noAudio = false;
            self2.usingWebAudio = true;
            self2.autoSuspend = true;
            self2.ctx = null;
            self2.autoUnlock = true;
            self2._setup();
            return self2;
          },
          /**
           * Get/set the global volume for all sounds.
           * @param  {Float} vol Volume from 0.0 to 1.0.
           * @return {Howler/Float}     Returns self or current volume.
           */
          volume: function(vol) {
            var self2 = this || Howler2;
            vol = parseFloat(vol);
            if (!self2.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self2._volume = vol;
              if (self2._muted) {
                return self2;
              }
              if (self2.usingWebAudio) {
                self2.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              }
              for (var i = 0; i < self2._howls.length; i++) {
                if (!self2._howls[i]._webAudio) {
                  var ids = self2._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i]._soundById(ids[j]);
                    if (sound && sound._node) {
                      sound._node.volume = sound._volume * vol;
                    }
                  }
                }
              }
              return self2;
            }
            return self2._volume;
          },
          /**
           * Handle muting and unmuting globally.
           * @param  {Boolean} muted Is muted or not.
           */
          mute: function(muted) {
            var self2 = this || Howler2;
            if (!self2.ctx) {
              setupAudioContext();
            }
            self2._muted = muted;
            if (self2.usingWebAudio) {
              self2.masterGain.gain.setValueAtTime(muted ? 0 : self2._volume, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (!self2._howls[i]._webAudio) {
                var ids = self2._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self2._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.muted = muted ? true : sound._muted;
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Handle stopping all sounds globally.
           */
          stop: function() {
            var self2 = this || Howler2;
            for (var i = 0; i < self2._howls.length; i++) {
              self2._howls[i].stop();
            }
            return self2;
          },
          /**
           * Unload and destroy all currently loaded Howl objects.
           * @return {Howler}
           */
          unload: function() {
            var self2 = this || Howler2;
            for (var i = self2._howls.length - 1; i >= 0; i--) {
              self2._howls[i].unload();
            }
            if (self2.usingWebAudio && self2.ctx && typeof self2.ctx.close !== "undefined") {
              self2.ctx.close();
              self2.ctx = null;
              setupAudioContext();
            }
            return self2;
          },
          /**
           * Check for codec support of specific extension.
           * @param  {String} ext Audio file extention.
           * @return {Boolean}
           */
          codecs: function(ext) {
            return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
          },
          /**
           * Setup various state values for global tracking.
           * @return {Howler}
           */
          _setup: function() {
            var self2 = this || Howler2;
            self2.state = self2.ctx ? self2.ctx.state || "suspended" : "suspended";
            self2._autoSuspend();
            if (!self2.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self2._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self2.noAudio = true;
                }
              } else {
                self2.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self2.noAudio = true;
              }
            } catch (e) {
            }
            if (!self2.noAudio) {
              self2._setupCodecs();
            }
            return self2;
          },
          /**
           * Check for browser support for various codecs and cache the results.
           * @return {Howler}
           */
          _setupCodecs: function() {
            var self2 = this || Howler2;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self2;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self2;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self2._navigator ? self2._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/([0-6].)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self2._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self2;
          },
          /**
           * Some browsers/devices will only allow audio to be played after a user interaction.
           * Attempt to automatically unlock audio on the first user interaction.
           * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
           * @return {Howler}
           */
          _unlockAudio: function() {
            var self2 = this || Howler2;
            if (self2._audioUnlocked || !self2.ctx) {
              return;
            }
            self2._audioUnlocked = false;
            self2.autoUnlock = false;
            if (!self2._mobileUnloaded && self2.ctx.sampleRate !== 44100) {
              self2._mobileUnloaded = true;
              self2.unload();
            }
            self2._scratchBuffer = self2.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self2._html5AudioPool.length < self2.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self2._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self2.noAudio = true;
                  break;
                }
              }
              for (var i = 0; i < self2._howls.length; i++) {
                if (!self2._howls[i]._webAudio) {
                  var ids = self2._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self2._howls[i]._soundById(ids[j]);
                    if (sound && sound._node && !sound._node._unlocked) {
                      sound._node._unlocked = true;
                      sound._node.load();
                    }
                  }
                }
              }
              self2._autoResume();
              var source = self2.ctx.createBufferSource();
              source.buffer = self2._scratchBuffer;
              source.connect(self2.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self2.ctx.resume === "function") {
                self2.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self2._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i2 = 0; i2 < self2._howls.length; i2++) {
                  self2._howls[i2]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self2;
          },
          /**
           * Get an unlocked HTML5 Audio object from the pool. If none are left,
           * return a new Audio object and throw a warning.
           * @return {Audio} HTML5 Audio object.
           */
          _obtainHtml5Audio: function() {
            var self2 = this || Howler2;
            if (self2._html5AudioPool.length) {
              return self2._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          /**
           * Return an activated HTML5 Audio object to the pool.
           * @return {Howler}
           */
          _releaseHtml5Audio: function(audio) {
            var self2 = this || Howler2;
            if (audio._unlocked) {
              self2._html5AudioPool.push(audio);
            }
            return self2;
          },
          /**
           * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
           * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
           * @return {Howler}
           */
          _autoSuspend: function() {
            var self2 = this;
            if (!self2.autoSuspend || !self2.ctx || typeof self2.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            for (var i = 0; i < self2._howls.length; i++) {
              if (self2._howls[i]._webAudio) {
                for (var j = 0; j < self2._howls[i]._sounds.length; j++) {
                  if (!self2._howls[i]._sounds[j]._paused) {
                    return self2;
                  }
                }
              }
            }
            if (self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
            }
            self2._suspendTimer = setTimeout(function() {
              if (!self2.autoSuspend) {
                return;
              }
              self2._suspendTimer = null;
              self2.state = "suspending";
              var handleSuspension = function() {
                self2.state = "suspended";
                if (self2._resumeAfterSuspend) {
                  delete self2._resumeAfterSuspend;
                  self2._autoResume();
                }
              };
              self2.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self2;
          },
          /**
           * Automatically resume the Web Audio AudioContext when a new sound is played.
           * @return {Howler}
           */
          _autoResume: function() {
            var self2 = this;
            if (!self2.ctx || typeof self2.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            if (self2.state === "running" && self2.ctx.state !== "interrupted" && self2._suspendTimer) {
              clearTimeout(self2._suspendTimer);
              self2._suspendTimer = null;
            } else if (self2.state === "suspended" || self2.state === "running" && self2.ctx.state === "interrupted") {
              self2.ctx.resume().then(function() {
                self2.state = "running";
                for (var i = 0; i < self2._howls.length; i++) {
                  self2._howls[i]._emit("resume");
                }
              });
              if (self2._suspendTimer) {
                clearTimeout(self2._suspendTimer);
                self2._suspendTimer = null;
              }
            } else if (self2.state === "suspending") {
              self2._resumeAfterSuspend = true;
            }
            return self2;
          }
        };
        var Howler2 = new HowlerGlobal2();
        var Howl3 = function(o) {
          var self2 = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self2.init(o);
        };
        Howl3.prototype = {
          /**
           * Initialize a new Howl group object.
           * @param  {Object} o Passed in properties for this group.
           * @return {Howl}
           */
          init: function(o) {
            var self2 = this;
            if (!Howler2.ctx) {
              setupAudioContext();
            }
            self2._autoplay = o.autoplay || false;
            self2._format = typeof o.format !== "string" ? o.format : [o.format];
            self2._html5 = o.html5 || false;
            self2._muted = o.mute || false;
            self2._loop = o.loop || false;
            self2._pool = o.pool || 5;
            self2._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self2._rate = o.rate || 1;
            self2._sprite = o.sprite || {};
            self2._src = typeof o.src !== "string" ? o.src : [o.src];
            self2._volume = o.volume !== void 0 ? o.volume : 1;
            self2._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self2._duration = 0;
            self2._state = "unloaded";
            self2._sounds = [];
            self2._endTimers = {};
            self2._queue = [];
            self2._playLock = false;
            self2._onend = o.onend ? [{ fn: o.onend }] : [];
            self2._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self2._onload = o.onload ? [{ fn: o.onload }] : [];
            self2._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self2._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self2._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self2._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self2._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self2._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self2._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self2._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self2._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self2._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self2._onresume = [];
            self2._webAudio = Howler2.usingWebAudio && !self2._html5;
            if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
              Howler2._unlockAudio();
            }
            Howler2._howls.push(self2);
            if (self2._autoplay) {
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play();
                }
              });
            }
            if (self2._preload && self2._preload !== "none") {
              self2.load();
            }
            return self2;
          },
          /**
           * Load the audio file.
           * @return {Howler}
           */
          load: function() {
            var self2 = this;
            var url = null;
            if (Howler2.noAudio) {
              self2._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self2._src === "string") {
              self2._src = [self2._src];
            }
            for (var i = 0; i < self2._src.length; i++) {
              var ext, str;
              if (self2._format && self2._format[i]) {
                ext = self2._format[i];
              } else {
                str = self2._src[i];
                if (typeof str !== "string") {
                  self2._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler2.codecs(ext)) {
                url = self2._src[i];
                break;
              }
            }
            if (!url) {
              self2._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self2._src = url;
            self2._state = "loading";
            if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
              self2._html5 = true;
              self2._webAudio = false;
            }
            new Sound2(self2);
            if (self2._webAudio) {
              loadBuffer(self2);
            }
            return self2;
          },
          /**
           * Play a sound or resume previous playback.
           * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Number}          Sound ID.
           */
          play: function(sprite, internal) {
            var self2 = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self2._state === "loaded" && !self2._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self2._playLock) {
                var num = 0;
                for (var i = 0; i < self2._sounds.length; i++) {
                  if (self2._sounds[i]._paused && !self2._sounds[i]._ended) {
                    num++;
                    id = self2._sounds[i]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound = id ? self2._soundById(id) : self2._inactiveSound();
            if (!sound) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound._sprite || "__default";
            }
            if (self2._state !== "loaded") {
              sound._sprite = sprite;
              sound._ended = false;
              var soundId = sound._id;
              self2._queue.push({
                event: "play",
                action: function() {
                  self2.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound._paused) {
              if (!internal) {
                self2._loadQueue("play");
              }
              return sound._id;
            }
            if (self2._webAudio) {
              Howler2._autoResume();
            }
            var seek = Math.max(0, sound._seek > 0 ? sound._seek : self2._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound._rate);
            var start = self2._sprite[sprite][0] / 1e3;
            var stop = (self2._sprite[sprite][0] + self2._sprite[sprite][1]) / 1e3;
            sound._sprite = sprite;
            sound._ended = false;
            var setParams = function() {
              sound._paused = false;
              sound._seek = seek;
              sound._start = start;
              sound._stop = stop;
              sound._loop = !!(sound._loop || self2._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self2._ended(sound);
              return;
            }
            var node = sound._node;
            if (self2._webAudio) {
              var playWebAudio = function() {
                self2._playLock = false;
                setParams();
                self2._refreshBuffer(sound);
                var vol = sound._muted || self2._muted ? 0 : sound._volume;
                node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                sound._playStart = Howler2.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self2._emit("play", sound._id);
                    self2._loadQueue();
                  }, 0);
                }
              };
              if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self2._playLock = true;
                self2.once("resume", playWebAudio);
                self2._clearTimer(sound._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound._muted || self2._muted || Howler2._muted || node.muted;
                node.volume = sound._volume * Howler2.volume();
                node.playbackRate = sound._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self2._playLock = true;
                    setParams();
                    play.then(function() {
                      self2._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self2._emit("play", sound._id);
                      } else {
                        self2._loadQueue();
                      }
                    }).catch(function() {
                      self2._playLock = false;
                      self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound._ended = true;
                      sound._paused = true;
                    });
                  } else if (!internal) {
                    self2._playLock = false;
                    setParams();
                    self2._emit("play", sound._id);
                  }
                  node.playbackRate = sound._rate;
                  if (node.paused) {
                    self2._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound._loop) {
                    self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  } else {
                    self2._endTimers[sound._id] = function() {
                      self2._ended(sound);
                      node.removeEventListener("ended", self2._endTimers[sound._id], false);
                    };
                    node.addEventListener("ended", self2._endTimers[sound._id], false);
                  }
                } catch (err) {
                  self2._emit("playerror", sound._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self2._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self2._playLock = true;
                self2._state = "loading";
                var listener = function() {
                  self2._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler2._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler2._canPlayEvent, listener, false);
                self2._clearTimer(sound._id);
              }
            }
            return sound._id;
          },
          /**
           * Pause playback and save current position.
           * @param  {Number} id The sound ID (empty to pause all in group).
           * @return {Howl}
           */
          pause: function(id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "pause",
                action: function() {
                  self2.pause(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self2._clearTimer(ids[i]);
              var sound = self2._soundById(ids[i]);
              if (sound && !sound._paused) {
                sound._seek = self2.seek(ids[i]);
                sound._rateSeek = 0;
                sound._paused = true;
                self2._stopFade(ids[i]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (!sound._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self2._cleanBuffer(sound._node);
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self2._emit("pause", sound ? sound._id : null);
              }
            }
            return self2;
          },
          /**
           * Stop playback and reset to start.
           * @param  {Number} id The sound ID (empty to stop all in group).
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Howl}
           */
          stop: function(id, internal) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "stop",
                action: function() {
                  self2.stop(id);
                }
              });
              return self2;
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self2._clearTimer(ids[i]);
              var sound = self2._soundById(ids[i]);
              if (sound) {
                sound._seek = sound._start || 0;
                sound._rateSeek = 0;
                sound._paused = true;
                sound._ended = true;
                self2._stopFade(ids[i]);
                if (sound._node) {
                  if (self2._webAudio) {
                    if (sound._node.bufferSource) {
                      if (typeof sound._node.bufferSource.stop === "undefined") {
                        sound._node.bufferSource.noteOff(0);
                      } else {
                        sound._node.bufferSource.stop(0);
                      }
                      self2._cleanBuffer(sound._node);
                    }
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.currentTime = sound._start || 0;
                    sound._node.pause();
                    if (sound._node.duration === Infinity) {
                      self2._clearSound(sound._node);
                    }
                  }
                }
                if (!internal) {
                  self2._emit("stop", sound._id);
                }
              }
            }
            return self2;
          },
          /**
           * Mute/unmute a single sound or all sounds in this Howl group.
           * @param  {Boolean} muted Set to true to mute and false to unmute.
           * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
           * @return {Howl}
           */
          mute: function(muted, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "mute",
                action: function() {
                  self2.mute(muted, id);
                }
              });
              return self2;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self2._muted = muted;
              } else {
                return self2._muted;
              }
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self2._soundById(ids[i]);
              if (sound) {
                sound._muted = muted;
                if (sound._interval) {
                  self2._stopFade(sound._id);
                }
                if (self2._webAudio && sound._node) {
                  sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.muted = Howler2._muted ? true : muted;
                }
                self2._emit("mute", sound._id);
              }
            }
            return self2;
          },
          /**
           * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
           *   volume() -> Returns the group's volume value.
           *   volume(id) -> Returns the sound id's current volume.
           *   volume(vol) -> Sets the volume of all sounds in this Howl group.
           *   volume(vol, id) -> Sets the volume of passed sound id.
           * @return {Howl/Number} Returns self or current volume.
           */
          volume: function() {
            var self2 = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self2._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "volume",
                  action: function() {
                    self2.volume.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._volume = vol;
              }
              id = self2._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self2._soundById(id[i]);
                if (sound) {
                  sound._volume = vol;
                  if (!args[2]) {
                    self2._stopFade(id[i]);
                  }
                  if (self2._webAudio && sound._node && !sound._muted) {
                    sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                  } else if (sound._node && !sound._muted) {
                    sound._node.volume = vol * Howler2.volume();
                  }
                  self2._emit("volume", sound._id);
                }
              }
            } else {
              sound = id ? self2._soundById(id) : self2._sounds[0];
              return sound ? sound._volume : 0;
            }
            return self2;
          },
          /**
           * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id (omit to fade all sounds).
           * @return {Howl}
           */
          fade: function(from, to, len, id) {
            var self2 = this;
            if (self2._state !== "loaded" || self2._playLock) {
              self2._queue.push({
                event: "fade",
                action: function() {
                  self2.fade(from, to, len, id);
                }
              });
              return self2;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len = parseFloat(len);
            self2.volume(from, id);
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self2._soundById(ids[i]);
              if (sound) {
                if (!id) {
                  self2._stopFade(ids[i]);
                }
                if (self2._webAudio && !sound._muted) {
                  var currentTime = Howler2.ctx.currentTime;
                  var end = currentTime + len / 1e3;
                  sound._volume = from;
                  sound._node.gain.setValueAtTime(from, currentTime);
                  sound._node.gain.linearRampToValueAtTime(to, end);
                }
                self2._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
              }
            }
            return self2;
          },
          /**
           * Starts the internal interval to fade a sound.
           * @param  {Object} sound Reference to sound to fade.
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id to fade.
           * @param  {Boolean} isGroup   If true, set the volume on the group.
           */
          _startFadeInterval: function(sound, from, to, len, id, isGroup) {
            var self2 = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len / steps : len);
            var lastTick = Date.now();
            sound._fadeTo = to;
            sound._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self2._webAudio) {
                sound._volume = vol;
              } else {
                self2.volume(vol, sound._id, true);
              }
              if (isGroup) {
                self2._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound._interval);
                sound._interval = null;
                sound._fadeTo = null;
                self2.volume(to, sound._id);
                self2._emit("fade", sound._id);
              }
            }, stepLen);
          },
          /**
           * Internal method that stops the currently playing fade when
           * a new fade starts, volume is changed or the sound is stopped.
           * @param  {Number} id The sound id.
           * @return {Howl}
           */
          _stopFade: function(id) {
            var self2 = this;
            var sound = self2._soundById(id);
            if (sound && sound._interval) {
              if (self2._webAudio) {
                sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
              }
              clearInterval(sound._interval);
              sound._interval = null;
              self2.volume(sound._fadeTo, id);
              sound._fadeTo = null;
              self2._emit("fade", id);
            }
            return self2;
          },
          /**
           * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
           *   loop() -> Returns the group's loop value.
           *   loop(id) -> Returns the sound id's loop value.
           *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
           *   loop(loop, id) -> Sets the loop value of passed sound id.
           * @return {Howl/Boolean} Returns self or current loop value.
           */
          loop: function() {
            var self2 = this;
            var args = arguments;
            var loop, id, sound;
            if (args.length === 0) {
              return self2._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self2._loop = loop;
              } else {
                sound = self2._soundById(parseInt(args[0], 10));
                return sound ? sound._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self2._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              sound = self2._soundById(ids[i]);
              if (sound) {
                sound._loop = loop;
                if (self2._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.loop = loop;
                  if (loop) {
                    sound._node.bufferSource.loopStart = sound._start || 0;
                    sound._node.bufferSource.loopEnd = sound._stop;
                    if (self2.playing(ids[i])) {
                      self2.pause(ids[i], true);
                      self2.play(ids[i], true);
                    }
                  }
                }
              }
            }
            return self2;
          },
          /**
           * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   rate() -> Returns the first sound node's current playback rate.
           *   rate(id) -> Returns the sound id's current playback rate.
           *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
           *   rate(rate, id) -> Sets the playback rate of passed sound id.
           * @return {Howl/Number} Returns self or the current playback rate.
           */
          rate: function() {
            var self2 = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self2._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof rate === "number") {
              if (self2._state !== "loaded" || self2._playLock) {
                self2._queue.push({
                  event: "rate",
                  action: function() {
                    self2.rate.apply(self2, args);
                  }
                });
                return self2;
              }
              if (typeof id === "undefined") {
                self2._rate = rate;
              }
              id = self2._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self2._soundById(id[i]);
                if (sound) {
                  if (self2.playing(id[i])) {
                    sound._rateSeek = self2.seek(id[i]);
                    sound._playStart = self2._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                  }
                  sound._rate = rate;
                  if (self2._webAudio && sound._node && sound._node.bufferSource) {
                    sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                  } else if (sound._node) {
                    sound._node.playbackRate = rate;
                  }
                  var seek = self2.seek(id[i]);
                  var duration = (self2._sprite[sound._sprite][0] + self2._sprite[sound._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound._rate);
                  if (self2._endTimers[id[i]] || !sound._paused) {
                    self2._clearTimer(id[i]);
                    self2._endTimers[id[i]] = setTimeout(self2._ended.bind(self2, sound), timeout);
                  }
                  self2._emit("rate", sound._id);
                }
              }
            } else {
              sound = self2._soundById(id);
              return sound ? sound._rate : self2._rate;
            }
            return self2;
          },
          /**
           * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   seek() -> Returns the first sound node's current seek position.
           *   seek(id) -> Returns the sound id's current seek position.
           *   seek(seek) -> Sets the seek position of the first sound node.
           *   seek(seek, id) -> Sets the seek position of passed sound id.
           * @return {Howl/Number} Returns self or the current seek position.
           */
          seek: function() {
            var self2 = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self2._sounds.length) {
                id = self2._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self2._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self2._sounds.length) {
                id = self2._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self2._state !== "loaded" || self2._playLock)) {
              self2._queue.push({
                event: "seek",
                action: function() {
                  self2.seek.apply(self2, args);
                }
              });
              return self2;
            }
            var sound = self2._soundById(id);
            if (sound) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self2.playing(id);
                if (playing) {
                  self2.pause(id, true);
                }
                sound._seek = seek;
                sound._ended = false;
                self2._clearTimer(id);
                if (!self2._webAudio && sound._node && !isNaN(sound._node.duration)) {
                  sound._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self2.play(id, true);
                  }
                  self2._emit("seek", id);
                };
                if (playing && !self2._webAudio) {
                  var emitSeek = function() {
                    if (!self2._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self2._webAudio) {
                  var realTime = self2.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                  var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                  return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
                } else {
                  return sound._node.currentTime;
                }
              }
            }
            return self2;
          },
          /**
           * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
           * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
           * @return {Boolean} True if playing and false if not.
           */
          playing: function(id) {
            var self2 = this;
            if (typeof id === "number") {
              var sound = self2._soundById(id);
              return sound ? !sound._paused : false;
            }
            for (var i = 0; i < self2._sounds.length; i++) {
              if (!self2._sounds[i]._paused) {
                return true;
              }
            }
            return false;
          },
          /**
           * Get the duration of this sound. Passing a sound id will return the sprite duration.
           * @param  {Number} id The sound id to check. If none is passed, return full source duration.
           * @return {Number} Audio duration in seconds.
           */
          duration: function(id) {
            var self2 = this;
            var duration = self2._duration;
            var sound = self2._soundById(id);
            if (sound) {
              duration = self2._sprite[sound._sprite][1] / 1e3;
            }
            return duration;
          },
          /**
           * Returns the current loaded state of this Howl.
           * @return {String} 'unloaded', 'loading', 'loaded'
           */
          state: function() {
            return this._state;
          },
          /**
           * Unload and destroy the current Howl object.
           * This will immediately stop all sound instances attached to this group.
           */
          unload: function() {
            var self2 = this;
            var sounds = self2._sounds;
            for (var i = 0; i < sounds.length; i++) {
              if (!sounds[i]._paused) {
                self2.stop(sounds[i]._id);
              }
              if (!self2._webAudio) {
                self2._clearSound(sounds[i]._node);
                sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
                sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
                sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
                Howler2._releaseHtml5Audio(sounds[i]._node);
              }
              delete sounds[i]._node;
              self2._clearTimer(sounds[i]._id);
            }
            var index = Howler2._howls.indexOf(self2);
            if (index >= 0) {
              Howler2._howls.splice(index, 1);
            }
            var remCache = true;
            for (i = 0; i < Howler2._howls.length; i++) {
              if (Howler2._howls[i]._src === self2._src || self2._src.indexOf(Howler2._howls[i]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache && remCache) {
              delete cache[self2._src];
            }
            Howler2.noAudio = false;
            self2._state = "unloaded";
            self2._sounds = [];
            self2 = null;
            return null;
          },
          /**
           * Listen to a custom event.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
           * @return {Howl}
           */
          on: function(event, fn2, id, once) {
            var self2 = this;
            var events = self2["_on" + event];
            if (typeof fn2 === "function") {
              events.push(once ? { id, fn: fn2, once } : { id, fn: fn2 });
            }
            return self2;
          },
          /**
           * Remove a custom event. Call without parameters to remove all events.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to remove. Leave empty to remove all.
           * @param  {Number}   id    (optional) Only remove events for this sound.
           * @return {Howl}
           */
          off: function(event, fn2, id) {
            var self2 = this;
            var events = self2["_on" + event];
            var i = 0;
            if (typeof fn2 === "number") {
              id = fn2;
              fn2 = null;
            }
            if (fn2 || id) {
              for (i = 0; i < events.length; i++) {
                var isId = id === events[i].id;
                if (fn2 === events[i].fn && isId || !fn2 && isId) {
                  events.splice(i, 1);
                  break;
                }
              }
            } else if (event) {
              self2["_on" + event] = [];
            } else {
              var keys = Object.keys(self2);
              for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("_on") === 0 && Array.isArray(self2[keys[i]])) {
                  self2[keys[i]] = [];
                }
              }
            }
            return self2;
          },
          /**
           * Listen to a custom event and remove it once fired.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @return {Howl}
           */
          once: function(event, fn2, id) {
            var self2 = this;
            self2.on(event, fn2, id, 1);
            return self2;
          },
          /**
           * Emit all events of a specific type and pass the sound id.
           * @param  {String} event Event name.
           * @param  {Number} id    Sound ID.
           * @param  {Number} msg   Message to go with event.
           * @return {Howl}
           */
          _emit: function(event, id, msg) {
            var self2 = this;
            var events = self2["_on" + event];
            for (var i = events.length - 1; i >= 0; i--) {
              if (!events[i].id || events[i].id === id || event === "load") {
                setTimeout(function(fn2) {
                  fn2.call(this, id, msg);
                }.bind(self2, events[i].fn), 0);
                if (events[i].once) {
                  self2.off(event, events[i].fn, events[i].id);
                }
              }
            }
            self2._loadQueue(event);
            return self2;
          },
          /**
           * Queue of actions initiated before the sound has loaded.
           * These will be called in sequence, with the next only firing
           * after the previous has finished executing (even if async like play).
           * @return {Howl}
           */
          _loadQueue: function(event) {
            var self2 = this;
            if (self2._queue.length > 0) {
              var task = self2._queue[0];
              if (task.event === event) {
                self2._queue.shift();
                self2._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self2;
          },
          /**
           * Fired when playback ends at the end of the duration.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _ended: function(sound) {
            var self2 = this;
            var sprite = sound._sprite;
            if (!self2._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
              setTimeout(self2._ended.bind(self2, sound), 100);
              return self2;
            }
            var loop = !!(sound._loop || self2._sprite[sprite][2]);
            self2._emit("end", sound._id);
            if (!self2._webAudio && loop) {
              self2.stop(sound._id, true).play(sound._id);
            }
            if (self2._webAudio && loop) {
              self2._emit("play", sound._id);
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._playStart = Howler2.ctx.currentTime;
              var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
              self2._endTimers[sound._id] = setTimeout(self2._ended.bind(self2, sound), timeout);
            }
            if (self2._webAudio && !loop) {
              sound._paused = true;
              sound._ended = true;
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              self2._clearTimer(sound._id);
              self2._cleanBuffer(sound._node);
              Howler2._autoSuspend();
            }
            if (!self2._webAudio && !loop) {
              self2.stop(sound._id, true);
            }
            return self2;
          },
          /**
           * Clear the end timer for a sound playback.
           * @param  {Number} id The sound ID.
           * @return {Howl}
           */
          _clearTimer: function(id) {
            var self2 = this;
            if (self2._endTimers[id]) {
              if (typeof self2._endTimers[id] !== "function") {
                clearTimeout(self2._endTimers[id]);
              } else {
                var sound = self2._soundById(id);
                if (sound && sound._node) {
                  sound._node.removeEventListener("ended", self2._endTimers[id], false);
                }
              }
              delete self2._endTimers[id];
            }
            return self2;
          },
          /**
           * Return the sound identified by this ID, or return null.
           * @param  {Number} id Sound ID
           * @return {Object}    Sound object or null.
           */
          _soundById: function(id) {
            var self2 = this;
            for (var i = 0; i < self2._sounds.length; i++) {
              if (id === self2._sounds[i]._id) {
                return self2._sounds[i];
              }
            }
            return null;
          },
          /**
           * Return an inactive sound from the pool or create a new one.
           * @return {Sound} Sound playback object.
           */
          _inactiveSound: function() {
            var self2 = this;
            self2._drain();
            for (var i = 0; i < self2._sounds.length; i++) {
              if (self2._sounds[i]._ended) {
                return self2._sounds[i].reset();
              }
            }
            return new Sound2(self2);
          },
          /**
           * Drain excess inactive sounds from the pool.
           */
          _drain: function() {
            var self2 = this;
            var limit = self2._pool;
            var cnt = 0;
            var i = 0;
            if (self2._sounds.length < limit) {
              return;
            }
            for (i = 0; i < self2._sounds.length; i++) {
              if (self2._sounds[i]._ended) {
                cnt++;
              }
            }
            for (i = self2._sounds.length - 1; i >= 0; i--) {
              if (cnt <= limit) {
                return;
              }
              if (self2._sounds[i]._ended) {
                if (self2._webAudio && self2._sounds[i]._node) {
                  self2._sounds[i]._node.disconnect(0);
                }
                self2._sounds.splice(i, 1);
                cnt--;
              }
            }
          },
          /**
           * Get all ID's from the sounds pool.
           * @param  {Number} id Only return one ID if one is passed.
           * @return {Array}    Array of IDs.
           */
          _getSoundIds: function(id) {
            var self2 = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i = 0; i < self2._sounds.length; i++) {
                ids.push(self2._sounds[i]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          /**
           * Load the sound back into the buffer source.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _refreshBuffer: function(sound) {
            var self2 = this;
            sound._node.bufferSource = Howler2.ctx.createBufferSource();
            sound._node.bufferSource.buffer = cache[self2._src];
            if (sound._panner) {
              sound._node.bufferSource.connect(sound._panner);
            } else {
              sound._node.bufferSource.connect(sound._node);
            }
            sound._node.bufferSource.loop = sound._loop;
            if (sound._loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop || 0;
            }
            sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
            return self2;
          },
          /**
           * Prevent memory leaks by cleaning up the buffer source after playback.
           * @param  {Object} node Sound's audio node containing the buffer source.
           * @return {Howl}
           */
          _cleanBuffer: function(node) {
            var self2 = this;
            var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
            if (Howler2._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler2._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self2;
          },
          /**
           * Set the source to a 0-second silence to stop any downloading (except in IE).
           * @param  {Object} node Audio node to clear.
           */
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          /**
           * Initialize a new Sound object.
           * @return {Sound}
           */
          init: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            parent._sounds.push(self2);
            self2.create();
            return self2;
          },
          /**
           * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
           * @return {Sound}
           */
          create: function() {
            var self2 = this;
            var parent = self2._parent;
            var volume = Howler2._muted || self2._muted || self2._parent._muted ? 0 : self2._volume;
            if (parent._webAudio) {
              self2._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
              self2._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
              self2._node.paused = true;
              self2._node.connect(Howler2.masterGain);
            } else if (!Howler2.noAudio) {
              self2._node = Howler2._obtainHtml5Audio();
              self2._errorFn = self2._errorListener.bind(self2);
              self2._node.addEventListener("error", self2._errorFn, false);
              self2._loadFn = self2._loadListener.bind(self2);
              self2._node.addEventListener(Howler2._canPlayEvent, self2._loadFn, false);
              self2._endFn = self2._endListener.bind(self2);
              self2._node.addEventListener("ended", self2._endFn, false);
              self2._node.src = parent._src;
              self2._node.preload = parent._preload === true ? "auto" : parent._preload;
              self2._node.volume = volume * Howler2.volume();
              self2._node.load();
            }
            return self2;
          },
          /**
           * Reset the parameters of this sound to the original state (for recycle).
           * @return {Sound}
           */
          reset: function() {
            var self2 = this;
            var parent = self2._parent;
            self2._muted = parent._muted;
            self2._loop = parent._loop;
            self2._volume = parent._volume;
            self2._rate = parent._rate;
            self2._seek = 0;
            self2._rateSeek = 0;
            self2._paused = true;
            self2._ended = true;
            self2._sprite = "__default";
            self2._id = ++Howler2._counter;
            return self2;
          },
          /**
           * HTML5 Audio error listener callback.
           */
          _errorListener: function() {
            var self2 = this;
            self2._parent._emit("loaderror", self2._id, self2._node.error ? self2._node.error.code : 0);
            self2._node.removeEventListener("error", self2._errorFn, false);
          },
          /**
           * HTML5 Audio canplaythrough listener callback.
           */
          _loadListener: function() {
            var self2 = this;
            var parent = self2._parent;
            parent._duration = Math.ceil(self2._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self2._node.removeEventListener(Howler2._canPlayEvent, self2._loadFn, false);
          },
          /**
           * HTML5 Audio ended listener callback.
           */
          _endListener: function() {
            var self2 = this;
            var parent = self2._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self2._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self2);
            }
            self2._node.removeEventListener("ended", self2._endFn, false);
          }
        };
        var cache = {};
        var loadBuffer = function(self2) {
          var url = self2._src;
          if (cache[url]) {
            self2._duration = cache[url].duration;
            loadSound(self2);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url)) {
            var data = atob(url.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
              dataView[i] = data.charCodeAt(i);
            }
            decodeAudioData(dataView.buffer, self2);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self2._xhr.method, url, true);
            xhr.withCredentials = self2._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self2._xhr.headers) {
              Object.keys(self2._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self2._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self2._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self2);
            };
            xhr.onerror = function() {
              if (self2._webAudio) {
                self2._html5 = true;
                self2._webAudio = false;
                self2._sounds = [];
                delete cache[url];
                self2.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self2) {
          var error = function() {
            self2._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self2._sounds.length > 0) {
              cache[self2._src] = buffer;
              loadSound(self2, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
            Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler2.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self2, buffer) {
          if (buffer && !self2._duration) {
            self2._duration = buffer.duration;
          }
          if (Object.keys(self2._sprite).length === 0) {
            self2._sprite = { __default: [0, self2._duration * 1e3] };
          }
          if (self2._state !== "loaded") {
            self2._state = "loaded";
            self2._emit("load");
            self2._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler2.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler2.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler2.ctx = new webkitAudioContext();
            } else {
              Howler2.usingWebAudio = false;
            }
          } catch (e) {
            Howler2.usingWebAudio = false;
          }
          if (!Howler2.ctx) {
            Howler2.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
          var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version3 = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version3 && version3 < 9) {
            var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
            if (Howler2._navigator && !safari) {
              Howler2.usingWebAudio = false;
            }
          }
          if (Howler2.usingWebAudio) {
            Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
            Howler2.masterGain.connect(Howler2.ctx.destination);
          }
          Howler2._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler2,
              Howl: Howl3
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler2;
          exports.Howl = Howl3;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler2;
          global.Howl = Howl3;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler2;
          window.Howl = Howl3;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          for (var i = self2._howls.length - 1; i >= 0; i--) {
            self2._howls[i].stereo(pan);
          }
          return self2;
        };
        HowlerGlobal.prototype.pos = function(x2, y2, z2) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          y2 = typeof y2 !== "number" ? self2._pos[1] : y2;
          z2 = typeof z2 !== "number" ? self2._pos[2] : z2;
          if (typeof x2 === "number") {
            self2._pos = [x2, y2, z2];
            if (typeof self2.ctx.listener.positionX !== "undefined") {
              self2.ctx.listener.positionX.setTargetAtTime(self2._pos[0], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionY.setTargetAtTime(self2._pos[1], Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.positionZ.setTargetAtTime(self2._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setPosition(self2._pos[0], self2._pos[1], self2._pos[2]);
            }
          } else {
            return self2._pos;
          }
          return self2;
        };
        HowlerGlobal.prototype.orientation = function(x2, y2, z2, xUp, yUp, zUp) {
          var self2 = this;
          if (!self2.ctx || !self2.ctx.listener) {
            return self2;
          }
          var or2 = self2._orientation;
          y2 = typeof y2 !== "number" ? or2[1] : y2;
          z2 = typeof z2 !== "number" ? or2[2] : z2;
          xUp = typeof xUp !== "number" ? or2[3] : xUp;
          yUp = typeof yUp !== "number" ? or2[4] : yUp;
          zUp = typeof zUp !== "number" ? or2[5] : zUp;
          if (typeof x2 === "number") {
            self2._orientation = [x2, y2, z2, xUp, yUp, zUp];
            if (typeof self2.ctx.listener.forwardX !== "undefined") {
              self2.ctx.listener.forwardX.setTargetAtTime(x2, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardY.setTargetAtTime(y2, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.forwardZ.setTargetAtTime(z2, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self2.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self2.ctx.listener.setOrientation(x2, y2, z2, xUp, yUp, zUp);
            }
          } else {
            return or2;
          }
          return self2;
        };
        Howl.prototype.init = function(_super) {
          return function(o) {
            var self2 = this;
            self2._orientation = o.orientation || [1, 0, 0];
            self2._stereo = o.stereo || null;
            self2._pos = o.pos || null;
            self2._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self2._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self2._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self2._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "stereo",
              action: function() {
                self2.stereo(pan, id);
              }
            });
            return self2;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self2._stereo = pan;
              self2._pos = [pan, 0, 0];
            } else {
              return self2._stereo;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof pan === "number") {
                sound._stereo = pan;
                sound._pos = [pan, 0, 0];
                if (sound._node) {
                  sound._pannerAttr.panningModel = "equalpower";
                  if (!sound._panner || !sound._panner.pan) {
                    setupPanner(sound, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound._panner.positionX !== "undefined") {
                      sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self2._emit("stereo", sound._id);
              } else {
                return sound._stereo;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pos = function(x2, y2, z2, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "pos",
              action: function() {
                self2.pos(x2, y2, z2, id);
              }
            });
            return self2;
          }
          y2 = typeof y2 !== "number" ? 0 : y2;
          z2 = typeof z2 !== "number" ? -0.5 : z2;
          if (typeof id === "undefined") {
            if (typeof x2 === "number") {
              self2._pos = [x2, y2, z2];
            } else {
              return self2._pos;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof x2 === "number") {
                sound._pos = [x2, y2, z2];
                if (sound._node) {
                  if (!sound._panner || sound._panner.pan) {
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(x2, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(y2, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(z2, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(x2, y2, z2);
                  }
                }
                self2._emit("pos", sound._id);
              } else {
                return sound._pos;
              }
            }
          }
          return self2;
        };
        Howl.prototype.orientation = function(x2, y2, z2, id) {
          var self2 = this;
          if (!self2._webAudio) {
            return self2;
          }
          if (self2._state !== "loaded") {
            self2._queue.push({
              event: "orientation",
              action: function() {
                self2.orientation(x2, y2, z2, id);
              }
            });
            return self2;
          }
          y2 = typeof y2 !== "number" ? self2._orientation[1] : y2;
          z2 = typeof z2 !== "number" ? self2._orientation[2] : z2;
          if (typeof id === "undefined") {
            if (typeof x2 === "number") {
              self2._orientation = [x2, y2, z2];
            } else {
              return self2._orientation;
            }
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self2._soundById(ids[i]);
            if (sound) {
              if (typeof x2 === "number") {
                sound._orientation = [x2, y2, z2];
                if (sound._node) {
                  if (!sound._panner) {
                    if (!sound._pos) {
                      sound._pos = self2._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.orientationX !== "undefined") {
                    sound._panner.orientationX.setValueAtTime(x2, Howler.ctx.currentTime);
                    sound._panner.orientationY.setValueAtTime(y2, Howler.ctx.currentTime);
                    sound._panner.orientationZ.setValueAtTime(z2, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setOrientation(x2, y2, z2);
                  }
                }
                self2._emit("orientation", sound._id);
              } else {
                return sound._orientation;
              }
            }
          }
          return self2;
        };
        Howl.prototype.pannerAttr = function() {
          var self2 = this;
          var args = arguments;
          var o, id, sound;
          if (!self2._webAudio) {
            return self2;
          }
          if (args.length === 0) {
            return self2._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self2._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self2._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self2._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self2._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self2._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self2._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self2._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self2._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self2._panningModel
                };
              }
            } else {
              sound = self2._soundById(parseInt(args[0], 10));
              return sound ? sound._pannerAttr : self2._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self2._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self2._soundById(ids[i]);
            if (sound) {
              var pa = sound._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound._panner;
              if (panner) {
                panner.coneInnerAngle = pa.coneInnerAngle;
                panner.coneOuterAngle = pa.coneOuterAngle;
                panner.coneOuterGain = pa.coneOuterGain;
                panner.distanceModel = pa.distanceModel;
                panner.maxDistance = pa.maxDistance;
                panner.refDistance = pa.refDistance;
                panner.rolloffFactor = pa.rolloffFactor;
                panner.panningModel = pa.panningModel;
              } else {
                if (!sound._pos) {
                  sound._pos = self2._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
              }
            }
          }
          return self2;
        };
        Sound.prototype.init = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = function(_super) {
          return function() {
            var self2 = this;
            var parent = self2._parent;
            self2._orientation = parent._orientation;
            self2._stereo = parent._stereo;
            self2._pos = parent._pos;
            self2._pannerAttr = parent._pannerAttr;
            if (self2._stereo) {
              parent.stereo(self2._stereo);
            } else if (self2._pos) {
              parent.pos(self2._pos[0], self2._pos[1], self2._pos[2], self2._id);
            } else if (self2._panner) {
              self2._panner.disconnect(0);
              self2._panner = void 0;
              parent._refreshBuffer(self2);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound._panner = Howler.ctx.createPanner();
            sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
            sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
            sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
            sound._panner.distanceModel = sound._pannerAttr.distanceModel;
            sound._panner.maxDistance = sound._pannerAttr.maxDistance;
            sound._panner.refDistance = sound._pannerAttr.refDistance;
            sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
            sound._panner.panningModel = sound._pannerAttr.panningModel;
            if (typeof sound._panner.positionX !== "undefined") {
              sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
            }
            if (typeof sound._panner.orientationX !== "undefined") {
              sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
            }
          } else {
            sound._panner = Howler.ctx.createStereoPanner();
            sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
          }
          sound._panner.connect(sound._node);
          if (!sound._paused) {
            sound._parent.pause(sound._id, true).play(sound._id, true);
          }
        };
      })();
    }
  });

  // node_modules/@wonderlandengine/components/howler-audio-listener.js
  var howler_audio_listener_exports = {};
  var import_howler;
  var init_howler_audio_listener = __esm({
    "node_modules/@wonderlandengine/components/howler-audio-listener.js"() {
      import_howler = __toESM(require_howler());
      WL.registerComponent("howler-audio-listener", {
        /** Whether audio should be spatialized/positional. */
        spatial: { type: WL.Type.Bool, default: true }
      }, {
        init: function() {
          this.origin = new Float32Array(3);
          this.fwd = new Float32Array(3);
          this.up = new Float32Array(3);
        },
        update: function() {
          if (!this.spatial)
            return;
          this.object.getTranslationWorld(this.origin);
          this.object.getForward(this.fwd);
          this.object.getUp(this.up);
          Howler.pos(this.origin[0], this.origin[1], this.origin[2]);
          Howler.orientation(
            this.fwd[0],
            this.fwd[1],
            this.fwd[2],
            this.up[0],
            this.up[1],
            this.up[2]
          );
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/howler-audio-source.js
  var howler_audio_source_exports = {};
  var import_howler2;
  var init_howler_audio_source = __esm({
    "node_modules/@wonderlandengine/components/howler-audio-source.js"() {
      import_howler2 = __toESM(require_howler());
      WL.registerComponent("howler-audio-source", {
        /** Volume */
        volume: { type: WL.Type.Float, default: 1 },
        /** Whether audio should be spatialized/positional */
        spatial: { type: WL.Type.Bool, default: true },
        /** Whether to loop the sound */
        loop: { type: WL.Type.Bool, default: false },
        /** Whether to start playing automatically */
        autoplay: { type: WL.Type.Bool, default: false },
        /** URL to a sound file to play */
        src: { type: WL.Type.String, default: "" }
      }, {
        start: function() {
          this.audio = new import_howler2.Howl({
            src: [this.src],
            loop: this.loop,
            volume: this.volume,
            autoplay: this.autoplay
          });
          this.lastPlayedAudioId = null;
          this.origin = new Float32Array(3);
          this.lastOrigin = new Float32Array(3);
          if (this.spatial && this.autoplay) {
            this.updatePosition();
            this.play();
          }
          const callback = () => {
            this.stop();
            const idx = WL.onSceneLoaded.indexOf(callback);
            if (idx >= 0)
              WL.onSceneLoaded.splice(idx, 1);
          };
          WL.onSceneLoaded.push(callback);
        },
        update: function() {
          if (!this.spatial || !this.lastPlayedAudioId)
            return;
          this.object.getTranslationWorld(this.origin);
          if (Math.abs(this.lastOrigin[0] - this.origin[0]) > 5e-3 || Math.abs(this.lastOrigin[1] - this.origin[1]) > 5e-3 || Math.abs(this.lastOrigin[2] - this.origin[2]) > 5e-3) {
            this.updatePosition();
          }
        },
        updatePosition: function() {
          this.audio.pos(
            this.origin[0],
            this.origin[1],
            this.origin[2],
            this.lastPlayedAudioId
          );
          this.lastOrigin.set(this.origin);
        },
        play: function() {
          if (this.lastPlayedAudioId)
            this.audio.stop(this.lastPlayedAudioId);
          this.lastPlayedAudioId = this.audio.play();
          if (this.spatial)
            this.updatePosition();
        },
        stop: function() {
          if (!this.lastPlayedAudioId)
            return;
          this.audio.stop(this.lastPlayedAudioId);
          this.lastPlayedAudioId = null;
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/image-texture.js
  var require_image_texture = __commonJS({
    "node_modules/@wonderlandengine/components/image-texture.js"() {
      WL.registerComponent("image-texture", {
        /** URL to download the image from */
        url: { type: WL.Type.String, default: "" },
        /** 0-based mesh component index on this object (e.g. 1 for "second mesh").
         * **Deprecated:** Please use `material` instead. */
        meshIndex: { type: WL.Type.Int, default: 0 },
        /** Material to apply the video texture to (if `null`, tries to apply to the mesh with `meshIndex`) */
        material: { type: WL.Type.Material }
      }, {
        init: function() {
          if (!this.material) {
            console.warn("image-texture: material property not set, please set 'material' instead of deprecated 'meshIndex'.");
            this.material = this.object.getComponent("mesh", this.meshIndex).material;
          }
        },
        start: function() {
          WL.textures.load(this.url, "anonymous").then((texture) => {
            if (this.material.shader == "Flat Opaque Textured") {
              this.material.flatTexture = texture;
            } else if (mat.shader == "Phong Opaque Textured") {
              this.material.diffuseTexture = texture;
            } else {
              console.error("Shader", this.material.shader, "not supported by image-texture");
            }
          }).catch(console.err);
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/mouse-look.js
  var mouse_look_exports = {};
  var import_gl_matrix4;
  var init_mouse_look = __esm({
    "node_modules/@wonderlandengine/components/mouse-look.js"() {
      import_gl_matrix4 = __toESM(require_cjs());
      WL.registerComponent("mouse-look", {
        /** Mouse look sensitivity */
        sensitity: { type: WL.Type.Float, default: 0.25 },
        /** Require a mouse button to be pressed to control view.
         * Otherwise view will allways follow mouse movement */
        requireMouseDown: { type: WL.Type.Bool, default: true },
        /** If "moveOnClick" is enabled, mouse button which should
         * be held down to control view */
        mouseButtonIndex: { type: WL.Type.Int, default: 0 },
        /** Enables pointer lock on "mousedown" event on WL.canvas */
        pointerLockOnClick: { type: WL.Type.Bool, default: false }
      }, {
        init: function() {
          this.currentRotationY = 0;
          this.currentRotationX = 0;
          this.origin = new Float32Array(3);
          this.parentOrigin = new Float32Array(3);
          document.addEventListener("mousemove", function(e) {
            if (this.active && (this.mouseDown || !this.requireMouseDown)) {
              this.rotationY = -this.sensitity * e.movementX / 100;
              this.rotationX = -this.sensitity * e.movementY / 100;
              this.currentRotationX += this.rotationX;
              this.currentRotationY += this.rotationY;
              this.currentRotationX = Math.min(1.507, this.currentRotationX);
              this.currentRotationX = Math.max(-1.507, this.currentRotationX);
              this.object.getTranslationWorld(this.origin);
              const parent = this.object.parent;
              if (parent !== null) {
                parent.getTranslationWorld(this.parentOrigin);
                import_gl_matrix4.vec3.sub(this.origin, this.origin, this.parentOrigin);
              }
              this.object.resetTranslationRotation();
              this.object.rotateAxisAngleRad([1, 0, 0], this.currentRotationX);
              this.object.rotateAxisAngleRad([0, 1, 0], this.currentRotationY);
              this.object.translate(this.origin);
            }
          }.bind(this));
          if (this.pointerLockOnClick) {
            WL.canvas.addEventListener("mousedown", () => {
              WL.canvas.requestPointerLock = WL.canvas.requestPointerLock || WL.canvas.mozRequestPointerLock || WL.canvas.webkitRequestPointerLock;
              WL.canvas.requestPointerLock();
            });
          }
          if (this.requireMouseDown) {
            if (this.mouseButtonIndex == 2) {
              WL.canvas.addEventListener("contextmenu", function(e) {
                e.preventDefault();
              }, false);
            }
            WL.canvas.addEventListener("mousedown", function(e) {
              if (e.button == this.mouseButtonIndex) {
                this.mouseDown = true;
                document.body.style.cursor = "grabbing";
                if (e.button == 1) {
                  e.preventDefault();
                  return false;
                }
              }
            }.bind(this));
            WL.canvas.addEventListener("mouseup", function(e) {
              if (e.button == this.mouseButtonIndex) {
                this.mouseDown = false;
                document.body.style.cursor = "initial";
              }
            }.bind(this));
          }
        },
        start: function() {
          this.rotationX = 0;
          this.rotationY = 0;
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/target-framerate.js
  var require_target_framerate = __commonJS({
    "node_modules/@wonderlandengine/components/target-framerate.js"() {
      WL.registerComponent("target-framerate", {
        framerate: { type: WL.Type.Float, default: 90 }
      }, {
        start: function() {
          if (WL.xrSession) {
            this.setTargetFramerate(WL.xrSession);
          } else {
            WL.onXRSessionStart.push(this.setTargetFramerate.bind(this));
          }
        },
        setTargetFramerate: function(s) {
          if (s.supportedFrameRates && s.updateTargetFrameRate) {
            const a = WL.xrSession.supportedFrameRates;
            a.sort((a2, b2) => Math.abs(a2 - this.framerate) - Math.abs(b2 - this.framerate));
            WL.xrSession.updateTargetFrameRate(a[0]);
          }
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/teleport.js
  var teleport_exports = {};
  var import_gl_matrix5;
  var init_teleport = __esm({
    "node_modules/@wonderlandengine/components/teleport.js"() {
      import_gl_matrix5 = __toESM(require_cjs());
      WL.registerComponent("teleport", {
        /** Object that will be placed as indiciation forwhere the player will teleport to. */
        teleportIndicatorMeshObject: { type: WL.Type.Object },
        /** Root of the player, the object that will be positioned on teleportation. */
        camRoot: { type: WL.Type.Object },
        /** Non-vr camera for use outside of VR */
        cam: { type: WL.Type.Object },
        /** Left eye for use in VR*/
        eyeLeft: { type: WL.Type.Object },
        /** Right eye for use in VR*/
        eyeRight: { type: WL.Type.Object },
        /** Handedness for VR cursors to accept trigger events only from respective controller. */
        handedness: { type: WL.Type.Enum, values: ["input component", "left", "right", "none"], default: "input component" },
        /** Collision group of valid "floor" objects that can be teleported on */
        floorGroup: { type: WL.Type.Int, default: 1 },
        /** How far the thumbstick needs to be pushed to have the teleport target indicator show up */
        thumbstickActivationThreshhold: { type: WL.Type.Float, default: -0.7 },
        /** How far the thumbstick needs to be released to execute the teleport */
        thumbstickDeactivationThreshhold: { type: WL.Type.Float, default: 0.3 },
        /** Offset to apply to the indicator object, e.g. to avoid it from Z-fighting with the floor */
        indicatorYOffset: { type: WL.Type.Float, default: 0.01 },
        /** Mode for raycasting, whether to use PhysX or simple collision components */
        rayCastMode: { type: WL.Type.Enum, values: ["collision", "physx"], default: "collision" },
        /** Max distance for PhysX raycast */
        maxDistance: { type: WL.Type.Float, default: 100 }
      }, {
        init: function() {
          this._prevThumbstickAxis = new Float32Array(2);
          this._tempVec = new Float32Array(3);
          this._tempVec0 = new Float32Array(3);
          this._currentIndicatorRotation = 0;
          this.input = this.object.getComponent("input");
          if (!this.input) {
            console.error(this.object.name, "generic-teleport-component.js: input component is required on the object");
            return;
          }
          if (!this.teleportIndicatorMeshObject) {
            console.error(this.object.name, "generic-teleport-component.js: Teleport indicator mesh is missing");
            return;
          }
          if (!this.camRoot) {
            console.error(this.object.name, "generic-teleport-component.js: camRoot not set");
            return;
          }
          this.isIndicating = false;
          if (this.cam) {
            this.isMouseIndicating = false;
            WL.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
            WL.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
          }
          this.indicatorHidden = true;
          this.hitSpot = new Float32Array(3);
          this._hasHit = false;
          this._extraRotation = 0;
          this._currentStickAxes = new Float32Array(2);
        },
        start: function() {
          if (this.handedness == 0) {
            const inputComp = this.object.getComponent("input");
            if (!inputComp) {
              console.warn(
                "teleport component on object",
                this.object.name,
                'was configured with handedness "input component", but object has no input component.'
              );
            } else {
              this.handedness = inputComp.handedness;
              this.input = inputComp;
            }
          } else {
            this.handedness = ["left", "right"][this.handedness - 1];
          }
          WL.onXRSessionStart.push(this.setupVREvents.bind(this));
          this.teleportIndicatorMeshObject.active = false;
        },
        /* Get current camera Y rotation */
        _getCamRotation: function() {
          this.eyeLeft.getForward(this._tempVec);
          this._tempVec[1] = 0;
          import_gl_matrix5.vec3.normalize(this._tempVec, this._tempVec);
          return Math.atan2(this._tempVec[0], this._tempVec[2]);
        },
        update: function() {
          let inputLength = 0;
          if (this.gamepad && this.gamepad.axes) {
            this._currentStickAxes[0] = this.gamepad.axes[2];
            this._currentStickAxes[1] = this.gamepad.axes[3];
            inputLength = Math.abs(this._currentStickAxes[0]) + Math.abs(this._currentStickAxes[1]);
          }
          if (!this.isIndicating && this._prevThumbstickAxis[1] >= this.thumbstickActivationThreshhold && this._currentStickAxes[1] < this.thumbstickActivationThreshhold) {
            this.isIndicating = true;
          } else if (this.isIndicating && inputLength < this.thumbstickDeactivationThreshhold) {
            this.isIndicating = false;
            this.teleportIndicatorMeshObject.active = false;
            if (this._hasHit) {
              this._teleportPlayer(this.hitSpot, this._extraRotation);
            }
          }
          if (this.isIndicating && this.teleportIndicatorMeshObject && this.input) {
            const origin = this._tempVec0;
            import_gl_matrix5.quat2.getTranslation(origin, this.object.transformWorld);
            const direction = this.object.getForward(this._tempVec);
            let rayHit = this.rayHit = this.rayCastMode == 0 ? WL.scene.rayCast(origin, direction, 1 << this.floorGroup) : WL.physics.rayCast(origin, direction, 1 << this.floorGroup, this.maxDistance);
            if (rayHit.hitCount > 0) {
              this.indicatorHidden = false;
              this._extraRotation = Math.PI + Math.atan2(this._currentStickAxes[0], this._currentStickAxes[1]);
              this._currentIndicatorRotation = this._getCamRotation() + (this._extraRotation - Math.PI);
              this.teleportIndicatorMeshObject.resetTranslationRotation();
              this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
              this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
              this.teleportIndicatorMeshObject.translate([0, this.indicatorYOffset, 0]);
              this.teleportIndicatorMeshObject.active = true;
              this.hitSpot.set(rayHit.locations[0]);
              this._hasHit = true;
            } else {
              if (!this.indicatorHidden) {
                this.teleportIndicatorMeshObject.active = false;
                this.indicatorHidden = true;
              }
              this._hasHit = false;
            }
          } else if (this.teleportIndicatorMeshObject && this.isMouseIndicating) {
            this.onMousePressed();
          }
          this._prevThumbstickAxis.set(this._currentStickAxes);
        },
        setupVREvents: function(s) {
          this.session = s;
          s.addEventListener("end", function() {
            this.gamepad = null;
            this.session = null;
          }.bind(this));
          if (s.inputSources && s.inputSources.length) {
            for (let i = 0; i < s.inputSources.length; i++) {
              let inputSource = s.inputSources[i];
              if (inputSource.handedness == this.handedness) {
                this.gamepad = inputSource.gamepad;
              }
            }
          }
          s.addEventListener("inputsourceschange", function(e) {
            if (e.added && e.added.length) {
              for (let i = 0; i < e.added.length; i++) {
                let inputSource = e.added[i];
                if (inputSource.handedness == this.handedness) {
                  this.gamepad = inputSource.gamepad;
                }
              }
            }
          }.bind(this));
        },
        onMouseDown: function() {
          this.isMouseIndicating = true;
        },
        onMouseUp: function() {
          this.isMouseIndicating = false;
          this.teleportIndicatorMeshObject.active = false;
          if (this._hasHit) {
            this._teleportPlayer(this.hitSpot, 0);
          }
        },
        onMousePressed: function() {
          let origin = [0, 0, 0];
          import_gl_matrix5.quat2.getTranslation(origin, this.cam.transformWorld);
          const direction = this.cam.getForward(this._tempVec);
          let rayHit = this.rayHit = this.rayCastMode == 0 ? WL.scene.rayCast(origin, direction, 1 << this.floorGroup) : WL.physics.rayCast(origin, direction, 1 << this.floorGroup, this.maxDistance);
          if (rayHit.hitCount > 0) {
            this.indicatorHidden = false;
            direction[1] = 0;
            import_gl_matrix5.vec3.normalize(direction, direction);
            this._currentIndicatorRotation = -Math.sign(direction[2]) * Math.acos(direction[0]) - Math.PI * 0.5;
            this.teleportIndicatorMeshObject.resetTranslationRotation();
            this.teleportIndicatorMeshObject.rotateAxisAngleRad([0, 1, 0], this._currentIndicatorRotation);
            this.teleportIndicatorMeshObject.translate(rayHit.locations[0]);
            this.teleportIndicatorMeshObject.active = true;
            this.hitSpot = rayHit.locations[0];
            this._hasHit = true;
          } else {
            if (!this.indicatorHidden) {
              this.teleportIndicatorMeshObject.active = false;
              this.indicatorHidden = true;
            }
            this._hasHit = false;
          }
        },
        _teleportPlayer: function(newPosition, rotationToAdd) {
          this.camRoot.rotateAxisAngleRad([0, 1, 0], rotationToAdd);
          const p = this._tempVec;
          const p1 = this._tempVec0;
          if (this.session) {
            this.eyeLeft.getTranslationWorld(p);
            this.eyeRight.getTranslationWorld(p1);
            import_gl_matrix5.vec3.add(p, p, p1);
            import_gl_matrix5.vec3.scale(p, p, 0.5);
          } else {
            this.cam.getTranslationWorld(p);
          }
          this.camRoot.getTranslationWorld(p1);
          import_gl_matrix5.vec3.sub(p, p1, p);
          p[0] += newPosition[0];
          p[1] = newPosition[1];
          p[2] += newPosition[2];
          this.camRoot.setTranslationWorld(p);
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/two-joint-ik-solver.js
  var two_joint_ik_solver_exports = {};
  var import_gl_matrix6, twoJointIK;
  var init_two_joint_ik_solver = __esm({
    "node_modules/@wonderlandengine/components/two-joint-ik-solver.js"() {
      import_gl_matrix6 = __toESM(require_cjs());
      Math.clamp = function(v2, a, b2) {
        return Math.max(a, Math.min(v2, b2));
      };
      twoJointIK = function() {
        let ta = new Float32Array(3);
        let ca = new Float32Array(3);
        let ba = new Float32Array(3);
        let ab = new Float32Array(3);
        let cb = new Float32Array(3);
        let axis0 = new Float32Array(3);
        let axis1 = new Float32Array(3);
        let temp = new Float32Array(4);
        let r0 = new Float32Array(4);
        let r1 = new Float32Array(4);
        let r2 = new Float32Array(4);
        return function(a_lr, b_lr, a, b2, c, t, eps, a_gr, b_gr, helper) {
          import_gl_matrix6.vec3.sub(ba, b2, a);
          const lab = import_gl_matrix6.vec3.length(ba);
          import_gl_matrix6.vec3.sub(ta, b2, c);
          const lcb = import_gl_matrix6.vec3.length(ta);
          import_gl_matrix6.vec3.sub(ta, t, a);
          const lat = Math.clamp(import_gl_matrix6.vec3.length(ta), eps, lab + lcb - eps);
          import_gl_matrix6.vec3.sub(ca, c, a);
          import_gl_matrix6.vec3.sub(ab, a, b2);
          import_gl_matrix6.vec3.sub(cb, c, b2);
          import_gl_matrix6.vec3.normalize(ca, ca);
          import_gl_matrix6.vec3.normalize(ba, ba);
          import_gl_matrix6.vec3.normalize(ab, ab);
          import_gl_matrix6.vec3.normalize(cb, cb);
          import_gl_matrix6.vec3.normalize(ta, ta);
          const ac_ab_0 = Math.acos(Math.clamp(import_gl_matrix6.vec3.dot(ca, ba), -1, 1));
          const ba_bc_0 = Math.acos(Math.clamp(import_gl_matrix6.vec3.dot(ab, cb), -1, 1));
          const ac_at_0 = Math.acos(Math.clamp(import_gl_matrix6.vec3.dot(ca, ta), -1, 1));
          const ac_ab_1 = Math.acos(Math.clamp((lcb * lcb - lab * lab - lat * lat) / (-2 * lab * lat), -1, 1));
          const ba_bc_1 = Math.acos(Math.clamp((lat * lat - lab * lab - lcb * lcb) / (-2 * lab * lcb), -1, 1));
          import_gl_matrix6.vec3.sub(ca, c, a);
          import_gl_matrix6.vec3.sub(ba, b2, a);
          import_gl_matrix6.vec3.sub(ta, t, a);
          import_gl_matrix6.vec3.cross(axis0, ca, ba);
          import_gl_matrix6.vec3.cross(axis1, ca, ta);
          if (helper) {
            import_gl_matrix6.vec3.sub(ba, helper, b2);
            import_gl_matrix6.vec3.transformQuat(ba, [0, 0, -1], b_gr);
          } else {
            import_gl_matrix6.vec3.sub(ba, b2, a);
          }
          const l = import_gl_matrix6.vec3.length(axis0);
          if (l == 0) {
            axis0.set([1, 0, 0]);
          } else {
            import_gl_matrix6.vec3.scale(axis0, axis0, 1 / l);
          }
          import_gl_matrix6.vec3.normalize(axis1, axis1);
          import_gl_matrix6.quat.conjugate(a_gr, a_gr);
          import_gl_matrix6.quat.setAxisAngle(r0, import_gl_matrix6.vec3.transformQuat(temp, axis0, a_gr), ac_ab_1 - ac_ab_0);
          import_gl_matrix6.quat.setAxisAngle(r2, import_gl_matrix6.vec3.transformQuat(temp, axis1, a_gr), ac_at_0);
          import_gl_matrix6.quat.mul(a_lr, a_lr, import_gl_matrix6.quat.mul(temp, r0, r2));
          import_gl_matrix6.quat.normalize(a_lr, a_lr);
          import_gl_matrix6.quat.conjugate(b_gr, b_gr);
          import_gl_matrix6.quat.setAxisAngle(r1, import_gl_matrix6.vec3.transformQuat(temp, axis0, b_gr), ba_bc_1 - ba_bc_0);
          import_gl_matrix6.quat.mul(b_lr, b_lr, r1);
          import_gl_matrix6.quat.normalize(b_lr, b_lr);
        };
      }();
      WL.registerComponent("two-joint-ik-solver", {
        /** Root bone, never moves */
        root: { type: WL.Type.Object },
        /** Bone attached to the root */
        middle: { type: WL.Type.Object },
        /** Bone attached to the middle */
        end: { type: WL.Type.Object },
        /** Target the joins should reach for */
        target: { type: WL.Type.Object },
        /** Helper object to use to determine joint rotation axis */
        helper: { type: WL.Type.Object }
      }, {
        init: function() {
          this.pos = new Float32Array(3 * 7);
          this.p = [
            this.pos.subarray(0, 3),
            this.pos.subarray(3, 6),
            this.pos.subarray(6, 9),
            this.pos.subarray(9, 12),
            this.pos.subarray(12, 15),
            this.pos.subarray(15, 18),
            this.pos.subarray(18, 21)
          ];
        },
        update: function() {
          const p = this.p;
          this.root.getTranslationWorld(p[0]);
          this.middle.getTranslationWorld(p[1]);
          this.end.getTranslationWorld(p[2]);
          this.target.getTranslationWorld(p[3]);
          const tla = p[4];
          const tlb = p[5];
          this.root.getTranslationLocal(tla);
          this.middle.getTranslationLocal(tlb);
          if (this.helper)
            this.helper.getTranslationWorld(p[6]);
          twoJointIK(
            this.root.transformLocal,
            this.middle.transformLocal,
            p[0],
            p[1],
            p[2],
            p[3],
            0.01,
            this.root.transformWorld.subarray(0, 4),
            this.middle.transformWorld.subarray(0, 4),
            this.helper ? p[6] : null
          );
          this.root.setTranslationLocal(tla);
          this.middle.setTranslationLocal(tlb);
          this.root.setDirty();
          this.middle.setDirty();
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/video-texture.js
  var require_video_texture = __commonJS({
    "node_modules/@wonderlandengine/components/video-texture.js"() {
      WL.registerComponent("video-texture", {
        /** URL to download video from */
        url: { type: WL.Type.String, default: "" },
        /** Material to apply the video texture to */
        material: { type: WL.Type.Material },
        /** Whether to loop the video */
        loop: { type: WL.Type.Bool, default: true },
        /** Whether to automatically start playing the video */
        autoplay: { type: WL.Type.Bool, default: true },
        /** Whether to mute sound */
        muted: { type: WL.Type.Bool, default: true }
      }, {
        init: function() {
          if (!this.material) {
            console.error("video-texture: material property not set");
            return;
          }
          this.loaded = false;
          this.frameUpdateRequested = true;
        },
        start: function() {
          this.video = document.createElement("video");
          this.video.src = this.url;
          this.video.crossOrigin = "anonymous";
          this.video.loop = this.loop;
          this.video.muted = this.muted;
          this.video.addEventListener("playing", function() {
            this.loaded = true;
          }.bind(this));
          if (this.autoplay) {
            const playAfterUserGesture = () => {
              this.video.play();
              window.removeEventListener("click", playAfterUserGesture);
              window.removeEventListener("touchstart", playAfterUserGesture);
            };
            window.addEventListener("click", playAfterUserGesture);
            window.addEventListener("touchstart", playAfterUserGesture);
          }
        },
        click: function() {
        },
        applyTexture: function() {
          const mat2 = this.material;
          this.texture = new WL.Texture(this.video);
          if (mat2.shader == "Flat Opaque Textured") {
            mat2.flatTexture = this.texture;
          } else if (mat2.shader == "Phong Opaque Textured") {
            mat2.diffuseTexture = this.texture;
          } else {
            console.error("Shader", mat2.shader, "not supported by video-texture");
          }
          if ("requestVideoFrameCallback" in this.video) {
            this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
          } else {
            this.video.addEventListener("timeupdate", function() {
              this.frameUpdateRequested = true;
            }.bind(this));
          }
        },
        update: function(dt2) {
          if (this.loaded && this.frameUpdateRequested) {
            if (this.texture) {
              this.texture.update();
            } else {
              this.applyTexture();
            }
            this.frameUpdateRequested = false;
          }
        },
        updateVideo: function() {
          this.frameUpdateRequested = true;
          this.video.requestVideoFrameCallback(this.updateVideo.bind(this));
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/vr-mode-active-switch.js
  var require_vr_mode_active_switch = __commonJS({
    "node_modules/@wonderlandengine/components/vr-mode-active-switch.js"() {
      WL.registerComponent(
        "vr-mode-active-switch",
        {
          /** When components should be active: In VR or when not in VR */
          activateComponents: { type: WL.Type.Enum, values: ["in VR", "in non-VR"], default: "in VR" },
          /** Whether child object's components should be affected */
          affectChildren: { type: WL.Type.Bool, default: true }
        },
        {
          start: function() {
            this.components = [];
            this.getComponents(this.object);
            this.onXRSessionEnd();
            WL.onXRSessionStart.push(this.onXRSessionStart.bind(this));
            WL.onXRSessionEnd.push(this.onXRSessionEnd.bind(this));
          },
          getComponents: function(obj) {
            const comps = obj.getComponents().filter((c) => c.type != "vr-mode-active-switch");
            this.components = this.components.concat(comps);
            if (this.affectChildren) {
              let children = obj.children;
              for (let i = 0; i < children.length; ++i) {
                this.getComponents(children[i]);
              }
            }
          },
          setComponentsActive: function(active) {
            const comps = this.components;
            for (let i = 0; i < comps.length; ++i) {
              comps[i].active = active;
            }
          },
          onXRSessionStart: function() {
            if (!this.active)
              return;
            this.setComponentsActive(this.activateComponents == 0);
          },
          onXRSessionEnd: function() {
            if (!this.active)
              return;
            this.setComponentsActive(this.activateComponents != 0);
          }
        }
      );
    }
  });

  // node_modules/@wonderlandengine/components/vrm.js
  var vrm_exports = {};
  var import_gl_matrix7, VRM_ROLL_AXES, VRM_AIM_AXES;
  var init_vrm = __esm({
    "node_modules/@wonderlandengine/components/vrm.js"() {
      import_gl_matrix7 = __toESM(require_cjs());
      VRM_ROLL_AXES = {
        X: [1, 0, 0],
        Y: [0, 1, 0],
        Z: [0, 0, 1]
      };
      VRM_AIM_AXES = {
        PositiveX: [1, 0, 0],
        NegativeX: [-1, 0, 0],
        PositiveY: [0, 1, 0],
        NegativeY: [0, -1, 0],
        PositiveZ: [0, 0, 1],
        NegativeZ: [0, 0, -1]
      };
      WL.registerComponent("vrm", {
        /** URL to a VRM file to load */
        src: { type: WL.Type.String, default: "" },
        /** Object the VRM is looking at */
        lookAtTarget: { type: WL.Type.Object }
      }, {
        /** Meta information about the VRM model */
        meta: null,
        /** The humanoid bones of the VRM model */
        bones: {
          /* Torso */
          hips: null,
          spine: null,
          chest: null,
          upperChest: null,
          neck: null,
          /* Head */
          head: null,
          leftEye: null,
          rightEye: null,
          jaw: null,
          /* Legs */
          leftUpperLeg: null,
          leftLowerLeg: null,
          leftFoot: null,
          leftToes: null,
          rightUpperLeg: null,
          rightLowerLeg: null,
          rightFoot: null,
          rightToes: null,
          /* Arms */
          leftShoulder: null,
          leftUpperArm: null,
          leftLowerArm: null,
          leftHand: null,
          rightShoulder: null,
          rightUpperArm: null,
          rightLowerArm: null,
          rightHand: null,
          /* Fingers */
          leftThumbMetacarpal: null,
          leftThumbProximal: null,
          leftThumbDistal: null,
          leftIndexProximal: null,
          leftIndexIntermediate: null,
          leftIndexDistal: null,
          leftMiddleProximal: null,
          leftMiddleIntermediate: null,
          leftMiddleDistal: null,
          leftRingProximal: null,
          leftRingIntermediate: null,
          leftRingDistal: null,
          leftLittleProximal: null,
          leftLittleIntermediate: null,
          leftLittleDistal: null,
          rightThumbMetacarpal: null,
          rightThumbProximal: null,
          rightThumbDistal: null,
          rightIndexProximal: null,
          rightIndexIntermediate: null,
          rightIndexDistal: null,
          rightMiddleProximal: null,
          rightMiddleIntermediate: null,
          rightMiddleDistal: null,
          rightRingProximal: null,
          rightRingIntermediate: null,
          rightRingDistal: null,
          rightLittleProximal: null,
          rightLittleIntermediate: null,
          rightLittleDistal: null
        },
        /** Rotations of the bones in the rest pose (T-pose) */
        restPose: {},
        /* All node constraints, ordered to deal with dependencies */
        _nodeConstraints: [],
        /* VRMC_springBone chains */
        _springChains: [],
        /* Spherical colliders for spring bones */
        _sphereColliders: [],
        /* Capsule shaped colliders for spring bones */
        _capsuleColliders: [],
        /* Indicates which meshes are rendered in first/third person views */
        _firstPersonAnnotations: [],
        /* Contains details for (bone type) lookAt behaviour */
        _lookAt: null,
        /* Whether or not the VRM component has been initialized with `initializeVrm` */
        _initialized: false,
        init: function() {
          this._tempV3 = import_gl_matrix7.vec3.create();
          this._tempV3A = import_gl_matrix7.vec3.create();
          this._tempV3B = import_gl_matrix7.vec3.create();
          this._tempQuat = import_gl_matrix7.quat.create();
          this._tempQuatA = import_gl_matrix7.quat.create();
          this._tempQuatB = import_gl_matrix7.quat.create();
          this._tempMat4A = import_gl_matrix7.mat4.create();
          this._tempQuat2 = import_gl_matrix7.quat2.create();
          this._tailToShape = import_gl_matrix7.vec3.create();
          this._headToTail = import_gl_matrix7.vec3.create();
          this._inertia = import_gl_matrix7.vec3.create();
          this._stiffness = import_gl_matrix7.vec3.create();
          this._external = import_gl_matrix7.vec3.create();
          this._rightVector = import_gl_matrix7.vec3.set(import_gl_matrix7.vec3.create(), 1, 0, 0);
          this._upVector = import_gl_matrix7.vec3.set(import_gl_matrix7.vec3.create(), 0, 1, 0);
          this._forwardVector = import_gl_matrix7.vec3.set(import_gl_matrix7.vec3.create(), 0, 0, 1);
          this._identityQuat = import_gl_matrix7.quat.identity(import_gl_matrix7.quat.create());
          this._rad2deg = 180 / Math.PI;
        },
        start: function() {
          if (!this.src) {
            return;
          }
          WL.scene.append(this.src, { loadGltfExtensions: true }).then(({ root, extensions }) => {
            root.children.forEach((child) => child.parent = this.object);
            this._initializeVrm(extensions);
            root.destroy();
          });
        },
        /**
         * Parses the VRM glTF extensions and initializes the vrm component.
         * @param {GLTFExtensions} extensions The glTF extensions for the VRM model
         */
        _initializeVrm: function(extensions) {
          if (this._initialized) {
            throw Error("VRM component has already been initialized");
          }
          const VRMC_vrm = extensions.root["VRMC_vrm"];
          if (!VRMC_vrm) {
            throw Error("Missing VRM extensions");
          }
          if (VRMC_vrm.specVersion !== "1.0") {
            throw Error(`Unsupported VRM version, only 1.0 is supported, but encountered '${VRMC_vrm.specVersion}'`);
          }
          this.meta = VRMC_vrm.meta;
          this._parseHumanoid(VRMC_vrm.humanoid, extensions);
          if (VRMC_vrm.firstPerson) {
            this._parseFirstPerson(VRMC_vrm.firstPerson, extensions);
          }
          if (VRMC_vrm.lookAt) {
            this._parseLookAt(VRMC_vrm.lookAt);
          }
          this._findAndParseNodeConstraints(extensions);
          const springBone = extensions.root["VRMC_springBone"];
          if (springBone) {
            this._parseAndInitializeSpringBones(springBone, extensions);
          }
          this._initialized = true;
        },
        _parseHumanoid: function(humanoid, extensions) {
          for (const boneName in humanoid.humanBones) {
            if (!(boneName in this.bones)) {
              console.warn(`Unrecognized bone '${boneName}'`);
              continue;
            }
            const node = humanoid.humanBones[boneName].node;
            const objectId = extensions.idMapping[node];
            this.bones[boneName] = WL.Object._wrapObject(objectId);
            this.restPose[boneName] = import_gl_matrix7.quat.copy(import_gl_matrix7.quat.create(), this.bones[boneName].rotationLocal);
          }
        },
        _parseFirstPerson: function(firstPerson, extensions) {
          for (const meshAnnotation of firstPerson.meshAnnotations) {
            const annotation = {
              node: WL.Object._wrapObject(extensions.idMapping[meshAnnotation.node]),
              firstPerson: true,
              thirdPerson: true
            };
            switch (meshAnnotation.type) {
              case "firstPersonOnly":
                annotation.thirdPerson = false;
                break;
              case "thirdPersonOnly":
                annotation.firstPerson = false;
                break;
              case "both":
                break;
              case "auto":
                console.warn("First person mesh annotation type 'auto' is not supported, treating as 'both'!");
                break;
              default:
                console.error(`Invalid mesh annotation type '${meshAnnotation.type}'`);
                break;
            }
            this._firstPersonAnnotations.push(annotation);
          }
        },
        _parseLookAt: function(lookAt) {
          if (lookAt.type !== "bone") {
            console.warn(`Unsupported lookAt type '${lookAt.type}', only 'bone' is supported`);
            return;
          }
          const parseRangeMap = (rangeMap) => {
            return {
              inputMaxValue: rangeMap.inputMaxValue,
              outputScale: rangeMap.outputScale
            };
          };
          this._lookAt = {
            offsetFromHeadBone: lookAt.offsetFromHeadBone || [0, 0, 0],
            horizontalInner: parseRangeMap(lookAt.rangeMapHorizontalInner),
            horizontalOuter: parseRangeMap(lookAt.rangeMapHorizontalOuter),
            verticalDown: parseRangeMap(lookAt.rangeMapVerticalDown),
            verticalUp: parseRangeMap(lookAt.rangeMapVerticalUp)
          };
        },
        _findAndParseNodeConstraints: function(extensions) {
          const traverse = (object) => {
            const nodeExtensions = extensions.node[object.objectId];
            if (nodeExtensions && "VRMC_node_constraint" in nodeExtensions) {
              const nodeConstraintExtension = nodeExtensions["VRMC_node_constraint"];
              const constraint = nodeConstraintExtension.constraint;
              let type, axis;
              if ("roll" in constraint) {
                type = "roll";
                axis = VRM_ROLL_AXES[constraint.roll.rollAxis];
              } else if ("aim" in constraint) {
                type = "aim";
                axis = VRM_AIM_AXES[constraint.aim.aimAxis];
              } else if ("rotation" in constraint) {
                type = "rotation";
              }
              if (type) {
                const source = WL.Object._wrapObject(extensions.idMapping[constraint[type].source]);
                this._nodeConstraints.push({
                  type,
                  source,
                  destination: object,
                  axis,
                  weight: constraint[type].weight,
                  /* Rest pose */
                  destinationRestLocalRotation: import_gl_matrix7.quat.copy(import_gl_matrix7.quat.create(), object.rotationLocal),
                  sourceRestLocalRotation: import_gl_matrix7.quat.copy(import_gl_matrix7.quat.create(), source.rotationLocal),
                  sourceRestLocalRotationInv: import_gl_matrix7.quat.invert(import_gl_matrix7.quat.create(), source.rotationLocal)
                });
              } else {
                console.warn("Unrecognized or invalid VRMC_node_constraint, ignoring it");
              }
            }
            for (const child of object.children) {
              traverse(child);
            }
          };
          traverse(this.object);
        },
        _parseAndInitializeSpringBones: function(springBone, extensions) {
          const colliders = (springBone.colliders || []).map((collider, i) => {
            const shapeType = "capsule" in collider.shape ? "capsule" : "sphere";
            return {
              id: i,
              object: WL.Object._wrapObject(extensions.idMapping[collider.node]),
              shape: {
                isCapsule: shapeType === "capsule",
                radius: collider.shape[shapeType].radius,
                offset: collider.shape[shapeType].offset,
                tail: collider.shape[shapeType].tail
              },
              cache: {
                head: import_gl_matrix7.vec3.create(),
                tail: import_gl_matrix7.vec3.create()
              }
            };
          });
          this._sphereColliders = colliders.filter((c) => !c.shape.isCapsule);
          this._capsuleColliders = colliders.filter((c) => c.shape.isCapsule);
          const colliderGroups = (springBone.colliderGroups || []).map((group) => ({
            name: group.name,
            colliders: group.colliders.map((c) => colliders[c])
          }));
          for (const spring of springBone.springs) {
            const joints = [];
            for (const joint of spring.joints) {
              const springJoint = {
                hitRadius: 0,
                stiffness: 1,
                gravityPower: 0,
                gravityDir: [0, -1, 0],
                dragForce: 0.5,
                node: null,
                state: null
              };
              Object.assign(springJoint, joint);
              springJoint.node = WL.Object._wrapObject(extensions.idMapping[springJoint.node]);
              joints.push(springJoint);
            }
            const springChainColliders = (spring.colliderGroups || []).flatMap((cg) => colliderGroups[cg].colliders);
            this._springChains.push({
              name: spring.name,
              center: spring.center ? WL.Object._wrapObject(extensions.idMapping[spring.center]) : null,
              joints,
              sphereColliders: springChainColliders.filter((c) => !c.shape.isCapsule),
              capsuleColliders: springChainColliders.filter((c) => c.shape.isCapsule)
            });
          }
          for (const springChain of this._springChains) {
            for (let i = 0; i < springChain.joints.length - 1; ++i) {
              const springBoneJoint = springChain.joints[i];
              const childSpringBoneJoint = springChain.joints[i + 1];
              const springBonePosition = springBoneJoint.node.getTranslationWorld(import_gl_matrix7.vec3.create());
              const childSpringBonePosition = childSpringBoneJoint.node.getTranslationWorld(import_gl_matrix7.vec3.create());
              const boneDirection = import_gl_matrix7.vec3.subtract(this._tempV3A, springBonePosition, childSpringBonePosition);
              const state = {
                prevTail: childSpringBonePosition,
                currentTail: import_gl_matrix7.vec3.copy(import_gl_matrix7.vec3.create(), childSpringBonePosition),
                initialLocalRotation: import_gl_matrix7.quat.copy(import_gl_matrix7.quat.create(), springBoneJoint.node.rotationLocal),
                initialLocalTransformInvert: import_gl_matrix7.quat2.invert(import_gl_matrix7.quat2.create(), springBoneJoint.node.transformLocal),
                boneAxis: import_gl_matrix7.vec3.normalize(import_gl_matrix7.vec3.create(), childSpringBoneJoint.node.getTranslationLocal(this._tempV3)),
                /* Ensure bone length is at least 1cm to avoid jittery behaviour from zero-length bones */
                boneLength: Math.max(0.01, import_gl_matrix7.vec3.length(boneDirection)),
                /* Tail positions in center space, if needed */
                prevTailCenter: null,
                currentTailCenter: null
              };
              if (springChain.center) {
                state.prevTailCenter = springChain.center.transformPointInverseWorld(import_gl_matrix7.vec3.create(), childSpringBonePosition);
                state.currentTailCenter = import_gl_matrix7.vec3.copy(import_gl_matrix7.vec3.create(), childSpringBonePosition);
              }
              springBoneJoint.state = state;
            }
          }
        },
        update: function(dt2) {
          if (!this._initialized) {
            return;
          }
          this._resolveLookAt();
          this._resolveConstraints();
          this._updateSpringBones(dt2);
        },
        _rangeMap: function(rangeMap, input) {
          const maxValue = rangeMap.inputMaxValue;
          const outputScale = rangeMap.outputScale;
          return Math.min(input, maxValue) / maxValue * outputScale;
        },
        _resolveLookAt: function() {
          if (!this._lookAt || !this.lookAtTarget) {
            return;
          }
          const lookAtSource = this.bones.head.transformPointWorld(this._tempV3A, this._lookAt.offsetFromHeadBone);
          const lookAtTarget = this.lookAtTarget.getTranslationWorld(this._tempV3B);
          const lookAtDirection = import_gl_matrix7.vec3.sub(this._tempV3A, lookAtTarget, lookAtSource);
          import_gl_matrix7.vec3.normalize(lookAtDirection, lookAtDirection);
          this.bones.head.parent.transformVectorInverseWorld(lookAtDirection);
          const z2 = import_gl_matrix7.vec3.dot(lookAtDirection, this._forwardVector);
          const x2 = import_gl_matrix7.vec3.dot(lookAtDirection, this._rightVector);
          const yaw = Math.atan2(x2, z2) * this._rad2deg;
          const xz = Math.sqrt(x2 * x2 + z2 * z2);
          const y2 = import_gl_matrix7.vec3.dot(lookAtDirection, this._upVector);
          let pitch = Math.atan2(-y2, xz) * this._rad2deg;
          if (pitch > 0) {
            pitch = this._rangeMap(this._lookAt.verticalDown, pitch);
          } else {
            pitch = -this._rangeMap(this._lookAt.verticalUp, -pitch);
          }
          if (this.bones.leftEye) {
            let yawLeft = yaw;
            if (yawLeft > 0) {
              yawLeft = this._rangeMap(this._lookAt.horizontalInner, yawLeft);
            } else {
              yawLeft = -this._rangeMap(this._lookAt.horizontalOuter, -yawLeft);
            }
            const eyeRotation = import_gl_matrix7.quat.fromEuler(this._tempQuatA, pitch, yawLeft, 0);
            this.bones.leftEye.rotationLocal = import_gl_matrix7.quat.multiply(eyeRotation, this.restPose.leftEye, eyeRotation);
          }
          if (this.bones.rightEye) {
            let yawRight = yaw;
            if (yawRight > 0) {
              yawRight = this._rangeMap(this._lookAt.horizontalOuter, yawRight);
            } else {
              yawRight = -this._rangeMap(this._lookAt.horizontalInner, -yawRight);
            }
            const eyeRotation = import_gl_matrix7.quat.fromEuler(this._tempQuatA, pitch, yawRight, 0);
            this.bones.rightEye.rotationLocal = import_gl_matrix7.quat.multiply(eyeRotation, this.restPose.rightEye, eyeRotation);
          }
        },
        _resolveConstraints: function() {
          for (const nodeConstraint of this._nodeConstraints) {
            this._resolveConstraint(nodeConstraint);
          }
        },
        _resolveConstraint: function(nodeConstraint) {
          const dstRestQuat = nodeConstraint.destinationRestLocalRotation;
          const srcRestQuatInv = nodeConstraint.sourceRestLocalRotationInv;
          const targetQuat = import_gl_matrix7.quat.identity(this._tempQuatA);
          switch (nodeConstraint.type) {
            case "roll":
              {
                const deltaSrcQuat = import_gl_matrix7.quat.multiply(this._tempQuatA, srcRestQuatInv, nodeConstraint.source.rotationLocal);
                const deltaSrcQuatInParent = import_gl_matrix7.quat.multiply(this._tempQuatA, nodeConstraint.sourceRestLocalRotation, deltaSrcQuat);
                import_gl_matrix7.quat.mul(deltaSrcQuatInParent, deltaSrcQuatInParent, srcRestQuatInv);
                const dstRestQuatInv = import_gl_matrix7.quat.invert(this._tempQuatB, dstRestQuat);
                const deltaSrcQuatInDst = import_gl_matrix7.quat.multiply(this._tempQuatB, dstRestQuatInv, deltaSrcQuatInParent);
                import_gl_matrix7.quat.multiply(deltaSrcQuatInDst, deltaSrcQuatInDst, dstRestQuat);
                const toVec = import_gl_matrix7.vec3.transformQuat(this._tempV3A, nodeConstraint.axis, deltaSrcQuatInDst);
                const fromToQuat = import_gl_matrix7.quat.rotationTo(this._tempQuatA, nodeConstraint.axis, toVec);
                import_gl_matrix7.quat.mul(targetQuat, dstRestQuat, import_gl_matrix7.quat.invert(this._tempQuat, fromToQuat));
                import_gl_matrix7.quat.mul(targetQuat, targetQuat, deltaSrcQuatInDst);
              }
              break;
            case "aim":
              {
                const dstParentWorldQuat = nodeConstraint.destination.parent.rotationWorld;
                const fromVec = import_gl_matrix7.vec3.transformQuat(this._tempV3A, nodeConstraint.axis, dstRestQuat);
                import_gl_matrix7.vec3.transformQuat(fromVec, fromVec, dstParentWorldQuat);
                const toVec = nodeConstraint.source.getTranslationWorld(this._tempV3B);
                import_gl_matrix7.vec3.sub(toVec, toVec, nodeConstraint.destination.getTranslationWorld(this._tempV3));
                import_gl_matrix7.vec3.normalize(toVec, toVec);
                const fromToQuat = import_gl_matrix7.quat.rotationTo(this._tempQuatA, fromVec, toVec);
                import_gl_matrix7.quat.mul(targetQuat, import_gl_matrix7.quat.invert(this._tempQuat, dstParentWorldQuat), fromToQuat);
                import_gl_matrix7.quat.mul(targetQuat, targetQuat, dstParentWorldQuat);
                import_gl_matrix7.quat.mul(targetQuat, targetQuat, dstRestQuat);
              }
              break;
            case "rotation":
              {
                const srcDeltaQuat = import_gl_matrix7.quat.mul(targetQuat, srcRestQuatInv, nodeConstraint.source.rotationLocal);
                import_gl_matrix7.quat.mul(targetQuat, dstRestQuat, srcDeltaQuat);
              }
              break;
          }
          import_gl_matrix7.quat.slerp(targetQuat, dstRestQuat, targetQuat, nodeConstraint.weight);
          nodeConstraint.destination.rotationLocal = targetQuat;
        },
        _updateSpringBones: function(dt2) {
          this._sphereColliders.forEach(({ object, shape, cache }) => {
            const offset = import_gl_matrix7.vec3.copy(cache.head, shape.offset);
            object.transformVectorWorld(offset);
            import_gl_matrix7.vec3.add(cache.head, object.getTranslationWorld(this._tempV3), offset);
          });
          this._capsuleColliders.forEach(({ object, shape, cache }) => {
            const shapeCenter = object.getTranslationWorld(this._tempV3A);
            const headOffset = import_gl_matrix7.vec3.copy(cache.head, shape.offset);
            object.transformVectorWorld(headOffset);
            import_gl_matrix7.vec3.add(cache.head, shapeCenter, headOffset);
            const tailOffset = import_gl_matrix7.vec3.copy(cache.tail, shape.tail);
            object.transformVectorWorld(tailOffset);
            import_gl_matrix7.vec3.add(cache.tail, shapeCenter, tailOffset);
          });
          this._springChains.forEach((springChain) => {
            for (let i = 0; i < springChain.joints.length - 1; ++i) {
              const joint = springChain.joints[i];
              const parentWorldRotation = joint.node.parent ? joint.node.parent.rotationWorld : this._identityQuat;
              const inertia = this._inertia;
              if (springChain.center) {
                import_gl_matrix7.vec3.sub(inertia, joint.state.currentTailCenter, joint.state.prevTailCenter);
                springChain.center.transformVectorWorld(inertia);
              } else {
                import_gl_matrix7.vec3.sub(inertia, joint.state.currentTail, joint.state.prevTail);
              }
              import_gl_matrix7.vec3.scale(inertia, inertia, 1 - joint.dragForce);
              const stiffness = import_gl_matrix7.vec3.copy(this._stiffness, joint.state.boneAxis);
              import_gl_matrix7.vec3.transformQuat(stiffness, stiffness, joint.state.initialLocalRotation);
              import_gl_matrix7.vec3.transformQuat(stiffness, stiffness, parentWorldRotation);
              import_gl_matrix7.vec3.scale(stiffness, stiffness, dt2 * joint.stiffness);
              const external = import_gl_matrix7.vec3.scale(this._external, joint.gravityDir, dt2 * joint.gravityPower);
              const nextTail = import_gl_matrix7.vec3.copy(this._tempV3A, joint.state.currentTail);
              import_gl_matrix7.vec3.add(nextTail, nextTail, inertia);
              import_gl_matrix7.vec3.add(nextTail, nextTail, stiffness);
              import_gl_matrix7.vec3.add(nextTail, nextTail, external);
              const worldPosition = joint.node.getTranslationWorld(this._tempV3B);
              import_gl_matrix7.vec3.sub(nextTail, nextTail, worldPosition);
              import_gl_matrix7.vec3.normalize(nextTail, nextTail);
              import_gl_matrix7.vec3.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
              for (const { shape, cache } of springChain.sphereColliders) {
                let tailToShape = this._tailToShape;
                const sphereCenter = cache.head;
                tailToShape = import_gl_matrix7.vec3.sub(tailToShape, nextTail, sphereCenter);
                const radius = shape.radius + joint.hitRadius;
                const dist = import_gl_matrix7.vec3.length(tailToShape) - radius;
                if (dist < 0) {
                  import_gl_matrix7.vec3.normalize(tailToShape, tailToShape);
                  import_gl_matrix7.vec3.scaleAndAdd(nextTail, nextTail, tailToShape, -dist);
                  import_gl_matrix7.vec3.sub(nextTail, nextTail, worldPosition);
                  import_gl_matrix7.vec3.normalize(nextTail, nextTail);
                  import_gl_matrix7.vec3.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
                }
              }
              for (const { shape, cache } of springChain.capsuleColliders) {
                let tailToShape = this._tailToShape;
                const head = cache.head;
                const tail = cache.tail;
                tailToShape = import_gl_matrix7.vec3.sub(tailToShape, nextTail, head);
                const headToTail = import_gl_matrix7.vec3.sub(this._headToTail, tail, head);
                const dot = import_gl_matrix7.vec3.dot(headToTail, tailToShape);
                if (import_gl_matrix7.vec3.squaredLength(headToTail) <= dot) {
                  import_gl_matrix7.vec3.sub(tailToShape, nextTail, tail);
                } else if (dot > 0) {
                  import_gl_matrix7.vec3.scale(headToTail, headToTail, dot / import_gl_matrix7.vec3.squaredLength(headToTail));
                  import_gl_matrix7.vec3.sub(tailToShape, tailToShape, headToTail);
                }
                const radius = shape.radius + joint.hitRadius;
                const dist = import_gl_matrix7.vec3.length(tailToShape) - radius;
                if (dist < 0) {
                  import_gl_matrix7.vec3.normalize(tailToShape, tailToShape);
                  import_gl_matrix7.vec3.scaleAndAdd(nextTail, nextTail, tailToShape, -dist);
                  import_gl_matrix7.vec3.sub(nextTail, nextTail, worldPosition);
                  import_gl_matrix7.vec3.normalize(nextTail, nextTail);
                  import_gl_matrix7.vec3.scaleAndAdd(nextTail, worldPosition, nextTail, joint.state.boneLength);
                }
              }
              import_gl_matrix7.vec3.copy(joint.state.prevTail, joint.state.currentTail);
              import_gl_matrix7.vec3.copy(joint.state.currentTail, nextTail);
              if (springChain.center) {
                import_gl_matrix7.vec3.copy(joint.state.prevTailCenter, joint.state.currentTailCenter);
                import_gl_matrix7.vec3.copy(joint.state.currentTailCenter, nextTail);
                springChain.center.transformPointInverseWorld(joint.state.currentTailCenter);
              }
              joint.node.parent.transformPointInverseWorld(nextTail);
              const nextTailDualQuat = import_gl_matrix7.quat2.fromTranslation(this._tempQuat2, nextTail);
              import_gl_matrix7.quat2.multiply(nextTailDualQuat, joint.state.initialLocalTransformInvert, nextTailDualQuat);
              import_gl_matrix7.quat2.getTranslation(nextTail, nextTailDualQuat);
              import_gl_matrix7.vec3.normalize(nextTail, nextTail);
              const jointRotation = import_gl_matrix7.quat.rotationTo(this._tempQuatA, joint.state.boneAxis, nextTail);
              joint.node.rotationLocal = import_gl_matrix7.quat.mul(this._tempQuatA, joint.state.initialLocalRotation, jointRotation);
            }
          });
        },
        /**
         * @param {boolean} firstPerson Whether the model should render for first person or third person views
         */
        set firstPerson(firstPerson) {
          this._firstPersonAnnotations.forEach((annotation) => {
            const visible = firstPerson == annotation.firstPerson || firstPerson != annotation.thirdPerson;
            annotation.node.getComponents("mesh").forEach((mesh) => {
              mesh.active = visible;
            });
          });
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/wasd-controls.js
  var wasd_controls_exports = {};
  var import_gl_matrix8;
  var init_wasd_controls = __esm({
    "node_modules/@wonderlandengine/components/wasd-controls.js"() {
      import_gl_matrix8 = __toESM(require_cjs());
      WL.registerComponent("wasd-controls", {
        /** Movement speed in m/s. */
        speed: { type: WL.Type.Float, default: 0.1 },
        /** Object of which the orientation is used to determine forward direction */
        headObject: { type: WL.Type.Object }
      }, {
        init: function() {
          this.up = false;
          this.right = false;
          this.down = false;
          this.left = false;
          window.addEventListener("keydown", this.press.bind(this));
          window.addEventListener("keyup", this.release.bind(this));
        },
        start: function() {
          this.headObject = this.headObject || this.object;
        },
        update: function() {
          let direction = [0, 0, 0];
          if (this.up)
            direction[2] -= 1;
          if (this.down)
            direction[2] += 1;
          if (this.left)
            direction[0] -= 1;
          if (this.right)
            direction[0] += 1;
          import_gl_matrix8.vec3.normalize(direction, direction);
          direction[0] *= this.speed;
          direction[2] *= this.speed;
          import_gl_matrix8.vec3.transformQuat(direction, direction, this.headObject.transformWorld);
          this.object.translate(direction);
        },
        press: function(e) {
          if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
            this.up = true;
          } else if (e.keyCode === 39 || e.keyCode === 68) {
            this.right = true;
          } else if (e.keyCode === 40 || e.keyCode === 83) {
            this.down = true;
          } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
            this.left = true;
          }
        },
        release: function(e) {
          if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
            this.up = false;
          } else if (e.keyCode === 39 || e.keyCode === 68) {
            this.right = false;
          } else if (e.keyCode === 40 || e.keyCode === 83) {
            this.down = false;
          } else if (e.keyCode === 37 || e.keyCode === 65 || e.keyCode === 81) {
            this.left = false;
          }
        }
      });
    }
  });

  // node_modules/@wonderlandengine/components/index.js
  var require_components = __commonJS({
    "node_modules/@wonderlandengine/components/index.js"() {
      window.glMatrix = require_cjs();
      require_thwall_camera2();
      require_cursor_target();
      init_cursor();
      require_debug_object();
      require_device_orientation_look();
      require_finger_cursor();
      require_fixed_foveation();
      init_hand_tracking();
      init_hit_test_location();
      init_howler_audio_listener();
      init_howler_audio_source();
      require_image_texture();
      init_mouse_look();
      require_target_framerate();
      init_teleport();
      init_two_joint_ik_solver();
      require_video_texture();
      require_vr_mode_active_switch();
      init_vrm();
      init_wasd_controls();
    }
  });

  // node_modules/@firebase/util/dist/index.esm2017.js
  function isIndexedDBAvailable() {
    try {
      return typeof indexedDB === "object";
    } catch (e) {
      return false;
    }
  }
  function validateIndexedDBOpenable() {
    return new Promise((resolve, reject) => {
      try {
        let preExist = true;
        const DB_CHECK_NAME = "validate-browser-context-for-indexeddb-analytics-module";
        const request = self.indexedDB.open(DB_CHECK_NAME);
        request.onsuccess = () => {
          request.result.close();
          if (!preExist) {
            self.indexedDB.deleteDatabase(DB_CHECK_NAME);
          }
          resolve(true);
        };
        request.onupgradeneeded = () => {
          preExist = false;
        };
        request.onerror = () => {
          var _a;
          reject(((_a = request.error) === null || _a === void 0 ? void 0 : _a.message) || "");
        };
      } catch (error) {
        reject(error);
      }
    });
  }
  function getGlobal() {
    if (typeof self !== "undefined") {
      return self;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  function createMockUserToken(token, projectId) {
    if (token.uid) {
      throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');
    }
    const header = {
      alg: "none",
      type: "JWT"
    };
    const project = projectId || "demo-project";
    const iat = token.iat || 0;
    const sub = token.sub || token.user_id;
    if (!sub) {
      throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");
    }
    const payload = Object.assign({
      // Set all required fields to decent defaults
      iss: `https://securetoken.google.com/${project}`,
      aud: project,
      iat,
      exp: iat + 3600,
      auth_time: iat,
      sub,
      user_id: sub,
      firebase: {
        sign_in_provider: "custom",
        identities: {}
      }
    }, token);
    const signature = "";
    return [
      base64urlEncodeWithoutPadding(JSON.stringify(header)),
      base64urlEncodeWithoutPadding(JSON.stringify(payload)),
      signature
    ].join(".");
  }
  function replaceTemplate(template, data) {
    return template.replace(PATTERN, (_2, key) => {
      const value = data[key];
      return value != null ? String(value) : `<${key}?>`;
    });
  }
  function deepEqual(a, b2) {
    if (a === b2) {
      return true;
    }
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b2);
    for (const k2 of aKeys) {
      if (!bKeys.includes(k2)) {
        return false;
      }
      const aProp = a[k2];
      const bProp = b2[k2];
      if (isObject(aProp) && isObject(bProp)) {
        if (!deepEqual(aProp, bProp)) {
          return false;
        }
      } else if (aProp !== bProp) {
        return false;
      }
    }
    for (const k2 of bKeys) {
      if (!aKeys.includes(k2)) {
        return false;
      }
    }
    return true;
  }
  function isObject(thing) {
    return thing !== null && typeof thing === "object";
  }
  function getModularInstance(service) {
    if (service && service._delegate) {
      return service._delegate;
    } else {
      return service;
    }
  }
  var stringToByteArray$1, byteArrayToString, base64, base64Encode, base64urlEncodeWithoutPadding, base64Decode, getDefaultsFromGlobal, getDefaultsFromEnvVariable, getDefaultsFromCookie, getDefaults, getDefaultEmulatorHost, getDefaultEmulatorHostnameAndPort, getDefaultAppConfig, Deferred, ERROR_NAME, FirebaseError, ErrorFactory, PATTERN, MAX_VALUE_MILLIS;
  var init_index_esm2017 = __esm({
    "node_modules/@firebase/util/dist/index.esm2017.js"() {
      stringToByteArray$1 = function(str) {
        const out = [];
        let p = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if (c < 128) {
            out[p++] = c;
          } else if (c < 2048) {
            out[p++] = c >> 6 | 192;
            out[p++] = c & 63 | 128;
          } else if ((c & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
            c = 65536 + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
            out[p++] = c >> 18 | 240;
            out[p++] = c >> 12 & 63 | 128;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          } else {
            out[p++] = c >> 12 | 224;
            out[p++] = c >> 6 & 63 | 128;
            out[p++] = c & 63 | 128;
          }
        }
        return out;
      };
      byteArrayToString = function(bytes) {
        const out = [];
        let pos = 0, c = 0;
        while (pos < bytes.length) {
          const c1 = bytes[pos++];
          if (c1 < 128) {
            out[c++] = String.fromCharCode(c1);
          } else if (c1 > 191 && c1 < 224) {
            const c2 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
          } else if (c1 > 239 && c1 < 365) {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            const c4 = bytes[pos++];
            const u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 65536;
            out[c++] = String.fromCharCode(55296 + (u >> 10));
            out[c++] = String.fromCharCode(56320 + (u & 1023));
          } else {
            const c2 = bytes[pos++];
            const c3 = bytes[pos++];
            out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
          }
        }
        return out.join("");
      };
      base64 = {
        /**
         * Maps bytes to characters.
         */
        byteToCharMap_: null,
        /**
         * Maps characters to bytes.
         */
        charToByteMap_: null,
        /**
         * Maps bytes to websafe characters.
         * @private
         */
        byteToCharMapWebSafe_: null,
        /**
         * Maps websafe characters to bytes.
         * @private
         */
        charToByteMapWebSafe_: null,
        /**
         * Our default alphabet, shared between
         * ENCODED_VALS and ENCODED_VALS_WEBSAFE
         */
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        /**
         * Our default alphabet. Value 64 (=) is special; it means "nothing."
         */
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/=";
        },
        /**
         * Our websafe alphabet.
         */
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_.";
        },
        /**
         * Whether this browser supports the atob and btoa functions. This extension
         * started at Mozilla but is now implemented by many browsers. We use the
         * ASSUME_* variables to avoid pulling in the full useragent detection library
         * but still allowing the standard per-browser compilations.
         *
         */
        HAS_NATIVE_SUPPORT: typeof atob === "function",
        /**
         * Base64-encode an array of bytes.
         *
         * @param input An array of bytes (numbers with
         *     value in [0, 255]) to encode.
         * @param webSafe Boolean indicating we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeByteArray(input, webSafe) {
          if (!Array.isArray(input)) {
            throw Error("encodeByteArray takes an array as a parameter");
          }
          this.init_();
          const byteToCharMap = webSafe ? this.byteToCharMapWebSafe_ : this.byteToCharMap_;
          const output = [];
          for (let i = 0; i < input.length; i += 3) {
            const byte1 = input[i];
            const haveByte2 = i + 1 < input.length;
            const byte2 = haveByte2 ? input[i + 1] : 0;
            const haveByte3 = i + 2 < input.length;
            const byte3 = haveByte3 ? input[i + 2] : 0;
            const outByte1 = byte1 >> 2;
            const outByte2 = (byte1 & 3) << 4 | byte2 >> 4;
            let outByte3 = (byte2 & 15) << 2 | byte3 >> 6;
            let outByte4 = byte3 & 63;
            if (!haveByte3) {
              outByte4 = 64;
              if (!haveByte2) {
                outByte3 = 64;
              }
            }
            output.push(byteToCharMap[outByte1], byteToCharMap[outByte2], byteToCharMap[outByte3], byteToCharMap[outByte4]);
          }
          return output.join("");
        },
        /**
         * Base64-encode a string.
         *
         * @param input A string to encode.
         * @param webSafe If true, we should use the
         *     alternative alphabet.
         * @return The base64 encoded string.
         */
        encodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return btoa(input);
          }
          return this.encodeByteArray(stringToByteArray$1(input), webSafe);
        },
        /**
         * Base64-decode a string.
         *
         * @param input to decode.
         * @param webSafe True if we should use the
         *     alternative alphabet.
         * @return string representing the decoded value.
         */
        decodeString(input, webSafe) {
          if (this.HAS_NATIVE_SUPPORT && !webSafe) {
            return atob(input);
          }
          return byteArrayToString(this.decodeStringToByteArray(input, webSafe));
        },
        /**
         * Base64-decode a string.
         *
         * In base-64 decoding, groups of four characters are converted into three
         * bytes.  If the encoder did not apply padding, the input length may not
         * be a multiple of 4.
         *
         * In this case, the last group will have fewer than 4 characters, and
         * padding will be inferred.  If the group has one or two characters, it decodes
         * to one byte.  If the group has three characters, it decodes to two bytes.
         *
         * @param input Input to decode.
         * @param webSafe True if we should use the web-safe alphabet.
         * @return bytes representing the decoded value.
         */
        decodeStringToByteArray(input, webSafe) {
          this.init_();
          const charToByteMap = webSafe ? this.charToByteMapWebSafe_ : this.charToByteMap_;
          const output = [];
          for (let i = 0; i < input.length; ) {
            const byte1 = charToByteMap[input.charAt(i++)];
            const haveByte2 = i < input.length;
            const byte2 = haveByte2 ? charToByteMap[input.charAt(i)] : 0;
            ++i;
            const haveByte3 = i < input.length;
            const byte3 = haveByte3 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            const haveByte4 = i < input.length;
            const byte4 = haveByte4 ? charToByteMap[input.charAt(i)] : 64;
            ++i;
            if (byte1 == null || byte2 == null || byte3 == null || byte4 == null) {
              throw Error();
            }
            const outByte1 = byte1 << 2 | byte2 >> 4;
            output.push(outByte1);
            if (byte3 !== 64) {
              const outByte2 = byte2 << 4 & 240 | byte3 >> 2;
              output.push(outByte2);
              if (byte4 !== 64) {
                const outByte3 = byte3 << 6 & 192 | byte4;
                output.push(outByte3);
              }
            }
          }
          return output;
        },
        /**
         * Lazy static initialization function. Called before
         * accessing any of the static map variables.
         * @private
         */
        init_() {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {};
            this.charToByteMap_ = {};
            this.byteToCharMapWebSafe_ = {};
            this.charToByteMapWebSafe_ = {};
            for (let i = 0; i < this.ENCODED_VALS.length; i++) {
              this.byteToCharMap_[i] = this.ENCODED_VALS.charAt(i);
              this.charToByteMap_[this.byteToCharMap_[i]] = i;
              this.byteToCharMapWebSafe_[i] = this.ENCODED_VALS_WEBSAFE.charAt(i);
              this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[i]] = i;
              if (i >= this.ENCODED_VALS_BASE.length) {
                this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(i)] = i;
                this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(i)] = i;
              }
            }
          }
        }
      };
      base64Encode = function(str) {
        const utf8Bytes = stringToByteArray$1(str);
        return base64.encodeByteArray(utf8Bytes, true);
      };
      base64urlEncodeWithoutPadding = function(str) {
        return base64Encode(str).replace(/\./g, "");
      };
      base64Decode = function(str) {
        try {
          return base64.decodeString(str, true);
        } catch (e) {
          console.error("base64Decode failed: ", e);
        }
        return null;
      };
      getDefaultsFromGlobal = () => getGlobal().__FIREBASE_DEFAULTS__;
      getDefaultsFromEnvVariable = () => {
        if (typeof process === "undefined" || typeof process.env === "undefined") {
          return;
        }
        const defaultsJsonString = process.env.__FIREBASE_DEFAULTS__;
        if (defaultsJsonString) {
          return JSON.parse(defaultsJsonString);
        }
      };
      getDefaultsFromCookie = () => {
        if (typeof document === "undefined") {
          return;
        }
        let match;
        try {
          match = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
        } catch (e) {
          return;
        }
        const decoded = match && base64Decode(match[1]);
        return decoded && JSON.parse(decoded);
      };
      getDefaults = () => {
        try {
          return getDefaultsFromGlobal() || getDefaultsFromEnvVariable() || getDefaultsFromCookie();
        } catch (e) {
          console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);
          return;
        }
      };
      getDefaultEmulatorHost = (productName) => {
        var _a, _b;
        return (_b = (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.emulatorHosts) === null || _b === void 0 ? void 0 : _b[productName];
      };
      getDefaultEmulatorHostnameAndPort = (productName) => {
        const host = getDefaultEmulatorHost(productName);
        if (!host) {
          return void 0;
        }
        const separatorIndex = host.lastIndexOf(":");
        if (separatorIndex <= 0 || separatorIndex + 1 === host.length) {
          throw new Error(`Invalid host ${host} with no separate hostname and port!`);
        }
        const port = parseInt(host.substring(separatorIndex + 1), 10);
        if (host[0] === "[") {
          return [host.substring(1, separatorIndex - 1), port];
        } else {
          return [host.substring(0, separatorIndex), port];
        }
      };
      getDefaultAppConfig = () => {
        var _a;
        return (_a = getDefaults()) === null || _a === void 0 ? void 0 : _a.config;
      };
      Deferred = class {
        constructor() {
          this.reject = () => {
          };
          this.resolve = () => {
          };
          this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
          });
        }
        /**
         * Our API internals are not promiseified and cannot because our callback APIs have subtle expectations around
         * invoking promises inline, which Promises are forbidden to do. This method accepts an optional node-style callback
         * and returns a node-style callback which will resolve or reject the Deferred's promise.
         */
        wrapCallback(callback) {
          return (error, value) => {
            if (error) {
              this.reject(error);
            } else {
              this.resolve(value);
            }
            if (typeof callback === "function") {
              this.promise.catch(() => {
              });
              if (callback.length === 1) {
                callback(error);
              } else {
                callback(error, value);
              }
            }
          };
        }
      };
      ERROR_NAME = "FirebaseError";
      FirebaseError = class extends Error {
        constructor(code, message, customData) {
          super(message);
          this.code = code;
          this.customData = customData;
          this.name = ERROR_NAME;
          Object.setPrototypeOf(this, FirebaseError.prototype);
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ErrorFactory.prototype.create);
          }
        }
      };
      ErrorFactory = class {
        constructor(service, serviceName, errors) {
          this.service = service;
          this.serviceName = serviceName;
          this.errors = errors;
        }
        create(code, ...data) {
          const customData = data[0] || {};
          const fullCode = `${this.service}/${code}`;
          const template = this.errors[code];
          const message = template ? replaceTemplate(template, customData) : "Error";
          const fullMessage = `${this.serviceName}: ${message} (${fullCode}).`;
          const error = new FirebaseError(fullCode, fullMessage, customData);
          return error;
        }
      };
      PATTERN = /\{\$([^}]+)}/g;
      MAX_VALUE_MILLIS = 4 * 60 * 60 * 1e3;
    }
  });

  // node_modules/@firebase/component/dist/esm/index.esm2017.js
  function normalizeIdentifierForFactory(identifier) {
    return identifier === DEFAULT_ENTRY_NAME ? void 0 : identifier;
  }
  function isComponentEager(component) {
    return component.instantiationMode === "EAGER";
  }
  var Component, DEFAULT_ENTRY_NAME, Provider, ComponentContainer;
  var init_index_esm20172 = __esm({
    "node_modules/@firebase/component/dist/esm/index.esm2017.js"() {
      init_index_esm2017();
      Component = class {
        /**
         *
         * @param name The public service name, e.g. app, auth, firestore, database
         * @param instanceFactory Service factory responsible for creating the public interface
         * @param type whether the service provided by the component is public or private
         */
        constructor(name3, instanceFactory, type) {
          this.name = name3;
          this.instanceFactory = instanceFactory;
          this.type = type;
          this.multipleInstances = false;
          this.serviceProps = {};
          this.instantiationMode = "LAZY";
          this.onInstanceCreated = null;
        }
        setInstantiationMode(mode) {
          this.instantiationMode = mode;
          return this;
        }
        setMultipleInstances(multipleInstances) {
          this.multipleInstances = multipleInstances;
          return this;
        }
        setServiceProps(props) {
          this.serviceProps = props;
          return this;
        }
        setInstanceCreatedCallback(callback) {
          this.onInstanceCreated = callback;
          return this;
        }
      };
      DEFAULT_ENTRY_NAME = "[DEFAULT]";
      Provider = class {
        constructor(name3, container) {
          this.name = name3;
          this.container = container;
          this.component = null;
          this.instances = /* @__PURE__ */ new Map();
          this.instancesDeferred = /* @__PURE__ */ new Map();
          this.instancesOptions = /* @__PURE__ */ new Map();
          this.onInitCallbacks = /* @__PURE__ */ new Map();
        }
        /**
         * @param identifier A provider can provide mulitple instances of a service
         * if this.component.multipleInstances is true.
         */
        get(identifier) {
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          if (!this.instancesDeferred.has(normalizedIdentifier)) {
            const deferred = new Deferred();
            this.instancesDeferred.set(normalizedIdentifier, deferred);
            if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
              try {
                const instance = this.getOrInitializeService({
                  instanceIdentifier: normalizedIdentifier
                });
                if (instance) {
                  deferred.resolve(instance);
                }
              } catch (e) {
              }
            }
          }
          return this.instancesDeferred.get(normalizedIdentifier).promise;
        }
        getImmediate(options) {
          var _a;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(options === null || options === void 0 ? void 0 : options.identifier);
          const optional = (_a = options === null || options === void 0 ? void 0 : options.optional) !== null && _a !== void 0 ? _a : false;
          if (this.isInitialized(normalizedIdentifier) || this.shouldAutoInitialize()) {
            try {
              return this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
            } catch (e) {
              if (optional) {
                return null;
              } else {
                throw e;
              }
            }
          } else {
            if (optional) {
              return null;
            } else {
              throw Error(`Service ${this.name} is not available`);
            }
          }
        }
        getComponent() {
          return this.component;
        }
        setComponent(component) {
          if (component.name !== this.name) {
            throw Error(`Mismatching Component ${component.name} for Provider ${this.name}.`);
          }
          if (this.component) {
            throw Error(`Component for ${this.name} has already been provided`);
          }
          this.component = component;
          if (!this.shouldAutoInitialize()) {
            return;
          }
          if (isComponentEager(component)) {
            try {
              this.getOrInitializeService({ instanceIdentifier: DEFAULT_ENTRY_NAME });
            } catch (e) {
            }
          }
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            try {
              const instance = this.getOrInitializeService({
                instanceIdentifier: normalizedIdentifier
              });
              instanceDeferred.resolve(instance);
            } catch (e) {
            }
          }
        }
        clearInstance(identifier = DEFAULT_ENTRY_NAME) {
          this.instancesDeferred.delete(identifier);
          this.instancesOptions.delete(identifier);
          this.instances.delete(identifier);
        }
        // app.delete() will call this method on every provider to delete the services
        // TODO: should we mark the provider as deleted?
        async delete() {
          const services = Array.from(this.instances.values());
          await Promise.all([
            ...services.filter((service) => "INTERNAL" in service).map((service) => service.INTERNAL.delete()),
            ...services.filter((service) => "_delete" in service).map((service) => service._delete())
          ]);
        }
        isComponentSet() {
          return this.component != null;
        }
        isInitialized(identifier = DEFAULT_ENTRY_NAME) {
          return this.instances.has(identifier);
        }
        getOptions(identifier = DEFAULT_ENTRY_NAME) {
          return this.instancesOptions.get(identifier) || {};
        }
        initialize(opts = {}) {
          const { options = {} } = opts;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(opts.instanceIdentifier);
          if (this.isInitialized(normalizedIdentifier)) {
            throw Error(`${this.name}(${normalizedIdentifier}) has already been initialized`);
          }
          if (!this.isComponentSet()) {
            throw Error(`Component ${this.name} has not been registered yet`);
          }
          const instance = this.getOrInitializeService({
            instanceIdentifier: normalizedIdentifier,
            options
          });
          for (const [instanceIdentifier, instanceDeferred] of this.instancesDeferred.entries()) {
            const normalizedDeferredIdentifier = this.normalizeInstanceIdentifier(instanceIdentifier);
            if (normalizedIdentifier === normalizedDeferredIdentifier) {
              instanceDeferred.resolve(instance);
            }
          }
          return instance;
        }
        /**
         *
         * @param callback - a function that will be invoked  after the provider has been initialized by calling provider.initialize().
         * The function is invoked SYNCHRONOUSLY, so it should not execute any longrunning tasks in order to not block the program.
         *
         * @param identifier An optional instance identifier
         * @returns a function to unregister the callback
         */
        onInit(callback, identifier) {
          var _a;
          const normalizedIdentifier = this.normalizeInstanceIdentifier(identifier);
          const existingCallbacks = (_a = this.onInitCallbacks.get(normalizedIdentifier)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set();
          existingCallbacks.add(callback);
          this.onInitCallbacks.set(normalizedIdentifier, existingCallbacks);
          const existingInstance = this.instances.get(normalizedIdentifier);
          if (existingInstance) {
            callback(existingInstance, normalizedIdentifier);
          }
          return () => {
            existingCallbacks.delete(callback);
          };
        }
        /**
         * Invoke onInit callbacks synchronously
         * @param instance the service instance`
         */
        invokeOnInitCallbacks(instance, identifier) {
          const callbacks = this.onInitCallbacks.get(identifier);
          if (!callbacks) {
            return;
          }
          for (const callback of callbacks) {
            try {
              callback(instance, identifier);
            } catch (_a) {
            }
          }
        }
        getOrInitializeService({ instanceIdentifier, options = {} }) {
          let instance = this.instances.get(instanceIdentifier);
          if (!instance && this.component) {
            instance = this.component.instanceFactory(this.container, {
              instanceIdentifier: normalizeIdentifierForFactory(instanceIdentifier),
              options
            });
            this.instances.set(instanceIdentifier, instance);
            this.instancesOptions.set(instanceIdentifier, options);
            this.invokeOnInitCallbacks(instance, instanceIdentifier);
            if (this.component.onInstanceCreated) {
              try {
                this.component.onInstanceCreated(this.container, instanceIdentifier, instance);
              } catch (_a) {
              }
            }
          }
          return instance || null;
        }
        normalizeInstanceIdentifier(identifier = DEFAULT_ENTRY_NAME) {
          if (this.component) {
            return this.component.multipleInstances ? identifier : DEFAULT_ENTRY_NAME;
          } else {
            return identifier;
          }
        }
        shouldAutoInitialize() {
          return !!this.component && this.component.instantiationMode !== "EXPLICIT";
        }
      };
      ComponentContainer = class {
        constructor(name3) {
          this.name = name3;
          this.providers = /* @__PURE__ */ new Map();
        }
        /**
         *
         * @param component Component being added
         * @param overwrite When a component with the same name has already been registered,
         * if overwrite is true: overwrite the existing component with the new component and create a new
         * provider with the new component. It can be useful in tests where you want to use different mocks
         * for different tests.
         * if overwrite is false: throw an exception
         */
        addComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            throw new Error(`Component ${component.name} has already been registered with ${this.name}`);
          }
          provider.setComponent(component);
        }
        addOrOverwriteComponent(component) {
          const provider = this.getProvider(component.name);
          if (provider.isComponentSet()) {
            this.providers.delete(component.name);
          }
          this.addComponent(component);
        }
        /**
         * getProvider provides a type safe interface where it can only be called with a field name
         * present in NameServiceMapping interface.
         *
         * Firebase SDKs providing services should extend NameServiceMapping interface to register
         * themselves.
         */
        getProvider(name3) {
          if (this.providers.has(name3)) {
            return this.providers.get(name3);
          }
          const provider = new Provider(name3, this);
          this.providers.set(name3, provider);
          return provider;
        }
        getProviders() {
          return Array.from(this.providers.values());
        }
      };
    }
  });

  // node_modules/@firebase/logger/dist/esm/index.esm2017.js
  var instances, LogLevel, levelStringToEnum, defaultLogLevel, ConsoleMethod, defaultLogHandler, Logger;
  var init_index_esm20173 = __esm({
    "node_modules/@firebase/logger/dist/esm/index.esm2017.js"() {
      instances = [];
      (function(LogLevel2) {
        LogLevel2[LogLevel2["DEBUG"] = 0] = "DEBUG";
        LogLevel2[LogLevel2["VERBOSE"] = 1] = "VERBOSE";
        LogLevel2[LogLevel2["INFO"] = 2] = "INFO";
        LogLevel2[LogLevel2["WARN"] = 3] = "WARN";
        LogLevel2[LogLevel2["ERROR"] = 4] = "ERROR";
        LogLevel2[LogLevel2["SILENT"] = 5] = "SILENT";
      })(LogLevel || (LogLevel = {}));
      levelStringToEnum = {
        "debug": LogLevel.DEBUG,
        "verbose": LogLevel.VERBOSE,
        "info": LogLevel.INFO,
        "warn": LogLevel.WARN,
        "error": LogLevel.ERROR,
        "silent": LogLevel.SILENT
      };
      defaultLogLevel = LogLevel.INFO;
      ConsoleMethod = {
        [LogLevel.DEBUG]: "log",
        [LogLevel.VERBOSE]: "log",
        [LogLevel.INFO]: "info",
        [LogLevel.WARN]: "warn",
        [LogLevel.ERROR]: "error"
      };
      defaultLogHandler = (instance, logType, ...args) => {
        if (logType < instance.logLevel) {
          return;
        }
        const now = new Date().toISOString();
        const method = ConsoleMethod[logType];
        if (method) {
          console[method](`[${now}]  ${instance.name}:`, ...args);
        } else {
          throw new Error(`Attempted to log a message with an invalid logType (value: ${logType})`);
        }
      };
      Logger = class {
        /**
         * Gives you an instance of a Logger to capture messages according to
         * Firebase's logging scheme.
         *
         * @param name The name that the logs will be associated with
         */
        constructor(name3) {
          this.name = name3;
          this._logLevel = defaultLogLevel;
          this._logHandler = defaultLogHandler;
          this._userLogHandler = null;
          instances.push(this);
        }
        get logLevel() {
          return this._logLevel;
        }
        set logLevel(val) {
          if (!(val in LogLevel)) {
            throw new TypeError(`Invalid value "${val}" assigned to \`logLevel\``);
          }
          this._logLevel = val;
        }
        // Workaround for setter/getter having to be the same type.
        setLogLevel(val) {
          this._logLevel = typeof val === "string" ? levelStringToEnum[val] : val;
        }
        get logHandler() {
          return this._logHandler;
        }
        set logHandler(val) {
          if (typeof val !== "function") {
            throw new TypeError("Value assigned to `logHandler` must be a function");
          }
          this._logHandler = val;
        }
        get userLogHandler() {
          return this._userLogHandler;
        }
        set userLogHandler(val) {
          this._userLogHandler = val;
        }
        /**
         * The functions below are all based on the `console` interface
         */
        debug(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.DEBUG, ...args);
          this._logHandler(this, LogLevel.DEBUG, ...args);
        }
        log(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.VERBOSE, ...args);
          this._logHandler(this, LogLevel.VERBOSE, ...args);
        }
        info(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.INFO, ...args);
          this._logHandler(this, LogLevel.INFO, ...args);
        }
        warn(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.WARN, ...args);
          this._logHandler(this, LogLevel.WARN, ...args);
        }
        error(...args) {
          this._userLogHandler && this._userLogHandler(this, LogLevel.ERROR, ...args);
          this._logHandler(this, LogLevel.ERROR, ...args);
        }
      };
    }
  });

  // node_modules/idb/build/wrap-idb-value.js
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var instanceOfAny, idbProxyableTypes, cursorAdvanceMethods, cursorRequestMap, transactionDoneMap, transactionStoreNamesMap, transformCache, reverseTransformCache, idbProxyTraps, unwrap;
  var init_wrap_idb_value = __esm({
    "node_modules/idb/build/wrap-idb-value.js"() {
      instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
      cursorRequestMap = /* @__PURE__ */ new WeakMap();
      transactionDoneMap = /* @__PURE__ */ new WeakMap();
      transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
      transformCache = /* @__PURE__ */ new WeakMap();
      reverseTransformCache = /* @__PURE__ */ new WeakMap();
      idbProxyTraps = {
        get(target, prop, receiver) {
          if (target instanceof IDBTransaction) {
            if (prop === "done")
              return transactionDoneMap.get(target);
            if (prop === "objectStoreNames") {
              return target.objectStoreNames || transactionStoreNamesMap.get(target);
            }
            if (prop === "store") {
              return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
            }
          }
          return wrap(target[prop]);
        },
        set(target, prop, value) {
          target[prop] = value;
          return true;
        },
        has(target, prop) {
          if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
            return true;
          }
          return prop in target;
        }
      };
      unwrap = (value) => reverseTransformCache.get(value);
    }
  });

  // node_modules/idb/build/index.js
  function openDB(name3, version3, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name3, version3);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
      });
    }
    if (blocked)
      request.addEventListener("blocked", () => blocked());
    openPromise.then((db2) => {
      if (terminated)
        db2.addEventListener("close", () => terminated());
      if (blocking)
        db2.addEventListener("versionchange", () => blocking());
    }).catch(() => {
    });
    return openPromise;
  }
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  var readMethods, writeMethods, cachedMethods;
  var init_build = __esm({
    "node_modules/idb/build/index.js"() {
      init_wrap_idb_value();
      init_wrap_idb_value();
      readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
      writeMethods = ["put", "add", "delete", "clear"];
      cachedMethods = /* @__PURE__ */ new Map();
      replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
      }));
    }
  });

  // node_modules/@firebase/app/dist/esm/index.esm2017.js
  function isVersionServiceProvider(provider) {
    const component = provider.getComponent();
    return (component === null || component === void 0 ? void 0 : component.type) === "VERSION";
  }
  function _addComponent(app2, component) {
    try {
      app2.container.addComponent(component);
    } catch (e) {
      logger.debug(`Component ${component.name} failed to register with FirebaseApp ${app2.name}`, e);
    }
  }
  function _registerComponent(component) {
    const componentName = component.name;
    if (_components.has(componentName)) {
      logger.debug(`There were multiple attempts to register component ${componentName}.`);
      return false;
    }
    _components.set(componentName, component);
    for (const app2 of _apps.values()) {
      _addComponent(app2, component);
    }
    return true;
  }
  function _getProvider(app2, name3) {
    const heartbeatController = app2.container.getProvider("heartbeat").getImmediate({ optional: true });
    if (heartbeatController) {
      void heartbeatController.triggerHeartbeat();
    }
    return app2.container.getProvider(name3);
  }
  function initializeApp(_options, rawConfig = {}) {
    let options = _options;
    if (typeof rawConfig !== "object") {
      const name4 = rawConfig;
      rawConfig = { name: name4 };
    }
    const config = Object.assign({ name: DEFAULT_ENTRY_NAME2, automaticDataCollectionEnabled: false }, rawConfig);
    const name3 = config.name;
    if (typeof name3 !== "string" || !name3) {
      throw ERROR_FACTORY.create("bad-app-name", {
        appName: String(name3)
      });
    }
    options || (options = getDefaultAppConfig());
    if (!options) {
      throw ERROR_FACTORY.create(
        "no-options"
        /* AppError.NO_OPTIONS */
      );
    }
    const existingApp = _apps.get(name3);
    if (existingApp) {
      if (deepEqual(options, existingApp.options) && deepEqual(config, existingApp.config)) {
        return existingApp;
      } else {
        throw ERROR_FACTORY.create("duplicate-app", { appName: name3 });
      }
    }
    const container = new ComponentContainer(name3);
    for (const component of _components.values()) {
      container.addComponent(component);
    }
    const newApp = new FirebaseAppImpl(options, config, container);
    _apps.set(name3, newApp);
    return newApp;
  }
  function getApp(name3 = DEFAULT_ENTRY_NAME2) {
    const app2 = _apps.get(name3);
    if (!app2 && name3 === DEFAULT_ENTRY_NAME2) {
      return initializeApp();
    }
    if (!app2) {
      throw ERROR_FACTORY.create("no-app", { appName: name3 });
    }
    return app2;
  }
  function registerVersion(libraryKeyOrName, version3, variant) {
    var _a;
    let library = (_a = PLATFORM_LOG_STRING[libraryKeyOrName]) !== null && _a !== void 0 ? _a : libraryKeyOrName;
    if (variant) {
      library += `-${variant}`;
    }
    const libraryMismatch = library.match(/\s|\//);
    const versionMismatch = version3.match(/\s|\//);
    if (libraryMismatch || versionMismatch) {
      const warning = [
        `Unable to register library "${library}" with version "${version3}":`
      ];
      if (libraryMismatch) {
        warning.push(`library name "${library}" contains illegal characters (whitespace or "/")`);
      }
      if (libraryMismatch && versionMismatch) {
        warning.push("and");
      }
      if (versionMismatch) {
        warning.push(`version name "${version3}" contains illegal characters (whitespace or "/")`);
      }
      logger.warn(warning.join(" "));
      return;
    }
    _registerComponent(new Component(
      `${library}-version`,
      () => ({ library, version: version3 }),
      "VERSION"
      /* ComponentType.VERSION */
    ));
  }
  function getDbPromise() {
    if (!dbPromise) {
      dbPromise = openDB(DB_NAME, DB_VERSION, {
        upgrade: (db2, oldVersion) => {
          switch (oldVersion) {
            case 0:
              db2.createObjectStore(STORE_NAME);
          }
        }
      }).catch((e) => {
        throw ERROR_FACTORY.create("idb-open", {
          originalErrorMessage: e.message
        });
      });
    }
    return dbPromise;
  }
  async function readHeartbeatsFromIndexedDB(app2) {
    try {
      const db2 = await getDbPromise();
      return db2.transaction(STORE_NAME).objectStore(STORE_NAME).get(computeKey(app2));
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-get", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  async function writeHeartbeatsToIndexedDB(app2, heartbeatObject) {
    try {
      const db2 = await getDbPromise();
      const tx = db2.transaction(STORE_NAME, "readwrite");
      const objectStore = tx.objectStore(STORE_NAME);
      await objectStore.put(heartbeatObject, computeKey(app2));
      return tx.done;
    } catch (e) {
      if (e instanceof FirebaseError) {
        logger.warn(e.message);
      } else {
        const idbGetError = ERROR_FACTORY.create("idb-set", {
          originalErrorMessage: e === null || e === void 0 ? void 0 : e.message
        });
        logger.warn(idbGetError.message);
      }
    }
  }
  function computeKey(app2) {
    return `${app2.name}!${app2.options.appId}`;
  }
  function getUTCDateString() {
    const today = new Date();
    return today.toISOString().substring(0, 10);
  }
  function extractHeartbeatsForHeader(heartbeatsCache, maxSize = MAX_HEADER_BYTES) {
    const heartbeatsToSend = [];
    let unsentEntries = heartbeatsCache.slice();
    for (const singleDateHeartbeat of heartbeatsCache) {
      const heartbeatEntry = heartbeatsToSend.find((hb) => hb.agent === singleDateHeartbeat.agent);
      if (!heartbeatEntry) {
        heartbeatsToSend.push({
          agent: singleDateHeartbeat.agent,
          dates: [singleDateHeartbeat.date]
        });
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatsToSend.pop();
          break;
        }
      } else {
        heartbeatEntry.dates.push(singleDateHeartbeat.date);
        if (countBytes(heartbeatsToSend) > maxSize) {
          heartbeatEntry.dates.pop();
          break;
        }
      }
      unsentEntries = unsentEntries.slice(1);
    }
    return {
      heartbeatsToSend,
      unsentEntries
    };
  }
  function countBytes(heartbeatsCache) {
    return base64urlEncodeWithoutPadding(
      // heartbeatsCache wrapper properties
      JSON.stringify({ version: 2, heartbeats: heartbeatsCache })
    ).length;
  }
  function registerCoreComponents(variant) {
    _registerComponent(new Component(
      "platform-logger",
      (container) => new PlatformLoggerServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    _registerComponent(new Component(
      "heartbeat",
      (container) => new HeartbeatServiceImpl(container),
      "PRIVATE"
      /* ComponentType.PRIVATE */
    ));
    registerVersion(name$o, version$1, variant);
    registerVersion(name$o, version$1, "esm2017");
    registerVersion("fire-js", "");
  }
  var PlatformLoggerServiceImpl, name$o, version$1, logger, name$n, name$m, name$l, name$k, name$j, name$i, name$h, name$g, name$f, name$e, name$d, name$c, name$b, name$a, name$9, name$8, name$7, name$6, name$5, name$4, name$3, name$2, name$1, name, version, DEFAULT_ENTRY_NAME2, PLATFORM_LOG_STRING, _apps, _components, ERRORS, ERROR_FACTORY, FirebaseAppImpl, SDK_VERSION, DB_NAME, DB_VERSION, STORE_NAME, dbPromise, MAX_HEADER_BYTES, STORED_HEARTBEAT_RETENTION_MAX_MILLIS, HeartbeatServiceImpl, HeartbeatStorageImpl;
  var init_index_esm20174 = __esm({
    "node_modules/@firebase/app/dist/esm/index.esm2017.js"() {
      init_index_esm20172();
      init_index_esm20173();
      init_index_esm2017();
      init_index_esm2017();
      init_build();
      PlatformLoggerServiceImpl = class {
        constructor(container) {
          this.container = container;
        }
        // In initial implementation, this will be called by installations on
        // auth token refresh, and installations will send this string.
        getPlatformInfoString() {
          const providers = this.container.getProviders();
          return providers.map((provider) => {
            if (isVersionServiceProvider(provider)) {
              const service = provider.getImmediate();
              return `${service.library}/${service.version}`;
            } else {
              return null;
            }
          }).filter((logString) => logString).join(" ");
        }
      };
      name$o = "@firebase/app";
      version$1 = "0.9.0";
      logger = new Logger("@firebase/app");
      name$n = "@firebase/app-compat";
      name$m = "@firebase/analytics-compat";
      name$l = "@firebase/analytics";
      name$k = "@firebase/app-check-compat";
      name$j = "@firebase/app-check";
      name$i = "@firebase/auth";
      name$h = "@firebase/auth-compat";
      name$g = "@firebase/database";
      name$f = "@firebase/database-compat";
      name$e = "@firebase/functions";
      name$d = "@firebase/functions-compat";
      name$c = "@firebase/installations";
      name$b = "@firebase/installations-compat";
      name$a = "@firebase/messaging";
      name$9 = "@firebase/messaging-compat";
      name$8 = "@firebase/performance";
      name$7 = "@firebase/performance-compat";
      name$6 = "@firebase/remote-config";
      name$5 = "@firebase/remote-config-compat";
      name$4 = "@firebase/storage";
      name$3 = "@firebase/storage-compat";
      name$2 = "@firebase/firestore";
      name$1 = "@firebase/firestore-compat";
      name = "firebase";
      version = "9.15.0";
      DEFAULT_ENTRY_NAME2 = "[DEFAULT]";
      PLATFORM_LOG_STRING = {
        [name$o]: "fire-core",
        [name$n]: "fire-core-compat",
        [name$l]: "fire-analytics",
        [name$m]: "fire-analytics-compat",
        [name$j]: "fire-app-check",
        [name$k]: "fire-app-check-compat",
        [name$i]: "fire-auth",
        [name$h]: "fire-auth-compat",
        [name$g]: "fire-rtdb",
        [name$f]: "fire-rtdb-compat",
        [name$e]: "fire-fn",
        [name$d]: "fire-fn-compat",
        [name$c]: "fire-iid",
        [name$b]: "fire-iid-compat",
        [name$a]: "fire-fcm",
        [name$9]: "fire-fcm-compat",
        [name$8]: "fire-perf",
        [name$7]: "fire-perf-compat",
        [name$6]: "fire-rc",
        [name$5]: "fire-rc-compat",
        [name$4]: "fire-gcs",
        [name$3]: "fire-gcs-compat",
        [name$2]: "fire-fst",
        [name$1]: "fire-fst-compat",
        "fire-js": "fire-js",
        [name]: "fire-js-all"
      };
      _apps = /* @__PURE__ */ new Map();
      _components = /* @__PURE__ */ new Map();
      ERRORS = {
        [
          "no-app"
          /* AppError.NO_APP */
        ]: "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()",
        [
          "bad-app-name"
          /* AppError.BAD_APP_NAME */
        ]: "Illegal App name: '{$appName}",
        [
          "duplicate-app"
          /* AppError.DUPLICATE_APP */
        ]: "Firebase App named '{$appName}' already exists with different options or config",
        [
          "app-deleted"
          /* AppError.APP_DELETED */
        ]: "Firebase App named '{$appName}' already deleted",
        [
          "no-options"
          /* AppError.NO_OPTIONS */
        ]: "Need to provide options, when not being deployed to hosting via source.",
        [
          "invalid-app-argument"
          /* AppError.INVALID_APP_ARGUMENT */
        ]: "firebase.{$appName}() takes either no argument or a Firebase App instance.",
        [
          "invalid-log-argument"
          /* AppError.INVALID_LOG_ARGUMENT */
        ]: "First argument to `onLog` must be null or a function.",
        [
          "idb-open"
          /* AppError.IDB_OPEN */
        ]: "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-get"
          /* AppError.IDB_GET */
        ]: "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-set"
          /* AppError.IDB_WRITE */
        ]: "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
        [
          "idb-delete"
          /* AppError.IDB_DELETE */
        ]: "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."
      };
      ERROR_FACTORY = new ErrorFactory("app", "Firebase", ERRORS);
      FirebaseAppImpl = class {
        constructor(options, config, container) {
          this._isDeleted = false;
          this._options = Object.assign({}, options);
          this._config = Object.assign({}, config);
          this._name = config.name;
          this._automaticDataCollectionEnabled = config.automaticDataCollectionEnabled;
          this._container = container;
          this.container.addComponent(new Component(
            "app",
            () => this,
            "PUBLIC"
            /* ComponentType.PUBLIC */
          ));
        }
        get automaticDataCollectionEnabled() {
          this.checkDestroyed();
          return this._automaticDataCollectionEnabled;
        }
        set automaticDataCollectionEnabled(val) {
          this.checkDestroyed();
          this._automaticDataCollectionEnabled = val;
        }
        get name() {
          this.checkDestroyed();
          return this._name;
        }
        get options() {
          this.checkDestroyed();
          return this._options;
        }
        get config() {
          this.checkDestroyed();
          return this._config;
        }
        get container() {
          return this._container;
        }
        get isDeleted() {
          return this._isDeleted;
        }
        set isDeleted(val) {
          this._isDeleted = val;
        }
        /**
         * This function will throw an Error if the App has already been deleted -
         * use before performing API actions on the App.
         */
        checkDestroyed() {
          if (this.isDeleted) {
            throw ERROR_FACTORY.create("app-deleted", { appName: this._name });
          }
        }
      };
      SDK_VERSION = version;
      DB_NAME = "firebase-heartbeat-database";
      DB_VERSION = 1;
      STORE_NAME = "firebase-heartbeat-store";
      dbPromise = null;
      MAX_HEADER_BYTES = 1024;
      STORED_HEARTBEAT_RETENTION_MAX_MILLIS = 30 * 24 * 60 * 60 * 1e3;
      HeartbeatServiceImpl = class {
        constructor(container) {
          this.container = container;
          this._heartbeatsCache = null;
          const app2 = this.container.getProvider("app").getImmediate();
          this._storage = new HeartbeatStorageImpl(app2);
          this._heartbeatsCachePromise = this._storage.read().then((result) => {
            this._heartbeatsCache = result;
            return result;
          });
        }
        /**
         * Called to report a heartbeat. The function will generate
         * a HeartbeatsByUserAgent object, update heartbeatsCache, and persist it
         * to IndexedDB.
         * Note that we only store one heartbeat per day. So if a heartbeat for today is
         * already logged, subsequent calls to this function in the same day will be ignored.
         */
        async triggerHeartbeat() {
          const platformLogger = this.container.getProvider("platform-logger").getImmediate();
          const agent = platformLogger.getPlatformInfoString();
          const date = getUTCDateString();
          if (this._heartbeatsCache === null) {
            this._heartbeatsCache = await this._heartbeatsCachePromise;
          }
          if (this._heartbeatsCache.lastSentHeartbeatDate === date || this._heartbeatsCache.heartbeats.some((singleDateHeartbeat) => singleDateHeartbeat.date === date)) {
            return;
          } else {
            this._heartbeatsCache.heartbeats.push({ date, agent });
          }
          this._heartbeatsCache.heartbeats = this._heartbeatsCache.heartbeats.filter((singleDateHeartbeat) => {
            const hbTimestamp = new Date(singleDateHeartbeat.date).valueOf();
            const now = Date.now();
            return now - hbTimestamp <= STORED_HEARTBEAT_RETENTION_MAX_MILLIS;
          });
          return this._storage.overwrite(this._heartbeatsCache);
        }
        /**
         * Returns a base64 encoded string which can be attached to the heartbeat-specific header directly.
         * It also clears all heartbeats from memory as well as in IndexedDB.
         *
         * NOTE: Consuming product SDKs should not send the header if this method
         * returns an empty string.
         */
        async getHeartbeatsHeader() {
          if (this._heartbeatsCache === null) {
            await this._heartbeatsCachePromise;
          }
          if (this._heartbeatsCache === null || this._heartbeatsCache.heartbeats.length === 0) {
            return "";
          }
          const date = getUTCDateString();
          const { heartbeatsToSend, unsentEntries } = extractHeartbeatsForHeader(this._heartbeatsCache.heartbeats);
          const headerString = base64urlEncodeWithoutPadding(JSON.stringify({ version: 2, heartbeats: heartbeatsToSend }));
          this._heartbeatsCache.lastSentHeartbeatDate = date;
          if (unsentEntries.length > 0) {
            this._heartbeatsCache.heartbeats = unsentEntries;
            await this._storage.overwrite(this._heartbeatsCache);
          } else {
            this._heartbeatsCache.heartbeats = [];
            void this._storage.overwrite(this._heartbeatsCache);
          }
          return headerString;
        }
      };
      HeartbeatStorageImpl = class {
        constructor(app2) {
          this.app = app2;
          this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck();
        }
        async runIndexedDBEnvironmentCheck() {
          if (!isIndexedDBAvailable()) {
            return false;
          } else {
            return validateIndexedDBOpenable().then(() => true).catch(() => false);
          }
        }
        /**
         * Read all heartbeats.
         */
        async read() {
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return { heartbeats: [] };
          } else {
            const idbHeartbeatObject = await readHeartbeatsFromIndexedDB(this.app);
            return idbHeartbeatObject || { heartbeats: [] };
          }
        }
        // overwrite the storage with the provided heartbeats
        async overwrite(heartbeatsObject) {
          var _a;
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: heartbeatsObject.heartbeats
            });
          }
        }
        // add heartbeats
        async add(heartbeatsObject) {
          var _a;
          const canUseIndexedDB = await this._canUseIndexedDBPromise;
          if (!canUseIndexedDB) {
            return;
          } else {
            const existingHeartbeatsObject = await this.read();
            return writeHeartbeatsToIndexedDB(this.app, {
              lastSentHeartbeatDate: (_a = heartbeatsObject.lastSentHeartbeatDate) !== null && _a !== void 0 ? _a : existingHeartbeatsObject.lastSentHeartbeatDate,
              heartbeats: [
                ...existingHeartbeatsObject.heartbeats,
                ...heartbeatsObject.heartbeats
              ]
            });
          }
        }
      };
      registerCoreComponents("");
    }
  });

  // node_modules/firebase/app/dist/esm/index.esm.js
  var name2, version2;
  var init_index_esm = __esm({
    "node_modules/firebase/app/dist/esm/index.esm.js"() {
      init_index_esm20174();
      init_index_esm20174();
      name2 = "firebase";
      version2 = "9.15.0";
      registerVersion(name2, version2, "app");
    }
  });

  // node_modules/@firebase/firestore/dist/lite/index.browser.esm2017.js
  function y(t, ...e) {
    if (m.logLevel <= LogLevel.DEBUG) {
      const n = e.map(v);
      m.debug(`Firestore (${w}): ${t}`, ...n);
    }
  }
  function g(t, ...e) {
    if (m.logLevel <= LogLevel.ERROR) {
      const n = e.map(v);
      m.error(`Firestore (${w}): ${t}`, ...n);
    }
  }
  function _(t, ...e) {
    if (m.logLevel <= LogLevel.WARN) {
      const n = e.map(v);
      m.warn(`Firestore (${w}): ${t}`, ...n);
    }
  }
  function v(t) {
    if ("string" == typeof t)
      return t;
    try {
      return e = t, JSON.stringify(e);
    } catch (e2) {
      return t;
    }
    var e;
  }
  function b(t = "Unexpected state") {
    const e = `FIRESTORE (${w}) INTERNAL ASSERTION FAILED: ` + t;
    throw g(e), new Error(e);
  }
  function E(t, e) {
    t || b();
  }
  function I(t, e) {
    return t;
  }
  function st(t, e, n) {
    if (!n)
      throw new U(P, `Function ${t}() cannot be called with an empty ${e}.`);
  }
  function it(t) {
    if (!rt.isDocumentKey(t))
      throw new U(P, `Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`);
  }
  function ot(t) {
    if (rt.isDocumentKey(t))
      throw new U(P, `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`);
  }
  function ut(t) {
    if (void 0 === t)
      return "undefined";
    if (null === t)
      return "null";
    if ("string" == typeof t)
      return t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t);
    if ("number" == typeof t || "boolean" == typeof t)
      return "" + t;
    if ("object" == typeof t) {
      if (t instanceof Array)
        return "an array";
      {
        const e = (
          /** try to get the constructor name for an object. */
          function(t2) {
            if (t2.constructor)
              return t2.constructor.name;
            return null;
          }(t)
        );
        return e ? `a custom ${e} object` : "an object";
      }
    }
    return "function" == typeof t ? "a function" : b();
  }
  function ct(t, e) {
    if ("_delegate" in t && // Unwrap Compat types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (t = t._delegate), !(t instanceof e)) {
      if (e.name === t.constructor.name)
        throw new U(P, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
      {
        const n = ut(t);
        throw new U(P, `Expected type '${e.name}', but it was: ${n}`);
      }
    }
    return t;
  }
  function ht(t) {
    return null == t;
  }
  function lt(t) {
    return 0 === t && 1 / t == -1 / 0;
  }
  function mt(t) {
    if (void 0 === t)
      return g("RPC_ERROR", "HTTP error has no status"), R;
    switch (t) {
      case 200:
        return T;
      case 400:
        return S;
      case 401:
        return F;
      case 403:
        return D;
      case 404:
        return $;
      case 409:
        return q;
      case 416:
        return O;
      case 429:
        return x;
      case 499:
        return A;
      case 500:
        return R;
      case 501:
        return k;
      case 503:
        return L;
      case 504:
        return V;
      default:
        return t >= 200 && t < 300 ? T : t >= 400 && t < 500 ? S : t >= 500 && t < 600 ? C : R;
    }
  }
  function yt(t) {
    const e = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "undefined" != typeof self && (self.crypto || self.msCrypto)
    ), n = new Uint8Array(t);
    if (e && "function" == typeof e.getRandomValues)
      e.getRandomValues(n);
    else
      for (let e2 = 0; e2 < t; e2++)
        n[e2] = Math.floor(256 * Math.random());
    return n;
  }
  function _t(t, e) {
    return t < e ? -1 : t > e ? 1 : 0;
  }
  function vt(t, e, n) {
    return t.length === e.length && t.every((t2, r) => n(t2, e[r]));
  }
  function bt(t) {
    let e = 0;
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && e++;
    return e;
  }
  function Et(t, e) {
    for (const n in t)
      Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
  }
  function At(t) {
    if (E(!!t), "string" == typeof t) {
      let e = 0;
      const n = Tt.exec(t);
      if (E(!!n), n[1]) {
        let t2 = n[1];
        t2 = (t2 + "000000000").substr(0, 9), e = Number(t2);
      }
      const r = new Date(t);
      return {
        seconds: Math.floor(r.getTime() / 1e3),
        nanos: e
      };
    }
    return {
      seconds: Rt(t.seconds),
      nanos: Rt(t.nanos)
    };
  }
  function Rt(t) {
    return "number" == typeof t ? t : "string" == typeof t ? Number(t) : 0;
  }
  function Pt(t) {
    return "string" == typeof t ? It.fromBase64String(t) : It.fromUint8Array(t);
  }
  function $t(t) {
    var e, n;
    return "server_timestamp" === (null === (n = ((null === (e = null == t ? void 0 : t.mapValue) || void 0 === e ? void 0 : e.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
  }
  function Nt(t) {
    const e = t.mapValue.fields.__previous_value__;
    return $t(e) ? Nt(e) : e;
  }
  function Dt(t) {
    const e = At(t.mapValue.fields.__local_write_time__.timestampValue);
    return new Vt(e.seconds, e.nanos);
  }
  function xt(t) {
    return "nullValue" in t ? 0 : "booleanValue" in t ? 1 : "integerValue" in t || "doubleValue" in t ? 2 : "timestampValue" in t ? 3 : "stringValue" in t ? 5 : "bytesValue" in t ? 6 : "referenceValue" in t ? 7 : "geoPointValue" in t ? 8 : "arrayValue" in t ? 9 : "mapValue" in t ? $t(t) ? 4 : (
      /** Returns true if the Value represents the canonical {@link #MAX_VALUE} . */
      function(t2) {
        return "__max__" === (((t2.mapValue || {}).fields || {}).__type__ || {}).stringValue;
      }(t) ? 9007199254740991 : 10
    ) : b();
  }
  function St(t, e) {
    if (t === e)
      return true;
    const n = xt(t);
    if (n !== xt(e))
      return false;
    switch (n) {
      case 0:
      case 9007199254740991:
        return true;
      case 1:
        return t.booleanValue === e.booleanValue;
      case 4:
        return Dt(t).isEqual(Dt(e));
      case 3:
        return function(t2, e2) {
          if ("string" == typeof t2.timestampValue && "string" == typeof e2.timestampValue && t2.timestampValue.length === e2.timestampValue.length)
            return t2.timestampValue === e2.timestampValue;
          const n2 = At(t2.timestampValue), r = At(e2.timestampValue);
          return n2.seconds === r.seconds && n2.nanos === r.nanos;
        }(t, e);
      case 5:
        return t.stringValue === e.stringValue;
      case 6:
        return function(t2, e2) {
          return Pt(t2.bytesValue).isEqual(Pt(e2.bytesValue));
        }(t, e);
      case 7:
        return t.referenceValue === e.referenceValue;
      case 8:
        return function(t2, e2) {
          return Rt(t2.geoPointValue.latitude) === Rt(e2.geoPointValue.latitude) && Rt(t2.geoPointValue.longitude) === Rt(e2.geoPointValue.longitude);
        }(t, e);
      case 2:
        return function(t2, e2) {
          if ("integerValue" in t2 && "integerValue" in e2)
            return Rt(t2.integerValue) === Rt(e2.integerValue);
          if ("doubleValue" in t2 && "doubleValue" in e2) {
            const n2 = Rt(t2.doubleValue), r = Rt(e2.doubleValue);
            return n2 === r ? lt(n2) === lt(r) : isNaN(n2) && isNaN(r);
          }
          return false;
        }(t, e);
      case 9:
        return vt(t.arrayValue.values || [], e.arrayValue.values || [], St);
      case 10:
        return function(t2, e2) {
          const n2 = t2.mapValue.fields || {}, r = e2.mapValue.fields || {};
          if (bt(n2) !== bt(r))
            return false;
          for (const t3 in n2)
            if (n2.hasOwnProperty(t3) && (void 0 === r[t3] || !St(n2[t3], r[t3])))
              return false;
          return true;
        }(t, e);
      default:
        return b();
    }
  }
  function qt(t, e) {
    return void 0 !== (t.values || []).find((t2) => St(t2, e));
  }
  function Ot(t, e) {
    if (t === e)
      return 0;
    const n = xt(t), r = xt(e);
    if (n !== r)
      return _t(n, r);
    switch (n) {
      case 0:
      case 9007199254740991:
        return 0;
      case 1:
        return _t(t.booleanValue, e.booleanValue);
      case 2:
        return function(t2, e2) {
          const n2 = Rt(t2.integerValue || t2.doubleValue), r2 = Rt(e2.integerValue || e2.doubleValue);
          return n2 < r2 ? -1 : n2 > r2 ? 1 : n2 === r2 ? 0 : (
            // one or both are NaN.
            isNaN(n2) ? isNaN(r2) ? 0 : -1 : 1
          );
        }(t, e);
      case 3:
        return kt(t.timestampValue, e.timestampValue);
      case 4:
        return kt(Dt(t), Dt(e));
      case 5:
        return _t(t.stringValue, e.stringValue);
      case 6:
        return function(t2, e2) {
          const n2 = Pt(t2), r2 = Pt(e2);
          return n2.compareTo(r2);
        }(t.bytesValue, e.bytesValue);
      case 7:
        return function(t2, e2) {
          const n2 = t2.split("/"), r2 = e2.split("/");
          for (let t3 = 0; t3 < n2.length && t3 < r2.length; t3++) {
            const e3 = _t(n2[t3], r2[t3]);
            if (0 !== e3)
              return e3;
          }
          return _t(n2.length, r2.length);
        }(t.referenceValue, e.referenceValue);
      case 8:
        return function(t2, e2) {
          const n2 = _t(Rt(t2.latitude), Rt(e2.latitude));
          if (0 !== n2)
            return n2;
          return _t(Rt(t2.longitude), Rt(e2.longitude));
        }(t.geoPointValue, e.geoPointValue);
      case 9:
        return function(t2, e2) {
          const n2 = t2.values || [], r2 = e2.values || [];
          for (let t3 = 0; t3 < n2.length && t3 < r2.length; ++t3) {
            const e3 = Ot(n2[t3], r2[t3]);
            if (e3)
              return e3;
          }
          return _t(n2.length, r2.length);
        }(t.arrayValue, e.arrayValue);
      case 10:
        return function(t2, e2) {
          if (t2 === Ft && e2 === Ft)
            return 0;
          if (t2 === Ft)
            return 1;
          if (e2 === Ft)
            return -1;
          const n2 = t2.fields || {}, r2 = Object.keys(n2), s = e2.fields || {}, i = Object.keys(s);
          r2.sort(), i.sort();
          for (let t3 = 0; t3 < r2.length && t3 < i.length; ++t3) {
            const e3 = _t(r2[t3], i[t3]);
            if (0 !== e3)
              return e3;
            const o = Ot(n2[r2[t3]], s[i[t3]]);
            if (0 !== o)
              return o;
          }
          return _t(r2.length, i.length);
        }(t.mapValue, e.mapValue);
      default:
        throw b();
    }
  }
  function kt(t, e) {
    if ("string" == typeof t && "string" == typeof e && t.length === e.length)
      return _t(t, e);
    const n = At(t), r = At(e), s = _t(n.seconds, r.seconds);
    return 0 !== s ? s : _t(n.nanos, r.nanos);
  }
  function Lt(t) {
    return !!t && "arrayValue" in t;
  }
  function Mt(t) {
    return !!t && "nullValue" in t;
  }
  function Ut(t) {
    return !!t && "doubleValue" in t && isNaN(Number(t.doubleValue));
  }
  function jt(t) {
    return !!t && "mapValue" in t;
  }
  function Bt(t) {
    if (t.geoPointValue)
      return {
        geoPointValue: Object.assign({}, t.geoPointValue)
      };
    if (t.timestampValue && "object" == typeof t.timestampValue)
      return {
        timestampValue: Object.assign({}, t.timestampValue)
      };
    if (t.mapValue) {
      const e = {
        mapValue: {
          fields: {}
        }
      };
      return Et(t.mapValue.fields, (t2, n) => e.mapValue.fields[t2] = Bt(n)), e;
    }
    if (t.arrayValue) {
      const e = {
        arrayValue: {
          values: []
        }
      };
      for (let n = 0; n < (t.arrayValue.values || []).length; ++n)
        e.arrayValue.values[n] = Bt(t.arrayValue.values[n]);
      return e;
    }
    return Object.assign({}, t);
  }
  function Zt(t, e) {
    var n;
    return ((null === (n = e.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((t2) => rt.fromName(t2.referenceValue));
  }
  function pe(t, e = null, n = [], r = [], s = null, i = null, o = null) {
    return new me(t, e, n, r, s, i, o);
  }
  function ge(t) {
    return t.explicitOrderBy.length > 0 ? t.explicitOrderBy[0].field : null;
  }
  function _e(t) {
    for (const e of t.filters) {
      const t2 = e.getFirstInequalityField();
      if (null !== t2)
        return t2;
    }
    return null;
  }
  function be(t) {
    const e = I(t);
    if (null === e.q) {
      e.q = [];
      const t2 = _e(e), n = ge(e);
      if (null !== t2 && null === n)
        t2.isKeyField() || e.q.push(new se(t2)), e.q.push(new se(
          nt.keyField(),
          "asc"
          /* Direction.ASCENDING */
        ));
      else {
        let t3 = false;
        for (const n2 of e.explicitOrderBy)
          e.q.push(n2), n2.field.isKeyField() && (t3 = true);
        if (!t3) {
          const t4 = e.explicitOrderBy.length > 0 ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir : "asc";
          e.q.push(new se(nt.keyField(), t4));
        }
      }
    }
    return e.q;
  }
  function Ee(t) {
    const e = I(t);
    if (!e.O)
      if ("F" === e.limitType)
        e.O = pe(e.path, e.collectionGroup, be(e), e.filters, e.limit, e.startAt, e.endAt);
      else {
        const t2 = [];
        for (const n2 of be(e)) {
          const e2 = "desc" === n2.dir ? "asc" : "desc";
          t2.push(new se(n2.field, e2));
        }
        const n = e.endAt ? new Qt(e.endAt.position, e.endAt.inclusive) : null, r = e.startAt ? new Qt(e.startAt.position, e.startAt.inclusive) : null;
        e.O = pe(e.path, e.collectionGroup, t2, e.filters, e.limit, n, r);
      }
    return e.O;
  }
  function Ae(t, e) {
    return function(t2) {
      return "number" == typeof t2 && Number.isInteger(t2) && !lt(t2) && t2 <= Number.MAX_SAFE_INTEGER && t2 >= Number.MIN_SAFE_INTEGER;
    }(e) ? (
      /**
      * Returns an IntegerValue for `value`.
      */
      function(t2) {
        return {
          integerValue: "" + t2
        };
      }(e)
    ) : function(t2, e2) {
      if (t2.k) {
        if (isNaN(e2))
          return {
            doubleValue: "NaN"
          };
        if (e2 === 1 / 0)
          return {
            doubleValue: "Infinity"
          };
        if (e2 === -1 / 0)
          return {
            doubleValue: "-Infinity"
          };
      }
      return {
        doubleValue: lt(e2) ? "-0" : e2
      };
    }(t, e);
  }
  function je(t, e) {
    if (t.k) {
      return `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + e.nanoseconds).slice(-9)}Z`;
    }
    return {
      seconds: "" + e.seconds,
      nanos: e.nanoseconds
    };
  }
  function Be(t, e) {
    return t.k ? e.toBase64() : e.toUint8Array();
  }
  function Qe(t, e) {
    return je(t, e.toTimestamp());
  }
  function ze(t) {
    return E(!!t), oe.fromTimestamp(function(t2) {
      const e = At(t2);
      return new Vt(e.seconds, e.nanos);
    }(t));
  }
  function We(t, e) {
    return function(t2) {
      return new tt(["projects", t2.projectId, "databases", t2.database]);
    }(t).child("documents").child(e).canonicalString();
  }
  function Ge(t, e) {
    return We(t.databaseId, e.path);
  }
  function Ke(t, e) {
    const n = function(t2) {
      const e2 = tt.fromString(t2);
      return E(cn(e2)), e2;
    }(e);
    if (n.get(1) !== t.databaseId.projectId)
      throw new U(P, "Tried to deserialize key from different project: " + n.get(1) + " vs " + t.databaseId.projectId);
    if (n.get(3) !== t.databaseId.database)
      throw new U(P, "Tried to deserialize key from different database: " + n.get(3) + " vs " + t.databaseId.database);
    return new rt((E((r = n).length > 4 && "documents" === r.get(4)), r.popFirst(5)));
    var r;
  }
  function Ye(t, e) {
    return We(t.databaseId, e);
  }
  function He(t) {
    return new tt(["projects", t.databaseId.projectId, "databases", t.databaseId.database]).canonicalString();
  }
  function Je(t, e, n) {
    return {
      name: Ge(t, e),
      fields: n.value.mapValue.fields
    };
  }
  function Ze(t, e) {
    let n;
    if (e instanceof Se)
      n = {
        update: Je(t, e.key, e.value)
      };
    else if (e instanceof Oe)
      n = {
        delete: Ge(t, e.key)
      };
    else if (e instanceof qe)
      n = {
        update: Je(t, e.key, e.data),
        updateMask: un(e.fieldMask)
      };
    else {
      if (!(e instanceof ke))
        return b();
      n = {
        verify: Ge(t, e.key)
      };
    }
    return e.fieldTransforms.length > 0 && (n.updateTransforms = e.fieldTransforms.map((t2) => function(t3, e2) {
      const n2 = e2.transform;
      if (n2 instanceof Pe)
        return {
          fieldPath: e2.field.canonicalString(),
          setToServerValue: "REQUEST_TIME"
        };
      if (n2 instanceof Ve)
        return {
          fieldPath: e2.field.canonicalString(),
          appendMissingElements: {
            values: n2.elements
          }
        };
      if (n2 instanceof $e)
        return {
          fieldPath: e2.field.canonicalString(),
          removeAllFromArray: {
            values: n2.elements
          }
        };
      if (n2 instanceof Ne)
        return {
          fieldPath: e2.field.canonicalString(),
          increment: n2.L
        };
      throw b();
    }(0, t2))), e.precondition.isNone || (n.currentDocument = function(t2, e2) {
      return void 0 !== e2.updateTime ? {
        updateTime: Qe(t2, e2.updateTime)
      } : void 0 !== e2.exists ? {
        exists: e2.exists
      } : b();
    }(t, e.precondition)), n;
  }
  function tn(t, e) {
    const n = {
      structuredQuery: {}
    }, r = e.path;
    null !== e.collectionGroup ? (n.parent = Ye(t, r), n.structuredQuery.from = [{
      collectionId: e.collectionGroup,
      allDescendants: true
    }]) : (n.parent = Ye(t, r.popLast()), n.structuredQuery.from = [{
      collectionId: r.lastSegment()
    }]);
    const s = function(t2) {
      if (0 === t2.length)
        return;
      return on(Kt.create(
        t2,
        "and"
        /* CompositeOperator.AND */
      ));
    }(e.filters);
    s && (n.structuredQuery.where = s);
    const i = function(t2) {
      if (0 === t2.length)
        return;
      return t2.map((t3) => (
        // visible for testing
        function(t4) {
          return {
            field: sn(t4.field),
            direction: en(t4.dir)
          };
        }(t3)
      ));
    }(e.orderBy);
    i && (n.structuredQuery.orderBy = i);
    const o = function(t2, e2) {
      return t2.k || ht(e2) ? e2 : {
        value: e2
      };
    }(t, e.limit);
    var u;
    return null !== o && (n.structuredQuery.limit = o), e.startAt && (n.structuredQuery.startAt = {
      before: (u = e.startAt).inclusive,
      values: u.position
    }), e.endAt && (n.structuredQuery.endAt = function(t2) {
      return {
        before: !t2.inclusive,
        values: t2.position
      };
    }(e.endAt)), n;
  }
  function en(t) {
    return Ce[t];
  }
  function nn(t) {
    return Le[t];
  }
  function rn(t) {
    return Me[t];
  }
  function sn(t) {
    return {
      fieldPath: t.canonicalString()
    };
  }
  function on(t) {
    return t instanceof Gt ? function(t2) {
      if ("==" === t2.op) {
        if (Ut(t2.value))
          return {
            unaryFilter: {
              field: sn(t2.field),
              op: "IS_NAN"
            }
          };
        if (Mt(t2.value))
          return {
            unaryFilter: {
              field: sn(t2.field),
              op: "IS_NULL"
            }
          };
      } else if ("!=" === t2.op) {
        if (Ut(t2.value))
          return {
            unaryFilter: {
              field: sn(t2.field),
              op: "IS_NOT_NAN"
            }
          };
        if (Mt(t2.value))
          return {
            unaryFilter: {
              field: sn(t2.field),
              op: "IS_NOT_NULL"
            }
          };
      }
      return {
        fieldFilter: {
          field: sn(t2.field),
          op: nn(t2.op),
          value: t2.value
        }
      };
    }(t) : t instanceof Kt ? function(t2) {
      const e = t2.getFilters().map((t3) => on(t3));
      if (1 === e.length)
        return e[0];
      return {
        compositeFilter: {
          op: rn(t2.op),
          filters: e
        }
      };
    }(t) : b();
  }
  function un(t) {
    const e = [];
    return t.fields.forEach((t2) => e.push(t2.canonicalString())), {
      fieldPaths: e
    };
  }
  function cn(t) {
    return t.length >= 4 && "projects" === t.get(0) && "databases" === t.get(2);
  }
  function an(t) {
    return new Ue(
      t,
      /* useProto3Json= */
      true
    );
  }
  async function fn(t, e) {
    const n = I(t), r = He(n.C) + "/documents", s = {
      writes: e.map((t2) => Ze(n.C, t2))
    };
    await n.I("Commit", r, s);
  }
  async function wn(t, e) {
    const n = I(t), r = tn(n.C, Ee(e));
    return (await n.P("RunQuery", r.parent, {
      structuredQuery: r.structuredQuery
    })).filter((t2) => !!t2.document).map((t2) => function(t3, e2, n2) {
      const r2 = Ke(t3, e2.name), s = ze(e2.updateTime), i = e2.createTime ? ze(e2.createTime) : oe.min(), o = new de({
        mapValue: {
          fields: e2.fields
        }
      }), u = we.newFoundDocument(r2, s, i, o);
      return n2 && u.setHasCommittedMutations(), n2 ? u.setHasCommittedMutations() : u;
    }(n.C, t2.document, void 0));
  }
  function yn(t) {
    if (t._terminated)
      throw new U(S, "The client has already been terminated.");
    if (!pn.has(t)) {
      y("ComponentProvider", "Initializing Datastore");
      const i = function(t2) {
        return new pt(t2, fetch.bind(null));
      }((e = t._databaseId, n = t.app.options.appId || "", r = t._persistenceKey, s = t._freezeSettings(), new J(e, n, r, s.host, s.ssl, s.experimentalForceLongPolling, s.experimentalAutoDetectLongPolling, s.useFetchStreams))), o = an(t._databaseId), u = function(t2, e2, n2, r2) {
        return new ln(t2, e2, n2, r2);
      }(t._authCredentials, t._appCheckCredentials, i, o);
      pn.set(t, u);
    }
    var e, n, r, s;
    return pn.get(t);
  }
  function bn(e, n) {
    const r = "object" == typeof e ? e : getApp(), s = "string" == typeof e ? e : n || "(default)", i = _getProvider(r, "firestore/lite").getImmediate({
      identifier: s
    });
    if (!i._initialized) {
      const t = getDefaultEmulatorHostnameAndPort("firestore");
      t && En(i, ...t);
    }
    return i;
  }
  function En(t, e, n, r = {}) {
    var s;
    const i = (t = ct(t, _n))._getSettings();
    if ("firestore.googleapis.com" !== i.host && i.host !== e && _("Host has been set in both settings() and useEmulator(), emulator host will be used"), t._setSettings(Object.assign(Object.assign({}, i), {
      host: `${e}:${n}`,
      ssl: false
    })), r.mockUserToken) {
      let e2, n2;
      if ("string" == typeof r.mockUserToken)
        e2 = r.mockUserToken, n2 = d.MOCK_USER;
      else {
        e2 = createMockUserToken(r.mockUserToken, null === (s = t._app) || void 0 === s ? void 0 : s.options.projectId);
        const i2 = r.mockUserToken.sub || r.mockUserToken.user_id;
        if (!i2)
          throw new U(P, "mockUserToken must contain 'sub' or 'user_id' field!");
        n2 = new d(i2);
      }
      t._authCredentials = new z(new B(e2, n2));
    }
  }
  function Nn(t, e, ...n) {
    if (t = getModularInstance(t), st("collection", "path", e), t instanceof _n) {
      const r = tt.fromString(e, ...n);
      return ot(r), new $n(
        t,
        /* converter= */
        null,
        r
      );
    }
    {
      if (!(t instanceof Pn || t instanceof $n))
        throw new U(P, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const r = t._path.child(tt.fromString(e, ...n));
      return ot(r), new $n(
        t.firestore,
        /* converter= */
        null,
        r
      );
    }
  }
  function Fn(t, e, ...n) {
    if (t = getModularInstance(t), // We allow omission of 'pathString' but explicitly prohibit passing in both
    // 'undefined' and 'null'.
    1 === arguments.length && (e = gt.N()), st("doc", "path", e), t instanceof _n) {
      const r = tt.fromString(e, ...n);
      return it(r), new Pn(
        t,
        /* converter= */
        null,
        new rt(r)
      );
    }
    {
      if (!(t instanceof Pn || t instanceof $n))
        throw new U(P, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
      const r = t._path.child(tt.fromString(e, ...n));
      return it(r), new Pn(t.firestore, t instanceof $n ? t.converter : null, new rt(r));
    }
  }
  function Bn(t) {
    switch (t) {
      case 0:
      case 2:
      case 1:
        return true;
      case 3:
      case 4:
        return false;
      default:
        throw b();
    }
  }
  function Wn(t) {
    const e = t._freezeSettings(), n = an(t._databaseId);
    return new zn(t._databaseId, !!e.ignoreUndefinedProperties, n);
  }
  function Gn(t, e, n, r, s, i = {}) {
    const o = t.ft(i.merge || i.mergeFields ? 2 : 0, e, n, s);
    or("Data must be an object, but it was:", o, r);
    const u = sr(r, o);
    let c, a;
    if (i.merge)
      c = new fe(o.fieldMask), a = o.fieldTransforms;
    else if (i.mergeFields) {
      const t2 = [];
      for (const r2 of i.mergeFields) {
        const s2 = ur(e, r2, n);
        if (!o.contains(s2))
          throw new U(P, `Field '${s2}' is specified in your field mask but missing from your input data.`);
        lr(t2, s2) || t2.push(s2);
      }
      c = new fe(t2), a = o.fieldTransforms.filter((t3) => c.covers(t3.field));
    } else
      c = null, a = o.fieldTransforms;
    return new Un(new de(u), c, a);
  }
  function Yn(t, e, n) {
    return new Qn({
      nt: 3,
      lt: e.settings.lt,
      methodName: t._methodName,
      it: n
    }, e.databaseId, e.C, e.ignoreUndefinedProperties);
  }
  function tr(t, e, n, r) {
    const s = t.ft(1, e, n);
    or("Data must be an object, but it was:", s, r);
    const i = [], o = de.empty();
    Et(r, (t2, r2) => {
      const u2 = ar(e, t2, n);
      r2 = getModularInstance(r2);
      const c = s.ut(u2);
      if (r2 instanceof Kn)
        i.push(u2);
      else {
        const t3 = rr(r2, c);
        null != t3 && (i.push(u2), o.set(u2, t3));
      }
    });
    const u = new fe(i);
    return new jn(o, u, s.fieldTransforms);
  }
  function er(t, e, n, r, s, i) {
    const o = t.ft(1, e, n), u = [ur(e, r, n)], c = [s];
    if (i.length % 2 != 0)
      throw new U(P, `Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);
    for (let t2 = 0; t2 < i.length; t2 += 2)
      u.push(ur(e, i[t2])), c.push(i[t2 + 1]);
    const a = [], h = de.empty();
    for (let t2 = u.length - 1; t2 >= 0; --t2)
      if (!lr(a, u[t2])) {
        const e2 = u[t2];
        let n2 = c[t2];
        n2 = getModularInstance(n2);
        const r2 = o.ut(e2);
        if (n2 instanceof Kn)
          a.push(e2);
        else {
          const t3 = rr(n2, r2);
          null != t3 && (a.push(e2), h.set(e2, t3));
        }
      }
    const f = new fe(a);
    return new jn(h, f, o.fieldTransforms);
  }
  function rr(t, e) {
    if (ir(
      // Unwrap the API type from the Compat SDK. This will return the API type
      // from firestore-exp.
      t = getModularInstance(t)
    ))
      return or("Unsupported field value:", e, t), sr(t, e);
    if (t instanceof Cn)
      return function(t2, e2) {
        if (!Bn(e2.nt))
          throw e2.at(`${t2._methodName}() can only be used with update() and set()`);
        if (!e2.path)
          throw e2.at(`${t2._methodName}() is not currently supported inside arrays`);
        const n = t2._toFieldTransform(e2);
        n && e2.fieldTransforms.push(n);
      }(t, e), null;
    if (void 0 === t && e.ignoreUndefinedProperties)
      return null;
    if (
      // If context.path is null we are inside an array and we don't support
      // field mask paths more granular than the top-level array.
      e.path && e.fieldMask.push(e.path), t instanceof Array
    ) {
      if (e.settings.it && 4 !== e.nt)
        throw e.at("Nested arrays are not supported");
      return function(t2, e2) {
        const n = [];
        let r = 0;
        for (const s of t2) {
          let t3 = rr(s, e2.ct(r));
          null == t3 && // Just include nulls in the array for fields being replaced with a
          // sentinel.
          (t3 = {
            nullValue: "NULL_VALUE"
          }), n.push(t3), r++;
        }
        return {
          arrayValue: {
            values: n
          }
        };
      }(t, e);
    }
    return function(t2, e2) {
      if (null === (t2 = getModularInstance(t2)))
        return {
          nullValue: "NULL_VALUE"
        };
      if ("number" == typeof t2)
        return Ae(e2.C, t2);
      if ("boolean" == typeof t2)
        return {
          booleanValue: t2
        };
      if ("string" == typeof t2)
        return {
          stringValue: t2
        };
      if (t2 instanceof Date) {
        const n = Vt.fromDate(t2);
        return {
          timestampValue: je(e2.C, n)
        };
      }
      if (t2 instanceof Vt) {
        const n = new Vt(t2.seconds, 1e3 * Math.floor(t2.nanoseconds / 1e3));
        return {
          timestampValue: je(e2.C, n)
        };
      }
      if (t2 instanceof Ln)
        return {
          geoPointValue: {
            latitude: t2.latitude,
            longitude: t2.longitude
          }
        };
      if (t2 instanceof qn)
        return {
          bytesValue: Be(e2.C, t2._byteString)
        };
      if (t2 instanceof Pn) {
        const n = e2.databaseId, r = t2.firestore._databaseId;
        if (!r.isEqual(n))
          throw e2.at(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);
        return {
          referenceValue: We(t2.firestore._databaseId || e2.databaseId, t2._key.path)
        };
      }
      throw e2.at(`Unsupported field value: ${ut(t2)}`);
    }(t, e);
  }
  function sr(t, e) {
    const n = {};
    return !function(t2) {
      for (const e2 in t2)
        if (Object.prototype.hasOwnProperty.call(t2, e2))
          return false;
      return true;
    }(t) ? Et(t, (t2, r) => {
      const s = rr(r, e.st(t2));
      null != s && (n[t2] = s);
    }) : (
      // If we encounter an empty object, we explicitly add it to the update
      // mask to ensure that the server creates a map entry.
      e.path && e.path.length > 0 && e.fieldMask.push(e.path)
    ), {
      mapValue: {
        fields: n
      }
    };
  }
  function ir(t) {
    return !("object" != typeof t || null === t || t instanceof Array || t instanceof Date || t instanceof Vt || t instanceof Ln || t instanceof qn || t instanceof Pn || t instanceof Cn);
  }
  function or(t, e, n) {
    if (!ir(n) || !function(t2) {
      return "object" == typeof t2 && null !== t2 && (Object.getPrototypeOf(t2) === Object.prototype || null === Object.getPrototypeOf(t2));
    }(n)) {
      const r = ut(n);
      throw "an object" === r ? e.at(t + " a custom object") : e.at(t + " " + r);
    }
  }
  function ur(t, e, n) {
    if (
      // If required, replace the FieldPath Compat class with with the firestore-exp
      // FieldPath.
      (e = getModularInstance(e)) instanceof On
    )
      return e._internalPath;
    if ("string" == typeof e)
      return ar(t, e);
    throw hr(
      "Field path arguments must be of type string or ",
      t,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  }
  function ar(t, e, n) {
    if (e.search(cr) >= 0)
      throw hr(
        `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
        t,
        /* hasConverter= */
        false,
        /* path= */
        void 0,
        n
      );
    try {
      return new On(...e.split("."))._internalPath;
    } catch (r) {
      throw hr(
        `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
        t,
        /* hasConverter= */
        false,
        /* path= */
        void 0,
        n
      );
    }
  }
  function hr(t, e, n, r, s) {
    const i = r && !r.isEmpty(), o = void 0 !== s;
    let u = `Function ${e}() called with invalid data`;
    n && (u += " (via `toFirestore()`)"), u += ". ";
    let c = "";
    return (i || o) && (c += " (found", i && (c += ` in field ${r}`), o && (c += ` in document ${s}`), c += ")"), new U(P, u + t + c);
  }
  function lr(t, e) {
    return t.some((t2) => t2.isEqual(e));
  }
  function pr(t, e) {
    return "string" == typeof e ? ar(t, e) : e instanceof On ? e._internalPath : e._delegate._internalPath;
  }
  function jr(t, e, n) {
    let r;
    return r = t ? n && (n.merge || n.mergeFields) ? t.toFirestore(e, n) : t.toFirestore(e) : e, r;
  }
  function zr(t) {
    !function(t2) {
      if ("L" === t2.limitType && 0 === t2.explicitOrderBy.length)
        throw new U(k, "limitToLast() queries require specifying at least one orderBy() clause");
    }((t = ct(t, Vn))._query);
    const e = yn(t.firestore), n = new Br(t.firestore);
    return wn(e, t._query).then((e2) => {
      const r = e2.map((e3) => new dr(t.firestore, n, e3.key, e3, t.converter));
      return "L" === t._query.limitType && // Limit to last queries reverse the orderBy constraint that was
      // specified by the user. As such, we need to reverse the order of the
      // results to return the documents in the expected order.
      r.reverse(), new wr(t, r);
    });
  }
  function Gr(t, e, n, ...r) {
    const s = Wn((t = ct(t, Pn)).firestore);
    let i;
    i = "string" == typeof (e = getModularInstance(e)) || e instanceof On ? er(s, "updateDoc", t._key, e, n, r) : tr(s, "updateDoc", t._key, e);
    return fn(yn(t.firestore), [i.toMutation(t._key, Fe.exists(true))]);
  }
  function Yr(t, e) {
    const n = Fn(t = ct(t, $n)), r = jr(t.converter, e), s = Gn(Wn(t.firestore), "addDoc", n._key, r, null !== n.converter, {});
    return fn(yn(t.firestore), [s.toMutation(n._key, Fe.exists(false))]).then(() => n);
  }
  function ts(...t) {
    return new Jn("arrayUnion", t);
  }
  var d, w, m, T, A, R, P, V, $, D, F, x, S, q, O, k, C, L, U, B, Q, z, W, G, K, Y, H, J, X, Z, tt, et, nt, rt, ft, dt, wt, pt, gt, It, Tt, Vt, Ft, Qt, Wt, Gt, Kt, Ht, Jt, Xt, te, ee, ne, re, se, oe, ue, ce, ae, he, le, fe, de, we, me, ye, Re, Pe, Ve, $e, Ne, De, Fe, xe, Se, qe, Oe, ke, Ce, Le, Me, Ue, ln, pn, gn, _n, Pn, Vn, $n, qn, On, Cn, Ln, Mn, Un, jn, Qn, zn, Kn, Jn, cr, fr, dr, wr, Br;
  var init_index_browser_esm2017 = __esm({
    "node_modules/@firebase/firestore/dist/lite/index.browser.esm2017.js"() {
      init_index_esm20174();
      init_index_esm20172();
      init_index_esm20173();
      init_index_esm2017();
      d = class {
        constructor(t) {
          this.uid = t;
        }
        isAuthenticated() {
          return null != this.uid;
        }
        /**
         * Returns a key representing this user, suitable for inclusion in a
         * dictionary.
         */
        toKey() {
          return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
        }
        isEqual(t) {
          return t.uid === this.uid;
        }
      };
      d.UNAUTHENTICATED = new d(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
      // non-FirebaseAuth providers.
      d.GOOGLE_CREDENTIALS = new d("google-credentials-uid"), d.FIRST_PARTY = new d("first-party-uid"), d.MOCK_USER = new d("mock-user");
      w = "9.15.0";
      m = new Logger("@firebase/firestore");
      T = "ok";
      A = "cancelled";
      R = "unknown";
      P = "invalid-argument";
      V = "deadline-exceeded";
      $ = "not-found";
      D = "permission-denied";
      F = "unauthenticated";
      x = "resource-exhausted";
      S = "failed-precondition";
      q = "aborted";
      O = "out-of-range";
      k = "unimplemented";
      C = "internal";
      L = "unavailable";
      U = class extends FirebaseError {
        /** @hideconstructor */
        constructor(t, e) {
          super(t, e), this.code = t, this.message = e, // HACK: We write a toString property directly because Error is not a real
          // class and so inheritance does not work correctly. We could alternatively
          // do the same "back-door inheritance" trick that FirebaseError does.
          this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
        }
      };
      B = class {
        constructor(t, e) {
          this.user = e, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${t}`);
        }
      };
      Q = class {
        getToken() {
          return Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(t, e) {
          t.enqueueRetryable(() => e(d.UNAUTHENTICATED));
        }
        shutdown() {
        }
      };
      z = class {
        constructor(t) {
          this.token = t, /**
           * Stores the listener registered with setChangeListener()
           * This isn't actually necessary since the UID never changes, but we use this
           * to verify the listen contract is adhered to in tests.
           */
          this.changeListener = null;
        }
        getToken() {
          return Promise.resolve(this.token);
        }
        invalidateToken() {
        }
        start(t, e) {
          this.changeListener = e, // Fire with initial user.
          t.enqueueRetryable(() => e(this.token.user));
        }
        shutdown() {
          this.changeListener = null;
        }
      };
      W = class {
        constructor(t) {
          this.auth = null, t.onInit((t2) => {
            this.auth = t2;
          });
        }
        getToken() {
          return this.auth ? this.auth.getToken().then((t) => t ? (E("string" == typeof t.accessToken), new B(t.accessToken, new d(this.auth.getUid()))) : null) : Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(t, e) {
        }
        shutdown() {
        }
      };
      G = class {
        constructor(t, e, n, r) {
          this.t = t, this.i = e, this.o = n, this.u = r, this.type = "FirstParty", this.user = d.FIRST_PARTY, this.h = /* @__PURE__ */ new Map();
        }
        /** Gets an authorization token, using a provided factory function, or falling back to First Party GAPI. */
        l() {
          return this.u ? this.u() : (
            // Make sure this really is a Gapi client.
            (E(!("object" != typeof this.t || null === this.t || !this.t.auth || !this.t.auth.getAuthHeaderValueForFirstParty)), this.t.auth.getAuthHeaderValueForFirstParty([]))
          );
        }
        get headers() {
          this.h.set("X-Goog-AuthUser", this.i);
          const t = this.l();
          return t && this.h.set("Authorization", t), this.o && this.h.set("X-Goog-Iam-Authorization-Token", this.o), this.h;
        }
      };
      K = class {
        constructor(t, e, n, r) {
          this.t = t, this.i = e, this.o = n, this.u = r;
        }
        getToken() {
          return Promise.resolve(new G(this.t, this.i, this.o, this.u));
        }
        start(t, e) {
          t.enqueueRetryable(() => e(d.FIRST_PARTY));
        }
        shutdown() {
        }
        invalidateToken() {
        }
      };
      Y = class {
        constructor(t) {
          this.value = t, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), t && t.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
        }
      };
      H = class {
        constructor(t) {
          this.m = t, this.appCheck = null, t.onInit((t2) => {
            this.appCheck = t2;
          });
        }
        getToken() {
          return this.appCheck ? this.appCheck.getToken().then((t) => t ? (E("string" == typeof t.token), new Y(t.token)) : null) : Promise.resolve(null);
        }
        invalidateToken() {
        }
        start(t, e) {
        }
        shutdown() {
        }
      };
      J = class {
        /**
         * Constructs a DatabaseInfo using the provided host, databaseId and
         * persistenceKey.
         *
         * @param databaseId - The database to use.
         * @param appId - The Firebase App Id.
         * @param persistenceKey - A unique identifier for this Firestore's local
         * storage (used in conjunction with the databaseId).
         * @param host - The Firestore backend host to connect to.
         * @param ssl - Whether to use SSL when connecting.
         * @param forceLongPolling - Whether to use the forceLongPolling option
         * when using WebChannel as the network transport.
         * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
         * option when using WebChannel as the network transport.
         * @param useFetchStreams Whether to use the Fetch API instead of
         * XMLHTTPRequest
         */
        constructor(t, e, n, r, s, i, o, u) {
          this.databaseId = t, this.appId = e, this.persistenceKey = n, this.host = r, this.ssl = s, this.forceLongPolling = i, this.autoDetectLongPolling = o, this.useFetchStreams = u;
        }
      };
      X = class {
        constructor(t, e) {
          this.projectId = t, this.database = e || "(default)";
        }
        static empty() {
          return new X("", "");
        }
        get isDefaultDatabase() {
          return "(default)" === this.database;
        }
        isEqual(t) {
          return t instanceof X && t.projectId === this.projectId && t.database === this.database;
        }
      };
      Z = class {
        constructor(t, e, n) {
          void 0 === e ? e = 0 : e > t.length && b(), void 0 === n ? n = t.length - e : n > t.length - e && b(), this.segments = t, this.offset = e, this.len = n;
        }
        get length() {
          return this.len;
        }
        isEqual(t) {
          return 0 === Z.comparator(this, t);
        }
        child(t) {
          const e = this.segments.slice(this.offset, this.limit());
          return t instanceof Z ? t.forEach((t2) => {
            e.push(t2);
          }) : e.push(t), this.construct(e);
        }
        /** The index of one past the last segment of the path. */
        limit() {
          return this.offset + this.length;
        }
        popFirst(t) {
          return t = void 0 === t ? 1 : t, this.construct(this.segments, this.offset + t, this.length - t);
        }
        popLast() {
          return this.construct(this.segments, this.offset, this.length - 1);
        }
        firstSegment() {
          return this.segments[this.offset];
        }
        lastSegment() {
          return this.get(this.length - 1);
        }
        get(t) {
          return this.segments[this.offset + t];
        }
        isEmpty() {
          return 0 === this.length;
        }
        isPrefixOf(t) {
          if (t.length < this.length)
            return false;
          for (let e = 0; e < this.length; e++)
            if (this.get(e) !== t.get(e))
              return false;
          return true;
        }
        isImmediateParentOf(t) {
          if (this.length + 1 !== t.length)
            return false;
          for (let e = 0; e < this.length; e++)
            if (this.get(e) !== t.get(e))
              return false;
          return true;
        }
        forEach(t) {
          for (let e = this.offset, n = this.limit(); e < n; e++)
            t(this.segments[e]);
        }
        toArray() {
          return this.segments.slice(this.offset, this.limit());
        }
        static comparator(t, e) {
          const n = Math.min(t.length, e.length);
          for (let r = 0; r < n; r++) {
            const n2 = t.get(r), s = e.get(r);
            if (n2 < s)
              return -1;
            if (n2 > s)
              return 1;
          }
          return t.length < e.length ? -1 : t.length > e.length ? 1 : 0;
        }
      };
      tt = class extends Z {
        construct(t, e, n) {
          return new tt(t, e, n);
        }
        canonicalString() {
          return this.toArray().join("/");
        }
        toString() {
          return this.canonicalString();
        }
        /**
         * Creates a resource path from the given slash-delimited string. If multiple
         * arguments are provided, all components are combined. Leading and trailing
         * slashes from all components are ignored.
         */
        static fromString(...t) {
          const e = [];
          for (const n of t) {
            if (n.indexOf("//") >= 0)
              throw new U(P, `Invalid segment (${n}). Paths must not contain // in them.`);
            e.push(...n.split("/").filter((t2) => t2.length > 0));
          }
          return new tt(e);
        }
        static emptyPath() {
          return new tt([]);
        }
      };
      et = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
      nt = class extends Z {
        construct(t, e, n) {
          return new nt(t, e, n);
        }
        /**
         * Returns true if the string could be used as a segment in a field path
         * without escaping.
         */
        static isValidIdentifier(t) {
          return et.test(t);
        }
        canonicalString() {
          return this.toArray().map((t) => (t = t.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), nt.isValidIdentifier(t) || (t = "`" + t + "`"), t)).join(".");
        }
        toString() {
          return this.canonicalString();
        }
        /**
         * Returns true if this field references the key of a document.
         */
        isKeyField() {
          return 1 === this.length && "__name__" === this.get(0);
        }
        /**
         * The field designating the key of a document.
         */
        static keyField() {
          return new nt(["__name__"]);
        }
        /**
         * Parses a field string from the given server-formatted string.
         *
         * - Splitting the empty string is not allowed (for now at least).
         * - Empty segments within the string (e.g. if there are two consecutive
         *   separators) are not allowed.
         *
         * TODO(b/37244157): we should make this more strict. Right now, it allows
         * non-identifier path components, even if they aren't escaped.
         */
        static fromServerFormat(t) {
          const e = [];
          let n = "", r = 0;
          const s = () => {
            if (0 === n.length)
              throw new U(P, `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
            e.push(n), n = "";
          };
          let i = false;
          for (; r < t.length; ) {
            const e2 = t[r];
            if ("\\" === e2) {
              if (r + 1 === t.length)
                throw new U(P, "Path has trailing escape character: " + t);
              const e3 = t[r + 1];
              if ("\\" !== e3 && "." !== e3 && "`" !== e3)
                throw new U(P, "Path has invalid escape sequence: " + t);
              n += e3, r += 2;
            } else
              "`" === e2 ? (i = !i, r++) : "." !== e2 || i ? (n += e2, r++) : (s(), r++);
          }
          if (s(), i)
            throw new U(P, "Unterminated ` in path: " + t);
          return new nt(e);
        }
        static emptyPath() {
          return new nt([]);
        }
      };
      rt = class {
        constructor(t) {
          this.path = t;
        }
        static fromPath(t) {
          return new rt(tt.fromString(t));
        }
        static fromName(t) {
          return new rt(tt.fromString(t).popFirst(5));
        }
        static empty() {
          return new rt(tt.emptyPath());
        }
        get collectionGroup() {
          return this.path.popLast().lastSegment();
        }
        /** Returns true if the document is in the specified collectionId. */
        hasCollectionId(t) {
          return this.path.length >= 2 && this.path.get(this.path.length - 2) === t;
        }
        /** Returns the collection group (i.e. the name of the parent collection) for this key. */
        getCollectionGroup() {
          return this.path.get(this.path.length - 2);
        }
        /** Returns the fully qualified path to the parent collection. */
        getCollectionPath() {
          return this.path.popLast();
        }
        isEqual(t) {
          return null !== t && 0 === tt.comparator(this.path, t.path);
        }
        toString() {
          return this.path.toString();
        }
        static comparator(t, e) {
          return tt.comparator(t.path, e.path);
        }
        static isDocumentKey(t) {
          return t.length % 2 == 0;
        }
        /**
         * Creates and returns a new document key with the given segments.
         *
         * @param segments - The segments of the path to the document
         * @returns A new instance of DocumentKey
         */
        static fromSegments(t) {
          return new rt(new tt(t.slice()));
        }
      };
      ft = {
        BatchGetDocuments: "batchGet",
        Commit: "commit",
        RunQuery: "runQuery",
        RunAggregationQuery: "runAggregationQuery"
      };
      (wt = dt || (dt = {}))[wt.OK = 0] = "OK", wt[wt.CANCELLED = 1] = "CANCELLED", wt[wt.UNKNOWN = 2] = "UNKNOWN", wt[wt.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", wt[wt.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", wt[wt.NOT_FOUND = 5] = "NOT_FOUND", wt[wt.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", wt[wt.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", wt[wt.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", wt[wt.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", wt[wt.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", wt[wt.ABORTED = 10] = "ABORTED", wt[wt.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", wt[wt.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", wt[wt.INTERNAL = 13] = "INTERNAL", wt[wt.UNAVAILABLE = 14] = "UNAVAILABLE", wt[wt.DATA_LOSS = 15] = "DATA_LOSS";
      pt = class extends /**
       * Base class for all Rest-based connections to the backend (WebChannel and
       * HTTP).
       */
      class {
        constructor(t) {
          this.databaseInfo = t, this.databaseId = t.databaseId;
          const e = t.ssl ? "https" : "http";
          this.p = e + "://" + t.host, this.g = "projects/" + this.databaseId.projectId + "/databases/" + this.databaseId.database + "/documents";
        }
        get v() {
          return false;
        }
        I(t, e, n, r, s) {
          const i = this.T(t, e);
          y("RestConnection", "Sending: ", i, n);
          const o = {};
          return this.A(o, r, s), this.R(t, i, o, n).then((t2) => (y("RestConnection", "Received: ", t2), t2), (e2) => {
            throw _("RestConnection", `${t} failed with error: `, e2, "url: ", i, "request:", n), e2;
          });
        }
        P(t, e, n, r, s, i) {
          return this.I(t, e, n, r, s);
        }
        /**
         * Modifies the headers for a request, adding any authorization token if
         * present and any additional headers for the request.
         */
        A(t, e, n) {
          t["X-Goog-Api-Client"] = "gl-js/ fire/" + w, // Content-Type: text/plain will avoid preflight requests which might
          // mess with CORS and redirects by proxies. If we add custom headers
          // we will need to change this code to potentially use the $httpOverwrite
          // parameter supported by ESF to avoid triggering preflight requests.
          t["Content-Type"] = "text/plain", this.databaseInfo.appId && (t["X-Firebase-GMPID"] = this.databaseInfo.appId), e && e.headers.forEach((e2, n2) => t[n2] = e2), n && n.headers.forEach((e2, n2) => t[n2] = e2);
        }
        T(t, e) {
          const n = ft[t];
          return `${this.p}/v1/${e}:${n}`;
        }
      } {
        /**
         * @param databaseInfo - The connection info.
         * @param fetchImpl - `fetch` or a Polyfill that implements the fetch API.
         */
        constructor(t, e) {
          super(t), this.V = e;
        }
        $(t, e) {
          throw new Error("Not supported by FetchConnection");
        }
        async R(t, e, n, r) {
          var s;
          const i = JSON.stringify(r);
          let o;
          try {
            o = await this.V(e, {
              method: "POST",
              headers: n,
              body: i
            });
          } catch (t2) {
            const e2 = t2;
            throw new U(mt(e2.status), "Request failed with error: " + e2.statusText);
          }
          if (!o.ok) {
            let t2 = await o.json();
            Array.isArray(t2) && (t2 = t2[0]);
            const e2 = null === (s = null == t2 ? void 0 : t2.error) || void 0 === s ? void 0 : s.message;
            throw new U(mt(o.status), `Request failed with error: ${null != e2 ? e2 : o.statusText}`);
          }
          return o.json();
        }
      };
      gt = class {
        static N() {
          const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", e = Math.floor(256 / t.length) * t.length;
          let n = "";
          for (; n.length < 20; ) {
            const r = yt(40);
            for (let s = 0; s < r.length; ++s)
              n.length < 20 && r[s] < e && (n += t.charAt(r[s] % t.length));
          }
          return n;
        }
      };
      It = class {
        constructor(t) {
          this.binaryString = t;
        }
        static fromBase64String(t) {
          const e = atob(t);
          return new It(e);
        }
        static fromUint8Array(t) {
          const e = (
            /**
            * Helper function to convert an Uint8array to a binary string.
            */
            function(t2) {
              let e2 = "";
              for (let n = 0; n < t2.length; ++n)
                e2 += String.fromCharCode(t2[n]);
              return e2;
            }(t)
          );
          return new It(e);
        }
        [Symbol.iterator]() {
          let t = 0;
          return {
            next: () => t < this.binaryString.length ? {
              value: this.binaryString.charCodeAt(t++),
              done: false
            } : {
              value: void 0,
              done: true
            }
          };
        }
        toBase64() {
          return t = this.binaryString, btoa(t);
          var t;
        }
        toUint8Array() {
          return function(t) {
            const e = new Uint8Array(t.length);
            for (let n = 0; n < t.length; n++)
              e[n] = t.charCodeAt(n);
            return e;
          }(this.binaryString);
        }
        approximateByteSize() {
          return 2 * this.binaryString.length;
        }
        compareTo(t) {
          return _t(this.binaryString, t.binaryString);
        }
        isEqual(t) {
          return this.binaryString === t.binaryString;
        }
      };
      It.EMPTY_BYTE_STRING = new It("");
      Tt = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
      Vt = class {
        /**
         * Creates a new timestamp.
         *
         * @param seconds - The number of seconds of UTC time since Unix epoch
         *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
         *     9999-12-31T23:59:59Z inclusive.
         * @param nanoseconds - The non-negative fractions of a second at nanosecond
         *     resolution. Negative second values with fractions must still have
         *     non-negative nanoseconds values that count forward in time. Must be
         *     from 0 to 999,999,999 inclusive.
         */
        constructor(t, e) {
          if (this.seconds = t, this.nanoseconds = e, e < 0)
            throw new U(P, "Timestamp nanoseconds out of range: " + e);
          if (e >= 1e9)
            throw new U(P, "Timestamp nanoseconds out of range: " + e);
          if (t < -62135596800)
            throw new U(P, "Timestamp seconds out of range: " + t);
          if (t >= 253402300800)
            throw new U(P, "Timestamp seconds out of range: " + t);
        }
        /**
         * Creates a new timestamp with the current date, with millisecond precision.
         *
         * @returns a new timestamp representing the current date.
         */
        static now() {
          return Vt.fromMillis(Date.now());
        }
        /**
         * Creates a new timestamp from the given date.
         *
         * @param date - The date to initialize the `Timestamp` from.
         * @returns A new `Timestamp` representing the same point in time as the given
         *     date.
         */
        static fromDate(t) {
          return Vt.fromMillis(t.getTime());
        }
        /**
         * Creates a new timestamp from the given number of milliseconds.
         *
         * @param milliseconds - Number of milliseconds since Unix epoch
         *     1970-01-01T00:00:00Z.
         * @returns A new `Timestamp` representing the same point in time as the given
         *     number of milliseconds.
         */
        static fromMillis(t) {
          const e = Math.floor(t / 1e3), n = Math.floor(1e6 * (t - 1e3 * e));
          return new Vt(e, n);
        }
        /**
         * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
         * causes a loss of precision since `Date` objects only support millisecond
         * precision.
         *
         * @returns JavaScript `Date` object representing the same point in time as
         *     this `Timestamp`, with millisecond precision.
         */
        toDate() {
          return new Date(this.toMillis());
        }
        /**
         * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
         * epoch). This operation causes a loss of precision.
         *
         * @returns The point in time corresponding to this timestamp, represented as
         *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
         */
        toMillis() {
          return 1e3 * this.seconds + this.nanoseconds / 1e6;
        }
        _compareTo(t) {
          return this.seconds === t.seconds ? _t(this.nanoseconds, t.nanoseconds) : _t(this.seconds, t.seconds);
        }
        /**
         * Returns true if this `Timestamp` is equal to the provided one.
         *
         * @param other - The `Timestamp` to compare against.
         * @returns true if this `Timestamp` is equal to the provided one.
         */
        isEqual(t) {
          return t.seconds === this.seconds && t.nanoseconds === this.nanoseconds;
        }
        /** Returns a textual representation of this `Timestamp`. */
        toString() {
          return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
        }
        /** Returns a JSON-serializable representation of this `Timestamp`. */
        toJSON() {
          return {
            seconds: this.seconds,
            nanoseconds: this.nanoseconds
          };
        }
        /**
         * Converts this object to a primitive string, which allows `Timestamp` objects
         * to be compared using the `>`, `<=`, `>=` and `>` operators.
         */
        valueOf() {
          const t = this.seconds - -62135596800;
          return String(t).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
        }
      };
      Ft = {
        fields: {
          __type__: {
            stringValue: "__max__"
          }
        }
      };
      Qt = class {
        constructor(t, e) {
          this.position = t, this.inclusive = e;
        }
      };
      Wt = class {
      };
      Gt = class extends Wt {
        constructor(t, e, n) {
          super(), this.field = t, this.op = e, this.value = n;
        }
        /**
         * Creates a filter based on the provided arguments.
         */
        static create(t, e, n) {
          return t.isKeyField() ? "in" === e || "not-in" === e ? this.createKeyFieldInFilter(t, e, n) : new Ht(t, e, n) : "array-contains" === e ? new te(t, n) : "in" === e ? new ee(t, n) : "not-in" === e ? new ne(t, n) : "array-contains-any" === e ? new re(t, n) : new Gt(t, e, n);
        }
        static createKeyFieldInFilter(t, e, n) {
          return "in" === e ? new Jt(t, n) : new Xt(t, n);
        }
        matches(t) {
          const e = t.data.field(this.field);
          return "!=" === this.op ? null !== e && this.matchesComparison(Ot(e, this.value)) : null !== e && xt(this.value) === xt(e) && this.matchesComparison(Ot(e, this.value));
        }
        matchesComparison(t) {
          switch (this.op) {
            case "<":
              return t < 0;
            case "<=":
              return t <= 0;
            case "==":
              return 0 === t;
            case "!=":
              return 0 !== t;
            case ">":
              return t > 0;
            case ">=":
              return t >= 0;
            default:
              return b();
          }
        }
        isInequality() {
          return [
            "<",
            "<=",
            ">",
            ">=",
            "!=",
            "not-in"
            /* Operator.NOT_IN */
          ].indexOf(this.op) >= 0;
        }
        getFlattenedFilters() {
          return [this];
        }
        getFilters() {
          return [this];
        }
        getFirstInequalityField() {
          return this.isInequality() ? this.field : null;
        }
      };
      Kt = class extends Wt {
        constructor(t, e) {
          super(), this.filters = t, this.op = e, this.D = null;
        }
        /**
         * Creates a filter based on the provided arguments.
         */
        static create(t, e) {
          return new Kt(t, e);
        }
        matches(t) {
          return "and" === this.op ? void 0 === this.filters.find((e) => !e.matches(t)) : void 0 !== this.filters.find((e) => e.matches(t));
        }
        getFlattenedFilters() {
          return null !== this.D || (this.D = this.filters.reduce((t, e) => t.concat(e.getFlattenedFilters()), [])), this.D;
        }
        // Returns a mutable copy of `this.filters`
        getFilters() {
          return Object.assign([], this.filters);
        }
        getFirstInequalityField() {
          const t = this.F((t2) => t2.isInequality());
          return null !== t ? t.field : null;
        }
        // Performs a depth-first search to find and return the first FieldFilter in the composite filter
        // that satisfies the predicate. Returns `null` if none of the FieldFilters satisfy the
        // predicate.
        F(t) {
          for (const e of this.getFlattenedFilters())
            if (t(e))
              return e;
          return null;
        }
      };
      Ht = class extends Gt {
        constructor(t, e, n) {
          super(t, e, n), this.key = rt.fromName(n.referenceValue);
        }
        matches(t) {
          const e = rt.comparator(t.key, this.key);
          return this.matchesComparison(e);
        }
      };
      Jt = class extends Gt {
        constructor(t, e) {
          super(t, "in", e), this.keys = Zt("in", e);
        }
        matches(t) {
          return this.keys.some((e) => e.isEqual(t.key));
        }
      };
      Xt = class extends Gt {
        constructor(t, e) {
          super(t, "not-in", e), this.keys = Zt("not-in", e);
        }
        matches(t) {
          return !this.keys.some((e) => e.isEqual(t.key));
        }
      };
      te = class extends Gt {
        constructor(t, e) {
          super(t, "array-contains", e);
        }
        matches(t) {
          const e = t.data.field(this.field);
          return Lt(e) && qt(e.arrayValue, this.value);
        }
      };
      ee = class extends Gt {
        constructor(t, e) {
          super(t, "in", e);
        }
        matches(t) {
          const e = t.data.field(this.field);
          return null !== e && qt(this.value.arrayValue, e);
        }
      };
      ne = class extends Gt {
        constructor(t, e) {
          super(t, "not-in", e);
        }
        matches(t) {
          if (qt(this.value.arrayValue, {
            nullValue: "NULL_VALUE"
          }))
            return false;
          const e = t.data.field(this.field);
          return null !== e && !qt(this.value.arrayValue, e);
        }
      };
      re = class extends Gt {
        constructor(t, e) {
          super(t, "array-contains-any", e);
        }
        matches(t) {
          const e = t.data.field(this.field);
          return !(!Lt(e) || !e.arrayValue.values) && e.arrayValue.values.some((t2) => qt(this.value.arrayValue, t2));
        }
      };
      se = class {
        constructor(t, e = "asc") {
          this.field = t, this.dir = e;
        }
      };
      oe = class {
        constructor(t) {
          this.timestamp = t;
        }
        static fromTimestamp(t) {
          return new oe(t);
        }
        static min() {
          return new oe(new Vt(0, 0));
        }
        static max() {
          return new oe(new Vt(253402300799, 999999999));
        }
        compareTo(t) {
          return this.timestamp._compareTo(t.timestamp);
        }
        isEqual(t) {
          return this.timestamp.isEqual(t.timestamp);
        }
        /** Returns a number representation of the version for use in spec tests. */
        toMicroseconds() {
          return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
        }
        toString() {
          return "SnapshotVersion(" + this.timestamp.toString() + ")";
        }
        toTimestamp() {
          return this.timestamp;
        }
      };
      ue = class {
        constructor(t, e) {
          this.comparator = t, this.root = e || ae.EMPTY;
        }
        // Returns a copy of the map, with the specified key/value added or replaced.
        insert(t, e) {
          return new ue(this.comparator, this.root.insert(t, e, this.comparator).copy(null, null, ae.BLACK, null, null));
        }
        // Returns a copy of the map, with the specified key removed.
        remove(t) {
          return new ue(this.comparator, this.root.remove(t, this.comparator).copy(null, null, ae.BLACK, null, null));
        }
        // Returns the value of the node with the given key, or null.
        get(t) {
          let e = this.root;
          for (; !e.isEmpty(); ) {
            const n = this.comparator(t, e.key);
            if (0 === n)
              return e.value;
            n < 0 ? e = e.left : n > 0 && (e = e.right);
          }
          return null;
        }
        // Returns the index of the element in this sorted map, or -1 if it doesn't
        // exist.
        indexOf(t) {
          let e = 0, n = this.root;
          for (; !n.isEmpty(); ) {
            const r = this.comparator(t, n.key);
            if (0 === r)
              return e + n.left.size;
            r < 0 ? n = n.left : (
              // Count all nodes left of the node plus the node itself
              (e += n.left.size + 1, n = n.right)
            );
          }
          return -1;
        }
        isEmpty() {
          return this.root.isEmpty();
        }
        // Returns the total number of nodes in the map.
        get size() {
          return this.root.size;
        }
        // Returns the minimum key in the map.
        minKey() {
          return this.root.minKey();
        }
        // Returns the maximum key in the map.
        maxKey() {
          return this.root.maxKey();
        }
        // Traverses the map in key order and calls the specified action function
        // for each key/value pair. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        inorderTraversal(t) {
          return this.root.inorderTraversal(t);
        }
        forEach(t) {
          this.inorderTraversal((e, n) => (t(e, n), false));
        }
        toString() {
          const t = [];
          return this.inorderTraversal((e, n) => (t.push(`${e}:${n}`), false)), `{${t.join(", ")}}`;
        }
        // Traverses the map in reverse key order and calls the specified action
        // function for each key/value pair. If action returns true, traversal is
        // aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        reverseTraversal(t) {
          return this.root.reverseTraversal(t);
        }
        // Returns an iterator over the SortedMap.
        getIterator() {
          return new ce(this.root, null, this.comparator, false);
        }
        getIteratorFrom(t) {
          return new ce(this.root, t, this.comparator, false);
        }
        getReverseIterator() {
          return new ce(this.root, null, this.comparator, true);
        }
        getReverseIteratorFrom(t) {
          return new ce(this.root, t, this.comparator, true);
        }
      };
      ce = class {
        constructor(t, e, n, r) {
          this.isReverse = r, this.nodeStack = [];
          let s = 1;
          for (; !t.isEmpty(); )
            if (s = e ? n(t.key, e) : 1, // flip the comparison if we're going in reverse
            e && r && (s *= -1), s < 0)
              t = this.isReverse ? t.left : t.right;
            else {
              if (0 === s) {
                this.nodeStack.push(t);
                break;
              }
              this.nodeStack.push(t), t = this.isReverse ? t.right : t.left;
            }
        }
        getNext() {
          let t = this.nodeStack.pop();
          const e = {
            key: t.key,
            value: t.value
          };
          if (this.isReverse)
            for (t = t.left; !t.isEmpty(); )
              this.nodeStack.push(t), t = t.right;
          else
            for (t = t.right; !t.isEmpty(); )
              this.nodeStack.push(t), t = t.left;
          return e;
        }
        hasNext() {
          return this.nodeStack.length > 0;
        }
        peek() {
          if (0 === this.nodeStack.length)
            return null;
          const t = this.nodeStack[this.nodeStack.length - 1];
          return {
            key: t.key,
            value: t.value
          };
        }
      };
      ae = class {
        constructor(t, e, n, r, s) {
          this.key = t, this.value = e, this.color = null != n ? n : ae.RED, this.left = null != r ? r : ae.EMPTY, this.right = null != s ? s : ae.EMPTY, this.size = this.left.size + 1 + this.right.size;
        }
        // Returns a copy of the current node, optionally replacing pieces of it.
        copy(t, e, n, r, s) {
          return new ae(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != r ? r : this.left, null != s ? s : this.right);
        }
        isEmpty() {
          return false;
        }
        // Traverses the tree in key order and calls the specified action function
        // for each node. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        inorderTraversal(t) {
          return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t);
        }
        // Traverses the tree in reverse key order and calls the specified action
        // function for each node. If action returns true, traversal is aborted.
        // Returns the first truthy value returned by action, or the last falsey
        // value returned by action.
        reverseTraversal(t) {
          return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t);
        }
        // Returns the minimum node in the tree.
        min() {
          return this.left.isEmpty() ? this : this.left.min();
        }
        // Returns the maximum key in the tree.
        minKey() {
          return this.min().key;
        }
        // Returns the maximum key in the tree.
        maxKey() {
          return this.right.isEmpty() ? this.key : this.right.maxKey();
        }
        // Returns new tree, with the key/value added.
        insert(t, e, n) {
          let r = this;
          const s = n(t, r.key);
          return r = s < 0 ? r.copy(null, null, null, r.left.insert(t, e, n), null) : 0 === s ? r.copy(null, e, null, null, null) : r.copy(null, null, null, null, r.right.insert(t, e, n)), r.fixUp();
        }
        removeMin() {
          if (this.left.isEmpty())
            return ae.EMPTY;
          let t = this;
          return t.left.isRed() || t.left.left.isRed() || (t = t.moveRedLeft()), t = t.copy(null, null, null, t.left.removeMin(), null), t.fixUp();
        }
        // Returns new tree, with the specified item removed.
        remove(t, e) {
          let n, r = this;
          if (e(t, r.key) < 0)
            r.left.isEmpty() || r.left.isRed() || r.left.left.isRed() || (r = r.moveRedLeft()), r = r.copy(null, null, null, r.left.remove(t, e), null);
          else {
            if (r.left.isRed() && (r = r.rotateRight()), r.right.isEmpty() || r.right.isRed() || r.right.left.isRed() || (r = r.moveRedRight()), 0 === e(t, r.key)) {
              if (r.right.isEmpty())
                return ae.EMPTY;
              n = r.right.min(), r = r.copy(n.key, n.value, null, null, r.right.removeMin());
            }
            r = r.copy(null, null, null, null, r.right.remove(t, e));
          }
          return r.fixUp();
        }
        isRed() {
          return this.color;
        }
        // Returns new tree after performing any needed rotations.
        fixUp() {
          let t = this;
          return t.right.isRed() && !t.left.isRed() && (t = t.rotateLeft()), t.left.isRed() && t.left.left.isRed() && (t = t.rotateRight()), t.left.isRed() && t.right.isRed() && (t = t.colorFlip()), t;
        }
        moveRedLeft() {
          let t = this.colorFlip();
          return t.right.left.isRed() && (t = t.copy(null, null, null, null, t.right.rotateRight()), t = t.rotateLeft(), t = t.colorFlip()), t;
        }
        moveRedRight() {
          let t = this.colorFlip();
          return t.left.left.isRed() && (t = t.rotateRight(), t = t.colorFlip()), t;
        }
        rotateLeft() {
          const t = this.copy(null, null, ae.RED, null, this.right.left);
          return this.right.copy(null, null, this.color, t, null);
        }
        rotateRight() {
          const t = this.copy(null, null, ae.RED, this.left.right, null);
          return this.left.copy(null, null, this.color, null, t);
        }
        colorFlip() {
          const t = this.left.copy(null, null, !this.left.color, null, null), e = this.right.copy(null, null, !this.right.color, null, null);
          return this.copy(null, null, !this.color, t, e);
        }
        // For testing.
        checkMaxDepth() {
          const t = this.check();
          return Math.pow(2, t) <= this.size + 1;
        }
        // In a balanced RB tree, the black-depth (number of black nodes) from root to
        // leaves is equal on both sides.  This function verifies that or asserts.
        check() {
          if (this.isRed() && this.left.isRed())
            throw b();
          if (this.right.isRed())
            throw b();
          const t = this.left.check();
          if (t !== this.right.check())
            throw b();
          return t + (this.isRed() ? 0 : 1);
        }
      };
      ae.EMPTY = null, ae.RED = true, ae.BLACK = false;
      ae.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
      class {
        constructor() {
          this.size = 0;
        }
        get key() {
          throw b();
        }
        get value() {
          throw b();
        }
        get color() {
          throw b();
        }
        get left() {
          throw b();
        }
        get right() {
          throw b();
        }
        // Returns a copy of the current node.
        copy(t, e, n, r, s) {
          return this;
        }
        // Returns a copy of the tree, with the specified key/value added.
        insert(t, e, n) {
          return new ae(t, e);
        }
        // Returns a copy of the tree, with the specified key removed.
        remove(t, e) {
          return this;
        }
        isEmpty() {
          return true;
        }
        inorderTraversal(t) {
          return false;
        }
        reverseTraversal(t) {
          return false;
        }
        minKey() {
          return null;
        }
        maxKey() {
          return null;
        }
        isRed() {
          return false;
        }
        // For testing.
        checkMaxDepth() {
          return true;
        }
        check() {
          return 0;
        }
      }();
      he = class {
        constructor(t) {
          this.comparator = t, this.data = new ue(this.comparator);
        }
        has(t) {
          return null !== this.data.get(t);
        }
        first() {
          return this.data.minKey();
        }
        last() {
          return this.data.maxKey();
        }
        get size() {
          return this.data.size;
        }
        indexOf(t) {
          return this.data.indexOf(t);
        }
        /** Iterates elements in order defined by "comparator" */
        forEach(t) {
          this.data.inorderTraversal((e, n) => (t(e), false));
        }
        /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
        forEachInRange(t, e) {
          const n = this.data.getIteratorFrom(t[0]);
          for (; n.hasNext(); ) {
            const r = n.getNext();
            if (this.comparator(r.key, t[1]) >= 0)
              return;
            e(r.key);
          }
        }
        /**
         * Iterates over `elem`s such that: start &lt;= elem until false is returned.
         */
        forEachWhile(t, e) {
          let n;
          for (n = void 0 !== e ? this.data.getIteratorFrom(e) : this.data.getIterator(); n.hasNext(); ) {
            if (!t(n.getNext().key))
              return;
          }
        }
        /** Finds the least element greater than or equal to `elem`. */
        firstAfterOrEqual(t) {
          const e = this.data.getIteratorFrom(t);
          return e.hasNext() ? e.getNext().key : null;
        }
        getIterator() {
          return new le(this.data.getIterator());
        }
        getIteratorFrom(t) {
          return new le(this.data.getIteratorFrom(t));
        }
        /** Inserts or updates an element */
        add(t) {
          return this.copy(this.data.remove(t).insert(t, true));
        }
        /** Deletes an element */
        delete(t) {
          return this.has(t) ? this.copy(this.data.remove(t)) : this;
        }
        isEmpty() {
          return this.data.isEmpty();
        }
        unionWith(t) {
          let e = this;
          return e.size < t.size && (e = t, t = this), t.forEach((t2) => {
            e = e.add(t2);
          }), e;
        }
        isEqual(t) {
          if (!(t instanceof he))
            return false;
          if (this.size !== t.size)
            return false;
          const e = this.data.getIterator(), n = t.data.getIterator();
          for (; e.hasNext(); ) {
            const t2 = e.getNext().key, r = n.getNext().key;
            if (0 !== this.comparator(t2, r))
              return false;
          }
          return true;
        }
        toArray() {
          const t = [];
          return this.forEach((e) => {
            t.push(e);
          }), t;
        }
        toString() {
          const t = [];
          return this.forEach((e) => t.push(e)), "SortedSet(" + t.toString() + ")";
        }
        copy(t) {
          const e = new he(this.comparator);
          return e.data = t, e;
        }
      };
      le = class {
        constructor(t) {
          this.iter = t;
        }
        getNext() {
          return this.iter.getNext().key;
        }
        hasNext() {
          return this.iter.hasNext();
        }
      };
      fe = class {
        constructor(t) {
          this.fields = t, // TODO(dimond): validation of FieldMask
          // Sort the field mask to support `FieldMask.isEqual()` and assert below.
          t.sort(nt.comparator);
        }
        static empty() {
          return new fe([]);
        }
        /**
         * Returns a new FieldMask object that is the result of adding all the given
         * fields paths to this field mask.
         */
        unionWith(t) {
          let e = new he(nt.comparator);
          for (const t2 of this.fields)
            e = e.add(t2);
          for (const n of t)
            e = e.add(n);
          return new fe(e.toArray());
        }
        /**
         * Verifies that `fieldPath` is included by at least one field in this field
         * mask.
         *
         * This is an O(n) operation, where `n` is the size of the field mask.
         */
        covers(t) {
          for (const e of this.fields)
            if (e.isPrefixOf(t))
              return true;
          return false;
        }
        isEqual(t) {
          return vt(this.fields, t.fields, (t2, e) => t2.isEqual(e));
        }
      };
      de = class {
        constructor(t) {
          this.value = t;
        }
        static empty() {
          return new de({
            mapValue: {}
          });
        }
        /**
         * Returns the value at the given path or null.
         *
         * @param path - the path to search
         * @returns The value at the path or null if the path is not set.
         */
        field(t) {
          if (t.isEmpty())
            return this.value;
          {
            let e = this.value;
            for (let n = 0; n < t.length - 1; ++n)
              if (e = (e.mapValue.fields || {})[t.get(n)], !jt(e))
                return null;
            return e = (e.mapValue.fields || {})[t.lastSegment()], e || null;
          }
        }
        /**
         * Sets the field to the provided value.
         *
         * @param path - The field path to set.
         * @param value - The value to set.
         */
        set(t, e) {
          this.getFieldsMap(t.popLast())[t.lastSegment()] = Bt(e);
        }
        /**
         * Sets the provided fields to the provided values.
         *
         * @param data - A map of fields to values (or null for deletes).
         */
        setAll(t) {
          let e = nt.emptyPath(), n = {}, r = [];
          t.forEach((t2, s2) => {
            if (!e.isImmediateParentOf(s2)) {
              const t3 = this.getFieldsMap(e);
              this.applyChanges(t3, n, r), n = {}, r = [], e = s2.popLast();
            }
            t2 ? n[s2.lastSegment()] = Bt(t2) : r.push(s2.lastSegment());
          });
          const s = this.getFieldsMap(e);
          this.applyChanges(s, n, r);
        }
        /**
         * Removes the field at the specified path. If there is no field at the
         * specified path, nothing is changed.
         *
         * @param path - The field path to remove.
         */
        delete(t) {
          const e = this.field(t.popLast());
          jt(e) && e.mapValue.fields && delete e.mapValue.fields[t.lastSegment()];
        }
        isEqual(t) {
          return St(this.value, t.value);
        }
        /**
         * Returns the map that contains the leaf element of `path`. If the parent
         * entry does not yet exist, or if it is not a map, a new map will be created.
         */
        getFieldsMap(t) {
          let e = this.value;
          e.mapValue.fields || (e.mapValue = {
            fields: {}
          });
          for (let n = 0; n < t.length; ++n) {
            let r = e.mapValue.fields[t.get(n)];
            jt(r) && r.mapValue.fields || (r = {
              mapValue: {
                fields: {}
              }
            }, e.mapValue.fields[t.get(n)] = r), e = r;
          }
          return e.mapValue.fields;
        }
        /**
         * Modifies `fieldsMap` by adding, replacing or deleting the specified
         * entries.
         */
        applyChanges(t, e, n) {
          Et(e, (e2, n2) => t[e2] = n2);
          for (const e2 of n)
            delete t[e2];
        }
        clone() {
          return new de(Bt(this.value));
        }
      };
      we = class {
        constructor(t, e, n, r, s, i, o) {
          this.key = t, this.documentType = e, this.version = n, this.readTime = r, this.createTime = s, this.data = i, this.documentState = o;
        }
        /**
         * Creates a document with no known version or data, but which can serve as
         * base document for mutations.
         */
        static newInvalidDocument(t) {
          return new we(
            t,
            0,
            /* version */
            oe.min(),
            /* readTime */
            oe.min(),
            /* createTime */
            oe.min(),
            de.empty(),
            0
            /* DocumentState.SYNCED */
          );
        }
        /**
         * Creates a new document that is known to exist with the given data at the
         * given version.
         */
        static newFoundDocument(t, e, n, r) {
          return new we(
            t,
            1,
            /* version */
            e,
            /* readTime */
            oe.min(),
            /* createTime */
            n,
            r,
            0
            /* DocumentState.SYNCED */
          );
        }
        /** Creates a new document that is known to not exist at the given version. */
        static newNoDocument(t, e) {
          return new we(
            t,
            2,
            /* version */
            e,
            /* readTime */
            oe.min(),
            /* createTime */
            oe.min(),
            de.empty(),
            0
            /* DocumentState.SYNCED */
          );
        }
        /**
         * Creates a new document that is known to exist at the given version but
         * whose data is not known (e.g. a document that was updated without a known
         * base document).
         */
        static newUnknownDocument(t, e) {
          return new we(
            t,
            3,
            /* version */
            e,
            /* readTime */
            oe.min(),
            /* createTime */
            oe.min(),
            de.empty(),
            2
            /* DocumentState.HAS_COMMITTED_MUTATIONS */
          );
        }
        /**
         * Changes the document type to indicate that it exists and that its version
         * and data are known.
         */
        convertToFoundDocument(t, e) {
          return !this.createTime.isEqual(oe.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = t), this.version = t, this.documentType = 1, this.data = e, this.documentState = 0, this;
        }
        /**
         * Changes the document type to indicate that it doesn't exist at the given
         * version.
         */
        convertToNoDocument(t) {
          return this.version = t, this.documentType = 2, this.data = de.empty(), this.documentState = 0, this;
        }
        /**
         * Changes the document type to indicate that it exists at a given version but
         * that its data is not known (e.g. a document that was updated without a known
         * base document).
         */
        convertToUnknownDocument(t) {
          return this.version = t, this.documentType = 3, this.data = de.empty(), this.documentState = 2, this;
        }
        setHasCommittedMutations() {
          return this.documentState = 2, this;
        }
        setHasLocalMutations() {
          return this.documentState = 1, this.version = oe.min(), this;
        }
        setReadTime(t) {
          return this.readTime = t, this;
        }
        get hasLocalMutations() {
          return 1 === this.documentState;
        }
        get hasCommittedMutations() {
          return 2 === this.documentState;
        }
        get hasPendingWrites() {
          return this.hasLocalMutations || this.hasCommittedMutations;
        }
        isValidDocument() {
          return 0 !== this.documentType;
        }
        isFoundDocument() {
          return 1 === this.documentType;
        }
        isNoDocument() {
          return 2 === this.documentType;
        }
        isUnknownDocument() {
          return 3 === this.documentType;
        }
        isEqual(t) {
          return t instanceof we && this.key.isEqual(t.key) && this.version.isEqual(t.version) && this.documentType === t.documentType && this.documentState === t.documentState && this.data.isEqual(t.data);
        }
        mutableCopy() {
          return new we(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
        }
        toString() {
          return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
        }
      };
      me = class {
        constructor(t, e = null, n = [], r = [], s = null, i = null, o = null) {
          this.path = t, this.collectionGroup = e, this.orderBy = n, this.filters = r, this.limit = s, this.startAt = i, this.endAt = o, this.S = null;
        }
      };
      ye = class {
        /**
         * Initializes a Query with a path and optional additional query constraints.
         * Path must currently be empty if this is a collection group query.
         */
        constructor(t, e = null, n = [], r = [], s = null, i = "F", o = null, u = null) {
          this.path = t, this.collectionGroup = e, this.explicitOrderBy = n, this.filters = r, this.limit = s, this.limitType = i, this.startAt = o, this.endAt = u, this.q = null, // The corresponding `Target` of this `Query` instance.
          this.O = null, this.startAt, this.endAt;
        }
      };
      Re = class {
        constructor() {
          this._ = void 0;
        }
      };
      Pe = class extends Re {
      };
      Ve = class extends Re {
        constructor(t) {
          super(), this.elements = t;
        }
      };
      $e = class extends Re {
        constructor(t) {
          super(), this.elements = t;
        }
      };
      Ne = class extends Re {
        constructor(t, e) {
          super(), this.C = t, this.L = e;
        }
      };
      De = class {
        constructor(t, e) {
          this.field = t, this.transform = e;
        }
      };
      Fe = class {
        constructor(t, e) {
          this.updateTime = t, this.exists = e;
        }
        /** Creates a new empty Precondition. */
        static none() {
          return new Fe();
        }
        /** Creates a new Precondition with an exists flag. */
        static exists(t) {
          return new Fe(void 0, t);
        }
        /** Creates a new Precondition based on a version a document exists at. */
        static updateTime(t) {
          return new Fe(t);
        }
        /** Returns whether this Precondition is empty. */
        get isNone() {
          return void 0 === this.updateTime && void 0 === this.exists;
        }
        isEqual(t) {
          return this.exists === t.exists && (this.updateTime ? !!t.updateTime && this.updateTime.isEqual(t.updateTime) : !t.updateTime);
        }
      };
      xe = class {
      };
      Se = class extends xe {
        constructor(t, e, n, r = []) {
          super(), this.key = t, this.value = e, this.precondition = n, this.fieldTransforms = r, this.type = 0;
        }
        getFieldMask() {
          return null;
        }
      };
      qe = class extends xe {
        constructor(t, e, n, r, s = []) {
          super(), this.key = t, this.data = e, this.fieldMask = n, this.precondition = r, this.fieldTransforms = s, this.type = 1;
        }
        getFieldMask() {
          return this.fieldMask;
        }
      };
      Oe = class extends xe {
        constructor(t, e) {
          super(), this.key = t, this.precondition = e, this.type = 2, this.fieldTransforms = [];
        }
        getFieldMask() {
          return null;
        }
      };
      ke = class extends xe {
        constructor(t, e) {
          super(), this.key = t, this.precondition = e, this.type = 3, this.fieldTransforms = [];
        }
        getFieldMask() {
          return null;
        }
      };
      Ce = (() => {
        const t = {
          asc: "ASCENDING",
          desc: "DESCENDING"
        };
        return t;
      })();
      Le = (() => {
        const t = {
          "<": "LESS_THAN",
          "<=": "LESS_THAN_OR_EQUAL",
          ">": "GREATER_THAN",
          ">=": "GREATER_THAN_OR_EQUAL",
          "==": "EQUAL",
          "!=": "NOT_EQUAL",
          "array-contains": "ARRAY_CONTAINS",
          in: "IN",
          "not-in": "NOT_IN",
          "array-contains-any": "ARRAY_CONTAINS_ANY"
        };
        return t;
      })();
      Me = (() => {
        const t = {
          and: "AND",
          or: "OR"
        };
        return t;
      })();
      Ue = class {
        constructor(t, e) {
          this.databaseId = t, this.k = e;
        }
      };
      ln = class extends class {
      } {
        constructor(t, e, n, r) {
          super(), this.authCredentials = t, this.appCheckCredentials = e, this.connection = n, this.C = r, this.Z = false;
        }
        tt() {
          if (this.Z)
            throw new U(S, "The client has already been terminated.");
        }
        /** Invokes the provided RPC with auth and AppCheck tokens. */
        I(t, e, n) {
          return this.tt(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([r, s]) => this.connection.I(t, e, n, r, s)).catch((t2) => {
            throw "FirebaseError" === t2.name ? (t2.code === F && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new U(R, t2.toString());
          });
        }
        /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
        P(t, e, n, r) {
          return this.tt(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([s, i]) => this.connection.P(t, e, n, s, i, r)).catch((t2) => {
            throw "FirebaseError" === t2.name ? (t2.code === F && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), t2) : new U(R, t2.toString());
          });
        }
        terminate() {
          this.Z = true;
        }
      };
      pn = /* @__PURE__ */ new Map();
      gn = class {
        constructor(t) {
          var e;
          if (void 0 === t.host) {
            if (void 0 !== t.ssl)
              throw new U(P, "Can't provide ssl option if host option is not set");
            this.host = "firestore.googleapis.com", this.ssl = true;
          } else
            this.host = t.host, this.ssl = null === (e = t.ssl) || void 0 === e || e;
          if (this.credentials = t.credentials, this.ignoreUndefinedProperties = !!t.ignoreUndefinedProperties, void 0 === t.cacheSizeBytes)
            this.cacheSizeBytes = 41943040;
          else {
            if (-1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576)
              throw new U(P, "cacheSizeBytes must be at least 1048576");
            this.cacheSizeBytes = t.cacheSizeBytes;
          }
          this.experimentalForceLongPolling = !!t.experimentalForceLongPolling, this.experimentalAutoDetectLongPolling = !!t.experimentalAutoDetectLongPolling, this.useFetchStreams = !!t.useFetchStreams, function(t2, e2, n, r) {
            if (true === e2 && true === r)
              throw new U(P, `${t2} and ${n} cannot be used together.`);
          }("experimentalForceLongPolling", t.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", t.experimentalAutoDetectLongPolling);
        }
        isEqual(t) {
          return this.host === t.host && this.ssl === t.ssl && this.credentials === t.credentials && this.cacheSizeBytes === t.cacheSizeBytes && this.experimentalForceLongPolling === t.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === t.experimentalAutoDetectLongPolling && this.ignoreUndefinedProperties === t.ignoreUndefinedProperties && this.useFetchStreams === t.useFetchStreams;
        }
      };
      _n = class {
        /** @hideconstructor */
        constructor(t, e, n, r) {
          this._authCredentials = t, this._appCheckCredentials = e, this._databaseId = n, this._app = r, /**
           * Whether it's a Firestore or Firestore Lite instance.
           */
          this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new gn({}), this._settingsFrozen = false;
        }
        /**
         * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
         * instance.
         */
        get app() {
          if (!this._app)
            throw new U(S, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
          return this._app;
        }
        get _initialized() {
          return this._settingsFrozen;
        }
        get _terminated() {
          return void 0 !== this._terminateTask;
        }
        _setSettings(t) {
          if (this._settingsFrozen)
            throw new U(S, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
          this._settings = new gn(t), void 0 !== t.credentials && (this._authCredentials = function(t2) {
            if (!t2)
              return new Q();
            switch (t2.type) {
              case "gapi":
                const e = t2.client;
                return new K(e, t2.sessionIndex || "0", t2.iamToken || null, t2.authTokenFactory || null);
              case "provider":
                return t2.client;
              default:
                throw new U(P, "makeAuthCredentialsProvider failed due to invalid credential type");
            }
          }(t.credentials));
        }
        _getSettings() {
          return this._settings;
        }
        _freezeSettings() {
          return this._settingsFrozen = true, this._settings;
        }
        _delete() {
          return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
        }
        /** Returns a JSON-serializable representation of this `Firestore` instance. */
        toJSON() {
          return {
            app: this._app,
            databaseId: this._databaseId,
            settings: this._settings
          };
        }
        /**
         * Terminates all components used by this client. Subclasses can override
         * this method to clean up their own dependencies, but must also call this
         * method.
         *
         * Only ever called once.
         */
        _terminate() {
          return function(t) {
            const e = pn.get(t);
            e && (y("ComponentProvider", "Removing Datastore"), pn.delete(t), e.terminate());
          }(this), Promise.resolve();
        }
      };
      Pn = class {
        /** @hideconstructor */
        constructor(t, e, n) {
          this.converter = e, this._key = n, /** The type of this Firestore reference. */
          this.type = "document", this.firestore = t;
        }
        get _path() {
          return this._key.path;
        }
        /**
         * The document's identifier within its collection.
         */
        get id() {
          return this._key.path.lastSegment();
        }
        /**
         * A string representing the path of the referenced document (relative
         * to the root of the database).
         */
        get path() {
          return this._key.path.canonicalString();
        }
        /**
         * The collection this `DocumentReference` belongs to.
         */
        get parent() {
          return new $n(this.firestore, this.converter, this._key.path.popLast());
        }
        withConverter(t) {
          return new Pn(this.firestore, t, this._key);
        }
      };
      Vn = class {
        // This is the lite version of the Query class in the main SDK.
        /** @hideconstructor protected */
        constructor(t, e, n) {
          this.converter = e, this._query = n, /** The type of this Firestore reference. */
          this.type = "query", this.firestore = t;
        }
        withConverter(t) {
          return new Vn(this.firestore, t, this._query);
        }
      };
      $n = class extends Vn {
        /** @hideconstructor */
        constructor(t, e, n) {
          super(t, e, new ye(n)), this._path = n, /** The type of this Firestore reference. */
          this.type = "collection";
        }
        /** The collection's identifier. */
        get id() {
          return this._query.path.lastSegment();
        }
        /**
         * A string representing the path of the referenced collection (relative
         * to the root of the database).
         */
        get path() {
          return this._query.path.canonicalString();
        }
        /**
         * A reference to the containing `DocumentReference` if this is a
         * subcollection. If this isn't a subcollection, the reference is null.
         */
        get parent() {
          const t = this._path.popLast();
          return t.isEmpty() ? null : new Pn(
            this.firestore,
            /* converter= */
            null,
            new rt(t)
          );
        }
        withConverter(t) {
          return new $n(this.firestore, t, this._path);
        }
      };
      qn = class {
        /** @hideconstructor */
        constructor(t) {
          this._byteString = t;
        }
        /**
         * Creates a new `Bytes` object from the given Base64 string, converting it to
         * bytes.
         *
         * @param base64 - The Base64 string used to create the `Bytes` object.
         */
        static fromBase64String(t) {
          try {
            return new qn(It.fromBase64String(t));
          } catch (t2) {
            throw new U(P, "Failed to construct data from Base64 string: " + t2);
          }
        }
        /**
         * Creates a new `Bytes` object from the given Uint8Array.
         *
         * @param array - The Uint8Array used to create the `Bytes` object.
         */
        static fromUint8Array(t) {
          return new qn(It.fromUint8Array(t));
        }
        /**
         * Returns the underlying bytes as a Base64-encoded string.
         *
         * @returns The Base64-encoded string created from the `Bytes` object.
         */
        toBase64() {
          return this._byteString.toBase64();
        }
        /**
         * Returns the underlying bytes in a new `Uint8Array`.
         *
         * @returns The Uint8Array created from the `Bytes` object.
         */
        toUint8Array() {
          return this._byteString.toUint8Array();
        }
        /**
         * Returns a string representation of the `Bytes` object.
         *
         * @returns A string representation of the `Bytes` object.
         */
        toString() {
          return "Bytes(base64: " + this.toBase64() + ")";
        }
        /**
         * Returns true if this `Bytes` object is equal to the provided one.
         *
         * @param other - The `Bytes` object to compare against.
         * @returns true if this `Bytes` object is equal to the provided one.
         */
        isEqual(t) {
          return this._byteString.isEqual(t._byteString);
        }
      };
      On = class {
        /**
         * Creates a `FieldPath` from the provided field names. If more than one field
         * name is provided, the path will point to a nested field in a document.
         *
         * @param fieldNames - A list of field names.
         */
        constructor(...t) {
          for (let e = 0; e < t.length; ++e)
            if (0 === t[e].length)
              throw new U(P, "Invalid field name at argument $(i + 1). Field names must not be empty.");
          this._internalPath = new nt(t);
        }
        /**
         * Returns true if this `FieldPath` is equal to the provided one.
         *
         * @param other - The `FieldPath` to compare against.
         * @returns true if this `FieldPath` is equal to the provided one.
         */
        isEqual(t) {
          return this._internalPath.isEqual(t._internalPath);
        }
      };
      Cn = class {
        /**
         * @param _methodName - The public API endpoint that returns this class.
         * @hideconstructor
         */
        constructor(t) {
          this._methodName = t;
        }
      };
      Ln = class {
        /**
         * Creates a new immutable `GeoPoint` object with the provided latitude and
         * longitude values.
         * @param latitude - The latitude as number between -90 and 90.
         * @param longitude - The longitude as number between -180 and 180.
         */
        constructor(t, e) {
          if (!isFinite(t) || t < -90 || t > 90)
            throw new U(P, "Latitude must be a number between -90 and 90, but was: " + t);
          if (!isFinite(e) || e < -180 || e > 180)
            throw new U(P, "Longitude must be a number between -180 and 180, but was: " + e);
          this._lat = t, this._long = e;
        }
        /**
         * The latitude of this `GeoPoint` instance.
         */
        get latitude() {
          return this._lat;
        }
        /**
         * The longitude of this `GeoPoint` instance.
         */
        get longitude() {
          return this._long;
        }
        /**
         * Returns true if this `GeoPoint` is equal to the provided one.
         *
         * @param other - The `GeoPoint` to compare against.
         * @returns true if this `GeoPoint` is equal to the provided one.
         */
        isEqual(t) {
          return this._lat === t._lat && this._long === t._long;
        }
        /** Returns a JSON-serializable representation of this GeoPoint. */
        toJSON() {
          return {
            latitude: this._lat,
            longitude: this._long
          };
        }
        /**
         * Actually private to JS consumers of our API, so this function is prefixed
         * with an underscore.
         */
        _compareTo(t) {
          return _t(this._lat, t._lat) || _t(this._long, t._long);
        }
      };
      Mn = /^__.*__$/;
      Un = class {
        constructor(t, e, n) {
          this.data = t, this.fieldMask = e, this.fieldTransforms = n;
        }
        toMutation(t, e) {
          return null !== this.fieldMask ? new qe(t, this.data, this.fieldMask, e, this.fieldTransforms) : new Se(t, this.data, e, this.fieldTransforms);
        }
      };
      jn = class {
        constructor(t, e, n) {
          this.data = t, this.fieldMask = e, this.fieldTransforms = n;
        }
        toMutation(t, e) {
          return new qe(t, this.data, this.fieldMask, e, this.fieldTransforms);
        }
      };
      Qn = class {
        /**
         * Initializes a ParseContext with the given source and path.
         *
         * @param settings - The settings for the parser.
         * @param databaseId - The database ID of the Firestore instance.
         * @param serializer - The serializer to use to generate the Value proto.
         * @param ignoreUndefinedProperties - Whether to ignore undefined properties
         * rather than throw.
         * @param fieldTransforms - A mutable list of field transforms encountered
         * while parsing the data.
         * @param fieldMask - A mutable list of field paths encountered while parsing
         * the data.
         *
         * TODO(b/34871131): We don't support array paths right now, so path can be
         * null to indicate the context represents any location within an array (in
         * which case certain features will not work and errors will be somewhat
         * compromised).
         */
        constructor(t, e, n, r, s, i) {
          this.settings = t, this.databaseId = e, this.C = n, this.ignoreUndefinedProperties = r, // Minor hack: If fieldTransforms is undefined, we assume this is an
          // external call and we need to validate the entire path.
          void 0 === s && this.et(), this.fieldTransforms = s || [], this.fieldMask = i || [];
        }
        get path() {
          return this.settings.path;
        }
        get nt() {
          return this.settings.nt;
        }
        /** Returns a new context with the specified settings overwritten. */
        rt(t) {
          return new Qn(Object.assign(Object.assign({}, this.settings), t), this.databaseId, this.C, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
        }
        st(t) {
          var e;
          const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), r = this.rt({
            path: n,
            it: false
          });
          return r.ot(t), r;
        }
        ut(t) {
          var e;
          const n = null === (e = this.path) || void 0 === e ? void 0 : e.child(t), r = this.rt({
            path: n,
            it: false
          });
          return r.et(), r;
        }
        ct(t) {
          return this.rt({
            path: void 0,
            it: true
          });
        }
        at(t) {
          return hr(t, this.settings.methodName, this.settings.ht || false, this.path, this.settings.lt);
        }
        /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
        contains(t) {
          return void 0 !== this.fieldMask.find((e) => t.isPrefixOf(e)) || void 0 !== this.fieldTransforms.find((e) => t.isPrefixOf(e.field));
        }
        et() {
          if (this.path)
            for (let t = 0; t < this.path.length; t++)
              this.ot(this.path.get(t));
        }
        ot(t) {
          if (0 === t.length)
            throw this.at("Document fields must not be empty");
          if (Bn(this.nt) && Mn.test(t))
            throw this.at('Document fields cannot begin and end with "__"');
        }
      };
      zn = class {
        constructor(t, e, n) {
          this.databaseId = t, this.ignoreUndefinedProperties = e, this.C = n || an(t);
        }
        /** Creates a new top-level parse context. */
        ft(t, e, n, r = false) {
          return new Qn({
            nt: t,
            methodName: e,
            lt: n,
            path: nt.emptyPath(),
            it: false,
            ht: r
          }, this.databaseId, this.C, this.ignoreUndefinedProperties);
        }
      };
      Kn = class extends Cn {
        _toFieldTransform(t) {
          if (2 !== t.nt)
            throw 1 === t.nt ? t.at(`${this._methodName}() can only appear at the top level of your update data`) : t.at(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
          return t.fieldMask.push(t.path), null;
        }
        isEqual(t) {
          return t instanceof Kn;
        }
      };
      Jn = class extends Cn {
        constructor(t, e) {
          super(t), this.dt = e;
        }
        _toFieldTransform(t) {
          const e = Yn(
            this,
            t,
            /*array=*/
            true
          ), n = this.dt.map((t2) => rr(t2, e)), r = new Ve(n);
          return new De(t.path, r);
        }
        isEqual(t) {
          return this === t;
        }
      };
      cr = new RegExp("[~\\*/\\[\\]]");
      fr = class {
        // Note: This class is stripped down version of the DocumentSnapshot in
        // the legacy SDK. The changes are:
        // - No support for SnapshotMetadata.
        // - No support for SnapshotOptions.
        /** @hideconstructor protected */
        constructor(t, e, n, r, s) {
          this._firestore = t, this._userDataWriter = e, this._key = n, this._document = r, this._converter = s;
        }
        /** Property of the `DocumentSnapshot` that provides the document's ID. */
        get id() {
          return this._key.path.lastSegment();
        }
        /**
         * The `DocumentReference` for the document included in the `DocumentSnapshot`.
         */
        get ref() {
          return new Pn(this._firestore, this._converter, this._key);
        }
        /**
         * Signals whether or not the document at the snapshot's location exists.
         *
         * @returns true if the document exists.
         */
        exists() {
          return null !== this._document;
        }
        /**
         * Retrieves all fields in the document as an `Object`. Returns `undefined` if
         * the document doesn't exist.
         *
         * @returns An `Object` containing all fields in the document or `undefined`
         * if the document doesn't exist.
         */
        data() {
          if (this._document) {
            if (this._converter) {
              const t = new dr(
                this._firestore,
                this._userDataWriter,
                this._key,
                this._document,
                /* converter= */
                null
              );
              return this._converter.fromFirestore(t);
            }
            return this._userDataWriter.convertValue(this._document.data.value);
          }
        }
        /**
         * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
         * document or field doesn't exist.
         *
         * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
         * field.
         * @returns The data at the specified field location or undefined if no such
         * field exists in the document.
         */
        // We are using `any` here to avoid an explicit cast by our users.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get(t) {
          if (this._document) {
            const e = this._document.data.field(pr("DocumentSnapshot.get", t));
            if (null !== e)
              return this._userDataWriter.convertValue(e);
          }
        }
      };
      dr = class extends fr {
        /**
         * Retrieves all fields in the document as an `Object`.
         *
         * @override
         * @returns An `Object` containing all fields in the document.
         */
        data() {
          return super.data();
        }
      };
      wr = class {
        /** @hideconstructor */
        constructor(t, e) {
          this._docs = e, this.query = t;
        }
        /** An array of all the documents in the `QuerySnapshot`. */
        get docs() {
          return [...this._docs];
        }
        /** The number of documents in the `QuerySnapshot`. */
        get size() {
          return this.docs.length;
        }
        /** True if there are no documents in the `QuerySnapshot`. */
        get empty() {
          return 0 === this.docs.length;
        }
        /**
         * Enumerates all of the documents in the `QuerySnapshot`.
         *
         * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
         * each document in the snapshot.
         * @param thisArg - The `this` binding for the callback.
         */
        forEach(t, e) {
          this._docs.forEach(t, e);
        }
      };
      Br = class extends class {
        convertValue(t, e = "none") {
          switch (xt(t)) {
            case 0:
              return null;
            case 1:
              return t.booleanValue;
            case 2:
              return Rt(t.integerValue || t.doubleValue);
            case 3:
              return this.convertTimestamp(t.timestampValue);
            case 4:
              return this.convertServerTimestamp(t, e);
            case 5:
              return t.stringValue;
            case 6:
              return this.convertBytes(Pt(t.bytesValue));
            case 7:
              return this.convertReference(t.referenceValue);
            case 8:
              return this.convertGeoPoint(t.geoPointValue);
            case 9:
              return this.convertArray(t.arrayValue, e);
            case 10:
              return this.convertObject(t.mapValue, e);
            default:
              throw b();
          }
        }
        convertObject(t, e) {
          const n = {};
          return Et(t.fields, (t2, r) => {
            n[t2] = this.convertValue(r, e);
          }), n;
        }
        convertGeoPoint(t) {
          return new Ln(Rt(t.latitude), Rt(t.longitude));
        }
        convertArray(t, e) {
          return (t.values || []).map((t2) => this.convertValue(t2, e));
        }
        convertServerTimestamp(t, e) {
          switch (e) {
            case "previous":
              const n = Nt(t);
              return null == n ? null : this.convertValue(n, e);
            case "estimate":
              return this.convertTimestamp(Dt(t));
            default:
              return null;
          }
        }
        convertTimestamp(t) {
          const e = At(t);
          return new Vt(e.seconds, e.nanos);
        }
        convertDocumentKey(t, e) {
          const n = tt.fromString(t);
          E(cn(n));
          const r = new X(n.get(1), n.get(3)), s = new rt(n.popFirst(5));
          return r.isEqual(e) || // TODO(b/64130202): Somehow support foreign references.
          g(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`), s;
        }
      } {
        constructor(t) {
          super(), this.firestore = t;
        }
        convertBytes(t) {
          return new qn(t);
        }
        convertReference(t) {
          const e = this.convertDocumentKey(t, this.firestore._databaseId);
          return new Pn(
            this.firestore,
            /* converter= */
            null,
            e
          );
        }
      };
      !function(t) {
        w = t;
      }(`${SDK_VERSION}_lite`), _registerComponent(new Component("firestore/lite", (t, { instanceIdentifier: e, options: n }) => {
        const r = t.getProvider("app").getImmediate(), s = new _n(new W(t.getProvider("auth-internal")), new H(t.getProvider("app-check-internal")), function(t2, e2) {
          if (!Object.prototype.hasOwnProperty.apply(t2.options, ["projectId"]))
            throw new U(P, '"projectId" not provided in firebase.initializeApp.');
          return new X(t2.options.projectId, e2);
        }(r, e), r);
        return n && s._setSettings(n), s;
      }, "PUBLIC").setMultipleInstances(true)), // RUNTIME_ENV and BUILD_TARGET are replaced by real values during the compilation
      registerVersion("firestore-lite", "3.8.0", ""), registerVersion("firestore-lite", "3.8.0", "esm2017");
    }
  });

  // node_modules/firebase/firestore/lite/dist/esm/index.esm.js
  var init_index_esm2 = __esm({
    "node_modules/firebase/firestore/lite/dist/esm/index.esm.js"() {
      init_index_browser_esm2017();
    }
  });

  // js/firestore-api.js
  var firestore_api_exports = {};
  __export(firestore_api_exports, {
    db: () => db,
    getPosts: () => getPosts,
    newComment: () => newComment,
    newLikes: () => newLikes,
    newPost: () => newPost
  });
  async function getPosts(db2) {
    const posts = Nn(db2, "/posts");
    postsSnapshot = await zr(posts);
    return postsSnapshot.docs;
  }
  async function newPost(db2, author, text) {
    const postRef = await Yr(Nn(db2, "posts"), {
      author,
      text,
      likes: 0,
      comments: []
    }).then(function(postRef2) {
      console.log("Document written with ID: ", postRef2.id);
    }).catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }
  async function newComment(db2, postDoc, commentText) {
    const posts = Fn(db2, `posts/${postDoc}`);
    await Gr(posts, {
      comments: ts(commentText)
    });
  }
  async function newLikes(db2, postDoc) {
    const posts = Fn(db2, `posts/${postDoc}`);
    await Gr(posts, {
      likes: increment(1)
    });
  }
  var firebaseConfig, app, db;
  var init_firestore_api = __esm({
    "js/firestore-api.js"() {
      init_index_esm();
      init_index_esm2();
      firebaseConfig = {
        apiKey: "AIzaSyADwKiflDgXfEiSPe0Oome7ivlgxsNKTcc",
        authDomain: "mitreality.firebaseapp.com",
        databaseURL: "https://mitreality-default-rtdb.firebaseio.com",
        projectId: "mitreality",
        storageBucket: "mitreality.appspot.com",
        messagingSenderId: "895952725895",
        appId: "1:895952725895:web:b40a2574c470a1fe6d1522",
        measurementId: "G-LR2JTML4BT"
      };
      app = initializeApp(firebaseConfig);
      db = bn(app);
    }
  });

  // js/planetOnCollision.js
  var planetOnCollision_exports = {};
  var init_planetOnCollision = __esm({
    "js/planetOnCollision.js"() {
      init_html_ui();
      WL.registerComponent("planetOnCollision", {
        material_org: { type: WL.Type.Material },
        material_change: { type: WL.Type.Material },
        postPreviewObj: { type: WL.Type.Object }
      }, {
        init: function() {
          console.log("init() with param", this.param);
        },
        start: function() {
          var cursor = this.object.getComponent("cursor-target");
          var selected = false;
          cursor.addClickFunction((o) => {
            if (!selected) {
              find_planet = this.object.getComponent("planetPostInfo");
              if (find_planet != null) {
                currentlyClicked.clicked = find_planet.planet_id;
                console.log("Clicked");
              }
              var newMesh = this.object.getComponent("mesh");
              newMesh.material = this.material_change;
              var allInactiveButtons = document.querySelectorAll(".inactive_button");
              allInactiveButtons.forEach((element) => {
                element.className = "active_button";
                element.disabled = false;
              });
              if (planets.length > 0) {
                this.postPreviewObj.getComponent("uiHandler").setPost(planets[currentlyClicked].data.text);
                this.postPreviewObj.active = true;
              }
              this.postPreviewObj.setTranslationWorld(glMatrix.vec3.add([], this.object.getTranslationWorld([]), [0, 2, 0]));
              selected = true;
            } else {
              var newMesh = this.object.getComponent("mesh");
              newMesh.material = this.material_org;
              var allActiveButtons = document.querySelectorAll(".active_button");
              allActiveButtons.forEach((element) => {
                element.className = "inactive_button";
                element.disabled = true;
              });
              this.postPreviewObj.active = false;
              selected = false;
            }
          });
        },
        update: function(dt2) {
        }
      });
    }
  });

  // js/html-ui.js
  var html_ui_exports = {};
  __export(html_ui_exports, {
    currentlyClicked: () => currentlyClicked,
    planets: () => planets
  });
  var HTMLCode, planets, currentlyClicked;
  var init_html_ui = __esm({
    "js/html-ui.js"() {
      init_firestore_api();
      init_planetOnCollision();
      HTMLCode = `
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css');

h2 {
  color: white;
}

.post_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
} 


.post_button:after {
  content: "";
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
}

.post_button:active {
  transform: translateY(-3px);
  background-color: #bbb;
}

.post_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.active_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
} 


.active_button:after {
  content: "";
  position: absolute;
  padding-top: 300%;
  padding-left: 350%;
  margin-left: -20px !important;
  margin-top: -120%;
  opacity: 0;
}

.active_button:active {
  transform: translateY(-3px);
  background-color: #bbb;
}

.active_button:active:after {
  padding: 0;
  margin: 0;
  opacity: 1;
  transition: 0s
}

.inactive_button {
  position: relative;
  border: none;
  border-radius: 45px;
  font-size: 12px; 
  color: #000;
  background-color: #fff;
  padding: 10px 21px; 
  width: 60px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 400;
  overflow: hidden;
  opacity: 0.4;

  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer; 
  outline: none;
}

.content {
  padding: 10px;
}

.center {
  margin: auto;
  width: 50%;
  padding: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}
.postForm {
  
  border-radius: 1px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  transition: all 0.2s ease-in-out;
  position: absolute; 

  --width-of-input: 200px;
  --border-height: 1px; 
  --border-before-color: #C8D3D5;
  --border-after-color: #628F93; 
    width: var(--width-of-input);  

  top: 25%;  /* center the form vertically */
  left: 50%; /* center the form horizontally */
  transform: translate(-50%, -50%); /* adjust the position */
}


/* styling of Input */
.input {
 color: #fff;
 font-size: 0.9rem;
 background-color: transparent;
 width: 100%;
 box-sizing: border-box;
 padding-inline: 0.5em;
 padding-block: 0.7em;
 border: none;
 border-bottom: var(--border-height) solid var(--border-before-color);
}

/* styling of animated border */
.input-border {
 position: absolute;
 background: var(--border-after-color);
 width: 0%;
 height: 2px;
 bottom: 0;
 left: 0;
 transition: 0.3s;
}

/* Hover on Input */
input:hover {
 background: var(--input-hovered-color);
}

input:focus {
 outline: none;
}
/* here is code of animated border */
input:focus ~ .input-border {
 width: 100%;
}

/* We disable "pointer-events" on the parent, because it needs to
 * let through any events to the canvas. But for any direct children
 * of the content, we still want clicking/hovering etc */
.content > * {
  pointer-events: auto;
}
</style>
<div id="post-form" style="display: none;" class='content postForm'>
  <form>
    <label for="author">Author:</label>
    <input class="input" placeholder="Enter your name" id="author" name="author" required>
    <br>
    <label for="text">Text:</label>
    <textarea class="input" Placeholder="Type here" name="text" id="text" required></textarea>
    <br>
    <button type="button" id="submit-button" onclick="submitPost()">Submit</button>
    <button type="button" id="close-post-button" onclick="closePost()">Close</button>
  </form>
</div>

<div id="comment-form" style="display: none;" class='content postForm'>
  <form>
    <label for="text">Comment:</label>
    <textarea class="input" Placeholder="Type here" name="comment" id="comment" required></textarea>
    <br>
    <button type="button" id="submit-button" onclick="closeComment()">Submit</button>
  </form>
</div>

<div class='button-container'>
  <div class='content'>
  <button class="inactive_button" onclick="openComment()" disabled><i class="fas fa-comment"></i></button>
  </div>

  <div class='content'>
  <button class="inactive_button" onclick="likePost()" disabled><i class="fas fa-heart"></i></button>
  </div>

  <div class='content'>
  <button class="post_button" onclick="openPost()"><i class="fas fa-pen"></i></button>
  </div>
</div>
`;
      planets = /* @__PURE__ */ new Map();
      currentlyClicked = { clicked: null };
      window.openPost = function() {
        document.getElementById("post-form").style.display = "block";
      };
      window.submitPost = function() {
        document.getElementById("post-form").style.display = "none";
        newPost(db, document.getElementById("author").value, document.getElementById("text").value);
      };
      window.closePost = function() {
        document.getElementById("post-form").style.display = "none";
      };
      window.openComment = function() {
        document.getElementById("comment-form").style.display = "block";
      };
      window.submitComment = function() {
        document.getElementById("comment-form").style.display = "none";
        if (currentlyClicked) {
          newComment(db, currentlyClicked, document.getElementById("comment").value);
        } else {
          console.error("No plannet is clicked, how did u get here???");
        }
      };
      window.likePost = function() {
        if (void 0 != null) {
          newLikes(db, void 0);
        }
      };
      WL.registerComponent("html-ui", {}, {
        start: function() {
          const div = document.createElement("div");
          div.style.position = "fixed";
          div.style.top = 0;
          div.style.display = "box";
          div.style.width = "100%";
          div.style.height = "100%";
          div.style.pointerEvents = "none";
          div.innerHTML = HTMLCode;
          document.body.appendChild(div);
        }
      });
    }
  });

  // node_modules/wasm-feature-detect/dist/esm/index.js
  var init_esm = __esm({
    "node_modules/wasm-feature-detect/dist/esm/index.js"() {
    }
  });

  // node_modules/@wonderlandengine/api/wonderland.js
  function allocateTempMemory(size) {
    console.log("Allocating temp mem:", size);
    _tempMemSize = size;
    if (_tempMem)
      _free(_tempMem);
    _tempMem = _malloc(_tempMemSize);
    updateTempMemory();
  }
  function requireTempMem(size) {
    if (_tempMemSize >= size)
      return;
    allocateTempMemory(Math.ceil(size / 1024) * 1024);
  }
  function updateTempMemory() {
    _tempMemFloat = new Float32Array(HEAP8.buffer, _tempMem, _tempMemSize >> 2);
    _tempMemInt = new Int32Array(HEAP8.buffer, _tempMem, _tempMemSize >> 2);
    _tempMemUint32 = new Uint32Array(HEAP8.buffer, _tempMem, _tempMemSize >> 2);
    _tempMemUint16 = new Uint16Array(HEAP8.buffer, _tempMem, _tempMemSize >> 1);
    _tempMemUint8 = new Uint8Array(HEAP8.buffer, _tempMem, _tempMemSize);
  }
  function getTempBufferU16(count) {
    requireTempMem(count * 2);
    return _tempMemUint16;
  }
  function getTempBufferF32(count) {
    requireTempMem(count * 4);
    return _tempMemFloat;
  }
  function isString(value) {
    return value && (typeof value === "string" || value.constructor === String);
  }
  function _wrapObject(objectId) {
    const o = ObjectCache[objectId] || (ObjectCache[objectId] = new $Object(objectId));
    o.objectId = objectId;
    return o;
  }
  function _wrapComponent(type, componentType, componentId) {
    if (componentId < 0)
      return null;
    const c = ComponentCache[componentType] || (ComponentCache[componentType] = []);
    if (c[componentId]) {
      return c[componentId];
    }
    let component;
    if (type == "collision") {
      component = new CollisionComponent(componentType, componentId);
    } else if (type == "text") {
      component = new TextComponent(componentType, componentId);
    } else if (type == "view") {
      component = new ViewComponent(componentType, componentId);
    } else if (type == "mesh") {
      component = new MeshComponent(componentType, componentId);
    } else if (type == "input") {
      component = new InputComponent(componentType, componentId);
    } else if (type == "light") {
      component = new LightComponent(componentType, componentId);
    } else if (type == "animation") {
      component = new AnimationComponent(componentType, componentId);
    } else if (type == "physx") {
      component = new PhysXComponent(componentType, componentId);
    } else {
      const typeIndex = _WL._componentTypeIndices[type];
      const constructor = _WL._componentTypes[typeIndex];
      component = new constructor();
    }
    component._manager = componentType;
    component._id = componentId;
    c[componentId] = component;
    return component;
  }
  var ComponentCache, ObjectCache, EXCLUDED_COMPONENT_PROPERTIES, Type, _componentDefaults, Collider, Alignment, Justification, TextEffect, InputType, LightType, AnimationState, ForceMode, CollisionEventType, Shape, MeshAttribute, MaterialParamType, xrSession, physics, _images, _tempMem, _tempMemSize, _tempMemFloat, _tempMemInt, _tempMemUint32, _tempMemUint16, _tempMemUint8, UP_VECTOR, Component2, CollisionComponent, TextComponent, ViewComponent, InputComponent, LightComponent, AnimationComponent, MeshComponent, PhysXComponent, MeshIndexType, Mesh, MeshAttributeAccessor, Material, tempCanvas, Texture, textures, Animation, $Object, Skin;
  var init_wonderland = __esm({
    "node_modules/@wonderlandengine/api/wonderland.js"() {
      ComponentCache = {};
      ObjectCache = [];
      EXCLUDED_COMPONENT_PROPERTIES = ["_id", "_manager", "type", "_type", "active"];
      (function(Type2) {
        Type2[Type2["Bool"] = 2] = "Bool";
        Type2[Type2["Int"] = 4] = "Int";
        Type2[Type2["Float"] = 8] = "Float";
        Type2[Type2["String"] = 16] = "String";
        Type2[Type2["Enum"] = 32] = "Enum";
        Type2[Type2["Object"] = 64] = "Object";
        Type2[Type2["Mesh"] = 128] = "Mesh";
        Type2[Type2["Texture"] = 256] = "Texture";
        Type2[Type2["Material"] = 512] = "Material";
        Type2[Type2["Animation"] = 1024] = "Animation";
        Type2[Type2["Skin"] = 2048] = "Skin";
      })(Type || (Type = {}));
      _componentDefaults = new Array(6);
      _componentDefaults[Type.Bool] = false;
      _componentDefaults[Type.Int] = 0;
      _componentDefaults[Type.Float] = 0;
      _componentDefaults[Type.String] = "";
      _componentDefaults[Type.Enum] = 0;
      _componentDefaults[Type.Object] = null;
      _componentDefaults[Type.Mesh] = null;
      _componentDefaults[Type.Texture] = null;
      _componentDefaults[Type.Material] = null;
      _componentDefaults[Type.Animation] = null;
      _componentDefaults[Type.Skin] = null;
      (function(Collider2) {
        Collider2[Collider2["Sphere"] = 0] = "Sphere";
        Collider2[Collider2["AxisAlignedBox"] = 1] = "AxisAlignedBox";
        Collider2[Collider2["Box"] = 2] = "Box";
      })(Collider || (Collider = {}));
      (function(Alignment2) {
        Alignment2[Alignment2["Left"] = 1] = "Left";
        Alignment2[Alignment2["Center"] = 2] = "Center";
        Alignment2[Alignment2["Right"] = 3] = "Right";
      })(Alignment || (Alignment = {}));
      (function(Justification2) {
        Justification2[Justification2["Line"] = 1] = "Line";
        Justification2[Justification2["Middle"] = 2] = "Middle";
        Justification2[Justification2["Top"] = 3] = "Top";
        Justification2[Justification2["Bottom"] = 4] = "Bottom";
      })(Justification || (Justification = {}));
      (function(TextEffect2) {
        TextEffect2[TextEffect2["None"] = 0] = "None";
        TextEffect2[TextEffect2["Outline"] = 1] = "Outline";
      })(TextEffect || (TextEffect = {}));
      (function(InputType2) {
        InputType2[InputType2["Head"] = 0] = "Head";
        InputType2[InputType2["EyeLeft"] = 1] = "EyeLeft";
        InputType2[InputType2["EyeRight"] = 2] = "EyeRight";
        InputType2[InputType2["ControllerLeft"] = 3] = "ControllerLeft";
        InputType2[InputType2["ControllerRight"] = 4] = "ControllerRight";
        InputType2[InputType2["RayLeft"] = 5] = "RayLeft";
        InputType2[InputType2["RayRight"] = 6] = "RayRight";
      })(InputType || (InputType = {}));
      (function(LightType2) {
        LightType2[LightType2["Point"] = 1] = "Point";
        LightType2[LightType2["Spot"] = 2] = "Spot";
        LightType2[LightType2["Sun"] = 3] = "Sun";
      })(LightType || (LightType = {}));
      (function(AnimationState2) {
        AnimationState2[AnimationState2["Playing"] = 1] = "Playing";
        AnimationState2[AnimationState2["Paused"] = 2] = "Paused";
        AnimationState2[AnimationState2["Stopped"] = 3] = "Stopped";
      })(AnimationState || (AnimationState = {}));
      (function(ForceMode2) {
        ForceMode2[ForceMode2["Force"] = 0] = "Force";
        ForceMode2[ForceMode2["Impulse"] = 1] = "Impulse";
        ForceMode2[ForceMode2["VelocityChange"] = 2] = "VelocityChange";
        ForceMode2[ForceMode2["Acceleration"] = 3] = "Acceleration";
      })(ForceMode || (ForceMode = {}));
      (function(CollisionEventType2) {
        CollisionEventType2[CollisionEventType2["Touch"] = 0] = "Touch";
        CollisionEventType2[CollisionEventType2["TouchLost"] = 1] = "TouchLost";
        CollisionEventType2[CollisionEventType2["TriggerTouch"] = 2] = "TriggerTouch";
        CollisionEventType2[CollisionEventType2["TriggerTouchLost"] = 3] = "TriggerTouchLost";
      })(CollisionEventType || (CollisionEventType = {}));
      (function(Shape2) {
        Shape2[Shape2["None"] = 0] = "None";
        Shape2[Shape2["Sphere"] = 1] = "Sphere";
        Shape2[Shape2["Capsule"] = 2] = "Capsule";
        Shape2[Shape2["Box"] = 3] = "Box";
        Shape2[Shape2["Plane"] = 4] = "Plane";
        Shape2[Shape2["ConvexMesh"] = 5] = "ConvexMesh";
        Shape2[Shape2["TriangleMesh"] = 6] = "TriangleMesh";
      })(Shape || (Shape = {}));
      (function(MeshAttribute2) {
        MeshAttribute2[MeshAttribute2["Position"] = 0] = "Position";
        MeshAttribute2[MeshAttribute2["Tangent"] = 1] = "Tangent";
        MeshAttribute2[MeshAttribute2["Normal"] = 2] = "Normal";
        MeshAttribute2[MeshAttribute2["TextureCoordinate"] = 3] = "TextureCoordinate";
        MeshAttribute2[MeshAttribute2["Color"] = 4] = "Color";
        MeshAttribute2[MeshAttribute2["JointId"] = 5] = "JointId";
        MeshAttribute2[MeshAttribute2["JointWeight"] = 6] = "JointWeight";
        MeshAttribute2[MeshAttribute2["SecondaryJointId"] = 7] = "SecondaryJointId";
        MeshAttribute2[MeshAttribute2["SecondaryJointWeight"] = 8] = "SecondaryJointWeight";
      })(MeshAttribute || (MeshAttribute = {}));
      (function(MaterialParamType2) {
        MaterialParamType2[MaterialParamType2["UnsignedInt"] = 0] = "UnsignedInt";
        MaterialParamType2[MaterialParamType2["Int"] = 1] = "Int";
        MaterialParamType2[MaterialParamType2["Float"] = 2] = "Float";
        MaterialParamType2[MaterialParamType2["Sampler"] = 3] = "Sampler";
        MaterialParamType2[MaterialParamType2["Font"] = 4] = "Font";
      })(MaterialParamType || (MaterialParamType = {}));
      xrSession = null;
      physics = void 0;
      _images = [];
      _tempMem = null;
      _tempMemSize = 0;
      _tempMemFloat = null;
      _tempMemInt = null;
      _tempMemUint32 = null;
      _tempMemUint16 = null;
      _tempMemUint8 = null;
      UP_VECTOR = [0, 1, 0];
      Component2 = class {
        /**
         * Create a new instance
         *
         * @param managerIndex Index of the manager.
         * @param id WASM component instance index.
         *
         * @hidden
         */
        constructor(managerIndex = -1, id = -1) {
          this._manager = managerIndex;
          this._id = id;
          this._object = null;
          this._type = null;
        }
        /** The name of this component's type */
        get type() {
          return this._type || $Object._typeNameFor(this._manager);
        }
        /** The object this component is attached to. */
        get object() {
          if (!this._object) {
            const objectId = _wl_component_get_object(this._manager, this._id);
            this._object = _wrapObject(objectId);
          }
          return this._object;
        }
        /**
         * Set whether this component is active.
         *
         * Activating/deactivating a component comes at a small cost of reordering
         * components in the respective component manager. This function therefore
         * is not a trivial assignment.
         *
         * Does nothing if the component is already activated/deactivated.
         *
         * @param active New active state.
         */
        set active(active) {
          _wl_component_setActive(this._manager, this._id, active);
        }
        /**
         * Whether this component is active
         */
        get active() {
          return _wl_component_isActive(this._manager, this._id) != 0;
        }
        /**
         * Remove this component from its objects and destroy it.
         *
         * It is best practice to set the component to `null` after,
         * to ensure it does not get used later.
         *
         * ```js
         *    c.destroy();
         *    c = null;
         * ```
         * @since 0.9.0
         */
        destroy() {
          _wl_component_remove(this._manager, this._id);
          this._manager = void 0;
          this._id = void 0;
        }
        /**
         * Checks equality by comparing whether the wrapped native component ids
         * and component manager types are equal.
         *
         * @param otherComponent Component to check equality with.
         * @returns Whether this component equals the given component.
         */
        equals(otherComponent) {
          if (!otherComponent)
            return false;
          return this._manager == otherComponent._manager && this._id == otherComponent._id;
        }
      };
      CollisionComponent = class extends Component2 {
        /** Collision component collider */
        get collider() {
          return _wl_collision_component_get_collider(this._id);
        }
        /**
         * Set collision component collider.
         *
         * @param collider Collider of the collision component.
         */
        set collider(collider) {
          _wl_collision_component_set_collider(this._id, collider);
        }
        /**
         * Collision component extents.
         *
         * If {@link collider} returns {@link Collider.Sphere}, only the first
         * component of the returned vector is used.
         */
        get extents() {
          return new Float32Array(HEAPF32.buffer, _wl_collision_component_get_extents(this._id), 3);
        }
        /**
         * Set collision component extents.
         *
         * If {@link collider} returns {@link Collider.Sphere}, only the first
         * component of the passed vector is used.
         *
         * Example:
         *
         * ```js
         * // Spans 1 unit on the x-axis, 2 on the y-axis, 3 on the z-axis.
         * collision.extent = [1, 2, 3];
         * ```
         *
         * @param extents Extents of the collision component, expects a
         *      3 component array.
         */
        set extents(extents) {
          this.extents.set(extents);
        }
        /**
         * Collision component group.
         *
         * The groups is a bitmask that is compared to other components in {@link CollisionComponent#queryOverlaps}
         * or the group in {@link Scene#rayCast}.
         *
         * Colliders that have no common groups will not overlap with each other. If a collider
         * has none of the groups set for {@link Scene#rayCast}, the ray will not hit it.
         *
         * Each bit represents belonging to a group, see example.
         *
         * ```js
         *    // c belongs to group 2
         *    c.group = (1 << 2);
         *
         *    // c belongs to group 0
         *    c.group = (1 << 0);
         *
         *    // c belongs to group 0 *and* 2
         *    c.group = (1 << 0) | (1 << 2);
         *
         *    (c.group & (1 << 2)) != 0; // true
         *    (c.group & (1 << 7)) != 0; // false
         * ```
         */
        get group() {
          return _wl_collision_component_get_group(this._id);
        }
        /**
         * Set collision component group.
         *
         * @param group Group mask of the collision component.
         */
        set group(group) {
          _wl_collision_component_set_group(this._id, group);
        }
        /**
         * Query overlapping objects.
         *
         * Usage:
         *
         * ```js
         * const collision = object.getComponent('collision');
         * const overlaps = collision.queryOverlaps();
         * for(const otherCollision of overlaps) {
         *     const otherObject = otherCollision.object;
         *     console.log(`Collision with object ${otherObject.objectId}`);
         * }
         * ```
         *
         * @returns Collision components overlapping this collider.
         */
        queryOverlaps() {
          const count = _wl_collision_component_query_overlaps(this._id, _tempMem, _tempMemSize >> 1);
          let overlaps = new Array(count);
          for (let i = 0; i < count; ++i) {
            overlaps[i] = new CollisionComponent(this._manager, _tempMemUint16[i]);
          }
          return overlaps;
        }
      };
      TextComponent = class extends Component2 {
        /** Text component alignment. */
        get alignment() {
          return _wl_text_component_get_horizontal_alignment(this._id);
        }
        /**
         * Set text component alignment.
         *
         * @param alignment Alignment for the text component.
         */
        set alignment(alignment) {
          _wl_text_component_set_horizontal_alignment(this._id, alignment);
        }
        /** Text component justification. */
        get justification() {
          return _wl_text_component_get_vertical_alignment(this._id);
        }
        /**
         * Set text component justification.
         *
         * @param justification Justification for the text component.
         */
        set justification(justification) {
          _wl_text_component_set_vertical_alignment(this._id, justification);
        }
        /** Text component character spacing. */
        get characterSpacing() {
          return _wl_text_component_get_character_spacing(this._id);
        }
        /**
         * Set text component character spacing.
         *
         * @param spacing Character spacing for the text component.
         */
        set characterSpacing(spacing) {
          _wl_text_component_set_character_spacing(this._id, spacing);
        }
        /** Text component line spacing. */
        get lineSpacing() {
          return _wl_text_component_get_line_spacing(this._id);
        }
        /**
         * Set text component line spacing
         *
         * @param spacing Line spacing for the text component
         */
        set lineSpacing(spacing) {
          _wl_text_component_set_line_spacing(this._id, spacing);
        }
        /** Text component effect. */
        get effect() {
          return _wl_text_component_get_effect(this._id);
        }
        /**
         * Set text component effect
         *
         * @param effect Effect for the text component
         */
        set effect(effect) {
          _wl_text_component_set_effect(this._id, effect);
        }
        /** Text component text. */
        get text() {
          return UTF8ToString(_wl_text_component_get_text(this._id));
        }
        /**
         * Set text component text.
         *
         * @param text Text of the text component.
         */
        set text(text) {
          const strLen = lengthBytesUTF8(text) + 1;
          const ptr = _malloc(strLen);
          stringToUTF8(text, ptr, strLen);
          _wl_text_component_set_text(this._id, ptr);
          _free(ptr);
        }
        /**
         * Set material to render the text with.
         *
         * @param material New material.
         */
        set material(material) {
          const matIndex = material ? material._index : 0;
          _wl_text_component_set_material(this._id, matIndex);
        }
        /** Material used to render the text. */
        get material() {
          const id = _wl_text_component_get_material(this._id);
          return id > 0 ? new Material(id) : null;
        }
      };
      ViewComponent = class extends Component2 {
        /** Projection matrix. */
        get projectionMatrix() {
          return new Float32Array(HEAPF32.buffer, _wl_view_component_get_projection_matrix(this._id), 16);
        }
        /** ViewComponent near clipping plane value. */
        get near() {
          return _wl_view_component_get_near(this._id);
        }
        /**
         * Set near clipping plane distance for the view.
         *
         * If an XR session is active, the change will apply in the
         * following frame, otherwise the change is immediate.
         *
         * @param near Near depth value.
         */
        set near(near) {
          _wl_view_component_set_near(this._id, near);
        }
        /** Far clipping plane value. */
        get far() {
          return _wl_view_component_get_far(this._id);
        }
        /**
         * Set far clipping plane distance for the view.
         *
         * If an XR session is active, the change will apply in the
         * following frame, otherwise the change is immediate.
         *
         * @param far Near depth value.
         */
        set far(far) {
          _wl_view_component_set_far(this._id, far);
        }
        /**
         * Get the horizontal field of view for the view, **in degrees**.
         *
         * If an XR session is active, this returns the field of view reported by
         * the device, regardless of the fov that was set.
         */
        get fov() {
          return _wl_view_component_get_fov(this._id);
        }
        /**
         * Set the horizontal field of view for the view, **in degrees**.
         *
         * If an XR session is active, the field of view reported by the device is
         * used and this value is ignored. After the XR session ends, the new value
         * is applied.
         *
         * @param fov Horizontal field of view, **in degrees**.
         */
        set fov(fov) {
          _wl_view_component_set_fov(this._id, fov);
        }
      };
      InputComponent = class extends Component2 {
        /** Input component type */
        get inputType() {
          return _wl_input_component_get_type(this._id);
        }
        /**
         * Set input component type.
         *
         * @params New input component type.
         */
        set inputType(type) {
          _wl_input_component_set_type(this._id, type);
        }
        /**
         * WebXR Device API input source associated with this input component,
         * if type {@link InputType.ControllerLeft} or {@link InputType.ControllerRight}.
         */
        get xrInputSource() {
          if (xrSession) {
            for (let inputSource of xrSession.inputSources) {
              if (inputSource.handedness == this.handedness) {
                return inputSource;
              }
            }
          }
          return null;
        }
        /**
         * 'left', 'right' or {@link null} depending on the {@link InputComponent#inputType}.
         */
        get handedness() {
          const inputType = this.inputType;
          if (inputType == InputType.ControllerRight || inputType == InputType.RayRight || inputType == InputType.EyeRight)
            return "right";
          if (inputType == InputType.ControllerLeft || inputType == InputType.RayLeft || inputType == InputType.EyeLeft)
            return "left";
          return null;
        }
      };
      LightComponent = class extends Component2 {
        /** View on the light color */
        get color() {
          return new Float32Array(HEAPF32.buffer, _wl_light_component_get_color(this._id), 4);
        }
        /** Light type. */
        get lightType() {
          return _wl_light_component_get_type(this._id);
        }
        /**
         * Set light type.
         *
         * @param lightType Type of the light component.
         */
        set lightType(t) {
          _wl_light_component_set_type(this._id, t);
        }
      };
      AnimationComponent = class extends Component2 {
        /**
         * Set animation to play.
         *
         * Make sure to {@link Animation#retarget} the animation to affect the
         * right objects.
         *
         * @param anim Animation to play.
         */
        set animation(anim) {
          _wl_animation_component_set_animation(this._id, anim._index);
        }
        /** Animation set for this component */
        get animation() {
          return new Animation(_wl_animation_component_get_animation(this._id));
        }
        /**
         * Set play count. Set to `0` to loop indefinitely.
         *
         * @param playCount Number of times to repeat the animation.
         */
        set playCount(playCount) {
          _wl_animation_component_set_playCount(this._id, playCount);
        }
        /** Number of times the animation is played. */
        get playCount() {
          return _wl_animation_component_get_playCount(this._id);
        }
        /**
         * Set speed. Set to negative values to run the animation backwards.
         *
         * Setting speed has an immediate effect for the current frame's update
         * and will continue with the speed from the current point in the animation.
         *
         * @param speed New speed at which to play the animation.
         * @since 0.8.10
         */
        set speed(speed) {
          _wl_animation_component_set_speed(this._id, speed);
        }
        /**
         * Speed factor at which the animation is played.
         *
         * @since 0.8.10
         */
        get speed() {
          return _wl_animation_component_get_speed(this._id);
        }
        /** Current playing state of the animation */
        get state() {
          return _wl_animation_component_state(this._id);
        }
        /** Play animation. */
        play() {
          _wl_animation_component_play(this._id);
        }
        /** Stop animation. */
        stop() {
          _wl_animation_component_stop(this._id);
        }
        /** Pause animation. */
        pause() {
          _wl_animation_component_pause(this._id);
        }
      };
      MeshComponent = class extends Component2 {
        /**
         * Set material to render the mesh with.
         *
         * @param material Material to render the mesh with.
         */
        set material(material) {
          _wl_mesh_component_set_material(this._id, material ? material._index : 0);
        }
        /** Material used to render the mesh. */
        get material() {
          const id = _wl_mesh_component_get_material(this._id);
          return id > 0 ? new Material(id) : null;
        }
        /** Mesh rendered by this component. */
        get mesh() {
          return new Mesh(_wl_mesh_component_get_mesh(this._id));
        }
        /**
         * Set mesh to rendered with this component.
         *
         * @param mesh Mesh rendered by this component.
         */
        set mesh(mesh) {
          _wl_mesh_component_set_mesh(this._id, mesh ? mesh._index : 0);
        }
        /** Skin for this mesh component. */
        get skin() {
          return new Skin(_wl_mesh_component_get_skin(this._id));
        }
        /**
         * Set skin to transform this mesh component.
         *
         * @param {?Skin} skin Skin to use for rendering skinned meshes.
         */
        set skin(skin) {
          _wl_mesh_component_set_skin(this._id, skin._index);
        }
      };
      PhysXComponent = class extends Component2 {
        /**
         * Set whether this rigid body is static.
         *
         * Setting this property only takes effect once the component
         * switches from inactive to active.
         *
         * @param b Whether the rigid body should be static.
         */
        set static(b2) {
          _wl_physx_component_set_static(this._id, b2);
        }
        /**
         * Whether this rigid body is static.
         *
         * This property returns whether the rigid body is *effectively*
         * static. If static property was set while the rigid body was
         * active, it will not take effect until the rigid body is set
         * inactive and active again. Until the component is set inactive,
         * this getter will return whether the rigidbody is actually
         * static.
         */
        get static() {
          return !!_wl_physx_component_get_static(this._id);
        }
        /**
         * Set whether this rigid body is kinematic.
         *
         * @param b Whether the rigid body should be kinematic.
         */
        set kinematic(b2) {
          _wl_physx_component_set_kinematic(this._id, b2);
        }
        /**
         * Whether this rigid body is kinematic.
         */
        get kinematic() {
          return !!_wl_physx_component_get_kinematic(this._id);
        }
        /**
         * Set the shape for collision detection.
         *
         * @param s New shape.
         * @since 0.8.5
         */
        set shape(s) {
          _wl_physx_component_set_shape(this._id, s);
        }
        /** The shape for collision detection. */
        get shape() {
          return _wl_physx_component_get_shape(this._id);
        }
        /**
         * Set additional data for the shape.
         *
         * Retrieved only from {@link PhysXComponent#shapeData}.
         * @since 0.8.10
         */
        set shapeData(d2) {
          if (d2 == null || ![Shape.TriangleMesh, Shape.ConvexMesh].includes(this.shape))
            return;
          _wl_physx_component_set_shape_data(this._id, d2.index);
        }
        /**
         * Additional data for the shape.
         *
         * `null` for {@link Shape} values: `None`, `Sphere`, `Capsule`, `Box`, `Plane`.
         * `{index: n}` for `TriangleMesh` and `ConvexHull`.
         *
         * This data is currently only for passing onto or creating other {@link PhysXComponent}.
         * @since 0.8.10
         */
        get shapeData() {
          if (![Shape.TriangleMesh, Shape.ConvexMesh].includes(this.shape))
            return null;
          return { index: _wl_physx_component_get_shape_data(this._id) };
        }
        /**
         * Set the shape extents for collision detection.
         *
         * @param e New extents for the shape.
         * @since 0.8.5
         */
        set extents(e) {
          this.extents.set(e);
        }
        /**
         * The shape extents for collision detection.
         */
        get extents() {
          const ptr = _wl_physx_component_get_extents(this._id);
          return new Float32Array(HEAPF32.buffer, ptr, 3);
        }
        /**
         * Get staticFriction.
         */
        get staticFriction() {
          return _wl_physx_component_get_staticFriction(this._id);
        }
        /**
         * Set staticFriction.
         * @param v New staticFriction.
         */
        set staticFriction(v2) {
          _wl_physx_component_set_staticFriction(this._id, v2);
        }
        /**
         * Get dynamicFriction.
         */
        get dynamicFriction() {
          return _wl_physx_component_get_dynamicFriction(this._id);
        }
        /**
         * Set dynamicFriction
         * @param v New dynamicDamping.
         */
        set dynamicFriction(v2) {
          _wl_physx_component_set_dynamicFriction(this._id, v2);
        }
        /**
         * Get bounciness.
         * @since 0.9.0
         */
        get bounciness() {
          return _wl_physx_component_get_bounciness(this._id);
        }
        /**
         * Set bounciness.
         * @param v New bounciness.
         * @since 0.9.0
         */
        set bounciness(v2) {
          _wl_physx_component_set_bounciness(this._id, v2);
        }
        /**
         * Get linearDamping/
         */
        get linearDamping() {
          return _wl_physx_component_get_linearDamping(this._id);
        }
        /**
         * Set linearDamping.
         * @param v New linearDamping.
         */
        set linearDamping(v2) {
          _wl_physx_component_set_linearDamping(this._id, v2);
        }
        /** Get angularDamping. */
        get angularDamping() {
          return _wl_physx_component_get_angularDamping(this._id);
        }
        /**
         * Set angularDamping.
         * @param v New angularDamping.
         */
        set angularDamping(v2) {
          _wl_physx_component_set_angularDamping(this._id, v2);
        }
        /**
         * Set linear velocity.
         *
         * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
         *
         * Has no effect, if the component is not active.
         *
         * @param v New linear velocity.
         */
        set linearVelocity(v2) {
          _wl_physx_component_set_linearVelocity(this._id, v2[0], v2[1], v2[2]);
        }
        /** Linear velocity or `[0, 0, 0]` if the component is not active. */
        get linearVelocity() {
          _wl_physx_component_get_linearVelocity(this._id, _tempMem);
          return new Float32Array(HEAPF32.buffer, _tempMem, 3);
        }
        /**
         * Set angular velocity
         *
         * [PhysX Manual - "Velocity"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#velocity)
         *
         * Has no effect, if the component is not active.
         *
         * @param v New angular velocity
         */
        set angularVelocity(v2) {
          _wl_physx_component_set_angularVelocity(this._id, v2[0], v2[1], v2[2]);
        }
        /** Angular velocity or `[0, 0, 0]` if the component is not active. */
        get angularVelocity() {
          _wl_physx_component_get_angularVelocity(this._id, _tempMem);
          return new Float32Array(HEAPF32.buffer, _tempMem, 3);
        }
        /**
         * Set mass.
         *
         * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
         *
         * @param m New mass.
         */
        set mass(m2) {
          _wl_physx_component_set_mass(this._id, m2);
        }
        /** Mass */
        get mass() {
          return _wl_physx_component_get_mass(this._id);
        }
        /**
         * Set mass space interia tensor.
         *
         * [PhysX Manual - "Mass Properties"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#mass-properties)
         *
         * Has no effect, if the component is not active.
         *
         * @param v New mass space interatia tensor.
         */
        set massSpaceInteriaTensor(v2) {
          _wl_physx_component_set_massSpaceInertiaTensor(this._id, v2[0], v2[1], v2[2]);
        }
        /**
         * Apply a force.
         *
         * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
         *
         * Has no effect, if the component is not active.
         *
         * @param f Force vector.
         * @param m Force mode, see {@link ForceMode}, default `Force`.
         * @param localForce Whether the force vector is in local space, default `false`.
         * @param p Position to apply force at, default is center of mass.
         * @param local Whether position is in local space, default `false`.
         */
        addForce(f, m2, localForce, p, local) {
          m2 = m2 || ForceMode.Force;
          if (!p) {
            _wl_physx_component_addForce(this._id, f[0], f[1], f[2], m2, !!localForce);
          } else {
            _wl_physx_component_addForceAt(this._id, f[0], f[1], f[2], m2, !!localForce, p[0], p[1], p[2], !!local);
          }
        }
        /**
         * Apply torque.
         *
         * [PhysX Manual - "Applying Forces and Torques"](https://gameworksdocs.nvidia.com/PhysX/4.1/documentation/physxguide/Manual/RigidBodyDynamics.html#applying-forces-and-torques)
         *
         * Has no effect, if the component is not active.
         *
         * @param f Force vector.
         * @param m Force mode, see {@link ForceMode}, default `Force`.
         */
        addTorque(f, m2 = ForceMode.Force) {
          _wl_physx_component_addTorque(this._id, f[0], f[1], f[2], m2);
        }
        /**
         * Add on collision callback.
         *
         * @param callback Function to call when this rigid body (un)collides with any other.
         *
         * ```js
         *  let rigidBody = this.object.getComponent('physx');
         *  rigidBody.onCollision(function(type, other) {
         *      // Ignore uncollides
         *      if(type == CollisionEventType.TouchLost) return;
         *
         *      // Take damage on collision with enemies
         *      if(other.object.name.startsWith('enemy-')) {
         *          this.applyDamage(10);
         *      }
         *  }.bind(this));
         * ```
         *
         * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
         */
        onCollision(callback) {
          return this.onCollisionWith(this, callback);
        }
        /**
         * Add filtered on collision callback.
         *
         * @param otherComp Component for which callbacks will
         *        be triggered. If you pass this component, the method is equivalent to.
         *        {@link PhysXComponent#onCollision}.
         * @param callback Function to call when this rigid body
         *        (un)collides with `otherComp`.
         * @returns Id of the new callback for use with {@link PhysXComponent#removeCollisionCallback}.
         */
        onCollisionWith(otherComp, callback) {
          physics._callbacks[this._id] = physics._callbacks[this._id] || [];
          physics._callbacks[this._id].push(callback);
          return _wl_physx_component_addCallback(this._id, otherComp._id || this._id);
        }
        /**
         * Remove a collision callback added with {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
         *
         * @param callbackId Callback id as returned by {@link PhysXComponent#onCollision} or {@link PhysXComponent#onCollisionWith}.
         * @throws When the callback does not belong to the component.
         * @throws When the callback does not exist.
         */
        removeCollisionCallback(callbackId) {
          const r = _wl_physx_component_removeCallback(this._id, callbackId);
          if (r)
            physics._callbacks[this._id].splice(-r);
        }
      };
      for (const prop of [
        "static",
        "extents",
        "staticFriction",
        "dynamicFriction",
        "bounciness",
        "linearDamping",
        "angularDamping",
        "shape",
        "shapeData",
        "kinematic",
        "linearVelocity",
        "angularVelocity",
        "mass"
      ]) {
        Object.defineProperty(PhysXComponent.prototype, prop, { enumerable: true });
      }
      (function(MeshIndexType2) {
        MeshIndexType2[MeshIndexType2["UnsignedByte"] = 1] = "UnsignedByte";
        MeshIndexType2[MeshIndexType2["UnsignedShort"] = 2] = "UnsignedShort";
        MeshIndexType2[MeshIndexType2["UnsignedInt"] = 4] = "UnsignedInt";
      })(MeshIndexType || (MeshIndexType = {}));
      Mesh = class {
        /**
         * Size of a vertex in float elements.
         * @deprecated Replaced with {@link Mesh#attribute} and {@link MeshAttributeAccessor}
         */
        static get VERTEX_FLOAT_SIZE() {
          return 3 + 3 + 2;
        }
        /**
         * Size of a vertex in bytes.
         * @deprecated Replaced with {@link Mesh#attribute} and {@link MeshAttributeAccessor}
         */
        static get VERTEX_SIZE() {
          return this.VERTEX_FLOAT_SIZE * 4;
        }
        /**
         * Position attribute offsets in float elements.
         * @deprecated Replaced with {@link Mesh#attribute} and {@link MeshAttribute#Position}
         */
        static get POS() {
          return { X: 0, Y: 1, Z: 2 };
        }
        /**
         * Texture coordinate attribute offsets in float elements.
         * @deprecated Replaced with {@link Mesh#attribute} and {@link MeshAttribute#TextureCoordinate}
         */
        static get TEXCOORD() {
          return { U: 3, V: 4 };
        }
        /**
         * Normal attribute offsets in float elements.
         * @deprecated Replaced with {@link Mesh#attribute} and {@link MeshAttribute#Normal}
         */
        static get NORMAL() {
          return { X: 5, Y: 6, Z: 7 };
        }
        /**
         * Create a new instance.
         *
         * @param params Either a mesh index to wrap or set of parameters to create a new mesh.
         *    For more information, please have a look at the {@link MeshParameters} interface.
         */
        constructor(params) {
          if (typeof params === "object") {
            if (!params.vertexCount && params.vertexData) {
              params.vertexCount = params.vertexData.length / Mesh.VERTEX_FLOAT_SIZE;
            }
            if (!params.vertexCount)
              throw new Error("Missing parameter 'vertexCount'");
            let indexData = 0;
            let indexType = 0;
            let indexDataSize = 0;
            if (params.indexData) {
              indexType = params.indexType || MeshIndexType.UnsignedShort;
              indexDataSize = params.indexData.length * indexType;
              indexData = _malloc(indexDataSize);
              switch (indexType) {
                case MeshIndexType.UnsignedByte:
                  HEAPU8.set(params.indexData, indexData);
                  break;
                case MeshIndexType.UnsignedShort:
                  HEAPU16.set(params.indexData, indexData >> 1);
                  break;
                case MeshIndexType.UnsignedInt:
                  HEAPU32.set(params.indexData, indexData >> 2);
                  break;
              }
            }
            const { skinned = false } = params;
            this._index = _wl_mesh_create(indexData, indexDataSize, indexType, params.vertexCount, skinned);
            if (params.vertexData) {
              const positions = this.attribute(MeshAttribute.Position);
              const normals = this.attribute(MeshAttribute.Normal);
              const textureCoordinates = this.attribute(MeshAttribute.TextureCoordinate);
              for (let i = 0; i < params.vertexCount; ++i) {
                const start = i * Mesh.VERTEX_FLOAT_SIZE;
                positions.set(i, params.vertexData.subarray(start, start + 3));
                textureCoordinates === null || textureCoordinates === void 0 ? void 0 : textureCoordinates.set(i, params.vertexData.subarray(start + 3, start + 5));
                normals === null || normals === void 0 ? void 0 : normals.set(i, params.vertexData.subarray(start + 5, start + 8));
              }
            }
          } else {
            this._index = params;
          }
        }
        /**
         * Vertex data (read-only).
         *
         * @deprecated Replaced with {@link attribute}
         */
        get vertexData() {
          const ptr = _wl_mesh_get_vertexData(this._index, _tempMem);
          return new Float32Array(HEAPF32.buffer, ptr, Mesh.VERTEX_FLOAT_SIZE * HEAPU32[_tempMem / 4]);
        }
        /** Number of vertices in this mesh. */
        get vertexCount() {
          return _wl_mesh_get_vertexCount(this._index);
        }
        /** Index data (read-only) or {@link null} if the mesh is not indexed. */
        get indexData() {
          const ptr = _wl_mesh_get_indexData(this._index, _tempMem, _tempMem + 4);
          if (ptr === null)
            return null;
          const indexCount = HEAPU32[_tempMem / 4];
          const indexSize = HEAPU32[_tempMem / 4 + 1];
          switch (indexSize) {
            case MeshIndexType.UnsignedByte:
              return new Uint8Array(HEAPU8.buffer, ptr, indexCount);
            case MeshIndexType.UnsignedShort:
              return new Uint16Array(HEAPU16.buffer, ptr, indexCount);
            case MeshIndexType.UnsignedInt:
              return new Uint32Array(HEAPU32.buffer, ptr, indexCount);
          }
          return null;
        }
        /** Updates the bounding sphere to match new vertex positions. */
        update() {
          _wl_mesh_update(this._index);
        }
        /**
         * Mesh bounding sphere.
         *
         * @param out Preallocated array to write into, to avoid garbage,
         *     otherwise will allocate a new {@link Float32Array}.
         *
         * ```js
         *  const sphere = new Float32Array(4);
         *  for(...) {
         *      mesh.getBoundingSphere(sphere);
         *      ...
         *  }
         * ```
         *
         * If the position data is changed, call {@link Mesh#update} to update the
         * bounding sphere.
         *
         * @returns Bounding sphere, 0-2 sphere origin, 3 radius.
         */
        getBoundingSphere(out = new Float32Array(4)) {
          _wl_mesh_get_boundingSphere(this._index, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          out[3] = _tempMemFloat[3];
          return out;
        }
        /**
         * Get an attribute accessor to retrieve or modify data of give attribute.
         *
         * @param attr Attribute to get access to
         * @returns {?MeshAttributeAccessor} attr Attribute to get access to or `null`,
         *      if mesh does not have this attribute.
         *
         * If there are no shaders in the scene that use `TextureCoordinate` for example,
         * no meshes will have the `TextureCoordinate` attribute.
         *
         * For flexible reusable components, take this into account that only `Position`
         * is guaranteed to be present at all time.
         */
        attribute(attr) {
          if (typeof attr != "number")
            throw new TypeError("Expected number, but got " + typeof attr);
          _wl_mesh_get_attribute(this._index, attr, _tempMem);
          if (_tempMemUint32[0] == 255)
            return null;
          const a = new MeshAttributeAccessor(attr);
          a._attribute = _tempMemUint32[0];
          a._offset = _tempMemUint32[1];
          a._stride = _tempMemUint32[2];
          a._formatSize = _tempMemUint32[3];
          a._componentCount = _tempMemUint32[4];
          a.length = this.vertexCount;
          return a;
        }
        /**
         * Destroy and free the meshes memory.
         *
         * It is best practice to set the mesh variable to `null` after calling
         * destroy to prevent accidental use:
         *
         * ```js
         *   mesh.destroy();
         *   mesh = null;
         * ```
         *
         * Accessing the mesh after destruction behaves like accessing an empty
         * mesh.
         *
         * @since 0.9.0
         */
        destroy() {
          _wl_mesh_destroy(this._index);
        }
      };
      MeshAttributeAccessor = class {
        /**
         * Create a new instance.
         *
         * @param type The type of data this accessor is wrapping.
         * @note Do not use this constructor. Instead, please use the {@link Mesh.attribute} method.
         *
         * @hidden
         */
        constructor(type = MeshAttribute.Position) {
          this._attribute = -1;
          this._offset = 0;
          this._stride = 0;
          this._formatSize = 0;
          this._componentCount = 0;
          this.length = 0;
          switch (type) {
            case MeshAttribute.Position:
            case MeshAttribute.Normal:
            case MeshAttribute.TextureCoordinate:
            case MeshAttribute.Tangent:
            case MeshAttribute.Color:
            case MeshAttribute.JointWeight:
            case MeshAttribute.SecondaryJointWeight:
              this._bufferType = Float32Array;
              this._tempBufferGetter = getTempBufferF32;
              break;
            case MeshAttribute.JointId:
            case MeshAttribute.SecondaryJointId:
              this._bufferType = Uint16Array;
              this._tempBufferGetter = getTempBufferU16;
              break;
            default:
              throw new Error(`Invalid attribute accessor type: ${type}`);
          }
        }
        /**
         * Create a new TypedArray to hold this attribute values.
         *
         * This method is useful to create a view to hold the data to
         * pass to {@link MeshAttributeAccessor.get} and {@link MeshAttributeAccessor.set}
         *
         * Example:
         *
         * ```js
         * const vertexCount = 4;
         * const positionAttribute = mesh.attribute(MeshAttributes.Position);
         *
         * // A position has 3 floats per vertex. Thus, positions has length 3 * 4.
         * const positions = positionAttribute.createArray(vertexCount);
         * ```
         *
         * @param count The number of **vertices** expected.
         * @returns A TypedArray with the appropriate format to access the data
         */
        createArray(count = 1) {
          count = count > this.length ? this.length : count;
          return new this._bufferType(count * this._componentCount);
        }
        /**
         * Get attribute element.
         *
         * @param {number} index Index
         * @param out Preallocated array to write into,
         *      to avoid garbage, otherwise will allocate a new TypedArray.
         *
         * `out.length` needs to be a multiple of the attributes component count, see
         * {@link MeshAttribute}. If `out.length` is more than one multiple, it will be
         * filled with the next n attribute elements, which can reduce overhead
         * of this call.
         *
         * @returns The `out` parameter
         */
        get(index, out = this.createArray()) {
          if (out.length % this._componentCount !== 0)
            throw new Error(`out.length, ${out.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
          const dest = this._tempBufferGetter(out.length);
          const bytesPerElt = this._bufferType.BYTES_PER_ELEMENT;
          const bytes = bytesPerElt * out.length;
          const destFormatSize = this._componentCount * bytesPerElt;
          _wl_mesh_get_attribute_values(this._attribute, this._formatSize, this._offset + index * this._stride, this._stride, destFormatSize, dest.byteOffset, bytes);
          for (let i = 0; i < out.length; ++i)
            out[i] = dest[i];
          return out;
        }
        /**
         * Set attribute element.
         *
         * @param i Index
         * @param v Value to set the element to
         *
         * `v.length` needs to be a multiple of the attributes component count, see
         * {@link MeshAttribute}. If `v.length` is more than one multiple, it will be
         * filled with the next n attribute elements, which can reduce overhead
         * of this call.
         *
         * @returns Reference to self (for method chaining)
         */
        set(i, v2) {
          if (v2.length % this._componentCount !== 0)
            throw new Error(`out.length, ${v2.length} is not a multiple of the attribute vector components, ${this._componentCount}`);
          const bytesPerElt = this._bufferType.BYTES_PER_ELEMENT;
          const bytes = bytesPerElt * v2.length;
          const srcFormatSize = this._componentCount * bytesPerElt;
          if (v2.buffer != HEAPU8.buffer) {
            const dest = this._tempBufferGetter(v2.length);
            dest.set(v2);
            v2 = dest;
          }
          _wl_mesh_set_attribute_values(this._attribute, srcFormatSize, v2.byteOffset, bytes, this._formatSize, this._offset + i * this._stride, this._stride);
          return this;
        }
      };
      Material = class {
        /**
         * Create a new Material.
         *
         * @note Creating material is expensive. Please use {@link Material#clone} to clone a material.
         * @note Do not use this constructor directly with an index, this is reserved for internal purposes.
         */
        constructor(params) {
          if (typeof params !== "number") {
            if (!(params === null || params === void 0 ? void 0 : params.pipeline))
              throw new Error("Missing parameter 'pipeline'");
            const pipeline = params.pipeline;
            const lengthBytes = lengthBytesUTF8(pipeline) + 1;
            stringToUTF8(pipeline, _tempMem, lengthBytes);
            this._index = _wl_material_create(_tempMem);
            if (this._index < 0)
              throw new Error(`No such pipeline '${pipeline}'`);
          } else {
            this._index = params;
          }
          this._definition = _wl_material_get_definition(this._index);
          if (!_WL._materialDefinitions[this._definition])
            throw new Error(`Material Definition ${this._definition} not found for material with index ${this._index}`);
          return new Proxy(this, {
            get(target, prop) {
              const definition = _WL._materialDefinitions[target._definition];
              const param = definition.get(prop);
              if (!param)
                return target[prop];
              if (_wl_material_get_param_value(target._index, param.index, _tempMem)) {
                const type = param.type;
                switch (type.type) {
                  case MaterialParamType.UnsignedInt:
                    return type.componentCount == 1 ? _tempMemUint32[0] : new Uint32Array(HEAPU32.buffer, _tempMem, type.componentCount);
                  case MaterialParamType.Int:
                    return type.componentCount == 1 ? _tempMemInt[0] : new Int32Array(HEAP32.buffer, _tempMem, type.componentCount);
                  case MaterialParamType.Float:
                    return type.componentCount == 1 ? _tempMemFloat[0] : new Float32Array(HEAPF32.buffer, _tempMem, type.componentCount);
                  case MaterialParamType.Sampler:
                    return new Texture(_tempMemInt[0]);
                  default:
                    throw new Error(`Invalid type ${type} on parameter ${param.index} for material ${target._index}`);
                }
              }
            },
            set(target, prop, value) {
              const definition = _WL._materialDefinitions[target._definition];
              const param = definition.get(prop);
              if (!param) {
                target[prop] = value;
                return true;
              }
              const type = param.type;
              switch (type.type) {
                case MaterialParamType.UnsignedInt:
                case MaterialParamType.Int:
                case MaterialParamType.Sampler:
                  const v2 = value instanceof Texture ? value.id : value;
                  _wl_material_set_param_value_uint(target._index, param.index, v2);
                  break;
                case MaterialParamType.Float:
                  let count = 1;
                  if (typeof value === "number") {
                    _tempMemFloat[0] = value;
                  } else {
                    count = value.length;
                    for (let i = 0; i < count; ++i)
                      _tempMemFloat[i] = value[i];
                  }
                  _wl_material_set_param_value_float(target._index, param.index, _tempMem, count);
                  break;
                case MaterialParamType.Font:
                  throw new Error("Setting font properties is currently unsupported.");
              }
              return true;
            }
          });
        }
        /** Name of the shader used by this material. */
        get shader() {
          return UTF8ToString(_wl_material_get_shader(this._index));
        }
        /**
         * Create a copy of the underlying native material.
         *
         * @returns Material clone.
         */
        clone() {
          const id = _wl_material_clone(this._index);
          return id > 0 ? new Material(id) : null;
        }
        /**
         * Wrap a native material index.
         *
         * @param index The index.
         * @returns Material instance or {@link null} if index <= 0.
         *
         * @deprecated Please use `new Material()` instead.
         */
        static wrap(index) {
          return index > 0 ? new Material(index) : null;
        }
      };
      tempCanvas = null;
      Texture = class {
        /**
         * @param param HTML media element to create texture from or texture id to wrap.
         */
        constructor(param) {
          this._id = 0;
          this._imageIndex = void 0;
          if (param instanceof HTMLImageElement || param instanceof HTMLVideoElement || param instanceof HTMLCanvasElement) {
            const index = _images.length;
            _images.push(param);
            this._imageIndex = index;
            this._id = _wl_renderer_addImage(index);
          } else {
            this._id = param;
          }
          textures[this._id] = this;
        }
        /** Whether this texture is valid. */
        get valid() {
          return this._id >= 0;
        }
        /** Index in this manager. */
        get id() {
          return this._id;
        }
        /** Update the texture to match the HTML element (e.g. reflect the current frame of a video). */
        update() {
          if (!this.valid)
            return;
          _wl_renderer_updateImage(this._id, this._imageIndex);
        }
        /** Width of the texture. */
        get width() {
          return _wl_texture_width(this._id);
        }
        /** Height of the texture. */
        get height() {
          return _wl_texture_height(this._id);
        }
        /**
         * Update a subrange on the texture to match the HTML element (e.g. reflect the current frame of a video).
         *
         * Usage:
         *
         * ```js
         * // Copies rectangle of pixel starting from (10, 20)
         * texture.updateSubImage(10, 20, 600, 400);
         * ```
         *
         * @param x x offset
         * @param y y offset
         * @param w width
         * @param h height
         */
        updateSubImage(x2, y2, w2, h) {
          var _a;
          if (!this.valid)
            return;
          if (!tempCanvas)
            tempCanvas = document.createElement("canvas");
          const img = _images[this._imageIndex];
          if (!img)
            return;
          tempCanvas.width = w2;
          tempCanvas.height = h;
          (_a = tempCanvas.getContext("2d")) === null || _a === void 0 ? void 0 : _a.drawImage(img, x2, y2, w2, h, 0, 0, w2, h);
          _images[this._imageIndex] = tempCanvas;
          try {
            _wl_renderer_updateImage(this._id, this._imageIndex, x2, (img.videoHeight || img.height) - y2 - h);
          } finally {
            _images[this._imageIndex] = img;
          }
        }
        /**
         * Destroy and free the texture's texture altas space and memory.
         *
         * It is best practice to set the texture variable to `null` after calling
         * destroy to prevent accidental use of the invalid texture:
         *
         * ```js
         *   texture.destroy();
         *   texture = null;
         * ```
         *
         * @since 0.9.0
         */
        destroy() {
          _wl_texture_destroy(this._id);
          if (this._imageIndex) {
            _images[this._imageIndex] = null;
            this._imageIndex = void 0;
          }
        }
      };
      textures = {
        /**
         * Load an image from URL as {@link Texture}
         * @param {string} filename URL to load from
         * @param {string} crossOrigin Cross origin flag for the {@link Image} object
         * @returns {Promise<Texture>} Loaded texture
         */
        load: function(filename, crossOrigin) {
          let image = new Image();
          if (crossOrigin !== void 0) {
            image.crossOrigin = crossOrigin;
          }
          image.src = filename;
          return new Promise((resolve, reject) => {
            image.onload = function() {
              let texture = new Texture(image);
              if (!texture.valid) {
                reject("Failed to add image " + image.src + " to texture atlas. Probably incompatible format.");
              }
              resolve(texture);
            };
          });
        }
      };
      Animation = class {
        /**
         * @param index Index in the manager
         */
        constructor(index) {
          this._index = index;
        }
        /** Duration of this animation. */
        get duration() {
          return _wl_animation_get_duration(this._index);
        }
        /** Number of tracks in this animation. */
        get trackCount() {
          return _wl_animation_get_trackCount(this._index);
        }
        /**
         * Clone this animation retargeted to a new set of objects.
         *
         * The clone shares most of the data with the original and is therefore
         * light-weight.
         *
         * **Experimental:** This API might change in upcoming versions.
         *
         * If retargetting to {@link Skin}, the join names will be used to determine a mapping
         * from the previous skin to the new skin. The source skin will be retrieved from
         * the first track in the animation that targets a joint.
         *
         * @param newTargets New targets per track. Expected to have
         *      {@link Animation#trackCount} elements or to be a {@link Skin}.
         * @returns The retargeted clone of this animation.
         */
        retarget(newTargets) {
          if (newTargets instanceof Skin) {
            const animId2 = _wl_animation_retargetToSkin(this._index, newTargets._index);
            return new Animation(animId2);
          }
          if (newTargets.length != this.trackCount) {
            throw Error("Expected " + this.trackCount.toString() + " targets, but got " + newTargets.length.toString());
          }
          const ptr = _malloc(2 * newTargets.length);
          for (let i = 0; i < newTargets.length; ++i) {
            HEAPU16[ptr >> 1 + i] = newTargets[i].objectId;
          }
          const animId = _wl_animation_retarget(this._index, ptr);
          _free(ptr);
          return new Animation(animId);
        }
      };
      $Object = class {
        /**
         * @param o Object id to wrap
         */
        constructor(o) {
          this.objectId = o;
        }
        /**
         * Name of the object.
         *
         * Useful for identifying objects during debugging.
         */
        get name() {
          return UTF8ToString(_wl_object_name(this.objectId));
        }
        /**
         * Set the object's name.
         *
         * @param newName The new name to set.
         */
        set name(newName) {
          const lengthBytes = lengthBytesUTF8(newName) + 1;
          const mem = _malloc(lengthBytes);
          stringToUTF8(newName, mem, lengthBytes);
          _wl_object_set_name(this.objectId, mem);
          _free(mem);
        }
        /**
         * Parent of this object or {@link null} if parented to root.
         */
        get parent() {
          const p = _wl_object_parent(this.objectId);
          return p == 0 ? null : _wrapObject(p);
        }
        /**
         * Children of this object.
         */
        get children() {
          const childrenCount = _wl_object_get_children_count(this.objectId);
          if (childrenCount === 0)
            return [];
          requireTempMem(childrenCount * 2);
          _wl_object_get_children(this.objectId, _tempMem, _tempMemSize >> 1);
          const children = new Array(childrenCount);
          for (let i = 0; i < childrenCount; ++i) {
            children[i] = _wrapObject(_tempMemUint16[i]);
          }
          return children;
        }
        /**
         * Reparent object to given object.
         *
         * @note Reparenting is not trivial and might have a noticeable performance impact.
         *
         * @param newParent New parent or {@link null} to parent to root
         */
        set parent(newParent) {
          _wl_object_set_parent(this.objectId, newParent == null ? 0 : newParent.objectId);
        }
        /** Reset local transformation (translation, rotation and scaling) to identity. */
        resetTransform() {
          _wl_object_reset_translation_rotation(this.objectId);
          _wl_object_reset_scaling(this.objectId);
        }
        /** Reset local translation and rotation to identity */
        resetTranslationRotation() {
          _wl_object_reset_translation_rotation(this.objectId);
        }
        /**
         * Reset local rotation, keep translation.
         * @note To reset both rotation and translation, prefer
         *       {@link resetTranslationRotation}.
         */
        resetRotation() {
          _wl_object_reset_rotation(this.objectId);
        }
        /**
         * Reset local translation, keep rotation.
         * @note To reset both rotation and translation, prefer
         *       {@link resetTranslationRotation}.
         */
        resetTranslation() {
          _wl_object_reset_translation(this.objectId);
        }
        /** Reset local scaling to identity (``[1.0, 1.0, 1.0]``). */
        resetScaling() {
          _wl_object_reset_scaling(this.objectId);
        }
        /**
         * Translate object by a vector in the parent's space.
         * @param v Vector to translate by.
         */
        translate(v2) {
          _wl_object_translate(this.objectId, v2[0], v2[1], v2[2]);
        }
        /**
         * Translate object by a vector in object space.
         * @param v Vector to translate by.
         */
        translateObject(v2) {
          _wl_object_translate_obj(this.objectId, v2[0], v2[1], v2[2]);
        }
        /**
         * Translate object by a vector in world space.
         * @param v Vector to translate by.
         */
        translateWorld(v2) {
          _wl_object_translate_world(this.objectId, v2[0], v2[1], v2[2]);
        }
        /**
         * Rotate around given axis by given angle (degrees) in local space.
         *
         * @param a Vector representing the rotation axis.
         * @param d Angle in degrees.
         *
         * @note If the object is translated the rotation will be around
         *     the parent. To rotate around the object origin, use
         *     {@link rotateAxisAngleDegObject}
         *
         * @see {@link rotateAxisAngleRad}
         */
        rotateAxisAngleDeg(a, d2) {
          _wl_object_rotate_axis_angle(this.objectId, a[0], a[1], a[2], d2);
        }
        /**
         * Rotate around given axis by given angle (radians) in local space.
         *
         * @param {number[]} a Vector representing the rotation axis.
         * @param {number} d Angle in radians.
         *
         * @note If the object is translated the rotation will be around
         *     the parent. To rotate around the object origin, use
         *     {@link rotateAxisAngleDegObject}
         *
         * @see {@link rotateAxisAngleDeg}
         */
        rotateAxisAngleRad(a, d2) {
          _wl_object_rotate_axis_angle_rad(this.objectId, a[0], a[1], a[2], d2);
        }
        /**
         * Rotate around given axis by given angle (degrees) in object space.
         *
         * @param a Vector representing the rotation axis.
         * @param d Angle in degrees.
         *
         * Equivalent to prepending a rotation quaternion to the object's
         * local transformation.
         *
         * @see {@link rotateAxisAngleRadObject}
         */
        rotateAxisAngleDegObject(a, d2) {
          _wl_object_rotate_axis_angle_obj(this.objectId, a[0], a[1], a[2], d2);
        }
        /**
         * Rotate around given axis by given angle (radians) in object space
         * Equivalent to prepending a rotation quaternion to the object's
         * local transformation.
         *
         * @param a Vector representing the rotation axis
         * @param d Angle in degrees
         *
         * @see {@link rotateAxisAngleDegObject}
         */
        rotateAxisAngleRadObject(a, d2) {
          _wl_object_rotate_axis_angle_rad_obj(this.objectId, a[0], a[1], a[2], d2);
        }
        /**
         * Rotate by a quaternion.
         *
         * @param q the Quaternion to rotate by.
         */
        rotate(q2) {
          _wl_object_rotate_quat(this.objectId, q2[0], q2[1], q2[2], q2[3]);
        }
        /**
         * Rotate by a quaternion in object space.
         *
         * Equivalent to prepending a rotation quaternion to the object's
         * local transformation.
         *
         * @param q the Quaternion to rotate by.
         */
        rotateObject(q2) {
          _wl_object_rotate_quat_obj(this.objectId, q2[0], q2[1], q2[2], q2[3]);
        }
        /**
         * Scale object by a vector in object space.
         *
         * @param v Vector to scale by.
         */
        scale(v2) {
          _wl_object_scale(this.objectId, v2[0], v2[1], v2[2]);
        }
        /** Local / object space transformation. */
        get transformLocal() {
          return new Float32Array(HEAPF32.buffer, _wl_object_trans_local(this.objectId), 8);
        }
        /**
         * Set local transform.
         *
         * @param t Local space transformation.
         *
         * @since 0.8.5
         */
        set transformLocal(t) {
          this.transformLocal.set(t);
          this.setDirty();
        }
        /**
         * Compute local / object space translation from transformation.
         *
         * @param out Destination array/vector, expected to have at least 3 elements.
         * @return The `out` parameter.
         */
        getTranslationLocal(out) {
          _wl_object_get_translation_local(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Compute world space translation from transformation.
         *
         * May recompute transformations of the hierarchy of this object,
         * if they were changed by JavaScript components this frame.
         *
         * @param out Destination array/vector, expected to have at least 3 elements.
         * @return The `out` parameter.
         */
        getTranslationWorld(out) {
          _wl_object_get_translation_world(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Set local / object space translation.
         *
         * Concatenates a new translation dual quaternion onto the existing rotation.
         *
         * @param v New local translation array/vector, expected to have at least 3 elements.
         */
        setTranslationLocal(v2) {
          _wl_object_set_translation_local(this.objectId, v2[0], v2[1], v2[2]);
        }
        /**
         * Set world space translation.
         *
         * Applies the inverse parent transform with a new translation dual quaternion
         * which is concatenated onto the existing rotation.
         *
         * @param v New world translation array/vector, expected to have at least 3 elements.
         */
        setTranslationWorld(v2) {
          _wl_object_set_translation_world(this.objectId, v2[0], v2[1], v2[2]);
        }
        /**
         * Global / world space transformation.
         *
         * May recompute transformations of the hierarchy of this object,
         * if they were changed by JavaScript components this frame.
         */
        get transformWorld() {
          return new Float32Array(HEAPF32.buffer, _wl_object_trans_world(this.objectId), 8);
        }
        /**
         * Set world transform.
         *
         * @param t Global / world space transformation.
         *
         * @since 0.8.5
         */
        set transformWorld(t) {
          this.transformWorld.set(t);
          _wl_object_trans_world_to_local(this.objectId);
        }
        /** Local / object space scaling. */
        get scalingLocal() {
          return new Float32Array(HEAPF32.buffer, _wl_object_scaling_local(this.objectId), 3);
        }
        /**
         * Set scaling local.
         *
         * @param s Global / world space transformation.
         *
         * @since 0.8.7
         */
        set scalingLocal(s) {
          this.scalingLocal.set(s);
          this.setDirty();
        }
        /**
         * Global / world space scaling.
         *
         * May recompute transformations of the hierarchy of this object,
         * if they were changed by JavaScript components this frame.
         */
        get scalingWorld() {
          return new Float32Array(HEAPF32.buffer, _wl_object_scaling_world(this.objectId), 3);
        }
        /**
         * Set scaling world.
         *
         * @param t Global / world space transformation.
         *
         * @since 0.8.7
         */
        set scalingWorld(s) {
          this.scalingWorld.set(s);
          _wl_object_scaling_world_to_local(this.objectId);
        }
        /**
         * Local space rotation.
         *
         * @since 0.8.7
         */
        get rotationLocal() {
          return this.transformLocal.subarray(0, 4);
        }
        /**
         * Global / world space rotation
         *
         * @since 0.8.7
         */
        get rotationWorld() {
          return this.transformWorld.subarray(0, 4);
        }
        /**
         * Set rotation local
         *
         * @param r Local space rotation
         *
         * @since 0.8.7
         */
        set rotationLocal(r) {
          _wl_object_set_rotation_local(this.objectId, r[0], r[1], r[2], r[3]);
        }
        /**
         * Set rotation world.
         *
         * @param {number} r Global / world space rotation.
         *
         * @since 0.8.7
         */
        set rotationWorld(r) {
          _wl_object_set_rotation_world(this.objectId, r[0], r[1], r[2], r[3]);
        }
        /**
         * Compute the object's forward facing world space vector.
         *
         * @param out Destination array/vector, expected to have at least 3 elements.
         * @return The `out` parameter.
         */
        getForward(out) {
          out[0] = 0;
          out[1] = 0;
          out[2] = -1;
          this.transformVectorWorld(out);
          return out;
        }
        /**
         * Compute the object's up facing world space vector.
         *
         * @param out Destination array/vector, expected to have at least 3 elements.
         * @return The `out` parameter.
         */
        getUp(out) {
          out[0] = 0;
          out[1] = 1;
          out[2] = 0;
          this.transformVectorWorld(out);
          return out;
        }
        /**
         * Compute the object's right facing world space vector/
         *
         * @param out Destination array/vector, expected to have at least 3 elements.
         * @return The `out` parameter.
         */
        getRight(out) {
          out[0] = 1;
          out[1] = 0;
          out[2] = 0;
          this.transformVectorWorld(out);
          return out;
        }
        /**
         * Transform a vector by this object's world transform.
         *
         * @param out Out point
         * @param v Point to transform, default `out`
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformVectorWorld(out, v2) {
          v2 = v2 || out;
          _tempMemFloat[0] = v2[0];
          _tempMemFloat[1] = v2[1];
          _tempMemFloat[2] = v2[2];
          _wl_object_transformVectorWorld(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a vector by this object's local transform
         *
         * @param out Out point
         * @param v Point to transform, default `out`
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformVectorLocal(out, v2) {
          v2 = v2 || out;
          _tempMemFloat[0] = v2[0];
          _tempMemFloat[1] = v2[1];
          _tempMemFloat[2] = v2[2];
          _wl_object_transformVectorLocal(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a point by this object's world transform.
         *
         * @param out Out point.
         * @param p Point to transform, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformPointWorld(out, p) {
          p = p || out;
          _tempMemFloat[0] = p[0];
          _tempMemFloat[1] = p[1];
          _tempMemFloat[2] = p[2];
          _wl_object_transformPointWorld(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a point by this object's local transform.
         *
         * @param out Out point.
         * @param p Point to transform, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformPointLocal(out, p) {
          p = p || out;
          _tempMemFloat[0] = p[0];
          _tempMemFloat[1] = p[1];
          _tempMemFloat[2] = p[2];
          _wl_object_transformPointLocal(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a vector by this object's inverse world transform.
         *
         * @param {number[]} out Out point.
         * @param {number[]} v Vector to transform, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformVectorInverseWorld(out, v2) {
          v2 = v2 || out;
          _tempMemFloat[0] = v2[0];
          _tempMemFloat[1] = v2[1];
          _tempMemFloat[2] = v2[2];
          _wl_object_transformVectorInverseWorld(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a point by this object's inverse local transform.
         *
         * @param out Out point
         * @param v Vector to transform, default `out`
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformVectorInverseLocal(out, v2) {
          v2 = v2 || out;
          _tempMemFloat[0] = v2[0];
          _tempMemFloat[1] = v2[1];
          _tempMemFloat[2] = v2[2];
          _wl_object_transformVectorInverseLocal(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a point by this object's inverse world transform.
         *
         * @param out Out point.
         * @param v Point to transform, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformPointInverseWorld(out, p) {
          p = p || out;
          _tempMemFloat[0] = p[0];
          _tempMemFloat[1] = p[1];
          _tempMemFloat[2] = p[2];
          _wl_object_transformPointInverseWorld(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform a point by this object's inverse local transform.
         *
         * @param out Out point.
         * @param p Point to transform, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        transformPointInverseLocal(out, p) {
          p = p || out;
          _tempMemFloat.set(p);
          _wl_object_transformPointInverseLocal(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          return out;
        }
        /**
         * Transform an object space dual quaternion into world space.
         *
         * @param out Out transformation.
         * @param q Local space transformation, default `out`.
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        toWorldSpaceTransform(out, q2) {
          q2 = q2 || out;
          _tempMemFloat.set(q2);
          _wl_object_toWorldSpaceTransform(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          out[3] = _tempMemFloat[3];
          out[4] = _tempMemFloat[4];
          out[5] = _tempMemFloat[5];
          out[6] = _tempMemFloat[6];
          out[7] = _tempMemFloat[7];
          return out;
        }
        /**
         * Transform a world space dual quaternion into local space
         *
         * @param {number[]} out Out transformation
         * @param {number[]} q World space transformation, default `out`
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        toLocalSpaceTransform(out, q2) {
          const p = this.parent;
          q2 = q2 || out;
          if (!p) {
            if (out !== q2) {
              out[0] = q2[0];
              out[1] = q2[1];
              out[2] = q2[2];
              out[3] = q2[3];
              out[4] = q2[4];
              out[5] = q2[5];
              out[6] = q2[6];
              out[7] = q2[7];
            }
          } else {
            p.toObjectSpaceTransform(q2);
          }
          return out;
        }
        /**
         * Transform a world space dual quaternion into object space
         *
         * @param out Out transformation.
         * @param q World space transformation, default `out`
         * @return The `out` parameter.
         *
         * @since 0.8.7
         */
        toObjectSpaceTransform(out, q2) {
          q2 = q2 || out;
          _tempMemFloat.set(q2);
          _wl_object_toObjectSpaceTransform(this.objectId, _tempMem);
          out[0] = _tempMemFloat[0];
          out[1] = _tempMemFloat[1];
          out[2] = _tempMemFloat[2];
          out[3] = _tempMemFloat[3];
          out[4] = _tempMemFloat[4];
          out[5] = _tempMemFloat[5];
          out[6] = _tempMemFloat[6];
          out[7] = _tempMemFloat[7];
          return out;
        }
        /**
         * Turn towards / look at target.
         *
         * @param v Target vector to turn towards.
         * @param up Up vector of this object, default `[0, 1, 0]`.
         */
        lookAt(v2, up = UP_VECTOR) {
          _wl_object_lookAt(this.objectId, v2[0], v2[1], v2[2], up[0], up[1], up[2]);
        }
        /** Destroy the object with all of its components and remove it from the scene */
        destroy() {
          _wl_scene_remove_object(this.objectId);
          this.objectId = null;
        }
        /**
         * Mark transformation dirty.
         *
         * Causes an eventual recalculation of {@link transformWorld}, either
         * on next {@link getTranslationWorld}, {@link transformWorld} or
         * {@link scalingWorld} or the beginning of next frame, whichever
         * happens first.
         */
        setDirty() {
          _wl_object_set_dirty(this.objectId);
        }
        /**
         * Disable/enable all components of this object.
         *
         * @param b New state for the components.
         *
         * @since 0.8.5
         */
        set active(b2) {
          const comps = this.getComponents();
          for (let c of comps) {
            c.active = b2;
          }
        }
        /**
         * Get a component attached to this object.
         *
         * @param typeOrClass Type name. It's also possible to give a class definition.
         *     In this case, the method will use the `class.TypeName` field to find the component.
         * @param index=0 Index for component of given type. This can be used to access specific
         *      components if the object has multiple components of the same type.
         * @returns The component or {@link null} if there is no such component on this object
         */
        getComponent(typeOrClass, index) {
          const type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
          const lengthBytes = lengthBytesUTF8(type) + 1;
          const mem = _malloc(lengthBytes);
          stringToUTF8(type, mem, lengthBytes);
          const componentType = _wl_get_component_manager_index(mem);
          _free(mem);
          if (componentType < 0) {
            const typeIndex = _WL._componentTypeIndices[type];
            const jsIndex = _wl_get_js_component_index(this.objectId, typeIndex, index || 0);
            return jsIndex < 0 ? null : _WL._components[jsIndex];
          }
          const componentId = _wl_get_component_id(this.objectId, componentType, index || 0);
          return _wrapComponent(type, componentType, componentId);
        }
        /**
         * @param typeOrClass Type name, pass a falsey value (`undefined` or {@link null}) to retrieve all.
         *     It's also possible to give a class definition. In this case, the method will use the `class.TypeName` field to
         *     find the components.
         * @returns All components of given type attached to this object.
         *
         * @note As this function is non-trivial, avoid using it in `update()` repeatedly,
         *      but rather store its result in `init()` or `start()`
         * @warning This method will currently return at most 341 components.
         */
        getComponents(typeOrClass) {
          let componentType = null;
          let type = null;
          if (typeOrClass) {
            type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
            componentType = $Object._typeIndexFor(type);
          }
          const components = [];
          const maxComps = Math.floor(_tempMemSize / 3 * 2);
          const componentsCount = _wl_object_get_components(this.objectId, _tempMem, maxComps);
          const offset = 2 * componentsCount;
          _wl_object_get_component_types(this.objectId, _tempMem + offset, maxComps);
          const jsManagerIndex = $Object._typeIndexFor("js");
          for (let i = 0; i < componentsCount; ++i) {
            const t = _tempMemUint8[i + offset];
            const componentId = _tempMemUint16[i];
            if (t == jsManagerIndex) {
              const comp = _WL._components[_wl_get_js_component_index_for_id(componentId)];
              if (componentType === null || comp.type == type)
                components.push(comp);
              continue;
            }
            if (componentType === null) {
              const managerName = $Object._typeNameFor(t);
              components.push(_wrapComponent(managerName, t, componentId));
            } else if (t == componentType) {
              components.push(_wrapComponent(type, componentType, componentId));
            }
          }
          return components;
        }
        /**
         * Add component of given type to the object.
         *
         * You can use this function to clone components, see the example below.
         *
         * ```js
         *  // Clone existing component (since 0.8.10)
         *  let original = this.object.getComponent('mesh');
         *  otherObject.addComponent('mesh', original);
         *  // Create component from parameters
         *  this.object.addComponent('mesh', {
         *      mesh: someMesh,
         *      material: someMaterial,
         *  });
         * ```
         *
         * @param typeOrClass Typename to create a component of. Can be native or
         *     custom JavaScript component type. It's also possible to give a class definition.
         *     In this case, the method will use the `class.TypeName` field.
         * @param params Parameters to initialize properties of the new component,
         *      can be another component to copy properties from.
         *
         * @returns {?(Component|CollisionComponent|TextComponent|ViewComponent|MeshComponent|InputComponent|LightComponent|AnimationComponent|PhysXComponent)} The component or {@link null} if the type was not found
         */
        addComponent(typeOrClass, params) {
          const type = isString(typeOrClass) ? typeOrClass : typeOrClass.TypeName;
          const componentType = $Object._typeIndexFor(type);
          let component = null;
          let componentIndex = null;
          if (componentType < 0) {
            if (!(type in _WL._componentTypeIndices)) {
              throw new TypeError("Unknown component type '" + type + "'");
            }
            const componentId = _wl_object_add_js_component(this.objectId, _WL._componentTypeIndices[type]);
            componentIndex = _wl_get_js_component_index_for_id(componentId);
            component = _WL._components[componentIndex];
          } else {
            const componentId = _wl_object_add_component(this.objectId, componentType);
            component = _wrapComponent(type, componentType, componentId);
          }
          if (params !== void 0) {
            for (const key in params) {
              if (EXCLUDED_COMPONENT_PROPERTIES.includes(key))
                continue;
              component[key] = params[key];
            }
          }
          if (componentType < 0) {
            _wljs_component_init(componentIndex);
          }
          if (!params || !("active" in params && !params.active)) {
            component.active = true;
          }
          return component;
        }
        /**
         * Whether given object's transformation has changed.
         */
        get changed() {
          return !!_wl_object_is_changed(this.objectId);
        }
        /**
         * Checks equality by comparing whether the wrapped native component ids
         * and component manager types are equal.
         *
         * @param otherObject Object to check equality with.
         * @returns Whether this object equals the given object.
         */
        equals(otherObject) {
          if (!otherObject)
            return false;
          return this.objectId == otherObject.objectId;
        }
        /**
         * Used internally.
         *
         * @param type The type
         * @return The component type
         */
        static _typeIndexFor(type) {
          const lengthBytes = lengthBytesUTF8(type) + 1;
          const mem = _malloc(lengthBytes);
          stringToUTF8(type, mem, lengthBytes);
          const componentType = _wl_get_component_manager_index(mem);
          _free(mem);
          return componentType;
        }
        /**
         * Used internally.
         *
         * @param typeIndex The type index
         * @return The name as a string
         */
        static _typeNameFor(typeIndex) {
          return UTF8ToString(_wl_component_manager_name(typeIndex));
        }
      };
      Skin = class {
        constructor(index) {
          this._index = index;
        }
        /** Amount of joints in this skin. */
        get jointCount() {
          return _wl_skin_get_joint_count(this._index);
        }
        /** Joints object ids for this skin */
        get jointIds() {
          return new Uint16Array(HEAPU16.buffer, _wl_skin_joint_ids(this._index), this.jointCount);
        }
        /**
         * Dual quaternions in a flat array of size 8 times {@link jointCount}.
         *
         * Inverse bind transforms of the skin.
         */
        get inverseBindTransforms() {
          return new Float32Array(HEAPF32.buffer, _wl_skin_inverse_bind_transforms(this._index), 8 * this.jointCount);
        }
        /**
         * Vectors in a flat array of size 3 times {@link jointCount}.
         *
         * Inverse bind scalings of the skin.
         */
        get inverseBindScalings() {
          return new Float32Array(HEAPF32.buffer, _wl_skin_inverse_bind_scalings(this._index), 3 * this.jointCount);
        }
      };
    }
  });

  // node_modules/@wonderlandengine/api/index.js
  var init_api = __esm({
    "node_modules/@wonderlandengine/api/index.js"() {
      init_esm();
      init_wonderland();
    }
  });

  // js/PostSpawner.js
  var PostSpawner_exports = {};
  var init_PostSpawner = __esm({
    "js/PostSpawner.js"() {
      init_index_esm2017();
      init_api();
      init_firestore_api();
      init_html_ui();
      WL.registerComponent("PostSpawner", {
        size: { type: WL.Type.Float, default: 1 },
        mesh: { type: WL.Type.Mesh },
        material: { type: WL.Type.Material },
        material_onclick: { type: WL.Type.Material },
        moon_mesh: { type: WL.Type.Mesh },
        moon_material: { type: WL.Type.Material },
        postPreviewObj: { type: WL.Type.Object }
      }, {
        init: function() {
          console.log("init() with param", this.param);
        },
        start: function() {
          this.postPreviewObj.active = false;
          console.log("start() with param", this.param);
          let updatePosts;
          updatePosts = () => {
            getPosts(db).then((posts) => {
              console.log("YO", posts);
              posts.forEach((post) => {
                if (!planets.has(post.ref.id)) {
                  var newObj = WL.scene.addObject();
                  this.size = 1 + (post.data().likes + post.data().comments.length) * 0.01;
                  newObj.scale([this.size, this.size, this.size]);
                  var newMesh = newObj.addComponent("mesh", { mesh: this.mesh });
                  var newCollision = newObj.addComponent("collision", { extents: [this.size, this.size, this.size], collider: Collider.Sphere, group: 1 });
                  var newInfo = newObj.addComponent("planetPostInfo");
                  newObj.addComponent("cursor-target");
                  newObj.addComponent("planetOnCollision", { material_org: this.material, material_change: this.material_onclick, postPreviewObj: this.postPreviewObj });
                  var mat2 = this.material.clone();
                  console.log(this.textures);
                  newMesh.material = mat2;
                  mat2.diffuseTexture = this.textures[Math.floor(Math.random() * this.textures.length)];
                  newInfo.planet_id = post.ref.id;
                  post.data().comments.forEach((comment) => {
                    newObj.rotateAxisAngleRadObject([1, 0, 0], Math.random());
                    var moonObj = WL.scene.addObject(newObj);
                    moonObj.scalingWorld = [0.3, 0.3, 0.3];
                    var moonMesh = moonObj.addComponent("mesh");
                    moonMesh.mesh = this.moon_mesh;
                    moonMesh.material = this.moon_material;
                    moonObj.addComponent("moonRotation", { speed: 360 * Math.random() });
                  });
                  do {
                    const minAngle = 0;
                    const maxAngle = -180;
                    const angle = Math.random() * (maxAngle - minAngle) + minAngle;
                    const x2 = Math.cos(angle) * 10;
                    const y2 = Math.sin(angle) * 10;
                    newObj.setTranslationWorld([Math.abs(x2), Math.abs(Math.floor(Math.random() * 7)), -Math.abs(y2)]);
                  } while (newObj.getComponent("collision").queryOverlaps().length != 0);
                  newObj.addComponent("planetRotation");
                  console.log(newObj.transformLocal);
                  planets.set(post.ref.id, { data: post.data(), object: newObj });
                  console.log("PostSpawner: ", newObj.getComponent("planetPostInfo").planet_id);
                }
              });
              setTimeout(updatePosts, 5e3);
            });
          };
          this.textures = [];
          ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp", "8.webp", "9.webp", "10.webp", "11.webp", "12.webp", "13.webp", "14.webp"].forEach((file) => {
            WL.textures.load("planettextures/" + file, "anonymous").then(
              (texture) => {
                this.textures.push(texture);
                if (this.textures.length == 5) {
                  updatePosts();
                }
              }
            );
          });
        },
        update: function(dt2) {
        }
      });
    }
  });

  // js/planetPostInfo.js
  var require_planetPostInfo = __commonJS({
    "js/planetPostInfo.js"() {
      WL.registerComponent("planetPostInfo", {
        planet_id: { type: WL.Type.String, default: "" }
      }, {
        init: function() {
        },
        start: function() {
          console.log("New Planet Spawned: ", this.planet_id);
        },
        update: function(dt2) {
        }
      });
    }
  });

  // js/planetRotation.js
  var require_planetRotation = __commonJS({
    "js/planetRotation.js"() {
      WL.registerComponent("planetRotation", {
        param: { type: WL.Type.Float, default: 1 }
      }, {
        init: function() {
          console.log("init() with param", this.param);
        },
        update: function(dt2) {
          this.object.rotateAxisAngleDegObject([0, 1, 0], dt2 * 10);
        }
      });
    }
  });

  // js/moonRotation.js
  var moonRotation_exports = {};
  var import_gl_matrix9;
  var init_moonRotation = __esm({
    "js/moonRotation.js"() {
      import_gl_matrix9 = __toESM(require_cjs());
      WL.registerComponent("moonRotation", {
        speed: { type: WL.Type.Float, default: 100 },
        x: { type: WL.Type.Float, default: 0 },
        y: { type: WL.Type.Float, default: 1 },
        z: { type: WL.Type.Float, default: 0 }
      }, {
        init: function() {
          console.log("init() with param", this.param);
        },
        start: function() {
          console.log(this.x, this.y, this.z);
          this.mag = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
          this.axis = [this.x, this.y, this.z];
          import_gl_matrix9.vec3.normalize(this.axis, this.axis);
          this.object.translate([0, 0, 2]);
        },
        update: function(dt2) {
          this.object.rotateAxisAngleDeg(this.axis, this.speed * dt2);
        }
      });
    }
  });

  // js/uiHandler.js
  var require_uiHandler = __commonJS({
    "js/uiHandler.js"() {
      var CanvasKeyboard = class {
        constructor(width, canvasui, lang = "EN") {
          const config = this.getConfig(lang);
          config.panelSize = { width, height: width * 0.5 };
          config.height = 256;
          config.body = { backgroundColor: "#555" };
          const object = WL.scene.addObject();
          object.name = "keyboard";
          const mesh = object.addComponent("mesh");
          const uimesh = canvasui.object.getComponent("mesh");
          mesh.mesh = uimesh.mesh;
          mesh.material = uimesh.material.clone();
          object.addComponent("cursor-target");
          const content = this.getContent(lang);
          this.keyboard = new CanvasUI(content, config, object);
          this.tmpVec = new Float32Array(3);
        }
        get object() {
          return this.keyboard.object;
        }
        getConfig(lang) {
          const config = {};
          let padding = 10;
          const paddingTop = 20;
          const width = (512 - 2 * padding) / 10 - padding;
          const height = (256 - 2 * padding) / 4 - padding;
          const hover = "#333";
          const backgroundColor = "#000";
          let y2 = padding;
          let x2 = padding;
          for (let i = 0; i < 10; i++) {
            const btn = { type: "button", position: { x: x2, y: y2 }, width, height, padding, paddingTop, backgroundColor, borderRadius: 6, hover, onSelect: this.onSelect.bind(this, i) };
            config[`btn${i}`] = btn;
            x2 += width + padding;
          }
          y2 += height + padding;
          x2 = padding;
          for (let i = 0; i < 10; i++) {
            const btn = { type: "button", position: { x: x2, y: y2 }, width, height, padding, paddingTop, backgroundColor, borderRadius: 6, hover, onSelect: this.onSelect.bind(this, i + 10) };
            config[`btn${i + 10}`] = btn;
            x2 += width + padding;
          }
          y2 += height + padding;
          x2 = padding;
          for (let i = 0; i < 9; i++) {
            const w2 = i == 0 || i == 8 ? width * 1.5 + padding * 0.5 : width;
            const btn = { type: "button", position: { x: x2, y: y2 }, width: w2, height, padding, paddingTop, backgroundColor, borderRadius: 6, hover, onSelect: this.onSelect.bind(this, i + 20) };
            config[`btn${i + 20}`] = btn;
            x2 += w2 + padding;
          }
          y2 += height + padding;
          x2 = padding;
          for (let i = 0; i < 5; i++) {
            const w2 = i == 0 || i == 4 ? width * 2 + padding : i == 2 ? width * 4 + 3 * padding : width;
            const btn = { type: "button", position: { x: x2, y: y2 }, width: w2, height, padding, paddingTop, backgroundColor, borderRadius: 6, hover, onSelect: this.onSelect.bind(this, i + 30) };
            if (i == 0)
              btn.fontSize = 20;
            config[`btn${i + 30}`] = btn;
            x2 += w2 + padding;
          }
          return config;
        }
        getContent(lang, layoutIndex = 0) {
          let content = {};
          let keys;
          this.language = lang;
          this.keyboardIndex = layoutIndex;
          switch (layoutIndex) {
            case 0:
              keys = [
                "q",
                "w",
                "e",
                "r",
                "t",
                "y",
                "u",
                "i",
                "o",
                "p",
                "a",
                "s",
                "d",
                "f",
                "g",
                "h",
                "j",
                "k",
                "l",
                "@",
                "\u21E7",
                "z",
                "x",
                "c",
                "v",
                "b",
                "n",
                "m",
                "\u21E6",
                "",
                "?123",
                ",",
                "   ",
                ".",
                "\u21B2"
              ];
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "")
                  content[`btn${i}`] = key;
              }
              break;
            case 1:
              keys = [
                "Q",
                "W",
                "E",
                "R",
                "T",
                "Y",
                "U",
                "I",
                "O",
                "P",
                "A",
                "S",
                "D",
                "F",
                "G",
                "H",
                "J",
                "K",
                "L",
                "@",
                "\u21E7",
                "Z",
                "X",
                "C",
                "V",
                "B",
                "N",
                "M",
                "\u21E6",
                "",
                "?123",
                ",",
                "   ",
                ".",
                "\u21B2"
              ];
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "")
                  content[`btn${i}`] = key;
              }
              break;
            case 2:
              keys = [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                "@",
                "#",
                "%",
                "&",
                "*",
                "/",
                "-",
                "+",
                "(",
                ")",
                "\u21E7",
                "?",
                "!",
                '"',
                "'",
                "\\",
                ":",
                ";",
                "\u21E6",
                "",
                "abc",
                ",",
                "   ",
                ".",
                "\u21B2"
              ];
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "")
                  content[`btn${i}`] = key;
              }
              break;
            case 3:
              keys = [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "0",
                "\u20AC",
                "\xA3",
                "$",
                "^",
                "=",
                "|",
                "{",
                "}",
                "[",
                "}",
                "\u21E7",
                "<",
                ">",
                "_",
                "`",
                "~",
                ":",
                ";",
                "\u21E6",
                "",
                "abc",
                ",",
                "   ",
                ".",
                "\u21B2"
              ];
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key !== "")
                  content[`btn${i}`] = key;
              }
              break;
          }
          return content;
        }
        get position() {
          const pos = this.keyboard.object.getTranslationWorld(this.tmpVec);
          return pos;
        }
        get positionLocal() {
          const pos = this.keyboard.object.getTranslationLocal(this.tmpVec);
          return pos;
        }
        get visible() {
          return this.active;
        }
        set visible(value) {
          this.keyboard.object.active = value;
          this.active = value;
        }
        setKeyboard(index) {
          this.keyboard.content = this.getContent(this.language, index);
          this.keyboard.needsUpdate = true;
        }
        onSelect(index) {
          if (!this.visible)
            return;
          let change = false;
          switch (index) {
            case 34:
              this.visible = false;
              if (this.linkedElement.onEnter)
                this.linkedElement.onEnter(this.linkedText);
              break;
            case 32:
              this.linkedText += " ";
              change = true;
              break;
            case 30:
              this.shift = false;
              if (this.keyboardIndex < 2) {
                this.setKeyboard(2);
              } else {
                this.setKeyboard(0);
              }
              this.keyboard.needsUpdate = true;
              break;
            case 28:
              this.linkedText = this.linkedText.substring(0, this.linkedText.length - 1);
              change = true;
              break;
            case 20:
              this.shift = !this.shift;
              if (this.keyboardIndex == 0) {
                this.setKeyboard(1);
              } else if (this.keyboardIndex == 1) {
                this.setKeyboard(0);
              } else if (this.keyboardIndex == 2) {
                this.setKeyboard(3);
              } else if (this.keyboardIndex == 3) {
                this.setKeyboard(2);
              }
              break;
            default:
              const txt = this.keyboard.content[`btn${index}`];
              this.linkedText += txt;
              change = true;
              if (this.keyboardIndex == 1)
                this.setKeyboard(0);
              break;
          }
          if (change) {
            this.linkedUI.updateElement(this.linkedName, this.linkedText);
            if (this.linkedElement.onChanged)
              this.linkedElement.onChanged(this.linkedText);
          }
        }
        update() {
          if (this.keyboard) {
            this.keyboard.update();
          }
        }
      };
      var CanvasUI = class {
        constructor(content, config, object) {
          const defaultconfig = {
            width: 512,
            height: 512,
            opacity: 0.7,
            body: {
              fontFamily: "Arial",
              fontSize: 30,
              padding: 20,
              backgroundColor: "#000",
              fontColor: "#fff",
              borderRadius: 6
            }
          };
          this.config = config === void 0 ? defaultconfig : config;
          if (this.config.width === void 0)
            this.config.width = 512;
          if (this.config.height === void 0)
            this.config.height = 512;
          if (this.config.body === void 0)
            this.config.body = { fontFamily: "Arial", size: 30, padding: 20, backgroundColor: "#000", fontColor: "#fff", borderRadius: 6 };
          if (this.config.collisionGroup === void 0) {
            this.collisionGroup = 1;
          } else {
            this.collisionGroup = 1 << this.config.collisionGroup;
          }
          const body = this.config.body;
          if (body.borderRadius === void 0)
            body.borderRadius = 6;
          if (body.fontFamily === void 0)
            body.fontFamily = "Arial";
          if (body.padding === void 0)
            body.padding = 20;
          if (body.fontSize === void 0)
            body.fontSize = 30;
          if (body.backgroundColor === void 0)
            body.backgroundColor = "#000";
          if (body.fontColor === void 0)
            body.fontColor = "#fff";
          Object.entries(this.config).forEach(([name3, value]) => {
            if (typeof value === "object" && name3 !== "panelSize") {
              const pos = value.position !== void 0 ? value.position : { x: 0, y: 0 };
              if (pos.left !== void 0 && pos.x === void 0)
                pos.x = pos.left;
              if (pos.top !== void 0 && pos.y === void 0)
                pos.y = pos.top;
              const width = value.width !== void 0 ? value.width : this.config.width;
              const height = value.height !== void 0 ? value.height : this.config.height;
              if (pos.right !== void 0 && pos.x === void 0)
                pos.x = this.config.width - pos.right - width;
              if (pos.bottom !== void 0 && pos.y === void 0)
                pos.y = this.config.height - pos.bottom - height;
              if (pos.x === void 0)
                pos.x = 0;
              if (pos.y === void 0)
                pos.y = 0;
              value.position = pos;
              if (value.type === void 0)
                value.type = "text";
            }
          });
          this.canvas = this.createOffscreenCanvas(this.config.width, this.config.height);
          this.context = this.canvas.getContext("2d");
          this.context.save();
          const opacity = this.config.opacity !== void 0 ? this.config.opacity : 0.7;
          const mesh = object.getComponent("mesh");
          this.material = mesh.material;
          this.canvasTexture = new WL.Texture(this.canvas);
          this.material.flatTexture = this.canvasTexture;
          if (config.panelSize) {
            object.resetScaling();
            const scale = [config.panelSize.width, config.panelSize.height, 0.01];
            object.scale(scale);
            this.panelSize = config.panelSize;
          } else {
            this.panelSize = { width: 1, height: 1 };
          }
          this.object = object;
          this.tmpVec = new Float32Array(3);
          this.tmpVec1 = new Float32Array(3);
          this.tmpQuat = new Float32Array(4);
          const inputs = Object.values(this.config).filter((value) => {
            return value.type === "input-text";
          });
          if (inputs.length > 0) {
            const width = config.panelSize ? config.panelSize.width : 1;
            const height = config.panelSize ? config.panelSize.height : 1;
            let halfheight = height / 2;
            this.keyboard = new CanvasKeyboard(width, this);
            this.getEuler(this.tmpVec, this.object.rotationWorld);
            let theta = this.tmpVec[1];
            this.tmpVec[0] = 0;
            this.tmpVec[2] = -Math.cos(theta) / halfheight;
            this.tmpVec[1] = Math.sin(theta) / halfheight;
            console.log(`CanvasUI create keyboard 1 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec)}`);
            halfheight = width / 4;
            this.getEuler(this.tmpVec1, this.keyboard.keyboard.object.rotationWorld);
            theta += -15 * Math.PI / 180;
            this.tmpVec1[0] = 0;
            this.tmpVec1[2] = -Math.cos(theta) / halfheight;
            this.tmpVec1[1] = Math.sin(theta) / halfheight;
            console.log(`CanvasUI create keyboard 2 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec1)}`);
            glMatrix.vec3.add(this.tmpVec, this.tmpVec, this.tmpVec1);
            console.log(`CanvasUI create keyboard 3 theta=${theta.toFixed(2)} offset=${this.vecToStr(this.tmpVec)}`);
            const obj = this.keyboard.object;
            glMatrix.quat.fromEuler(this.tmpQuat, -15, 0, 0);
            obj.rotate(this.tmpQuat);
            obj.translate(this.tmpVec);
            glMatrix.vec3.divide(this.tmpVec, obj.scalingLocal, object.scalingWorld);
            obj.resetScaling();
            obj.scale(this.tmpVec);
            obj.parent = object;
            obj.setDirty();
            this.keyboard.visible = false;
          }
          if (content === void 0) {
            this.content = { body: "" };
            this.config.body.type = "text";
          } else {
            this.content = content;
            const btns = Object.values(config).filter((value) => {
              return value.type === "button" || value.overflow === "scroll" || value.type === "input-text";
            });
            if (btns.length > 0) {
              WL.onXRSessionStart.push(this.initControllers.bind(this));
              const extents = new Float32Array(3);
              glMatrix.vec3.copy(extents, this.object.scalingWorld);
              const collision = this.object.addComponent("collision", { collider: 2, extents, group: this.collisionGroup });
            }
          }
          this.selectedElements = [void 0, void 0];
          this.selectPressed = [false, false];
          this.scrollData = [void 0, void 0];
          this.intersects = [void 0, void 0];
          this.needsUpdate = true;
          this.update();
        }
        vecToStr(v2, precision = 2) {
          let str = "";
          if (v2) {
            for (let i = 0; i < v2.length; i++) {
              str += v2[i].toFixed(precision) + ", ";
            }
          }
          return str;
        }
        //returns yaw, pitch, roll
        getEuler(out, quat5) {
          let x2 = quat5[0], y2 = quat5[1], z2 = quat5[2], w2 = quat5[3], x22 = x2 * x2, y22 = y2 * y2, z22 = z2 * z2, w22 = w2 * w2;
          let unit = x22 + y22 + z22 + w22;
          let test = x2 * w2 - y2 * z2;
          if (test > 0.499995 * unit) {
            out[0] = Math.PI / 2;
            out[1] = 2 * Math.atan2(y2, x2);
            out[2] = 0;
          } else if (test < -0.499995 * unit) {
            out[0] = -Math.PI / 2;
            out[1] = 2 * Math.atan2(y2, x2);
            out[2] = 0;
          } else {
            out[0] = Math.asin(2 * (x2 * z2 - w2 * y2));
            out[1] = Math.atan2(2 * (x2 * w2 + y2 * z2), 1 - 2 * (z22 + w22));
            out[2] = Math.atan2(2 * (x2 * y2 + z2 * w2), 1 - 2 * (y22 + z22));
          }
          return out;
        }
        getIntersectY(index) {
          const height = this.config.height || 512;
          const intersect = this.intersects[index];
          if (intersect === void 0)
            return 0;
          if (intersect.xy === void 0)
            return 0;
          return intersect.xy[1];
        }
        get selectIsPressed() {
          return this.selectPressed[0] || this.selectPressed[1];
        }
        initControllers(s) {
          this.session = s;
          const root = new WL.Object(0);
          root.children.forEach((child) => {
            if (child.name == "Player") {
              const space = child.children[0];
              space.children.forEach((child2) => {
                if (child2.name == "CursorLeft")
                  this.rayLeft = child2;
                if (child2.name == "CursorRight")
                  this.rayRight = child2;
              });
            }
          });
          if (!(this.rayLeft && this.rayRight))
            console.warn("Player CursorLeft or Player CursorRight not found");
          function onSelect(event) {
            const index = event.inputSource.handedness === "left" ? 0 : 1;
            const elm = this.selectedElements[index];
            if (elm !== void 0) {
              if (elm.type == "button") {
                this.select(index);
              } else if (elm.type == "input-text") {
                if (this.keyboard) {
                  if (this.keyboard.visible) {
                    this.keyboard.linkedUI = void 0;
                    this.keyboard.linkedText = void 0;
                    this.keyboard.linkedElement = void 0;
                    this.keyboard.visible = false;
                  } else {
                    this.keyboard.linkedUI = this;
                    let name3;
                    Object.entries(this.config).forEach(([prop, value]) => {
                      if (value == elm)
                        name3 = prop;
                    });
                    const y2 = (0.5 - (elm.position.y + elm.height + this.config.body.padding) / this.config.height) * this.panelSize.height;
                    const h = Math.max(this.panelSize.width, this.panelSize.height) / 2;
                    this.keyboard.linkedText = this.content[name3];
                    this.keyboard.linkedName = name3;
                    this.keyboard.linkedElement = elm;
                    this.keyboard.visible = true;
                  }
                }
              }
            }
          }
          ;
          function onSelectStart(event) {
            const index = event.inputSource.handedness === "left" ? 0 : 1;
            this.selectPressed[index] = true;
            if (this.selectedElements[index] !== void 0 && this.selectedElements[index].overflow == "scroll") {
              const elm = this.selectedElements[index];
              this.scrollData[index] = { scrollY: elm.scrollY, rayY: this.getIntersectY(index) };
            }
          }
          function onSelectEnd(event) {
            const index = event.inputSource.handedness === "left" ? 0 : 1;
            this.selectPressed[index] = false;
            if (this.selectedElements[index] !== void 0 && this.selectedElements[index].overflow == "scroll") {
              this.scrollData[index] = void 0;
            }
          }
          s.addEventListener("end", function() {
            this.session = null;
          }.bind(this));
          s.addEventListener("select", onSelect.bind(this));
          s.addEventListener("selectstart", onSelectStart.bind(this));
          s.addEventListener("selectend", onSelectEnd.bind(this));
        }
        setClip(elm) {
          const context = this.context;
          context.restore();
          context.save();
          if (elm.clipPath !== void 0) {
            const path = new Path2D(elm.clipPath);
            context.clip(path);
          } else {
            const pos = elm.position !== void 0 ? elm.position : { x: 0, y: 0 };
            const borderRadius = elm.borderRadius || 0;
            const width = elm.width || this.config.width;
            const height = elm.height || this.config.height;
            context.beginPath();
            if (borderRadius !== 0) {
              const angle = Math.PI / 2;
              context.moveTo(pos.x + borderRadius, pos.y);
              context.arc(pos.x + borderRadius, pos.y + borderRadius, borderRadius, angle, angle * 2, true);
              context.lineTo(pos.x, pos.y + height - borderRadius);
              context.arc(pos.x + borderRadius, pos.y + height - borderRadius, borderRadius, 0, angle, true);
              context.lineTo(pos.x + width - borderRadius, pos.y + height);
              context.arc(pos.x + width - borderRadius, pos.y + height - borderRadius, borderRadius, angle * 3, angle * 4, true);
              context.lineTo(pos.x + width, pos.y + borderRadius);
              context.arc(pos.x + width - borderRadius, pos.y + borderRadius, borderRadius, angle * 2, angle * 3, true);
              context.closePath();
              context.clip();
            } else {
              context.rect(pos.x, pos.y, width, height);
              context.clip();
            }
          }
        }
        setPosition(x2, y2, z2) {
          if (this.mesh === void 0)
            return;
          this.mesh.position.set(x2, y2, z2);
        }
        setRotation(x2, y2, z2) {
          if (this.mesh === void 0)
            return;
          this.mesh.rotation.set(x2, y2, z2);
        }
        updateElement(name3, content) {
          let elm = this.content[name3];
          if (elm === void 0) {
            console.warn(`CanvasUI.updateElement: No ${name3} found`);
            return;
          }
          if (typeof elm === "object") {
            elm.content = content;
          } else {
            elm = content;
          }
          this.content[name3] = elm;
          this.needsUpdate = true;
        }
        get panel() {
          return this.mesh;
        }
        getElementAtLocation(x2, y2) {
          const elms = Object.entries(this.config).filter(([name3, elm2]) => {
            if (typeof elm2 === "object" && name3 !== "panelSize" && name3 !== "body") {
              const pos = elm2.position;
              const width = elm2.width !== void 0 ? elm2.width : this.config.width;
              const height = elm2.height !== void 0 ? elm2.height : this.config.height;
              return x2 >= pos.x && x2 < pos.x + width && y2 >= pos.y && y2 < pos.y + height;
            }
          });
          const elm = elms.length == 0 ? null : this.config[elms[0][0]];
          return elm;
        }
        updateConfig(name3, property, value) {
          let elm = this.config[name3];
          if (elm === void 0) {
            console.warn(`CanvasUI.updateconfig: No ${name3} found`);
            return;
          }
          elm[property] = value;
          this.needsUpdate = true;
        }
        hover(index = 0, xy) {
          if (xy === void 0) {
            if (this.selectedElements[index] !== void 0) {
              this.selectedElements[index] = void 0;
              this.needsUpdate = true;
            }
          } else {
            const x2 = xy[0];
            const y2 = xy[1];
            const elm = this.getElementAtLocation(x2, y2);
            if (elm === null) {
              if (this.selectedElements[index] !== void 0) {
                this.selectedElements[index] = void 0;
                this.needsUpdate = true;
              }
            } else if (this.selectedElements[index] !== elm) {
              this.selectedElements[index] = elm;
              this.needsUpdate = true;
            }
          }
        }
        select(index = 0, mouse = false) {
          if (this.selectedElements[index] !== void 0) {
            const elm = this.selectedElements[index];
            if (elm.onSelect)
              elm.onSelect();
            if (elm.type === "input-text") {
              if (mouse) {
                if (this.keyboard) {
                  if (this.keyboard.visible) {
                    this.keyboard.linkedUI = void 0;
                    this.keyboard.linkedText = void 0;
                    this.keyboard.linkedElement = void 0;
                    this.keyboard.visible = false;
                  } else {
                    this.keyboard.linkedUI = this;
                    let name3;
                    Object.entries(this.config).forEach(([prop, value]) => {
                      if (value == elm)
                        name3 = prop;
                    });
                    const y2 = (0.5 - (elm.position.y + elm.height + this.config.body.padding) / this.config.height) * this.panelSize.height;
                    const h = Math.max(this.panelSize.width, this.panelSize.height) / 2;
                    this.keyboard.linkedText = this.content[name3];
                    this.keyboard.linkedName = name3;
                    this.keyboard.linkedElement = elm;
                    this.keyboard.visible = true;
                  }
                }
              } else {
                this.keyboard.visible = this.keyboard.visible ? false : true;
              }
            } else {
              this.selectedElements[index] = void 0;
            }
          }
        }
        scroll(index) {
          if (this.selectedElements[index] === void 0) {
            if (this.intersectMesh)
              this.intersectMesh[index].visible = false;
            return;
          }
          if (this.selectedElements[index].overflow !== "scroll")
            return;
          const elm = this.selectedElements[index];
          if (this.selectPressed[index]) {
            const scrollData = this.scrollData[index];
            if (scrollData !== void 0) {
              if (this.intersectMesh) {
                this.intersectMesh[index].visible = true;
                this.intersectMesh[index].position.copy(this.intersects[index].point);
              }
              const rayY = this.getIntersectY(index);
              const offset = rayY - scrollData.rayY;
              elm.scrollY = Math.min(Math.max(elm.minScrollY, scrollData.scrollY + offset), 0);
              this.needsUpdate = true;
            }
          } else {
            if (this.intersectMesh)
              this.intersectMesh[index].visible = false;
          }
        }
        worldToCanvas(pos) {
          this.object.transformPointInverseWorld(this.tmpVec, pos);
          glMatrix.vec3.copy(this.tmpVec1, this.object.scalingWorld);
          glMatrix.vec3.div(this.tmpVec, this.tmpVec, this.tmpVec1);
          const xy = new Float32Array(2);
          xy[0] = (this.tmpVec[0] + 1) / 2 * this.config.width;
          xy[1] = (1 - (this.tmpVec[1] + 1) / 2) * this.config.height;
          return xy;
        }
        handleController(controller, index) {
          if (controller == null)
            return;
          controller.getTranslationWorld(this.tmpVec);
          controller.getForward(this.tmpVec1);
          const intersects = WL.scene.rayCast(this.tmpVec, this.tmpVec1, this.collisionGroup, 100);
          if (intersects.hitCount > 0) {
            intersects.xy = this.worldToCanvas(intersects.locations[0]);
            this.hover(index, intersects.xy);
            this.intersects[index] = intersects;
            this.scroll(index);
          } else {
            this.hover(index);
            this.intersects[index] = void 0;
            this.scroll(index);
          }
        }
        update() {
          if (this.rayLeft)
            this.handleController(this.rayLeft, 0);
          if (this.rayRight)
            this.handleController(this.rayRight, 1);
          if (this.keyboard && this.keyboard.visible)
            this.keyboard.update();
          if (!this.needsUpdate)
            return;
          let context = this.context;
          context.clearRect(0, 0, this.config.width, this.config.height);
          const bgColor = this.config.body.backgroundColor ? this.config.body.backgroundColor : "#000";
          const fontFamily = this.config.body.fontFamily ? this.config.body.fontFamily : "Arial";
          const fontColor = this.config.body.fontColor ? this.config.body.fontColor : "#fff";
          const fontSize = this.config.body.fontSize ? this.config.body.fontSize : 30;
          this.setClip(this.config.body);
          context.fillStyle = bgColor;
          context.fillRect(0, 0, this.config.width, this.config.height);
          Object.entries(this.content).forEach(([name3, content]) => {
            const config = this.config[name3] !== void 0 ? this.config[name3] : this.config.body;
            const display = config.display !== void 0 ? config.display : "block";
            if (display !== "none") {
              const pos = config.position !== void 0 ? config.position : { x: 0, y: 0 };
              const width = config.width !== void 0 ? config.width : this.config.width;
              const height = config.height !== void 0 ? config.height : this.config.height;
              if (config.type == "button" && !content.toLowerCase().startsWith("<path>")) {
                if (config.borderRadius === void 0)
                  config.borderRadius = 6;
                if (config.textAlign === void 0)
                  config.textAlign = "center";
              }
              this.setClip(config);
              const svgPath = content.toLowerCase().startsWith("<path>");
              const hover = this.selectedElements[0] !== void 0 && this.selectedElements[0] === config || this.selectedElements[1] !== void 0 && this.selectedElements[1] === config;
              if (config.backgroundColor !== void 0) {
                if (hover && config.type == "button" && config.hover !== void 0) {
                  context.fillStyle = config.hover;
                } else {
                  context.fillStyle = config.backgroundColor;
                }
                context.fillRect(pos.x, pos.y, width, height);
              }
              if (config.type == "text" || config.type == "button" || config.type == "input-text") {
                let stroke = false;
                if (hover) {
                  if (!svgPath && config.type == "button") {
                    context.fillStyle = config.fontColor !== void 0 ? config.fontColor : fontColor;
                  } else {
                    context.fillStyle = config.hover !== void 0 ? config.hover : config.fontColor !== void 0 ? config.fontColor : fontColor;
                  }
                  stroke = config.hover === void 0;
                } else {
                  context.fillStyle = config.fontColor !== void 0 ? config.fontColor : fontColor;
                }
                if (svgPath) {
                  const code = content.toUpperCase().substring(6, content.length - 7);
                  context.save();
                  context.translate(pos.x, pos.y);
                  const path = new Path2D(code);
                  context.fill(path);
                  context.restore();
                } else {
                  this.wrapText(name3, content);
                }
                if (stroke) {
                  context.beginPath();
                  context.strokeStyle = "#fff";
                  context.lineWidth = 2;
                  context.rect(pos.x, pos.y, width, height);
                  context.stroke();
                }
              } else if (config.type == "img") {
                if (config.img === void 0) {
                  this.loadImage(content).then((img) => {
                    console.log(`w: ${img.width} | h: ${img.height}`);
                    config.img = img;
                    this.needsUpdate = true;
                    this.update();
                  }).catch((err) => console.error(err));
                } else {
                  const aspect = config.img.width / config.img.height;
                  const h = width / aspect;
                  context.drawImage(config.img, pos.x, pos.y, width, h);
                }
              }
            }
          });
          if (this.canvasTexture)
            this.canvasTexture.update();
          this.needsUpdate = false;
        }
        loadImage(src) {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.addEventListener("load", () => resolve(img));
            img.addEventListener("error", (err) => reject(err));
            img.src = src;
          });
        }
        createOffscreenCanvas(w2, h) {
          const canvas = document.createElement("canvas");
          canvas.width = w2;
          canvas.height = h;
          return canvas;
        }
        fillRoundedRect(x2, y2, w2, h, radius) {
          const ctx = this.context;
          ctx.beginPath();
          ctx.moveTo(x2 + radius, y2);
          ctx.lineTo(x2 + w2 - radius, y2);
          ctx.quadraticCurveTo(x2 + w2, y2, x2 + w2, y2 + radius);
          ctx.lineTo(x2 + w2, y2 + h - radius);
          ctx.quadraticCurveTo(x2 + w2, y2 + h, x2 + w2 - radius, y2 + h);
          ctx.lineTo(x2 + radius, y2 + h);
          ctx.quadraticCurveTo(x2, y2 + h, x2, y2 + h - radius);
          ctx.lineTo(x2, y2 + radius);
          ctx.quadraticCurveTo(x2, y2, x2 + radius, y2);
          ctx.closePath();
          ctx.fill();
        }
        lookAt(pos) {
          if (this.mesh === void 0)
            return;
          if (!(pos instanceof Vector3)) {
            console.error("CanvasUI lookAt called parameter not a THREE.Vector3");
            return;
          }
          this.mesh.lookAt(pos);
        }
        get visible() {
          if (this.mesh === void 0)
            return false;
          return this.mesh.active;
        }
        set visible(value) {
          if (this.mesh) {
            this.mesh.active = value;
          }
        }
        get position() {
          if (this.object === void 0)
            return void 0;
          this.object.getTranslationWorld(this.tmpVec);
          return this.tmpVec;
        }
        set position(value) {
          if (this.object === void 0)
            return;
          if (!(value instanceof Float32Array)) {
            console.error("CanvasUI trying to set the object position using a parameter that is not a Float32Array");
            return;
          }
          this.object.setTranslationWorld(value);
        }
        get quaternion() {
          if (this.object === void 0)
            return void 0;
          this.object.getTranslationWorld(this.tmpVec);
          return this.tmpVec;
        }
        set quaternion(value) {
          if (this.mesh === void 0)
            return;
          if (!(value instanceof QUaternion)) {
            console.error("CanvasUI trying to set the object quaternion using a parameter that is not a THREE.Quaternion");
            return;
          }
          this.mesh.quaternion.copy(value);
        }
        wrapText(name3, txt) {
          const words = txt.split(" ");
          let line = "";
          const lines = [];
          const config = this.config[name3] !== void 0 ? this.config[name3] : this.config.body;
          const width = config.width !== void 0 ? config.width : this.config.width;
          const height = config.height !== void 0 ? config.height : this.config.height;
          const pos = config.position !== void 0 ? config.position : { x: 0, y: 0 };
          const padding = config.padding !== void 0 ? config.padding : this.config.body.padding !== void 0 ? this.config.body.padding : 10;
          const paddingTop = config.paddingTop !== void 0 ? config.paddingTop : padding;
          const paddingLeft = config.paddingLeft !== void 0 ? config.paddingLeft : padding;
          const paddingBottom = config.paddingBottom !== void 0 ? config.paddingBottom : padding;
          const paddingRight = config.paddingRight !== void 0 ? config.paddingRight : padding;
          const rect = { x: pos.x + paddingLeft, y: pos.y + paddingTop, width: width - paddingLeft - paddingRight, height: height - paddingTop - paddingBottom };
          const textAlign = config.textAlign !== void 0 ? config.textAlign : this.config.body.textAlign !== void 0 ? this.config.body.textAlign : "left";
          const fontSize = config.fontSize !== void 0 ? config.fontSize : this.config.body.fontSize !== void 0 ? this.config.body.fontSize : 30;
          const fontFamily = config.fontFamily !== void 0 ? config.fontFamily : this.config.body.fontFamily !== void 0 ? this.config.body.fontFamily : "Arial";
          const leading = config.leading !== void 0 ? config.leading : this.config.body.leading !== void 0 ? this.config.body.leading : 8;
          const lineHeight = fontSize + leading;
          const context = this.context;
          context.textAlign = textAlign;
          context.font = `${fontSize}px '${fontFamily}'`;
          words.forEach(function(word) {
            let testLine = words.length > 1 ? `${line}${word} ` : word;
            let metrics = context.measureText(testLine);
            if (metrics.width > rect.width && word.length > 1) {
              if (line.length == 0 && metrics.width > rect.width) {
                while (metrics.width > rect.width) {
                  let count = 0;
                  do {
                    count++;
                    testLine = word.substr(0, count);
                    metrics = context.measureText(testLine);
                  } while (metrics.width < rect.width && count < word.length - 1);
                  count--;
                  testLine = word.substr(0, count);
                  lines.push(testLine);
                  word = word.substr(count);
                  if (count <= 1)
                    break;
                  metrics = context.measureText(word);
                }
                if (word != "")
                  lines.push(word);
              } else {
                lines.push(line);
                line = `${word} `;
              }
            } else {
              line = testLine;
            }
          });
          if (line != "")
            lines.push(line);
          const textHeight = lines.length * lineHeight;
          let scrollY = 0;
          if (textHeight > rect.height && config.overflow === "scroll") {
            if (config.scrollY === void 0)
              config.scrollY = 0;
            const fontColor = config.fontColor !== void 0 ? config.fontColor : this.config.body.fontColor;
            context.fillStyle = "#aaa";
            this.fillRoundedRect(pos.x + width - 12, pos.y, 12, height, 6);
            context.fillStyle = "#666";
            const scale = rect.height / textHeight;
            const thumbHeight = scale * height;
            const thumbY = -config.scrollY * scale;
            this.fillRoundedRect(pos.x + width - 12, pos.y + thumbY, 12, thumbHeight, 6);
            context.fillStyle = fontColor;
            scrollY = config.scrollY;
            config.minScrollY = rect.height - textHeight;
          }
          let y2 = scrollY + rect.y + fontSize / 2;
          let x2;
          switch (textAlign) {
            case "center":
              x2 = rect.x + rect.width / 2;
              break;
            case "right":
              x2 = rect.x + rect.width;
              break;
            default:
              x2 = rect.x;
              break;
          }
          lines.forEach((line2) => {
            if (y2 + lineHeight > 0)
              context.fillText(line2, x2, y2);
            y2 += lineHeight;
          });
        }
      };
      WL.registerComponent("uiHandler", {
        panel: { type: WL.Type.Enum, values: ["simple", "buttons", "scrolling", "images", "input-text"], default: "simple" }
      }, {
        init: function() {
        },
        start: function() {
          this.target = this.object.getComponent("cursor-target");
          this.target.addHoverFunction(this.onHover.bind(this));
          this.target.addUnHoverFunction(this.onUnHover.bind(this));
          this.target.addMoveFunction(this.onMove.bind(this));
          this.target.addDownFunction(this.onDown.bind(this));
          this.target.addUpFunction(this.onUp.bind(this));
          this.soundClick = this.object.addComponent("howler-audio-source", { src: "sfx/click.wav", spatial: true });
          this.soundUnClick = this.object.addComponent("howler-audio-source", { src: "sfx/unclick.wav", spatial: true });
          switch (this.panel) {
            case 0:
              this.simplePanel();
              break;
            case 1:
              this.buttonsPanel();
              break;
            case 2:
              this.scrollPanel();
              break;
            case 3:
              this.imagePanel();
              break;
            case 4:
              this.inputTextPanel();
              break;
          }
        },
        simplePanel: function() {
          const config = {
            main: {
              type: "text",
              position: { top: 128 },
              height: 256,
              // default height is 512 so this is 512 - header height (70) - footer height (70)
              backgroundColor: "#bbb",
              fontColor: "#000"
            }
          };
          const content = {
            main: "test text"
          };
          this.setPost = (p) => {
            content.main = p;
          };
          this.ui = new CanvasUI(content, config, this.object);
          this.ui.update();
          let ui = this.ui;
        },
        buttonsPanel: function() {
          function onPrev() {
            const msg = "Prev pressed";
            console.log(msg);
            ui.updateElement("info", msg);
          }
          function onStop() {
            const msg = "Stop pressed";
            console.log(msg);
            ui.updateElement("info", msg);
          }
          function onNext() {
            const msg = "Next pressed";
            console.log(msg);
            ui.updateElement("info", msg);
          }
          function onContinue() {
            const msg = "Continue pressed";
            console.log(msg);
            ui.updateElement("info", msg);
          }
          const config = {
            panelSize: {
              width: 1,
              height: 0.25
            },
            height: 128,
            info: {
              type: "text",
              position: { left: 6, top: 6 },
              width: 500,
              height: 58,
              backgroundColor: "#aaa",
              fontColor: "#000"
            },
            prev: {
              type: "button",
              position: { top: 64, left: 0 },
              width: 64,
              fontColor: "#bb0",
              hover: "#ff0",
              onSelect: onPrev
            },
            stop: {
              type: "button",
              position: { top: 64, left: 64 },
              width: 64,
              fontColor: "#bb0",
              hover: "#ff0",
              onSelect: onStop
            },
            next: {
              type: "button",
              position: { top: 64, left: 128 },
              width: 64,
              fontColor: "#bb0",
              hover: "#ff0",
              onSelect: onNext
            },
            continue: {
              type: "button",
              position: { top: 70, right: 10 },
              width: 200,
              height: 52,
              fontColor: "#fff",
              backgroundColor: "#1bf",
              hover: "#3df",
              onSelect: onContinue
            }
          };
          const content = {
            info: "",
            prev: "<path>M 10 32 L 54 10 L 54 54 Z</path>",
            stop: "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>",
            next: "<path>M 54 32 L 10 10 L 10 54 Z</path>",
            continue: "Continue"
          };
          this.ui = new CanvasUI(content, config, this.object);
          this.ui.update();
          let ui = this.ui;
        },
        scrollPanel: function() {
          const config = {
            body: {
              backgroundColor: "#666"
            },
            txt: {
              type: "text",
              overflow: "scroll",
              position: { left: 20, top: 20 },
              width: 460,
              height: 400,
              backgroundColor: "#fff",
              fontColor: "#000"
            }
          };
          const content = {
            txt: "This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel. This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel."
          };
          this.ui = new CanvasUI(content, config, this.object);
          this.ui.update();
          let ui = this.ui;
        },
        imagePanel: function() {
          const config = {
            image: {
              type: "img",
              position: { left: 20, top: 20 },
              width: 472
            },
            info: {
              type: "text",
              position: { top: 300 }
            }
          };
          const content = {
            image: "images/promo.png",
            info: "The promo image from the course: Learn to create WebXR, VR and AR, experiences using Wonderland Engine"
          };
          this.ui = new CanvasUI(content, config, this.object);
          this.ui.update();
          let ui = this.ui;
        },
        inputTextPanel: function() {
          function onChanged(txt) {
            console.log(`message changed: ${txt}`);
          }
          function onEnter(txt) {
            console.log(`message enter: ${txt}`);
          }
          const config = {
            panelSize: { width: 1, height: 0.25 },
            height: 128,
            message: {
              type: "input-text",
              position: { left: 10, top: 8 },
              height: 56,
              width: 492,
              backgroundColor: "#ccc",
              fontColor: "#000",
              onChanged,
              onEnter
            },
            label: {
              type: "text",
              position: { top: 64 }
            }
          };
          const content = {
            message: "",
            label: "Select the panel above."
          };
          this.ui = new CanvasUI(content, config, this.object);
          const target = this.ui.keyboard.object.getComponent("cursor-target");
          target.addHoverFunction(this.onHoverKeyboard.bind(this));
          target.addUnHoverFunction(this.onUnHoverKeyboard.bind(this));
          target.addMoveFunction(this.onMoveKeyboard.bind(this));
          target.addDownFunction(this.onDown.bind(this));
          target.addUpFunction(this.onUpKeyboard.bind(this));
          this.ui.update();
          let ui = this.ui;
        },
        onHover: function(_2, cursor) {
          const xy = this.ui.worldToCanvas(cursor.cursorPos);
          if (this.ui)
            this.ui.hover(0, xy);
          if (cursor.type == "finger-cursor") {
            this.onDown(_2, cursor);
          }
          this.hapticFeedback(cursor.object, 0.5, 50);
        },
        onMove: function(_2, cursor) {
          this.ui.worldToCanvas(cursor.cursorPos);
          const xy = this.ui.worldToCanvas(cursor.cursorPos);
          if (this.ui)
            this.ui.hover(0, xy);
          this.hapticFeedback(cursor.object, 0.5, 50);
        },
        onDown: function(_2, cursor) {
          console.log("onDown");
          this.soundClick.play();
          this.hapticFeedback(cursor.object, 1, 20);
        },
        onUp: function(_2, cursor) {
          console.log("onUp");
          this.soundUnClick.play();
          if (this.ui)
            this.ui.select(0, true);
          this.hapticFeedback(cursor.object, 0.7, 20);
        },
        onUnHover: function(_2, cursor) {
          console.log("onUnHover");
          if (this.ui)
            this.ui.hover(0);
          this.hapticFeedback(cursor.object, 0.3, 50);
        },
        onHoverKeyboard: function(_2, cursor) {
          if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard)
            return;
          const ui = this.ui.keyboard.keyboard;
          const xy = ui.worldToCanvas(cursor.cursorPos);
          ui.hover(0, xy);
          if (cursor.type == "finger-cursor") {
            this.onDown(_2, cursor);
          }
          this.hapticFeedback(cursor.object, 0.5, 50);
        },
        onMoveKeyboard: function(_2, cursor) {
          if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard)
            return;
          const ui = this.ui.keyboard.keyboard;
          const xy = ui.worldToCanvas(cursor.cursorPos);
          ui.hover(0, xy);
          this.hapticFeedback(cursor.object, 0.5, 50);
        },
        onUpKeyboard: function(_2, cursor) {
          console.log("onUpKeyboard");
          this.soundUnClick.play();
          if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard)
            this.ui.keyboard.keyboard.select(0);
          this.hapticFeedback(cursor.object, 0.7, 20);
        },
        onUnHoverKeyboard: function(_2, cursor) {
          console.log("onUnHoverKeyboard");
          if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard)
            this.ui.keyboard.keyboard.hover(0);
          this.hapticFeedback(cursor.object, 0.3, 50);
        },
        hapticFeedback: function(object, strength, duration) {
          const input = object.getComponent("input");
          if (input && input.xrInputSource) {
            const gamepad = input.xrInputSource.gamepad;
            if (gamepad && gamepad.hapticActuators)
              gamepad.hapticActuators[0].pulse(strength, duration);
          }
        },
        update: function(dt2) {
          this.ui.update();
        }
      });
    }
  });

  // js/CanvasUI.js
  var require_CanvasUI = __commonJS({
    "js/CanvasUI.js"() {
    }
  });

  // js/spawn-mesh-on-select.js
  var require_spawn_mesh_on_select = __commonJS({
    "js/spawn-mesh-on-select.js"() {
      WL.registerComponent("spawn-mesh-on-select", {
        /* The mesh to spawn */
        mesh: { type: WL.Type.Mesh },
        /* The material to spawn the mesh with */
        material: { type: WL.Type.Material }
      }, {
        start: function() {
          WL.onXRSessionStart.push(this.onXRSessionStart.bind(this));
        },
        onXRSessionStart: function(s) {
          s.addEventListener("select", this.spawnMesh.bind(this));
        },
        spawnMesh: function() {
          const o = WL.scene.addObject();
          o.transformLocal = this.object.transformWorld;
          o.scale([0.25, 0.25, 0.25]);
          o.translate([0, 0.25, 0]);
          const mesh = o.addComponent("mesh");
          mesh.material = this.material;
          mesh.mesh = this.mesh;
          mesh.active = true;
        }
      });
    }
  });

  // js/bundle.js
  require_thwall_camera();
  require_components();
  init_firestore_api();
  init_html_ui();
  init_PostSpawner();
  require_planetPostInfo();
  require_planetRotation();
  init_planetOnCollision();
  init_moonRotation();
  require_uiHandler();
  require_CanvasUI();
  require_spawn_mesh_on_select();
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.3
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.3
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)

@firebase/util/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/logger/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/lite/index.browser.esm2017.js:
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
  * @license
  * Copyright 2018 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
