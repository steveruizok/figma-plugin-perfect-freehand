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
    // Nothing on the node ??? we haven't modified it.
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
        const stroke = Object(perfect_freehand__WEBPACK_IMPORTED_MODULE_2__["default"])(pts, Object.assign(Object.assign({}, options), { easing: EASINGS[easing], last: true }));
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
    let [p0, p1] = stroke;
    d.push("M", p0[0], p0[1]);
    for (let i = 1; i < stroke.length; i++) {
        d.push("Q", p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtB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QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFLHFDQUFxQyxFQUFFO0FBQ2xILEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQixlQUFlLE9BQU87QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsSUFBSSxJQUEwQztBQUM5QyxFQUFFLG1DQUFPLGFBQWEsaUJBQWlCLEVBQUU7QUFBQSxvR0FBQztBQUMxQyxDQUFDLE1BQU0sRUFFTjs7Ozs7Ozs7Ozs7OztBQ3BmRDtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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LENBQUMsc0NBQXNDO0FBQ3ZDO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQSxDQUFDLDhDQUE4Qzs7Ozs7Ozs7Ozs7OztBQ2YvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLE9BQU8sTUFBTTtBQUNOO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0JBQWdCO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGVBQWU7QUFDL0IsbUJBQW1CLGFBQWE7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0IsYUFBYTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsZUFBZTtBQUM3QjtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFtQjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluL2luZGV4LnRzXCIpO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzIFBpZXJveHkgPHBpZXJveHlAcGllcm94eS5uZXQ+XG4vLyBUaGlzIHdvcmsgaXMgZnJlZS4gWW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdFxuLy8gdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBXVEZQTCwgVmVyc2lvbiAyXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgTElDRU5TRS50eHQgb3IgaHR0cDovL3d3dy53dGZwbC5uZXQvXG4vL1xuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHRoZSBob21lIHBhZ2U6XG4vLyBodHRwOi8vcGllcm94eS5uZXQvYmxvZy9wYWdlcy9sei1zdHJpbmcvdGVzdGluZy5odG1sXG4vL1xuLy8gTFotYmFzZWQgY29tcHJlc3Npb24gYWxnb3JpdGhtLCB2ZXJzaW9uIDEuNC40XG52YXIgTFpTdHJpbmcgPSAoZnVuY3Rpb24oKSB7XG5cbi8vIHByaXZhdGUgcHJvcGVydHlcbnZhciBmID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbnZhciBrZXlTdHJCYXNlNjQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XG52YXIga2V5U3RyVXJpU2FmZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLSRcIjtcbnZhciBiYXNlUmV2ZXJzZURpYyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRCYXNlVmFsdWUoYWxwaGFiZXQsIGNoYXJhY3Rlcikge1xuICBpZiAoIWJhc2VSZXZlcnNlRGljW2FscGhhYmV0XSkge1xuICAgIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XSA9IHt9O1xuICAgIGZvciAodmFyIGk9MCA7IGk8YWxwaGFiZXQubGVuZ3RoIDsgaSsrKSB7XG4gICAgICBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF1bYWxwaGFiZXQuY2hhckF0KGkpXSA9IGk7XG4gICAgfVxuICB9XG4gIHJldHVybiBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF1bY2hhcmFjdGVyXTtcbn1cblxudmFyIExaU3RyaW5nID0ge1xuICBjb21wcmVzc1RvQmFzZTY0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHZhciByZXMgPSBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDYsIGZ1bmN0aW9uKGEpe3JldHVybiBrZXlTdHJCYXNlNjQuY2hhckF0KGEpO30pO1xuICAgIHN3aXRjaCAocmVzLmxlbmd0aCAlIDQpIHsgLy8gVG8gcHJvZHVjZSB2YWxpZCBCYXNlNjRcbiAgICBkZWZhdWx0OiAvLyBXaGVuIGNvdWxkIHRoaXMgaGFwcGVuID9cbiAgICBjYXNlIDAgOiByZXR1cm4gcmVzO1xuICAgIGNhc2UgMSA6IHJldHVybiByZXMrXCI9PT1cIjtcbiAgICBjYXNlIDIgOiByZXR1cm4gcmVzK1wiPT1cIjtcbiAgICBjYXNlIDMgOiByZXR1cm4gcmVzK1wiPVwiO1xuICAgIH1cbiAgfSxcblxuICBkZWNvbXByZXNzRnJvbUJhc2U2NCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoaW5wdXQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGlucHV0Lmxlbmd0aCwgMzIsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBnZXRCYXNlVmFsdWUoa2V5U3RyQmFzZTY0LCBpbnB1dC5jaGFyQXQoaW5kZXgpKTsgfSk7XG4gIH0sXG5cbiAgY29tcHJlc3NUb1VURjE2IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDE1LCBmdW5jdGlvbihhKXtyZXR1cm4gZihhKzMyKTt9KSArIFwiIFwiO1xuICB9LFxuXG4gIGRlY29tcHJlc3NGcm9tVVRGMTY6IGZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGNvbXByZXNzZWQubGVuZ3RoLCAxNjM4NCwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGNvbXByZXNzZWQuY2hhckNvZGVBdChpbmRleCkgLSAzMjsgfSk7XG4gIH0sXG5cbiAgLy9jb21wcmVzcyBpbnRvIHVpbnQ4YXJyYXkgKFVDUy0yIGJpZyBlbmRpYW4gZm9ybWF0KVxuICBjb21wcmVzc1RvVWludDhBcnJheTogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCkge1xuICAgIHZhciBjb21wcmVzc2VkID0gTFpTdHJpbmcuY29tcHJlc3ModW5jb21wcmVzc2VkKTtcbiAgICB2YXIgYnVmPW5ldyBVaW50OEFycmF5KGNvbXByZXNzZWQubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIHBlciBjaGFyYWN0ZXJcblxuICAgIGZvciAodmFyIGk9MCwgVG90YWxMZW49Y29tcHJlc3NlZC5sZW5ndGg7IGk8VG90YWxMZW47IGkrKykge1xuICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaSk7XG4gICAgICBidWZbaSoyXSA9IGN1cnJlbnRfdmFsdWUgPj4+IDg7XG4gICAgICBidWZbaSoyKzFdID0gY3VycmVudF92YWx1ZSAlIDI1NjtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfSxcblxuICAvL2RlY29tcHJlc3MgZnJvbSB1aW50OGFycmF5IChVQ1MtMiBiaWcgZW5kaWFuIGZvcm1hdClcbiAgZGVjb21wcmVzc0Zyb21VaW50OEFycmF5OmZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQ9PT1udWxsIHx8IGNvbXByZXNzZWQ9PT11bmRlZmluZWQpe1xuICAgICAgICByZXR1cm4gTFpTdHJpbmcuZGVjb21wcmVzcyhjb21wcmVzc2VkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYnVmPW5ldyBBcnJheShjb21wcmVzc2VkLmxlbmd0aC8yKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyXG4gICAgICAgIGZvciAodmFyIGk9MCwgVG90YWxMZW49YnVmLmxlbmd0aDsgaTxUb3RhbExlbjsgaSsrKSB7XG4gICAgICAgICAgYnVmW2ldPWNvbXByZXNzZWRbaSoyXSoyNTYrY29tcHJlc3NlZFtpKjIrMV07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGJ1Zi5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goZihjKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTFpTdHJpbmcuZGVjb21wcmVzcyhyZXN1bHQuam9pbignJykpO1xuXG4gICAgfVxuXG4gIH0sXG5cblxuICAvL2NvbXByZXNzIGludG8gYSBzdHJpbmcgdGhhdCBpcyBhbHJlYWR5IFVSSSBlbmNvZGVkXG4gIGNvbXByZXNzVG9FbmNvZGVkVVJJQ29tcG9uZW50OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGtleVN0clVyaVNhZmUuY2hhckF0KGEpO30pO1xuICB9LFxuXG4gIC8vZGVjb21wcmVzcyBmcm9tIGFuIG91dHB1dCBvZiBjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudFxuICBkZWNvbXByZXNzRnJvbUVuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChpbnB1dCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoLyAvZywgXCIrXCIpO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhpbnB1dC5sZW5ndGgsIDMyLCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gZ2V0QmFzZVZhbHVlKGtleVN0clVyaVNhZmUsIGlucHV0LmNoYXJBdChpbmRleCkpOyB9KTtcbiAgfSxcblxuICBjb21wcmVzczogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCkge1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3ModW5jb21wcmVzc2VkLCAxNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSk7fSk7XG4gIH0sXG4gIF9jb21wcmVzczogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCwgYml0c1BlckNoYXIsIGdldENoYXJGcm9tSW50KSB7XG4gICAgaWYgKHVuY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICB2YXIgaSwgdmFsdWUsXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeT0ge30sXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlPSB7fSxcbiAgICAgICAgY29udGV4dF9jPVwiXCIsXG4gICAgICAgIGNvbnRleHRfd2M9XCJcIixcbiAgICAgICAgY29udGV4dF93PVwiXCIsXG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluPSAyLCAvLyBDb21wZW5zYXRlIGZvciB0aGUgZmlyc3QgZW50cnkgd2hpY2ggc2hvdWxkIG5vdCBjb3VudFxuICAgICAgICBjb250ZXh0X2RpY3RTaXplPSAzLFxuICAgICAgICBjb250ZXh0X251bUJpdHM9IDIsXG4gICAgICAgIGNvbnRleHRfZGF0YT1bXSxcbiAgICAgICAgY29udGV4dF9kYXRhX3ZhbD0wLFxuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb249MCxcbiAgICAgICAgaWk7XG5cbiAgICBmb3IgKGlpID0gMDsgaWkgPCB1bmNvbXByZXNzZWQubGVuZ3RoOyBpaSArPSAxKSB7XG4gICAgICBjb250ZXh0X2MgPSB1bmNvbXByZXNzZWQuY2hhckF0KGlpKTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeSxjb250ZXh0X2MpKSB7XG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X2NdID0gY29udGV4dF9kaWN0U2l6ZSsrO1xuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X2NdID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dF93YyA9IGNvbnRleHRfdyArIGNvbnRleHRfYztcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5LGNvbnRleHRfd2MpKSB7XG4gICAgICAgIGNvbnRleHRfdyA9IGNvbnRleHRfd2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlLGNvbnRleHRfdykpIHtcbiAgICAgICAgICBpZiAoY29udGV4dF93LmNoYXJDb2RlQXQoMCk8MjU2KSB7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8OCA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCB2YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PWJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPDE2IDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfd107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93XTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIHdjIHRvIHRoZSBkaWN0aW9uYXJ5LlxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93Y10gPSBjb250ZXh0X2RpY3RTaXplKys7XG4gICAgICAgIGNvbnRleHRfdyA9IFN0cmluZyhjb250ZXh0X2MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE91dHB1dCB0aGUgY29kZSBmb3Igdy5cbiAgICBpZiAoY29udGV4dF93ICE9PSBcIlwiKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlLGNvbnRleHRfdykpIHtcbiAgICAgICAgaWYgKGNvbnRleHRfdy5jaGFyQ29kZUF0KDApPDI1Nikge1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPDggOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPDE2IDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF93XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd107XG4gICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgIH1cblxuXG4gICAgICB9XG4gICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYXJrIHRoZSBlbmQgb2YgdGhlIHN0cmVhbVxuICAgIHZhbHVlID0gMjtcbiAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgfVxuICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgIH1cblxuICAgIC8vIEZsdXNoIHRoZSBsYXN0IGNoYXJcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBlbHNlIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dF9kYXRhLmpvaW4oJycpO1xuICB9LFxuXG4gIGRlY29tcHJlc3M6IGZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGNvbXByZXNzZWQubGVuZ3RoLCAzMjc2OCwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGNvbXByZXNzZWQuY2hhckNvZGVBdChpbmRleCk7IH0pO1xuICB9LFxuXG4gIF9kZWNvbXByZXNzOiBmdW5jdGlvbiAobGVuZ3RoLCByZXNldFZhbHVlLCBnZXROZXh0VmFsdWUpIHtcbiAgICB2YXIgZGljdGlvbmFyeSA9IFtdLFxuICAgICAgICBuZXh0LFxuICAgICAgICBlbmxhcmdlSW4gPSA0LFxuICAgICAgICBkaWN0U2l6ZSA9IDQsXG4gICAgICAgIG51bUJpdHMgPSAzLFxuICAgICAgICBlbnRyeSA9IFwiXCIsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBpLFxuICAgICAgICB3LFxuICAgICAgICBiaXRzLCByZXNiLCBtYXhwb3dlciwgcG93ZXIsXG4gICAgICAgIGMsXG4gICAgICAgIGRhdGEgPSB7dmFsOmdldE5leHRWYWx1ZSgwKSwgcG9zaXRpb246cmVzZXRWYWx1ZSwgaW5kZXg6MX07XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSArPSAxKSB7XG4gICAgICBkaWN0aW9uYXJ5W2ldID0gaTtcbiAgICB9XG5cbiAgICBiaXRzID0gMDtcbiAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMik7XG4gICAgcG93ZXI9MTtcbiAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICB9XG4gICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgIHBvd2VyIDw8PSAxO1xuICAgIH1cblxuICAgIHN3aXRjaCAobmV4dCA9IGJpdHMpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsOCk7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgYyA9IGYoYml0cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwxNik7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgYyA9IGYoYml0cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgZGljdGlvbmFyeVszXSA9IGM7XG4gICAgdyA9IGM7XG4gICAgcmVzdWx0LnB1c2goYyk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChkYXRhLmluZGV4ID4gbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBiaXRzID0gMDtcbiAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMixudW1CaXRzKTtcbiAgICAgIHBvd2VyPTE7XG4gICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICB9XG4gICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChjID0gYml0cykge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDgpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gZihiaXRzKTtcbiAgICAgICAgICBjID0gZGljdFNpemUtMTtcbiAgICAgICAgICBlbmxhcmdlSW4tLTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwxNik7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gZihiaXRzKTtcbiAgICAgICAgICBjID0gZGljdFNpemUtMTtcbiAgICAgICAgICBlbmxhcmdlSW4tLTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBlbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBudW1CaXRzKTtcbiAgICAgICAgbnVtQml0cysrO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGljdGlvbmFyeVtjXSkge1xuICAgICAgICBlbnRyeSA9IGRpY3Rpb25hcnlbY107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYyA9PT0gZGljdFNpemUpIHtcbiAgICAgICAgICBlbnRyeSA9IHcgKyB3LmNoYXJBdCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2goZW50cnkpO1xuXG4gICAgICAvLyBBZGQgdytlbnRyeVswXSB0byB0aGUgZGljdGlvbmFyeS5cbiAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSB3ICsgZW50cnkuY2hhckF0KDApO1xuICAgICAgZW5sYXJnZUluLS07XG5cbiAgICAgIHcgPSBlbnRyeTtcblxuICAgICAgaWYgKGVubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGVubGFyZ2VJbiA9IE1hdGgucG93KDIsIG51bUJpdHMpO1xuICAgICAgICBudW1CaXRzKys7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cbn07XG4gIHJldHVybiBMWlN0cmluZztcbn0pKCk7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIExaU3RyaW5nOyB9KTtcbn0gZWxzZSBpZiggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlICE9IG51bGwgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gTFpTdHJpbmdcbn1cbiIsImZ1bmN0aW9uIGxlcnAoeTEsIHkyLCBtdSkge1xuICByZXR1cm4geTEgKiAoMSAtIG11KSArIHkyICogbXU7XG59XG5mdW5jdGlvbiBjbGFtcChuLCBhLCBiKSB7XG4gIHJldHVybiBNYXRoLm1heChhLCBNYXRoLm1pbihiLCBuKSk7XG59XG4vKipcclxuICogQ29udmVydCBhbiBhcnJheSBvZiBwb2ludHMgdG8gdGhlIGNvcnJlY3QgZm9ybWF0IChbeCwgeSwgcmFkaXVzXSlcclxuICogQHBhcmFtIHBvaW50c1xyXG4gKiBAcmV0dXJuc1xyXG4gKi9cblxuZnVuY3Rpb24gdG9Qb2ludHNBcnJheShwb2ludHMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocG9pbnRzWzBdKSkge1xuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICB2YXIgeCA9IF9yZWZbMF0sXG4gICAgICAgICAgeSA9IF9yZWZbMV0sXG4gICAgICAgICAgX3JlZiQgPSBfcmVmWzJdLFxuICAgICAgICAgIHByZXNzdXJlID0gX3JlZiQgPT09IHZvaWQgMCA/IDAuNSA6IF9yZWYkO1xuICAgICAgcmV0dXJuIFt4LCB5LCBwcmVzc3VyZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgeCA9IF9yZWYyLngsXG4gICAgICAgICAgeSA9IF9yZWYyLnksXG4gICAgICAgICAgX3JlZjIkcHJlc3N1cmUgPSBfcmVmMi5wcmVzc3VyZSxcbiAgICAgICAgICBwcmVzc3VyZSA9IF9yZWYyJHByZXNzdXJlID09PSB2b2lkIDAgPyAwLjUgOiBfcmVmMiRwcmVzc3VyZTtcbiAgICAgIHJldHVybiBbeCwgeSwgcHJlc3N1cmVdO1xuICAgIH0pO1xuICB9XG59XG4vKipcclxuICogQ29tcHV0ZSBhIHJhZGl1cyBiYXNlZCBvbiB0aGUgcHJlc3N1cmUuXHJcbiAqIEBwYXJhbSBzaXplXHJcbiAqIEBwYXJhbSB0aGlubmluZ1xyXG4gKiBAcGFyYW0gZWFzaW5nXHJcbiAqIEBwYXJhbSBwcmVzc3VyZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIHByZXNzdXJlKSB7XG4gIGlmIChwcmVzc3VyZSA9PT0gdm9pZCAwKSB7XG4gICAgcHJlc3N1cmUgPSAwLjU7XG4gIH1cblxuICBpZiAoIXRoaW5uaW5nKSByZXR1cm4gc2l6ZSAvIDI7XG4gIHByZXNzdXJlID0gY2xhbXAoZWFzaW5nKHByZXNzdXJlKSwgMCwgMSk7XG4gIHJldHVybiAodGhpbm5pbmcgPCAwID8gbGVycChzaXplLCBzaXplICsgc2l6ZSAqIGNsYW1wKHRoaW5uaW5nLCAtMC45NSwgLTAuMDUpLCBwcmVzc3VyZSkgOiBsZXJwKHNpemUgLSBzaXplICogY2xhbXAodGhpbm5pbmcsIDAuMDUsIDAuOTUpLCBzaXplLCBwcmVzc3VyZSkpIC8gMjtcbn1cblxuLyoqXHJcbiAqIE5lZ2F0ZSBhIHZlY3Rvci5cclxuICogQHBhcmFtIEFcclxuICovXG4vKipcclxuICogQWRkIHZlY3RvcnMuXHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBCXHJcbiAqL1xuXG5mdW5jdGlvbiBhZGQoQSwgQikge1xuICByZXR1cm4gW0FbMF0gKyBCWzBdLCBBWzFdICsgQlsxXV07XG59XG4vKipcclxuICogU3VidHJhY3QgdmVjdG9ycy5cclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIEJcclxuICovXG5cbmZ1bmN0aW9uIHN1YihBLCBCKSB7XG4gIHJldHVybiBbQVswXSAtIEJbMF0sIEFbMV0gLSBCWzFdXTtcbn1cbi8qKlxyXG4gKiBHZXQgdGhlIHZlY3RvciBmcm9tIHZlY3RvcnMgQSB0byBCLlxyXG4gKiBAcGFyYW0gQVxyXG4gKiBAcGFyYW0gQlxyXG4gKi9cblxuZnVuY3Rpb24gdmVjKEEsIEIpIHtcbiAgLy8gQSwgQiBhcyB2ZWN0b3JzIGdldCB0aGUgdmVjdG9yIGZyb20gQSB0byBCXG4gIHJldHVybiBbQlswXSAtIEFbMF0sIEJbMV0gLSBBWzFdXTtcbn1cbi8qKlxyXG4gKiBWZWN0b3IgbXVsdGlwbGljYXRpb24gYnkgc2NhbGFyXHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBuXHJcbiAqL1xuXG5mdW5jdGlvbiBtdWwoQSwgbikge1xuICByZXR1cm4gW0FbMF0gKiBuLCBBWzFdICogbl07XG59XG4vKipcclxuICogVmVjdG9yIGRpdmlzaW9uIGJ5IHNjYWxhci5cclxuICogQHBhcmFtIEFcclxuICogQHBhcmFtIG5cclxuICovXG5cbmZ1bmN0aW9uIGRpdihBLCBuKSB7XG4gIHJldHVybiBbQVswXSAvIG4sIEFbMV0gLyBuXTtcbn1cbi8qKlxyXG4gKiBQZXJwZW5kaWN1bGFyIHJvdGF0aW9uIG9mIGEgdmVjdG9yIEFcclxuICogQHBhcmFtIEFcclxuICovXG5cbmZ1bmN0aW9uIHBlcihBKSB7XG4gIHJldHVybiBbQVsxXSwgLUFbMF1dO1xufVxuLyoqXHJcbiAqIERvdCBwcm9kdWN0XHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBCXHJcbiAqL1xuXG5mdW5jdGlvbiBkcHIoQSwgQikge1xuICByZXR1cm4gQVswXSAqIEJbMF0gKyBBWzFdICogQlsxXTtcbn1cbi8qKlxyXG4gKiBMZW5ndGggb2YgdGhlIHZlY3RvclxyXG4gKiBAcGFyYW0gQVxyXG4gKi9cblxuZnVuY3Rpb24gbGVuKEEpIHtcbiAgcmV0dXJuIE1hdGguaHlwb3QoQVswXSwgQVsxXSk7XG59XG4vKipcclxuICogR2V0IG5vcm1hbGl6ZWQgLyB1bml0IHZlY3Rvci5cclxuICogQHBhcmFtIEFcclxuICovXG5cbmZ1bmN0aW9uIHVuaShBKSB7XG4gIHJldHVybiBkaXYoQSwgbGVuKEEpKTtcbn1cbi8qKlxyXG4gKiBEaXN0IGxlbmd0aCBmcm9tIEEgdG8gQlxyXG4gKiBAcGFyYW0gQVxyXG4gKiBAcGFyYW0gQlxyXG4gKi9cblxuZnVuY3Rpb24gZGlzdChBLCBCKSB7XG4gIHJldHVybiBNYXRoLmh5cG90KEFbMV0gLSBCWzFdLCBBWzBdIC0gQlswXSk7XG59XG4vKipcclxuICogUm90YXRlIGEgdmVjdG9yIGFyb3VuZCBhbm90aGVyIHZlY3RvciBieSByIChyYWRpYW5zKVxyXG4gKiBAcGFyYW0gQSB2ZWN0b3JcclxuICogQHBhcmFtIEMgY2VudGVyXHJcbiAqIEBwYXJhbSByIHJvdGF0aW9uIGluIHJhZGlhbnNcclxuICovXG5cbmZ1bmN0aW9uIHJvdEFyb3VuZChBLCBDLCByKSB7XG4gIHZhciBzID0gTWF0aC5zaW4ocik7XG4gIHZhciBjID0gTWF0aC5jb3Mocik7XG4gIHZhciBweCA9IEFbMF0gLSBDWzBdO1xuICB2YXIgcHkgPSBBWzFdIC0gQ1sxXTtcbiAgdmFyIG54ID0gcHggKiBjIC0gcHkgKiBzO1xuICB2YXIgbnkgPSBweCAqIHMgKyBweSAqIGM7XG4gIHJldHVybiBbbnggKyBDWzBdLCBueSArIENbMV1dO1xufVxuLyoqXHJcbiAqIEludGVycG9sYXRlIHZlY3RvciBBIHRvIEIgd2l0aCBhIHNjYWxhciB0XHJcbiAqIEBwYXJhbSBBXHJcbiAqIEBwYXJhbSBCXHJcbiAqIEBwYXJhbSB0IHNjYWxhclxyXG4gKi9cblxuZnVuY3Rpb24gbHJwKEEsIEIsIHQpIHtcbiAgcmV0dXJuIGFkZChBLCBtdWwodmVjKEEsIEIpLCB0KSk7XG59XG5cbnZhciBtaW4gPSBNYXRoLm1pbixcbiAgICBQSSA9IE1hdGguUEk7XG4vKipcclxuICogIyMgZ2V0U3Ryb2tlUG9pbnRzXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgcG9pbnRzIGZvciBhIHN0cm9rZS5cclxuICogQHBhcmFtIHBvaW50cyBBbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeSwgcHJlc3N1cmVdYCBvciBge3gsIHksIHByZXNzdXJlfWApLiBQcmVzc3VyZSBpcyBvcHRpb25hbC5cclxuICogQHBhcmFtIHN0cmVhbWxpbmUgSG93IG11Y2ggdG8gc3RyZWFtbGluZSB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gc2l6ZSBUaGUgc3Ryb2tlJ3Mgc2l6ZS5cclxuICovXG5cbmZ1bmN0aW9uIGdldFN0cm9rZVBvaW50cyhwb2ludHMsIG9wdGlvbnMpIHtcbiAgdmFyIF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9IG9wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSxcbiAgICAgIHNpbXVsYXRlUHJlc3N1cmUgPSBfb3B0aW9ucyRzaW11bGF0ZVByZXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzaW11bGF0ZVByZXMsXG4gICAgICBfb3B0aW9ucyRzdHJlYW1saW5lID0gb3B0aW9ucy5zdHJlYW1saW5lLFxuICAgICAgc3RyZWFtbGluZSA9IF9vcHRpb25zJHN0cmVhbWxpbmUgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHN0cmVhbWxpbmUsXG4gICAgICBfb3B0aW9ucyRzaXplID0gb3B0aW9ucy5zaXplLFxuICAgICAgc2l6ZSA9IF9vcHRpb25zJHNpemUgPT09IHZvaWQgMCA/IDggOiBfb3B0aW9ucyRzaXplO1xuICBzdHJlYW1saW5lIC89IDI7XG5cbiAgaWYgKCFzaW11bGF0ZVByZXNzdXJlKSB7XG4gICAgc3RyZWFtbGluZSAvPSAyO1xuICB9XG5cbiAgdmFyIHB0cyA9IHRvUG9pbnRzQXJyYXkocG9pbnRzKTtcbiAgdmFyIGxlbiA9IHB0cy5sZW5ndGg7XG4gIGlmIChsZW4gPT09IDApIHJldHVybiBbXTtcbiAgaWYgKGxlbiA9PT0gMSkgcHRzLnB1c2goYWRkKHB0c1swXSwgWzEsIDBdKSk7XG4gIHZhciBzdHJva2VQb2ludHMgPSBbe1xuICAgIHBvaW50OiBbcHRzWzBdWzBdLCBwdHNbMF1bMV1dLFxuICAgIHByZXNzdXJlOiBwdHNbMF1bMl0sXG4gICAgdmVjdG9yOiBbMCwgMF0sXG4gICAgZGlzdGFuY2U6IDAsXG4gICAgcnVubmluZ0xlbmd0aDogMFxuICB9XTtcblxuICBmb3IgKHZhciBpID0gMSwgY3VyciA9IHB0c1tpXSwgcHJldiA9IHN0cm9rZVBvaW50c1swXTsgaSA8IHB0cy5sZW5ndGg7IGkrKywgY3VyciA9IHB0c1tpXSwgcHJldiA9IHN0cm9rZVBvaW50c1tpIC0gMV0pIHtcbiAgICB2YXIgcG9pbnQgPSBscnAocHJldi5wb2ludCwgY3VyciwgMSAtIHN0cmVhbWxpbmUpLFxuICAgICAgICBwcmVzc3VyZSA9IGN1cnJbMl0sXG4gICAgICAgIHZlY3RvciA9IHVuaSh2ZWMocG9pbnQsIHByZXYucG9pbnQpKSxcbiAgICAgICAgZGlzdGFuY2UgPSBkaXN0KHBvaW50LCBwcmV2LnBvaW50KSxcbiAgICAgICAgcnVubmluZ0xlbmd0aCA9IHByZXYucnVubmluZ0xlbmd0aCArIGRpc3RhbmNlO1xuICAgIHN0cm9rZVBvaW50cy5wdXNoKHtcbiAgICAgIHBvaW50OiBwb2ludCxcbiAgICAgIHByZXNzdXJlOiBwcmVzc3VyZSxcbiAgICAgIHZlY3RvcjogdmVjdG9yLFxuICAgICAgZGlzdGFuY2U6IGRpc3RhbmNlLFxuICAgICAgcnVubmluZ0xlbmd0aDogcnVubmluZ0xlbmd0aFxuICAgIH0pO1xuICB9XG4gIC8qXHJcbiAgICBBbGlnbiB2ZWN0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmVcclxuICAgICAgIFN0YXJ0aW5nIGZyb20gdGhlIGxhc3QgcG9pbnQsIHdvcmsgYmFjayB1bnRpbCB3ZSd2ZSB0cmF2ZWxlZCBtb3JlIHRoYW5cclxuICAgIGhhbGYgb2YgdGhlIGxpbmUncyBzaXplICh3aWR0aCkuIFRha2UgdGhlIGN1cnJlbnQgcG9pbnQncyB2ZWN0b3IgYW5kIHRoZW5cclxuICAgIHdvcmsgZm9yd2FyZCwgc2V0dGluZyBhbGwgcmVtYWluaW5nIHBvaW50cycgdmVjdG9ycyB0byB0aGlzIHZlY3Rvci4gVGhpc1xyXG4gICAgcmVtb3ZlcyB0aGUgXCJub2lzZVwiIGF0IHRoZSBlbmQgb2YgdGhlIGxpbmUgYW5kIGFsbG93cyBmb3IgYSBiZXR0ZXItZmFjaW5nXHJcbiAgICBlbmQgY2FwLlxyXG4gICovXG5cblxuICB2YXIgdG90YWxMZW5ndGggPSBzdHJva2VQb2ludHNbbGVuIC0gMV0ucnVubmluZ0xlbmd0aDtcblxuICBmb3IgKHZhciBfaSA9IGxlbiAtIDI7IF9pID4gMTsgX2ktLSkge1xuICAgIHZhciBfc3Ryb2tlUG9pbnRzJF9pID0gc3Ryb2tlUG9pbnRzW19pXSxcbiAgICAgICAgX3J1bm5pbmdMZW5ndGggPSBfc3Ryb2tlUG9pbnRzJF9pLnJ1bm5pbmdMZW5ndGgsXG4gICAgICAgIF92ZWN0b3IgPSBfc3Ryb2tlUG9pbnRzJF9pLnZlY3RvcjtcblxuICAgIGlmICh0b3RhbExlbmd0aCAtIF9ydW5uaW5nTGVuZ3RoID4gc2l6ZSAvIDIgfHwgZHByKHN0cm9rZVBvaW50c1tfaSAtIDFdLnZlY3Rvciwgc3Ryb2tlUG9pbnRzW19pXS52ZWN0b3IpIDwgMC44KSB7XG4gICAgICBmb3IgKHZhciBqID0gX2k7IGogPCBsZW47IGorKykge1xuICAgICAgICBzdHJva2VQb2ludHNbal0udmVjdG9yID0gX3ZlY3RvcjtcbiAgICAgIH1cblxuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cm9rZVBvaW50cztcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VPdXRsaW5lUG9pbnRzXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgYW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHldYCkgcmVwcmVzZW50aW5nIHRoZSBvdXRsaW5lIG9mIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmVhc2luZ1x0QW4gZWFzaW5nIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggcG9pbnQncyBwcmVzc3VyZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSBXaGV0aGVyIHRvIHNpbXVsYXRlIHByZXNzdXJlIGJhc2VkIG9uIHZlbG9jaXR5LlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zdGFydCBUYXBlcmluZyBhbmQgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgc3RhcnQgb2YgdGhlIGxpbmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmVuZCBUYXBlcmluZyBhbmQgZWFzaW5nIGZ1bmN0aW9uIGZvciB0aGUgZW5kIG9mIHRoZSBsaW5lLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5sYXN0IFdoZXRoZXIgdG8gaGFuZGxlIHRoZSBwb2ludHMgYXMgYSBjb21wbGV0ZWQgc3Ryb2tlLlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlT3V0bGluZVBvaW50cyhwb2ludHMsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9ucyRzaXplMiA9IF9vcHRpb25zLnNpemUsXG4gICAgICBzaXplID0gX29wdGlvbnMkc2l6ZTIgPT09IHZvaWQgMCA/IDggOiBfb3B0aW9ucyRzaXplMixcbiAgICAgIF9vcHRpb25zJHRoaW5uaW5nID0gX29wdGlvbnMudGhpbm5pbmcsXG4gICAgICB0aGlubmluZyA9IF9vcHRpb25zJHRoaW5uaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyR0aGlubmluZyxcbiAgICAgIF9vcHRpb25zJHNtb290aGluZyA9IF9vcHRpb25zLnNtb290aGluZyxcbiAgICAgIHNtb290aGluZyA9IF9vcHRpb25zJHNtb290aGluZyA9PT0gdm9pZCAwID8gMC41IDogX29wdGlvbnMkc21vb3RoaW5nLFxuICAgICAgX29wdGlvbnMkc2ltdWxhdGVQcmVzMiA9IF9vcHRpb25zLnNpbXVsYXRlUHJlc3N1cmUsXG4gICAgICBzaW11bGF0ZVByZXNzdXJlID0gX29wdGlvbnMkc2ltdWxhdGVQcmVzMiA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNpbXVsYXRlUHJlczIsXG4gICAgICBfb3B0aW9ucyRlYXNpbmcgPSBfb3B0aW9ucy5lYXNpbmcsXG4gICAgICBlYXNpbmcgPSBfb3B0aW9ucyRlYXNpbmcgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQ7XG4gIH0gOiBfb3B0aW9ucyRlYXNpbmcsXG4gICAgICBfb3B0aW9ucyRzdGFydCA9IF9vcHRpb25zLnN0YXJ0LFxuICAgICAgc3RhcnQgPSBfb3B0aW9ucyRzdGFydCA9PT0gdm9pZCAwID8ge30gOiBfb3B0aW9ucyRzdGFydCxcbiAgICAgIF9vcHRpb25zJGVuZCA9IF9vcHRpb25zLmVuZCxcbiAgICAgIGVuZCA9IF9vcHRpb25zJGVuZCA9PT0gdm9pZCAwID8ge30gOiBfb3B0aW9ucyRlbmQsXG4gICAgICBfb3B0aW9ucyRsYXN0ID0gX29wdGlvbnMubGFzdCxcbiAgICAgIGlzQ29tcGxldGUgPSBfb3B0aW9ucyRsYXN0ID09PSB2b2lkIDAgPyBmYWxzZSA6IF9vcHRpb25zJGxhc3Q7XG4gIHZhciBfb3B0aW9uczIgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMyJHN0cmVhbWxpbmUgPSBfb3B0aW9uczIuc3RyZWFtbGluZSxcbiAgICAgIHN0cmVhbWxpbmUgPSBfb3B0aW9uczIkc3RyZWFtbGluZSA9PT0gdm9pZCAwID8gMC41IDogX29wdGlvbnMyJHN0cmVhbWxpbmU7XG4gIHN0cmVhbWxpbmUgLz0gMjtcbiAgdmFyIF9zdGFydCR0YXBlciA9IHN0YXJ0LnRhcGVyLFxuICAgICAgdGFwZXJTdGFydCA9IF9zdGFydCR0YXBlciA9PT0gdm9pZCAwID8gMCA6IF9zdGFydCR0YXBlcixcbiAgICAgIF9zdGFydCRlYXNpbmcgPSBzdGFydC5lYXNpbmcsXG4gICAgICB0YXBlclN0YXJ0RWFzZSA9IF9zdGFydCRlYXNpbmcgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQgKiAoMiAtIHQpO1xuICB9IDogX3N0YXJ0JGVhc2luZztcbiAgdmFyIF9lbmQkdGFwZXIgPSBlbmQudGFwZXIsXG4gICAgICB0YXBlckVuZCA9IF9lbmQkdGFwZXIgPT09IHZvaWQgMCA/IDAgOiBfZW5kJHRhcGVyLFxuICAgICAgX2VuZCRlYXNpbmcgPSBlbmQuZWFzaW5nLFxuICAgICAgdGFwZXJFbmRFYXNlID0gX2VuZCRlYXNpbmcgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIC0tdCAqIHQgKiB0ICsgMTtcbiAgfSA6IF9lbmQkZWFzaW5nOyAvLyBUaGUgbnVtYmVyIG9mIHBvaW50cyBpbiB0aGUgYXJyYXlcblxuICB2YXIgbGVuID0gcG9pbnRzLmxlbmd0aDsgLy8gV2UgY2FuJ3QgZG8gYW55dGhpbmcgd2l0aCBhbiBlbXB0eSBhcnJheS5cblxuICBpZiAobGVuID09PSAwKSByZXR1cm4gW107IC8vIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGxpbmVcblxuICB2YXIgdG90YWxMZW5ndGggPSBwb2ludHNbbGVuIC0gMV0ucnVubmluZ0xlbmd0aDsgLy8gT3VyIGNvbGxlY3RlZCBsZWZ0IGFuZCByaWdodCBwb2ludHNcblxuICB2YXIgbGVmdFB0cyA9IFtdO1xuICB2YXIgcmlnaHRQdHMgPSBbXTsgLy8gUHJldmlvdXMgcHJlc3N1cmUgKHN0YXJ0IHdpdGggYXZlcmFnZSBvZiBmaXJzdCBmaXZlIHByZXNzdXJlcylcblxuICB2YXIgcHJldlByZXNzdXJlID0gcG9pbnRzLnNsaWNlKDAsIDUpLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXIpIHtcbiAgICByZXR1cm4gKGFjYyArIGN1ci5wcmVzc3VyZSkgLyAyO1xuICB9LCBwb2ludHNbMF0ucHJlc3N1cmUpOyAvLyBUaGUgY3VycmVudCByYWRpdXNcblxuICB2YXIgcmFkaXVzID0gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIHBvaW50c1tsZW4gLSAxXS5wcmVzc3VyZSk7IC8vIFByZXZpb3VzIHZlY3RvclxuXG4gIHZhciBwcmV2VmVjdG9yID0gcG9pbnRzWzBdLnZlY3RvcjsgLy8gUHJldmlvdXMgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG5cbiAgdmFyIHBsID0gcG9pbnRzWzBdLnBvaW50O1xuICB2YXIgcHIgPSBwbDsgLy8gVGVtcG9yYXJ5IGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuXG4gIHZhciB0bCA9IHBsO1xuICB2YXIgdHIgPSBwcjtcbiAgLypcclxuICAgIEZpbmQgdGhlIG91dGxpbmUncyBsZWZ0IGFuZCByaWdodCBwb2ludHNcclxuICAgICAgSXRlcmF0aW5nIHRocm91Z2ggdGhlIHBvaW50cyBhbmQgcG9wdWxhdGUgdGhlIHJpZ2h0UHRzIGFuZCBsZWZ0UHRzIGFycmF5cyxcclxuICAgc2tpcHBpbmcgdGhlIGZpcnN0IGFuZCBsYXN0IHBvaW50c20sIHdoaWNoIHdpbGwgZ2V0IGNhcHMgbGF0ZXIgb24uXHJcbiAgKi9cblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbiAtIDE7IGkrKykge1xuICAgIHZhciBfcG9pbnRzJGkgPSBwb2ludHNbaV0sXG4gICAgICAgIHBvaW50ID0gX3BvaW50cyRpLnBvaW50LFxuICAgICAgICBwcmVzc3VyZSA9IF9wb2ludHMkaS5wcmVzc3VyZSxcbiAgICAgICAgdmVjdG9yID0gX3BvaW50cyRpLnZlY3RvcixcbiAgICAgICAgZGlzdGFuY2UgPSBfcG9pbnRzJGkuZGlzdGFuY2UsXG4gICAgICAgIHJ1bm5pbmdMZW5ndGggPSBfcG9pbnRzJGkucnVubmluZ0xlbmd0aDtcbiAgICAvKlxyXG4gICAgICBDYWxjdWxhdGUgdGhlIHJhZGl1c1xyXG4gICAgICAgICAgIElmIG5vdCB0aGlubmluZywgdGhlIGN1cnJlbnQgcG9pbnQncyByYWRpdXMgd2lsbCBiZSBoYWxmIHRoZSBzaXplOyBvclxyXG4gICAgICBvdGhlcndpc2UsIHRoZSBzaXplIHdpbGwgYmUgYmFzZWQgb24gdGhlIGN1cnJlbnQgKHJlYWwgb3Igc2ltdWxhdGVkKVxyXG4gICAgICBwcmVzc3VyZS5cclxuICAgICovXG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIGlmIChzaW11bGF0ZVByZXNzdXJlKSB7XG4gICAgICAgIHZhciBycCA9IG1pbigxLCAxIC0gZGlzdGFuY2UgLyBzaXplKTtcbiAgICAgICAgdmFyIHNwID0gbWluKDEsIGRpc3RhbmNlIC8gc2l6ZSk7XG4gICAgICAgIHByZXNzdXJlID0gbWluKDEsIHByZXZQcmVzc3VyZSArIChycCAtIHByZXZQcmVzc3VyZSkgKiAoc3AgLyAyKSk7XG4gICAgICB9XG5cbiAgICAgIHJhZGl1cyA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBwcmVzc3VyZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJhZGl1cyA9IHNpemUgLyAyO1xuICAgIH1cbiAgICAvKlxyXG4gICAgICBBcHBseSB0YXBlcmluZ1xyXG4gICAgICAgICAgIElmIHRoZSBjdXJyZW50IGxlbmd0aCBpcyB3aXRoaW4gdGhlIHRhcGVyIGRpc3RhbmNlIGF0IGVpdGhlciB0aGVcclxuICAgICAgc3RhcnQgb3IgdGhlIGVuZCwgY2FsY3VsYXRlIHRoZSB0YXBlciBzdHJlbmd0aHMuIEFwcGx5IHRoZSBzbWFsbGVyXHJcbiAgICAgIG9mIHRoZSB0d28gdGFwZXIgc3RyZW5ndGhzIHRvIHRoZSByYWRpdXMuXHJcbiAgICAqL1xuXG5cbiAgICB2YXIgdHMgPSBydW5uaW5nTGVuZ3RoIDwgdGFwZXJTdGFydCA/IHRhcGVyU3RhcnRFYXNlKHJ1bm5pbmdMZW5ndGggLyB0YXBlclN0YXJ0KSA6IDE7XG4gICAgdmFyIHRlID0gdG90YWxMZW5ndGggLSBydW5uaW5nTGVuZ3RoIDwgdGFwZXJFbmQgPyB0YXBlckVuZEVhc2UoKHRvdGFsTGVuZ3RoIC0gcnVubmluZ0xlbmd0aCkgLyB0YXBlckVuZCkgOiAxO1xuICAgIHJhZGl1cyAqPSBNYXRoLm1pbih0cywgdGUpO1xuICAgIC8qXHJcbiAgICAgIEhhbmRsZSBzaGFycCBjb3JuZXJzXHJcbiAgICAgICAgICAgRmluZCB0aGUgZGlmZmVyZW5jZSAoZG90IHByb2R1Y3QpIGJldHdlZW4gdGhlIGN1cnJlbnQgYW5kIG5leHQgdmVjdG9yLlxyXG4gICAgICBJZiB0aGUgbmV4dCB2ZWN0b3IgaXMgYXQgbW9yZSB0aGFuIGEgcmlnaHQgYW5nbGUgdG8gdGhlIGN1cnJlbnQgdmVjdG9yLFxyXG4gICAgICBkcmF3IGEgY2FwIGF0IHRoZSBjdXJyZW50IHBvaW50LlxyXG4gICAgKi9cblxuICAgIHZhciBuZXh0VmVjdG9yID0gcG9pbnRzW2kgKyAxXS52ZWN0b3I7XG4gICAgdmFyIGRwciQxID0gZHByKHZlY3RvciwgbmV4dFZlY3Rvcik7XG5cbiAgICBpZiAoZHByJDEgPCAwKSB7XG4gICAgICB2YXIgX29mZnNldCA9IG11bChwZXIocHJldlZlY3RvciksIHJhZGl1cyk7XG5cbiAgICAgIHZhciBsYSA9IGFkZChwb2ludCwgX29mZnNldCk7XG4gICAgICB2YXIgcmEgPSBzdWIocG9pbnQsIF9vZmZzZXQpO1xuXG4gICAgICBmb3IgKHZhciB0ID0gMC4yOyB0IDwgMTsgdCArPSAwLjIpIHtcbiAgICAgICAgdHIgPSByb3RBcm91bmQobGEsIHBvaW50LCBQSSAqIC10KTtcbiAgICAgICAgdGwgPSByb3RBcm91bmQocmEsIHBvaW50LCBQSSAqIHQpO1xuICAgICAgICByaWdodFB0cy5wdXNoKHRyKTtcbiAgICAgICAgbGVmdFB0cy5wdXNoKHRsKTtcbiAgICAgIH1cblxuICAgICAgcGwgPSB0bDtcbiAgICAgIHByID0gdHI7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgLypcclxuICAgICAgQWRkIHJlZ3VsYXIgcG9pbnRzXHJcbiAgICAgICAgICAgUHJvamVjdCBwb2ludHMgdG8gZWl0aGVyIHNpZGUgb2YgdGhlIGN1cnJlbnQgcG9pbnQsIHVzaW5nIHRoZVxyXG4gICAgICBjYWxjdWxhdGVkIHNpemUgYXMgYSBkaXN0YW5jZS4gSWYgYSBwb2ludCdzIGRpc3RhbmNlIHRvIHRoZVxyXG4gICAgICBwcmV2aW91cyBwb2ludCBvbiB0aGF0IHNpZGUgZ3JlYXRlciB0aGFuIHRoZSBtaW5pbXVtIGRpc3RhbmNlXHJcbiAgICAgIChvciBpZiB0aGUgY29ybmVyIGlzIGtpbmRhIHNoYXJwKSwgYWRkIHRoZSBwb2ludHMgdG8gdGhlIHNpZGUnc1xyXG4gICAgICBwb2ludHMgYXJyYXkuXHJcbiAgICAqL1xuXG5cbiAgICB2YXIgb2Zmc2V0ID0gbXVsKHBlcihscnAobmV4dFZlY3RvciwgdmVjdG9yLCBkcHIkMSkpLCByYWRpdXMpO1xuICAgIHRsID0gc3ViKHBvaW50LCBvZmZzZXQpO1xuICAgIHRyID0gYWRkKHBvaW50LCBvZmZzZXQpO1xuICAgIHZhciBhbHdheXNBZGQgPSBpID09PSAxIHx8IGRwciQxIDwgMC4yNTtcbiAgICB2YXIgbWluRGlzdGFuY2UgPSAocnVubmluZ0xlbmd0aCA+IHNpemUgPyBzaXplIDogc2l6ZSAvIDIpICogc21vb3RoaW5nO1xuXG4gICAgaWYgKGFsd2F5c0FkZCB8fCBkaXN0KHBsLCB0bCkgPiBtaW5EaXN0YW5jZSkge1xuICAgICAgbGVmdFB0cy5wdXNoKGxycChwbCwgdGwsIHN0cmVhbWxpbmUpKTtcbiAgICAgIHBsID0gdGw7XG4gICAgfVxuXG4gICAgaWYgKGFsd2F5c0FkZCB8fCBkaXN0KHByLCB0cikgPiBtaW5EaXN0YW5jZSkge1xuICAgICAgcmlnaHRQdHMucHVzaChscnAocHIsIHRyLCBzdHJlYW1saW5lKSk7XG4gICAgICBwciA9IHRyO1xuICAgIH0gLy8gU2V0IHZhcmlhYmxlcyBmb3IgbmV4dCBpdGVyYXRpb25cblxuXG4gICAgcHJldlByZXNzdXJlID0gcHJlc3N1cmU7XG4gICAgcHJldlZlY3RvciA9IHZlY3RvcjtcbiAgfVxuICAvKlxyXG4gICAgRHJhd2luZyBjYXBzXHJcbiAgICBcbiAgICBOb3cgdGhhdCB3ZSBoYXZlIG91ciBwb2ludHMgb24gZWl0aGVyIHNpZGUgb2YgdGhlIGxpbmUsIHdlIG5lZWQgdG9cclxuICAgIGRyYXcgY2FwcyBhdCB0aGUgc3RhcnQgYW5kIGVuZC4gVGFwZXJlZCBsaW5lcyBkb24ndCBoYXZlIGNhcHMsIGJ1dFxyXG4gICAgbWF5IGhhdmUgZG90cyBmb3IgdmVyeSBzaG9ydCBsaW5lcy5cclxuICAqL1xuXG5cbiAgdmFyIGZpcnN0UG9pbnQgPSBwb2ludHNbMF07XG4gIHZhciBsYXN0UG9pbnQgPSBwb2ludHNbbGVuIC0gMV07XG4gIHZhciBpc1ZlcnlTaG9ydCA9IHJpZ2h0UHRzLmxlbmd0aCA8IDIgfHwgbGVmdFB0cy5sZW5ndGggPCAyO1xuICAvKlxyXG4gICAgRHJhdyBhIGRvdCBmb3IgdmVyeSBzaG9ydCBvciBjb21wbGV0ZWQgc3Ryb2tlc1xyXG4gICAgXG4gICAgSWYgdGhlIGxpbmUgaXMgdG9vIHNob3J0IHRvIGdhdGhlciBsZWZ0IG9yIHJpZ2h0IHBvaW50cyBhbmQgaWYgdGhlIGxpbmUgaXNcclxuICAgIG5vdCB0YXBlcmVkIG9uIGVpdGhlciBzaWRlLCBkcmF3IGEgZG90LiBJZiB0aGUgbGluZSBpcyB0YXBlcmVkLCB0aGVuIG9ubHlcclxuICAgIGRyYXcgYSBkb3QgaWYgdGhlIGxpbmUgaXMgYm90aCB2ZXJ5IHNob3J0IGFuZCBjb21wbGV0ZS4gSWYgd2UgZHJhdyBhIGRvdCxcclxuICAgIHdlIGNhbiBqdXN0IHJldHVybiB0aG9zZSBwb2ludHMuXHJcbiAgKi9cblxuICBpZiAoaXNWZXJ5U2hvcnQgJiYgKCEodGFwZXJTdGFydCB8fCB0YXBlckVuZCkgfHwgaXNDb21wbGV0ZSkpIHtcbiAgICB2YXIgaXIgPSAwO1xuXG4gICAgZm9yICh2YXIgX2kyID0gMDsgX2kyIDwgbGVuOyBfaTIrKykge1xuICAgICAgdmFyIF9wb2ludHMkX2kgPSBwb2ludHNbX2kyXSxcbiAgICAgICAgICBfcHJlc3N1cmUgPSBfcG9pbnRzJF9pLnByZXNzdXJlLFxuICAgICAgICAgIF9ydW5uaW5nTGVuZ3RoMiA9IF9wb2ludHMkX2kucnVubmluZ0xlbmd0aDtcblxuICAgICAgaWYgKF9ydW5uaW5nTGVuZ3RoMiA+IHNpemUpIHtcbiAgICAgICAgaXIgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgX3ByZXNzdXJlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIF9zdGFydCA9IHN1YihmaXJzdFBvaW50LnBvaW50LCBtdWwocGVyKHVuaSh2ZWMobGFzdFBvaW50LnBvaW50LCBmaXJzdFBvaW50LnBvaW50KSkpLCBpciB8fCByYWRpdXMpKTtcblxuICAgIHZhciBkb3RQdHMgPSBbXTtcblxuICAgIGZvciAodmFyIF90ID0gMCwgc3RlcCA9IDAuMTsgX3QgPD0gMTsgX3QgKz0gc3RlcCkge1xuICAgICAgZG90UHRzLnB1c2gocm90QXJvdW5kKF9zdGFydCwgZmlyc3RQb2ludC5wb2ludCwgUEkgKiAyICogX3QpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG90UHRzO1xuICB9XG4gIC8qXHJcbiAgICBEcmF3IGEgc3RhcnQgY2FwXHJcbiAgICAgICBVbmxlc3MgdGhlIGxpbmUgaGFzIGEgdGFwZXJlZCBzdGFydCwgb3IgdW5sZXNzIHRoZSBsaW5lIGhhcyBhIHRhcGVyZWQgZW5kXHJcbiAgICBhbmQgdGhlIGxpbmUgaXMgdmVyeSBzaG9ydCwgZHJhdyBhIHN0YXJ0IGNhcCBhcm91bmQgdGhlIGZpcnN0IHBvaW50LiBVc2VcclxuICAgIHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBzZWNvbmQgbGVmdCBhbmQgcmlnaHQgcG9pbnQgZm9yIHRoZSBjYXAncyByYWRpdXMuXHJcbiAgICBGaW5hbGx5IHJlbW92ZSB0aGUgZmlyc3QgbGVmdCBhbmQgcmlnaHQgcG9pbnRzLiA6cHN5ZHVjazpcclxuICAqL1xuXG5cbiAgdmFyIHN0YXJ0Q2FwID0gW107XG5cbiAgaWYgKCF0YXBlclN0YXJ0ICYmICEodGFwZXJFbmQgJiYgaXNWZXJ5U2hvcnQpKSB7XG4gICAgdHIgPSByaWdodFB0c1sxXTtcbiAgICB0bCA9IGxlZnRQdHNbMV07XG5cbiAgICB2YXIgX3N0YXJ0MiA9IHN1YihmaXJzdFBvaW50LnBvaW50LCBtdWwodW5pKHZlYyh0ciwgdGwpKSwgZGlzdCh0ciwgdGwpIC8gMikpO1xuXG4gICAgZm9yICh2YXIgX3QyID0gMCwgX3N0ZXAgPSAwLjI7IF90MiA8PSAxOyBfdDIgKz0gX3N0ZXApIHtcbiAgICAgIHN0YXJ0Q2FwLnB1c2gocm90QXJvdW5kKF9zdGFydDIsIGZpcnN0UG9pbnQucG9pbnQsIFBJICogX3QyKSk7XG4gICAgfVxuXG4gICAgbGVmdFB0cy5zaGlmdCgpO1xuICAgIHJpZ2h0UHRzLnNoaWZ0KCk7XG4gIH1cbiAgLypcclxuICAgIERyYXcgYW4gZW5kIGNhcFxyXG4gICAgICAgSWYgdGhlIGxpbmUgZG9lcyBub3QgaGF2ZSBhIHRhcGVyZWQgZW5kLCBhbmQgdW5sZXNzIHRoZSBsaW5lIGhhcyBhIHRhcGVyZWRcclxuICAgIHN0YXJ0IGFuZCB0aGUgbGluZSBpcyB2ZXJ5IHNob3J0LCBkcmF3IGEgY2FwIGFyb3VuZCB0aGUgbGFzdCBwb2ludC4gRmluYWxseSxcclxuICAgIHJlbW92ZSB0aGUgbGFzdCBsZWZ0IGFuZCByaWdodCBwb2ludHMuIE90aGVyd2lzZSwgYWRkIHRoZSBsYXN0IHBvaW50LiBOb3RlXHJcbiAgICB0aGF0IFRoaXMgY2FwIGlzIGEgZnVsbC10dXJuLWFuZC1hLWhhbGY6IHRoaXMgcHJldmVudHMgaW5jb3JyZWN0IGNhcHMgb25cclxuICAgIHNoYXJwIGVuZCB0dXJucy5cclxuICAqL1xuXG5cbiAgdmFyIGVuZENhcCA9IFtdO1xuXG4gIGlmICghdGFwZXJFbmQgJiYgISh0YXBlclN0YXJ0ICYmIGlzVmVyeVNob3J0KSkge1xuICAgIHZhciBfc3RhcnQzID0gc3ViKGxhc3RQb2ludC5wb2ludCwgbXVsKHBlcihsYXN0UG9pbnQudmVjdG9yKSwgcmFkaXVzKSk7XG5cbiAgICBmb3IgKHZhciBfdDMgPSAwLCBfc3RlcDIgPSAwLjE7IF90MyA8PSAxOyBfdDMgKz0gX3N0ZXAyKSB7XG4gICAgICBlbmRDYXAucHVzaChyb3RBcm91bmQoX3N0YXJ0MywgbGFzdFBvaW50LnBvaW50LCBQSSAqIDMgKiBfdDMpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZW5kQ2FwLnB1c2gobGFzdFBvaW50LnBvaW50KTtcbiAgfVxuICAvKlxyXG4gICAgUmV0dXJuIHRoZSBwb2ludHMgaW4gdGhlIGNvcnJlY3Qgd2luZGluZCBvcmRlcjogYmVnaW4gb24gdGhlIGxlZnQgc2lkZSwgdGhlblxyXG4gICAgY29udGludWUgYXJvdW5kIHRoZSBlbmQgY2FwLCB0aGVuIGNvbWUgYmFjayBhbG9uZyB0aGUgcmlnaHQgc2lkZSwgYW5kIGZpbmFsbHlcclxuICAgIGNvbXBsZXRlIHRoZSBzdGFydCBjYXAuXHJcbiAgKi9cblxuXG4gIHJldHVybiBsZWZ0UHRzLmNvbmNhdChlbmRDYXAsIHJpZ2h0UHRzLnJldmVyc2UoKSwgc3RhcnRDYXApO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZVxyXG4gKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIHN0cm9rZSBhcyBhbiBhcnJheSBvZiBvdXRsaW5lIHBvaW50cy5cclxuICogQHBhcmFtIHBvaW50cyBBbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeSwgcHJlc3N1cmVdYCBvciBge3gsIHksIHByZXNzdXJlfWApLiBQcmVzc3VyZSBpcyBvcHRpb25hbC5cclxuICogQHBhcmFtIG9wdGlvbnMgQW4gKG9wdGlvbmFsKSBvYmplY3Qgd2l0aCBvcHRpb25zLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaXplXHRUaGUgYmFzZSBzaXplIChkaWFtZXRlcikgb2YgdGhlIHN0cm9rZS5cclxuICogQHBhcmFtIG9wdGlvbnMudGhpbm5pbmcgVGhlIGVmZmVjdCBvZiBwcmVzc3VyZSBvbiB0aGUgc3Ryb2tlJ3Mgc2l6ZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc21vb3RoaW5nXHRIb3cgbXVjaCB0byBzb2Z0ZW4gdGhlIHN0cm9rZSdzIGVkZ2VzLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5lYXNpbmdcdEFuIGVhc2luZyBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIHBvaW50J3MgcHJlc3N1cmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpbXVsYXRlUHJlc3N1cmUgV2hldGhlciB0byBzaW11bGF0ZSBwcmVzc3VyZSBiYXNlZCBvbiB2ZWxvY2l0eS5cclxuICogQHBhcmFtIG9wdGlvbnMuc3RhcnQgVGFwZXJpbmcgYW5kIGVhc2luZyBmdW5jdGlvbiBmb3IgdGhlIHN0YXJ0IG9mIHRoZSBsaW5lLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5lbmQgVGFwZXJpbmcgYW5kIGVhc2luZyBmdW5jdGlvbiBmb3IgdGhlIGVuZCBvZiB0aGUgbGluZS5cclxuICogQHBhcmFtIG9wdGlvbnMubGFzdCBXaGV0aGVyIHRvIGhhbmRsZSB0aGUgcG9pbnRzIGFzIGEgY29tcGxldGVkIHN0cm9rZS5cclxuICovXG5cbmZ1bmN0aW9uIGdldFN0cm9rZShwb2ludHMsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKGdldFN0cm9rZVBvaW50cyhwb2ludHMsIG9wdGlvbnMpLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U3Ryb2tlO1xuZXhwb3J0IHsgZ2V0U3Ryb2tlT3V0bGluZVBvaW50cywgZ2V0U3Ryb2tlUG9pbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wZXJmZWN0LWZyZWVoYW5kLmVzbS5qcy5tYXBcbiIsImltcG9ydCB7IFVJQWN0aW9uVHlwZXMsIFdvcmtlckFjdGlvblR5cGVzLCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U3ZnUGF0aEZyb21TdHJva2UsIGFkZFZlY3RvcnMsIGludGVycG9sYXRlQ3ViaWNCZXppZXIsIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgZ2V0U3Ryb2tlIGZyb20gXCJwZXJmZWN0LWZyZWVoYW5kXCI7XG5pbXBvcnQgeyBjb21wcmVzc1RvVVRGMTYsIGRlY29tcHJlc3NGcm9tVVRGMTYgfSBmcm9tIFwibHotc3RyaW5nXCI7XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDb21tcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBwbHVnaW4gVUlcbmZ1bmN0aW9uIHBvc3RNZXNzYWdlKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pO1xufVxuLy8gU2F2ZSBzb21lIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHRvIGl0cyBwbHVnaW4gZGF0YS5cbmZ1bmN0aW9uIHNldE9yaWdpbmFsTm9kZShub2RlKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxOb2RlID0ge1xuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihub2RlKSxcbiAgICAgICAgdmVjdG9yTmV0d29yazogT2JqZWN0LmFzc2lnbih7fSwgbm9kZS52ZWN0b3JOZXR3b3JrKSxcbiAgICAgICAgdmVjdG9yUGF0aHM6IG5vZGUudmVjdG9yUGF0aHMsXG4gICAgfTtcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIGNvbXByZXNzVG9VVEYxNihKU09OLnN0cmluZ2lmeShvcmlnaW5hbE5vZGUpKSk7XG4gICAgcmV0dXJuIG9yaWdpbmFsTm9kZTtcbn1cbmZ1bmN0aW9uIGRlY29tcHJlc3NQbHVnaW5EYXRhKHBsdWdpbkRhdGEpIHtcbiAgICAvLyBEZWNvbXByZXNzIHRoZSBzYXZlZCBkYXRhIGFuZCBwYXJzZSBvdXQgdGhlIG9yaWdpbmFsIG5vZGUuXG4gICAgY29uc3QgZGVjb21wcmVzc2VkID0gZGVjb21wcmVzc0Zyb21VVEYxNihwbHVnaW5EYXRhKTtcbiAgICBpZiAoIWRlY29tcHJlc3NlZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkZvdW5kIHNhdmVkIGRhdGEgZm9yIG9yaWdpbmFsIG5vZGUgYnV0IGNvdWxkIG5vdCBkZWNvbXByZXNzIGl0OiBcIiArXG4gICAgICAgICAgICBkZWNvbXByZXNzZWQpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvbXByZXNzZWQpO1xufVxuLy8gR2V0IGFuIG9yaWdpbmFsIG5vZGUgZnJvbSBhIG5vZGUncyBwbHVnaW4gZGF0YS5cbmZ1bmN0aW9uIGdldE9yaWdpbmFsTm9kZShpZCkge1xuICAgIGxldCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgIGNvbnN0IHBsdWdpbkRhdGEgPSBub2RlLmdldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIpO1xuICAgIC8vIE5vdGhpbmcgb24gdGhlIG5vZGUg4oCUIHdlIGhhdmVuJ3QgbW9kaWZpZWQgaXQuXG4gICAgaWYgKCFwbHVnaW5EYXRhKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBkZWNvbXByZXNzUGx1Z2luRGF0YShwbHVnaW5EYXRhKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTm9kZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vLyBHZXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBWZWN0b3Igbm9kZXMgZm9yIHRoZSBVSS5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkTm9kZXModXBkYXRlQ2VudGVyID0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09IFwiVkVDVE9SXCIpLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBwbHVnaW5EYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiKTtcbiAgICAgICAgaWYgKHBsdWdpbkRhdGEgJiYgdXBkYXRlQ2VudGVyKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBnZXRDZW50ZXIobm9kZSk7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBkZWNvbXByZXNzUGx1Z2luRGF0YShwbHVnaW5EYXRhKTtcbiAgICAgICAgICAgIGlmICghKGNlbnRlci54ID09PSBvcmlnaW5hbE5vZGUuY2VudGVyLnggJiZcbiAgICAgICAgICAgICAgICBjZW50ZXIueSA9PT0gb3JpZ2luYWxOb2RlLmNlbnRlci55KSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsTm9kZS5jZW50ZXIgPSBjZW50ZXI7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiLCBjb21wcmVzc1RvVVRGMTYoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxOb2RlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgICAgIGNhblJlc2V0OiAhIXBsdWdpbkRhdGEsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyBHZXR0aGUgY3VycmVudGx5IHNlbGVjdGVkIFZlY3RvciBub2RlcyBhcyBhbiBhcnJheSBvZiBJZHMuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZE5vZGVJZHMoKSB7XG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBcIlZFQ1RPUlwiKS5tYXAoKHsgaWQgfSkgPT4gaWQpO1xufVxuLy8gRmluZCB0aGUgY2VudGVyIG9mIGEgbm9kZS5cbmZ1bmN0aW9uIGdldENlbnRlcihub2RlKSB7XG4gICAgbGV0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gbm9kZTtcbiAgICByZXR1cm4geyB4OiB4ICsgd2lkdGggLyAyLCB5OiB5ICsgaGVpZ2h0IC8gMiB9O1xufVxuLy8gTW92ZSBhIG5vZGUgdG8gYSBjZW50ZXIuXG5mdW5jdGlvbiBtb3ZlTm9kZVRvQ2VudGVyKG5vZGUsIGNlbnRlcikge1xuICAgIGNvbnN0IHsgeDogeDAsIHk6IHkwIH0gPSBnZXRDZW50ZXIobm9kZSk7XG4gICAgY29uc3QgeyB4OiB4MSwgeTogeTEgfSA9IGNlbnRlcjtcbiAgICBub2RlLnggPSBub2RlLnggKyB4MSAtIHgwO1xuICAgIG5vZGUueSA9IG5vZGUueSArIHkxIC0geTA7XG59XG4vLyBab29tIHRoZSBGaWdtYSB2aWV3cG9ydCB0byBhIG5vZGUuXG5mdW5jdGlvbiB6b29tVG9Ob2RlKGlkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSBTZWxlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gRGVzZWxlY3QgYSBGaWdtYSBub2RlLlxuZnVuY3Rpb24gZGVzZWxlY3ROb2RlKGlkKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+IG5vZGUuaWQgIT09IGlkKTtcbn1cbi8vIFNlbmQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHRvIHRoZSBVSSBzdGF0ZS5cbmZ1bmN0aW9uIHNlbmRTZWxlY3RlZE5vZGVzKHVwZGF0ZUNlbnRlciA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2Rlcyh1cGRhdGVDZW50ZXIpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLSBDaGFuZ2luZyBWZWN0b3JOb2RlcyAtLS0tLS0tLS0tLS0tLSAqL1xuLy8gTnVtYmVyIG9mIG5ldyBub2RlcyB0byBpbnNlcnRcbmNvbnN0IFNQTElUID0gNTtcbi8vIFNvbWUgYmFzaWMgZWFzaW5nIGZ1bmN0aW9uc1xuY29uc3QgRUFTSU5HUyA9IHtcbiAgICBsaW5lYXI6ICh0KSA9PiB0LFxuICAgIGVhc2VJbjogKHQpID0+IHQgKiB0LFxuICAgIGVhc2VPdXQ6ICh0KSA9PiB0ICogKDIgLSB0KSxcbiAgICBlYXNlSW5PdXQ6ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IC0xICsgKDQgLSAyICogdCkgKiB0KSxcbn07XG4vLyBDb21wdXRlIGEgc3Ryb2tlIGJhc2VkIG9uIHRoZSB2ZWN0b3IgYW5kIGFwcGx5IGl0IHRvIHRoZSB2ZWN0b3IncyBwYXRoIGRhdGEuXG5mdW5jdGlvbiBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMobm9kZUlkcywgeyBvcHRpb25zLCBlYXNpbmcgPSBcImxpbmVhclwiLCBjbGlwLCB9LCByZXN0cmljdFRvS25vd25Ob2RlcyA9IGZhbHNlKSB7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICAvLyBHZXQgdGhlIG5vZGUgdGhhdCB3ZSB3YW50IHRvIGNoYW5nZVxuICAgICAgICBjb25zdCBub2RlVG9DaGFuZ2UgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghbm9kZVRvQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBub2RlXG4gICAgICAgIGxldCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUobm9kZVRvQ2hhbmdlLmlkKTtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB0aGlzIG5vZGUuLi5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEJhaWwgaWYgd2UncmUgdXBkYXRpbmcgbm9kZXNcbiAgICAgICAgICAgIGlmIChyZXN0cmljdFRvS25vd25Ob2RlcylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBvcmlnaW5hbCBub2RlIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgb3JpZ2luYWxOb2RlID0gc2V0T3JpZ2luYWxOb2RlKG5vZGVUb0NoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW50ZXJwb2xhdGUgbmV3IHBvaW50cyBhbG9uZyB0aGUgdmVjdG9yJ3MgY3VydmVcbiAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2Ygb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsuc2VnbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHAwID0gb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsudmVydGljZXNbc2VnbWVudC5zdGFydF07XG4gICAgICAgICAgICBjb25zdCBwMyA9IG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuZW5kXTtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gYWRkVmVjdG9ycyhwMCwgc2VnbWVudC50YW5nZW50U3RhcnQpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBhZGRWZWN0b3JzKHAzLCBzZWdtZW50LnRhbmdlbnRFbmQpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdG9yID0gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgcDEsIHAyLCBwMyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNQTElUOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwdHMucHVzaChpbnRlcnBvbGF0b3IoaSAvIFNQTElUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHN0cm9rZSB1c2luZyBwZXJmZWN0LWZyZWVoYW5kXG4gICAgICAgIGNvbnN0IHN0cm9rZSA9IGdldFN0cm9rZShwdHMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgZWFzaW5nOiBFQVNJTkdTW2Vhc2luZ10sIGxhc3Q6IHRydWUgfSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gU2V0IHN0cm9rZSB0byB2ZWN0b3IgcGF0aHNcbiAgICAgICAgICAgIG5vZGVUb0NoYW5nZS52ZWN0b3JQYXRocyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiBcIk5PTlpFUk9cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBhcHBseSBzdHJva2VcIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgc28gdGhhdCBpdHMgY2VudGVyIGRvZXMgbm90IGNoYW5nZVxuICAgICAgICBtb3ZlTm9kZVRvQ2VudGVyKG5vZGVUb0NoYW5nZSwgb3JpZ2luYWxOb2RlLmNlbnRlcik7XG4gICAgfVxuICAgIHNlbmRTZWxlY3RlZE5vZGVzKGZhbHNlKTtcbn1cbi8vIFJlc2V0IHRoZSBub2RlIHRvIGl0cyBvcmlnaW5hbCBwYXRoIGRhdGEsIHVzaW5nIGRhdGEgZnJvbSBvdXIgY2FjaGUgYW5kIHRoZW4gZGVsZXRlIHRoZSBub2RlLlxuZnVuY3Rpb24gcmVzZXRWZWN0b3JOb2RlcygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBnZXRTZWxlY3RlZE5vZGVJZHMoKSkge1xuICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUoaWQpO1xuICAgICAgICAvLyBXZSBoYXZlbid0IG1vZGlmaWVkIHRoaXMgbm9kZS5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUudmVjdG9yUGF0aHMgPSBvcmlnaW5hbE5vZGUudmVjdG9yUGF0aHM7XG4gICAgICAgIGN1cnJlbnROb2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIFwiXCIpO1xuICAgICAgICBzZW5kU2VsZWN0ZWROb2RlcyhmYWxzZSk7XG4gICAgfVxufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEtpY2tvZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIExpc3RlbiB0byBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBwbHVnaW4gVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICh7IHR5cGUsIHBheWxvYWQgfSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuQ0xPU0U6XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5aT09NX1RPX05PREU6XG4gICAgICAgICAgICB6b29tVG9Ob2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5ERVNFTEVDVF9OT0RFOlxuICAgICAgICAgICAgZGVzZWxlY3ROb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5SRVNFVF9OT0RFUzpcbiAgICAgICAgICAgIHJlc2V0VmVjdG9yTm9kZXMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVFJBTlNGT1JNX05PREVTOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlVQREFURURfT1BUSU9OUzpcbiAgICAgICAgICAgIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2RlcyhnZXRTZWxlY3RlZE5vZGVJZHMoKSwgcGF5bG9hZCwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuLy8gTGlzdGVuIGZvciBzZWxlY3Rpb24gY2hhbmdlc1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgc2VuZFNlbGVjdGVkTm9kZXMpO1xuLy8gU2hvdyB0aGUgcGx1Z2luIGludGVyZmFjZVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogNDgwIH0pO1xuLy8gU2VuZCB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gdGhlIFVJXG5zZW5kU2VsZWN0ZWROb2RlcygpO1xuIiwiLy8gVUkgYWN0aW9uc1xuZXhwb3J0IHZhciBVSUFjdGlvblR5cGVzO1xuKGZ1bmN0aW9uIChVSUFjdGlvblR5cGVzKSB7XG4gICAgVUlBY3Rpb25UeXBlc1tcIkNMT1NFXCJdID0gXCJDTE9TRVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJaT09NX1RPX05PREVcIl0gPSBcIlpPT01fVE9fTk9ERVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJERVNFTEVDVF9OT0RFXCJdID0gXCJERVNFTEVDVF9OT0RFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlRSQU5TRk9STV9OT0RFU1wiXSA9IFwiVFJBTlNGT1JNX05PREVTXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlJFU0VUX05PREVTXCJdID0gXCJSRVNFVF9OT0RFU1wiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJVUERBVEVEX09QVElPTlNcIl0gPSBcIlVQREFURURfT1BUSU9OU1wiO1xufSkoVUlBY3Rpb25UeXBlcyB8fCAoVUlBY3Rpb25UeXBlcyA9IHt9KSk7XG4vLyBXb3JrZXIgYWN0aW9uc1xuZXhwb3J0IHZhciBXb3JrZXJBY3Rpb25UeXBlcztcbihmdW5jdGlvbiAoV29ya2VyQWN0aW9uVHlwZXMpIHtcbiAgICBXb3JrZXJBY3Rpb25UeXBlc1tcIlNFTEVDVEVEX05PREVTXCJdID0gXCJTRUxFQ1RFRF9OT0RFU1wiO1xuICAgIFdvcmtlckFjdGlvblR5cGVzW1wiRk9VTkRfU0VMRUNURURfTk9ERVNcIl0gPSBcIkZPVU5EX1NFTEVDVEVEX05PREVTXCI7XG59KShXb3JrZXJBY3Rpb25UeXBlcyB8fCAoV29ya2VyQWN0aW9uVHlwZXMgPSB7fSkpO1xuIiwiLy8gaW1wb3J0IHBvbHlnb25DbGlwcGluZyBmcm9tIFwicG9seWdvbi1jbGlwcGluZ1wiXG5jb25zdCB7IHBvdyB9ID0gTWF0aDtcbmV4cG9ydCBmdW5jdGlvbiBjdWJpY0Jlemllcih0eCwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAvLyBJbnNwaXJlZCBieSBEb24gTGFuY2FzdGVyJ3MgdHdvIGFydGljbGVzXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL2dsaWIvY3ViZW1hdGgucGRmXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL3RleHQvYmV6bWF0aC5odG1sXG4gICAgLy8gU2V0IHAwIGFuZCBwMSBwb2ludFxuICAgIGxldCB4MCA9IDAsIHkwID0gMCwgeDMgPSAxLCB5MyA9IDEsIFxuICAgIC8vIENvbnZlcnQgdGhlIGNvb3JkaW5hdGVzIHRvIGVxdWF0aW9uIHNwYWNlXG4gICAgQSA9IHgzIC0gMyAqIHgyICsgMyAqIHgxIC0geDAsIEIgPSAzICogeDIgLSA2ICogeDEgKyAzICogeDAsIEMgPSAzICogeDEgLSAzICogeDAsIEQgPSB4MCwgRSA9IHkzIC0gMyAqIHkyICsgMyAqIHkxIC0geTAsIEYgPSAzICogeTIgLSA2ICogeTEgKyAzICogeTAsIEcgPSAzICogeTEgLSAzICogeTAsIEggPSB5MCwgXG4gICAgLy8gVmFyaWFibGVzIGZvciB0aGUgbG9vcCBiZWxvd1xuICAgIHQgPSB0eCwgaXRlcmF0aW9ucyA9IDUsIGksIHNsb3BlLCB4LCB5O1xuICAgIC8vIExvb3AgdGhyb3VnaCBhIGZldyB0aW1lcyB0byBnZXQgYSBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWUsIGFjY29yZGluZyB0byB0aGUgTmV3dG9uLVJhcGhzb24gbWV0aG9kXG4gICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OZXd0b24nc19tZXRob2RcbiAgICBmb3IgKGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgIC8vIFRoZSBjdXJ2ZSdzIHggZXF1YXRpb24gZm9yIHRoZSBjdXJyZW50IHRpbWUgdmFsdWVcbiAgICAgICAgeCA9IEEgKiB0ICogdCAqIHQgKyBCICogdCAqIHQgKyBDICogdCArIEQ7XG4gICAgICAgIC8vIFRoZSBzbG9wZSB3ZSB3YW50IGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBkZXJpdmF0ZSBvZiB4XG4gICAgICAgIHNsb3BlID0gMSAvICgzICogQSAqIHQgKiB0ICsgMiAqIEIgKiB0ICsgQyk7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBlc3RpbWF0ZWQgdGltZSB2YWx1ZSwgd2hpY2ggd2lsbCBiZSBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIG9uZSBiZWZvcmVcbiAgICAgICAgdCAtPSAoeCAtIHR4KSAqIHNsb3BlO1xuICAgICAgICB0ID0gdCA+IDEgPyAxIDogdCA8IDAgPyAwIDogdDtcbiAgICB9XG4gICAgLy8gRmluZCB0aGUgeSB2YWx1ZSB0aHJvdWdoIHRoZSBjdXJ2ZSdzIHkgZXF1YXRpb24sIHdpdGggdGhlIG5vdyBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWVcbiAgICB5ID0gTWF0aC5hYnMoRSAqIHQgKiB0ICogdCArIEYgKiB0ICogdCArIEcgKiB0ICogSCk7XG4gICAgcmV0dXJuIHk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9pbnRzQWxvbmdDdWJpY0JlemllcihwdENvdW50LCBweFRvbGVyYW5jZSwgQXgsIEF5LCBCeCwgQnksIEN4LCBDeSwgRHgsIER5KSB7XG4gICAgbGV0IGRlbHRhQkF4ID0gQnggLSBBeDtcbiAgICBsZXQgZGVsdGFDQnggPSBDeCAtIEJ4O1xuICAgIGxldCBkZWx0YURDeCA9IER4IC0gQ3g7XG4gICAgbGV0IGRlbHRhQkF5ID0gQnkgLSBBeTtcbiAgICBsZXQgZGVsdGFDQnkgPSBDeSAtIEJ5O1xuICAgIGxldCBkZWx0YURDeSA9IER5IC0gQ3k7XG4gICAgbGV0IGF4LCBheSwgYngsIGJ5LCBjeCwgY3k7XG4gICAgbGV0IGxhc3RYID0gLTEwMDAwO1xuICAgIGxldCBsYXN0WSA9IC0xMDAwMDtcbiAgICBsZXQgcHRzID0gW3sgeDogQXgsIHk6IEF5IH1dO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHRDb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCB0ID0gaSAvIHB0Q291bnQ7XG4gICAgICAgIGF4ID0gQXggKyBkZWx0YUJBeCAqIHQ7XG4gICAgICAgIGJ4ID0gQnggKyBkZWx0YUNCeCAqIHQ7XG4gICAgICAgIGN4ID0gQ3ggKyBkZWx0YURDeCAqIHQ7XG4gICAgICAgIGF4ICs9IChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGJ4ICs9IChjeCAtIGJ4KSAqIHQ7XG4gICAgICAgIGF5ID0gQXkgKyBkZWx0YUJBeSAqIHQ7XG4gICAgICAgIGJ5ID0gQnkgKyBkZWx0YUNCeSAqIHQ7XG4gICAgICAgIGN5ID0gQ3kgKyBkZWx0YURDeSAqIHQ7XG4gICAgICAgIGF5ICs9IChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGJ5ICs9IChjeSAtIGJ5KSAqIHQ7XG4gICAgICAgIGNvbnN0IHggPSBheCArIChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGNvbnN0IHkgPSBheSArIChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGNvbnN0IGR4ID0geCAtIGxhc3RYO1xuICAgICAgICBjb25zdCBkeSA9IHkgLSBsYXN0WTtcbiAgICAgICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gcHhUb2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHB0cy5wdXNoKHsgeDogeCwgeTogeSB9KTtcbiAgICAgICAgICAgIGxhc3RYID0geDtcbiAgICAgICAgICAgIGxhc3RZID0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdHMucHVzaCh7IHg6IER4LCB5OiBEeSB9KTtcbiAgICByZXR1cm4gcHRzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViaWNCZXppZXIocDAsIGMwLCBjMSwgcDEpIHtcbiAgICAvLyAwIDw9IHQgPD0gMVxuICAgIHJldHVybiBmdW5jdGlvbiBpbnRlcnBvbGF0b3IodCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnggK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnggK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueCArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueCxcbiAgICAgICAgICAgIHBvdygxIC0gdCwgMykgKiBwMC55ICtcbiAgICAgICAgICAgICAgICAzICogcG93KDEgLSB0LCAyKSAqIHQgKiBjMC55ICtcbiAgICAgICAgICAgICAgICAzICogKDEgLSB0KSAqIHBvdyh0LCAyKSAqIGMxLnkgK1xuICAgICAgICAgICAgICAgIHBvdyh0LCAzKSAqIHAxLnksXG4gICAgICAgIF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRWZWN0b3JzKGEsIGIpIHtcbiAgICBpZiAoIWIpXG4gICAgICAgIHJldHVybiBhO1xuICAgIHJldHVybiB7IHg6IGEueCArIGIueCwgeTogYS55ICsgYi55IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSB7XG4gICAgaWYgKHN0cm9rZS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIGNvbnN0IGQgPSBbXTtcbiAgICBsZXQgW3AwLCBwMV0gPSBzdHJva2U7XG4gICAgZC5wdXNoKFwiTVwiLCBwMFswXSwgcDBbMV0pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3Ryb2tlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGQucHVzaChcIlFcIiwgcDBbMF0sIHAwWzFdLCAocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyKTtcbiAgICAgICAgcDAgPSBwMTtcbiAgICAgICAgcDEgPSBzdHJva2VbaV07XG4gICAgfVxuICAgIGQucHVzaChcIlpcIik7XG4gICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG59XG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZTogbnVtYmVyW11bXSkge1xuLy8gICB0cnkge1xuLy8gICAgIGNvbnN0IHBvbHkgPSBwb2x5Z29uQ2xpcHBpbmcudW5pb24oW3N0cm9rZV0gYXMgYW55KVxuLy8gICAgIGNvbnN0IGQgPSBbXVxuLy8gICAgIGZvciAobGV0IGZhY2Ugb2YgcG9seSkge1xuLy8gICAgICAgZm9yIChsZXQgcG9pbnRzIG9mIGZhY2UpIHtcbi8vICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdKVxuLy8gICAgICAgICBkLnB1c2goZ2V0U3ZnUGF0aEZyb21TdHJva2UocG9pbnRzKSlcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgZC5wdXNoKFwiWlwiKVxuLy8gICAgIHJldHVybiBkLmpvaW4oXCIgXCIpXG4vLyAgIH0gY2F0Y2ggKGUpIHtcbi8vICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGNsaXAgcGF0aC5cIilcbi8vICAgICByZXR1cm4gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKVxuLy8gICB9XG4vLyB9XG4iXSwic291cmNlUm9vdCI6IiJ9