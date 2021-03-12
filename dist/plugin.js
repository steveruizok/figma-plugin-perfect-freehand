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
var hypot = Math.hypot,
    cos = Math.cos,
    max = Math.max,
    min = Math.min,
    sin = Math.sin,
    atan2 = Math.atan2,
    PI = Math.PI,
    PI2 = PI * 2;
function lerp(y1, y2, mu) {
  return y1 * (1 - mu) + y2 * mu;
}
function projectPoint(p0, a, d) {
  return [cos(a) * d + p0[0], sin(a) * d + p0[1]];
}

function shortAngleDist(a0, a1) {
  var max = PI2;
  var da = (a1 - a0) % max;
  return 2 * da % max - da;
}

function getAngleDelta(a0, a1) {
  return shortAngleDist(a0, a1);
}
function lerpAngles(a0, a1, t) {
  return a0 + shortAngleDist(a0, a1) * t;
}
function getPointBetween(p0, p1, d) {
  if (d === void 0) {
    d = 0.5;
  }

  return [p0[0] + (p1[0] - p0[0]) * d, p0[1] + (p1[1] - p0[1]) * d];
}
function getAngle(p0, p1) {
  return atan2(p1[1] - p0[1], p1[0] - p0[0]);
}
function getDistance(p0, p1) {
  return hypot(p1[1] - p0[1], p1[0] - p0[0]);
}
function clamp(n, a, b) {
  return max(a, min(b, n));
}
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

var abs = Math.abs,
    min$1 = Math.min,
    PI$1 = Math.PI,
    TAU = PI$1 / 2,
    SHARP = TAU,
    DULL = SHARP / 2;

function getStrokeRadius(size, thinning, easing, pressure) {
  if (pressure === void 0) {
    pressure = 0.5;
  }

  if (thinning === undefined) return size / 2;
  pressure = clamp(easing(pressure), 0, 1);
  return (thinning < 0 ? lerp(size, size + size * clamp(thinning, -0.95, -0.05), pressure) : lerp(size - size * clamp(thinning, 0.05, 0.95), size, pressure)) / 2;
}
/**
 * ## getStrokePoints
 * @description Get points for a stroke.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param streamline How much to streamline the stroke.
 */


function getStrokePoints(points, streamline) {
  if (streamline === void 0) {
    streamline = 0.5;
  }

  var pts = toPointsArray(points);
  if (pts.length === 0) return [];
  pts[0] = [pts[0][0], pts[0][1], pts[0][2] || 0.5, 0, 0, 0];

  for (var i = 1, curr = pts[i], prev = pts[0]; i < pts.length; i++, curr = pts[i], prev = pts[i - 1]) {
    curr[0] = lerp(prev[0], curr[0], 1 - streamline);
    curr[1] = lerp(prev[1], curr[1], 1 - streamline);
    curr[3] = getAngle(curr, prev);
    curr[4] = getDistance(curr, prev);
    curr[5] = prev[5] + curr[4];
  }

  return pts;
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
 */

function getStrokeOutlinePoints(points, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$size = _options.size,
      size = _options$size === void 0 ? 8 : _options$size,
      _options$thinning = _options.thinning,
      thinning = _options$thinning === void 0 ? 0.5 : _options$thinning,
      _options$smoothing = _options.smoothing,
      smoothing = _options$smoothing === void 0 ? 0.5 : _options$smoothing,
      _options$simulatePres = _options.simulatePressure,
      simulatePressure = _options$simulatePres === void 0 ? true : _options$simulatePres,
      _options$easing = _options.easing,
      easing = _options$easing === void 0 ? function (t) {
    return t;
  } : _options$easing;
  var len = points.length,
      totalLength = points[len - 1][5],
      // The total length of the line
  minDist = size * smoothing,
      // The minimum distance for measurements
  leftPts = [],
      // Our collected left and right points
  rightPts = [];
  var pl = points[0],
      // Previous left and right points
  pr = points[0],
      tl = pl,
      // Points to test distance from
  tr = pr,
      pa = pr[3],
      pp = 0,
      // Previous (maybe simulated) pressure
  r = size / 2,
      // The current point radius
  _short = true; // Whether the line is drawn far enough
  // We can't do anything with an empty array.

  if (len === 0) {
    return [];
  } // If the point is only one point long, draw two caps at either end.


  if (len === 1 || totalLength <= 4) {
    var first = points[0],
        last = points[len - 1],
        angle = getAngle(first, last);

    if (thinning) {
      r = getStrokeRadius(size, thinning, easing, last[2]);
    }

    for (var t = 0, step = 0.1; t <= 1; t += step) {
      tl = projectPoint(first, angle + PI$1 + TAU - t * PI$1, r);
      tr = projectPoint(last, angle + TAU - t * PI$1, r);
      leftPts.push(tl);
      rightPts.push(tr);
    }

    return leftPts.concat(rightPts);
  } // For a point with more than one point, create an outline shape.


  for (var i = 1; i < len; i++) {
    var prev = points[i - 1];
    var _points$i = points[i],
        x = _points$i[0],
        y = _points$i[1],
        pressure = _points$i[2],
        _angle = _points$i[3],
        distance = _points$i[4],
        clen = _points$i[5]; // 1.
    // Calculate the size of the current point.

    if (thinning) {
      if (simulatePressure) {
        // Simulate pressure by accellerating the reported pressure.
        var rp = min$1(1 - distance / size, 1);
        var sp = min$1(distance / size, 1);
        pressure = min$1(1, pp + (rp - pp) * (sp / 2));
      } // Compute the stroke radius based on the pressure, easing and thinning.


      r = getStrokeRadius(size, thinning, easing, pressure);
    } // 2.
    // Draw a cap once we've reached the minimum length.


    if (_short) {
      if (clen < size / 4) continue; // The first point after we've reached the minimum length.
      // Draw a cap at the first point angled toward the current point.

      _short = false;

      for (var _t = 0, _step = 0.1; _t <= 1; _t += _step) {
        tl = projectPoint(points[0], _angle + TAU - _t * PI$1, r);
        leftPts.push(tl);
      }

      tr = projectPoint(points[0], _angle + TAU, r);
      rightPts.push(tr);
    }

    _angle = lerpAngles(pa, _angle, 0.75); // 3.
    // Add points for the current point.

    if (i === len - 1) {
      // The last point in the line.
      // Add points for an end cap.
      for (var _t2 = 0, _step2 = 0.1; _t2 <= 1; _t2 += _step2) {
        rightPts.push(projectPoint([x, y], _angle + TAU + _t2 * PI$1, r));
      }
    } else {
      // Find the delta between the current and previous angle.
      var delta = getAngleDelta(prev[3], _angle),
          absDelta = abs(delta);

      if (absDelta > SHARP && clen > r) {
        // A sharp corner.
        // Project points (left and right) for a cap.
        var mid = getPointBetween(prev, [x, y]);

        for (var _t3 = 0, _step3 = 0.25; _t3 <= 1; _t3 += _step3) {
          tl = projectPoint(mid, pa - TAU + _t3 * -PI$1, r);
          tr = projectPoint(mid, pa + TAU + _t3 * PI$1, r);
          leftPts.push(tl);
          rightPts.push(tr);
        }
      } else {
        // A regular point.
        // Add projected points left and right, if far enough away.
        pl = projectPoint([x, y], _angle - TAU, r);
        pr = projectPoint([x, y], _angle + TAU, r);

        if (absDelta > DULL || getDistance(pl, tl) > minDist) {
          leftPts.push(getPointBetween(tl, pl));
          tl = pl;
        }

        if (absDelta > DULL || getDistance(pr, tr) > minDist) {
          rightPts.push(getPointBetween(tr, pr));
          tr = pr;
        }
      }

      pp = pressure;
      pa = _angle;
    }
  }

  return leftPts.concat(rightPts.reverse());
}
/**
 * ## getStroke
 * @description Returns a stroke as an array of points.
 * @param points An array of points (as `[x, y, pressure]` or `{x, y, pressure}`). Pressure is optional.
 * @param options An (optional) object with options.
 * @param options.size	The base size (diameter) of the stroke.
 * @param options.thinning The effect of pressure on the stroke's size.
 * @param options.smoothing	How much to soften the stroke's edges.
 * @param options.streamline How much to streamline the stroke.
 * @param options.simulatePressure Whether to simulate pressure based on velocity.
 */

function getStroke(points, options) {
  if (options === void 0) {
    options = {};
  }

  return getStrokeOutlinePoints(getStrokePoints(points, options.streamline), options);
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
figma.showUI(__html__, { width: 320, height: 420 });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL3NyYy9tYWluL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy90eXBlcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9CQUFvQjtB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QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsMkVBQTJFLHFDQUFxQyxFQUFFO0FBQ2xILEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCOztBQUVoQixlQUFlLE9BQU87QUFDdEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNB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QUFnQixlQUFlO0FBQy9CLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGFBQWE7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGVBQWU7QUFDN0I7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi9pbmRleC50c1wiKTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMyBQaWVyb3h5IDxwaWVyb3h5QHBpZXJveHkubmV0PlxuLy8gVGhpcyB3b3JrIGlzIGZyZWUuIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbi8vIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgV1RGUEwsIFZlcnNpb24gMlxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIExJQ0VOU0UudHh0IG9yIGh0dHA6Ly93d3cud3RmcGwubmV0L1xuLy9cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCB0aGUgaG9tZSBwYWdlOlxuLy8gaHR0cDovL3BpZXJveHkubmV0L2Jsb2cvcGFnZXMvbHotc3RyaW5nL3Rlc3RpbmcuaHRtbFxuLy9cbi8vIExaLWJhc2VkIGNvbXByZXNzaW9uIGFsZ29yaXRobSwgdmVyc2lvbiAxLjQuNFxudmFyIExaU3RyaW5nID0gKGZ1bmN0aW9uKCkge1xuXG4vLyBwcml2YXRlIHByb3BlcnR5XG52YXIgZiA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG52YXIga2V5U3RyQmFzZTY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xudmFyIGtleVN0clVyaVNhZmUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky0kXCI7XG52YXIgYmFzZVJldmVyc2VEaWMgPSB7fTtcblxuZnVuY3Rpb24gZ2V0QmFzZVZhbHVlKGFscGhhYmV0LCBjaGFyYWN0ZXIpIHtcbiAgaWYgKCFiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0pIHtcbiAgICBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0gPSB7fTtcbiAgICBmb3IgKHZhciBpPTAgOyBpPGFscGhhYmV0Lmxlbmd0aCA7IGkrKykge1xuICAgICAgYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2FscGhhYmV0LmNoYXJBdChpKV0gPSBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2NoYXJhY3Rlcl07XG59XG5cbnZhciBMWlN0cmluZyA9IHtcbiAgY29tcHJlc3NUb0Jhc2U2NCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICB2YXIgcmVzID0gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCA2LCBmdW5jdGlvbihhKXtyZXR1cm4ga2V5U3RyQmFzZTY0LmNoYXJBdChhKTt9KTtcbiAgICBzd2l0Y2ggKHJlcy5sZW5ndGggJSA0KSB7IC8vIFRvIHByb2R1Y2UgdmFsaWQgQmFzZTY0XG4gICAgZGVmYXVsdDogLy8gV2hlbiBjb3VsZCB0aGlzIGhhcHBlbiA/XG4gICAgY2FzZSAwIDogcmV0dXJuIHJlcztcbiAgICBjYXNlIDEgOiByZXR1cm4gcmVzK1wiPT09XCI7XG4gICAgY2FzZSAyIDogcmV0dXJuIHJlcytcIj09XCI7XG4gICAgY2FzZSAzIDogcmV0dXJuIHJlcytcIj1cIjtcbiAgICB9XG4gIH0sXG5cbiAgZGVjb21wcmVzc0Zyb21CYXNlNjQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGlucHV0ID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhpbnB1dC5sZW5ndGgsIDMyLCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gZ2V0QmFzZVZhbHVlKGtleVN0ckJhc2U2NCwgaW5wdXQuY2hhckF0KGluZGV4KSk7IH0pO1xuICB9LFxuXG4gIGNvbXByZXNzVG9VVEYxNiA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCAxNSwgZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSszMik7fSkgKyBcIiBcIjtcbiAgfSxcblxuICBkZWNvbXByZXNzRnJvbVVURjE2OiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMTYzODQsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpIC0gMzI7IH0pO1xuICB9LFxuXG4gIC8vY29tcHJlc3MgaW50byB1aW50OGFycmF5IChVQ1MtMiBiaWcgZW5kaWFuIGZvcm1hdClcbiAgY29tcHJlc3NUb1VpbnQ4QXJyYXk6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICB2YXIgY29tcHJlc3NlZCA9IExaU3RyaW5nLmNvbXByZXNzKHVuY29tcHJlc3NlZCk7XG4gICAgdmFyIGJ1Zj1uZXcgVWludDhBcnJheShjb21wcmVzc2VkLmxlbmd0aCoyKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyXG5cbiAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWNvbXByZXNzZWQubGVuZ3RoOyBpPFRvdGFsTGVuOyBpKyspIHtcbiAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGkpO1xuICAgICAgYnVmW2kqMl0gPSBjdXJyZW50X3ZhbHVlID4+PiA4O1xuICAgICAgYnVmW2kqMisxXSA9IGN1cnJlbnRfdmFsdWUgJSAyNTY7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG4gIH0sXG5cbiAgLy9kZWNvbXByZXNzIGZyb20gdWludDhhcnJheSAoVUNTLTIgYmlnIGVuZGlhbiBmb3JtYXQpXG4gIGRlY29tcHJlc3NGcm9tVWludDhBcnJheTpmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkPT09bnVsbCB8fCBjb21wcmVzc2VkPT09dW5kZWZpbmVkKXtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MoY29tcHJlc3NlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGJ1Zj1uZXcgQXJyYXkoY29tcHJlc3NlZC5sZW5ndGgvMik7IC8vIDIgYnl0ZXMgcGVyIGNoYXJhY3RlclxuICAgICAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWJ1Zi5sZW5ndGg7IGk8VG90YWxMZW47IGkrKykge1xuICAgICAgICAgIGJ1ZltpXT1jb21wcmVzc2VkW2kqMl0qMjU2K2NvbXByZXNzZWRbaSoyKzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBidWYuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGYoYykpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MocmVzdWx0LmpvaW4oJycpKTtcblxuICAgIH1cblxuICB9LFxuXG5cbiAgLy9jb21wcmVzcyBpbnRvIGEgc3RyaW5nIHRoYXQgaXMgYWxyZWFkeSBVUkkgZW5jb2RlZFxuICBjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDYsIGZ1bmN0aW9uKGEpe3JldHVybiBrZXlTdHJVcmlTYWZlLmNoYXJBdChhKTt9KTtcbiAgfSxcblxuICAvL2RlY29tcHJlc3MgZnJvbSBhbiBvdXRwdXQgb2YgY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnRcbiAgZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50OmZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoaW5wdXQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC8gL2csIFwiK1wiKTtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoaW5wdXQubGVuZ3RoLCAzMiwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGdldEJhc2VWYWx1ZShrZXlTdHJVcmlTYWZlLCBpbnB1dC5jaGFyQXQoaW5kZXgpKTsgfSk7XG4gIH0sXG5cbiAgY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKHVuY29tcHJlc3NlZCwgMTYsIGZ1bmN0aW9uKGEpe3JldHVybiBmKGEpO30pO1xuICB9LFxuICBfY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQsIGJpdHNQZXJDaGFyLCBnZXRDaGFyRnJvbUludCkge1xuICAgIGlmICh1bmNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIGksIHZhbHVlLFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnk9IHt9LFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZT0ge30sXG4gICAgICAgIGNvbnRleHRfYz1cIlwiLFxuICAgICAgICBjb250ZXh0X3djPVwiXCIsXG4gICAgICAgIGNvbnRleHRfdz1cIlwiLFxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbj0gMiwgLy8gQ29tcGVuc2F0ZSBmb3IgdGhlIGZpcnN0IGVudHJ5IHdoaWNoIHNob3VsZCBub3QgY291bnRcbiAgICAgICAgY29udGV4dF9kaWN0U2l6ZT0gMyxcbiAgICAgICAgY29udGV4dF9udW1CaXRzPSAyLFxuICAgICAgICBjb250ZXh0X2RhdGE9W10sXG4gICAgICAgIGNvbnRleHRfZGF0YV92YWw9MCxcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uPTAsXG4gICAgICAgIGlpO1xuXG4gICAgZm9yIChpaSA9IDA7IGlpIDwgdW5jb21wcmVzc2VkLmxlbmd0aDsgaWkgKz0gMSkge1xuICAgICAgY29udGV4dF9jID0gdW5jb21wcmVzc2VkLmNoYXJBdChpaSk7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnksY29udGV4dF9jKSkge1xuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF9jXSA9IGNvbnRleHRfZGljdFNpemUrKztcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF9jXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHRfd2MgPSBjb250ZXh0X3cgKyBjb250ZXh0X2M7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeSxjb250ZXh0X3djKSkge1xuICAgICAgICBjb250ZXh0X3cgPSBjb250ZXh0X3djO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgICAgaWYgKGNvbnRleHRfdy5jaGFyQ29kZUF0KDApPDI1Nikge1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPDggOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT1iaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X3ddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd107XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCB3YyB0byB0aGUgZGljdGlvbmFyeS5cbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd2NdID0gY29udGV4dF9kaWN0U2l6ZSsrO1xuICAgICAgICBjb250ZXh0X3cgPSBTdHJpbmcoY29udGV4dF9jKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdXRwdXQgdGhlIGNvZGUgZm9yIHcuXG4gICAgaWYgKGNvbnRleHRfdyAhPT0gXCJcIikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgIGlmIChjb250ZXh0X3cuY2hhckNvZGVBdCgwKTwyNTYpIHtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTw4IDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfd107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3ddO1xuICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGUgZW5kIG9mIHRoZSBzdHJlYW1cbiAgICB2YWx1ZSA9IDI7XG4gICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICB9XG5cbiAgICAvLyBGbHVzaCB0aGUgbGFzdCBjaGFyXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZWxzZSBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHRfZGF0YS5qb2luKCcnKTtcbiAgfSxcblxuICBkZWNvbXByZXNzOiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMzI3NjgsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpOyB9KTtcbiAgfSxcblxuICBfZGVjb21wcmVzczogZnVuY3Rpb24gKGxlbmd0aCwgcmVzZXRWYWx1ZSwgZ2V0TmV4dFZhbHVlKSB7XG4gICAgdmFyIGRpY3Rpb25hcnkgPSBbXSxcbiAgICAgICAgbmV4dCxcbiAgICAgICAgZW5sYXJnZUluID0gNCxcbiAgICAgICAgZGljdFNpemUgPSA0LFxuICAgICAgICBudW1CaXRzID0gMyxcbiAgICAgICAgZW50cnkgPSBcIlwiLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgaSxcbiAgICAgICAgdyxcbiAgICAgICAgYml0cywgcmVzYiwgbWF4cG93ZXIsIHBvd2VyLFxuICAgICAgICBjLFxuICAgICAgICBkYXRhID0ge3ZhbDpnZXROZXh0VmFsdWUoMCksIHBvc2l0aW9uOnJlc2V0VmFsdWUsIGluZGV4OjF9O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDM7IGkgKz0gMSkge1xuICAgICAgZGljdGlvbmFyeVtpXSA9IGk7XG4gICAgfVxuXG4gICAgYml0cyA9IDA7XG4gICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDIpO1xuICAgIHBvd2VyPTE7XG4gICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgfVxuICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICBwb3dlciA8PD0gMTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5leHQgPSBiaXRzKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDgpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGRpY3Rpb25hcnlbM10gPSBjO1xuICAgIHcgPSBjO1xuICAgIHJlc3VsdC5wdXNoKGMpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoZGF0YS5pbmRleCA+IGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cblxuICAgICAgYml0cyA9IDA7XG4gICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsbnVtQml0cyk7XG4gICAgICBwb3dlcj0xO1xuICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgfVxuICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoYyA9IGJpdHMpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiw4KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgZW5sYXJnZUluID0gTWF0aC5wb3coMiwgbnVtQml0cyk7XG4gICAgICAgIG51bUJpdHMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGRpY3Rpb25hcnlbY10pIHtcbiAgICAgICAgZW50cnkgPSBkaWN0aW9uYXJ5W2NdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGMgPT09IGRpY3RTaXplKSB7XG4gICAgICAgICAgZW50cnkgPSB3ICsgdy5jaGFyQXQoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKGVudHJ5KTtcblxuICAgICAgLy8gQWRkIHcrZW50cnlbMF0gdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gdyArIGVudHJ5LmNoYXJBdCgwKTtcbiAgICAgIGVubGFyZ2VJbi0tO1xuXG4gICAgICB3ID0gZW50cnk7XG5cbiAgICAgIGlmIChlbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBlbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBudW1CaXRzKTtcbiAgICAgICAgbnVtQml0cysrO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG59O1xuICByZXR1cm4gTFpTdHJpbmc7XG59KSgpO1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBMWlN0cmluZzsgfSk7XG59IGVsc2UgaWYoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAhPSBudWxsICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IExaU3RyaW5nXG59XG4iLCJ2YXIgaHlwb3QgPSBNYXRoLmh5cG90LFxuICAgIGNvcyA9IE1hdGguY29zLFxuICAgIG1heCA9IE1hdGgubWF4LFxuICAgIG1pbiA9IE1hdGgubWluLFxuICAgIHNpbiA9IE1hdGguc2luLFxuICAgIGF0YW4yID0gTWF0aC5hdGFuMixcbiAgICBQSSA9IE1hdGguUEksXG4gICAgUEkyID0gUEkgKiAyO1xuZnVuY3Rpb24gbGVycCh5MSwgeTIsIG11KSB7XG4gIHJldHVybiB5MSAqICgxIC0gbXUpICsgeTIgKiBtdTtcbn1cbmZ1bmN0aW9uIHByb2plY3RQb2ludChwMCwgYSwgZCkge1xuICByZXR1cm4gW2NvcyhhKSAqIGQgKyBwMFswXSwgc2luKGEpICogZCArIHAwWzFdXTtcbn1cblxuZnVuY3Rpb24gc2hvcnRBbmdsZURpc3QoYTAsIGExKSB7XG4gIHZhciBtYXggPSBQSTI7XG4gIHZhciBkYSA9IChhMSAtIGEwKSAlIG1heDtcbiAgcmV0dXJuIDIgKiBkYSAlIG1heCAtIGRhO1xufVxuXG5mdW5jdGlvbiBnZXRBbmdsZURlbHRhKGEwLCBhMSkge1xuICByZXR1cm4gc2hvcnRBbmdsZURpc3QoYTAsIGExKTtcbn1cbmZ1bmN0aW9uIGxlcnBBbmdsZXMoYTAsIGExLCB0KSB7XG4gIHJldHVybiBhMCArIHNob3J0QW5nbGVEaXN0KGEwLCBhMSkgKiB0O1xufVxuZnVuY3Rpb24gZ2V0UG9pbnRCZXR3ZWVuKHAwLCBwMSwgZCkge1xuICBpZiAoZCA9PT0gdm9pZCAwKSB7XG4gICAgZCA9IDAuNTtcbiAgfVxuXG4gIHJldHVybiBbcDBbMF0gKyAocDFbMF0gLSBwMFswXSkgKiBkLCBwMFsxXSArIChwMVsxXSAtIHAwWzFdKSAqIGRdO1xufVxuZnVuY3Rpb24gZ2V0QW5nbGUocDAsIHAxKSB7XG4gIHJldHVybiBhdGFuMihwMVsxXSAtIHAwWzFdLCBwMVswXSAtIHAwWzBdKTtcbn1cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAwLCBwMSkge1xuICByZXR1cm4gaHlwb3QocDFbMV0gLSBwMFsxXSwgcDFbMF0gLSBwMFswXSk7XG59XG5mdW5jdGlvbiBjbGFtcChuLCBhLCBiKSB7XG4gIHJldHVybiBtYXgoYSwgbWluKGIsIG4pKTtcbn1cbmZ1bmN0aW9uIHRvUG9pbnRzQXJyYXkocG9pbnRzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpIHtcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHggPSBfcmVmWzBdLFxuICAgICAgICAgIHkgPSBfcmVmWzFdLFxuICAgICAgICAgIF9yZWYkID0gX3JlZlsyXSxcbiAgICAgICAgICBwcmVzc3VyZSA9IF9yZWYkID09PSB2b2lkIDAgPyAwLjUgOiBfcmVmJDtcbiAgICAgIHJldHVybiBbeCwgeSwgcHJlc3N1cmVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHggPSBfcmVmMi54LFxuICAgICAgICAgIHkgPSBfcmVmMi55LFxuICAgICAgICAgIF9yZWYyJHByZXNzdXJlID0gX3JlZjIucHJlc3N1cmUsXG4gICAgICAgICAgcHJlc3N1cmUgPSBfcmVmMiRwcmVzc3VyZSA9PT0gdm9pZCAwID8gMC41IDogX3JlZjIkcHJlc3N1cmU7XG4gICAgICByZXR1cm4gW3gsIHksIHByZXNzdXJlXTtcbiAgICB9KTtcbiAgfVxufVxuXG52YXIgYWJzID0gTWF0aC5hYnMsXG4gICAgbWluJDEgPSBNYXRoLm1pbixcbiAgICBQSSQxID0gTWF0aC5QSSxcbiAgICBUQVUgPSBQSSQxIC8gMixcbiAgICBTSEFSUCA9IFRBVSxcbiAgICBEVUxMID0gU0hBUlAgLyAyO1xuXG5mdW5jdGlvbiBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcHJlc3N1cmUpIHtcbiAgaWYgKHByZXNzdXJlID09PSB2b2lkIDApIHtcbiAgICBwcmVzc3VyZSA9IDAuNTtcbiAgfVxuXG4gIGlmICh0aGlubmluZyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gc2l6ZSAvIDI7XG4gIHByZXNzdXJlID0gY2xhbXAoZWFzaW5nKHByZXNzdXJlKSwgMCwgMSk7XG4gIHJldHVybiAodGhpbm5pbmcgPCAwID8gbGVycChzaXplLCBzaXplICsgc2l6ZSAqIGNsYW1wKHRoaW5uaW5nLCAtMC45NSwgLTAuMDUpLCBwcmVzc3VyZSkgOiBsZXJwKHNpemUgLSBzaXplICogY2xhbXAodGhpbm5pbmcsIDAuMDUsIDAuOTUpLCBzaXplLCBwcmVzc3VyZSkpIC8gMjtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBwb2ludHMgZm9yIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gc3RyZWFtbGluZSBIb3cgbXVjaCB0byBzdHJlYW1saW5lIHRoZSBzdHJva2UuXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFN0cm9rZVBvaW50cyhwb2ludHMsIHN0cmVhbWxpbmUpIHtcbiAgaWYgKHN0cmVhbWxpbmUgPT09IHZvaWQgMCkge1xuICAgIHN0cmVhbWxpbmUgPSAwLjU7XG4gIH1cblxuICB2YXIgcHRzID0gdG9Qb2ludHNBcnJheShwb2ludHMpO1xuICBpZiAocHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICBwdHNbMF0gPSBbcHRzWzBdWzBdLCBwdHNbMF1bMV0sIHB0c1swXVsyXSB8fCAwLjUsIDAsIDAsIDBdO1xuXG4gIGZvciAodmFyIGkgPSAxLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzWzBdOyBpIDwgcHRzLmxlbmd0aDsgaSsrLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzW2kgLSAxXSkge1xuICAgIGN1cnJbMF0gPSBsZXJwKHByZXZbMF0sIGN1cnJbMF0sIDEgLSBzdHJlYW1saW5lKTtcbiAgICBjdXJyWzFdID0gbGVycChwcmV2WzFdLCBjdXJyWzFdLCAxIC0gc3RyZWFtbGluZSk7XG4gICAgY3VyclszXSA9IGdldEFuZ2xlKGN1cnIsIHByZXYpO1xuICAgIGN1cnJbNF0gPSBnZXREaXN0YW5jZShjdXJyLCBwcmV2KTtcbiAgICBjdXJyWzVdID0gcHJldls1XSArIGN1cnJbNF07XG4gIH1cblxuICByZXR1cm4gcHRzO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZU91dGxpbmVQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBhbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeV1gKSByZXByZXNlbnRpbmcgdGhlIG91dGxpbmUgb2YgYSBzdHJva2UuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIChvcHRpb25hbCkgb2JqZWN0IHdpdGggb3B0aW9ucy5cclxuICogQHBhcmFtIG9wdGlvbnMuc2l6ZVx0VGhlIGJhc2Ugc2l6ZSAoZGlhbWV0ZXIpIG9mIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRoaW5uaW5nIFRoZSBlZmZlY3Qgb2YgcHJlc3N1cmUgb24gdGhlIHN0cm9rZSdzIHNpemUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNtb290aGluZ1x0SG93IG11Y2ggdG8gc29mdGVuIHRoZSBzdHJva2UncyBlZGdlcy5cclxuICogQHBhcmFtIG9wdGlvbnMuZWFzaW5nXHRBbiBlYXNpbmcgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBwb2ludCdzIHByZXNzdXJlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHNpemUgPSBfb3B0aW9ucy5zaXplLFxuICAgICAgc2l6ZSA9IF9vcHRpb25zJHNpemUgPT09IHZvaWQgMCA/IDggOiBfb3B0aW9ucyRzaXplLFxuICAgICAgX29wdGlvbnMkdGhpbm5pbmcgPSBfb3B0aW9ucy50aGlubmluZyxcbiAgICAgIHRoaW5uaW5nID0gX29wdGlvbnMkdGhpbm5pbmcgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHRoaW5uaW5nLFxuICAgICAgX29wdGlvbnMkc21vb3RoaW5nID0gX29wdGlvbnMuc21vb3RoaW5nLFxuICAgICAgc21vb3RoaW5nID0gX29wdGlvbnMkc21vb3RoaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyRzbW9vdGhpbmcsXG4gICAgICBfb3B0aW9ucyRzaW11bGF0ZVByZXMgPSBfb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlLFxuICAgICAgc2ltdWxhdGVQcmVzc3VyZSA9IF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNpbXVsYXRlUHJlcyxcbiAgICAgIF9vcHRpb25zJGVhc2luZyA9IF9vcHRpb25zLmVhc2luZyxcbiAgICAgIGVhc2luZyA9IF9vcHRpb25zJGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdDtcbiAgfSA6IF9vcHRpb25zJGVhc2luZztcbiAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGgsXG4gICAgICB0b3RhbExlbmd0aCA9IHBvaW50c1tsZW4gLSAxXVs1XSxcbiAgICAgIC8vIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGxpbmVcbiAgbWluRGlzdCA9IHNpemUgKiBzbW9vdGhpbmcsXG4gICAgICAvLyBUaGUgbWluaW11bSBkaXN0YW5jZSBmb3IgbWVhc3VyZW1lbnRzXG4gIGxlZnRQdHMgPSBbXSxcbiAgICAgIC8vIE91ciBjb2xsZWN0ZWQgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG4gIHJpZ2h0UHRzID0gW107XG4gIHZhciBwbCA9IHBvaW50c1swXSxcbiAgICAgIC8vIFByZXZpb3VzIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuICBwciA9IHBvaW50c1swXSxcbiAgICAgIHRsID0gcGwsXG4gICAgICAvLyBQb2ludHMgdG8gdGVzdCBkaXN0YW5jZSBmcm9tXG4gIHRyID0gcHIsXG4gICAgICBwYSA9IHByWzNdLFxuICAgICAgcHAgPSAwLFxuICAgICAgLy8gUHJldmlvdXMgKG1heWJlIHNpbXVsYXRlZCkgcHJlc3N1cmVcbiAgciA9IHNpemUgLyAyLFxuICAgICAgLy8gVGhlIGN1cnJlbnQgcG9pbnQgcmFkaXVzXG4gIF9zaG9ydCA9IHRydWU7IC8vIFdoZXRoZXIgdGhlIGxpbmUgaXMgZHJhd24gZmFyIGVub3VnaFxuICAvLyBXZSBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIGFuIGVtcHR5IGFycmF5LlxuXG4gIGlmIChsZW4gPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gSWYgdGhlIHBvaW50IGlzIG9ubHkgb25lIHBvaW50IGxvbmcsIGRyYXcgdHdvIGNhcHMgYXQgZWl0aGVyIGVuZC5cblxuXG4gIGlmIChsZW4gPT09IDEgfHwgdG90YWxMZW5ndGggPD0gNCkge1xuICAgIHZhciBmaXJzdCA9IHBvaW50c1swXSxcbiAgICAgICAgbGFzdCA9IHBvaW50c1tsZW4gLSAxXSxcbiAgICAgICAgYW5nbGUgPSBnZXRBbmdsZShmaXJzdCwgbGFzdCk7XG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIHIgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgbGFzdFsyXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgdCA9IDAsIHN0ZXAgPSAwLjE7IHQgPD0gMTsgdCArPSBzdGVwKSB7XG4gICAgICB0bCA9IHByb2plY3RQb2ludChmaXJzdCwgYW5nbGUgKyBQSSQxICsgVEFVIC0gdCAqIFBJJDEsIHIpO1xuICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobGFzdCwgYW5nbGUgKyBUQVUgLSB0ICogUEkkMSwgcik7XG4gICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRQdHMuY29uY2F0KHJpZ2h0UHRzKTtcbiAgfSAvLyBGb3IgYSBwb2ludCB3aXRoIG1vcmUgdGhhbiBvbmUgcG9pbnQsIGNyZWF0ZSBhbiBvdXRsaW5lIHNoYXBlLlxuXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBwcmV2ID0gcG9pbnRzW2kgLSAxXTtcbiAgICB2YXIgX3BvaW50cyRpID0gcG9pbnRzW2ldLFxuICAgICAgICB4ID0gX3BvaW50cyRpWzBdLFxuICAgICAgICB5ID0gX3BvaW50cyRpWzFdLFxuICAgICAgICBwcmVzc3VyZSA9IF9wb2ludHMkaVsyXSxcbiAgICAgICAgX2FuZ2xlID0gX3BvaW50cyRpWzNdLFxuICAgICAgICBkaXN0YW5jZSA9IF9wb2ludHMkaVs0XSxcbiAgICAgICAgY2xlbiA9IF9wb2ludHMkaVs1XTsgLy8gMS5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIGlmIChzaW11bGF0ZVByZXNzdXJlKSB7XG4gICAgICAgIC8vIFNpbXVsYXRlIHByZXNzdXJlIGJ5IGFjY2VsbGVyYXRpbmcgdGhlIHJlcG9ydGVkIHByZXNzdXJlLlxuICAgICAgICB2YXIgcnAgPSBtaW4kMSgxIC0gZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgdmFyIHNwID0gbWluJDEoZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgcHJlc3N1cmUgPSBtaW4kMSgxLCBwcCArIChycCAtIHBwKSAqIChzcCAvIDIpKTtcbiAgICAgIH0gLy8gQ29tcHV0ZSB0aGUgc3Ryb2tlIHJhZGl1cyBiYXNlZCBvbiB0aGUgcHJlc3N1cmUsIGVhc2luZyBhbmQgdGhpbm5pbmcuXG5cblxuICAgICAgciA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBwcmVzc3VyZSk7XG4gICAgfSAvLyAyLlxuICAgIC8vIERyYXcgYSBjYXAgb25jZSB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cblxuXG4gICAgaWYgKF9zaG9ydCkge1xuICAgICAgaWYgKGNsZW4gPCBzaXplIC8gNCkgY29udGludWU7IC8vIFRoZSBmaXJzdCBwb2ludCBhZnRlciB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cbiAgICAgIC8vIERyYXcgYSBjYXAgYXQgdGhlIGZpcnN0IHBvaW50IGFuZ2xlZCB0b3dhcmQgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICAgIF9zaG9ydCA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBfdCA9IDAsIF9zdGVwID0gMC4xOyBfdCA8PSAxOyBfdCArPSBfc3RlcCkge1xuICAgICAgICB0bCA9IHByb2plY3RQb2ludChwb2ludHNbMF0sIF9hbmdsZSArIFRBVSAtIF90ICogUEkkMSwgcik7XG4gICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICB9XG5cbiAgICAgIHRyID0gcHJvamVjdFBvaW50KHBvaW50c1swXSwgX2FuZ2xlICsgVEFVLCByKTtcbiAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgIH1cblxuICAgIF9hbmdsZSA9IGxlcnBBbmdsZXMocGEsIF9hbmdsZSwgMC43NSk7IC8vIDMuXG4gICAgLy8gQWRkIHBvaW50cyBmb3IgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAoaSA9PT0gbGVuIC0gMSkge1xuICAgICAgLy8gVGhlIGxhc3QgcG9pbnQgaW4gdGhlIGxpbmUuXG4gICAgICAvLyBBZGQgcG9pbnRzIGZvciBhbiBlbmQgY2FwLlxuICAgICAgZm9yICh2YXIgX3QyID0gMCwgX3N0ZXAyID0gMC4xOyBfdDIgPD0gMTsgX3QyICs9IF9zdGVwMikge1xuICAgICAgICByaWdodFB0cy5wdXNoKHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSArIF90MiAqIFBJJDEsIHIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmluZCB0aGUgZGVsdGEgYmV0d2VlbiB0aGUgY3VycmVudCBhbmQgcHJldmlvdXMgYW5nbGUuXG4gICAgICB2YXIgZGVsdGEgPSBnZXRBbmdsZURlbHRhKHByZXZbM10sIF9hbmdsZSksXG4gICAgICAgICAgYWJzRGVsdGEgPSBhYnMoZGVsdGEpO1xuXG4gICAgICBpZiAoYWJzRGVsdGEgPiBTSEFSUCAmJiBjbGVuID4gcikge1xuICAgICAgICAvLyBBIHNoYXJwIGNvcm5lci5cbiAgICAgICAgLy8gUHJvamVjdCBwb2ludHMgKGxlZnQgYW5kIHJpZ2h0KSBmb3IgYSBjYXAuXG4gICAgICAgIHZhciBtaWQgPSBnZXRQb2ludEJldHdlZW4ocHJldiwgW3gsIHldKTtcblxuICAgICAgICBmb3IgKHZhciBfdDMgPSAwLCBfc3RlcDMgPSAwLjI1OyBfdDMgPD0gMTsgX3QzICs9IF9zdGVwMykge1xuICAgICAgICAgIHRsID0gcHJvamVjdFBvaW50KG1pZCwgcGEgLSBUQVUgKyBfdDMgKiAtUEkkMSwgcik7XG4gICAgICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobWlkLCBwYSArIFRBVSArIF90MyAqIFBJJDEsIHIpO1xuICAgICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEEgcmVndWxhciBwb2ludC5cbiAgICAgICAgLy8gQWRkIHByb2plY3RlZCBwb2ludHMgbGVmdCBhbmQgcmlnaHQsIGlmIGZhciBlbm91Z2ggYXdheS5cbiAgICAgICAgcGwgPSBwcm9qZWN0UG9pbnQoW3gsIHldLCBfYW5nbGUgLSBUQVUsIHIpO1xuICAgICAgICBwciA9IHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSwgcik7XG5cbiAgICAgICAgaWYgKGFic0RlbHRhID4gRFVMTCB8fCBnZXREaXN0YW5jZShwbCwgdGwpID4gbWluRGlzdCkge1xuICAgICAgICAgIGxlZnRQdHMucHVzaChnZXRQb2ludEJldHdlZW4odGwsIHBsKSk7XG4gICAgICAgICAgdGwgPSBwbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhYnNEZWx0YSA+IERVTEwgfHwgZ2V0RGlzdGFuY2UocHIsIHRyKSA+IG1pbkRpc3QpIHtcbiAgICAgICAgICByaWdodFB0cy5wdXNoKGdldFBvaW50QmV0d2Vlbih0ciwgcHIpKTtcbiAgICAgICAgICB0ciA9IHByO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHBwID0gcHJlc3N1cmU7XG4gICAgICBwYSA9IF9hbmdsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVmdFB0cy5jb25jYXQocmlnaHRQdHMucmV2ZXJzZSgpKTtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VcclxuICogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBzdHJva2UgYXMgYW4gYXJyYXkgb2YgcG9pbnRzLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnN0cmVhbWxpbmUgSG93IG11Y2ggdG8gc3RyZWFtbGluZSB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2UocG9pbnRzLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gZ2V0U3Ryb2tlT3V0bGluZVBvaW50cyhnZXRTdHJva2VQb2ludHMocG9pbnRzLCBvcHRpb25zLnN0cmVhbWxpbmUpLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U3Ryb2tlO1xuZXhwb3J0IHsgZ2V0U3Ryb2tlT3V0bGluZVBvaW50cywgZ2V0U3Ryb2tlUG9pbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wZXJmZWN0LWZyZWVoYW5kLmVzbS5qcy5tYXBcbiIsImltcG9ydCB7IFVJQWN0aW9uVHlwZXMsIFdvcmtlckFjdGlvblR5cGVzLCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U3ZnUGF0aEZyb21TdHJva2UsIGFkZFZlY3RvcnMsIGludGVycG9sYXRlQ3ViaWNCZXppZXIsIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgZ2V0U3Ryb2tlIGZyb20gXCJwZXJmZWN0LWZyZWVoYW5kXCI7XG5pbXBvcnQgeyBjb21wcmVzc1RvVVRGMTYsIGRlY29tcHJlc3NGcm9tVVRGMTYgfSBmcm9tIFwibHotc3RyaW5nXCI7XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDb21tcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBwbHVnaW4gVUlcbmZ1bmN0aW9uIHBvc3RNZXNzYWdlKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pO1xufVxuLy8gU2F2ZSBzb21lIGluZm9ybWF0aW9uIGFib3V0IHRoZSBub2RlIHRvIGl0cyBwbHVnaW4gZGF0YS5cbmZ1bmN0aW9uIHNldE9yaWdpbmFsTm9kZShub2RlKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxOb2RlID0ge1xuICAgICAgICBjZW50ZXI6IGdldENlbnRlcihub2RlKSxcbiAgICAgICAgdmVjdG9yTmV0d29yazogT2JqZWN0LmFzc2lnbih7fSwgbm9kZS52ZWN0b3JOZXR3b3JrKSxcbiAgICAgICAgdmVjdG9yUGF0aHM6IG5vZGUudmVjdG9yUGF0aHMsXG4gICAgfTtcbiAgICBub2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIGNvbXByZXNzVG9VVEYxNihKU09OLnN0cmluZ2lmeShvcmlnaW5hbE5vZGUpKSk7XG4gICAgcmV0dXJuIG9yaWdpbmFsTm9kZTtcbn1cbmZ1bmN0aW9uIGRlY29tcHJlc3NQbHVnaW5EYXRhKHBsdWdpbkRhdGEpIHtcbiAgICAvLyBEZWNvbXByZXNzIHRoZSBzYXZlZCBkYXRhIGFuZCBwYXJzZSBvdXQgdGhlIG9yaWdpbmFsIG5vZGUuXG4gICAgY29uc3QgZGVjb21wcmVzc2VkID0gZGVjb21wcmVzc0Zyb21VVEYxNihwbHVnaW5EYXRhKTtcbiAgICBpZiAoIWRlY29tcHJlc3NlZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkZvdW5kIHNhdmVkIGRhdGEgZm9yIG9yaWdpbmFsIG5vZGUgYnV0IGNvdWxkIG5vdCBkZWNvbXByZXNzIGl0OiBcIiArXG4gICAgICAgICAgICBkZWNvbXByZXNzZWQpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvbXByZXNzZWQpO1xufVxuLy8gR2V0IGFuIG9yaWdpbmFsIG5vZGUgZnJvbSBhIG5vZGUncyBwbHVnaW4gZGF0YS5cbmZ1bmN0aW9uIGdldE9yaWdpbmFsTm9kZShpZCkge1xuICAgIGxldCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgIGNvbnN0IHBsdWdpbkRhdGEgPSBub2RlLmdldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIpO1xuICAgIC8vIE5vdGhpbmcgb24gdGhlIG5vZGUg4oCUIHdlIGhhdmVuJ3QgbW9kaWZpZWQgaXQuXG4gICAgaWYgKCFwbHVnaW5EYXRhKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIHJldHVybiBkZWNvbXByZXNzUGx1Z2luRGF0YShwbHVnaW5EYXRhKTtcbn1cbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gTm9kZXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vLyBHZXQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBWZWN0b3Igbm9kZXMgZm9yIHRoZSBVSS5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkTm9kZXModXBkYXRlQ2VudGVyID0gZmFsc2UpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09IFwiVkVDVE9SXCIpLm1hcCgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCBwbHVnaW5EYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiKTtcbiAgICAgICAgaWYgKHBsdWdpbkRhdGEgJiYgdXBkYXRlQ2VudGVyKSB7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXIgPSBnZXRDZW50ZXIobm9kZSk7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBkZWNvbXByZXNzUGx1Z2luRGF0YShwbHVnaW5EYXRhKTtcbiAgICAgICAgICAgIGlmICghKGNlbnRlci54ID09PSBvcmlnaW5hbE5vZGUuY2VudGVyLnggJiZcbiAgICAgICAgICAgICAgICBjZW50ZXIueSA9PT0gb3JpZ2luYWxOb2RlLmNlbnRlci55KSkge1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsTm9kZS5jZW50ZXIgPSBjZW50ZXI7XG4gICAgICAgICAgICAgICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiLCBjb21wcmVzc1RvVVRGMTYoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxOb2RlKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgICAgIG5hbWU6IG5vZGUubmFtZSxcbiAgICAgICAgICAgIHR5cGU6IG5vZGUudHlwZSxcbiAgICAgICAgICAgIGNhblJlc2V0OiAhIXBsdWdpbkRhdGEsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyBHZXR0aGUgY3VycmVudGx5IHNlbGVjdGVkIFZlY3RvciBub2RlcyBhcyBhbiBhcnJheSBvZiBJZHMuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZE5vZGVJZHMoKSB7XG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBcIlZFQ1RPUlwiKS5tYXAoKHsgaWQgfSkgPT4gaWQpO1xufVxuLy8gRmluZCB0aGUgY2VudGVyIG9mIGEgbm9kZS5cbmZ1bmN0aW9uIGdldENlbnRlcihub2RlKSB7XG4gICAgbGV0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gbm9kZTtcbiAgICByZXR1cm4geyB4OiB4ICsgd2lkdGggLyAyLCB5OiB5ICsgaGVpZ2h0IC8gMiB9O1xufVxuLy8gTW92ZSBhIG5vZGUgdG8gYSBjZW50ZXIuXG5mdW5jdGlvbiBtb3ZlTm9kZVRvQ2VudGVyKG5vZGUsIGNlbnRlcikge1xuICAgIGNvbnN0IHsgeDogeDAsIHk6IHkwIH0gPSBnZXRDZW50ZXIobm9kZSk7XG4gICAgY29uc3QgeyB4OiB4MSwgeTogeTEgfSA9IGNlbnRlcjtcbiAgICBub2RlLnggPSBub2RlLnggKyB4MSAtIHgwO1xuICAgIG5vZGUueSA9IG5vZGUueSArIHkxIC0geTA7XG59XG4vLyBab29tIHRoZSBGaWdtYSB2aWV3cG9ydCB0byBhIG5vZGUuXG5mdW5jdGlvbiB6b29tVG9Ob2RlKGlkKSB7XG4gICAgY29uc3Qgbm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSBTZWxlY3Rpb24gLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gRGVzZWxlY3QgYSBGaWdtYSBub2RlLlxuZnVuY3Rpb24gZGVzZWxlY3ROb2RlKGlkKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+IG5vZGUuaWQgIT09IGlkKTtcbn1cbi8vIFNlbmQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHRvIHRoZSBVSSBzdGF0ZS5cbmZ1bmN0aW9uIHNlbmRTZWxlY3RlZE5vZGVzKHVwZGF0ZUNlbnRlciA9IHRydWUpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2Rlcyh1cGRhdGVDZW50ZXIpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLSBDaGFuZ2luZyBWZWN0b3JOb2RlcyAtLS0tLS0tLS0tLS0tLSAqL1xuLy8gTnVtYmVyIG9mIG5ldyBub2RlcyB0byBpbnNlcnRcbmNvbnN0IFNQTElUID0gNTtcbi8vIFNvbWUgYmFzaWMgZWFzaW5nIGZ1bmN0aW9uc1xuY29uc3QgRUFTSU5HUyA9IHtcbiAgICBsaW5lYXI6ICh0KSA9PiB0LFxuICAgIGVhc2VJbjogKHQpID0+IHQgKiB0LFxuICAgIGVhc2VPdXQ6ICh0KSA9PiB0ICogKDIgLSB0KSxcbiAgICBlYXNlSW5PdXQ6ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IC0xICsgKDQgLSAyICogdCkgKiB0KSxcbn07XG4vLyBDb21wdXRlIGEgc3Ryb2tlIGJhc2VkIG9uIHRoZSB2ZWN0b3IgYW5kIGFwcGx5IGl0IHRvIHRoZSB2ZWN0b3IncyBwYXRoIGRhdGEuXG5mdW5jdGlvbiBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMobm9kZUlkcywgeyBvcHRpb25zLCBlYXNpbmcgPSBcImxpbmVhclwiLCBjbGlwLCB9LCByZXN0cmljdFRvS25vd25Ob2RlcyA9IGZhbHNlKSB7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICAvLyBHZXQgdGhlIG5vZGUgdGhhdCB3ZSB3YW50IHRvIGNoYW5nZVxuICAgICAgICBjb25zdCBub2RlVG9DaGFuZ2UgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghbm9kZVRvQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBub2RlXG4gICAgICAgIGxldCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUobm9kZVRvQ2hhbmdlLmlkKTtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB0aGlzIG5vZGUuLi5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEJhaWwgaWYgd2UncmUgdXBkYXRpbmcgbm9kZXNcbiAgICAgICAgICAgIGlmIChyZXN0cmljdFRvS25vd25Ob2RlcylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBvcmlnaW5hbCBub2RlIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgb3JpZ2luYWxOb2RlID0gc2V0T3JpZ2luYWxOb2RlKG5vZGVUb0NoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW50ZXJwb2xhdGUgbmV3IHBvaW50cyBhbG9uZyB0aGUgdmVjdG9yJ3MgY3VydmVcbiAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2Ygb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsuc2VnbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHAwID0gb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsudmVydGljZXNbc2VnbWVudC5zdGFydF07XG4gICAgICAgICAgICBjb25zdCBwMyA9IG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuZW5kXTtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gYWRkVmVjdG9ycyhwMCwgc2VnbWVudC50YW5nZW50U3RhcnQpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBhZGRWZWN0b3JzKHAzLCBzZWdtZW50LnRhbmdlbnRFbmQpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdG9yID0gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgcDEsIHAyLCBwMyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNQTElUOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwdHMucHVzaChpbnRlcnBvbGF0b3IoaSAvIFNQTElUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHN0cm9rZSB1c2luZyBwZXJmZWN0LWZyZWVoYW5kXG4gICAgICAgIGNvbnN0IHN0cm9rZSA9IGdldFN0cm9rZShwdHMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgZWFzaW5nOiBFQVNJTkdTW2Vhc2luZ10gfSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gU2V0IHN0cm9rZSB0byB2ZWN0b3IgcGF0aHNcbiAgICAgICAgICAgIG5vZGVUb0NoYW5nZS52ZWN0b3JQYXRocyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiBcIk5PTlpFUk9cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBhcHBseSBzdHJva2VcIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgc28gdGhhdCBpdHMgY2VudGVyIGRvZXMgbm90IGNoYW5nZVxuICAgICAgICBtb3ZlTm9kZVRvQ2VudGVyKG5vZGVUb0NoYW5nZSwgb3JpZ2luYWxOb2RlLmNlbnRlcik7XG4gICAgfVxuICAgIHNlbmRTZWxlY3RlZE5vZGVzKGZhbHNlKTtcbn1cbi8vIFJlc2V0IHRoZSBub2RlIHRvIGl0cyBvcmlnaW5hbCBwYXRoIGRhdGEsIHVzaW5nIGRhdGEgZnJvbSBvdXIgY2FjaGUgYW5kIHRoZW4gZGVsZXRlIHRoZSBub2RlLlxuZnVuY3Rpb24gcmVzZXRWZWN0b3JOb2RlcygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBnZXRTZWxlY3RlZE5vZGVJZHMoKSkge1xuICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUoaWQpO1xuICAgICAgICAvLyBXZSBoYXZlbid0IG1vZGlmaWVkIHRoaXMgbm9kZS5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUudmVjdG9yUGF0aHMgPSBvcmlnaW5hbE5vZGUudmVjdG9yUGF0aHM7XG4gICAgICAgIGN1cnJlbnROb2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIFwiXCIpO1xuICAgICAgICBzZW5kU2VsZWN0ZWROb2RlcyhmYWxzZSk7XG4gICAgfVxufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEtpY2tvZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIExpc3RlbiB0byBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBwbHVnaW4gVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICh7IHR5cGUsIHBheWxvYWQgfSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuQ0xPU0U6XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5aT09NX1RPX05PREU6XG4gICAgICAgICAgICB6b29tVG9Ob2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5ERVNFTEVDVF9OT0RFOlxuICAgICAgICAgICAgZGVzZWxlY3ROb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5SRVNFVF9OT0RFUzpcbiAgICAgICAgICAgIHJlc2V0VmVjdG9yTm9kZXMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVFJBTlNGT1JNX05PREVTOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlVQREFURURfT1BUSU9OUzpcbiAgICAgICAgICAgIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2RlcyhnZXRTZWxlY3RlZE5vZGVJZHMoKSwgcGF5bG9hZCwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuLy8gTGlzdGVuIGZvciBzZWxlY3Rpb24gY2hhbmdlc1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgc2VuZFNlbGVjdGVkTm9kZXMpO1xuLy8gU2hvdyB0aGUgcGx1Z2luIGludGVyZmFjZVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogNDIwIH0pO1xuLy8gU2VuZCB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gdGhlIFVJXG5zZW5kU2VsZWN0ZWROb2RlcygpO1xuIiwiLy8gVUkgYWN0aW9uc1xuZXhwb3J0IHZhciBVSUFjdGlvblR5cGVzO1xuKGZ1bmN0aW9uIChVSUFjdGlvblR5cGVzKSB7XG4gICAgVUlBY3Rpb25UeXBlc1tcIkNMT1NFXCJdID0gXCJDTE9TRVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJaT09NX1RPX05PREVcIl0gPSBcIlpPT01fVE9fTk9ERVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJERVNFTEVDVF9OT0RFXCJdID0gXCJERVNFTEVDVF9OT0RFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlRSQU5TRk9STV9OT0RFU1wiXSA9IFwiVFJBTlNGT1JNX05PREVTXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlJFU0VUX05PREVTXCJdID0gXCJSRVNFVF9OT0RFU1wiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJVUERBVEVEX09QVElPTlNcIl0gPSBcIlVQREFURURfT1BUSU9OU1wiO1xufSkoVUlBY3Rpb25UeXBlcyB8fCAoVUlBY3Rpb25UeXBlcyA9IHt9KSk7XG4vLyBXb3JrZXIgYWN0aW9uc1xuZXhwb3J0IHZhciBXb3JrZXJBY3Rpb25UeXBlcztcbihmdW5jdGlvbiAoV29ya2VyQWN0aW9uVHlwZXMpIHtcbiAgICBXb3JrZXJBY3Rpb25UeXBlc1tcIlNFTEVDVEVEX05PREVTXCJdID0gXCJTRUxFQ1RFRF9OT0RFU1wiO1xuICAgIFdvcmtlckFjdGlvblR5cGVzW1wiRk9VTkRfU0VMRUNURURfTk9ERVNcIl0gPSBcIkZPVU5EX1NFTEVDVEVEX05PREVTXCI7XG59KShXb3JrZXJBY3Rpb25UeXBlcyB8fCAoV29ya2VyQWN0aW9uVHlwZXMgPSB7fSkpO1xuIiwiLy8gaW1wb3J0IHBvbHlnb25DbGlwcGluZyBmcm9tIFwicG9seWdvbi1jbGlwcGluZ1wiXG5jb25zdCB7IHBvdyB9ID0gTWF0aDtcbmV4cG9ydCBmdW5jdGlvbiBjdWJpY0Jlemllcih0eCwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAvLyBJbnNwaXJlZCBieSBEb24gTGFuY2FzdGVyJ3MgdHdvIGFydGljbGVzXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL2dsaWIvY3ViZW1hdGgucGRmXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL3RleHQvYmV6bWF0aC5odG1sXG4gICAgLy8gU2V0IHAwIGFuZCBwMSBwb2ludFxuICAgIGxldCB4MCA9IDAsIHkwID0gMCwgeDMgPSAxLCB5MyA9IDEsIFxuICAgIC8vIENvbnZlcnQgdGhlIGNvb3JkaW5hdGVzIHRvIGVxdWF0aW9uIHNwYWNlXG4gICAgQSA9IHgzIC0gMyAqIHgyICsgMyAqIHgxIC0geDAsIEIgPSAzICogeDIgLSA2ICogeDEgKyAzICogeDAsIEMgPSAzICogeDEgLSAzICogeDAsIEQgPSB4MCwgRSA9IHkzIC0gMyAqIHkyICsgMyAqIHkxIC0geTAsIEYgPSAzICogeTIgLSA2ICogeTEgKyAzICogeTAsIEcgPSAzICogeTEgLSAzICogeTAsIEggPSB5MCwgXG4gICAgLy8gVmFyaWFibGVzIGZvciB0aGUgbG9vcCBiZWxvd1xuICAgIHQgPSB0eCwgaXRlcmF0aW9ucyA9IDUsIGksIHNsb3BlLCB4LCB5O1xuICAgIC8vIExvb3AgdGhyb3VnaCBhIGZldyB0aW1lcyB0byBnZXQgYSBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWUsIGFjY29yZGluZyB0byB0aGUgTmV3dG9uLVJhcGhzb24gbWV0aG9kXG4gICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OZXd0b24nc19tZXRob2RcbiAgICBmb3IgKGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgIC8vIFRoZSBjdXJ2ZSdzIHggZXF1YXRpb24gZm9yIHRoZSBjdXJyZW50IHRpbWUgdmFsdWVcbiAgICAgICAgeCA9IEEgKiB0ICogdCAqIHQgKyBCICogdCAqIHQgKyBDICogdCArIEQ7XG4gICAgICAgIC8vIFRoZSBzbG9wZSB3ZSB3YW50IGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBkZXJpdmF0ZSBvZiB4XG4gICAgICAgIHNsb3BlID0gMSAvICgzICogQSAqIHQgKiB0ICsgMiAqIEIgKiB0ICsgQyk7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBlc3RpbWF0ZWQgdGltZSB2YWx1ZSwgd2hpY2ggd2lsbCBiZSBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIG9uZSBiZWZvcmVcbiAgICAgICAgdCAtPSAoeCAtIHR4KSAqIHNsb3BlO1xuICAgICAgICB0ID0gdCA+IDEgPyAxIDogdCA8IDAgPyAwIDogdDtcbiAgICB9XG4gICAgLy8gRmluZCB0aGUgeSB2YWx1ZSB0aHJvdWdoIHRoZSBjdXJ2ZSdzIHkgZXF1YXRpb24sIHdpdGggdGhlIG5vdyBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWVcbiAgICB5ID0gTWF0aC5hYnMoRSAqIHQgKiB0ICogdCArIEYgKiB0ICogdCArIEcgKiB0ICogSCk7XG4gICAgcmV0dXJuIHk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9pbnRzQWxvbmdDdWJpY0JlemllcihwdENvdW50LCBweFRvbGVyYW5jZSwgQXgsIEF5LCBCeCwgQnksIEN4LCBDeSwgRHgsIER5KSB7XG4gICAgbGV0IGRlbHRhQkF4ID0gQnggLSBBeDtcbiAgICBsZXQgZGVsdGFDQnggPSBDeCAtIEJ4O1xuICAgIGxldCBkZWx0YURDeCA9IER4IC0gQ3g7XG4gICAgbGV0IGRlbHRhQkF5ID0gQnkgLSBBeTtcbiAgICBsZXQgZGVsdGFDQnkgPSBDeSAtIEJ5O1xuICAgIGxldCBkZWx0YURDeSA9IER5IC0gQ3k7XG4gICAgbGV0IGF4LCBheSwgYngsIGJ5LCBjeCwgY3k7XG4gICAgbGV0IGxhc3RYID0gLTEwMDAwO1xuICAgIGxldCBsYXN0WSA9IC0xMDAwMDtcbiAgICBsZXQgcHRzID0gW3sgeDogQXgsIHk6IEF5IH1dO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHRDb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCB0ID0gaSAvIHB0Q291bnQ7XG4gICAgICAgIGF4ID0gQXggKyBkZWx0YUJBeCAqIHQ7XG4gICAgICAgIGJ4ID0gQnggKyBkZWx0YUNCeCAqIHQ7XG4gICAgICAgIGN4ID0gQ3ggKyBkZWx0YURDeCAqIHQ7XG4gICAgICAgIGF4ICs9IChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGJ4ICs9IChjeCAtIGJ4KSAqIHQ7XG4gICAgICAgIGF5ID0gQXkgKyBkZWx0YUJBeSAqIHQ7XG4gICAgICAgIGJ5ID0gQnkgKyBkZWx0YUNCeSAqIHQ7XG4gICAgICAgIGN5ID0gQ3kgKyBkZWx0YURDeSAqIHQ7XG4gICAgICAgIGF5ICs9IChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGJ5ICs9IChjeSAtIGJ5KSAqIHQ7XG4gICAgICAgIGNvbnN0IHggPSBheCArIChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGNvbnN0IHkgPSBheSArIChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGNvbnN0IGR4ID0geCAtIGxhc3RYO1xuICAgICAgICBjb25zdCBkeSA9IHkgLSBsYXN0WTtcbiAgICAgICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gcHhUb2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHB0cy5wdXNoKHsgeDogeCwgeTogeSB9KTtcbiAgICAgICAgICAgIGxhc3RYID0geDtcbiAgICAgICAgICAgIGxhc3RZID0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdHMucHVzaCh7IHg6IER4LCB5OiBEeSB9KTtcbiAgICByZXR1cm4gcHRzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViaWNCZXppZXIocDAsIGMwLCBjMSwgcDEpIHtcbiAgICAvLyAwIDw9IHQgPD0gMVxuICAgIHJldHVybiBmdW5jdGlvbiBpbnRlcnBvbGF0b3IodCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnggK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnggK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueCArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueCxcbiAgICAgICAgICAgIHBvdygxIC0gdCwgMykgKiBwMC55ICtcbiAgICAgICAgICAgICAgICAzICogcG93KDEgLSB0LCAyKSAqIHQgKiBjMC55ICtcbiAgICAgICAgICAgICAgICAzICogKDEgLSB0KSAqIHBvdyh0LCAyKSAqIGMxLnkgK1xuICAgICAgICAgICAgICAgIHBvdyh0LCAzKSAqIHAxLnksXG4gICAgICAgIF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRWZWN0b3JzKGEsIGIpIHtcbiAgICBpZiAoIWIpXG4gICAgICAgIHJldHVybiBhO1xuICAgIHJldHVybiB7IHg6IGEueCArIGIueCwgeTogYS55ICsgYi55IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSB7XG4gICAgaWYgKHN0cm9rZS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIGNvbnN0IGQgPSBbXTtcbiAgICBsZXQgW3AwLCBwMV0gPSBzdHJva2U7XG4gICAgZC5wdXNoKFwiTVwiLCBwMFswXSwgcDBbMV0pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3Ryb2tlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGQucHVzaChcIlFcIiwgcDBbMF0sIHAwWzFdLCAocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyKTtcbiAgICAgICAgcDAgPSBwMTtcbiAgICAgICAgcDEgPSBzdHJva2VbaV07XG4gICAgfVxuICAgIGQucHVzaChcIlpcIik7XG4gICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG59XG4vLyBleHBvcnQgZnVuY3Rpb24gZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZTogbnVtYmVyW11bXSkge1xuLy8gICB0cnkge1xuLy8gICAgIGNvbnN0IHBvbHkgPSBwb2x5Z29uQ2xpcHBpbmcudW5pb24oW3N0cm9rZV0gYXMgYW55KVxuLy8gICAgIGNvbnN0IGQgPSBbXVxuLy8gICAgIGZvciAobGV0IGZhY2Ugb2YgcG9seSkge1xuLy8gICAgICAgZm9yIChsZXQgcG9pbnRzIG9mIGZhY2UpIHtcbi8vICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdKVxuLy8gICAgICAgICBkLnB1c2goZ2V0U3ZnUGF0aEZyb21TdHJva2UocG9pbnRzKSlcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgZC5wdXNoKFwiWlwiKVxuLy8gICAgIHJldHVybiBkLmpvaW4oXCIgXCIpXG4vLyAgIH0gY2F0Y2ggKGUpIHtcbi8vICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGNsaXAgcGF0aC5cIilcbi8vICAgICByZXR1cm4gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKVxuLy8gICB9XG4vLyB9XG4iXSwic291cmNlUm9vdCI6IiJ9