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
// Get an original node from a node's plugin data.
function getOriginalNode(id) {
    let node = figma.getNodeById(id);
    if (!node)
        throw Error("Could not find that node: " + id);
    const pluginData = node.getPluginData("perfect_freehand");
    // Nothing on the node — we haven't modified it.
    if (!pluginData)
        return undefined;
    // Decompress the saved data and parse out the original node.
    const decompressed = Object(lz_string__WEBPACK_IMPORTED_MODULE_3__["decompressFromUTF16"])(pluginData);
    if (!decompressed) {
        throw Error("Found saved data for original node but could not decompress it: " +
            decompressed);
    }
    return JSON.parse(decompressed);
}
/* ---------------------- Nodes --------------------- */
// Get the currently selected Vector nodes for the UI.
function getSelectedNodes() {
    return figma.currentPage.selection.filter(({ type }) => type === "VECTOR").map((node) => ({
        id: node.id,
        name: node.name,
        type: node.type,
        canReset: !!node.getPluginData("perfect_freehand"),
    }));
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
    sendSelectedNodes();
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
        // TODO: If a user has moved a node themselves, this will move it back to its original place.
        // node.x = originalNode.x
        // node.y = originalNode.y
        sendSelectedNodes();
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
    try {
        const poly = polygon_clipping__WEBPACK_IMPORTED_MODULE_0___default.a.union([stroke]);
        const d = [];
        for (let face of poly) {
            for (let points of face) {
                points.push(points[0]);
                d.push(getSvgPathFromStroke(points));
            }
        }
        d.push("Z");
        return d.join(" ");
    }
    catch (e) {
        console.error("Could not clip path.");
        return getSvgPathFromStroke(stroke);
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wb2x5Z29uLWNsaXBwaW5nL2Rpc3QvcG9seWdvbi1jbGlwcGluZy51bWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7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Q0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixtQ0FBbUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDOztBQUV4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSxrQkFBa0I7O0FBRWxCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtB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QUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxnREFBZ0QsVUFBVTtBQUMxRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGFBQWE7QUFDbkU7O0FBRUEsMkRBQTJELFVBQVU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUEscURBQXFELGNBQWM7QUFDbkU7O0FBRUEsc0RBQXNELFlBQVk7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0RBQXNELGNBQWM7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUcsR0FBRzs7QUFFTjs7QUFFQTtBQUNBLCtGQUErRixhQUFhO0FBQzVHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVHQUF1RyxlQUFlO0FBQ3RIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzUvRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Iiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi9pbmRleC50c1wiKTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxMyBQaWVyb3h5IDxwaWVyb3h5QHBpZXJveHkubmV0PlxuLy8gVGhpcyB3b3JrIGlzIGZyZWUuIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXRcbi8vIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgV1RGUEwsIFZlcnNpb24gMlxuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24gc2VlIExJQ0VOU0UudHh0IG9yIGh0dHA6Ly93d3cud3RmcGwubmV0L1xuLy9cbi8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCB0aGUgaG9tZSBwYWdlOlxuLy8gaHR0cDovL3BpZXJveHkubmV0L2Jsb2cvcGFnZXMvbHotc3RyaW5nL3Rlc3RpbmcuaHRtbFxuLy9cbi8vIExaLWJhc2VkIGNvbXByZXNzaW9uIGFsZ29yaXRobSwgdmVyc2lvbiAxLjQuNFxudmFyIExaU3RyaW5nID0gKGZ1bmN0aW9uKCkge1xuXG4vLyBwcml2YXRlIHByb3BlcnR5XG52YXIgZiA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG52YXIga2V5U3RyQmFzZTY0ID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvPVwiO1xudmFyIGtleVN0clVyaVNhZmUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky0kXCI7XG52YXIgYmFzZVJldmVyc2VEaWMgPSB7fTtcblxuZnVuY3Rpb24gZ2V0QmFzZVZhbHVlKGFscGhhYmV0LCBjaGFyYWN0ZXIpIHtcbiAgaWYgKCFiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0pIHtcbiAgICBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF0gPSB7fTtcbiAgICBmb3IgKHZhciBpPTAgOyBpPGFscGhhYmV0Lmxlbmd0aCA7IGkrKykge1xuICAgICAgYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2FscGhhYmV0LmNoYXJBdChpKV0gPSBpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYmFzZVJldmVyc2VEaWNbYWxwaGFiZXRdW2NoYXJhY3Rlcl07XG59XG5cbnZhciBMWlN0cmluZyA9IHtcbiAgY29tcHJlc3NUb0Jhc2U2NCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICB2YXIgcmVzID0gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCA2LCBmdW5jdGlvbihhKXtyZXR1cm4ga2V5U3RyQmFzZTY0LmNoYXJBdChhKTt9KTtcbiAgICBzd2l0Y2ggKHJlcy5sZW5ndGggJSA0KSB7IC8vIFRvIHByb2R1Y2UgdmFsaWQgQmFzZTY0XG4gICAgZGVmYXVsdDogLy8gV2hlbiBjb3VsZCB0aGlzIGhhcHBlbiA/XG4gICAgY2FzZSAwIDogcmV0dXJuIHJlcztcbiAgICBjYXNlIDEgOiByZXR1cm4gcmVzK1wiPT09XCI7XG4gICAgY2FzZSAyIDogcmV0dXJuIHJlcytcIj09XCI7XG4gICAgY2FzZSAzIDogcmV0dXJuIHJlcytcIj1cIjtcbiAgICB9XG4gIH0sXG5cbiAgZGVjb21wcmVzc0Zyb21CYXNlNjQgOiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGlucHV0ID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhpbnB1dC5sZW5ndGgsIDMyLCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gZ2V0QmFzZVZhbHVlKGtleVN0ckJhc2U2NCwgaW5wdXQuY2hhckF0KGluZGV4KSk7IH0pO1xuICB9LFxuXG4gIGNvbXByZXNzVG9VVEYxNiA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKGlucHV0LCAxNSwgZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSszMik7fSkgKyBcIiBcIjtcbiAgfSxcblxuICBkZWNvbXByZXNzRnJvbVVURjE2OiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMTYzODQsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpIC0gMzI7IH0pO1xuICB9LFxuXG4gIC8vY29tcHJlc3MgaW50byB1aW50OGFycmF5IChVQ1MtMiBiaWcgZW5kaWFuIGZvcm1hdClcbiAgY29tcHJlc3NUb1VpbnQ4QXJyYXk6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICB2YXIgY29tcHJlc3NlZCA9IExaU3RyaW5nLmNvbXByZXNzKHVuY29tcHJlc3NlZCk7XG4gICAgdmFyIGJ1Zj1uZXcgVWludDhBcnJheShjb21wcmVzc2VkLmxlbmd0aCoyKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyXG5cbiAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWNvbXByZXNzZWQubGVuZ3RoOyBpPFRvdGFsTGVuOyBpKyspIHtcbiAgICAgIHZhciBjdXJyZW50X3ZhbHVlID0gY29tcHJlc3NlZC5jaGFyQ29kZUF0KGkpO1xuICAgICAgYnVmW2kqMl0gPSBjdXJyZW50X3ZhbHVlID4+PiA4O1xuICAgICAgYnVmW2kqMisxXSA9IGN1cnJlbnRfdmFsdWUgJSAyNTY7XG4gICAgfVxuICAgIHJldHVybiBidWY7XG4gIH0sXG5cbiAgLy9kZWNvbXByZXNzIGZyb20gdWludDhhcnJheSAoVUNTLTIgYmlnIGVuZGlhbiBmb3JtYXQpXG4gIGRlY29tcHJlc3NGcm9tVWludDhBcnJheTpmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkPT09bnVsbCB8fCBjb21wcmVzc2VkPT09dW5kZWZpbmVkKXtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MoY29tcHJlc3NlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGJ1Zj1uZXcgQXJyYXkoY29tcHJlc3NlZC5sZW5ndGgvMik7IC8vIDIgYnl0ZXMgcGVyIGNoYXJhY3RlclxuICAgICAgICBmb3IgKHZhciBpPTAsIFRvdGFsTGVuPWJ1Zi5sZW5ndGg7IGk8VG90YWxMZW47IGkrKykge1xuICAgICAgICAgIGJ1ZltpXT1jb21wcmVzc2VkW2kqMl0qMjU2K2NvbXByZXNzZWRbaSoyKzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICBidWYuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKGYoYykpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIExaU3RyaW5nLmRlY29tcHJlc3MocmVzdWx0LmpvaW4oJycpKTtcblxuICAgIH1cblxuICB9LFxuXG5cbiAgLy9jb21wcmVzcyBpbnRvIGEgc3RyaW5nIHRoYXQgaXMgYWxyZWFkeSBVUkkgZW5jb2RlZFxuICBjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDYsIGZ1bmN0aW9uKGEpe3JldHVybiBrZXlTdHJVcmlTYWZlLmNoYXJBdChhKTt9KTtcbiAgfSxcblxuICAvL2RlY29tcHJlc3MgZnJvbSBhbiBvdXRwdXQgb2YgY29tcHJlc3NUb0VuY29kZWRVUklDb21wb25lbnRcbiAgZGVjb21wcmVzc0Zyb21FbmNvZGVkVVJJQ29tcG9uZW50OmZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoaW5wdXQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgaW5wdXQgPSBpbnB1dC5yZXBsYWNlKC8gL2csIFwiK1wiKTtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2RlY29tcHJlc3MoaW5wdXQubGVuZ3RoLCAzMiwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGdldEJhc2VWYWx1ZShrZXlTdHJVcmlTYWZlLCBpbnB1dC5jaGFyQXQoaW5kZXgpKTsgfSk7XG4gIH0sXG5cbiAgY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQpIHtcbiAgICByZXR1cm4gTFpTdHJpbmcuX2NvbXByZXNzKHVuY29tcHJlc3NlZCwgMTYsIGZ1bmN0aW9uKGEpe3JldHVybiBmKGEpO30pO1xuICB9LFxuICBfY29tcHJlc3M6IGZ1bmN0aW9uICh1bmNvbXByZXNzZWQsIGJpdHNQZXJDaGFyLCBnZXRDaGFyRnJvbUludCkge1xuICAgIGlmICh1bmNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIGksIHZhbHVlLFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnk9IHt9LFxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZT0ge30sXG4gICAgICAgIGNvbnRleHRfYz1cIlwiLFxuICAgICAgICBjb250ZXh0X3djPVwiXCIsXG4gICAgICAgIGNvbnRleHRfdz1cIlwiLFxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbj0gMiwgLy8gQ29tcGVuc2F0ZSBmb3IgdGhlIGZpcnN0IGVudHJ5IHdoaWNoIHNob3VsZCBub3QgY291bnRcbiAgICAgICAgY29udGV4dF9kaWN0U2l6ZT0gMyxcbiAgICAgICAgY29udGV4dF9udW1CaXRzPSAyLFxuICAgICAgICBjb250ZXh0X2RhdGE9W10sXG4gICAgICAgIGNvbnRleHRfZGF0YV92YWw9MCxcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uPTAsXG4gICAgICAgIGlpO1xuXG4gICAgZm9yIChpaSA9IDA7IGlpIDwgdW5jb21wcmVzc2VkLmxlbmd0aDsgaWkgKz0gMSkge1xuICAgICAgY29udGV4dF9jID0gdW5jb21wcmVzc2VkLmNoYXJBdChpaSk7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnksY29udGV4dF9jKSkge1xuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF9jXSA9IGNvbnRleHRfZGljdFNpemUrKztcbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF9jXSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHRfd2MgPSBjb250ZXh0X3cgKyBjb250ZXh0X2M7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeSxjb250ZXh0X3djKSkge1xuICAgICAgICBjb250ZXh0X3cgPSBjb250ZXh0X3djO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgICAgaWYgKGNvbnRleHRfdy5jaGFyQ29kZUF0KDApPDI1Nikge1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPDggOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT1iaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSBjb250ZXh0X3cuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRlbGV0ZSBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X3ddO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd107XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG5cblxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluLS07XG4gICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICAgIGNvbnRleHRfbnVtQml0cysrO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCB3YyB0byB0aGUgZGljdGlvbmFyeS5cbiAgICAgICAgY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd2NdID0gY29udGV4dF9kaWN0U2l6ZSsrO1xuICAgICAgICBjb250ZXh0X3cgPSBTdHJpbmcoY29udGV4dF9jKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBPdXRwdXQgdGhlIGNvZGUgZm9yIHcuXG4gICAgaWYgKGNvbnRleHRfdyAhPT0gXCJcIikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZSxjb250ZXh0X3cpKSB7XG4gICAgICAgIGlmIChjb250ZXh0X3cuY2hhckNvZGVBdCgwKTwyNTYpIHtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTw4IDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgdmFsdWU7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgIGZvciAoaT0wIDsgaTwxNiA7IGkrKykge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfd107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X3ddO1xuICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICB9XG5cblxuICAgICAgfVxuICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTWFyayB0aGUgZW5kIG9mIHRoZSBzdHJlYW1cbiAgICB2YWx1ZSA9IDI7XG4gICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpIHwgKHZhbHVlJjEpO1xuICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICB9XG5cbiAgICAvLyBGbHVzaCB0aGUgbGFzdCBjaGFyXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgZWxzZSBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRleHRfZGF0YS5qb2luKCcnKTtcbiAgfSxcblxuICBkZWNvbXByZXNzOiBmdW5jdGlvbiAoY29tcHJlc3NlZCkge1xuICAgIGlmIChjb21wcmVzc2VkID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChjb21wcmVzc2VkID09IFwiXCIpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhjb21wcmVzc2VkLmxlbmd0aCwgMzI3NjgsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaW5kZXgpOyB9KTtcbiAgfSxcblxuICBfZGVjb21wcmVzczogZnVuY3Rpb24gKGxlbmd0aCwgcmVzZXRWYWx1ZSwgZ2V0TmV4dFZhbHVlKSB7XG4gICAgdmFyIGRpY3Rpb25hcnkgPSBbXSxcbiAgICAgICAgbmV4dCxcbiAgICAgICAgZW5sYXJnZUluID0gNCxcbiAgICAgICAgZGljdFNpemUgPSA0LFxuICAgICAgICBudW1CaXRzID0gMyxcbiAgICAgICAgZW50cnkgPSBcIlwiLFxuICAgICAgICByZXN1bHQgPSBbXSxcbiAgICAgICAgaSxcbiAgICAgICAgdyxcbiAgICAgICAgYml0cywgcmVzYiwgbWF4cG93ZXIsIHBvd2VyLFxuICAgICAgICBjLFxuICAgICAgICBkYXRhID0ge3ZhbDpnZXROZXh0VmFsdWUoMCksIHBvc2l0aW9uOnJlc2V0VmFsdWUsIGluZGV4OjF9O1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDM7IGkgKz0gMSkge1xuICAgICAgZGljdGlvbmFyeVtpXSA9IGk7XG4gICAgfVxuXG4gICAgYml0cyA9IDA7XG4gICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDIpO1xuICAgIHBvd2VyPTE7XG4gICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgfVxuICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICBwb3dlciA8PD0gMTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5leHQgPSBiaXRzKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDgpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIGMgPSBmKGJpdHMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGRpY3Rpb25hcnlbM10gPSBjO1xuICAgIHcgPSBjO1xuICAgIHJlc3VsdC5wdXNoKGMpO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpZiAoZGF0YS5pbmRleCA+IGxlbmd0aCkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIH1cblxuICAgICAgYml0cyA9IDA7XG4gICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsbnVtQml0cyk7XG4gICAgICBwb3dlcj0xO1xuICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgfVxuICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAoYyA9IGJpdHMpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiw4KTtcbiAgICAgICAgICBwb3dlcj0xO1xuICAgICAgICAgIHdoaWxlIChwb3dlciE9bWF4cG93ZXIpIHtcbiAgICAgICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgICAgICBkYXRhLnBvc2l0aW9uID4+PSAxO1xuICAgICAgICAgICAgaWYgKGRhdGEucG9zaXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICAgICAgZGF0YS52YWwgPSBnZXROZXh0VmFsdWUoZGF0YS5pbmRleCsrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICAgICAgcG93ZXIgPDw9IDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMTYpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGljdGlvbmFyeVtkaWN0U2l6ZSsrXSA9IGYoYml0cyk7XG4gICAgICAgICAgYyA9IGRpY3RTaXplLTE7XG4gICAgICAgICAgZW5sYXJnZUluLS07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgICAgfVxuXG4gICAgICBpZiAoZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgZW5sYXJnZUluID0gTWF0aC5wb3coMiwgbnVtQml0cyk7XG4gICAgICAgIG51bUJpdHMrKztcbiAgICAgIH1cblxuICAgICAgaWYgKGRpY3Rpb25hcnlbY10pIHtcbiAgICAgICAgZW50cnkgPSBkaWN0aW9uYXJ5W2NdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGMgPT09IGRpY3RTaXplKSB7XG4gICAgICAgICAgZW50cnkgPSB3ICsgdy5jaGFyQXQoMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKGVudHJ5KTtcblxuICAgICAgLy8gQWRkIHcrZW50cnlbMF0gdG8gdGhlIGRpY3Rpb25hcnkuXG4gICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gdyArIGVudHJ5LmNoYXJBdCgwKTtcbiAgICAgIGVubGFyZ2VJbi0tO1xuXG4gICAgICB3ID0gZW50cnk7XG5cbiAgICAgIGlmIChlbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBlbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBudW1CaXRzKTtcbiAgICAgICAgbnVtQml0cysrO1xuICAgICAgfVxuXG4gICAgfVxuICB9XG59O1xuICByZXR1cm4gTFpTdHJpbmc7XG59KSgpO1xuXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gIGRlZmluZShmdW5jdGlvbiAoKSB7IHJldHVybiBMWlN0cmluZzsgfSk7XG59IGVsc2UgaWYoIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZSAhPSBudWxsICkge1xuICBtb2R1bGUuZXhwb3J0cyA9IExaU3RyaW5nXG59XG4iLCJ2YXIgaHlwb3QgPSBNYXRoLmh5cG90LFxuICAgIGNvcyA9IE1hdGguY29zLFxuICAgIG1heCA9IE1hdGgubWF4LFxuICAgIG1pbiA9IE1hdGgubWluLFxuICAgIHNpbiA9IE1hdGguc2luLFxuICAgIGF0YW4yID0gTWF0aC5hdGFuMixcbiAgICBQSSA9IE1hdGguUEksXG4gICAgUEkyID0gUEkgKiAyO1xuZnVuY3Rpb24gbGVycCh5MSwgeTIsIG11KSB7XG4gIHJldHVybiB5MSAqICgxIC0gbXUpICsgeTIgKiBtdTtcbn1cbmZ1bmN0aW9uIHByb2plY3RQb2ludChwMCwgYSwgZCkge1xuICByZXR1cm4gW2NvcyhhKSAqIGQgKyBwMFswXSwgc2luKGEpICogZCArIHAwWzFdXTtcbn1cblxuZnVuY3Rpb24gc2hvcnRBbmdsZURpc3QoYTAsIGExKSB7XG4gIHZhciBtYXggPSBQSTI7XG4gIHZhciBkYSA9IChhMSAtIGEwKSAlIG1heDtcbiAgcmV0dXJuIDIgKiBkYSAlIG1heCAtIGRhO1xufVxuXG5mdW5jdGlvbiBnZXRBbmdsZURlbHRhKGEwLCBhMSkge1xuICByZXR1cm4gc2hvcnRBbmdsZURpc3QoYTAsIGExKTtcbn1cbmZ1bmN0aW9uIGxlcnBBbmdsZXMoYTAsIGExLCB0KSB7XG4gIHJldHVybiBhMCArIHNob3J0QW5nbGVEaXN0KGEwLCBhMSkgKiB0O1xufVxuZnVuY3Rpb24gZ2V0UG9pbnRCZXR3ZWVuKHAwLCBwMSwgZCkge1xuICBpZiAoZCA9PT0gdm9pZCAwKSB7XG4gICAgZCA9IDAuNTtcbiAgfVxuXG4gIHJldHVybiBbcDBbMF0gKyAocDFbMF0gLSBwMFswXSkgKiBkLCBwMFsxXSArIChwMVsxXSAtIHAwWzFdKSAqIGRdO1xufVxuZnVuY3Rpb24gZ2V0QW5nbGUocDAsIHAxKSB7XG4gIHJldHVybiBhdGFuMihwMVsxXSAtIHAwWzFdLCBwMVswXSAtIHAwWzBdKTtcbn1cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAwLCBwMSkge1xuICByZXR1cm4gaHlwb3QocDFbMV0gLSBwMFsxXSwgcDFbMF0gLSBwMFswXSk7XG59XG5mdW5jdGlvbiBjbGFtcChuLCBhLCBiKSB7XG4gIHJldHVybiBtYXgoYSwgbWluKGIsIG4pKTtcbn1cbmZ1bmN0aW9uIHRvUG9pbnRzQXJyYXkocG9pbnRzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpIHtcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHggPSBfcmVmWzBdLFxuICAgICAgICAgIHkgPSBfcmVmWzFdLFxuICAgICAgICAgIF9yZWYkID0gX3JlZlsyXSxcbiAgICAgICAgICBwcmVzc3VyZSA9IF9yZWYkID09PSB2b2lkIDAgPyAwLjUgOiBfcmVmJDtcbiAgICAgIHJldHVybiBbeCwgeSwgcHJlc3N1cmVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHggPSBfcmVmMi54LFxuICAgICAgICAgIHkgPSBfcmVmMi55LFxuICAgICAgICAgIF9yZWYyJHByZXNzdXJlID0gX3JlZjIucHJlc3N1cmUsXG4gICAgICAgICAgcHJlc3N1cmUgPSBfcmVmMiRwcmVzc3VyZSA9PT0gdm9pZCAwID8gMC41IDogX3JlZjIkcHJlc3N1cmU7XG4gICAgICByZXR1cm4gW3gsIHksIHByZXNzdXJlXTtcbiAgICB9KTtcbiAgfVxufVxuXG52YXIgYWJzID0gTWF0aC5hYnMsXG4gICAgbWluJDEgPSBNYXRoLm1pbixcbiAgICBQSSQxID0gTWF0aC5QSSxcbiAgICBUQVUgPSBQSSQxIC8gMixcbiAgICBTSEFSUCA9IFRBVSxcbiAgICBEVUxMID0gU0hBUlAgLyAyO1xuXG5mdW5jdGlvbiBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcHJlc3N1cmUpIHtcbiAgaWYgKHByZXNzdXJlID09PSB2b2lkIDApIHtcbiAgICBwcmVzc3VyZSA9IDAuNTtcbiAgfVxuXG4gIGlmICh0aGlubmluZyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gc2l6ZSAvIDI7XG4gIHByZXNzdXJlID0gY2xhbXAoZWFzaW5nKHByZXNzdXJlKSwgMCwgMSk7XG4gIHJldHVybiAodGhpbm5pbmcgPCAwID8gbGVycChzaXplLCBzaXplICsgc2l6ZSAqIGNsYW1wKHRoaW5uaW5nLCAtMC45NSwgLTAuMDUpLCBwcmVzc3VyZSkgOiBsZXJwKHNpemUgLSBzaXplICogY2xhbXAodGhpbm5pbmcsIDAuMDUsIDAuOTUpLCBzaXplLCBwcmVzc3VyZSkpIC8gMjtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBwb2ludHMgZm9yIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gc3RyZWFtbGluZSBIb3cgbXVjaCB0byBzdHJlYW1saW5lIHRoZSBzdHJva2UuXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFN0cm9rZVBvaW50cyhwb2ludHMsIHN0cmVhbWxpbmUpIHtcbiAgaWYgKHN0cmVhbWxpbmUgPT09IHZvaWQgMCkge1xuICAgIHN0cmVhbWxpbmUgPSAwLjU7XG4gIH1cblxuICB2YXIgcHRzID0gdG9Qb2ludHNBcnJheShwb2ludHMpO1xuICBpZiAocHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICBwdHNbMF0gPSBbcHRzWzBdWzBdLCBwdHNbMF1bMV0sIHB0c1swXVsyXSB8fCAwLjUsIDAsIDAsIDBdO1xuXG4gIGZvciAodmFyIGkgPSAxLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzWzBdOyBpIDwgcHRzLmxlbmd0aDsgaSsrLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzW2kgLSAxXSkge1xuICAgIGN1cnJbMF0gPSBsZXJwKHByZXZbMF0sIGN1cnJbMF0sIDEgLSBzdHJlYW1saW5lKTtcbiAgICBjdXJyWzFdID0gbGVycChwcmV2WzFdLCBjdXJyWzFdLCAxIC0gc3RyZWFtbGluZSk7XG4gICAgY3VyclszXSA9IGdldEFuZ2xlKGN1cnIsIHByZXYpO1xuICAgIGN1cnJbNF0gPSBnZXREaXN0YW5jZShjdXJyLCBwcmV2KTtcbiAgICBjdXJyWzVdID0gcHJldls1XSArIGN1cnJbNF07XG4gIH1cblxuICByZXR1cm4gcHRzO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZU91dGxpbmVQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBhbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeV1gKSByZXByZXNlbnRpbmcgdGhlIG91dGxpbmUgb2YgYSBzdHJva2UuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIChvcHRpb25hbCkgb2JqZWN0IHdpdGggb3B0aW9ucy5cclxuICogQHBhcmFtIG9wdGlvbnMuc2l6ZVx0VGhlIGJhc2Ugc2l6ZSAoZGlhbWV0ZXIpIG9mIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRoaW5uaW5nIFRoZSBlZmZlY3Qgb2YgcHJlc3N1cmUgb24gdGhlIHN0cm9rZSdzIHNpemUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNtb290aGluZ1x0SG93IG11Y2ggdG8gc29mdGVuIHRoZSBzdHJva2UncyBlZGdlcy5cclxuICogQHBhcmFtIG9wdGlvbnMuZWFzaW5nXHRBbiBlYXNpbmcgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBwb2ludCdzIHByZXNzdXJlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHNpemUgPSBfb3B0aW9ucy5zaXplLFxuICAgICAgc2l6ZSA9IF9vcHRpb25zJHNpemUgPT09IHZvaWQgMCA/IDggOiBfb3B0aW9ucyRzaXplLFxuICAgICAgX29wdGlvbnMkdGhpbm5pbmcgPSBfb3B0aW9ucy50aGlubmluZyxcbiAgICAgIHRoaW5uaW5nID0gX29wdGlvbnMkdGhpbm5pbmcgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHRoaW5uaW5nLFxuICAgICAgX29wdGlvbnMkc21vb3RoaW5nID0gX29wdGlvbnMuc21vb3RoaW5nLFxuICAgICAgc21vb3RoaW5nID0gX29wdGlvbnMkc21vb3RoaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyRzbW9vdGhpbmcsXG4gICAgICBfb3B0aW9ucyRzaW11bGF0ZVByZXMgPSBfb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlLFxuICAgICAgc2ltdWxhdGVQcmVzc3VyZSA9IF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNpbXVsYXRlUHJlcyxcbiAgICAgIF9vcHRpb25zJGVhc2luZyA9IF9vcHRpb25zLmVhc2luZyxcbiAgICAgIGVhc2luZyA9IF9vcHRpb25zJGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdDtcbiAgfSA6IF9vcHRpb25zJGVhc2luZztcbiAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGgsXG4gICAgICB0b3RhbExlbmd0aCA9IHBvaW50c1tsZW4gLSAxXVs1XSxcbiAgICAgIC8vIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGxpbmVcbiAgbWluRGlzdCA9IHNpemUgKiBzbW9vdGhpbmcsXG4gICAgICAvLyBUaGUgbWluaW11bSBkaXN0YW5jZSBmb3IgbWVhc3VyZW1lbnRzXG4gIGxlZnRQdHMgPSBbXSxcbiAgICAgIC8vIE91ciBjb2xsZWN0ZWQgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG4gIHJpZ2h0UHRzID0gW107XG4gIHZhciBwbCA9IHBvaW50c1swXSxcbiAgICAgIC8vIFByZXZpb3VzIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuICBwciA9IHBvaW50c1swXSxcbiAgICAgIHRsID0gcGwsXG4gICAgICAvLyBQb2ludHMgdG8gdGVzdCBkaXN0YW5jZSBmcm9tXG4gIHRyID0gcHIsXG4gICAgICBwYSA9IHByWzNdLFxuICAgICAgcHAgPSAwLFxuICAgICAgLy8gUHJldmlvdXMgKG1heWJlIHNpbXVsYXRlZCkgcHJlc3N1cmVcbiAgciA9IHNpemUgLyAyLFxuICAgICAgLy8gVGhlIGN1cnJlbnQgcG9pbnQgcmFkaXVzXG4gIF9zaG9ydCA9IHRydWU7IC8vIFdoZXRoZXIgdGhlIGxpbmUgaXMgZHJhd24gZmFyIGVub3VnaFxuICAvLyBXZSBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIGFuIGVtcHR5IGFycmF5LlxuXG4gIGlmIChsZW4gPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gSWYgdGhlIHBvaW50IGlzIG9ubHkgb25lIHBvaW50IGxvbmcsIGRyYXcgdHdvIGNhcHMgYXQgZWl0aGVyIGVuZC5cblxuXG4gIGlmIChsZW4gPT09IDEgfHwgdG90YWxMZW5ndGggPD0gNCkge1xuICAgIHZhciBmaXJzdCA9IHBvaW50c1swXSxcbiAgICAgICAgbGFzdCA9IHBvaW50c1tsZW4gLSAxXSxcbiAgICAgICAgYW5nbGUgPSBnZXRBbmdsZShmaXJzdCwgbGFzdCk7XG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIHIgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgbGFzdFsyXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgdCA9IDAsIHN0ZXAgPSAwLjE7IHQgPD0gMTsgdCArPSBzdGVwKSB7XG4gICAgICB0bCA9IHByb2plY3RQb2ludChmaXJzdCwgYW5nbGUgKyBQSSQxICsgVEFVIC0gdCAqIFBJJDEsIHIpO1xuICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobGFzdCwgYW5nbGUgKyBUQVUgLSB0ICogUEkkMSwgcik7XG4gICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRQdHMuY29uY2F0KHJpZ2h0UHRzKTtcbiAgfSAvLyBGb3IgYSBwb2ludCB3aXRoIG1vcmUgdGhhbiBvbmUgcG9pbnQsIGNyZWF0ZSBhbiBvdXRsaW5lIHNoYXBlLlxuXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBwcmV2ID0gcG9pbnRzW2kgLSAxXTtcbiAgICB2YXIgX3BvaW50cyRpID0gcG9pbnRzW2ldLFxuICAgICAgICB4ID0gX3BvaW50cyRpWzBdLFxuICAgICAgICB5ID0gX3BvaW50cyRpWzFdLFxuICAgICAgICBwcmVzc3VyZSA9IF9wb2ludHMkaVsyXSxcbiAgICAgICAgX2FuZ2xlID0gX3BvaW50cyRpWzNdLFxuICAgICAgICBkaXN0YW5jZSA9IF9wb2ludHMkaVs0XSxcbiAgICAgICAgY2xlbiA9IF9wb2ludHMkaVs1XTsgLy8gMS5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIGlmIChzaW11bGF0ZVByZXNzdXJlKSB7XG4gICAgICAgIC8vIFNpbXVsYXRlIHByZXNzdXJlIGJ5IGFjY2VsbGVyYXRpbmcgdGhlIHJlcG9ydGVkIHByZXNzdXJlLlxuICAgICAgICB2YXIgcnAgPSBtaW4kMSgxIC0gZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgdmFyIHNwID0gbWluJDEoZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgcHJlc3N1cmUgPSBtaW4kMSgxLCBwcCArIChycCAtIHBwKSAqIChzcCAvIDIpKTtcbiAgICAgIH0gLy8gQ29tcHV0ZSB0aGUgc3Ryb2tlIHJhZGl1cyBiYXNlZCBvbiB0aGUgcHJlc3N1cmUsIGVhc2luZyBhbmQgdGhpbm5pbmcuXG5cblxuICAgICAgciA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBwcmVzc3VyZSk7XG4gICAgfSAvLyAyLlxuICAgIC8vIERyYXcgYSBjYXAgb25jZSB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cblxuXG4gICAgaWYgKF9zaG9ydCkge1xuICAgICAgaWYgKGNsZW4gPCBzaXplIC8gNCkgY29udGludWU7IC8vIFRoZSBmaXJzdCBwb2ludCBhZnRlciB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cbiAgICAgIC8vIERyYXcgYSBjYXAgYXQgdGhlIGZpcnN0IHBvaW50IGFuZ2xlZCB0b3dhcmQgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICAgIF9zaG9ydCA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBfdCA9IDAsIF9zdGVwID0gMC4xOyBfdCA8PSAxOyBfdCArPSBfc3RlcCkge1xuICAgICAgICB0bCA9IHByb2plY3RQb2ludChwb2ludHNbMF0sIF9hbmdsZSArIFRBVSAtIF90ICogUEkkMSwgcik7XG4gICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICB9XG5cbiAgICAgIHRyID0gcHJvamVjdFBvaW50KHBvaW50c1swXSwgX2FuZ2xlICsgVEFVLCByKTtcbiAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgIH1cblxuICAgIF9hbmdsZSA9IGxlcnBBbmdsZXMocGEsIF9hbmdsZSwgMC43NSk7IC8vIDMuXG4gICAgLy8gQWRkIHBvaW50cyBmb3IgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAoaSA9PT0gbGVuIC0gMSkge1xuICAgICAgLy8gVGhlIGxhc3QgcG9pbnQgaW4gdGhlIGxpbmUuXG4gICAgICAvLyBBZGQgcG9pbnRzIGZvciBhbiBlbmQgY2FwLlxuICAgICAgZm9yICh2YXIgX3QyID0gMCwgX3N0ZXAyID0gMC4xOyBfdDIgPD0gMTsgX3QyICs9IF9zdGVwMikge1xuICAgICAgICByaWdodFB0cy5wdXNoKHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSArIF90MiAqIFBJJDEsIHIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmluZCB0aGUgZGVsdGEgYmV0d2VlbiB0aGUgY3VycmVudCBhbmQgcHJldmlvdXMgYW5nbGUuXG4gICAgICB2YXIgZGVsdGEgPSBnZXRBbmdsZURlbHRhKHByZXZbM10sIF9hbmdsZSksXG4gICAgICAgICAgYWJzRGVsdGEgPSBhYnMoZGVsdGEpO1xuXG4gICAgICBpZiAoYWJzRGVsdGEgPiBTSEFSUCAmJiBjbGVuID4gcikge1xuICAgICAgICAvLyBBIHNoYXJwIGNvcm5lci5cbiAgICAgICAgLy8gUHJvamVjdCBwb2ludHMgKGxlZnQgYW5kIHJpZ2h0KSBmb3IgYSBjYXAuXG4gICAgICAgIHZhciBtaWQgPSBnZXRQb2ludEJldHdlZW4ocHJldiwgW3gsIHldKTtcblxuICAgICAgICBmb3IgKHZhciBfdDMgPSAwLCBfc3RlcDMgPSAwLjI1OyBfdDMgPD0gMTsgX3QzICs9IF9zdGVwMykge1xuICAgICAgICAgIHRsID0gcHJvamVjdFBvaW50KG1pZCwgcGEgLSBUQVUgKyBfdDMgKiAtUEkkMSwgcik7XG4gICAgICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobWlkLCBwYSArIFRBVSArIF90MyAqIFBJJDEsIHIpO1xuICAgICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEEgcmVndWxhciBwb2ludC5cbiAgICAgICAgLy8gQWRkIHByb2plY3RlZCBwb2ludHMgbGVmdCBhbmQgcmlnaHQsIGlmIGZhciBlbm91Z2ggYXdheS5cbiAgICAgICAgcGwgPSBwcm9qZWN0UG9pbnQoW3gsIHldLCBfYW5nbGUgLSBUQVUsIHIpO1xuICAgICAgICBwciA9IHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSwgcik7XG5cbiAgICAgICAgaWYgKGFic0RlbHRhID4gRFVMTCB8fCBnZXREaXN0YW5jZShwbCwgdGwpID4gbWluRGlzdCkge1xuICAgICAgICAgIGxlZnRQdHMucHVzaChnZXRQb2ludEJldHdlZW4odGwsIHBsKSk7XG4gICAgICAgICAgdGwgPSBwbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhYnNEZWx0YSA+IERVTEwgfHwgZ2V0RGlzdGFuY2UocHIsIHRyKSA+IG1pbkRpc3QpIHtcbiAgICAgICAgICByaWdodFB0cy5wdXNoKGdldFBvaW50QmV0d2Vlbih0ciwgcHIpKTtcbiAgICAgICAgICB0ciA9IHByO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHBwID0gcHJlc3N1cmU7XG4gICAgICBwYSA9IF9hbmdsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVmdFB0cy5jb25jYXQocmlnaHRQdHMucmV2ZXJzZSgpKTtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VcclxuICogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBzdHJva2UgYXMgYW4gYXJyYXkgb2YgcG9pbnRzLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnN0cmVhbWxpbmUgSG93IG11Y2ggdG8gc3RyZWFtbGluZSB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2UocG9pbnRzLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gZ2V0U3Ryb2tlT3V0bGluZVBvaW50cyhnZXRTdHJva2VQb2ludHMocG9pbnRzLCBvcHRpb25zLnN0cmVhbWxpbmUpLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U3Ryb2tlO1xuZXhwb3J0IHsgZ2V0U3Ryb2tlT3V0bGluZVBvaW50cywgZ2V0U3Ryb2tlUG9pbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wZXJmZWN0LWZyZWVoYW5kLmVzbS5qcy5tYXBcbiIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLnBvbHlnb25DbGlwcGluZyA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gICAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIHNwbGF5dHJlZSB2My4xLjBcbiAgICogRmFzdCBTcGxheSB0cmVlIGZvciBOb2RlIGFuZCBicm93c2VyXG4gICAqXG4gICAqIEBhdXRob3IgQWxleGFuZGVyIE1pbGV2c2tpIDxpbmZvQHc4ci5uYW1lPlxuICAgKiBAbGljZW5zZSBNSVRcbiAgICogQHByZXNlcnZlXG4gICAqL1xuICB2YXIgTm9kZSA9XG4gIC8qKiBAY2xhc3MgKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vZGUoa2V5LCBkYXRhKSB7XG4gICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBOb2RlO1xuICB9KCk7XG4gIC8qIGZvbGxvd3MgXCJBbiBpbXBsZW1lbnRhdGlvbiBvZiB0b3AtZG93biBzcGxheWluZ1wiXHJcbiAgICogYnkgRC4gU2xlYXRvciA8c2xlYXRvckBjcy5jbXUuZWR1PiBNYXJjaCAxOTkyXHJcbiAgICovXG5cblxuICBmdW5jdGlvbiBERUZBVUxUX0NPTVBBUkUoYSwgYikge1xuICAgIHJldHVybiBhID4gYiA/IDEgOiBhIDwgYiA/IC0xIDogMDtcbiAgfVxuICAvKipcclxuICAgKiBTaW1wbGUgdG9wIGRvd24gc3BsYXksIG5vdCByZXF1aXJpbmcgaSB0byBiZSBpbiB0aGUgdHJlZSB0LlxyXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gc3BsYXkoaSwgdCwgY29tcGFyYXRvcikge1xuICAgIHZhciBOID0gbmV3IE5vZGUobnVsbCwgbnVsbCk7XG4gICAgdmFyIGwgPSBOO1xuICAgIHZhciByID0gTjtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihpLCB0LmtleSk7IC8vaWYgKGkgPCB0LmtleSkge1xuXG4gICAgICBpZiAoY21wIDwgMCkge1xuICAgICAgICBpZiAodC5sZWZ0ID09PSBudWxsKSBicmVhazsgLy9pZiAoaSA8IHQubGVmdC5rZXkpIHtcblxuICAgICAgICBpZiAoY29tcGFyYXRvcihpLCB0LmxlZnQua2V5KSA8IDApIHtcbiAgICAgICAgICB2YXIgeSA9IHQubGVmdDtcbiAgICAgICAgICAvKiByb3RhdGUgcmlnaHQgKi9cblxuICAgICAgICAgIHQubGVmdCA9IHkucmlnaHQ7XG4gICAgICAgICAgeS5yaWdodCA9IHQ7XG4gICAgICAgICAgdCA9IHk7XG4gICAgICAgICAgaWYgKHQubGVmdCA9PT0gbnVsbCkgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICByLmxlZnQgPSB0O1xuICAgICAgICAvKiBsaW5rIHJpZ2h0ICovXG5cbiAgICAgICAgciA9IHQ7XG4gICAgICAgIHQgPSB0LmxlZnQ7IC8vfSBlbHNlIGlmIChpID4gdC5rZXkpIHtcbiAgICAgIH0gZWxzZSBpZiAoY21wID4gMCkge1xuICAgICAgICBpZiAodC5yaWdodCA9PT0gbnVsbCkgYnJlYWs7IC8vaWYgKGkgPiB0LnJpZ2h0LmtleSkge1xuXG4gICAgICAgIGlmIChjb21wYXJhdG9yKGksIHQucmlnaHQua2V5KSA+IDApIHtcbiAgICAgICAgICB2YXIgeSA9IHQucmlnaHQ7XG4gICAgICAgICAgLyogcm90YXRlIGxlZnQgKi9cblxuICAgICAgICAgIHQucmlnaHQgPSB5LmxlZnQ7XG4gICAgICAgICAgeS5sZWZ0ID0gdDtcbiAgICAgICAgICB0ID0geTtcbiAgICAgICAgICBpZiAodC5yaWdodCA9PT0gbnVsbCkgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBsLnJpZ2h0ID0gdDtcbiAgICAgICAgLyogbGluayBsZWZ0ICovXG5cbiAgICAgICAgbCA9IHQ7XG4gICAgICAgIHQgPSB0LnJpZ2h0O1xuICAgICAgfSBlbHNlIGJyZWFrO1xuICAgIH1cbiAgICAvKiBhc3NlbWJsZSAqL1xuXG5cbiAgICBsLnJpZ2h0ID0gdC5sZWZ0O1xuICAgIHIubGVmdCA9IHQucmlnaHQ7XG4gICAgdC5sZWZ0ID0gTi5yaWdodDtcbiAgICB0LnJpZ2h0ID0gTi5sZWZ0O1xuICAgIHJldHVybiB0O1xuICB9XG5cbiAgZnVuY3Rpb24gaW5zZXJ0KGksIGRhdGEsIHQsIGNvbXBhcmF0b3IpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKGksIGRhdGEpO1xuXG4gICAgaWYgKHQgPT09IG51bGwpIHtcbiAgICAgIG5vZGUubGVmdCA9IG5vZGUucmlnaHQgPSBudWxsO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgdCA9IHNwbGF5KGksIHQsIGNvbXBhcmF0b3IpO1xuICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGksIHQua2V5KTtcblxuICAgIGlmIChjbXAgPCAwKSB7XG4gICAgICBub2RlLmxlZnQgPSB0LmxlZnQ7XG4gICAgICBub2RlLnJpZ2h0ID0gdDtcbiAgICAgIHQubGVmdCA9IG51bGw7XG4gICAgfSBlbHNlIGlmIChjbXAgPj0gMCkge1xuICAgICAgbm9kZS5yaWdodCA9IHQucmlnaHQ7XG4gICAgICBub2RlLmxlZnQgPSB0O1xuICAgICAgdC5yaWdodCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBzcGxpdChrZXksIHYsIGNvbXBhcmF0b3IpIHtcbiAgICB2YXIgbGVmdCA9IG51bGw7XG4gICAgdmFyIHJpZ2h0ID0gbnVsbDtcblxuICAgIGlmICh2KSB7XG4gICAgICB2ID0gc3BsYXkoa2V5LCB2LCBjb21wYXJhdG9yKTtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKHYua2V5LCBrZXkpO1xuXG4gICAgICBpZiAoY21wID09PSAwKSB7XG4gICAgICAgIGxlZnQgPSB2LmxlZnQ7XG4gICAgICAgIHJpZ2h0ID0gdi5yaWdodDtcbiAgICAgIH0gZWxzZSBpZiAoY21wIDwgMCkge1xuICAgICAgICByaWdodCA9IHYucmlnaHQ7XG4gICAgICAgIHYucmlnaHQgPSBudWxsO1xuICAgICAgICBsZWZ0ID0gdjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnQgPSB2LmxlZnQ7XG4gICAgICAgIHYubGVmdCA9IG51bGw7XG4gICAgICAgIHJpZ2h0ID0gdjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogbGVmdCxcbiAgICAgIHJpZ2h0OiByaWdodFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZShsZWZ0LCByaWdodCwgY29tcGFyYXRvcikge1xuICAgIGlmIChyaWdodCA9PT0gbnVsbCkgcmV0dXJuIGxlZnQ7XG4gICAgaWYgKGxlZnQgPT09IG51bGwpIHJldHVybiByaWdodDtcbiAgICByaWdodCA9IHNwbGF5KGxlZnQua2V5LCByaWdodCwgY29tcGFyYXRvcik7XG4gICAgcmlnaHQubGVmdCA9IGxlZnQ7XG4gICAgcmV0dXJuIHJpZ2h0O1xuICB9XG4gIC8qKlxyXG4gICAqIFByaW50cyBsZXZlbCBvZiB0aGUgdHJlZVxyXG4gICAqL1xuXG5cbiAgZnVuY3Rpb24gcHJpbnRSb3cocm9vdCwgcHJlZml4LCBpc1RhaWwsIG91dCwgcHJpbnROb2RlKSB7XG4gICAgaWYgKHJvb3QpIHtcbiAgICAgIG91dChcIlwiICsgcHJlZml4ICsgKGlzVGFpbCA/ICfilJTilIDilIAgJyA6ICfilJzilIDilIAgJykgKyBwcmludE5vZGUocm9vdCkgKyBcIlxcblwiKTtcbiAgICAgIHZhciBpbmRlbnQgPSBwcmVmaXggKyAoaXNUYWlsID8gJyAgICAnIDogJ+KUgiAgICcpO1xuICAgICAgaWYgKHJvb3QubGVmdCkgcHJpbnRSb3cocm9vdC5sZWZ0LCBpbmRlbnQsIGZhbHNlLCBvdXQsIHByaW50Tm9kZSk7XG4gICAgICBpZiAocm9vdC5yaWdodCkgcHJpbnRSb3cocm9vdC5yaWdodCwgaW5kZW50LCB0cnVlLCBvdXQsIHByaW50Tm9kZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIFRyZWUgPVxuICAvKiogQGNsYXNzICovXG4gIGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUcmVlKGNvbXBhcmF0b3IpIHtcbiAgICAgIGlmIChjb21wYXJhdG9yID09PSB2b2lkIDApIHtcbiAgICAgICAgY29tcGFyYXRvciA9IERFRkFVTFRfQ09NUEFSRTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICB0aGlzLl9zaXplID0gMDtcbiAgICAgIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICAgIH1cbiAgICAvKipcclxuICAgICAqIEluc2VydHMgYSBrZXksIGFsbG93cyBkdXBsaWNhdGVzXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gKGtleSwgZGF0YSkge1xuICAgICAgdGhpcy5fc2l6ZSsrO1xuICAgICAgcmV0dXJuIHRoaXMuX3Jvb3QgPSBpbnNlcnQoa2V5LCBkYXRhLCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogQWRkcyBhIGtleSwgaWYgaXQgaXMgbm90IHByZXNlbnQgaW4gdGhlIHRyZWVcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoa2V5LCBkYXRhKSB7XG4gICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKGtleSwgZGF0YSk7XG5cbiAgICAgIGlmICh0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIG5vZGUubGVmdCA9IG5vZGUucmlnaHQgPSBudWxsO1xuICAgICAgICB0aGlzLl9zaXplKys7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSBub2RlO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgICB2YXIgdCA9IHNwbGF5KGtleSwgdGhpcy5fcm9vdCwgY29tcGFyYXRvcik7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihrZXksIHQua2V5KTtcbiAgICAgIGlmIChjbXAgPT09IDApIHRoaXMuX3Jvb3QgPSB0O2Vsc2Uge1xuICAgICAgICBpZiAoY21wIDwgMCkge1xuICAgICAgICAgIG5vZGUubGVmdCA9IHQubGVmdDtcbiAgICAgICAgICBub2RlLnJpZ2h0ID0gdDtcbiAgICAgICAgICB0LmxlZnQgPSBudWxsO1xuICAgICAgICB9IGVsc2UgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgICBub2RlLnJpZ2h0ID0gdC5yaWdodDtcbiAgICAgICAgICBub2RlLmxlZnQgPSB0O1xuICAgICAgICAgIHQucmlnaHQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2l6ZSsrO1xuICAgICAgICB0aGlzLl9yb290ID0gbm9kZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9yb290O1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gIHtLZXl9IGtleVxyXG4gICAgICogQHJldHVybiB7Tm9kZXxudWxsfVxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLl9yZW1vdmUoa2V5LCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogRGVsZXRlcyBpIGZyb20gdGhlIHRyZWUgaWYgaXQncyB0aGVyZVxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLl9yZW1vdmUgPSBmdW5jdGlvbiAoaSwgdCwgY29tcGFyYXRvcikge1xuICAgICAgdmFyIHg7XG4gICAgICBpZiAodCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgICB0ID0gc3BsYXkoaSwgdCwgY29tcGFyYXRvcik7XG4gICAgICB2YXIgY21wID0gY29tcGFyYXRvcihpLCB0LmtleSk7XG5cbiAgICAgIGlmIChjbXAgPT09IDApIHtcbiAgICAgICAgLyogZm91bmQgaXQgKi9cbiAgICAgICAgaWYgKHQubGVmdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHggPSB0LnJpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHggPSBzcGxheShpLCB0LmxlZnQsIGNvbXBhcmF0b3IpO1xuICAgICAgICAgIHgucmlnaHQgPSB0LnJpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fc2l6ZS0tO1xuICAgICAgICByZXR1cm4geDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHQ7XG4gICAgICAvKiBJdCB3YXNuJ3QgdGhlcmUgKi9cbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlcyBhbmQgcmV0dXJucyB0aGUgbm9kZSB3aXRoIHNtYWxsZXN0IGtleVxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgd2hpbGUgKG5vZGUubGVmdCkge1xuICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9yb290ID0gc3BsYXkobm9kZS5rZXksIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgICAgICB0aGlzLl9yb290ID0gdGhpcy5fcmVtb3ZlKG5vZGUua2V5LCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IG5vZGUua2V5LFxuICAgICAgICAgIGRhdGE6IG5vZGUuZGF0YVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogRmluZCB3aXRob3V0IHNwbGF5aW5nXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUuZmluZFN0YXRpYyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBjdXJyZW50LmtleSk7XG4gICAgICAgIGlmIChjbXAgPT09IDApIHJldHVybiBjdXJyZW50O2Vsc2UgaWYgKGNtcCA8IDApIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7ZWxzZSBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBpZiAodGhpcy5fcm9vdCkge1xuICAgICAgICB0aGlzLl9yb290ID0gc3BsYXkoa2V5LCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICAgICAgaWYgKHRoaXMuX2NvbXBhcmF0b3Ioa2V5LCB0aGlzLl9yb290LmtleSkgIT09IDApIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICAgIHdoaWxlIChjdXJyZW50KSB7XG4gICAgICAgIHZhciBjbXAgPSBjb21wYXJlKGtleSwgY3VycmVudC5rZXkpO1xuICAgICAgICBpZiAoY21wID09PSAwKSByZXR1cm4gdHJ1ZTtlbHNlIGlmIChjbXAgPCAwKSBjdXJyZW50ID0gY3VycmVudC5sZWZ0O2Vsc2UgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uICh2aXNpdG9yLCBjdHgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBRID0gW107XG4gICAgICAvKiBJbml0aWFsaXplIHN0YWNrIHMgKi9cblxuICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcblxuICAgICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICAgIGlmIChjdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgUS5wdXNoKGN1cnJlbnQpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFEubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gUS5wb3AoKTtcbiAgICAgICAgICAgIHZpc2l0b3IuY2FsbChjdHgsIGN1cnJlbnQpO1xuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICAgICAgfSBlbHNlIGRvbmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBXYWxrIGtleSByYW5nZSBmcm9tIGBsb3dgIHRvIGBoaWdoYC4gU3RvcHMgaWYgYGZuYCByZXR1cm5zIGEgdmFsdWUuXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUucmFuZ2UgPSBmdW5jdGlvbiAobG93LCBoaWdoLCBmbiwgY3R4KSB7XG4gICAgICB2YXIgUSA9IFtdO1xuICAgICAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIGNtcDtcblxuICAgICAgd2hpbGUgKFEubGVuZ3RoICE9PSAwIHx8IG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICBRLnB1c2gobm9kZSk7XG4gICAgICAgICAgbm9kZSA9IG5vZGUubGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2RlID0gUS5wb3AoKTtcbiAgICAgICAgICBjbXAgPSBjb21wYXJlKG5vZGUua2V5LCBoaWdoKTtcblxuICAgICAgICAgIGlmIChjbXAgPiAwKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2UgaWYgKGNvbXBhcmUobm9kZS5rZXksIGxvdykgPj0gMCkge1xuICAgICAgICAgICAgaWYgKGZuLmNhbGwoY3R4LCBub2RlKSkgcmV0dXJuIHRoaXM7IC8vIHN0b3AgaWYgc210aCBpcyByZXR1cm5lZFxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGtleXNcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGtleXMgPSBbXTtcbiAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGtleSA9IF9hLmtleTtcbiAgICAgICAgcmV0dXJuIGtleXMucHVzaChrZXkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4ga2V5cztcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBhbGwgdGhlIGRhdGEgaW4gdGhlIG5vZGVzXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgZGF0YSA9IF9hLmRhdGE7XG4gICAgICAgIHJldHVybiB2YWx1ZXMucHVzaChkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX3Jvb3QpIHJldHVybiB0aGlzLm1pbk5vZGUodGhpcy5fcm9vdCkua2V5O1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh0aGlzLl9yb290KSByZXR1cm4gdGhpcy5tYXhOb2RlKHRoaXMuX3Jvb3QpLmtleTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5taW5Ob2RlID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgIGlmICh0ID09PSB2b2lkIDApIHtcbiAgICAgICAgdCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB9XG5cbiAgICAgIGlmICh0KSB3aGlsZSAodC5sZWZ0KSB7XG4gICAgICAgIHQgPSB0LmxlZnQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUubWF4Tm9kZSA9IGZ1bmN0aW9uICh0KSB7XG4gICAgICBpZiAodCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHQgPSB0aGlzLl9yb290O1xuICAgICAgfVxuXG4gICAgICBpZiAodCkgd2hpbGUgKHQucmlnaHQpIHtcbiAgICAgICAgdCA9IHQucmlnaHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogUmV0dXJucyBub2RlIGF0IGdpdmVuIGluZGV4XHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUuYXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICB2YXIgUSA9IFtdO1xuXG4gICAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgICBRLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoUS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjdXJyZW50ID0gUS5wb3AoKTtcbiAgICAgICAgICAgIGlmIChpID09PSBpbmRleCkgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgICAgICB9IGVsc2UgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoZCkge1xuICAgICAgdmFyIHJvb3QgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIHN1Y2Nlc3NvciA9IG51bGw7XG5cbiAgICAgIGlmIChkLnJpZ2h0KSB7XG4gICAgICAgIHN1Y2Nlc3NvciA9IGQucmlnaHQ7XG5cbiAgICAgICAgd2hpbGUgKHN1Y2Nlc3Nvci5sZWZ0KSB7XG4gICAgICAgICAgc3VjY2Vzc29yID0gc3VjY2Vzc29yLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3VjY2Vzc29yO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICAgIHdoaWxlIChyb290KSB7XG4gICAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGQua2V5LCByb290LmtleSk7XG4gICAgICAgIGlmIChjbXAgPT09IDApIGJyZWFrO2Vsc2UgaWYgKGNtcCA8IDApIHtcbiAgICAgICAgICBzdWNjZXNzb3IgPSByb290O1xuICAgICAgICAgIHJvb3QgPSByb290LmxlZnQ7XG4gICAgICAgIH0gZWxzZSByb290ID0gcm9vdC5yaWdodDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1Y2Nlc3NvcjtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgcHJlZGVjZXNzb3IgPSBudWxsO1xuXG4gICAgICBpZiAoZC5sZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHByZWRlY2Vzc29yID0gZC5sZWZ0O1xuXG4gICAgICAgIHdoaWxlIChwcmVkZWNlc3Nvci5yaWdodCkge1xuICAgICAgICAgIHByZWRlY2Vzc29yID0gcHJlZGVjZXNzb3IucmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJlZGVjZXNzb3I7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgICAgd2hpbGUgKHJvb3QpIHtcbiAgICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3IoZC5rZXksIHJvb3Qua2V5KTtcbiAgICAgICAgaWYgKGNtcCA9PT0gMCkgYnJlYWs7ZWxzZSBpZiAoY21wIDwgMCkgcm9vdCA9IHJvb3QubGVmdDtlbHNlIHtcbiAgICAgICAgICBwcmVkZWNlc3NvciA9IHJvb3Q7XG4gICAgICAgICAgcm9vdCA9IHJvb3QucmlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByZWRlY2Vzc29yO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgICAgdGhpcy5fc2l6ZSA9IDA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUudG9MaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRvTGlzdCh0aGlzLl9yb290KTtcbiAgICB9O1xuICAgIC8qKlxyXG4gICAgICogQnVsay1sb2FkIGl0ZW1zLiBCb3RoIGFycmF5IGhhdmUgdG8gYmUgc2FtZSBzaXplXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIChrZXlzLCB2YWx1ZXMsIHByZXNvcnQpIHtcbiAgICAgIGlmICh2YWx1ZXMgPT09IHZvaWQgMCkge1xuICAgICAgICB2YWx1ZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHByZXNvcnQgPT09IHZvaWQgMCkge1xuICAgICAgICBwcmVzb3J0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciBzaXplID0ga2V5cy5sZW5ndGg7XG4gICAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7IC8vIHNvcnQgaWYgbmVlZGVkXG5cbiAgICAgIGlmIChwcmVzb3J0KSBzb3J0KGtleXMsIHZhbHVlcywgMCwgc2l6ZSAtIDEsIGNvbXBhcmF0b3IpO1xuXG4gICAgICBpZiAodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBsb2FkUmVjdXJzaXZlKGtleXMsIHZhbHVlcywgMCwgc2l6ZSk7XG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGhhdCByZS1idWlsZHMgdGhlIHdob2xlIHRyZWUgZnJvbSB0d28gaW4tb3JkZXIgdHJhdmVyc2Fsc1xuICAgICAgICB2YXIgbWVyZ2VkTGlzdCA9IG1lcmdlTGlzdHModGhpcy50b0xpc3QoKSwgY3JlYXRlTGlzdChrZXlzLCB2YWx1ZXMpLCBjb21wYXJhdG9yKTtcbiAgICAgICAgc2l6ZSA9IHRoaXMuX3NpemUgKyBzaXplO1xuICAgICAgICB0aGlzLl9yb290ID0gc29ydGVkTGlzdFRvQlNUKHtcbiAgICAgICAgICBoZWFkOiBtZXJnZWRMaXN0XG4gICAgICAgIH0sIDAsIHNpemUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yb290ID09PSBudWxsO1xuICAgIH07XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJlZS5wcm90b3R5cGUsIFwic2l6ZVwiLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpemU7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmVlLnByb3RvdHlwZSwgXCJyb290XCIsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICBUcmVlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChwcmludE5vZGUpIHtcbiAgICAgIGlmIChwcmludE5vZGUgPT09IHZvaWQgMCkge1xuICAgICAgICBwcmludE5vZGUgPSBmdW5jdGlvbiBwcmludE5vZGUobikge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcobi5rZXkpO1xuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICB2YXIgb3V0ID0gW107XG4gICAgICBwcmludFJvdyh0aGlzLl9yb290LCAnJywgdHJ1ZSwgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgcmV0dXJuIG91dC5wdXNoKHYpO1xuICAgICAgfSwgcHJpbnROb2RlKTtcbiAgICAgIHJldHVybiBvdXQuam9pbignJyk7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChrZXksIG5ld0tleSwgbmV3RGF0YSkge1xuICAgICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgICB2YXIgX2EgPSBzcGxpdChrZXksIHRoaXMuX3Jvb3QsIGNvbXBhcmF0b3IpLFxuICAgICAgICAgIGxlZnQgPSBfYS5sZWZ0LFxuICAgICAgICAgIHJpZ2h0ID0gX2EucmlnaHQ7XG5cbiAgICAgIGlmIChjb21wYXJhdG9yKGtleSwgbmV3S2V5KSA8IDApIHtcbiAgICAgICAgcmlnaHQgPSBpbnNlcnQobmV3S2V5LCBuZXdEYXRhLCByaWdodCwgY29tcGFyYXRvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZWZ0ID0gaW5zZXJ0KG5ld0tleSwgbmV3RGF0YSwgbGVmdCwgY29tcGFyYXRvcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Jvb3QgPSBtZXJnZShsZWZ0LCByaWdodCwgY29tcGFyYXRvcik7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgcmV0dXJuIHNwbGl0KGtleSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgfTtcblxuICAgIHJldHVybiBUcmVlO1xuICB9KCk7XG5cbiAgZnVuY3Rpb24gbG9hZFJlY3Vyc2l2ZShrZXlzLCB2YWx1ZXMsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IGVuZCAtIHN0YXJ0O1xuXG4gICAgaWYgKHNpemUgPiAwKSB7XG4gICAgICB2YXIgbWlkZGxlID0gc3RhcnQgKyBNYXRoLmZsb29yKHNpemUgLyAyKTtcbiAgICAgIHZhciBrZXkgPSBrZXlzW21pZGRsZV07XG4gICAgICB2YXIgZGF0YSA9IHZhbHVlc1ttaWRkbGVdO1xuICAgICAgdmFyIG5vZGUgPSBuZXcgTm9kZShrZXksIGRhdGEpO1xuICAgICAgbm9kZS5sZWZ0ID0gbG9hZFJlY3Vyc2l2ZShrZXlzLCB2YWx1ZXMsIHN0YXJ0LCBtaWRkbGUpO1xuICAgICAgbm9kZS5yaWdodCA9IGxvYWRSZWN1cnNpdmUoa2V5cywgdmFsdWVzLCBtaWRkbGUgKyAxLCBlbmQpO1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVMaXN0KGtleXMsIHZhbHVlcykge1xuICAgIHZhciBoZWFkID0gbmV3IE5vZGUobnVsbCwgbnVsbCk7XG4gICAgdmFyIHAgPSBoZWFkO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwID0gcC5uZXh0ID0gbmV3IE5vZGUoa2V5c1tpXSwgdmFsdWVzW2ldKTtcbiAgICB9XG5cbiAgICBwLm5leHQgPSBudWxsO1xuICAgIHJldHVybiBoZWFkLm5leHQ7XG4gIH1cblxuICBmdW5jdGlvbiB0b0xpc3Qocm9vdCkge1xuICAgIHZhciBjdXJyZW50ID0gcm9vdDtcbiAgICB2YXIgUSA9IFtdO1xuICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZShudWxsLCBudWxsKTtcbiAgICB2YXIgcCA9IGhlYWQ7XG5cbiAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgIGlmIChjdXJyZW50KSB7XG4gICAgICAgIFEucHVzaChjdXJyZW50KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChRLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjdXJyZW50ID0gcCA9IHAubmV4dCA9IFEucG9wKCk7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucmlnaHQ7XG4gICAgICAgIH0gZWxzZSBkb25lID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwLm5leHQgPSBudWxsOyAvLyB0aGF0J2xsIHdvcmsgZXZlbiBpZiB0aGUgdHJlZSB3YXMgZW1wdHlcblxuICAgIHJldHVybiBoZWFkLm5leHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzb3J0ZWRMaXN0VG9CU1QobGlzdCwgc3RhcnQsIGVuZCkge1xuICAgIHZhciBzaXplID0gZW5kIC0gc3RhcnQ7XG5cbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIHZhciBtaWRkbGUgPSBzdGFydCArIE1hdGguZmxvb3Ioc2l6ZSAvIDIpO1xuICAgICAgdmFyIGxlZnQgPSBzb3J0ZWRMaXN0VG9CU1QobGlzdCwgc3RhcnQsIG1pZGRsZSk7XG4gICAgICB2YXIgcm9vdCA9IGxpc3QuaGVhZDtcbiAgICAgIHJvb3QubGVmdCA9IGxlZnQ7XG4gICAgICBsaXN0LmhlYWQgPSBsaXN0LmhlYWQubmV4dDtcbiAgICAgIHJvb3QucmlnaHQgPSBzb3J0ZWRMaXN0VG9CU1QobGlzdCwgbWlkZGxlICsgMSwgZW5kKTtcbiAgICAgIHJldHVybiByb290O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VMaXN0cyhsMSwgbDIsIGNvbXBhcmUpIHtcbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKG51bGwsIG51bGwpOyAvLyBkdW1teVxuXG4gICAgdmFyIHAgPSBoZWFkO1xuICAgIHZhciBwMSA9IGwxO1xuICAgIHZhciBwMiA9IGwyO1xuXG4gICAgd2hpbGUgKHAxICE9PSBudWxsICYmIHAyICE9PSBudWxsKSB7XG4gICAgICBpZiAoY29tcGFyZShwMS5rZXksIHAyLmtleSkgPCAwKSB7XG4gICAgICAgIHAubmV4dCA9IHAxO1xuICAgICAgICBwMSA9IHAxLm5leHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwLm5leHQgPSBwMjtcbiAgICAgICAgcDIgPSBwMi5uZXh0O1xuICAgICAgfVxuXG4gICAgICBwID0gcC5uZXh0O1xuICAgIH1cblxuICAgIGlmIChwMSAhPT0gbnVsbCkge1xuICAgICAgcC5uZXh0ID0gcDE7XG4gICAgfSBlbHNlIGlmIChwMiAhPT0gbnVsbCkge1xuICAgICAgcC5uZXh0ID0gcDI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlYWQubmV4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnQoa2V5cywgdmFsdWVzLCBsZWZ0LCByaWdodCwgY29tcGFyZSkge1xuICAgIGlmIChsZWZ0ID49IHJpZ2h0KSByZXR1cm47XG4gICAgdmFyIHBpdm90ID0ga2V5c1tsZWZ0ICsgcmlnaHQgPj4gMV07XG4gICAgdmFyIGkgPSBsZWZ0IC0gMTtcbiAgICB2YXIgaiA9IHJpZ2h0ICsgMTtcblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBkbyB7XG4gICAgICAgIGkrKztcbiAgICAgIH0gd2hpbGUgKGNvbXBhcmUoa2V5c1tpXSwgcGl2b3QpIDwgMCk7XG5cbiAgICAgIGRvIHtcbiAgICAgICAgai0tO1xuICAgICAgfSB3aGlsZSAoY29tcGFyZShrZXlzW2pdLCBwaXZvdCkgPiAwKTtcblxuICAgICAgaWYgKGkgPj0gaikgYnJlYWs7XG4gICAgICB2YXIgdG1wID0ga2V5c1tpXTtcbiAgICAgIGtleXNbaV0gPSBrZXlzW2pdO1xuICAgICAga2V5c1tqXSA9IHRtcDtcbiAgICAgIHRtcCA9IHZhbHVlc1tpXTtcbiAgICAgIHZhbHVlc1tpXSA9IHZhbHVlc1tqXTtcbiAgICAgIHZhbHVlc1tqXSA9IHRtcDtcbiAgICB9XG5cbiAgICBzb3J0KGtleXMsIHZhbHVlcywgbGVmdCwgaiwgY29tcGFyZSk7XG4gICAgc29ydChrZXlzLCB2YWx1ZXMsIGogKyAxLCByaWdodCwgY29tcGFyZSk7XG4gIH1cblxuICAvKipcbiAgICogQSBib3VuZGluZyBib3ggaGFzIHRoZSBmb3JtYXQ6XG4gICAqXG4gICAqICB7IGxsOiB7IHg6IHhtaW4sIHk6IHltaW4gfSwgdXI6IHsgeDogeG1heCwgeTogeW1heCB9IH1cbiAgICpcbiAgICovXG4gIHZhciBpc0luQmJveCA9IGZ1bmN0aW9uIGlzSW5CYm94KGJib3gsIHBvaW50KSB7XG4gICAgcmV0dXJuIGJib3gubGwueCA8PSBwb2ludC54ICYmIHBvaW50LnggPD0gYmJveC51ci54ICYmIGJib3gubGwueSA8PSBwb2ludC55ICYmIHBvaW50LnkgPD0gYmJveC51ci55O1xuICB9O1xuICAvKiBSZXR1cm5zIGVpdGhlciBudWxsLCBvciBhIGJib3ggKGFrYSBhbiBvcmRlcmVkIHBhaXIgb2YgcG9pbnRzKVxuICAgKiBJZiB0aGVyZSBpcyBvbmx5IG9uZSBwb2ludCBvZiBvdmVybGFwLCBhIGJib3ggd2l0aCBpZGVudGljYWwgcG9pbnRzXG4gICAqIHdpbGwgYmUgcmV0dXJuZWQgKi9cblxuICB2YXIgZ2V0QmJveE92ZXJsYXAgPSBmdW5jdGlvbiBnZXRCYm94T3ZlcmxhcChiMSwgYjIpIHtcbiAgICAvLyBjaGVjayBpZiB0aGUgYmJveGVzIG92ZXJsYXAgYXQgYWxsXG4gICAgaWYgKGIyLnVyLnggPCBiMS5sbC54IHx8IGIxLnVyLnggPCBiMi5sbC54IHx8IGIyLnVyLnkgPCBiMS5sbC55IHx8IGIxLnVyLnkgPCBiMi5sbC55KSByZXR1cm4gbnVsbDsgLy8gZmluZCB0aGUgbWlkZGxlIHR3byBYIHZhbHVlc1xuXG4gICAgdmFyIGxvd2VyWCA9IGIxLmxsLnggPCBiMi5sbC54ID8gYjIubGwueCA6IGIxLmxsLng7XG4gICAgdmFyIHVwcGVyWCA9IGIxLnVyLnggPCBiMi51ci54ID8gYjEudXIueCA6IGIyLnVyLng7IC8vIGZpbmQgdGhlIG1pZGRsZSB0d28gWSB2YWx1ZXNcblxuICAgIHZhciBsb3dlclkgPSBiMS5sbC55IDwgYjIubGwueSA/IGIyLmxsLnkgOiBiMS5sbC55O1xuICAgIHZhciB1cHBlclkgPSBiMS51ci55IDwgYjIudXIueSA/IGIxLnVyLnkgOiBiMi51ci55OyAvLyBwdXQgdGhvc2UgbWlkZGxlIHZhbHVlcyB0b2dldGhlciB0byBnZXQgdGhlIG92ZXJsYXBcblxuICAgIHJldHVybiB7XG4gICAgICBsbDoge1xuICAgICAgICB4OiBsb3dlclgsXG4gICAgICAgIHk6IGxvd2VyWVxuICAgICAgfSxcbiAgICAgIHVyOiB7XG4gICAgICAgIHg6IHVwcGVyWCxcbiAgICAgICAgeTogdXBwZXJZXG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvKiBKYXZhc2NyaXB0IGRvZXNuJ3QgZG8gaW50ZWdlciBtYXRoLiBFdmVyeXRoaW5nIGlzXG4gICAqIGZsb2F0aW5nIHBvaW50IHdpdGggcGVyY2lzaW9uIE51bWJlci5FUFNJTE9OLlxuICAgKlxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9OdW1iZXIvRVBTSUxPTlxuICAgKi9cbiAgdmFyIGVwc2lsb24gPSBOdW1iZXIuRVBTSUxPTjsgLy8gSUUgUG9seWZpbGxcblxuICBpZiAoZXBzaWxvbiA9PT0gdW5kZWZpbmVkKSBlcHNpbG9uID0gTWF0aC5wb3coMiwgLTUyKTtcbiAgdmFyIEVQU0lMT05fU1EgPSBlcHNpbG9uICogZXBzaWxvbjtcbiAgLyogRkxQIGNvbXBhcmF0b3IgKi9cblxuICB2YXIgY21wID0gZnVuY3Rpb24gY21wKGEsIGIpIHtcbiAgICAvLyBjaGVjayBpZiB0aGV5J3JlIGJvdGggMFxuICAgIGlmICgtZXBzaWxvbiA8IGEgJiYgYSA8IGVwc2lsb24pIHtcbiAgICAgIGlmICgtZXBzaWxvbiA8IGIgJiYgYiA8IGVwc2lsb24pIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfSAvLyBjaGVjayBpZiB0aGV5J3JlIGZscCBlcXVhbFxuXG5cbiAgICB2YXIgYWIgPSBhIC0gYjtcblxuICAgIGlmIChhYiAqIGFiIDwgRVBTSUxPTl9TUSAqIGEgKiBiKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IC8vIG5vcm1hbCBjb21wYXJpc29uXG5cblxuICAgIHJldHVybiBhIDwgYiA/IC0xIDogMTtcbiAgfTtcblxuICAvKipcbiAgICogVGhpcyBjbGFzcyByb3VuZHMgaW5jb21pbmcgdmFsdWVzIHN1ZmZpY2llbnRseSBzbyB0aGF0XG4gICAqIGZsb2F0aW5nIHBvaW50cyBwcm9ibGVtcyBhcmUsIGZvciB0aGUgbW9zdCBwYXJ0LCBhdm9pZGVkLlxuICAgKlxuICAgKiBJbmNvbWluZyBwb2ludHMgYXJlIGhhdmUgdGhlaXIgeCAmIHkgdmFsdWVzIHRlc3RlZCBhZ2FpbnN0XG4gICAqIGFsbCBwcmV2aW91c2x5IHNlZW4geCAmIHkgdmFsdWVzLiBJZiBlaXRoZXIgaXMgJ3RvbyBjbG9zZSdcbiAgICogdG8gYSBwcmV2aW91c2x5IHNlZW4gdmFsdWUsIGl0J3MgdmFsdWUgaXMgJ3NuYXBwZWQnIHRvIHRoZVxuICAgKiBwcmV2aW91c2x5IHNlZW4gdmFsdWUuXG4gICAqXG4gICAqIEFsbCBwb2ludHMgc2hvdWxkIGJlIHJvdW5kZWQgYnkgdGhpcyBjbGFzcyBiZWZvcmUgYmVpbmdcbiAgICogc3RvcmVkIGluIGFueSBkYXRhIHN0cnVjdHVyZXMgaW4gdGhlIHJlc3Qgb2YgdGhpcyBhbGdvcml0aG0uXG4gICAqL1xuXG4gIHZhciBQdFJvdW5kZXIgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFB0Um91bmRlcigpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQdFJvdW5kZXIpO1xuXG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFB0Um91bmRlciwgW3tcbiAgICAgIGtleTogXCJyZXNldFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgICAgICB0aGlzLnhSb3VuZGVyID0gbmV3IENvb3JkUm91bmRlcigpO1xuICAgICAgICB0aGlzLnlSb3VuZGVyID0gbmV3IENvb3JkUm91bmRlcigpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJyb3VuZFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJvdW5kKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiB0aGlzLnhSb3VuZGVyLnJvdW5kKHgpLFxuICAgICAgICAgIHk6IHRoaXMueVJvdW5kZXIucm91bmQoeSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUHRSb3VuZGVyO1xuICB9KCk7XG5cbiAgdmFyIENvb3JkUm91bmRlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRSb3VuZGVyKCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENvb3JkUm91bmRlcik7XG5cbiAgICAgIHRoaXMudHJlZSA9IG5ldyBUcmVlKCk7IC8vIHByZXNlZWQgd2l0aCAwIHNvIHdlIGRvbid0IGVuZCB1cCB3aXRoIHZhbHVlcyA8IE51bWJlci5FUFNJTE9OXG5cbiAgICAgIHRoaXMucm91bmQoMCk7XG4gICAgfSAvLyBOb3RlOiB0aGlzIGNhbiByb3VuZHMgaW5wdXQgdmFsdWVzIGJhY2t3YXJkcyBvciBmb3J3YXJkcy5cbiAgICAvLyAgICAgICBZb3UgbWlnaHQgYXNrLCB3aHkgbm90IHJlc3RyaWN0IHRoaXMgdG8ganVzdCByb3VuZGluZ1xuICAgIC8vICAgICAgIGZvcndhcmRzPyBXb3VsZG4ndCB0aGF0IGFsbG93IGxlZnQgZW5kcG9pbnRzIHRvIGFsd2F5c1xuICAgIC8vICAgICAgIHJlbWFpbiBsZWZ0IGVuZHBvaW50cyBkdXJpbmcgc3BsaXR0aW5nIChuZXZlciBjaGFuZ2UgdG9cbiAgICAvLyAgICAgICByaWdodCkuIE5vIC0gaXQgd291bGRuJ3QsIGJlY2F1c2Ugd2Ugc25hcCBpbnRlcnNlY3Rpb25zXG4gICAgLy8gICAgICAgdG8gZW5kcG9pbnRzICh0byBlc3RhYmxpc2ggaW5kZXBlbmRlbmNlIGZyb20gdGhlIHNlZ21lbnRcbiAgICAvLyAgICAgICBhbmdsZSBmb3IgdC1pbnRlcnNlY3Rpb25zKS5cblxuXG4gICAgX2NyZWF0ZUNsYXNzKENvb3JkUm91bmRlciwgW3tcbiAgICAgIGtleTogXCJyb3VuZFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJvdW5kKGNvb3JkKSB7XG4gICAgICAgIHZhciBub2RlID0gdGhpcy50cmVlLmFkZChjb29yZCk7XG4gICAgICAgIHZhciBwcmV2Tm9kZSA9IHRoaXMudHJlZS5wcmV2KG5vZGUpO1xuXG4gICAgICAgIGlmIChwcmV2Tm9kZSAhPT0gbnVsbCAmJiBjbXAobm9kZS5rZXksIHByZXZOb2RlLmtleSkgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnRyZWUucmVtb3ZlKGNvb3JkKTtcbiAgICAgICAgICByZXR1cm4gcHJldk5vZGUua2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG5leHROb2RlID0gdGhpcy50cmVlLm5leHQobm9kZSk7XG5cbiAgICAgICAgaWYgKG5leHROb2RlICE9PSBudWxsICYmIGNtcChub2RlLmtleSwgbmV4dE5vZGUua2V5KSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMudHJlZS5yZW1vdmUoY29vcmQpO1xuICAgICAgICAgIHJldHVybiBuZXh0Tm9kZS5rZXk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29vcmQ7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENvb3JkUm91bmRlcjtcbiAgfSgpOyAvLyBzaW5nbGV0b24gYXZhaWxhYmxlIGJ5IGltcG9ydFxuXG5cbiAgdmFyIHJvdW5kZXIgPSBuZXcgUHRSb3VuZGVyKCk7XG5cbiAgLyogQ3Jvc3MgUHJvZHVjdCBvZiB0d28gdmVjdG9ycyB3aXRoIGZpcnN0IHBvaW50IGF0IG9yaWdpbiAqL1xuXG4gIHZhciBjcm9zc1Byb2R1Y3QgPSBmdW5jdGlvbiBjcm9zc1Byb2R1Y3QoYSwgYikge1xuICAgIHJldHVybiBhLnggKiBiLnkgLSBhLnkgKiBiLng7XG4gIH07XG4gIC8qIERvdCBQcm9kdWN0IG9mIHR3byB2ZWN0b3JzIHdpdGggZmlyc3QgcG9pbnQgYXQgb3JpZ2luICovXG5cbiAgdmFyIGRvdFByb2R1Y3QgPSBmdW5jdGlvbiBkb3RQcm9kdWN0KGEsIGIpIHtcbiAgICByZXR1cm4gYS54ICogYi54ICsgYS55ICogYi55O1xuICB9O1xuICAvKiBDb21wYXJhdG9yIGZvciB0d28gdmVjdG9ycyB3aXRoIHNhbWUgc3RhcnRpbmcgcG9pbnQgKi9cblxuICB2YXIgY29tcGFyZVZlY3RvckFuZ2xlcyA9IGZ1bmN0aW9uIGNvbXBhcmVWZWN0b3JBbmdsZXMoYmFzZVB0LCBlbmRQdDEsIGVuZFB0Mikge1xuICAgIHZhciB2MSA9IHtcbiAgICAgIHg6IGVuZFB0MS54IC0gYmFzZVB0LngsXG4gICAgICB5OiBlbmRQdDEueSAtIGJhc2VQdC55XG4gICAgfTtcbiAgICB2YXIgdjIgPSB7XG4gICAgICB4OiBlbmRQdDIueCAtIGJhc2VQdC54LFxuICAgICAgeTogZW5kUHQyLnkgLSBiYXNlUHQueVxuICAgIH07XG4gICAgdmFyIGtyb3NzID0gY3Jvc3NQcm9kdWN0KHYxLCB2Mik7XG4gICAgcmV0dXJuIGNtcChrcm9zcywgMCk7XG4gIH07XG4gIHZhciBsZW5ndGggPSBmdW5jdGlvbiBsZW5ndGgodikge1xuICAgIHJldHVybiBNYXRoLnNxcnQoZG90UHJvZHVjdCh2LCB2KSk7XG4gIH07XG4gIC8qIEdldCB0aGUgc2luZSBvZiB0aGUgYW5nbGUgZnJvbSBwU2hhcmVkIC0+IHBBbmdsZSB0byBwU2hhZWQgLT4gcEJhc2UgKi9cblxuICB2YXIgc2luZU9mQW5nbGUgPSBmdW5jdGlvbiBzaW5lT2ZBbmdsZShwU2hhcmVkLCBwQmFzZSwgcEFuZ2xlKSB7XG4gICAgdmFyIHZCYXNlID0ge1xuICAgICAgeDogcEJhc2UueCAtIHBTaGFyZWQueCxcbiAgICAgIHk6IHBCYXNlLnkgLSBwU2hhcmVkLnlcbiAgICB9O1xuICAgIHZhciB2QW5nbGUgPSB7XG4gICAgICB4OiBwQW5nbGUueCAtIHBTaGFyZWQueCxcbiAgICAgIHk6IHBBbmdsZS55IC0gcFNoYXJlZC55XG4gICAgfTtcbiAgICByZXR1cm4gY3Jvc3NQcm9kdWN0KHZBbmdsZSwgdkJhc2UpIC8gbGVuZ3RoKHZBbmdsZSkgLyBsZW5ndGgodkJhc2UpO1xuICB9O1xuICAvKiBHZXQgdGhlIGNvc2luZSBvZiB0aGUgYW5nbGUgZnJvbSBwU2hhcmVkIC0+IHBBbmdsZSB0byBwU2hhZWQgLT4gcEJhc2UgKi9cblxuICB2YXIgY29zaW5lT2ZBbmdsZSA9IGZ1bmN0aW9uIGNvc2luZU9mQW5nbGUocFNoYXJlZCwgcEJhc2UsIHBBbmdsZSkge1xuICAgIHZhciB2QmFzZSA9IHtcbiAgICAgIHg6IHBCYXNlLnggLSBwU2hhcmVkLngsXG4gICAgICB5OiBwQmFzZS55IC0gcFNoYXJlZC55XG4gICAgfTtcbiAgICB2YXIgdkFuZ2xlID0ge1xuICAgICAgeDogcEFuZ2xlLnggLSBwU2hhcmVkLngsXG4gICAgICB5OiBwQW5nbGUueSAtIHBTaGFyZWQueVxuICAgIH07XG4gICAgcmV0dXJuIGRvdFByb2R1Y3QodkFuZ2xlLCB2QmFzZSkgLyBsZW5ndGgodkFuZ2xlKSAvIGxlbmd0aCh2QmFzZSk7XG4gIH07XG4gIC8qIEdldCB0aGUgeCBjb29yZGluYXRlIHdoZXJlIHRoZSBnaXZlbiBsaW5lIChkZWZpbmVkIGJ5IGEgcG9pbnQgYW5kIHZlY3RvcilcbiAgICogY3Jvc3NlcyB0aGUgaG9yaXpvbnRhbCBsaW5lIHdpdGggdGhlIGdpdmVuIHkgY29vcmRpYW50ZS5cbiAgICogSW4gdGhlIGNhc2Ugb2YgcGFycmFsbGVsIGxpbmVzIChpbmNsdWRpbmcgb3ZlcmxhcHBpbmcgb25lcykgcmV0dXJucyBudWxsLiAqL1xuXG4gIHZhciBob3Jpem9udGFsSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gaG9yaXpvbnRhbEludGVyc2VjdGlvbihwdCwgdiwgeSkge1xuICAgIGlmICh2LnkgPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiB7XG4gICAgICB4OiBwdC54ICsgdi54IC8gdi55ICogKHkgLSBwdC55KSxcbiAgICAgIHk6IHlcbiAgICB9O1xuICB9O1xuICAvKiBHZXQgdGhlIHkgY29vcmRpbmF0ZSB3aGVyZSB0aGUgZ2l2ZW4gbGluZSAoZGVmaW5lZCBieSBhIHBvaW50IGFuZCB2ZWN0b3IpXG4gICAqIGNyb3NzZXMgdGhlIHZlcnRpY2FsIGxpbmUgd2l0aCB0aGUgZ2l2ZW4geCBjb29yZGlhbnRlLlxuICAgKiBJbiB0aGUgY2FzZSBvZiBwYXJyYWxsZWwgbGluZXMgKGluY2x1ZGluZyBvdmVybGFwcGluZyBvbmVzKSByZXR1cm5zIG51bGwuICovXG5cbiAgdmFyIHZlcnRpY2FsSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24gdmVydGljYWxJbnRlcnNlY3Rpb24ocHQsIHYsIHgpIHtcbiAgICBpZiAodi54ID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4ge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHB0LnkgKyB2LnkgLyB2LnggKiAoeCAtIHB0LngpXG4gICAgfTtcbiAgfTtcbiAgLyogR2V0IHRoZSBpbnRlcnNlY3Rpb24gb2YgdHdvIGxpbmVzLCBlYWNoIGRlZmluZWQgYnkgYSBiYXNlIHBvaW50IGFuZCBhIHZlY3Rvci5cbiAgICogSW4gdGhlIGNhc2Ugb2YgcGFycmFsbGVsIGxpbmVzIChpbmNsdWRpbmcgb3ZlcmxhcHBpbmcgb25lcykgcmV0dXJucyBudWxsLiAqL1xuXG4gIHZhciBpbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiBpbnRlcnNlY3Rpb24ocHQxLCB2MSwgcHQyLCB2Mikge1xuICAgIC8vIHRha2Ugc29tZSBzaG9ydGN1dHMgZm9yIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIGxpbmVzXG4gICAgLy8gdGhpcyBhbHNvIGVuc3VyZXMgd2UgZG9uJ3QgY2FsY3VsYXRlIGFuIGludGVyc2VjdGlvbiBhbmQgdGhlbiBkaXNjb3ZlclxuICAgIC8vIGl0J3MgYWN0dWFsbHkgb3V0c2lkZSB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBsaW5lXG4gICAgaWYgKHYxLnggPT09IDApIHJldHVybiB2ZXJ0aWNhbEludGVyc2VjdGlvbihwdDIsIHYyLCBwdDEueCk7XG4gICAgaWYgKHYyLnggPT09IDApIHJldHVybiB2ZXJ0aWNhbEludGVyc2VjdGlvbihwdDEsIHYxLCBwdDIueCk7XG4gICAgaWYgKHYxLnkgPT09IDApIHJldHVybiBob3Jpem9udGFsSW50ZXJzZWN0aW9uKHB0MiwgdjIsIHB0MS55KTtcbiAgICBpZiAodjIueSA9PT0gMCkgcmV0dXJuIGhvcml6b250YWxJbnRlcnNlY3Rpb24ocHQxLCB2MSwgcHQyLnkpOyAvLyBHZW5lcmFsIGNhc2UgZm9yIG5vbi1vdmVybGFwcGluZyBzZWdtZW50cy5cbiAgICAvLyBUaGlzIGFsZ29yaXRobSBpcyBiYXNlZCBvbiBTY2huZWlkZXIgYW5kIEViZXJseS5cbiAgICAvLyBodHRwOi8vd3d3LmNpbWVjLm9yZy5hci9+bmNhbHZvL1NjaG5laWRlcl9FYmVybHkucGRmIC0gcGcgMjQ0XG5cbiAgICB2YXIga3Jvc3MgPSBjcm9zc1Byb2R1Y3QodjEsIHYyKTtcbiAgICBpZiAoa3Jvc3MgPT0gMCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIHZlID0ge1xuICAgICAgeDogcHQyLnggLSBwdDEueCxcbiAgICAgIHk6IHB0Mi55IC0gcHQxLnlcbiAgICB9O1xuICAgIHZhciBkMSA9IGNyb3NzUHJvZHVjdCh2ZSwgdjEpIC8ga3Jvc3M7XG4gICAgdmFyIGQyID0gY3Jvc3NQcm9kdWN0KHZlLCB2MikgLyBrcm9zczsgLy8gdGFrZSB0aGUgYXZlcmFnZSBvZiB0aGUgdHdvIGNhbGN1bGF0aW9ucyB0byBtaW5pbWl6ZSByb3VuZGluZyBlcnJvclxuXG4gICAgdmFyIHgxID0gcHQxLnggKyBkMiAqIHYxLngsXG4gICAgICAgIHgyID0gcHQyLnggKyBkMSAqIHYyLng7XG4gICAgdmFyIHkxID0gcHQxLnkgKyBkMiAqIHYxLnksXG4gICAgICAgIHkyID0gcHQyLnkgKyBkMSAqIHYyLnk7XG4gICAgdmFyIHggPSAoeDEgKyB4MikgLyAyO1xuICAgIHZhciB5ID0gKHkxICsgeTIpIC8gMjtcbiAgICByZXR1cm4ge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9O1xuICB9O1xuXG4gIHZhciBTd2VlcEV2ZW50ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBfY3JlYXRlQ2xhc3MoU3dlZXBFdmVudCwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJjb21wYXJlXCIsXG4gICAgICAvLyBmb3Igb3JkZXJpbmcgc3dlZXAgZXZlbnRzIGluIHRoZSBzd2VlcCBldmVudCBxdWV1ZVxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAgICAvLyBmYXZvciBldmVudCB3aXRoIGEgcG9pbnQgdGhhdCB0aGUgc3dlZXAgbGluZSBoaXRzIGZpcnN0XG4gICAgICAgIHZhciBwdENtcCA9IFN3ZWVwRXZlbnQuY29tcGFyZVBvaW50cyhhLnBvaW50LCBiLnBvaW50KTtcbiAgICAgICAgaWYgKHB0Q21wICE9PSAwKSByZXR1cm4gcHRDbXA7IC8vIHRoZSBwb2ludHMgYXJlIHRoZSBzYW1lLCBzbyBsaW5rIHRoZW0gaWYgbmVlZGVkXG5cbiAgICAgICAgaWYgKGEucG9pbnQgIT09IGIucG9pbnQpIGEubGluayhiKTsgLy8gZmF2b3IgcmlnaHQgZXZlbnRzIG92ZXIgbGVmdFxuXG4gICAgICAgIGlmIChhLmlzTGVmdCAhPT0gYi5pc0xlZnQpIHJldHVybiBhLmlzTGVmdCA/IDEgOiAtMTsgLy8gd2UgaGF2ZSB0d28gbWF0Y2hpbmcgbGVmdCBvciByaWdodCBlbmRwb2ludHNcbiAgICAgICAgLy8gb3JkZXJpbmcgb2YgdGhpcyBjYXNlIGlzIHRoZSBzYW1lIGFzIGZvciB0aGVpciBzZWdtZW50c1xuXG4gICAgICAgIHJldHVybiBTZWdtZW50LmNvbXBhcmUoYS5zZWdtZW50LCBiLnNlZ21lbnQpO1xuICAgICAgfSAvLyBmb3Igb3JkZXJpbmcgcG9pbnRzIGluIHN3ZWVwIGxpbmUgb3JkZXJcblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJjb21wYXJlUG9pbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGFyZVBvaW50cyhhUHQsIGJQdCkge1xuICAgICAgICBpZiAoYVB0LnggPCBiUHQueCkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYVB0LnggPiBiUHQueCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhUHQueSA8IGJQdC55KSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhUHQueSA+IGJQdC55KSByZXR1cm4gMTtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IC8vIFdhcm5pbmc6ICdwb2ludCcgaW5wdXQgd2lsbCBiZSBtb2RpZmllZCBhbmQgcmUtdXNlZCAoZm9yIHBlcmZvcm1hbmNlKVxuXG4gICAgfV0pO1xuXG4gICAgZnVuY3Rpb24gU3dlZXBFdmVudChwb2ludCwgaXNMZWZ0KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU3dlZXBFdmVudCk7XG5cbiAgICAgIGlmIChwb2ludC5ldmVudHMgPT09IHVuZGVmaW5lZCkgcG9pbnQuZXZlbnRzID0gW3RoaXNdO2Vsc2UgcG9pbnQuZXZlbnRzLnB1c2godGhpcyk7XG4gICAgICB0aGlzLnBvaW50ID0gcG9pbnQ7XG4gICAgICB0aGlzLmlzTGVmdCA9IGlzTGVmdDsgLy8gdGhpcy5zZWdtZW50LCB0aGlzLm90aGVyU0Ugc2V0IGJ5IGZhY3RvcnlcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU3dlZXBFdmVudCwgW3tcbiAgICAgIGtleTogXCJsaW5rXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gbGluayhvdGhlcikge1xuICAgICAgICBpZiAob3RoZXIucG9pbnQgPT09IHRoaXMucG9pbnQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RyaWVkIHRvIGxpbmsgYWxyZWFkeSBsaW5rZWQgZXZlbnRzJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3RoZXJFdmVudHMgPSBvdGhlci5wb2ludC5ldmVudHM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBvdGhlckV2ZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgZXZ0ID0gb3RoZXJFdmVudHNbaV07XG4gICAgICAgICAgdGhpcy5wb2ludC5ldmVudHMucHVzaChldnQpO1xuICAgICAgICAgIGV2dC5wb2ludCA9IHRoaXMucG9pbnQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNoZWNrRm9yQ29uc3VtaW5nKCk7XG4gICAgICB9XG4gICAgICAvKiBEbyBhIHBhc3Mgb3ZlciBvdXIgbGlua2VkIGV2ZW50cyBhbmQgY2hlY2sgdG8gc2VlIGlmIGFueSBwYWlyXG4gICAgICAgKiBvZiBzZWdtZW50cyBtYXRjaCwgYW5kIHNob3VsZCBiZSBjb25zdW1lZC4gKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJjaGVja0ZvckNvbnN1bWluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNoZWNrRm9yQ29uc3VtaW5nKCkge1xuICAgICAgICAvLyBGSVhNRTogVGhlIGxvb3BzIGluIHRoaXMgbWV0aG9kIHJ1biBPKG5eMikgPT4gbm8gZ29vZC5cbiAgICAgICAgLy8gICAgICAgIE1haW50YWluIGxpdHRsZSBvcmRlcmVkIHN3ZWVwIGV2ZW50IHRyZWVzP1xuICAgICAgICAvLyAgICAgICAgQ2FuIHdlIG1haW50YWluaW5nIGFuIG9yZGVyaW5nIHRoYXQgYXZvaWRzIHRoZSBuZWVkXG4gICAgICAgIC8vICAgICAgICBmb3IgdGhlIHJlLXNvcnRpbmcgd2l0aCBnZXRMZWZ0bW9zdENvbXBhcmF0b3IgaW4gZ2VvbS1vdXQ/XG4gICAgICAgIC8vIENvbXBhcmUgZWFjaCBwYWlyIG9mIGV2ZW50cyB0byBzZWUgaWYgb3RoZXIgZXZlbnRzIGFsc28gbWF0Y2hcbiAgICAgICAgdmFyIG51bUV2ZW50cyA9IHRoaXMucG9pbnQuZXZlbnRzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bUV2ZW50czsgaSsrKSB7XG4gICAgICAgICAgdmFyIGV2dDEgPSB0aGlzLnBvaW50LmV2ZW50c1tpXTtcbiAgICAgICAgICBpZiAoZXZ0MS5zZWdtZW50LmNvbnN1bWVkQnkgIT09IHVuZGVmaW5lZCkgY29udGludWU7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBudW1FdmVudHM7IGorKykge1xuICAgICAgICAgICAgdmFyIGV2dDIgPSB0aGlzLnBvaW50LmV2ZW50c1tqXTtcbiAgICAgICAgICAgIGlmIChldnQyLmNvbnN1bWVkQnkgIT09IHVuZGVmaW5lZCkgY29udGludWU7XG4gICAgICAgICAgICBpZiAoZXZ0MS5vdGhlclNFLnBvaW50LmV2ZW50cyAhPT0gZXZ0Mi5vdGhlclNFLnBvaW50LmV2ZW50cykgY29udGludWU7XG4gICAgICAgICAgICBldnQxLnNlZ21lbnQuY29uc3VtZShldnQyLnNlZ21lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRBdmFpbGFibGVMaW5rZWRFdmVudHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRBdmFpbGFibGVMaW5rZWRFdmVudHMoKSB7XG4gICAgICAgIC8vIHBvaW50LmV2ZW50cyBpcyBhbHdheXMgb2YgbGVuZ3RoIDIgb3IgZ3JlYXRlclxuICAgICAgICB2YXIgZXZlbnRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLnBvaW50LmV2ZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgZXZ0ID0gdGhpcy5wb2ludC5ldmVudHNbaV07XG5cbiAgICAgICAgICBpZiAoZXZ0ICE9PSB0aGlzICYmICFldnQuc2VnbWVudC5yaW5nT3V0ICYmIGV2dC5zZWdtZW50LmlzSW5SZXN1bHQoKSkge1xuICAgICAgICAgICAgZXZlbnRzLnB1c2goZXZ0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZXZlbnRzO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIGEgY29tcGFyYXRvciBmdW5jdGlvbiBmb3Igc29ydGluZyBsaW5rZWQgZXZlbnRzIHRoYXQgd2lsbFxuICAgICAgICogZmF2b3IgdGhlIGV2ZW50IHRoYXQgd2lsbCBnaXZlIHVzIHRoZSBzbWFsbGVzdCBsZWZ0LXNpZGUgYW5nbGUuXG4gICAgICAgKiBBbGwgcmluZyBjb25zdHJ1Y3Rpb24gc3RhcnRzIGFzIGxvdyBhcyBwb3NzaWJsZSBoZWFkaW5nIHRvIHRoZSByaWdodCxcbiAgICAgICAqIHNvIGJ5IGFsd2F5cyB0dXJuaW5nIGxlZnQgYXMgc2hhcnAgYXMgcG9zc2libGUgd2UnbGwgZ2V0IHBvbHlnb25zXG4gICAgICAgKiB3aXRob3V0IHVuY2Vzc2FyeSBsb29wcyAmIGhvbGVzLlxuICAgICAgICpcbiAgICAgICAqIFRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uIGhhcyBhIGNvbXB1dGUgY2FjaGUgc3VjaCB0aGF0IGl0IGF2b2lkc1xuICAgICAgICogcmUtY29tcHV0aW5nIGFscmVhZHktY29tcHV0ZWQgdmFsdWVzLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0TGVmdG1vc3RDb21wYXJhdG9yXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0TGVmdG1vc3RDb21wYXJhdG9yKGJhc2VFdmVudCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciBjYWNoZSA9IG5ldyBNYXAoKTtcblxuICAgICAgICB2YXIgZmlsbENhY2hlID0gZnVuY3Rpb24gZmlsbENhY2hlKGxpbmtlZEV2ZW50KSB7XG4gICAgICAgICAgdmFyIG5leHRFdmVudCA9IGxpbmtlZEV2ZW50Lm90aGVyU0U7XG4gICAgICAgICAgY2FjaGUuc2V0KGxpbmtlZEV2ZW50LCB7XG4gICAgICAgICAgICBzaW5lOiBzaW5lT2ZBbmdsZShfdGhpcy5wb2ludCwgYmFzZUV2ZW50LnBvaW50LCBuZXh0RXZlbnQucG9pbnQpLFxuICAgICAgICAgICAgY29zaW5lOiBjb3NpbmVPZkFuZ2xlKF90aGlzLnBvaW50LCBiYXNlRXZlbnQucG9pbnQsIG5leHRFdmVudC5wb2ludClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICBpZiAoIWNhY2hlLmhhcyhhKSkgZmlsbENhY2hlKGEpO1xuICAgICAgICAgIGlmICghY2FjaGUuaGFzKGIpKSBmaWxsQ2FjaGUoYik7XG5cbiAgICAgICAgICB2YXIgX2NhY2hlJGdldCA9IGNhY2hlLmdldChhKSxcbiAgICAgICAgICAgICAgYXNpbmUgPSBfY2FjaGUkZ2V0LnNpbmUsXG4gICAgICAgICAgICAgIGFjb3NpbmUgPSBfY2FjaGUkZ2V0LmNvc2luZTtcblxuICAgICAgICAgIHZhciBfY2FjaGUkZ2V0MiA9IGNhY2hlLmdldChiKSxcbiAgICAgICAgICAgICAgYnNpbmUgPSBfY2FjaGUkZ2V0Mi5zaW5lLFxuICAgICAgICAgICAgICBiY29zaW5lID0gX2NhY2hlJGdldDIuY29zaW5lOyAvLyBib3RoIG9uIG9yIGFib3ZlIHgtYXhpc1xuXG5cbiAgICAgICAgICBpZiAoYXNpbmUgPj0gMCAmJiBic2luZSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoYWNvc2luZSA8IGJjb3NpbmUpIHJldHVybiAxO1xuICAgICAgICAgICAgaWYgKGFjb3NpbmUgPiBiY29zaW5lKSByZXR1cm4gLTE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9IC8vIGJvdGggYmVsb3cgeC1heGlzXG5cblxuICAgICAgICAgIGlmIChhc2luZSA8IDAgJiYgYnNpbmUgPCAwKSB7XG4gICAgICAgICAgICBpZiAoYWNvc2luZSA8IGJjb3NpbmUpIHJldHVybiAtMTtcbiAgICAgICAgICAgIGlmIChhY29zaW5lID4gYmNvc2luZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9IC8vIG9uZSBhYm92ZSB4LWF4aXMsIG9uZSBiZWxvd1xuXG5cbiAgICAgICAgICBpZiAoYnNpbmUgPCBhc2luZSkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChic2luZSA+IGFzaW5lKSByZXR1cm4gMTtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gU3dlZXBFdmVudDtcbiAgfSgpO1xuXG4gIC8vIHNlZ21lbnRzIGFuZCBzd2VlcCBldmVudHMgd2hlbiBhbGwgZWxzZSBpcyBpZGVudGljYWxcblxuICB2YXIgc2VnbWVudElkID0gMDtcblxuICB2YXIgU2VnbWVudCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgX2NyZWF0ZUNsYXNzKFNlZ21lbnQsIG51bGwsIFt7XG4gICAgICBrZXk6IFwiY29tcGFyZVwiLFxuXG4gICAgICAvKiBUaGlzIGNvbXBhcmUoKSBmdW5jdGlvbiBpcyBmb3Igb3JkZXJpbmcgc2VnbWVudHMgaW4gdGhlIHN3ZWVwXG4gICAgICAgKiBsaW5lIHRyZWUsIGFuZCBkb2VzIHNvIGFjY29yZGluZyB0byB0aGUgZm9sbG93aW5nIGNyaXRlcmlhOlxuICAgICAgICpcbiAgICAgICAqIENvbnNpZGVyIHRoZSB2ZXJ0aWNhbCBsaW5lIHRoYXQgbGllcyBhbiBpbmZpbmVzdGltYWwgc3RlcCB0byB0aGVcbiAgICAgICAqIHJpZ2h0IG9mIHRoZSByaWdodC1tb3JlIG9mIHRoZSB0d28gbGVmdCBlbmRwb2ludHMgb2YgdGhlIGlucHV0XG4gICAgICAgKiBzZWdtZW50cy4gSW1hZ2luZSBzbG93bHkgbW92aW5nIGEgcG9pbnQgdXAgZnJvbSBuZWdhdGl2ZSBpbmZpbml0eVxuICAgICAgICogaW4gdGhlIGluY3JlYXNpbmcgeSBkaXJlY3Rpb24uIFdoaWNoIG9mIHRoZSB0d28gc2VnbWVudHMgd2lsbCB0aGF0XG4gICAgICAgKiBwb2ludCBpbnRlcnNlY3QgZmlyc3Q/IFRoYXQgc2VnbWVudCBjb21lcyAnYmVmb3JlJyB0aGUgb3RoZXIgb25lLlxuICAgICAgICpcbiAgICAgICAqIElmIG5laXRoZXIgc2VnbWVudCB3b3VsZCBiZSBpbnRlcnNlY3RlZCBieSBzdWNoIGEgbGluZSwgKGlmIG9uZVxuICAgICAgICogb3IgbW9yZSBvZiB0aGUgc2VnbWVudHMgYXJlIHZlcnRpY2FsKSB0aGVuIHRoZSBsaW5lIHRvIGJlIGNvbnNpZGVyZWRcbiAgICAgICAqIGlzIGRpcmVjdGx5IG9uIHRoZSByaWdodC1tb3JlIG9mIHRoZSB0d28gbGVmdCBpbnB1dHMuXG4gICAgICAgKi9cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgICAgICAgdmFyIGFseCA9IGEubGVmdFNFLnBvaW50Lng7XG4gICAgICAgIHZhciBibHggPSBiLmxlZnRTRS5wb2ludC54O1xuICAgICAgICB2YXIgYXJ4ID0gYS5yaWdodFNFLnBvaW50Lng7XG4gICAgICAgIHZhciBicnggPSBiLnJpZ2h0U0UucG9pbnQueDsgLy8gY2hlY2sgaWYgdGhleSdyZSBldmVuIGluIHRoZSBzYW1lIHZlcnRpY2FsIHBsYW5lXG5cbiAgICAgICAgaWYgKGJyeCA8IGFseCkgcmV0dXJuIDE7XG4gICAgICAgIGlmIChhcnggPCBibHgpIHJldHVybiAtMTtcbiAgICAgICAgdmFyIGFseSA9IGEubGVmdFNFLnBvaW50Lnk7XG4gICAgICAgIHZhciBibHkgPSBiLmxlZnRTRS5wb2ludC55O1xuICAgICAgICB2YXIgYXJ5ID0gYS5yaWdodFNFLnBvaW50Lnk7XG4gICAgICAgIHZhciBicnkgPSBiLnJpZ2h0U0UucG9pbnQueTsgLy8gaXMgbGVmdCBlbmRwb2ludCBvZiBzZWdtZW50IEIgdGhlIHJpZ2h0LW1vcmU/XG5cbiAgICAgICAgaWYgKGFseCA8IGJseCkge1xuICAgICAgICAgIC8vIGFyZSB0aGUgdHdvIHNlZ21lbnRzIGluIHRoZSBzYW1lIGhvcml6b250YWwgcGxhbmU/XG4gICAgICAgICAgaWYgKGJseSA8IGFseSAmJiBibHkgPCBhcnkpIHJldHVybiAxO1xuICAgICAgICAgIGlmIChibHkgPiBhbHkgJiYgYmx5ID4gYXJ5KSByZXR1cm4gLTE7IC8vIGlzIHRoZSBCIGxlZnQgZW5kcG9pbnQgY29saW5lYXIgdG8gc2VnbWVudCBBP1xuXG4gICAgICAgICAgdmFyIGFDbXBCTGVmdCA9IGEuY29tcGFyZVBvaW50KGIubGVmdFNFLnBvaW50KTtcbiAgICAgICAgICBpZiAoYUNtcEJMZWZ0IDwgMCkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGFDbXBCTGVmdCA+IDApIHJldHVybiAtMTsgLy8gaXMgdGhlIEEgcmlnaHQgZW5kcG9pbnQgY29saW5lYXIgdG8gc2VnbWVudCBCID9cblxuICAgICAgICAgIHZhciBiQ21wQVJpZ2h0ID0gYi5jb21wYXJlUG9pbnQoYS5yaWdodFNFLnBvaW50KTtcbiAgICAgICAgICBpZiAoYkNtcEFSaWdodCAhPT0gMCkgcmV0dXJuIGJDbXBBUmlnaHQ7IC8vIGNvbGluZWFyIHNlZ21lbnRzLCBjb25zaWRlciB0aGUgb25lIHdpdGggbGVmdC1tb3JlXG4gICAgICAgICAgLy8gbGVmdCBlbmRwb2ludCB0byBiZSBmaXJzdCAoYXJiaXRyYXJ5PylcblxuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSAvLyBpcyBsZWZ0IGVuZHBvaW50IG9mIHNlZ21lbnQgQSB0aGUgcmlnaHQtbW9yZT9cblxuXG4gICAgICAgIGlmIChhbHggPiBibHgpIHtcbiAgICAgICAgICBpZiAoYWx5IDwgYmx5ICYmIGFseSA8IGJyeSkgcmV0dXJuIC0xO1xuICAgICAgICAgIGlmIChhbHkgPiBibHkgJiYgYWx5ID4gYnJ5KSByZXR1cm4gMTsgLy8gaXMgdGhlIEEgbGVmdCBlbmRwb2ludCBjb2xpbmVhciB0byBzZWdtZW50IEI/XG5cbiAgICAgICAgICB2YXIgYkNtcEFMZWZ0ID0gYi5jb21wYXJlUG9pbnQoYS5sZWZ0U0UucG9pbnQpO1xuICAgICAgICAgIGlmIChiQ21wQUxlZnQgIT09IDApIHJldHVybiBiQ21wQUxlZnQ7IC8vIGlzIHRoZSBCIHJpZ2h0IGVuZHBvaW50IGNvbGluZWFyIHRvIHNlZ21lbnQgQT9cblxuICAgICAgICAgIHZhciBhQ21wQlJpZ2h0ID0gYS5jb21wYXJlUG9pbnQoYi5yaWdodFNFLnBvaW50KTtcbiAgICAgICAgICBpZiAoYUNtcEJSaWdodCA8IDApIHJldHVybiAxO1xuICAgICAgICAgIGlmIChhQ21wQlJpZ2h0ID4gMCkgcmV0dXJuIC0xOyAvLyBjb2xpbmVhciBzZWdtZW50cywgY29uc2lkZXIgdGhlIG9uZSB3aXRoIGxlZnQtbW9yZVxuICAgICAgICAgIC8vIGxlZnQgZW5kcG9pbnQgdG8gYmUgZmlyc3QgKGFyYml0cmFyeT8pXG5cbiAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfSAvLyBpZiB3ZSBnZXQgaGVyZSwgdGhlIHR3byBsZWZ0IGVuZHBvaW50cyBhcmUgaW4gdGhlIHNhbWVcbiAgICAgICAgLy8gdmVydGljYWwgcGxhbmUsIGllIGFseCA9PT0gYmx4XG4gICAgICAgIC8vIGNvbnNpZGVyIHRoZSBsb3dlciBsZWZ0LWVuZHBvaW50IHRvIGNvbWUgZmlyc3RcblxuXG4gICAgICAgIGlmIChhbHkgPCBibHkpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFseSA+IGJseSkgcmV0dXJuIDE7IC8vIGxlZnQgZW5kcG9pbnRzIGFyZSBpZGVudGljYWxcbiAgICAgICAgLy8gY2hlY2sgZm9yIGNvbGluZWFyaXR5IGJ5IHVzaW5nIHRoZSBsZWZ0LW1vcmUgcmlnaHQgZW5kcG9pbnRcbiAgICAgICAgLy8gaXMgdGhlIEEgcmlnaHQgZW5kcG9pbnQgbW9yZSBsZWZ0LW1vcmU/XG5cbiAgICAgICAgaWYgKGFyeCA8IGJyeCkge1xuICAgICAgICAgIHZhciBfYkNtcEFSaWdodCA9IGIuY29tcGFyZVBvaW50KGEucmlnaHRTRS5wb2ludCk7XG5cbiAgICAgICAgICBpZiAoX2JDbXBBUmlnaHQgIT09IDApIHJldHVybiBfYkNtcEFSaWdodDtcbiAgICAgICAgfSAvLyBpcyB0aGUgQiByaWdodCBlbmRwb2ludCBtb3JlIGxlZnQtbW9yZT9cblxuXG4gICAgICAgIGlmIChhcnggPiBicngpIHtcbiAgICAgICAgICB2YXIgX2FDbXBCUmlnaHQgPSBhLmNvbXBhcmVQb2ludChiLnJpZ2h0U0UucG9pbnQpO1xuXG4gICAgICAgICAgaWYgKF9hQ21wQlJpZ2h0IDwgMCkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKF9hQ21wQlJpZ2h0ID4gMCkgcmV0dXJuIC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFyeCAhPT0gYnJ4KSB7XG4gICAgICAgICAgLy8gYXJlIHRoZXNlIHR3byBbYWxtb3N0XSB2ZXJ0aWNhbCBzZWdtZW50cyB3aXRoIG9wcG9zaXRlIG9yaWVudGF0aW9uP1xuICAgICAgICAgIC8vIGlmIHNvLCB0aGUgb25lIHdpdGggdGhlIGxvd2VyIHJpZ2h0IGVuZHBvaW50IGNvbWVzIGZpcnN0XG4gICAgICAgICAgdmFyIGF5ID0gYXJ5IC0gYWx5O1xuICAgICAgICAgIHZhciBheCA9IGFyeCAtIGFseDtcbiAgICAgICAgICB2YXIgYnkgPSBicnkgLSBibHk7XG4gICAgICAgICAgdmFyIGJ4ID0gYnJ4IC0gYmx4O1xuICAgICAgICAgIGlmIChheSA+IGF4ICYmIGJ5IDwgYngpIHJldHVybiAxO1xuICAgICAgICAgIGlmIChheSA8IGF4ICYmIGJ5ID4gYngpIHJldHVybiAtMTtcbiAgICAgICAgfSAvLyB3ZSBoYXZlIGNvbGluZWFyIHNlZ21lbnRzIHdpdGggbWF0Y2hpbmcgb3JpZW50YXRpb25cbiAgICAgICAgLy8gY29uc2lkZXIgdGhlIG9uZSB3aXRoIG1vcmUgbGVmdC1tb3JlIHJpZ2h0IGVuZHBvaW50IHRvIGJlIGZpcnN0XG5cblxuICAgICAgICBpZiAoYXJ4ID4gYnJ4KSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGFyeCA8IGJyeCkgcmV0dXJuIC0xOyAvLyBpZiB3ZSBnZXQgaGVyZSwgdHdvIHR3byByaWdodCBlbmRwb2ludHMgYXJlIGluIHRoZSBzYW1lXG4gICAgICAgIC8vIHZlcnRpY2FsIHBsYW5lLCBpZSBhcnggPT09IGJyeFxuICAgICAgICAvLyBjb25zaWRlciB0aGUgbG93ZXIgcmlnaHQtZW5kcG9pbnQgdG8gY29tZSBmaXJzdFxuXG4gICAgICAgIGlmIChhcnkgPCBicnkpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFyeSA+IGJyeSkgcmV0dXJuIDE7IC8vIHJpZ2h0IGVuZHBvaW50cyBpZGVudGljYWwgYXMgd2VsbCwgc28gdGhlIHNlZ21lbnRzIGFyZSBpZGVudGlhbFxuICAgICAgICAvLyBmYWxsIGJhY2sgb24gY3JlYXRpb24gb3JkZXIgYXMgY29uc2lzdGVudCB0aWUtYnJlYWtlclxuXG4gICAgICAgIGlmIChhLmlkIDwgYi5pZCkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYS5pZCA+IGIuaWQpIHJldHVybiAxOyAvLyBpZGVudGljYWwgc2VnbWVudCwgaWUgYSA9PT0gYlxuXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgLyogV2FybmluZzogYSByZWZlcmVuY2UgdG8gcmluZ1dpbmRpbmdzIGlucHV0IHdpbGwgYmUgc3RvcmVkLFxuICAgICAgICogIGFuZCBwb3NzaWJseSB3aWxsIGJlIGxhdGVyIG1vZGlmaWVkICovXG5cbiAgICB9XSk7XG5cbiAgICBmdW5jdGlvbiBTZWdtZW50KGxlZnRTRSwgcmlnaHRTRSwgcmluZ3MsIHdpbmRpbmdzKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgU2VnbWVudCk7XG5cbiAgICAgIHRoaXMuaWQgPSArK3NlZ21lbnRJZDtcbiAgICAgIHRoaXMubGVmdFNFID0gbGVmdFNFO1xuICAgICAgbGVmdFNFLnNlZ21lbnQgPSB0aGlzO1xuICAgICAgbGVmdFNFLm90aGVyU0UgPSByaWdodFNFO1xuICAgICAgdGhpcy5yaWdodFNFID0gcmlnaHRTRTtcbiAgICAgIHJpZ2h0U0Uuc2VnbWVudCA9IHRoaXM7XG4gICAgICByaWdodFNFLm90aGVyU0UgPSBsZWZ0U0U7XG4gICAgICB0aGlzLnJpbmdzID0gcmluZ3M7XG4gICAgICB0aGlzLndpbmRpbmdzID0gd2luZGluZ3M7IC8vIGxlZnQgdW5zZXQgZm9yIHBlcmZvcm1hbmNlLCBzZXQgbGF0ZXIgaW4gYWxnb3JpdGhtXG4gICAgICAvLyB0aGlzLnJpbmdPdXQsIHRoaXMuY29uc3VtZWRCeSwgdGhpcy5wcmV2XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFNlZ21lbnQsIFt7XG4gICAgICBrZXk6IFwicmVwbGFjZVJpZ2h0U0VcIixcblxuICAgICAgLyogV2hlbiBhIHNlZ21lbnQgaXMgc3BsaXQsIHRoZSByaWdodFNFIGlzIHJlcGxhY2VkIHdpdGggYSBuZXcgc3dlZXAgZXZlbnQgKi9cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiByZXBsYWNlUmlnaHRTRShuZXdSaWdodFNFKSB7XG4gICAgICAgIHRoaXMucmlnaHRTRSA9IG5ld1JpZ2h0U0U7XG4gICAgICAgIHRoaXMucmlnaHRTRS5zZWdtZW50ID0gdGhpcztcbiAgICAgICAgdGhpcy5yaWdodFNFLm90aGVyU0UgPSB0aGlzLmxlZnRTRTtcbiAgICAgICAgdGhpcy5sZWZ0U0Uub3RoZXJTRSA9IHRoaXMucmlnaHRTRTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYmJveFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGJib3goKSB7XG4gICAgICAgIHZhciB5MSA9IHRoaXMubGVmdFNFLnBvaW50Lnk7XG4gICAgICAgIHZhciB5MiA9IHRoaXMucmlnaHRTRS5wb2ludC55O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxsOiB7XG4gICAgICAgICAgICB4OiB0aGlzLmxlZnRTRS5wb2ludC54LFxuICAgICAgICAgICAgeTogeTEgPCB5MiA/IHkxIDogeTJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVyOiB7XG4gICAgICAgICAgICB4OiB0aGlzLnJpZ2h0U0UucG9pbnQueCxcbiAgICAgICAgICAgIHk6IHkxID4geTIgPyB5MSA6IHkyXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgLyogQSB2ZWN0b3IgZnJvbSB0aGUgbGVmdCBwb2ludCB0byB0aGUgcmlnaHQgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJ2ZWN0b3JcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB2ZWN0b3IoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgeDogdGhpcy5yaWdodFNFLnBvaW50LnggLSB0aGlzLmxlZnRTRS5wb2ludC54LFxuICAgICAgICAgIHk6IHRoaXMucmlnaHRTRS5wb2ludC55IC0gdGhpcy5sZWZ0U0UucG9pbnQueVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJpc0FuRW5kcG9pbnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0FuRW5kcG9pbnQocHQpIHtcbiAgICAgICAgcmV0dXJuIHB0LnggPT09IHRoaXMubGVmdFNFLnBvaW50LnggJiYgcHQueSA9PT0gdGhpcy5sZWZ0U0UucG9pbnQueSB8fCBwdC54ID09PSB0aGlzLnJpZ2h0U0UucG9pbnQueCAmJiBwdC55ID09PSB0aGlzLnJpZ2h0U0UucG9pbnQueTtcbiAgICAgIH1cbiAgICAgIC8qIENvbXBhcmUgdGhpcyBzZWdtZW50IHdpdGggYSBwb2ludC5cbiAgICAgICAqXG4gICAgICAgKiBBIHBvaW50IFAgaXMgY29uc2lkZXJlZCB0byBiZSBjb2xpbmVhciB0byBhIHNlZ21lbnQgaWYgdGhlcmVcbiAgICAgICAqIGV4aXN0cyBhIGRpc3RhbmNlIEQgc3VjaCB0aGF0IGlmIHdlIHRyYXZlbCBhbG9uZyB0aGUgc2VnbWVudFxuICAgICAgICogZnJvbSBvbmUgKiBlbmRwb2ludCB0b3dhcmRzIHRoZSBvdGhlciBhIGRpc3RhbmNlIEQsIHdlIGZpbmRcbiAgICAgICAqIG91cnNlbHZlcyBhdCBwb2ludCBQLlxuICAgICAgICpcbiAgICAgICAqIFJldHVybiB2YWx1ZSBpbmRpY2F0ZXM6XG4gICAgICAgKlxuICAgICAgICogICAxOiBwb2ludCBsaWVzIGFib3ZlIHRoZSBzZWdtZW50ICh0byB0aGUgbGVmdCBvZiB2ZXJ0aWNhbClcbiAgICAgICAqICAgMDogcG9pbnQgaXMgY29saW5lYXIgdG8gc2VnbWVudFxuICAgICAgICogIC0xOiBwb2ludCBsaWVzIGJlbG93IHRoZSBzZWdtZW50ICh0byB0aGUgcmlnaHQgb2YgdmVydGljYWwpXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJjb21wYXJlUG9pbnRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wYXJlUG9pbnQocG9pbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNBbkVuZHBvaW50KHBvaW50KSkgcmV0dXJuIDA7XG4gICAgICAgIHZhciBsUHQgPSB0aGlzLmxlZnRTRS5wb2ludDtcbiAgICAgICAgdmFyIHJQdCA9IHRoaXMucmlnaHRTRS5wb2ludDtcbiAgICAgICAgdmFyIHYgPSB0aGlzLnZlY3RvcigpOyAvLyBFeGFjdGx5IHZlcnRpY2FsIHNlZ21lbnRzLlxuXG4gICAgICAgIGlmIChsUHQueCA9PT0gclB0LngpIHtcbiAgICAgICAgICBpZiAocG9pbnQueCA9PT0gbFB0LngpIHJldHVybiAwO1xuICAgICAgICAgIHJldHVybiBwb2ludC54IDwgbFB0LnggPyAxIDogLTE7XG4gICAgICAgIH0gLy8gTmVhcmx5IHZlcnRpY2FsIHNlZ21lbnRzIHdpdGggYW4gaW50ZXJzZWN0aW9uLlxuICAgICAgICAvLyBDaGVjayB0byBzZWUgd2hlcmUgYSBwb2ludCBvbiB0aGUgbGluZSB3aXRoIG1hdGNoaW5nIFkgY29vcmRpbmF0ZSBpcy5cblxuXG4gICAgICAgIHZhciB5RGlzdCA9IChwb2ludC55IC0gbFB0LnkpIC8gdi55O1xuICAgICAgICB2YXIgeEZyb21ZRGlzdCA9IGxQdC54ICsgeURpc3QgKiB2Lng7XG4gICAgICAgIGlmIChwb2ludC54ID09PSB4RnJvbVlEaXN0KSByZXR1cm4gMDsgLy8gR2VuZXJhbCBjYXNlLlxuICAgICAgICAvLyBDaGVjayB0byBzZWUgd2hlcmUgYSBwb2ludCBvbiB0aGUgbGluZSB3aXRoIG1hdGNoaW5nIFggY29vcmRpbmF0ZSBpcy5cblxuICAgICAgICB2YXIgeERpc3QgPSAocG9pbnQueCAtIGxQdC54KSAvIHYueDtcbiAgICAgICAgdmFyIHlGcm9tWERpc3QgPSBsUHQueSArIHhEaXN0ICogdi55O1xuICAgICAgICBpZiAocG9pbnQueSA9PT0geUZyb21YRGlzdCkgcmV0dXJuIDA7XG4gICAgICAgIHJldHVybiBwb2ludC55IDwgeUZyb21YRGlzdCA/IC0xIDogMTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogR2l2ZW4gYW5vdGhlciBzZWdtZW50LCByZXR1cm5zIHRoZSBmaXJzdCBub24tdHJpdmlhbCBpbnRlcnNlY3Rpb25cbiAgICAgICAqIGJldHdlZW4gdGhlIHR3byBzZWdtZW50cyAoaW4gdGVybXMgb2Ygc3dlZXAgbGluZSBvcmRlcmluZyksIGlmIGl0IGV4aXN0cy5cbiAgICAgICAqXG4gICAgICAgKiBBICdub24tdHJpdmlhbCcgaW50ZXJzZWN0aW9uIGlzIG9uZSB0aGF0IHdpbGwgY2F1c2Ugb25lIG9yIGJvdGggb2YgdGhlXG4gICAgICAgKiBzZWdtZW50cyB0byBiZSBzcGxpdCgpLiBBcyBzdWNoLCAndHJpdmlhbCcgdnMuICdub24tdHJpdmlhbCcgaW50ZXJzZWN0aW9uOlxuICAgICAgICpcbiAgICAgICAqICAgKiBlbmRwb2ludCBvZiBzZWdBIHdpdGggZW5kcG9pbnQgb2Ygc2VnQiAtLT4gdHJpdmlhbFxuICAgICAgICogICAqIGVuZHBvaW50IG9mIHNlZ0Egd2l0aCBwb2ludCBhbG9uZyBzZWdCIC0tPiBub24tdHJpdmlhbFxuICAgICAgICogICAqIGVuZHBvaW50IG9mIHNlZ0Igd2l0aCBwb2ludCBhbG9uZyBzZWdBIC0tPiBub24tdHJpdmlhbFxuICAgICAgICogICAqIHBvaW50IGFsb25nIHNlZ0Egd2l0aCBwb2ludCBhbG9uZyBzZWdCIC0tPiBub24tdHJpdmlhbFxuICAgICAgICpcbiAgICAgICAqIElmIG5vIG5vbi10cml2aWFsIGludGVyc2VjdGlvbiBleGlzdHMsIHJldHVybiBudWxsXG4gICAgICAgKiBFbHNlLCByZXR1cm4gbnVsbC5cbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImdldEludGVyc2VjdGlvblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEludGVyc2VjdGlvbihvdGhlcikge1xuICAgICAgICAvLyBJZiBiYm94ZXMgZG9uJ3Qgb3ZlcmxhcCwgdGhlcmUgY2FuJ3QgYmUgYW55IGludGVyc2VjdGlvbnNcbiAgICAgICAgdmFyIHRCYm94ID0gdGhpcy5iYm94KCk7XG4gICAgICAgIHZhciBvQmJveCA9IG90aGVyLmJib3goKTtcbiAgICAgICAgdmFyIGJib3hPdmVybGFwID0gZ2V0QmJveE92ZXJsYXAodEJib3gsIG9CYm94KTtcbiAgICAgICAgaWYgKGJib3hPdmVybGFwID09PSBudWxsKSByZXR1cm4gbnVsbDsgLy8gV2UgZmlyc3QgY2hlY2sgdG8gc2VlIGlmIHRoZSBlbmRwb2ludHMgY2FuIGJlIGNvbnNpZGVyZWQgaW50ZXJzZWN0aW9ucy5cbiAgICAgICAgLy8gVGhpcyB3aWxsICdzbmFwJyBpbnRlcnNlY3Rpb25zIHRvIGVuZHBvaW50cyBpZiBwb3NzaWJsZSwgYW5kIHdpbGxcbiAgICAgICAgLy8gaGFuZGxlIGNhc2VzIG9mIGNvbGluZWFyaXR5LlxuXG4gICAgICAgIHZhciB0bHAgPSB0aGlzLmxlZnRTRS5wb2ludDtcbiAgICAgICAgdmFyIHRycCA9IHRoaXMucmlnaHRTRS5wb2ludDtcbiAgICAgICAgdmFyIG9scCA9IG90aGVyLmxlZnRTRS5wb2ludDtcbiAgICAgICAgdmFyIG9ycCA9IG90aGVyLnJpZ2h0U0UucG9pbnQ7IC8vIGRvZXMgZWFjaCBlbmRwb2ludCB0b3VjaCB0aGUgb3RoZXIgc2VnbWVudD9cbiAgICAgICAgLy8gbm90ZSB0aGF0IHdlIHJlc3RyaWN0IHRoZSAndG91Y2hpbmcnIGRlZmluaXRpb24gdG8gb25seSBhbGxvdyBzZWdtZW50c1xuICAgICAgICAvLyB0byB0b3VjaCBlbmRwb2ludHMgdGhhdCBsaWUgZm9yd2FyZCBmcm9tIHdoZXJlIHdlIGFyZSBpbiB0aGUgc3dlZXAgbGluZSBwYXNzXG5cbiAgICAgICAgdmFyIHRvdWNoZXNPdGhlckxTRSA9IGlzSW5CYm94KHRCYm94LCBvbHApICYmIHRoaXMuY29tcGFyZVBvaW50KG9scCkgPT09IDA7XG4gICAgICAgIHZhciB0b3VjaGVzVGhpc0xTRSA9IGlzSW5CYm94KG9CYm94LCB0bHApICYmIG90aGVyLmNvbXBhcmVQb2ludCh0bHApID09PSAwO1xuICAgICAgICB2YXIgdG91Y2hlc090aGVyUlNFID0gaXNJbkJib3godEJib3gsIG9ycCkgJiYgdGhpcy5jb21wYXJlUG9pbnQob3JwKSA9PT0gMDtcbiAgICAgICAgdmFyIHRvdWNoZXNUaGlzUlNFID0gaXNJbkJib3gob0Jib3gsIHRycCkgJiYgb3RoZXIuY29tcGFyZVBvaW50KHRycCkgPT09IDA7IC8vIGRvIGxlZnQgZW5kcG9pbnRzIG1hdGNoP1xuXG4gICAgICAgIGlmICh0b3VjaGVzVGhpc0xTRSAmJiB0b3VjaGVzT3RoZXJMU0UpIHtcbiAgICAgICAgICAvLyB0aGVzZSB0d28gY2FzZXMgYXJlIGZvciBjb2xpbmVhciBzZWdtZW50cyB3aXRoIG1hdGNoaW5nIGxlZnRcbiAgICAgICAgICAvLyBlbmRwb2ludHMsIGFuZCBvbmUgc2VnbWVudCBiZWluZyBsb25nZXIgdGhhbiB0aGUgb3RoZXJcbiAgICAgICAgICBpZiAodG91Y2hlc1RoaXNSU0UgJiYgIXRvdWNoZXNPdGhlclJTRSkgcmV0dXJuIHRycDtcbiAgICAgICAgICBpZiAoIXRvdWNoZXNUaGlzUlNFICYmIHRvdWNoZXNPdGhlclJTRSkgcmV0dXJuIG9ycDsgLy8gZWl0aGVyIHRoZSB0d28gc2VnbWVudHMgbWF0Y2ggZXhhY3RseSAodHdvIHRyaXZhbCBpbnRlcnNlY3Rpb25zKVxuICAgICAgICAgIC8vIG9yIGp1c3Qgb24gdGhlaXIgbGVmdCBlbmRwb2ludCAob25lIHRyaXZpYWwgaW50ZXJzZWN0aW9uXG5cbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSAvLyBkb2VzIHRoaXMgbGVmdCBlbmRwb2ludCBtYXRjaGVzIChvdGhlciBkb2Vzbid0KVxuXG5cbiAgICAgICAgaWYgKHRvdWNoZXNUaGlzTFNFKSB7XG4gICAgICAgICAgLy8gY2hlY2sgZm9yIHNlZ21lbnRzIHRoYXQganVzdCBpbnRlcnNlY3Qgb24gb3Bwb3NpbmcgZW5kcG9pbnRzXG4gICAgICAgICAgaWYgKHRvdWNoZXNPdGhlclJTRSkge1xuICAgICAgICAgICAgaWYgKHRscC54ID09PSBvcnAueCAmJiB0bHAueSA9PT0gb3JwLnkpIHJldHVybiBudWxsO1xuICAgICAgICAgIH0gLy8gdC1pbnRlcnNlY3Rpb24gb24gbGVmdCBlbmRwb2ludFxuXG5cbiAgICAgICAgICByZXR1cm4gdGxwO1xuICAgICAgICB9IC8vIGRvZXMgb3RoZXIgbGVmdCBlbmRwb2ludCBtYXRjaGVzICh0aGlzIGRvZXNuJ3QpXG5cblxuICAgICAgICBpZiAodG91Y2hlc090aGVyTFNFKSB7XG4gICAgICAgICAgLy8gY2hlY2sgZm9yIHNlZ21lbnRzIHRoYXQganVzdCBpbnRlcnNlY3Qgb24gb3Bwb3NpbmcgZW5kcG9pbnRzXG4gICAgICAgICAgaWYgKHRvdWNoZXNUaGlzUlNFKSB7XG4gICAgICAgICAgICBpZiAodHJwLnggPT09IG9scC54ICYmIHRycC55ID09PSBvbHAueSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSAvLyB0LWludGVyc2VjdGlvbiBvbiBsZWZ0IGVuZHBvaW50XG5cblxuICAgICAgICAgIHJldHVybiBvbHA7XG4gICAgICAgIH0gLy8gdHJpdmlhbCBpbnRlcnNlY3Rpb24gb24gcmlnaHQgZW5kcG9pbnRzXG5cblxuICAgICAgICBpZiAodG91Y2hlc1RoaXNSU0UgJiYgdG91Y2hlc090aGVyUlNFKSByZXR1cm4gbnVsbDsgLy8gdC1pbnRlcnNlY3Rpb25zIG9uIGp1c3Qgb25lIHJpZ2h0IGVuZHBvaW50XG5cbiAgICAgICAgaWYgKHRvdWNoZXNUaGlzUlNFKSByZXR1cm4gdHJwO1xuICAgICAgICBpZiAodG91Y2hlc090aGVyUlNFKSByZXR1cm4gb3JwOyAvLyBOb25lIG9mIG91ciBlbmRwb2ludHMgaW50ZXJzZWN0LiBMb29rIGZvciBhIGdlbmVyYWwgaW50ZXJzZWN0aW9uIGJldHdlZW5cbiAgICAgICAgLy8gaW5maW5pdGUgbGluZXMgbGFpZCBvdmVyIHRoZSBzZWdtZW50c1xuXG4gICAgICAgIHZhciBwdCA9IGludGVyc2VjdGlvbih0bHAsIHRoaXMudmVjdG9yKCksIG9scCwgb3RoZXIudmVjdG9yKCkpOyAvLyBhcmUgdGhlIHNlZ21lbnRzIHBhcnJhbGxlbD8gTm90ZSB0aGF0IGlmIHRoZXkgd2VyZSBjb2xpbmVhciB3aXRoIG92ZXJsYXAsXG4gICAgICAgIC8vIHRoZXkgd291bGQgaGF2ZSBhbiBlbmRwb2ludCBpbnRlcnNlY3Rpb24gYW5kIHRoYXQgY2FzZSB3YXMgYWxyZWFkeSBoYW5kbGVkIGFib3ZlXG5cbiAgICAgICAgaWYgKHB0ID09PSBudWxsKSByZXR1cm4gbnVsbDsgLy8gaXMgdGhlIGludGVyc2VjdGlvbiBmb3VuZCBiZXR3ZWVuIHRoZSBsaW5lcyBub3Qgb24gdGhlIHNlZ21lbnRzP1xuXG4gICAgICAgIGlmICghaXNJbkJib3goYmJveE92ZXJsYXAsIHB0KSkgcmV0dXJuIG51bGw7IC8vIHJvdW5kIHRoZSB0aGUgY29tcHV0ZWQgcG9pbnQgaWYgbmVlZGVkXG5cbiAgICAgICAgcmV0dXJuIHJvdW5kZXIucm91bmQocHQueCwgcHQueSk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFNwbGl0IHRoZSBnaXZlbiBzZWdtZW50IGludG8gbXVsdGlwbGUgc2VnbWVudHMgb24gdGhlIGdpdmVuIHBvaW50cy5cbiAgICAgICAqICAqIEVhY2ggZXhpc3Rpbmcgc2VnbWVudCB3aWxsIHJldGFpbiBpdHMgbGVmdFNFIGFuZCBhIG5ldyByaWdodFNFIHdpbGwgYmVcbiAgICAgICAqICAgIGdlbmVyYXRlZCBmb3IgaXQuXG4gICAgICAgKiAgKiBBIG5ldyBzZWdtZW50IHdpbGwgYmUgZ2VuZXJhdGVkIHdoaWNoIHdpbGwgYWRvcHQgdGhlIG9yaWdpbmFsIHNlZ21lbnQnc1xuICAgICAgICogICAgcmlnaHRTRSwgYW5kIGEgbmV3IGxlZnRTRSB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgaXQuXG4gICAgICAgKiAgKiBJZiB0aGVyZSBhcmUgbW9yZSB0aGFuIHR3byBwb2ludHMgZ2l2ZW4gdG8gc3BsaXQgb24sIG5ldyBzZWdtZW50c1xuICAgICAgICogICAgaW4gdGhlIG1pZGRsZSB3aWxsIGJlIGdlbmVyYXRlZCB3aXRoIG5ldyBsZWZ0U0UgYW5kIHJpZ2h0U0Uncy5cbiAgICAgICAqICAqIEFuIGFycmF5IG9mIHRoZSBuZXdseSBnZW5lcmF0ZWQgU3dlZXBFdmVudHMgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAqXG4gICAgICAgKiBXYXJuaW5nOiBpbnB1dCBhcnJheSBvZiBwb2ludHMgaXMgbW9kaWZpZWRcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInNwbGl0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gc3BsaXQocG9pbnQpIHtcbiAgICAgICAgdmFyIG5ld0V2ZW50cyA9IFtdO1xuICAgICAgICB2YXIgYWxyZWFkeUxpbmtlZCA9IHBvaW50LmV2ZW50cyAhPT0gdW5kZWZpbmVkO1xuICAgICAgICB2YXIgbmV3TGVmdFNFID0gbmV3IFN3ZWVwRXZlbnQocG9pbnQsIHRydWUpO1xuICAgICAgICB2YXIgbmV3UmlnaHRTRSA9IG5ldyBTd2VlcEV2ZW50KHBvaW50LCBmYWxzZSk7XG4gICAgICAgIHZhciBvbGRSaWdodFNFID0gdGhpcy5yaWdodFNFO1xuICAgICAgICB0aGlzLnJlcGxhY2VSaWdodFNFKG5ld1JpZ2h0U0UpO1xuICAgICAgICBuZXdFdmVudHMucHVzaChuZXdSaWdodFNFKTtcbiAgICAgICAgbmV3RXZlbnRzLnB1c2gobmV3TGVmdFNFKTtcbiAgICAgICAgdmFyIG5ld1NlZyA9IG5ldyBTZWdtZW50KG5ld0xlZnRTRSwgb2xkUmlnaHRTRSwgdGhpcy5yaW5ncy5zbGljZSgpLCB0aGlzLndpbmRpbmdzLnNsaWNlKCkpOyAvLyB3aGVuIHNwbGl0dGluZyBhIG5lYXJseSB2ZXJ0aWNhbCBkb3dud2FyZC1mYWNpbmcgc2VnbWVudCxcbiAgICAgICAgLy8gc29tZXRpbWVzIG9uZSBvZiB0aGUgcmVzdWx0aW5nIG5ldyBzZWdtZW50cyBpcyB2ZXJ0aWNhbCwgaW4gd2hpY2hcbiAgICAgICAgLy8gY2FzZSBpdHMgbGVmdCBhbmQgcmlnaHQgZXZlbnRzIG1heSBuZWVkIHRvIGJlIHN3YXBwZWRcblxuICAgICAgICBpZiAoU3dlZXBFdmVudC5jb21wYXJlUG9pbnRzKG5ld1NlZy5sZWZ0U0UucG9pbnQsIG5ld1NlZy5yaWdodFNFLnBvaW50KSA+IDApIHtcbiAgICAgICAgICBuZXdTZWcuc3dhcEV2ZW50cygpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFN3ZWVwRXZlbnQuY29tcGFyZVBvaW50cyh0aGlzLmxlZnRTRS5wb2ludCwgdGhpcy5yaWdodFNFLnBvaW50KSA+IDApIHtcbiAgICAgICAgICB0aGlzLnN3YXBFdmVudHMoKTtcbiAgICAgICAgfSAvLyBpbiB0aGUgcG9pbnQgd2UganVzdCB1c2VkIHRvIGNyZWF0ZSBuZXcgc3dlZXAgZXZlbnRzIHdpdGggd2FzIGFscmVhZHlcbiAgICAgICAgLy8gbGlua2VkIHRvIG90aGVyIGV2ZW50cywgd2UgbmVlZCB0byBjaGVjayBpZiBlaXRoZXIgb2YgdGhlIGFmZmVjdGVkXG4gICAgICAgIC8vIHNlZ21lbnRzIHNob3VsZCBiZSBjb25zdW1lZFxuXG5cbiAgICAgICAgaWYgKGFscmVhZHlMaW5rZWQpIHtcbiAgICAgICAgICBuZXdMZWZ0U0UuY2hlY2tGb3JDb25zdW1pbmcoKTtcbiAgICAgICAgICBuZXdSaWdodFNFLmNoZWNrRm9yQ29uc3VtaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3RXZlbnRzO1xuICAgICAgfVxuICAgICAgLyogU3dhcCB3aGljaCBldmVudCBpcyBsZWZ0IGFuZCByaWdodCAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInN3YXBFdmVudHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzd2FwRXZlbnRzKCkge1xuICAgICAgICB2YXIgdG1wRXZ0ID0gdGhpcy5yaWdodFNFO1xuICAgICAgICB0aGlzLnJpZ2h0U0UgPSB0aGlzLmxlZnRTRTtcbiAgICAgICAgdGhpcy5sZWZ0U0UgPSB0bXBFdnQ7XG4gICAgICAgIHRoaXMubGVmdFNFLmlzTGVmdCA9IHRydWU7XG4gICAgICAgIHRoaXMucmlnaHRTRS5pc0xlZnQgPSBmYWxzZTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMud2luZGluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy53aW5kaW5nc1tpXSAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLyogQ29uc3VtZSBhbm90aGVyIHNlZ21lbnQuIFdlIHRha2UgdGhlaXIgcmluZ3MgdW5kZXIgb3VyIHdpbmdcbiAgICAgICAqIGFuZCBtYXJrIHRoZW0gYXMgY29uc3VtZWQuIFVzZSBmb3IgcGVyZmVjdGx5IG92ZXJsYXBwaW5nIHNlZ21lbnRzICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiY29uc3VtZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbnN1bWUob3RoZXIpIHtcbiAgICAgICAgdmFyIGNvbnN1bWVyID0gdGhpcztcbiAgICAgICAgdmFyIGNvbnN1bWVlID0gb3RoZXI7XG5cbiAgICAgICAgd2hpbGUgKGNvbnN1bWVyLmNvbnN1bWVkQnkpIHtcbiAgICAgICAgICBjb25zdW1lciA9IGNvbnN1bWVyLmNvbnN1bWVkQnk7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoY29uc3VtZWUuY29uc3VtZWRCeSkge1xuICAgICAgICAgIGNvbnN1bWVlID0gY29uc3VtZWUuY29uc3VtZWRCeTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjbXAgPSBTZWdtZW50LmNvbXBhcmUoY29uc3VtZXIsIGNvbnN1bWVlKTtcbiAgICAgICAgaWYgKGNtcCA9PT0gMCkgcmV0dXJuOyAvLyBhbHJlYWR5IGNvbnN1bWVkXG4gICAgICAgIC8vIHRoZSB3aW5uZXIgb2YgdGhlIGNvbnN1bXB0aW9uIGlzIHRoZSBlYXJsaWVyIHNlZ21lbnRcbiAgICAgICAgLy8gYWNjb3JkaW5nIHRvIHN3ZWVwIGxpbmUgb3JkZXJpbmdcblxuICAgICAgICBpZiAoY21wID4gMCkge1xuICAgICAgICAgIHZhciB0bXAgPSBjb25zdW1lcjtcbiAgICAgICAgICBjb25zdW1lciA9IGNvbnN1bWVlO1xuICAgICAgICAgIGNvbnN1bWVlID0gdG1wO1xuICAgICAgICB9IC8vIG1ha2Ugc3VyZSBhIHNlZ21lbnQgZG9lc24ndCBjb25zdW1lIGl0J3MgcHJldlxuXG5cbiAgICAgICAgaWYgKGNvbnN1bWVyLnByZXYgPT09IGNvbnN1bWVlKSB7XG4gICAgICAgICAgdmFyIF90bXAgPSBjb25zdW1lcjtcbiAgICAgICAgICBjb25zdW1lciA9IGNvbnN1bWVlO1xuICAgICAgICAgIGNvbnN1bWVlID0gX3RtcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gY29uc3VtZWUucmluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJpbmcgPSBjb25zdW1lZS5yaW5nc1tpXTtcbiAgICAgICAgICB2YXIgd2luZGluZyA9IGNvbnN1bWVlLndpbmRpbmdzW2ldO1xuICAgICAgICAgIHZhciBpbmRleCA9IGNvbnN1bWVyLnJpbmdzLmluZGV4T2YocmluZyk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICBjb25zdW1lci5yaW5ncy5wdXNoKHJpbmcpO1xuICAgICAgICAgICAgY29uc3VtZXIud2luZGluZ3MucHVzaCh3aW5kaW5nKTtcbiAgICAgICAgICB9IGVsc2UgY29uc3VtZXIud2luZGluZ3NbaW5kZXhdICs9IHdpbmRpbmc7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdW1lZS5yaW5ncyA9IG51bGw7XG4gICAgICAgIGNvbnN1bWVlLndpbmRpbmdzID0gbnVsbDtcbiAgICAgICAgY29uc3VtZWUuY29uc3VtZWRCeSA9IGNvbnN1bWVyOyAvLyBtYXJrIHN3ZWVwIGV2ZW50cyBjb25zdW1lZCBhcyB0byBtYWludGFpbiBvcmRlcmluZyBpbiBzd2VlcCBldmVudCBxdWV1ZVxuXG4gICAgICAgIGNvbnN1bWVlLmxlZnRTRS5jb25zdW1lZEJ5ID0gY29uc3VtZXIubGVmdFNFO1xuICAgICAgICBjb25zdW1lZS5yaWdodFNFLmNvbnN1bWVkQnkgPSBjb25zdW1lci5yaWdodFNFO1xuICAgICAgfVxuICAgICAgLyogVGhlIGZpcnN0IHNlZ21lbnQgcHJldmlvdXMgc2VnbWVudCBjaGFpbiB0aGF0IGlzIGluIHRoZSByZXN1bHQgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJwcmV2SW5SZXN1bHRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcmV2SW5SZXN1bHQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wcmV2SW5SZXN1bHQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX3ByZXZJblJlc3VsdDtcbiAgICAgICAgaWYgKCF0aGlzLnByZXYpIHRoaXMuX3ByZXZJblJlc3VsdCA9IG51bGw7ZWxzZSBpZiAodGhpcy5wcmV2LmlzSW5SZXN1bHQoKSkgdGhpcy5fcHJldkluUmVzdWx0ID0gdGhpcy5wcmV2O2Vsc2UgdGhpcy5fcHJldkluUmVzdWx0ID0gdGhpcy5wcmV2LnByZXZJblJlc3VsdCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fcHJldkluUmVzdWx0O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJiZWZvcmVTdGF0ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGJlZm9yZVN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy5fYmVmb3JlU3RhdGUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX2JlZm9yZVN0YXRlO1xuICAgICAgICBpZiAoIXRoaXMucHJldikgdGhpcy5fYmVmb3JlU3RhdGUgPSB7XG4gICAgICAgICAgcmluZ3M6IFtdLFxuICAgICAgICAgIHdpbmRpbmdzOiBbXSxcbiAgICAgICAgICBtdWx0aVBvbHlzOiBbXVxuICAgICAgICB9O2Vsc2Uge1xuICAgICAgICAgIHZhciBzZWcgPSB0aGlzLnByZXYuY29uc3VtZWRCeSB8fCB0aGlzLnByZXY7XG4gICAgICAgICAgdGhpcy5fYmVmb3JlU3RhdGUgPSBzZWcuYWZ0ZXJTdGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9iZWZvcmVTdGF0ZTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiYWZ0ZXJTdGF0ZVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFmdGVyU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9hZnRlclN0YXRlICE9PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9hZnRlclN0YXRlO1xuICAgICAgICB2YXIgYmVmb3JlU3RhdGUgPSB0aGlzLmJlZm9yZVN0YXRlKCk7XG4gICAgICAgIHRoaXMuX2FmdGVyU3RhdGUgPSB7XG4gICAgICAgICAgcmluZ3M6IGJlZm9yZVN0YXRlLnJpbmdzLnNsaWNlKDApLFxuICAgICAgICAgIHdpbmRpbmdzOiBiZWZvcmVTdGF0ZS53aW5kaW5ncy5zbGljZSgwKSxcbiAgICAgICAgICBtdWx0aVBvbHlzOiBbXVxuICAgICAgICB9O1xuICAgICAgICB2YXIgcmluZ3NBZnRlciA9IHRoaXMuX2FmdGVyU3RhdGUucmluZ3M7XG4gICAgICAgIHZhciB3aW5kaW5nc0FmdGVyID0gdGhpcy5fYWZ0ZXJTdGF0ZS53aW5kaW5ncztcbiAgICAgICAgdmFyIG1wc0FmdGVyID0gdGhpcy5fYWZ0ZXJTdGF0ZS5tdWx0aVBvbHlzOyAvLyBjYWxjdWxhdGUgcmluZ3NBZnRlciwgd2luZGluZ3NBZnRlclxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5yaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcmluZyA9IHRoaXMucmluZ3NbaV07XG4gICAgICAgICAgdmFyIHdpbmRpbmcgPSB0aGlzLndpbmRpbmdzW2ldO1xuICAgICAgICAgIHZhciBpbmRleCA9IHJpbmdzQWZ0ZXIuaW5kZXhPZihyaW5nKTtcblxuICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJpbmdzQWZ0ZXIucHVzaChyaW5nKTtcbiAgICAgICAgICAgIHdpbmRpbmdzQWZ0ZXIucHVzaCh3aW5kaW5nKTtcbiAgICAgICAgICB9IGVsc2Ugd2luZGluZ3NBZnRlcltpbmRleF0gKz0gd2luZGluZztcbiAgICAgICAgfSAvLyBjYWxjdWFsdGUgcG9seXNBZnRlclxuXG5cbiAgICAgICAgdmFyIHBvbHlzQWZ0ZXIgPSBbXTtcbiAgICAgICAgdmFyIHBvbHlzRXhjbHVkZSA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2lNYXggPSByaW5nc0FmdGVyLmxlbmd0aDsgX2kgPCBfaU1heDsgX2krKykge1xuICAgICAgICAgIGlmICh3aW5kaW5nc0FmdGVyW19pXSA9PT0gMCkgY29udGludWU7IC8vIG5vbi16ZXJvIHJ1bGVcblxuICAgICAgICAgIHZhciBfcmluZyA9IHJpbmdzQWZ0ZXJbX2ldO1xuICAgICAgICAgIHZhciBwb2x5ID0gX3JpbmcucG9seTtcbiAgICAgICAgICBpZiAocG9seXNFeGNsdWRlLmluZGV4T2YocG9seSkgIT09IC0xKSBjb250aW51ZTtcbiAgICAgICAgICBpZiAoX3JpbmcuaXNFeHRlcmlvcikgcG9seXNBZnRlci5wdXNoKHBvbHkpO2Vsc2Uge1xuICAgICAgICAgICAgaWYgKHBvbHlzRXhjbHVkZS5pbmRleE9mKHBvbHkpID09PSAtMSkgcG9seXNFeGNsdWRlLnB1c2gocG9seSk7XG5cbiAgICAgICAgICAgIHZhciBfaW5kZXggPSBwb2x5c0FmdGVyLmluZGV4T2YoX3JpbmcucG9seSk7XG5cbiAgICAgICAgICAgIGlmIChfaW5kZXggIT09IC0xKSBwb2x5c0FmdGVyLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSAvLyBjYWxjdWxhdGUgbXVsdGlQb2x5c0FmdGVyXG5cblxuICAgICAgICBmb3IgKHZhciBfaTIgPSAwLCBfaU1heDIgPSBwb2x5c0FmdGVyLmxlbmd0aDsgX2kyIDwgX2lNYXgyOyBfaTIrKykge1xuICAgICAgICAgIHZhciBtcCA9IHBvbHlzQWZ0ZXJbX2kyXS5tdWx0aVBvbHk7XG4gICAgICAgICAgaWYgKG1wc0FmdGVyLmluZGV4T2YobXApID09PSAtMSkgbXBzQWZ0ZXIucHVzaChtcCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fYWZ0ZXJTdGF0ZTtcbiAgICAgIH1cbiAgICAgIC8qIElzIHRoaXMgc2VnbWVudCBwYXJ0IG9mIHRoZSBmaW5hbCByZXN1bHQ/ICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaXNJblJlc3VsdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzSW5SZXN1bHQoKSB7XG4gICAgICAgIC8vIGlmIHdlJ3ZlIGJlZW4gY29uc3VtZWQsIHdlJ3JlIG5vdCBpbiB0aGUgcmVzdWx0XG4gICAgICAgIGlmICh0aGlzLmNvbnN1bWVkQnkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgaWYgKHRoaXMuX2lzSW5SZXN1bHQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX2lzSW5SZXN1bHQ7XG4gICAgICAgIHZhciBtcHNCZWZvcmUgPSB0aGlzLmJlZm9yZVN0YXRlKCkubXVsdGlQb2x5cztcbiAgICAgICAgdmFyIG1wc0FmdGVyID0gdGhpcy5hZnRlclN0YXRlKCkubXVsdGlQb2x5cztcblxuICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAndW5pb24nOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBVTklPTiAtIGluY2x1ZGVkIGlmZjpcbiAgICAgICAgICAgICAgLy8gICogT24gb25lIHNpZGUgb2YgdXMgdGhlcmUgaXMgMCBwb2x5IGludGVyaW9ycyBBTkRcbiAgICAgICAgICAgICAgLy8gICogT24gdGhlIG90aGVyIHNpZGUgdGhlcmUgaXMgMSBvciBtb3JlLlxuICAgICAgICAgICAgICB2YXIgbm9CZWZvcmVzID0gbXBzQmVmb3JlLmxlbmd0aCA9PT0gMDtcbiAgICAgICAgICAgICAgdmFyIG5vQWZ0ZXJzID0gbXBzQWZ0ZXIubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgICB0aGlzLl9pc0luUmVzdWx0ID0gbm9CZWZvcmVzICE9PSBub0FmdGVycztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdpbnRlcnNlY3Rpb24nOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBJTlRFUlNFQ1RJT04gLSBpbmNsdWRlZCBpZmY6XG4gICAgICAgICAgICAgIC8vICAqIG9uIG9uZSBzaWRlIG9mIHVzIGFsbCBtdWx0aXBvbHlzIGFyZSByZXAuIHdpdGggcG9seSBpbnRlcmlvcnMgQU5EXG4gICAgICAgICAgICAgIC8vICAqIG9uIHRoZSBvdGhlciBzaWRlIG9mIHVzLCBub3QgYWxsIG11bHRpcG9seXMgYXJlIHJlcHNlbnRlZFxuICAgICAgICAgICAgICAvLyAgICB3aXRoIHBvbHkgaW50ZXJpb3JzXG4gICAgICAgICAgICAgIHZhciBsZWFzdDtcbiAgICAgICAgICAgICAgdmFyIG1vc3Q7XG5cbiAgICAgICAgICAgICAgaWYgKG1wc0JlZm9yZS5sZW5ndGggPCBtcHNBZnRlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBsZWFzdCA9IG1wc0JlZm9yZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgbW9zdCA9IG1wc0FmdGVyLmxlbmd0aDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZWFzdCA9IG1wc0FmdGVyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBtb3N0ID0gbXBzQmVmb3JlLmxlbmd0aDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHRoaXMuX2lzSW5SZXN1bHQgPSBtb3N0ID09PSBvcGVyYXRpb24ubnVtTXVsdGlQb2x5cyAmJiBsZWFzdCA8IG1vc3Q7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAneG9yJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gWE9SIC0gaW5jbHVkZWQgaWZmOlxuICAgICAgICAgICAgICAvLyAgKiB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBudW1iZXIgb2YgbXVsdGlwb2x5cyByZXByZXNlbnRlZFxuICAgICAgICAgICAgICAvLyAgICB3aXRoIHBvbHkgaW50ZXJpb3JzIG9uIG91ciB0d28gc2lkZXMgaXMgYW4gb2RkIG51bWJlclxuICAgICAgICAgICAgICB2YXIgZGlmZiA9IE1hdGguYWJzKG1wc0JlZm9yZS5sZW5ndGggLSBtcHNBZnRlci5sZW5ndGgpO1xuICAgICAgICAgICAgICB0aGlzLl9pc0luUmVzdWx0ID0gZGlmZiAlIDIgPT09IDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnZGlmZmVyZW5jZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIERJRkZFUkVOQ0UgaW5jbHVkZWQgaWZmOlxuICAgICAgICAgICAgICAvLyAgKiBvbiBleGFjdGx5IG9uZSBzaWRlLCB3ZSBoYXZlIGp1c3QgdGhlIHN1YmplY3RcbiAgICAgICAgICAgICAgdmFyIGlzSnVzdFN1YmplY3QgPSBmdW5jdGlvbiBpc0p1c3RTdWJqZWN0KG1wcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBtcHMubGVuZ3RoID09PSAxICYmIG1wc1swXS5pc1N1YmplY3Q7XG4gICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgdGhpcy5faXNJblJlc3VsdCA9IGlzSnVzdFN1YmplY3QobXBzQmVmb3JlKSAhPT0gaXNKdXN0U3ViamVjdChtcHNBZnRlcik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlVucmVjb2duaXplZCBvcGVyYXRpb24gdHlwZSBmb3VuZCBcIi5jb25jYXQob3BlcmF0aW9uLnR5cGUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0luUmVzdWx0O1xuICAgICAgfVxuICAgIH1dLCBbe1xuICAgICAga2V5OiBcImZyb21SaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZnJvbVJpbmcocHQxLCBwdDIsIHJpbmcpIHtcbiAgICAgICAgdmFyIGxlZnRQdCwgcmlnaHRQdCwgd2luZGluZzsgLy8gb3JkZXJpbmcgdGhlIHR3byBwb2ludHMgYWNjb3JkaW5nIHRvIHN3ZWVwIGxpbmUgb3JkZXJpbmdcblxuICAgICAgICB2YXIgY21wUHRzID0gU3dlZXBFdmVudC5jb21wYXJlUG9pbnRzKHB0MSwgcHQyKTtcblxuICAgICAgICBpZiAoY21wUHRzIDwgMCkge1xuICAgICAgICAgIGxlZnRQdCA9IHB0MTtcbiAgICAgICAgICByaWdodFB0ID0gcHQyO1xuICAgICAgICAgIHdpbmRpbmcgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKGNtcFB0cyA+IDApIHtcbiAgICAgICAgICBsZWZ0UHQgPSBwdDI7XG4gICAgICAgICAgcmlnaHRQdCA9IHB0MTtcbiAgICAgICAgICB3aW5kaW5nID0gLTE7XG4gICAgICAgIH0gZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJUcmllZCB0byBjcmVhdGUgZGVnZW5lcmF0ZSBzZWdtZW50IGF0IFtcIi5jb25jYXQocHQxLngsIFwiLCBcIikuY29uY2F0KHB0MS55LCBcIl1cIikpO1xuXG4gICAgICAgIHZhciBsZWZ0U0UgPSBuZXcgU3dlZXBFdmVudChsZWZ0UHQsIHRydWUpO1xuICAgICAgICB2YXIgcmlnaHRTRSA9IG5ldyBTd2VlcEV2ZW50KHJpZ2h0UHQsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTZWdtZW50KGxlZnRTRSwgcmlnaHRTRSwgW3JpbmddLCBbd2luZGluZ10pO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTZWdtZW50O1xuICB9KCk7XG5cbiAgdmFyIFJpbmdJbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmluZ0luKGdlb21SaW5nLCBwb2x5LCBpc0V4dGVyaW9yKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmluZ0luKTtcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGdlb21SaW5nKSB8fCBnZW9tUmluZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBnZW9tZXRyeSBpcyBub3QgYSB2YWxpZCBQb2x5Z29uIG9yIE11bHRpUG9seWdvbicpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvbHkgPSBwb2x5O1xuICAgICAgdGhpcy5pc0V4dGVyaW9yID0gaXNFeHRlcmlvcjtcbiAgICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcblxuICAgICAgaWYgKHR5cGVvZiBnZW9tUmluZ1swXVswXSAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGdlb21SaW5nWzBdWzFdICE9PSAnbnVtYmVyJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGdlb21ldHJ5IGlzIG5vdCBhIHZhbGlkIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaXJzdFBvaW50ID0gcm91bmRlci5yb3VuZChnZW9tUmluZ1swXVswXSwgZ2VvbVJpbmdbMF1bMV0pO1xuICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICBsbDoge1xuICAgICAgICAgIHg6IGZpcnN0UG9pbnQueCxcbiAgICAgICAgICB5OiBmaXJzdFBvaW50LnlcbiAgICAgICAgfSxcbiAgICAgICAgdXI6IHtcbiAgICAgICAgICB4OiBmaXJzdFBvaW50LngsXG4gICAgICAgICAgeTogZmlyc3RQb2ludC55XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB2YXIgcHJldlBvaW50ID0gZmlyc3RQb2ludDtcblxuICAgICAgZm9yICh2YXIgaSA9IDEsIGlNYXggPSBnZW9tUmluZy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBnZW9tUmluZ1tpXVswXSAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGdlb21SaW5nW2ldWzFdICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZ2VvbWV0cnkgaXMgbm90IGEgdmFsaWQgUG9seWdvbiBvciBNdWx0aVBvbHlnb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwb2ludCA9IHJvdW5kZXIucm91bmQoZ2VvbVJpbmdbaV1bMF0sIGdlb21SaW5nW2ldWzFdKTsgLy8gc2tpcCByZXBlYXRlZCBwb2ludHNcblxuICAgICAgICBpZiAocG9pbnQueCA9PT0gcHJldlBvaW50LnggJiYgcG9pbnQueSA9PT0gcHJldlBvaW50LnkpIGNvbnRpbnVlO1xuICAgICAgICB0aGlzLnNlZ21lbnRzLnB1c2goU2VnbWVudC5mcm9tUmluZyhwcmV2UG9pbnQsIHBvaW50LCB0aGlzKSk7XG4gICAgICAgIGlmIChwb2ludC54IDwgdGhpcy5iYm94LmxsLngpIHRoaXMuYmJveC5sbC54ID0gcG9pbnQueDtcbiAgICAgICAgaWYgKHBvaW50LnkgPCB0aGlzLmJib3gubGwueSkgdGhpcy5iYm94LmxsLnkgPSBwb2ludC55O1xuICAgICAgICBpZiAocG9pbnQueCA+IHRoaXMuYmJveC51ci54KSB0aGlzLmJib3gudXIueCA9IHBvaW50Lng7XG4gICAgICAgIGlmIChwb2ludC55ID4gdGhpcy5iYm94LnVyLnkpIHRoaXMuYmJveC51ci55ID0gcG9pbnQueTtcbiAgICAgICAgcHJldlBvaW50ID0gcG9pbnQ7XG4gICAgICB9IC8vIGFkZCBzZWdtZW50IGZyb20gbGFzdCB0byBmaXJzdCBpZiBsYXN0IGlzIG5vdCB0aGUgc2FtZSBhcyBmaXJzdFxuXG5cbiAgICAgIGlmIChmaXJzdFBvaW50LnggIT09IHByZXZQb2ludC54IHx8IGZpcnN0UG9pbnQueSAhPT0gcHJldlBvaW50LnkpIHtcbiAgICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKFNlZ21lbnQuZnJvbVJpbmcocHJldlBvaW50LCBmaXJzdFBvaW50LCB0aGlzKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFJpbmdJbiwgW3tcbiAgICAgIGtleTogXCJnZXRTd2VlcEV2ZW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN3ZWVwRXZlbnRzKCkge1xuICAgICAgICB2YXIgc3dlZXBFdmVudHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMuc2VnbWVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnQgPSB0aGlzLnNlZ21lbnRzW2ldO1xuICAgICAgICAgIHN3ZWVwRXZlbnRzLnB1c2goc2VnbWVudC5sZWZ0U0UpO1xuICAgICAgICAgIHN3ZWVwRXZlbnRzLnB1c2goc2VnbWVudC5yaWdodFNFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzd2VlcEV2ZW50cztcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUmluZ0luO1xuICB9KCk7XG4gIHZhciBQb2x5SW4gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBvbHlJbihnZW9tUG9seSwgbXVsdGlQb2x5KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9seUluKTtcblxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGdlb21Qb2x5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGdlb21ldHJ5IGlzIG5vdCBhIHZhbGlkIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZXh0ZXJpb3JSaW5nID0gbmV3IFJpbmdJbihnZW9tUG9seVswXSwgdGhpcywgdHJ1ZSk7IC8vIGNvcHkgYnkgdmFsdWVcblxuICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICBsbDoge1xuICAgICAgICAgIHg6IHRoaXMuZXh0ZXJpb3JSaW5nLmJib3gubGwueCxcbiAgICAgICAgICB5OiB0aGlzLmV4dGVyaW9yUmluZy5iYm94LmxsLnlcbiAgICAgICAgfSxcbiAgICAgICAgdXI6IHtcbiAgICAgICAgICB4OiB0aGlzLmV4dGVyaW9yUmluZy5iYm94LnVyLngsXG4gICAgICAgICAgeTogdGhpcy5leHRlcmlvclJpbmcuYmJveC51ci55XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICB0aGlzLmludGVyaW9yUmluZ3MgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDEsIGlNYXggPSBnZW9tUG9seS5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgdmFyIHJpbmcgPSBuZXcgUmluZ0luKGdlb21Qb2x5W2ldLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGlmIChyaW5nLmJib3gubGwueCA8IHRoaXMuYmJveC5sbC54KSB0aGlzLmJib3gubGwueCA9IHJpbmcuYmJveC5sbC54O1xuICAgICAgICBpZiAocmluZy5iYm94LmxsLnkgPCB0aGlzLmJib3gubGwueSkgdGhpcy5iYm94LmxsLnkgPSByaW5nLmJib3gubGwueTtcbiAgICAgICAgaWYgKHJpbmcuYmJveC51ci54ID4gdGhpcy5iYm94LnVyLngpIHRoaXMuYmJveC51ci54ID0gcmluZy5iYm94LnVyLng7XG4gICAgICAgIGlmIChyaW5nLmJib3gudXIueSA+IHRoaXMuYmJveC51ci55KSB0aGlzLmJib3gudXIueSA9IHJpbmcuYmJveC51ci55O1xuICAgICAgICB0aGlzLmludGVyaW9yUmluZ3MucHVzaChyaW5nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tdWx0aVBvbHkgPSBtdWx0aVBvbHk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFBvbHlJbiwgW3tcbiAgICAgIGtleTogXCJnZXRTd2VlcEV2ZW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN3ZWVwRXZlbnRzKCkge1xuICAgICAgICB2YXIgc3dlZXBFdmVudHMgPSB0aGlzLmV4dGVyaW9yUmluZy5nZXRTd2VlcEV2ZW50cygpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5pbnRlcmlvclJpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciByaW5nU3dlZXBFdmVudHMgPSB0aGlzLmludGVyaW9yUmluZ3NbaV0uZ2V0U3dlZXBFdmVudHMoKTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqTWF4ID0gcmluZ1N3ZWVwRXZlbnRzLmxlbmd0aDsgaiA8IGpNYXg7IGorKykge1xuICAgICAgICAgICAgc3dlZXBFdmVudHMucHVzaChyaW5nU3dlZXBFdmVudHNbal0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzd2VlcEV2ZW50cztcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUG9seUluO1xuICB9KCk7XG4gIHZhciBNdWx0aVBvbHlJbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTXVsdGlQb2x5SW4oZ2VvbSwgaXNTdWJqZWN0KSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTXVsdGlQb2x5SW4pO1xuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2VvbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBnZW9tZXRyeSBpcyBub3QgYSB2YWxpZCBQb2x5Z29uIG9yIE11bHRpUG9seWdvbicpO1xuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICAvLyBpZiB0aGUgaW5wdXQgbG9va3MgbGlrZSBhIHBvbHlnb24sIGNvbnZlcnQgaXQgdG8gYSBtdWx0aXBvbHlnb25cbiAgICAgICAgaWYgKHR5cGVvZiBnZW9tWzBdWzBdWzBdID09PSAnbnVtYmVyJykgZ2VvbSA9IFtnZW9tXTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7Ly8gVGhlIGlucHV0IGlzIGVpdGhlciBtYWxmb3JtZWQgb3IgaGFzIGVtcHR5IGFycmF5cy5cbiAgICAgICAgLy8gSW4gZWl0aGVyIGNhc2UsIGl0IHdpbGwgYmUgaGFuZGxlZCBsYXRlciBvbi5cbiAgICAgIH1cblxuICAgICAgdGhpcy5wb2x5cyA9IFtdO1xuICAgICAgdGhpcy5iYm94ID0ge1xuICAgICAgICBsbDoge1xuICAgICAgICAgIHg6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICB5OiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFlcbiAgICAgICAgfSxcbiAgICAgICAgdXI6IHtcbiAgICAgICAgICB4OiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgeTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZXG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gZ2VvbS5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgdmFyIHBvbHkgPSBuZXcgUG9seUluKGdlb21baV0sIHRoaXMpO1xuICAgICAgICBpZiAocG9seS5iYm94LmxsLnggPCB0aGlzLmJib3gubGwueCkgdGhpcy5iYm94LmxsLnggPSBwb2x5LmJib3gubGwueDtcbiAgICAgICAgaWYgKHBvbHkuYmJveC5sbC55IDwgdGhpcy5iYm94LmxsLnkpIHRoaXMuYmJveC5sbC55ID0gcG9seS5iYm94LmxsLnk7XG4gICAgICAgIGlmIChwb2x5LmJib3gudXIueCA+IHRoaXMuYmJveC51ci54KSB0aGlzLmJib3gudXIueCA9IHBvbHkuYmJveC51ci54O1xuICAgICAgICBpZiAocG9seS5iYm94LnVyLnkgPiB0aGlzLmJib3gudXIueSkgdGhpcy5iYm94LnVyLnkgPSBwb2x5LmJib3gudXIueTtcbiAgICAgICAgdGhpcy5wb2x5cy5wdXNoKHBvbHkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmlzU3ViamVjdCA9IGlzU3ViamVjdDtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoTXVsdGlQb2x5SW4sIFt7XG4gICAgICBrZXk6IFwiZ2V0U3dlZXBFdmVudHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTd2VlcEV2ZW50cygpIHtcbiAgICAgICAgdmFyIHN3ZWVwRXZlbnRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLnBvbHlzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBwb2x5U3dlZXBFdmVudHMgPSB0aGlzLnBvbHlzW2ldLmdldFN3ZWVwRXZlbnRzKCk7XG5cbiAgICAgICAgICBmb3IgKHZhciBqID0gMCwgak1heCA9IHBvbHlTd2VlcEV2ZW50cy5sZW5ndGg7IGogPCBqTWF4OyBqKyspIHtcbiAgICAgICAgICAgIHN3ZWVwRXZlbnRzLnB1c2gocG9seVN3ZWVwRXZlbnRzW2pdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3dlZXBFdmVudHM7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE11bHRpUG9seUluO1xuICB9KCk7XG5cbiAgdmFyIFJpbmdPdXQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIF9jcmVhdGVDbGFzcyhSaW5nT3V0LCBudWxsLCBbe1xuICAgICAga2V5OiBcImZhY3RvcnlcIixcblxuICAgICAgLyogR2l2ZW4gdGhlIHNlZ21lbnRzIGZyb20gdGhlIHN3ZWVwIGxpbmUgcGFzcywgY29tcHV0ZSAmIHJldHVybiBhIHNlcmllc1xuICAgICAgICogb2YgY2xvc2VkIHJpbmdzIGZyb20gYWxsIHRoZSBzZWdtZW50cyBtYXJrZWQgdG8gYmUgcGFydCBvZiB0aGUgcmVzdWx0ICovXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZmFjdG9yeShhbGxTZWdtZW50cykge1xuICAgICAgICB2YXIgcmluZ3NPdXQgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IGFsbFNlZ21lbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBzZWdtZW50ID0gYWxsU2VnbWVudHNbaV07XG4gICAgICAgICAgaWYgKCFzZWdtZW50LmlzSW5SZXN1bHQoKSB8fCBzZWdtZW50LnJpbmdPdXQpIGNvbnRpbnVlO1xuICAgICAgICAgIHZhciBwcmV2RXZlbnQgPSBudWxsO1xuICAgICAgICAgIHZhciBldmVudCA9IHNlZ21lbnQubGVmdFNFO1xuICAgICAgICAgIHZhciBuZXh0RXZlbnQgPSBzZWdtZW50LnJpZ2h0U0U7XG4gICAgICAgICAgdmFyIGV2ZW50cyA9IFtldmVudF07XG4gICAgICAgICAgdmFyIHN0YXJ0aW5nUG9pbnQgPSBldmVudC5wb2ludDtcbiAgICAgICAgICB2YXIgaW50ZXJzZWN0aW9uTEVzID0gW107XG4gICAgICAgICAgLyogV2FsayB0aGUgY2hhaW4gb2YgbGlua2VkIGV2ZW50cyB0byBmb3JtIGEgY2xvc2VkIHJpbmcgKi9cblxuICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICBwcmV2RXZlbnQgPSBldmVudDtcbiAgICAgICAgICAgIGV2ZW50ID0gbmV4dEV2ZW50O1xuICAgICAgICAgICAgZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICAgICAgLyogSXMgdGhlIHJpbmcgY29tcGxldGU/ICovXG5cbiAgICAgICAgICAgIGlmIChldmVudC5wb2ludCA9PT0gc3RhcnRpbmdQb2ludCkgYnJlYWs7XG5cbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgIHZhciBhdmFpbGFibGVMRXMgPSBldmVudC5nZXRBdmFpbGFibGVMaW5rZWRFdmVudHMoKTtcbiAgICAgICAgICAgICAgLyogRGlkIHdlIGhpdCBhIGRlYWQgZW5kPyBUaGlzIHNob3VsZG4ndCBoYXBwZW4uIEluZGljYXRlcyBzb21lIGVhcmxpZXJcbiAgICAgICAgICAgICAgICogcGFydCBvZiB0aGUgYWxnb3JpdGhtIG1hbGZ1bmN0aW9uZWQuLi4gcGxlYXNlIGZpbGUgYSBidWcgcmVwb3J0LiAqL1xuXG4gICAgICAgICAgICAgIGlmIChhdmFpbGFibGVMRXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpcnN0UHQgPSBldmVudHNbMF0ucG9pbnQ7XG4gICAgICAgICAgICAgICAgdmFyIGxhc3RQdCA9IGV2ZW50c1tldmVudHMubGVuZ3RoIC0gMV0ucG9pbnQ7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIGNvbXBsZXRlIG91dHB1dCByaW5nIHN0YXJ0aW5nIGF0IFtcIi5jb25jYXQoZmlyc3RQdC54LCBcIixcIikgKyBcIiBcIi5jb25jYXQoZmlyc3RQdC55LCBcIl0uIExhc3QgbWF0Y2hpbmcgc2VnbWVudCBmb3VuZCBlbmRzIGF0XCIpICsgXCIgW1wiLmNvbmNhdChsYXN0UHQueCwgXCIsIFwiKS5jb25jYXQobGFzdFB0LnksIFwiXS5cIikpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8qIE9ubHkgb25lIHdheSB0byBnbywgc28gY290aW51ZSBvbiB0aGUgcGF0aCAqL1xuXG5cbiAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZUxFcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICBuZXh0RXZlbnQgPSBhdmFpbGFibGVMRXNbMF0ub3RoZXJTRTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvKiBXZSBtdXN0IGhhdmUgYW4gaW50ZXJzZWN0aW9uLiBDaGVjayBmb3IgYSBjb21wbGV0ZWQgbG9vcCAqL1xuXG5cbiAgICAgICAgICAgICAgdmFyIGluZGV4TEUgPSBudWxsO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqTWF4ID0gaW50ZXJzZWN0aW9uTEVzLmxlbmd0aDsgaiA8IGpNYXg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcnNlY3Rpb25MRXNbal0ucG9pbnQgPT09IGV2ZW50LnBvaW50KSB7XG4gICAgICAgICAgICAgICAgICBpbmRleExFID0gajtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvKiBGb3VuZCBhIGNvbXBsZXRlZCBsb29wLiBDdXQgdGhhdCBvZmYgYW5kIG1ha2UgYSByaW5nICovXG5cblxuICAgICAgICAgICAgICBpZiAoaW5kZXhMRSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25MRSA9IGludGVyc2VjdGlvbkxFcy5zcGxpY2UoaW5kZXhMRSlbMF07XG4gICAgICAgICAgICAgICAgdmFyIHJpbmdFdmVudHMgPSBldmVudHMuc3BsaWNlKGludGVyc2VjdGlvbkxFLmluZGV4KTtcbiAgICAgICAgICAgICAgICByaW5nRXZlbnRzLnVuc2hpZnQocmluZ0V2ZW50c1swXS5vdGhlclNFKTtcbiAgICAgICAgICAgICAgICByaW5nc091dC5wdXNoKG5ldyBSaW5nT3V0KHJpbmdFdmVudHMucmV2ZXJzZSgpKSk7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLyogcmVnaXN0ZXIgdGhlIGludGVyc2VjdGlvbiAqL1xuXG5cbiAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uTEVzLnB1c2goe1xuICAgICAgICAgICAgICAgIGluZGV4OiBldmVudHMubGVuZ3RoLFxuICAgICAgICAgICAgICAgIHBvaW50OiBldmVudC5wb2ludFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgLyogQ2hvb3NlIHRoZSBsZWZ0LW1vc3Qgb3B0aW9uIHRvIGNvbnRpbnVlIHRoZSB3YWxrICovXG5cbiAgICAgICAgICAgICAgdmFyIGNvbXBhcmF0b3IgPSBldmVudC5nZXRMZWZ0bW9zdENvbXBhcmF0b3IocHJldkV2ZW50KTtcbiAgICAgICAgICAgICAgbmV4dEV2ZW50ID0gYXZhaWxhYmxlTEVzLnNvcnQoY29tcGFyYXRvcilbMF0ub3RoZXJTRTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmluZ3NPdXQucHVzaChuZXcgUmluZ091dChldmVudHMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByaW5nc091dDtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBmdW5jdGlvbiBSaW5nT3V0KGV2ZW50cykge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFJpbmdPdXQpO1xuXG4gICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBldmVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgIGV2ZW50c1tpXS5zZWdtZW50LnJpbmdPdXQgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnBvbHkgPSBudWxsO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhSaW5nT3V0LCBbe1xuICAgICAga2V5OiBcImdldEdlb21cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRHZW9tKCkge1xuICAgICAgICAvLyBSZW1vdmUgc3VwZXJmbHVvdXMgcG9pbnRzIChpZSBleHRyYSBwb2ludHMgYWxvbmcgYSBzdHJhaWdodCBsaW5lKSxcbiAgICAgICAgdmFyIHByZXZQdCA9IHRoaXMuZXZlbnRzWzBdLnBvaW50O1xuICAgICAgICB2YXIgcG9pbnRzID0gW3ByZXZQdF07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGlNYXggPSB0aGlzLmV2ZW50cy5sZW5ndGggLSAxOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIF9wdCA9IHRoaXMuZXZlbnRzW2ldLnBvaW50O1xuICAgICAgICAgIHZhciBfbmV4dFB0ID0gdGhpcy5ldmVudHNbaSArIDFdLnBvaW50O1xuICAgICAgICAgIGlmIChjb21wYXJlVmVjdG9yQW5nbGVzKF9wdCwgcHJldlB0LCBfbmV4dFB0KSA9PT0gMCkgY29udGludWU7XG4gICAgICAgICAgcG9pbnRzLnB1c2goX3B0KTtcbiAgICAgICAgICBwcmV2UHQgPSBfcHQ7XG4gICAgICAgIH0gLy8gcmluZyB3YXMgYWxsICh3aXRoaW4gcm91bmRpbmcgZXJyb3Igb2YgYW5nbGUgY2FsYykgY29saW5lYXIgcG9pbnRzXG5cblxuICAgICAgICBpZiAocG9pbnRzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIG51bGw7IC8vIGNoZWNrIGlmIHRoZSBzdGFydGluZyBwb2ludCBpcyBuZWNlc3NhcnlcblxuICAgICAgICB2YXIgcHQgPSBwb2ludHNbMF07XG4gICAgICAgIHZhciBuZXh0UHQgPSBwb2ludHNbMV07XG4gICAgICAgIGlmIChjb21wYXJlVmVjdG9yQW5nbGVzKHB0LCBwcmV2UHQsIG5leHRQdCkgPT09IDApIHBvaW50cy5zaGlmdCgpO1xuICAgICAgICBwb2ludHMucHVzaChwb2ludHNbMF0pO1xuICAgICAgICB2YXIgc3RlcCA9IHRoaXMuaXNFeHRlcmlvclJpbmcoKSA/IDEgOiAtMTtcbiAgICAgICAgdmFyIGlTdGFydCA9IHRoaXMuaXNFeHRlcmlvclJpbmcoKSA/IDAgOiBwb2ludHMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIGlFbmQgPSB0aGlzLmlzRXh0ZXJpb3JSaW5nKCkgPyBwb2ludHMubGVuZ3RoIDogLTE7XG4gICAgICAgIHZhciBvcmRlcmVkUG9pbnRzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgX2kgPSBpU3RhcnQ7IF9pICE9IGlFbmQ7IF9pICs9IHN0ZXApIHtcbiAgICAgICAgICBvcmRlcmVkUG9pbnRzLnB1c2goW3BvaW50c1tfaV0ueCwgcG9pbnRzW19pXS55XSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3JkZXJlZFBvaW50cztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiaXNFeHRlcmlvclJpbmdcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpc0V4dGVyaW9yUmluZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzRXh0ZXJpb3JSaW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB2YXIgZW5jbG9zaW5nID0gdGhpcy5lbmNsb3NpbmdSaW5nKCk7XG4gICAgICAgICAgdGhpcy5faXNFeHRlcmlvclJpbmcgPSBlbmNsb3NpbmcgPyAhZW5jbG9zaW5nLmlzRXh0ZXJpb3JSaW5nKCkgOiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRXh0ZXJpb3JSaW5nO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJlbmNsb3NpbmdSaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZW5jbG9zaW5nUmluZygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2VuY2xvc2luZ1JpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuX2VuY2xvc2luZ1JpbmcgPSB0aGlzLl9jYWxjRW5jbG9zaW5nUmluZygpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuY2xvc2luZ1Jpbmc7XG4gICAgICB9XG4gICAgICAvKiBSZXR1cm5zIHRoZSByaW5nIHRoYXQgZW5jbG9zZXMgdGhpcyBvbmUsIGlmIGFueSAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9jYWxjRW5jbG9zaW5nUmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9jYWxjRW5jbG9zaW5nUmluZygpIHtcbiAgICAgICAgLy8gc3RhcnQgd2l0aCB0aGUgZWFsaWVyIHN3ZWVwIGxpbmUgZXZlbnQgc28gdGhhdCB0aGUgcHJldlNlZ1xuICAgICAgICAvLyBjaGFpbiBkb2Vzbid0IGxlYWQgdXMgaW5zaWRlIG9mIGEgbG9vcCBvZiBvdXJzXG4gICAgICAgIHZhciBsZWZ0TW9zdEV2dCA9IHRoaXMuZXZlbnRzWzBdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAxLCBpTWF4ID0gdGhpcy5ldmVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIGV2dCA9IHRoaXMuZXZlbnRzW2ldO1xuICAgICAgICAgIGlmIChTd2VlcEV2ZW50LmNvbXBhcmUobGVmdE1vc3RFdnQsIGV2dCkgPiAwKSBsZWZ0TW9zdEV2dCA9IGV2dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcmV2U2VnID0gbGVmdE1vc3RFdnQuc2VnbWVudC5wcmV2SW5SZXN1bHQoKTtcbiAgICAgICAgdmFyIHByZXZQcmV2U2VnID0gcHJldlNlZyA/IHByZXZTZWcucHJldkluUmVzdWx0KCkgOiBudWxsO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgLy8gbm8gc2VnbWVudCBmb3VuZCwgdGh1cyBubyByaW5nIGNhbiBlbmNsb3NlIHVzXG4gICAgICAgICAgaWYgKCFwcmV2U2VnKSByZXR1cm4gbnVsbDsgLy8gbm8gc2VnbWVudHMgYmVsb3cgcHJldiBzZWdtZW50IGZvdW5kLCB0aHVzIHRoZSByaW5nIG9mIHRoZSBwcmV2XG4gICAgICAgICAgLy8gc2VnbWVudCBtdXN0IGxvb3AgYmFjayBhcm91bmQgYW5kIGVuY2xvc2UgdXNcblxuICAgICAgICAgIGlmICghcHJldlByZXZTZWcpIHJldHVybiBwcmV2U2VnLnJpbmdPdXQ7IC8vIGlmIHRoZSB0d28gc2VnbWVudHMgYXJlIG9mIGRpZmZlcmVudCByaW5ncywgdGhlIHJpbmcgb2YgdGhlIHByZXZcbiAgICAgICAgICAvLyBzZWdtZW50IG11c3QgZWl0aGVyIGxvb3AgYXJvdW5kIHVzIG9yIHRoZSByaW5nIG9mIHRoZSBwcmV2IHByZXZcbiAgICAgICAgICAvLyBzZWcsIHdoaWNoIHdvdWxkIG1ha2UgdXMgYW5kIHRoZSByaW5nIG9mIHRoZSBwcmV2IHBlZXJzXG5cbiAgICAgICAgICBpZiAocHJldlByZXZTZWcucmluZ091dCAhPT0gcHJldlNlZy5yaW5nT3V0KSB7XG4gICAgICAgICAgICBpZiAocHJldlByZXZTZWcucmluZ091dC5lbmNsb3NpbmdSaW5nKCkgIT09IHByZXZTZWcucmluZ091dCkge1xuICAgICAgICAgICAgICByZXR1cm4gcHJldlNlZy5yaW5nT3V0O1xuICAgICAgICAgICAgfSBlbHNlIHJldHVybiBwcmV2U2VnLnJpbmdPdXQuZW5jbG9zaW5nUmluZygpO1xuICAgICAgICAgIH0gLy8gdHdvIHNlZ21lbnRzIGFyZSBmcm9tIHRoZSBzYW1lIHJpbmcsIHNvIHRoaXMgd2FzIGEgcGVuaXN1bGFcbiAgICAgICAgICAvLyBvZiB0aGF0IHJpbmcuIGl0ZXJhdGUgZG93bndhcmQsIGtlZXAgc2VhcmNoaW5nXG5cblxuICAgICAgICAgIHByZXZTZWcgPSBwcmV2UHJldlNlZy5wcmV2SW5SZXN1bHQoKTtcbiAgICAgICAgICBwcmV2UHJldlNlZyA9IHByZXZTZWcgPyBwcmV2U2VnLnByZXZJblJlc3VsdCgpIDogbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBSaW5nT3V0O1xuICB9KCk7XG4gIHZhciBQb2x5T3V0ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQb2x5T3V0KGV4dGVyaW9yUmluZykge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBvbHlPdXQpO1xuXG4gICAgICB0aGlzLmV4dGVyaW9yUmluZyA9IGV4dGVyaW9yUmluZztcbiAgICAgIGV4dGVyaW9yUmluZy5wb2x5ID0gdGhpcztcbiAgICAgIHRoaXMuaW50ZXJpb3JSaW5ncyA9IFtdO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhQb2x5T3V0LCBbe1xuICAgICAga2V5OiBcImFkZEludGVyaW9yXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkSW50ZXJpb3IocmluZykge1xuICAgICAgICB0aGlzLmludGVyaW9yUmluZ3MucHVzaChyaW5nKTtcbiAgICAgICAgcmluZy5wb2x5ID0gdGhpcztcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0R2VvbVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEdlb20oKSB7XG4gICAgICAgIHZhciBnZW9tID0gW3RoaXMuZXh0ZXJpb3JSaW5nLmdldEdlb20oKV07IC8vIGV4dGVyaW9yIHJpbmcgd2FzIGFsbCAod2l0aGluIHJvdW5kaW5nIGVycm9yIG9mIGFuZ2xlIGNhbGMpIGNvbGluZWFyIHBvaW50c1xuXG4gICAgICAgIGlmIChnZW9tWzBdID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMuaW50ZXJpb3JSaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcmluZ0dlb20gPSB0aGlzLmludGVyaW9yUmluZ3NbaV0uZ2V0R2VvbSgpOyAvLyBpbnRlcmlvciByaW5nIHdhcyBhbGwgKHdpdGhpbiByb3VuZGluZyBlcnJvciBvZiBhbmdsZSBjYWxjKSBjb2xpbmVhciBwb2ludHNcblxuICAgICAgICAgIGlmIChyaW5nR2VvbSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgICAgZ2VvbS5wdXNoKHJpbmdHZW9tKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnZW9tO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQb2x5T3V0O1xuICB9KCk7XG4gIHZhciBNdWx0aVBvbHlPdXQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE11bHRpUG9seU91dChyaW5ncykge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE11bHRpUG9seU91dCk7XG5cbiAgICAgIHRoaXMucmluZ3MgPSByaW5ncztcbiAgICAgIHRoaXMucG9seXMgPSB0aGlzLl9jb21wb3NlUG9seXMocmluZ3MpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhNdWx0aVBvbHlPdXQsIFt7XG4gICAgICBrZXk6IFwiZ2V0R2VvbVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEdlb20oKSB7XG4gICAgICAgIHZhciBnZW9tID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLnBvbHlzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBwb2x5R2VvbSA9IHRoaXMucG9seXNbaV0uZ2V0R2VvbSgpOyAvLyBleHRlcmlvciByaW5nIHdhcyBhbGwgKHdpdGhpbiByb3VuZGluZyBlcnJvciBvZiBhbmdsZSBjYWxjKSBjb2xpbmVhciBwb2ludHNcblxuICAgICAgICAgIGlmIChwb2x5R2VvbSA9PT0gbnVsbCkgY29udGludWU7XG4gICAgICAgICAgZ2VvbS5wdXNoKHBvbHlHZW9tKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnZW9tO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJfY29tcG9zZVBvbHlzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2NvbXBvc2VQb2x5cyhyaW5ncykge1xuICAgICAgICB2YXIgcG9seXMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHJpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciByaW5nID0gcmluZ3NbaV07XG4gICAgICAgICAgaWYgKHJpbmcucG9seSkgY29udGludWU7XG4gICAgICAgICAgaWYgKHJpbmcuaXNFeHRlcmlvclJpbmcoKSkgcG9seXMucHVzaChuZXcgUG9seU91dChyaW5nKSk7ZWxzZSB7XG4gICAgICAgICAgICB2YXIgZW5jbG9zaW5nUmluZyA9IHJpbmcuZW5jbG9zaW5nUmluZygpO1xuICAgICAgICAgICAgaWYgKCFlbmNsb3NpbmdSaW5nLnBvbHkpIHBvbHlzLnB1c2gobmV3IFBvbHlPdXQoZW5jbG9zaW5nUmluZykpO1xuICAgICAgICAgICAgZW5jbG9zaW5nUmluZy5wb2x5LmFkZEludGVyaW9yKHJpbmcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwb2x5cztcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gTXVsdGlQb2x5T3V0O1xuICB9KCk7XG5cbiAgLyoqXG4gICAqIE5PVEU6ICBXZSBtdXN0IGJlIGNhcmVmdWwgbm90IHRvIGNoYW5nZSBhbnkgc2VnbWVudHMgd2hpbGVcbiAgICogICAgICAgIHRoZXkgYXJlIGluIHRoZSBTcGxheVRyZWUuIEFGQUlLLCB0aGVyZSdzIG5vIHdheSB0byB0ZWxsXG4gICAqICAgICAgICB0aGUgdHJlZSB0byByZWJhbGFuY2UgaXRzZWxmIC0gdGh1cyBiZWZvcmUgc3BsaXR0aW5nXG4gICAqICAgICAgICBhIHNlZ21lbnQgdGhhdCdzIGluIHRoZSB0cmVlLCB3ZSByZW1vdmUgaXQgZnJvbSB0aGUgdHJlZSxcbiAgICogICAgICAgIGRvIHRoZSBzcGxpdCwgdGhlbiByZS1pbnNlcnQgaXQuIChFdmVuIHRob3VnaCBzcGxpdHRpbmcgYVxuICAgKiAgICAgICAgc2VnbWVudCAqc2hvdWxkbid0KiBjaGFuZ2UgaXRzIGNvcnJlY3QgcG9zaXRpb24gaW4gdGhlXG4gICAqICAgICAgICBzd2VlcCBsaW5lIHRyZWUsIHRoZSByZWFsaXR5IGlzIGJlY2F1c2Ugb2Ygcm91bmRpbmcgZXJyb3JzLFxuICAgKiAgICAgICAgaXQgc29tZXRpbWVzIGRvZXMuKVxuICAgKi9cblxuICB2YXIgU3dlZXBMaW5lID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTd2VlcExpbmUocXVldWUpIHtcbiAgICAgIHZhciBjb21wYXJhdG9yID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBTZWdtZW50LmNvbXBhcmU7XG5cbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTd2VlcExpbmUpO1xuXG4gICAgICB0aGlzLnF1ZXVlID0gcXVldWU7XG4gICAgICB0aGlzLnRyZWUgPSBuZXcgVHJlZShjb21wYXJhdG9yKTtcbiAgICAgIHRoaXMuc2VnbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU3dlZXBMaW5lLCBbe1xuICAgICAga2V5OiBcInByb2Nlc3NcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9jZXNzKGV2ZW50KSB7XG4gICAgICAgIHZhciBzZWdtZW50ID0gZXZlbnQuc2VnbWVudDtcbiAgICAgICAgdmFyIG5ld0V2ZW50cyA9IFtdOyAvLyBpZiB3ZSd2ZSBhbHJlYWR5IGJlZW4gY29uc3VtZWQgYnkgYW5vdGhlciBzZWdtZW50LFxuICAgICAgICAvLyBjbGVhbiB1cCBvdXIgYm9keSBwYXJ0cyBhbmQgZ2V0IG91dFxuXG4gICAgICAgIGlmIChldmVudC5jb25zdW1lZEJ5KSB7XG4gICAgICAgICAgaWYgKGV2ZW50LmlzTGVmdCkgdGhpcy5xdWV1ZS5yZW1vdmUoZXZlbnQub3RoZXJTRSk7ZWxzZSB0aGlzLnRyZWUucmVtb3ZlKHNlZ21lbnQpO1xuICAgICAgICAgIHJldHVybiBuZXdFdmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbm9kZSA9IGV2ZW50LmlzTGVmdCA/IHRoaXMudHJlZS5pbnNlcnQoc2VnbWVudCkgOiB0aGlzLnRyZWUuZmluZChzZWdtZW50KTtcbiAgICAgICAgaWYgKCFub2RlKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gZmluZCBzZWdtZW50ICNcIi5jb25jYXQoc2VnbWVudC5pZCwgXCIgXCIpICsgXCJbXCIuY29uY2F0KHNlZ21lbnQubGVmdFNFLnBvaW50LngsIFwiLCBcIikuY29uY2F0KHNlZ21lbnQubGVmdFNFLnBvaW50LnksIFwiXSAtPiBcIikgKyBcIltcIi5jb25jYXQoc2VnbWVudC5yaWdodFNFLnBvaW50LngsIFwiLCBcIikuY29uY2F0KHNlZ21lbnQucmlnaHRTRS5wb2ludC55LCBcIl0gXCIpICsgJ2luIFN3ZWVwTGluZSB0cmVlLiBQbGVhc2Ugc3VibWl0IGEgYnVnIHJlcG9ydC4nKTtcbiAgICAgICAgdmFyIHByZXZOb2RlID0gbm9kZTtcbiAgICAgICAgdmFyIG5leHROb2RlID0gbm9kZTtcbiAgICAgICAgdmFyIHByZXZTZWcgPSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBuZXh0U2VnID0gdW5kZWZpbmVkOyAvLyBza2lwIGNvbnN1bWVkIHNlZ21lbnRzIHN0aWxsIGluIHRyZWVcblxuICAgICAgICB3aGlsZSAocHJldlNlZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcHJldk5vZGUgPSB0aGlzLnRyZWUucHJldihwcmV2Tm9kZSk7XG4gICAgICAgICAgaWYgKHByZXZOb2RlID09PSBudWxsKSBwcmV2U2VnID0gbnVsbDtlbHNlIGlmIChwcmV2Tm9kZS5rZXkuY29uc3VtZWRCeSA9PT0gdW5kZWZpbmVkKSBwcmV2U2VnID0gcHJldk5vZGUua2V5O1xuICAgICAgICB9IC8vIHNraXAgY29uc3VtZWQgc2VnbWVudHMgc3RpbGwgaW4gdHJlZVxuXG5cbiAgICAgICAgd2hpbGUgKG5leHRTZWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5leHROb2RlID0gdGhpcy50cmVlLm5leHQobmV4dE5vZGUpO1xuICAgICAgICAgIGlmIChuZXh0Tm9kZSA9PT0gbnVsbCkgbmV4dFNlZyA9IG51bGw7ZWxzZSBpZiAobmV4dE5vZGUua2V5LmNvbnN1bWVkQnkgPT09IHVuZGVmaW5lZCkgbmV4dFNlZyA9IG5leHROb2RlLmtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5pc0xlZnQpIHtcbiAgICAgICAgICAvLyBDaGVjayBmb3IgaW50ZXJzZWN0aW9ucyBhZ2FpbnN0IHRoZSBwcmV2aW91cyBzZWdtZW50IGluIHRoZSBzd2VlcCBsaW5lXG4gICAgICAgICAgdmFyIHByZXZNeVNwbGl0dGVyID0gbnVsbDtcblxuICAgICAgICAgIGlmIChwcmV2U2VnKSB7XG4gICAgICAgICAgICB2YXIgcHJldkludGVyID0gcHJldlNlZy5nZXRJbnRlcnNlY3Rpb24oc2VnbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChwcmV2SW50ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKCFzZWdtZW50LmlzQW5FbmRwb2ludChwcmV2SW50ZXIpKSBwcmV2TXlTcGxpdHRlciA9IHByZXZJbnRlcjtcblxuICAgICAgICAgICAgICBpZiAoIXByZXZTZWcuaXNBbkVuZHBvaW50KHByZXZJbnRlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3RXZlbnRzRnJvbVNwbGl0ID0gdGhpcy5fc3BsaXRTYWZlbHkocHJldlNlZywgcHJldkludGVyKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gbmV3RXZlbnRzRnJvbVNwbGl0Lmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2gobmV3RXZlbnRzRnJvbVNwbGl0W2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIENoZWNrIGZvciBpbnRlcnNlY3Rpb25zIGFnYWluc3QgdGhlIG5leHQgc2VnbWVudCBpbiB0aGUgc3dlZXAgbGluZVxuXG5cbiAgICAgICAgICB2YXIgbmV4dE15U3BsaXR0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKG5leHRTZWcpIHtcbiAgICAgICAgICAgIHZhciBuZXh0SW50ZXIgPSBuZXh0U2VnLmdldEludGVyc2VjdGlvbihzZWdtZW50KTtcblxuICAgICAgICAgICAgaWYgKG5leHRJbnRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoIXNlZ21lbnQuaXNBbkVuZHBvaW50KG5leHRJbnRlcikpIG5leHRNeVNwbGl0dGVyID0gbmV4dEludGVyO1xuXG4gICAgICAgICAgICAgIGlmICghbmV4dFNlZy5pc0FuRW5kcG9pbnQobmV4dEludGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBfbmV3RXZlbnRzRnJvbVNwbGl0ID0gdGhpcy5fc3BsaXRTYWZlbHkobmV4dFNlZywgbmV4dEludGVyKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgX2lNYXggPSBfbmV3RXZlbnRzRnJvbVNwbGl0Lmxlbmd0aDsgX2kgPCBfaU1heDsgX2krKykge1xuICAgICAgICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goX25ld0V2ZW50c0Zyb21TcGxpdFtfaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gLy8gRm9yIHNpbXBsaWNpdHksIGV2ZW4gaWYgd2UgZmluZCBtb3JlIHRoYW4gb25lIGludGVyc2VjdGlvbiB3ZSBvbmx5XG4gICAgICAgICAgLy8gc3BpbHQgb24gdGhlICdlYXJsaWVzdCcgKHN3ZWVwLWxpbmUgc3R5bGUpIG9mIHRoZSBpbnRlcnNlY3Rpb25zLlxuICAgICAgICAgIC8vIFRoZSBvdGhlciBpbnRlcnNlY3Rpb24gd2lsbCBiZSBoYW5kbGVkIGluIGEgZnV0dXJlIHByb2Nlc3MoKS5cblxuXG4gICAgICAgICAgaWYgKHByZXZNeVNwbGl0dGVyICE9PSBudWxsIHx8IG5leHRNeVNwbGl0dGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgbXlTcGxpdHRlciA9IG51bGw7XG4gICAgICAgICAgICBpZiAocHJldk15U3BsaXR0ZXIgPT09IG51bGwpIG15U3BsaXR0ZXIgPSBuZXh0TXlTcGxpdHRlcjtlbHNlIGlmIChuZXh0TXlTcGxpdHRlciA9PT0gbnVsbCkgbXlTcGxpdHRlciA9IHByZXZNeVNwbGl0dGVyO2Vsc2Uge1xuICAgICAgICAgICAgICB2YXIgY21wU3BsaXR0ZXJzID0gU3dlZXBFdmVudC5jb21wYXJlUG9pbnRzKHByZXZNeVNwbGl0dGVyLCBuZXh0TXlTcGxpdHRlcik7XG4gICAgICAgICAgICAgIG15U3BsaXR0ZXIgPSBjbXBTcGxpdHRlcnMgPD0gMCA/IHByZXZNeVNwbGl0dGVyIDogbmV4dE15U3BsaXR0ZXI7XG4gICAgICAgICAgICB9IC8vIFJvdW5kaW5nIGVycm9ycyBjYW4gY2F1c2UgY2hhbmdlcyBpbiBvcmRlcmluZyxcbiAgICAgICAgICAgIC8vIHNvIHJlbW92ZSBhZmVjdGVkIHNlZ21lbnRzIGFuZCByaWdodCBzd2VlcCBldmVudHMgYmVmb3JlIHNwbGl0dGluZ1xuXG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnJlbW92ZShzZWdtZW50LnJpZ2h0U0UpO1xuICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goc2VnbWVudC5yaWdodFNFKTtcblxuICAgICAgICAgICAgdmFyIF9uZXdFdmVudHNGcm9tU3BsaXQyID0gc2VnbWVudC5zcGxpdChteVNwbGl0dGVyKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgX2kyID0gMCwgX2lNYXgyID0gX25ld0V2ZW50c0Zyb21TcGxpdDIubGVuZ3RoOyBfaTIgPCBfaU1heDI7IF9pMisrKSB7XG4gICAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKF9uZXdFdmVudHNGcm9tU3BsaXQyW19pMl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChuZXdFdmVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gV2UgZm91bmQgc29tZSBpbnRlcnNlY3Rpb25zLCBzbyByZS1kbyB0aGUgY3VycmVudCBldmVudCB0b1xuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHN3ZWVwIGxpbmUgb3JkZXJpbmcgaXMgdG90YWxseSBjb25zaXN0ZW50IGZvciBsYXRlclxuICAgICAgICAgICAgLy8gdXNlIHdpdGggdGhlIHNlZ21lbnQgJ3ByZXYnIHBvaW50ZXJzXG4gICAgICAgICAgICB0aGlzLnRyZWUucmVtb3ZlKHNlZ21lbnQpO1xuICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goZXZlbnQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBkb25lIHdpdGggbGVmdCBldmVudFxuICAgICAgICAgICAgdGhpcy5zZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgICAgICAgICAgc2VnbWVudC5wcmV2ID0gcHJldlNlZztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZXZlbnQuaXNSaWdodFxuICAgICAgICAgIC8vIHNpbmNlIHdlJ3JlIGFib3V0IHRvIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3dlZXAgbGluZSwgY2hlY2sgZm9yXG4gICAgICAgICAgLy8gaW50ZXJzZWN0aW9ucyBiZXR3ZWVuIG91ciBwcmV2aW91cyBhbmQgbmV4dCBzZWdtZW50c1xuICAgICAgICAgIGlmIChwcmV2U2VnICYmIG5leHRTZWcpIHtcbiAgICAgICAgICAgIHZhciBpbnRlciA9IHByZXZTZWcuZ2V0SW50ZXJzZWN0aW9uKG5leHRTZWcpO1xuXG4gICAgICAgICAgICBpZiAoaW50ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgaWYgKCFwcmV2U2VnLmlzQW5FbmRwb2ludChpbnRlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgX25ld0V2ZW50c0Zyb21TcGxpdDMgPSB0aGlzLl9zcGxpdFNhZmVseShwcmV2U2VnLCBpbnRlcik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaTMgPSAwLCBfaU1heDMgPSBfbmV3RXZlbnRzRnJvbVNwbGl0My5sZW5ndGg7IF9pMyA8IF9pTWF4MzsgX2kzKyspIHtcbiAgICAgICAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKF9uZXdFdmVudHNGcm9tU3BsaXQzW19pM10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICghbmV4dFNlZy5pc0FuRW5kcG9pbnQoaW50ZXIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9uZXdFdmVudHNGcm9tU3BsaXQ0ID0gdGhpcy5fc3BsaXRTYWZlbHkobmV4dFNlZywgaW50ZXIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2k0ID0gMCwgX2lNYXg0ID0gX25ld0V2ZW50c0Zyb21TcGxpdDQubGVuZ3RoOyBfaTQgPCBfaU1heDQ7IF9pNCsrKSB7XG4gICAgICAgICAgICAgICAgICBuZXdFdmVudHMucHVzaChfbmV3RXZlbnRzRnJvbVNwbGl0NFtfaTRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnRyZWUucmVtb3ZlKHNlZ21lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ld0V2ZW50cztcbiAgICAgIH1cbiAgICAgIC8qIFNhZmVseSBzcGxpdCBhIHNlZ21lbnQgdGhhdCBpcyBjdXJyZW50bHkgaW4gdGhlIGRhdGFzdHJ1Y3R1cmVzXG4gICAgICAgKiBJRSAtIGEgc2VnbWVudCBvdGhlciB0aGFuIHRoZSBvbmUgdGhhdCBpcyBjdXJyZW50bHkgYmVpbmcgcHJvY2Vzc2VkLiAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcIl9zcGxpdFNhZmVseVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9zcGxpdFNhZmVseShzZWcsIHB0KSB7XG4gICAgICAgIC8vIFJvdW5kaW5nIGVycm9ycyBjYW4gY2F1c2UgY2hhbmdlcyBpbiBvcmRlcmluZyxcbiAgICAgICAgLy8gc28gcmVtb3ZlIGFmZWN0ZWQgc2VnbWVudHMgYW5kIHJpZ2h0IHN3ZWVwIGV2ZW50cyBiZWZvcmUgc3BsaXR0aW5nXG4gICAgICAgIC8vIHJlbW92ZU5vZGUoKSBkb2Vzbid0IHdvcmssIHNvIGhhdmUgcmUtZmluZCB0aGUgc2VnXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93OHIvc3BsYXktdHJlZS9wdWxsLzVcbiAgICAgICAgdGhpcy50cmVlLnJlbW92ZShzZWcpO1xuICAgICAgICB2YXIgcmlnaHRTRSA9IHNlZy5yaWdodFNFO1xuICAgICAgICB0aGlzLnF1ZXVlLnJlbW92ZShyaWdodFNFKTtcbiAgICAgICAgdmFyIG5ld0V2ZW50cyA9IHNlZy5zcGxpdChwdCk7XG4gICAgICAgIG5ld0V2ZW50cy5wdXNoKHJpZ2h0U0UpOyAvLyBzcGxpdHRpbmcgY2FuIHRyaWdnZXIgY29uc3VtcHRpb25cblxuICAgICAgICBpZiAoc2VnLmNvbnN1bWVkQnkgPT09IHVuZGVmaW5lZCkgdGhpcy50cmVlLmluc2VydChzZWcpO1xuICAgICAgICByZXR1cm4gbmV3RXZlbnRzO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTd2VlcExpbmU7XG4gIH0oKTtcblxuICB2YXIgUE9MWUdPTl9DTElQUElOR19NQVhfUVVFVUVfU0laRSA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5QT0xZR09OX0NMSVBQSU5HX01BWF9RVUVVRV9TSVpFIHx8IDEwMDAwMDA7XG4gIHZhciBQT0xZR09OX0NMSVBQSU5HX01BWF9TV0VFUExJTkVfU0VHTUVOVFMgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy5lbnYuUE9MWUdPTl9DTElQUElOR19NQVhfU1dFRVBMSU5FX1NFR01FTlRTIHx8IDEwMDAwMDA7XG4gIHZhciBPcGVyYXRpb24gPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE9wZXJhdGlvbigpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBPcGVyYXRpb24pO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhPcGVyYXRpb24sIFt7XG4gICAgICBrZXk6IFwicnVuXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcnVuKHR5cGUsIGdlb20sIG1vcmVHZW9tcykge1xuICAgICAgICBvcGVyYXRpb24udHlwZSA9IHR5cGU7XG4gICAgICAgIHJvdW5kZXIucmVzZXQoKTtcbiAgICAgICAgLyogQ29udmVydCBpbnB1dHMgdG8gTXVsdGlQb2x5IG9iamVjdHMgKi9cblxuICAgICAgICB2YXIgbXVsdGlwb2x5cyA9IFtuZXcgTXVsdGlQb2x5SW4oZ2VvbSwgdHJ1ZSldO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gbW9yZUdlb21zLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIG11bHRpcG9seXMucHVzaChuZXcgTXVsdGlQb2x5SW4obW9yZUdlb21zW2ldLCBmYWxzZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgb3BlcmF0aW9uLm51bU11bHRpUG9seXMgPSBtdWx0aXBvbHlzLmxlbmd0aDtcbiAgICAgICAgLyogQkJveCBvcHRpbWl6YXRpb24gZm9yIGRpZmZlcmVuY2Ugb3BlcmF0aW9uXG4gICAgICAgICAqIElmIHRoZSBiYm94IG9mIGEgbXVsdGlwb2x5Z29uIHRoYXQncyBwYXJ0IG9mIHRoZSBjbGlwcGluZyBkb2Vzbid0XG4gICAgICAgICAqIGludGVyc2VjdCB0aGUgYmJveCBvZiB0aGUgc3ViamVjdCBhdCBhbGwsIHdlIGNhbiBqdXN0IGRyb3AgdGhhdFxuICAgICAgICAgKiBtdWx0aXBsb3lnb24uICovXG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbi50eXBlID09PSAnZGlmZmVyZW5jZScpIHtcbiAgICAgICAgICAvLyBpbiBwbGFjZSByZW1vdmFsXG4gICAgICAgICAgdmFyIHN1YmplY3QgPSBtdWx0aXBvbHlzWzBdO1xuICAgICAgICAgIHZhciBfaSA9IDE7XG5cbiAgICAgICAgICB3aGlsZSAoX2kgPCBtdWx0aXBvbHlzLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGdldEJib3hPdmVybGFwKG11bHRpcG9seXNbX2ldLmJib3gsIHN1YmplY3QuYmJveCkgIT09IG51bGwpIF9pKys7ZWxzZSBtdWx0aXBvbHlzLnNwbGljZShfaSwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIEJCb3ggb3B0aW1pemF0aW9uIGZvciBpbnRlcnNlY3Rpb24gb3BlcmF0aW9uXG4gICAgICAgICAqIElmIHdlIGNhbiBmaW5kIGFueSBwYWlyIG9mIG11bHRpcG9seWdvbnMgd2hvc2UgYmJveCBkb2VzIG5vdCBvdmVybGFwLFxuICAgICAgICAgKiB0aGVuIHRoZSByZXN1bHQgd2lsbCBiZSBlbXB0eS4gKi9cblxuXG4gICAgICAgIGlmIChvcGVyYXRpb24udHlwZSA9PT0gJ2ludGVyc2VjdGlvbicpIHtcbiAgICAgICAgICAvLyBUT0RPOiB0aGlzIGlzIE8obl4yKSBpbiBudW1iZXIgb2YgcG9seWdvbnMuIEJ5IHNvcnRpbmcgdGhlIGJib3hlcyxcbiAgICAgICAgICAvLyAgICAgICBpdCBjb3VsZCBiZSBvcHRpbWl6ZWQgdG8gTyhuICogbG4obikpXG4gICAgICAgICAgZm9yICh2YXIgX2kyID0gMCwgX2lNYXggPSBtdWx0aXBvbHlzLmxlbmd0aDsgX2kyIDwgX2lNYXg7IF9pMisrKSB7XG4gICAgICAgICAgICB2YXIgbXBBID0gbXVsdGlwb2x5c1tfaTJdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gX2kyICsgMSwgak1heCA9IG11bHRpcG9seXMubGVuZ3RoOyBqIDwgak1heDsgaisrKSB7XG4gICAgICAgICAgICAgIGlmIChnZXRCYm94T3ZlcmxhcChtcEEuYmJveCwgbXVsdGlwb2x5c1tqXS5iYm94KSA9PT0gbnVsbCkgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBQdXQgc2VnbWVudCBlbmRwb2ludHMgaW4gYSBwcmlvcml0eSBxdWV1ZSAqL1xuXG5cbiAgICAgICAgdmFyIHF1ZXVlID0gbmV3IFRyZWUoU3dlZXBFdmVudC5jb21wYXJlKTtcblxuICAgICAgICBmb3IgKHZhciBfaTMgPSAwLCBfaU1heDIgPSBtdWx0aXBvbHlzLmxlbmd0aDsgX2kzIDwgX2lNYXgyOyBfaTMrKykge1xuICAgICAgICAgIHZhciBzd2VlcEV2ZW50cyA9IG11bHRpcG9seXNbX2kzXS5nZXRTd2VlcEV2ZW50cygpO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2ogPSAwLCBfak1heCA9IHN3ZWVwRXZlbnRzLmxlbmd0aDsgX2ogPCBfak1heDsgX2orKykge1xuICAgICAgICAgICAgcXVldWUuaW5zZXJ0KHN3ZWVwRXZlbnRzW19qXSk7XG5cbiAgICAgICAgICAgIGlmIChxdWV1ZS5zaXplID4gUE9MWUdPTl9DTElQUElOR19NQVhfUVVFVUVfU0laRSkge1xuICAgICAgICAgICAgICAvLyBwcmV2ZW50cyBhbiBpbmZpbml0ZSBsb29wLCBhbiBvdGhlcndpc2UgY29tbW9uIG1hbmlmZXN0YXRpb24gb2YgYnVnc1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3Agd2hlbiBwdXR0aW5nIHNlZ21lbnQgZW5kcG9pbnRzIGluIGEgcHJpb3JpdHkgcXVldWUgJyArICcocXVldWUgc2l6ZSB0b28gYmlnKS4gUGxlYXNlIGZpbGUgYSBidWcgcmVwb3J0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBQYXNzIHRoZSBzd2VlcCBsaW5lIG92ZXIgdGhvc2UgZW5kcG9pbnRzICovXG5cblxuICAgICAgICB2YXIgc3dlZXBMaW5lID0gbmV3IFN3ZWVwTGluZShxdWV1ZSk7XG4gICAgICAgIHZhciBwcmV2UXVldWVTaXplID0gcXVldWUuc2l6ZTtcbiAgICAgICAgdmFyIG5vZGUgPSBxdWV1ZS5wb3AoKTtcblxuICAgICAgICB3aGlsZSAobm9kZSkge1xuICAgICAgICAgIHZhciBldnQgPSBub2RlLmtleTtcblxuICAgICAgICAgIGlmIChxdWV1ZS5zaXplID09PSBwcmV2UXVldWVTaXplKSB7XG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBhbiBpbmZpbml0ZSBsb29wLCBhbiBvdGhlcndpc2UgY29tbW9uIG1hbmlmZXN0YXRpb24gb2YgYnVnc1xuICAgICAgICAgICAgdmFyIHNlZyA9IGV2dC5zZWdtZW50O1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5hYmxlIHRvIHBvcCgpIFwiLmNvbmNhdChldnQuaXNMZWZ0ID8gJ2xlZnQnIDogJ3JpZ2h0JywgXCIgU3dlZXBFdmVudCBcIikgKyBcIltcIi5jb25jYXQoZXZ0LnBvaW50LngsIFwiLCBcIikuY29uY2F0KGV2dC5wb2ludC55LCBcIl0gZnJvbSBzZWdtZW50ICNcIikuY29uY2F0KHNlZy5pZCwgXCIgXCIpICsgXCJbXCIuY29uY2F0KHNlZy5sZWZ0U0UucG9pbnQueCwgXCIsIFwiKS5jb25jYXQoc2VnLmxlZnRTRS5wb2ludC55LCBcIl0gLT4gXCIpICsgXCJbXCIuY29uY2F0KHNlZy5yaWdodFNFLnBvaW50LngsIFwiLCBcIikuY29uY2F0KHNlZy5yaWdodFNFLnBvaW50LnksIFwiXSBmcm9tIHF1ZXVlLiBcIikgKyAnUGxlYXNlIGZpbGUgYSBidWcgcmVwb3J0LicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChxdWV1ZS5zaXplID4gUE9MWUdPTl9DTElQUElOR19NQVhfUVVFVUVfU0laRSkge1xuICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gaW5maW5pdGUgbG9vcCwgYW4gb3RoZXJ3aXNlIGNvbW1vbiBtYW5pZmVzdGF0aW9uIG9mIGJ1Z3NcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgbG9vcCB3aGVuIHBhc3Npbmcgc3dlZXAgbGluZSBvdmVyIGVuZHBvaW50cyAnICsgJyhxdWV1ZSBzaXplIHRvbyBiaWcpLiBQbGVhc2UgZmlsZSBhIGJ1ZyByZXBvcnQuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN3ZWVwTGluZS5zZWdtZW50cy5sZW5ndGggPiBQT0xZR09OX0NMSVBQSU5HX01BWF9TV0VFUExJTkVfU0VHTUVOVFMpIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGluZmluaXRlIGxvb3AsIGFuIG90aGVyd2lzZSBjb21tb24gbWFuaWZlc3RhdGlvbiBvZiBidWdzXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luZmluaXRlIGxvb3Agd2hlbiBwYXNzaW5nIHN3ZWVwIGxpbmUgb3ZlciBlbmRwb2ludHMgJyArICcodG9vIG1hbnkgc3dlZXAgbGluZSBzZWdtZW50cykuIFBsZWFzZSBmaWxlIGEgYnVnIHJlcG9ydC4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbmV3RXZlbnRzID0gc3dlZXBMaW5lLnByb2Nlc3MoZXZ0KTtcblxuICAgICAgICAgIGZvciAodmFyIF9pNCA9IDAsIF9pTWF4MyA9IG5ld0V2ZW50cy5sZW5ndGg7IF9pNCA8IF9pTWF4MzsgX2k0KyspIHtcbiAgICAgICAgICAgIHZhciBfZXZ0ID0gbmV3RXZlbnRzW19pNF07XG4gICAgICAgICAgICBpZiAoX2V2dC5jb25zdW1lZEJ5ID09PSB1bmRlZmluZWQpIHF1ZXVlLmluc2VydChfZXZ0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwcmV2UXVldWVTaXplID0gcXVldWUuc2l6ZTtcbiAgICAgICAgICBub2RlID0gcXVldWUucG9wKCk7XG4gICAgICAgIH0gLy8gZnJlZSBzb21lIG1lbW9yeSB3ZSBkb24ndCBuZWVkIGFueW1vcmVcblxuXG4gICAgICAgIHJvdW5kZXIucmVzZXQoKTtcbiAgICAgICAgLyogQ29sbGVjdCBhbmQgY29tcGlsZSBzZWdtZW50cyB3ZSdyZSBrZWVwaW5nIGludG8gYSBtdWx0aXBvbHlnb24gKi9cblxuICAgICAgICB2YXIgcmluZ3NPdXQgPSBSaW5nT3V0LmZhY3Rvcnkoc3dlZXBMaW5lLnNlZ21lbnRzKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBNdWx0aVBvbHlPdXQocmluZ3NPdXQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmdldEdlb20oKTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gT3BlcmF0aW9uO1xuICB9KCk7IC8vIHNpbmdsZXRvbiBhdmFpbGFibGUgYnkgaW1wb3J0XG5cbiAgdmFyIG9wZXJhdGlvbiA9IG5ldyBPcGVyYXRpb24oKTtcblxuICB2YXIgdW5pb24gPSBmdW5jdGlvbiB1bmlvbihnZW9tKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1vcmVHZW9tcyA9IG5ldyBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBtb3JlR2VvbXNbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiBvcGVyYXRpb24ucnVuKCd1bmlvbicsIGdlb20sIG1vcmVHZW9tcyk7XG4gIH07XG5cbiAgdmFyIGludGVyc2VjdGlvbiQxID0gZnVuY3Rpb24gaW50ZXJzZWN0aW9uKGdlb20pIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIG1vcmVHZW9tcyA9IG5ldyBBcnJheShfbGVuMiA+IDEgPyBfbGVuMiAtIDEgOiAwKSwgX2tleTIgPSAxOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBtb3JlR2VvbXNbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wZXJhdGlvbi5ydW4oJ2ludGVyc2VjdGlvbicsIGdlb20sIG1vcmVHZW9tcyk7XG4gIH07XG5cbiAgdmFyIHhvciA9IGZ1bmN0aW9uIHhvcihnZW9tKSB7XG4gICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBtb3JlR2VvbXMgPSBuZXcgQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgbW9yZUdlb21zW19rZXkzIC0gMV0gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgIH1cblxuICAgIHJldHVybiBvcGVyYXRpb24ucnVuKCd4b3InLCBnZW9tLCBtb3JlR2VvbXMpO1xuICB9O1xuXG4gIHZhciBkaWZmZXJlbmNlID0gZnVuY3Rpb24gZGlmZmVyZW5jZShzdWJqZWN0R2VvbSkge1xuICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgY2xpcHBpbmdHZW9tcyA9IG5ldyBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICBjbGlwcGluZ0dlb21zW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgIH1cblxuICAgIHJldHVybiBvcGVyYXRpb24ucnVuKCdkaWZmZXJlbmNlJywgc3ViamVjdEdlb20sIGNsaXBwaW5nR2VvbXMpO1xuICB9O1xuXG4gIHZhciBpbmRleCA9IHtcbiAgICB1bmlvbjogdW5pb24sXG4gICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24kMSxcbiAgICB4b3I6IHhvcixcbiAgICBkaWZmZXJlbmNlOiBkaWZmZXJlbmNlXG4gIH07XG5cbiAgcmV0dXJuIGluZGV4O1xuXG59KSkpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCB7IFVJQWN0aW9uVHlwZXMsIFdvcmtlckFjdGlvblR5cGVzLCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U3ZnUGF0aEZyb21TdHJva2UsIGFkZFZlY3RvcnMsIGludGVycG9sYXRlQ3ViaWNCZXppZXIsIGdldEZsYXRTdmdQYXRoRnJvbVN0cm9rZSwgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBnZXRTdHJva2UgZnJvbSBcInBlcmZlY3QtZnJlZWhhbmRcIjtcbmltcG9ydCB7IGNvbXByZXNzVG9VVEYxNiwgZGVjb21wcmVzc0Zyb21VVEYxNiB9IGZyb20gXCJsei1zdHJpbmdcIjtcbi8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIENvbW1zIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4vLyBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHBsdWdpbiBVSVxuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pIHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGUsIHBheWxvYWQgfSk7XG59XG4vLyBTYXZlIHNvbWUgaW5mb3JtYXRpb24gYWJvdXQgdGhlIG5vZGUgdG8gaXRzIHBsdWdpbiBkYXRhLlxuZnVuY3Rpb24gc2V0T3JpZ2luYWxOb2RlKG5vZGUpIHtcbiAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSB7XG4gICAgICAgIGNlbnRlcjogZ2V0Q2VudGVyKG5vZGUpLFxuICAgICAgICB2ZWN0b3JOZXR3b3JrOiBPYmplY3QuYXNzaWduKHt9LCBub2RlLnZlY3Rvck5ldHdvcmspLFxuICAgICAgICB2ZWN0b3JQYXRoczogbm9kZS52ZWN0b3JQYXRocyxcbiAgICB9O1xuICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiwgY29tcHJlc3NUb1VURjE2KEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsTm9kZSkpKTtcbiAgICByZXR1cm4gb3JpZ2luYWxOb2RlO1xufVxuLy8gR2V0IGFuIG9yaWdpbmFsIG5vZGUgZnJvbSBhIG5vZGUncyBwbHVnaW4gZGF0YS5cbmZ1bmN0aW9uIGdldE9yaWdpbmFsTm9kZShpZCkge1xuICAgIGxldCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgIGNvbnN0IHBsdWdpbkRhdGEgPSBub2RlLmdldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIpO1xuICAgIC8vIE5vdGhpbmcgb24gdGhlIG5vZGUg4oCUIHdlIGhhdmVuJ3QgbW9kaWZpZWQgaXQuXG4gICAgaWYgKCFwbHVnaW5EYXRhKVxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIC8vIERlY29tcHJlc3MgdGhlIHNhdmVkIGRhdGEgYW5kIHBhcnNlIG91dCB0aGUgb3JpZ2luYWwgbm9kZS5cbiAgICBjb25zdCBkZWNvbXByZXNzZWQgPSBkZWNvbXByZXNzRnJvbVVURjE2KHBsdWdpbkRhdGEpO1xuICAgIGlmICghZGVjb21wcmVzc2VkKSB7XG4gICAgICAgIHRocm93IEVycm9yKFwiRm91bmQgc2F2ZWQgZGF0YSBmb3Igb3JpZ2luYWwgbm9kZSBidXQgY291bGQgbm90IGRlY29tcHJlc3MgaXQ6IFwiICtcbiAgICAgICAgICAgIGRlY29tcHJlc3NlZCk7XG4gICAgfVxuICAgIHJldHVybiBKU09OLnBhcnNlKGRlY29tcHJlc3NlZCk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tIE5vZGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gR2V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgVmVjdG9yIG5vZGVzIGZvciB0aGUgVUkuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZE5vZGVzKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKChub2RlKSA9PiAoe1xuICAgICAgICBpZDogbm9kZS5pZCxcbiAgICAgICAgbmFtZTogbm9kZS5uYW1lLFxuICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgIGNhblJlc2V0OiAhIW5vZGUuZ2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiksXG4gICAgfSkpO1xufVxuLy8gR2V0dGhlIGN1cnJlbnRseSBzZWxlY3RlZCBWZWN0b3Igbm9kZXMgYXMgYW4gYXJyYXkgb2YgSWRzLlxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWROb2RlSWRzKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKCh7IGlkIH0pID0+IGlkKTtcbn1cbi8vIEZpbmQgdGhlIGNlbnRlciBvZiBhIG5vZGUuXG5mdW5jdGlvbiBnZXRDZW50ZXIobm9kZSkge1xuICAgIGxldCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IG5vZGU7XG4gICAgcmV0dXJuIHsgeDogeCArIHdpZHRoIC8gMiwgeTogeSArIGhlaWdodCAvIDIgfTtcbn1cbi8vIE1vdmUgYSBub2RlIHRvIGEgY2VudGVyLlxuZnVuY3Rpb24gbW92ZU5vZGVUb0NlbnRlcihub2RlLCBjZW50ZXIpIHtcbiAgICBjb25zdCB7IHg6IHgwLCB5OiB5MCB9ID0gZ2V0Q2VudGVyKG5vZGUpO1xuICAgIGNvbnN0IHsgeDogeDEsIHk6IHkxIH0gPSBjZW50ZXI7XG4gICAgbm9kZS54ID0gbm9kZS54ICsgeDEgLSB4MDtcbiAgICBub2RlLnkgPSBub2RlLnkgKyB5MSAtIHkwO1xufVxuLy8gWm9vbSB0aGUgRmlnbWEgdmlld3BvcnQgdG8gYSBub2RlLlxuZnVuY3Rpb24gem9vbVRvTm9kZShpZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gU2VsZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIERlc2VsZWN0cyBhIEZpZ21hIG5vZGVcbmZ1bmN0aW9uIGRlc2VsZWN0Tm9kZShpZCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiBub2RlLmlkICE9PSBpZCk7XG59XG4vLyBTZW5kIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgVUkgc3RhdGVcbmZ1bmN0aW9uIHNlbmRJbml0aWFsU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuRk9VTkRfU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZW5kU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLSBDaGFuZ2luZyBWZWN0b3JOb2RlcyAtLS0tLS0tLS0tLS0tLSAqL1xuLy8gTnVtYmVyIG9mIG5ldyBub2RlcyB0byBpbnNlcnRcbmNvbnN0IFNQTElUID0gNTtcbi8vIFNvbWUgYmFzaWMgZWFzaW5nIGZ1bmN0aW9uc1xuY29uc3QgRUFTSU5HUyA9IHtcbiAgICBsaW5lYXI6ICh0KSA9PiB0LFxuICAgIGVhc2VJbjogKHQpID0+IHQgKiB0LFxuICAgIGVhc2VPdXQ6ICh0KSA9PiB0ICogKDIgLSB0KSxcbiAgICBlYXNlSW5PdXQ6ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IC0xICsgKDQgLSAyICogdCkgKiB0KSxcbn07XG4vLyBDb21wdXRlIGEgc3Ryb2tlIGJhc2VkIG9uIHRoZSB2ZWN0b3IgYW5kIGFwcGx5IGl0IHRvIHRoZSB2ZWN0b3IncyBwYXRoIGRhdGEuXG5mdW5jdGlvbiBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMobm9kZUlkcywgeyBvcHRpb25zLCBlYXNpbmcgPSBcImxpbmVhclwiLCBjbGlwLCB9LCByZXN0cmljdFRvS25vd25Ob2RlcyA9IGZhbHNlKSB7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICAvLyBHZXQgdGhlIG5vZGUgdGhhdCB3ZSB3YW50IHRvIGNoYW5nZVxuICAgICAgICBjb25zdCBub2RlVG9DaGFuZ2UgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghbm9kZVRvQ2hhbmdlKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbm9kZTogXCIgKyBpZCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gR2V0IHRoZSBvcmlnaW5hbCBub2RlXG4gICAgICAgIGxldCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUobm9kZVRvQ2hhbmdlLmlkKTtcbiAgICAgICAgLy8gSWYgd2UgZG9uJ3Qga25vdyB0aGlzIG5vZGUuLi5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpIHtcbiAgICAgICAgICAgIC8vIEJhaWwgaWYgd2UncmUgdXBkYXRpbmcgbm9kZXNcbiAgICAgICAgICAgIGlmIChyZXN0cmljdFRvS25vd25Ob2RlcylcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBvcmlnaW5hbCBub2RlIGFuZCBjb250aW51ZVxuICAgICAgICAgICAgb3JpZ2luYWxOb2RlID0gc2V0T3JpZ2luYWxOb2RlKG5vZGVUb0NoYW5nZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW50ZXJwb2xhdGUgbmV3IHBvaW50cyBhbG9uZyB0aGUgdmVjdG9yJ3MgY3VydmVcbiAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2Ygb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsuc2VnbWVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHAwID0gb3JpZ2luYWxOb2RlLnZlY3Rvck5ldHdvcmsudmVydGljZXNbc2VnbWVudC5zdGFydF07XG4gICAgICAgICAgICBjb25zdCBwMyA9IG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuZW5kXTtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gYWRkVmVjdG9ycyhwMCwgc2VnbWVudC50YW5nZW50U3RhcnQpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBhZGRWZWN0b3JzKHAzLCBzZWdtZW50LnRhbmdlbnRFbmQpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdG9yID0gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgcDEsIHAyLCBwMyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNQTElUOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwdHMucHVzaChpbnRlcnBvbGF0b3IoaSAvIFNQTElUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IHN0cm9rZSB1c2luZyBwZXJmZWN0LWZyZWVoYW5kXG4gICAgICAgIGNvbnN0IHN0cm9rZSA9IGdldFN0cm9rZShwdHMsIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyksIHsgZWFzaW5nOiBFQVNJTkdTW2Vhc2luZ10gfSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gU2V0IHN0cm9rZSB0byB2ZWN0b3IgcGF0aHNcbiAgICAgICAgICAgIG5vZGVUb0NoYW5nZS52ZWN0b3JQYXRocyA9IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRpbmdSdWxlOiBcIk5PTlpFUk9cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY2xpcFxuICAgICAgICAgICAgICAgICAgICAgICAgPyBnZXRGbGF0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGFwcGx5IHN0cm9rZVwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRqdXN0IHRoZSBwb3NpdGlvbiBvZiB0aGUgbm9kZSBzbyB0aGF0IGl0cyBjZW50ZXIgZG9lcyBub3QgY2hhbmdlXG4gICAgICAgIG1vdmVOb2RlVG9DZW50ZXIobm9kZVRvQ2hhbmdlLCBvcmlnaW5hbE5vZGUuY2VudGVyKTtcbiAgICB9XG4gICAgc2VuZFNlbGVjdGVkTm9kZXMoKTtcbn1cbi8vIFJlc2V0IHRoZSBub2RlIHRvIGl0cyBvcmlnaW5hbCBwYXRoIGRhdGEsIHVzaW5nIGRhdGEgZnJvbSBvdXIgY2FjaGUgYW5kIHRoZW4gZGVsZXRlIHRoZSBub2RlLlxuZnVuY3Rpb24gcmVzZXRWZWN0b3JOb2RlcygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBnZXRTZWxlY3RlZE5vZGVJZHMoKSkge1xuICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUoaWQpO1xuICAgICAgICAvLyBXZSBoYXZlbid0IG1vZGlmaWVkIHRoaXMgbm9kZS5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUudmVjdG9yUGF0aHMgPSBvcmlnaW5hbE5vZGUudmVjdG9yUGF0aHM7XG4gICAgICAgIGN1cnJlbnROb2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIFwiXCIpO1xuICAgICAgICAvLyBUT0RPOiBJZiBhIHVzZXIgaGFzIG1vdmVkIGEgbm9kZSB0aGVtc2VsdmVzLCB0aGlzIHdpbGwgbW92ZSBpdCBiYWNrIHRvIGl0cyBvcmlnaW5hbCBwbGFjZS5cbiAgICAgICAgLy8gbm9kZS54ID0gb3JpZ2luYWxOb2RlLnhcbiAgICAgICAgLy8gbm9kZS55ID0gb3JpZ2luYWxOb2RlLnlcbiAgICAgICAgc2VuZFNlbGVjdGVkTm9kZXMoKTtcbiAgICB9XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gS2lja29mZiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gTGlzdGVuIHRvIG1lc3NhZ2VzIHJlY2VpdmVkIGZyb20gdGhlIHBsdWdpbiBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5DTE9TRTpcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlpPT01fVE9fTk9ERTpcbiAgICAgICAgICAgIHpvb21Ub05vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLkRFU0VMRUNUX05PREU6XG4gICAgICAgICAgICBkZXNlbGVjdE5vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlJFU0VUX05PREVTOlxuICAgICAgICAgICAgcmVzZXRWZWN0b3JOb2RlcygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5UUkFOU0ZPUk1fTk9ERVM6XG4gICAgICAgICAgICBhcHBseVBlcmZlY3RGcmVlaGFuZFRvVmVjdG9yTm9kZXMoZ2V0U2VsZWN0ZWROb2RlSWRzKCksIHBheWxvYWQsIGZhbHNlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVVBEQVRFRF9PUFRJT05TOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCB0cnVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbn07XG4vLyBMaXN0ZW4gZm9yIHNlbGVjdGlvbiBjaGFuZ2VzXG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCBzZW5kU2VsZWN0ZWROb2Rlcyk7XG4vLyBTaG93IHRoZSBwbHVnaW4gaW50ZXJmYWNlXG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDMyMCwgaGVpZ2h0OiA0MjAgfSk7XG4vLyBTZW5kIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgVUlcbnNlbmRJbml0aWFsU2VsZWN0ZWROb2RlcygpO1xuIiwiLy8gVUkgYWN0aW9uc1xuZXhwb3J0IHZhciBVSUFjdGlvblR5cGVzO1xuKGZ1bmN0aW9uIChVSUFjdGlvblR5cGVzKSB7XG4gICAgVUlBY3Rpb25UeXBlc1tcIkNMT1NFXCJdID0gXCJDTE9TRVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJaT09NX1RPX05PREVcIl0gPSBcIlpPT01fVE9fTk9ERVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJERVNFTEVDVF9OT0RFXCJdID0gXCJERVNFTEVDVF9OT0RFXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlRSQU5TRk9STV9OT0RFU1wiXSA9IFwiVFJBTlNGT1JNX05PREVTXCI7XG4gICAgVUlBY3Rpb25UeXBlc1tcIlJFU0VUX05PREVTXCJdID0gXCJSRVNFVF9OT0RFU1wiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJVUERBVEVEX09QVElPTlNcIl0gPSBcIlVQREFURURfT1BUSU9OU1wiO1xufSkoVUlBY3Rpb25UeXBlcyB8fCAoVUlBY3Rpb25UeXBlcyA9IHt9KSk7XG4vLyBXb3JrZXIgYWN0aW9uc1xuZXhwb3J0IHZhciBXb3JrZXJBY3Rpb25UeXBlcztcbihmdW5jdGlvbiAoV29ya2VyQWN0aW9uVHlwZXMpIHtcbiAgICBXb3JrZXJBY3Rpb25UeXBlc1tcIlNFTEVDVEVEX05PREVTXCJdID0gXCJTRUxFQ1RFRF9OT0RFU1wiO1xuICAgIFdvcmtlckFjdGlvblR5cGVzW1wiRk9VTkRfU0VMRUNURURfTk9ERVNcIl0gPSBcIkZPVU5EX1NFTEVDVEVEX05PREVTXCI7XG59KShXb3JrZXJBY3Rpb25UeXBlcyB8fCAoV29ya2VyQWN0aW9uVHlwZXMgPSB7fSkpO1xuIiwiaW1wb3J0IHBvbHlnb25DbGlwcGluZyBmcm9tIFwicG9seWdvbi1jbGlwcGluZ1wiO1xuY29uc3QgeyBwb3cgfSA9IE1hdGg7XG5leHBvcnQgZnVuY3Rpb24gY3ViaWNCZXppZXIodHgsIHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgLy8gSW5zcGlyZWQgYnkgRG9uIExhbmNhc3RlcidzIHR3byBhcnRpY2xlc1xuICAgIC8vIGh0dHA6Ly93d3cudGluYWphLmNvbS9nbGliL2N1YmVtYXRoLnBkZlxuICAgIC8vIGh0dHA6Ly93d3cudGluYWphLmNvbS90ZXh0L2Jlem1hdGguaHRtbFxuICAgIC8vIFNldCBwMCBhbmQgcDEgcG9pbnRcbiAgICBsZXQgeDAgPSAwLCB5MCA9IDAsIHgzID0gMSwgeTMgPSAxLCBcbiAgICAvLyBDb252ZXJ0IHRoZSBjb29yZGluYXRlcyB0byBlcXVhdGlvbiBzcGFjZVxuICAgIEEgPSB4MyAtIDMgKiB4MiArIDMgKiB4MSAtIHgwLCBCID0gMyAqIHgyIC0gNiAqIHgxICsgMyAqIHgwLCBDID0gMyAqIHgxIC0gMyAqIHgwLCBEID0geDAsIEUgPSB5MyAtIDMgKiB5MiArIDMgKiB5MSAtIHkwLCBGID0gMyAqIHkyIC0gNiAqIHkxICsgMyAqIHkwLCBHID0gMyAqIHkxIC0gMyAqIHkwLCBIID0geTAsIFxuICAgIC8vIFZhcmlhYmxlcyBmb3IgdGhlIGxvb3AgYmVsb3dcbiAgICB0ID0gdHgsIGl0ZXJhdGlvbnMgPSA1LCBpLCBzbG9wZSwgeCwgeTtcbiAgICAvLyBMb29wIHRocm91Z2ggYSBmZXcgdGltZXMgdG8gZ2V0IGEgbW9yZSBhY2N1cmF0ZSB0aW1lIHZhbHVlLCBhY2NvcmRpbmcgdG8gdGhlIE5ld3Rvbi1SYXBoc29uIG1ldGhvZFxuICAgIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTmV3dG9uJ3NfbWV0aG9kXG4gICAgZm9yIChpID0gMDsgaSA8IGl0ZXJhdGlvbnM7IGkrKykge1xuICAgICAgICAvLyBUaGUgY3VydmUncyB4IGVxdWF0aW9uIGZvciB0aGUgY3VycmVudCB0aW1lIHZhbHVlXG4gICAgICAgIHggPSBBICogdCAqIHQgKiB0ICsgQiAqIHQgKiB0ICsgQyAqIHQgKyBEO1xuICAgICAgICAvLyBUaGUgc2xvcGUgd2Ugd2FudCBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgZGVyaXZhdGUgb2YgeFxuICAgICAgICBzbG9wZSA9IDEgLyAoMyAqIEEgKiB0ICogdCArIDIgKiBCICogdCArIEMpO1xuICAgICAgICAvLyBHZXQgdGhlIG5leHQgZXN0aW1hdGVkIHRpbWUgdmFsdWUsIHdoaWNoIHdpbGwgYmUgbW9yZSBhY2N1cmF0ZSB0aGFuIHRoZSBvbmUgYmVmb3JlXG4gICAgICAgIHQgLT0gKHggLSB0eCkgKiBzbG9wZTtcbiAgICAgICAgdCA9IHQgPiAxID8gMSA6IHQgPCAwID8gMCA6IHQ7XG4gICAgfVxuICAgIC8vIEZpbmQgdGhlIHkgdmFsdWUgdGhyb3VnaCB0aGUgY3VydmUncyB5IGVxdWF0aW9uLCB3aXRoIHRoZSBub3cgbW9yZSBhY2N1cmF0ZSB0aW1lIHZhbHVlXG4gICAgeSA9IE1hdGguYWJzKEUgKiB0ICogdCAqIHQgKyBGICogdCAqIHQgKyBHICogdCAqIEgpO1xuICAgIHJldHVybiB5O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFBvaW50c0Fsb25nQ3ViaWNCZXppZXIocHRDb3VudCwgcHhUb2xlcmFuY2UsIEF4LCBBeSwgQngsIEJ5LCBDeCwgQ3ksIER4LCBEeSkge1xuICAgIGxldCBkZWx0YUJBeCA9IEJ4IC0gQXg7XG4gICAgbGV0IGRlbHRhQ0J4ID0gQ3ggLSBCeDtcbiAgICBsZXQgZGVsdGFEQ3ggPSBEeCAtIEN4O1xuICAgIGxldCBkZWx0YUJBeSA9IEJ5IC0gQXk7XG4gICAgbGV0IGRlbHRhQ0J5ID0gQ3kgLSBCeTtcbiAgICBsZXQgZGVsdGFEQ3kgPSBEeSAtIEN5O1xuICAgIGxldCBheCwgYXksIGJ4LCBieSwgY3gsIGN5O1xuICAgIGxldCBsYXN0WCA9IC0xMDAwMDtcbiAgICBsZXQgbGFzdFkgPSAtMTAwMDA7XG4gICAgbGV0IHB0cyA9IFt7IHg6IEF4LCB5OiBBeSB9XTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHB0Q291bnQ7IGkrKykge1xuICAgICAgICBsZXQgdCA9IGkgLyBwdENvdW50O1xuICAgICAgICBheCA9IEF4ICsgZGVsdGFCQXggKiB0O1xuICAgICAgICBieCA9IEJ4ICsgZGVsdGFDQnggKiB0O1xuICAgICAgICBjeCA9IEN4ICsgZGVsdGFEQ3ggKiB0O1xuICAgICAgICBheCArPSAoYnggLSBheCkgKiB0O1xuICAgICAgICBieCArPSAoY3ggLSBieCkgKiB0O1xuICAgICAgICBheSA9IEF5ICsgZGVsdGFCQXkgKiB0O1xuICAgICAgICBieSA9IEJ5ICsgZGVsdGFDQnkgKiB0O1xuICAgICAgICBjeSA9IEN5ICsgZGVsdGFEQ3kgKiB0O1xuICAgICAgICBheSArPSAoYnkgLSBheSkgKiB0O1xuICAgICAgICBieSArPSAoY3kgLSBieSkgKiB0O1xuICAgICAgICBjb25zdCB4ID0gYXggKyAoYnggLSBheCkgKiB0O1xuICAgICAgICBjb25zdCB5ID0gYXkgKyAoYnkgLSBheSkgKiB0O1xuICAgICAgICBjb25zdCBkeCA9IHggLSBsYXN0WDtcbiAgICAgICAgY29uc3QgZHkgPSB5IC0gbGFzdFk7XG4gICAgICAgIGlmIChkeCAqIGR4ICsgZHkgKiBkeSA+IHB4VG9sZXJhbmNlKSB7XG4gICAgICAgICAgICBwdHMucHVzaCh7IHg6IHgsIHk6IHkgfSk7XG4gICAgICAgICAgICBsYXN0WCA9IHg7XG4gICAgICAgICAgICBsYXN0WSA9IHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcHRzLnB1c2goeyB4OiBEeCwgeTogRHkgfSk7XG4gICAgcmV0dXJuIHB0cztcbn1cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnBvbGF0ZUN1YmljQmV6aWVyKHAwLCBjMCwgYzEsIHAxKSB7XG4gICAgLy8gMCA8PSB0IDw9IDFcbiAgICByZXR1cm4gZnVuY3Rpb24gaW50ZXJwb2xhdG9yKHQpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHBvdygxIC0gdCwgMykgKiBwMC54ICtcbiAgICAgICAgICAgICAgICAzICogcG93KDEgLSB0LCAyKSAqIHQgKiBjMC54ICtcbiAgICAgICAgICAgICAgICAzICogKDEgLSB0KSAqIHBvdyh0LCAyKSAqIGMxLnggK1xuICAgICAgICAgICAgICAgIHBvdyh0LCAzKSAqIHAxLngsXG4gICAgICAgICAgICBwb3coMSAtIHQsIDMpICogcDAueSArXG4gICAgICAgICAgICAgICAgMyAqIHBvdygxIC0gdCwgMikgKiB0ICogYzAueSArXG4gICAgICAgICAgICAgICAgMyAqICgxIC0gdCkgKiBwb3codCwgMikgKiBjMS55ICtcbiAgICAgICAgICAgICAgICBwb3codCwgMykgKiBwMS55LFxuICAgICAgICBdO1xuICAgIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkVmVjdG9ycyhhLCBiKSB7XG4gICAgaWYgKCFiKVxuICAgICAgICByZXR1cm4gYTtcbiAgICByZXR1cm4geyB4OiBhLnggKyBiLngsIHk6IGEueSArIGIueSB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSkge1xuICAgIGlmIChzdHJva2UubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICBjb25zdCBkID0gW107XG4gICAgbGV0IFtwMCwgcDFdID0gc3Ryb2tlO1xuICAgIGQucHVzaChcIk1cIiwgcDBbMF0sIHAwWzFdKTtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHN0cm9rZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBkLnB1c2goXCJRXCIsIHAwWzBdLCBwMFsxXSwgKHAwWzBdICsgcDFbMF0pIC8gMiwgKHAwWzFdICsgcDFbMV0pIC8gMik7XG4gICAgICAgIHAwID0gcDE7XG4gICAgICAgIHAxID0gc3Ryb2tlW2ldO1xuICAgIH1cbiAgICBkLnB1c2goXCJaXCIpO1xuICAgIHJldHVybiBkLmpvaW4oXCIgXCIpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEZsYXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBwb2x5ID0gcG9seWdvbkNsaXBwaW5nLnVuaW9uKFtzdHJva2VdKTtcbiAgICAgICAgY29uc3QgZCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBmYWNlIG9mIHBvbHkpIHtcbiAgICAgICAgICAgIGZvciAobGV0IHBvaW50cyBvZiBmYWNlKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzLnB1c2gocG9pbnRzWzBdKTtcbiAgICAgICAgICAgICAgICBkLnB1c2goZ2V0U3ZnUGF0aEZyb21TdHJva2UocG9pbnRzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZC5wdXNoKFwiWlwiKTtcbiAgICAgICAgcmV0dXJuIGQuam9pbihcIiBcIik7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgY2xpcCBwYXRoLlwiKTtcbiAgICAgICAgcmV0dXJuIGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==