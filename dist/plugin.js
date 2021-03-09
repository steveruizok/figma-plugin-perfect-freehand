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

/***/ "./node_modules/polygon-clipping/dist/polygon-clipping.umd.js":
/*!********************************************************************!*\
  !*** ./node_modules/polygon-clipping/dist/polygon-clipping.umd.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {(function (global, factory) {
   true ? module.exports = factory() :
  undefined;
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * splaytree v3.1.0
   * Fast Splay tree for Node and browser
   *
   * @author Alexander Milevski <info@w8r.name>
   * @license MIT
   * @preserve
   */
  var Node =
  /** @class */
  function () {
    function Node(key, data) {
      this.next = null;
      this.key = key;
      this.data = data;
      this.left = null;
      this.right = null;
    }

    return Node;
  }();
  /* follows "An implementation of top-down splaying"
   * by D. Sleator <sleator@cs.cmu.edu> March 1992
   */


  function DEFAULT_COMPARE(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }
  /**
   * Simple top down splay, not requiring i to be in the tree t.
   */


  function splay(i, t, comparator) {
    var N = new Node(null, null);
    var l = N;
    var r = N;

    while (true) {
      var cmp = comparator(i, t.key); //if (i < t.key) {

      if (cmp < 0) {
        if (t.left === null) break; //if (i < t.left.key) {

        if (comparator(i, t.left.key) < 0) {
          var y = t.left;
          /* rotate right */

          t.left = y.right;
          y.right = t;
          t = y;
          if (t.left === null) break;
        }

        r.left = t;
        /* link right */

        r = t;
        t = t.left; //} else if (i > t.key) {
      } else if (cmp > 0) {
        if (t.right === null) break; //if (i > t.right.key) {

        if (comparator(i, t.right.key) > 0) {
          var y = t.right;
          /* rotate left */

          t.right = y.left;
          y.left = t;
          t = y;
          if (t.right === null) break;
        }

        l.right = t;
        /* link left */

        l = t;
        t = t.right;
      } else break;
    }
    /* assemble */


    l.right = t.left;
    r.left = t.right;
    t.left = N.right;
    t.right = N.left;
    return t;
  }

  function insert(i, data, t, comparator) {
    var node = new Node(i, data);

    if (t === null) {
      node.left = node.right = null;
      return node;
    }

    t = splay(i, t, comparator);
    var cmp = comparator(i, t.key);

    if (cmp < 0) {
      node.left = t.left;
      node.right = t;
      t.left = null;
    } else if (cmp >= 0) {
      node.right = t.right;
      node.left = t;
      t.right = null;
    }

    return node;
  }

  function split(key, v, comparator) {
    var left = null;
    var right = null;

    if (v) {
      v = splay(key, v, comparator);
      var cmp = comparator(v.key, key);

      if (cmp === 0) {
        left = v.left;
        right = v.right;
      } else if (cmp < 0) {
        right = v.right;
        v.right = null;
        left = v;
      } else {
        left = v.left;
        v.left = null;
        right = v;
      }
    }

    return {
      left: left,
      right: right
    };
  }

  function merge(left, right, comparator) {
    if (right === null) return left;
    if (left === null) return right;
    right = splay(left.key, right, comparator);
    right.left = left;
    return right;
  }
  /**
   * Prints level of the tree
   */


  function printRow(root, prefix, isTail, out, printNode) {
    if (root) {
      out("" + prefix + (isTail ? '└── ' : '├── ') + printNode(root) + "\n");
      var indent = prefix + (isTail ? '    ' : '│   ');
      if (root.left) printRow(root.left, indent, false, out, printNode);
      if (root.right) printRow(root.right, indent, true, out, printNode);
    }
  }

  var Tree =
  /** @class */
  function () {
    function Tree(comparator) {
      if (comparator === void 0) {
        comparator = DEFAULT_COMPARE;
      }

      this._root = null;
      this._size = 0;
      this._comparator = comparator;
    }
    /**
     * Inserts a key, allows duplicates
     */


    Tree.prototype.insert = function (key, data) {
      this._size++;
      return this._root = insert(key, data, this._root, this._comparator);
    };
    /**
     * Adds a key, if it is not present in the tree
     */


    Tree.prototype.add = function (key, data) {
      var node = new Node(key, data);

      if (this._root === null) {
        node.left = node.right = null;
        this._size++;
        this._root = node;
      }

      var comparator = this._comparator;
      var t = splay(key, this._root, comparator);
      var cmp = comparator(key, t.key);
      if (cmp === 0) this._root = t;else {
        if (cmp < 0) {
          node.left = t.left;
          node.right = t;
          t.left = null;
        } else if (cmp > 0) {
          node.right = t.right;
          node.left = t;
          t.right = null;
        }

        this._size++;
        this._root = node;
      }
      return this._root;
    };
    /**
     * @param  {Key} key
     * @return {Node|null}
     */


    Tree.prototype.remove = function (key) {
      this._root = this._remove(key, this._root, this._comparator);
    };
    /**
     * Deletes i from the tree if it's there
     */


    Tree.prototype._remove = function (i, t, comparator) {
      var x;
      if (t === null) return null;
      t = splay(i, t, comparator);
      var cmp = comparator(i, t.key);

      if (cmp === 0) {
        /* found it */
        if (t.left === null) {
          x = t.right;
        } else {
          x = splay(i, t.left, comparator);
          x.right = t.right;
        }

        this._size--;
        return x;
      }

      return t;
      /* It wasn't there */
    };
    /**
     * Removes and returns the node with smallest key
     */


    Tree.prototype.pop = function () {
      var node = this._root;

      if (node) {
        while (node.left) {
          node = node.left;
        }

        this._root = splay(node.key, this._root, this._comparator);
        this._root = this._remove(node.key, this._root, this._comparator);
        return {
          key: node.key,
          data: node.data
        };
      }

      return null;
    };
    /**
     * Find without splaying
     */


    Tree.prototype.findStatic = function (key) {
      var current = this._root;
      var compare = this._comparator;

      while (current) {
        var cmp = compare(key, current.key);
        if (cmp === 0) return current;else if (cmp < 0) current = current.left;else current = current.right;
      }

      return null;
    };

    Tree.prototype.find = function (key) {
      if (this._root) {
        this._root = splay(key, this._root, this._comparator);
        if (this._comparator(key, this._root.key) !== 0) return null;
      }

      return this._root;
    };

    Tree.prototype.contains = function (key) {
      var current = this._root;
      var compare = this._comparator;

      while (current) {
        var cmp = compare(key, current.key);
        if (cmp === 0) return true;else if (cmp < 0) current = current.left;else current = current.right;
      }

      return false;
    };

    Tree.prototype.forEach = function (visitor, ctx) {
      var current = this._root;
      var Q = [];
      /* Initialize stack s */

      var done = false;

      while (!done) {
        if (current !== null) {
          Q.push(current);
          current = current.left;
        } else {
          if (Q.length !== 0) {
            current = Q.pop();
            visitor.call(ctx, current);
            current = current.right;
          } else done = true;
        }
      }

      return this;
    };
    /**
     * Walk key range from `low` to `high`. Stops if `fn` returns a value.
     */


    Tree.prototype.range = function (low, high, fn, ctx) {
      var Q = [];
      var compare = this._comparator;
      var node = this._root;
      var cmp;

      while (Q.length !== 0 || node) {
        if (node) {
          Q.push(node);
          node = node.left;
        } else {
          node = Q.pop();
          cmp = compare(node.key, high);

          if (cmp > 0) {
            break;
          } else if (compare(node.key, low) >= 0) {
            if (fn.call(ctx, node)) return this; // stop if smth is returned
          }

          node = node.right;
        }
      }

      return this;
    };
    /**
     * Returns array of keys
     */


    Tree.prototype.keys = function () {
      var keys = [];
      this.forEach(function (_a) {
        var key = _a.key;
        return keys.push(key);
      });
      return keys;
    };
    /**
     * Returns array of all the data in the nodes
     */


    Tree.prototype.values = function () {
      var values = [];
      this.forEach(function (_a) {
        var data = _a.data;
        return values.push(data);
      });
      return values;
    };

    Tree.prototype.min = function () {
      if (this._root) return this.minNode(this._root).key;
      return null;
    };

    Tree.prototype.max = function () {
      if (this._root) return this.maxNode(this._root).key;
      return null;
    };

    Tree.prototype.minNode = function (t) {
      if (t === void 0) {
        t = this._root;
      }

      if (t) while (t.left) {
        t = t.left;
      }
      return t;
    };

    Tree.prototype.maxNode = function (t) {
      if (t === void 0) {
        t = this._root;
      }

      if (t) while (t.right) {
        t = t.right;
      }
      return t;
    };
    /**
     * Returns node at given index
     */


    Tree.prototype.at = function (index) {
      var current = this._root;
      var done = false;
      var i = 0;
      var Q = [];

      while (!done) {
        if (current) {
          Q.push(current);
          current = current.left;
        } else {
          if (Q.length > 0) {
            current = Q.pop();
            if (i === index) return current;
            i++;
            current = current.right;
          } else done = true;
        }
      }

      return null;
    };

    Tree.prototype.next = function (d) {
      var root = this._root;
      var successor = null;

      if (d.right) {
        successor = d.right;

        while (successor.left) {
          successor = successor.left;
        }

        return successor;
      }

      var comparator = this._comparator;

      while (root) {
        var cmp = comparator(d.key, root.key);
        if (cmp === 0) break;else if (cmp < 0) {
          successor = root;
          root = root.left;
        } else root = root.right;
      }

      return successor;
    };

    Tree.prototype.prev = function (d) {
      var root = this._root;
      var predecessor = null;

      if (d.left !== null) {
        predecessor = d.left;

        while (predecessor.right) {
          predecessor = predecessor.right;
        }

        return predecessor;
      }

      var comparator = this._comparator;

      while (root) {
        var cmp = comparator(d.key, root.key);
        if (cmp === 0) break;else if (cmp < 0) root = root.left;else {
          predecessor = root;
          root = root.right;
        }
      }

      return predecessor;
    };

    Tree.prototype.clear = function () {
      this._root = null;
      this._size = 0;
      return this;
    };

    Tree.prototype.toList = function () {
      return toList(this._root);
    };
    /**
     * Bulk-load items. Both array have to be same size
     */


    Tree.prototype.load = function (keys, values, presort) {
      if (values === void 0) {
        values = [];
      }

      if (presort === void 0) {
        presort = false;
      }

      var size = keys.length;
      var comparator = this._comparator; // sort if needed

      if (presort) sort(keys, values, 0, size - 1, comparator);

      if (this._root === null) {
        // empty tree
        this._root = loadRecursive(keys, values, 0, size);
        this._size = size;
      } else {
        // that re-builds the whole tree from two in-order traversals
        var mergedList = mergeLists(this.toList(), createList(keys, values), comparator);
        size = this._size + size;
        this._root = sortedListToBST({
          head: mergedList
        }, 0, size);
      }

      return this;
    };

    Tree.prototype.isEmpty = function () {
      return this._root === null;
    };

    Object.defineProperty(Tree.prototype, "size", {
      get: function get() {
        return this._size;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(Tree.prototype, "root", {
      get: function get() {
        return this._root;
      },
      enumerable: true,
      configurable: true
    });

    Tree.prototype.toString = function (printNode) {
      if (printNode === void 0) {
        printNode = function printNode(n) {
          return String(n.key);
        };
      }

      var out = [];
      printRow(this._root, '', true, function (v) {
        return out.push(v);
      }, printNode);
      return out.join('');
    };

    Tree.prototype.update = function (key, newKey, newData) {
      var comparator = this._comparator;

      var _a = split(key, this._root, comparator),
          left = _a.left,
          right = _a.right;

      if (comparator(key, newKey) < 0) {
        right = insert(newKey, newData, right, comparator);
      } else {
        left = insert(newKey, newData, left, comparator);
      }

      this._root = merge(left, right, comparator);
    };

    Tree.prototype.split = function (key) {
      return split(key, this._root, this._comparator);
    };

    return Tree;
  }();

  function loadRecursive(keys, values, start, end) {
    var size = end - start;

    if (size > 0) {
      var middle = start + Math.floor(size / 2);
      var key = keys[middle];
      var data = values[middle];
      var node = new Node(key, data);
      node.left = loadRecursive(keys, values, start, middle);
      node.right = loadRecursive(keys, values, middle + 1, end);
      return node;
    }

    return null;
  }

  function createList(keys, values) {
    var head = new Node(null, null);
    var p = head;

    for (var i = 0; i < keys.length; i++) {
      p = p.next = new Node(keys[i], values[i]);
    }

    p.next = null;
    return head.next;
  }

  function toList(root) {
    var current = root;
    var Q = [];
    var done = false;
    var head = new Node(null, null);
    var p = head;

    while (!done) {
      if (current) {
        Q.push(current);
        current = current.left;
      } else {
        if (Q.length > 0) {
          current = p = p.next = Q.pop();
          current = current.right;
        } else done = true;
      }
    }

    p.next = null; // that'll work even if the tree was empty

    return head.next;
  }

  function sortedListToBST(list, start, end) {
    var size = end - start;

    if (size > 0) {
      var middle = start + Math.floor(size / 2);
      var left = sortedListToBST(list, start, middle);
      var root = list.head;
      root.left = left;
      list.head = list.head.next;
      root.right = sortedListToBST(list, middle + 1, end);
      return root;
    }

    return null;
  }

  function mergeLists(l1, l2, compare) {
    var head = new Node(null, null); // dummy

    var p = head;
    var p1 = l1;
    var p2 = l2;

    while (p1 !== null && p2 !== null) {
      if (compare(p1.key, p2.key) < 0) {
        p.next = p1;
        p1 = p1.next;
      } else {
        p.next = p2;
        p2 = p2.next;
      }

      p = p.next;
    }

    if (p1 !== null) {
      p.next = p1;
    } else if (p2 !== null) {
      p.next = p2;
    }

    return head.next;
  }

  function sort(keys, values, left, right, compare) {
    if (left >= right) return;
    var pivot = keys[left + right >> 1];
    var i = left - 1;
    var j = right + 1;

    while (true) {
      do {
        i++;
      } while (compare(keys[i], pivot) < 0);

      do {
        j--;
      } while (compare(keys[j], pivot) > 0);

      if (i >= j) break;
      var tmp = keys[i];
      keys[i] = keys[j];
      keys[j] = tmp;
      tmp = values[i];
      values[i] = values[j];
      values[j] = tmp;
    }

    sort(keys, values, left, j, compare);
    sort(keys, values, j + 1, right, compare);
  }

  /**
   * A bounding box has the format:
   *
   *  { ll: { x: xmin, y: ymin }, ur: { x: xmax, y: ymax } }
   *
   */
  var isInBbox = function isInBbox(bbox, point) {
    return bbox.ll.x <= point.x && point.x <= bbox.ur.x && bbox.ll.y <= point.y && point.y <= bbox.ur.y;
  };
  /* Returns either null, or a bbox (aka an ordered pair of points)
   * If there is only one point of overlap, a bbox with identical points
   * will be returned */

  var getBboxOverlap = function getBboxOverlap(b1, b2) {
    // check if the bboxes overlap at all
    if (b2.ur.x < b1.ll.x || b1.ur.x < b2.ll.x || b2.ur.y < b1.ll.y || b1.ur.y < b2.ll.y) return null; // find the middle two X values

    var lowerX = b1.ll.x < b2.ll.x ? b2.ll.x : b1.ll.x;
    var upperX = b1.ur.x < b2.ur.x ? b1.ur.x : b2.ur.x; // find the middle two Y values

    var lowerY = b1.ll.y < b2.ll.y ? b2.ll.y : b1.ll.y;
    var upperY = b1.ur.y < b2.ur.y ? b1.ur.y : b2.ur.y; // put those middle values together to get the overlap

    return {
      ll: {
        x: lowerX,
        y: lowerY
      },
      ur: {
        x: upperX,
        y: upperY
      }
    };
  };

  /* Javascript doesn't do integer math. Everything is
   * floating point with percision Number.EPSILON.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
   */
  var epsilon = Number.EPSILON; // IE Polyfill

  if (epsilon === undefined) epsilon = Math.pow(2, -52);
  var EPSILON_SQ = epsilon * epsilon;
  /* FLP comparator */

  var cmp = function cmp(a, b) {
    // check if they're both 0
    if (-epsilon < a && a < epsilon) {
      if (-epsilon < b && b < epsilon) {
        return 0;
      }
    } // check if they're flp equal


    var ab = a - b;

    if (ab * ab < EPSILON_SQ * a * b) {
      return 0;
    } // normal comparison


    return a < b ? -1 : 1;
  };

  /**
   * This class rounds incoming values sufficiently so that
   * floating points problems are, for the most part, avoided.
   *
   * Incoming points are have their x & y values tested against
   * all previously seen x & y values. If either is 'too close'
   * to a previously seen value, it's value is 'snapped' to the
   * previously seen value.
   *
   * All points should be rounded by this class before being
   * stored in any data structures in the rest of this algorithm.
   */

  var PtRounder = /*#__PURE__*/function () {
    function PtRounder() {
      _classCallCheck(this, PtRounder);

      this.reset();
    }

    _createClass(PtRounder, [{
      key: "reset",
      value: function reset() {
        this.xRounder = new CoordRounder();
        this.yRounder = new CoordRounder();
      }
    }, {
      key: "round",
      value: function round(x, y) {
        return {
          x: this.xRounder.round(x),
          y: this.yRounder.round(y)
        };
      }
    }]);

    return PtRounder;
  }();

  var CoordRounder = /*#__PURE__*/function () {
    function CoordRounder() {
      _classCallCheck(this, CoordRounder);

      this.tree = new Tree(); // preseed with 0 so we don't end up with values < Number.EPSILON

      this.round(0);
    } // Note: this can rounds input values backwards or forwards.
    //       You might ask, why not restrict this to just rounding
    //       forwards? Wouldn't that allow left endpoints to always
    //       remain left endpoints during splitting (never change to
    //       right). No - it wouldn't, because we snap intersections
    //       to endpoints (to establish independence from the segment
    //       angle for t-intersections).


    _createClass(CoordRounder, [{
      key: "round",
      value: function round(coord) {
        var node = this.tree.add(coord);
        var prevNode = this.tree.prev(node);

        if (prevNode !== null && cmp(node.key, prevNode.key) === 0) {
          this.tree.remove(coord);
          return prevNode.key;
        }

        var nextNode = this.tree.next(node);

        if (nextNode !== null && cmp(node.key, nextNode.key) === 0) {
          this.tree.remove(coord);
          return nextNode.key;
        }

        return coord;
      }
    }]);

    return CoordRounder;
  }(); // singleton available by import


  var rounder = new PtRounder();

  /* Cross Product of two vectors with first point at origin */

  var crossProduct = function crossProduct(a, b) {
    return a.x * b.y - a.y * b.x;
  };
  /* Dot Product of two vectors with first point at origin */

  var dotProduct = function dotProduct(a, b) {
    return a.x * b.x + a.y * b.y;
  };
  /* Comparator for two vectors with same starting point */

  var compareVectorAngles = function compareVectorAngles(basePt, endPt1, endPt2) {
    var v1 = {
      x: endPt1.x - basePt.x,
      y: endPt1.y - basePt.y
    };
    var v2 = {
      x: endPt2.x - basePt.x,
      y: endPt2.y - basePt.y
    };
    var kross = crossProduct(v1, v2);
    return cmp(kross, 0);
  };
  var length = function length(v) {
    return Math.sqrt(dotProduct(v, v));
  };
  /* Get the sine of the angle from pShared -> pAngle to pShaed -> pBase */

  var sineOfAngle = function sineOfAngle(pShared, pBase, pAngle) {
    var vBase = {
      x: pBase.x - pShared.x,
      y: pBase.y - pShared.y
    };
    var vAngle = {
      x: pAngle.x - pShared.x,
      y: pAngle.y - pShared.y
    };
    return crossProduct(vAngle, vBase) / length(vAngle) / length(vBase);
  };
  /* Get the cosine of the angle from pShared -> pAngle to pShaed -> pBase */

  var cosineOfAngle = function cosineOfAngle(pShared, pBase, pAngle) {
    var vBase = {
      x: pBase.x - pShared.x,
      y: pBase.y - pShared.y
    };
    var vAngle = {
      x: pAngle.x - pShared.x,
      y: pAngle.y - pShared.y
    };
    return dotProduct(vAngle, vBase) / length(vAngle) / length(vBase);
  };
  /* Get the x coordinate where the given line (defined by a point and vector)
   * crosses the horizontal line with the given y coordiante.
   * In the case of parrallel lines (including overlapping ones) returns null. */

  var horizontalIntersection = function horizontalIntersection(pt, v, y) {
    if (v.y === 0) return null;
    return {
      x: pt.x + v.x / v.y * (y - pt.y),
      y: y
    };
  };
  /* Get the y coordinate where the given line (defined by a point and vector)
   * crosses the vertical line with the given x coordiante.
   * In the case of parrallel lines (including overlapping ones) returns null. */

  var verticalIntersection = function verticalIntersection(pt, v, x) {
    if (v.x === 0) return null;
    return {
      x: x,
      y: pt.y + v.y / v.x * (x - pt.x)
    };
  };
  /* Get the intersection of two lines, each defined by a base point and a vector.
   * In the case of parrallel lines (including overlapping ones) returns null. */

  var intersection = function intersection(pt1, v1, pt2, v2) {
    // take some shortcuts for vertical and horizontal lines
    // this also ensures we don't calculate an intersection and then discover
    // it's actually outside the bounding box of the line
    if (v1.x === 0) return verticalIntersection(pt2, v2, pt1.x);
    if (v2.x === 0) return verticalIntersection(pt1, v1, pt2.x);
    if (v1.y === 0) return horizontalIntersection(pt2, v2, pt1.y);
    if (v2.y === 0) return horizontalIntersection(pt1, v1, pt2.y); // General case for non-overlapping segments.
    // This algorithm is based on Schneider and Eberly.
    // http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf - pg 244

    var kross = crossProduct(v1, v2);
    if (kross == 0) return null;
    var ve = {
      x: pt2.x - pt1.x,
      y: pt2.y - pt1.y
    };
    var d1 = crossProduct(ve, v1) / kross;
    var d2 = crossProduct(ve, v2) / kross; // take the average of the two calculations to minimize rounding error

    var x1 = pt1.x + d2 * v1.x,
        x2 = pt2.x + d1 * v2.x;
    var y1 = pt1.y + d2 * v1.y,
        y2 = pt2.y + d1 * v2.y;
    var x = (x1 + x2) / 2;
    var y = (y1 + y2) / 2;
    return {
      x: x,
      y: y
    };
  };

  var SweepEvent = /*#__PURE__*/function () {
    _createClass(SweepEvent, null, [{
      key: "compare",
      // for ordering sweep events in the sweep event queue
      value: function compare(a, b) {
        // favor event with a point that the sweep line hits first
        var ptCmp = SweepEvent.comparePoints(a.point, b.point);
        if (ptCmp !== 0) return ptCmp; // the points are the same, so link them if needed

        if (a.point !== b.point) a.link(b); // favor right events over left

        if (a.isLeft !== b.isLeft) return a.isLeft ? 1 : -1; // we have two matching left or right endpoints
        // ordering of this case is the same as for their segments

        return Segment.compare(a.segment, b.segment);
      } // for ordering points in sweep line order

    }, {
      key: "comparePoints",
      value: function comparePoints(aPt, bPt) {
        if (aPt.x < bPt.x) return -1;
        if (aPt.x > bPt.x) return 1;
        if (aPt.y < bPt.y) return -1;
        if (aPt.y > bPt.y) return 1;
        return 0;
      } // Warning: 'point' input will be modified and re-used (for performance)

    }]);

    function SweepEvent(point, isLeft) {
      _classCallCheck(this, SweepEvent);

      if (point.events === undefined) point.events = [this];else point.events.push(this);
      this.point = point;
      this.isLeft = isLeft; // this.segment, this.otherSE set by factory
    }

    _createClass(SweepEvent, [{
      key: "link",
      value: function link(other) {
        if (other.point === this.point) {
          throw new Error('Tried to link already linked events');
        }

        var otherEvents = other.point.events;

        for (var i = 0, iMax = otherEvents.length; i < iMax; i++) {
          var evt = otherEvents[i];
          this.point.events.push(evt);
          evt.point = this.point;
        }

        this.checkForConsuming();
      }
      /* Do a pass over our linked events and check to see if any pair
       * of segments match, and should be consumed. */

    }, {
      key: "checkForConsuming",
      value: function checkForConsuming() {
        // FIXME: The loops in this method run O(n^2) => no good.
        //        Maintain little ordered sweep event trees?
        //        Can we maintaining an ordering that avoids the need
        //        for the re-sorting with getLeftmostComparator in geom-out?
        // Compare each pair of events to see if other events also match
        var numEvents = this.point.events.length;

        for (var i = 0; i < numEvents; i++) {
          var evt1 = this.point.events[i];
          if (evt1.segment.consumedBy !== undefined) continue;

          for (var j = i + 1; j < numEvents; j++) {
            var evt2 = this.point.events[j];
            if (evt2.consumedBy !== undefined) continue;
            if (evt1.otherSE.point.events !== evt2.otherSE.point.events) continue;
            evt1.segment.consume(evt2.segment);
          }
        }
      }
    }, {
      key: "getAvailableLinkedEvents",
      value: function getAvailableLinkedEvents() {
        // point.events is always of length 2 or greater
        var events = [];

        for (var i = 0, iMax = this.point.events.length; i < iMax; i++) {
          var evt = this.point.events[i];

          if (evt !== this && !evt.segment.ringOut && evt.segment.isInResult()) {
            events.push(evt);
          }
        }

        return events;
      }
      /**
       * Returns a comparator function for sorting linked events that will
       * favor the event that will give us the smallest left-side angle.
       * All ring construction starts as low as possible heading to the right,
       * so by always turning left as sharp as possible we'll get polygons
       * without uncessary loops & holes.
       *
       * The comparator function has a compute cache such that it avoids
       * re-computing already-computed values.
       */

    }, {
      key: "getLeftmostComparator",
      value: function getLeftmostComparator(baseEvent) {
        var _this = this;

        var cache = new Map();

        var fillCache = function fillCache(linkedEvent) {
          var nextEvent = linkedEvent.otherSE;
          cache.set(linkedEvent, {
            sine: sineOfAngle(_this.point, baseEvent.point, nextEvent.point),
            cosine: cosineOfAngle(_this.point, baseEvent.point, nextEvent.point)
          });
        };

        return function (a, b) {
          if (!cache.has(a)) fillCache(a);
          if (!cache.has(b)) fillCache(b);

          var _cache$get = cache.get(a),
              asine = _cache$get.sine,
              acosine = _cache$get.cosine;

          var _cache$get2 = cache.get(b),
              bsine = _cache$get2.sine,
              bcosine = _cache$get2.cosine; // both on or above x-axis


          if (asine >= 0 && bsine >= 0) {
            if (acosine < bcosine) return 1;
            if (acosine > bcosine) return -1;
            return 0;
          } // both below x-axis


          if (asine < 0 && bsine < 0) {
            if (acosine < bcosine) return -1;
            if (acosine > bcosine) return 1;
            return 0;
          } // one above x-axis, one below


          if (bsine < asine) return -1;
          if (bsine > asine) return 1;
          return 0;
        };
      }
    }]);

    return SweepEvent;
  }();

  // segments and sweep events when all else is identical

  var segmentId = 0;

  var Segment = /*#__PURE__*/function () {
    _createClass(Segment, null, [{
      key: "compare",

      /* This compare() function is for ordering segments in the sweep
       * line tree, and does so according to the following criteria:
       *
       * Consider the vertical line that lies an infinestimal step to the
       * right of the right-more of the two left endpoints of the input
       * segments. Imagine slowly moving a point up from negative infinity
       * in the increasing y direction. Which of the two segments will that
       * point intersect first? That segment comes 'before' the other one.
       *
       * If neither segment would be intersected by such a line, (if one
       * or more of the segments are vertical) then the line to be considered
       * is directly on the right-more of the two left inputs.
       */
      value: function compare(a, b) {
        var alx = a.leftSE.point.x;
        var blx = b.leftSE.point.x;
        var arx = a.rightSE.point.x;
        var brx = b.rightSE.point.x; // check if they're even in the same vertical plane

        if (brx < alx) return 1;
        if (arx < blx) return -1;
        var aly = a.leftSE.point.y;
        var bly = b.leftSE.point.y;
        var ary = a.rightSE.point.y;
        var bry = b.rightSE.point.y; // is left endpoint of segment B the right-more?

        if (alx < blx) {
          // are the two segments in the same horizontal plane?
          if (bly < aly && bly < ary) return 1;
          if (bly > aly && bly > ary) return -1; // is the B left endpoint colinear to segment A?

          var aCmpBLeft = a.comparePoint(b.leftSE.point);
          if (aCmpBLeft < 0) return 1;
          if (aCmpBLeft > 0) return -1; // is the A right endpoint colinear to segment B ?

          var bCmpARight = b.comparePoint(a.rightSE.point);
          if (bCmpARight !== 0) return bCmpARight; // colinear segments, consider the one with left-more
          // left endpoint to be first (arbitrary?)

          return -1;
        } // is left endpoint of segment A the right-more?


        if (alx > blx) {
          if (aly < bly && aly < bry) return -1;
          if (aly > bly && aly > bry) return 1; // is the A left endpoint colinear to segment B?

          var bCmpALeft = b.comparePoint(a.leftSE.point);
          if (bCmpALeft !== 0) return bCmpALeft; // is the B right endpoint colinear to segment A?

          var aCmpBRight = a.comparePoint(b.rightSE.point);
          if (aCmpBRight < 0) return 1;
          if (aCmpBRight > 0) return -1; // colinear segments, consider the one with left-more
          // left endpoint to be first (arbitrary?)

          return 1;
        } // if we get here, the two left endpoints are in the same
        // vertical plane, ie alx === blx
        // consider the lower left-endpoint to come first


        if (aly < bly) return -1;
        if (aly > bly) return 1; // left endpoints are identical
        // check for colinearity by using the left-more right endpoint
        // is the A right endpoint more left-more?

        if (arx < brx) {
          var _bCmpARight = b.comparePoint(a.rightSE.point);

          if (_bCmpARight !== 0) return _bCmpARight;
        } // is the B right endpoint more left-more?


        if (arx > brx) {
          var _aCmpBRight = a.comparePoint(b.rightSE.point);

          if (_aCmpBRight < 0) return 1;
          if (_aCmpBRight > 0) return -1;
        }

        if (arx !== brx) {
          // are these two [almost] vertical segments with opposite orientation?
          // if so, the one with the lower right endpoint comes first
          var ay = ary - aly;
          var ax = arx - alx;
          var by = bry - bly;
          var bx = brx - blx;
          if (ay > ax && by < bx) return 1;
          if (ay < ax && by > bx) return -1;
        } // we have colinear segments with matching orientation
        // consider the one with more left-more right endpoint to be first


        if (arx > brx) return 1;
        if (arx < brx) return -1; // if we get here, two two right endpoints are in the same
        // vertical plane, ie arx === brx
        // consider the lower right-endpoint to come first

        if (ary < bry) return -1;
        if (ary > bry) return 1; // right endpoints identical as well, so the segments are idential
        // fall back on creation order as consistent tie-breaker

        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1; // identical segment, ie a === b

        return 0;
      }
      /* Warning: a reference to ringWindings input will be stored,
       *  and possibly will be later modified */

    }]);

    function Segment(leftSE, rightSE, rings, windings) {
      _classCallCheck(this, Segment);

      this.id = ++segmentId;
      this.leftSE = leftSE;
      leftSE.segment = this;
      leftSE.otherSE = rightSE;
      this.rightSE = rightSE;
      rightSE.segment = this;
      rightSE.otherSE = leftSE;
      this.rings = rings;
      this.windings = windings; // left unset for performance, set later in algorithm
      // this.ringOut, this.consumedBy, this.prev
    }

    _createClass(Segment, [{
      key: "replaceRightSE",

      /* When a segment is split, the rightSE is replaced with a new sweep event */
      value: function replaceRightSE(newRightSE) {
        this.rightSE = newRightSE;
        this.rightSE.segment = this;
        this.rightSE.otherSE = this.leftSE;
        this.leftSE.otherSE = this.rightSE;
      }
    }, {
      key: "bbox",
      value: function bbox() {
        var y1 = this.leftSE.point.y;
        var y2 = this.rightSE.point.y;
        return {
          ll: {
            x: this.leftSE.point.x,
            y: y1 < y2 ? y1 : y2
          },
          ur: {
            x: this.rightSE.point.x,
            y: y1 > y2 ? y1 : y2
          }
        };
      }
      /* A vector from the left point to the right */

    }, {
      key: "vector",
      value: function vector() {
        return {
          x: this.rightSE.point.x - this.leftSE.point.x,
          y: this.rightSE.point.y - this.leftSE.point.y
        };
      }
    }, {
      key: "isAnEndpoint",
      value: function isAnEndpoint(pt) {
        return pt.x === this.leftSE.point.x && pt.y === this.leftSE.point.y || pt.x === this.rightSE.point.x && pt.y === this.rightSE.point.y;
      }
      /* Compare this segment with a point.
       *
       * A point P is considered to be colinear to a segment if there
       * exists a distance D such that if we travel along the segment
       * from one * endpoint towards the other a distance D, we find
       * ourselves at point P.
       *
       * Return value indicates:
       *
       *   1: point lies above the segment (to the left of vertical)
       *   0: point is colinear to segment
       *  -1: point lies below the segment (to the right of vertical)
       */

    }, {
      key: "comparePoint",
      value: function comparePoint(point) {
        if (this.isAnEndpoint(point)) return 0;
        var lPt = this.leftSE.point;
        var rPt = this.rightSE.point;
        var v = this.vector(); // Exactly vertical segments.

        if (lPt.x === rPt.x) {
          if (point.x === lPt.x) return 0;
          return point.x < lPt.x ? 1 : -1;
        } // Nearly vertical segments with an intersection.
        // Check to see where a point on the line with matching Y coordinate is.


        var yDist = (point.y - lPt.y) / v.y;
        var xFromYDist = lPt.x + yDist * v.x;
        if (point.x === xFromYDist) return 0; // General case.
        // Check to see where a point on the line with matching X coordinate is.

        var xDist = (point.x - lPt.x) / v.x;
        var yFromXDist = lPt.y + xDist * v.y;
        if (point.y === yFromXDist) return 0;
        return point.y < yFromXDist ? -1 : 1;
      }
      /**
       * Given another segment, returns the first non-trivial intersection
       * between the two segments (in terms of sweep line ordering), if it exists.
       *
       * A 'non-trivial' intersection is one that will cause one or both of the
       * segments to be split(). As such, 'trivial' vs. 'non-trivial' intersection:
       *
       *   * endpoint of segA with endpoint of segB --> trivial
       *   * endpoint of segA with point along segB --> non-trivial
       *   * endpoint of segB with point along segA --> non-trivial
       *   * point along segA with point along segB --> non-trivial
       *
       * If no non-trivial intersection exists, return null
       * Else, return null.
       */

    }, {
      key: "getIntersection",
      value: function getIntersection(other) {
        // If bboxes don't overlap, there can't be any intersections
        var tBbox = this.bbox();
        var oBbox = other.bbox();
        var bboxOverlap = getBboxOverlap(tBbox, oBbox);
        if (bboxOverlap === null) return null; // We first check to see if the endpoints can be considered intersections.
        // This will 'snap' intersections to endpoints if possible, and will
        // handle cases of colinearity.

        var tlp = this.leftSE.point;
        var trp = this.rightSE.point;
        var olp = other.leftSE.point;
        var orp = other.rightSE.point; // does each endpoint touch the other segment?
        // note that we restrict the 'touching' definition to only allow segments
        // to touch endpoints that lie forward from where we are in the sweep line pass

        var touchesOtherLSE = isInBbox(tBbox, olp) && this.comparePoint(olp) === 0;
        var touchesThisLSE = isInBbox(oBbox, tlp) && other.comparePoint(tlp) === 0;
        var touchesOtherRSE = isInBbox(tBbox, orp) && this.comparePoint(orp) === 0;
        var touchesThisRSE = isInBbox(oBbox, trp) && other.comparePoint(trp) === 0; // do left endpoints match?

        if (touchesThisLSE && touchesOtherLSE) {
          // these two cases are for colinear segments with matching left
          // endpoints, and one segment being longer than the other
          if (touchesThisRSE && !touchesOtherRSE) return trp;
          if (!touchesThisRSE && touchesOtherRSE) return orp; // either the two segments match exactly (two trival intersections)
          // or just on their left endpoint (one trivial intersection

          return null;
        } // does this left endpoint matches (other doesn't)


        if (touchesThisLSE) {
          // check for segments that just intersect on opposing endpoints
          if (touchesOtherRSE) {
            if (tlp.x === orp.x && tlp.y === orp.y) return null;
          } // t-intersection on left endpoint


          return tlp;
        } // does other left endpoint matches (this doesn't)


        if (touchesOtherLSE) {
          // check for segments that just intersect on opposing endpoints
          if (touchesThisRSE) {
            if (trp.x === olp.x && trp.y === olp.y) return null;
          } // t-intersection on left endpoint


          return olp;
        } // trivial intersection on right endpoints


        if (touchesThisRSE && touchesOtherRSE) return null; // t-intersections on just one right endpoint

        if (touchesThisRSE) return trp;
        if (touchesOtherRSE) return orp; // None of our endpoints intersect. Look for a general intersection between
        // infinite lines laid over the segments

        var pt = intersection(tlp, this.vector(), olp, other.vector()); // are the segments parrallel? Note that if they were colinear with overlap,
        // they would have an endpoint intersection and that case was already handled above

        if (pt === null) return null; // is the intersection found between the lines not on the segments?

        if (!isInBbox(bboxOverlap, pt)) return null; // round the the computed point if needed

        return rounder.round(pt.x, pt.y);
      }
      /**
       * Split the given segment into multiple segments on the given points.
       *  * Each existing segment will retain its leftSE and a new rightSE will be
       *    generated for it.
       *  * A new segment will be generated which will adopt the original segment's
       *    rightSE, and a new leftSE will be generated for it.
       *  * If there are more than two points given to split on, new segments
       *    in the middle will be generated with new leftSE and rightSE's.
       *  * An array of the newly generated SweepEvents will be returned.
       *
       * Warning: input array of points is modified
       */

    }, {
      key: "split",
      value: function split(point) {
        var newEvents = [];
        var alreadyLinked = point.events !== undefined;
        var newLeftSE = new SweepEvent(point, true);
        var newRightSE = new SweepEvent(point, false);
        var oldRightSE = this.rightSE;
        this.replaceRightSE(newRightSE);
        newEvents.push(newRightSE);
        newEvents.push(newLeftSE);
        var newSeg = new Segment(newLeftSE, oldRightSE, this.rings.slice(), this.windings.slice()); // when splitting a nearly vertical downward-facing segment,
        // sometimes one of the resulting new segments is vertical, in which
        // case its left and right events may need to be swapped

        if (SweepEvent.comparePoints(newSeg.leftSE.point, newSeg.rightSE.point) > 0) {
          newSeg.swapEvents();
        }

        if (SweepEvent.comparePoints(this.leftSE.point, this.rightSE.point) > 0) {
          this.swapEvents();
        } // in the point we just used to create new sweep events with was already
        // linked to other events, we need to check if either of the affected
        // segments should be consumed


        if (alreadyLinked) {
          newLeftSE.checkForConsuming();
          newRightSE.checkForConsuming();
        }

        return newEvents;
      }
      /* Swap which event is left and right */

    }, {
      key: "swapEvents",
      value: function swapEvents() {
        var tmpEvt = this.rightSE;
        this.rightSE = this.leftSE;
        this.leftSE = tmpEvt;
        this.leftSE.isLeft = true;
        this.rightSE.isLeft = false;

        for (var i = 0, iMax = this.windings.length; i < iMax; i++) {
          this.windings[i] *= -1;
        }
      }
      /* Consume another segment. We take their rings under our wing
       * and mark them as consumed. Use for perfectly overlapping segments */

    }, {
      key: "consume",
      value: function consume(other) {
        var consumer = this;
        var consumee = other;

        while (consumer.consumedBy) {
          consumer = consumer.consumedBy;
        }

        while (consumee.consumedBy) {
          consumee = consumee.consumedBy;
        }

        var cmp = Segment.compare(consumer, consumee);
        if (cmp === 0) return; // already consumed
        // the winner of the consumption is the earlier segment
        // according to sweep line ordering

        if (cmp > 0) {
          var tmp = consumer;
          consumer = consumee;
          consumee = tmp;
        } // make sure a segment doesn't consume it's prev


        if (consumer.prev === consumee) {
          var _tmp = consumer;
          consumer = consumee;
          consumee = _tmp;
        }

        for (var i = 0, iMax = consumee.rings.length; i < iMax; i++) {
          var ring = consumee.rings[i];
          var winding = consumee.windings[i];
          var index = consumer.rings.indexOf(ring);

          if (index === -1) {
            consumer.rings.push(ring);
            consumer.windings.push(winding);
          } else consumer.windings[index] += winding;
        }

        consumee.rings = null;
        consumee.windings = null;
        consumee.consumedBy = consumer; // mark sweep events consumed as to maintain ordering in sweep event queue

        consumee.leftSE.consumedBy = consumer.leftSE;
        consumee.rightSE.consumedBy = consumer.rightSE;
      }
      /* The first segment previous segment chain that is in the result */

    }, {
      key: "prevInResult",
      value: function prevInResult() {
        if (this._prevInResult !== undefined) return this._prevInResult;
        if (!this.prev) this._prevInResult = null;else if (this.prev.isInResult()) this._prevInResult = this.prev;else this._prevInResult = this.prev.prevInResult();
        return this._prevInResult;
      }
    }, {
      key: "beforeState",
      value: function beforeState() {
        if (this._beforeState !== undefined) return this._beforeState;
        if (!this.prev) this._beforeState = {
          rings: [],
          windings: [],
          multiPolys: []
        };else {
          var seg = this.prev.consumedBy || this.prev;
          this._beforeState = seg.afterState();
        }
        return this._beforeState;
      }
    }, {
      key: "afterState",
      value: function afterState() {
        if (this._afterState !== undefined) return this._afterState;
        var beforeState = this.beforeState();
        this._afterState = {
          rings: beforeState.rings.slice(0),
          windings: beforeState.windings.slice(0),
          multiPolys: []
        };
        var ringsAfter = this._afterState.rings;
        var windingsAfter = this._afterState.windings;
        var mpsAfter = this._afterState.multiPolys; // calculate ringsAfter, windingsAfter

        for (var i = 0, iMax = this.rings.length; i < iMax; i++) {
          var ring = this.rings[i];
          var winding = this.windings[i];
          var index = ringsAfter.indexOf(ring);

          if (index === -1) {
            ringsAfter.push(ring);
            windingsAfter.push(winding);
          } else windingsAfter[index] += winding;
        } // calcualte polysAfter


        var polysAfter = [];
        var polysExclude = [];

        for (var _i = 0, _iMax = ringsAfter.length; _i < _iMax; _i++) {
          if (windingsAfter[_i] === 0) continue; // non-zero rule

          var _ring = ringsAfter[_i];
          var poly = _ring.poly;
          if (polysExclude.indexOf(poly) !== -1) continue;
          if (_ring.isExterior) polysAfter.push(poly);else {
            if (polysExclude.indexOf(poly) === -1) polysExclude.push(poly);

            var _index = polysAfter.indexOf(_ring.poly);

            if (_index !== -1) polysAfter.splice(_index, 1);
          }
        } // calculate multiPolysAfter


        for (var _i2 = 0, _iMax2 = polysAfter.length; _i2 < _iMax2; _i2++) {
          var mp = polysAfter[_i2].multiPoly;
          if (mpsAfter.indexOf(mp) === -1) mpsAfter.push(mp);
        }

        return this._afterState;
      }
      /* Is this segment part of the final result? */

    }, {
      key: "isInResult",
      value: function isInResult() {
        // if we've been consumed, we're not in the result
        if (this.consumedBy) return false;
        if (this._isInResult !== undefined) return this._isInResult;
        var mpsBefore = this.beforeState().multiPolys;
        var mpsAfter = this.afterState().multiPolys;

        switch (operation.type) {
          case 'union':
            {
              // UNION - included iff:
              //  * On one side of us there is 0 poly interiors AND
              //  * On the other side there is 1 or more.
              var noBefores = mpsBefore.length === 0;
              var noAfters = mpsAfter.length === 0;
              this._isInResult = noBefores !== noAfters;
              break;
            }

          case 'intersection':
            {
              // INTERSECTION - included iff:
              //  * on one side of us all multipolys are rep. with poly interiors AND
              //  * on the other side of us, not all multipolys are repsented
              //    with poly interiors
              var least;
              var most;

              if (mpsBefore.length < mpsAfter.length) {
                least = mpsBefore.length;
                most = mpsAfter.length;
              } else {
                least = mpsAfter.length;
                most = mpsBefore.length;
              }

              this._isInResult = most === operation.numMultiPolys && least < most;
              break;
            }

          case 'xor':
            {
              // XOR - included iff:
              //  * the difference between the number of multipolys represented
              //    with poly interiors on our two sides is an odd number
              var diff = Math.abs(mpsBefore.length - mpsAfter.length);
              this._isInResult = diff % 2 === 1;
              break;
            }

          case 'difference':
            {
              // DIFFERENCE included iff:
              //  * on exactly one side, we have just the subject
              var isJustSubject = function isJustSubject(mps) {
                return mps.length === 1 && mps[0].isSubject;
              };

              this._isInResult = isJustSubject(mpsBefore) !== isJustSubject(mpsAfter);
              break;
            }

          default:
            throw new Error("Unrecognized operation type found ".concat(operation.type));
        }

        return this._isInResult;
      }
    }], [{
      key: "fromRing",
      value: function fromRing(pt1, pt2, ring) {
        var leftPt, rightPt, winding; // ordering the two points according to sweep line ordering

        var cmpPts = SweepEvent.comparePoints(pt1, pt2);

        if (cmpPts < 0) {
          leftPt = pt1;
          rightPt = pt2;
          winding = 1;
        } else if (cmpPts > 0) {
          leftPt = pt2;
          rightPt = pt1;
          winding = -1;
        } else throw new Error("Tried to create degenerate segment at [".concat(pt1.x, ", ").concat(pt1.y, "]"));

        var leftSE = new SweepEvent(leftPt, true);
        var rightSE = new SweepEvent(rightPt, false);
        return new Segment(leftSE, rightSE, [ring], [winding]);
      }
    }]);

    return Segment;
  }();

  var RingIn = /*#__PURE__*/function () {
    function RingIn(geomRing, poly, isExterior) {
      _classCallCheck(this, RingIn);

      if (!Array.isArray(geomRing) || geomRing.length === 0) {
        throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
      }

      this.poly = poly;
      this.isExterior = isExterior;
      this.segments = [];

      if (typeof geomRing[0][0] !== 'number' || typeof geomRing[0][1] !== 'number') {
        throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
      }

      var firstPoint = rounder.round(geomRing[0][0], geomRing[0][1]);
      this.bbox = {
        ll: {
          x: firstPoint.x,
          y: firstPoint.y
        },
        ur: {
          x: firstPoint.x,
          y: firstPoint.y
        }
      };
      var prevPoint = firstPoint;

      for (var i = 1, iMax = geomRing.length; i < iMax; i++) {
        if (typeof geomRing[i][0] !== 'number' || typeof geomRing[i][1] !== 'number') {
          throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
        }

        var point = rounder.round(geomRing[i][0], geomRing[i][1]); // skip repeated points

        if (point.x === prevPoint.x && point.y === prevPoint.y) continue;
        this.segments.push(Segment.fromRing(prevPoint, point, this));
        if (point.x < this.bbox.ll.x) this.bbox.ll.x = point.x;
        if (point.y < this.bbox.ll.y) this.bbox.ll.y = point.y;
        if (point.x > this.bbox.ur.x) this.bbox.ur.x = point.x;
        if (point.y > this.bbox.ur.y) this.bbox.ur.y = point.y;
        prevPoint = point;
      } // add segment from last to first if last is not the same as first


      if (firstPoint.x !== prevPoint.x || firstPoint.y !== prevPoint.y) {
        this.segments.push(Segment.fromRing(prevPoint, firstPoint, this));
      }
    }

    _createClass(RingIn, [{
      key: "getSweepEvents",
      value: function getSweepEvents() {
        var sweepEvents = [];

        for (var i = 0, iMax = this.segments.length; i < iMax; i++) {
          var segment = this.segments[i];
          sweepEvents.push(segment.leftSE);
          sweepEvents.push(segment.rightSE);
        }

        return sweepEvents;
      }
    }]);

    return RingIn;
  }();
  var PolyIn = /*#__PURE__*/function () {
    function PolyIn(geomPoly, multiPoly) {
      _classCallCheck(this, PolyIn);

      if (!Array.isArray(geomPoly)) {
        throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
      }

      this.exteriorRing = new RingIn(geomPoly[0], this, true); // copy by value

      this.bbox = {
        ll: {
          x: this.exteriorRing.bbox.ll.x,
          y: this.exteriorRing.bbox.ll.y
        },
        ur: {
          x: this.exteriorRing.bbox.ur.x,
          y: this.exteriorRing.bbox.ur.y
        }
      };
      this.interiorRings = [];

      for (var i = 1, iMax = geomPoly.length; i < iMax; i++) {
        var ring = new RingIn(geomPoly[i], this, false);
        if (ring.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = ring.bbox.ll.x;
        if (ring.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = ring.bbox.ll.y;
        if (ring.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = ring.bbox.ur.x;
        if (ring.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = ring.bbox.ur.y;
        this.interiorRings.push(ring);
      }

      this.multiPoly = multiPoly;
    }

    _createClass(PolyIn, [{
      key: "getSweepEvents",
      value: function getSweepEvents() {
        var sweepEvents = this.exteriorRing.getSweepEvents();

        for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
          var ringSweepEvents = this.interiorRings[i].getSweepEvents();

          for (var j = 0, jMax = ringSweepEvents.length; j < jMax; j++) {
            sweepEvents.push(ringSweepEvents[j]);
          }
        }

        return sweepEvents;
      }
    }]);

    return PolyIn;
  }();
  var MultiPolyIn = /*#__PURE__*/function () {
    function MultiPolyIn(geom, isSubject) {
      _classCallCheck(this, MultiPolyIn);

      if (!Array.isArray(geom)) {
        throw new Error('Input geometry is not a valid Polygon or MultiPolygon');
      }

      try {
        // if the input looks like a polygon, convert it to a multipolygon
        if (typeof geom[0][0][0] === 'number') geom = [geom];
      } catch (ex) {// The input is either malformed or has empty arrays.
        // In either case, it will be handled later on.
      }

      this.polys = [];
      this.bbox = {
        ll: {
          x: Number.POSITIVE_INFINITY,
          y: Number.POSITIVE_INFINITY
        },
        ur: {
          x: Number.NEGATIVE_INFINITY,
          y: Number.NEGATIVE_INFINITY
        }
      };

      for (var i = 0, iMax = geom.length; i < iMax; i++) {
        var poly = new PolyIn(geom[i], this);
        if (poly.bbox.ll.x < this.bbox.ll.x) this.bbox.ll.x = poly.bbox.ll.x;
        if (poly.bbox.ll.y < this.bbox.ll.y) this.bbox.ll.y = poly.bbox.ll.y;
        if (poly.bbox.ur.x > this.bbox.ur.x) this.bbox.ur.x = poly.bbox.ur.x;
        if (poly.bbox.ur.y > this.bbox.ur.y) this.bbox.ur.y = poly.bbox.ur.y;
        this.polys.push(poly);
      }

      this.isSubject = isSubject;
    }

    _createClass(MultiPolyIn, [{
      key: "getSweepEvents",
      value: function getSweepEvents() {
        var sweepEvents = [];

        for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
          var polySweepEvents = this.polys[i].getSweepEvents();

          for (var j = 0, jMax = polySweepEvents.length; j < jMax; j++) {
            sweepEvents.push(polySweepEvents[j]);
          }
        }

        return sweepEvents;
      }
    }]);

    return MultiPolyIn;
  }();

  var RingOut = /*#__PURE__*/function () {
    _createClass(RingOut, null, [{
      key: "factory",

      /* Given the segments from the sweep line pass, compute & return a series
       * of closed rings from all the segments marked to be part of the result */
      value: function factory(allSegments) {
        var ringsOut = [];

        for (var i = 0, iMax = allSegments.length; i < iMax; i++) {
          var segment = allSegments[i];
          if (!segment.isInResult() || segment.ringOut) continue;
          var prevEvent = null;
          var event = segment.leftSE;
          var nextEvent = segment.rightSE;
          var events = [event];
          var startingPoint = event.point;
          var intersectionLEs = [];
          /* Walk the chain of linked events to form a closed ring */

          while (true) {
            prevEvent = event;
            event = nextEvent;
            events.push(event);
            /* Is the ring complete? */

            if (event.point === startingPoint) break;

            while (true) {
              var availableLEs = event.getAvailableLinkedEvents();
              /* Did we hit a dead end? This shouldn't happen. Indicates some earlier
               * part of the algorithm malfunctioned... please file a bug report. */

              if (availableLEs.length === 0) {
                var firstPt = events[0].point;
                var lastPt = events[events.length - 1].point;
                throw new Error("Unable to complete output ring starting at [".concat(firstPt.x, ",") + " ".concat(firstPt.y, "]. Last matching segment found ends at") + " [".concat(lastPt.x, ", ").concat(lastPt.y, "]."));
              }
              /* Only one way to go, so cotinue on the path */


              if (availableLEs.length === 1) {
                nextEvent = availableLEs[0].otherSE;
                break;
              }
              /* We must have an intersection. Check for a completed loop */


              var indexLE = null;

              for (var j = 0, jMax = intersectionLEs.length; j < jMax; j++) {
                if (intersectionLEs[j].point === event.point) {
                  indexLE = j;
                  break;
                }
              }
              /* Found a completed loop. Cut that off and make a ring */


              if (indexLE !== null) {
                var intersectionLE = intersectionLEs.splice(indexLE)[0];
                var ringEvents = events.splice(intersectionLE.index);
                ringEvents.unshift(ringEvents[0].otherSE);
                ringsOut.push(new RingOut(ringEvents.reverse()));
                continue;
              }
              /* register the intersection */


              intersectionLEs.push({
                index: events.length,
                point: event.point
              });
              /* Choose the left-most option to continue the walk */

              var comparator = event.getLeftmostComparator(prevEvent);
              nextEvent = availableLEs.sort(comparator)[0].otherSE;
              break;
            }
          }

          ringsOut.push(new RingOut(events));
        }

        return ringsOut;
      }
    }]);

    function RingOut(events) {
      _classCallCheck(this, RingOut);

      this.events = events;

      for (var i = 0, iMax = events.length; i < iMax; i++) {
        events[i].segment.ringOut = this;
      }

      this.poly = null;
    }

    _createClass(RingOut, [{
      key: "getGeom",
      value: function getGeom() {
        // Remove superfluous points (ie extra points along a straight line),
        var prevPt = this.events[0].point;
        var points = [prevPt];

        for (var i = 1, iMax = this.events.length - 1; i < iMax; i++) {
          var _pt = this.events[i].point;
          var _nextPt = this.events[i + 1].point;
          if (compareVectorAngles(_pt, prevPt, _nextPt) === 0) continue;
          points.push(_pt);
          prevPt = _pt;
        } // ring was all (within rounding error of angle calc) colinear points


        if (points.length === 1) return null; // check if the starting point is necessary

        var pt = points[0];
        var nextPt = points[1];
        if (compareVectorAngles(pt, prevPt, nextPt) === 0) points.shift();
        points.push(points[0]);
        var step = this.isExteriorRing() ? 1 : -1;
        var iStart = this.isExteriorRing() ? 0 : points.length - 1;
        var iEnd = this.isExteriorRing() ? points.length : -1;
        var orderedPoints = [];

        for (var _i = iStart; _i != iEnd; _i += step) {
          orderedPoints.push([points[_i].x, points[_i].y]);
        }

        return orderedPoints;
      }
    }, {
      key: "isExteriorRing",
      value: function isExteriorRing() {
        if (this._isExteriorRing === undefined) {
          var enclosing = this.enclosingRing();
          this._isExteriorRing = enclosing ? !enclosing.isExteriorRing() : true;
        }

        return this._isExteriorRing;
      }
    }, {
      key: "enclosingRing",
      value: function enclosingRing() {
        if (this._enclosingRing === undefined) {
          this._enclosingRing = this._calcEnclosingRing();
        }

        return this._enclosingRing;
      }
      /* Returns the ring that encloses this one, if any */

    }, {
      key: "_calcEnclosingRing",
      value: function _calcEnclosingRing() {
        // start with the ealier sweep line event so that the prevSeg
        // chain doesn't lead us inside of a loop of ours
        var leftMostEvt = this.events[0];

        for (var i = 1, iMax = this.events.length; i < iMax; i++) {
          var evt = this.events[i];
          if (SweepEvent.compare(leftMostEvt, evt) > 0) leftMostEvt = evt;
        }

        var prevSeg = leftMostEvt.segment.prevInResult();
        var prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;

        while (true) {
          // no segment found, thus no ring can enclose us
          if (!prevSeg) return null; // no segments below prev segment found, thus the ring of the prev
          // segment must loop back around and enclose us

          if (!prevPrevSeg) return prevSeg.ringOut; // if the two segments are of different rings, the ring of the prev
          // segment must either loop around us or the ring of the prev prev
          // seg, which would make us and the ring of the prev peers

          if (prevPrevSeg.ringOut !== prevSeg.ringOut) {
            if (prevPrevSeg.ringOut.enclosingRing() !== prevSeg.ringOut) {
              return prevSeg.ringOut;
            } else return prevSeg.ringOut.enclosingRing();
          } // two segments are from the same ring, so this was a penisula
          // of that ring. iterate downward, keep searching


          prevSeg = prevPrevSeg.prevInResult();
          prevPrevSeg = prevSeg ? prevSeg.prevInResult() : null;
        }
      }
    }]);

    return RingOut;
  }();
  var PolyOut = /*#__PURE__*/function () {
    function PolyOut(exteriorRing) {
      _classCallCheck(this, PolyOut);

      this.exteriorRing = exteriorRing;
      exteriorRing.poly = this;
      this.interiorRings = [];
    }

    _createClass(PolyOut, [{
      key: "addInterior",
      value: function addInterior(ring) {
        this.interiorRings.push(ring);
        ring.poly = this;
      }
    }, {
      key: "getGeom",
      value: function getGeom() {
        var geom = [this.exteriorRing.getGeom()]; // exterior ring was all (within rounding error of angle calc) colinear points

        if (geom[0] === null) return null;

        for (var i = 0, iMax = this.interiorRings.length; i < iMax; i++) {
          var ringGeom = this.interiorRings[i].getGeom(); // interior ring was all (within rounding error of angle calc) colinear points

          if (ringGeom === null) continue;
          geom.push(ringGeom);
        }

        return geom;
      }
    }]);

    return PolyOut;
  }();
  var MultiPolyOut = /*#__PURE__*/function () {
    function MultiPolyOut(rings) {
      _classCallCheck(this, MultiPolyOut);

      this.rings = rings;
      this.polys = this._composePolys(rings);
    }

    _createClass(MultiPolyOut, [{
      key: "getGeom",
      value: function getGeom() {
        var geom = [];

        for (var i = 0, iMax = this.polys.length; i < iMax; i++) {
          var polyGeom = this.polys[i].getGeom(); // exterior ring was all (within rounding error of angle calc) colinear points

          if (polyGeom === null) continue;
          geom.push(polyGeom);
        }

        return geom;
      }
    }, {
      key: "_composePolys",
      value: function _composePolys(rings) {
        var polys = [];

        for (var i = 0, iMax = rings.length; i < iMax; i++) {
          var ring = rings[i];
          if (ring.poly) continue;
          if (ring.isExteriorRing()) polys.push(new PolyOut(ring));else {
            var enclosingRing = ring.enclosingRing();
            if (!enclosingRing.poly) polys.push(new PolyOut(enclosingRing));
            enclosingRing.poly.addInterior(ring);
          }
        }

        return polys;
      }
    }]);

    return MultiPolyOut;
  }();

  /**
   * NOTE:  We must be careful not to change any segments while
   *        they are in the SplayTree. AFAIK, there's no way to tell
   *        the tree to rebalance itself - thus before splitting
   *        a segment that's in the tree, we remove it from the tree,
   *        do the split, then re-insert it. (Even though splitting a
   *        segment *shouldn't* change its correct position in the
   *        sweep line tree, the reality is because of rounding errors,
   *        it sometimes does.)
   */

  var SweepLine = /*#__PURE__*/function () {
    function SweepLine(queue) {
      var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Segment.compare;

      _classCallCheck(this, SweepLine);

      this.queue = queue;
      this.tree = new Tree(comparator);
      this.segments = [];
    }

    _createClass(SweepLine, [{
      key: "process",
      value: function process(event) {
        var segment = event.segment;
        var newEvents = []; // if we've already been consumed by another segment,
        // clean up our body parts and get out

        if (event.consumedBy) {
          if (event.isLeft) this.queue.remove(event.otherSE);else this.tree.remove(segment);
          return newEvents;
        }

        var node = event.isLeft ? this.tree.insert(segment) : this.tree.find(segment);
        if (!node) throw new Error("Unable to find segment #".concat(segment.id, " ") + "[".concat(segment.leftSE.point.x, ", ").concat(segment.leftSE.point.y, "] -> ") + "[".concat(segment.rightSE.point.x, ", ").concat(segment.rightSE.point.y, "] ") + 'in SweepLine tree. Please submit a bug report.');
        var prevNode = node;
        var nextNode = node;
        var prevSeg = undefined;
        var nextSeg = undefined; // skip consumed segments still in tree

        while (prevSeg === undefined) {
          prevNode = this.tree.prev(prevNode);
          if (prevNode === null) prevSeg = null;else if (prevNode.key.consumedBy === undefined) prevSeg = prevNode.key;
        } // skip consumed segments still in tree


        while (nextSeg === undefined) {
          nextNode = this.tree.next(nextNode);
          if (nextNode === null) nextSeg = null;else if (nextNode.key.consumedBy === undefined) nextSeg = nextNode.key;
        }

        if (event.isLeft) {
          // Check for intersections against the previous segment in the sweep line
          var prevMySplitter = null;

          if (prevSeg) {
            var prevInter = prevSeg.getIntersection(segment);

            if (prevInter !== null) {
              if (!segment.isAnEndpoint(prevInter)) prevMySplitter = prevInter;

              if (!prevSeg.isAnEndpoint(prevInter)) {
                var newEventsFromSplit = this._splitSafely(prevSeg, prevInter);

                for (var i = 0, iMax = newEventsFromSplit.length; i < iMax; i++) {
                  newEvents.push(newEventsFromSplit[i]);
                }
              }
            }
          } // Check for intersections against the next segment in the sweep line


          var nextMySplitter = null;

          if (nextSeg) {
            var nextInter = nextSeg.getIntersection(segment);

            if (nextInter !== null) {
              if (!segment.isAnEndpoint(nextInter)) nextMySplitter = nextInter;

              if (!nextSeg.isAnEndpoint(nextInter)) {
                var _newEventsFromSplit = this._splitSafely(nextSeg, nextInter);

                for (var _i = 0, _iMax = _newEventsFromSplit.length; _i < _iMax; _i++) {
                  newEvents.push(_newEventsFromSplit[_i]);
                }
              }
            }
          } // For simplicity, even if we find more than one intersection we only
          // spilt on the 'earliest' (sweep-line style) of the intersections.
          // The other intersection will be handled in a future process().


          if (prevMySplitter !== null || nextMySplitter !== null) {
            var mySplitter = null;
            if (prevMySplitter === null) mySplitter = nextMySplitter;else if (nextMySplitter === null) mySplitter = prevMySplitter;else {
              var cmpSplitters = SweepEvent.comparePoints(prevMySplitter, nextMySplitter);
              mySplitter = cmpSplitters <= 0 ? prevMySplitter : nextMySplitter;
            } // Rounding errors can cause changes in ordering,
            // so remove afected segments and right sweep events before splitting

            this.queue.remove(segment.rightSE);
            newEvents.push(segment.rightSE);

            var _newEventsFromSplit2 = segment.split(mySplitter);

            for (var _i2 = 0, _iMax2 = _newEventsFromSplit2.length; _i2 < _iMax2; _i2++) {
              newEvents.push(_newEventsFromSplit2[_i2]);
            }
          }

          if (newEvents.length > 0) {
            // We found some intersections, so re-do the current event to
            // make sure sweep line ordering is totally consistent for later
            // use with the segment 'prev' pointers
            this.tree.remove(segment);
            newEvents.push(event);
          } else {
            // done with left event
            this.segments.push(segment);
            segment.prev = prevSeg;
          }
        } else {
          // event.isRight
          // since we're about to be removed from the sweep line, check for
          // intersections between our previous and next segments
          if (prevSeg && nextSeg) {
            var inter = prevSeg.getIntersection(nextSeg);

            if (inter !== null) {
              if (!prevSeg.isAnEndpoint(inter)) {
                var _newEventsFromSplit3 = this._splitSafely(prevSeg, inter);

                for (var _i3 = 0, _iMax3 = _newEventsFromSplit3.length; _i3 < _iMax3; _i3++) {
                  newEvents.push(_newEventsFromSplit3[_i3]);
                }
              }

              if (!nextSeg.isAnEndpoint(inter)) {
                var _newEventsFromSplit4 = this._splitSafely(nextSeg, inter);

                for (var _i4 = 0, _iMax4 = _newEventsFromSplit4.length; _i4 < _iMax4; _i4++) {
                  newEvents.push(_newEventsFromSplit4[_i4]);
                }
              }
            }
          }

          this.tree.remove(segment);
        }

        return newEvents;
      }
      /* Safely split a segment that is currently in the datastructures
       * IE - a segment other than the one that is currently being processed. */

    }, {
      key: "_splitSafely",
      value: function _splitSafely(seg, pt) {
        // Rounding errors can cause changes in ordering,
        // so remove afected segments and right sweep events before splitting
        // removeNode() doesn't work, so have re-find the seg
        // https://github.com/w8r/splay-tree/pull/5
        this.tree.remove(seg);
        var rightSE = seg.rightSE;
        this.queue.remove(rightSE);
        var newEvents = seg.split(pt);
        newEvents.push(rightSE); // splitting can trigger consumption

        if (seg.consumedBy === undefined) this.tree.insert(seg);
        return newEvents;
      }
    }]);

    return SweepLine;
  }();

  var POLYGON_CLIPPING_MAX_QUEUE_SIZE = typeof process !== 'undefined' && process.env.POLYGON_CLIPPING_MAX_QUEUE_SIZE || 1000000;
  var POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS = typeof process !== 'undefined' && process.env.POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS || 1000000;
  var Operation = /*#__PURE__*/function () {
    function Operation() {
      _classCallCheck(this, Operation);
    }

    _createClass(Operation, [{
      key: "run",
      value: function run(type, geom, moreGeoms) {
        operation.type = type;
        rounder.reset();
        /* Convert inputs to MultiPoly objects */

        var multipolys = [new MultiPolyIn(geom, true)];

        for (var i = 0, iMax = moreGeoms.length; i < iMax; i++) {
          multipolys.push(new MultiPolyIn(moreGeoms[i], false));
        }

        operation.numMultiPolys = multipolys.length;
        /* BBox optimization for difference operation
         * If the bbox of a multipolygon that's part of the clipping doesn't
         * intersect the bbox of the subject at all, we can just drop that
         * multiploygon. */

        if (operation.type === 'difference') {
          // in place removal
          var subject = multipolys[0];
          var _i = 1;

          while (_i < multipolys.length) {
            if (getBboxOverlap(multipolys[_i].bbox, subject.bbox) !== null) _i++;else multipolys.splice(_i, 1);
          }
        }
        /* BBox optimization for intersection operation
         * If we can find any pair of multipolygons whose bbox does not overlap,
         * then the result will be empty. */


        if (operation.type === 'intersection') {
          // TODO: this is O(n^2) in number of polygons. By sorting the bboxes,
          //       it could be optimized to O(n * ln(n))
          for (var _i2 = 0, _iMax = multipolys.length; _i2 < _iMax; _i2++) {
            var mpA = multipolys[_i2];

            for (var j = _i2 + 1, jMax = multipolys.length; j < jMax; j++) {
              if (getBboxOverlap(mpA.bbox, multipolys[j].bbox) === null) return [];
            }
          }
        }
        /* Put segment endpoints in a priority queue */


        var queue = new Tree(SweepEvent.compare);

        for (var _i3 = 0, _iMax2 = multipolys.length; _i3 < _iMax2; _i3++) {
          var sweepEvents = multipolys[_i3].getSweepEvents();

          for (var _j = 0, _jMax = sweepEvents.length; _j < _jMax; _j++) {
            queue.insert(sweepEvents[_j]);

            if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
              // prevents an infinite loop, an otherwise common manifestation of bugs
              throw new Error('Infinite loop when putting segment endpoints in a priority queue ' + '(queue size too big). Please file a bug report.');
            }
          }
        }
        /* Pass the sweep line over those endpoints */


        var sweepLine = new SweepLine(queue);
        var prevQueueSize = queue.size;
        var node = queue.pop();

        while (node) {
          var evt = node.key;

          if (queue.size === prevQueueSize) {
            // prevents an infinite loop, an otherwise common manifestation of bugs
            var seg = evt.segment;
            throw new Error("Unable to pop() ".concat(evt.isLeft ? 'left' : 'right', " SweepEvent ") + "[".concat(evt.point.x, ", ").concat(evt.point.y, "] from segment #").concat(seg.id, " ") + "[".concat(seg.leftSE.point.x, ", ").concat(seg.leftSE.point.y, "] -> ") + "[".concat(seg.rightSE.point.x, ", ").concat(seg.rightSE.point.y, "] from queue. ") + 'Please file a bug report.');
          }

          if (queue.size > POLYGON_CLIPPING_MAX_QUEUE_SIZE) {
            // prevents an infinite loop, an otherwise common manifestation of bugs
            throw new Error('Infinite loop when passing sweep line over endpoints ' + '(queue size too big). Please file a bug report.');
          }

          if (sweepLine.segments.length > POLYGON_CLIPPING_MAX_SWEEPLINE_SEGMENTS) {
            // prevents an infinite loop, an otherwise common manifestation of bugs
            throw new Error('Infinite loop when passing sweep line over endpoints ' + '(too many sweep line segments). Please file a bug report.');
          }

          var newEvents = sweepLine.process(evt);

          for (var _i4 = 0, _iMax3 = newEvents.length; _i4 < _iMax3; _i4++) {
            var _evt = newEvents[_i4];
            if (_evt.consumedBy === undefined) queue.insert(_evt);
          }

          prevQueueSize = queue.size;
          node = queue.pop();
        } // free some memory we don't need anymore


        rounder.reset();
        /* Collect and compile segments we're keeping into a multipolygon */

        var ringsOut = RingOut.factory(sweepLine.segments);
        var result = new MultiPolyOut(ringsOut);
        return result.getGeom();
      }
    }]);

    return Operation;
  }(); // singleton available by import

  var operation = new Operation();

  var union = function union(geom) {
    for (var _len = arguments.length, moreGeoms = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      moreGeoms[_key - 1] = arguments[_key];
    }

    return operation.run('union', geom, moreGeoms);
  };

  var intersection$1 = function intersection(geom) {
    for (var _len2 = arguments.length, moreGeoms = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      moreGeoms[_key2 - 1] = arguments[_key2];
    }

    return operation.run('intersection', geom, moreGeoms);
  };

  var xor = function xor(geom) {
    for (var _len3 = arguments.length, moreGeoms = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      moreGeoms[_key3 - 1] = arguments[_key3];
    }

    return operation.run('xor', geom, moreGeoms);
  };

  var difference = function difference(subjectGeom) {
    for (var _len4 = arguments.length, clippingGeoms = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      clippingGeoms[_key4 - 1] = arguments[_key4];
    }

    return operation.run('difference', subjectGeom, clippingGeoms);
  };

  var index = {
    union: union,
    intersection: intersection$1,
    xor: xor,
    difference: difference
  };

  return index;

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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




const SPLIT = 5;
const EASINGS = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};
/* ---------------------- Comms ---------------------- */
// Sends a message to the plugin UI
function postMessage({ type, payload }) {
    figma.ui.postMessage({ type, payload });
}
/* -------------------- Selection ------------------- */
// Deselects a Figma node
function deselectNode(id) {
    const selection = figma.currentPage.selection;
    figma.currentPage.selection = selection.filter((node) => node.id !== id);
}
// Send the current selection to the UI state
function sendInitialSelectedNodes() {
    const selectedNodes = getSelectedNodes();
    postMessage({
        type: _types__WEBPACK_IMPORTED_MODULE_0__["WorkerActionTypes"].FOUND_SELECTED_NODES,
        payload: selectedNodes,
    });
}
function sendSelectedNodes() {
    const selectedNodes = getSelectedNodes();
    postMessage({
        type: _types__WEBPACK_IMPORTED_MODULE_0__["WorkerActionTypes"].SELECTED_NODES,
        payload: selectedNodes,
    });
}
const originalNodes = {};
function setOriginalNode(node) {
    const originalNode = Object.assign(Object.assign({}, node), { center: getCenter(node), vectorNetwork: Object.assign({}, node.vectorNetwork), vectorPaths: node.vectorPaths });
    originalNodes[node.id] = Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["compressToUTF16"])(JSON.stringify(originalNode));
    node.setPluginData("perfect_freehand", originalNodes[node.id]);
    return originalNode;
}
function getOriginalNode(id) {
    if (!originalNodes[id]) {
        // We don't have the node in the local cache.
        // Maybe it has data from a previous session?
        let node = figma.getNodeById(id);
        if (!node) {
            throw Error("Could not find that node: " + id);
        }
        const pluginData = node.getPluginData("perfect_freehand");
        if (!pluginData) {
            // Nothing local, nothing saved — we've never modified this node.
            return undefined;
        }
        // Restore saved plugin data to the local cache.
        originalNodes[id] = pluginData;
    }
    // Decompress the saved data and parse out the original node.
    const decompressed = Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["decompressFromUTF16"])(originalNodes[id]);
    if (!decompressed) {
        throw Error("Found saved data for original node but could not decompress it: " +
            decompressed);
    }
    return JSON.parse(decompressed);
}
/* ---------------------- Nodes --------------------- */
// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedNodes() {
    return figma.currentPage.selection.filter(({ type }) => type === "VECTOR").map(({ id, name, type }) => ({
        id,
        name,
        type,
    }));
}
// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedNodeIds() {
    return figma.currentPage.selection.filter(({ type }) => type === "VECTOR").map(({ id }) => id);
}
function getCenter(node) {
    let { x, y, width, height } = node;
    return { x: x + width / 2, y: y + height / 2 };
}
function moveNodeToCenter(node, center) {
    const { x: x0, y: y0 } = getCenter(node);
    const { x: x1, y: y1 } = center;
    node.x = node.x + x1 - x0;
    node.y = node.y + y1 - y0;
}
// Zooms the Figma viewport to a node
function zoomToNode(id) {
    const node = figma.getNodeById(id);
    if (!node)
        return;
    figma.viewport.scrollAndZoomIntoView([node]);
}
/* -------------- Changing VectorNodes -------------- */
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
                    data: clip
                        ? Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getFlatSvgPathFromStroke"])(stroke)
                        : Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getSvgPathFromStroke"])(stroke),
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
}
// Reset the node to its original path data, using data from our cache and then delete the node.
function resetVectorNodes(nodeIds) {
    for (let id of nodeIds) {
        const originalNode = getOriginalNode(id);
        // We haven't modified this node.
        if (!originalNode) {
            return;
        }
        const currentNode = figma.getNodeById(id);
        if (!currentNode) {
            throw Error("Could not find that node: " + id);
        }
        currentNode.vectorPaths = originalNode.vectorPaths;
        delete originalNodes[id];
        currentNode.setPluginData("perfect_freehand", "");
        // TODO: If a user has moved a node themselves, this will move it back to its original place.
        // node.x = originalNode.x
        // node.y = originalNode.y
    }
}
// --- Messages from the UI ---------------------------------------
// Listen to messages received from the plugin UI (src/ui/ui.ts)
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
            resetVectorNodes(getSelectedNodeIds());
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].TRANSFORM_NODES:
            applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, false);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].UPDATED_OPTIONS:
            applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, true);
            break;
    }
};
// --- Messages from Figma --------------------------------------------
// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes);
// --- Kickoff --------------------------------------------------------
// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 420 });
// Send the current selection to the UI
sendInitialSelectedNodes();


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
/*! exports provided: cubicBezier, getPointsAlongCubicBezier, interpolateCubicBezier, addVectors, getSvgPathFromStroke, getFlatSvgPathFromStroke */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicBezier", function() { return cubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPointsAlongCubicBezier", function() { return getPointsAlongCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateCubicBezier", function() { return interpolateCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addVectors", function() { return addVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSvgPathFromStroke", function() { return getSvgPathFromStroke; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFlatSvgPathFromStroke", function() { return getFlatSvgPathFromStroke; });
/* harmony import */ var polygon_clipping__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! polygon-clipping */ "./node_modules/polygon-clipping/dist/polygon-clipping.umd.js");
/* harmony import */ var polygon_clipping__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(polygon_clipping__WEBPACK_IMPORTED_MODULE_0__);

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
function getFlatSvgPathFromStroke(stroke) {
    const poly = polygon_clipping__WEBPACK_IMPORTED_MODULE_0___default.a.union([stroke]);
    const d = [];
    for (let face of poly) {
        for (let points of face) {
            points.push(points[0]);
            d.push(getSvgPathFromStroke(points));
        }
    }
    return d.join(" ");
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wb2x5Z29uLWNsaXBwaW5nL2Rpc3QvcG9seWdvbi1jbGlwcGluZy51bWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7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Q0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixtQ0FBbUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDOztBQUV4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSxrQkFBa0I7O0FBRWxCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLE1BQU0sbUJBQW1CLE9BQU8sbUJBQW1CO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNHQUFzRzs7QUFFdEc7QUFDQSx1REFBdUQ7O0FBRXZEO0FBQ0EsdURBQXVEOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjs7QUFFL0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7OztBQUdMOztBQUVBO0FBQ0E7QUFDQSxLQUFLOzs7QUFHTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCOztBQUU3QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHLEdBQUc7OztBQUdOOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDOztBQUV0QywyQ0FBMkM7O0FBRTNDLDREQUE0RDtBQUM1RDs7QUFFQTtBQUNBLE9BQU87O0FBRVAsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUCxLQUFLOztBQUVMO0FBQ0E7O0FBRUEsNERBQTREO0FBQzVEO0FBQ0EsMkJBQTJCO0FBQzNCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxrREFBa0QsVUFBVTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUIsZUFBZTtBQUN0QztBQUNBOztBQUVBLDZCQUE2QixlQUFlO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdEQUF3RCxVQUFVO0FBQ2xFOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkNBQTJDOzs7QUFHM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOzs7QUFHWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7OztBQUdYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdEOztBQUVoRDtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBLGtEQUFrRDtBQUNsRDs7QUFFQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQSwrQ0FBK0M7O0FBRS9DO0FBQ0EsZ0RBQWdEOztBQUVoRDtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7OztBQUdBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTs7QUFFQTtBQUNBLGdDQUFnQztBQUNoQzs7QUFFQTtBQUNBLGtDQUFrQzs7QUFFbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7QUFDQTtBQUNBLDZDQUE2QztBQUM3Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtRkFBbUY7O0FBRW5GO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdEOztBQUVBO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXOzs7QUFHWDtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7O0FBR1g7QUFDQSxTQUFTOzs7QUFHVCwyREFBMkQ7O0FBRTNEO0FBQ0Esd0NBQXdDO0FBQ3hDOztBQUVBLHVFQUF1RTtBQUN2RTs7QUFFQSxxQ0FBcUM7O0FBRXJDLG9EQUFvRDs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtR0FBbUc7QUFDbkc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9EQUFvRCxVQUFVO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFELFVBQVU7QUFDL0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBO0FBQ0EsdUNBQXVDOztBQUV2QztBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGdFQUFnRTtBQUNsSDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDs7QUFFbkQsaURBQWlELFVBQVU7QUFDM0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTOzs7QUFHVDtBQUNBOztBQUVBLG1EQUFtRCxZQUFZO0FBQy9ELGdEQUFnRDs7QUFFaEQ7QUFDQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVCxxREFBcUQsY0FBYztBQUNuRTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EscUNBQXFDOztBQUVyQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZDQUE2QyxVQUFVO0FBQ3ZEO0FBQ0E7QUFDQTs7QUFFQSxrRUFBa0U7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0RBQW9ELFVBQVU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSw4REFBOEQ7O0FBRTlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Q0FBNkMsVUFBVTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHlEQUF5RCxVQUFVO0FBQ25FOztBQUVBLHdEQUF3RCxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sYUFBYTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Q0FBeUMsVUFBVTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlEQUFpRCxVQUFVO0FBQzNEOztBQUVBLHdEQUF3RCxVQUFVO0FBQ2xFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtEQUFrRCxVQUFVO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUEsNERBQTRELFVBQVU7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7O0FBRUEsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzREFBc0QsVUFBVTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7O0FBR1QsNkNBQTZDOztBQUU3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixZQUFZO0FBQ3pDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrREFBa0QsVUFBVTtBQUM1RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDOztBQUVBLG1EQUFtRDtBQUNuRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixXQUFXO0FBQ1g7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxpREFBaUQ7O0FBRWpEOztBQUVBLHlEQUF5RCxVQUFVO0FBQ25FLHlEQUF5RDs7QUFFekQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaURBQWlELFVBQVU7QUFDM0QsaURBQWlEOztBQUVqRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUEsNENBQTRDLFVBQVU7QUFDdEQ7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQSw2REFBNkQ7QUFDN0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDOztBQUVoQztBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hELFNBQVM7OztBQUdUO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLGlFQUFpRSxVQUFVO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7O0FBR1g7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsb0VBQW9FLFlBQVk7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHFFQUFxRSw4REFBOEQ7QUFDbkk7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBOztBQUVBLG1FQUFtRSxjQUFjO0FBQ2pGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxnREFBZ0QsVUFBVTtBQUMxRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGFBQWE7QUFDbkU7O0FBRUEsMkRBQTJELFVBQVU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUEscURBQXFELGNBQWM7QUFDbkU7O0FBRUEsc0RBQXNELFlBQVk7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0RBQXNELGNBQWM7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUcsR0FBRzs7QUFFTjs7QUFFQTtBQUNBLCtGQUErRixhQUFhO0FBQzVHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVHQUF1RyxlQUFlO0FBQ3RIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzUvRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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InNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4vaW5kZXgudHNcIik7XG4iLCIvLyBDb3B5cmlnaHQgKGMpIDIwMTMgUGllcm94eSA8cGllcm94eUBwaWVyb3h5Lm5ldD5cbi8vIFRoaXMgd29yayBpcyBmcmVlLiBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0XG4vLyB1bmRlciB0aGUgdGVybXMgb2YgdGhlIFdURlBMLCBWZXJzaW9uIDJcbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBMSUNFTlNFLnR4dCBvciBodHRwOi8vd3d3Lnd0ZnBsLm5ldC9cbi8vXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgdGhlIGhvbWUgcGFnZTpcbi8vIGh0dHA6Ly9waWVyb3h5Lm5ldC9ibG9nL3BhZ2VzL2x6LXN0cmluZy90ZXN0aW5nLmh0bWxcbi8vXG4vLyBMWi1iYXNlZCBjb21wcmVzc2lvbiBhbGdvcml0aG0sIHZlcnNpb24gMS40LjRcbnZhciBMWlN0cmluZyA9IChmdW5jdGlvbigpIHtcblxuLy8gcHJpdmF0ZSBwcm9wZXJ0eVxudmFyIGYgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xudmFyIGtleVN0ckJhc2U2NCA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtcbnZhciBrZXlTdHJVcmlTYWZlID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSstJFwiO1xudmFyIGJhc2VSZXZlcnNlRGljID0ge307XG5cbmZ1bmN0aW9uIGdldEJhc2VWYWx1ZShhbHBoYWJldCwgY2hhcmFjdGVyKSB7XG4gIGlmICghYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdKSB7XG4gICAgYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdID0ge307XG4gICAgZm9yICh2YXIgaT0wIDsgaTxhbHBoYWJldC5sZW5ndGggOyBpKyspIHtcbiAgICAgIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XVthbHBoYWJldC5jaGFyQXQoaSldID0gaTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XVtjaGFyYWN0ZXJdO1xufVxuXG52YXIgTFpTdHJpbmcgPSB7XG4gIGNvbXByZXNzVG9CYXNlNjQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIHJlcyA9IExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGtleVN0ckJhc2U2NC5jaGFyQXQoYSk7fSk7XG4gICAgc3dpdGNoIChyZXMubGVuZ3RoICUgNCkgeyAvLyBUbyBwcm9kdWNlIHZhbGlkIEJhc2U2NFxuICAgIGRlZmF1bHQ6IC8vIFdoZW4gY291bGQgdGhpcyBoYXBwZW4gP1xuICAgIGNhc2UgMCA6IHJldHVybiByZXM7XG4gICAgY2FzZSAxIDogcmV0dXJuIHJlcytcIj09PVwiO1xuICAgIGNhc2UgMiA6IHJldHVybiByZXMrXCI9PVwiO1xuICAgIGNhc2UgMyA6IHJldHVybiByZXMrXCI9XCI7XG4gICAgfVxuICB9LFxuXG4gIGRlY29tcHJlc3NGcm9tQmFzZTY0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChpbnB1dCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoaW5wdXQubGVuZ3RoLCAzMiwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGdldEJhc2VWYWx1ZShrZXlTdHJCYXNlNjQsIGlucHV0LmNoYXJBdChpbmRleCkpOyB9KTtcbiAgfSxcblxuICBjb21wcmVzc1RvVVRGMTYgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgMTUsIGZ1bmN0aW9uKGEpe3JldHVybiBmKGErMzIpO30pICsgXCIgXCI7XG4gIH0sXG5cbiAgZGVjb21wcmVzc0Zyb21VVEYxNjogZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoY29tcHJlc3NlZC5sZW5ndGgsIDE2Mzg0LCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGluZGV4KSAtIDMyOyB9KTtcbiAgfSxcblxuICAvL2NvbXByZXNzIGludG8gdWludDhhcnJheSAoVUNTLTIgYmlnIGVuZGlhbiBmb3JtYXQpXG4gIGNvbXByZXNzVG9VaW50OEFycmF5OiBmdW5jdGlvbiAodW5jb21wcmVzc2VkKSB7XG4gICAgdmFyIGNvbXByZXNzZWQgPSBMWlN0cmluZy5jb21wcmVzcyh1bmNvbXByZXNzZWQpO1xuICAgIHZhciBidWY9bmV3IFVpbnQ4QXJyYXkoY29tcHJlc3NlZC5sZW5ndGgqMik7IC8vIDIgYnl0ZXMgcGVyIGNoYXJhY3RlclxuXG4gICAgZm9yICh2YXIgaT0wLCBUb3RhbExlbj1jb21wcmVzc2VkLmxlbmd0aDsgaTxUb3RhbExlbjsgaSsrKSB7XG4gICAgICB2YXIgY3VycmVudF92YWx1ZSA9IGNvbXByZXNzZWQuY2hhckNvZGVBdChpKTtcbiAgICAgIGJ1ZltpKjJdID0gY3VycmVudF92YWx1ZSA+Pj4gODtcbiAgICAgIGJ1ZltpKjIrMV0gPSBjdXJyZW50X3ZhbHVlICUgMjU2O1xuICAgIH1cbiAgICByZXR1cm4gYnVmO1xuICB9LFxuXG4gIC8vZGVjb21wcmVzcyBmcm9tIHVpbnQ4YXJyYXkgKFVDUy0yIGJpZyBlbmRpYW4gZm9ybWF0KVxuICBkZWNvbXByZXNzRnJvbVVpbnQ4QXJyYXk6ZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZD09PW51bGwgfHwgY29tcHJlc3NlZD09PXVuZGVmaW5lZCl7XG4gICAgICAgIHJldHVybiBMWlN0cmluZy5kZWNvbXByZXNzKGNvbXByZXNzZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBidWY9bmV3IEFycmF5KGNvbXByZXNzZWQubGVuZ3RoLzIpOyAvLyAyIGJ5dGVzIHBlciBjaGFyYWN0ZXJcbiAgICAgICAgZm9yICh2YXIgaT0wLCBUb3RhbExlbj1idWYubGVuZ3RoOyBpPFRvdGFsTGVuOyBpKyspIHtcbiAgICAgICAgICBidWZbaV09Y29tcHJlc3NlZFtpKjJdKjI1Nitjb21wcmVzc2VkW2kqMisxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgYnVmLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChmKGMpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBMWlN0cmluZy5kZWNvbXByZXNzKHJlc3VsdC5qb2luKCcnKSk7XG5cbiAgICB9XG5cbiAgfSxcblxuXG4gIC8vY29tcHJlc3MgaW50byBhIHN0cmluZyB0aGF0IGlzIGFscmVhZHkgVVJJIGVuY29kZWRcbiAgY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnQ6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCA2LCBmdW5jdGlvbihhKXtyZXR1cm4ga2V5U3RyVXJpU2FmZS5jaGFyQXQoYSk7fSk7XG4gIH0sXG5cbiAgLy9kZWNvbXByZXNzIGZyb20gYW4gb3V0cHV0IG9mIGNvbXByZXNzVG9FbmNvZGVkVVJJQ29tcG9uZW50XG4gIGRlY29tcHJlc3NGcm9tRW5jb2RlZFVSSUNvbXBvbmVudDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGlucHV0ID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZSgvIC9nLCBcIitcIik7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGlucHV0Lmxlbmd0aCwgMzIsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBnZXRCYXNlVmFsdWUoa2V5U3RyVXJpU2FmZSwgaW5wdXQuY2hhckF0KGluZGV4KSk7IH0pO1xuICB9LFxuXG4gIGNvbXByZXNzOiBmdW5jdGlvbiAodW5jb21wcmVzc2VkKSB7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyh1bmNvbXByZXNzZWQsIDE2LCBmdW5jdGlvbihhKXtyZXR1cm4gZihhKTt9KTtcbiAgfSxcbiAgX2NvbXByZXNzOiBmdW5jdGlvbiAodW5jb21wcmVzc2VkLCBiaXRzUGVyQ2hhciwgZ2V0Q2hhckZyb21JbnQpIHtcbiAgICBpZiAodW5jb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHZhciBpLCB2YWx1ZSxcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5PSB7fSxcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGU9IHt9LFxuICAgICAgICBjb250ZXh0X2M9XCJcIixcbiAgICAgICAgY29udGV4dF93Yz1cIlwiLFxuICAgICAgICBjb250ZXh0X3c9XCJcIixcbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW49IDIsIC8vIENvbXBlbnNhdGUgZm9yIHRoZSBmaXJzdCBlbnRyeSB3aGljaCBzaG91bGQgbm90IGNvdW50XG4gICAgICAgIGNvbnRleHRfZGljdFNpemU9IDMsXG4gICAgICAgIGNvbnRleHRfbnVtQml0cz0gMixcbiAgICAgICAgY29udGV4dF9kYXRhPVtdLFxuICAgICAgICBjb250ZXh0X2RhdGFfdmFsPTAsXG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbj0wLFxuICAgICAgICBpaTtcblxuICAgIGZvciAoaWkgPSAwOyBpaSA8IHVuY29tcHJlc3NlZC5sZW5ndGg7IGlpICs9IDEpIHtcbiAgICAgIGNvbnRleHRfYyA9IHVuY29tcHJlc3NlZC5jaGFyQXQoaWkpO1xuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5LGNvbnRleHRfYykpIHtcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfY10gPSBjb250ZXh0X2RpY3RTaXplKys7XG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfY10gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0X3djID0gY29udGV4dF93ICsgY29udGV4dF9jO1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnksY29udGV4dF93YykpIHtcbiAgICAgICAgY29udGV4dF93ID0gY29udGV4dF93YztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGUsY29udGV4dF93KSkge1xuICAgICAgICAgIGlmIChjb250ZXh0X3cuY2hhckNvZGVBdCgwKTwyNTYpIHtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTw4IDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8IHZhbHVlO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09Yml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8MTYgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWxldGUgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF93XTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3ddO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgd2MgdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3djXSA9IGNvbnRleHRfZGljdFNpemUrKztcbiAgICAgICAgY29udGV4dF93ID0gU3RyaW5nKGNvbnRleHRfYyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT3V0cHV0IHRoZSBjb2RlIGZvciB3LlxuICAgIGlmIChjb250ZXh0X3cgIT09IFwiXCIpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGUsY29udGV4dF93KSkge1xuICAgICAgICBpZiAoY29udGV4dF93LmNoYXJDb2RlQXQoMCk8MjU2KSB7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8OCA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8IHZhbHVlO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8MTYgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X3ddO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93XTtcbiAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgfVxuXG5cbiAgICAgIH1cbiAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE1hcmsgdGhlIGVuZCBvZiB0aGUgc3RyZWFtXG4gICAgdmFsdWUgPSAyO1xuICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgfVxuXG4gICAgLy8gRmx1c2ggdGhlIGxhc3QgY2hhclxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGVsc2UgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgfVxuICAgIHJldHVybiBjb250ZXh0X2RhdGEuam9pbignJyk7XG4gIH0sXG5cbiAgZGVjb21wcmVzczogZnVuY3Rpb24gKGNvbXByZXNzZWQpIHtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoY29tcHJlc3NlZCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoY29tcHJlc3NlZC5sZW5ndGgsIDMyNzY4LCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGluZGV4KTsgfSk7XG4gIH0sXG5cbiAgX2RlY29tcHJlc3M6IGZ1bmN0aW9uIChsZW5ndGgsIHJlc2V0VmFsdWUsIGdldE5leHRWYWx1ZSkge1xuICAgIHZhciBkaWN0aW9uYXJ5ID0gW10sXG4gICAgICAgIG5leHQsXG4gICAgICAgIGVubGFyZ2VJbiA9IDQsXG4gICAgICAgIGRpY3RTaXplID0gNCxcbiAgICAgICAgbnVtQml0cyA9IDMsXG4gICAgICAgIGVudHJ5ID0gXCJcIixcbiAgICAgICAgcmVzdWx0ID0gW10sXG4gICAgICAgIGksXG4gICAgICAgIHcsXG4gICAgICAgIGJpdHMsIHJlc2IsIG1heHBvd2VyLCBwb3dlcixcbiAgICAgICAgYyxcbiAgICAgICAgZGF0YSA9IHt2YWw6Z2V0TmV4dFZhbHVlKDApLCBwb3NpdGlvbjpyZXNldFZhbHVlLCBpbmRleDoxfTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCAzOyBpICs9IDEpIHtcbiAgICAgIGRpY3Rpb25hcnlbaV0gPSBpO1xuICAgIH1cblxuICAgIGJpdHMgPSAwO1xuICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwyKTtcbiAgICBwb3dlcj0xO1xuICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgIH1cbiAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgcG93ZXIgPDw9IDE7XG4gICAgfVxuXG4gICAgc3dpdGNoIChuZXh0ID0gYml0cykge1xuICAgICAgY2FzZSAwOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiw4KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICBjID0gZihiaXRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDE2KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICBjID0gZihiaXRzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBkaWN0aW9uYXJ5WzNdID0gYztcbiAgICB3ID0gYztcbiAgICByZXN1bHQucHVzaChjKTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGRhdGEuaW5kZXggPiBsZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB9XG5cbiAgICAgIGJpdHMgPSAwO1xuICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLG51bUJpdHMpO1xuICAgICAgcG93ZXI9MTtcbiAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgIH1cbiAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgfVxuXG4gICAgICBzd2l0Y2ggKGMgPSBiaXRzKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsOCk7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSBmKGJpdHMpO1xuICAgICAgICAgIGMgPSBkaWN0U2l6ZS0xO1xuICAgICAgICAgIGVubGFyZ2VJbi0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDE2KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSBmKGJpdHMpO1xuICAgICAgICAgIGMgPSBkaWN0U2l6ZS0xO1xuICAgICAgICAgIGVubGFyZ2VJbi0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGVubGFyZ2VJbiA9IE1hdGgucG93KDIsIG51bUJpdHMpO1xuICAgICAgICBudW1CaXRzKys7XG4gICAgICB9XG5cbiAgICAgIGlmIChkaWN0aW9uYXJ5W2NdKSB7XG4gICAgICAgIGVudHJ5ID0gZGljdGlvbmFyeVtjXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChjID09PSBkaWN0U2l6ZSkge1xuICAgICAgICAgIGVudHJ5ID0gdyArIHcuY2hhckF0KDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaChlbnRyeSk7XG5cbiAgICAgIC8vIEFkZCB3K2VudHJ5WzBdIHRvIHRoZSBkaWN0aW9uYXJ5LlxuICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IHcgKyBlbnRyeS5jaGFyQXQoMCk7XG4gICAgICBlbmxhcmdlSW4tLTtcblxuICAgICAgdyA9IGVudHJ5O1xuXG4gICAgICBpZiAoZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgZW5sYXJnZUluID0gTWF0aC5wb3coMiwgbnVtQml0cyk7XG4gICAgICAgIG51bUJpdHMrKztcbiAgICAgIH1cblxuICAgIH1cbiAgfVxufTtcbiAgcmV0dXJuIExaU3RyaW5nO1xufSkoKTtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICBkZWZpbmUoZnVuY3Rpb24gKCkgeyByZXR1cm4gTFpTdHJpbmc7IH0pO1xufSBlbHNlIGlmKCB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUgIT0gbnVsbCApIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBMWlN0cmluZ1xufVxuIiwidmFyIGh5cG90ID0gTWF0aC5oeXBvdCxcbiAgICBjb3MgPSBNYXRoLmNvcyxcbiAgICBtYXggPSBNYXRoLm1heCxcbiAgICBtaW4gPSBNYXRoLm1pbixcbiAgICBzaW4gPSBNYXRoLnNpbixcbiAgICBhdGFuMiA9IE1hdGguYXRhbjIsXG4gICAgUEkgPSBNYXRoLlBJLFxuICAgIFBJMiA9IFBJICogMjtcbmZ1bmN0aW9uIGxlcnAoeTEsIHkyLCBtdSkge1xuICByZXR1cm4geTEgKiAoMSAtIG11KSArIHkyICogbXU7XG59XG5mdW5jdGlvbiBwcm9qZWN0UG9pbnQocDAsIGEsIGQpIHtcbiAgcmV0dXJuIFtjb3MoYSkgKiBkICsgcDBbMF0sIHNpbihhKSAqIGQgKyBwMFsxXV07XG59XG5cbmZ1bmN0aW9uIHNob3J0QW5nbGVEaXN0KGEwLCBhMSkge1xuICB2YXIgbWF4ID0gUEkyO1xuICB2YXIgZGEgPSAoYTEgLSBhMCkgJSBtYXg7XG4gIHJldHVybiAyICogZGEgJSBtYXggLSBkYTtcbn1cblxuZnVuY3Rpb24gZ2V0QW5nbGVEZWx0YShhMCwgYTEpIHtcbiAgcmV0dXJuIHNob3J0QW5nbGVEaXN0KGEwLCBhMSk7XG59XG5mdW5jdGlvbiBsZXJwQW5nbGVzKGEwLCBhMSwgdCkge1xuICByZXR1cm4gYTAgKyBzaG9ydEFuZ2xlRGlzdChhMCwgYTEpICogdDtcbn1cbmZ1bmN0aW9uIGdldFBvaW50QmV0d2VlbihwMCwgcDEsIGQpIHtcbiAgaWYgKGQgPT09IHZvaWQgMCkge1xuICAgIGQgPSAwLjU7XG4gIH1cblxuICByZXR1cm4gW3AwWzBdICsgKHAxWzBdIC0gcDBbMF0pICogZCwgcDBbMV0gKyAocDFbMV0gLSBwMFsxXSkgKiBkXTtcbn1cbmZ1bmN0aW9uIGdldEFuZ2xlKHAwLCBwMSkge1xuICByZXR1cm4gYXRhbjIocDFbMV0gLSBwMFsxXSwgcDFbMF0gLSBwMFswXSk7XG59XG5mdW5jdGlvbiBnZXREaXN0YW5jZShwMCwgcDEpIHtcbiAgcmV0dXJuIGh5cG90KHAxWzFdIC0gcDBbMV0sIHAxWzBdIC0gcDBbMF0pO1xufVxuZnVuY3Rpb24gY2xhbXAobiwgYSwgYikge1xuICByZXR1cm4gbWF4KGEsIG1pbihiLCBuKSk7XG59XG5mdW5jdGlvbiB0b1BvaW50c0FycmF5KHBvaW50cykge1xuICBpZiAoQXJyYXkuaXNBcnJheShwb2ludHNbMF0pKSB7XG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgIHZhciB4ID0gX3JlZlswXSxcbiAgICAgICAgICB5ID0gX3JlZlsxXSxcbiAgICAgICAgICBfcmVmJCA9IF9yZWZbMl0sXG4gICAgICAgICAgcHJlc3N1cmUgPSBfcmVmJCA9PT0gdm9pZCAwID8gMC41IDogX3JlZiQ7XG4gICAgICByZXR1cm4gW3gsIHksIHByZXNzdXJlXTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciB4ID0gX3JlZjIueCxcbiAgICAgICAgICB5ID0gX3JlZjIueSxcbiAgICAgICAgICBfcmVmMiRwcmVzc3VyZSA9IF9yZWYyLnByZXNzdXJlLFxuICAgICAgICAgIHByZXNzdXJlID0gX3JlZjIkcHJlc3N1cmUgPT09IHZvaWQgMCA/IDAuNSA6IF9yZWYyJHByZXNzdXJlO1xuICAgICAgcmV0dXJuIFt4LCB5LCBwcmVzc3VyZV07XG4gICAgfSk7XG4gIH1cbn1cblxudmFyIGFicyA9IE1hdGguYWJzLFxuICAgIG1pbiQxID0gTWF0aC5taW4sXG4gICAgUEkkMSA9IE1hdGguUEksXG4gICAgVEFVID0gUEkkMSAvIDIsXG4gICAgU0hBUlAgPSBUQVUsXG4gICAgRFVMTCA9IFNIQVJQIC8gMjtcblxuZnVuY3Rpb24gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIHByZXNzdXJlKSB7XG4gIGlmIChwcmVzc3VyZSA9PT0gdm9pZCAwKSB7XG4gICAgcHJlc3N1cmUgPSAwLjU7XG4gIH1cblxuICBpZiAodGhpbm5pbmcgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHNpemUgLyAyO1xuICBwcmVzc3VyZSA9IGNsYW1wKGVhc2luZyhwcmVzc3VyZSksIDAsIDEpO1xuICByZXR1cm4gKHRoaW5uaW5nIDwgMCA/IGxlcnAoc2l6ZSwgc2l6ZSArIHNpemUgKiBjbGFtcCh0aGlubmluZywgLTAuOTUsIC0wLjA1KSwgcHJlc3N1cmUpIDogbGVycChzaXplIC0gc2l6ZSAqIGNsYW1wKHRoaW5uaW5nLCAwLjA1LCAwLjk1KSwgc2l6ZSwgcHJlc3N1cmUpKSAvIDI7XG59XG4vKipcclxuICogIyMgZ2V0U3Ryb2tlUG9pbnRzXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgcG9pbnRzIGZvciBhIHN0cm9rZS5cclxuICogQHBhcmFtIHBvaW50cyBBbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeSwgcHJlc3N1cmVdYCBvciBge3gsIHksIHByZXNzdXJlfWApLiBQcmVzc3VyZSBpcyBvcHRpb25hbC5cclxuICogQHBhcmFtIHN0cmVhbWxpbmUgSG93IG11Y2ggdG8gc3RyZWFtbGluZSB0aGUgc3Ryb2tlLlxyXG4gKi9cblxuXG5mdW5jdGlvbiBnZXRTdHJva2VQb2ludHMocG9pbnRzLCBzdHJlYW1saW5lKSB7XG4gIGlmIChzdHJlYW1saW5lID09PSB2b2lkIDApIHtcbiAgICBzdHJlYW1saW5lID0gMC41O1xuICB9XG5cbiAgdmFyIHB0cyA9IHRvUG9pbnRzQXJyYXkocG9pbnRzKTtcbiAgaWYgKHB0cy5sZW5ndGggPT09IDApIHJldHVybiBbXTtcbiAgcHRzWzBdID0gW3B0c1swXVswXSwgcHRzWzBdWzFdLCBwdHNbMF1bMl0gfHwgMC41LCAwLCAwLCAwXTtcblxuICBmb3IgKHZhciBpID0gMSwgY3VyciA9IHB0c1tpXSwgcHJldiA9IHB0c1swXTsgaSA8IHB0cy5sZW5ndGg7IGkrKywgY3VyciA9IHB0c1tpXSwgcHJldiA9IHB0c1tpIC0gMV0pIHtcbiAgICBjdXJyWzBdID0gbGVycChwcmV2WzBdLCBjdXJyWzBdLCAxIC0gc3RyZWFtbGluZSk7XG4gICAgY3VyclsxXSA9IGxlcnAocHJldlsxXSwgY3VyclsxXSwgMSAtIHN0cmVhbWxpbmUpO1xuICAgIGN1cnJbM10gPSBnZXRBbmdsZShjdXJyLCBwcmV2KTtcbiAgICBjdXJyWzRdID0gZ2V0RGlzdGFuY2UoY3VyciwgcHJldik7XG4gICAgY3Vycls1XSA9IHByZXZbNV0gKyBjdXJyWzRdO1xuICB9XG5cbiAgcmV0dXJuIHB0cztcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VPdXRsaW5lUG9pbnRzXHJcbiAqIEBkZXNjcmlwdGlvbiBHZXQgYW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHldYCkgcmVwcmVzZW50aW5nIHRoZSBvdXRsaW5lIG9mIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLmVhc2luZ1x0QW4gZWFzaW5nIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIGVhY2ggcG9pbnQncyBwcmVzc3VyZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSBXaGV0aGVyIHRvIHNpbXVsYXRlIHByZXNzdXJlIGJhc2VkIG9uIHZlbG9jaXR5LlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlT3V0bGluZVBvaW50cyhwb2ludHMsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9ucyA9IG9wdGlvbnMsXG4gICAgICBfb3B0aW9ucyRzaXplID0gX29wdGlvbnMuc2l6ZSxcbiAgICAgIHNpemUgPSBfb3B0aW9ucyRzaXplID09PSB2b2lkIDAgPyA4IDogX29wdGlvbnMkc2l6ZSxcbiAgICAgIF9vcHRpb25zJHRoaW5uaW5nID0gX29wdGlvbnMudGhpbm5pbmcsXG4gICAgICB0aGlubmluZyA9IF9vcHRpb25zJHRoaW5uaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyR0aGlubmluZyxcbiAgICAgIF9vcHRpb25zJHNtb290aGluZyA9IF9vcHRpb25zLnNtb290aGluZyxcbiAgICAgIHNtb290aGluZyA9IF9vcHRpb25zJHNtb290aGluZyA9PT0gdm9pZCAwID8gMC41IDogX29wdGlvbnMkc21vb3RoaW5nLFxuICAgICAgX29wdGlvbnMkc2ltdWxhdGVQcmVzID0gX29wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSxcbiAgICAgIHNpbXVsYXRlUHJlc3N1cmUgPSBfb3B0aW9ucyRzaW11bGF0ZVByZXMgPT09IHZvaWQgMCA/IHRydWUgOiBfb3B0aW9ucyRzaW11bGF0ZVByZXMsXG4gICAgICBfb3B0aW9ucyRlYXNpbmcgPSBfb3B0aW9ucy5lYXNpbmcsXG4gICAgICBlYXNpbmcgPSBfb3B0aW9ucyRlYXNpbmcgPT09IHZvaWQgMCA/IGZ1bmN0aW9uICh0KSB7XG4gICAgcmV0dXJuIHQ7XG4gIH0gOiBfb3B0aW9ucyRlYXNpbmc7XG4gIHZhciBsZW4gPSBwb2ludHMubGVuZ3RoLFxuICAgICAgdG90YWxMZW5ndGggPSBwb2ludHNbbGVuIC0gMV1bNV0sXG4gICAgICAvLyBUaGUgdG90YWwgbGVuZ3RoIG9mIHRoZSBsaW5lXG4gIG1pbkRpc3QgPSBzaXplICogc21vb3RoaW5nLFxuICAgICAgLy8gVGhlIG1pbmltdW0gZGlzdGFuY2UgZm9yIG1lYXN1cmVtZW50c1xuICBsZWZ0UHRzID0gW10sXG4gICAgICAvLyBPdXIgY29sbGVjdGVkIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuICByaWdodFB0cyA9IFtdO1xuICB2YXIgcGwgPSBwb2ludHNbMF0sXG4gICAgICAvLyBQcmV2aW91cyBsZWZ0IGFuZCByaWdodCBwb2ludHNcbiAgcHIgPSBwb2ludHNbMF0sXG4gICAgICB0bCA9IHBsLFxuICAgICAgLy8gUG9pbnRzIHRvIHRlc3QgZGlzdGFuY2UgZnJvbVxuICB0ciA9IHByLFxuICAgICAgcGEgPSBwclszXSxcbiAgICAgIHBwID0gMCxcbiAgICAgIC8vIFByZXZpb3VzIChtYXliZSBzaW11bGF0ZWQpIHByZXNzdXJlXG4gIHIgPSBzaXplIC8gMixcbiAgICAgIC8vIFRoZSBjdXJyZW50IHBvaW50IHJhZGl1c1xuICBfc2hvcnQgPSB0cnVlOyAvLyBXaGV0aGVyIHRoZSBsaW5lIGlzIGRyYXduIGZhciBlbm91Z2hcbiAgLy8gV2UgY2FuJ3QgZG8gYW55dGhpbmcgd2l0aCBhbiBlbXB0eSBhcnJheS5cblxuICBpZiAobGVuID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9IC8vIElmIHRoZSBwb2ludCBpcyBvbmx5IG9uZSBwb2ludCBsb25nLCBkcmF3IHR3byBjYXBzIGF0IGVpdGhlciBlbmQuXG5cblxuICBpZiAobGVuID09PSAxIHx8IHRvdGFsTGVuZ3RoIDw9IDQpIHtcbiAgICB2YXIgZmlyc3QgPSBwb2ludHNbMF0sXG4gICAgICAgIGxhc3QgPSBwb2ludHNbbGVuIC0gMV0sXG4gICAgICAgIGFuZ2xlID0gZ2V0QW5nbGUoZmlyc3QsIGxhc3QpO1xuXG4gICAgaWYgKHRoaW5uaW5nKSB7XG4gICAgICByID0gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIGxhc3RbMl0pO1xuICAgIH1cblxuICAgIGZvciAodmFyIHQgPSAwLCBzdGVwID0gMC4xOyB0IDw9IDE7IHQgKz0gc3RlcCkge1xuICAgICAgdGwgPSBwcm9qZWN0UG9pbnQoZmlyc3QsIGFuZ2xlICsgUEkkMSArIFRBVSAtIHQgKiBQSSQxLCByKTtcbiAgICAgIHRyID0gcHJvamVjdFBvaW50KGxhc3QsIGFuZ2xlICsgVEFVIC0gdCAqIFBJJDEsIHIpO1xuICAgICAgbGVmdFB0cy5wdXNoKHRsKTtcbiAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgIH1cblxuICAgIHJldHVybiBsZWZ0UHRzLmNvbmNhdChyaWdodFB0cyk7XG4gIH0gLy8gRm9yIGEgcG9pbnQgd2l0aCBtb3JlIHRoYW4gb25lIHBvaW50LCBjcmVhdGUgYW4gb3V0bGluZSBzaGFwZS5cblxuXG4gIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgcHJldiA9IHBvaW50c1tpIC0gMV07XG4gICAgdmFyIF9wb2ludHMkaSA9IHBvaW50c1tpXSxcbiAgICAgICAgeCA9IF9wb2ludHMkaVswXSxcbiAgICAgICAgeSA9IF9wb2ludHMkaVsxXSxcbiAgICAgICAgcHJlc3N1cmUgPSBfcG9pbnRzJGlbMl0sXG4gICAgICAgIF9hbmdsZSA9IF9wb2ludHMkaVszXSxcbiAgICAgICAgZGlzdGFuY2UgPSBfcG9pbnRzJGlbNF0sXG4gICAgICAgIGNsZW4gPSBfcG9pbnRzJGlbNV07IC8vIDEuXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBzaXplIG9mIHRoZSBjdXJyZW50IHBvaW50LlxuXG4gICAgaWYgKHRoaW5uaW5nKSB7XG4gICAgICBpZiAoc2ltdWxhdGVQcmVzc3VyZSkge1xuICAgICAgICAvLyBTaW11bGF0ZSBwcmVzc3VyZSBieSBhY2NlbGxlcmF0aW5nIHRoZSByZXBvcnRlZCBwcmVzc3VyZS5cbiAgICAgICAgdmFyIHJwID0gbWluJDEoMSAtIGRpc3RhbmNlIC8gc2l6ZSwgMSk7XG4gICAgICAgIHZhciBzcCA9IG1pbiQxKGRpc3RhbmNlIC8gc2l6ZSwgMSk7XG4gICAgICAgIHByZXNzdXJlID0gbWluJDEoMSwgcHAgKyAocnAgLSBwcCkgKiAoc3AgLyAyKSk7XG4gICAgICB9IC8vIENvbXB1dGUgdGhlIHN0cm9rZSByYWRpdXMgYmFzZWQgb24gdGhlIHByZXNzdXJlLCBlYXNpbmcgYW5kIHRoaW5uaW5nLlxuXG5cbiAgICAgIHIgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcHJlc3N1cmUpO1xuICAgIH0gLy8gMi5cbiAgICAvLyBEcmF3IGEgY2FwIG9uY2Ugd2UndmUgcmVhY2hlZCB0aGUgbWluaW11bSBsZW5ndGguXG5cblxuICAgIGlmIChfc2hvcnQpIHtcbiAgICAgIGlmIChjbGVuIDwgc2l6ZSAvIDQpIGNvbnRpbnVlOyAvLyBUaGUgZmlyc3QgcG9pbnQgYWZ0ZXIgd2UndmUgcmVhY2hlZCB0aGUgbWluaW11bSBsZW5ndGguXG4gICAgICAvLyBEcmF3IGEgY2FwIGF0IHRoZSBmaXJzdCBwb2ludCBhbmdsZWQgdG93YXJkIHRoZSBjdXJyZW50IHBvaW50LlxuXG4gICAgICBfc2hvcnQgPSBmYWxzZTtcblxuICAgICAgZm9yICh2YXIgX3QgPSAwLCBfc3RlcCA9IDAuMTsgX3QgPD0gMTsgX3QgKz0gX3N0ZXApIHtcbiAgICAgICAgdGwgPSBwcm9qZWN0UG9pbnQocG9pbnRzWzBdLCBfYW5nbGUgKyBUQVUgLSBfdCAqIFBJJDEsIHIpO1xuICAgICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgfVxuXG4gICAgICB0ciA9IHByb2plY3RQb2ludChwb2ludHNbMF0sIF9hbmdsZSArIFRBVSwgcik7XG4gICAgICByaWdodFB0cy5wdXNoKHRyKTtcbiAgICB9XG5cbiAgICBfYW5nbGUgPSBsZXJwQW5nbGVzKHBhLCBfYW5nbGUsIDAuNzUpOyAvLyAzLlxuICAgIC8vIEFkZCBwb2ludHMgZm9yIHRoZSBjdXJyZW50IHBvaW50LlxuXG4gICAgaWYgKGkgPT09IGxlbiAtIDEpIHtcbiAgICAgIC8vIFRoZSBsYXN0IHBvaW50IGluIHRoZSBsaW5lLlxuICAgICAgLy8gQWRkIHBvaW50cyBmb3IgYW4gZW5kIGNhcC5cbiAgICAgIGZvciAodmFyIF90MiA9IDAsIF9zdGVwMiA9IDAuMTsgX3QyIDw9IDE7IF90MiArPSBfc3RlcDIpIHtcbiAgICAgICAgcmlnaHRQdHMucHVzaChwcm9qZWN0UG9pbnQoW3gsIHldLCBfYW5nbGUgKyBUQVUgKyBfdDIgKiBQSSQxLCByKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpbmQgdGhlIGRlbHRhIGJldHdlZW4gdGhlIGN1cnJlbnQgYW5kIHByZXZpb3VzIGFuZ2xlLlxuICAgICAgdmFyIGRlbHRhID0gZ2V0QW5nbGVEZWx0YShwcmV2WzNdLCBfYW5nbGUpLFxuICAgICAgICAgIGFic0RlbHRhID0gYWJzKGRlbHRhKTtcblxuICAgICAgaWYgKGFic0RlbHRhID4gU0hBUlAgJiYgY2xlbiA+IHIpIHtcbiAgICAgICAgLy8gQSBzaGFycCBjb3JuZXIuXG4gICAgICAgIC8vIFByb2plY3QgcG9pbnRzIChsZWZ0IGFuZCByaWdodCkgZm9yIGEgY2FwLlxuICAgICAgICB2YXIgbWlkID0gZ2V0UG9pbnRCZXR3ZWVuKHByZXYsIFt4LCB5XSk7XG5cbiAgICAgICAgZm9yICh2YXIgX3QzID0gMCwgX3N0ZXAzID0gMC4yNTsgX3QzIDw9IDE7IF90MyArPSBfc3RlcDMpIHtcbiAgICAgICAgICB0bCA9IHByb2plY3RQb2ludChtaWQsIHBhIC0gVEFVICsgX3QzICogLVBJJDEsIHIpO1xuICAgICAgICAgIHRyID0gcHJvamVjdFBvaW50KG1pZCwgcGEgKyBUQVUgKyBfdDMgKiBQSSQxLCByKTtcbiAgICAgICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBIHJlZ3VsYXIgcG9pbnQuXG4gICAgICAgIC8vIEFkZCBwcm9qZWN0ZWQgcG9pbnRzIGxlZnQgYW5kIHJpZ2h0LCBpZiBmYXIgZW5vdWdoIGF3YXkuXG4gICAgICAgIHBsID0gcHJvamVjdFBvaW50KFt4LCB5XSwgX2FuZ2xlIC0gVEFVLCByKTtcbiAgICAgICAgcHIgPSBwcm9qZWN0UG9pbnQoW3gsIHldLCBfYW5nbGUgKyBUQVUsIHIpO1xuXG4gICAgICAgIGlmIChhYnNEZWx0YSA+IERVTEwgfHwgZ2V0RGlzdGFuY2UocGwsIHRsKSA+IG1pbkRpc3QpIHtcbiAgICAgICAgICBsZWZ0UHRzLnB1c2goZ2V0UG9pbnRCZXR3ZWVuKHRsLCBwbCkpO1xuICAgICAgICAgIHRsID0gcGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWJzRGVsdGEgPiBEVUxMIHx8IGdldERpc3RhbmNlKHByLCB0cikgPiBtaW5EaXN0KSB7XG4gICAgICAgICAgcmlnaHRQdHMucHVzaChnZXRQb2ludEJldHdlZW4odHIsIHByKSk7XG4gICAgICAgICAgdHIgPSBwcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBwcCA9IHByZXNzdXJlO1xuICAgICAgcGEgPSBfYW5nbGU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxlZnRQdHMuY29uY2F0KHJpZ2h0UHRzLnJldmVyc2UoKSk7XG59XG4vKipcclxuICogIyMgZ2V0U3Ryb2tlXHJcbiAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgc3Ryb2tlIGFzIGFuIGFycmF5IG9mIHBvaW50cy5cclxuICogQHBhcmFtIHBvaW50cyBBbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeSwgcHJlc3N1cmVdYCBvciBge3gsIHksIHByZXNzdXJlfWApLiBQcmVzc3VyZSBpcyBvcHRpb25hbC5cclxuICogQHBhcmFtIG9wdGlvbnMgQW4gKG9wdGlvbmFsKSBvYmplY3Qgd2l0aCBvcHRpb25zLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaXplXHRUaGUgYmFzZSBzaXplIChkaWFtZXRlcikgb2YgdGhlIHN0cm9rZS5cclxuICogQHBhcmFtIG9wdGlvbnMudGhpbm5pbmcgVGhlIGVmZmVjdCBvZiBwcmVzc3VyZSBvbiB0aGUgc3Ryb2tlJ3Mgc2l6ZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc21vb3RoaW5nXHRIb3cgbXVjaCB0byBzb2Z0ZW4gdGhlIHN0cm9rZSdzIGVkZ2VzLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zdHJlYW1saW5lIEhvdyBtdWNoIHRvIHN0cmVhbWxpbmUgdGhlIHN0cm9rZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc2ltdWxhdGVQcmVzc3VyZSBXaGV0aGVyIHRvIHNpbXVsYXRlIHByZXNzdXJlIGJhc2VkIG9uIHZlbG9jaXR5LlxyXG4gKi9cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgcmV0dXJuIGdldFN0cm9rZU91dGxpbmVQb2ludHMoZ2V0U3Ryb2tlUG9pbnRzKHBvaW50cywgb3B0aW9ucy5zdHJlYW1saW5lKSwgb3B0aW9ucyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFN0cm9rZTtcbmV4cG9ydCB7IGdldFN0cm9rZU91dGxpbmVQb2ludHMsIGdldFN0cm9rZVBvaW50cyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGVyZmVjdC1mcmVlaGFuZC5lc20uanMubWFwXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwgPSB0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWxUaGlzIDogZ2xvYmFsIHx8IHNlbGYsIGdsb2JhbC5wb2x5Z29uQ2xpcHBpbmcgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBzcGxheXRyZWUgdjMuMS4wXG4gICAqIEZhc3QgU3BsYXkgdHJlZSBmb3IgTm9kZSBhbmQgYnJvd3NlclxuICAgKlxuICAgKiBAYXV0aG9yIEFsZXhhbmRlciBNaWxldnNraSA8aW5mb0B3OHIubmFtZT5cbiAgICogQGxpY2Vuc2UgTUlUXG4gICAqIEBwcmVzZXJ2ZVxuICAgKi9cbiAgdmFyIE5vZGUgPVxuICAvKiogQGNsYXNzICovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOb2RlKGtleSwgZGF0YSkge1xuICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gTm9kZTtcbiAgfSgpO1xuICAvKiBmb2xsb3dzIFwiQW4gaW1wbGVtZW50YXRpb24gb2YgdG9wLWRvd24gc3BsYXlpbmdcIlxyXG4gICAqIGJ5IEQuIFNsZWF0b3IgPHNsZWF0b3JAY3MuY211LmVkdT4gTWFyY2ggMTk5MlxyXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gREVGQVVMVF9DT01QQVJFKGEsIGIpIHtcbiAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG4gIH1cbiAgLyoqXHJcbiAgICogU2ltcGxlIHRvcCBkb3duIHNwbGF5LCBub3QgcmVxdWlyaW5nIGkgdG8gYmUgaW4gdGhlIHRyZWUgdC5cclxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHNwbGF5KGksIHQsIGNvbXBhcmF0b3IpIHtcbiAgICB2YXIgTiA9IG5ldyBOb2RlKG51bGwsIG51bGwpO1xuICAgIHZhciBsID0gTjtcbiAgICB2YXIgciA9IE47XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3IoaSwgdC5rZXkpOyAvL2lmIChpIDwgdC5rZXkpIHtcblxuICAgICAgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgaWYgKHQubGVmdCA9PT0gbnVsbCkgYnJlYWs7IC8vaWYgKGkgPCB0LmxlZnQua2V5KSB7XG5cbiAgICAgICAgaWYgKGNvbXBhcmF0b3IoaSwgdC5sZWZ0LmtleSkgPCAwKSB7XG4gICAgICAgICAgdmFyIHkgPSB0LmxlZnQ7XG4gICAgICAgICAgLyogcm90YXRlIHJpZ2h0ICovXG5cbiAgICAgICAgICB0LmxlZnQgPSB5LnJpZ2h0O1xuICAgICAgICAgIHkucmlnaHQgPSB0O1xuICAgICAgICAgIHQgPSB5O1xuICAgICAgICAgIGlmICh0LmxlZnQgPT09IG51bGwpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgci5sZWZ0ID0gdDtcbiAgICAgICAgLyogbGluayByaWdodCAqL1xuXG4gICAgICAgIHIgPSB0O1xuICAgICAgICB0ID0gdC5sZWZ0OyAvL30gZWxzZSBpZiAoaSA+IHQua2V5KSB7XG4gICAgICB9IGVsc2UgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgaWYgKHQucmlnaHQgPT09IG51bGwpIGJyZWFrOyAvL2lmIChpID4gdC5yaWdodC5rZXkpIHtcblxuICAgICAgICBpZiAoY29tcGFyYXRvcihpLCB0LnJpZ2h0LmtleSkgPiAwKSB7XG4gICAgICAgICAgdmFyIHkgPSB0LnJpZ2h0O1xuICAgICAgICAgIC8qIHJvdGF0ZSBsZWZ0ICovXG5cbiAgICAgICAgICB0LnJpZ2h0ID0geS5sZWZ0O1xuICAgICAgICAgIHkubGVmdCA9IHQ7XG4gICAgICAgICAgdCA9IHk7XG4gICAgICAgICAgaWYgKHQucmlnaHQgPT09IG51bGwpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgbC5yaWdodCA9IHQ7XG4gICAgICAgIC8qIGxpbmsgbGVmdCAqL1xuXG4gICAgICAgIGwgPSB0O1xuICAgICAgICB0ID0gdC5yaWdodDtcbiAgICAgIH0gZWxzZSBicmVhaztcbiAgICB9XG4gICAgLyogYXNzZW1ibGUgKi9cblxuXG4gICAgbC5yaWdodCA9IHQubGVmdDtcbiAgICByLmxlZnQgPSB0LnJpZ2h0O1xuICAgIHQubGVmdCA9IE4ucmlnaHQ7XG4gICAgdC5yaWdodCA9IE4ubGVmdDtcbiAgICByZXR1cm4gdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluc2VydChpLCBkYXRhLCB0LCBjb21wYXJhdG9yKSB7XG4gICAgdmFyIG5vZGUgPSBuZXcgTm9kZShpLCBkYXRhKTtcblxuICAgIGlmICh0ID09PSBudWxsKSB7XG4gICAgICBub2RlLmxlZnQgPSBub2RlLnJpZ2h0ID0gbnVsbDtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHQgPSBzcGxheShpLCB0LCBjb21wYXJhdG9yKTtcbiAgICB2YXIgY21wID0gY29tcGFyYXRvcihpLCB0LmtleSk7XG5cbiAgICBpZiAoY21wIDwgMCkge1xuICAgICAgbm9kZS5sZWZ0ID0gdC5sZWZ0O1xuICAgICAgbm9kZS5yaWdodCA9IHQ7XG4gICAgICB0LmxlZnQgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoY21wID49IDApIHtcbiAgICAgIG5vZGUucmlnaHQgPSB0LnJpZ2h0O1xuICAgICAgbm9kZS5sZWZ0ID0gdDtcbiAgICAgIHQucmlnaHQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gc3BsaXQoa2V5LCB2LCBjb21wYXJhdG9yKSB7XG4gICAgdmFyIGxlZnQgPSBudWxsO1xuICAgIHZhciByaWdodCA9IG51bGw7XG5cbiAgICBpZiAodikge1xuICAgICAgdiA9IHNwbGF5KGtleSwgdiwgY29tcGFyYXRvcik7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcih2LmtleSwga2V5KTtcblxuICAgICAgaWYgKGNtcCA9PT0gMCkge1xuICAgICAgICBsZWZ0ID0gdi5sZWZ0O1xuICAgICAgICByaWdodCA9IHYucmlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgcmlnaHQgPSB2LnJpZ2h0O1xuICAgICAgICB2LnJpZ2h0ID0gbnVsbDtcbiAgICAgICAgbGVmdCA9IHY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0ID0gdi5sZWZ0O1xuICAgICAgICB2LmxlZnQgPSBudWxsO1xuICAgICAgICByaWdodCA9IHY7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IGxlZnQsXG4gICAgICByaWdodDogcmlnaHRcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2UobGVmdCwgcmlnaHQsIGNvbXBhcmF0b3IpIHtcbiAgICBpZiAocmlnaHQgPT09IG51bGwpIHJldHVybiBsZWZ0O1xuICAgIGlmIChsZWZ0ID09PSBudWxsKSByZXR1cm4gcmlnaHQ7XG4gICAgcmlnaHQgPSBzcGxheShsZWZ0LmtleSwgcmlnaHQsIGNvbXBhcmF0b3IpO1xuICAgIHJpZ2h0LmxlZnQgPSBsZWZ0O1xuICAgIHJldHVybiByaWdodDtcbiAgfVxuICAvKipcclxuICAgKiBQcmludHMgbGV2ZWwgb2YgdGhlIHRyZWVcclxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIHByaW50Um93KHJvb3QsIHByZWZpeCwgaXNUYWlsLCBvdXQsIHByaW50Tm9kZSkge1xuICAgIGlmIChyb290KSB7XG4gICAgICBvdXQoXCJcIiArIHByZWZpeCArIChpc1RhaWwgPyAn4pSU4pSA4pSAICcgOiAn4pSc4pSA4pSAICcpICsgcHJpbnROb2RlKHJvb3QpICsgXCJcXG5cIik7XG4gICAgICB2YXIgaW5kZW50ID0gcHJlZml4ICsgKGlzVGFpbCA/ICcgICAgJyA6ICfilIIgICAnKTtcbiAgICAgIGlmIChyb290LmxlZnQpIHByaW50Um93KHJvb3QubGVmdCwgaW5kZW50LCBmYWxzZSwgb3V0LCBwcmludE5vZGUpO1xuICAgICAgaWYgKHJvb3QucmlnaHQpIHByaW50Um93KHJvb3QucmlnaHQsIGluZGVudCwgdHJ1ZSwgb3V0LCBwcmludE5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBUcmVlID1cbiAgLyoqIEBjbGFzcyAqL1xuICBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVHJlZShjb21wYXJhdG9yKSB7XG4gICAgICBpZiAoY29tcGFyYXRvciA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGNvbXBhcmF0b3IgPSBERUZBVUxUX0NPTVBBUkU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgICAgdGhpcy5fc2l6ZSA9IDA7XG4gICAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB9XG4gICAgLyoqXHJcbiAgICAgKiBJbnNlcnRzIGEga2V5LCBhbGxvd3MgZHVwbGljYXRlc1xyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIChrZXksIGRhdGEpIHtcbiAgICAgIHRoaXMuX3NpemUrKztcbiAgICAgIHJldHVybiB0aGlzLl9yb290ID0gaW5zZXJ0KGtleSwgZGF0YSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBrZXksIGlmIGl0IGlzIG5vdCBwcmVzZW50IGluIHRoZSB0cmVlXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGtleSwgZGF0YSkge1xuICAgICAgdmFyIG5vZGUgPSBuZXcgTm9kZShrZXksIGRhdGEpO1xuXG4gICAgICBpZiAodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICBub2RlLmxlZnQgPSBub2RlLnJpZ2h0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fc2l6ZSsrO1xuICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgICAgdmFyIHQgPSBzcGxheShrZXksIHRoaXMuX3Jvb3QsIGNvbXBhcmF0b3IpO1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Ioa2V5LCB0LmtleSk7XG4gICAgICBpZiAoY21wID09PSAwKSB0aGlzLl9yb290ID0gdDtlbHNlIHtcbiAgICAgICAgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgICBub2RlLmxlZnQgPSB0LmxlZnQ7XG4gICAgICAgICAgbm9kZS5yaWdodCA9IHQ7XG4gICAgICAgICAgdC5sZWZ0ID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIGlmIChjbXAgPiAwKSB7XG4gICAgICAgICAgbm9kZS5yaWdodCA9IHQucmlnaHQ7XG4gICAgICAgICAgbm9kZS5sZWZ0ID0gdDtcbiAgICAgICAgICB0LnJpZ2h0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3NpemUrKztcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5vZGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogQHBhcmFtICB7S2V5fSBrZXlcclxuICAgICAqIEByZXR1cm4ge05vZGV8bnVsbH1cclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB0aGlzLl9yb290ID0gdGhpcy5fcmVtb3ZlKGtleSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIERlbGV0ZXMgaSBmcm9tIHRoZSB0cmVlIGlmIGl0J3MgdGhlcmVcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5fcmVtb3ZlID0gZnVuY3Rpb24gKGksIHQsIGNvbXBhcmF0b3IpIHtcbiAgICAgIHZhciB4O1xuICAgICAgaWYgKHQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICAgICAgdCA9IHNwbGF5KGksIHQsIGNvbXBhcmF0b3IpO1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3IoaSwgdC5rZXkpO1xuXG4gICAgICBpZiAoY21wID09PSAwKSB7XG4gICAgICAgIC8qIGZvdW5kIGl0ICovXG4gICAgICAgIGlmICh0LmxlZnQgPT09IG51bGwpIHtcbiAgICAgICAgICB4ID0gdC5yaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB4ID0gc3BsYXkoaSwgdC5sZWZ0LCBjb21wYXJhdG9yKTtcbiAgICAgICAgICB4LnJpZ2h0ID0gdC5yaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3NpemUtLTtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0O1xuICAgICAgLyogSXQgd2Fzbid0IHRoZXJlICovXG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIFJlbW92ZXMgYW5kIHJldHVybnMgdGhlIG5vZGUgd2l0aCBzbWFsbGVzdCBrZXlcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHdoaWxlIChub2RlLmxlZnQpIHtcbiAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcm9vdCA9IHNwbGF5KG5vZGUua2V5LCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3JlbW92ZShub2RlLmtleSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2V5OiBub2RlLmtleSxcbiAgICAgICAgICBkYXRhOiBub2RlLmRhdGFcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEZpbmQgd2l0aG91dCBzcGxheWluZ1xyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmZpbmRTdGF0aWMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgY3VycmVudC5rZXkpO1xuICAgICAgICBpZiAoY21wID09PSAwKSByZXR1cm4gY3VycmVudDtlbHNlIGlmIChjbXAgPCAwKSBjdXJyZW50ID0gY3VycmVudC5sZWZ0O2Vsc2UgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKHRoaXMuX3Jvb3QpIHtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHNwbGF5KGtleSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgICAgIGlmICh0aGlzLl9jb21wYXJhdG9yKGtleSwgdGhpcy5fcm9vdC5rZXkpICE9PSAwKSByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgICB2YXIgY21wID0gY29tcGFyZShrZXksIGN1cnJlbnQua2V5KTtcbiAgICAgICAgaWYgKGNtcCA9PT0gMCkgcmV0dXJuIHRydWU7ZWxzZSBpZiAoY21wIDwgMCkgY3VycmVudCA9IGN1cnJlbnQubGVmdDtlbHNlIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAodmlzaXRvciwgY3R4KSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgUSA9IFtdO1xuICAgICAgLyogSW5pdGlhbGl6ZSBzdGFjayBzICovXG5cbiAgICAgIHZhciBkb25lID0gZmFsc2U7XG5cbiAgICAgIHdoaWxlICghZG9uZSkge1xuICAgICAgICBpZiAoY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICAgIFEucHVzaChjdXJyZW50KTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChRLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY3VycmVudCA9IFEucG9wKCk7XG4gICAgICAgICAgICB2aXNpdG9yLmNhbGwoY3R4LCBjdXJyZW50KTtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgICAgIH0gZWxzZSBkb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogV2FsayBrZXkgcmFuZ2UgZnJvbSBgbG93YCB0byBgaGlnaGAuIFN0b3BzIGlmIGBmbmAgcmV0dXJucyBhIHZhbHVlLlxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLnJhbmdlID0gZnVuY3Rpb24gKGxvdywgaGlnaCwgZm4sIGN0eCkge1xuICAgICAgdmFyIFEgPSBbXTtcbiAgICAgIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBjbXA7XG5cbiAgICAgIHdoaWxlIChRLmxlbmd0aCAhPT0gMCB8fCBub2RlKSB7XG4gICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgUS5wdXNoKG5vZGUpO1xuICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZSA9IFEucG9wKCk7XG4gICAgICAgICAgY21wID0gY29tcGFyZShub2RlLmtleSwgaGlnaCk7XG5cbiAgICAgICAgICBpZiAoY21wID4gMCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIGlmIChjb21wYXJlKG5vZGUua2V5LCBsb3cpID49IDApIHtcbiAgICAgICAgICAgIGlmIChmbi5jYWxsKGN0eCwgbm9kZSkpIHJldHVybiB0aGlzOyAvLyBzdG9wIGlmIHNtdGggaXMgcmV0dXJuZWRcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBub2RlID0gbm9kZS5yaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBrZXlzXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBrZXlzID0gW107XG4gICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBrZXkgPSBfYS5rZXk7XG4gICAgICAgIHJldHVybiBrZXlzLnB1c2goa2V5KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGtleXM7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGluIHRoZSBub2Rlc1xyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBfYS5kYXRhO1xuICAgICAgICByZXR1cm4gdmFsdWVzLnB1c2goZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9yb290KSByZXR1cm4gdGhpcy5taW5Ob2RlKHRoaXMuX3Jvb3QpLmtleTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fcm9vdCkgcmV0dXJuIHRoaXMubWF4Tm9kZSh0aGlzLl9yb290KS5rZXk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUubWluTm9kZSA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICBpZiAodCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHQgPSB0aGlzLl9yb290O1xuICAgICAgfVxuXG4gICAgICBpZiAodCkgd2hpbGUgKHQubGVmdCkge1xuICAgICAgICB0ID0gdC5sZWZ0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLm1heE5vZGUgPSBmdW5jdGlvbiAodCkge1xuICAgICAgaWYgKHQgPT09IHZvaWQgMCkge1xuICAgICAgICB0ID0gdGhpcy5fcm9vdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHQpIHdoaWxlICh0LnJpZ2h0KSB7XG4gICAgICAgIHQgPSB0LnJpZ2h0O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgbm9kZSBhdCBnaXZlbiBpbmRleFxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmF0ID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgdmFyIFEgPSBbXTtcblxuICAgICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAgICAgUS5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY3VycmVudCA9IFEucG9wKCk7XG4gICAgICAgICAgICBpZiAoaSA9PT0gaW5kZXgpIHJldHVybiBjdXJyZW50O1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICAgICAgfSBlbHNlIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKGQpIHtcbiAgICAgIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBzdWNjZXNzb3IgPSBudWxsO1xuXG4gICAgICBpZiAoZC5yaWdodCkge1xuICAgICAgICBzdWNjZXNzb3IgPSBkLnJpZ2h0O1xuXG4gICAgICAgIHdoaWxlIChzdWNjZXNzb3IubGVmdCkge1xuICAgICAgICAgIHN1Y2Nlc3NvciA9IHN1Y2Nlc3Nvci5sZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3NvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgICB3aGlsZSAocm9vdCkge1xuICAgICAgICB2YXIgY21wID0gY29tcGFyYXRvcihkLmtleSwgcm9vdC5rZXkpO1xuICAgICAgICBpZiAoY21wID09PSAwKSBicmVhaztlbHNlIGlmIChjbXAgPCAwKSB7XG4gICAgICAgICAgc3VjY2Vzc29yID0gcm9vdDtcbiAgICAgICAgICByb290ID0gcm9vdC5sZWZ0O1xuICAgICAgICB9IGVsc2Ugcm9vdCA9IHJvb3QucmlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWNjZXNzb3I7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbiAoZCkge1xuICAgICAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIHByZWRlY2Vzc29yID0gbnVsbDtcblxuICAgICAgaWYgKGQubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICBwcmVkZWNlc3NvciA9IGQubGVmdDtcblxuICAgICAgICB3aGlsZSAocHJlZGVjZXNzb3IucmlnaHQpIHtcbiAgICAgICAgICBwcmVkZWNlc3NvciA9IHByZWRlY2Vzc29yLnJpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHByZWRlY2Vzc29yO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICAgIHdoaWxlIChyb290KSB7XG4gICAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGQua2V5LCByb290LmtleSk7XG4gICAgICAgIGlmIChjbXAgPT09IDApIGJyZWFrO2Vsc2UgaWYgKGNtcCA8IDApIHJvb3QgPSByb290LmxlZnQ7ZWxzZSB7XG4gICAgICAgICAgcHJlZGVjZXNzb3IgPSByb290O1xuICAgICAgICAgIHJvb3QgPSByb290LnJpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmVkZWNlc3NvcjtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICAgIHRoaXMuX3NpemUgPSAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLnRvTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0b0xpc3QodGhpcy5fcm9vdCk7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEJ1bGstbG9hZCBpdGVtcy4gQm90aCBhcnJheSBoYXZlIHRvIGJlIHNhbWUgc2l6ZVxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoa2V5cywgdmFsdWVzLCBwcmVzb3J0KSB7XG4gICAgICBpZiAodmFsdWVzID09PSB2b2lkIDApIHtcbiAgICAgICAgdmFsdWVzID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmVzb3J0ID09PSB2b2lkIDApIHtcbiAgICAgICAgcHJlc29ydCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2l6ZSA9IGtleXMubGVuZ3RoO1xuICAgICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yOyAvLyBzb3J0IGlmIG5lZWRlZFxuXG4gICAgICBpZiAocHJlc29ydCkgc29ydChrZXlzLCB2YWx1ZXMsIDAsIHNpemUgLSAxLCBjb21wYXJhdG9yKTtcblxuICAgICAgaWYgKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgLy8gZW1wdHkgdHJlZVxuICAgICAgICB0aGlzLl9yb290ID0gbG9hZFJlY3Vyc2l2ZShrZXlzLCB2YWx1ZXMsIDAsIHNpemUpO1xuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRoYXQgcmUtYnVpbGRzIHRoZSB3aG9sZSB0cmVlIGZyb20gdHdvIGluLW9yZGVyIHRyYXZlcnNhbHNcbiAgICAgICAgdmFyIG1lcmdlZExpc3QgPSBtZXJnZUxpc3RzKHRoaXMudG9MaXN0KCksIGNyZWF0ZUxpc3Qoa2V5cywgdmFsdWVzKSwgY29tcGFyYXRvcik7XG4gICAgICAgIHNpemUgPSB0aGlzLl9zaXplICsgc2l6ZTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHNvcnRlZExpc3RUb0JTVCh7XG4gICAgICAgICAgaGVhZDogbWVyZ2VkTGlzdFxuICAgICAgICB9LCAwLCBzaXplKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdCA9PT0gbnVsbDtcbiAgICB9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyZWUucHJvdG90eXBlLCBcInNpemVcIiwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJlZS5wcm90b3R5cGUsIFwicm9vdFwiLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgVHJlZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAocHJpbnROb2RlKSB7XG4gICAgICBpZiAocHJpbnROb2RlID09PSB2b2lkIDApIHtcbiAgICAgICAgcHJpbnROb2RlID0gZnVuY3Rpb24gcHJpbnROb2RlKG4pIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKG4ua2V5KTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgcHJpbnRSb3codGhpcy5fcm9vdCwgJycsIHRydWUsIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgIHJldHVybiBvdXQucHVzaCh2KTtcbiAgICAgIH0sIHByaW50Tm9kZSk7XG4gICAgICByZXR1cm4gb3V0LmpvaW4oJycpO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoa2V5LCBuZXdLZXksIG5ld0RhdGEpIHtcbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgICAgdmFyIF9hID0gc3BsaXQoa2V5LCB0aGlzLl9yb290LCBjb21wYXJhdG9yKSxcbiAgICAgICAgICBsZWZ0ID0gX2EubGVmdCxcbiAgICAgICAgICByaWdodCA9IF9hLnJpZ2h0O1xuXG4gICAgICBpZiAoY29tcGFyYXRvcihrZXksIG5ld0tleSkgPCAwKSB7XG4gICAgICAgIHJpZ2h0ID0gaW5zZXJ0KG5ld0tleSwgbmV3RGF0YSwgcmlnaHQsIGNvbXBhcmF0b3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdCA9IGluc2VydChuZXdLZXksIG5ld0RhdGEsIGxlZnQsIGNvbXBhcmF0b3IpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yb290ID0gbWVyZ2UobGVmdCwgcmlnaHQsIGNvbXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5zcGxpdCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHJldHVybiBzcGxpdChrZXksIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgIH07XG5cbiAgICByZXR1cm4gVHJlZTtcbiAgfSgpO1xuXG4gIGZ1bmN0aW9uIGxvYWRSZWN1cnNpdmUoa2V5cywgdmFsdWVzLCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIHNpemUgPSBlbmQgLSBzdGFydDtcblxuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgdmFyIG1pZGRsZSA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzaXplIC8gMik7XG4gICAgICB2YXIga2V5ID0ga2V5c1ttaWRkbGVdO1xuICAgICAgdmFyIGRhdGEgPSB2YWx1ZXNbbWlkZGxlXTtcbiAgICAgIHZhciBub2RlID0gbmV3IE5vZGUoa2V5LCBkYXRhKTtcbiAgICAgIG5vZGUubGVmdCA9IGxvYWRSZWN1cnNpdmUoa2V5cywgdmFsdWVzLCBzdGFydCwgbWlkZGxlKTtcbiAgICAgIG5vZGUucmlnaHQgPSBsb2FkUmVjdXJzaXZlKGtleXMsIHZhbHVlcywgbWlkZGxlICsgMSwgZW5kKTtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTGlzdChrZXlzLCB2YWx1ZXMpIHtcbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKG51bGwsIG51bGwpO1xuICAgIHZhciBwID0gaGVhZDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgcCA9IHAubmV4dCA9IG5ldyBOb2RlKGtleXNbaV0sIHZhbHVlc1tpXSk7XG4gICAgfVxuXG4gICAgcC5uZXh0ID0gbnVsbDtcbiAgICByZXR1cm4gaGVhZC5uZXh0O1xuICB9XG5cbiAgZnVuY3Rpb24gdG9MaXN0KHJvb3QpIHtcbiAgICB2YXIgY3VycmVudCA9IHJvb3Q7XG4gICAgdmFyIFEgPSBbXTtcbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgIHZhciBoZWFkID0gbmV3IE5vZGUobnVsbCwgbnVsbCk7XG4gICAgdmFyIHAgPSBoZWFkO1xuXG4gICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICBRLnB1c2goY3VycmVudCk7XG4gICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoUS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY3VycmVudCA9IHAgPSBwLm5leHQgPSBRLnBvcCgpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgICB9IGVsc2UgZG9uZSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcC5uZXh0ID0gbnVsbDsgLy8gdGhhdCdsbCB3b3JrIGV2ZW4gaWYgdGhlIHRyZWUgd2FzIGVtcHR5XG5cbiAgICByZXR1cm4gaGVhZC5uZXh0O1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydGVkTGlzdFRvQlNUKGxpc3QsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IGVuZCAtIHN0YXJ0O1xuXG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICB2YXIgbWlkZGxlID0gc3RhcnQgKyBNYXRoLmZsb29yKHNpemUgLyAyKTtcbiAgICAgIHZhciBsZWZ0ID0gc29ydGVkTGlzdFRvQlNUKGxpc3QsIHN0YXJ0LCBtaWRkbGUpO1xuICAgICAgdmFyIHJvb3QgPSBsaXN0LmhlYWQ7XG4gICAgICByb290LmxlZnQgPSBsZWZ0O1xuICAgICAgbGlzdC5oZWFkID0gbGlzdC5oZWFkLm5leHQ7XG4gICAgICByb290LnJpZ2h0ID0gc29ydGVkTGlzdFRvQlNUKGxpc3QsIG1pZGRsZSArIDEsIGVuZCk7XG4gICAgICByZXR1cm4gcm9vdDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlTGlzdHMobDEsIGwyLCBjb21wYXJlKSB7XG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZShudWxsLCBudWxsKTsgLy8gZHVtbXlcblxuICAgIHZhciBwID0gaGVhZDtcbiAgICB2YXIgcDEgPSBsMTtcbiAgICB2YXIgcDIgPSBsMjtcblxuICAgIHdoaWxlIChwMSAhPT0gbnVsbCAmJiBwMiAhPT0gbnVsbCkge1xuICAgICAgaWYgKGNvbXBhcmUocDEua2V5LCBwMi5rZXkpIDwgMCkge1xuICAgICAgICBwLm5leHQgPSBwMTtcbiAgICAgICAgcDEgPSBwMS5uZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcC5uZXh0ID0gcDI7XG4gICAgICAgIHAyID0gcDIubmV4dDtcbiAgICAgIH1cblxuICAgICAgcCA9IHAubmV4dDtcbiAgICB9XG5cbiAgICBpZiAocDEgIT09IG51bGwpIHtcbiAgICAgIHAubmV4dCA9IHAxO1xuICAgIH0gZWxzZSBpZiAocDIgIT09IG51bGwpIHtcbiAgICAgIHAubmV4dCA9IHAyO1xuICAgIH1cblxuICAgIHJldHVybiBoZWFkLm5leHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0KGtleXMsIHZhbHVlcywgbGVmdCwgcmlnaHQsIGNvbXBhcmUpIHtcbiAgICBpZiAobGVmdCA+PSByaWdodCkgcmV0dXJuO1xuICAgIHZhciBwaXZvdCA9IGtleXNbbGVmdCArIHJpZ2h0ID4+IDFdO1xuICAgIHZhciBpID0gbGVmdCAtIDE7XG4gICAgdmFyIGogPSByaWdodCArIDE7XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgZG8ge1xuICAgICAgICBpKys7XG4gICAgICB9IHdoaWxlIChjb21wYXJlKGtleXNbaV0sIHBpdm90KSA8IDApO1xuXG4gICAgICBkbyB7XG4gICAgICAgIGotLTtcbiAgICAgIH0gd2hpbGUgKGNvbXBhcmUoa2V5c1tqXSwgcGl2b3QpID4gMCk7XG5cbiAgICAgIGlmIChpID49IGopIGJyZWFrO1xuICAgICAgdmFyIHRtcCA9IGtleXNbaV07XG4gICAgICBrZXlzW2ldID0ga2V5c1tqXTtcbiAgICAgIGtleXNbal0gPSB0bXA7XG4gICAgICB0bXAgPSB2YWx1ZXNbaV07XG4gICAgICB2YWx1ZXNbaV0gPSB2YWx1ZXNbal07XG4gICAgICB2YWx1ZXNbal0gPSB0bXA7XG4gICAgfVxuXG4gICAgc29ydChrZXlzLCB2YWx1ZXMsIGxlZnQsIGosIGNvbXBhcmUpO1xuICAgIHNvcnQoa2V5cywgdmFsdWVzLCBqICsgMSwgcmlnaHQsIGNvbXBhcmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgYm91bmRpbmcgYm94IGhhcyB0aGUgZm9ybWF0OlxuICAgKlxuICAgKiAgeyBsbDogeyB4OiB4bWluLCB5OiB5bWluIH0sIHVyOiB7IHg6IHhtYXgsIHk6IHltYXggfSB9XG4gICAqXG4gICAqL1xuICB2YXIgaXNJbkJib3ggPSBmdW5jdGlvbiBpc0luQmJveChiYm94LCBwb2ludCkge1xuICAgIHJldHVybiBiYm94LmxsLnggPD0gcG9pbnQueCAmJiBwb2ludC54IDw9IGJib3gudXIueCAmJiBiYm94LmxsLnkgPD0gcG9pbnQueSAmJiBwb2ludC55IDw9IGJib3gudXIueTtcbiAgfTtcbiAgLyogUmV0dXJucyBlaXRoZXIgbnVsbCwgb3IgYSBiYm94IChha2EgYW4gb3JkZXJlZCBwYWlyIG9mIHBvaW50cylcbiAgICogSWYgdGhlcmUgaXMgb25seSBvbmUgcG9pbnQgb2Ygb3ZlcmxhcCwgYSBiYm94IHdpdGggaWRlbnRpY2FsIHBvaW50c1xuICAgKiB3aWxsIGJlIHJldHVybmVkICovXG5cbiAgdmFyIGdldEJib3hPdmVybGFwID0gZnVuY3Rpb24gZ2V0QmJveE92ZXJsYXAoYjEsIGIyKSB7XG4gICAgLy8gY2hlY2sgaWYgdGhlIGJib3hlcyBvdmVybGFwIGF0IGFsbFxuICAgIGlmIChiMi51ci54IDwgYjEubGwueCB8fCBiMS51ci54IDwgYjIubGwueCB8fCBiMi51ci55IDwgYjEubGwueSB8fCBiMS51ci55IDwgYjIubGwueSkgcmV0dXJuIG51bGw7IC8vIGZpbmQgdGhlIG1pZGRsZSB0d28gWCB2YWx1ZXNcblxuICAgIHZhciBsb3dlclggPSBiMS5sbC54IDwgYjIubGwueCA/IGIyLmxsLnggOiBiMS5sbC54O1xuICAgIHZhciB1cHBlclggPSBiMS51ci54IDwgYjIudXIueCA/IGIxLnVyLnggOiBiMi51ci54OyAvLyBmaW5kIHRoZSBtaWRkbGUgdHdvIFkgdmFsdWVzXG5cbiAgICB2YXIgbG93ZXJZID0gYjEubGwueSA8IGIyLmxsLnkgPyBiMi5sbC55IDogYjEubGwueTtcbiAgICB2YXIgdXBwZXJZID0gYjEudXIueSA8IGIyLnVyLnkgPyBiMS51ci55IDogYjIudXIueTsgLy8gcHV0IHRob3NlIG1pZGRsZSB2YWx1ZXMgdG9nZXRoZXIgdG8gZ2V0IHRoZSBvdmVybGFwXG5cbiAgICByZXR1cm4ge1xuICAgICAgbGw6IHtcbiAgICAgICAgeDogbG93ZXJYLFxuICAgICAgICB5OiBsb3dlcllcbiAgICAgIH0sXG4gICAgICB1cjoge1xuICAgICAgICB4OiB1cHBlclgsXG4gICAgICAgIHk6IHVwcGVyWVxuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLyogSmF2YXNjcmlwdCBkb2Vzbid0IGRvIGludGVnZXIgbWF0aC4gRXZlcnl0aGluZyBpc1xuICAgKiBmbG9hdGluZyBwb2ludCB3aXRoIHBlcmNpc2lvbiBOdW1iZXIuRVBTSUxPTi5cbiAgICpcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvTnVtYmVyL0VQU0lMT05cbiAgICovXG4gIHZhciBlcHNpbG9uID0gTnVtYmVyLkVQU0lMT047IC8vIElFIFBvbHlmaWxsXG5cbiAgaWYgKGVwc2lsb24gPT09IHVuZGVmaW5lZCkgZXBzaWxvbiA9IE1hdGgucG93KDIsIC01Mik7XG4gIHZhciBFUFNJTE9OX1NRID0gZXBzaWxvbiAqIGVwc2lsb247XG4gIC8qIEZMUCBjb21wYXJhdG9yICovXG5cbiAgdmFyIGNtcCA9IGZ1bmN0aW9uIGNtcChhLCBiKSB7XG4gICAgLy8gY2hlY2sgaWYgdGhleSdyZSBib3RoIDBcbiAgICBpZiAoLWVwc2lsb24gPCBhICYmIGEgPCBlcHNpbG9uKSB7XG4gICAgICBpZiAoLWVwc2lsb24gPCBiICYmIGIgPCBlcHNpbG9uKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH0gLy8gY2hlY2sgaWYgdGhleSdyZSBmbHAgZXF1YWxcblxuXG4gICAgdmFyIGFiID0gYSAtIGI7XG5cbiAgICBpZiAoYWIgKiBhYiA8IEVQU0lMT05fU1EgKiBhICogYikge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSAvLyBub3JtYWwgY29tcGFyaXNvblxuXG5cbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IDE7XG4gIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgY2xhc3Mgcm91bmRzIGluY29taW5nIHZhbHVlcyBzdWZmaWNpZW50bHkgc28gdGhhdFxuICAgKiBmbG9hdGluZyBwb2ludHMgcHJvYmxlbXMgYXJlLCBmb3IgdGhlIG1vc3QgcGFydCwgYXZvaWRlZC5cbiAgICpcbiAgICogSW5jb21pbmcgcG9pbnRzIGFyZSBoYXZlIHRoZWlyIHggJiB5IHZhbHVlcyB0ZXN0ZWQgYWdhaW5zdFxuICAgKiBhbGwgcHJldmlvdXNseSBzZWVuIHggJiB5IHZhbHVlcy4gSWYgZWl0aGVyIGlzICd0b28gY2xvc2UnXG4gICAqIHRvIGEgcHJldmlvdXNseSBzZWVuIHZhbHVlLCBpdCdzIHZhbHVlIGlzICdzbmFwcGVkJyB0byB0aGVcbiAgICogcHJldmlvdXNseSBzZWVuIHZhbHVlLlxuICAgKlxuICAgKiBBbGwgcG9pbnRzIHNob3VsZCBiZSByb3VuZGVkIGJ5IHRoaXMgY2xhc3MgYmVmb3JlIGJlaW5nXG4gICAqIHN0b3JlZCBpbiBhbnkgZGF0YSBzdHJ1Y3R1cmVzIGluIHRoZSByZXN0IG9mIHRoaXMgYWxnb3JpdGhtLlxuICAgKi9cblxuICB2YXIgUHRSb3VuZGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQdFJvdW5kZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUHRSb3VuZGVyKTtcblxuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQdFJvdW5kZXIsIFt7XG4gICAgICBrZXk6IFwicmVzZXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXNldCgpIHtcbiAgICAgICAgdGhpcy54Um91bmRlciA9IG5ldyBDb29yZFJvdW5kZXIoKTtcbiAgICAgICAgdGhpcy55Um91bmRlciA9IG5ldyBDb29yZFJvdW5kZXIoKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicm91bmRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByb3VuZCh4LCB5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogdGhpcy54Um91bmRlci5yb3VuZCh4KSxcbiAgICAgICAgICB5OiB0aGlzLnlSb3VuZGVyLnJvdW5kKHkpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFB0Um91bmRlcjtcbiAgfSgpO1xuXG4gIHZhciBDb29yZFJvdW5kZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvb3JkUm91bmRlcigpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDb29yZFJvdW5kZXIpO1xuXG4gICAgICB0aGlzLnRyZWUgPSBuZXcgVHJlZSgpOyAvLyBwcmVzZWVkIHdpdGggMCBzbyB3ZSBkb24ndCBlbmQgdXAgd2l0aCB2YWx1ZXMgPCBOdW1iZXIuRVBTSUxPTlxuXG4gICAgICB0aGlzLnJvdW5kKDApO1xuICAgIH0gLy8gTm90ZTogdGhpcyBjYW4gcm91bmRzIGlucHV0IHZhbHVlcyBiYWNrd2FyZHMgb3IgZm9yd2FyZHMuXG4gICAgLy8gICAgICAgWW91IG1pZ2h0IGFzaywgd2h5IG5vdCByZXN0cmljdCB0aGlzIHRvIGp1c3Qgcm91bmRpbmdcbiAgICAvLyAgICAgICBmb3J3YXJkcz8gV291bGRuJ3QgdGhhdCBhbGxvdyBsZWZ0IGVuZHBvaW50cyB0byBhbHdheXNcbiAgICAvLyAgICAgICByZW1haW4gbGVmdCBlbmRwb2ludHMgZHVyaW5nIHNwbGl0dGluZyAobmV2ZXIgY2hhbmdlIHRvXG4gICAgLy8gICAgICAgcmlnaHQpLiBObyAtIGl0IHdvdWxkbid0LCBiZWNhdXNlIHdlIHNuYXAgaW50ZXJzZWN0aW9uc1xuICAgIC8vICAgICAgIHRvIGVuZHBvaW50cyAodG8gZXN0YWJsaXNoIGluZGVwZW5kZW5jZSBmcm9tIHRoZSBzZWdtZW50XG4gICAgLy8gICAgICAgYW5nbGUgZm9yIHQtaW50ZXJzZWN0aW9ucykuXG5cblxuICAgIF9jcmVhdGVDbGFzcyhDb29yZFJvdW5kZXIsIFt7XG4gICAgICBrZXk6IFwicm91bmRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByb3VuZChjb29yZCkge1xuICAgICAgICB2YXIgbm9kZSA9IHRoaXMudHJlZS5hZGQoY29vcmQpO1xuICAgICAgICB2YXIgcHJldk5vZGUgPSB0aGlzLnRyZWUucHJldihub2RlKTtcblxuICAgICAgICBpZiAocHJldk5vZGUgIT09IG51bGwgJiYgY21wKG5vZGUua2V5LCBwcmV2Tm9kZS5rZXkpID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50cmVlLnJlbW92ZShjb29yZCk7XG4gICAgICAgICAgcmV0dXJuIHByZXZOb2RlLmtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBuZXh0Tm9kZSA9IHRoaXMudHJlZS5uZXh0KG5vZGUpO1xuXG4gICAgICAgIGlmIChuZXh0Tm9kZSAhPT0gbnVsbCAmJiBjbXAobm9kZS5rZXksIG5leHROb2RlLmtleSkgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnRyZWUucmVtb3ZlKGNvb3JkKTtcbiAgICAgICAgICByZXR1cm4gbmV4dE5vZGUua2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDb29yZFJvdW5kZXI7XG4gIH0oKTsgLy8gc2luZ2xldG9uIGF2YWlsYWJsZSBieSBpbXBvcnRcblxuXG4gIHZhciByb3VuZGVyID0gbmV3IFB0Um91bmRlcigpO1xuXG4gIC8qIENyb3NzIFByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMgd2l0aCBmaXJzdCBwb2ludCBhdCBvcmlnaW4gKi9cblxuICB2YXIgY3Jvc3NQcm9kdWN0ID0gZnVuY3Rpb24gY3Jvc3NQcm9kdWN0KGEsIGIpIHtcbiAgICByZXR1cm4gYS54ICogYi55IC0gYS55ICogYi54O1xuICB9O1xuICAvKiBEb3QgUHJvZHVjdCBvZiB0d28gdmVjdG9ycyB3aXRoIGZpcnN0IHBvaW50IGF0IG9yaWdpbiAqL1xuXG4gIHZhciBkb3RQcm9kdWN0ID0gZnVuY3Rpb24gZG90UHJvZHVjdChhLCBiKSB7XG4gICAgcmV0dXJuIGEueCAqIGIueCArIGEueSAqIGIueTtcbiAgfTtcbiAgLyogQ29tcGFyYXRvciBmb3IgdHdvIHZlY3RvcnMgd2l0aCBzYW1lIHN0YXJ0aW5nIHBvaW50ICovXG5cbiAgdmFyIGNvbXBhcmVWZWN0b3JBbmdsZXMgPSBmdW5jdGlvbiBjb21wYXJlVmVjdG9yQW5nbGVzKGJhc2VQdCwgZW5kUHQxLCBlbmRQdDIpIHtcbiAgICB2YXIgdjEgPSB7XG4gICAgICB4OiBlbmRQdDEueCAtIGJhc2VQdC54LFxuICAgICAgeTogZW5kUHQxLnkgLSBiYXNlUHQueVxuICAgIH07XG4gICAgdmFyIHYyID0ge1xuICAgICAgeDogZW5kUHQyLnggLSBiYXNlUHQueCxcbiAgICAgIHk6IGVuZFB0Mi55IC0gYmFzZVB0LnlcbiAgICB9O1xuICAgIHZhciBrcm9zcyA9IGNyb3NzUHJvZHVjdCh2MSwgdjIpO1xuICAgIHJldHVybiBjbXAoa3Jvc3MsIDApO1xuICB9O1xuICB2YXIgbGVuZ3RoID0gZnVuY3Rpb24gbGVuZ3RoKHYpIHtcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGRvdFByb2R1Y3QodiwgdikpO1xuICB9O1xuICAvKiBHZXQgdGhlIHNpbmUgb2YgdGhlIGFuZ2xlIGZyb20gcFNoYXJlZCAtPiBwQW5nbGUgdG8gcFNoYWVkIC0+IHBCYXNlICovXG5cbiAgdmFyIHNpbmVPZkFuZ2xlID0gZnVuY3Rpb24gc2luZU9mQW5nbGUocFNoYXJlZCwgcEJhc2UsIHBBbmdsZSkge1xuICAgIHZhciB2QmFzZSA9IHtcbiAgICAgIHg6IHBCYXNlLnggLSBwU2hhcmVkLngsXG4gICAgICB5OiBwQmFzZS55IC0gcFNoYXJlZC55XG4gICAgfTtcbiAgICB2YXIgdkFuZ2xlID0ge1xuICAgICAgeDogcEFuZ2xlLnggLSBwU2hhcmVkLngsXG4gICAgICB5OiBwQW5nbGUueSAtIHBTaGFyZWQueVxuICAgIH07XG4gICAgcmV0dXJuIGNyb3NzUHJvZHVjdCh2QW5nbGUsIHZCYXNlKSAvIGxlbmd0aCh2QW5nbGUpIC8gbGVuZ3RoKHZCYXNlKTtcbiAgfTtcbiAgLyogR2V0IHRoZSBjb3NpbmUgb2YgdGhlIGFuZ2xlIGZyb20gcFNoYXJlZCAtPiBwQW5nbGUgdG8gcFNoYWVkIC0+IHBCYXNlICovXG5cbiAgdmFyIGNvc2luZU9mQW5nbGUgPSBmdW5jdGlvbiBjb3NpbmVPZkFuZ2xlKHBTaGFyZWQsIHBCYXNlLCBwQW5nbGUpIHtcbiAgICB2YXIgdkJhc2UgPSB7XG4gICAgICB4OiBwQmFzZS54IC0gcFNoYXJlZC54LFxuICAgICAgeTogcEJhc2UueSAtIHBTaGFyZWQueVxuICAgIH07XG4gICAgdmFyIHZBbmdsZSA9IHtcbiAgICAgIHg6IHBBbmdsZS54IC0gcFNoYXJlZC54LFxuICAgICAgeTogcEFuZ2xlLnkgLSBwU2hhcmVkLnlcbiAgICB9O1xuICAgIHJldHVybiBkb3RQcm9kdWN0KHZBbmdsZSwgdkJhc2UpIC8gbGVuZ3RoKHZBbmdsZSkgLyBsZW5ndGgodkJhc2UpO1xuICB9O1xuICAvKiBHZXQgdGhlIHggY29vcmRpbmF0ZSB3aGVyZSB0aGUgZ2l2ZW4gbGluZSAoZGVmaW5lZCBieSBhIHBvaW50IGFuZCB2ZWN0b3IpXG4gICAqIGNyb3NzZXMgdGhlIGhvcml6b250YWwgbGluZSB3aXRoIHRoZSBnaXZlbiB5IGNvb3JkaWFudGUuXG4gICAqIEluIHRoZSBjYXNlIG9mIHBhcnJhbGxlbCBsaW5lcyAoaW5jbHVkaW5nIG92ZXJsYXBwaW5nIG9uZXMpIHJldHVybnMgbnVsbC4gKi9cblxuICB2YXIgaG9yaXpvbnRhbEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIGhvcml6b250YWxJbnRlcnNlY3Rpb24ocHQsIHYsIHkpIHtcbiAgICBpZiAodi55ID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgeDogcHQueCArIHYueCAvIHYueSAqICh5IC0gcHQueSksXG4gICAgICB5OiB5XG4gICAgfTtcbiAgfTtcbiAgLyogR2V0IHRoZSB5IGNvb3JkaW5hdGUgd2hlcmUgdGhlIGdpdmVuIGxpbmUgKGRlZmluZWQgYnkgYSBwb2ludCBhbmQgdmVjdG9yKVxuICAgKiBjcm9zc2VzIHRoZSB2ZXJ0aWNhbCBsaW5lIHdpdGggdGhlIGdpdmVuIHggY29vcmRpYW50ZS5cbiAgICogSW4gdGhlIGNhc2Ugb2YgcGFycmFsbGVsIGxpbmVzIChpbmNsdWRpbmcgb3ZlcmxhcHBpbmcgb25lcykgcmV0dXJucyBudWxsLiAqL1xuXG4gIHZhciB2ZXJ0aWNhbEludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIHZlcnRpY2FsSW50ZXJzZWN0aW9uKHB0LCB2LCB4KSB7XG4gICAgaWYgKHYueCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiBwdC55ICsgdi55IC8gdi54ICogKHggLSBwdC54KVxuICAgIH07XG4gIH07XG4gIC8qIEdldCB0aGUgaW50ZXJzZWN0aW9uIG9mIHR3byBsaW5lcywgZWFjaCBkZWZpbmVkIGJ5IGEgYmFzZSBwb2ludCBhbmQgYSB2ZWN0b3IuXG4gICAqIEluIHRoZSBjYXNlIG9mIHBhcnJhbGxlbCBsaW5lcyAoaW5jbHVkaW5nIG92ZXJsYXBwaW5nIG9uZXMpIHJldHVybnMgbnVsbC4gKi9cblxuICB2YXIgaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHB0MSwgdjEsIHB0MiwgdjIpIHtcbiAgICAvLyB0YWtlIHNvbWUgc2hvcnRjdXRzIGZvciB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbCBsaW5lc1xuICAgIC8vIHRoaXMgYWxzbyBlbnN1cmVzIHdlIGRvbid0IGNhbGN1bGF0ZSBhbiBpbnRlcnNlY3Rpb24gYW5kIHRoZW4gZGlzY292ZXJcbiAgICAvLyBpdCdzIGFjdHVhbGx5IG91dHNpZGUgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgbGluZVxuICAgIGlmICh2MS54ID09PSAwKSByZXR1cm4gdmVydGljYWxJbnRlcnNlY3Rpb24ocHQyLCB2MiwgcHQxLngpO1xuICAgIGlmICh2Mi54ID09PSAwKSByZXR1cm4gdmVydGljYWxJbnRlcnNlY3Rpb24ocHQxLCB2MSwgcHQyLngpO1xuICAgIGlmICh2MS55ID09PSAwKSByZXR1cm4gaG9yaXpvbnRhbEludGVyc2VjdGlvbihwdDIsIHYyLCBwdDEueSk7XG4gICAgaWYgKHYyLnkgPT09IDApIHJldHVybiBob3Jpem9udGFsSW50ZXJzZWN0aW9uKHB0MSwgdjEsIHB0Mi55KTsgLy8gR2VuZXJhbCBjYXNlIGZvciBub24tb3ZlcmxhcHBpbmcgc2VnbWVudHMuXG4gICAgLy8gVGhpcyBhbGdvcml0aG0gaXMgYmFzZWQgb24gU2NobmVpZGVyIGFuZCBFYmVybHkuXG4gICAgLy8gaHR0cDovL3d3dy5jaW1lYy5vcmcuYXIvfm5jYWx2by9TY2huZWlkZXJfRWJlcmx5LnBkZiAtIHBnIDI0NFxuXG4gICAgdmFyIGtyb3NzID0gY3Jvc3NQcm9kdWN0KHYxLCB2Mik7XG4gICAgaWYgKGtyb3NzID09IDApIHJldHVybiBudWxsO1xuICAgIHZhciB2ZSA9IHtcbiAgICAgIHg6IHB0Mi54IC0gcHQxLngsXG4gICAgICB5OiBwdDIueSAtIHB0MS55XG4gICAgfTtcbiAgICB2YXIgZDEgPSBjcm9zc1Byb2R1Y3QodmUsIHYxKSAvIGtyb3NzO1xuICAgIHZhciBkMiA9IGNyb3NzUHJvZHVjdCh2ZSwgdjIpIC8ga3Jvc3M7IC8vIHRha2UgdGhlIGF2ZXJhZ2Ugb2YgdGhlIHR3byBjYWxjdWxhdGlvbnMgdG8gbWluaW1pemUgcm91bmRpbmcgZXJyb3JcblxuICAgIHZhciB4MSA9IHB0MS54ICsgZDIgKiB2MS54LFxuICAgICAgICB4MiA9IHB0Mi54ICsgZDEgKiB2Mi54O1xuICAgIHZhciB5MSA9IHB0MS55ICsgZDIgKiB2MS55LFxuICAgICAgICB5MiA9IHB0Mi55ICsgZDEgKiB2Mi55O1xuICAgIHZhciB4ID0gKHgxICsgeDIpIC8gMjtcbiAgICB2YXIgeSA9ICh5MSArIHkyKSAvIDI7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfTtcbiAgfTtcblxuICB2YXIgU3dlZXBFdmVudCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgX2NyZWF0ZUNsYXNzKFN3ZWVwRXZlbnQsIG51bGwsIFt7XG4gICAgICBrZXk6IFwiY29tcGFyZVwiLFxuICAgICAgLy8gZm9yIG9yZGVyaW5nIHN3ZWVwIGV2ZW50cyBpbiB0aGUgc3dlZXAgZXZlbnQgcXVldWVcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICAgICAgLy8gZmF2b3IgZXZlbnQgd2l0aCBhIHBvaW50IHRoYXQgdGhlIHN3ZWVwIGxpbmUgaGl0cyBmaXJzdFxuICAgICAgICB2YXIgcHRDbXAgPSBTd2VlcEV2ZW50LmNvbXBhcmVQb2ludHMoYS5wb2ludCwgYi5wb2ludCk7XG4gICAgICAgIGlmIChwdENtcCAhPT0gMCkgcmV0dXJuIHB0Q21wOyAvLyB0aGUgcG9pbnRzIGFyZSB0aGUgc2FtZSwgc28gbGluayB0aGVtIGlmIG5lZWRlZFxuXG4gICAgICAgIGlmIChhLnBvaW50ICE9PSBiLnBvaW50KSBhLmxpbmsoYik7IC8vIGZhdm9yIHJpZ2h0IGV2ZW50cyBvdmVyIGxlZnRcblxuICAgICAgICBpZiAoYS5pc0xlZnQgIT09IGIuaXNMZWZ0KSByZXR1cm4gYS5pc0xlZnQgPyAxIDogLTE7IC8vIHdlIGhhdmUgdHdvIG1hdGNoaW5nIGxlZnQgb3IgcmlnaHQgZW5kcG9pbnRzXG4gICAgICAgIC8vIG9yZGVyaW5nIG9mIHRoaXMgY2FzZSBpcyB0aGUgc2FtZSBhcyBmb3IgdGhlaXIgc2VnbWVudHNcblxuICAgICAgICByZXR1cm4gU2VnbWVudC5jb21wYXJlKGEuc2VnbWVudCwgYi5zZWdtZW50KTtcbiAgICAgIH0gLy8gZm9yIG9yZGVyaW5nIHBvaW50cyBpbiBzd2VlcCBsaW5lIG9yZGVyXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY29tcGFyZVBvaW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBhcmVQb2ludHMoYVB0LCBiUHQpIHtcbiAgICAgICAgaWYgKGFQdC54IDwgYlB0LngpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFQdC54ID4gYlB0LngpIHJldHVybiAxO1xuICAgICAgICBpZiAoYVB0LnkgPCBiUHQueSkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYVB0LnkgPiBiUHQueSkgcmV0dXJuIDE7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSAvLyBXYXJuaW5nOiAncG9pbnQnIGlucHV0IHdpbGwgYmUgbW9kaWZpZWQgYW5kIHJlLXVzZWQgKGZvciBwZXJmb3JtYW5jZSlcblxuICAgIH1dKTtcblxuICAgIGZ1bmN0aW9uIFN3ZWVwRXZlbnQocG9pbnQsIGlzTGVmdCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN3ZWVwRXZlbnQpO1xuXG4gICAgICBpZiAocG9pbnQuZXZlbnRzID09PSB1bmRlZmluZWQpIHBvaW50LmV2ZW50cyA9IFt0aGlzXTtlbHNlIHBvaW50LmV2ZW50cy5wdXNoKHRoaXMpO1xuICAgICAgdGhpcy5wb2ludCA9IHBvaW50O1xuICAgICAgdGhpcy5pc0xlZnQgPSBpc0xlZnQ7IC8vIHRoaXMuc2VnbWVudCwgdGhpcy5vdGhlclNFIHNldCBieSBmYWN0b3J5XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFN3ZWVwRXZlbnQsIFt7XG4gICAgICBrZXk6IFwibGlua1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxpbmsob3RoZXIpIHtcbiAgICAgICAgaWYgKG90aGVyLnBvaW50ID09PSB0aGlzLnBvaW50KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmllZCB0byBsaW5rIGFscmVhZHkgbGlua2VkIGV2ZW50cycpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG90aGVyRXZlbnRzID0gb3RoZXIucG9pbnQuZXZlbnRzO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gb3RoZXJFdmVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGV2dCA9IG90aGVyRXZlbnRzW2ldO1xuICAgICAgICAgIHRoaXMucG9pbnQuZXZlbnRzLnB1c2goZXZ0KTtcbiAgICAgICAgICBldnQucG9pbnQgPSB0aGlzLnBvaW50O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jaGVja0ZvckNvbnN1bWluZygpO1xuICAgICAgfVxuICAgICAgLyogRG8gYSBwYXNzIG92ZXIgb3VyIGxpbmtlZCBldmVudHMgYW5kIGNoZWNrIHRvIHNlZSBpZiBhbnkgcGFpclxuICAgICAgICogb2Ygc2VnbWVudHMgbWF0Y2gsIGFuZCBzaG91bGQgYmUgY29uc3VtZWQuICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY2hlY2tGb3JDb25zdW1pbmdcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjaGVja0ZvckNvbnN1bWluZygpIHtcbiAgICAgICAgLy8gRklYTUU6IFRoZSBsb29wcyBpbiB0aGlzIG1ldGhvZCBydW4gTyhuXjIpID0+IG5vIGdvb2QuXG4gICAgICAgIC8vICAgICAgICBNYWludGFpbiBsaXR0bGUgb3JkZXJlZCBzd2VlcCBldmVudCB0cmVlcz9cbiAgICAgICAgLy8gICAgICAgIENhbiB3ZSBtYWludGFpbmluZyBhbiBvcmRlcmluZyB0aGF0IGF2b2lkcyB0aGUgbmVlZFxuICAgICAgICAvLyAgICAgICAgZm9yIHRoZSByZS1zb3J0aW5nIHdpdGggZ2V0TGVmdG1vc3RDb21wYXJhdG9yIGluIGdlb20tb3V0P1xuICAgICAgICAvLyBDb21wYXJlIGVhY2ggcGFpciBvZiBldmVudHMgdG8gc2VlIGlmIG90aGVyIGV2ZW50cyBhbHNvIG1hdGNoXG4gICAgICAgIHZhciBudW1FdmVudHMgPSB0aGlzLnBvaW50LmV2ZW50cy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1FdmVudHM7IGkrKykge1xuICAgICAgICAgIHZhciBldnQxID0gdGhpcy5wb2ludC5ldmVudHNbaV07XG4gICAgICAgICAgaWYgKGV2dDEuc2VnbWVudC5jb25zdW1lZEJ5ICE9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IGkgKyAxOyBqIDwgbnVtRXZlbnRzOyBqKyspIHtcbiAgICAgICAgICAgIHZhciBldnQyID0gdGhpcy5wb2ludC5ldmVudHNbal07XG4gICAgICAgICAgICBpZiAoZXZ0Mi5jb25zdW1lZEJ5ICE9PSB1bmRlZmluZWQpIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGV2dDEub3RoZXJTRS5wb2ludC5ldmVudHMgIT09IGV2dDIub3RoZXJTRS5wb2ludC5ldmVudHMpIGNvbnRpbnVlO1xuICAgICAgICAgICAgZXZ0MS5zZWdtZW50LmNvbnN1bWUoZXZ0Mi5zZWdtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0QXZhaWxhYmxlTGlua2VkRXZlbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0QXZhaWxhYmxlTGlua2VkRXZlbnRzKCkge1xuICAgICAgICAvLyBwb2ludC5ldmVudHMgaXMgYWx3YXlzIG9mIGxlbmd0aCAyIG9yIGdyZWF0ZXJcbiAgICAgICAgdmFyIGV2ZW50cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5wb2ludC5ldmVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGV2dCA9IHRoaXMucG9pbnQuZXZlbnRzW2ldO1xuXG4gICAgICAgICAgaWYgKGV2dCAhPT0gdGhpcyAmJiAhZXZ0LnNlZ21lbnQucmluZ091dCAmJiBldnQuc2VnbWVudC5pc0luUmVzdWx0KCkpIHtcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKGV2dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGV2ZW50cztcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gZm9yIHNvcnRpbmcgbGlua2VkIGV2ZW50cyB0aGF0IHdpbGxcbiAgICAgICAqIGZhdm9yIHRoZSBldmVudCB0aGF0IHdpbGwgZ2l2ZSB1cyB0aGUgc21hbGxlc3QgbGVmdC1zaWRlIGFuZ2xlLlxuICAgICAgICogQWxsIHJpbmcgY29uc3RydWN0aW9uIHN0YXJ0cyBhcyBsb3cgYXMgcG9zc2libGUgaGVhZGluZyB0byB0aGUgcmlnaHQsXG4gICAgICAgKiBzbyBieSBhbHdheXMgdHVybmluZyBsZWZ0IGFzIHNoYXJwIGFzIHBvc3NpYmxlIHdlJ2xsIGdldCBwb2x5Z29uc1xuICAgICAgICogd2l0aG91dCB1bmNlc3NhcnkgbG9vcHMgJiBob2xlcy5cbiAgICAgICAqXG4gICAgICAgKiBUaGUgY29tcGFyYXRvciBmdW5jdGlvbiBoYXMgYSBjb21wdXRlIGNhY2hlIHN1Y2ggdGhhdCBpdCBhdm9pZHNcbiAgICAgICAqIHJlLWNvbXB1dGluZyBhbHJlYWR5LWNvbXB1dGVkIHZhbHVlcy5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImdldExlZnRtb3N0Q29tcGFyYXRvclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldExlZnRtb3N0Q29tcGFyYXRvcihiYXNlRXZlbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB2YXIgY2FjaGUgPSBuZXcgTWFwKCk7XG5cbiAgICAgICAgdmFyIGZpbGxDYWNoZSA9IGZ1bmN0aW9uIGZpbGxDYWNoZShsaW5rZWRFdmVudCkge1xuICAgICAgICAgIHZhciBuZXh0RXZlbnQgPSBsaW5rZWRFdmVudC5vdGhlclNFO1xuICAgICAgICAgIGNhY2hlLnNldChsaW5rZWRFdmVudCwge1xuICAgICAgICAgICAgc2luZTogc2luZU9mQW5nbGUoX3RoaXMucG9pbnQsIGJhc2VFdmVudC5wb2ludCwgbmV4dEV2ZW50LnBvaW50KSxcbiAgICAgICAgICAgIGNvc2luZTogY29zaW5lT2ZBbmdsZShfdGhpcy5wb2ludCwgYmFzZUV2ZW50LnBvaW50LCBuZXh0RXZlbnQucG9pbnQpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgaWYgKCFjYWNoZS5oYXMoYSkpIGZpbGxDYWNoZShhKTtcbiAgICAgICAgICBpZiAoIWNhY2hlLmhhcyhiKSkgZmlsbENhY2hlKGIpO1xuXG4gICAgICAgICAgdmFyIF9jYWNoZSRnZXQgPSBjYWNoZS5nZXQoYSksXG4gICAgICAgICAgICAgIGFzaW5lID0gX2NhY2hlJGdldC5zaW5lLFxuICAgICAgICAgICAgICBhY29zaW5lID0gX2NhY2hlJGdldC5jb3NpbmU7XG5cbiAgICAgICAgICB2YXIgX2NhY2hlJGdldDIgPSBjYWNoZS5nZXQoYiksXG4gICAgICAgICAgICAgIGJzaW5lID0gX2NhY2hlJGdldDIuc2luZSxcbiAgICAgICAgICAgICAgYmNvc2luZSA9IF9jYWNoZSRnZXQyLmNvc2luZTsgLy8gYm90aCBvbiBvciBhYm92ZSB4LWF4aXNcblxuXG4gICAgICAgICAgaWYgKGFzaW5lID49IDAgJiYgYnNpbmUgPj0gMCkge1xuICAgICAgICAgICAgaWYgKGFjb3NpbmUgPCBiY29zaW5lKSByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChhY29zaW5lID4gYmNvc2luZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSAvLyBib3RoIGJlbG93IHgtYXhpc1xuXG5cbiAgICAgICAgICBpZiAoYXNpbmUgPCAwICYmIGJzaW5lIDwgMCkge1xuICAgICAgICAgICAgaWYgKGFjb3NpbmUgPCBiY29zaW5lKSByZXR1cm4gLTE7XG4gICAgICAgICAgICBpZiAoYWNvc2luZSA+IGJjb3NpbmUpIHJldHVybiAxO1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgfSAvLyBvbmUgYWJvdmUgeC1heGlzLCBvbmUgYmVsb3dcblxuXG4gICAgICAgICAgaWYgKGJzaW5lIDwgYXNpbmUpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYnNpbmUgPiBhc2luZSkgcmV0dXJuIDE7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFN3ZWVwRXZlbnQ7XG4gIH0oKTtcblxuICAvLyBzZWdtZW50cyBhbmQgc3dlZXAgZXZlbnRzIHdoZW4gYWxsIGVsc2UgaXMgaWRlbnRpY2FsXG5cbiAgdmFyIHNlZ21lbnRJZCA9IDA7XG5cbiAgdmFyIFNlZ21lbnQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIF9jcmVhdGVDbGFzcyhTZWdtZW50LCBudWxsLCBbe1xuICAgICAga2V5OiBcImNvbXBhcmVcIixcblxuICAgICAgLyogVGhpcyBjb21wYXJlKCkgZnVuY3Rpb24gaXMgZm9yIG9yZGVyaW5nIHNlZ21lbnRzIGluIHRoZSBzd2VlcFxuICAgICAgICogbGluZSB0cmVlLCBhbmQgZG9lcyBzbyBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBjcml0ZXJpYTpcbiAgICAgICAqXG4gICAgICAgKiBDb25zaWRlciB0aGUgdmVydGljYWwgbGluZSB0aGF0IGxpZXMgYW4gaW5maW5lc3RpbWFsIHN0ZXAgdG8gdGhlXG4gICAgICAgKiByaWdodCBvZiB0aGUgcmlnaHQtbW9yZSBvZiB0aGUgdHdvIGxlZnQgZW5kcG9pbnRzIG9mIHRoZSBpbnB1dFxuICAgICAgICogc2VnbWVudHMuIEltYWdpbmUgc2xvd2x5IG1vdmluZyBhIHBvaW50IHVwIGZyb20gbmVnYXRpdmUgaW5maW5pdHlcbiAgICAgICAqIGluIHRoZSBpbmNyZWFzaW5nIHkgZGlyZWN0aW9uLiBXaGljaCBvZiB0aGUgdHdvIHNlZ21lbnRzIHdpbGwgdGhhdFxuICAgICAgICogcG9pbnQgaW50ZXJzZWN0IGZpcnN0PyBUaGF0IHNlZ21lbnQgY29tZXMgJ2JlZm9yZScgdGhlIG90aGVyIG9uZS5cbiAgICAgICAqXG4gICAgICAgKiBJZiBuZWl0aGVyIHNlZ21lbnQgd291bGQgYmUgaW50ZXJzZWN0ZWQgYnkgc3VjaCBhIGxpbmUsIChpZiBvbmVcbiAgICAgICAqIG9yIG1vcmUgb2YgdGhlIHNlZ21lbnRzIGFyZSB2ZXJ0aWNhbCkgdGhlbiB0aGUgbGluZSB0byBiZSBjb25zaWRlcmVkXG4gICAgICAgKiBpcyBkaXJlY3RseSBvbiB0aGUgcmlnaHQtbW9yZSBvZiB0aGUgdHdvIGxlZnQgaW5wdXRzLlxuICAgICAgICovXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgICAgIHZhciBhbHggPSBhLmxlZnRTRS5wb2ludC54O1xuICAgICAgICB2YXIgYmx4ID0gYi5sZWZ0U0UucG9pbnQueDtcbiAgICAgICAgdmFyIGFyeCA9IGEucmlnaHRTRS5wb2ludC54O1xuICAgICAgICB2YXIgYnJ4ID0gYi5yaWdodFNFLnBvaW50Lng7IC8vIGNoZWNrIGlmIHRoZXkncmUgZXZlbiBpbiB0aGUgc2FtZSB2ZXJ0aWNhbCBwbGFuZVxuXG4gICAgICAgIGlmIChicnggPCBhbHgpIHJldHVybiAxO1xuICAgICAgICBpZiAoYXJ4IDwgYmx4KSByZXR1cm4gLTE7XG4gICAgICAgIHZhciBhbHkgPSBhLmxlZnRTRS5wb2ludC55O1xuICAgICAgICB2YXIgYmx5ID0gYi5sZWZ0U0UucG9pbnQueTtcbiAgICAgICAgdmFyIGFyeSA9IGEucmlnaHRTRS5wb2ludC55O1xuICAgICAgICB2YXIgYnJ5ID0gYi5yaWdodFNFLnBvaW50Lnk7IC8vIGlzIGxlZnQgZW5kcG9pbnQgb2Ygc2VnbWVudCBCIHRoZSByaWdodC1tb3JlP1xuXG4gICAgICAgIGlmIChhbHggPCBibHgpIHtcbiAgICAgICAgICAvLyBhcmUgdGhlIHR3byBzZWdtZW50cyBpbiB0aGUgc2FtZSBob3Jpem9udGFsIHBsYW5lP1xuICAgICAgICAgIGlmIChibHkgPCBhbHkgJiYgYmx5IDwgYXJ5KSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYmx5ID4gYWx5ICYmIGJseSA+IGFyeSkgcmV0dXJuIC0xOyAvLyBpcyB0aGUgQiBsZWZ0IGVuZHBvaW50IGNvbGluZWFyIHRvIHNlZ21lbnQgQT9cblxuICAgICAgICAgIHZhciBhQ21wQkxlZnQgPSBhLmNvbXBhcmVQb2ludChiLmxlZnRTRS5wb2ludCk7XG4gICAgICAgICAgaWYgKGFDbXBCTGVmdCA8IDApIHJldHVybiAxO1xuICAgICAgICAgIGlmIChhQ21wQkxlZnQgPiAwKSByZXR1cm4gLTE7IC8vIGlzIHRoZSBBIHJpZ2h0IGVuZHBvaW50IGNvbGluZWFyIHRvIHNlZ21lbnQgQiA/XG5cbiAgICAgICAgICB2YXIgYkNtcEFSaWdodCA9IGIuY29tcGFyZVBvaW50KGEucmlnaHRTRS5wb2ludCk7XG4gICAgICAgICAgaWYgKGJDbXBBUmlnaHQgIT09IDApIHJldHVybiBiQ21wQVJpZ2h0OyAvLyBjb2xpbmVhciBzZWdtZW50cywgY29uc2lkZXIgdGhlIG9uZSB3aXRoIGxlZnQtbW9yZVxuICAgICAgICAgIC8vIGxlZnQgZW5kcG9pbnQgdG8gYmUgZmlyc3QgKGFyYml0cmFyeT8pXG5cbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gLy8gaXMgbGVmdCBlbmRwb2ludCBvZiBzZWdtZW50IEEgdGhlIHJpZ2h0LW1vcmU/XG5cblxuICAgICAgICBpZiAoYWx4ID4gYmx4KSB7XG4gICAgICAgICAgaWYgKGFseSA8IGJseSAmJiBhbHkgPCBicnkpIHJldHVybiAtMTtcbiAgICAgICAgICBpZiAoYWx5ID4gYmx5ICYmIGFseSA+IGJyeSkgcmV0dXJuIDE7IC8vIGlzIHRoZSBBIGxlZnQgZW5kcG9pbnQgY29saW5lYXIgdG8gc2VnbWVudCBCP1xuXG4gICAgICAgICAgdmFyIGJDbXBBTGVmdCA9IGIuY29tcGFyZVBvaW50KGEubGVmdFNFLnBvaW50KTtcbiAgICAgICAgICBpZiAoYkNtcEFMZWZ0ICE9PSAwKSByZXR1cm4gYkNtcEFMZWZ0OyAvLyBpcyB0aGUgQiByaWdodCBlbmRwb2ludCBjb2xpbmVhciB0byBzZWdtZW50IEE/XG5cbiAgICAgICAgICB2YXIgYUNtcEJSaWdodCA9IGEuY29tcGFyZVBvaW50KGIucmlnaHRTRS5wb2ludCk7XG4gICAgICAgICAgaWYgKGFDbXBCUmlnaHQgPCAwKSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYUNtcEJSaWdodCA+IDApIHJldHVybiAtMTsgLy8gY29saW5lYXIgc2VnbWVudHMsIGNvbnNpZGVyIHRoZSBvbmUgd2l0aCBsZWZ0LW1vcmVcbiAgICAgICAgICAvLyBsZWZ0IGVuZHBvaW50IHRvIGJlIGZpcnN0IChhcmJpdHJhcnk/KVxuXG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gLy8gaWYgd2UgZ2V0IGhlcmUsIHRoZSB0d28gbGVmdCBlbmRwb2ludHMgYXJlIGluIHRoZSBzYW1lXG4gICAgICAgIC8vIHZlcnRpY2FsIHBsYW5lLCBpZSBhbHggPT09IGJseFxuICAgICAgICAvLyBjb25zaWRlciB0aGUgbG93ZXIgbGVmdC1lbmRwb2ludCB0byBjb21lIGZpcnN0XG5cblxuICAgICAgICBpZiAoYWx5IDwgYmx5KSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhbHkgPiBibHkpIHJldHVybiAxOyAvLyBsZWZ0IGVuZHBvaW50cyBhcmUgaWRlbnRpY2FsXG4gICAgICAgIC8vIGNoZWNrIGZvciBjb2xpbmVhcml0eSBieSB1c2luZyB0aGUgbGVmdC1tb3JlIHJpZ2h0IGVuZHBvaW50XG4gICAgICAgIC8vIGlzIHRoZSBBIHJpZ2h0IGVuZHBvaW50IG1vcmUgbGVmdC1tb3JlP1xuXG4gICAgICAgIGlmIChhcnggPCBicngpIHtcbiAgICAgICAgICB2YXIgX2JDbXBBUmlnaHQgPSBiLmNvbXBhcmVQb2ludChhLnJpZ2h0U0UucG9pbnQpO1xuXG4gICAgICAgICAgaWYgKF9iQ21wQVJpZ2h0ICE9PSAwKSByZXR1cm4gX2JDbXBBUmlnaHQ7XG4gICAgICAgIH0gLy8gaXMgdGhlIEIgcmlnaHQgZW5kcG9pbnQgbW9yZSBsZWZ0LW1vcmU/XG5cblxuICAgICAgICBpZiAoYXJ4ID4gYnJ4KSB7XG4gICAgICAgICAgdmFyIF9hQ21wQlJpZ2h0ID0gYS5jb21wYXJlUG9pbnQoYi5yaWdodFNFLnBvaW50KTtcblxuICAgICAgICAgIGlmIChfYUNtcEJSaWdodCA8IDApIHJldHVybiAxO1xuICAgICAgICAgIGlmIChfYUNtcEJSaWdodCA+IDApIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcnggIT09IGJyeCkge1xuICAgICAgICAgIC8vIGFyZSB0aGVzZSB0d28gW2FsbW9zdF0gdmVydGljYWwgc2VnbWVudHMgd2l0aCBvcHBvc2l0ZSBvcmllbnRhdGlvbj9cbiAgICAgICAgICAvLyBpZiBzbywgdGhlIG9uZSB3aXRoIHRoZSBsb3dlciByaWdodCBlbmRwb2ludCBjb21lcyBmaXJzdFxuICAgICAgICAgIHZhciBheSA9IGFyeSAtIGFseTtcbiAgICAgICAgICB2YXIgYXggPSBhcnggLSBhbHg7XG4gICAgICAgICAgdmFyIGJ5ID0gYnJ5IC0gYmx5O1xuICAgICAgICAgIHZhciBieCA9IGJyeCAtIGJseDtcbiAgICAgICAgICBpZiAoYXkgPiBheCAmJiBieSA8IGJ4KSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYXkgPCBheCAmJiBieSA+IGJ4KSByZXR1cm4gLTE7XG4gICAgICAgIH0gLy8gd2UgaGF2ZSBjb2xpbmVhciBzZWdtZW50cyB3aXRoIG1hdGNoaW5nIG9yaWVudGF0aW9uXG4gICAgICAgIC8vIGNvbnNpZGVyIHRoZSBvbmUgd2l0aCBtb3JlIGxlZnQtbW9yZSByaWdodCBlbmRwb2ludCB0byBiZSBmaXJzdFxuXG5cbiAgICAgICAgaWYgKGFyeCA+IGJyeCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhcnggPCBicngpIHJldHVybiAtMTsgLy8gaWYgd2UgZ2V0IGhlcmUsIHR3byB0d28gcmlnaHQgZW5kcG9pbnRzIGFyZSBpbiB0aGUgc2FtZVxuICAgICAgICAvLyB2ZXJ0aWNhbCBwbGFuZSwgaWUgYXJ4ID09PSBicnhcbiAgICAgICAgLy8gY29uc2lkZXIgdGhlIGxvd2VyIHJpZ2h0LWVuZHBvaW50IHRvIGNvbWUgZmlyc3RcblxuICAgICAgICBpZiAoYXJ5IDwgYnJ5KSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhcnkgPiBicnkpIHJldHVybiAxOyAvLyByaWdodCBlbmRwb2ludHMgaWRlbnRpY2FsIGFzIHdlbGwsIHNvIHRoZSBzZWdtZW50cyBhcmUgaWRlbnRpYWxcbiAgICAgICAgLy8gZmFsbCBiYWNrIG9uIGNyZWF0aW9uIG9yZGVyIGFzIGNvbnNpc3RlbnQgdGllLWJyZWFrZXJcblxuICAgICAgICBpZiAoYS5pZCA8IGIuaWQpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGEuaWQgPiBiLmlkKSByZXR1cm4gMTsgLy8gaWRlbnRpY2FsIHNlZ21lbnQsIGllIGEgPT09IGJcblxuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICAgIC8qIFdhcm5pbmc6IGEgcmVmZXJlbmNlIHRvIHJpbmdXaW5kaW5ncyBpbnB1dCB3aWxsIGJlIHN0b3JlZCxcbiAgICAgICAqICBhbmQgcG9zc2libHkgd2lsbCBiZSBsYXRlciBtb2RpZmllZCAqL1xuXG4gICAgfV0pO1xuXG4gICAgZnVuY3Rpb24gU2VnbWVudChsZWZ0U0UsIHJpZ2h0U0UsIHJpbmdzLCB3aW5kaW5ncykge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFNlZ21lbnQpO1xuXG4gICAgICB0aGlzLmlkID0gKytzZWdtZW50SWQ7XG4gICAgICB0aGlzLmxlZnRTRSA9IGxlZnRTRTtcbiAgICAgIGxlZnRTRS5zZWdtZW50ID0gdGhpcztcbiAgICAgIGxlZnRTRS5vdGhlclNFID0gcmlnaHRTRTtcbiAgICAgIHRoaXMucmlnaHRTRSA9IHJpZ2h0U0U7XG4gICAgICByaWdodFNFLnNlZ21lbnQgPSB0aGlzO1xuICAgICAgcmlnaHRTRS5vdGhlclNFID0gbGVmdFNFO1xuICAgICAgdGhpcy5yaW5ncyA9IHJpbmdzO1xuICAgICAgdGhpcy53aW5kaW5ncyA9IHdpbmRpbmdzOyAvLyBsZWZ0IHVuc2V0IGZvciBwZXJmb3JtYW5jZSwgc2V0IGxhdGVyIGluIGFsZ29yaXRobVxuICAgICAgLy8gdGhpcy5yaW5nT3V0LCB0aGlzLmNvbnN1bWVkQnksIHRoaXMucHJldlxuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhTZWdtZW50LCBbe1xuICAgICAga2V5OiBcInJlcGxhY2VSaWdodFNFXCIsXG5cbiAgICAgIC8qIFdoZW4gYSBzZWdtZW50IGlzIHNwbGl0LCB0aGUgcmlnaHRTRSBpcyByZXBsYWNlZCB3aXRoIGEgbmV3IHN3ZWVwIGV2ZW50ICovXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVwbGFjZVJpZ2h0U0UobmV3UmlnaHRTRSkge1xuICAgICAgICB0aGlzLnJpZ2h0U0UgPSBuZXdSaWdodFNFO1xuICAgICAgICB0aGlzLnJpZ2h0U0Uuc2VnbWVudCA9IHRoaXM7XG4gICAgICAgIHRoaXMucmlnaHRTRS5vdGhlclNFID0gdGhpcy5sZWZ0U0U7XG4gICAgICAgIHRoaXMubGVmdFNFLm90aGVyU0UgPSB0aGlzLnJpZ2h0U0U7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImJib3hcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiYm94KCkge1xuICAgICAgICB2YXIgeTEgPSB0aGlzLmxlZnRTRS5wb2ludC55O1xuICAgICAgICB2YXIgeTIgPSB0aGlzLnJpZ2h0U0UucG9pbnQueTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBsbDoge1xuICAgICAgICAgICAgeDogdGhpcy5sZWZ0U0UucG9pbnQueCxcbiAgICAgICAgICAgIHk6IHkxIDwgeTIgPyB5MSA6IHkyXG4gICAgICAgICAgfSxcbiAgICAgICAgICB1cjoge1xuICAgICAgICAgICAgeDogdGhpcy5yaWdodFNFLnBvaW50LngsXG4gICAgICAgICAgICB5OiB5MSA+IHkyID8geTEgOiB5MlxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIC8qIEEgdmVjdG9yIGZyb20gdGhlIGxlZnQgcG9pbnQgdG8gdGhlIHJpZ2h0ICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwidmVjdG9yXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gdmVjdG9yKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHRoaXMucmlnaHRTRS5wb2ludC54IC0gdGhpcy5sZWZ0U0UucG9pbnQueCxcbiAgICAgICAgICB5OiB0aGlzLnJpZ2h0U0UucG9pbnQueSAtIHRoaXMubGVmdFNFLnBvaW50LnlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaXNBbkVuZHBvaW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaXNBbkVuZHBvaW50KHB0KSB7XG4gICAgICAgIHJldHVybiBwdC54ID09PSB0aGlzLmxlZnRTRS5wb2ludC54ICYmIHB0LnkgPT09IHRoaXMubGVmdFNFLnBvaW50LnkgfHwgcHQueCA9PT0gdGhpcy5yaWdodFNFLnBvaW50LnggJiYgcHQueSA9PT0gdGhpcy5yaWdodFNFLnBvaW50Lnk7XG4gICAgICB9XG4gICAgICAvKiBDb21wYXJlIHRoaXMgc2VnbWVudCB3aXRoIGEgcG9pbnQuXG4gICAgICAgKlxuICAgICAgICogQSBwb2ludCBQIGlzIGNvbnNpZGVyZWQgdG8gYmUgY29saW5lYXIgdG8gYSBzZWdtZW50IGlmIHRoZXJlXG4gICAgICAgKiBleGlzdHMgYSBkaXN0YW5jZSBEIHN1Y2ggdGhhdCBpZiB3ZSB0cmF2ZWwgYWxvbmcgdGhlIHNlZ21lbnRcbiAgICAgICAqIGZyb20gb25lICogZW5kcG9pbnQgdG93YXJkcyB0aGUgb3RoZXIgYSBkaXN0YW5jZSBELCB3ZSBmaW5kXG4gICAgICAgKiBvdXJzZWx2ZXMgYXQgcG9pbnQgUC5cbiAgICAgICAqXG4gICAgICAgKiBSZXR1cm4gdmFsdWUgaW5kaWNhdGVzOlxuICAgICAgICpcbiAgICAgICAqICAgMTogcG9pbnQgbGllcyBhYm92ZSB0aGUgc2VnbWVudCAodG8gdGhlIGxlZnQgb2YgdmVydGljYWwpXG4gICAgICAgKiAgIDA6IHBvaW50IGlzIGNvbGluZWFyIHRvIHNlZ21lbnRcbiAgICAgICAqICAtMTogcG9pbnQgbGllcyBiZWxvdyB0aGUgc2VnbWVudCAodG8gdGhlIHJpZ2h0IG9mIHZlcnRpY2FsKVxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY29tcGFyZVBvaW50XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGFyZVBvaW50KHBvaW50KSB7XG4gICAgICAgIGlmICh0aGlzLmlzQW5FbmRwb2ludChwb2ludCkpIHJldHVybiAwO1xuICAgICAgICB2YXIgbFB0ID0gdGhpcy5sZWZ0U0UucG9pbnQ7XG4gICAgICAgIHZhciByUHQgPSB0aGlzLnJpZ2h0U0UucG9pbnQ7XG4gICAgICAgIHZhciB2ID0gdGhpcy52ZWN0b3IoKTsgLy8gRXhhY3RseSB2ZXJ0aWNhbCBzZWdtZW50cy5cblxuICAgICAgICBpZiAobFB0LnggPT09IHJQdC54KSB7XG4gICAgICAgICAgaWYgKHBvaW50LnggPT09IGxQdC54KSByZXR1cm4gMDtcbiAgICAgICAgICByZXR1cm4gcG9pbnQueCA8IGxQdC54ID8gMSA6IC0xO1xuICAgICAgICB9IC8vIE5lYXJseSB2ZXJ0aWNhbCBzZWdtZW50cyB3aXRoIGFuIGludGVyc2VjdGlvbi5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIHdoZXJlIGEgcG9pbnQgb24gdGhlIGxpbmUgd2l0aCBtYXRjaGluZyBZIGNvb3JkaW5hdGUgaXMuXG5cblxuICAgICAgICB2YXIgeURpc3QgPSAocG9pbnQueSAtIGxQdC55KSAvIHYueTtcbiAgICAgICAgdmFyIHhGcm9tWURpc3QgPSBsUHQueCArIHlEaXN0ICogdi54O1xuICAgICAgICBpZiAocG9pbnQueCA9PT0geEZyb21ZRGlzdCkgcmV0dXJuIDA7IC8vIEdlbmVyYWwgY2FzZS5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIHdoZXJlIGEgcG9pbnQgb24gdGhlIGxpbmUgd2l0aCBtYXRjaGluZyBYIGNvb3JkaW5hdGUgaXMuXG5cbiAgICAgICAgdmFyIHhEaXN0ID0gKHBvaW50LnggLSBsUHQueCkgLyB2Lng7XG4gICAgICAgIHZhciB5RnJvbVhEaXN0ID0gbFB0LnkgKyB4RGlzdCAqIHYueTtcbiAgICAgICAgaWYgKHBvaW50LnkgPT09IHlGcm9tWERpc3QpIHJldHVybiAwO1xuICAgICAgICByZXR1cm4gcG9pbnQueSA8IHlGcm9tWERpc3QgPyAtMSA6IDE7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIEdpdmVuIGFub3RoZXIgc2VnbWVudCwgcmV0dXJucyB0aGUgZmlyc3Qgbm9uLXRyaXZpYWwgaW50ZXJzZWN0aW9uXG4gICAgICAgKiBiZXR3ZWVuIHRoZSB0d28gc2VnbWVudHMgKGluIHRlcm1zIG9mIHN3ZWVwIGxpbmUgb3JkZXJpbmcpLCBpZiBpdCBleGlzdHMuXG4gICAgICAgKlxuICAgICAgICogQSAnbm9uLXRyaXZpYWwnIGludGVyc2VjdGlvbiBpcyBvbmUgdGhhdCB3aWxsIGNhdXNlIG9uZSBvciBib3RoIG9mIHRoZVxuICAgICAgICogc2VnbWVudHMgdG8gYmUgc3BsaXQoKS4gQXMgc3VjaCwgJ3RyaXZpYWwnIHZzLiAnbm9uLXRyaXZpYWwnIGludGVyc2VjdGlvbjpcbiAgICAgICAqXG4gICAgICAgKiAgICogZW5kcG9pbnQgb2Ygc2VnQSB3aXRoIGVuZHBvaW50IG9mIHNlZ0IgLS0+IHRyaXZpYWxcbiAgICAgICAqICAgKiBlbmRwb2ludCBvZiBzZWdBIHdpdGggcG9pbnQgYWxvbmcgc2VnQiAtLT4gbm9uLXRyaXZpYWxcbiAgICAgICAqICAgKiBlbmRwb2ludCBvZiBzZWdCIHdpdGggcG9pbnQgYWxvbmcgc2VnQSAtLT4gbm9uLXRyaXZpYWxcbiAgICAgICAqICAgKiBwb2ludCBhbG9uZyBzZWdBIHdpdGggcG9pbnQgYWxvbmcgc2VnQiAtLT4gbm9uLXRyaXZpYWxcbiAgICAgICAqXG4gICAgICAgKiBJZiBubyBub24tdHJpdmlhbCBpbnRlcnNlY3Rpb24gZXhpc3RzLCByZXR1cm4gbnVsbFxuICAgICAgICogRWxzZSwgcmV0dXJuIG51bGwuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRJbnRlcnNlY3Rpb25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRJbnRlcnNlY3Rpb24ob3RoZXIpIHtcbiAgICAgICAgLy8gSWYgYmJveGVzIGRvbid0IG92ZXJsYXAsIHRoZXJlIGNhbid0IGJlIGFueSBpbnRlcnNlY3Rpb25zXG4gICAgICAgIHZhciB0QmJveCA9IHRoaXMuYmJveCgpO1xuICAgICAgICB2YXIgb0Jib3ggPSBvdGhlci5iYm94KCk7XG4gICAgICAgIHZhciBiYm94T3ZlcmxhcCA9IGdldEJib3hPdmVybGFwKHRCYm94LCBvQmJveCk7XG4gICAgICAgIGlmIChiYm94T3ZlcmxhcCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7IC8vIFdlIGZpcnN0IGNoZWNrIHRvIHNlZSBpZiB0aGUgZW5kcG9pbnRzIGNhbiBiZSBjb25zaWRlcmVkIGludGVyc2VjdGlvbnMuXG4gICAgICAgIC8vIFRoaXMgd2lsbCAnc25hcCcgaW50ZXJzZWN0aW9ucyB0byBlbmRwb2ludHMgaWYgcG9zc2libGUsIGFuZCB3aWxsXG4gICAgICAgIC8vIGhhbmRsZSBjYXNlcyBvZiBjb2xpbmVhcml0eS5cblxuICAgICAgICB2YXIgdGxwID0gdGhpcy5sZWZ0U0UucG9pbnQ7XG4gICAgICAgIHZhciB0cnAgPSB0aGlzLnJpZ2h0U0UucG9pbnQ7XG4gICAgICAgIHZhciBvbHAgPSBvdGhlci5sZWZ0U0UucG9pbnQ7XG4gICAgICAgIHZhciBvcnAgPSBvdGhlci5yaWdodFNFLnBvaW50OyAvLyBkb2VzIGVhY2ggZW5kcG9pbnQgdG91Y2ggdGhlIG90aGVyIHNlZ21lbnQ/XG4gICAgICAgIC8vIG5vdGUgdGhhdCB3ZSByZXN0cmljdCB0aGUgJ3RvdWNoaW5nJyBkZWZpbml0aW9uIHRvIG9ubHkgYWxsb3cgc2VnbWVudHNcbiAgICAgICAgLy8gdG8gdG91Y2ggZW5kcG9pbnRzIHRoYXQgbGllIGZvcndhcmQgZnJvbSB3aGVyZSB3ZSBhcmUgaW4gdGhlIHN3ZWVwIGxpbmUgcGFzc1xuXG4gICAgICAgIHZhciB0b3VjaGVzT3RoZXJMU0UgPSBpc0luQmJveCh0QmJveCwgb2xwKSAmJiB0aGlzLmNvbXBhcmVQb2ludChvbHApID09PSAwO1xuICAgICAgICB2YXIgdG91Y2hlc1RoaXNMU0UgPSBpc0luQmJveChvQmJveCwgdGxwKSAmJiBvdGhlci5jb21wYXJlUG9pbnQodGxwKSA9PT0gMDtcbiAgICAgICAgdmFyIHRvdWNoZXNPdGhlclJTRSA9IGlzSW5CYm94KHRCYm94LCBvcnApICYmIHRoaXMuY29tcGFyZVBvaW50KG9ycCkgPT09IDA7XG4gICAgICAgIHZhciB0b3VjaGVzVGhpc1JTRSA9IGlzSW5CYm94KG9CYm94LCB0cnApICYmIG90aGVyLmNvbXBhcmVQb2ludCh0cnApID09PSAwOyAvLyBkbyBsZWZ0IGVuZHBvaW50cyBtYXRjaD9cblxuICAgICAgICBpZiAodG91Y2hlc1RoaXNMU0UgJiYgdG91Y2hlc090aGVyTFNFKSB7XG4gICAgICAgICAgLy8gdGhlc2UgdHdvIGNhc2VzIGFyZSBmb3IgY29saW5lYXIgc2VnbWVudHMgd2l0aCBtYXRjaGluZyBsZWZ0XG4gICAgICAgICAgLy8gZW5kcG9pbnRzLCBhbmQgb25lIHNlZ21lbnQgYmVpbmcgbG9uZ2VyIHRoYW4gdGhlIG90aGVyXG4gICAgICAgICAgaWYgKHRvdWNoZXNUaGlzUlNFICYmICF0b3VjaGVzT3RoZXJSU0UpIHJldHVybiB0cnA7XG4gICAgICAgICAgaWYgKCF0b3VjaGVzVGhpc1JTRSAmJiB0b3VjaGVzT3RoZXJSU0UpIHJldHVybiBvcnA7IC8vIGVpdGhlciB0aGUgdHdvIHNlZ21lbnRzIG1hdGNoIGV4YWN0bHkgKHR3byB0cml2YWwgaW50ZXJzZWN0aW9ucylcbiAgICAgICAgICAvLyBvciBqdXN0IG9uIHRoZWlyIGxlZnQgZW5kcG9pbnQgKG9uZSB0cml2aWFsIGludGVyc2VjdGlvblxuXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH0gLy8gZG9lcyB0aGlzIGxlZnQgZW5kcG9pbnQgbWF0Y2hlcyAob3RoZXIgZG9lc24ndClcblxuXG4gICAgICAgIGlmICh0b3VjaGVzVGhpc0xTRSkge1xuICAgICAgICAgIC8vIGNoZWNrIGZvciBzZWdtZW50cyB0aGF0IGp1c3QgaW50ZXJzZWN0IG9uIG9wcG9zaW5nIGVuZHBvaW50c1xuICAgICAgICAgIGlmICh0b3VjaGVzT3RoZXJSU0UpIHtcbiAgICAgICAgICAgIGlmICh0bHAueCA9PT0gb3JwLnggJiYgdGxwLnkgPT09IG9ycC55KSByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9IC8vIHQtaW50ZXJzZWN0aW9uIG9uIGxlZnQgZW5kcG9pbnRcblxuXG4gICAgICAgICAgcmV0dXJuIHRscDtcbiAgICAgICAgfSAvLyBkb2VzIG90aGVyIGxlZnQgZW5kcG9pbnQgbWF0Y2hlcyAodGhpcyBkb2Vzbid0KVxuXG5cbiAgICAgICAgaWYgKHRvdWNoZXNPdGhlckxTRSkge1xuICAgICAgICAgIC8vIGNoZWNrIGZvciBzZWdtZW50cyB0aGF0IGp1c3QgaW50ZXJzZWN0IG9uIG9wcG9zaW5nIGVuZHBvaW50c1xuICAgICAgICAgIGlmICh0b3VjaGVzVGhpc1JTRSkge1xuICAgICAgICAgICAgaWYgKHRycC54ID09PSBvbHAueCAmJiB0cnAueSA9PT0gb2xwLnkpIHJldHVybiBudWxsO1xuICAgICAgICAgIH0gLy8gdC1pbnRlcnNlY3Rpb24gb24gbGVmdCBlbmRwb2ludFxuXG5cbiAgICAgICAgICByZXR1cm4gb2xwO1xuICAgICAgICB9IC8vIHRyaXZpYWwgaW50ZXJzZWN0aW9uIG9uIHJpZ2h0IGVuZHBvaW50c1xuXG5cbiAgICAgICAgaWYgKHRvdWNoZXNUaGlzUlNFICYmIHRvdWNoZXNPdGhlclJTRSkgcmV0dXJuIG51bGw7IC8vIHQtaW50ZXJzZWN0aW9ucyBvbiBqdXN0IG9uZSByaWdodCBlbmRwb2ludFxuXG4gICAgICAgIGlmICh0b3VjaGVzVGhpc1JTRSkgcmV0dXJuIHRycDtcbiAgICAgICAgaWYgKHRvdWNoZXNPdGhlclJTRSkgcmV0dXJuIG9ycDsgLy8gTm9uZSBvZiBvdXIgZW5kcG9pbnRzIGludGVyc2VjdC4gTG9vayBmb3IgYSBnZW5lcmFsIGludGVyc2VjdGlvbiBiZXR3ZWVuXG4gICAgICAgIC8vIGluZmluaXRlIGxpbmVzIGxhaWQgb3ZlciB0aGUgc2VnbWVudHNcblxuICAgICAgICB2YXIgcHQgPSBpbnRlcnNlY3Rpb24odGxwLCB0aGlzLnZlY3RvcigpLCBvbHAsIG90aGVyLnZlY3RvcigpKTsgLy8gYXJlIHRoZSBzZWdtZW50cyBwYXJyYWxsZWw/IE5vdGUgdGhhdCBpZiB0aGV5IHdlcmUgY29saW5lYXIgd2l0aCBvdmVybGFwLFxuICAgICAgICAvLyB0aGV5IHdvdWxkIGhhdmUgYW4gZW5kcG9pbnQgaW50ZXJzZWN0aW9uIGFuZCB0aGF0IGNhc2Ugd2FzIGFscmVhZHkgaGFuZGxlZCBhYm92ZVxuXG4gICAgICAgIGlmIChwdCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7IC8vIGlzIHRoZSBpbnRlcnNlY3Rpb24gZm91bmQgYmV0d2VlbiB0aGUgbGluZXMgbm90IG9uIHRoZSBzZWdtZW50cz9cblxuICAgICAgICBpZiAoIWlzSW5CYm94KGJib3hPdmVybGFwLCBwdCkpIHJldHVybiBudWxsOyAvLyByb3VuZCB0aGUgdGhlIGNvbXB1dGVkIHBvaW50IGlmIG5lZWRlZFxuXG4gICAgICAgIHJldHVybiByb3VuZGVyLnJvdW5kKHB0LngsIHB0LnkpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBTcGxpdCB0aGUgZ2l2ZW4gc2VnbWVudCBpbnRvIG11bHRpcGxlIHNlZ21lbnRzIG9uIHRoZSBnaXZlbiBwb2ludHMuXG4gICAgICAgKiAgKiBFYWNoIGV4aXN0aW5nIHNlZ21lbnQgd2lsbCByZXRhaW4gaXRzIGxlZnRTRSBhbmQgYSBuZXcgcmlnaHRTRSB3aWxsIGJlXG4gICAgICAgKiAgICBnZW5lcmF0ZWQgZm9yIGl0LlxuICAgICAgICogICogQSBuZXcgc2VnbWVudCB3aWxsIGJlIGdlbmVyYXRlZCB3aGljaCB3aWxsIGFkb3B0IHRoZSBvcmlnaW5hbCBzZWdtZW50J3NcbiAgICAgICAqICAgIHJpZ2h0U0UsIGFuZCBhIG5ldyBsZWZ0U0Ugd2lsbCBiZSBnZW5lcmF0ZWQgZm9yIGl0LlxuICAgICAgICogICogSWYgdGhlcmUgYXJlIG1vcmUgdGhhbiB0d28gcG9pbnRzIGdpdmVuIHRvIHNwbGl0IG9uLCBuZXcgc2VnbWVudHNcbiAgICAgICAqICAgIGluIHRoZSBtaWRkbGUgd2lsbCBiZSBnZW5lcmF0ZWQgd2l0aCBuZXcgbGVmdFNFIGFuZCByaWdodFNFJ3MuXG4gICAgICAgKiAgKiBBbiBhcnJheSBvZiB0aGUgbmV3bHkgZ2VuZXJhdGVkIFN3ZWVwRXZlbnRzIHdpbGwgYmUgcmV0dXJuZWQuXG4gICAgICAgKlxuICAgICAgICogV2FybmluZzogaW5wdXQgYXJyYXkgb2YgcG9pbnRzIGlzIG1vZGlmaWVkXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJzcGxpdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNwbGl0KHBvaW50KSB7XG4gICAgICAgIHZhciBuZXdFdmVudHMgPSBbXTtcbiAgICAgICAgdmFyIGFscmVhZHlMaW5rZWQgPSBwb2ludC5ldmVudHMgIT09IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG5ld0xlZnRTRSA9IG5ldyBTd2VlcEV2ZW50KHBvaW50LCB0cnVlKTtcbiAgICAgICAgdmFyIG5ld1JpZ2h0U0UgPSBuZXcgU3dlZXBFdmVudChwb2ludCwgZmFsc2UpO1xuICAgICAgICB2YXIgb2xkUmlnaHRTRSA9IHRoaXMucmlnaHRTRTtcbiAgICAgICAgdGhpcy5yZXBsYWNlUmlnaHRTRShuZXdSaWdodFNFKTtcbiAgICAgICAgbmV3RXZlbnRzLnB1c2gobmV3UmlnaHRTRSk7XG4gICAgICAgIG5ld0V2ZW50cy5wdXNoKG5ld0xlZnRTRSk7XG4gICAgICAgIHZhciBuZXdTZWcgPSBuZXcgU2VnbWVudChuZXdMZWZ0U0UsIG9sZFJpZ2h0U0UsIHRoaXMucmluZ3Muc2xpY2UoKSwgdGhpcy53aW5kaW5ncy5zbGljZSgpKTsgLy8gd2hlbiBzcGxpdHRpbmcgYSBuZWFybHkgdmVydGljYWwgZG93bndhcmQtZmFjaW5nIHNlZ21lbnQsXG4gICAgICAgIC8vIHNvbWV0aW1lcyBvbmUgb2YgdGhlIHJlc3VsdGluZyBuZXcgc2VnbWVudHMgaXMgdmVydGljYWwsIGluIHdoaWNoXG4gICAgICAgIC8vIGNhc2UgaXRzIGxlZnQgYW5kIHJpZ2h0IGV2ZW50cyBtYXkgbmVlZCB0byBiZSBzd2FwcGVkXG5cbiAgICAgICAgaWYgKFN3ZWVwRXZlbnQuY29tcGFyZVBvaW50cyhuZXdTZWcubGVmdFNFLnBvaW50LCBuZXdTZWcucmlnaHRTRS5wb2ludCkgPiAwKSB7XG4gICAgICAgICAgbmV3U2VnLnN3YXBFdmVudHMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChTd2VlcEV2ZW50LmNvbXBhcmVQb2ludHModGhpcy5sZWZ0U0UucG9pbnQsIHRoaXMucmlnaHRTRS5wb2ludCkgPiAwKSB7XG4gICAgICAgICAgdGhpcy5zd2FwRXZlbnRzKCk7XG4gICAgICAgIH0gLy8gaW4gdGhlIHBvaW50IHdlIGp1c3QgdXNlZCB0byBjcmVhdGUgbmV3IHN3ZWVwIGV2ZW50cyB3aXRoIHdhcyBhbHJlYWR5XG4gICAgICAgIC8vIGxpbmtlZCB0byBvdGhlciBldmVudHMsIHdlIG5lZWQgdG8gY2hlY2sgaWYgZWl0aGVyIG9mIHRoZSBhZmZlY3RlZFxuICAgICAgICAvLyBzZWdtZW50cyBzaG91bGQgYmUgY29uc3VtZWRcblxuXG4gICAgICAgIGlmIChhbHJlYWR5TGlua2VkKSB7XG4gICAgICAgICAgbmV3TGVmdFNFLmNoZWNrRm9yQ29uc3VtaW5nKCk7XG4gICAgICAgICAgbmV3UmlnaHRTRS5jaGVja0ZvckNvbnN1bWluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0V2ZW50cztcbiAgICAgIH1cbiAgICAgIC8qIFN3YXAgd2hpY2ggZXZlbnQgaXMgbGVmdCBhbmQgcmlnaHQgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJzd2FwRXZlbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3dhcEV2ZW50cygpIHtcbiAgICAgICAgdmFyIHRtcEV2dCA9IHRoaXMucmlnaHRTRTtcbiAgICAgICAgdGhpcy5yaWdodFNFID0gdGhpcy5sZWZ0U0U7XG4gICAgICAgIHRoaXMubGVmdFNFID0gdG1wRXZ0O1xuICAgICAgICB0aGlzLmxlZnRTRS5pc0xlZnQgPSB0cnVlO1xuICAgICAgICB0aGlzLnJpZ2h0U0UuaXNMZWZ0ID0gZmFsc2U7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLndpbmRpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHRoaXMud2luZGluZ3NbaV0gKj0gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8qIENvbnN1bWUgYW5vdGhlciBzZWdtZW50LiBXZSB0YWtlIHRoZWlyIHJpbmdzIHVuZGVyIG91ciB3aW5nXG4gICAgICAgKiBhbmQgbWFyayB0aGVtIGFzIGNvbnN1bWVkLiBVc2UgZm9yIHBlcmZlY3RseSBvdmVybGFwcGluZyBzZWdtZW50cyAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImNvbnN1bWVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb25zdW1lKG90aGVyKSB7XG4gICAgICAgIHZhciBjb25zdW1lciA9IHRoaXM7XG4gICAgICAgIHZhciBjb25zdW1lZSA9IG90aGVyO1xuXG4gICAgICAgIHdoaWxlIChjb25zdW1lci5jb25zdW1lZEJ5KSB7XG4gICAgICAgICAgY29uc3VtZXIgPSBjb25zdW1lci5jb25zdW1lZEJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKGNvbnN1bWVlLmNvbnN1bWVkQnkpIHtcbiAgICAgICAgICBjb25zdW1lZSA9IGNvbnN1bWVlLmNvbnN1bWVkQnk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY21wID0gU2VnbWVudC5jb21wYXJlKGNvbnN1bWVyLCBjb25zdW1lZSk7XG4gICAgICAgIGlmIChjbXAgPT09IDApIHJldHVybjsgLy8gYWxyZWFkeSBjb25zdW1lZFxuICAgICAgICAvLyB0aGUgd2lubmVyIG9mIHRoZSBjb25zdW1wdGlvbiBpcyB0aGUgZWFybGllciBzZWdtZW50XG4gICAgICAgIC8vIGFjY29yZGluZyB0byBzd2VlcCBsaW5lIG9yZGVyaW5nXG5cbiAgICAgICAgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgICB2YXIgdG1wID0gY29uc3VtZXI7XG4gICAgICAgICAgY29uc3VtZXIgPSBjb25zdW1lZTtcbiAgICAgICAgICBjb25zdW1lZSA9IHRtcDtcbiAgICAgICAgfSAvLyBtYWtlIHN1cmUgYSBzZWdtZW50IGRvZXNuJ3QgY29uc3VtZSBpdCdzIHByZXZcblxuXG4gICAgICAgIGlmIChjb25zdW1lci5wcmV2ID09PSBjb25zdW1lZSkge1xuICAgICAgICAgIHZhciBfdG1wID0gY29uc3VtZXI7XG4gICAgICAgICAgY29uc3VtZXIgPSBjb25zdW1lZTtcbiAgICAgICAgICBjb25zdW1lZSA9IF90bXA7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IGNvbnN1bWVlLnJpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciByaW5nID0gY29uc3VtZWUucmluZ3NbaV07XG4gICAgICAgICAgdmFyIHdpbmRpbmcgPSBjb25zdW1lZS53aW5kaW5nc1tpXTtcbiAgICAgICAgICB2YXIgaW5kZXggPSBjb25zdW1lci5yaW5ncy5pbmRleE9mKHJpbmcpO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgY29uc3VtZXIucmluZ3MucHVzaChyaW5nKTtcbiAgICAgICAgICAgIGNvbnN1bWVyLndpbmRpbmdzLnB1c2god2luZGluZyk7XG4gICAgICAgICAgfSBlbHNlIGNvbnN1bWVyLndpbmRpbmdzW2luZGV4XSArPSB3aW5kaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3VtZWUucmluZ3MgPSBudWxsO1xuICAgICAgICBjb25zdW1lZS53aW5kaW5ncyA9IG51bGw7XG4gICAgICAgIGNvbnN1bWVlLmNvbnN1bWVkQnkgPSBjb25zdW1lcjsgLy8gbWFyayBzd2VlcCBldmVudHMgY29uc3VtZWQgYXMgdG8gbWFpbnRhaW4gb3JkZXJpbmcgaW4gc3dlZXAgZXZlbnQgcXVldWVcblxuICAgICAgICBjb25zdW1lZS5sZWZ0U0UuY29uc3VtZWRCeSA9IGNvbnN1bWVyLmxlZnRTRTtcbiAgICAgICAgY29uc3VtZWUucmlnaHRTRS5jb25zdW1lZEJ5ID0gY29uc3VtZXIucmlnaHRTRTtcbiAgICAgIH1cbiAgICAgIC8qIFRoZSBmaXJzdCBzZWdtZW50IHByZXZpb3VzIHNlZ21lbnQgY2hhaW4gdGhhdCBpcyBpbiB0aGUgcmVzdWx0ICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwicHJldkluUmVzdWx0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcHJldkluUmVzdWx0KCkge1xuICAgICAgICBpZiAodGhpcy5fcHJldkluUmVzdWx0ICE9PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9wcmV2SW5SZXN1bHQ7XG4gICAgICAgIGlmICghdGhpcy5wcmV2KSB0aGlzLl9wcmV2SW5SZXN1bHQgPSBudWxsO2Vsc2UgaWYgKHRoaXMucHJldi5pc0luUmVzdWx0KCkpIHRoaXMuX3ByZXZJblJlc3VsdCA9IHRoaXMucHJldjtlbHNlIHRoaXMuX3ByZXZJblJlc3VsdCA9IHRoaXMucHJldi5wcmV2SW5SZXN1bHQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXZJblJlc3VsdDtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYmVmb3JlU3RhdGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBiZWZvcmVTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JlZm9yZVN0YXRlICE9PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9iZWZvcmVTdGF0ZTtcbiAgICAgICAgaWYgKCF0aGlzLnByZXYpIHRoaXMuX2JlZm9yZVN0YXRlID0ge1xuICAgICAgICAgIHJpbmdzOiBbXSxcbiAgICAgICAgICB3aW5kaW5nczogW10sXG4gICAgICAgICAgbXVsdGlQb2x5czogW11cbiAgICAgICAgfTtlbHNlIHtcbiAgICAgICAgICB2YXIgc2VnID0gdGhpcy5wcmV2LmNvbnN1bWVkQnkgfHwgdGhpcy5wcmV2O1xuICAgICAgICAgIHRoaXMuX2JlZm9yZVN0YXRlID0gc2VnLmFmdGVyU3RhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fYmVmb3JlU3RhdGU7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImFmdGVyU3RhdGVcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZnRlclN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5fYWZ0ZXJTdGF0ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fYWZ0ZXJTdGF0ZTtcbiAgICAgICAgdmFyIGJlZm9yZVN0YXRlID0gdGhpcy5iZWZvcmVTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9hZnRlclN0YXRlID0ge1xuICAgICAgICAgIHJpbmdzOiBiZWZvcmVTdGF0ZS5yaW5ncy5zbGljZSgwKSxcbiAgICAgICAgICB3aW5kaW5nczogYmVmb3JlU3RhdGUud2luZGluZ3Muc2xpY2UoMCksXG4gICAgICAgICAgbXVsdGlQb2x5czogW11cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJpbmdzQWZ0ZXIgPSB0aGlzLl9hZnRlclN0YXRlLnJpbmdzO1xuICAgICAgICB2YXIgd2luZGluZ3NBZnRlciA9IHRoaXMuX2FmdGVyU3RhdGUud2luZGluZ3M7XG4gICAgICAgIHZhciBtcHNBZnRlciA9IHRoaXMuX2FmdGVyU3RhdGUubXVsdGlQb2x5czsgLy8gY2FsY3VsYXRlIHJpbmdzQWZ0ZXIsIHdpbmRpbmdzQWZ0ZXJcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMucmluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJpbmcgPSB0aGlzLnJpbmdzW2ldO1xuICAgICAgICAgIHZhciB3aW5kaW5nID0gdGhpcy53aW5kaW5nc1tpXTtcbiAgICAgICAgICB2YXIgaW5kZXggPSByaW5nc0FmdGVyLmluZGV4T2YocmluZyk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByaW5nc0FmdGVyLnB1c2gocmluZyk7XG4gICAgICAgICAgICB3aW5kaW5nc0FmdGVyLnB1c2god2luZGluZyk7XG4gICAgICAgICAgfSBlbHNlIHdpbmRpbmdzQWZ0ZXJbaW5kZXhdICs9IHdpbmRpbmc7XG4gICAgICAgIH0gLy8gY2FsY3VhbHRlIHBvbHlzQWZ0ZXJcblxuXG4gICAgICAgIHZhciBwb2x5c0FmdGVyID0gW107XG4gICAgICAgIHZhciBwb2x5c0V4Y2x1ZGUgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9pTWF4ID0gcmluZ3NBZnRlci5sZW5ndGg7IF9pIDwgX2lNYXg7IF9pKyspIHtcbiAgICAgICAgICBpZiAod2luZGluZ3NBZnRlcltfaV0gPT09IDApIGNvbnRpbnVlOyAvLyBub24temVybyBydWxlXG5cbiAgICAgICAgICB2YXIgX3JpbmcgPSByaW5nc0FmdGVyW19pXTtcbiAgICAgICAgICB2YXIgcG9seSA9IF9yaW5nLnBvbHk7XG4gICAgICAgICAgaWYgKHBvbHlzRXhjbHVkZS5pbmRleE9mKHBvbHkpICE9PSAtMSkgY29udGludWU7XG4gICAgICAgICAgaWYgKF9yaW5nLmlzRXh0ZXJpb3IpIHBvbHlzQWZ0ZXIucHVzaChwb2x5KTtlbHNlIHtcbiAgICAgICAgICAgIGlmIChwb2x5c0V4Y2x1ZGUuaW5kZXhPZihwb2x5KSA9PT0gLTEpIHBvbHlzRXhjbHVkZS5wdXNoKHBvbHkpO1xuXG4gICAgICAgICAgICB2YXIgX2luZGV4ID0gcG9seXNBZnRlci5pbmRleE9mKF9yaW5nLnBvbHkpO1xuXG4gICAgICAgICAgICBpZiAoX2luZGV4ICE9PSAtMSkgcG9seXNBZnRlci5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gLy8gY2FsY3VsYXRlIG11bHRpUG9seXNBZnRlclxuXG5cbiAgICAgICAgZm9yICh2YXIgX2kyID0gMCwgX2lNYXgyID0gcG9seXNBZnRlci5sZW5ndGg7IF9pMiA8IF9pTWF4MjsgX2kyKyspIHtcbiAgICAgICAgICB2YXIgbXAgPSBwb2x5c0FmdGVyW19pMl0ubXVsdGlQb2x5O1xuICAgICAgICAgIGlmIChtcHNBZnRlci5pbmRleE9mKG1wKSA9PT0gLTEpIG1wc0FmdGVyLnB1c2gobXApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2FmdGVyU3RhdGU7XG4gICAgICB9XG4gICAgICAvKiBJcyB0aGlzIHNlZ21lbnQgcGFydCBvZiB0aGUgZmluYWwgcmVzdWx0PyAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImlzSW5SZXN1bHRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0luUmVzdWx0KCkge1xuICAgICAgICAvLyBpZiB3ZSd2ZSBiZWVuIGNvbnN1bWVkLCB3ZSdyZSBub3QgaW4gdGhlIHJlc3VsdFxuICAgICAgICBpZiAodGhpcy5jb25zdW1lZEJ5KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9pc0luUmVzdWx0ICE9PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9pc0luUmVzdWx0O1xuICAgICAgICB2YXIgbXBzQmVmb3JlID0gdGhpcy5iZWZvcmVTdGF0ZSgpLm11bHRpUG9seXM7XG4gICAgICAgIHZhciBtcHNBZnRlciA9IHRoaXMuYWZ0ZXJTdGF0ZSgpLm11bHRpUG9seXM7XG5cbiAgICAgICAgc3dpdGNoIChvcGVyYXRpb24udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ3VuaW9uJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gVU5JT04gLSBpbmNsdWRlZCBpZmY6XG4gICAgICAgICAgICAgIC8vICAqIE9uIG9uZSBzaWRlIG9mIHVzIHRoZXJlIGlzIDAgcG9seSBpbnRlcmlvcnMgQU5EXG4gICAgICAgICAgICAgIC8vICAqIE9uIHRoZSBvdGhlciBzaWRlIHRoZXJlIGlzIDEgb3IgbW9yZS5cbiAgICAgICAgICAgICAgdmFyIG5vQmVmb3JlcyA9IG1wc0JlZm9yZS5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgIHZhciBub0FmdGVycyA9IG1wc0FmdGVyLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgdGhpcy5faXNJblJlc3VsdCA9IG5vQmVmb3JlcyAhPT0gbm9BZnRlcnM7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnaW50ZXJzZWN0aW9uJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gSU5URVJTRUNUSU9OIC0gaW5jbHVkZWQgaWZmOlxuICAgICAgICAgICAgICAvLyAgKiBvbiBvbmUgc2lkZSBvZiB1cyBhbGwgbXVsdGlwb2x5cyBhcmUgcmVwLiB3aXRoIHBvbHkgaW50ZXJpb3JzIEFORFxuICAgICAgICAgICAgICAvLyAgKiBvbiB0aGUgb3RoZXIgc2lkZSBvZiB1cywgbm90IGFsbCBtdWx0aXBvbHlzIGFyZSByZXBzZW50ZWRcbiAgICAgICAgICAgICAgLy8gICAgd2l0aCBwb2x5IGludGVyaW9yc1xuICAgICAgICAgICAgICB2YXIgbGVhc3Q7XG4gICAgICAgICAgICAgIHZhciBtb3N0O1xuXG4gICAgICAgICAgICAgIGlmIChtcHNCZWZvcmUubGVuZ3RoIDwgbXBzQWZ0ZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgbGVhc3QgPSBtcHNCZWZvcmUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG1vc3QgPSBtcHNBZnRlci5sZW5ndGg7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGVhc3QgPSBtcHNBZnRlci5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbW9zdCA9IG1wc0JlZm9yZS5sZW5ndGg7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0aGlzLl9pc0luUmVzdWx0ID0gbW9zdCA9PT0gb3BlcmF0aW9uLm51bU11bHRpUG9seXMgJiYgbGVhc3QgPCBtb3N0O1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ3hvcic6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIFhPUiAtIGluY2x1ZGVkIGlmZjpcbiAgICAgICAgICAgICAgLy8gICogdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgbnVtYmVyIG9mIG11bHRpcG9seXMgcmVwcmVzZW50ZWRcbiAgICAgICAgICAgICAgLy8gICAgd2l0aCBwb2x5IGludGVyaW9ycyBvbiBvdXIgdHdvIHNpZGVzIGlzIGFuIG9kZCBudW1iZXJcbiAgICAgICAgICAgICAgdmFyIGRpZmYgPSBNYXRoLmFicyhtcHNCZWZvcmUubGVuZ3RoIC0gbXBzQWZ0ZXIubGVuZ3RoKTtcbiAgICAgICAgICAgICAgdGhpcy5faXNJblJlc3VsdCA9IGRpZmYgJSAyID09PSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2RpZmZlcmVuY2UnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBESUZGRVJFTkNFIGluY2x1ZGVkIGlmZjpcbiAgICAgICAgICAgICAgLy8gICogb24gZXhhY3RseSBvbmUgc2lkZSwgd2UgaGF2ZSBqdXN0IHRoZSBzdWJqZWN0XG4gICAgICAgICAgICAgIHZhciBpc0p1c3RTdWJqZWN0ID0gZnVuY3Rpb24gaXNKdXN0U3ViamVjdChtcHMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbXBzLmxlbmd0aCA9PT0gMSAmJiBtcHNbMF0uaXNTdWJqZWN0O1xuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIHRoaXMuX2lzSW5SZXN1bHQgPSBpc0p1c3RTdWJqZWN0KG1wc0JlZm9yZSkgIT09IGlzSnVzdFN1YmplY3QobXBzQWZ0ZXIpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnJlY29nbml6ZWQgb3BlcmF0aW9uIHR5cGUgZm91bmQgXCIuY29uY2F0KG9wZXJhdGlvbi50eXBlKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNJblJlc3VsdDtcbiAgICAgIH1cbiAgICB9XSwgW3tcbiAgICAgIGtleTogXCJmcm9tUmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZyb21SaW5nKHB0MSwgcHQyLCByaW5nKSB7XG4gICAgICAgIHZhciBsZWZ0UHQsIHJpZ2h0UHQsIHdpbmRpbmc7IC8vIG9yZGVyaW5nIHRoZSB0d28gcG9pbnRzIGFjY29yZGluZyB0byBzd2VlcCBsaW5lIG9yZGVyaW5nXG5cbiAgICAgICAgdmFyIGNtcFB0cyA9IFN3ZWVwRXZlbnQuY29tcGFyZVBvaW50cyhwdDEsIHB0Mik7XG5cbiAgICAgICAgaWYgKGNtcFB0cyA8IDApIHtcbiAgICAgICAgICBsZWZ0UHQgPSBwdDE7XG4gICAgICAgICAgcmlnaHRQdCA9IHB0MjtcbiAgICAgICAgICB3aW5kaW5nID0gMTtcbiAgICAgICAgfSBlbHNlIGlmIChjbXBQdHMgPiAwKSB7XG4gICAgICAgICAgbGVmdFB0ID0gcHQyO1xuICAgICAgICAgIHJpZ2h0UHQgPSBwdDE7XG4gICAgICAgICAgd2luZGluZyA9IC0xO1xuICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKFwiVHJpZWQgdG8gY3JlYXRlIGRlZ2VuZXJhdGUgc2VnbWVudCBhdCBbXCIuY29uY2F0KHB0MS54LCBcIiwgXCIpLmNvbmNhdChwdDEueSwgXCJdXCIpKTtcblxuICAgICAgICB2YXIgbGVmdFNFID0gbmV3IFN3ZWVwRXZlbnQobGVmdFB0LCB0cnVlKTtcbiAgICAgICAgdmFyIHJpZ2h0U0UgPSBuZXcgU3dlZXBFdmVudChyaWdodFB0LCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBuZXcgU2VnbWVudChsZWZ0U0UsIHJpZ2h0U0UsIFtyaW5nXSwgW3dpbmRpbmddKTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gU2VnbWVudDtcbiAgfSgpO1xuXG4gIHZhciBSaW5nSW4gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFJpbmdJbihnZW9tUmluZywgcG9seSwgaXNFeHRlcmlvcikge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJpbmdJbik7XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShnZW9tUmluZykgfHwgZ2VvbVJpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZ2VvbWV0cnkgaXMgbm90IGEgdmFsaWQgUG9seWdvbiBvciBNdWx0aVBvbHlnb24nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb2x5ID0gcG9seTtcbiAgICAgIHRoaXMuaXNFeHRlcmlvciA9IGlzRXh0ZXJpb3I7XG4gICAgICB0aGlzLnNlZ21lbnRzID0gW107XG5cbiAgICAgIGlmICh0eXBlb2YgZ2VvbVJpbmdbMF1bMF0gIT09ICdudW1iZXInIHx8IHR5cGVvZiBnZW9tUmluZ1swXVsxXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBnZW9tZXRyeSBpcyBub3QgYSB2YWxpZCBQb2x5Z29uIG9yIE11bHRpUG9seWdvbicpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZmlyc3RQb2ludCA9IHJvdW5kZXIucm91bmQoZ2VvbVJpbmdbMF1bMF0sIGdlb21SaW5nWzBdWzFdKTtcbiAgICAgIHRoaXMuYmJveCA9IHtcbiAgICAgICAgbGw6IHtcbiAgICAgICAgICB4OiBmaXJzdFBvaW50LngsXG4gICAgICAgICAgeTogZmlyc3RQb2ludC55XG4gICAgICAgIH0sXG4gICAgICAgIHVyOiB7XG4gICAgICAgICAgeDogZmlyc3RQb2ludC54LFxuICAgICAgICAgIHk6IGZpcnN0UG9pbnQueVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdmFyIHByZXZQb2ludCA9IGZpcnN0UG9pbnQ7XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBpTWF4ID0gZ2VvbVJpbmcubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZ2VvbVJpbmdbaV1bMF0gIT09ICdudW1iZXInIHx8IHR5cGVvZiBnZW9tUmluZ1tpXVsxXSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGdlb21ldHJ5IGlzIG5vdCBhIHZhbGlkIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcG9pbnQgPSByb3VuZGVyLnJvdW5kKGdlb21SaW5nW2ldWzBdLCBnZW9tUmluZ1tpXVsxXSk7IC8vIHNraXAgcmVwZWF0ZWQgcG9pbnRzXG5cbiAgICAgICAgaWYgKHBvaW50LnggPT09IHByZXZQb2ludC54ICYmIHBvaW50LnkgPT09IHByZXZQb2ludC55KSBjb250aW51ZTtcbiAgICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKFNlZ21lbnQuZnJvbVJpbmcocHJldlBvaW50LCBwb2ludCwgdGhpcykpO1xuICAgICAgICBpZiAocG9pbnQueCA8IHRoaXMuYmJveC5sbC54KSB0aGlzLmJib3gubGwueCA9IHBvaW50Lng7XG4gICAgICAgIGlmIChwb2ludC55IDwgdGhpcy5iYm94LmxsLnkpIHRoaXMuYmJveC5sbC55ID0gcG9pbnQueTtcbiAgICAgICAgaWYgKHBvaW50LnggPiB0aGlzLmJib3gudXIueCkgdGhpcy5iYm94LnVyLnggPSBwb2ludC54O1xuICAgICAgICBpZiAocG9pbnQueSA+IHRoaXMuYmJveC51ci55KSB0aGlzLmJib3gudXIueSA9IHBvaW50Lnk7XG4gICAgICAgIHByZXZQb2ludCA9IHBvaW50O1xuICAgICAgfSAvLyBhZGQgc2VnbWVudCBmcm9tIGxhc3QgdG8gZmlyc3QgaWYgbGFzdCBpcyBub3QgdGhlIHNhbWUgYXMgZmlyc3RcblxuXG4gICAgICBpZiAoZmlyc3RQb2ludC54ICE9PSBwcmV2UG9pbnQueCB8fCBmaXJzdFBvaW50LnkgIT09IHByZXZQb2ludC55KSB7XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChTZWdtZW50LmZyb21SaW5nKHByZXZQb2ludCwgZmlyc3RQb2ludCwgdGhpcykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhSaW5nSW4sIFt7XG4gICAgICBrZXk6IFwiZ2V0U3dlZXBFdmVudHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTd2VlcEV2ZW50cygpIHtcbiAgICAgICAgdmFyIHN3ZWVwRXZlbnRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLnNlZ21lbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5zZWdtZW50c1tpXTtcbiAgICAgICAgICBzd2VlcEV2ZW50cy5wdXNoKHNlZ21lbnQubGVmdFNFKTtcbiAgICAgICAgICBzd2VlcEV2ZW50cy5wdXNoKHNlZ21lbnQucmlnaHRTRSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3dlZXBFdmVudHM7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFJpbmdJbjtcbiAgfSgpO1xuICB2YXIgUG9seUluID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQb2x5SW4oZ2VvbVBvbHksIG11bHRpUG9seSkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvbHlJbik7XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShnZW9tUG9seSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBnZW9tZXRyeSBpcyBub3QgYSB2YWxpZCBQb2x5Z29uIG9yIE11bHRpUG9seWdvbicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmV4dGVyaW9yUmluZyA9IG5ldyBSaW5nSW4oZ2VvbVBvbHlbMF0sIHRoaXMsIHRydWUpOyAvLyBjb3B5IGJ5IHZhbHVlXG5cbiAgICAgIHRoaXMuYmJveCA9IHtcbiAgICAgICAgbGw6IHtcbiAgICAgICAgICB4OiB0aGlzLmV4dGVyaW9yUmluZy5iYm94LmxsLngsXG4gICAgICAgICAgeTogdGhpcy5leHRlcmlvclJpbmcuYmJveC5sbC55XG4gICAgICAgIH0sXG4gICAgICAgIHVyOiB7XG4gICAgICAgICAgeDogdGhpcy5leHRlcmlvclJpbmcuYmJveC51ci54LFxuICAgICAgICAgIHk6IHRoaXMuZXh0ZXJpb3JSaW5nLmJib3gudXIueVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgdGhpcy5pbnRlcmlvclJpbmdzID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAxLCBpTWF4ID0gZ2VvbVBvbHkubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgIHZhciByaW5nID0gbmV3IFJpbmdJbihnZW9tUG9seVtpXSwgdGhpcywgZmFsc2UpO1xuICAgICAgICBpZiAocmluZy5iYm94LmxsLnggPCB0aGlzLmJib3gubGwueCkgdGhpcy5iYm94LmxsLnggPSByaW5nLmJib3gubGwueDtcbiAgICAgICAgaWYgKHJpbmcuYmJveC5sbC55IDwgdGhpcy5iYm94LmxsLnkpIHRoaXMuYmJveC5sbC55ID0gcmluZy5iYm94LmxsLnk7XG4gICAgICAgIGlmIChyaW5nLmJib3gudXIueCA+IHRoaXMuYmJveC51ci54KSB0aGlzLmJib3gudXIueCA9IHJpbmcuYmJveC51ci54O1xuICAgICAgICBpZiAocmluZy5iYm94LnVyLnkgPiB0aGlzLmJib3gudXIueSkgdGhpcy5iYm94LnVyLnkgPSByaW5nLmJib3gudXIueTtcbiAgICAgICAgdGhpcy5pbnRlcmlvclJpbmdzLnB1c2gocmluZyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubXVsdGlQb2x5ID0gbXVsdGlQb2x5O1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQb2x5SW4sIFt7XG4gICAgICBrZXk6IFwiZ2V0U3dlZXBFdmVudHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTd2VlcEV2ZW50cygpIHtcbiAgICAgICAgdmFyIHN3ZWVwRXZlbnRzID0gdGhpcy5leHRlcmlvclJpbmcuZ2V0U3dlZXBFdmVudHMoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMuaW50ZXJpb3JSaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcmluZ1N3ZWVwRXZlbnRzID0gdGhpcy5pbnRlcmlvclJpbmdzW2ldLmdldFN3ZWVwRXZlbnRzKCk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgak1heCA9IHJpbmdTd2VlcEV2ZW50cy5sZW5ndGg7IGogPCBqTWF4OyBqKyspIHtcbiAgICAgICAgICAgIHN3ZWVwRXZlbnRzLnB1c2gocmluZ1N3ZWVwRXZlbnRzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3dlZXBFdmVudHM7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBvbHlJbjtcbiAgfSgpO1xuICB2YXIgTXVsdGlQb2x5SW4gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE11bHRpUG9seUluKGdlb20sIGlzU3ViamVjdCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE11bHRpUG9seUluKTtcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGdlb20pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZ2VvbWV0cnkgaXMgbm90IGEgdmFsaWQgUG9seWdvbiBvciBNdWx0aVBvbHlnb24nKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gaWYgdGhlIGlucHV0IGxvb2tzIGxpa2UgYSBwb2x5Z29uLCBjb252ZXJ0IGl0IHRvIGEgbXVsdGlwb2x5Z29uXG4gICAgICAgIGlmICh0eXBlb2YgZ2VvbVswXVswXVswXSA9PT0gJ251bWJlcicpIGdlb20gPSBbZ2VvbV07XG4gICAgICB9IGNhdGNoIChleCkgey8vIFRoZSBpbnB1dCBpcyBlaXRoZXIgbWFsZm9ybWVkIG9yIGhhcyBlbXB0eSBhcnJheXMuXG4gICAgICAgIC8vIEluIGVpdGhlciBjYXNlLCBpdCB3aWxsIGJlIGhhbmRsZWQgbGF0ZXIgb24uXG4gICAgICB9XG5cbiAgICAgIHRoaXMucG9seXMgPSBbXTtcbiAgICAgIHRoaXMuYmJveCA9IHtcbiAgICAgICAgbGw6IHtcbiAgICAgICAgICB4OiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgeTogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXG4gICAgICAgIH0sXG4gICAgICAgIHVyOiB7XG4gICAgICAgICAgeDogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgICAgICAgIHk6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IGdlb20ubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgIHZhciBwb2x5ID0gbmV3IFBvbHlJbihnZW9tW2ldLCB0aGlzKTtcbiAgICAgICAgaWYgKHBvbHkuYmJveC5sbC54IDwgdGhpcy5iYm94LmxsLngpIHRoaXMuYmJveC5sbC54ID0gcG9seS5iYm94LmxsLng7XG4gICAgICAgIGlmIChwb2x5LmJib3gubGwueSA8IHRoaXMuYmJveC5sbC55KSB0aGlzLmJib3gubGwueSA9IHBvbHkuYmJveC5sbC55O1xuICAgICAgICBpZiAocG9seS5iYm94LnVyLnggPiB0aGlzLmJib3gudXIueCkgdGhpcy5iYm94LnVyLnggPSBwb2x5LmJib3gudXIueDtcbiAgICAgICAgaWYgKHBvbHkuYmJveC51ci55ID4gdGhpcy5iYm94LnVyLnkpIHRoaXMuYmJveC51ci55ID0gcG9seS5iYm94LnVyLnk7XG4gICAgICAgIHRoaXMucG9seXMucHVzaChwb2x5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc1N1YmplY3QgPSBpc1N1YmplY3Q7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKE11bHRpUG9seUluLCBbe1xuICAgICAga2V5OiBcImdldFN3ZWVwRXZlbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3dlZXBFdmVudHMoKSB7XG4gICAgICAgIHZhciBzd2VlcEV2ZW50cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5wb2x5cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcG9seVN3ZWVwRXZlbnRzID0gdGhpcy5wb2x5c1tpXS5nZXRTd2VlcEV2ZW50cygpO1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpNYXggPSBwb2x5U3dlZXBFdmVudHMubGVuZ3RoOyBqIDwgak1heDsgaisrKSB7XG4gICAgICAgICAgICBzd2VlcEV2ZW50cy5wdXNoKHBvbHlTd2VlcEV2ZW50c1tqXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN3ZWVwRXZlbnRzO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBNdWx0aVBvbHlJbjtcbiAgfSgpO1xuXG4gIHZhciBSaW5nT3V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBfY3JlYXRlQ2xhc3MoUmluZ091dCwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJmYWN0b3J5XCIsXG5cbiAgICAgIC8qIEdpdmVuIHRoZSBzZWdtZW50cyBmcm9tIHRoZSBzd2VlcCBsaW5lIHBhc3MsIGNvbXB1dGUgJiByZXR1cm4gYSBzZXJpZXNcbiAgICAgICAqIG9mIGNsb3NlZCByaW5ncyBmcm9tIGFsbCB0aGUgc2VnbWVudHMgbWFya2VkIHRvIGJlIHBhcnQgb2YgdGhlIHJlc3VsdCAqL1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGZhY3RvcnkoYWxsU2VnbWVudHMpIHtcbiAgICAgICAgdmFyIHJpbmdzT3V0ID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBhbGxTZWdtZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgc2VnbWVudCA9IGFsbFNlZ21lbnRzW2ldO1xuICAgICAgICAgIGlmICghc2VnbWVudC5pc0luUmVzdWx0KCkgfHwgc2VnbWVudC5yaW5nT3V0KSBjb250aW51ZTtcbiAgICAgICAgICB2YXIgcHJldkV2ZW50ID0gbnVsbDtcbiAgICAgICAgICB2YXIgZXZlbnQgPSBzZWdtZW50LmxlZnRTRTtcbiAgICAgICAgICB2YXIgbmV4dEV2ZW50ID0gc2VnbWVudC5yaWdodFNFO1xuICAgICAgICAgIHZhciBldmVudHMgPSBbZXZlbnRdO1xuICAgICAgICAgIHZhciBzdGFydGluZ1BvaW50ID0gZXZlbnQucG9pbnQ7XG4gICAgICAgICAgdmFyIGludGVyc2VjdGlvbkxFcyA9IFtdO1xuICAgICAgICAgIC8qIFdhbGsgdGhlIGNoYWluIG9mIGxpbmtlZCBldmVudHMgdG8gZm9ybSBhIGNsb3NlZCByaW5nICovXG5cbiAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgcHJldkV2ZW50ID0gZXZlbnQ7XG4gICAgICAgICAgICBldmVudCA9IG5leHRFdmVudDtcbiAgICAgICAgICAgIGV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICAgICAgICAgIC8qIElzIHRoZSByaW5nIGNvbXBsZXRlPyAqL1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQucG9pbnQgPT09IHN0YXJ0aW5nUG9pbnQpIGJyZWFrO1xuXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICB2YXIgYXZhaWxhYmxlTEVzID0gZXZlbnQuZ2V0QXZhaWxhYmxlTGlua2VkRXZlbnRzKCk7XG4gICAgICAgICAgICAgIC8qIERpZCB3ZSBoaXQgYSBkZWFkIGVuZD8gVGhpcyBzaG91bGRuJ3QgaGFwcGVuLiBJbmRpY2F0ZXMgc29tZSBlYXJsaWVyXG4gICAgICAgICAgICAgICAqIHBhcnQgb2YgdGhlIGFsZ29yaXRobSBtYWxmdW5jdGlvbmVkLi4uIHBsZWFzZSBmaWxlIGEgYnVnIHJlcG9ydC4gKi9cblxuICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTEVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBmaXJzdFB0ID0gZXZlbnRzWzBdLnBvaW50O1xuICAgICAgICAgICAgICAgIHZhciBsYXN0UHQgPSBldmVudHNbZXZlbnRzLmxlbmd0aCAtIDFdLnBvaW50O1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBjb21wbGV0ZSBvdXRwdXQgcmluZyBzdGFydGluZyBhdCBbXCIuY29uY2F0KGZpcnN0UHQueCwgXCIsXCIpICsgXCIgXCIuY29uY2F0KGZpcnN0UHQueSwgXCJdLiBMYXN0IG1hdGNoaW5nIHNlZ21lbnQgZm91bmQgZW5kcyBhdFwiKSArIFwiIFtcIi5jb25jYXQobGFzdFB0LngsIFwiLCBcIikuY29uY2F0KGxhc3RQdC55LCBcIl0uXCIpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvKiBPbmx5IG9uZSB3YXkgdG8gZ28sIHNvIGNvdGludWUgb24gdGhlIHBhdGggKi9cblxuXG4gICAgICAgICAgICAgIGlmIChhdmFpbGFibGVMRXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbmV4dEV2ZW50ID0gYXZhaWxhYmxlTEVzWzBdLm90aGVyU0U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLyogV2UgbXVzdCBoYXZlIGFuIGludGVyc2VjdGlvbi4gQ2hlY2sgZm9yIGEgY29tcGxldGVkIGxvb3AgKi9cblxuXG4gICAgICAgICAgICAgIHZhciBpbmRleExFID0gbnVsbDtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMCwgak1heCA9IGludGVyc2VjdGlvbkxFcy5sZW5ndGg7IGogPCBqTWF4OyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJzZWN0aW9uTEVzW2pdLnBvaW50ID09PSBldmVudC5wb2ludCkge1xuICAgICAgICAgICAgICAgICAgaW5kZXhMRSA9IGo7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLyogRm91bmQgYSBjb21wbGV0ZWQgbG9vcC4gQ3V0IHRoYXQgb2ZmIGFuZCBtYWtlIGEgcmluZyAqL1xuXG5cbiAgICAgICAgICAgICAgaWYgKGluZGV4TEUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW50ZXJzZWN0aW9uTEUgPSBpbnRlcnNlY3Rpb25MRXMuc3BsaWNlKGluZGV4TEUpWzBdO1xuICAgICAgICAgICAgICAgIHZhciByaW5nRXZlbnRzID0gZXZlbnRzLnNwbGljZShpbnRlcnNlY3Rpb25MRS5pbmRleCk7XG4gICAgICAgICAgICAgICAgcmluZ0V2ZW50cy51bnNoaWZ0KHJpbmdFdmVudHNbMF0ub3RoZXJTRSk7XG4gICAgICAgICAgICAgICAgcmluZ3NPdXQucHVzaChuZXcgUmluZ091dChyaW5nRXZlbnRzLnJldmVyc2UoKSkpO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8qIHJlZ2lzdGVyIHRoZSBpbnRlcnNlY3Rpb24gKi9cblxuXG4gICAgICAgICAgICAgIGludGVyc2VjdGlvbkxFcy5wdXNoKHtcbiAgICAgICAgICAgICAgICBpbmRleDogZXZlbnRzLmxlbmd0aCxcbiAgICAgICAgICAgICAgICBwb2ludDogZXZlbnQucG9pbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIC8qIENob29zZSB0aGUgbGVmdC1tb3N0IG9wdGlvbiB0byBjb250aW51ZSB0aGUgd2FsayAqL1xuXG4gICAgICAgICAgICAgIHZhciBjb21wYXJhdG9yID0gZXZlbnQuZ2V0TGVmdG1vc3RDb21wYXJhdG9yKHByZXZFdmVudCk7XG4gICAgICAgICAgICAgIG5leHRFdmVudCA9IGF2YWlsYWJsZUxFcy5zb3J0KGNvbXBhcmF0b3IpWzBdLm90aGVyU0U7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJpbmdzT3V0LnB1c2gobmV3IFJpbmdPdXQoZXZlbnRzKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmluZ3NPdXQ7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgZnVuY3Rpb24gUmluZ091dChldmVudHMpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSaW5nT3V0KTtcblxuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gZXZlbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICBldmVudHNbaV0uc2VnbWVudC5yaW5nT3V0ID0gdGhpcztcbiAgICAgIH1cblxuICAgICAgdGhpcy5wb2x5ID0gbnVsbDtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUmluZ091dCwgW3tcbiAgICAgIGtleTogXCJnZXRHZW9tXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0R2VvbSgpIHtcbiAgICAgICAgLy8gUmVtb3ZlIHN1cGVyZmx1b3VzIHBvaW50cyAoaWUgZXh0cmEgcG9pbnRzIGFsb25nIGEgc3RyYWlnaHQgbGluZSksXG4gICAgICAgIHZhciBwcmV2UHQgPSB0aGlzLmV2ZW50c1swXS5wb2ludDtcbiAgICAgICAgdmFyIHBvaW50cyA9IFtwcmV2UHRdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBpTWF4ID0gdGhpcy5ldmVudHMubGVuZ3RoIC0gMTsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBfcHQgPSB0aGlzLmV2ZW50c1tpXS5wb2ludDtcbiAgICAgICAgICB2YXIgX25leHRQdCA9IHRoaXMuZXZlbnRzW2kgKyAxXS5wb2ludDtcbiAgICAgICAgICBpZiAoY29tcGFyZVZlY3RvckFuZ2xlcyhfcHQsIHByZXZQdCwgX25leHRQdCkgPT09IDApIGNvbnRpbnVlO1xuICAgICAgICAgIHBvaW50cy5wdXNoKF9wdCk7XG4gICAgICAgICAgcHJldlB0ID0gX3B0O1xuICAgICAgICB9IC8vIHJpbmcgd2FzIGFsbCAod2l0aGluIHJvdW5kaW5nIGVycm9yIG9mIGFuZ2xlIGNhbGMpIGNvbGluZWFyIHBvaW50c1xuXG5cbiAgICAgICAgaWYgKHBvaW50cy5sZW5ndGggPT09IDEpIHJldHVybiBudWxsOyAvLyBjaGVjayBpZiB0aGUgc3RhcnRpbmcgcG9pbnQgaXMgbmVjZXNzYXJ5XG5cbiAgICAgICAgdmFyIHB0ID0gcG9pbnRzWzBdO1xuICAgICAgICB2YXIgbmV4dFB0ID0gcG9pbnRzWzFdO1xuICAgICAgICBpZiAoY29tcGFyZVZlY3RvckFuZ2xlcyhwdCwgcHJldlB0LCBuZXh0UHQpID09PSAwKSBwb2ludHMuc2hpZnQoKTtcbiAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdKTtcbiAgICAgICAgdmFyIHN0ZXAgPSB0aGlzLmlzRXh0ZXJpb3JSaW5nKCkgPyAxIDogLTE7XG4gICAgICAgIHZhciBpU3RhcnQgPSB0aGlzLmlzRXh0ZXJpb3JSaW5nKCkgPyAwIDogcG9pbnRzLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBpRW5kID0gdGhpcy5pc0V4dGVyaW9yUmluZygpID8gcG9pbnRzLmxlbmd0aCA6IC0xO1xuICAgICAgICB2YXIgb3JkZXJlZFBvaW50cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIF9pID0gaVN0YXJ0OyBfaSAhPSBpRW5kOyBfaSArPSBzdGVwKSB7XG4gICAgICAgICAgb3JkZXJlZFBvaW50cy5wdXNoKFtwb2ludHNbX2ldLngsIHBvaW50c1tfaV0ueV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9yZGVyZWRQb2ludHM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImlzRXh0ZXJpb3JSaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaXNFeHRlcmlvclJpbmcoKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0V4dGVyaW9yUmluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFyIGVuY2xvc2luZyA9IHRoaXMuZW5jbG9zaW5nUmluZygpO1xuICAgICAgICAgIHRoaXMuX2lzRXh0ZXJpb3JSaW5nID0gZW5jbG9zaW5nID8gIWVuY2xvc2luZy5pc0V4dGVyaW9yUmluZygpIDogdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0V4dGVyaW9yUmluZztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZW5jbG9zaW5nUmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGVuY2xvc2luZ1JpbmcoKSB7XG4gICAgICAgIGlmICh0aGlzLl9lbmNsb3NpbmdSaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0aGlzLl9lbmNsb3NpbmdSaW5nID0gdGhpcy5fY2FsY0VuY2xvc2luZ1JpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmNsb3NpbmdSaW5nO1xuICAgICAgfVxuICAgICAgLyogUmV0dXJucyB0aGUgcmluZyB0aGF0IGVuY2xvc2VzIHRoaXMgb25lLCBpZiBhbnkgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfY2FsY0VuY2xvc2luZ1JpbmdcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfY2FsY0VuY2xvc2luZ1JpbmcoKSB7XG4gICAgICAgIC8vIHN0YXJ0IHdpdGggdGhlIGVhbGllciBzd2VlcCBsaW5lIGV2ZW50IHNvIHRoYXQgdGhlIHByZXZTZWdcbiAgICAgICAgLy8gY2hhaW4gZG9lc24ndCBsZWFkIHVzIGluc2lkZSBvZiBhIGxvb3Agb2Ygb3Vyc1xuICAgICAgICB2YXIgbGVmdE1vc3RFdnQgPSB0aGlzLmV2ZW50c1swXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMSwgaU1heCA9IHRoaXMuZXZlbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBldnQgPSB0aGlzLmV2ZW50c1tpXTtcbiAgICAgICAgICBpZiAoU3dlZXBFdmVudC5jb21wYXJlKGxlZnRNb3N0RXZ0LCBldnQpID4gMCkgbGVmdE1vc3RFdnQgPSBldnQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcHJldlNlZyA9IGxlZnRNb3N0RXZ0LnNlZ21lbnQucHJldkluUmVzdWx0KCk7XG4gICAgICAgIHZhciBwcmV2UHJldlNlZyA9IHByZXZTZWcgPyBwcmV2U2VnLnByZXZJblJlc3VsdCgpIDogbnVsbDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIC8vIG5vIHNlZ21lbnQgZm91bmQsIHRodXMgbm8gcmluZyBjYW4gZW5jbG9zZSB1c1xuICAgICAgICAgIGlmICghcHJldlNlZykgcmV0dXJuIG51bGw7IC8vIG5vIHNlZ21lbnRzIGJlbG93IHByZXYgc2VnbWVudCBmb3VuZCwgdGh1cyB0aGUgcmluZyBvZiB0aGUgcHJldlxuICAgICAgICAgIC8vIHNlZ21lbnQgbXVzdCBsb29wIGJhY2sgYXJvdW5kIGFuZCBlbmNsb3NlIHVzXG5cbiAgICAgICAgICBpZiAoIXByZXZQcmV2U2VnKSByZXR1cm4gcHJldlNlZy5yaW5nT3V0OyAvLyBpZiB0aGUgdHdvIHNlZ21lbnRzIGFyZSBvZiBkaWZmZXJlbnQgcmluZ3MsIHRoZSByaW5nIG9mIHRoZSBwcmV2XG4gICAgICAgICAgLy8gc2VnbWVudCBtdXN0IGVpdGhlciBsb29wIGFyb3VuZCB1cyBvciB0aGUgcmluZyBvZiB0aGUgcHJldiBwcmV2XG4gICAgICAgICAgLy8gc2VnLCB3aGljaCB3b3VsZCBtYWtlIHVzIGFuZCB0aGUgcmluZyBvZiB0aGUgcHJldiBwZWVyc1xuXG4gICAgICAgICAgaWYgKHByZXZQcmV2U2VnLnJpbmdPdXQgIT09IHByZXZTZWcucmluZ091dCkge1xuICAgICAgICAgICAgaWYgKHByZXZQcmV2U2VnLnJpbmdPdXQuZW5jbG9zaW5nUmluZygpICE9PSBwcmV2U2VnLnJpbmdPdXQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHByZXZTZWcucmluZ091dDtcbiAgICAgICAgICAgIH0gZWxzZSByZXR1cm4gcHJldlNlZy5yaW5nT3V0LmVuY2xvc2luZ1JpbmcoKTtcbiAgICAgICAgICB9IC8vIHR3byBzZWdtZW50cyBhcmUgZnJvbSB0aGUgc2FtZSByaW5nLCBzbyB0aGlzIHdhcyBhIHBlbmlzdWxhXG4gICAgICAgICAgLy8gb2YgdGhhdCByaW5nLiBpdGVyYXRlIGRvd253YXJkLCBrZWVwIHNlYXJjaGluZ1xuXG5cbiAgICAgICAgICBwcmV2U2VnID0gcHJldlByZXZTZWcucHJldkluUmVzdWx0KCk7XG4gICAgICAgICAgcHJldlByZXZTZWcgPSBwcmV2U2VnID8gcHJldlNlZy5wcmV2SW5SZXN1bHQoKSA6IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmluZ091dDtcbiAgfSgpO1xuICB2YXIgUG9seU91dCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUG9seU91dChleHRlcmlvclJpbmcpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb2x5T3V0KTtcblxuICAgICAgdGhpcy5leHRlcmlvclJpbmcgPSBleHRlcmlvclJpbmc7XG4gICAgICBleHRlcmlvclJpbmcucG9seSA9IHRoaXM7XG4gICAgICB0aGlzLmludGVyaW9yUmluZ3MgPSBbXTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUG9seU91dCwgW3tcbiAgICAgIGtleTogXCJhZGRJbnRlcmlvclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZEludGVyaW9yKHJpbmcpIHtcbiAgICAgICAgdGhpcy5pbnRlcmlvclJpbmdzLnB1c2gocmluZyk7XG4gICAgICAgIHJpbmcucG9seSA9IHRoaXM7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImdldEdlb21cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRHZW9tKCkge1xuICAgICAgICB2YXIgZ2VvbSA9IFt0aGlzLmV4dGVyaW9yUmluZy5nZXRHZW9tKCldOyAvLyBleHRlcmlvciByaW5nIHdhcyBhbGwgKHdpdGhpbiByb3VuZGluZyBlcnJvciBvZiBhbmdsZSBjYWxjKSBjb2xpbmVhciBwb2ludHNcblxuICAgICAgICBpZiAoZ2VvbVswXSA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLmludGVyaW9yUmluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJpbmdHZW9tID0gdGhpcy5pbnRlcmlvclJpbmdzW2ldLmdldEdlb20oKTsgLy8gaW50ZXJpb3IgcmluZyB3YXMgYWxsICh3aXRoaW4gcm91bmRpbmcgZXJyb3Igb2YgYW5nbGUgY2FsYykgY29saW5lYXIgcG9pbnRzXG5cbiAgICAgICAgICBpZiAocmluZ0dlb20gPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICAgIGdlb20ucHVzaChyaW5nR2VvbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2VvbTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUG9seU91dDtcbiAgfSgpO1xuICB2YXIgTXVsdGlQb2x5T3V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNdWx0aVBvbHlPdXQocmluZ3MpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNdWx0aVBvbHlPdXQpO1xuXG4gICAgICB0aGlzLnJpbmdzID0gcmluZ3M7XG4gICAgICB0aGlzLnBvbHlzID0gdGhpcy5fY29tcG9zZVBvbHlzKHJpbmdzKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoTXVsdGlQb2x5T3V0LCBbe1xuICAgICAga2V5OiBcImdldEdlb21cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRHZW9tKCkge1xuICAgICAgICB2YXIgZ2VvbSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5wb2x5cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcG9seUdlb20gPSB0aGlzLnBvbHlzW2ldLmdldEdlb20oKTsgLy8gZXh0ZXJpb3IgcmluZyB3YXMgYWxsICh3aXRoaW4gcm91bmRpbmcgZXJyb3Igb2YgYW5nbGUgY2FsYykgY29saW5lYXIgcG9pbnRzXG5cbiAgICAgICAgICBpZiAocG9seUdlb20gPT09IG51bGwpIGNvbnRpbnVlO1xuICAgICAgICAgIGdlb20ucHVzaChwb2x5R2VvbSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZ2VvbTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2NvbXBvc2VQb2x5c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jb21wb3NlUG9seXMocmluZ3MpIHtcbiAgICAgICAgdmFyIHBvbHlzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSByaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcmluZyA9IHJpbmdzW2ldO1xuICAgICAgICAgIGlmIChyaW5nLnBvbHkpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChyaW5nLmlzRXh0ZXJpb3JSaW5nKCkpIHBvbHlzLnB1c2gobmV3IFBvbHlPdXQocmluZykpO2Vsc2Uge1xuICAgICAgICAgICAgdmFyIGVuY2xvc2luZ1JpbmcgPSByaW5nLmVuY2xvc2luZ1JpbmcoKTtcbiAgICAgICAgICAgIGlmICghZW5jbG9zaW5nUmluZy5wb2x5KSBwb2x5cy5wdXNoKG5ldyBQb2x5T3V0KGVuY2xvc2luZ1JpbmcpKTtcbiAgICAgICAgICAgIGVuY2xvc2luZ1JpbmcucG9seS5hZGRJbnRlcmlvcihyaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcG9seXM7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE11bHRpUG9seU91dDtcbiAgfSgpO1xuXG4gIC8qKlxuICAgKiBOT1RFOiAgV2UgbXVzdCBiZSBjYXJlZnVsIG5vdCB0byBjaGFuZ2UgYW55IHNlZ21lbnRzIHdoaWxlXG4gICAqICAgICAgICB0aGV5IGFyZSBpbiB0aGUgU3BsYXlUcmVlLiBBRkFJSywgdGhlcmUncyBubyB3YXkgdG8gdGVsbFxuICAgKiAgICAgICAgdGhlIHRyZWUgdG8gcmViYWxhbmNlIGl0c2VsZiAtIHRodXMgYmVmb3JlIHNwbGl0dGluZ1xuICAgKiAgICAgICAgYSBzZWdtZW50IHRoYXQncyBpbiB0aGUgdHJlZSwgd2UgcmVtb3ZlIGl0IGZyb20gdGhlIHRyZWUsXG4gICAqICAgICAgICBkbyB0aGUgc3BsaXQsIHRoZW4gcmUtaW5zZXJ0IGl0LiAoRXZlbiB0aG91Z2ggc3BsaXR0aW5nIGFcbiAgICogICAgICAgIHNlZ21lbnQgKnNob3VsZG4ndCogY2hhbmdlIGl0cyBjb3JyZWN0IHBvc2l0aW9uIGluIHRoZVxuICAgKiAgICAgICAgc3dlZXAgbGluZSB0cmVlLCB0aGUgcmVhbGl0eSBpcyBiZWNhdXNlIG9mIHJvdW5kaW5nIGVycm9ycyxcbiAgICogICAgICAgIGl0IHNvbWV0aW1lcyBkb2VzLilcbiAgICovXG5cbiAgdmFyIFN3ZWVwTGluZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3dlZXBMaW5lKHF1ZXVlKSB7XG4gICAgICB2YXIgY29tcGFyYXRvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogU2VnbWVudC5jb21wYXJlO1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3dlZXBMaW5lKTtcblxuICAgICAgdGhpcy5xdWV1ZSA9IHF1ZXVlO1xuICAgICAgdGhpcy50cmVlID0gbmV3IFRyZWUoY29tcGFyYXRvcik7XG4gICAgICB0aGlzLnNlZ21lbnRzID0gW107XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFN3ZWVwTGluZSwgW3tcbiAgICAgIGtleTogXCJwcm9jZXNzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcHJvY2VzcyhldmVudCkge1xuICAgICAgICB2YXIgc2VnbWVudCA9IGV2ZW50LnNlZ21lbnQ7XG4gICAgICAgIHZhciBuZXdFdmVudHMgPSBbXTsgLy8gaWYgd2UndmUgYWxyZWFkeSBiZWVuIGNvbnN1bWVkIGJ5IGFub3RoZXIgc2VnbWVudCxcbiAgICAgICAgLy8gY2xlYW4gdXAgb3VyIGJvZHkgcGFydHMgYW5kIGdldCBvdXRcblxuICAgICAgICBpZiAoZXZlbnQuY29uc3VtZWRCeSkge1xuICAgICAgICAgIGlmIChldmVudC5pc0xlZnQpIHRoaXMucXVldWUucmVtb3ZlKGV2ZW50Lm90aGVyU0UpO2Vsc2UgdGhpcy50cmVlLnJlbW92ZShzZWdtZW50KTtcbiAgICAgICAgICByZXR1cm4gbmV3RXZlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5vZGUgPSBldmVudC5pc0xlZnQgPyB0aGlzLnRyZWUuaW5zZXJ0KHNlZ21lbnQpIDogdGhpcy50cmVlLmZpbmQoc2VnbWVudCk7XG4gICAgICAgIGlmICghbm9kZSkgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGZpbmQgc2VnbWVudCAjXCIuY29uY2F0KHNlZ21lbnQuaWQsIFwiIFwiKSArIFwiW1wiLmNvbmNhdChzZWdtZW50LmxlZnRTRS5wb2ludC54LCBcIiwgXCIpLmNvbmNhdChzZWdtZW50LmxlZnRTRS5wb2ludC55LCBcIl0gLT4gXCIpICsgXCJbXCIuY29uY2F0KHNlZ21lbnQucmlnaHRTRS5wb2ludC54LCBcIiwgXCIpLmNvbmNhdChzZWdtZW50LnJpZ2h0U0UucG9pbnQueSwgXCJdIFwiKSArICdpbiBTd2VlcExpbmUgdHJlZS4gUGxlYXNlIHN1Ym1pdCBhIGJ1ZyByZXBvcnQuJyk7XG4gICAgICAgIHZhciBwcmV2Tm9kZSA9IG5vZGU7XG4gICAgICAgIHZhciBuZXh0Tm9kZSA9IG5vZGU7XG4gICAgICAgIHZhciBwcmV2U2VnID0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbmV4dFNlZyA9IHVuZGVmaW5lZDsgLy8gc2tpcCBjb25zdW1lZCBzZWdtZW50cyBzdGlsbCBpbiB0cmVlXG5cbiAgICAgICAgd2hpbGUgKHByZXZTZWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHByZXZOb2RlID0gdGhpcy50cmVlLnByZXYocHJldk5vZGUpO1xuICAgICAgICAgIGlmIChwcmV2Tm9kZSA9PT0gbnVsbCkgcHJldlNlZyA9IG51bGw7ZWxzZSBpZiAocHJldk5vZGUua2V5LmNvbnN1bWVkQnkgPT09IHVuZGVmaW5lZCkgcHJldlNlZyA9IHByZXZOb2RlLmtleTtcbiAgICAgICAgfSAvLyBza2lwIGNvbnN1bWVkIHNlZ21lbnRzIHN0aWxsIGluIHRyZWVcblxuXG4gICAgICAgIHdoaWxlIChuZXh0U2VnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuZXh0Tm9kZSA9IHRoaXMudHJlZS5uZXh0KG5leHROb2RlKTtcbiAgICAgICAgICBpZiAobmV4dE5vZGUgPT09IG51bGwpIG5leHRTZWcgPSBudWxsO2Vsc2UgaWYgKG5leHROb2RlLmtleS5jb25zdW1lZEJ5ID09PSB1bmRlZmluZWQpIG5leHRTZWcgPSBuZXh0Tm9kZS5rZXk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQuaXNMZWZ0KSB7XG4gICAgICAgICAgLy8gQ2hlY2sgZm9yIGludGVyc2VjdGlvbnMgYWdhaW5zdCB0aGUgcHJldmlvdXMgc2VnbWVudCBpbiB0aGUgc3dlZXAgbGluZVxuICAgICAgICAgIHZhciBwcmV2TXlTcGxpdHRlciA9IG51bGw7XG5cbiAgICAgICAgICBpZiAocHJldlNlZykge1xuICAgICAgICAgICAgdmFyIHByZXZJbnRlciA9IHByZXZTZWcuZ2V0SW50ZXJzZWN0aW9uKHNlZ21lbnQpO1xuXG4gICAgICAgICAgICBpZiAocHJldkludGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmICghc2VnbWVudC5pc0FuRW5kcG9pbnQocHJldkludGVyKSkgcHJldk15U3BsaXR0ZXIgPSBwcmV2SW50ZXI7XG5cbiAgICAgICAgICAgICAgaWYgKCFwcmV2U2VnLmlzQW5FbmRwb2ludChwcmV2SW50ZXIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0V2ZW50c0Zyb21TcGxpdCA9IHRoaXMuX3NwbGl0U2FmZWx5KHByZXZTZWcsIHByZXZJbnRlcik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IG5ld0V2ZW50c0Zyb21TcGxpdC5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKG5ld0V2ZW50c0Zyb21TcGxpdFtpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAvLyBDaGVjayBmb3IgaW50ZXJzZWN0aW9ucyBhZ2FpbnN0IHRoZSBuZXh0IHNlZ21lbnQgaW4gdGhlIHN3ZWVwIGxpbmVcblxuXG4gICAgICAgICAgdmFyIG5leHRNeVNwbGl0dGVyID0gbnVsbDtcblxuICAgICAgICAgIGlmIChuZXh0U2VnKSB7XG4gICAgICAgICAgICB2YXIgbmV4dEludGVyID0gbmV4dFNlZy5nZXRJbnRlcnNlY3Rpb24oc2VnbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChuZXh0SW50ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKCFzZWdtZW50LmlzQW5FbmRwb2ludChuZXh0SW50ZXIpKSBuZXh0TXlTcGxpdHRlciA9IG5leHRJbnRlcjtcblxuICAgICAgICAgICAgICBpZiAoIW5leHRTZWcuaXNBbkVuZHBvaW50KG5leHRJbnRlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgX25ld0V2ZW50c0Zyb21TcGxpdCA9IHRoaXMuX3NwbGl0U2FmZWx5KG5leHRTZWcsIG5leHRJbnRlcik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9pTWF4ID0gX25ld0V2ZW50c0Zyb21TcGxpdC5sZW5ndGg7IF9pIDwgX2lNYXg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKF9uZXdFdmVudHNGcm9tU3BsaXRbX2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIEZvciBzaW1wbGljaXR5LCBldmVuIGlmIHdlIGZpbmQgbW9yZSB0aGFuIG9uZSBpbnRlcnNlY3Rpb24gd2Ugb25seVxuICAgICAgICAgIC8vIHNwaWx0IG9uIHRoZSAnZWFybGllc3QnIChzd2VlcC1saW5lIHN0eWxlKSBvZiB0aGUgaW50ZXJzZWN0aW9ucy5cbiAgICAgICAgICAvLyBUaGUgb3RoZXIgaW50ZXJzZWN0aW9uIHdpbGwgYmUgaGFuZGxlZCBpbiBhIGZ1dHVyZSBwcm9jZXNzKCkuXG5cblxuICAgICAgICAgIGlmIChwcmV2TXlTcGxpdHRlciAhPT0gbnVsbCB8fCBuZXh0TXlTcGxpdHRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIG15U3BsaXR0ZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHByZXZNeVNwbGl0dGVyID09PSBudWxsKSBteVNwbGl0dGVyID0gbmV4dE15U3BsaXR0ZXI7ZWxzZSBpZiAobmV4dE15U3BsaXR0ZXIgPT09IG51bGwpIG15U3BsaXR0ZXIgPSBwcmV2TXlTcGxpdHRlcjtlbHNlIHtcbiAgICAgICAgICAgICAgdmFyIGNtcFNwbGl0dGVycyA9IFN3ZWVwRXZlbnQuY29tcGFyZVBvaW50cyhwcmV2TXlTcGxpdHRlciwgbmV4dE15U3BsaXR0ZXIpO1xuICAgICAgICAgICAgICBteVNwbGl0dGVyID0gY21wU3BsaXR0ZXJzIDw9IDAgPyBwcmV2TXlTcGxpdHRlciA6IG5leHRNeVNwbGl0dGVyO1xuICAgICAgICAgICAgfSAvLyBSb3VuZGluZyBlcnJvcnMgY2FuIGNhdXNlIGNoYW5nZXMgaW4gb3JkZXJpbmcsXG4gICAgICAgICAgICAvLyBzbyByZW1vdmUgYWZlY3RlZCBzZWdtZW50cyBhbmQgcmlnaHQgc3dlZXAgZXZlbnRzIGJlZm9yZSBzcGxpdHRpbmdcblxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5yZW1vdmUoc2VnbWVudC5yaWdodFNFKTtcbiAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKHNlZ21lbnQucmlnaHRTRSk7XG5cbiAgICAgICAgICAgIHZhciBfbmV3RXZlbnRzRnJvbVNwbGl0MiA9IHNlZ21lbnQuc3BsaXQobXlTcGxpdHRlcik7XG5cbiAgICAgICAgICAgIGZvciAodmFyIF9pMiA9IDAsIF9pTWF4MiA9IF9uZXdFdmVudHNGcm9tU3BsaXQyLmxlbmd0aDsgX2kyIDwgX2lNYXgyOyBfaTIrKykge1xuICAgICAgICAgICAgICBuZXdFdmVudHMucHVzaChfbmV3RXZlbnRzRnJvbVNwbGl0MltfaTJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3RXZlbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGZvdW5kIHNvbWUgaW50ZXJzZWN0aW9ucywgc28gcmUtZG8gdGhlIGN1cnJlbnQgZXZlbnQgdG9cbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBzd2VlcCBsaW5lIG9yZGVyaW5nIGlzIHRvdGFsbHkgY29uc2lzdGVudCBmb3IgbGF0ZXJcbiAgICAgICAgICAgIC8vIHVzZSB3aXRoIHRoZSBzZWdtZW50ICdwcmV2JyBwb2ludGVyc1xuICAgICAgICAgICAgdGhpcy50cmVlLnJlbW92ZShzZWdtZW50KTtcbiAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gZG9uZSB3aXRoIGxlZnQgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICAgICAgICAgIHNlZ21lbnQucHJldiA9IHByZXZTZWc7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGV2ZW50LmlzUmlnaHRcbiAgICAgICAgICAvLyBzaW5jZSB3ZSdyZSBhYm91dCB0byBiZSByZW1vdmVkIGZyb20gdGhlIHN3ZWVwIGxpbmUsIGNoZWNrIGZvclxuICAgICAgICAgIC8vIGludGVyc2VjdGlvbnMgYmV0d2VlbiBvdXIgcHJldmlvdXMgYW5kIG5leHQgc2VnbWVudHNcbiAgICAgICAgICBpZiAocHJldlNlZyAmJiBuZXh0U2VnKSB7XG4gICAgICAgICAgICB2YXIgaW50ZXIgPSBwcmV2U2VnLmdldEludGVyc2VjdGlvbihuZXh0U2VnKTtcblxuICAgICAgICAgICAgaWYgKGludGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmICghcHJldlNlZy5pc0FuRW5kcG9pbnQoaW50ZXIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9uZXdFdmVudHNGcm9tU3BsaXQzID0gdGhpcy5fc3BsaXRTYWZlbHkocHJldlNlZywgaW50ZXIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kzID0gMCwgX2lNYXgzID0gX25ld0V2ZW50c0Zyb21TcGxpdDMubGVuZ3RoOyBfaTMgPCBfaU1heDM7IF9pMysrKSB7XG4gICAgICAgICAgICAgICAgICBuZXdFdmVudHMucHVzaChfbmV3RXZlbnRzRnJvbVNwbGl0M1tfaTNdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoIW5leHRTZWcuaXNBbkVuZHBvaW50KGludGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBfbmV3RXZlbnRzRnJvbVNwbGl0NCA9IHRoaXMuX3NwbGl0U2FmZWx5KG5leHRTZWcsIGludGVyKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pNCA9IDAsIF9pTWF4NCA9IF9uZXdFdmVudHNGcm9tU3BsaXQ0Lmxlbmd0aDsgX2k0IDwgX2lNYXg0OyBfaTQrKykge1xuICAgICAgICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goX25ld0V2ZW50c0Zyb21TcGxpdDRbX2k0XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy50cmVlLnJlbW92ZShzZWdtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdFdmVudHM7XG4gICAgICB9XG4gICAgICAvKiBTYWZlbHkgc3BsaXQgYSBzZWdtZW50IHRoYXQgaXMgY3VycmVudGx5IGluIHRoZSBkYXRhc3RydWN0dXJlc1xuICAgICAgICogSUUgLSBhIHNlZ21lbnQgb3RoZXIgdGhhbiB0aGUgb25lIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIHByb2Nlc3NlZC4gKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfc3BsaXRTYWZlbHlcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfc3BsaXRTYWZlbHkoc2VnLCBwdCkge1xuICAgICAgICAvLyBSb3VuZGluZyBlcnJvcnMgY2FuIGNhdXNlIGNoYW5nZXMgaW4gb3JkZXJpbmcsXG4gICAgICAgIC8vIHNvIHJlbW92ZSBhZmVjdGVkIHNlZ21lbnRzIGFuZCByaWdodCBzd2VlcCBldmVudHMgYmVmb3JlIHNwbGl0dGluZ1xuICAgICAgICAvLyByZW1vdmVOb2RlKCkgZG9lc24ndCB3b3JrLCBzbyBoYXZlIHJlLWZpbmQgdGhlIHNlZ1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vdzhyL3NwbGF5LXRyZWUvcHVsbC81XG4gICAgICAgIHRoaXMudHJlZS5yZW1vdmUoc2VnKTtcbiAgICAgICAgdmFyIHJpZ2h0U0UgPSBzZWcucmlnaHRTRTtcbiAgICAgICAgdGhpcy5xdWV1ZS5yZW1vdmUocmlnaHRTRSk7XG4gICAgICAgIHZhciBuZXdFdmVudHMgPSBzZWcuc3BsaXQocHQpO1xuICAgICAgICBuZXdFdmVudHMucHVzaChyaWdodFNFKTsgLy8gc3BsaXR0aW5nIGNhbiB0cmlnZ2VyIGNvbnN1bXB0aW9uXG5cbiAgICAgICAgaWYgKHNlZy5jb25zdW1lZEJ5ID09PSB1bmRlZmluZWQpIHRoaXMudHJlZS5pbnNlcnQoc2VnKTtcbiAgICAgICAgcmV0dXJuIG5ld0V2ZW50cztcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gU3dlZXBMaW5lO1xuICB9KCk7XG5cbiAgdmFyIFBPTFlHT05fQ0xJUFBJTkdfTUFYX1FVRVVFX1NJWkUgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuUE9MWUdPTl9DTElQUElOR19NQVhfUVVFVUVfU0laRSB8fCAxMDAwMDAwO1xuICB2YXIgUE9MWUdPTl9DTElQUElOR19NQVhfU1dFRVBMSU5FX1NFR01FTlRTID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52LlBPTFlHT05fQ0xJUFBJTkdfTUFYX1NXRUVQTElORV9TRUdNRU5UUyB8fCAxMDAwMDAwO1xuICB2YXIgT3BlcmF0aW9uID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBPcGVyYXRpb24oKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgT3BlcmF0aW9uKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoT3BlcmF0aW9uLCBbe1xuICAgICAga2V5OiBcInJ1blwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJ1bih0eXBlLCBnZW9tLCBtb3JlR2VvbXMpIHtcbiAgICAgICAgb3BlcmF0aW9uLnR5cGUgPSB0eXBlO1xuICAgICAgICByb3VuZGVyLnJlc2V0KCk7XG4gICAgICAgIC8qIENvbnZlcnQgaW5wdXRzIHRvIE11bHRpUG9seSBvYmplY3RzICovXG5cbiAgICAgICAgdmFyIG11bHRpcG9seXMgPSBbbmV3IE11bHRpUG9seUluKGdlb20sIHRydWUpXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IG1vcmVHZW9tcy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICBtdWx0aXBvbHlzLnB1c2gobmV3IE11bHRpUG9seUluKG1vcmVHZW9tc1tpXSwgZmFsc2UpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZXJhdGlvbi5udW1NdWx0aVBvbHlzID0gbXVsdGlwb2x5cy5sZW5ndGg7XG4gICAgICAgIC8qIEJCb3ggb3B0aW1pemF0aW9uIGZvciBkaWZmZXJlbmNlIG9wZXJhdGlvblxuICAgICAgICAgKiBJZiB0aGUgYmJveCBvZiBhIG11bHRpcG9seWdvbiB0aGF0J3MgcGFydCBvZiB0aGUgY2xpcHBpbmcgZG9lc24ndFxuICAgICAgICAgKiBpbnRlcnNlY3QgdGhlIGJib3ggb2YgdGhlIHN1YmplY3QgYXQgYWxsLCB3ZSBjYW4ganVzdCBkcm9wIHRoYXRcbiAgICAgICAgICogbXVsdGlwbG95Z29uLiAqL1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24udHlwZSA9PT0gJ2RpZmZlcmVuY2UnKSB7XG4gICAgICAgICAgLy8gaW4gcGxhY2UgcmVtb3ZhbFxuICAgICAgICAgIHZhciBzdWJqZWN0ID0gbXVsdGlwb2x5c1swXTtcbiAgICAgICAgICB2YXIgX2kgPSAxO1xuXG4gICAgICAgICAgd2hpbGUgKF9pIDwgbXVsdGlwb2x5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChnZXRCYm94T3ZlcmxhcChtdWx0aXBvbHlzW19pXS5iYm94LCBzdWJqZWN0LmJib3gpICE9PSBudWxsKSBfaSsrO2Vsc2UgbXVsdGlwb2x5cy5zcGxpY2UoX2ksIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBCQm94IG9wdGltaXphdGlvbiBmb3IgaW50ZXJzZWN0aW9uIG9wZXJhdGlvblxuICAgICAgICAgKiBJZiB3ZSBjYW4gZmluZCBhbnkgcGFpciBvZiBtdWx0aXBvbHlnb25zIHdob3NlIGJib3ggZG9lcyBub3Qgb3ZlcmxhcCxcbiAgICAgICAgICogdGhlbiB0aGUgcmVzdWx0IHdpbGwgYmUgZW1wdHkuICovXG5cblxuICAgICAgICBpZiAob3BlcmF0aW9uLnR5cGUgPT09ICdpbnRlcnNlY3Rpb24nKSB7XG4gICAgICAgICAgLy8gVE9ETzogdGhpcyBpcyBPKG5eMikgaW4gbnVtYmVyIG9mIHBvbHlnb25zLiBCeSBzb3J0aW5nIHRoZSBiYm94ZXMsXG4gICAgICAgICAgLy8gICAgICAgaXQgY291bGQgYmUgb3B0aW1pemVkIHRvIE8obiAqIGxuKG4pKVxuICAgICAgICAgIGZvciAodmFyIF9pMiA9IDAsIF9pTWF4ID0gbXVsdGlwb2x5cy5sZW5ndGg7IF9pMiA8IF9pTWF4OyBfaTIrKykge1xuICAgICAgICAgICAgdmFyIG1wQSA9IG11bHRpcG9seXNbX2kyXTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IF9pMiArIDEsIGpNYXggPSBtdWx0aXBvbHlzLmxlbmd0aDsgaiA8IGpNYXg7IGorKykge1xuICAgICAgICAgICAgICBpZiAoZ2V0QmJveE92ZXJsYXAobXBBLmJib3gsIG11bHRpcG9seXNbal0uYmJveCkgPT09IG51bGwpIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogUHV0IHNlZ21lbnQgZW5kcG9pbnRzIGluIGEgcHJpb3JpdHkgcXVldWUgKi9cblxuXG4gICAgICAgIHZhciBxdWV1ZSA9IG5ldyBUcmVlKFN3ZWVwRXZlbnQuY29tcGFyZSk7XG5cbiAgICAgICAgZm9yICh2YXIgX2kzID0gMCwgX2lNYXgyID0gbXVsdGlwb2x5cy5sZW5ndGg7IF9pMyA8IF9pTWF4MjsgX2kzKyspIHtcbiAgICAgICAgICB2YXIgc3dlZXBFdmVudHMgPSBtdWx0aXBvbHlzW19pM10uZ2V0U3dlZXBFdmVudHMoKTtcblxuICAgICAgICAgIGZvciAodmFyIF9qID0gMCwgX2pNYXggPSBzd2VlcEV2ZW50cy5sZW5ndGg7IF9qIDwgX2pNYXg7IF9qKyspIHtcbiAgICAgICAgICAgIHF1ZXVlLmluc2VydChzd2VlcEV2ZW50c1tfal0pO1xuXG4gICAgICAgICAgICBpZiAocXVldWUuc2l6ZSA+IFBPTFlHT05fQ0xJUFBJTkdfTUFYX1FVRVVFX1NJWkUpIHtcbiAgICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gaW5maW5pdGUgbG9vcCwgYW4gb3RoZXJ3aXNlIGNvbW1vbiBtYW5pZmVzdGF0aW9uIG9mIGJ1Z3NcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIHdoZW4gcHV0dGluZyBzZWdtZW50IGVuZHBvaW50cyBpbiBhIHByaW9yaXR5IHF1ZXVlICcgKyAnKHF1ZXVlIHNpemUgdG9vIGJpZykuIFBsZWFzZSBmaWxlIGEgYnVnIHJlcG9ydC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogUGFzcyB0aGUgc3dlZXAgbGluZSBvdmVyIHRob3NlIGVuZHBvaW50cyAqL1xuXG5cbiAgICAgICAgdmFyIHN3ZWVwTGluZSA9IG5ldyBTd2VlcExpbmUocXVldWUpO1xuICAgICAgICB2YXIgcHJldlF1ZXVlU2l6ZSA9IHF1ZXVlLnNpemU7XG4gICAgICAgIHZhciBub2RlID0gcXVldWUucG9wKCk7XG5cbiAgICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgICB2YXIgZXZ0ID0gbm9kZS5rZXk7XG5cbiAgICAgICAgICBpZiAocXVldWUuc2l6ZSA9PT0gcHJldlF1ZXVlU2l6ZSkge1xuICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gaW5maW5pdGUgbG9vcCwgYW4gb3RoZXJ3aXNlIGNvbW1vbiBtYW5pZmVzdGF0aW9uIG9mIGJ1Z3NcbiAgICAgICAgICAgIHZhciBzZWcgPSBldnQuc2VnbWVudDtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBwb3AoKSBcIi5jb25jYXQoZXZ0LmlzTGVmdCA/ICdsZWZ0JyA6ICdyaWdodCcsIFwiIFN3ZWVwRXZlbnQgXCIpICsgXCJbXCIuY29uY2F0KGV2dC5wb2ludC54LCBcIiwgXCIpLmNvbmNhdChldnQucG9pbnQueSwgXCJdIGZyb20gc2VnbWVudCAjXCIpLmNvbmNhdChzZWcuaWQsIFwiIFwiKSArIFwiW1wiLmNvbmNhdChzZWcubGVmdFNFLnBvaW50LngsIFwiLCBcIikuY29uY2F0KHNlZy5sZWZ0U0UucG9pbnQueSwgXCJdIC0+IFwiKSArIFwiW1wiLmNvbmNhdChzZWcucmlnaHRTRS5wb2ludC54LCBcIiwgXCIpLmNvbmNhdChzZWcucmlnaHRTRS5wb2ludC55LCBcIl0gZnJvbSBxdWV1ZS4gXCIpICsgJ1BsZWFzZSBmaWxlIGEgYnVnIHJlcG9ydC4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocXVldWUuc2l6ZSA+IFBPTFlHT05fQ0xJUFBJTkdfTUFYX1FVRVVFX1NJWkUpIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGluZmluaXRlIGxvb3AsIGFuIG90aGVyd2lzZSBjb21tb24gbWFuaWZlc3RhdGlvbiBvZiBidWdzXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3Agd2hlbiBwYXNzaW5nIHN3ZWVwIGxpbmUgb3ZlciBlbmRwb2ludHMgJyArICcocXVldWUgc2l6ZSB0b28gYmlnKS4gUGxlYXNlIGZpbGUgYSBidWcgcmVwb3J0LicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzd2VlcExpbmUuc2VnbWVudHMubGVuZ3RoID4gUE9MWUdPTl9DTElQUElOR19NQVhfU1dFRVBMSU5FX1NFR01FTlRTKSB7XG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBhbiBpbmZpbml0ZSBsb29wLCBhbiBvdGhlcndpc2UgY29tbW9uIG1hbmlmZXN0YXRpb24gb2YgYnVnc1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIHdoZW4gcGFzc2luZyBzd2VlcCBsaW5lIG92ZXIgZW5kcG9pbnRzICcgKyAnKHRvbyBtYW55IHN3ZWVwIGxpbmUgc2VnbWVudHMpLiBQbGVhc2UgZmlsZSBhIGJ1ZyByZXBvcnQuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG5ld0V2ZW50cyA9IHN3ZWVwTGluZS5wcm9jZXNzKGV2dCk7XG5cbiAgICAgICAgICBmb3IgKHZhciBfaTQgPSAwLCBfaU1heDMgPSBuZXdFdmVudHMubGVuZ3RoOyBfaTQgPCBfaU1heDM7IF9pNCsrKSB7XG4gICAgICAgICAgICB2YXIgX2V2dCA9IG5ld0V2ZW50c1tfaTRdO1xuICAgICAgICAgICAgaWYgKF9ldnQuY29uc3VtZWRCeSA9PT0gdW5kZWZpbmVkKSBxdWV1ZS5pbnNlcnQoX2V2dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcHJldlF1ZXVlU2l6ZSA9IHF1ZXVlLnNpemU7XG4gICAgICAgICAgbm9kZSA9IHF1ZXVlLnBvcCgpO1xuICAgICAgICB9IC8vIGZyZWUgc29tZSBtZW1vcnkgd2UgZG9uJ3QgbmVlZCBhbnltb3JlXG5cblxuICAgICAgICByb3VuZGVyLnJlc2V0KCk7XG4gICAgICAgIC8qIENvbGxlY3QgYW5kIGNvbXBpbGUgc2VnbWVudHMgd2UncmUga2VlcGluZyBpbnRvIGEgbXVsdGlwb2x5Z29uICovXG5cbiAgICAgICAgdmFyIHJpbmdzT3V0ID0gUmluZ091dC5mYWN0b3J5KHN3ZWVwTGluZS5zZWdtZW50cyk7XG4gICAgICAgIHZhciByZXN1bHQgPSBuZXcgTXVsdGlQb2x5T3V0KHJpbmdzT3V0KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5nZXRHZW9tKCk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE9wZXJhdGlvbjtcbiAgfSgpOyAvLyBzaW5nbGV0b24gYXZhaWxhYmxlIGJ5IGltcG9ydFxuXG4gIHZhciBvcGVyYXRpb24gPSBuZXcgT3BlcmF0aW9uKCk7XG5cbiAgdmFyIHVuaW9uID0gZnVuY3Rpb24gdW5pb24oZ2VvbSkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBtb3JlR2VvbXMgPSBuZXcgQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgbW9yZUdlb21zW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uLnJ1bigndW5pb24nLCBnZW9tLCBtb3JlR2VvbXMpO1xuICB9O1xuXG4gIHZhciBpbnRlcnNlY3Rpb24kMSA9IGZ1bmN0aW9uIGludGVyc2VjdGlvbihnZW9tKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBtb3JlR2VvbXMgPSBuZXcgQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgbW9yZUdlb21zW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiBvcGVyYXRpb24ucnVuKCdpbnRlcnNlY3Rpb24nLCBnZW9tLCBtb3JlR2VvbXMpO1xuICB9O1xuXG4gIHZhciB4b3IgPSBmdW5jdGlvbiB4b3IoZ2VvbSkge1xuICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgbW9yZUdlb21zID0gbmV3IEFycmF5KF9sZW4zID4gMSA/IF9sZW4zIC0gMSA6IDApLCBfa2V5MyA9IDE7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgIG1vcmVHZW9tc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uLnJ1bigneG9yJywgZ2VvbSwgbW9yZUdlb21zKTtcbiAgfTtcblxuICB2YXIgZGlmZmVyZW5jZSA9IGZ1bmN0aW9uIGRpZmZlcmVuY2Uoc3ViamVjdEdlb20pIHtcbiAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGNsaXBwaW5nR2VvbXMgPSBuZXcgQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgY2xpcHBpbmdHZW9tc1tfa2V5NCAtIDFdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uLnJ1bignZGlmZmVyZW5jZScsIHN1YmplY3RHZW9tLCBjbGlwcGluZ0dlb21zKTtcbiAgfTtcblxuICB2YXIgaW5kZXggPSB7XG4gICAgdW5pb246IHVuaW9uLFxuICAgIGludGVyc2VjdGlvbjogaW50ZXJzZWN0aW9uJDEsXG4gICAgeG9yOiB4b3IsXG4gICAgZGlmZmVyZW5jZTogZGlmZmVyZW5jZVxuICB9O1xuXG4gIHJldHVybiBpbmRleDtcblxufSkpKTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpbXBvcnQgeyBVSUFjdGlvblR5cGVzLCBXb3JrZXJBY3Rpb25UeXBlcywgfSBmcm9tIFwiLi4vdHlwZXNcIjtcbmltcG9ydCB7IGdldFN2Z1BhdGhGcm9tU3Ryb2tlLCBhZGRWZWN0b3JzLCBpbnRlcnBvbGF0ZUN1YmljQmV6aWVyLCBnZXRGbGF0U3ZnUGF0aEZyb21TdHJva2UsIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgZ2V0U3Ryb2tlIGZyb20gXCJwZXJmZWN0LWZyZWVoYW5kXCI7XG5pbXBvcnQgeyBjb21wcmVzc1RvVVRGMTYsIGRlY29tcHJlc3NGcm9tVVRGMTYgfSBmcm9tIFwibHotc3RyaW5nXCI7XG5jb25zdCBTUExJVCA9IDU7XG5jb25zdCBFQVNJTkdTID0ge1xuICAgIGxpbmVhcjogKHQpID0+IHQsXG4gICAgZWFzZUluOiAodCkgPT4gdCAqIHQsXG4gICAgZWFzZU91dDogKHQpID0+IHQgKiAoMiAtIHQpLFxuICAgIGVhc2VJbk91dDogKHQpID0+ICh0IDwgMC41ID8gMiAqIHQgKiB0IDogLTEgKyAoNCAtIDIgKiB0KSAqIHQpLFxufTtcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ29tbXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBwbHVnaW4gVUlcbmZ1bmN0aW9uIHBvc3RNZXNzYWdlKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pO1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gU2VsZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIERlc2VsZWN0cyBhIEZpZ21hIG5vZGVcbmZ1bmN0aW9uIGRlc2VsZWN0Tm9kZShpZCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiBub2RlLmlkICE9PSBpZCk7XG59XG4vLyBTZW5kIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgVUkgc3RhdGVcbmZ1bmN0aW9uIHNlbmRJbml0aWFsU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuRk9VTkRfU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZW5kU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG5jb25zdCBvcmlnaW5hbE5vZGVzID0ge307XG5mdW5jdGlvbiBzZXRPcmlnaW5hbE5vZGUobm9kZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgbm9kZSksIHsgY2VudGVyOiBnZXRDZW50ZXIobm9kZSksIHZlY3Rvck5ldHdvcms6IE9iamVjdC5hc3NpZ24oe30sIG5vZGUudmVjdG9yTmV0d29yayksIHZlY3RvclBhdGhzOiBub2RlLnZlY3RvclBhdGhzIH0pO1xuICAgIG9yaWdpbmFsTm9kZXNbbm9kZS5pZF0gPSBjb21wcmVzc1RvVVRGMTYoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxOb2RlKSk7XG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiLCBvcmlnaW5hbE5vZGVzW25vZGUuaWRdKTtcbiAgICByZXR1cm4gb3JpZ2luYWxOb2RlO1xufVxuZnVuY3Rpb24gZ2V0T3JpZ2luYWxOb2RlKGlkKSB7XG4gICAgaWYgKCFvcmlnaW5hbE5vZGVzW2lkXSkge1xuICAgICAgICAvLyBXZSBkb24ndCBoYXZlIHRoZSBub2RlIGluIHRoZSBsb2NhbCBjYWNoZS5cbiAgICAgICAgLy8gTWF5YmUgaXQgaGFzIGRhdGEgZnJvbSBhIHByZXZpb3VzIHNlc3Npb24/XG4gICAgICAgIGxldCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIHRocm93IEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhhdCBub2RlOiBcIiArIGlkKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwbHVnaW5EYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiKTtcbiAgICAgICAgaWYgKCFwbHVnaW5EYXRhKSB7XG4gICAgICAgICAgICAvLyBOb3RoaW5nIGxvY2FsLCBub3RoaW5nIHNhdmVkIOKAlCB3ZSd2ZSBuZXZlciBtb2RpZmllZCB0aGlzIG5vZGUuXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc3RvcmUgc2F2ZWQgcGx1Z2luIGRhdGEgdG8gdGhlIGxvY2FsIGNhY2hlLlxuICAgICAgICBvcmlnaW5hbE5vZGVzW2lkXSA9IHBsdWdpbkRhdGE7XG4gICAgfVxuICAgIC8vIERlY29tcHJlc3MgdGhlIHNhdmVkIGRhdGEgYW5kIHBhcnNlIG91dCB0aGUgb3JpZ2luYWwgbm9kZS5cbiAgICBjb25zdCBkZWNvbXByZXNzZWQgPSBkZWNvbXByZXNzRnJvbVVURjE2KG9yaWdpbmFsTm9kZXNbaWRdKTtcbiAgICBpZiAoIWRlY29tcHJlc3NlZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkZvdW5kIHNhdmVkIGRhdGEgZm9yIG9yaWdpbmFsIG5vZGUgYnV0IGNvdWxkIG5vdCBkZWNvbXByZXNzIGl0OiBcIiArXG4gICAgICAgICAgICBkZWNvbXByZXNzZWQpO1xuICAgIH1cbiAgICByZXR1cm4gSlNPTi5wYXJzZShkZWNvbXByZXNzZWQpO1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBOb2RlcyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIEdldCBhbGwgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBGaWdtYSBub2RlcywgZmlsdGVyZWRcbi8vIHdpdGggdGhlIHByb3ZpZGVkIGFycmF5IG9mIE5vZGVUeXBlcy5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkTm9kZXMoKSB7XG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBcIlZFQ1RPUlwiKS5tYXAoKHsgaWQsIG5hbWUsIHR5cGUgfSkgPT4gKHtcbiAgICAgICAgaWQsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHR5cGUsXG4gICAgfSkpO1xufVxuLy8gR2V0IGFsbCBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIEZpZ21hIG5vZGVzLCBmaWx0ZXJlZFxuLy8gd2l0aCB0aGUgcHJvdmlkZWQgYXJyYXkgb2YgTm9kZVR5cGVzLlxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWROb2RlSWRzKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKCh7IGlkIH0pID0+IGlkKTtcbn1cbmZ1bmN0aW9uIGdldENlbnRlcihub2RlKSB7XG4gICAgbGV0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gbm9kZTtcbiAgICByZXR1cm4geyB4OiB4ICsgd2lkdGggLyAyLCB5OiB5ICsgaGVpZ2h0IC8gMiB9O1xufVxuZnVuY3Rpb24gbW92ZU5vZGVUb0NlbnRlcihub2RlLCBjZW50ZXIpIHtcbiAgICBjb25zdCB7IHg6IHgwLCB5OiB5MCB9ID0gZ2V0Q2VudGVyKG5vZGUpO1xuICAgIGNvbnN0IHsgeDogeDEsIHk6IHkxIH0gPSBjZW50ZXI7XG4gICAgbm9kZS54ID0gbm9kZS54ICsgeDEgLSB4MDtcbiAgICBub2RlLnkgPSBub2RlLnkgKyB5MSAtIHkwO1xufVxuLy8gWm9vbXMgdGhlIEZpZ21hIHZpZXdwb3J0IHRvIGEgbm9kZVxuZnVuY3Rpb24gem9vbVRvTm9kZShpZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgaWYgKCFub2RlKVxuICAgICAgICByZXR1cm47XG4gICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KFtub2RlXSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLSBDaGFuZ2luZyBWZWN0b3JOb2RlcyAtLS0tLS0tLS0tLS0tLSAqL1xuLy8gQ29tcHV0ZSBhIHN0cm9rZSBiYXNlZCBvbiB0aGUgdmVjdG9yIGFuZCBhcHBseSBpdCB0byB0aGUgdmVjdG9yJ3MgcGF0aCBkYXRhLlxuZnVuY3Rpb24gYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKG5vZGVJZHMsIHsgb3B0aW9ucywgZWFzaW5nID0gXCJsaW5lYXJcIiwgY2xpcCwgfSwgcmVzdHJpY3RUb0tub3duTm9kZXMgPSBmYWxzZSkge1xuICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBub2RlIHRoYXQgd2Ugd2FudCB0byBjaGFuZ2VcbiAgICAgICAgY29uc3Qgbm9kZVRvQ2hhbmdlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIW5vZGVUb0NoYW5nZSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEdldCB0aGUgb3JpZ2luYWwgbm9kZVxuICAgICAgICBsZXQgb3JpZ2luYWxOb2RlID0gZ2V0T3JpZ2luYWxOb2RlKG5vZGVUb0NoYW5nZS5pZCk7XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgdGhpcyBub2RlLi4uXG4gICAgICAgIGlmICghb3JpZ2luYWxOb2RlKSB7XG4gICAgICAgICAgICAvLyBCYWlsIGlmIHdlJ3JlIHVwZGF0aW5nIG5vZGVzXG4gICAgICAgICAgICBpZiAocmVzdHJpY3RUb0tub3duTm9kZXMpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgb3JpZ2luYWwgbm9kZSBhbmQgY29udGludWVcbiAgICAgICAgICAgIG9yaWdpbmFsTm9kZSA9IHNldE9yaWdpbmFsTm9kZShub2RlVG9DaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEludGVycG9sYXRlIG5ldyBwb2ludHMgYWxvbmcgdGhlIHZlY3RvcidzIGN1cnZlXG4gICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnNlZ21lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwMCA9IG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuc3RhcnRdO1xuICAgICAgICAgICAgY29uc3QgcDMgPSBvcmlnaW5hbE5vZGUudmVjdG9yTmV0d29yay52ZXJ0aWNlc1tzZWdtZW50LmVuZF07XG4gICAgICAgICAgICBjb25zdCBwMSA9IGFkZFZlY3RvcnMocDAsIHNlZ21lbnQudGFuZ2VudFN0YXJ0KTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gYWRkVmVjdG9ycyhwMywgc2VnbWVudC50YW5nZW50RW5kKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRvciA9IGludGVycG9sYXRlQ3ViaWNCZXppZXIocDAsIHAxLCBwMiwgcDMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTUExJVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHRzLnB1c2goaW50ZXJwb2xhdG9yKGkgLyBTUExJVCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBzdHJva2UgdXNpbmcgcGVyZmVjdC1mcmVlaGFuZFxuICAgICAgICBjb25zdCBzdHJva2UgPSBnZXRTdHJva2UocHRzLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGVhc2luZzogRUFTSU5HU1tlYXNpbmddIH0pKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFNldCBzdHJva2UgdG8gdmVjdG9yIHBhdGhzXG4gICAgICAgICAgICBub2RlVG9DaGFuZ2UudmVjdG9yUGF0aHMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aW5kaW5nUnVsZTogXCJOT05aRVJPXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNsaXBcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBhcHBseSBzdHJva2VcIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgc28gdGhhdCBpdHMgY2VudGVyIGRvZXMgbm90IGNoYW5nZVxuICAgICAgICBtb3ZlTm9kZVRvQ2VudGVyKG5vZGVUb0NoYW5nZSwgb3JpZ2luYWxOb2RlLmNlbnRlcik7XG4gICAgfVxufVxuLy8gUmVzZXQgdGhlIG5vZGUgdG8gaXRzIG9yaWdpbmFsIHBhdGggZGF0YSwgdXNpbmcgZGF0YSBmcm9tIG91ciBjYWNoZSBhbmQgdGhlbiBkZWxldGUgdGhlIG5vZGUuXG5mdW5jdGlvbiByZXNldFZlY3Rvck5vZGVzKG5vZGVJZHMpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBub2RlSWRzKSB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IGdldE9yaWdpbmFsTm9kZShpZCk7XG4gICAgICAgIC8vIFdlIGhhdmVuJ3QgbW9kaWZpZWQgdGhpcyBub2RlLlxuICAgICAgICBpZiAoIW9yaWdpbmFsTm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnROb2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIWN1cnJlbnROb2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUudmVjdG9yUGF0aHMgPSBvcmlnaW5hbE5vZGUudmVjdG9yUGF0aHM7XG4gICAgICAgIGRlbGV0ZSBvcmlnaW5hbE5vZGVzW2lkXTtcbiAgICAgICAgY3VycmVudE5vZGUuc2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiwgXCJcIik7XG4gICAgICAgIC8vIFRPRE86IElmIGEgdXNlciBoYXMgbW92ZWQgYSBub2RlIHRoZW1zZWx2ZXMsIHRoaXMgd2lsbCBtb3ZlIGl0IGJhY2sgdG8gaXRzIG9yaWdpbmFsIHBsYWNlLlxuICAgICAgICAvLyBub2RlLnggPSBvcmlnaW5hbE5vZGUueFxuICAgICAgICAvLyBub2RlLnkgPSBvcmlnaW5hbE5vZGUueVxuICAgIH1cbn1cbi8vIC0tLSBNZXNzYWdlcyBmcm9tIHRoZSBVSSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExpc3RlbiB0byBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBwbHVnaW4gVUkgKHNyYy91aS91aS50cylcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICh7IHR5cGUsIHBheWxvYWQgfSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuQ0xPU0U6XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5aT09NX1RPX05PREU6XG4gICAgICAgICAgICB6b29tVG9Ob2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5ERVNFTEVDVF9OT0RFOlxuICAgICAgICAgICAgZGVzZWxlY3ROb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5SRVNFVF9OT0RFUzpcbiAgICAgICAgICAgIHJlc2V0VmVjdG9yTm9kZXMoZ2V0U2VsZWN0ZWROb2RlSWRzKCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5UUkFOU0ZPUk1fTk9ERVM6XG4gICAgICAgICAgICBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMoZ2V0U2VsZWN0ZWROb2RlSWRzKCksIHBheWxvYWQsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVVBEQVRFRF9PUFRJT05TOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG4vLyAtLS0gTWVzc2FnZXMgZnJvbSBGaWdtYSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTGlzdGVuIGZvciBzZWxlY3Rpb24gY2hhbmdlc1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgc2VuZFNlbGVjdGVkTm9kZXMpO1xuLy8gLS0tIEtpY2tvZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFNob3cgdGhlIHBsdWdpbiBpbnRlcmZhY2VcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMzIwLCBoZWlnaHQ6IDQyMCB9KTtcbi8vIFNlbmQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHRvIHRoZSBVSVxuc2VuZEluaXRpYWxTZWxlY3RlZE5vZGVzKCk7XG4iLCIvLyBVSSBhY3Rpb25zXG5leHBvcnQgdmFyIFVJQWN0aW9uVHlwZXM7XG4oZnVuY3Rpb24gKFVJQWN0aW9uVHlwZXMpIHtcbiAgICBVSUFjdGlvblR5cGVzW1wiQ0xPU0VcIl0gPSBcIkNMT1NFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlpPT01fVE9fTk9ERVwiXSA9IFwiWk9PTV9UT19OT0RFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIkRFU0VMRUNUX05PREVcIl0gPSBcIkRFU0VMRUNUX05PREVcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiVFJBTlNGT1JNX05PREVTXCJdID0gXCJUUkFOU0ZPUk1fTk9ERVNcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiUkVTRVRfTk9ERVNcIl0gPSBcIlJFU0VUX05PREVTXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlVQREFURURfT1BUSU9OU1wiXSA9IFwiVVBEQVRFRF9PUFRJT05TXCI7XG59KShVSUFjdGlvblR5cGVzIHx8IChVSUFjdGlvblR5cGVzID0ge30pKTtcbi8vIFdvcmtlciBhY3Rpb25zXG5leHBvcnQgdmFyIFdvcmtlckFjdGlvblR5cGVzO1xuKGZ1bmN0aW9uIChXb3JrZXJBY3Rpb25UeXBlcykge1xuICAgIFdvcmtlckFjdGlvblR5cGVzW1wiU0VMRUNURURfTk9ERVNcIl0gPSBcIlNFTEVDVEVEX05PREVTXCI7XG4gICAgV29ya2VyQWN0aW9uVHlwZXNbXCJGT1VORF9TRUxFQ1RFRF9OT0RFU1wiXSA9IFwiRk9VTkRfU0VMRUNURURfTk9ERVNcIjtcbn0pKFdvcmtlckFjdGlvblR5cGVzIHx8IChXb3JrZXJBY3Rpb25UeXBlcyA9IHt9KSk7XG4iLCJpbXBvcnQgcG9seWdvbkNsaXBwaW5nIGZyb20gXCJwb2x5Z29uLWNsaXBwaW5nXCI7XG5jb25zdCB7IHBvdyB9ID0gTWF0aDtcbmV4cG9ydCBmdW5jdGlvbiBjdWJpY0Jlemllcih0eCwgeDEsIHkxLCB4MiwgeTIpIHtcbiAgICAvLyBJbnNwaXJlZCBieSBEb24gTGFuY2FzdGVyJ3MgdHdvIGFydGljbGVzXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL2dsaWIvY3ViZW1hdGgucGRmXG4gICAgLy8gaHR0cDovL3d3dy50aW5hamEuY29tL3RleHQvYmV6bWF0aC5odG1sXG4gICAgLy8gU2V0IHAwIGFuZCBwMSBwb2ludFxuICAgIGxldCB4MCA9IDAsIHkwID0gMCwgeDMgPSAxLCB5MyA9IDEsIFxuICAgIC8vIENvbnZlcnQgdGhlIGNvb3JkaW5hdGVzIHRvIGVxdWF0aW9uIHNwYWNlXG4gICAgQSA9IHgzIC0gMyAqIHgyICsgMyAqIHgxIC0geDAsIEIgPSAzICogeDIgLSA2ICogeDEgKyAzICogeDAsIEMgPSAzICogeDEgLSAzICogeDAsIEQgPSB4MCwgRSA9IHkzIC0gMyAqIHkyICsgMyAqIHkxIC0geTAsIEYgPSAzICogeTIgLSA2ICogeTEgKyAzICogeTAsIEcgPSAzICogeTEgLSAzICogeTAsIEggPSB5MCwgXG4gICAgLy8gVmFyaWFibGVzIGZvciB0aGUgbG9vcCBiZWxvd1xuICAgIHQgPSB0eCwgaXRlcmF0aW9ucyA9IDUsIGksIHNsb3BlLCB4LCB5O1xuICAgIC8vIExvb3AgdGhyb3VnaCBhIGZldyB0aW1lcyB0byBnZXQgYSBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWUsIGFjY29yZGluZyB0byB0aGUgTmV3dG9uLVJhcGhzb24gbWV0aG9kXG4gICAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9OZXd0b24nc19tZXRob2RcbiAgICBmb3IgKGkgPSAwOyBpIDwgaXRlcmF0aW9uczsgaSsrKSB7XG4gICAgICAgIC8vIFRoZSBjdXJ2ZSdzIHggZXF1YXRpb24gZm9yIHRoZSBjdXJyZW50IHRpbWUgdmFsdWVcbiAgICAgICAgeCA9IEEgKiB0ICogdCAqIHQgKyBCICogdCAqIHQgKyBDICogdCArIEQ7XG4gICAgICAgIC8vIFRoZSBzbG9wZSB3ZSB3YW50IGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBkZXJpdmF0ZSBvZiB4XG4gICAgICAgIHNsb3BlID0gMSAvICgzICogQSAqIHQgKiB0ICsgMiAqIEIgKiB0ICsgQyk7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBlc3RpbWF0ZWQgdGltZSB2YWx1ZSwgd2hpY2ggd2lsbCBiZSBtb3JlIGFjY3VyYXRlIHRoYW4gdGhlIG9uZSBiZWZvcmVcbiAgICAgICAgdCAtPSAoeCAtIHR4KSAqIHNsb3BlO1xuICAgICAgICB0ID0gdCA+IDEgPyAxIDogdCA8IDAgPyAwIDogdDtcbiAgICB9XG4gICAgLy8gRmluZCB0aGUgeSB2YWx1ZSB0aHJvdWdoIHRoZSBjdXJ2ZSdzIHkgZXF1YXRpb24sIHdpdGggdGhlIG5vdyBtb3JlIGFjY3VyYXRlIHRpbWUgdmFsdWVcbiAgICB5ID0gTWF0aC5hYnMoRSAqIHQgKiB0ICogdCArIEYgKiB0ICogdCArIEcgKiB0ICogSCk7XG4gICAgcmV0dXJuIHk7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9pbnRzQWxvbmdDdWJpY0JlemllcihwdENvdW50LCBweFRvbGVyYW5jZSwgQXgsIEF5LCBCeCwgQnksIEN4LCBDeSwgRHgsIER5KSB7XG4gICAgbGV0IGRlbHRhQkF4ID0gQnggLSBBeDtcbiAgICBsZXQgZGVsdGFDQnggPSBDeCAtIEJ4O1xuICAgIGxldCBkZWx0YURDeCA9IER4IC0gQ3g7XG4gICAgbGV0IGRlbHRhQkF5ID0gQnkgLSBBeTtcbiAgICBsZXQgZGVsdGFDQnkgPSBDeSAtIEJ5O1xuICAgIGxldCBkZWx0YURDeSA9IER5IC0gQ3k7XG4gICAgbGV0IGF4LCBheSwgYngsIGJ5LCBjeCwgY3k7XG4gICAgbGV0IGxhc3RYID0gLTEwMDAwO1xuICAgIGxldCBsYXN0WSA9IC0xMDAwMDtcbiAgICBsZXQgcHRzID0gW3sgeDogQXgsIHk6IEF5IH1dO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcHRDb3VudDsgaSsrKSB7XG4gICAgICAgIGxldCB0ID0gaSAvIHB0Q291bnQ7XG4gICAgICAgIGF4ID0gQXggKyBkZWx0YUJBeCAqIHQ7XG4gICAgICAgIGJ4ID0gQnggKyBkZWx0YUNCeCAqIHQ7XG4gICAgICAgIGN4ID0gQ3ggKyBkZWx0YURDeCAqIHQ7XG4gICAgICAgIGF4ICs9IChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGJ4ICs9IChjeCAtIGJ4KSAqIHQ7XG4gICAgICAgIGF5ID0gQXkgKyBkZWx0YUJBeSAqIHQ7XG4gICAgICAgIGJ5ID0gQnkgKyBkZWx0YUNCeSAqIHQ7XG4gICAgICAgIGN5ID0gQ3kgKyBkZWx0YURDeSAqIHQ7XG4gICAgICAgIGF5ICs9IChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGJ5ICs9IChjeSAtIGJ5KSAqIHQ7XG4gICAgICAgIGNvbnN0IHggPSBheCArIChieCAtIGF4KSAqIHQ7XG4gICAgICAgIGNvbnN0IHkgPSBheSArIChieSAtIGF5KSAqIHQ7XG4gICAgICAgIGNvbnN0IGR4ID0geCAtIGxhc3RYO1xuICAgICAgICBjb25zdCBkeSA9IHkgLSBsYXN0WTtcbiAgICAgICAgaWYgKGR4ICogZHggKyBkeSAqIGR5ID4gcHhUb2xlcmFuY2UpIHtcbiAgICAgICAgICAgIHB0cy5wdXNoKHsgeDogeCwgeTogeSB9KTtcbiAgICAgICAgICAgIGxhc3RYID0geDtcbiAgICAgICAgICAgIGxhc3RZID0geTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBwdHMucHVzaCh7IHg6IER4LCB5OiBEeSB9KTtcbiAgICByZXR1cm4gcHRzO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGludGVycG9sYXRlQ3ViaWNCZXppZXIocDAsIGMwLCBjMSwgcDEpIHtcbiAgICAvLyAwIDw9IHQgPD0gMVxuICAgIHJldHVybiBmdW5jdGlvbiBpbnRlcnBvbGF0b3IodCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnggK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnggK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueCArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueCxcbiAgICAgICAgICAgIHBvdygxIC0gdCwgMykgKiBwMC55ICtcbiAgICAgICAgICAgICAgICAzICogcG93KDEgLSB0LCAyKSAqIHQgKiBjMC55ICtcbiAgICAgICAgICAgICAgICAzICogKDEgLSB0KSAqIHBvdyh0LCAyKSAqIGMxLnkgK1xuICAgICAgICAgICAgICAgIHBvdyh0LCAzKSAqIHAxLnksXG4gICAgICAgIF07XG4gICAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRWZWN0b3JzKGEsIGIpIHtcbiAgICBpZiAoIWIpXG4gICAgICAgIHJldHVybiBhO1xuICAgIHJldHVybiB7IHg6IGEueCArIGIueCwgeTogYS55ICsgYi55IH07XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSB7XG4gICAgaWYgKHN0cm9rZS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIGNvbnN0IGQgPSBbXTtcbiAgICBsZXQgW3AwLCBwMV0gPSBzdHJva2U7XG4gICAgZC5wdXNoKFwiTVwiLCBwMFswXSwgcDBbMV0pO1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgc3Ryb2tlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGQucHVzaChcIlFcIiwgcDBbMF0sIHAwWzFdLCAocDBbMF0gKyBwMVswXSkgLyAyLCAocDBbMV0gKyBwMVsxXSkgLyAyKTtcbiAgICAgICAgcDAgPSBwMTtcbiAgICAgICAgcDEgPSBzdHJva2VbaV07XG4gICAgfVxuICAgIGQucHVzaChcIlpcIik7XG4gICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSkge1xuICAgIGNvbnN0IHBvbHkgPSBwb2x5Z29uQ2xpcHBpbmcudW5pb24oW3N0cm9rZV0pO1xuICAgIGNvbnN0IGQgPSBbXTtcbiAgICBmb3IgKGxldCBmYWNlIG9mIHBvbHkpIHtcbiAgICAgICAgZm9yIChsZXQgcG9pbnRzIG9mIGZhY2UpIHtcbiAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSk7XG4gICAgICAgICAgICBkLnB1c2goZ2V0U3ZnUGF0aEZyb21TdHJva2UocG9pbnRzKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9