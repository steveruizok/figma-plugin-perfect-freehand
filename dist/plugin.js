/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/lz-string/libs/lz-string.js":
/*!**************************************************!*\
  !*** ./node_modules/lz-string/libs/lz-string.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function() {

// private property
var f = String.fromCharCode;
var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
var baseReverseDic = {};

function getBaseValue(alphabet, character) {
  if (!baseReverseDic[alphabet]) {
    baseReverseDic[alphabet] = {};
    for (var i=0 ; i<alphabet.length ; i++) {
      baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
  }
  return baseReverseDic[alphabet][character];
}

var LZString = {
  compressToBase64 : function (input) {
    if (input == null) return "";
    var res = LZString._compress(input, 6, function(a){return keyStrBase64.charAt(a);});
    switch (res.length % 4) { // To produce valid Base64
    default: // When could this happen ?
    case 0 : return res;
    case 1 : return res+"===";
    case 2 : return res+"==";
    case 3 : return res+"=";
    }
  },

  decompressFromBase64 : function (input) {
    if (input == null) return "";
    if (input == "") return null;
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
  },

  compressToUTF16 : function (input) {
    if (input == null) return "";
    return LZString._compress(input, 15, function(a){return f(a+32);}) + " ";
  },

  decompressFromUTF16: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 16384, function(index) { return compressed.charCodeAt(index) - 32; });
  },

  //compress into uint8array (UCS-2 big endian format)
  compressToUint8Array: function (uncompressed) {
    var compressed = LZString.compress(uncompressed);
    var buf=new Uint8Array(compressed.length*2); // 2 bytes per character

    for (var i=0, TotalLen=compressed.length; i<TotalLen; i++) {
      var current_value = compressed.charCodeAt(i);
      buf[i*2] = current_value >>> 8;
      buf[i*2+1] = current_value % 256;
    }
    return buf;
  },

  //decompress from uint8array (UCS-2 big endian format)
  decompressFromUint8Array:function (compressed) {
    if (compressed===null || compressed===undefined){
        return LZString.decompress(compressed);
    } else {
        var buf=new Array(compressed.length/2); // 2 bytes per character
        for (var i=0, TotalLen=buf.length; i<TotalLen; i++) {
          buf[i]=compressed[i*2]*256+compressed[i*2+1];
        }

        var result = [];
        buf.forEach(function (c) {
          result.push(f(c));
        });
        return LZString.decompress(result.join(''));

    }

  },


  //compress into a string that is already URI encoded
  compressToEncodedURIComponent: function (input) {
    if (input == null) return "";
    return LZString._compress(input, 6, function(a){return keyStrUriSafe.charAt(a);});
  },

  //decompress from an output of compressToEncodedURIComponent
  decompressFromEncodedURIComponent:function (input) {
    if (input == null) return "";
    if (input == "") return null;
    input = input.replace(/ /g, "+");
    return LZString._decompress(input.length, 32, function(index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
  },

  compress: function (uncompressed) {
    return LZString._compress(uncompressed, 16, function(a){return f(a);});
  },
  _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    var i, value,
        context_dictionary= {},
        context_dictionaryToCreate= {},
        context_c="",
        context_wc="",
        context_w="",
        context_enlargeIn= 2, // Compensate for the first entry which should not count
        context_dictSize= 3,
        context_numBits= 2,
        context_data=[],
        context_data_val=0,
        context_data_position=0,
        ii;

    for (ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
          if (context_w.charCodeAt(0)<256) {
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<8 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i=0 ; i<context_numBits ; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position ==bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i=0 ; i<16 ; i++) {
              context_data_val = (context_data_val << 1) | (value&1);
              if (context_data_position == bitsPerChar-1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }


        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        // Add wc to the dictionary.
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }

    // Output the code for w.
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
        if (context_w.charCodeAt(0)<256) {
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<8 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i=0 ; i<context_numBits ; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i=0 ; i<16 ; i++) {
            context_data_val = (context_data_val << 1) | (value&1);
            if (context_data_position == bitsPerChar-1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn == 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i=0 ; i<context_numBits ; i++) {
          context_data_val = (context_data_val << 1) | (value&1);
          if (context_data_position == bitsPerChar-1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }

    // Mark the end of the stream
    value = 2;
    for (i=0 ; i<context_numBits ; i++) {
      context_data_val = (context_data_val << 1) | (value&1);
      if (context_data_position == bitsPerChar-1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }

    // Flush the last char
    while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar-1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      }
      else context_data_position++;
    }
    return context_data.join('');
  },

  decompress: function (compressed) {
    if (compressed == null) return "";
    if (compressed == "") return null;
    return LZString._decompress(compressed.length, 32768, function(index) { return compressed.charCodeAt(index); });
  },

  _decompress: function (length, resetValue, getNextValue) {
    var dictionary = [],
        next,
        enlargeIn = 4,
        dictSize = 4,
        numBits = 3,
        entry = "",
        result = [],
        i,
        w,
        bits, resb, maxpower, power,
        c,
        data = {val:getNextValue(0), position:resetValue, index:1};

    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    bits = 0;
    maxpower = Math.pow(2,2);
    power=1;
    while (power!=maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb>0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (next = bits) {
      case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
        c = f(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = c;
    w = c;
    result.push(c);
    while (true) {
      if (data.index > length) {
        return "";
      }

      bits = 0;
      maxpower = Math.pow(2,numBits);
      power=1;
      while (power!=maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position == 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb>0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2,8);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2,16);
          power=1;
          while (power!=maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb>0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = f(bits);
          c = dictSize-1;
          enlargeIn--;
          break;
        case 2:
          return result.join('');
      }

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else {
        if (c === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }

    }
  }
};
  return LZString;
})();

if (true) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () { return LZString; }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}


/***/ }),

/***/ "./node_modules/perfect-freehand/dist/perfect-freehand.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/perfect-freehand/dist/perfect-freehand.esm.js ***!
  \********************************************************************/
/*! exports provided: default, getStrokeOutlinePoints, getStrokePoints */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStrokeOutlinePoints", function() { return getStrokeOutlinePoints; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getStrokePoints", function() { return getStrokePoints; });
function lerp(y1, y2, mu) {
  return y1 * (1 - mu) + y2 * mu;
}
function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}
/**
 * Convert an array of points to the correct format ([x, y, radius])
 * @param points
 * @returns
 */

function toPointsArray(points) {
  if (Array.isArray(points[0])) {
    return points.map(function (_ref) {
      var x = _ref[0],
          y = _ref[1],
          _ref$ = _ref[2],
          pressure = _ref$ === void 0 ? 0.5 : _ref$;
      return [x, y, pressure];
    });
  } else {
    return points.map(function (_ref2) {
      var x = _ref2.x,
          y = _ref2.y,
          _ref2$pressure = _ref2.pressure,
          pressure = _ref2$pressure === void 0 ? 0.5 : _ref2$pressure;
      return [x, y, pressure];
    });
  }
}
/**
 * Compute a radius based on the pressure.
 * @param size
 * @param thinning
 * @param easing
 * @param pressure
 * @returns
 */

function getStrokeRadius(size, thinning, easing, pressure) {
  if (pressure === void 0) {
    pressure = 0.5;
  }

  if (!thinning) return size / 2;
  pressure = clamp(easing(pressure), 0, 1);
  return (thinning < 0 ? lerp(size, size + size * clamp(thinning, -0.95, -0.05), pressure) : lerp(size - size * clamp(thinning, 0.05, 0.95), size, pressure)) / 2;
}

/**
 * Negate a vector.
 * @param A
 */
/**
 * Add vectors.
 * @param A
 * @param B
 */

function add(A, B) {
  return [A[0] + B[0], A[1] + B[1]];
}
/**
 * Subtract vectors.
 * @param A
 * @param B
 */

function sub(A, B) {
  return [A[0] - B[0], A[1] - B[1]];
}
/**
 * Get the vector from vectors A to B.
 * @param A
 * @param B
 */

function vec(A, B) {
  // A, B as vectors get the vector from A to B
  return [B[0] - A[0], B[1] - A[1]];
}
/**
 * Vector multiplication by scalar
 * @param A
 * @param n
 */

function mul(A, n) {
  return [A[0] * n, A[1] * n];
}
/**
 * Vector division by scalar.
 * @param A
 * @param n
 */

function div(A, n) {
  return [A[0] / n, A[1] / n];
}
/**
 * Perpendicular rotation of a vector A
 * @param A
 */

function per(A) {
  return [A[1], -A[0]];
}
/**
 * Dot product
 * @param A
 * @param B
 */

function dpr(A, B) {
  return A[0] * B[0] + A[1] * B[1];
}
/**
 * Length of the vector
 * @param A
 */

function len(A) {
  return Math.hypot(A[0], A[1]);
}
/**
 * Get normalized / unit vector.
 * @param A
 */

function uni(A) {
  return div(A, len(A));
}
/**
 * Dist length from A to B
 * @param A
 * @param B
 */

function dist(A, B) {
  return Math.hypot(A[1] - B[1], A[0] - B[0]);
}
/**
 * Rotate a vector around another vector by r (radians)
 * @param A vector
 * @param C center
 * @param r rotation in radians
 */

function rotAround(A, C, r) {
  var s = Math.sin(r);
  var c = Math.cos(r);
  var px = A[0] - C[0];
  var py = A[1] - C[1];
  var nx = px * c - py * s;
  var ny = px * s + py * c;
  return [nx + C[0], ny + C[1]];
}
/**
 * Interpolate vector A to B with a scalar t
 * @param A
 * @param B
 * @param t scalar
 */

function lrp(A, B, t) {
  return add(A, mul(vec(A, B), t));
}

var min = Math.min,
    PI = Math.PI;
/**
 * ## getStrokePoints
 * @description Get points for a stroke.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param streamline How much to streamline the stroke.
 * @param size The stroke's size.
 */

function getStrokePoints(points, options) {
  var _options$simulatePres = options.simulatePressure,
      simulatePressure = _options$simulatePres === void 0 ? true : _options$simulatePres,
      _options$streamline = options.streamline,
      streamline = _options$streamline === void 0 ? 0.5 : _options$streamline,
      _options$size = options.size,
      size = _options$size === void 0 ? 8 : _options$size;
  streamline /= 2;

  if (!simulatePressure) {
    streamline /= 2;
  }

  var pts = toPointsArray(points);
  var len = pts.length;
  if (len === 0) return [];
  if (len === 1) pts.push(add(pts[0], [1, 0]));
  var strokePoints = [{
    point: [pts[0][0], pts[0][1]],
    pressure: pts[0][2],
    vector: [0, 0],
    distance: 0,
    runningLength: 0
  }];

  for (var i = 1, curr = pts[i], prev = strokePoints[0]; i < pts.length; i++, curr = pts[i], prev = strokePoints[i - 1]) {
    var point = lrp(prev.point, curr, 1 - streamline),
        pressure = curr[2],
        vector = uni(vec(point, prev.point)),
        distance = dist(point, prev.point),
        runningLength = prev.runningLength + distance;
    strokePoints.push({
      point: point,
      pressure: pressure,
      vector: vector,
      distance: distance,
      runningLength: runningLength
    });
  }
  /*
    Align vectors at the end of the line
       Starting from the last point, work back until we've traveled more than
    half of the line's size (width). Take the current point's vector and then
    work forward, setting all remaining points' vectors to this vector. This
    removes the "noise" at the end of the line and allows for a better-facing
    end cap.
  */


  var totalLength = strokePoints[len - 1].runningLength;

  for (var _i = len - 2; _i > 1; _i--) {
    var _strokePoints$_i = strokePoints[_i],
        _runningLength = _strokePoints$_i.runningLength,
        _vector = _strokePoints$_i.vector;

    if (totalLength - _runningLength > size / 2 || dpr(strokePoints[_i - 1].vector, strokePoints[_i].vector) < 0.8) {
      for (var j = _i; j < len; j++) {
        strokePoints[j].vector = _vector;
      }

      break;
    }
  }

  return strokePoints;
}
/**
 * ## getStrokeOutlinePoints
 * @description Get an array of points (as `[x, y]`) representing the outline of a stroke.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param options An (optional) object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Tapering and easing function for the start of the line.
 * @param options.end Tapering and easing function for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */

function getStrokeOutlinePoints(points, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$size2 = _options.size,
      size = _options$size2 === void 0 ? 8 : _options$size2,
      _options$thinning = _options.thinning,
      thinning = _options$thinning === void 0 ? 0.5 : _options$thinning,
      _options$smoothing = _options.smoothing,
      smoothing = _options$smoothing === void 0 ? 0.5 : _options$smoothing,
      _options$simulatePres2 = _options.simulatePressure,
      simulatePressure = _options$simulatePres2 === void 0 ? true : _options$simulatePres2,
      _options$easing = _options.easing,
      easing = _options$easing === void 0 ? function (t) {
    return t;
  } : _options$easing,
      _options$start = _options.start,
      start = _options$start === void 0 ? {} : _options$start,
      _options$end = _options.end,
      end = _options$end === void 0 ? {} : _options$end,
      _options$last = _options.last,
      isComplete = _options$last === void 0 ? false : _options$last;
  var _options2 = options,
      _options2$streamline = _options2.streamline,
      streamline = _options2$streamline === void 0 ? 0.5 : _options2$streamline;
  streamline /= 2;
  var _start$taper = start.taper,
      taperStart = _start$taper === void 0 ? 0 : _start$taper,
      _start$easing = start.easing,
      taperStartEase = _start$easing === void 0 ? function (t) {
    return t * (2 - t);
  } : _start$easing;
  var _end$taper = end.taper,
      taperEnd = _end$taper === void 0 ? 0 : _end$taper,
      _end$easing = end.easing,
      taperEndEase = _end$easing === void 0 ? function (t) {
    return --t * t * t + 1;
  } : _end$easing; // The number of points in the array

  var len = points.length; // We can't do anything with an empty array.

  if (len === 0) return []; // The total length of the line

  var totalLength = points[len - 1].runningLength; // Our collected left and right points

  var leftPts = [];
  var rightPts = []; // Previous pressure (start with average of first five pressures)

  var prevPressure = points.slice(0, 5).reduce(function (acc, cur) {
    return (acc + cur.pressure) / 2;
  }, points[0].pressure); // The current radius

  var radius = getStrokeRadius(size, thinning, easing, points[len - 1].pressure); // Previous vector

  var prevVector = points[0].vector; // Previous left and right points

  var pl = points[0].point;
  var pr = pl; // Temporary left and right points

  var tl = pl;
  var tr = pr;
  /*
    Find the outline's left and right points
      Iterating through the points and populate the rightPts and leftPts arrays,
   skipping the first and last pointsm, which will get caps later on.
  */

  for (var i = 1; i < len - 1; i++) {
    var _points$i = points[i],
        point = _points$i.point,
        pressure = _points$i.pressure,
        vector = _points$i.vector,
        distance = _points$i.distance,
        runningLength = _points$i.runningLength;
    /*
      Calculate the radius
           If not thinning, the current point's radius will be half the size; or
      otherwise, the size will be based on the current (real or simulated)
      pressure.
    */

    if (thinning) {
      if (simulatePressure) {
        var rp = min(1, 1 - distance / size);
        var sp = min(1, distance / size);
        pressure = min(1, prevPressure + (rp - prevPressure) * (sp / 2));
      }

      radius = getStrokeRadius(size, thinning, easing, pressure);
    } else {
      radius = size / 2;
    }
    /*
      Apply tapering
           If the current length is within the taper distance at either the
      start or the end, calculate the taper strengths. Apply the smaller
      of the two taper strengths to the radius.
    */


    var ts = runningLength < taperStart ? taperStartEase(runningLength / taperStart) : 1;
    var te = totalLength - runningLength < taperEnd ? taperEndEase((totalLength - runningLength) / taperEnd) : 1;
    radius *= Math.min(ts, te);
    /*
      Handle sharp corners
           Find the difference (dot product) between the current and next vector.
      If the next vector is at more than a right angle to the current vector,
      draw a cap at the current point.
    */

    var nextVector = points[i + 1].vector;
    var dpr$1 = dpr(vector, nextVector);

    if (dpr$1 < 0) {
      var _offset = mul(per(prevVector), radius);

      var la = add(point, _offset);
      var ra = sub(point, _offset);

      for (var t = 0.2; t < 1; t += 0.2) {
        tr = rotAround(la, point, PI * -t);
        tl = rotAround(ra, point, PI * t);
        rightPts.push(tr);
        leftPts.push(tl);
      }

      pl = tl;
      pr = tr;
      continue;
    }
    /*
      Add regular points
           Project points to either side of the current point, using the
      calculated size as a distance. If a point's distance to the
      previous point on that side greater than the minimum distance
      (or if the corner is kinda sharp), add the points to the side's
      points array.
    */


    var offset = mul(per(lrp(nextVector, vector, dpr$1)), radius);
    tl = sub(point, offset);
    tr = add(point, offset);
    var alwaysAdd = i === 1 || dpr$1 < 0.25;
    var minDistance = (runningLength > size ? size : size / 2) * smoothing;

    if (alwaysAdd || dist(pl, tl) > minDistance) {
      leftPts.push(lrp(pl, tl, streamline));
      pl = tl;
    }

    if (alwaysAdd || dist(pr, tr) > minDistance) {
      rightPts.push(lrp(pr, tr, streamline));
      pr = tr;
    } // Set variables for next iteration


    prevPressure = pressure;
    prevVector = vector;
  }
  /*
    Drawing caps
    
    Now that we have our points on either side of the line, we need to
    draw caps at the start and end. Tapered lines don't have caps, but
    may have dots for very short lines.
  */


  var firstPoint = points[0];
  var lastPoint = points[len - 1];
  var isVeryShort = rightPts.length < 2 || leftPts.length < 2;
  /*
    Draw a dot for very short or completed strokes
    
    If the line is too short to gather left or right points and if the line is
    not tapered on either side, draw a dot. If the line is tapered, then only
    draw a dot if the line is both very short and complete. If we draw a dot,
    we can just return those points.
  */

  if (isVeryShort && (!(taperStart || taperEnd) || isComplete)) {
    var ir = 0;

    for (var _i2 = 0; _i2 < len; _i2++) {
      var _points$_i = points[_i2],
          _pressure = _points$_i.pressure,
          _runningLength2 = _points$_i.runningLength;

      if (_runningLength2 > size) {
        ir = getStrokeRadius(size, thinning, easing, _pressure);
        break;
      }
    }

    var _start = sub(firstPoint.point, mul(per(uni(vec(lastPoint.point, firstPoint.point))), ir || radius));

    var dotPts = [];

    for (var _t = 0, step = 0.1; _t <= 1; _t += step) {
      dotPts.push(rotAround(_start, firstPoint.point, PI * 2 * _t));
    }

    return dotPts;
  }
  /*
    Draw a start cap
       Unless the line has a tapered start, or unless the line has a tapered end
    and the line is very short, draw a start cap around the first point. Use
    the distance between the second left and right point for the cap's radius.
    Finally remove the first left and right points. :psyduck:
  */


  var startCap = [];

  if (!taperStart && !(taperEnd && isVeryShort)) {
    tr = rightPts[1];
    tl = leftPts[1];

    var _start2 = sub(firstPoint.point, mul(uni(vec(tr, tl)), dist(tr, tl) / 2));

    for (var _t2 = 0, _step = 0.2; _t2 <= 1; _t2 += _step) {
      startCap.push(rotAround(_start2, firstPoint.point, PI * _t2));
    }

    leftPts.shift();
    rightPts.shift();
  }
  /*
    Draw an end cap
       If the line does not have a tapered end, and unless the line has a tapered
    start and the line is very short, draw a cap around the last point. Finally,
    remove the last left and right points. Otherwise, add the last point. Note
    that This cap is a full-turn-and-a-half: this prevents incorrect caps on
    sharp end turns.
  */


  var endCap = [];

  if (!taperEnd && !(taperStart && isVeryShort)) {
    var _start3 = sub(lastPoint.point, mul(per(lastPoint.vector), radius));

    for (var _t3 = 0, _step2 = 0.1; _t3 <= 1; _t3 += _step2) {
      endCap.push(rotAround(_start3, lastPoint.point, PI * 3 * _t3));
    }
  } else {
    endCap.push(lastPoint.point);
  }
  /*
    Return the points in the correct windind order: begin on the left side, then
    continue around the end cap, then come back along the right side, and finally
    complete the start cap.
  */


  return leftPts.concat(endCap, rightPts.reverse(), startCap);
}
/**
 * ## getStroke
 * @description Returns a stroke as an array of outline points.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param options An (optional) object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.easing	An easing function to apply to each point's pressure.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 * @param options.start Tapering and easing function for the start of the line.
 * @param options.end Tapering and easing function for the end of the line.
 * @param options.last Whether to handle the points as a completed stroke.
 */

function getStroke(points, options) {
  if (options === void 0) {
    options = {};
  }

  return getStrokeOutlinePoints(getStrokePoints(points, options), options);
}

/* harmony default export */ __webpack_exports__["default"] = (getStroke);

//# sourceMappingURL=perfect-freehand.esm.js.map


/***/ }),

/***/ "./src/main/index.ts":
/*!***************************!*\
  !*** ./src/main/index.ts ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var perfect_freehand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! perfect-freehand */ "./node_modules/perfect-freehand/dist/perfect-freehand.esm.js");
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lz-string */ "./node_modules/lz-string/libs/lz-string.js");
/* harmony import */ var lz_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lz_string__WEBPACK_IMPORTED_MODULE_3__);




/* ----------------------- Comms ----------------------- */
// Sends a message to the plugin UI
function postMessage({ type, payload }) {
    figma.ui.postMessage({ type, payload });
}
// Save some information about the node to its plugin data.
function setOriginalNode(node) {
    const originalNode = {
        center: getCenter(node),
        vectorNetwork: Object.assign({}, node.vectorNetwork),
        vectorPaths: node.vectorPaths,
    };
    node.setPluginData("perfect_freehand", Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["compressToUTF16"])(JSON.stringify(originalNode)));
    return originalNode;
}
function decompressPluginData(pluginData) {
    // Decompress the saved data and parse out the original node.
    const decompressed = Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["decompressFromUTF16"])(pluginData);
    if (!decompressed) {
        throw Error("Found saved data for original node but could not decompress it: " +
            decompressed);
    }
    return JSON.parse(decompressed);
}
// Get an original node from a node's plugin data.
function getOriginalNode(id) {
    let node = figma.getNodeById(id);
    if (!node)
        throw Error("Could not find that node: " + id);
    const pluginData = node.getPluginData("perfect_freehand");
    // Nothing on the node — we haven't modified it.
    if (!pluginData)
        return undefined;
    return decompressPluginData(pluginData);
}
/* ---------------------- Nodes --------------------- */
// Get the currently selected Vector nodes for the UI.
function getSelectedNodes(updateCenter = false) {
    return figma.currentPage.selection.filter(({ type }) => type === "VECTOR").map((node) => {
        const pluginData = node.getPluginData("perfect_freehand");
        if (pluginData && updateCenter) {
            const center = getCenter(node);
            const originalNode = decompressPluginData(pluginData);
            if (!(center.x === originalNode.center.x &&
                center.y === originalNode.center.y)) {
                originalNode.center = center;
                node.setPluginData("perfect_freehand", Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["compressToUTF16"])(JSON.stringify(originalNode)));
            }
        }
        return {
            id: node.id,
            name: node.name,
            type: node.type,
            canReset: !!pluginData,
        };
    });
}
// Getthe currently selected Vector nodes as an array of Ids.
function getSelectedNodeIds() {
    return figma.currentPage.selection.filter(({ type }) => type === "VECTOR").map(({ id }) => id);
}
// Find the center of a node.
function getCenter(node) {
    let { x, y, width, height } = node;
    return { x: x + width / 2, y: y + height / 2 };
}
// Move a node to a center.
function moveNodeToCenter(node, center) {
    const { x: x0, y: y0 } = getCenter(node);
    const { x: x1, y: y1 } = center;
    node.x = node.x + x1 - x0;
    node.y = node.y + y1 - y0;
}
// Zoom the Figma viewport to a node.
function zoomToNode(id) {
    const node = figma.getNodeById(id);
    if (!node) {
        console.error("Could not find that node: " + id);
        return;
    }
    figma.viewport.scrollAndZoomIntoView([node]);
}
/* -------------------- Selection ------------------- */
// Deselect a Figma node.
function deselectNode(id) {
    const selection = figma.currentPage.selection;
    figma.currentPage.selection = selection.filter((node) => node.id !== id);
}
// Send the current selection to the UI state.
function sendSelectedNodes(updateCenter = true) {
    const selectedNodes = getSelectedNodes(updateCenter);
    postMessage({
        type: _types__WEBPACK_IMPORTED_MODULE_0__["WorkerActionTypes"].SELECTED_NODES,
        payload: selectedNodes,
    });
}
/* -------------- Changing VectorNodes -------------- */
// Number of new nodes to insert
const SPLIT = 5;
// Some basic easing functions
const EASINGS = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};
// Compute a stroke based on the vector and apply it to the vector's path data.
function applyPerfectFreehandToVectorNodes(nodeIds, { options, easing = "linear", clip, }, restrictToKnownNodes = false) {
    for (let id of nodeIds) {
        // Get the node that we want to change
        const nodeToChange = figma.getNodeById(id);
        if (!nodeToChange) {
            throw Error("Could not find that node: " + id);
        }
        // Get the original node
        let originalNode = getOriginalNode(nodeToChange.id);
        // If we don't know this node...
        if (!originalNode) {
            // Bail if we're updating nodes
            if (restrictToKnownNodes)
                continue;
            // Create a new original node and continue
            originalNode = setOriginalNode(nodeToChange);
        }
        // Interpolate new points along the vector's curve
        const pts = [];
        for (let segment of originalNode.vectorNetwork.segments) {
            const p0 = originalNode.vectorNetwork.vertices[segment.start];
            const p3 = originalNode.vectorNetwork.vertices[segment.end];
            const p1 = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addVectors"])(p0, segment.tangentStart);
            const p2 = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addVectors"])(p3, segment.tangentEnd);
            const interpolator = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["interpolateCubicBezier"])(p0, p1, p2, p3);
            for (let i = 0; i < SPLIT; i++) {
                pts.push(interpolator(i / SPLIT));
            }
        }
        // Create a new stroke using perfect-freehand
        const stroke = Object(perfect_freehand__WEBPACK_IMPORTED_MODULE_2__["default"])(pts, Object.assign(Object.assign({}, options), { easing: EASINGS[easing] }));
        try {
            // Set stroke to vector paths
            nodeToChange.vectorPaths = [
                {
                    windingRule: "NONZERO",
                    data: Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getSvgPathFromStroke"])(stroke),
                },
            ];
        }
        catch (e) {
            console.error("Could not apply stroke", e.message);
            continue;
        }
        // Adjust the position of the node so that its center does not change
        moveNodeToCenter(nodeToChange, originalNode.center);
    }
    sendSelectedNodes(false);
}
// Reset the node to its original path data, using data from our cache and then delete the node.
function resetVectorNodes() {
    for (let id of getSelectedNodeIds()) {
        const originalNode = getOriginalNode(id);
        // We haven't modified this node.
        if (!originalNode)
            continue;
        const currentNode = figma.getNodeById(id);
        if (!currentNode) {
            console.error("Could not find that node: " + id);
            continue;
        }
        currentNode.vectorPaths = originalNode.vectorPaths;
        currentNode.setPluginData("perfect_freehand", "");
        sendSelectedNodes(false);
    }
}
/* --------------------- Kickoff -------------------- */
// Listen to messages received from the plugin UI
figma.ui.onmessage = function ({ type, payload }) {
    switch (type) {
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].CLOSE:
            figma.closePlugin();
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].ZOOM_TO_NODE:
            zoomToNode(payload);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].DESELECT_NODE:
            deselectNode(payload);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].RESET_NODES:
            resetVectorNodes();
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].TRANSFORM_NODES:
            applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, false);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].UPDATED_OPTIONS:
            applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, true);
            break;
    }
};
// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes);
// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 480 });
// Send the current selection to the UI
sendSelectedNodes();


/***/ }),

/***/ "./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! exports provided: UIActionTypes, WorkerActionTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UIActionTypes", function() { return UIActionTypes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkerActionTypes", function() { return WorkerActionTypes; });
// UI actions
var UIActionTypes;
(function (UIActionTypes) {
    UIActionTypes["CLOSE"] = "CLOSE";
    UIActionTypes["ZOOM_TO_NODE"] = "ZOOM_TO_NODE";
    UIActionTypes["DESELECT_NODE"] = "DESELECT_NODE";
    UIActionTypes["TRANSFORM_NODES"] = "TRANSFORM_NODES";
    UIActionTypes["RESET_NODES"] = "RESET_NODES";
    UIActionTypes["UPDATED_OPTIONS"] = "UPDATED_OPTIONS";
})(UIActionTypes || (UIActionTypes = {}));
// Worker actions
var WorkerActionTypes;
(function (WorkerActionTypes) {
    WorkerActionTypes["SELECTED_NODES"] = "SELECTED_NODES";
    WorkerActionTypes["FOUND_SELECTED_NODES"] = "FOUND_SELECTED_NODES";
})(WorkerActionTypes || (WorkerActionTypes = {}));


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: cubicBezier, getPointsAlongCubicBezier, interpolateCubicBezier, addVectors, getSvgPathFromStroke */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicBezier", function() { return cubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPointsAlongCubicBezier", function() { return getPointsAlongCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateCubicBezier", function() { return interpolateCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addVectors", function() { return addVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSvgPathFromStroke", function() { return getSvgPathFromStroke; });
// import polygonClipping from "polygon-clipping"
const { pow } = Math;
function cubicBezier(tx, x1, y1, x2, y2) {
    // Inspired by Don Lancaster's two articles
    // http://www.tinaja.com/glib/cubemath.pdf
    // http://www.tinaja.com/text/bezmath.html
    // Set p0 and p1 point
    let x0 = 0, y0 = 0, x3 = 1, y3 = 1, 
    // Convert the coordinates to equation space
    A = x3 - 3 * x2 + 3 * x1 - x0, B = 3 * x2 - 6 * x1 + 3 * x0, C = 3 * x1 - 3 * x0, D = x0, E = y3 - 3 * y2 + 3 * y1 - y0, F = 3 * y2 - 6 * y1 + 3 * y0, G = 3 * y1 - 3 * y0, H = y0, 
    // Variables for the loop below
    t = tx, iterations = 5, i, slope, x, y;
    // Loop through a few times to get a more accurate time value, according to the Newton-Raphson method
    // http://en.wikipedia.org/wiki/Newton's_method
    for (i = 0; i < iterations; i++) {
        // The curve's x equation for the current time value
        x = A * t * t * t + B * t * t + C * t + D;
        // The slope we want is the inverse of the derivate of x
        slope = 1 / (3 * A * t * t + 2 * B * t + C);
        // Get the next estimated time value, which will be more accurate than the one before
        t -= (x - tx) * slope;
        t = t > 1 ? 1 : t < 0 ? 0 : t;
    }
    // Find the y value through the curve's y equation, with the now more accurate time value
    y = Math.abs(E * t * t * t + F * t * t + G * t * H);
    return y;
}
function getPointsAlongCubicBezier(ptCount, pxTolerance, Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
    let deltaBAx = Bx - Ax;
    let deltaCBx = Cx - Bx;
    let deltaDCx = Dx - Cx;
    let deltaBAy = By - Ay;
    let deltaCBy = Cy - By;
    let deltaDCy = Dy - Cy;
    let ax, ay, bx, by, cx, cy;
    let lastX = -10000;
    let lastY = -10000;
    let pts = [{ x: Ax, y: Ay }];
    for (let i = 1; i < ptCount; i++) {
        let t = i / ptCount;
        ax = Ax + deltaBAx * t;
        bx = Bx + deltaCBx * t;
        cx = Cx + deltaDCx * t;
        ax += (bx - ax) * t;
        bx += (cx - bx) * t;
        ay = Ay + deltaBAy * t;
        by = By + deltaCBy * t;
        cy = Cy + deltaDCy * t;
        ay += (by - ay) * t;
        by += (cy - by) * t;
        const x = ax + (bx - ax) * t;
        const y = ay + (by - ay) * t;
        const dx = x - lastX;
        const dy = y - lastY;
        if (dx * dx + dy * dy > pxTolerance) {
            pts.push({ x: x, y: y });
            lastX = x;
            lastY = y;
        }
    }
    pts.push({ x: Dx, y: Dy });
    return pts;
}
function interpolateCubicBezier(p0, c0, c1, p1) {
    // 0 <= t <= 1
    return function interpolator(t) {
        return [
            pow(1 - t, 3) * p0.x +
                3 * pow(1 - t, 2) * t * c0.x +
                3 * (1 - t) * pow(t, 2) * c1.x +
                pow(t, 3) * p1.x,
            pow(1 - t, 3) * p0.y +
                3 * pow(1 - t, 2) * t * c0.y +
                3 * (1 - t) * pow(t, 2) * c1.y +
                pow(t, 3) * p1.y,
        ];
    };
}
function addVectors(a, b) {
    if (!b)
        return a;
    return { x: a.x + b.x, y: a.y + b.y };
}
function getSvgPathFromStroke(stroke) {
    if (stroke.length === 0)
        return "";
    const d = [];
    if (stroke.length < 3) {
        return "";
    }
    let p0 = stroke[stroke.length - 3];
    let p1 = stroke[stroke.length - 2];
    d.push("M", p0[0], p0[1], "Q");
    for (let i = 0; i < stroke.length; i++) {
        d.push(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
        p0 = p1;
        p1 = stroke[i];
    }
    d.push("Z");
    return d.join(" ");
}
// export function getFlatSvgPathFromStroke(stroke: number[][]) {
//   try {
//     const poly = polygonClipping.union([stroke] as any)
//     const d = []
//     for (let face of poly) {
//       for (let points of face) {
//         points.push(points[0])
//         d.push(getSvgPathFromStroke(points))
//       }
//     }
//     d.push("Z")
//     return d.join(" ")
//   } catch (e) {
//     console.error("Could not clip path.")
//     return getSvgPathFromStroke(stroke)
//   }
// }


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtB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QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFLHFDQUFxQyxFQUFFO0FBQ2xILEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQixlQUFlLE9BQU87QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsSUFBSSxJQUEwQztBQUM5QyxFQUFFLG1DQUFPLGFBQWEsaUJBQWlCLEVBQUU7QUFBQSxvR0FBQztBQUMxQyxDQUFDLE1BQU0sRUFFTjs7Ozs7Ozs7Ozs7OztBQ3BmRDtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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LENBQUMsc0NBQXNDO0FBQ3ZDO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhDQUE4Qzs7Ozs7Ozs7Ozs7OztBQ2YvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLE9BQU8sTUFBTTtBQUNOO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGVBQWU7QUFDL0IsbUJBQW1CLGFBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsYUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsZUFBZTtBQUM3QjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4vaW5kZXgudHNcIik7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMgUGllcm94eSA8cGllcm94eUBwaWVyb3h5Lm5ldD5cbi8vIFRoaXMgd29yayBpcyBmcmVlLiBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4vLyB1bmRlciB0aGUgdGVybXMgb2YgdGhlIFdURlBMLCBWZXJzaW9uIDJcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBMSUNFTlNFLnR4dCBvciBodHRwOi8vd3d3Lnd0ZnBsLm5ldC9cbi8vXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgdGhlIGhvbWUgcGFnZTpcbi8vIGh0dHA6Ly9waWVyb3h5Lm5ldC9ibG9nL3BhZ2VzL2x6LXN0cmluZy90ZXN0aW5nLmh0bWxcbi8vXG4vLyBMWi1iYXNlZCBjb21wcmVzc2lvbiBhbGdvcml0aG0sIHZlcnNpb24gMS40LjRcbnZhciBMWlN0cmluZyA9IChmdW5jdGlvbigpIHtcblxuLy8gcHJpdmF0ZSBwcm9wZXJ0eVxudmFyIGYgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xudmFyIGtleVN0ckJhc2U2NCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtcbnZhciBrZXlTdHJVcmlTYWZlID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSstJFwiO1xudmFyIGJhc2VSZXZlcnNlRGljID0ge307XG5cbmZ1bmN0aW9uIGdldEJhc2VWYWx1ZShhbHBoYWJldCwgY2hhcmFjdGVyKSB7XG4gIGlmICghYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdKSB7XG4gICAgYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdID0ge307XG4gICAgZm9yICh2YXIgaT0wIDsgaTxhbHBoYWJldC5sZW5ndGggOyBpKyspIHtcbiAgICAgIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XVthbHBoYWJldC5jaGFyQXQoaSldID0gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XVtjaGFyYWN0ZXJdO1xufVxuXG52YXIgTFpTdHJpbmcgPSB7XG4gIGNvbXByZXNzVG9CYXNlNjQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIHJlcyA9IExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGtleVN0ckJhc2U2NC5jaGFyQXQoYSk7fSk7XG4gICAgc3dpdGNoIChyZXMubGVuZ3RoICUgNCkgeyAvLyBUbyBwcm9kdWNlIHZhbGlkIEJhc2U2NFxuICAgIGRlZmF1bHQ6IC8vIFdoZW4gY291bGQgdGhpcyBoYXBwZW4gP1xuICAgIGNhc2UgMCA6IHJldHVybiByZXM7XG4gICAgY2FzZSAxIDogcmV0dXJuIHJlcytcIj09PVwiO1xuICAgIGNhc2UgMiA6IHJldHVybiByZXMrXCI9PVwiO1xuICAgIGNhc2UgMyA6IHJldHVybiByZXMrXCI9XCI7XG4gICAgfVxuICB9LFxuXG4gIGRlY29tcHJlc3NGcm9tQmFzZTY0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChpbnB1dCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoaW5wdXQubGVuZ3RoLCAzMiwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGdldEJhc2VWYWx1ZShrZXlTdHJCYXNlNjQsIGlucHV0LmNoYXJBdChpbmRleCkpOyB9KTtcbiAgfSxcblxuICBjb21wcmVzc1RvVVRGMTYgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgMTUsIGZ1bmN0aW9uKGEpe3JldHVybiBmKGErMzIpO30pICsgXCIgXCI7XG4gIH0sXG5cbiAgZGVjb21wcmVzc0Zyb21VVEYxNjogZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoY29tcHJlc3NlZC5sZW5ndGgsIDE2Mzg0LCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGluZGV4KSAtIDMyOyB9KTtcbiAgfSxcblxuICAvL2NvbXByZXNzIGludG8gdWludDhhcnJheSAoVUNTLTIgYmlnIGVuZGlhbiBmb3JtYXQpXG4gIGNvbXByZXNzVG9VaW50OEFycmF5OiBmdW5jdGlvbiAodW5jb21wcmVzc2VkKSB7XG4gICAgdmFyIGNvbXByZXNzZWQgPSBMWlN0cmluZy5jb21wcmVzcyh1bmNvbXByZXNzZWQpO1xuICAgIHZhciBidWY9bmV3IFVpbnQ4QXJyYXkoY29tcHJlc3NlZC5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgcGVyIGNoYXJhY3RlclxuXG4gICAgZm9yICh2YXIgaT0wLCBUb3RhbExlbj1jb21wcmVzc2VkLmxlbmd0aDsgaTxUb3RhbExlbjsgaSsrKSB7XG4gICAgICB2YXIgY3VycmVudF92YWx1ZSA9IGNvbXByZXNzZWQuY2hhckNvZGVBdChpKTtcbiAgICAgIGJ1ZltpKjJdID0gY3VycmVudF92YWx1ZSA+Pj4gODtcbiAgICAgIGJ1ZltpKjIrMV0gPSBjdXJyZW50X3ZhbHVlICUgMjU2O1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xuICB9LFxuXG4gIC8vZGVjb21wcmVzcyBmcm9tIHVpbnQ4YXJyYXkgKFVDUy0yIGJpZyBlbmRpYW4gZm9ybWF0KVxuICBkZWNvbXByZXNzRnJvbVVpbnQ4QXJyYXk6ZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZD09PW51bGwgfHwgY29tcHJlc3NlZD09PXVuZGVmaW5lZCl7XG4gICAgICAgIHJldHVybiBMWlN0cmluZy5kZWNvbXByZXNzKGNvbXByZXNzZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBidWY9bmV3IEFycmF5KGNvbXByZXNzZWQubGVuZ3RoLzIpOyAvLyAyIGJ5dGVzIHBlciBjaGFyYWN0ZXJcbiAgICAgICAgZm9yICh2YXIgaT0wLCBUb3RhbExlbj1idWYubGVuZ3RoOyBpPFRvdGFsTGVuOyBpKyspIHtcbiAgICAgICAgICBidWZbaV09Y29tcHJlc3NlZFtpKjJdKjI1Nitjb21wcmVzc2VkW2kqMisxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgYnVmLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChmKGMpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBMWlN0cmluZy5kZWNvbXByZXNzKHJlc3VsdC5qb2luKCcnKSk7XG5cbiAgICB9XG5cbiAgfSxcblxuXG4gIC8vY29tcHJlc3MgaW50byBhIHN0cmluZyB0aGF0IGlzIGFscmVhZHkgVVJJIGVuY29kZWRcbiAgY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQ6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCA2LCBmdW5jdGlvbihhKXtyZXR1cm4ga2V5U3RyVXJpU2FmZS5jaGFyQXQoYSk7fSk7XG4gIH0sXG5cbiAgLy9kZWNvbXByZXNzIGZyb20gYW4gb3V0cHV0IG9mIGNvbXByZXNzVG9FbmNvZGVkVVJJQ29tcG9uZW50XG4gIGRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGlucHV0ID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvIC9nLCBcIitcIik7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGlucHV0Lmxlbmd0aCwgMzIsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBnZXRCYXNlVmFsdWUoa2V5U3RyVXJpU2FmZSwgaW5wdXQuY2hhckF0KGluZGV4KSk7IH0pO1xuICB9LFxuXG4gIGNvbXByZXNzOiBmdW5jdGlvbiAodW5jb21wcmVzc2VkKSB7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyh1bmNvbXByZXNzZWQsIDE2LCBmdW5jdGlvbihhKXtyZXR1cm4gZihhKTt9KTtcbiAgfSxcbiAgX2NvbXByZXNzOiBmdW5jdGlvbiAodW5jb21wcmVzc2VkLCBiaXRzUGVyQ2hhciwgZ2V0Q2hhckZyb21JbnQpIHtcbiAgICBpZiAodW5jb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHZhciBpLCB2YWx1ZSxcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5PSB7fSxcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGU9IHt9LFxuICAgICAgICBjb250ZXh0X2M9XCJcIixcbiAgICAgICAgY29udGV4dF93Yz1cIlwiLFxuICAgICAgICBjb250ZXh0X3c9XCJcIixcbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW49IDIsIC8vIENvbXBlbnNhdGUgZm9yIHRoZSBmaXJzdCBlbnRyeSB3aGljaCBzaG91bGQgbm90IGNvdW50XG4gICAgICAgIGNvbnRleHRfZGljdFNpemU9IDMsXG4gICAgICAgIGNvbnRleHRfbnVtQml0cz0gMixcbiAgICAgICAgY29udGV4dF9kYXRhPVtdLFxuICAgICAgICBjb250ZXh0X2RhdGFfdmFsPTAsXG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbj0wLFxuICAgICAgICBpaTtcblxuICAgIGZvciAoaWkgPSAwOyBpaSA8IHVuY29tcHJlc3NlZC5sZW5ndGg7IGlpICs9IDEpIHtcbiAgICAgIGNvbnRleHRfYyA9IHVuY29tcHJlc3NlZC5jaGFyQXQoaWkpO1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5LGNvbnRleHRfYykpIHtcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfY10gPSBjb250ZXh0X2RpY3RTaXplKys7XG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfY10gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0X3djID0gY29udGV4dF93ICsgY29udGV4dF9jO1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnksY29udGV4dF93YykpIHtcbiAgICAgICAgY29udGV4dF93ID0gY29udGV4dF93YztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGUsY29udGV4dF93KSkge1xuICAgICAgICAgIGlmIChjb250ZXh0X3cuY2hhckNvZGVBdCgwKTwyNTYpIHtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTw4IDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8IHZhbHVlO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09Yml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8MTYgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF93XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3ddO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgd2MgdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3djXSA9IGNvbnRleHRfZGljdFNpemUrKztcbiAgICAgICAgY29udGV4dF93ID0gU3RyaW5nKGNvbnRleHRfYyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT3V0cHV0IHRoZSBjb2RlIGZvciB3LlxuICAgIGlmIChjb250ZXh0X3cgIT09IFwiXCIpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGUsY29udGV4dF93KSkge1xuICAgICAgICBpZiAoY29udGV4dF93LmNoYXJDb2RlQXQoMCk8MjU2KSB7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8OCA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8IHZhbHVlO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8MTYgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X3ddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93XTtcbiAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgfVxuXG5cbiAgICAgIH1cbiAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1hcmsgdGhlIGVuZCBvZiB0aGUgc3RyZWFtXG4gICAgdmFsdWUgPSAyO1xuICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgfVxuXG4gICAgLy8gRmx1c2ggdGhlIGxhc3QgY2hhclxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGVsc2UgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0X2RhdGEuam9pbignJyk7XG4gIH0sXG5cbiAgZGVjb21wcmVzczogZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoY29tcHJlc3NlZC5sZW5ndGgsIDMyNzY4LCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGluZGV4KTsgfSk7XG4gIH0sXG5cbiAgX2RlY29tcHJlc3M6IGZ1bmN0aW9uIChsZW5ndGgsIHJlc2V0VmFsdWUsIGdldE5leHRWYWx1ZSkge1xuICAgIHZhciBkaWN0aW9uYXJ5ID0gW10sXG4gICAgICAgIG5leHQsXG4gICAgICAgIGVubGFyZ2VJbiA9IDQsXG4gICAgICAgIGRpY3RTaXplID0gNCxcbiAgICAgICAgbnVtQml0cyA9IDMsXG4gICAgICAgIGVudHJ5ID0gXCJcIixcbiAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgIGksXG4gICAgICAgIHcsXG4gICAgICAgIGJpdHMsIHJlc2IsIG1heHBvd2VyLCBwb3dlcixcbiAgICAgICAgYyxcbiAgICAgICAgZGF0YSA9IHt2YWw6Z2V0TmV4dFZhbHVlKDApLCBwb3NpdGlvbjpyZXNldFZhbHVlLCBpbmRleDoxfTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpICs9IDEpIHtcbiAgICAgIGRpY3Rpb25hcnlbaV0gPSBpO1xuICAgIH1cblxuICAgIGJpdHMgPSAwO1xuICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwyKTtcbiAgICBwb3dlcj0xO1xuICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgIH1cbiAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgcG93ZXIgPDw9IDE7XG4gICAgfVxuXG4gICAgc3dpdGNoIChuZXh0ID0gYml0cykge1xuICAgICAgY2FzZSAwOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiw4KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICBjID0gZihiaXRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDE2KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICBjID0gZihiaXRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBkaWN0aW9uYXJ5WzNdID0gYztcbiAgICB3ID0gYztcbiAgICByZXN1bHQucHVzaChjKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGRhdGEuaW5kZXggPiBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG5cbiAgICAgIGJpdHMgPSAwO1xuICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLG51bUJpdHMpO1xuICAgICAgcG93ZXI9MTtcbiAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgIH1cbiAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGMgPSBiaXRzKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsOCk7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSBmKGJpdHMpO1xuICAgICAgICAgIGMgPSBkaWN0U2l6ZS0xO1xuICAgICAgICAgIGVubGFyZ2VJbi0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDE2KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSBmKGJpdHMpO1xuICAgICAgICAgIGMgPSBkaWN0U2l6ZS0xO1xuICAgICAgICAgIGVubGFyZ2VJbi0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGVubGFyZ2VJbiA9IE1hdGgucG93KDIsIG51bUJpdHMpO1xuICAgICAgICBudW1CaXRzKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWN0aW9uYXJ5W2NdKSB7XG4gICAgICAgIGVudHJ5ID0gZGljdGlvbmFyeVtjXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjID09PSBkaWN0U2l6ZSkge1xuICAgICAgICAgIGVudHJ5ID0gdyArIHcuY2hhckF0KDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaChlbnRyeSk7XG5cbiAgICAgIC8vIEFkZCB3K2VudHJ5WzBdIHRvIHRoZSBkaWN0aW9uYXJ5LlxuICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IHcgKyBlbnRyeS5jaGFyQXQoMCk7XG4gICAgICBlbmxhcmdlSW4tLTtcblxuICAgICAgdyA9IGVudHJ5O1xuXG4gICAgICBpZiAoZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgZW5sYXJnZUluID0gTWF0aC5wb3coMiwgbnVtQml0cyk7XG4gICAgICAgIG51bUJpdHMrKztcbiAgICAgIH1cblxuICAgIH1cbiAgfVxufTtcbiAgcmV0dXJuIExaU3RyaW5nO1xufSkoKTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gTFpTdHJpbmc7IH0pO1xufSBlbHNlIGlmKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgIT0gbnVsbCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBMWlN0cmluZ1xufVxuIiwiZnVuY3Rpb24gbGVycCh5MSwgeTIsIG11KSB7XG4gIHJldHVybiB5MSAqICgxIC0gbXUpICsgeTIgKiBtdTtcbn1cbmZ1bmN0aW9uIGNsYW1wKG4sIGEsIGIpIHtcbiAgcmV0dXJuIE1hdGgubWF4KGEsIE1hdGgubWluKGIsIG4pKTtcbn1cbi8qKlxyXG4gKiBDb252ZXJ0IGFuIGFycmF5IG9mIHBvaW50cyB0byB0aGUgY29ycmVjdCBmb3JtYXQgKFt4LCB5LCByYWRpdXNdKVxyXG4gKiBAcGFyYW0gcG9pbnRzXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xuXG5mdW5jdGlvbiB0b1BvaW50c0FycmF5KHBvaW50cykge1xuICBpZiAoQXJyYXkuaXNBcnJheShwb2ludHNbMF0pKSB7XG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciB4ID0gX3JlZlswXSxcbiAgICAgICAgICB5ID0gX3JlZlsxXSxcbiAgICAgICAgICBfcmVmJCA9IF9yZWZbMl0sXG4gICAgICAgICAgcHJlc3N1cmUgPSBfcmVmJCA9PT0gdm9pZCAwID8gMC41IDogX3JlZiQ7XG4gICAgICByZXR1cm4gW3gsIHksIHByZXNzdXJlXTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciB4ID0gX3JlZjIueCxcbiAgICAgICAgICB5ID0gX3JlZjIueSxcbiAgICAgICAgICBfcmVmMiRwcmVzc3VyZSA9IF9yZWYyLnByZXNzdXJlLFxuICAgICAgICAgIHByZXNzdXJlID0gX3JlZjIkcHJlc3N1cmUgPT09IHZvaWQgMCA/IDAuNSA6IF9yZWYyJHByZXNzdXJlO1xuICAgICAgcmV0dXJuIFt4LCB5LCBwcmVzc3VyZV07XG4gICAgfSk7XG4gIH1cbn1cbi8qKlxyXG4gKiBDb21wdXRlIGEgcmFkaXVzIGJhc2VkIG9uIHRoZSBwcmVzc3VyZS5cclxuICogQHBhcmFtIHNpemVcclxuICogQHBhcmFtIHRoaW5uaW5nXHJcbiAqIEBwYXJhbSBlYXNpbmdcclxuICogQHBhcmFtIHByZXNzdXJlXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcHJlc3N1cmUpIHtcbiAgaWYgKHByZXNzdXJlID09PSB2b2lkIDApIHtcbiAgICBwcmVzc3VyZSA9IDAuNTtcbiAgfVxuXG4gIGlmICghdGhpbm5pbmcpIHJldHVybiBzaXplIC8gMjtcbiAgcHJlc3N1cmUgPSBjbGFtcChlYXNpbmcocHJlc3N1cmUpLCAwLCAxKTtcbiAgcmV0dXJuICh0aGlubmluZyA8IDAgPyBsZXJwKHNpemUsIHNpemUgKyBzaXplICogY2xhbXAodGhpbm5pbmcsIC0wLjk1LCAtMC4wNSksIHByZXNzdXJlKSA6IGxlcnAoc2l6ZSAtIHNpemUgKiBjbGFtcCh0aGlubmluZywgMC4wNSwgMC45NSksIHNpemUsIHByZXNzdXJlKSkgLyAyO1xufVxuXG4vKipcclxuICogTmVnYXRlIGEgdmVjdG9yLlxyXG4gKiBAcGFyYW0gQVxyXG4gKi9cbi8qKlxyXG4gKiBBZGQgdmVjdG9ycy5cclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIEJcclxuICovXG5cbmZ1bmN0aW9uIGFkZChBLCBCKSB7XG4gIHJldHVybiBbQVswXSArIEJbMF0sIEFbMV0gKyBCWzFdXTtcbn1cbi8qKlxyXG4gKiBTdWJ0cmFjdCB2ZWN0b3JzLlxyXG4gKiBAcGFyYW0gQVxyXG4gKiBAcGFyYW0gQlxyXG4gKi9cblxuZnVuY3Rpb24gc3ViKEEsIEIpIHtcbiAgcmV0dXJuIFtBWzBdIC0gQlswXSwgQVsxXSAtIEJbMV1dO1xufVxuLyoqXHJcbiAqIEdldCB0aGUgdmVjdG9yIGZyb20gdmVjdG9ycyBBIHRvIEIuXHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBCXHJcbiAqL1xuXG5mdW5jdGlvbiB2ZWMoQSwgQikge1xuICAvLyBBLCBCIGFzIHZlY3RvcnMgZ2V0IHRoZSB2ZWN0b3IgZnJvbSBBIHRvIEJcbiAgcmV0dXJuIFtCWzBdIC0gQVswXSwgQlsxXSAtIEFbMV1dO1xufVxuLyoqXHJcbiAqIFZlY3RvciBtdWx0aXBsaWNhdGlvbiBieSBzY2FsYXJcclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIG5cclxuICovXG5cbmZ1bmN0aW9uIG11bChBLCBuKSB7XG4gIHJldHVybiBbQVswXSAqIG4sIEFbMV0gKiBuXTtcbn1cbi8qKlxyXG4gKiBWZWN0b3IgZGl2aXNpb24gYnkgc2NhbGFyLlxyXG4gKiBAcGFyYW0gQVxyXG4gKiBAcGFyYW0gblxyXG4gKi9cblxuZnVuY3Rpb24gZGl2KEEsIG4pIHtcbiAgcmV0dXJuIFtBWzBdIC8gbiwgQVsxXSAvIG5dO1xufVxuLyoqXHJcbiAqIFBlcnBlbmRpY3VsYXIgcm90YXRpb24gb2YgYSB2ZWN0b3IgQVxyXG4gKiBAcGFyYW0gQVxyXG4gKi9cblxuZnVuY3Rpb24gcGVyKEEpIHtcbiAgcmV0dXJuIFtBWzFdLCAtQVswXV07XG59XG4vKipcclxuICogRG90IHByb2R1Y3RcclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIEJcclxuICovXG5cbmZ1bmN0aW9uIGRwcihBLCBCKSB7XG4gIHJldHVybiBBWzBdICogQlswXSArIEFbMV0gKiBCWzFdO1xufVxuLyoqXHJcbiAqIExlbmd0aCBvZiB0aGUgdmVjdG9yXHJcbiAqIEBwYXJhbSBBXHJcbiAqL1xuXG5mdW5jdGlvbiBsZW4oQSkge1xuICByZXR1cm4gTWF0aC5oeXBvdChBWzBdLCBBWzFdKTtcbn1cbi8qKlxyXG4gKiBHZXQgbm9ybWFsaXplZCAvIHVuaXQgdmVjdG9yLlxyXG4gKiBAcGFyYW0gQVxyXG4gKi9cblxuZnVuY3Rpb24gdW5pKEEpIHtcbiAgcmV0dXJuIGRpdihBLCBsZW4oQSkpO1xufVxuLyoqXHJcbiAqIERpc3QgbGVuZ3RoIGZyb20gQSB0byBCXHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBCXHJcbiAqL1xuXG5mdW5jdGlvbiBkaXN0KEEsIEIpIHtcbiAgcmV0dXJuIE1hdGguaHlwb3QoQVsxXSAtIEJbMV0sIEFbMF0gLSBCWzBdKTtcbn1cbi8qKlxyXG4gKiBSb3RhdGUgYSB2ZWN0b3IgYXJvdW5kIGFub3RoZXIgdmVjdG9yIGJ5IHIgKHJhZGlhbnMpXHJcbiAqIEBwYXJhbSBBIHZlY3RvclxyXG4gKiBAcGFyYW0gQyBjZW50ZXJcclxuICogQHBhcmFtIHIgcm90YXRpb24gaW4gcmFkaWFuc1xyXG4gKi9cblxuZnVuY3Rpb24gcm90QXJvdW5kKEEsIEMsIHIpIHtcbiAgdmFyIHMgPSBNYXRoLnNpbihyKTtcbiAgdmFyIGMgPSBNYXRoLmNvcyhyKTtcbiAgdmFyIHB4ID0gQVswXSAtIENbMF07XG4gIHZhciBweSA9IEFbMV0gLSBDWzFdO1xuICB2YXIgbnggPSBweCAqIGMgLSBweSAqIHM7XG4gIHZhciBueSA9IHB4ICogcyArIHB5ICogYztcbiAgcmV0dXJuIFtueCArIENbMF0sIG55ICsgQ1sxXV07XG59XG4vKipcclxuICogSW50ZXJwb2xhdGUgdmVjdG9yIEEgdG8gQiB3aXRoIGEgc2NhbGFyIHRcclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIEJcclxuICogQHBhcmFtIHQgc2NhbGFyXHJcbiAqL1xuXG5mdW5jdGlvbiBscnAoQSwgQiwgdCkge1xuICByZXR1cm4gYWRkKEEsIG11bCh2ZWMoQSwgQiksIHQpKTtcbn1cblxudmFyIG1pbiA9IE1hdGgubWluLFxuICAgIFBJID0gTWF0aC5QSTtcbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBwb2ludHMgZm9yIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gc3RyZWFtbGluZSBIb3cgbXVjaCB0byBzdHJlYW1saW5lIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBzaXplIFRoZSBzdHJva2UncyBzaXplLlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlUG9pbnRzKHBvaW50cywgb3B0aW9ucykge1xuICB2YXIgX29wdGlvbnMkc2ltdWxhdGVQcmVzID0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlLFxuICAgICAgc2ltdWxhdGVQcmVzc3VyZSA9IF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNpbXVsYXRlUHJlcyxcbiAgICAgIF9vcHRpb25zJHN0cmVhbWxpbmUgPSBvcHRpb25zLnN0cmVhbWxpbmUsXG4gICAgICBzdHJlYW1saW5lID0gX29wdGlvbnMkc3RyZWFtbGluZSA9PT0gdm9pZCAwID8gMC41IDogX29wdGlvbnMkc3RyZWFtbGluZSxcbiAgICAgIF9vcHRpb25zJHNpemUgPSBvcHRpb25zLnNpemUsXG4gICAgICBzaXplID0gX29wdGlvbnMkc2l6ZSA9PT0gdm9pZCAwID8gOCA6IF9vcHRpb25zJHNpemU7XG4gIHN0cmVhbWxpbmUgLz0gMjtcblxuICBpZiAoIXNpbXVsYXRlUHJlc3N1cmUpIHtcbiAgICBzdHJlYW1saW5lIC89IDI7XG4gIH1cblxuICB2YXIgcHRzID0gdG9Qb2ludHNBcnJheShwb2ludHMpO1xuICB2YXIgbGVuID0gcHRzLmxlbmd0aDtcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIFtdO1xuICBpZiAobGVuID09PSAxKSBwdHMucHVzaChhZGQocHRzWzBdLCBbMSwgMF0pKTtcbiAgdmFyIHN0cm9rZVBvaW50cyA9IFt7XG4gICAgcG9pbnQ6IFtwdHNbMF1bMF0sIHB0c1swXVsxXV0sXG4gICAgcHJlc3N1cmU6IHB0c1swXVsyXSxcbiAgICB2ZWN0b3I6IFswLCAwXSxcbiAgICBkaXN0YW5jZTogMCxcbiAgICBydW5uaW5nTGVuZ3RoOiAwXG4gIH1dO1xuXG4gIGZvciAodmFyIGkgPSAxLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gc3Ryb2tlUG9pbnRzWzBdOyBpIDwgcHRzLmxlbmd0aDsgaSsrLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gc3Ryb2tlUG9pbnRzW2kgLSAxXSkge1xuICAgIHZhciBwb2ludCA9IGxycChwcmV2LnBvaW50LCBjdXJyLCAxIC0gc3RyZWFtbGluZSksXG4gICAgICAgIHByZXNzdXJlID0gY3VyclsyXSxcbiAgICAgICAgdmVjdG9yID0gdW5pKHZlYyhwb2ludCwgcHJldi5wb2ludCkpLFxuICAgICAgICBkaXN0YW5jZSA9IGRpc3QocG9pbnQsIHByZXYucG9pbnQpLFxuICAgICAgICBydW5uaW5nTGVuZ3RoID0gcHJldi5ydW5uaW5nTGVuZ3RoICsgZGlzdGFuY2U7XG4gICAgc3Ryb2tlUG9pbnRzLnB1c2goe1xuICAgICAgcG9pbnQ6IHBvaW50LFxuICAgICAgcHJlc3N1cmU6IHByZXNzdXJlLFxuICAgICAgdmVjdG9yOiB2ZWN0b3IsXG4gICAgICBkaXN0YW5jZTogZGlzdGFuY2UsXG4gICAgICBydW5uaW5nTGVuZ3RoOiBydW5uaW5nTGVuZ3RoXG4gICAgfSk7XG4gIH1cbiAgLypcclxuICAgIEFsaWduIHZlY3RvcnMgYXQgdGhlIGVuZCBvZiB0aGUgbGluZVxyXG4gICAgICAgU3RhcnRpbmcgZnJvbSB0aGUgbGFzdCBwb2ludCwgd29yayBiYWNrIHVudGlsIHdlJ3ZlIHRyYXZlbGVkIG1vcmUgdGhhblxyXG4gICAgaGFsZiBvZiB0aGUgbGluZSdzIHNpemUgKHdpZHRoKS4gVGFrZSB0aGUgY3VycmVudCBwb2ludCdzIHZlY3RvciBhbmQgdGhlblxyXG4gICAgd29yayBmb3J3YXJkLCBzZXR0aW5nIGFsbCByZW1haW5pbmcgcG9pbnRzJyB2ZWN0b3JzIHRvIHRoaXMgdmVjdG9yLiBUaGlzXHJcbiAgICByZW1vdmVzIHRoZSBcIm5vaXNlXCIgYXQgdGhlIGVuZCBvZiB0aGUgbGluZSBhbmQgYWxsb3dzIGZvciBhIGJldHRlci1mYWNpbmdcclxuICAgIGVuZCBjYXAuXHJcbiAgKi9cblxuXG4gIHZhciB0b3RhbExlbmd0aCA9IHN0cm9rZVBvaW50c1tsZW4gLSAxXS5ydW5uaW5nTGVuZ3RoO1xuXG4gIGZvciAodmFyIF9pID0gbGVuIC0gMjsgX2kgPiAxOyBfaS0tKSB7XG4gICAgdmFyIF9zdHJva2VQb2ludHMkX2kgPSBzdHJva2VQb2ludHNbX2ldLFxuICAgICAgICBfcnVubmluZ0xlbmd0aCA9IF9zdHJva2VQb2ludHMkX2kucnVubmluZ0xlbmd0aCxcbiAgICAgICAgX3ZlY3RvciA9IF9zdHJva2VQb2ludHMkX2kudmVjdG9yO1xuXG4gICAgaWYgKHRvdGFsTGVuZ3RoIC0gX3J1bm5pbmdMZW5ndGggPiBzaXplIC8gMiB8fCBkcHIoc3Ryb2tlUG9pbnRzW19pIC0gMV0udmVjdG9yLCBzdHJva2VQb2ludHNbX2ldLnZlY3RvcikgPCAwLjgpIHtcbiAgICAgIGZvciAodmFyIGogPSBfaTsgaiA8IGxlbjsgaisrKSB7XG4gICAgICAgIHN0cm9rZVBvaW50c1tqXS52ZWN0b3IgPSBfdmVjdG9yO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3Ryb2tlUG9pbnRzO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZU91dGxpbmVQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBhbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeV1gKSByZXByZXNlbnRpbmcgdGhlIG91dGxpbmUgb2YgYSBzdHJva2UuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIChvcHRpb25hbCkgb2JqZWN0IHdpdGggb3B0aW9ucy5cclxuICogQHBhcmFtIG9wdGlvbnMuc2l6ZVx0VGhlIGJhc2Ugc2l6ZSAoZGlhbWV0ZXIpIG9mIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRoaW5uaW5nIFRoZSBlZmZlY3Qgb2YgcHJlc3N1cmUgb24gdGhlIHN0cm9rZSdzIHNpemUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNtb290aGluZ1x0SG93IG11Y2ggdG8gc29mdGVuIHRoZSBzdHJva2UncyBlZGdlcy5cclxuICogQHBhcmFtIG9wdGlvbnMuZWFzaW5nXHRBbiBlYXNpbmcgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBwb2ludCdzIHByZXNzdXJlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnN0YXJ0IFRhcGVyaW5nIGFuZCBlYXNpbmcgZnVuY3Rpb24gZm9yIHRoZSBzdGFydCBvZiB0aGUgbGluZS5cclxuICogQHBhcmFtIG9wdGlvbnMuZW5kIFRhcGVyaW5nIGFuZCBlYXNpbmcgZnVuY3Rpb24gZm9yIHRoZSBlbmQgb2YgdGhlIGxpbmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmxhc3QgV2hldGhlciB0byBoYW5kbGUgdGhlIHBvaW50cyBhcyBhIGNvbXBsZXRlZCBzdHJva2UuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHNpemUyID0gX29wdGlvbnMuc2l6ZSxcbiAgICAgIHNpemUgPSBfb3B0aW9ucyRzaXplMiA9PT0gdm9pZCAwID8gOCA6IF9vcHRpb25zJHNpemUyLFxuICAgICAgX29wdGlvbnMkdGhpbm5pbmcgPSBfb3B0aW9ucy50aGlubmluZyxcbiAgICAgIHRoaW5uaW5nID0gX29wdGlvbnMkdGhpbm5pbmcgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHRoaW5uaW5nLFxuICAgICAgX29wdGlvbnMkc21vb3RoaW5nID0gX29wdGlvbnMuc21vb3RoaW5nLFxuICAgICAgc21vb3RoaW5nID0gX29wdGlvbnMkc21vb3RoaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyRzbW9vdGhpbmcsXG4gICAgICBfb3B0aW9ucyRzaW11bGF0ZVByZXMyID0gX29wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSxcbiAgICAgIHNpbXVsYXRlUHJlc3N1cmUgPSBfb3B0aW9ucyRzaW11bGF0ZVByZXMyID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2ltdWxhdGVQcmVzMixcbiAgICAgIF9vcHRpb25zJGVhc2luZyA9IF9vcHRpb25zLmVhc2luZyxcbiAgICAgIGVhc2luZyA9IF9vcHRpb25zJGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdDtcbiAgfSA6IF9vcHRpb25zJGVhc2luZyxcbiAgICAgIF9vcHRpb25zJHN0YXJ0ID0gX29wdGlvbnMuc3RhcnQsXG4gICAgICBzdGFydCA9IF9vcHRpb25zJHN0YXJ0ID09PSB2b2lkIDAgPyB7fSA6IF9vcHRpb25zJHN0YXJ0LFxuICAgICAgX29wdGlvbnMkZW5kID0gX29wdGlvbnMuZW5kLFxuICAgICAgZW5kID0gX29wdGlvbnMkZW5kID09PSB2b2lkIDAgPyB7fSA6IF9vcHRpb25zJGVuZCxcbiAgICAgIF9vcHRpb25zJGxhc3QgPSBfb3B0aW9ucy5sYXN0LFxuICAgICAgaXNDb21wbGV0ZSA9IF9vcHRpb25zJGxhc3QgPT09IHZvaWQgMCA/IGZhbHNlIDogX29wdGlvbnMkbGFzdDtcbiAgdmFyIF9vcHRpb25zMiA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9uczIkc3RyZWFtbGluZSA9IF9vcHRpb25zMi5zdHJlYW1saW5lLFxuICAgICAgc3RyZWFtbGluZSA9IF9vcHRpb25zMiRzdHJlYW1saW5lID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9uczIkc3RyZWFtbGluZTtcbiAgc3RyZWFtbGluZSAvPSAyO1xuICB2YXIgX3N0YXJ0JHRhcGVyID0gc3RhcnQudGFwZXIsXG4gICAgICB0YXBlclN0YXJ0ID0gX3N0YXJ0JHRhcGVyID09PSB2b2lkIDAgPyAwIDogX3N0YXJ0JHRhcGVyLFxuICAgICAgX3N0YXJ0JGVhc2luZyA9IHN0YXJ0LmVhc2luZyxcbiAgICAgIHRhcGVyU3RhcnRFYXNlID0gX3N0YXJ0JGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdCAqICgyIC0gdCk7XG4gIH0gOiBfc3RhcnQkZWFzaW5nO1xuICB2YXIgX2VuZCR0YXBlciA9IGVuZC50YXBlcixcbiAgICAgIHRhcGVyRW5kID0gX2VuZCR0YXBlciA9PT0gdm9pZCAwID8gMCA6IF9lbmQkdGFwZXIsXG4gICAgICBfZW5kJGVhc2luZyA9IGVuZC5lYXNpbmcsXG4gICAgICB0YXBlckVuZEVhc2UgPSBfZW5kJGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gLS10ICogdCAqIHQgKyAxO1xuICB9IDogX2VuZCRlYXNpbmc7IC8vIFRoZSBudW1iZXIgb2YgcG9pbnRzIGluIHRoZSBhcnJheVxuXG4gIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoOyAvLyBXZSBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIGFuIGVtcHR5IGFycmF5LlxuXG4gIGlmIChsZW4gPT09IDApIHJldHVybiBbXTsgLy8gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZVxuXG4gIHZhciB0b3RhbExlbmd0aCA9IHBvaW50c1tsZW4gLSAxXS5ydW5uaW5nTGVuZ3RoOyAvLyBPdXIgY29sbGVjdGVkIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuXG4gIHZhciBsZWZ0UHRzID0gW107XG4gIHZhciByaWdodFB0cyA9IFtdOyAvLyBQcmV2aW91cyBwcmVzc3VyZSAoc3RhcnQgd2l0aCBhdmVyYWdlIG9mIGZpcnN0IGZpdmUgcHJlc3N1cmVzKVxuXG4gIHZhciBwcmV2UHJlc3N1cmUgPSBwb2ludHMuc2xpY2UoMCwgNSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIGN1cikge1xuICAgIHJldHVybiAoYWNjICsgY3VyLnByZXNzdXJlKSAvIDI7XG4gIH0sIHBvaW50c1swXS5wcmVzc3VyZSk7IC8vIFRoZSBjdXJyZW50IHJhZGl1c1xuXG4gIHZhciByYWRpdXMgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcG9pbnRzW2xlbiAtIDFdLnByZXNzdXJlKTsgLy8gUHJldmlvdXMgdmVjdG9yXG5cbiAgdmFyIHByZXZWZWN0b3IgPSBwb2ludHNbMF0udmVjdG9yOyAvLyBQcmV2aW91cyBsZWZ0IGFuZCByaWdodCBwb2ludHNcblxuICB2YXIgcGwgPSBwb2ludHNbMF0ucG9pbnQ7XG4gIHZhciBwciA9IHBsOyAvLyBUZW1wb3JhcnkgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG5cbiAgdmFyIHRsID0gcGw7XG4gIHZhciB0ciA9IHByO1xuICAvKlxyXG4gICAgRmluZCB0aGUgb3V0bGluZSdzIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xyXG4gICAgICBJdGVyYXRpbmcgdGhyb3VnaCB0aGUgcG9pbnRzIGFuZCBwb3B1bGF0ZSB0aGUgcmlnaHRQdHMgYW5kIGxlZnRQdHMgYXJyYXlzLFxyXG4gICBza2lwcGluZyB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzbSwgd2hpY2ggd2lsbCBnZXQgY2FwcyBsYXRlciBvbi5cclxuICAqL1xuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuIC0gMTsgaSsrKSB7XG4gICAgdmFyIF9wb2ludHMkaSA9IHBvaW50c1tpXSxcbiAgICAgICAgcG9pbnQgPSBfcG9pbnRzJGkucG9pbnQsXG4gICAgICAgIHByZXNzdXJlID0gX3BvaW50cyRpLnByZXNzdXJlLFxuICAgICAgICB2ZWN0b3IgPSBfcG9pbnRzJGkudmVjdG9yLFxuICAgICAgICBkaXN0YW5jZSA9IF9wb2ludHMkaS5kaXN0YW5jZSxcbiAgICAgICAgcnVubmluZ0xlbmd0aCA9IF9wb2ludHMkaS5ydW5uaW5nTGVuZ3RoO1xuICAgIC8qXHJcbiAgICAgIENhbGN1bGF0ZSB0aGUgcmFkaXVzXHJcbiAgICAgICAgICAgSWYgbm90IHRoaW5uaW5nLCB0aGUgY3VycmVudCBwb2ludCdzIHJhZGl1cyB3aWxsIGJlIGhhbGYgdGhlIHNpemU7IG9yXHJcbiAgICAgIG90aGVyd2lzZSwgdGhlIHNpemUgd2lsbCBiZSBiYXNlZCBvbiB0aGUgY3VycmVudCAocmVhbCBvciBzaW11bGF0ZWQpXHJcbiAgICAgIHByZXNzdXJlLlxyXG4gICAgKi9cblxuICAgIGlmICh0aGlubmluZykge1xuICAgICAgaWYgKHNpbXVsYXRlUHJlc3N1cmUpIHtcbiAgICAgICAgdmFyIHJwID0gbWluKDEsIDEgLSBkaXN0YW5jZSAvIHNpemUpO1xuICAgICAgICB2YXIgc3AgPSBtaW4oMSwgZGlzdGFuY2UgLyBzaXplKTtcbiAgICAgICAgcHJlc3N1cmUgPSBtaW4oMSwgcHJldlByZXNzdXJlICsgKHJwIC0gcHJldlByZXNzdXJlKSAqIChzcCAvIDIpKTtcbiAgICAgIH1cblxuICAgICAgcmFkaXVzID0gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIHByZXNzdXJlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmFkaXVzID0gc2l6ZSAvIDI7XG4gICAgfVxuICAgIC8qXHJcbiAgICAgIEFwcGx5IHRhcGVyaW5nXHJcbiAgICAgICAgICAgSWYgdGhlIGN1cnJlbnQgbGVuZ3RoIGlzIHdpdGhpbiB0aGUgdGFwZXIgZGlzdGFuY2UgYXQgZWl0aGVyIHRoZVxyXG4gICAgICBzdGFydCBvciB0aGUgZW5kLCBjYWxjdWxhdGUgdGhlIHRhcGVyIHN0cmVuZ3Rocy4gQXBwbHkgdGhlIHNtYWxsZXJcclxuICAgICAgb2YgdGhlIHR3byB0YXBlciBzdHJlbmd0aHMgdG8gdGhlIHJhZGl1cy5cclxuICAgICovXG5cblxuICAgIHZhciB0cyA9IHJ1bm5pbmdMZW5ndGggPCB0YXBlclN0YXJ0ID8gdGFwZXJTdGFydEVhc2UocnVubmluZ0xlbmd0aCAvIHRhcGVyU3RhcnQpIDogMTtcbiAgICB2YXIgdGUgPSB0b3RhbExlbmd0aCAtIHJ1bm5pbmdMZW5ndGggPCB0YXBlckVuZCA/IHRhcGVyRW5kRWFzZSgodG90YWxMZW5ndGggLSBydW5uaW5nTGVuZ3RoKSAvIHRhcGVyRW5kKSA6IDE7XG4gICAgcmFkaXVzICo9IE1hdGgubWluKHRzLCB0ZSk7XG4gICAgLypcclxuICAgICAgSGFuZGxlIHNoYXJwIGNvcm5lcnNcclxuICAgICAgICAgICBGaW5kIHRoZSBkaWZmZXJlbmNlIChkb3QgcHJvZHVjdCkgYmV0d2VlbiB0aGUgY3VycmVudCBhbmQgbmV4dCB2ZWN0b3IuXHJcbiAgICAgIElmIHRoZSBuZXh0IHZlY3RvciBpcyBhdCBtb3JlIHRoYW4gYSByaWdodCBhbmdsZSB0byB0aGUgY3VycmVudCB2ZWN0b3IsXHJcbiAgICAgIGRyYXcgYSBjYXAgYXQgdGhlIGN1cnJlbnQgcG9pbnQuXHJcbiAgICAqL1xuXG4gICAgdmFyIG5leHRWZWN0b3IgPSBwb2ludHNbaSArIDFdLnZlY3RvcjtcbiAgICB2YXIgZHByJDEgPSBkcHIodmVjdG9yLCBuZXh0VmVjdG9yKTtcblxuICAgIGlmIChkcHIkMSA8IDApIHtcbiAgICAgIHZhciBfb2Zmc2V0ID0gbXVsKHBlcihwcmV2VmVjdG9yKSwgcmFkaXVzKTtcblxuICAgICAgdmFyIGxhID0gYWRkKHBvaW50LCBfb2Zmc2V0KTtcbiAgICAgIHZhciByYSA9IHN1Yihwb2ludCwgX29mZnNldCk7XG5cbiAgICAgIGZvciAodmFyIHQgPSAwLjI7IHQgPCAxOyB0ICs9IDAuMikge1xuICAgICAgICB0ciA9IHJvdEFyb3VuZChsYSwgcG9pbnQsIFBJICogLXQpO1xuICAgICAgICB0bCA9IHJvdEFyb3VuZChyYSwgcG9pbnQsIFBJICogdCk7XG4gICAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgfVxuXG4gICAgICBwbCA9IHRsO1xuICAgICAgcHIgPSB0cjtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICAvKlxyXG4gICAgICBBZGQgcmVndWxhciBwb2ludHNcclxuICAgICAgICAgICBQcm9qZWN0IHBvaW50cyB0byBlaXRoZXIgc2lkZSBvZiB0aGUgY3VycmVudCBwb2ludCwgdXNpbmcgdGhlXHJcbiAgICAgIGNhbGN1bGF0ZWQgc2l6ZSBhcyBhIGRpc3RhbmNlLiBJZiBhIHBvaW50J3MgZGlzdGFuY2UgdG8gdGhlXHJcbiAgICAgIHByZXZpb3VzIHBvaW50IG9uIHRoYXQgc2lkZSBncmVhdGVyIHRoYW4gdGhlIG1pbmltdW0gZGlzdGFuY2VcclxuICAgICAgKG9yIGlmIHRoZSBjb3JuZXIgaXMga2luZGEgc2hhcnApLCBhZGQgdGhlIHBvaW50cyB0byB0aGUgc2lkZSdzXHJcbiAgICAgIHBvaW50cyBhcnJheS5cclxuICAgICovXG5cblxuICAgIHZhciBvZmZzZXQgPSBtdWwocGVyKGxycChuZXh0VmVjdG9yLCB2ZWN0b3IsIGRwciQxKSksIHJhZGl1cyk7XG4gICAgdGwgPSBzdWIocG9pbnQsIG9mZnNldCk7XG4gICAgdHIgPSBhZGQocG9pbnQsIG9mZnNldCk7XG4gICAgdmFyIGFsd2F5c0FkZCA9IGkgPT09IDEgfHwgZHByJDEgPCAwLjI1O1xuICAgIHZhciBtaW5EaXN0YW5jZSA9IChydW5uaW5nTGVuZ3RoID4gc2l6ZSA/IHNpemUgOiBzaXplIC8gMikgKiBzbW9vdGhpbmc7XG5cbiAgICBpZiAoYWx3YXlzQWRkIHx8IGRpc3QocGwsIHRsKSA+IG1pbkRpc3RhbmNlKSB7XG4gICAgICBsZWZ0UHRzLnB1c2gobHJwKHBsLCB0bCwgc3RyZWFtbGluZSkpO1xuICAgICAgcGwgPSB0bDtcbiAgICB9XG5cbiAgICBpZiAoYWx3YXlzQWRkIHx8IGRpc3QocHIsIHRyKSA+IG1pbkRpc3RhbmNlKSB7XG4gICAgICByaWdodFB0cy5wdXNoKGxycChwciwgdHIsIHN0cmVhbWxpbmUpKTtcbiAgICAgIHByID0gdHI7XG4gICAgfSAvLyBTZXQgdmFyaWFibGVzIGZvciBuZXh0IGl0ZXJhdGlvblxuXG5cbiAgICBwcmV2UHJlc3N1cmUgPSBwcmVzc3VyZTtcbiAgICBwcmV2VmVjdG9yID0gdmVjdG9yO1xuICB9XG4gIC8qXHJcbiAgICBEcmF3aW5nIGNhcHNcclxuICAgIFxuICAgIE5vdyB0aGF0IHdlIGhhdmUgb3VyIHBvaW50cyBvbiBlaXRoZXIgc2lkZSBvZiB0aGUgbGluZSwgd2UgbmVlZCB0b1xyXG4gICAgZHJhdyBjYXBzIGF0IHRoZSBzdGFydCBhbmQgZW5kLiBUYXBlcmVkIGxpbmVzIGRvbid0IGhhdmUgY2FwcywgYnV0XHJcbiAgICBtYXkgaGF2ZSBkb3RzIGZvciB2ZXJ5IHNob3J0IGxpbmVzLlxyXG4gICovXG5cblxuICB2YXIgZmlyc3RQb2ludCA9IHBvaW50c1swXTtcbiAgdmFyIGxhc3RQb2ludCA9IHBvaW50c1tsZW4gLSAxXTtcbiAgdmFyIGlzVmVyeVNob3J0ID0gcmlnaHRQdHMubGVuZ3RoIDwgMiB8fCBsZWZ0UHRzLmxlbmd0aCA8IDI7XG4gIC8qXHJcbiAgICBEcmF3IGEgZG90IGZvciB2ZXJ5IHNob3J0IG9yIGNvbXBsZXRlZCBzdHJva2VzXHJcbiAgICBcbiAgICBJZiB0aGUgbGluZSBpcyB0b28gc2hvcnQgdG8gZ2F0aGVyIGxlZnQgb3IgcmlnaHQgcG9pbnRzIGFuZCBpZiB0aGUgbGluZSBpc1xyXG4gICAgbm90IHRhcGVyZWQgb24gZWl0aGVyIHNpZGUsIGRyYXcgYSBkb3QuIElmIHRoZSBsaW5lIGlzIHRhcGVyZWQsIHRoZW4gb25seVxyXG4gICAgZHJhdyBhIGRvdCBpZiB0aGUgbGluZSBpcyBib3RoIHZlcnkgc2hvcnQgYW5kIGNvbXBsZXRlLiBJZiB3ZSBkcmF3IGEgZG90LFxyXG4gICAgd2UgY2FuIGp1c3QgcmV0dXJuIHRob3NlIHBvaW50cy5cclxuICAqL1xuXG4gIGlmIChpc1ZlcnlTaG9ydCAmJiAoISh0YXBlclN0YXJ0IHx8IHRhcGVyRW5kKSB8fCBpc0NvbXBsZXRlKSkge1xuICAgIHZhciBpciA9IDA7XG5cbiAgICBmb3IgKHZhciBfaTIgPSAwOyBfaTIgPCBsZW47IF9pMisrKSB7XG4gICAgICB2YXIgX3BvaW50cyRfaSA9IHBvaW50c1tfaTJdLFxuICAgICAgICAgIF9wcmVzc3VyZSA9IF9wb2ludHMkX2kucHJlc3N1cmUsXG4gICAgICAgICAgX3J1bm5pbmdMZW5ndGgyID0gX3BvaW50cyRfaS5ydW5uaW5nTGVuZ3RoO1xuXG4gICAgICBpZiAoX3J1bm5pbmdMZW5ndGgyID4gc2l6ZSkge1xuICAgICAgICBpciA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBfcHJlc3N1cmUpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgX3N0YXJ0ID0gc3ViKGZpcnN0UG9pbnQucG9pbnQsIG11bChwZXIodW5pKHZlYyhsYXN0UG9pbnQucG9pbnQsIGZpcnN0UG9pbnQucG9pbnQpKSksIGlyIHx8IHJhZGl1cykpO1xuXG4gICAgdmFyIGRvdFB0cyA9IFtdO1xuXG4gICAgZm9yICh2YXIgX3QgPSAwLCBzdGVwID0gMC4xOyBfdCA8PSAxOyBfdCArPSBzdGVwKSB7XG4gICAgICBkb3RQdHMucHVzaChyb3RBcm91bmQoX3N0YXJ0LCBmaXJzdFBvaW50LnBvaW50LCBQSSAqIDIgKiBfdCkpO1xuICAgIH1cblxuICAgIHJldHVybiBkb3RQdHM7XG4gIH1cbiAgLypcclxuICAgIERyYXcgYSBzdGFydCBjYXBcclxuICAgICAgIFVubGVzcyB0aGUgbGluZSBoYXMgYSB0YXBlcmVkIHN0YXJ0LCBvciB1bmxlc3MgdGhlIGxpbmUgaGFzIGEgdGFwZXJlZCBlbmRcclxuICAgIGFuZCB0aGUgbGluZSBpcyB2ZXJ5IHNob3J0LCBkcmF3IGEgc3RhcnQgY2FwIGFyb3VuZCB0aGUgZmlyc3QgcG9pbnQuIFVzZVxyXG4gICAgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHNlY29uZCBsZWZ0IGFuZCByaWdodCBwb2ludCBmb3IgdGhlIGNhcCdzIHJhZGl1cy5cclxuICAgIEZpbmFsbHkgcmVtb3ZlIHRoZSBmaXJzdCBsZWZ0IGFuZCByaWdodCBwb2ludHMuIDpwc3lkdWNrOlxyXG4gICovXG5cblxuICB2YXIgc3RhcnRDYXAgPSBbXTtcblxuICBpZiAoIXRhcGVyU3RhcnQgJiYgISh0YXBlckVuZCAmJiBpc1ZlcnlTaG9ydCkpIHtcbiAgICB0ciA9IHJpZ2h0UHRzWzFdO1xuICAgIHRsID0gbGVmdFB0c1sxXTtcblxuICAgIHZhciBfc3RhcnQyID0gc3ViKGZpcnN0UG9pbnQucG9pbnQsIG11bCh1bmkodmVjKHRyLCB0bCkpLCBkaXN0KHRyLCB0bCkgLyAyKSk7XG5cbiAgICBmb3IgKHZhciBfdDIgPSAwLCBfc3RlcCA9IDAuMjsgX3QyIDw9IDE7IF90MiArPSBfc3RlcCkge1xuICAgICAgc3RhcnRDYXAucHVzaChyb3RBcm91bmQoX3N0YXJ0MiwgZmlyc3RQb2ludC5wb2ludCwgUEkgKiBfdDIpKTtcbiAgICB9XG5cbiAgICBsZWZ0UHRzLnNoaWZ0KCk7XG4gICAgcmlnaHRQdHMuc2hpZnQoKTtcbiAgfVxuICAvKlxyXG4gICAgRHJhdyBhbiBlbmQgY2FwXHJcbiAgICAgICBJZiB0aGUgbGluZSBkb2VzIG5vdCBoYXZlIGEgdGFwZXJlZCBlbmQsIGFuZCB1bmxlc3MgdGhlIGxpbmUgaGFzIGEgdGFwZXJlZFxyXG4gICAgc3RhcnQgYW5kIHRoZSBsaW5lIGlzIHZlcnkgc2hvcnQsIGRyYXcgYSBjYXAgYXJvdW5kIHRoZSBsYXN0IHBvaW50LiBGaW5hbGx5LFxyXG4gICAgcmVtb3ZlIHRoZSBsYXN0IGxlZnQgYW5kIHJpZ2h0IHBvaW50cy4gT3RoZXJ3aXNlLCBhZGQgdGhlIGxhc3QgcG9pbnQuIE5vdGVcclxuICAgIHRoYXQgVGhpcyBjYXAgaXMgYSBmdWxsLXR1cm4tYW5kLWEtaGFsZjogdGhpcyBwcmV2ZW50cyBpbmNvcnJlY3QgY2FwcyBvblxyXG4gICAgc2hhcnAgZW5kIHR1cm5zLlxyXG4gICovXG5cblxuICB2YXIgZW5kQ2FwID0gW107XG5cbiAgaWYgKCF0YXBlckVuZCAmJiAhKHRhcGVyU3RhcnQgJiYgaXNWZXJ5U2hvcnQpKSB7XG4gICAgdmFyIF9zdGFydDMgPSBzdWIobGFzdFBvaW50LnBvaW50LCBtdWwocGVyKGxhc3RQb2ludC52ZWN0b3IpLCByYWRpdXMpKTtcblxuICAgIGZvciAodmFyIF90MyA9IDAsIF9zdGVwMiA9IDAuMTsgX3QzIDw9IDE7IF90MyArPSBfc3RlcDIpIHtcbiAgICAgIGVuZENhcC5wdXNoKHJvdEFyb3VuZChfc3RhcnQzLCBsYXN0UG9pbnQucG9pbnQsIFBJICogMyAqIF90MykpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBlbmRDYXAucHVzaChsYXN0UG9pbnQucG9pbnQpO1xuICB9XG4gIC8qXHJcbiAgICBSZXR1cm4gdGhlIHBvaW50cyBpbiB0aGUgY29ycmVjdCB3aW5kaW5kIG9yZGVyOiBiZWdpbiBvbiB0aGUgbGVmdCBzaWRlLCB0aGVuXHJcbiAgICBjb250aW51ZSBhcm91bmQgdGhlIGVuZCBjYXAsIHRoZW4gY29tZSBiYWNrIGFsb25nIHRoZSByaWdodCBzaWRlLCBhbmQgZmluYWxseVxyXG4gICAgY29tcGxldGUgdGhlIHN0YXJ0IGNhcC5cclxuICAqL1xuXG5cbiAgcmV0dXJuIGxlZnRQdHMuY29uY2F0KGVuZENhcCwgcmlnaHRQdHMucmV2ZXJzZSgpLCBzdGFydENhcCk7XG59XG4vKipcclxuICogIyMgZ2V0U3Ryb2tlXHJcbiAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgc3Ryb2tlIGFzIGFuIGFycmF5IG9mIG91dGxpbmUgcG9pbnRzLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmVhc2luZ1x0QW4gZWFzaW5nIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggcG9pbnQncyBwcmVzc3VyZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSBXaGV0aGVyIHRvIHNpbXVsYXRlIHByZXNzdXJlIGJhc2VkIG9uIHZlbG9jaXR5LlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zdGFydCBUYXBlcmluZyBhbmQgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgc3RhcnQgb2YgdGhlIGxpbmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmVuZCBUYXBlcmluZyBhbmQgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgZW5kIG9mIHRoZSBsaW5lLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5sYXN0IFdoZXRoZXIgdG8gaGFuZGxlIHRoZSBwb2ludHMgYXMgYSBjb21wbGV0ZWQgc3Ryb2tlLlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIGdldFN0cm9rZU91dGxpbmVQb2ludHMoZ2V0U3Ryb2tlUG9pbnRzKHBvaW50cywgb3B0aW9ucyksIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRTdHJva2U7XG5leHBvcnQgeyBnZXRTdHJva2VPdXRsaW5lUG9pbnRzLCBnZXRTdHJva2VQb2ludHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBlcmZlY3QtZnJlZWhhbmQuZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgVUlBY3Rpb25UeXBlcywgV29ya2VyQWN0aW9uVHlwZXMsIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTdmdQYXRoRnJvbVN0cm9rZSwgYWRkVmVjdG9ycywgaW50ZXJwb2xhdGVDdWJpY0JlemllciwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBnZXRTdHJva2UgZnJvbSBcInBlcmZlY3QtZnJlZWhhbmRcIjtcbmltcG9ydCB7IGNvbXByZXNzVG9VVEYxNiwgZGVjb21wcmVzc0Zyb21VVEYxNiB9IGZyb20gXCJsei1zdHJpbmdcIjtcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIENvbW1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vLyBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHBsdWdpbiBVSVxuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pIHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGUsIHBheWxvYWQgfSk7XG59XG4vLyBTYXZlIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgdG8gaXRzIHBsdWdpbiBkYXRhLlxuZnVuY3Rpb24gc2V0T3JpZ2luYWxOb2RlKG5vZGUpIHtcbiAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSB7XG4gICAgICAgIGNlbnRlcjogZ2V0Q2VudGVyKG5vZGUpLFxuICAgICAgICB2ZWN0b3JOZXR3b3JrOiBPYmplY3QuYXNzaWduKHt9LCBub2RlLnZlY3Rvck5ldHdvcmspLFxuICAgICAgICB2ZWN0b3JQYXRoczogbm9kZS52ZWN0b3JQYXRocyxcbiAgICB9O1xuICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiwgY29tcHJlc3NUb1VURjE2KEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsTm9kZSkpKTtcbiAgICByZXR1cm4gb3JpZ2luYWxOb2RlO1xufVxuZnVuY3Rpb24gZGVjb21wcmVzc1BsdWdpbkRhdGEocGx1Z2luRGF0YSkge1xuICAgIC8vIERlY29tcHJlc3MgdGhlIHNhdmVkIGRhdGEgYW5kIHBhcnNlIG91dCB0aGUgb3JpZ2luYWwgbm9kZS5cbiAgICBjb25zdCBkZWNvbXByZXNzZWQgPSBkZWNvbXByZXNzRnJvbVVURjE2KHBsdWdpbkRhdGEpO1xuICAgIGlmICghZGVjb21wcmVzc2VkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiRm91bmQgc2F2ZWQgZGF0YSBmb3Igb3JpZ2luYWwgbm9kZSBidXQgY291bGQgbm90IGRlY29tcHJlc3MgaXQ6IFwiICtcbiAgICAgICAgICAgIGRlY29tcHJlc3NlZCk7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29tcHJlc3NlZCk7XG59XG4vLyBHZXQgYW4gb3JpZ2luYWwgbm9kZSBmcm9tIGEgbm9kZSdzIHBsdWdpbiBkYXRhLlxuZnVuY3Rpb24gZ2V0T3JpZ2luYWxOb2RlKGlkKSB7XG4gICAgbGV0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgaWYgKCFub2RlKVxuICAgICAgICB0aHJvdyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIik7XG4gICAgLy8gTm90aGluZyBvbiB0aGUgbm9kZSDigJQgd2UgaGF2ZW4ndCBtb2RpZmllZCBpdC5cbiAgICBpZiAoIXBsdWdpbkRhdGEpXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIGRlY29tcHJlc3NQbHVnaW5EYXRhKHBsdWdpbkRhdGEpO1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBOb2RlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIEdldCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIFZlY3RvciBub2RlcyBmb3IgdGhlIFVJLlxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWROb2Rlcyh1cGRhdGVDZW50ZXIgPSBmYWxzZSkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKChub2RlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsdWdpbkRhdGEgPSBub2RlLmdldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIpO1xuICAgICAgICBpZiAocGx1Z2luRGF0YSAmJiB1cGRhdGVDZW50ZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlciA9IGdldENlbnRlcihub2RlKTtcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IGRlY29tcHJlc3NQbHVnaW5EYXRhKHBsdWdpbkRhdGEpO1xuICAgICAgICAgICAgaWYgKCEoY2VudGVyLnggPT09IG9yaWdpbmFsTm9kZS5jZW50ZXIueCAmJlxuICAgICAgICAgICAgICAgIGNlbnRlci55ID09PSBvcmlnaW5hbE5vZGUuY2VudGVyLnkpKSB7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxOb2RlLmNlbnRlciA9IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBub2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIGNvbXByZXNzVG9VVEYxNihKU09OLnN0cmluZ2lmeShvcmlnaW5hbE5vZGUpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBub2RlLmlkLFxuICAgICAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICAgICAgdHlwZTogbm9kZS50eXBlLFxuICAgICAgICAgICAgY2FuUmVzZXQ6ICEhcGx1Z2luRGF0YSxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIEdldHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgVmVjdG9yIG5vZGVzIGFzIGFuIGFycmF5IG9mIElkcy5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkTm9kZUlkcygpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09IFwiVkVDVE9SXCIpLm1hcCgoeyBpZCB9KSA9PiBpZCk7XG59XG4vLyBGaW5kIHRoZSBjZW50ZXIgb2YgYSBub2RlLlxuZnVuY3Rpb24gZ2V0Q2VudGVyKG5vZGUpIHtcbiAgICBsZXQgeyB4LCB5LCB3aWR0aCwgaGVpZ2h0IH0gPSBub2RlO1xuICAgIHJldHVybiB7IHg6IHggKyB3aWR0aCAvIDIsIHk6IHkgKyBoZWlnaHQgLyAyIH07XG59XG4vLyBNb3ZlIGEgbm9kZSB0byBhIGNlbnRlci5cbmZ1bmN0aW9uIG1vdmVOb2RlVG9DZW50ZXIobm9kZSwgY2VudGVyKSB7XG4gICAgY29uc3QgeyB4OiB4MCwgeTogeTAgfSA9IGdldENlbnRlcihub2RlKTtcbiAgICBjb25zdCB7IHg6IHgxLCB5OiB5MSB9ID0gY2VudGVyO1xuICAgIG5vZGUueCA9IG5vZGUueCArIHgxIC0geDA7XG4gICAgbm9kZS55ID0gbm9kZS55ICsgeTEgLSB5MDtcbn1cbi8vIFpvb20gdGhlIEZpZ21hIHZpZXdwb3J0IHRvIGEgbm9kZS5cbmZ1bmN0aW9uIHpvb21Ub05vZGUoaWQpIHtcbiAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgIGlmICghbm9kZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhhdCBub2RlOiBcIiArIGlkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW25vZGVdKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tIFNlbGVjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vLyBEZXNlbGVjdCBhIEZpZ21hIG5vZGUuXG5mdW5jdGlvbiBkZXNlbGVjdE5vZGUoaWQpIHtcbiAgICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gc2VsZWN0aW9uLmZpbHRlcigobm9kZSkgPT4gbm9kZS5pZCAhPT0gaWQpO1xufVxuLy8gU2VuZCB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gdGhlIFVJIHN0YXRlLlxuZnVuY3Rpb24gc2VuZFNlbGVjdGVkTm9kZXModXBkYXRlQ2VudGVyID0gdHJ1ZSkge1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBnZXRTZWxlY3RlZE5vZGVzKHVwZGF0ZUNlbnRlcik7XG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBXb3JrZXJBY3Rpb25UeXBlcy5TRUxFQ1RFRF9OT0RFUyxcbiAgICAgICAgcGF5bG9hZDogc2VsZWN0ZWROb2RlcyxcbiAgICB9KTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tIENoYW5naW5nIFZlY3Rvck5vZGVzIC0tLS0tLS0tLS0tLS0tICovXG4vLyBOdW1iZXIgb2YgbmV3IG5vZGVzIHRvIGluc2VydFxuY29uc3QgU1BMSVQgPSA1O1xuLy8gU29tZSBiYXNpYyBlYXNpbmcgZnVuY3Rpb25zXG5jb25zdCBFQVNJTkdTID0ge1xuICAgIGxpbmVhcjogKHQpID0+IHQsXG4gICAgZWFzZUluOiAodCkgPT4gdCAqIHQsXG4gICAgZWFzZU91dDogKHQpID0+IHQgKiAoMiAtIHQpLFxuICAgIGVhc2VJbk91dDogKHQpID0+ICh0IDwgMC41ID8gMiAqIHQgKiB0IDogLTEgKyAoNCAtIDIgKiB0KSAqIHQpLFxufTtcbi8vIENvbXB1dGUgYSBzdHJva2UgYmFzZWQgb24gdGhlIHZlY3RvciBhbmQgYXBwbHkgaXQgdG8gdGhlIHZlY3RvcidzIHBhdGggZGF0YS5cbmZ1bmN0aW9uIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2Rlcyhub2RlSWRzLCB7IG9wdGlvbnMsIGVhc2luZyA9IFwibGluZWFyXCIsIGNsaXAsIH0sIHJlc3RyaWN0VG9Lbm93bk5vZGVzID0gZmFsc2UpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBub2RlSWRzKSB7XG4gICAgICAgIC8vIEdldCB0aGUgbm9kZSB0aGF0IHdlIHdhbnQgdG8gY2hhbmdlXG4gICAgICAgIGNvbnN0IG5vZGVUb0NoYW5nZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICAgICAgaWYgKCFub2RlVG9DaGFuZ2UpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhhdCBub2RlOiBcIiArIGlkKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBHZXQgdGhlIG9yaWdpbmFsIG5vZGVcbiAgICAgICAgbGV0IG9yaWdpbmFsTm9kZSA9IGdldE9yaWdpbmFsTm9kZShub2RlVG9DaGFuZ2UuaWQpO1xuICAgICAgICAvLyBJZiB3ZSBkb24ndCBrbm93IHRoaXMgbm9kZS4uLlxuICAgICAgICBpZiAoIW9yaWdpbmFsTm9kZSkge1xuICAgICAgICAgICAgLy8gQmFpbCBpZiB3ZSdyZSB1cGRhdGluZyBub2Rlc1xuICAgICAgICAgICAgaWYgKHJlc3RyaWN0VG9Lbm93bk5vZGVzKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IG9yaWdpbmFsIG5vZGUgYW5kIGNvbnRpbnVlXG4gICAgICAgICAgICBvcmlnaW5hbE5vZGUgPSBzZXRPcmlnaW5hbE5vZGUobm9kZVRvQ2hhbmdlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJbnRlcnBvbGF0ZSBuZXcgcG9pbnRzIGFsb25nIHRoZSB2ZWN0b3IncyBjdXJ2ZVxuICAgICAgICBjb25zdCBwdHMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgc2VnbWVudCBvZiBvcmlnaW5hbE5vZGUudmVjdG9yTmV0d29yay5zZWdtZW50cykge1xuICAgICAgICAgICAgY29uc3QgcDAgPSBvcmlnaW5hbE5vZGUudmVjdG9yTmV0d29yay52ZXJ0aWNlc1tzZWdtZW50LnN0YXJ0XTtcbiAgICAgICAgICAgIGNvbnN0IHAzID0gb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsudmVydGljZXNbc2VnbWVudC5lbmRdO1xuICAgICAgICAgICAgY29uc3QgcDEgPSBhZGRWZWN0b3JzKHAwLCBzZWdtZW50LnRhbmdlbnRTdGFydCk7XG4gICAgICAgICAgICBjb25zdCBwMiA9IGFkZFZlY3RvcnMocDMsIHNlZ21lbnQudGFuZ2VudEVuZCk7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnBvbGF0b3IgPSBpbnRlcnBvbGF0ZUN1YmljQmV6aWVyKHAwLCBwMSwgcDIsIHAzKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgU1BMSVQ7IGkrKykge1xuICAgICAgICAgICAgICAgIHB0cy5wdXNoKGludGVycG9sYXRvcihpIC8gU1BMSVQpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgc3Ryb2tlIHVzaW5nIHBlcmZlY3QtZnJlZWhhbmRcbiAgICAgICAgY29uc3Qgc3Ryb2tlID0gZ2V0U3Ryb2tlKHB0cywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBlYXNpbmc6IEVBU0lOR1NbZWFzaW5nXSB9KSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBTZXQgc3Ryb2tlIHRvIHZlY3RvciBwYXRoc1xuICAgICAgICAgICAgbm9kZVRvQ2hhbmdlLnZlY3RvclBhdGhzID0gW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZGluZ1J1bGU6IFwiTk9OWkVST1wiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGFwcGx5IHN0cm9rZVwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRqdXN0IHRoZSBwb3NpdGlvbiBvZiB0aGUgbm9kZSBzbyB0aGF0IGl0cyBjZW50ZXIgZG9lcyBub3QgY2hhbmdlXG4gICAgICAgIG1vdmVOb2RlVG9DZW50ZXIobm9kZVRvQ2hhbmdlLCBvcmlnaW5hbE5vZGUuY2VudGVyKTtcbiAgICB9XG4gICAgc2VuZFNlbGVjdGVkTm9kZXMoZmFsc2UpO1xufVxuLy8gUmVzZXQgdGhlIG5vZGUgdG8gaXRzIG9yaWdpbmFsIHBhdGggZGF0YSwgdXNpbmcgZGF0YSBmcm9tIG91ciBjYWNoZSBhbmQgdGhlbiBkZWxldGUgdGhlIG5vZGUuXG5mdW5jdGlvbiByZXNldFZlY3Rvck5vZGVzKCkge1xuICAgIGZvciAobGV0IGlkIG9mIGdldFNlbGVjdGVkTm9kZUlkcygpKSB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IGdldE9yaWdpbmFsTm9kZShpZCk7XG4gICAgICAgIC8vIFdlIGhhdmVuJ3QgbW9kaWZpZWQgdGhpcyBub2RlLlxuICAgICAgICBpZiAoIW9yaWdpbmFsTm9kZSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICAgICAgaWYgKCFjdXJyZW50Tm9kZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50Tm9kZS52ZWN0b3JQYXRocyA9IG9yaWdpbmFsTm9kZS52ZWN0b3JQYXRocztcbiAgICAgICAgY3VycmVudE5vZGUuc2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiwgXCJcIik7XG4gICAgICAgIHNlbmRTZWxlY3RlZE5vZGVzKGZhbHNlKTtcbiAgICB9XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gS2lja29mZiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gTGlzdGVuIHRvIG1lc3NhZ2VzIHJlY2VpdmVkIGZyb20gdGhlIHBsdWdpbiBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5DTE9TRTpcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlpPT01fVE9fTk9ERTpcbiAgICAgICAgICAgIHpvb21Ub05vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLkRFU0VMRUNUX05PREU6XG4gICAgICAgICAgICBkZXNlbGVjdE5vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlJFU0VUX05PREVTOlxuICAgICAgICAgICAgcmVzZXRWZWN0b3JOb2RlcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5UUkFOU0ZPUk1fTk9ERVM6XG4gICAgICAgICAgICBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMoZ2V0U2VsZWN0ZWROb2RlSWRzKCksIHBheWxvYWQsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVVBEQVRFRF9PUFRJT05TOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG4vLyBMaXN0ZW4gZm9yIHNlbGVjdGlvbiBjaGFuZ2VzXG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCBzZW5kU2VsZWN0ZWROb2Rlcyk7XG4vLyBTaG93IHRoZSBwbHVnaW4gaW50ZXJmYWNlXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMyMCwgaGVpZ2h0OiA0ODAgfSk7XG4vLyBTZW5kIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgVUlcbnNlbmRTZWxlY3RlZE5vZGVzKCk7XG4iLCIvLyBVSSBhY3Rpb25zXG5leHBvcnQgdmFyIFVJQWN0aW9uVHlwZXM7XG4oZnVuY3Rpb24gKFVJQWN0aW9uVHlwZXMpIHtcbiAgICBVSUFjdGlvblR5cGVzW1wiQ0xPU0VcIl0gPSBcIkNMT1NFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlpPT01fVE9fTk9ERVwiXSA9IFwiWk9PTV9UT19OT0RFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIkRFU0VMRUNUX05PREVcIl0gPSBcIkRFU0VMRUNUX05PREVcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiVFJBTlNGT1JNX05PREVTXCJdID0gXCJUUkFOU0ZPUk1fTk9ERVNcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiUkVTRVRfTk9ERVNcIl0gPSBcIlJFU0VUX05PREVTXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlVQREFURURfT1BUSU9OU1wiXSA9IFwiVVBEQVRFRF9PUFRJT05TXCI7XG59KShVSUFjdGlvblR5cGVzIHx8IChVSUFjdGlvblR5cGVzID0ge30pKTtcbi8vIFdvcmtlciBhY3Rpb25zXG5leHBvcnQgdmFyIFdvcmtlckFjdGlvblR5cGVzO1xuKGZ1bmN0aW9uIChXb3JrZXJBY3Rpb25UeXBlcykge1xuICAgIFdvcmtlckFjdGlvblR5cGVzW1wiU0VMRUNURURfTk9ERVNcIl0gPSBcIlNFTEVDVEVEX05PREVTXCI7XG4gICAgV29ya2VyQWN0aW9uVHlwZXNbXCJGT1VORF9TRUxFQ1RFRF9OT0RFU1wiXSA9IFwiRk9VTkRfU0VMRUNURURfTk9ERVNcIjtcbn0pKFdvcmtlckFjdGlvblR5cGVzIHx8IChXb3JrZXJBY3Rpb25UeXBlcyA9IHt9KSk7XG4iLCIvLyBpbXBvcnQgcG9seWdvbkNsaXBwaW5nIGZyb20gXCJwb2x5Z29uLWNsaXBwaW5nXCJcbmNvbnN0IHsgcG93IH0gPSBNYXRoO1xuZXhwb3J0IGZ1bmN0aW9uIGN1YmljQmV6aWVyKHR4LCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIEluc3BpcmVkIGJ5IERvbiBMYW5jYXN0ZXIncyB0d28gYXJ0aWNsZXNcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vZ2xpYi9jdWJlbWF0aC5wZGZcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vdGV4dC9iZXptYXRoLmh0bWxcbiAgICAvLyBTZXQgcDAgYW5kIHAxIHBvaW50XG4gICAgbGV0IHgwID0gMCwgeTAgPSAwLCB4MyA9IDEsIHkzID0gMSwgXG4gICAgLy8gQ29udmVydCB0aGUgY29vcmRpbmF0ZXMgdG8gZXF1YXRpb24gc3BhY2VcbiAgICBBID0geDMgLSAzICogeDIgKyAzICogeDEgLSB4MCwgQiA9IDMgKiB4MiAtIDYgKiB4MSArIDMgKiB4MCwgQyA9IDMgKiB4MSAtIDMgKiB4MCwgRCA9IHgwLCBFID0geTMgLSAzICogeTIgKyAzICogeTEgLSB5MCwgRiA9IDMgKiB5MiAtIDYgKiB5MSArIDMgKiB5MCwgRyA9IDMgKiB5MSAtIDMgKiB5MCwgSCA9IHkwLCBcbiAgICAvLyBWYXJpYWJsZXMgZm9yIHRoZSBsb29wIGJlbG93XG4gICAgdCA9IHR4LCBpdGVyYXRpb25zID0gNSwgaSwgc2xvcGUsIHgsIHk7XG4gICAgLy8gTG9vcCB0aHJvdWdoIGEgZmV3IHRpbWVzIHRvIGdldCBhIG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZSwgYWNjb3JkaW5nIHRvIHRoZSBOZXd0b24tUmFwaHNvbiBtZXRob2RcbiAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05ld3RvbidzX21ldGhvZFxuICAgIGZvciAoaSA9IDA7IGkgPCBpdGVyYXRpb25zOyBpKyspIHtcbiAgICAgICAgLy8gVGhlIGN1cnZlJ3MgeCBlcXVhdGlvbiBmb3IgdGhlIGN1cnJlbnQgdGltZSB2YWx1ZVxuICAgICAgICB4ID0gQSAqIHQgKiB0ICogdCArIEIgKiB0ICogdCArIEMgKiB0ICsgRDtcbiAgICAgICAgLy8gVGhlIHNsb3BlIHdlIHdhbnQgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGRlcml2YXRlIG9mIHhcbiAgICAgICAgc2xvcGUgPSAxIC8gKDMgKiBBICogdCAqIHQgKyAyICogQiAqIHQgKyBDKTtcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IGVzdGltYXRlZCB0aW1lIHZhbHVlLCB3aGljaCB3aWxsIGJlIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgb25lIGJlZm9yZVxuICAgICAgICB0IC09ICh4IC0gdHgpICogc2xvcGU7XG4gICAgICAgIHQgPSB0ID4gMSA/IDEgOiB0IDwgMCA/IDAgOiB0O1xuICAgIH1cbiAgICAvLyBGaW5kIHRoZSB5IHZhbHVlIHRocm91Z2ggdGhlIGN1cnZlJ3MgeSBlcXVhdGlvbiwgd2l0aCB0aGUgbm93IG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZVxuICAgIHkgPSBNYXRoLmFicyhFICogdCAqIHQgKiB0ICsgRiAqIHQgKiB0ICsgRyAqIHQgKiBIKTtcbiAgICByZXR1cm4geTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb2ludHNBbG9uZ0N1YmljQmV6aWVyKHB0Q291bnQsIHB4VG9sZXJhbmNlLCBBeCwgQXksIEJ4LCBCeSwgQ3gsIEN5LCBEeCwgRHkpIHtcbiAgICBsZXQgZGVsdGFCQXggPSBCeCAtIEF4O1xuICAgIGxldCBkZWx0YUNCeCA9IEN4IC0gQng7XG4gICAgbGV0IGRlbHRhREN4ID0gRHggLSBDeDtcbiAgICBsZXQgZGVsdGFCQXkgPSBCeSAtIEF5O1xuICAgIGxldCBkZWx0YUNCeSA9IEN5IC0gQnk7XG4gICAgbGV0IGRlbHRhREN5ID0gRHkgLSBDeTtcbiAgICBsZXQgYXgsIGF5LCBieCwgYnksIGN4LCBjeTtcbiAgICBsZXQgbGFzdFggPSAtMTAwMDA7XG4gICAgbGV0IGxhc3RZID0gLTEwMDAwO1xuICAgIGxldCBwdHMgPSBbeyB4OiBBeCwgeTogQXkgfV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwdENvdW50OyBpKyspIHtcbiAgICAgICAgbGV0IHQgPSBpIC8gcHRDb3VudDtcbiAgICAgICAgYXggPSBBeCArIGRlbHRhQkF4ICogdDtcbiAgICAgICAgYnggPSBCeCArIGRlbHRhQ0J4ICogdDtcbiAgICAgICAgY3ggPSBDeCArIGRlbHRhREN4ICogdDtcbiAgICAgICAgYXggKz0gKGJ4IC0gYXgpICogdDtcbiAgICAgICAgYnggKz0gKGN4IC0gYngpICogdDtcbiAgICAgICAgYXkgPSBBeSArIGRlbHRhQkF5ICogdDtcbiAgICAgICAgYnkgPSBCeSArIGRlbHRhQ0J5ICogdDtcbiAgICAgICAgY3kgPSBDeSArIGRlbHRhREN5ICogdDtcbiAgICAgICAgYXkgKz0gKGJ5IC0gYXkpICogdDtcbiAgICAgICAgYnkgKz0gKGN5IC0gYnkpICogdDtcbiAgICAgICAgY29uc3QgeCA9IGF4ICsgKGJ4IC0gYXgpICogdDtcbiAgICAgICAgY29uc3QgeSA9IGF5ICsgKGJ5IC0gYXkpICogdDtcbiAgICAgICAgY29uc3QgZHggPSB4IC0gbGFzdFg7XG4gICAgICAgIGNvbnN0IGR5ID0geSAtIGxhc3RZO1xuICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPiBweFRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcHRzLnB1c2goeyB4OiB4LCB5OiB5IH0pO1xuICAgICAgICAgICAgbGFzdFggPSB4O1xuICAgICAgICAgICAgbGFzdFkgPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHB0cy5wdXNoKHsgeDogRHgsIHk6IER5IH0pO1xuICAgIHJldHVybiBwdHM7XG59XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgYzAsIGMxLCBwMSkge1xuICAgIC8vIDAgPD0gdCA8PSAxXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludGVycG9sYXRvcih0KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwb3coMSAtIHQsIDMpICogcDAueCArXG4gICAgICAgICAgICAgICAgMyAqIHBvdygxIC0gdCwgMikgKiB0ICogYzAueCArXG4gICAgICAgICAgICAgICAgMyAqICgxIC0gdCkgKiBwb3codCwgMikgKiBjMS54ICtcbiAgICAgICAgICAgICAgICBwb3codCwgMykgKiBwMS54LFxuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueSArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueSxcbiAgICAgICAgXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFZlY3RvcnMoYSwgYikge1xuICAgIGlmICghYilcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgcmV0dXJuIHsgeDogYS54ICsgYi54LCB5OiBhLnkgKyBiLnkgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpIHtcbiAgICBpZiAoc3Ryb2tlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgY29uc3QgZCA9IFtdO1xuICAgIGlmIChzdHJva2UubGVuZ3RoIDwgMykge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgbGV0IHAwID0gc3Ryb2tlW3N0cm9rZS5sZW5ndGggLSAzXTtcbiAgICBsZXQgcDEgPSBzdHJva2Vbc3Ryb2tlLmxlbmd0aCAtIDJdO1xuICAgIGQucHVzaChcIk1cIiwgcDBbMF0sIHAwWzFdLCBcIlFcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJva2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZC5wdXNoKHAwWzBdLCBwMFsxXSwgKHAwWzBdICsgcDFbMF0pIC8gMiwgKHAwWzFdICsgcDFbMV0pIC8gMik7XG4gICAgICAgIHAwID0gcDE7XG4gICAgICAgIHAxID0gc3Ryb2tlW2ldO1xuICAgIH1cbiAgICBkLnB1c2goXCJaXCIpO1xuICAgIHJldHVybiBkLmpvaW4oXCIgXCIpO1xufVxuLy8gZXhwb3J0IGZ1bmN0aW9uIGdldEZsYXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2U6IG51bWJlcltdW10pIHtcbi8vICAgdHJ5IHtcbi8vICAgICBjb25zdCBwb2x5ID0gcG9seWdvbkNsaXBwaW5nLnVuaW9uKFtzdHJva2VdIGFzIGFueSlcbi8vICAgICBjb25zdCBkID0gW11cbi8vICAgICBmb3IgKGxldCBmYWNlIG9mIHBvbHkpIHtcbi8vICAgICAgIGZvciAobGV0IHBvaW50cyBvZiBmYWNlKSB7XG4vLyAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSlcbi8vICAgICAgICAgZC5wdXNoKGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHBvaW50cykpXG4vLyAgICAgICB9XG4vLyAgICAgfVxuLy8gICAgIGQucHVzaChcIlpcIilcbi8vICAgICByZXR1cm4gZC5qb2luKFwiIFwiKVxuLy8gICB9IGNhdGNoIChlKSB7XG4vLyAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBjbGlwIHBhdGguXCIpXG4vLyAgICAgcmV0dXJuIGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSlcbi8vICAgfVxuLy8gfVxuIl0sInNvdXJjZVJvb3QiOiIifQ==