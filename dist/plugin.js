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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2x6LXN0cmluZy9saWJzL2x6LXN0cmluZy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcGVyZmVjdC1mcmVlaGFuZC9kaXN0L3BlcmZlY3QtZnJlZWhhbmQuZXNtLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wb2x5Z29uLWNsaXBwaW5nL2Rpc3QvcG9seWdvbi1jbGlwcGluZy51bWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWFpbi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7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Q0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsZ0RBQWdEO0FBQ2hEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLDZCQUE2QixtQ0FBbUM7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDOztBQUV4Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQSxrQkFBa0I7O0FBRWxCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtB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QUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsdUVBQXVFLGNBQWM7QUFDckY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQzs7QUFFaEM7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxnREFBZ0QsVUFBVTtBQUMxRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpRkFBaUY7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELGFBQWE7QUFDbkU7O0FBRUEsMkRBQTJELFVBQVU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUEscURBQXFELGNBQWM7QUFDbkU7O0FBRUEsc0RBQXNELFlBQVk7QUFDbEU7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsc0RBQXNELGNBQWM7QUFDcEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOzs7QUFHVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLEdBQUcsR0FBRzs7QUFFTjs7QUFFQTtBQUNBLCtGQUErRixhQUFhO0FBQzVHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1HQUFtRyxlQUFlO0FBQ2xIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHVHQUF1RyxlQUFlO0FBQ3RIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzUvRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluL2luZGV4LnRzXCIpO1xuIiwiLy8gQ29weXJpZ2h0IChjKSAyMDEzIFBpZXJveHkgPHBpZXJveHlAcGllcm94eS5uZXQ+XG4vLyBUaGlzIHdvcmsgaXMgZnJlZS4gWW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdFxuLy8gdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBXVEZQTCwgVmVyc2lvbiAyXG4vLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgTElDRU5TRS50eHQgb3IgaHR0cDovL3d3dy53dGZwbC5uZXQvXG4vL1xuLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHRoZSBob21lIHBhZ2U6XG4vLyBodHRwOi8vcGllcm94eS5uZXQvYmxvZy9wYWdlcy9sei1zdHJpbmcvdGVzdGluZy5odG1sXG4vL1xuLy8gTFotYmFzZWQgY29tcHJlc3Npb24gYWxnb3JpdGhtLCB2ZXJzaW9uIDEuNC40XG52YXIgTFpTdHJpbmcgPSAoZnVuY3Rpb24oKSB7XG5cbi8vIHByaXZhdGUgcHJvcGVydHlcbnZhciBmID0gU3RyaW5nLmZyb21DaGFyQ29kZTtcbnZhciBrZXlTdHJCYXNlNjQgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XG52YXIga2V5U3RyVXJpU2FmZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLSRcIjtcbnZhciBiYXNlUmV2ZXJzZURpYyA9IHt9O1xuXG5mdW5jdGlvbiBnZXRCYXNlVmFsdWUoYWxwaGFiZXQsIGNoYXJhY3Rlcikge1xuICBpZiAoIWJhc2VSZXZlcnNlRGljW2FscGhhYmV0XSkge1xuICAgIGJhc2VSZXZlcnNlRGljW2FscGhhYmV0XSA9IHt9O1xuICAgIGZvciAodmFyIGk9MCA7IGk8YWxwaGFiZXQubGVuZ3RoIDsgaSsrKSB7XG4gICAgICBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF1bYWxwaGFiZXQuY2hhckF0KGkpXSA9IGk7XG4gICAgfVxuICB9XG4gIHJldHVybiBiYXNlUmV2ZXJzZURpY1thbHBoYWJldF1bY2hhcmFjdGVyXTtcbn1cblxudmFyIExaU3RyaW5nID0ge1xuICBjb21wcmVzc1RvQmFzZTY0IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHZhciByZXMgPSBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDYsIGZ1bmN0aW9uKGEpe3JldHVybiBrZXlTdHJCYXNlNjQuY2hhckF0KGEpO30pO1xuICAgIHN3aXRjaCAocmVzLmxlbmd0aCAlIDQpIHsgLy8gVG8gcHJvZHVjZSB2YWxpZCBCYXNlNjRcbiAgICBkZWZhdWx0OiAvLyBXaGVuIGNvdWxkIHRoaXMgaGFwcGVuID9cbiAgICBjYXNlIDAgOiByZXR1cm4gcmVzO1xuICAgIGNhc2UgMSA6IHJldHVybiByZXMrXCI9PT1cIjtcbiAgICBjYXNlIDIgOiByZXR1cm4gcmVzK1wiPT1cIjtcbiAgICBjYXNlIDMgOiByZXR1cm4gcmVzK1wiPVwiO1xuICAgIH1cbiAgfSxcblxuICBkZWNvbXByZXNzRnJvbUJhc2U2NCA6IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIGlmIChpbnB1dCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBpZiAoaW5wdXQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGlucHV0Lmxlbmd0aCwgMzIsIGZ1bmN0aW9uKGluZGV4KSB7IHJldHVybiBnZXRCYXNlVmFsdWUoa2V5U3RyQmFzZTY0LCBpbnB1dC5jaGFyQXQoaW5kZXgpKTsgfSk7XG4gIH0sXG5cbiAgY29tcHJlc3NUb1VURjE2IDogZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3MoaW5wdXQsIDE1LCBmdW5jdGlvbihhKXtyZXR1cm4gZihhKzMyKTt9KSArIFwiIFwiO1xuICB9LFxuXG4gIGRlY29tcHJlc3NGcm9tVVRGMTY6IGZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGNvbXByZXNzZWQubGVuZ3RoLCAxNjM4NCwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGNvbXByZXNzZWQuY2hhckNvZGVBdChpbmRleCkgLSAzMjsgfSk7XG4gIH0sXG5cbiAgLy9jb21wcmVzcyBpbnRvIHVpbnQ4YXJyYXkgKFVDUy0yIGJpZyBlbmRpYW4gZm9ybWF0KVxuICBjb21wcmVzc1RvVWludDhBcnJheTogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCkge1xuICAgIHZhciBjb21wcmVzc2VkID0gTFpTdHJpbmcuY29tcHJlc3ModW5jb21wcmVzc2VkKTtcbiAgICB2YXIgYnVmPW5ldyBVaW50OEFycmF5KGNvbXByZXNzZWQubGVuZ3RoKjIpOyAvLyAyIGJ5dGVzIHBlciBjaGFyYWN0ZXJcblxuICAgIGZvciAodmFyIGk9MCwgVG90YWxMZW49Y29tcHJlc3NlZC5sZW5ndGg7IGk8VG90YWxMZW47IGkrKykge1xuICAgICAgdmFyIGN1cnJlbnRfdmFsdWUgPSBjb21wcmVzc2VkLmNoYXJDb2RlQXQoaSk7XG4gICAgICBidWZbaSoyXSA9IGN1cnJlbnRfdmFsdWUgPj4+IDg7XG4gICAgICBidWZbaSoyKzFdID0gY3VycmVudF92YWx1ZSAlIDI1NjtcbiAgICB9XG4gICAgcmV0dXJuIGJ1ZjtcbiAgfSxcblxuICAvL2RlY29tcHJlc3MgZnJvbSB1aW50OGFycmF5IChVQ1MtMiBiaWcgZW5kaWFuIGZvcm1hdClcbiAgZGVjb21wcmVzc0Zyb21VaW50OEFycmF5OmZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQ9PT1udWxsIHx8IGNvbXByZXNzZWQ9PT11bmRlZmluZWQpe1xuICAgICAgICByZXR1cm4gTFpTdHJpbmcuZGVjb21wcmVzcyhjb21wcmVzc2VkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgYnVmPW5ldyBBcnJheShjb21wcmVzc2VkLmxlbmd0aC8yKTsgLy8gMiBieXRlcyBwZXIgY2hhcmFjdGVyXG4gICAgICAgIGZvciAodmFyIGk9MCwgVG90YWxMZW49YnVmLmxlbmd0aDsgaTxUb3RhbExlbjsgaSsrKSB7XG4gICAgICAgICAgYnVmW2ldPWNvbXByZXNzZWRbaSoyXSoyNTYrY29tcHJlc3NlZFtpKjIrMV07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIGJ1Zi5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goZihjKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gTFpTdHJpbmcuZGVjb21wcmVzcyhyZXN1bHQuam9pbignJykpO1xuXG4gICAgfVxuXG4gIH0sXG5cblxuICAvL2NvbXByZXNzIGludG8gYSBzdHJpbmcgdGhhdCBpcyBhbHJlYWR5IFVSSSBlbmNvZGVkXG4gIGNvbXByZXNzVG9FbmNvZGVkVVJJQ29tcG9uZW50OiBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9jb21wcmVzcyhpbnB1dCwgNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGtleVN0clVyaVNhZmUuY2hhckF0KGEpO30pO1xuICB9LFxuXG4gIC8vZGVjb21wcmVzcyBmcm9tIGFuIG91dHB1dCBvZiBjb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudFxuICBkZWNvbXByZXNzRnJvbUVuY29kZWRVUklDb21wb25lbnQ6ZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKGlucHV0ID09IG51bGwpIHJldHVybiBcIlwiO1xuICAgIGlmIChpbnB1dCA9PSBcIlwiKSByZXR1cm4gbnVsbDtcbiAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UoLyAvZywgXCIrXCIpO1xuICAgIHJldHVybiBMWlN0cmluZy5fZGVjb21wcmVzcyhpbnB1dC5sZW5ndGgsIDMyLCBmdW5jdGlvbihpbmRleCkgeyByZXR1cm4gZ2V0QmFzZVZhbHVlKGtleVN0clVyaVNhZmUsIGlucHV0LmNoYXJBdChpbmRleCkpOyB9KTtcbiAgfSxcblxuICBjb21wcmVzczogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCkge1xuICAgIHJldHVybiBMWlN0cmluZy5fY29tcHJlc3ModW5jb21wcmVzc2VkLCAxNiwgZnVuY3Rpb24oYSl7cmV0dXJuIGYoYSk7fSk7XG4gIH0sXG4gIF9jb21wcmVzczogZnVuY3Rpb24gKHVuY29tcHJlc3NlZCwgYml0c1BlckNoYXIsIGdldENoYXJGcm9tSW50KSB7XG4gICAgaWYgKHVuY29tcHJlc3NlZCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICB2YXIgaSwgdmFsdWUsXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeT0ge30sXG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlPSB7fSxcbiAgICAgICAgY29udGV4dF9jPVwiXCIsXG4gICAgICAgIGNvbnRleHRfd2M9XCJcIixcbiAgICAgICAgY29udGV4dF93PVwiXCIsXG4gICAgICAgIGNvbnRleHRfZW5sYXJnZUluPSAyLCAvLyBDb21wZW5zYXRlIGZvciB0aGUgZmlyc3QgZW50cnkgd2hpY2ggc2hvdWxkIG5vdCBjb3VudFxuICAgICAgICBjb250ZXh0X2RpY3RTaXplPSAzLFxuICAgICAgICBjb250ZXh0X251bUJpdHM9IDIsXG4gICAgICAgIGNvbnRleHRfZGF0YT1bXSxcbiAgICAgICAgY29udGV4dF9kYXRhX3ZhbD0wLFxuICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb249MCxcbiAgICAgICAgaWk7XG5cbiAgICBmb3IgKGlpID0gMDsgaWkgPCB1bmNvbXByZXNzZWQubGVuZ3RoOyBpaSArPSAxKSB7XG4gICAgICBjb250ZXh0X2MgPSB1bmNvbXByZXNzZWQuY2hhckF0KGlpKTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeSxjb250ZXh0X2MpKSB7XG4gICAgICAgIGNvbnRleHRfZGljdGlvbmFyeVtjb250ZXh0X2NdID0gY29udGV4dF9kaWN0U2l6ZSsrO1xuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlUb0NyZWF0ZVtjb250ZXh0X2NdID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgY29udGV4dF93YyA9IGNvbnRleHRfdyArIGNvbnRleHRfYztcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29udGV4dF9kaWN0aW9uYXJ5LGNvbnRleHRfd2MpKSB7XG4gICAgICAgIGNvbnRleHRfdyA9IGNvbnRleHRfd2M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlLGNvbnRleHRfdykpIHtcbiAgICAgICAgICBpZiAoY29udGV4dF93LmNoYXJDb2RlQXQoMCk8MjU2KSB7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgICBmb3IgKGk9MCA7IGk8OCA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9IDA7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPj4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPGNvbnRleHRfbnVtQml0cyA7IGkrKykge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCB2YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PWJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24rKztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IGNvbnRleHRfdy5jaGFyQ29kZUF0KDApO1xuICAgICAgICAgICAgZm9yIChpPTAgOyBpPDE2IDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICAgIGlmIChjb250ZXh0X2VubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVsZXRlIGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlW2NvbnRleHRfd107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93XTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4tLTtcbiAgICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgICBjb250ZXh0X2VubGFyZ2VJbiA9IE1hdGgucG93KDIsIGNvbnRleHRfbnVtQml0cyk7XG4gICAgICAgICAgY29udGV4dF9udW1CaXRzKys7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQWRkIHdjIHRvIHRoZSBkaWN0aW9uYXJ5LlxuICAgICAgICBjb250ZXh0X2RpY3Rpb25hcnlbY29udGV4dF93Y10gPSBjb250ZXh0X2RpY3RTaXplKys7XG4gICAgICAgIGNvbnRleHRfdyA9IFN0cmluZyhjb250ZXh0X2MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE91dHB1dCB0aGUgY29kZSBmb3Igdy5cbiAgICBpZiAoY29udGV4dF93ICE9PSBcIlwiKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbnRleHRfZGljdGlvbmFyeVRvQ3JlYXRlLGNvbnRleHRfdykpIHtcbiAgICAgICAgaWYgKGNvbnRleHRfdy5jaGFyQ29kZUF0KDApPDI1Nikge1xuICAgICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPDggOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAoY29udGV4dF9kYXRhX3ZhbCA8PCAxKSB8ICh2YWx1ZSYxKTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gMTtcbiAgICAgICAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCB2YWx1ZTtcbiAgICAgICAgICAgIGlmIChjb250ZXh0X2RhdGFfcG9zaXRpb24gPT0gYml0c1BlckNoYXItMSkge1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGEucHVzaChnZXRDaGFyRnJvbUludChjb250ZXh0X2RhdGFfdmFsKSk7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV92YWwgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlID0gY29udGV4dF93LmNoYXJDb2RlQXQoMCk7XG4gICAgICAgICAgZm9yIChpPTAgOyBpPDE2IDsgaSsrKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgICBpZiAoY29udGV4dF9lbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICAgIGNvbnRleHRfZW5sYXJnZUluID0gTWF0aC5wb3coMiwgY29udGV4dF9udW1CaXRzKTtcbiAgICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgY29udGV4dF9kaWN0aW9uYXJ5VG9DcmVhdGVbY29udGV4dF93XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gY29udGV4dF9kaWN0aW9uYXJ5W2NvbnRleHRfd107XG4gICAgICAgIGZvciAoaT0wIDsgaTxjb250ZXh0X251bUJpdHMgOyBpKyspIHtcbiAgICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgICAgICBjb250ZXh0X2RhdGFfcG9zaXRpb24gPSAwO1xuICAgICAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlID4+IDE7XG4gICAgICAgIH1cblxuXG4gICAgICB9XG4gICAgICBjb250ZXh0X2VubGFyZ2VJbi0tO1xuICAgICAgaWYgKGNvbnRleHRfZW5sYXJnZUluID09IDApIHtcbiAgICAgICAgY29udGV4dF9lbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBjb250ZXh0X251bUJpdHMpO1xuICAgICAgICBjb250ZXh0X251bUJpdHMrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYXJrIHRoZSBlbmQgb2YgdGhlIHN0cmVhbVxuICAgIHZhbHVlID0gMjtcbiAgICBmb3IgKGk9MCA7IGk8Y29udGV4dF9udW1CaXRzIDsgaSsrKSB7XG4gICAgICBjb250ZXh0X2RhdGFfdmFsID0gKGNvbnRleHRfZGF0YV92YWwgPDwgMSkgfCAodmFsdWUmMSk7XG4gICAgICBpZiAoY29udGV4dF9kYXRhX3Bvc2l0aW9uID09IGJpdHNQZXJDaGFyLTEpIHtcbiAgICAgICAgY29udGV4dF9kYXRhX3Bvc2l0aW9uID0gMDtcbiAgICAgICAgY29udGV4dF9kYXRhLnB1c2goZ2V0Q2hhckZyb21JbnQoY29udGV4dF9kYXRhX3ZhbCkpO1xuICAgICAgICBjb250ZXh0X2RhdGFfdmFsID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgICAgfVxuICAgICAgdmFsdWUgPSB2YWx1ZSA+PiAxO1xuICAgIH1cblxuICAgIC8vIEZsdXNoIHRoZSBsYXN0IGNoYXJcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29udGV4dF9kYXRhX3ZhbCA9IChjb250ZXh0X2RhdGFfdmFsIDw8IDEpO1xuICAgICAgaWYgKGNvbnRleHRfZGF0YV9wb3NpdGlvbiA9PSBiaXRzUGVyQ2hhci0xKSB7XG4gICAgICAgIGNvbnRleHRfZGF0YS5wdXNoKGdldENoYXJGcm9tSW50KGNvbnRleHRfZGF0YV92YWwpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBlbHNlIGNvbnRleHRfZGF0YV9wb3NpdGlvbisrO1xuICAgIH1cbiAgICByZXR1cm4gY29udGV4dF9kYXRhLmpvaW4oJycpO1xuICB9LFxuXG4gIGRlY29tcHJlc3M6IGZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gICAgaWYgKGNvbXByZXNzZWQgPT0gXCJcIikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIExaU3RyaW5nLl9kZWNvbXByZXNzKGNvbXByZXNzZWQubGVuZ3RoLCAzMjc2OCwgZnVuY3Rpb24oaW5kZXgpIHsgcmV0dXJuIGNvbXByZXNzZWQuY2hhckNvZGVBdChpbmRleCk7IH0pO1xuICB9LFxuXG4gIF9kZWNvbXByZXNzOiBmdW5jdGlvbiAobGVuZ3RoLCByZXNldFZhbHVlLCBnZXROZXh0VmFsdWUpIHtcbiAgICB2YXIgZGljdGlvbmFyeSA9IFtdLFxuICAgICAgICBuZXh0LFxuICAgICAgICBlbmxhcmdlSW4gPSA0LFxuICAgICAgICBkaWN0U2l6ZSA9IDQsXG4gICAgICAgIG51bUJpdHMgPSAzLFxuICAgICAgICBlbnRyeSA9IFwiXCIsXG4gICAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgICBpLFxuICAgICAgICB3LFxuICAgICAgICBiaXRzLCByZXNiLCBtYXhwb3dlciwgcG93ZXIsXG4gICAgICAgIGMsXG4gICAgICAgIGRhdGEgPSB7dmFsOmdldE5leHRWYWx1ZSgwKSwgcG9zaXRpb246cmVzZXRWYWx1ZSwgaW5kZXg6MX07XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgMzsgaSArPSAxKSB7XG4gICAgICBkaWN0aW9uYXJ5W2ldID0gaTtcbiAgICB9XG5cbiAgICBiaXRzID0gMDtcbiAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsMik7XG4gICAgcG93ZXI9MTtcbiAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICB9XG4gICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgIHBvd2VyIDw8PSAxO1xuICAgIH1cblxuICAgIHN3aXRjaCAobmV4dCA9IGJpdHMpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgICBiaXRzID0gMDtcbiAgICAgICAgICBtYXhwb3dlciA9IE1hdGgucG93KDIsOCk7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgYyA9IGYoYml0cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwxNik7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgYyA9IGYoYml0cyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgZGljdGlvbmFyeVszXSA9IGM7XG4gICAgdyA9IGM7XG4gICAgcmVzdWx0LnB1c2goYyk7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlmIChkYXRhLmluZGV4ID4gbGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuXG4gICAgICBiaXRzID0gMDtcbiAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMixudW1CaXRzKTtcbiAgICAgIHBvd2VyPTE7XG4gICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgIHJlc2IgPSBkYXRhLnZhbCAmIGRhdGEucG9zaXRpb247XG4gICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICBkYXRhLnBvc2l0aW9uID0gcmVzZXRWYWx1ZTtcbiAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICB9XG4gICAgICAgIGJpdHMgfD0gKHJlc2I+MCA/IDEgOiAwKSAqIHBvd2VyO1xuICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChjID0gYml0cykge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgYml0cyA9IDA7XG4gICAgICAgICAgbWF4cG93ZXIgPSBNYXRoLnBvdygyLDgpO1xuICAgICAgICAgIHBvd2VyPTE7XG4gICAgICAgICAgd2hpbGUgKHBvd2VyIT1tYXhwb3dlcikge1xuICAgICAgICAgICAgcmVzYiA9IGRhdGEudmFsICYgZGF0YS5wb3NpdGlvbjtcbiAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPj49IDE7XG4gICAgICAgICAgICBpZiAoZGF0YS5wb3NpdGlvbiA9PSAwKSB7XG4gICAgICAgICAgICAgIGRhdGEucG9zaXRpb24gPSByZXNldFZhbHVlO1xuICAgICAgICAgICAgICBkYXRhLnZhbCA9IGdldE5leHRWYWx1ZShkYXRhLmluZGV4KyspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYml0cyB8PSAocmVzYj4wID8gMSA6IDApICogcG93ZXI7XG4gICAgICAgICAgICBwb3dlciA8PD0gMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gZihiaXRzKTtcbiAgICAgICAgICBjID0gZGljdFNpemUtMTtcbiAgICAgICAgICBlbmxhcmdlSW4tLTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGJpdHMgPSAwO1xuICAgICAgICAgIG1heHBvd2VyID0gTWF0aC5wb3coMiwxNik7XG4gICAgICAgICAgcG93ZXI9MTtcbiAgICAgICAgICB3aGlsZSAocG93ZXIhPW1heHBvd2VyKSB7XG4gICAgICAgICAgICByZXNiID0gZGF0YS52YWwgJiBkYXRhLnBvc2l0aW9uO1xuICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA+Pj0gMTtcbiAgICAgICAgICAgIGlmIChkYXRhLnBvc2l0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgZGF0YS5wb3NpdGlvbiA9IHJlc2V0VmFsdWU7XG4gICAgICAgICAgICAgIGRhdGEudmFsID0gZ2V0TmV4dFZhbHVlKGRhdGEuaW5kZXgrKyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBiaXRzIHw9IChyZXNiPjAgPyAxIDogMCkgKiBwb3dlcjtcbiAgICAgICAgICAgIHBvd2VyIDw8PSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkaWN0aW9uYXJ5W2RpY3RTaXplKytdID0gZihiaXRzKTtcbiAgICAgICAgICBjID0gZGljdFNpemUtMTtcbiAgICAgICAgICBlbmxhcmdlSW4tLTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHJldHVybiByZXN1bHQuam9pbignJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmxhcmdlSW4gPT0gMCkge1xuICAgICAgICBlbmxhcmdlSW4gPSBNYXRoLnBvdygyLCBudW1CaXRzKTtcbiAgICAgICAgbnVtQml0cysrO1xuICAgICAgfVxuXG4gICAgICBpZiAoZGljdGlvbmFyeVtjXSkge1xuICAgICAgICBlbnRyeSA9IGRpY3Rpb25hcnlbY107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoYyA9PT0gZGljdFNpemUpIHtcbiAgICAgICAgICBlbnRyeSA9IHcgKyB3LmNoYXJBdCgwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2goZW50cnkpO1xuXG4gICAgICAvLyBBZGQgdytlbnRyeVswXSB0byB0aGUgZGljdGlvbmFyeS5cbiAgICAgIGRpY3Rpb25hcnlbZGljdFNpemUrK10gPSB3ICsgZW50cnkuY2hhckF0KDApO1xuICAgICAgZW5sYXJnZUluLS07XG5cbiAgICAgIHcgPSBlbnRyeTtcblxuICAgICAgaWYgKGVubGFyZ2VJbiA9PSAwKSB7XG4gICAgICAgIGVubGFyZ2VJbiA9IE1hdGgucG93KDIsIG51bUJpdHMpO1xuICAgICAgICBudW1CaXRzKys7XG4gICAgICB9XG5cbiAgICB9XG4gIH1cbn07XG4gIHJldHVybiBMWlN0cmluZztcbn0pKCk7XG5cbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIExaU3RyaW5nOyB9KTtcbn0gZWxzZSBpZiggdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbW9kdWxlICE9IG51bGwgKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gTFpTdHJpbmdcbn1cbiIsInZhciBoeXBvdCA9IE1hdGguaHlwb3QsXG4gICAgY29zID0gTWF0aC5jb3MsXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgbWluID0gTWF0aC5taW4sXG4gICAgc2luID0gTWF0aC5zaW4sXG4gICAgYXRhbjIgPSBNYXRoLmF0YW4yLFxuICAgIFBJID0gTWF0aC5QSSxcbiAgICBQSTIgPSBQSSAqIDI7XG5mdW5jdGlvbiBsZXJwKHkxLCB5MiwgbXUpIHtcbiAgcmV0dXJuIHkxICogKDEgLSBtdSkgKyB5MiAqIG11O1xufVxuZnVuY3Rpb24gcHJvamVjdFBvaW50KHAwLCBhLCBkKSB7XG4gIHJldHVybiBbY29zKGEpICogZCArIHAwWzBdLCBzaW4oYSkgKiBkICsgcDBbMV1dO1xufVxuXG5mdW5jdGlvbiBzaG9ydEFuZ2xlRGlzdChhMCwgYTEpIHtcbiAgdmFyIG1heCA9IFBJMjtcbiAgdmFyIGRhID0gKGExIC0gYTApICUgbWF4O1xuICByZXR1cm4gMiAqIGRhICUgbWF4IC0gZGE7XG59XG5cbmZ1bmN0aW9uIGdldEFuZ2xlRGVsdGEoYTAsIGExKSB7XG4gIHJldHVybiBzaG9ydEFuZ2xlRGlzdChhMCwgYTEpO1xufVxuZnVuY3Rpb24gbGVycEFuZ2xlcyhhMCwgYTEsIHQpIHtcbiAgcmV0dXJuIGEwICsgc2hvcnRBbmdsZURpc3QoYTAsIGExKSAqIHQ7XG59XG5mdW5jdGlvbiBnZXRQb2ludEJldHdlZW4ocDAsIHAxLCBkKSB7XG4gIGlmIChkID09PSB2b2lkIDApIHtcbiAgICBkID0gMC41O1xuICB9XG5cbiAgcmV0dXJuIFtwMFswXSArIChwMVswXSAtIHAwWzBdKSAqIGQsIHAwWzFdICsgKHAxWzFdIC0gcDBbMV0pICogZF07XG59XG5mdW5jdGlvbiBnZXRBbmdsZShwMCwgcDEpIHtcbiAgcmV0dXJuIGF0YW4yKHAxWzFdIC0gcDBbMV0sIHAxWzBdIC0gcDBbMF0pO1xufVxuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDAsIHAxKSB7XG4gIHJldHVybiBoeXBvdChwMVsxXSAtIHAwWzFdLCBwMVswXSAtIHAwWzBdKTtcbn1cbmZ1bmN0aW9uIGNsYW1wKG4sIGEsIGIpIHtcbiAgcmV0dXJuIG1heChhLCBtaW4oYiwgbikpO1xufVxuZnVuY3Rpb24gdG9Qb2ludHNBcnJheShwb2ludHMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocG9pbnRzWzBdKSkge1xuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICB2YXIgeCA9IF9yZWZbMF0sXG4gICAgICAgICAgeSA9IF9yZWZbMV0sXG4gICAgICAgICAgX3JlZiQgPSBfcmVmWzJdLFxuICAgICAgICAgIHByZXNzdXJlID0gX3JlZiQgPT09IHZvaWQgMCA/IDAuNSA6IF9yZWYkO1xuICAgICAgcmV0dXJuIFt4LCB5LCBwcmVzc3VyZV07XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHBvaW50cy5tYXAoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICB2YXIgeCA9IF9yZWYyLngsXG4gICAgICAgICAgeSA9IF9yZWYyLnksXG4gICAgICAgICAgX3JlZjIkcHJlc3N1cmUgPSBfcmVmMi5wcmVzc3VyZSxcbiAgICAgICAgICBwcmVzc3VyZSA9IF9yZWYyJHByZXNzdXJlID09PSB2b2lkIDAgPyAwLjUgOiBfcmVmMiRwcmVzc3VyZTtcbiAgICAgIHJldHVybiBbeCwgeSwgcHJlc3N1cmVdO1xuICAgIH0pO1xuICB9XG59XG5cbnZhciBhYnMgPSBNYXRoLmFicyxcbiAgICBtaW4kMSA9IE1hdGgubWluLFxuICAgIFBJJDEgPSBNYXRoLlBJLFxuICAgIFRBVSA9IFBJJDEgLyAyLFxuICAgIFNIQVJQID0gVEFVLFxuICAgIERVTEwgPSBTSEFSUCAvIDI7XG5cbmZ1bmN0aW9uIGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBwcmVzc3VyZSkge1xuICBpZiAocHJlc3N1cmUgPT09IHZvaWQgMCkge1xuICAgIHByZXNzdXJlID0gMC41O1xuICB9XG5cbiAgaWYgKHRoaW5uaW5nID09PSB1bmRlZmluZWQpIHJldHVybiBzaXplIC8gMjtcbiAgcHJlc3N1cmUgPSBjbGFtcChlYXNpbmcocHJlc3N1cmUpLCAwLCAxKTtcbiAgcmV0dXJuICh0aGlubmluZyA8IDAgPyBsZXJwKHNpemUsIHNpemUgKyBzaXplICogY2xhbXAodGhpbm5pbmcsIC0wLjk1LCAtMC4wNSksIHByZXNzdXJlKSA6IGxlcnAoc2l6ZSAtIHNpemUgKiBjbGFtcCh0aGlubmluZywgMC4wNSwgMC45NSksIHNpemUsIHByZXNzdXJlKSkgLyAyO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZVBvaW50c1xyXG4gKiBAZGVzY3JpcHRpb24gR2V0IHBvaW50cyBmb3IgYSBzdHJva2UuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBzdHJlYW1saW5lIEhvdyBtdWNoIHRvIHN0cmVhbWxpbmUgdGhlIHN0cm9rZS5cclxuICovXG5cblxuZnVuY3Rpb24gZ2V0U3Ryb2tlUG9pbnRzKHBvaW50cywgc3RyZWFtbGluZSkge1xuICBpZiAoc3RyZWFtbGluZSA9PT0gdm9pZCAwKSB7XG4gICAgc3RyZWFtbGluZSA9IDAuNTtcbiAgfVxuXG4gIHZhciBwdHMgPSB0b1BvaW50c0FycmF5KHBvaW50cyk7XG4gIGlmIChwdHMubGVuZ3RoID09PSAwKSByZXR1cm4gW107XG4gIHB0c1swXSA9IFtwdHNbMF1bMF0sIHB0c1swXVsxXSwgcHRzWzBdWzJdIHx8IDAuNSwgMCwgMCwgMF07XG5cbiAgZm9yICh2YXIgaSA9IDEsIGN1cnIgPSBwdHNbaV0sIHByZXYgPSBwdHNbMF07IGkgPCBwdHMubGVuZ3RoOyBpKyssIGN1cnIgPSBwdHNbaV0sIHByZXYgPSBwdHNbaSAtIDFdKSB7XG4gICAgY3VyclswXSA9IGxlcnAocHJldlswXSwgY3VyclswXSwgMSAtIHN0cmVhbWxpbmUpO1xuICAgIGN1cnJbMV0gPSBsZXJwKHByZXZbMV0sIGN1cnJbMV0sIDEgLSBzdHJlYW1saW5lKTtcbiAgICBjdXJyWzNdID0gZ2V0QW5nbGUoY3VyciwgcHJldik7XG4gICAgY3Vycls0XSA9IGdldERpc3RhbmNlKGN1cnIsIHByZXYpO1xuICAgIGN1cnJbNV0gPSBwcmV2WzVdICsgY3Vycls0XTtcbiAgfVxuXG4gIHJldHVybiBwdHM7XG59XG4vKipcclxuICogIyMgZ2V0U3Ryb2tlT3V0bGluZVBvaW50c1xyXG4gKiBAZGVzY3JpcHRpb24gR2V0IGFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5XWApIHJlcHJlc2VudGluZyB0aGUgb3V0bGluZSBvZiBhIHN0cm9rZS5cclxuICogQHBhcmFtIHBvaW50cyBBbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeSwgcHJlc3N1cmVdYCBvciBge3gsIHksIHByZXNzdXJlfWApLiBQcmVzc3VyZSBpcyBvcHRpb25hbC5cclxuICogQHBhcmFtIG9wdGlvbnMgQW4gKG9wdGlvbmFsKSBvYmplY3Qgd2l0aCBvcHRpb25zLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaXplXHRUaGUgYmFzZSBzaXplIChkaWFtZXRlcikgb2YgdGhlIHN0cm9rZS5cclxuICogQHBhcmFtIG9wdGlvbnMudGhpbm5pbmcgVGhlIGVmZmVjdCBvZiBwcmVzc3VyZSBvbiB0aGUgc3Ryb2tlJ3Mgc2l6ZS5cclxuICogQHBhcmFtIG9wdGlvbnMuc21vb3RoaW5nXHRIb3cgbXVjaCB0byBzb2Z0ZW4gdGhlIHN0cm9rZSdzIGVkZ2VzLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5lYXNpbmdcdEFuIGVhc2luZyBmdW5jdGlvbiB0byBhcHBseSB0byBlYWNoIHBvaW50J3MgcHJlc3N1cmUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpbXVsYXRlUHJlc3N1cmUgV2hldGhlciB0byBzaW11bGF0ZSBwcmVzc3VyZSBiYXNlZCBvbiB2ZWxvY2l0eS5cclxuICovXG5cbmZ1bmN0aW9uIGdldFN0cm9rZU91dGxpbmVQb2ludHMocG9pbnRzLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMkc2l6ZSA9IF9vcHRpb25zLnNpemUsXG4gICAgICBzaXplID0gX29wdGlvbnMkc2l6ZSA9PT0gdm9pZCAwID8gOCA6IF9vcHRpb25zJHNpemUsXG4gICAgICBfb3B0aW9ucyR0aGlubmluZyA9IF9vcHRpb25zLnRoaW5uaW5nLFxuICAgICAgdGhpbm5pbmcgPSBfb3B0aW9ucyR0aGlubmluZyA9PT0gdm9pZCAwID8gMC41IDogX29wdGlvbnMkdGhpbm5pbmcsXG4gICAgICBfb3B0aW9ucyRzbW9vdGhpbmcgPSBfb3B0aW9ucy5zbW9vdGhpbmcsXG4gICAgICBzbW9vdGhpbmcgPSBfb3B0aW9ucyRzbW9vdGhpbmcgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHNtb290aGluZyxcbiAgICAgIF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9IF9vcHRpb25zLnNpbXVsYXRlUHJlc3N1cmUsXG4gICAgICBzaW11bGF0ZVByZXNzdXJlID0gX29wdGlvbnMkc2ltdWxhdGVQcmVzID09PSB2b2lkIDAgPyB0cnVlIDogX29wdGlvbnMkc2ltdWxhdGVQcmVzLFxuICAgICAgX29wdGlvbnMkZWFzaW5nID0gX29wdGlvbnMuZWFzaW5nLFxuICAgICAgZWFzaW5nID0gX29wdGlvbnMkZWFzaW5nID09PSB2b2lkIDAgPyBmdW5jdGlvbiAodCkge1xuICAgIHJldHVybiB0O1xuICB9IDogX29wdGlvbnMkZWFzaW5nO1xuICB2YXIgbGVuID0gcG9pbnRzLmxlbmd0aCxcbiAgICAgIHRvdGFsTGVuZ3RoID0gcG9pbnRzW2xlbiAtIDFdWzVdLFxuICAgICAgLy8gVGhlIHRvdGFsIGxlbmd0aCBvZiB0aGUgbGluZVxuICBtaW5EaXN0ID0gc2l6ZSAqIHNtb290aGluZyxcbiAgICAgIC8vIFRoZSBtaW5pbXVtIGRpc3RhbmNlIGZvciBtZWFzdXJlbWVudHNcbiAgbGVmdFB0cyA9IFtdLFxuICAgICAgLy8gT3VyIGNvbGxlY3RlZCBsZWZ0IGFuZCByaWdodCBwb2ludHNcbiAgcmlnaHRQdHMgPSBbXTtcbiAgdmFyIHBsID0gcG9pbnRzWzBdLFxuICAgICAgLy8gUHJldmlvdXMgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG4gIHByID0gcG9pbnRzWzBdLFxuICAgICAgdGwgPSBwbCxcbiAgICAgIC8vIFBvaW50cyB0byB0ZXN0IGRpc3RhbmNlIGZyb21cbiAgdHIgPSBwcixcbiAgICAgIHBhID0gcHJbM10sXG4gICAgICBwcCA9IDAsXG4gICAgICAvLyBQcmV2aW91cyAobWF5YmUgc2ltdWxhdGVkKSBwcmVzc3VyZVxuICByID0gc2l6ZSAvIDIsXG4gICAgICAvLyBUaGUgY3VycmVudCBwb2ludCByYWRpdXNcbiAgX3Nob3J0ID0gdHJ1ZTsgLy8gV2hldGhlciB0aGUgbGluZSBpcyBkcmF3biBmYXIgZW5vdWdoXG4gIC8vIFdlIGNhbid0IGRvIGFueXRoaW5nIHdpdGggYW4gZW1wdHkgYXJyYXkuXG5cbiAgaWYgKGxlbiA9PT0gMCkge1xuICAgIHJldHVybiBbXTtcbiAgfSAvLyBJZiB0aGUgcG9pbnQgaXMgb25seSBvbmUgcG9pbnQgbG9uZywgZHJhdyB0d28gY2FwcyBhdCBlaXRoZXIgZW5kLlxuXG5cbiAgaWYgKGxlbiA9PT0gMSB8fCB0b3RhbExlbmd0aCA8PSA0KSB7XG4gICAgdmFyIGZpcnN0ID0gcG9pbnRzWzBdLFxuICAgICAgICBsYXN0ID0gcG9pbnRzW2xlbiAtIDFdLFxuICAgICAgICBhbmdsZSA9IGdldEFuZ2xlKGZpcnN0LCBsYXN0KTtcblxuICAgIGlmICh0aGlubmluZykge1xuICAgICAgciA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBsYXN0WzJdKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciB0ID0gMCwgc3RlcCA9IDAuMTsgdCA8PSAxOyB0ICs9IHN0ZXApIHtcbiAgICAgIHRsID0gcHJvamVjdFBvaW50KGZpcnN0LCBhbmdsZSArIFBJJDEgKyBUQVUgLSB0ICogUEkkMSwgcik7XG4gICAgICB0ciA9IHByb2plY3RQb2ludChsYXN0LCBhbmdsZSArIFRBVSAtIHQgKiBQSSQxLCByKTtcbiAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICByaWdodFB0cy5wdXNoKHRyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGVmdFB0cy5jb25jYXQocmlnaHRQdHMpO1xuICB9IC8vIEZvciBhIHBvaW50IHdpdGggbW9yZSB0aGFuIG9uZSBwb2ludCwgY3JlYXRlIGFuIG91dGxpbmUgc2hhcGUuXG5cblxuICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHByZXYgPSBwb2ludHNbaSAtIDFdO1xuICAgIHZhciBfcG9pbnRzJGkgPSBwb2ludHNbaV0sXG4gICAgICAgIHggPSBfcG9pbnRzJGlbMF0sXG4gICAgICAgIHkgPSBfcG9pbnRzJGlbMV0sXG4gICAgICAgIHByZXNzdXJlID0gX3BvaW50cyRpWzJdLFxuICAgICAgICBfYW5nbGUgPSBfcG9pbnRzJGlbM10sXG4gICAgICAgIGRpc3RhbmNlID0gX3BvaW50cyRpWzRdLFxuICAgICAgICBjbGVuID0gX3BvaW50cyRpWzVdOyAvLyAxLlxuICAgIC8vIENhbGN1bGF0ZSB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCBwb2ludC5cblxuICAgIGlmICh0aGlubmluZykge1xuICAgICAgaWYgKHNpbXVsYXRlUHJlc3N1cmUpIHtcbiAgICAgICAgLy8gU2ltdWxhdGUgcHJlc3N1cmUgYnkgYWNjZWxsZXJhdGluZyB0aGUgcmVwb3J0ZWQgcHJlc3N1cmUuXG4gICAgICAgIHZhciBycCA9IG1pbiQxKDEgLSBkaXN0YW5jZSAvIHNpemUsIDEpO1xuICAgICAgICB2YXIgc3AgPSBtaW4kMShkaXN0YW5jZSAvIHNpemUsIDEpO1xuICAgICAgICBwcmVzc3VyZSA9IG1pbiQxKDEsIHBwICsgKHJwIC0gcHApICogKHNwIC8gMikpO1xuICAgICAgfSAvLyBDb21wdXRlIHRoZSBzdHJva2UgcmFkaXVzIGJhc2VkIG9uIHRoZSBwcmVzc3VyZSwgZWFzaW5nIGFuZCB0aGlubmluZy5cblxuXG4gICAgICByID0gZ2V0U3Ryb2tlUmFkaXVzKHNpemUsIHRoaW5uaW5nLCBlYXNpbmcsIHByZXNzdXJlKTtcbiAgICB9IC8vIDIuXG4gICAgLy8gRHJhdyBhIGNhcCBvbmNlIHdlJ3ZlIHJlYWNoZWQgdGhlIG1pbmltdW0gbGVuZ3RoLlxuXG5cbiAgICBpZiAoX3Nob3J0KSB7XG4gICAgICBpZiAoY2xlbiA8IHNpemUgLyA0KSBjb250aW51ZTsgLy8gVGhlIGZpcnN0IHBvaW50IGFmdGVyIHdlJ3ZlIHJlYWNoZWQgdGhlIG1pbmltdW0gbGVuZ3RoLlxuICAgICAgLy8gRHJhdyBhIGNhcCBhdCB0aGUgZmlyc3QgcG9pbnQgYW5nbGVkIHRvd2FyZCB0aGUgY3VycmVudCBwb2ludC5cblxuICAgICAgX3Nob3J0ID0gZmFsc2U7XG5cbiAgICAgIGZvciAodmFyIF90ID0gMCwgX3N0ZXAgPSAwLjE7IF90IDw9IDE7IF90ICs9IF9zdGVwKSB7XG4gICAgICAgIHRsID0gcHJvamVjdFBvaW50KHBvaW50c1swXSwgX2FuZ2xlICsgVEFVIC0gX3QgKiBQSSQxLCByKTtcbiAgICAgICAgbGVmdFB0cy5wdXNoKHRsKTtcbiAgICAgIH1cblxuICAgICAgdHIgPSBwcm9qZWN0UG9pbnQocG9pbnRzWzBdLCBfYW5nbGUgKyBUQVUsIHIpO1xuICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgfVxuXG4gICAgX2FuZ2xlID0gbGVycEFuZ2xlcyhwYSwgX2FuZ2xlLCAwLjc1KTsgLy8gMy5cbiAgICAvLyBBZGQgcG9pbnRzIGZvciB0aGUgY3VycmVudCBwb2ludC5cblxuICAgIGlmIChpID09PSBsZW4gLSAxKSB7XG4gICAgICAvLyBUaGUgbGFzdCBwb2ludCBpbiB0aGUgbGluZS5cbiAgICAgIC8vIEFkZCBwb2ludHMgZm9yIGFuIGVuZCBjYXAuXG4gICAgICBmb3IgKHZhciBfdDIgPSAwLCBfc3RlcDIgPSAwLjE7IF90MiA8PSAxOyBfdDIgKz0gX3N0ZXAyKSB7XG4gICAgICAgIHJpZ2h0UHRzLnB1c2gocHJvamVjdFBvaW50KFt4LCB5XSwgX2FuZ2xlICsgVEFVICsgX3QyICogUEkkMSwgcikpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGaW5kIHRoZSBkZWx0YSBiZXR3ZWVuIHRoZSBjdXJyZW50IGFuZCBwcmV2aW91cyBhbmdsZS5cbiAgICAgIHZhciBkZWx0YSA9IGdldEFuZ2xlRGVsdGEocHJldlszXSwgX2FuZ2xlKSxcbiAgICAgICAgICBhYnNEZWx0YSA9IGFicyhkZWx0YSk7XG5cbiAgICAgIGlmIChhYnNEZWx0YSA+IFNIQVJQICYmIGNsZW4gPiByKSB7XG4gICAgICAgIC8vIEEgc2hhcnAgY29ybmVyLlxuICAgICAgICAvLyBQcm9qZWN0IHBvaW50cyAobGVmdCBhbmQgcmlnaHQpIGZvciBhIGNhcC5cbiAgICAgICAgdmFyIG1pZCA9IGdldFBvaW50QmV0d2VlbihwcmV2LCBbeCwgeV0pO1xuXG4gICAgICAgIGZvciAodmFyIF90MyA9IDAsIF9zdGVwMyA9IDAuMjU7IF90MyA8PSAxOyBfdDMgKz0gX3N0ZXAzKSB7XG4gICAgICAgICAgdGwgPSBwcm9qZWN0UG9pbnQobWlkLCBwYSAtIFRBVSArIF90MyAqIC1QSSQxLCByKTtcbiAgICAgICAgICB0ciA9IHByb2plY3RQb2ludChtaWQsIHBhICsgVEFVICsgX3QzICogUEkkMSwgcik7XG4gICAgICAgICAgbGVmdFB0cy5wdXNoKHRsKTtcbiAgICAgICAgICByaWdodFB0cy5wdXNoKHRyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQSByZWd1bGFyIHBvaW50LlxuICAgICAgICAvLyBBZGQgcHJvamVjdGVkIHBvaW50cyBsZWZ0IGFuZCByaWdodCwgaWYgZmFyIGVub3VnaCBhd2F5LlxuICAgICAgICBwbCA9IHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSAtIFRBVSwgcik7XG4gICAgICAgIHByID0gcHJvamVjdFBvaW50KFt4LCB5XSwgX2FuZ2xlICsgVEFVLCByKTtcblxuICAgICAgICBpZiAoYWJzRGVsdGEgPiBEVUxMIHx8IGdldERpc3RhbmNlKHBsLCB0bCkgPiBtaW5EaXN0KSB7XG4gICAgICAgICAgbGVmdFB0cy5wdXNoKGdldFBvaW50QmV0d2Vlbih0bCwgcGwpKTtcbiAgICAgICAgICB0bCA9IHBsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFic0RlbHRhID4gRFVMTCB8fCBnZXREaXN0YW5jZShwciwgdHIpID4gbWluRGlzdCkge1xuICAgICAgICAgIHJpZ2h0UHRzLnB1c2goZ2V0UG9pbnRCZXR3ZWVuKHRyLCBwcikpO1xuICAgICAgICAgIHRyID0gcHI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcHAgPSBwcmVzc3VyZTtcbiAgICAgIHBhID0gX2FuZ2xlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBsZWZ0UHRzLmNvbmNhdChyaWdodFB0cy5yZXZlcnNlKCkpO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZVxyXG4gKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIHN0cm9rZSBhcyBhbiBhcnJheSBvZiBwb2ludHMuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIChvcHRpb25hbCkgb2JqZWN0IHdpdGggb3B0aW9ucy5cclxuICogQHBhcmFtIG9wdGlvbnMuc2l6ZVx0VGhlIGJhc2Ugc2l6ZSAoZGlhbWV0ZXIpIG9mIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRoaW5uaW5nIFRoZSBlZmZlY3Qgb2YgcHJlc3N1cmUgb24gdGhlIHN0cm9rZSdzIHNpemUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNtb290aGluZ1x0SG93IG11Y2ggdG8gc29mdGVuIHRoZSBzdHJva2UncyBlZGdlcy5cclxuICogQHBhcmFtIG9wdGlvbnMuc3RyZWFtbGluZSBIb3cgbXVjaCB0byBzdHJlYW1saW5lIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpbXVsYXRlUHJlc3N1cmUgV2hldGhlciB0byBzaW11bGF0ZSBwcmVzc3VyZSBiYXNlZCBvbiB2ZWxvY2l0eS5cclxuICovXG5cbmZ1bmN0aW9uIGdldFN0cm9rZShwb2ludHMsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHJldHVybiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKGdldFN0cm9rZVBvaW50cyhwb2ludHMsIG9wdGlvbnMuc3RyZWFtbGluZSksIG9wdGlvbnMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRTdHJva2U7XG5leHBvcnQgeyBnZXRTdHJva2VPdXRsaW5lUG9pbnRzLCBnZXRTdHJva2VQb2ludHMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBlcmZlY3QtZnJlZWhhbmQuZXNtLmpzLm1hcFxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwucG9seWdvbkNsaXBwaW5nID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH1cblxuICAvKipcbiAgICogc3BsYXl0cmVlIHYzLjEuMFxuICAgKiBGYXN0IFNwbGF5IHRyZWUgZm9yIE5vZGUgYW5kIGJyb3dzZXJcbiAgICpcbiAgICogQGF1dGhvciBBbGV4YW5kZXIgTWlsZXZza2kgPGluZm9AdzhyLm5hbWU+XG4gICAqIEBsaWNlbnNlIE1JVFxuICAgKiBAcHJlc2VydmVcbiAgICovXG4gIHZhciBOb2RlID1cbiAgLyoqIEBjbGFzcyAqL1xuICBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTm9kZShrZXksIGRhdGEpIHtcbiAgICAgIHRoaXMubmV4dCA9IG51bGw7XG4gICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgICAgdGhpcy5yaWdodCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIE5vZGU7XG4gIH0oKTtcbiAgLyogZm9sbG93cyBcIkFuIGltcGxlbWVudGF0aW9uIG9mIHRvcC1kb3duIHNwbGF5aW5nXCJcclxuICAgKiBieSBELiBTbGVhdG9yIDxzbGVhdG9yQGNzLmNtdS5lZHU+IE1hcmNoIDE5OTJcclxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIERFRkFVTFRfQ09NUEFSRShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xuICB9XG4gIC8qKlxyXG4gICAqIFNpbXBsZSB0b3AgZG93biBzcGxheSwgbm90IHJlcXVpcmluZyBpIHRvIGJlIGluIHRoZSB0cmVlIHQuXHJcbiAgICovXG5cblxuICBmdW5jdGlvbiBzcGxheShpLCB0LCBjb21wYXJhdG9yKSB7XG4gICAgdmFyIE4gPSBuZXcgTm9kZShudWxsLCBudWxsKTtcbiAgICB2YXIgbCA9IE47XG4gICAgdmFyIHIgPSBOO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGksIHQua2V5KTsgLy9pZiAoaSA8IHQua2V5KSB7XG5cbiAgICAgIGlmIChjbXAgPCAwKSB7XG4gICAgICAgIGlmICh0LmxlZnQgPT09IG51bGwpIGJyZWFrOyAvL2lmIChpIDwgdC5sZWZ0LmtleSkge1xuXG4gICAgICAgIGlmIChjb21wYXJhdG9yKGksIHQubGVmdC5rZXkpIDwgMCkge1xuICAgICAgICAgIHZhciB5ID0gdC5sZWZ0O1xuICAgICAgICAgIC8qIHJvdGF0ZSByaWdodCAqL1xuXG4gICAgICAgICAgdC5sZWZ0ID0geS5yaWdodDtcbiAgICAgICAgICB5LnJpZ2h0ID0gdDtcbiAgICAgICAgICB0ID0geTtcbiAgICAgICAgICBpZiAodC5sZWZ0ID09PSBudWxsKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHIubGVmdCA9IHQ7XG4gICAgICAgIC8qIGxpbmsgcmlnaHQgKi9cblxuICAgICAgICByID0gdDtcbiAgICAgICAgdCA9IHQubGVmdDsgLy99IGVsc2UgaWYgKGkgPiB0LmtleSkge1xuICAgICAgfSBlbHNlIGlmIChjbXAgPiAwKSB7XG4gICAgICAgIGlmICh0LnJpZ2h0ID09PSBudWxsKSBicmVhazsgLy9pZiAoaSA+IHQucmlnaHQua2V5KSB7XG5cbiAgICAgICAgaWYgKGNvbXBhcmF0b3IoaSwgdC5yaWdodC5rZXkpID4gMCkge1xuICAgICAgICAgIHZhciB5ID0gdC5yaWdodDtcbiAgICAgICAgICAvKiByb3RhdGUgbGVmdCAqL1xuXG4gICAgICAgICAgdC5yaWdodCA9IHkubGVmdDtcbiAgICAgICAgICB5LmxlZnQgPSB0O1xuICAgICAgICAgIHQgPSB5O1xuICAgICAgICAgIGlmICh0LnJpZ2h0ID09PSBudWxsKSBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGwucmlnaHQgPSB0O1xuICAgICAgICAvKiBsaW5rIGxlZnQgKi9cblxuICAgICAgICBsID0gdDtcbiAgICAgICAgdCA9IHQucmlnaHQ7XG4gICAgICB9IGVsc2UgYnJlYWs7XG4gICAgfVxuICAgIC8qIGFzc2VtYmxlICovXG5cblxuICAgIGwucmlnaHQgPSB0LmxlZnQ7XG4gICAgci5sZWZ0ID0gdC5yaWdodDtcbiAgICB0LmxlZnQgPSBOLnJpZ2h0O1xuICAgIHQucmlnaHQgPSBOLmxlZnQ7XG4gICAgcmV0dXJuIHQ7XG4gIH1cblxuICBmdW5jdGlvbiBpbnNlcnQoaSwgZGF0YSwgdCwgY29tcGFyYXRvcikge1xuICAgIHZhciBub2RlID0gbmV3IE5vZGUoaSwgZGF0YSk7XG5cbiAgICBpZiAodCA9PT0gbnVsbCkge1xuICAgICAgbm9kZS5sZWZ0ID0gbm9kZS5yaWdodCA9IG51bGw7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICB0ID0gc3BsYXkoaSwgdCwgY29tcGFyYXRvcik7XG4gICAgdmFyIGNtcCA9IGNvbXBhcmF0b3IoaSwgdC5rZXkpO1xuXG4gICAgaWYgKGNtcCA8IDApIHtcbiAgICAgIG5vZGUubGVmdCA9IHQubGVmdDtcbiAgICAgIG5vZGUucmlnaHQgPSB0O1xuICAgICAgdC5sZWZ0ID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGNtcCA+PSAwKSB7XG4gICAgICBub2RlLnJpZ2h0ID0gdC5yaWdodDtcbiAgICAgIG5vZGUubGVmdCA9IHQ7XG4gICAgICB0LnJpZ2h0ID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwbGl0KGtleSwgdiwgY29tcGFyYXRvcikge1xuICAgIHZhciBsZWZ0ID0gbnVsbDtcbiAgICB2YXIgcmlnaHQgPSBudWxsO1xuXG4gICAgaWYgKHYpIHtcbiAgICAgIHYgPSBzcGxheShrZXksIHYsIGNvbXBhcmF0b3IpO1xuICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3Iodi5rZXksIGtleSk7XG5cbiAgICAgIGlmIChjbXAgPT09IDApIHtcbiAgICAgICAgbGVmdCA9IHYubGVmdDtcbiAgICAgICAgcmlnaHQgPSB2LnJpZ2h0O1xuICAgICAgfSBlbHNlIGlmIChjbXAgPCAwKSB7XG4gICAgICAgIHJpZ2h0ID0gdi5yaWdodDtcbiAgICAgICAgdi5yaWdodCA9IG51bGw7XG4gICAgICAgIGxlZnQgPSB2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGVmdCA9IHYubGVmdDtcbiAgICAgICAgdi5sZWZ0ID0gbnVsbDtcbiAgICAgICAgcmlnaHQgPSB2O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgcmlnaHQ6IHJpZ2h0XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlKGxlZnQsIHJpZ2h0LCBjb21wYXJhdG9yKSB7XG4gICAgaWYgKHJpZ2h0ID09PSBudWxsKSByZXR1cm4gbGVmdDtcbiAgICBpZiAobGVmdCA9PT0gbnVsbCkgcmV0dXJuIHJpZ2h0O1xuICAgIHJpZ2h0ID0gc3BsYXkobGVmdC5rZXksIHJpZ2h0LCBjb21wYXJhdG9yKTtcbiAgICByaWdodC5sZWZ0ID0gbGVmdDtcbiAgICByZXR1cm4gcmlnaHQ7XG4gIH1cbiAgLyoqXHJcbiAgICogUHJpbnRzIGxldmVsIG9mIHRoZSB0cmVlXHJcbiAgICovXG5cblxuICBmdW5jdGlvbiBwcmludFJvdyhyb290LCBwcmVmaXgsIGlzVGFpbCwgb3V0LCBwcmludE5vZGUpIHtcbiAgICBpZiAocm9vdCkge1xuICAgICAgb3V0KFwiXCIgKyBwcmVmaXggKyAoaXNUYWlsID8gJ+KUlOKUgOKUgCAnIDogJ+KUnOKUgOKUgCAnKSArIHByaW50Tm9kZShyb290KSArIFwiXFxuXCIpO1xuICAgICAgdmFyIGluZGVudCA9IHByZWZpeCArIChpc1RhaWwgPyAnICAgICcgOiAn4pSCICAgJyk7XG4gICAgICBpZiAocm9vdC5sZWZ0KSBwcmludFJvdyhyb290LmxlZnQsIGluZGVudCwgZmFsc2UsIG91dCwgcHJpbnROb2RlKTtcbiAgICAgIGlmIChyb290LnJpZ2h0KSBwcmludFJvdyhyb290LnJpZ2h0LCBpbmRlbnQsIHRydWUsIG91dCwgcHJpbnROb2RlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgVHJlZSA9XG4gIC8qKiBAY2xhc3MgKi9cbiAgZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRyZWUoY29tcGFyYXRvcikge1xuICAgICAgaWYgKGNvbXBhcmF0b3IgPT09IHZvaWQgMCkge1xuICAgICAgICBjb21wYXJhdG9yID0gREVGQVVMVF9DT01QQVJFO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICAgIHRoaXMuX3NpemUgPSAwO1xuICAgICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgfVxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0cyBhIGtleSwgYWxsb3dzIGR1cGxpY2F0ZXNcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbiAoa2V5LCBkYXRhKSB7XG4gICAgICB0aGlzLl9zaXplKys7XG4gICAgICByZXR1cm4gdGhpcy5fcm9vdCA9IGluc2VydChrZXksIGRhdGEsIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIGEga2V5LCBpZiBpdCBpcyBub3QgcHJlc2VudCBpbiB0aGUgdHJlZVxyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChrZXksIGRhdGEpIHtcbiAgICAgIHZhciBub2RlID0gbmV3IE5vZGUoa2V5LCBkYXRhKTtcblxuICAgICAgaWYgKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgbm9kZS5sZWZ0ID0gbm9kZS5yaWdodCA9IG51bGw7XG4gICAgICAgIHRoaXMuX3NpemUrKztcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5vZGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcbiAgICAgIHZhciB0ID0gc3BsYXkoa2V5LCB0aGlzLl9yb290LCBjb21wYXJhdG9yKTtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGtleSwgdC5rZXkpO1xuICAgICAgaWYgKGNtcCA9PT0gMCkgdGhpcy5fcm9vdCA9IHQ7ZWxzZSB7XG4gICAgICAgIGlmIChjbXAgPCAwKSB7XG4gICAgICAgICAgbm9kZS5sZWZ0ID0gdC5sZWZ0O1xuICAgICAgICAgIG5vZGUucmlnaHQgPSB0O1xuICAgICAgICAgIHQubGVmdCA9IG51bGw7XG4gICAgICAgIH0gZWxzZSBpZiAoY21wID4gMCkge1xuICAgICAgICAgIG5vZGUucmlnaHQgPSB0LnJpZ2h0O1xuICAgICAgICAgIG5vZGUubGVmdCA9IHQ7XG4gICAgICAgICAgdC5yaWdodCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zaXplKys7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSBub2RlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX3Jvb3Q7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSAge0tleX0ga2V5XHJcbiAgICAgKiBAcmV0dXJuIHtOb2RlfG51bGx9XHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3JlbW92ZShrZXksIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBEZWxldGVzIGkgZnJvbSB0aGUgdHJlZSBpZiBpdCdzIHRoZXJlXHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUuX3JlbW92ZSA9IGZ1bmN0aW9uIChpLCB0LCBjb21wYXJhdG9yKSB7XG4gICAgICB2YXIgeDtcbiAgICAgIGlmICh0ID09PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICAgIHQgPSBzcGxheShpLCB0LCBjb21wYXJhdG9yKTtcbiAgICAgIHZhciBjbXAgPSBjb21wYXJhdG9yKGksIHQua2V5KTtcblxuICAgICAgaWYgKGNtcCA9PT0gMCkge1xuICAgICAgICAvKiBmb3VuZCBpdCAqL1xuICAgICAgICBpZiAodC5sZWZ0ID09PSBudWxsKSB7XG4gICAgICAgICAgeCA9IHQucmlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeCA9IHNwbGF5KGksIHQubGVmdCwgY29tcGFyYXRvcik7XG4gICAgICAgICAgeC5yaWdodCA9IHQucmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9zaXplLS07XG4gICAgICAgIHJldHVybiB4O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdDtcbiAgICAgIC8qIEl0IHdhc24ndCB0aGVyZSAqL1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGFuZCByZXR1cm5zIHRoZSBub2RlIHdpdGggc21hbGxlc3Qga2V5XHJcbiAgICAgKi9cblxuXG4gICAgVHJlZS5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuXG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICB3aGlsZSAobm9kZS5sZWZ0KSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGUubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBzcGxheShub2RlLmtleSwgdGhpcy5fcm9vdCwgdGhpcy5fY29tcGFyYXRvcik7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLl9yZW1vdmUobm9kZS5rZXksIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleTogbm9kZS5rZXksXG4gICAgICAgICAgZGF0YTogbm9kZS5kYXRhXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHdpdGhvdXQgc3BsYXlpbmdcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5maW5kU3RhdGljID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIGNvbXBhcmUgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgICB3aGlsZSAoY3VycmVudCkge1xuICAgICAgICB2YXIgY21wID0gY29tcGFyZShrZXksIGN1cnJlbnQua2V5KTtcbiAgICAgICAgaWYgKGNtcCA9PT0gMCkgcmV0dXJuIGN1cnJlbnQ7ZWxzZSBpZiAoY21wIDwgMCkgY3VycmVudCA9IGN1cnJlbnQubGVmdDtlbHNlIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGlmICh0aGlzLl9yb290KSB7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSBzcGxheShrZXksIHRoaXMuX3Jvb3QsIHRoaXMuX2NvbXBhcmF0b3IpO1xuICAgICAgICBpZiAodGhpcy5fY29tcGFyYXRvcihrZXksIHRoaXMuX3Jvb3Qua2V5KSAhPT0gMCkgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLl9yb290O1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBjb21wYXJlID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgdmFyIGNtcCA9IGNvbXBhcmUoa2V5LCBjdXJyZW50LmtleSk7XG4gICAgICAgIGlmIChjbXAgPT09IDApIHJldHVybiB0cnVlO2Vsc2UgaWYgKGNtcCA8IDApIGN1cnJlbnQgPSBjdXJyZW50LmxlZnQ7ZWxzZSBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24gKHZpc2l0b3IsIGN0eCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIFEgPSBbXTtcbiAgICAgIC8qIEluaXRpYWxpemUgc3RhY2sgcyAqL1xuXG4gICAgICB2YXIgZG9uZSA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgICBRLnB1c2goY3VycmVudCk7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubGVmdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoUS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBRLnBvcCgpO1xuICAgICAgICAgICAgdmlzaXRvci5jYWxsKGN0eCwgY3VycmVudCk7XG4gICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgICAgICB9IGVsc2UgZG9uZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIFdhbGsga2V5IHJhbmdlIGZyb20gYGxvd2AgdG8gYGhpZ2hgLiBTdG9wcyBpZiBgZm5gIHJldHVybnMgYSB2YWx1ZS5cclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5yYW5nZSA9IGZ1bmN0aW9uIChsb3csIGhpZ2gsIGZuLCBjdHgpIHtcbiAgICAgIHZhciBRID0gW107XG4gICAgICB2YXIgY29tcGFyZSA9IHRoaXMuX2NvbXBhcmF0b3I7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgY21wO1xuXG4gICAgICB3aGlsZSAoUS5sZW5ndGggIT09IDAgfHwgbm9kZSkge1xuICAgICAgICBpZiAobm9kZSkge1xuICAgICAgICAgIFEucHVzaChub2RlKTtcbiAgICAgICAgICBub2RlID0gbm9kZS5sZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGUgPSBRLnBvcCgpO1xuICAgICAgICAgIGNtcCA9IGNvbXBhcmUobm9kZS5rZXksIGhpZ2gpO1xuXG4gICAgICAgICAgaWYgKGNtcCA+IDApIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY29tcGFyZShub2RlLmtleSwgbG93KSA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoZm4uY2FsbChjdHgsIG5vZGUpKSByZXR1cm4gdGhpczsgLy8gc3RvcCBpZiBzbXRoIGlzIHJldHVybmVkXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbm9kZSA9IG5vZGUucmlnaHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYXJyYXkgb2Yga2V5c1xyXG4gICAgICovXG5cblxuICAgIFRyZWUucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIga2V5cyA9IFtdO1xuICAgICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2Eua2V5O1xuICAgICAgICByZXR1cm4ga2V5cy5wdXNoKGtleSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBpbiB0aGUgbm9kZXNcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBkYXRhID0gX2EuZGF0YTtcbiAgICAgICAgcmV0dXJuIHZhbHVlcy5wdXNoKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAodGhpcy5fcm9vdCkgcmV0dXJuIHRoaXMubWluTm9kZSh0aGlzLl9yb290KS5rZXk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRoaXMuX3Jvb3QpIHJldHVybiB0aGlzLm1heE5vZGUodGhpcy5fcm9vdCkua2V5O1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLm1pbk5vZGUgPSBmdW5jdGlvbiAodCkge1xuICAgICAgaWYgKHQgPT09IHZvaWQgMCkge1xuICAgICAgICB0ID0gdGhpcy5fcm9vdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHQpIHdoaWxlICh0LmxlZnQpIHtcbiAgICAgICAgdCA9IHQubGVmdDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0O1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5tYXhOb2RlID0gZnVuY3Rpb24gKHQpIHtcbiAgICAgIGlmICh0ID09PSB2b2lkIDApIHtcbiAgICAgICAgdCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB9XG5cbiAgICAgIGlmICh0KSB3aGlsZSAodC5yaWdodCkge1xuICAgICAgICB0ID0gdC5yaWdodDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm5zIG5vZGUgYXQgZ2l2ZW4gaW5kZXhcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5hdCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLl9yb290O1xuICAgICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHZhciBRID0gW107XG5cbiAgICAgIHdoaWxlICghZG9uZSkge1xuICAgICAgICBpZiAoY3VycmVudCkge1xuICAgICAgICAgIFEucHVzaChjdXJyZW50KTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChRLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBRLnBvcCgpO1xuICAgICAgICAgICAgaWYgKGkgPT09IGluZGV4KSByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnJpZ2h0O1xuICAgICAgICAgIH0gZWxzZSBkb25lID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIChkKSB7XG4gICAgICB2YXIgcm9vdCA9IHRoaXMuX3Jvb3Q7XG4gICAgICB2YXIgc3VjY2Vzc29yID0gbnVsbDtcblxuICAgICAgaWYgKGQucmlnaHQpIHtcbiAgICAgICAgc3VjY2Vzc29yID0gZC5yaWdodDtcblxuICAgICAgICB3aGlsZSAoc3VjY2Vzc29yLmxlZnQpIHtcbiAgICAgICAgICBzdWNjZXNzb3IgPSBzdWNjZXNzb3IubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdWNjZXNzb3I7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgICAgd2hpbGUgKHJvb3QpIHtcbiAgICAgICAgdmFyIGNtcCA9IGNvbXBhcmF0b3IoZC5rZXksIHJvb3Qua2V5KTtcbiAgICAgICAgaWYgKGNtcCA9PT0gMCkgYnJlYWs7ZWxzZSBpZiAoY21wIDwgMCkge1xuICAgICAgICAgIHN1Y2Nlc3NvciA9IHJvb3Q7XG4gICAgICAgICAgcm9vdCA9IHJvb3QubGVmdDtcbiAgICAgICAgfSBlbHNlIHJvb3QgPSByb290LnJpZ2h0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3VjY2Vzc29yO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKGQpIHtcbiAgICAgIHZhciByb290ID0gdGhpcy5fcm9vdDtcbiAgICAgIHZhciBwcmVkZWNlc3NvciA9IG51bGw7XG5cbiAgICAgIGlmIChkLmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgcHJlZGVjZXNzb3IgPSBkLmxlZnQ7XG5cbiAgICAgICAgd2hpbGUgKHByZWRlY2Vzc29yLnJpZ2h0KSB7XG4gICAgICAgICAgcHJlZGVjZXNzb3IgPSBwcmVkZWNlc3Nvci5yaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcmVkZWNlc3NvcjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbXBhcmF0b3IgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgICB3aGlsZSAocm9vdCkge1xuICAgICAgICB2YXIgY21wID0gY29tcGFyYXRvcihkLmtleSwgcm9vdC5rZXkpO1xuICAgICAgICBpZiAoY21wID09PSAwKSBicmVhaztlbHNlIGlmIChjbXAgPCAwKSByb290ID0gcm9vdC5sZWZ0O2Vsc2Uge1xuICAgICAgICAgIHByZWRlY2Vzc29yID0gcm9vdDtcbiAgICAgICAgICByb290ID0gcm9vdC5yaWdodDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJlZGVjZXNzb3I7XG4gICAgfTtcblxuICAgIFRyZWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICB0aGlzLl9zaXplID0gMDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS50b0xpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9MaXN0KHRoaXMuX3Jvb3QpO1xuICAgIH07XG4gICAgLyoqXHJcbiAgICAgKiBCdWxrLWxvYWQgaXRlbXMuIEJvdGggYXJyYXkgaGF2ZSB0byBiZSBzYW1lIHNpemVcclxuICAgICAqL1xuXG5cbiAgICBUcmVlLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGtleXMsIHZhbHVlcywgcHJlc29ydCkge1xuICAgICAgaWYgKHZhbHVlcyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHZhbHVlcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJlc29ydCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHByZXNvcnQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICAgIHZhciBjb21wYXJhdG9yID0gdGhpcy5fY29tcGFyYXRvcjsgLy8gc29ydCBpZiBuZWVkZWRcblxuICAgICAgaWYgKHByZXNvcnQpIHNvcnQoa2V5cywgdmFsdWVzLCAwLCBzaXplIC0gMSwgY29tcGFyYXRvcik7XG5cbiAgICAgIGlmICh0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IGxvYWRSZWN1cnNpdmUoa2V5cywgdmFsdWVzLCAwLCBzaXplKTtcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHNpemU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0aGF0IHJlLWJ1aWxkcyB0aGUgd2hvbGUgdHJlZSBmcm9tIHR3byBpbi1vcmRlciB0cmF2ZXJzYWxzXG4gICAgICAgIHZhciBtZXJnZWRMaXN0ID0gbWVyZ2VMaXN0cyh0aGlzLnRvTGlzdCgpLCBjcmVhdGVMaXN0KGtleXMsIHZhbHVlcyksIGNvbXBhcmF0b3IpO1xuICAgICAgICBzaXplID0gdGhpcy5fc2l6ZSArIHNpemU7XG4gICAgICAgIHRoaXMuX3Jvb3QgPSBzb3J0ZWRMaXN0VG9CU1Qoe1xuICAgICAgICAgIGhlYWQ6IG1lcmdlZExpc3RcbiAgICAgICAgfSwgMCwgc2l6ZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUcmVlLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Jvb3QgPT09IG51bGw7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmVlLnByb3RvdHlwZSwgXCJzaXplXCIsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2l6ZTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyZWUucHJvdG90eXBlLCBcInJvb3RcIiwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9yb290O1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcblxuICAgIFRyZWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKHByaW50Tm9kZSkge1xuICAgICAgaWYgKHByaW50Tm9kZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHByaW50Tm9kZSA9IGZ1bmN0aW9uIHByaW50Tm9kZShuKSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyhuLmtleSk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgIHByaW50Um93KHRoaXMuX3Jvb3QsICcnLCB0cnVlLCBmdW5jdGlvbiAodikge1xuICAgICAgICByZXR1cm4gb3V0LnB1c2godik7XG4gICAgICB9LCBwcmludE5vZGUpO1xuICAgICAgcmV0dXJuIG91dC5qb2luKCcnKTtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGtleSwgbmV3S2V5LCBuZXdEYXRhKSB7XG4gICAgICB2YXIgY29tcGFyYXRvciA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICAgIHZhciBfYSA9IHNwbGl0KGtleSwgdGhpcy5fcm9vdCwgY29tcGFyYXRvciksXG4gICAgICAgICAgbGVmdCA9IF9hLmxlZnQsXG4gICAgICAgICAgcmlnaHQgPSBfYS5yaWdodDtcblxuICAgICAgaWYgKGNvbXBhcmF0b3Ioa2V5LCBuZXdLZXkpIDwgMCkge1xuICAgICAgICByaWdodCA9IGluc2VydChuZXdLZXksIG5ld0RhdGEsIHJpZ2h0LCBjb21wYXJhdG9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxlZnQgPSBpbnNlcnQobmV3S2V5LCBuZXdEYXRhLCBsZWZ0LCBjb21wYXJhdG9yKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcm9vdCA9IG1lcmdlKGxlZnQsIHJpZ2h0LCBjb21wYXJhdG9yKTtcbiAgICB9O1xuXG4gICAgVHJlZS5wcm90b3R5cGUuc3BsaXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZXR1cm4gc3BsaXQoa2V5LCB0aGlzLl9yb290LCB0aGlzLl9jb21wYXJhdG9yKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFRyZWU7XG4gIH0oKTtcblxuICBmdW5jdGlvbiBsb2FkUmVjdXJzaXZlKGtleXMsIHZhbHVlcywgc3RhcnQsIGVuZCkge1xuICAgIHZhciBzaXplID0gZW5kIC0gc3RhcnQ7XG5cbiAgICBpZiAoc2l6ZSA+IDApIHtcbiAgICAgIHZhciBtaWRkbGUgPSBzdGFydCArIE1hdGguZmxvb3Ioc2l6ZSAvIDIpO1xuICAgICAgdmFyIGtleSA9IGtleXNbbWlkZGxlXTtcbiAgICAgIHZhciBkYXRhID0gdmFsdWVzW21pZGRsZV07XG4gICAgICB2YXIgbm9kZSA9IG5ldyBOb2RlKGtleSwgZGF0YSk7XG4gICAgICBub2RlLmxlZnQgPSBsb2FkUmVjdXJzaXZlKGtleXMsIHZhbHVlcywgc3RhcnQsIG1pZGRsZSk7XG4gICAgICBub2RlLnJpZ2h0ID0gbG9hZFJlY3Vyc2l2ZShrZXlzLCB2YWx1ZXMsIG1pZGRsZSArIDEsIGVuZCk7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUxpc3Qoa2V5cywgdmFsdWVzKSB7XG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZShudWxsLCBudWxsKTtcbiAgICB2YXIgcCA9IGhlYWQ7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHAgPSBwLm5leHQgPSBuZXcgTm9kZShrZXlzW2ldLCB2YWx1ZXNbaV0pO1xuICAgIH1cblxuICAgIHAubmV4dCA9IG51bGw7XG4gICAgcmV0dXJuIGhlYWQubmV4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvTGlzdChyb290KSB7XG4gICAgdmFyIGN1cnJlbnQgPSByb290O1xuICAgIHZhciBRID0gW107XG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKG51bGwsIG51bGwpO1xuICAgIHZhciBwID0gaGVhZDtcblxuICAgIHdoaWxlICghZG9uZSkge1xuICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgUS5wdXNoKGN1cnJlbnQpO1xuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5sZWZ0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFEubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGN1cnJlbnQgPSBwID0gcC5uZXh0ID0gUS5wb3AoKTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5yaWdodDtcbiAgICAgICAgfSBlbHNlIGRvbmUgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHAubmV4dCA9IG51bGw7IC8vIHRoYXQnbGwgd29yayBldmVuIGlmIHRoZSB0cmVlIHdhcyBlbXB0eVxuXG4gICAgcmV0dXJuIGhlYWQubmV4dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnRlZExpc3RUb0JTVChsaXN0LCBzdGFydCwgZW5kKSB7XG4gICAgdmFyIHNpemUgPSBlbmQgLSBzdGFydDtcblxuICAgIGlmIChzaXplID4gMCkge1xuICAgICAgdmFyIG1pZGRsZSA9IHN0YXJ0ICsgTWF0aC5mbG9vcihzaXplIC8gMik7XG4gICAgICB2YXIgbGVmdCA9IHNvcnRlZExpc3RUb0JTVChsaXN0LCBzdGFydCwgbWlkZGxlKTtcbiAgICAgIHZhciByb290ID0gbGlzdC5oZWFkO1xuICAgICAgcm9vdC5sZWZ0ID0gbGVmdDtcbiAgICAgIGxpc3QuaGVhZCA9IGxpc3QuaGVhZC5uZXh0O1xuICAgICAgcm9vdC5yaWdodCA9IHNvcnRlZExpc3RUb0JTVChsaXN0LCBtaWRkbGUgKyAxLCBlbmQpO1xuICAgICAgcmV0dXJuIHJvb3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUxpc3RzKGwxLCBsMiwgY29tcGFyZSkge1xuICAgIHZhciBoZWFkID0gbmV3IE5vZGUobnVsbCwgbnVsbCk7IC8vIGR1bW15XG5cbiAgICB2YXIgcCA9IGhlYWQ7XG4gICAgdmFyIHAxID0gbDE7XG4gICAgdmFyIHAyID0gbDI7XG5cbiAgICB3aGlsZSAocDEgIT09IG51bGwgJiYgcDIgIT09IG51bGwpIHtcbiAgICAgIGlmIChjb21wYXJlKHAxLmtleSwgcDIua2V5KSA8IDApIHtcbiAgICAgICAgcC5uZXh0ID0gcDE7XG4gICAgICAgIHAxID0gcDEubmV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHAubmV4dCA9IHAyO1xuICAgICAgICBwMiA9IHAyLm5leHQ7XG4gICAgICB9XG5cbiAgICAgIHAgPSBwLm5leHQ7XG4gICAgfVxuXG4gICAgaWYgKHAxICE9PSBudWxsKSB7XG4gICAgICBwLm5leHQgPSBwMTtcbiAgICB9IGVsc2UgaWYgKHAyICE9PSBudWxsKSB7XG4gICAgICBwLm5leHQgPSBwMjtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVhZC5uZXh0O1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydChrZXlzLCB2YWx1ZXMsIGxlZnQsIHJpZ2h0LCBjb21wYXJlKSB7XG4gICAgaWYgKGxlZnQgPj0gcmlnaHQpIHJldHVybjtcbiAgICB2YXIgcGl2b3QgPSBrZXlzW2xlZnQgKyByaWdodCA+PiAxXTtcbiAgICB2YXIgaSA9IGxlZnQgLSAxO1xuICAgIHZhciBqID0gcmlnaHQgKyAxO1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaSsrO1xuICAgICAgfSB3aGlsZSAoY29tcGFyZShrZXlzW2ldLCBwaXZvdCkgPCAwKTtcblxuICAgICAgZG8ge1xuICAgICAgICBqLS07XG4gICAgICB9IHdoaWxlIChjb21wYXJlKGtleXNbal0sIHBpdm90KSA+IDApO1xuXG4gICAgICBpZiAoaSA+PSBqKSBicmVhaztcbiAgICAgIHZhciB0bXAgPSBrZXlzW2ldO1xuICAgICAga2V5c1tpXSA9IGtleXNbal07XG4gICAgICBrZXlzW2pdID0gdG1wO1xuICAgICAgdG1wID0gdmFsdWVzW2ldO1xuICAgICAgdmFsdWVzW2ldID0gdmFsdWVzW2pdO1xuICAgICAgdmFsdWVzW2pdID0gdG1wO1xuICAgIH1cblxuICAgIHNvcnQoa2V5cywgdmFsdWVzLCBsZWZ0LCBqLCBjb21wYXJlKTtcbiAgICBzb3J0KGtleXMsIHZhbHVlcywgaiArIDEsIHJpZ2h0LCBjb21wYXJlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGJvdW5kaW5nIGJveCBoYXMgdGhlIGZvcm1hdDpcbiAgICpcbiAgICogIHsgbGw6IHsgeDogeG1pbiwgeTogeW1pbiB9LCB1cjogeyB4OiB4bWF4LCB5OiB5bWF4IH0gfVxuICAgKlxuICAgKi9cbiAgdmFyIGlzSW5CYm94ID0gZnVuY3Rpb24gaXNJbkJib3goYmJveCwgcG9pbnQpIHtcbiAgICByZXR1cm4gYmJveC5sbC54IDw9IHBvaW50LnggJiYgcG9pbnQueCA8PSBiYm94LnVyLnggJiYgYmJveC5sbC55IDw9IHBvaW50LnkgJiYgcG9pbnQueSA8PSBiYm94LnVyLnk7XG4gIH07XG4gIC8qIFJldHVybnMgZWl0aGVyIG51bGwsIG9yIGEgYmJveCAoYWthIGFuIG9yZGVyZWQgcGFpciBvZiBwb2ludHMpXG4gICAqIElmIHRoZXJlIGlzIG9ubHkgb25lIHBvaW50IG9mIG92ZXJsYXAsIGEgYmJveCB3aXRoIGlkZW50aWNhbCBwb2ludHNcbiAgICogd2lsbCBiZSByZXR1cm5lZCAqL1xuXG4gIHZhciBnZXRCYm94T3ZlcmxhcCA9IGZ1bmN0aW9uIGdldEJib3hPdmVybGFwKGIxLCBiMikge1xuICAgIC8vIGNoZWNrIGlmIHRoZSBiYm94ZXMgb3ZlcmxhcCBhdCBhbGxcbiAgICBpZiAoYjIudXIueCA8IGIxLmxsLnggfHwgYjEudXIueCA8IGIyLmxsLnggfHwgYjIudXIueSA8IGIxLmxsLnkgfHwgYjEudXIueSA8IGIyLmxsLnkpIHJldHVybiBudWxsOyAvLyBmaW5kIHRoZSBtaWRkbGUgdHdvIFggdmFsdWVzXG5cbiAgICB2YXIgbG93ZXJYID0gYjEubGwueCA8IGIyLmxsLnggPyBiMi5sbC54IDogYjEubGwueDtcbiAgICB2YXIgdXBwZXJYID0gYjEudXIueCA8IGIyLnVyLnggPyBiMS51ci54IDogYjIudXIueDsgLy8gZmluZCB0aGUgbWlkZGxlIHR3byBZIHZhbHVlc1xuXG4gICAgdmFyIGxvd2VyWSA9IGIxLmxsLnkgPCBiMi5sbC55ID8gYjIubGwueSA6IGIxLmxsLnk7XG4gICAgdmFyIHVwcGVyWSA9IGIxLnVyLnkgPCBiMi51ci55ID8gYjEudXIueSA6IGIyLnVyLnk7IC8vIHB1dCB0aG9zZSBtaWRkbGUgdmFsdWVzIHRvZ2V0aGVyIHRvIGdldCB0aGUgb3ZlcmxhcFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxsOiB7XG4gICAgICAgIHg6IGxvd2VyWCxcbiAgICAgICAgeTogbG93ZXJZXG4gICAgICB9LFxuICAgICAgdXI6IHtcbiAgICAgICAgeDogdXBwZXJYLFxuICAgICAgICB5OiB1cHBlcllcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8qIEphdmFzY3JpcHQgZG9lc24ndCBkbyBpbnRlZ2VyIG1hdGguIEV2ZXJ5dGhpbmcgaXNcbiAgICogZmxvYXRpbmcgcG9pbnQgd2l0aCBwZXJjaXNpb24gTnVtYmVyLkVQU0lMT04uXG4gICAqXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL051bWJlci9FUFNJTE9OXG4gICAqL1xuICB2YXIgZXBzaWxvbiA9IE51bWJlci5FUFNJTE9OOyAvLyBJRSBQb2x5ZmlsbFxuXG4gIGlmIChlcHNpbG9uID09PSB1bmRlZmluZWQpIGVwc2lsb24gPSBNYXRoLnBvdygyLCAtNTIpO1xuICB2YXIgRVBTSUxPTl9TUSA9IGVwc2lsb24gKiBlcHNpbG9uO1xuICAvKiBGTFAgY29tcGFyYXRvciAqL1xuXG4gIHZhciBjbXAgPSBmdW5jdGlvbiBjbXAoYSwgYikge1xuICAgIC8vIGNoZWNrIGlmIHRoZXkncmUgYm90aCAwXG4gICAgaWYgKC1lcHNpbG9uIDwgYSAmJiBhIDwgZXBzaWxvbikge1xuICAgICAgaWYgKC1lcHNpbG9uIDwgYiAmJiBiIDwgZXBzaWxvbikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9IC8vIGNoZWNrIGlmIHRoZXkncmUgZmxwIGVxdWFsXG5cblxuICAgIHZhciBhYiA9IGEgLSBiO1xuXG4gICAgaWYgKGFiICogYWIgPCBFUFNJTE9OX1NRICogYSAqIGIpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gLy8gbm9ybWFsIGNvbXBhcmlzb25cblxuXG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiAxO1xuICB9O1xuXG4gIC8qKlxuICAgKiBUaGlzIGNsYXNzIHJvdW5kcyBpbmNvbWluZyB2YWx1ZXMgc3VmZmljaWVudGx5IHNvIHRoYXRcbiAgICogZmxvYXRpbmcgcG9pbnRzIHByb2JsZW1zIGFyZSwgZm9yIHRoZSBtb3N0IHBhcnQsIGF2b2lkZWQuXG4gICAqXG4gICAqIEluY29taW5nIHBvaW50cyBhcmUgaGF2ZSB0aGVpciB4ICYgeSB2YWx1ZXMgdGVzdGVkIGFnYWluc3RcbiAgICogYWxsIHByZXZpb3VzbHkgc2VlbiB4ICYgeSB2YWx1ZXMuIElmIGVpdGhlciBpcyAndG9vIGNsb3NlJ1xuICAgKiB0byBhIHByZXZpb3VzbHkgc2VlbiB2YWx1ZSwgaXQncyB2YWx1ZSBpcyAnc25hcHBlZCcgdG8gdGhlXG4gICAqIHByZXZpb3VzbHkgc2VlbiB2YWx1ZS5cbiAgICpcbiAgICogQWxsIHBvaW50cyBzaG91bGQgYmUgcm91bmRlZCBieSB0aGlzIGNsYXNzIGJlZm9yZSBiZWluZ1xuICAgKiBzdG9yZWQgaW4gYW55IGRhdGEgc3RydWN0dXJlcyBpbiB0aGUgcmVzdCBvZiB0aGlzIGFsZ29yaXRobS5cbiAgICovXG5cbiAgdmFyIFB0Um91bmRlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUHRSb3VuZGVyKCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFB0Um91bmRlcik7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUHRSb3VuZGVyLCBbe1xuICAgICAga2V5OiBcInJlc2V0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIHRoaXMueFJvdW5kZXIgPSBuZXcgQ29vcmRSb3VuZGVyKCk7XG4gICAgICAgIHRoaXMueVJvdW5kZXIgPSBuZXcgQ29vcmRSb3VuZGVyKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcInJvdW5kXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcm91bmQoeCwgeSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHg6IHRoaXMueFJvdW5kZXIucm91bmQoeCksXG4gICAgICAgICAgeTogdGhpcy55Um91bmRlci5yb3VuZCh5KVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQdFJvdW5kZXI7XG4gIH0oKTtcblxuICB2YXIgQ29vcmRSb3VuZGVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb29yZFJvdW5kZXIoKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29vcmRSb3VuZGVyKTtcblxuICAgICAgdGhpcy50cmVlID0gbmV3IFRyZWUoKTsgLy8gcHJlc2VlZCB3aXRoIDAgc28gd2UgZG9uJ3QgZW5kIHVwIHdpdGggdmFsdWVzIDwgTnVtYmVyLkVQU0lMT05cblxuICAgICAgdGhpcy5yb3VuZCgwKTtcbiAgICB9IC8vIE5vdGU6IHRoaXMgY2FuIHJvdW5kcyBpbnB1dCB2YWx1ZXMgYmFja3dhcmRzIG9yIGZvcndhcmRzLlxuICAgIC8vICAgICAgIFlvdSBtaWdodCBhc2ssIHdoeSBub3QgcmVzdHJpY3QgdGhpcyB0byBqdXN0IHJvdW5kaW5nXG4gICAgLy8gICAgICAgZm9yd2FyZHM/IFdvdWxkbid0IHRoYXQgYWxsb3cgbGVmdCBlbmRwb2ludHMgdG8gYWx3YXlzXG4gICAgLy8gICAgICAgcmVtYWluIGxlZnQgZW5kcG9pbnRzIGR1cmluZyBzcGxpdHRpbmcgKG5ldmVyIGNoYW5nZSB0b1xuICAgIC8vICAgICAgIHJpZ2h0KS4gTm8gLSBpdCB3b3VsZG4ndCwgYmVjYXVzZSB3ZSBzbmFwIGludGVyc2VjdGlvbnNcbiAgICAvLyAgICAgICB0byBlbmRwb2ludHMgKHRvIGVzdGFibGlzaCBpbmRlcGVuZGVuY2UgZnJvbSB0aGUgc2VnbWVudFxuICAgIC8vICAgICAgIGFuZ2xlIGZvciB0LWludGVyc2VjdGlvbnMpLlxuXG5cbiAgICBfY3JlYXRlQ2xhc3MoQ29vcmRSb3VuZGVyLCBbe1xuICAgICAga2V5OiBcInJvdW5kXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gcm91bmQoY29vcmQpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLnRyZWUuYWRkKGNvb3JkKTtcbiAgICAgICAgdmFyIHByZXZOb2RlID0gdGhpcy50cmVlLnByZXYobm9kZSk7XG5cbiAgICAgICAgaWYgKHByZXZOb2RlICE9PSBudWxsICYmIGNtcChub2RlLmtleSwgcHJldk5vZGUua2V5KSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMudHJlZS5yZW1vdmUoY29vcmQpO1xuICAgICAgICAgIHJldHVybiBwcmV2Tm9kZS5rZXk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbmV4dE5vZGUgPSB0aGlzLnRyZWUubmV4dChub2RlKTtcblxuICAgICAgICBpZiAobmV4dE5vZGUgIT09IG51bGwgJiYgY21wKG5vZGUua2V5LCBuZXh0Tm9kZS5rZXkpID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50cmVlLnJlbW92ZShjb29yZCk7XG4gICAgICAgICAgcmV0dXJuIG5leHROb2RlLmtleTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gQ29vcmRSb3VuZGVyO1xuICB9KCk7IC8vIHNpbmdsZXRvbiBhdmFpbGFibGUgYnkgaW1wb3J0XG5cblxuICB2YXIgcm91bmRlciA9IG5ldyBQdFJvdW5kZXIoKTtcblxuICAvKiBDcm9zcyBQcm9kdWN0IG9mIHR3byB2ZWN0b3JzIHdpdGggZmlyc3QgcG9pbnQgYXQgb3JpZ2luICovXG5cbiAgdmFyIGNyb3NzUHJvZHVjdCA9IGZ1bmN0aW9uIGNyb3NzUHJvZHVjdChhLCBiKSB7XG4gICAgcmV0dXJuIGEueCAqIGIueSAtIGEueSAqIGIueDtcbiAgfTtcbiAgLyogRG90IFByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMgd2l0aCBmaXJzdCBwb2ludCBhdCBvcmlnaW4gKi9cblxuICB2YXIgZG90UHJvZHVjdCA9IGZ1bmN0aW9uIGRvdFByb2R1Y3QoYSwgYikge1xuICAgIHJldHVybiBhLnggKiBiLnggKyBhLnkgKiBiLnk7XG4gIH07XG4gIC8qIENvbXBhcmF0b3IgZm9yIHR3byB2ZWN0b3JzIHdpdGggc2FtZSBzdGFydGluZyBwb2ludCAqL1xuXG4gIHZhciBjb21wYXJlVmVjdG9yQW5nbGVzID0gZnVuY3Rpb24gY29tcGFyZVZlY3RvckFuZ2xlcyhiYXNlUHQsIGVuZFB0MSwgZW5kUHQyKSB7XG4gICAgdmFyIHYxID0ge1xuICAgICAgeDogZW5kUHQxLnggLSBiYXNlUHQueCxcbiAgICAgIHk6IGVuZFB0MS55IC0gYmFzZVB0LnlcbiAgICB9O1xuICAgIHZhciB2MiA9IHtcbiAgICAgIHg6IGVuZFB0Mi54IC0gYmFzZVB0LngsXG4gICAgICB5OiBlbmRQdDIueSAtIGJhc2VQdC55XG4gICAgfTtcbiAgICB2YXIga3Jvc3MgPSBjcm9zc1Byb2R1Y3QodjEsIHYyKTtcbiAgICByZXR1cm4gY21wKGtyb3NzLCAwKTtcbiAgfTtcbiAgdmFyIGxlbmd0aCA9IGZ1bmN0aW9uIGxlbmd0aCh2KSB7XG4gICAgcmV0dXJuIE1hdGguc3FydChkb3RQcm9kdWN0KHYsIHYpKTtcbiAgfTtcbiAgLyogR2V0IHRoZSBzaW5lIG9mIHRoZSBhbmdsZSBmcm9tIHBTaGFyZWQgLT4gcEFuZ2xlIHRvIHBTaGFlZCAtPiBwQmFzZSAqL1xuXG4gIHZhciBzaW5lT2ZBbmdsZSA9IGZ1bmN0aW9uIHNpbmVPZkFuZ2xlKHBTaGFyZWQsIHBCYXNlLCBwQW5nbGUpIHtcbiAgICB2YXIgdkJhc2UgPSB7XG4gICAgICB4OiBwQmFzZS54IC0gcFNoYXJlZC54LFxuICAgICAgeTogcEJhc2UueSAtIHBTaGFyZWQueVxuICAgIH07XG4gICAgdmFyIHZBbmdsZSA9IHtcbiAgICAgIHg6IHBBbmdsZS54IC0gcFNoYXJlZC54LFxuICAgICAgeTogcEFuZ2xlLnkgLSBwU2hhcmVkLnlcbiAgICB9O1xuICAgIHJldHVybiBjcm9zc1Byb2R1Y3QodkFuZ2xlLCB2QmFzZSkgLyBsZW5ndGgodkFuZ2xlKSAvIGxlbmd0aCh2QmFzZSk7XG4gIH07XG4gIC8qIEdldCB0aGUgY29zaW5lIG9mIHRoZSBhbmdsZSBmcm9tIHBTaGFyZWQgLT4gcEFuZ2xlIHRvIHBTaGFlZCAtPiBwQmFzZSAqL1xuXG4gIHZhciBjb3NpbmVPZkFuZ2xlID0gZnVuY3Rpb24gY29zaW5lT2ZBbmdsZShwU2hhcmVkLCBwQmFzZSwgcEFuZ2xlKSB7XG4gICAgdmFyIHZCYXNlID0ge1xuICAgICAgeDogcEJhc2UueCAtIHBTaGFyZWQueCxcbiAgICAgIHk6IHBCYXNlLnkgLSBwU2hhcmVkLnlcbiAgICB9O1xuICAgIHZhciB2QW5nbGUgPSB7XG4gICAgICB4OiBwQW5nbGUueCAtIHBTaGFyZWQueCxcbiAgICAgIHk6IHBBbmdsZS55IC0gcFNoYXJlZC55XG4gICAgfTtcbiAgICByZXR1cm4gZG90UHJvZHVjdCh2QW5nbGUsIHZCYXNlKSAvIGxlbmd0aCh2QW5nbGUpIC8gbGVuZ3RoKHZCYXNlKTtcbiAgfTtcbiAgLyogR2V0IHRoZSB4IGNvb3JkaW5hdGUgd2hlcmUgdGhlIGdpdmVuIGxpbmUgKGRlZmluZWQgYnkgYSBwb2ludCBhbmQgdmVjdG9yKVxuICAgKiBjcm9zc2VzIHRoZSBob3Jpem9udGFsIGxpbmUgd2l0aCB0aGUgZ2l2ZW4geSBjb29yZGlhbnRlLlxuICAgKiBJbiB0aGUgY2FzZSBvZiBwYXJyYWxsZWwgbGluZXMgKGluY2x1ZGluZyBvdmVybGFwcGluZyBvbmVzKSByZXR1cm5zIG51bGwuICovXG5cbiAgdmFyIGhvcml6b250YWxJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiBob3Jpem9udGFsSW50ZXJzZWN0aW9uKHB0LCB2LCB5KSB7XG4gICAgaWYgKHYueSA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHB0LnggKyB2LnggLyB2LnkgKiAoeSAtIHB0LnkpLFxuICAgICAgeTogeVxuICAgIH07XG4gIH07XG4gIC8qIEdldCB0aGUgeSBjb29yZGluYXRlIHdoZXJlIHRoZSBnaXZlbiBsaW5lIChkZWZpbmVkIGJ5IGEgcG9pbnQgYW5kIHZlY3RvcilcbiAgICogY3Jvc3NlcyB0aGUgdmVydGljYWwgbGluZSB3aXRoIHRoZSBnaXZlbiB4IGNvb3JkaWFudGUuXG4gICAqIEluIHRoZSBjYXNlIG9mIHBhcnJhbGxlbCBsaW5lcyAoaW5jbHVkaW5nIG92ZXJsYXBwaW5nIG9uZXMpIHJldHVybnMgbnVsbC4gKi9cblxuICB2YXIgdmVydGljYWxJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbiB2ZXJ0aWNhbEludGVyc2VjdGlvbihwdCwgdiwgeCkge1xuICAgIGlmICh2LnggPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogcHQueSArIHYueSAvIHYueCAqICh4IC0gcHQueClcbiAgICB9O1xuICB9O1xuICAvKiBHZXQgdGhlIGludGVyc2VjdGlvbiBvZiB0d28gbGluZXMsIGVhY2ggZGVmaW5lZCBieSBhIGJhc2UgcG9pbnQgYW5kIGEgdmVjdG9yLlxuICAgKiBJbiB0aGUgY2FzZSBvZiBwYXJyYWxsZWwgbGluZXMgKGluY2x1ZGluZyBvdmVybGFwcGluZyBvbmVzKSByZXR1cm5zIG51bGwuICovXG5cbiAgdmFyIGludGVyc2VjdGlvbiA9IGZ1bmN0aW9uIGludGVyc2VjdGlvbihwdDEsIHYxLCBwdDIsIHYyKSB7XG4gICAgLy8gdGFrZSBzb21lIHNob3J0Y3V0cyBmb3IgdmVydGljYWwgYW5kIGhvcml6b250YWwgbGluZXNcbiAgICAvLyB0aGlzIGFsc28gZW5zdXJlcyB3ZSBkb24ndCBjYWxjdWxhdGUgYW4gaW50ZXJzZWN0aW9uIGFuZCB0aGVuIGRpc2NvdmVyXG4gICAgLy8gaXQncyBhY3R1YWxseSBvdXRzaWRlIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGxpbmVcbiAgICBpZiAodjEueCA9PT0gMCkgcmV0dXJuIHZlcnRpY2FsSW50ZXJzZWN0aW9uKHB0MiwgdjIsIHB0MS54KTtcbiAgICBpZiAodjIueCA9PT0gMCkgcmV0dXJuIHZlcnRpY2FsSW50ZXJzZWN0aW9uKHB0MSwgdjEsIHB0Mi54KTtcbiAgICBpZiAodjEueSA9PT0gMCkgcmV0dXJuIGhvcml6b250YWxJbnRlcnNlY3Rpb24ocHQyLCB2MiwgcHQxLnkpO1xuICAgIGlmICh2Mi55ID09PSAwKSByZXR1cm4gaG9yaXpvbnRhbEludGVyc2VjdGlvbihwdDEsIHYxLCBwdDIueSk7IC8vIEdlbmVyYWwgY2FzZSBmb3Igbm9uLW92ZXJsYXBwaW5nIHNlZ21lbnRzLlxuICAgIC8vIFRoaXMgYWxnb3JpdGhtIGlzIGJhc2VkIG9uIFNjaG5laWRlciBhbmQgRWJlcmx5LlxuICAgIC8vIGh0dHA6Ly93d3cuY2ltZWMub3JnLmFyL35uY2Fsdm8vU2NobmVpZGVyX0ViZXJseS5wZGYgLSBwZyAyNDRcblxuICAgIHZhciBrcm9zcyA9IGNyb3NzUHJvZHVjdCh2MSwgdjIpO1xuICAgIGlmIChrcm9zcyA9PSAwKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgdmUgPSB7XG4gICAgICB4OiBwdDIueCAtIHB0MS54LFxuICAgICAgeTogcHQyLnkgLSBwdDEueVxuICAgIH07XG4gICAgdmFyIGQxID0gY3Jvc3NQcm9kdWN0KHZlLCB2MSkgLyBrcm9zcztcbiAgICB2YXIgZDIgPSBjcm9zc1Byb2R1Y3QodmUsIHYyKSAvIGtyb3NzOyAvLyB0YWtlIHRoZSBhdmVyYWdlIG9mIHRoZSB0d28gY2FsY3VsYXRpb25zIHRvIG1pbmltaXplIHJvdW5kaW5nIGVycm9yXG5cbiAgICB2YXIgeDEgPSBwdDEueCArIGQyICogdjEueCxcbiAgICAgICAgeDIgPSBwdDIueCArIGQxICogdjIueDtcbiAgICB2YXIgeTEgPSBwdDEueSArIGQyICogdjEueSxcbiAgICAgICAgeTIgPSBwdDIueSArIGQxICogdjIueTtcbiAgICB2YXIgeCA9ICh4MSArIHgyKSAvIDI7XG4gICAgdmFyIHkgPSAoeTEgKyB5MikgLyAyO1xuICAgIHJldHVybiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH07XG4gIH07XG5cbiAgdmFyIFN3ZWVwRXZlbnQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIF9jcmVhdGVDbGFzcyhTd2VlcEV2ZW50LCBudWxsLCBbe1xuICAgICAga2V5OiBcImNvbXBhcmVcIixcbiAgICAgIC8vIGZvciBvcmRlcmluZyBzd2VlcCBldmVudHMgaW4gdGhlIHN3ZWVwIGV2ZW50IHF1ZXVlXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gICAgICAgIC8vIGZhdm9yIGV2ZW50IHdpdGggYSBwb2ludCB0aGF0IHRoZSBzd2VlcCBsaW5lIGhpdHMgZmlyc3RcbiAgICAgICAgdmFyIHB0Q21wID0gU3dlZXBFdmVudC5jb21wYXJlUG9pbnRzKGEucG9pbnQsIGIucG9pbnQpO1xuICAgICAgICBpZiAocHRDbXAgIT09IDApIHJldHVybiBwdENtcDsgLy8gdGhlIHBvaW50cyBhcmUgdGhlIHNhbWUsIHNvIGxpbmsgdGhlbSBpZiBuZWVkZWRcblxuICAgICAgICBpZiAoYS5wb2ludCAhPT0gYi5wb2ludCkgYS5saW5rKGIpOyAvLyBmYXZvciByaWdodCBldmVudHMgb3ZlciBsZWZ0XG5cbiAgICAgICAgaWYgKGEuaXNMZWZ0ICE9PSBiLmlzTGVmdCkgcmV0dXJuIGEuaXNMZWZ0ID8gMSA6IC0xOyAvLyB3ZSBoYXZlIHR3byBtYXRjaGluZyBsZWZ0IG9yIHJpZ2h0IGVuZHBvaW50c1xuICAgICAgICAvLyBvcmRlcmluZyBvZiB0aGlzIGNhc2UgaXMgdGhlIHNhbWUgYXMgZm9yIHRoZWlyIHNlZ21lbnRzXG5cbiAgICAgICAgcmV0dXJuIFNlZ21lbnQuY29tcGFyZShhLnNlZ21lbnQsIGIuc2VnbWVudCk7XG4gICAgICB9IC8vIGZvciBvcmRlcmluZyBwb2ludHMgaW4gc3dlZXAgbGluZSBvcmRlclxuXG4gICAgfSwge1xuICAgICAga2V5OiBcImNvbXBhcmVQb2ludHNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb21wYXJlUG9pbnRzKGFQdCwgYlB0KSB7XG4gICAgICAgIGlmIChhUHQueCA8IGJQdC54KSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhUHQueCA+IGJQdC54KSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGFQdC55IDwgYlB0LnkpIHJldHVybiAtMTtcbiAgICAgICAgaWYgKGFQdC55ID4gYlB0LnkpIHJldHVybiAxO1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gLy8gV2FybmluZzogJ3BvaW50JyBpbnB1dCB3aWxsIGJlIG1vZGlmaWVkIGFuZCByZS11c2VkIChmb3IgcGVyZm9ybWFuY2UpXG5cbiAgICB9XSk7XG5cbiAgICBmdW5jdGlvbiBTd2VlcEV2ZW50KHBvaW50LCBpc0xlZnQpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTd2VlcEV2ZW50KTtcblxuICAgICAgaWYgKHBvaW50LmV2ZW50cyA9PT0gdW5kZWZpbmVkKSBwb2ludC5ldmVudHMgPSBbdGhpc107ZWxzZSBwb2ludC5ldmVudHMucHVzaCh0aGlzKTtcbiAgICAgIHRoaXMucG9pbnQgPSBwb2ludDtcbiAgICAgIHRoaXMuaXNMZWZ0ID0gaXNMZWZ0OyAvLyB0aGlzLnNlZ21lbnQsIHRoaXMub3RoZXJTRSBzZXQgYnkgZmFjdG9yeVxuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhTd2VlcEV2ZW50LCBbe1xuICAgICAga2V5OiBcImxpbmtcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBsaW5rKG90aGVyKSB7XG4gICAgICAgIGlmIChvdGhlci5wb2ludCA9PT0gdGhpcy5wb2ludCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVHJpZWQgdG8gbGluayBhbHJlYWR5IGxpbmtlZCBldmVudHMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvdGhlckV2ZW50cyA9IG90aGVyLnBvaW50LmV2ZW50cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IG90aGVyRXZlbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBldnQgPSBvdGhlckV2ZW50c1tpXTtcbiAgICAgICAgICB0aGlzLnBvaW50LmV2ZW50cy5wdXNoKGV2dCk7XG4gICAgICAgICAgZXZ0LnBvaW50ID0gdGhpcy5wb2ludDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hlY2tGb3JDb25zdW1pbmcoKTtcbiAgICAgIH1cbiAgICAgIC8qIERvIGEgcGFzcyBvdmVyIG91ciBsaW5rZWQgZXZlbnRzIGFuZCBjaGVjayB0byBzZWUgaWYgYW55IHBhaXJcbiAgICAgICAqIG9mIHNlZ21lbnRzIG1hdGNoLCBhbmQgc2hvdWxkIGJlIGNvbnN1bWVkLiAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImNoZWNrRm9yQ29uc3VtaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2hlY2tGb3JDb25zdW1pbmcoKSB7XG4gICAgICAgIC8vIEZJWE1FOiBUaGUgbG9vcHMgaW4gdGhpcyBtZXRob2QgcnVuIE8obl4yKSA9PiBubyBnb29kLlxuICAgICAgICAvLyAgICAgICAgTWFpbnRhaW4gbGl0dGxlIG9yZGVyZWQgc3dlZXAgZXZlbnQgdHJlZXM/XG4gICAgICAgIC8vICAgICAgICBDYW4gd2UgbWFpbnRhaW5pbmcgYW4gb3JkZXJpbmcgdGhhdCBhdm9pZHMgdGhlIG5lZWRcbiAgICAgICAgLy8gICAgICAgIGZvciB0aGUgcmUtc29ydGluZyB3aXRoIGdldExlZnRtb3N0Q29tcGFyYXRvciBpbiBnZW9tLW91dD9cbiAgICAgICAgLy8gQ29tcGFyZSBlYWNoIHBhaXIgb2YgZXZlbnRzIHRvIHNlZSBpZiBvdGhlciBldmVudHMgYWxzbyBtYXRjaFxuICAgICAgICB2YXIgbnVtRXZlbnRzID0gdGhpcy5wb2ludC5ldmVudHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtRXZlbnRzOyBpKyspIHtcbiAgICAgICAgICB2YXIgZXZ0MSA9IHRoaXMucG9pbnQuZXZlbnRzW2ldO1xuICAgICAgICAgIGlmIChldnQxLnNlZ21lbnQuY29uc3VtZWRCeSAhPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSBpICsgMTsgaiA8IG51bUV2ZW50czsgaisrKSB7XG4gICAgICAgICAgICB2YXIgZXZ0MiA9IHRoaXMucG9pbnQuZXZlbnRzW2pdO1xuICAgICAgICAgICAgaWYgKGV2dDIuY29uc3VtZWRCeSAhPT0gdW5kZWZpbmVkKSBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChldnQxLm90aGVyU0UucG9pbnQuZXZlbnRzICE9PSBldnQyLm90aGVyU0UucG9pbnQuZXZlbnRzKSBjb250aW51ZTtcbiAgICAgICAgICAgIGV2dDEuc2VnbWVudC5jb25zdW1lKGV2dDIuc2VnbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImdldEF2YWlsYWJsZUxpbmtlZEV2ZW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEF2YWlsYWJsZUxpbmtlZEV2ZW50cygpIHtcbiAgICAgICAgLy8gcG9pbnQuZXZlbnRzIGlzIGFsd2F5cyBvZiBsZW5ndGggMiBvciBncmVhdGVyXG4gICAgICAgIHZhciBldmVudHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMucG9pbnQuZXZlbnRzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciBldnQgPSB0aGlzLnBvaW50LmV2ZW50c1tpXTtcblxuICAgICAgICAgIGlmIChldnQgIT09IHRoaXMgJiYgIWV2dC5zZWdtZW50LnJpbmdPdXQgJiYgZXZ0LnNlZ21lbnQuaXNJblJlc3VsdCgpKSB7XG4gICAgICAgICAgICBldmVudHMucHVzaChldnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBldmVudHM7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICAqIFJldHVybnMgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGZvciBzb3J0aW5nIGxpbmtlZCBldmVudHMgdGhhdCB3aWxsXG4gICAgICAgKiBmYXZvciB0aGUgZXZlbnQgdGhhdCB3aWxsIGdpdmUgdXMgdGhlIHNtYWxsZXN0IGxlZnQtc2lkZSBhbmdsZS5cbiAgICAgICAqIEFsbCByaW5nIGNvbnN0cnVjdGlvbiBzdGFydHMgYXMgbG93IGFzIHBvc3NpYmxlIGhlYWRpbmcgdG8gdGhlIHJpZ2h0LFxuICAgICAgICogc28gYnkgYWx3YXlzIHR1cm5pbmcgbGVmdCBhcyBzaGFycCBhcyBwb3NzaWJsZSB3ZSdsbCBnZXQgcG9seWdvbnNcbiAgICAgICAqIHdpdGhvdXQgdW5jZXNzYXJ5IGxvb3BzICYgaG9sZXMuXG4gICAgICAgKlxuICAgICAgICogVGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24gaGFzIGEgY29tcHV0ZSBjYWNoZSBzdWNoIHRoYXQgaXQgYXZvaWRzXG4gICAgICAgKiByZS1jb21wdXRpbmcgYWxyZWFkeS1jb21wdXRlZCB2YWx1ZXMuXG4gICAgICAgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRMZWZ0bW9zdENvbXBhcmF0b3JcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRMZWZ0bW9zdENvbXBhcmF0b3IoYmFzZUV2ZW50KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIGNhY2hlID0gbmV3IE1hcCgpO1xuXG4gICAgICAgIHZhciBmaWxsQ2FjaGUgPSBmdW5jdGlvbiBmaWxsQ2FjaGUobGlua2VkRXZlbnQpIHtcbiAgICAgICAgICB2YXIgbmV4dEV2ZW50ID0gbGlua2VkRXZlbnQub3RoZXJTRTtcbiAgICAgICAgICBjYWNoZS5zZXQobGlua2VkRXZlbnQsIHtcbiAgICAgICAgICAgIHNpbmU6IHNpbmVPZkFuZ2xlKF90aGlzLnBvaW50LCBiYXNlRXZlbnQucG9pbnQsIG5leHRFdmVudC5wb2ludCksXG4gICAgICAgICAgICBjb3NpbmU6IGNvc2luZU9mQW5nbGUoX3RoaXMucG9pbnQsIGJhc2VFdmVudC5wb2ludCwgbmV4dEV2ZW50LnBvaW50KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgIGlmICghY2FjaGUuaGFzKGEpKSBmaWxsQ2FjaGUoYSk7XG4gICAgICAgICAgaWYgKCFjYWNoZS5oYXMoYikpIGZpbGxDYWNoZShiKTtcblxuICAgICAgICAgIHZhciBfY2FjaGUkZ2V0ID0gY2FjaGUuZ2V0KGEpLFxuICAgICAgICAgICAgICBhc2luZSA9IF9jYWNoZSRnZXQuc2luZSxcbiAgICAgICAgICAgICAgYWNvc2luZSA9IF9jYWNoZSRnZXQuY29zaW5lO1xuXG4gICAgICAgICAgdmFyIF9jYWNoZSRnZXQyID0gY2FjaGUuZ2V0KGIpLFxuICAgICAgICAgICAgICBic2luZSA9IF9jYWNoZSRnZXQyLnNpbmUsXG4gICAgICAgICAgICAgIGJjb3NpbmUgPSBfY2FjaGUkZ2V0Mi5jb3NpbmU7IC8vIGJvdGggb24gb3IgYWJvdmUgeC1heGlzXG5cblxuICAgICAgICAgIGlmIChhc2luZSA+PSAwICYmIGJzaW5lID49IDApIHtcbiAgICAgICAgICAgIGlmIChhY29zaW5lIDwgYmNvc2luZSkgcmV0dXJuIDE7XG4gICAgICAgICAgICBpZiAoYWNvc2luZSA+IGJjb3NpbmUpIHJldHVybiAtMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0gLy8gYm90aCBiZWxvdyB4LWF4aXNcblxuXG4gICAgICAgICAgaWYgKGFzaW5lIDwgMCAmJiBic2luZSA8IDApIHtcbiAgICAgICAgICAgIGlmIChhY29zaW5lIDwgYmNvc2luZSkgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGFjb3NpbmUgPiBiY29zaW5lKSByZXR1cm4gMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgIH0gLy8gb25lIGFib3ZlIHgtYXhpcywgb25lIGJlbG93XG5cblxuICAgICAgICAgIGlmIChic2luZSA8IGFzaW5lKSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGJzaW5lID4gYXNpbmUpIHJldHVybiAxO1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBTd2VlcEV2ZW50O1xuICB9KCk7XG5cbiAgLy8gc2VnbWVudHMgYW5kIHN3ZWVwIGV2ZW50cyB3aGVuIGFsbCBlbHNlIGlzIGlkZW50aWNhbFxuXG4gIHZhciBzZWdtZW50SWQgPSAwO1xuXG4gIHZhciBTZWdtZW50ID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBfY3JlYXRlQ2xhc3MoU2VnbWVudCwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJjb21wYXJlXCIsXG5cbiAgICAgIC8qIFRoaXMgY29tcGFyZSgpIGZ1bmN0aW9uIGlzIGZvciBvcmRlcmluZyBzZWdtZW50cyBpbiB0aGUgc3dlZXBcbiAgICAgICAqIGxpbmUgdHJlZSwgYW5kIGRvZXMgc28gYWNjb3JkaW5nIHRvIHRoZSBmb2xsb3dpbmcgY3JpdGVyaWE6XG4gICAgICAgKlxuICAgICAgICogQ29uc2lkZXIgdGhlIHZlcnRpY2FsIGxpbmUgdGhhdCBsaWVzIGFuIGluZmluZXN0aW1hbCBzdGVwIHRvIHRoZVxuICAgICAgICogcmlnaHQgb2YgdGhlIHJpZ2h0LW1vcmUgb2YgdGhlIHR3byBsZWZ0IGVuZHBvaW50cyBvZiB0aGUgaW5wdXRcbiAgICAgICAqIHNlZ21lbnRzLiBJbWFnaW5lIHNsb3dseSBtb3ZpbmcgYSBwb2ludCB1cCBmcm9tIG5lZ2F0aXZlIGluZmluaXR5XG4gICAgICAgKiBpbiB0aGUgaW5jcmVhc2luZyB5IGRpcmVjdGlvbi4gV2hpY2ggb2YgdGhlIHR3byBzZWdtZW50cyB3aWxsIHRoYXRcbiAgICAgICAqIHBvaW50IGludGVyc2VjdCBmaXJzdD8gVGhhdCBzZWdtZW50IGNvbWVzICdiZWZvcmUnIHRoZSBvdGhlciBvbmUuXG4gICAgICAgKlxuICAgICAgICogSWYgbmVpdGhlciBzZWdtZW50IHdvdWxkIGJlIGludGVyc2VjdGVkIGJ5IHN1Y2ggYSBsaW5lLCAoaWYgb25lXG4gICAgICAgKiBvciBtb3JlIG9mIHRoZSBzZWdtZW50cyBhcmUgdmVydGljYWwpIHRoZW4gdGhlIGxpbmUgdG8gYmUgY29uc2lkZXJlZFxuICAgICAgICogaXMgZGlyZWN0bHkgb24gdGhlIHJpZ2h0LW1vcmUgb2YgdGhlIHR3byBsZWZ0IGlucHV0cy5cbiAgICAgICAqL1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICAgICAgICB2YXIgYWx4ID0gYS5sZWZ0U0UucG9pbnQueDtcbiAgICAgICAgdmFyIGJseCA9IGIubGVmdFNFLnBvaW50Lng7XG4gICAgICAgIHZhciBhcnggPSBhLnJpZ2h0U0UucG9pbnQueDtcbiAgICAgICAgdmFyIGJyeCA9IGIucmlnaHRTRS5wb2ludC54OyAvLyBjaGVjayBpZiB0aGV5J3JlIGV2ZW4gaW4gdGhlIHNhbWUgdmVydGljYWwgcGxhbmVcblxuICAgICAgICBpZiAoYnJ4IDwgYWx4KSByZXR1cm4gMTtcbiAgICAgICAgaWYgKGFyeCA8IGJseCkgcmV0dXJuIC0xO1xuICAgICAgICB2YXIgYWx5ID0gYS5sZWZ0U0UucG9pbnQueTtcbiAgICAgICAgdmFyIGJseSA9IGIubGVmdFNFLnBvaW50Lnk7XG4gICAgICAgIHZhciBhcnkgPSBhLnJpZ2h0U0UucG9pbnQueTtcbiAgICAgICAgdmFyIGJyeSA9IGIucmlnaHRTRS5wb2ludC55OyAvLyBpcyBsZWZ0IGVuZHBvaW50IG9mIHNlZ21lbnQgQiB0aGUgcmlnaHQtbW9yZT9cblxuICAgICAgICBpZiAoYWx4IDwgYmx4KSB7XG4gICAgICAgICAgLy8gYXJlIHRoZSB0d28gc2VnbWVudHMgaW4gdGhlIHNhbWUgaG9yaXpvbnRhbCBwbGFuZT9cbiAgICAgICAgICBpZiAoYmx5IDwgYWx5ICYmIGJseSA8IGFyeSkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGJseSA+IGFseSAmJiBibHkgPiBhcnkpIHJldHVybiAtMTsgLy8gaXMgdGhlIEIgbGVmdCBlbmRwb2ludCBjb2xpbmVhciB0byBzZWdtZW50IEE/XG5cbiAgICAgICAgICB2YXIgYUNtcEJMZWZ0ID0gYS5jb21wYXJlUG9pbnQoYi5sZWZ0U0UucG9pbnQpO1xuICAgICAgICAgIGlmIChhQ21wQkxlZnQgPCAwKSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoYUNtcEJMZWZ0ID4gMCkgcmV0dXJuIC0xOyAvLyBpcyB0aGUgQSByaWdodCBlbmRwb2ludCBjb2xpbmVhciB0byBzZWdtZW50IEIgP1xuXG4gICAgICAgICAgdmFyIGJDbXBBUmlnaHQgPSBiLmNvbXBhcmVQb2ludChhLnJpZ2h0U0UucG9pbnQpO1xuICAgICAgICAgIGlmIChiQ21wQVJpZ2h0ICE9PSAwKSByZXR1cm4gYkNtcEFSaWdodDsgLy8gY29saW5lYXIgc2VnbWVudHMsIGNvbnNpZGVyIHRoZSBvbmUgd2l0aCBsZWZ0LW1vcmVcbiAgICAgICAgICAvLyBsZWZ0IGVuZHBvaW50IHRvIGJlIGZpcnN0IChhcmJpdHJhcnk/KVxuXG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IC8vIGlzIGxlZnQgZW5kcG9pbnQgb2Ygc2VnbWVudCBBIHRoZSByaWdodC1tb3JlP1xuXG5cbiAgICAgICAgaWYgKGFseCA+IGJseCkge1xuICAgICAgICAgIGlmIChhbHkgPCBibHkgJiYgYWx5IDwgYnJ5KSByZXR1cm4gLTE7XG4gICAgICAgICAgaWYgKGFseSA+IGJseSAmJiBhbHkgPiBicnkpIHJldHVybiAxOyAvLyBpcyB0aGUgQSBsZWZ0IGVuZHBvaW50IGNvbGluZWFyIHRvIHNlZ21lbnQgQj9cblxuICAgICAgICAgIHZhciBiQ21wQUxlZnQgPSBiLmNvbXBhcmVQb2ludChhLmxlZnRTRS5wb2ludCk7XG4gICAgICAgICAgaWYgKGJDbXBBTGVmdCAhPT0gMCkgcmV0dXJuIGJDbXBBTGVmdDsgLy8gaXMgdGhlIEIgcmlnaHQgZW5kcG9pbnQgY29saW5lYXIgdG8gc2VnbWVudCBBP1xuXG4gICAgICAgICAgdmFyIGFDbXBCUmlnaHQgPSBhLmNvbXBhcmVQb2ludChiLnJpZ2h0U0UucG9pbnQpO1xuICAgICAgICAgIGlmIChhQ21wQlJpZ2h0IDwgMCkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGFDbXBCUmlnaHQgPiAwKSByZXR1cm4gLTE7IC8vIGNvbGluZWFyIHNlZ21lbnRzLCBjb25zaWRlciB0aGUgb25lIHdpdGggbGVmdC1tb3JlXG4gICAgICAgICAgLy8gbGVmdCBlbmRwb2ludCB0byBiZSBmaXJzdCAoYXJiaXRyYXJ5PylcblxuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IC8vIGlmIHdlIGdldCBoZXJlLCB0aGUgdHdvIGxlZnQgZW5kcG9pbnRzIGFyZSBpbiB0aGUgc2FtZVxuICAgICAgICAvLyB2ZXJ0aWNhbCBwbGFuZSwgaWUgYWx4ID09PSBibHhcbiAgICAgICAgLy8gY29uc2lkZXIgdGhlIGxvd2VyIGxlZnQtZW5kcG9pbnQgdG8gY29tZSBmaXJzdFxuXG5cbiAgICAgICAgaWYgKGFseSA8IGJseSkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYWx5ID4gYmx5KSByZXR1cm4gMTsgLy8gbGVmdCBlbmRwb2ludHMgYXJlIGlkZW50aWNhbFxuICAgICAgICAvLyBjaGVjayBmb3IgY29saW5lYXJpdHkgYnkgdXNpbmcgdGhlIGxlZnQtbW9yZSByaWdodCBlbmRwb2ludFxuICAgICAgICAvLyBpcyB0aGUgQSByaWdodCBlbmRwb2ludCBtb3JlIGxlZnQtbW9yZT9cblxuICAgICAgICBpZiAoYXJ4IDwgYnJ4KSB7XG4gICAgICAgICAgdmFyIF9iQ21wQVJpZ2h0ID0gYi5jb21wYXJlUG9pbnQoYS5yaWdodFNFLnBvaW50KTtcblxuICAgICAgICAgIGlmIChfYkNtcEFSaWdodCAhPT0gMCkgcmV0dXJuIF9iQ21wQVJpZ2h0O1xuICAgICAgICB9IC8vIGlzIHRoZSBCIHJpZ2h0IGVuZHBvaW50IG1vcmUgbGVmdC1tb3JlP1xuXG5cbiAgICAgICAgaWYgKGFyeCA+IGJyeCkge1xuICAgICAgICAgIHZhciBfYUNtcEJSaWdodCA9IGEuY29tcGFyZVBvaW50KGIucmlnaHRTRS5wb2ludCk7XG5cbiAgICAgICAgICBpZiAoX2FDbXBCUmlnaHQgPCAwKSByZXR1cm4gMTtcbiAgICAgICAgICBpZiAoX2FDbXBCUmlnaHQgPiAwKSByZXR1cm4gLTE7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJ4ICE9PSBicngpIHtcbiAgICAgICAgICAvLyBhcmUgdGhlc2UgdHdvIFthbG1vc3RdIHZlcnRpY2FsIHNlZ21lbnRzIHdpdGggb3Bwb3NpdGUgb3JpZW50YXRpb24/XG4gICAgICAgICAgLy8gaWYgc28sIHRoZSBvbmUgd2l0aCB0aGUgbG93ZXIgcmlnaHQgZW5kcG9pbnQgY29tZXMgZmlyc3RcbiAgICAgICAgICB2YXIgYXkgPSBhcnkgLSBhbHk7XG4gICAgICAgICAgdmFyIGF4ID0gYXJ4IC0gYWx4O1xuICAgICAgICAgIHZhciBieSA9IGJyeSAtIGJseTtcbiAgICAgICAgICB2YXIgYnggPSBicnggLSBibHg7XG4gICAgICAgICAgaWYgKGF5ID4gYXggJiYgYnkgPCBieCkgcmV0dXJuIDE7XG4gICAgICAgICAgaWYgKGF5IDwgYXggJiYgYnkgPiBieCkgcmV0dXJuIC0xO1xuICAgICAgICB9IC8vIHdlIGhhdmUgY29saW5lYXIgc2VnbWVudHMgd2l0aCBtYXRjaGluZyBvcmllbnRhdGlvblxuICAgICAgICAvLyBjb25zaWRlciB0aGUgb25lIHdpdGggbW9yZSBsZWZ0LW1vcmUgcmlnaHQgZW5kcG9pbnQgdG8gYmUgZmlyc3RcblxuXG4gICAgICAgIGlmIChhcnggPiBicngpIHJldHVybiAxO1xuICAgICAgICBpZiAoYXJ4IDwgYnJ4KSByZXR1cm4gLTE7IC8vIGlmIHdlIGdldCBoZXJlLCB0d28gdHdvIHJpZ2h0IGVuZHBvaW50cyBhcmUgaW4gdGhlIHNhbWVcbiAgICAgICAgLy8gdmVydGljYWwgcGxhbmUsIGllIGFyeCA9PT0gYnJ4XG4gICAgICAgIC8vIGNvbnNpZGVyIHRoZSBsb3dlciByaWdodC1lbmRwb2ludCB0byBjb21lIGZpcnN0XG5cbiAgICAgICAgaWYgKGFyeSA8IGJyeSkgcmV0dXJuIC0xO1xuICAgICAgICBpZiAoYXJ5ID4gYnJ5KSByZXR1cm4gMTsgLy8gcmlnaHQgZW5kcG9pbnRzIGlkZW50aWNhbCBhcyB3ZWxsLCBzbyB0aGUgc2VnbWVudHMgYXJlIGlkZW50aWFsXG4gICAgICAgIC8vIGZhbGwgYmFjayBvbiBjcmVhdGlvbiBvcmRlciBhcyBjb25zaXN0ZW50IHRpZS1icmVha2VyXG5cbiAgICAgICAgaWYgKGEuaWQgPCBiLmlkKSByZXR1cm4gLTE7XG4gICAgICAgIGlmIChhLmlkID4gYi5pZCkgcmV0dXJuIDE7IC8vIGlkZW50aWNhbCBzZWdtZW50LCBpZSBhID09PSBiXG5cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICAvKiBXYXJuaW5nOiBhIHJlZmVyZW5jZSB0byByaW5nV2luZGluZ3MgaW5wdXQgd2lsbCBiZSBzdG9yZWQsXG4gICAgICAgKiAgYW5kIHBvc3NpYmx5IHdpbGwgYmUgbGF0ZXIgbW9kaWZpZWQgKi9cblxuICAgIH1dKTtcblxuICAgIGZ1bmN0aW9uIFNlZ21lbnQobGVmdFNFLCByaWdodFNFLCByaW5ncywgd2luZGluZ3MpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBTZWdtZW50KTtcblxuICAgICAgdGhpcy5pZCA9ICsrc2VnbWVudElkO1xuICAgICAgdGhpcy5sZWZ0U0UgPSBsZWZ0U0U7XG4gICAgICBsZWZ0U0Uuc2VnbWVudCA9IHRoaXM7XG4gICAgICBsZWZ0U0Uub3RoZXJTRSA9IHJpZ2h0U0U7XG4gICAgICB0aGlzLnJpZ2h0U0UgPSByaWdodFNFO1xuICAgICAgcmlnaHRTRS5zZWdtZW50ID0gdGhpcztcbiAgICAgIHJpZ2h0U0Uub3RoZXJTRSA9IGxlZnRTRTtcbiAgICAgIHRoaXMucmluZ3MgPSByaW5ncztcbiAgICAgIHRoaXMud2luZGluZ3MgPSB3aW5kaW5nczsgLy8gbGVmdCB1bnNldCBmb3IgcGVyZm9ybWFuY2UsIHNldCBsYXRlciBpbiBhbGdvcml0aG1cbiAgICAgIC8vIHRoaXMucmluZ091dCwgdGhpcy5jb25zdW1lZEJ5LCB0aGlzLnByZXZcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoU2VnbWVudCwgW3tcbiAgICAgIGtleTogXCJyZXBsYWNlUmlnaHRTRVwiLFxuXG4gICAgICAvKiBXaGVuIGEgc2VnbWVudCBpcyBzcGxpdCwgdGhlIHJpZ2h0U0UgaXMgcmVwbGFjZWQgd2l0aCBhIG5ldyBzd2VlcCBldmVudCAqL1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJlcGxhY2VSaWdodFNFKG5ld1JpZ2h0U0UpIHtcbiAgICAgICAgdGhpcy5yaWdodFNFID0gbmV3UmlnaHRTRTtcbiAgICAgICAgdGhpcy5yaWdodFNFLnNlZ21lbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLnJpZ2h0U0Uub3RoZXJTRSA9IHRoaXMubGVmdFNFO1xuICAgICAgICB0aGlzLmxlZnRTRS5vdGhlclNFID0gdGhpcy5yaWdodFNFO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJiYm94XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmJveCgpIHtcbiAgICAgICAgdmFyIHkxID0gdGhpcy5sZWZ0U0UucG9pbnQueTtcbiAgICAgICAgdmFyIHkyID0gdGhpcy5yaWdodFNFLnBvaW50Lnk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGw6IHtcbiAgICAgICAgICAgIHg6IHRoaXMubGVmdFNFLnBvaW50LngsXG4gICAgICAgICAgICB5OiB5MSA8IHkyID8geTEgOiB5MlxuICAgICAgICAgIH0sXG4gICAgICAgICAgdXI6IHtcbiAgICAgICAgICAgIHg6IHRoaXMucmlnaHRTRS5wb2ludC54LFxuICAgICAgICAgICAgeTogeTEgPiB5MiA/IHkxIDogeTJcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICAvKiBBIHZlY3RvciBmcm9tIHRoZSBsZWZ0IHBvaW50IHRvIHRoZSByaWdodCAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInZlY3RvclwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHZlY3RvcigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB4OiB0aGlzLnJpZ2h0U0UucG9pbnQueCAtIHRoaXMubGVmdFNFLnBvaW50LngsXG4gICAgICAgICAgeTogdGhpcy5yaWdodFNFLnBvaW50LnkgLSB0aGlzLmxlZnRTRS5wb2ludC55XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImlzQW5FbmRwb2ludFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzQW5FbmRwb2ludChwdCkge1xuICAgICAgICByZXR1cm4gcHQueCA9PT0gdGhpcy5sZWZ0U0UucG9pbnQueCAmJiBwdC55ID09PSB0aGlzLmxlZnRTRS5wb2ludC55IHx8IHB0LnggPT09IHRoaXMucmlnaHRTRS5wb2ludC54ICYmIHB0LnkgPT09IHRoaXMucmlnaHRTRS5wb2ludC55O1xuICAgICAgfVxuICAgICAgLyogQ29tcGFyZSB0aGlzIHNlZ21lbnQgd2l0aCBhIHBvaW50LlxuICAgICAgICpcbiAgICAgICAqIEEgcG9pbnQgUCBpcyBjb25zaWRlcmVkIHRvIGJlIGNvbGluZWFyIHRvIGEgc2VnbWVudCBpZiB0aGVyZVxuICAgICAgICogZXhpc3RzIGEgZGlzdGFuY2UgRCBzdWNoIHRoYXQgaWYgd2UgdHJhdmVsIGFsb25nIHRoZSBzZWdtZW50XG4gICAgICAgKiBmcm9tIG9uZSAqIGVuZHBvaW50IHRvd2FyZHMgdGhlIG90aGVyIGEgZGlzdGFuY2UgRCwgd2UgZmluZFxuICAgICAgICogb3Vyc2VsdmVzIGF0IHBvaW50IFAuXG4gICAgICAgKlxuICAgICAgICogUmV0dXJuIHZhbHVlIGluZGljYXRlczpcbiAgICAgICAqXG4gICAgICAgKiAgIDE6IHBvaW50IGxpZXMgYWJvdmUgdGhlIHNlZ21lbnQgKHRvIHRoZSBsZWZ0IG9mIHZlcnRpY2FsKVxuICAgICAgICogICAwOiBwb2ludCBpcyBjb2xpbmVhciB0byBzZWdtZW50XG4gICAgICAgKiAgLTE6IHBvaW50IGxpZXMgYmVsb3cgdGhlIHNlZ21lbnQgKHRvIHRoZSByaWdodCBvZiB2ZXJ0aWNhbClcbiAgICAgICAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcImNvbXBhcmVQb2ludFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbXBhcmVQb2ludChwb2ludCkge1xuICAgICAgICBpZiAodGhpcy5pc0FuRW5kcG9pbnQocG9pbnQpKSByZXR1cm4gMDtcbiAgICAgICAgdmFyIGxQdCA9IHRoaXMubGVmdFNFLnBvaW50O1xuICAgICAgICB2YXIgclB0ID0gdGhpcy5yaWdodFNFLnBvaW50O1xuICAgICAgICB2YXIgdiA9IHRoaXMudmVjdG9yKCk7IC8vIEV4YWN0bHkgdmVydGljYWwgc2VnbWVudHMuXG5cbiAgICAgICAgaWYgKGxQdC54ID09PSByUHQueCkge1xuICAgICAgICAgIGlmIChwb2ludC54ID09PSBsUHQueCkgcmV0dXJuIDA7XG4gICAgICAgICAgcmV0dXJuIHBvaW50LnggPCBsUHQueCA/IDEgOiAtMTtcbiAgICAgICAgfSAvLyBOZWFybHkgdmVydGljYWwgc2VnbWVudHMgd2l0aCBhbiBpbnRlcnNlY3Rpb24uXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSB3aGVyZSBhIHBvaW50IG9uIHRoZSBsaW5lIHdpdGggbWF0Y2hpbmcgWSBjb29yZGluYXRlIGlzLlxuXG5cbiAgICAgICAgdmFyIHlEaXN0ID0gKHBvaW50LnkgLSBsUHQueSkgLyB2Lnk7XG4gICAgICAgIHZhciB4RnJvbVlEaXN0ID0gbFB0LnggKyB5RGlzdCAqIHYueDtcbiAgICAgICAgaWYgKHBvaW50LnggPT09IHhGcm9tWURpc3QpIHJldHVybiAwOyAvLyBHZW5lcmFsIGNhc2UuXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSB3aGVyZSBhIHBvaW50IG9uIHRoZSBsaW5lIHdpdGggbWF0Y2hpbmcgWCBjb29yZGluYXRlIGlzLlxuXG4gICAgICAgIHZhciB4RGlzdCA9IChwb2ludC54IC0gbFB0LngpIC8gdi54O1xuICAgICAgICB2YXIgeUZyb21YRGlzdCA9IGxQdC55ICsgeERpc3QgKiB2Lnk7XG4gICAgICAgIGlmIChwb2ludC55ID09PSB5RnJvbVhEaXN0KSByZXR1cm4gMDtcbiAgICAgICAgcmV0dXJuIHBvaW50LnkgPCB5RnJvbVhEaXN0ID8gLTEgOiAxO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAgKiBHaXZlbiBhbm90aGVyIHNlZ21lbnQsIHJldHVybnMgdGhlIGZpcnN0IG5vbi10cml2aWFsIGludGVyc2VjdGlvblxuICAgICAgICogYmV0d2VlbiB0aGUgdHdvIHNlZ21lbnRzIChpbiB0ZXJtcyBvZiBzd2VlcCBsaW5lIG9yZGVyaW5nKSwgaWYgaXQgZXhpc3RzLlxuICAgICAgICpcbiAgICAgICAqIEEgJ25vbi10cml2aWFsJyBpbnRlcnNlY3Rpb24gaXMgb25lIHRoYXQgd2lsbCBjYXVzZSBvbmUgb3IgYm90aCBvZiB0aGVcbiAgICAgICAqIHNlZ21lbnRzIHRvIGJlIHNwbGl0KCkuIEFzIHN1Y2gsICd0cml2aWFsJyB2cy4gJ25vbi10cml2aWFsJyBpbnRlcnNlY3Rpb246XG4gICAgICAgKlxuICAgICAgICogICAqIGVuZHBvaW50IG9mIHNlZ0Egd2l0aCBlbmRwb2ludCBvZiBzZWdCIC0tPiB0cml2aWFsXG4gICAgICAgKiAgICogZW5kcG9pbnQgb2Ygc2VnQSB3aXRoIHBvaW50IGFsb25nIHNlZ0IgLS0+IG5vbi10cml2aWFsXG4gICAgICAgKiAgICogZW5kcG9pbnQgb2Ygc2VnQiB3aXRoIHBvaW50IGFsb25nIHNlZ0EgLS0+IG5vbi10cml2aWFsXG4gICAgICAgKiAgICogcG9pbnQgYWxvbmcgc2VnQSB3aXRoIHBvaW50IGFsb25nIHNlZ0IgLS0+IG5vbi10cml2aWFsXG4gICAgICAgKlxuICAgICAgICogSWYgbm8gbm9uLXRyaXZpYWwgaW50ZXJzZWN0aW9uIGV4aXN0cywgcmV0dXJuIG51bGxcbiAgICAgICAqIEVsc2UsIHJldHVybiBudWxsLlxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiZ2V0SW50ZXJzZWN0aW9uXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0SW50ZXJzZWN0aW9uKG90aGVyKSB7XG4gICAgICAgIC8vIElmIGJib3hlcyBkb24ndCBvdmVybGFwLCB0aGVyZSBjYW4ndCBiZSBhbnkgaW50ZXJzZWN0aW9uc1xuICAgICAgICB2YXIgdEJib3ggPSB0aGlzLmJib3goKTtcbiAgICAgICAgdmFyIG9CYm94ID0gb3RoZXIuYmJveCgpO1xuICAgICAgICB2YXIgYmJveE92ZXJsYXAgPSBnZXRCYm94T3ZlcmxhcCh0QmJveCwgb0Jib3gpO1xuICAgICAgICBpZiAoYmJveE92ZXJsYXAgPT09IG51bGwpIHJldHVybiBudWxsOyAvLyBXZSBmaXJzdCBjaGVjayB0byBzZWUgaWYgdGhlIGVuZHBvaW50cyBjYW4gYmUgY29uc2lkZXJlZCBpbnRlcnNlY3Rpb25zLlxuICAgICAgICAvLyBUaGlzIHdpbGwgJ3NuYXAnIGludGVyc2VjdGlvbnMgdG8gZW5kcG9pbnRzIGlmIHBvc3NpYmxlLCBhbmQgd2lsbFxuICAgICAgICAvLyBoYW5kbGUgY2FzZXMgb2YgY29saW5lYXJpdHkuXG5cbiAgICAgICAgdmFyIHRscCA9IHRoaXMubGVmdFNFLnBvaW50O1xuICAgICAgICB2YXIgdHJwID0gdGhpcy5yaWdodFNFLnBvaW50O1xuICAgICAgICB2YXIgb2xwID0gb3RoZXIubGVmdFNFLnBvaW50O1xuICAgICAgICB2YXIgb3JwID0gb3RoZXIucmlnaHRTRS5wb2ludDsgLy8gZG9lcyBlYWNoIGVuZHBvaW50IHRvdWNoIHRoZSBvdGhlciBzZWdtZW50P1xuICAgICAgICAvLyBub3RlIHRoYXQgd2UgcmVzdHJpY3QgdGhlICd0b3VjaGluZycgZGVmaW5pdGlvbiB0byBvbmx5IGFsbG93IHNlZ21lbnRzXG4gICAgICAgIC8vIHRvIHRvdWNoIGVuZHBvaW50cyB0aGF0IGxpZSBmb3J3YXJkIGZyb20gd2hlcmUgd2UgYXJlIGluIHRoZSBzd2VlcCBsaW5lIHBhc3NcblxuICAgICAgICB2YXIgdG91Y2hlc090aGVyTFNFID0gaXNJbkJib3godEJib3gsIG9scCkgJiYgdGhpcy5jb21wYXJlUG9pbnQob2xwKSA9PT0gMDtcbiAgICAgICAgdmFyIHRvdWNoZXNUaGlzTFNFID0gaXNJbkJib3gob0Jib3gsIHRscCkgJiYgb3RoZXIuY29tcGFyZVBvaW50KHRscCkgPT09IDA7XG4gICAgICAgIHZhciB0b3VjaGVzT3RoZXJSU0UgPSBpc0luQmJveCh0QmJveCwgb3JwKSAmJiB0aGlzLmNvbXBhcmVQb2ludChvcnApID09PSAwO1xuICAgICAgICB2YXIgdG91Y2hlc1RoaXNSU0UgPSBpc0luQmJveChvQmJveCwgdHJwKSAmJiBvdGhlci5jb21wYXJlUG9pbnQodHJwKSA9PT0gMDsgLy8gZG8gbGVmdCBlbmRwb2ludHMgbWF0Y2g/XG5cbiAgICAgICAgaWYgKHRvdWNoZXNUaGlzTFNFICYmIHRvdWNoZXNPdGhlckxTRSkge1xuICAgICAgICAgIC8vIHRoZXNlIHR3byBjYXNlcyBhcmUgZm9yIGNvbGluZWFyIHNlZ21lbnRzIHdpdGggbWF0Y2hpbmcgbGVmdFxuICAgICAgICAgIC8vIGVuZHBvaW50cywgYW5kIG9uZSBzZWdtZW50IGJlaW5nIGxvbmdlciB0aGFuIHRoZSBvdGhlclxuICAgICAgICAgIGlmICh0b3VjaGVzVGhpc1JTRSAmJiAhdG91Y2hlc090aGVyUlNFKSByZXR1cm4gdHJwO1xuICAgICAgICAgIGlmICghdG91Y2hlc1RoaXNSU0UgJiYgdG91Y2hlc090aGVyUlNFKSByZXR1cm4gb3JwOyAvLyBlaXRoZXIgdGhlIHR3byBzZWdtZW50cyBtYXRjaCBleGFjdGx5ICh0d28gdHJpdmFsIGludGVyc2VjdGlvbnMpXG4gICAgICAgICAgLy8gb3IganVzdCBvbiB0aGVpciBsZWZ0IGVuZHBvaW50IChvbmUgdHJpdmlhbCBpbnRlcnNlY3Rpb25cblxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IC8vIGRvZXMgdGhpcyBsZWZ0IGVuZHBvaW50IG1hdGNoZXMgKG90aGVyIGRvZXNuJ3QpXG5cblxuICAgICAgICBpZiAodG91Y2hlc1RoaXNMU0UpIHtcbiAgICAgICAgICAvLyBjaGVjayBmb3Igc2VnbWVudHMgdGhhdCBqdXN0IGludGVyc2VjdCBvbiBvcHBvc2luZyBlbmRwb2ludHNcbiAgICAgICAgICBpZiAodG91Y2hlc090aGVyUlNFKSB7XG4gICAgICAgICAgICBpZiAodGxwLnggPT09IG9ycC54ICYmIHRscC55ID09PSBvcnAueSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfSAvLyB0LWludGVyc2VjdGlvbiBvbiBsZWZ0IGVuZHBvaW50XG5cblxuICAgICAgICAgIHJldHVybiB0bHA7XG4gICAgICAgIH0gLy8gZG9lcyBvdGhlciBsZWZ0IGVuZHBvaW50IG1hdGNoZXMgKHRoaXMgZG9lc24ndClcblxuXG4gICAgICAgIGlmICh0b3VjaGVzT3RoZXJMU0UpIHtcbiAgICAgICAgICAvLyBjaGVjayBmb3Igc2VnbWVudHMgdGhhdCBqdXN0IGludGVyc2VjdCBvbiBvcHBvc2luZyBlbmRwb2ludHNcbiAgICAgICAgICBpZiAodG91Y2hlc1RoaXNSU0UpIHtcbiAgICAgICAgICAgIGlmICh0cnAueCA9PT0gb2xwLnggJiYgdHJwLnkgPT09IG9scC55KSByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9IC8vIHQtaW50ZXJzZWN0aW9uIG9uIGxlZnQgZW5kcG9pbnRcblxuXG4gICAgICAgICAgcmV0dXJuIG9scDtcbiAgICAgICAgfSAvLyB0cml2aWFsIGludGVyc2VjdGlvbiBvbiByaWdodCBlbmRwb2ludHNcblxuXG4gICAgICAgIGlmICh0b3VjaGVzVGhpc1JTRSAmJiB0b3VjaGVzT3RoZXJSU0UpIHJldHVybiBudWxsOyAvLyB0LWludGVyc2VjdGlvbnMgb24ganVzdCBvbmUgcmlnaHQgZW5kcG9pbnRcblxuICAgICAgICBpZiAodG91Y2hlc1RoaXNSU0UpIHJldHVybiB0cnA7XG4gICAgICAgIGlmICh0b3VjaGVzT3RoZXJSU0UpIHJldHVybiBvcnA7IC8vIE5vbmUgb2Ygb3VyIGVuZHBvaW50cyBpbnRlcnNlY3QuIExvb2sgZm9yIGEgZ2VuZXJhbCBpbnRlcnNlY3Rpb24gYmV0d2VlblxuICAgICAgICAvLyBpbmZpbml0ZSBsaW5lcyBsYWlkIG92ZXIgdGhlIHNlZ21lbnRzXG5cbiAgICAgICAgdmFyIHB0ID0gaW50ZXJzZWN0aW9uKHRscCwgdGhpcy52ZWN0b3IoKSwgb2xwLCBvdGhlci52ZWN0b3IoKSk7IC8vIGFyZSB0aGUgc2VnbWVudHMgcGFycmFsbGVsPyBOb3RlIHRoYXQgaWYgdGhleSB3ZXJlIGNvbGluZWFyIHdpdGggb3ZlcmxhcCxcbiAgICAgICAgLy8gdGhleSB3b3VsZCBoYXZlIGFuIGVuZHBvaW50IGludGVyc2VjdGlvbiBhbmQgdGhhdCBjYXNlIHdhcyBhbHJlYWR5IGhhbmRsZWQgYWJvdmVcblxuICAgICAgICBpZiAocHQgPT09IG51bGwpIHJldHVybiBudWxsOyAvLyBpcyB0aGUgaW50ZXJzZWN0aW9uIGZvdW5kIGJldHdlZW4gdGhlIGxpbmVzIG5vdCBvbiB0aGUgc2VnbWVudHM/XG5cbiAgICAgICAgaWYgKCFpc0luQmJveChiYm94T3ZlcmxhcCwgcHQpKSByZXR1cm4gbnVsbDsgLy8gcm91bmQgdGhlIHRoZSBjb21wdXRlZCBwb2ludCBpZiBuZWVkZWRcblxuICAgICAgICByZXR1cm4gcm91bmRlci5yb3VuZChwdC54LCBwdC55KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgICogU3BsaXQgdGhlIGdpdmVuIHNlZ21lbnQgaW50byBtdWx0aXBsZSBzZWdtZW50cyBvbiB0aGUgZ2l2ZW4gcG9pbnRzLlxuICAgICAgICogICogRWFjaCBleGlzdGluZyBzZWdtZW50IHdpbGwgcmV0YWluIGl0cyBsZWZ0U0UgYW5kIGEgbmV3IHJpZ2h0U0Ugd2lsbCBiZVxuICAgICAgICogICAgZ2VuZXJhdGVkIGZvciBpdC5cbiAgICAgICAqICAqIEEgbmV3IHNlZ21lbnQgd2lsbCBiZSBnZW5lcmF0ZWQgd2hpY2ggd2lsbCBhZG9wdCB0aGUgb3JpZ2luYWwgc2VnbWVudCdzXG4gICAgICAgKiAgICByaWdodFNFLCBhbmQgYSBuZXcgbGVmdFNFIHdpbGwgYmUgZ2VuZXJhdGVkIGZvciBpdC5cbiAgICAgICAqICAqIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gdHdvIHBvaW50cyBnaXZlbiB0byBzcGxpdCBvbiwgbmV3IHNlZ21lbnRzXG4gICAgICAgKiAgICBpbiB0aGUgbWlkZGxlIHdpbGwgYmUgZ2VuZXJhdGVkIHdpdGggbmV3IGxlZnRTRSBhbmQgcmlnaHRTRSdzLlxuICAgICAgICogICogQW4gYXJyYXkgb2YgdGhlIG5ld2x5IGdlbmVyYXRlZCBTd2VlcEV2ZW50cyB3aWxsIGJlIHJldHVybmVkLlxuICAgICAgICpcbiAgICAgICAqIFdhcm5pbmc6IGlucHV0IGFycmF5IG9mIHBvaW50cyBpcyBtb2RpZmllZFxuICAgICAgICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwic3BsaXRcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBzcGxpdChwb2ludCkge1xuICAgICAgICB2YXIgbmV3RXZlbnRzID0gW107XG4gICAgICAgIHZhciBhbHJlYWR5TGlua2VkID0gcG9pbnQuZXZlbnRzICE9PSB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBuZXdMZWZ0U0UgPSBuZXcgU3dlZXBFdmVudChwb2ludCwgdHJ1ZSk7XG4gICAgICAgIHZhciBuZXdSaWdodFNFID0gbmV3IFN3ZWVwRXZlbnQocG9pbnQsIGZhbHNlKTtcbiAgICAgICAgdmFyIG9sZFJpZ2h0U0UgPSB0aGlzLnJpZ2h0U0U7XG4gICAgICAgIHRoaXMucmVwbGFjZVJpZ2h0U0UobmV3UmlnaHRTRSk7XG4gICAgICAgIG5ld0V2ZW50cy5wdXNoKG5ld1JpZ2h0U0UpO1xuICAgICAgICBuZXdFdmVudHMucHVzaChuZXdMZWZ0U0UpO1xuICAgICAgICB2YXIgbmV3U2VnID0gbmV3IFNlZ21lbnQobmV3TGVmdFNFLCBvbGRSaWdodFNFLCB0aGlzLnJpbmdzLnNsaWNlKCksIHRoaXMud2luZGluZ3Muc2xpY2UoKSk7IC8vIHdoZW4gc3BsaXR0aW5nIGEgbmVhcmx5IHZlcnRpY2FsIGRvd253YXJkLWZhY2luZyBzZWdtZW50LFxuICAgICAgICAvLyBzb21ldGltZXMgb25lIG9mIHRoZSByZXN1bHRpbmcgbmV3IHNlZ21lbnRzIGlzIHZlcnRpY2FsLCBpbiB3aGljaFxuICAgICAgICAvLyBjYXNlIGl0cyBsZWZ0IGFuZCByaWdodCBldmVudHMgbWF5IG5lZWQgdG8gYmUgc3dhcHBlZFxuXG4gICAgICAgIGlmIChTd2VlcEV2ZW50LmNvbXBhcmVQb2ludHMobmV3U2VnLmxlZnRTRS5wb2ludCwgbmV3U2VnLnJpZ2h0U0UucG9pbnQpID4gMCkge1xuICAgICAgICAgIG5ld1NlZy5zd2FwRXZlbnRzKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoU3dlZXBFdmVudC5jb21wYXJlUG9pbnRzKHRoaXMubGVmdFNFLnBvaW50LCB0aGlzLnJpZ2h0U0UucG9pbnQpID4gMCkge1xuICAgICAgICAgIHRoaXMuc3dhcEV2ZW50cygpO1xuICAgICAgICB9IC8vIGluIHRoZSBwb2ludCB3ZSBqdXN0IHVzZWQgdG8gY3JlYXRlIG5ldyBzd2VlcCBldmVudHMgd2l0aCB3YXMgYWxyZWFkeVxuICAgICAgICAvLyBsaW5rZWQgdG8gb3RoZXIgZXZlbnRzLCB3ZSBuZWVkIHRvIGNoZWNrIGlmIGVpdGhlciBvZiB0aGUgYWZmZWN0ZWRcbiAgICAgICAgLy8gc2VnbWVudHMgc2hvdWxkIGJlIGNvbnN1bWVkXG5cblxuICAgICAgICBpZiAoYWxyZWFkeUxpbmtlZCkge1xuICAgICAgICAgIG5ld0xlZnRTRS5jaGVja0ZvckNvbnN1bWluZygpO1xuICAgICAgICAgIG5ld1JpZ2h0U0UuY2hlY2tGb3JDb25zdW1pbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXdFdmVudHM7XG4gICAgICB9XG4gICAgICAvKiBTd2FwIHdoaWNoIGV2ZW50IGlzIGxlZnQgYW5kIHJpZ2h0ICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwic3dhcEV2ZW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHN3YXBFdmVudHMoKSB7XG4gICAgICAgIHZhciB0bXBFdnQgPSB0aGlzLnJpZ2h0U0U7XG4gICAgICAgIHRoaXMucmlnaHRTRSA9IHRoaXMubGVmdFNFO1xuICAgICAgICB0aGlzLmxlZnRTRSA9IHRtcEV2dDtcbiAgICAgICAgdGhpcy5sZWZ0U0UuaXNMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5yaWdodFNFLmlzTGVmdCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy53aW5kaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB0aGlzLndpbmRpbmdzW2ldICo9IC0xO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvKiBDb25zdW1lIGFub3RoZXIgc2VnbWVudC4gV2UgdGFrZSB0aGVpciByaW5ncyB1bmRlciBvdXIgd2luZ1xuICAgICAgICogYW5kIG1hcmsgdGhlbSBhcyBjb25zdW1lZC4gVXNlIGZvciBwZXJmZWN0bHkgb3ZlcmxhcHBpbmcgc2VnbWVudHMgKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJjb25zdW1lXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY29uc3VtZShvdGhlcikge1xuICAgICAgICB2YXIgY29uc3VtZXIgPSB0aGlzO1xuICAgICAgICB2YXIgY29uc3VtZWUgPSBvdGhlcjtcblxuICAgICAgICB3aGlsZSAoY29uc3VtZXIuY29uc3VtZWRCeSkge1xuICAgICAgICAgIGNvbnN1bWVyID0gY29uc3VtZXIuY29uc3VtZWRCeTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoaWxlIChjb25zdW1lZS5jb25zdW1lZEJ5KSB7XG4gICAgICAgICAgY29uc3VtZWUgPSBjb25zdW1lZS5jb25zdW1lZEJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNtcCA9IFNlZ21lbnQuY29tcGFyZShjb25zdW1lciwgY29uc3VtZWUpO1xuICAgICAgICBpZiAoY21wID09PSAwKSByZXR1cm47IC8vIGFscmVhZHkgY29uc3VtZWRcbiAgICAgICAgLy8gdGhlIHdpbm5lciBvZiB0aGUgY29uc3VtcHRpb24gaXMgdGhlIGVhcmxpZXIgc2VnbWVudFxuICAgICAgICAvLyBhY2NvcmRpbmcgdG8gc3dlZXAgbGluZSBvcmRlcmluZ1xuXG4gICAgICAgIGlmIChjbXAgPiAwKSB7XG4gICAgICAgICAgdmFyIHRtcCA9IGNvbnN1bWVyO1xuICAgICAgICAgIGNvbnN1bWVyID0gY29uc3VtZWU7XG4gICAgICAgICAgY29uc3VtZWUgPSB0bXA7XG4gICAgICAgIH0gLy8gbWFrZSBzdXJlIGEgc2VnbWVudCBkb2Vzbid0IGNvbnN1bWUgaXQncyBwcmV2XG5cblxuICAgICAgICBpZiAoY29uc3VtZXIucHJldiA9PT0gY29uc3VtZWUpIHtcbiAgICAgICAgICB2YXIgX3RtcCA9IGNvbnN1bWVyO1xuICAgICAgICAgIGNvbnN1bWVyID0gY29uc3VtZWU7XG4gICAgICAgICAgY29uc3VtZWUgPSBfdG1wO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBjb25zdW1lZS5yaW5ncy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgcmluZyA9IGNvbnN1bWVlLnJpbmdzW2ldO1xuICAgICAgICAgIHZhciB3aW5kaW5nID0gY29uc3VtZWUud2luZGluZ3NbaV07XG4gICAgICAgICAgdmFyIGluZGV4ID0gY29uc3VtZXIucmluZ3MuaW5kZXhPZihyaW5nKTtcblxuICAgICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNvbnN1bWVyLnJpbmdzLnB1c2gocmluZyk7XG4gICAgICAgICAgICBjb25zdW1lci53aW5kaW5ncy5wdXNoKHdpbmRpbmcpO1xuICAgICAgICAgIH0gZWxzZSBjb25zdW1lci53aW5kaW5nc1tpbmRleF0gKz0gd2luZGluZztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN1bWVlLnJpbmdzID0gbnVsbDtcbiAgICAgICAgY29uc3VtZWUud2luZGluZ3MgPSBudWxsO1xuICAgICAgICBjb25zdW1lZS5jb25zdW1lZEJ5ID0gY29uc3VtZXI7IC8vIG1hcmsgc3dlZXAgZXZlbnRzIGNvbnN1bWVkIGFzIHRvIG1haW50YWluIG9yZGVyaW5nIGluIHN3ZWVwIGV2ZW50IHF1ZXVlXG5cbiAgICAgICAgY29uc3VtZWUubGVmdFNFLmNvbnN1bWVkQnkgPSBjb25zdW1lci5sZWZ0U0U7XG4gICAgICAgIGNvbnN1bWVlLnJpZ2h0U0UuY29uc3VtZWRCeSA9IGNvbnN1bWVyLnJpZ2h0U0U7XG4gICAgICB9XG4gICAgICAvKiBUaGUgZmlyc3Qgc2VnbWVudCBwcmV2aW91cyBzZWdtZW50IGNoYWluIHRoYXQgaXMgaW4gdGhlIHJlc3VsdCAqL1xuXG4gICAgfSwge1xuICAgICAga2V5OiBcInByZXZJblJlc3VsdFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByZXZJblJlc3VsdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZJblJlc3VsdCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fcHJldkluUmVzdWx0O1xuICAgICAgICBpZiAoIXRoaXMucHJldikgdGhpcy5fcHJldkluUmVzdWx0ID0gbnVsbDtlbHNlIGlmICh0aGlzLnByZXYuaXNJblJlc3VsdCgpKSB0aGlzLl9wcmV2SW5SZXN1bHQgPSB0aGlzLnByZXY7ZWxzZSB0aGlzLl9wcmV2SW5SZXN1bHQgPSB0aGlzLnByZXYucHJldkluUmVzdWx0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9wcmV2SW5SZXN1bHQ7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImJlZm9yZVN0YXRlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYmVmb3JlU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLl9iZWZvcmVTdGF0ZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fYmVmb3JlU3RhdGU7XG4gICAgICAgIGlmICghdGhpcy5wcmV2KSB0aGlzLl9iZWZvcmVTdGF0ZSA9IHtcbiAgICAgICAgICByaW5nczogW10sXG4gICAgICAgICAgd2luZGluZ3M6IFtdLFxuICAgICAgICAgIG11bHRpUG9seXM6IFtdXG4gICAgICAgIH07ZWxzZSB7XG4gICAgICAgICAgdmFyIHNlZyA9IHRoaXMucHJldi5jb25zdW1lZEJ5IHx8IHRoaXMucHJldjtcbiAgICAgICAgICB0aGlzLl9iZWZvcmVTdGF0ZSA9IHNlZy5hZnRlclN0YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JlZm9yZVN0YXRlO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJhZnRlclN0YXRlXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWZ0ZXJTdGF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2FmdGVyU3RhdGUgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX2FmdGVyU3RhdGU7XG4gICAgICAgIHZhciBiZWZvcmVTdGF0ZSA9IHRoaXMuYmVmb3JlU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fYWZ0ZXJTdGF0ZSA9IHtcbiAgICAgICAgICByaW5nczogYmVmb3JlU3RhdGUucmluZ3Muc2xpY2UoMCksXG4gICAgICAgICAgd2luZGluZ3M6IGJlZm9yZVN0YXRlLndpbmRpbmdzLnNsaWNlKDApLFxuICAgICAgICAgIG11bHRpUG9seXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHZhciByaW5nc0FmdGVyID0gdGhpcy5fYWZ0ZXJTdGF0ZS5yaW5ncztcbiAgICAgICAgdmFyIHdpbmRpbmdzQWZ0ZXIgPSB0aGlzLl9hZnRlclN0YXRlLndpbmRpbmdzO1xuICAgICAgICB2YXIgbXBzQWZ0ZXIgPSB0aGlzLl9hZnRlclN0YXRlLm11bHRpUG9seXM7IC8vIGNhbGN1bGF0ZSByaW5nc0FmdGVyLCB3aW5kaW5nc0FmdGVyXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLnJpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciByaW5nID0gdGhpcy5yaW5nc1tpXTtcbiAgICAgICAgICB2YXIgd2luZGluZyA9IHRoaXMud2luZGluZ3NbaV07XG4gICAgICAgICAgdmFyIGluZGV4ID0gcmluZ3NBZnRlci5pbmRleE9mKHJpbmcpO1xuXG4gICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgcmluZ3NBZnRlci5wdXNoKHJpbmcpO1xuICAgICAgICAgICAgd2luZGluZ3NBZnRlci5wdXNoKHdpbmRpbmcpO1xuICAgICAgICAgIH0gZWxzZSB3aW5kaW5nc0FmdGVyW2luZGV4XSArPSB3aW5kaW5nO1xuICAgICAgICB9IC8vIGNhbGN1YWx0ZSBwb2x5c0FmdGVyXG5cblxuICAgICAgICB2YXIgcG9seXNBZnRlciA9IFtdO1xuICAgICAgICB2YXIgcG9seXNFeGNsdWRlID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfaU1heCA9IHJpbmdzQWZ0ZXIubGVuZ3RoOyBfaSA8IF9pTWF4OyBfaSsrKSB7XG4gICAgICAgICAgaWYgKHdpbmRpbmdzQWZ0ZXJbX2ldID09PSAwKSBjb250aW51ZTsgLy8gbm9uLXplcm8gcnVsZVxuXG4gICAgICAgICAgdmFyIF9yaW5nID0gcmluZ3NBZnRlcltfaV07XG4gICAgICAgICAgdmFyIHBvbHkgPSBfcmluZy5wb2x5O1xuICAgICAgICAgIGlmIChwb2x5c0V4Y2x1ZGUuaW5kZXhPZihwb2x5KSAhPT0gLTEpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChfcmluZy5pc0V4dGVyaW9yKSBwb2x5c0FmdGVyLnB1c2gocG9seSk7ZWxzZSB7XG4gICAgICAgICAgICBpZiAocG9seXNFeGNsdWRlLmluZGV4T2YocG9seSkgPT09IC0xKSBwb2x5c0V4Y2x1ZGUucHVzaChwb2x5KTtcblxuICAgICAgICAgICAgdmFyIF9pbmRleCA9IHBvbHlzQWZ0ZXIuaW5kZXhPZihfcmluZy5wb2x5KTtcblxuICAgICAgICAgICAgaWYgKF9pbmRleCAhPT0gLTEpIHBvbHlzQWZ0ZXIuc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vIGNhbGN1bGF0ZSBtdWx0aVBvbHlzQWZ0ZXJcblxuXG4gICAgICAgIGZvciAodmFyIF9pMiA9IDAsIF9pTWF4MiA9IHBvbHlzQWZ0ZXIubGVuZ3RoOyBfaTIgPCBfaU1heDI7IF9pMisrKSB7XG4gICAgICAgICAgdmFyIG1wID0gcG9seXNBZnRlcltfaTJdLm11bHRpUG9seTtcbiAgICAgICAgICBpZiAobXBzQWZ0ZXIuaW5kZXhPZihtcCkgPT09IC0xKSBtcHNBZnRlci5wdXNoKG1wKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9hZnRlclN0YXRlO1xuICAgICAgfVxuICAgICAgLyogSXMgdGhpcyBzZWdtZW50IHBhcnQgb2YgdGhlIGZpbmFsIHJlc3VsdD8gKi9cblxuICAgIH0sIHtcbiAgICAgIGtleTogXCJpc0luUmVzdWx0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gaXNJblJlc3VsdCgpIHtcbiAgICAgICAgLy8gaWYgd2UndmUgYmVlbiBjb25zdW1lZCwgd2UncmUgbm90IGluIHRoZSByZXN1bHRcbiAgICAgICAgaWYgKHRoaXMuY29uc3VtZWRCeSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZiAodGhpcy5faXNJblJlc3VsdCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5faXNJblJlc3VsdDtcbiAgICAgICAgdmFyIG1wc0JlZm9yZSA9IHRoaXMuYmVmb3JlU3RhdGUoKS5tdWx0aVBvbHlzO1xuICAgICAgICB2YXIgbXBzQWZ0ZXIgPSB0aGlzLmFmdGVyU3RhdGUoKS5tdWx0aVBvbHlzO1xuXG4gICAgICAgIHN3aXRjaCAob3BlcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICd1bmlvbic6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIFVOSU9OIC0gaW5jbHVkZWQgaWZmOlxuICAgICAgICAgICAgICAvLyAgKiBPbiBvbmUgc2lkZSBvZiB1cyB0aGVyZSBpcyAwIHBvbHkgaW50ZXJpb3JzIEFORFxuICAgICAgICAgICAgICAvLyAgKiBPbiB0aGUgb3RoZXIgc2lkZSB0aGVyZSBpcyAxIG9yIG1vcmUuXG4gICAgICAgICAgICAgIHZhciBub0JlZm9yZXMgPSBtcHNCZWZvcmUubGVuZ3RoID09PSAwO1xuICAgICAgICAgICAgICB2YXIgbm9BZnRlcnMgPSBtcHNBZnRlci5sZW5ndGggPT09IDA7XG4gICAgICAgICAgICAgIHRoaXMuX2lzSW5SZXN1bHQgPSBub0JlZm9yZXMgIT09IG5vQWZ0ZXJzO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2ludGVyc2VjdGlvbic6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vIElOVEVSU0VDVElPTiAtIGluY2x1ZGVkIGlmZjpcbiAgICAgICAgICAgICAgLy8gICogb24gb25lIHNpZGUgb2YgdXMgYWxsIG11bHRpcG9seXMgYXJlIHJlcC4gd2l0aCBwb2x5IGludGVyaW9ycyBBTkRcbiAgICAgICAgICAgICAgLy8gICogb24gdGhlIG90aGVyIHNpZGUgb2YgdXMsIG5vdCBhbGwgbXVsdGlwb2x5cyBhcmUgcmVwc2VudGVkXG4gICAgICAgICAgICAgIC8vICAgIHdpdGggcG9seSBpbnRlcmlvcnNcbiAgICAgICAgICAgICAgdmFyIGxlYXN0O1xuICAgICAgICAgICAgICB2YXIgbW9zdDtcblxuICAgICAgICAgICAgICBpZiAobXBzQmVmb3JlLmxlbmd0aCA8IG1wc0FmdGVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxlYXN0ID0gbXBzQmVmb3JlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBtb3N0ID0gbXBzQWZ0ZXIubGVuZ3RoO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxlYXN0ID0gbXBzQWZ0ZXIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIG1vc3QgPSBtcHNCZWZvcmUubGVuZ3RoO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5faXNJblJlc3VsdCA9IG1vc3QgPT09IG9wZXJhdGlvbi5udW1NdWx0aVBvbHlzICYmIGxlYXN0IDwgbW9zdDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICd4b3InOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBYT1IgLSBpbmNsdWRlZCBpZmY6XG4gICAgICAgICAgICAgIC8vICAqIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIG51bWJlciBvZiBtdWx0aXBvbHlzIHJlcHJlc2VudGVkXG4gICAgICAgICAgICAgIC8vICAgIHdpdGggcG9seSBpbnRlcmlvcnMgb24gb3VyIHR3byBzaWRlcyBpcyBhbiBvZGQgbnVtYmVyXG4gICAgICAgICAgICAgIHZhciBkaWZmID0gTWF0aC5hYnMobXBzQmVmb3JlLmxlbmd0aCAtIG1wc0FmdGVyLmxlbmd0aCk7XG4gICAgICAgICAgICAgIHRoaXMuX2lzSW5SZXN1bHQgPSBkaWZmICUgMiA9PT0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdkaWZmZXJlbmNlJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gRElGRkVSRU5DRSBpbmNsdWRlZCBpZmY6XG4gICAgICAgICAgICAgIC8vICAqIG9uIGV4YWN0bHkgb25lIHNpZGUsIHdlIGhhdmUganVzdCB0aGUgc3ViamVjdFxuICAgICAgICAgICAgICB2YXIgaXNKdXN0U3ViamVjdCA9IGZ1bmN0aW9uIGlzSnVzdFN1YmplY3QobXBzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1wcy5sZW5ndGggPT09IDEgJiYgbXBzWzBdLmlzU3ViamVjdDtcbiAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICB0aGlzLl9pc0luUmVzdWx0ID0gaXNKdXN0U3ViamVjdChtcHNCZWZvcmUpICE9PSBpc0p1c3RTdWJqZWN0KG1wc0FmdGVyKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVW5yZWNvZ25pemVkIG9wZXJhdGlvbiB0eXBlIGZvdW5kIFwiLmNvbmNhdChvcGVyYXRpb24udHlwZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSW5SZXN1bHQ7XG4gICAgICB9XG4gICAgfV0sIFt7XG4gICAgICBrZXk6IFwiZnJvbVJpbmdcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBmcm9tUmluZyhwdDEsIHB0MiwgcmluZykge1xuICAgICAgICB2YXIgbGVmdFB0LCByaWdodFB0LCB3aW5kaW5nOyAvLyBvcmRlcmluZyB0aGUgdHdvIHBvaW50cyBhY2NvcmRpbmcgdG8gc3dlZXAgbGluZSBvcmRlcmluZ1xuXG4gICAgICAgIHZhciBjbXBQdHMgPSBTd2VlcEV2ZW50LmNvbXBhcmVQb2ludHMocHQxLCBwdDIpO1xuXG4gICAgICAgIGlmIChjbXBQdHMgPCAwKSB7XG4gICAgICAgICAgbGVmdFB0ID0gcHQxO1xuICAgICAgICAgIHJpZ2h0UHQgPSBwdDI7XG4gICAgICAgICAgd2luZGluZyA9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAoY21wUHRzID4gMCkge1xuICAgICAgICAgIGxlZnRQdCA9IHB0MjtcbiAgICAgICAgICByaWdodFB0ID0gcHQxO1xuICAgICAgICAgIHdpbmRpbmcgPSAtMTtcbiAgICAgICAgfSBlbHNlIHRocm93IG5ldyBFcnJvcihcIlRyaWVkIHRvIGNyZWF0ZSBkZWdlbmVyYXRlIHNlZ21lbnQgYXQgW1wiLmNvbmNhdChwdDEueCwgXCIsIFwiKS5jb25jYXQocHQxLnksIFwiXVwiKSk7XG5cbiAgICAgICAgdmFyIGxlZnRTRSA9IG5ldyBTd2VlcEV2ZW50KGxlZnRQdCwgdHJ1ZSk7XG4gICAgICAgIHZhciByaWdodFNFID0gbmV3IFN3ZWVwRXZlbnQocmlnaHRQdCwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gbmV3IFNlZ21lbnQobGVmdFNFLCByaWdodFNFLCBbcmluZ10sIFt3aW5kaW5nXSk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFNlZ21lbnQ7XG4gIH0oKTtcblxuICB2YXIgUmluZ0luID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSaW5nSW4oZ2VvbVJpbmcsIHBvbHksIGlzRXh0ZXJpb3IpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBSaW5nSW4pO1xuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2VvbVJpbmcpIHx8IGdlb21SaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGdlb21ldHJ5IGlzIG5vdCBhIHZhbGlkIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucG9seSA9IHBvbHk7XG4gICAgICB0aGlzLmlzRXh0ZXJpb3IgPSBpc0V4dGVyaW9yO1xuICAgICAgdGhpcy5zZWdtZW50cyA9IFtdO1xuXG4gICAgICBpZiAodHlwZW9mIGdlb21SaW5nWzBdWzBdICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgZ2VvbVJpbmdbMF1bMV0gIT09ICdudW1iZXInKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZ2VvbWV0cnkgaXMgbm90IGEgdmFsaWQgUG9seWdvbiBvciBNdWx0aVBvbHlnb24nKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZpcnN0UG9pbnQgPSByb3VuZGVyLnJvdW5kKGdlb21SaW5nWzBdWzBdLCBnZW9tUmluZ1swXVsxXSk7XG4gICAgICB0aGlzLmJib3ggPSB7XG4gICAgICAgIGxsOiB7XG4gICAgICAgICAgeDogZmlyc3RQb2ludC54LFxuICAgICAgICAgIHk6IGZpcnN0UG9pbnQueVxuICAgICAgICB9LFxuICAgICAgICB1cjoge1xuICAgICAgICAgIHg6IGZpcnN0UG9pbnQueCxcbiAgICAgICAgICB5OiBmaXJzdFBvaW50LnlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHZhciBwcmV2UG9pbnQgPSBmaXJzdFBvaW50O1xuXG4gICAgICBmb3IgKHZhciBpID0gMSwgaU1heCA9IGdlb21SaW5nLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICBpZiAodHlwZW9mIGdlb21SaW5nW2ldWzBdICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgZ2VvbVJpbmdbaV1bMV0gIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dCBnZW9tZXRyeSBpcyBub3QgYSB2YWxpZCBQb2x5Z29uIG9yIE11bHRpUG9seWdvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHBvaW50ID0gcm91bmRlci5yb3VuZChnZW9tUmluZ1tpXVswXSwgZ2VvbVJpbmdbaV1bMV0pOyAvLyBza2lwIHJlcGVhdGVkIHBvaW50c1xuXG4gICAgICAgIGlmIChwb2ludC54ID09PSBwcmV2UG9pbnQueCAmJiBwb2ludC55ID09PSBwcmV2UG9pbnQueSkgY29udGludWU7XG4gICAgICAgIHRoaXMuc2VnbWVudHMucHVzaChTZWdtZW50LmZyb21SaW5nKHByZXZQb2ludCwgcG9pbnQsIHRoaXMpKTtcbiAgICAgICAgaWYgKHBvaW50LnggPCB0aGlzLmJib3gubGwueCkgdGhpcy5iYm94LmxsLnggPSBwb2ludC54O1xuICAgICAgICBpZiAocG9pbnQueSA8IHRoaXMuYmJveC5sbC55KSB0aGlzLmJib3gubGwueSA9IHBvaW50Lnk7XG4gICAgICAgIGlmIChwb2ludC54ID4gdGhpcy5iYm94LnVyLngpIHRoaXMuYmJveC51ci54ID0gcG9pbnQueDtcbiAgICAgICAgaWYgKHBvaW50LnkgPiB0aGlzLmJib3gudXIueSkgdGhpcy5iYm94LnVyLnkgPSBwb2ludC55O1xuICAgICAgICBwcmV2UG9pbnQgPSBwb2ludDtcbiAgICAgIH0gLy8gYWRkIHNlZ21lbnQgZnJvbSBsYXN0IHRvIGZpcnN0IGlmIGxhc3QgaXMgbm90IHRoZSBzYW1lIGFzIGZpcnN0XG5cblxuICAgICAgaWYgKGZpcnN0UG9pbnQueCAhPT0gcHJldlBvaW50LnggfHwgZmlyc3RQb2ludC55ICE9PSBwcmV2UG9pbnQueSkge1xuICAgICAgICB0aGlzLnNlZ21lbnRzLnB1c2goU2VnbWVudC5mcm9tUmluZyhwcmV2UG9pbnQsIGZpcnN0UG9pbnQsIHRoaXMpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUmluZ0luLCBbe1xuICAgICAga2V5OiBcImdldFN3ZWVwRXZlbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3dlZXBFdmVudHMoKSB7XG4gICAgICAgIHZhciBzd2VlcEV2ZW50cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5zZWdtZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgc2VnbWVudCA9IHRoaXMuc2VnbWVudHNbaV07XG4gICAgICAgICAgc3dlZXBFdmVudHMucHVzaChzZWdtZW50LmxlZnRTRSk7XG4gICAgICAgICAgc3dlZXBFdmVudHMucHVzaChzZWdtZW50LnJpZ2h0U0UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN3ZWVwRXZlbnRzO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBSaW5nSW47XG4gIH0oKTtcbiAgdmFyIFBvbHlJbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUG9seUluKGdlb21Qb2x5LCBtdWx0aVBvbHkpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBQb2x5SW4pO1xuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2VvbVBvbHkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW5wdXQgZ2VvbWV0cnkgaXMgbm90IGEgdmFsaWQgUG9seWdvbiBvciBNdWx0aVBvbHlnb24nKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5leHRlcmlvclJpbmcgPSBuZXcgUmluZ0luKGdlb21Qb2x5WzBdLCB0aGlzLCB0cnVlKTsgLy8gY29weSBieSB2YWx1ZVxuXG4gICAgICB0aGlzLmJib3ggPSB7XG4gICAgICAgIGxsOiB7XG4gICAgICAgICAgeDogdGhpcy5leHRlcmlvclJpbmcuYmJveC5sbC54LFxuICAgICAgICAgIHk6IHRoaXMuZXh0ZXJpb3JSaW5nLmJib3gubGwueVxuICAgICAgICB9LFxuICAgICAgICB1cjoge1xuICAgICAgICAgIHg6IHRoaXMuZXh0ZXJpb3JSaW5nLmJib3gudXIueCxcbiAgICAgICAgICB5OiB0aGlzLmV4dGVyaW9yUmluZy5iYm94LnVyLnlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHRoaXMuaW50ZXJpb3JSaW5ncyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMSwgaU1heCA9IGdlb21Qb2x5Lmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICB2YXIgcmluZyA9IG5ldyBSaW5nSW4oZ2VvbVBvbHlbaV0sIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgaWYgKHJpbmcuYmJveC5sbC54IDwgdGhpcy5iYm94LmxsLngpIHRoaXMuYmJveC5sbC54ID0gcmluZy5iYm94LmxsLng7XG4gICAgICAgIGlmIChyaW5nLmJib3gubGwueSA8IHRoaXMuYmJveC5sbC55KSB0aGlzLmJib3gubGwueSA9IHJpbmcuYmJveC5sbC55O1xuICAgICAgICBpZiAocmluZy5iYm94LnVyLnggPiB0aGlzLmJib3gudXIueCkgdGhpcy5iYm94LnVyLnggPSByaW5nLmJib3gudXIueDtcbiAgICAgICAgaWYgKHJpbmcuYmJveC51ci55ID4gdGhpcy5iYm94LnVyLnkpIHRoaXMuYmJveC51ci55ID0gcmluZy5iYm94LnVyLnk7XG4gICAgICAgIHRoaXMuaW50ZXJpb3JSaW5ncy5wdXNoKHJpbmcpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm11bHRpUG9seSA9IG11bHRpUG9seTtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoUG9seUluLCBbe1xuICAgICAga2V5OiBcImdldFN3ZWVwRXZlbnRzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U3dlZXBFdmVudHMoKSB7XG4gICAgICAgIHZhciBzd2VlcEV2ZW50cyA9IHRoaXMuZXh0ZXJpb3JSaW5nLmdldFN3ZWVwRXZlbnRzKCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSB0aGlzLmludGVyaW9yUmluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJpbmdTd2VlcEV2ZW50cyA9IHRoaXMuaW50ZXJpb3JSaW5nc1tpXS5nZXRTd2VlcEV2ZW50cygpO1xuXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpNYXggPSByaW5nU3dlZXBFdmVudHMubGVuZ3RoOyBqIDwgak1heDsgaisrKSB7XG4gICAgICAgICAgICBzd2VlcEV2ZW50cy5wdXNoKHJpbmdTd2VlcEV2ZW50c1tqXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN3ZWVwRXZlbnRzO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBQb2x5SW47XG4gIH0oKTtcbiAgdmFyIE11bHRpUG9seUluID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBNdWx0aVBvbHlJbihnZW9tLCBpc1N1YmplY3QpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNdWx0aVBvbHlJbik7XG5cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShnZW9tKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGdlb21ldHJ5IGlzIG5vdCBhIHZhbGlkIFBvbHlnb24gb3IgTXVsdGlQb2x5Z29uJyk7XG4gICAgICB9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGlmIHRoZSBpbnB1dCBsb29rcyBsaWtlIGEgcG9seWdvbiwgY29udmVydCBpdCB0byBhIG11bHRpcG9seWdvblxuICAgICAgICBpZiAodHlwZW9mIGdlb21bMF1bMF1bMF0gPT09ICdudW1iZXInKSBnZW9tID0gW2dlb21dO1xuICAgICAgfSBjYXRjaCAoZXgpIHsvLyBUaGUgaW5wdXQgaXMgZWl0aGVyIG1hbGZvcm1lZCBvciBoYXMgZW1wdHkgYXJyYXlzLlxuICAgICAgICAvLyBJbiBlaXRoZXIgY2FzZSwgaXQgd2lsbCBiZSBoYW5kbGVkIGxhdGVyIG9uLlxuICAgICAgfVxuXG4gICAgICB0aGlzLnBvbHlzID0gW107XG4gICAgICB0aGlzLmJib3ggPSB7XG4gICAgICAgIGxsOiB7XG4gICAgICAgICAgeDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgIHk6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWVxuICAgICAgICB9LFxuICAgICAgICB1cjoge1xuICAgICAgICAgIHg6IE51bWJlci5ORUdBVElWRV9JTkZJTklUWSxcbiAgICAgICAgICB5OiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFlcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBnZW9tLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICB2YXIgcG9seSA9IG5ldyBQb2x5SW4oZ2VvbVtpXSwgdGhpcyk7XG4gICAgICAgIGlmIChwb2x5LmJib3gubGwueCA8IHRoaXMuYmJveC5sbC54KSB0aGlzLmJib3gubGwueCA9IHBvbHkuYmJveC5sbC54O1xuICAgICAgICBpZiAocG9seS5iYm94LmxsLnkgPCB0aGlzLmJib3gubGwueSkgdGhpcy5iYm94LmxsLnkgPSBwb2x5LmJib3gubGwueTtcbiAgICAgICAgaWYgKHBvbHkuYmJveC51ci54ID4gdGhpcy5iYm94LnVyLngpIHRoaXMuYmJveC51ci54ID0gcG9seS5iYm94LnVyLng7XG4gICAgICAgIGlmIChwb2x5LmJib3gudXIueSA+IHRoaXMuYmJveC51ci55KSB0aGlzLmJib3gudXIueSA9IHBvbHkuYmJveC51ci55O1xuICAgICAgICB0aGlzLnBvbHlzLnB1c2gocG9seSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNTdWJqZWN0ID0gaXNTdWJqZWN0O1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhNdWx0aVBvbHlJbiwgW3tcbiAgICAgIGtleTogXCJnZXRTd2VlcEV2ZW50c1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldFN3ZWVwRXZlbnRzKCkge1xuICAgICAgICB2YXIgc3dlZXBFdmVudHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMucG9seXMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBvbHlTd2VlcEV2ZW50cyA9IHRoaXMucG9seXNbaV0uZ2V0U3dlZXBFdmVudHMoKTtcblxuICAgICAgICAgIGZvciAodmFyIGogPSAwLCBqTWF4ID0gcG9seVN3ZWVwRXZlbnRzLmxlbmd0aDsgaiA8IGpNYXg7IGorKykge1xuICAgICAgICAgICAgc3dlZXBFdmVudHMucHVzaChwb2x5U3dlZXBFdmVudHNbal0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzd2VlcEV2ZW50cztcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gTXVsdGlQb2x5SW47XG4gIH0oKTtcblxuICB2YXIgUmluZ091dCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgX2NyZWF0ZUNsYXNzKFJpbmdPdXQsIG51bGwsIFt7XG4gICAgICBrZXk6IFwiZmFjdG9yeVwiLFxuXG4gICAgICAvKiBHaXZlbiB0aGUgc2VnbWVudHMgZnJvbSB0aGUgc3dlZXAgbGluZSBwYXNzLCBjb21wdXRlICYgcmV0dXJuIGEgc2VyaWVzXG4gICAgICAgKiBvZiBjbG9zZWQgcmluZ3MgZnJvbSBhbGwgdGhlIHNlZ21lbnRzIG1hcmtlZCB0byBiZSBwYXJ0IG9mIHRoZSByZXN1bHQgKi9cbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBmYWN0b3J5KGFsbFNlZ21lbnRzKSB7XG4gICAgICAgIHZhciByaW5nc091dCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gYWxsU2VnbWVudHMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNlZ21lbnQgPSBhbGxTZWdtZW50c1tpXTtcbiAgICAgICAgICBpZiAoIXNlZ21lbnQuaXNJblJlc3VsdCgpIHx8IHNlZ21lbnQucmluZ091dCkgY29udGludWU7XG4gICAgICAgICAgdmFyIHByZXZFdmVudCA9IG51bGw7XG4gICAgICAgICAgdmFyIGV2ZW50ID0gc2VnbWVudC5sZWZ0U0U7XG4gICAgICAgICAgdmFyIG5leHRFdmVudCA9IHNlZ21lbnQucmlnaHRTRTtcbiAgICAgICAgICB2YXIgZXZlbnRzID0gW2V2ZW50XTtcbiAgICAgICAgICB2YXIgc3RhcnRpbmdQb2ludCA9IGV2ZW50LnBvaW50O1xuICAgICAgICAgIHZhciBpbnRlcnNlY3Rpb25MRXMgPSBbXTtcbiAgICAgICAgICAvKiBXYWxrIHRoZSBjaGFpbiBvZiBsaW5rZWQgZXZlbnRzIHRvIGZvcm0gYSBjbG9zZWQgcmluZyAqL1xuXG4gICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHByZXZFdmVudCA9IGV2ZW50O1xuICAgICAgICAgICAgZXZlbnQgPSBuZXh0RXZlbnQ7XG4gICAgICAgICAgICBldmVudHMucHVzaChldmVudCk7XG4gICAgICAgICAgICAvKiBJcyB0aGUgcmluZyBjb21wbGV0ZT8gKi9cblxuICAgICAgICAgICAgaWYgKGV2ZW50LnBvaW50ID09PSBzdGFydGluZ1BvaW50KSBicmVhaztcblxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgdmFyIGF2YWlsYWJsZUxFcyA9IGV2ZW50LmdldEF2YWlsYWJsZUxpbmtlZEV2ZW50cygpO1xuICAgICAgICAgICAgICAvKiBEaWQgd2UgaGl0IGEgZGVhZCBlbmQ/IFRoaXMgc2hvdWxkbid0IGhhcHBlbi4gSW5kaWNhdGVzIHNvbWUgZWFybGllclxuICAgICAgICAgICAgICAgKiBwYXJ0IG9mIHRoZSBhbGdvcml0aG0gbWFsZnVuY3Rpb25lZC4uLiBwbGVhc2UgZmlsZSBhIGJ1ZyByZXBvcnQuICovXG5cbiAgICAgICAgICAgICAgaWYgKGF2YWlsYWJsZUxFcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgZmlyc3RQdCA9IGV2ZW50c1swXS5wb2ludDtcbiAgICAgICAgICAgICAgICB2YXIgbGFzdFB0ID0gZXZlbnRzW2V2ZW50cy5sZW5ndGggLSAxXS5wb2ludDtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gY29tcGxldGUgb3V0cHV0IHJpbmcgc3RhcnRpbmcgYXQgW1wiLmNvbmNhdChmaXJzdFB0LngsIFwiLFwiKSArIFwiIFwiLmNvbmNhdChmaXJzdFB0LnksIFwiXS4gTGFzdCBtYXRjaGluZyBzZWdtZW50IGZvdW5kIGVuZHMgYXRcIikgKyBcIiBbXCIuY29uY2F0KGxhc3RQdC54LCBcIiwgXCIpLmNvbmNhdChsYXN0UHQueSwgXCJdLlwiKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgLyogT25seSBvbmUgd2F5IHRvIGdvLCBzbyBjb3RpbnVlIG9uIHRoZSBwYXRoICovXG5cblxuICAgICAgICAgICAgICBpZiAoYXZhaWxhYmxlTEVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIG5leHRFdmVudCA9IGF2YWlsYWJsZUxFc1swXS5vdGhlclNFO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8qIFdlIG11c3QgaGF2ZSBhbiBpbnRlcnNlY3Rpb24uIENoZWNrIGZvciBhIGNvbXBsZXRlZCBsb29wICovXG5cblxuICAgICAgICAgICAgICB2YXIgaW5kZXhMRSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGpNYXggPSBpbnRlcnNlY3Rpb25MRXMubGVuZ3RoOyBqIDwgak1heDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGludGVyc2VjdGlvbkxFc1tqXS5wb2ludCA9PT0gZXZlbnQucG9pbnQpIHtcbiAgICAgICAgICAgICAgICAgIGluZGV4TEUgPSBqO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8qIEZvdW5kIGEgY29tcGxldGVkIGxvb3AuIEN1dCB0aGF0IG9mZiBhbmQgbWFrZSBhIHJpbmcgKi9cblxuXG4gICAgICAgICAgICAgIGlmIChpbmRleExFICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdmFyIGludGVyc2VjdGlvbkxFID0gaW50ZXJzZWN0aW9uTEVzLnNwbGljZShpbmRleExFKVswXTtcbiAgICAgICAgICAgICAgICB2YXIgcmluZ0V2ZW50cyA9IGV2ZW50cy5zcGxpY2UoaW50ZXJzZWN0aW9uTEUuaW5kZXgpO1xuICAgICAgICAgICAgICAgIHJpbmdFdmVudHMudW5zaGlmdChyaW5nRXZlbnRzWzBdLm90aGVyU0UpO1xuICAgICAgICAgICAgICAgIHJpbmdzT3V0LnB1c2gobmV3IFJpbmdPdXQocmluZ0V2ZW50cy5yZXZlcnNlKCkpKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAvKiByZWdpc3RlciB0aGUgaW50ZXJzZWN0aW9uICovXG5cblxuICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25MRXMucHVzaCh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGV2ZW50cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgcG9pbnQ6IGV2ZW50LnBvaW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAvKiBDaG9vc2UgdGhlIGxlZnQtbW9zdCBvcHRpb24gdG8gY29udGludWUgdGhlIHdhbGsgKi9cblxuICAgICAgICAgICAgICB2YXIgY29tcGFyYXRvciA9IGV2ZW50LmdldExlZnRtb3N0Q29tcGFyYXRvcihwcmV2RXZlbnQpO1xuICAgICAgICAgICAgICBuZXh0RXZlbnQgPSBhdmFpbGFibGVMRXMuc29ydChjb21wYXJhdG9yKVswXS5vdGhlclNFO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByaW5nc091dC5wdXNoKG5ldyBSaW5nT3V0KGV2ZW50cykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJpbmdzT3V0O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIGZ1bmN0aW9uIFJpbmdPdXQoZXZlbnRzKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUmluZ091dCk7XG5cbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IGV2ZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgZXZlbnRzW2ldLnNlZ21lbnQucmluZ091dCA9IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucG9seSA9IG51bGw7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFJpbmdPdXQsIFt7XG4gICAgICBrZXk6IFwiZ2V0R2VvbVwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGdldEdlb20oKSB7XG4gICAgICAgIC8vIFJlbW92ZSBzdXBlcmZsdW91cyBwb2ludHMgKGllIGV4dHJhIHBvaW50cyBhbG9uZyBhIHN0cmFpZ2h0IGxpbmUpLFxuICAgICAgICB2YXIgcHJldlB0ID0gdGhpcy5ldmVudHNbMF0ucG9pbnQ7XG4gICAgICAgIHZhciBwb2ludHMgPSBbcHJldlB0XTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMSwgaU1heCA9IHRoaXMuZXZlbnRzLmxlbmd0aCAtIDE7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgX3B0ID0gdGhpcy5ldmVudHNbaV0ucG9pbnQ7XG4gICAgICAgICAgdmFyIF9uZXh0UHQgPSB0aGlzLmV2ZW50c1tpICsgMV0ucG9pbnQ7XG4gICAgICAgICAgaWYgKGNvbXBhcmVWZWN0b3JBbmdsZXMoX3B0LCBwcmV2UHQsIF9uZXh0UHQpID09PSAwKSBjb250aW51ZTtcbiAgICAgICAgICBwb2ludHMucHVzaChfcHQpO1xuICAgICAgICAgIHByZXZQdCA9IF9wdDtcbiAgICAgICAgfSAvLyByaW5nIHdhcyBhbGwgKHdpdGhpbiByb3VuZGluZyBlcnJvciBvZiBhbmdsZSBjYWxjKSBjb2xpbmVhciBwb2ludHNcblxuXG4gICAgICAgIGlmIChwb2ludHMubGVuZ3RoID09PSAxKSByZXR1cm4gbnVsbDsgLy8gY2hlY2sgaWYgdGhlIHN0YXJ0aW5nIHBvaW50IGlzIG5lY2Vzc2FyeVxuXG4gICAgICAgIHZhciBwdCA9IHBvaW50c1swXTtcbiAgICAgICAgdmFyIG5leHRQdCA9IHBvaW50c1sxXTtcbiAgICAgICAgaWYgKGNvbXBhcmVWZWN0b3JBbmdsZXMocHQsIHByZXZQdCwgbmV4dFB0KSA9PT0gMCkgcG9pbnRzLnNoaWZ0KCk7XG4gICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSk7XG4gICAgICAgIHZhciBzdGVwID0gdGhpcy5pc0V4dGVyaW9yUmluZygpID8gMSA6IC0xO1xuICAgICAgICB2YXIgaVN0YXJ0ID0gdGhpcy5pc0V4dGVyaW9yUmluZygpID8gMCA6IHBvaW50cy5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgaUVuZCA9IHRoaXMuaXNFeHRlcmlvclJpbmcoKSA/IHBvaW50cy5sZW5ndGggOiAtMTtcbiAgICAgICAgdmFyIG9yZGVyZWRQb2ludHMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBfaSA9IGlTdGFydDsgX2kgIT0gaUVuZDsgX2kgKz0gc3RlcCkge1xuICAgICAgICAgIG9yZGVyZWRQb2ludHMucHVzaChbcG9pbnRzW19pXS54LCBwb2ludHNbX2ldLnldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcmRlcmVkUG9pbnRzO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJpc0V4dGVyaW9yUmluZ1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGlzRXh0ZXJpb3JSaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5faXNFeHRlcmlvclJpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBlbmNsb3NpbmcgPSB0aGlzLmVuY2xvc2luZ1JpbmcoKTtcbiAgICAgICAgICB0aGlzLl9pc0V4dGVyaW9yUmluZyA9IGVuY2xvc2luZyA/ICFlbmNsb3NpbmcuaXNFeHRlcmlvclJpbmcoKSA6IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5faXNFeHRlcmlvclJpbmc7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcImVuY2xvc2luZ1JpbmdcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBlbmNsb3NpbmdSaW5nKCkge1xuICAgICAgICBpZiAodGhpcy5fZW5jbG9zaW5nUmluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5fZW5jbG9zaW5nUmluZyA9IHRoaXMuX2NhbGNFbmNsb3NpbmdSaW5nKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fZW5jbG9zaW5nUmluZztcbiAgICAgIH1cbiAgICAgIC8qIFJldHVybnMgdGhlIHJpbmcgdGhhdCBlbmNsb3NlcyB0aGlzIG9uZSwgaWYgYW55ICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX2NhbGNFbmNsb3NpbmdSaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX2NhbGNFbmNsb3NpbmdSaW5nKCkge1xuICAgICAgICAvLyBzdGFydCB3aXRoIHRoZSBlYWxpZXIgc3dlZXAgbGluZSBldmVudCBzbyB0aGF0IHRoZSBwcmV2U2VnXG4gICAgICAgIC8vIGNoYWluIGRvZXNuJ3QgbGVhZCB1cyBpbnNpZGUgb2YgYSBsb29wIG9mIG91cnNcbiAgICAgICAgdmFyIGxlZnRNb3N0RXZ0ID0gdGhpcy5ldmVudHNbMF07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDEsIGlNYXggPSB0aGlzLmV2ZW50cy5sZW5ndGg7IGkgPCBpTWF4OyBpKyspIHtcbiAgICAgICAgICB2YXIgZXZ0ID0gdGhpcy5ldmVudHNbaV07XG4gICAgICAgICAgaWYgKFN3ZWVwRXZlbnQuY29tcGFyZShsZWZ0TW9zdEV2dCwgZXZ0KSA+IDApIGxlZnRNb3N0RXZ0ID0gZXZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByZXZTZWcgPSBsZWZ0TW9zdEV2dC5zZWdtZW50LnByZXZJblJlc3VsdCgpO1xuICAgICAgICB2YXIgcHJldlByZXZTZWcgPSBwcmV2U2VnID8gcHJldlNlZy5wcmV2SW5SZXN1bHQoKSA6IG51bGw7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAvLyBubyBzZWdtZW50IGZvdW5kLCB0aHVzIG5vIHJpbmcgY2FuIGVuY2xvc2UgdXNcbiAgICAgICAgICBpZiAoIXByZXZTZWcpIHJldHVybiBudWxsOyAvLyBubyBzZWdtZW50cyBiZWxvdyBwcmV2IHNlZ21lbnQgZm91bmQsIHRodXMgdGhlIHJpbmcgb2YgdGhlIHByZXZcbiAgICAgICAgICAvLyBzZWdtZW50IG11c3QgbG9vcCBiYWNrIGFyb3VuZCBhbmQgZW5jbG9zZSB1c1xuXG4gICAgICAgICAgaWYgKCFwcmV2UHJldlNlZykgcmV0dXJuIHByZXZTZWcucmluZ091dDsgLy8gaWYgdGhlIHR3byBzZWdtZW50cyBhcmUgb2YgZGlmZmVyZW50IHJpbmdzLCB0aGUgcmluZyBvZiB0aGUgcHJldlxuICAgICAgICAgIC8vIHNlZ21lbnQgbXVzdCBlaXRoZXIgbG9vcCBhcm91bmQgdXMgb3IgdGhlIHJpbmcgb2YgdGhlIHByZXYgcHJldlxuICAgICAgICAgIC8vIHNlZywgd2hpY2ggd291bGQgbWFrZSB1cyBhbmQgdGhlIHJpbmcgb2YgdGhlIHByZXYgcGVlcnNcblxuICAgICAgICAgIGlmIChwcmV2UHJldlNlZy5yaW5nT3V0ICE9PSBwcmV2U2VnLnJpbmdPdXQpIHtcbiAgICAgICAgICAgIGlmIChwcmV2UHJldlNlZy5yaW5nT3V0LmVuY2xvc2luZ1JpbmcoKSAhPT0gcHJldlNlZy5yaW5nT3V0KSB7XG4gICAgICAgICAgICAgIHJldHVybiBwcmV2U2VnLnJpbmdPdXQ7XG4gICAgICAgICAgICB9IGVsc2UgcmV0dXJuIHByZXZTZWcucmluZ091dC5lbmNsb3NpbmdSaW5nKCk7XG4gICAgICAgICAgfSAvLyB0d28gc2VnbWVudHMgYXJlIGZyb20gdGhlIHNhbWUgcmluZywgc28gdGhpcyB3YXMgYSBwZW5pc3VsYVxuICAgICAgICAgIC8vIG9mIHRoYXQgcmluZy4gaXRlcmF0ZSBkb3dud2FyZCwga2VlcCBzZWFyY2hpbmdcblxuXG4gICAgICAgICAgcHJldlNlZyA9IHByZXZQcmV2U2VnLnByZXZJblJlc3VsdCgpO1xuICAgICAgICAgIHByZXZQcmV2U2VnID0gcHJldlNlZyA/IHByZXZTZWcucHJldkluUmVzdWx0KCkgOiBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFJpbmdPdXQ7XG4gIH0oKTtcbiAgdmFyIFBvbHlPdXQgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBvbHlPdXQoZXh0ZXJpb3JSaW5nKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgUG9seU91dCk7XG5cbiAgICAgIHRoaXMuZXh0ZXJpb3JSaW5nID0gZXh0ZXJpb3JSaW5nO1xuICAgICAgZXh0ZXJpb3JSaW5nLnBvbHkgPSB0aGlzO1xuICAgICAgdGhpcy5pbnRlcmlvclJpbmdzID0gW107XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFBvbHlPdXQsIFt7XG4gICAgICBrZXk6IFwiYWRkSW50ZXJpb3JcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGRJbnRlcmlvcihyaW5nKSB7XG4gICAgICAgIHRoaXMuaW50ZXJpb3JSaW5ncy5wdXNoKHJpbmcpO1xuICAgICAgICByaW5nLnBvbHkgPSB0aGlzO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJnZXRHZW9tXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0R2VvbSgpIHtcbiAgICAgICAgdmFyIGdlb20gPSBbdGhpcy5leHRlcmlvclJpbmcuZ2V0R2VvbSgpXTsgLy8gZXh0ZXJpb3IgcmluZyB3YXMgYWxsICh3aXRoaW4gcm91bmRpbmcgZXJyb3Igb2YgYW5nbGUgY2FsYykgY29saW5lYXIgcG9pbnRzXG5cbiAgICAgICAgaWYgKGdlb21bMF0gPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gdGhpcy5pbnRlcmlvclJpbmdzLmxlbmd0aDsgaSA8IGlNYXg7IGkrKykge1xuICAgICAgICAgIHZhciByaW5nR2VvbSA9IHRoaXMuaW50ZXJpb3JSaW5nc1tpXS5nZXRHZW9tKCk7IC8vIGludGVyaW9yIHJpbmcgd2FzIGFsbCAod2l0aGluIHJvdW5kaW5nIGVycm9yIG9mIGFuZ2xlIGNhbGMpIGNvbGluZWFyIHBvaW50c1xuXG4gICAgICAgICAgaWYgKHJpbmdHZW9tID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgICBnZW9tLnB1c2gocmluZ0dlb20pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdlb207XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFBvbHlPdXQ7XG4gIH0oKTtcbiAgdmFyIE11bHRpUG9seU91dCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTXVsdGlQb2x5T3V0KHJpbmdzKSB7XG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTXVsdGlQb2x5T3V0KTtcblxuICAgICAgdGhpcy5yaW5ncyA9IHJpbmdzO1xuICAgICAgdGhpcy5wb2x5cyA9IHRoaXMuX2NvbXBvc2VQb2x5cyhyaW5ncyk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKE11bHRpUG9seU91dCwgW3tcbiAgICAgIGtleTogXCJnZXRHZW9tXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0R2VvbSgpIHtcbiAgICAgICAgdmFyIGdlb20gPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaU1heCA9IHRoaXMucG9seXMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBvbHlHZW9tID0gdGhpcy5wb2x5c1tpXS5nZXRHZW9tKCk7IC8vIGV4dGVyaW9yIHJpbmcgd2FzIGFsbCAod2l0aGluIHJvdW5kaW5nIGVycm9yIG9mIGFuZ2xlIGNhbGMpIGNvbGluZWFyIHBvaW50c1xuXG4gICAgICAgICAgaWYgKHBvbHlHZW9tID09PSBudWxsKSBjb250aW51ZTtcbiAgICAgICAgICBnZW9tLnB1c2gocG9seUdlb20pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGdlb207XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIl9jb21wb3NlUG9seXNcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBfY29tcG9zZVBvbHlzKHJpbmdzKSB7XG4gICAgICAgIHZhciBwb2x5cyA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpTWF4ID0gcmluZ3MubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHJpbmcgPSByaW5nc1tpXTtcbiAgICAgICAgICBpZiAocmluZy5wb2x5KSBjb250aW51ZTtcbiAgICAgICAgICBpZiAocmluZy5pc0V4dGVyaW9yUmluZygpKSBwb2x5cy5wdXNoKG5ldyBQb2x5T3V0KHJpbmcpKTtlbHNlIHtcbiAgICAgICAgICAgIHZhciBlbmNsb3NpbmdSaW5nID0gcmluZy5lbmNsb3NpbmdSaW5nKCk7XG4gICAgICAgICAgICBpZiAoIWVuY2xvc2luZ1JpbmcucG9seSkgcG9seXMucHVzaChuZXcgUG9seU91dChlbmNsb3NpbmdSaW5nKSk7XG4gICAgICAgICAgICBlbmNsb3NpbmdSaW5nLnBvbHkuYWRkSW50ZXJpb3IocmluZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBvbHlzO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBNdWx0aVBvbHlPdXQ7XG4gIH0oKTtcblxuICAvKipcbiAgICogTk9URTogIFdlIG11c3QgYmUgY2FyZWZ1bCBub3QgdG8gY2hhbmdlIGFueSBzZWdtZW50cyB3aGlsZVxuICAgKiAgICAgICAgdGhleSBhcmUgaW4gdGhlIFNwbGF5VHJlZS4gQUZBSUssIHRoZXJlJ3Mgbm8gd2F5IHRvIHRlbGxcbiAgICogICAgICAgIHRoZSB0cmVlIHRvIHJlYmFsYW5jZSBpdHNlbGYgLSB0aHVzIGJlZm9yZSBzcGxpdHRpbmdcbiAgICogICAgICAgIGEgc2VnbWVudCB0aGF0J3MgaW4gdGhlIHRyZWUsIHdlIHJlbW92ZSBpdCBmcm9tIHRoZSB0cmVlLFxuICAgKiAgICAgICAgZG8gdGhlIHNwbGl0LCB0aGVuIHJlLWluc2VydCBpdC4gKEV2ZW4gdGhvdWdoIHNwbGl0dGluZyBhXG4gICAqICAgICAgICBzZWdtZW50ICpzaG91bGRuJ3QqIGNoYW5nZSBpdHMgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGVcbiAgICogICAgICAgIHN3ZWVwIGxpbmUgdHJlZSwgdGhlIHJlYWxpdHkgaXMgYmVjYXVzZSBvZiByb3VuZGluZyBlcnJvcnMsXG4gICAqICAgICAgICBpdCBzb21ldGltZXMgZG9lcy4pXG4gICAqL1xuXG4gIHZhciBTd2VlcExpbmUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN3ZWVwTGluZShxdWV1ZSkge1xuICAgICAgdmFyIGNvbXBhcmF0b3IgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IFNlZ21lbnQuY29tcGFyZTtcblxuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFN3ZWVwTGluZSk7XG5cbiAgICAgIHRoaXMucXVldWUgPSBxdWV1ZTtcbiAgICAgIHRoaXMudHJlZSA9IG5ldyBUcmVlKGNvbXBhcmF0b3IpO1xuICAgICAgdGhpcy5zZWdtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhTd2VlcExpbmUsIFt7XG4gICAgICBrZXk6IFwicHJvY2Vzc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIHByb2Nlc3MoZXZlbnQpIHtcbiAgICAgICAgdmFyIHNlZ21lbnQgPSBldmVudC5zZWdtZW50O1xuICAgICAgICB2YXIgbmV3RXZlbnRzID0gW107IC8vIGlmIHdlJ3ZlIGFscmVhZHkgYmVlbiBjb25zdW1lZCBieSBhbm90aGVyIHNlZ21lbnQsXG4gICAgICAgIC8vIGNsZWFuIHVwIG91ciBib2R5IHBhcnRzIGFuZCBnZXQgb3V0XG5cbiAgICAgICAgaWYgKGV2ZW50LmNvbnN1bWVkQnkpIHtcbiAgICAgICAgICBpZiAoZXZlbnQuaXNMZWZ0KSB0aGlzLnF1ZXVlLnJlbW92ZShldmVudC5vdGhlclNFKTtlbHNlIHRoaXMudHJlZS5yZW1vdmUoc2VnbWVudCk7XG4gICAgICAgICAgcmV0dXJuIG5ld0V2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBub2RlID0gZXZlbnQuaXNMZWZ0ID8gdGhpcy50cmVlLmluc2VydChzZWdtZW50KSA6IHRoaXMudHJlZS5maW5kKHNlZ21lbnQpO1xuICAgICAgICBpZiAoIW5vZGUpIHRocm93IG5ldyBFcnJvcihcIlVuYWJsZSB0byBmaW5kIHNlZ21lbnQgI1wiLmNvbmNhdChzZWdtZW50LmlkLCBcIiBcIikgKyBcIltcIi5jb25jYXQoc2VnbWVudC5sZWZ0U0UucG9pbnQueCwgXCIsIFwiKS5jb25jYXQoc2VnbWVudC5sZWZ0U0UucG9pbnQueSwgXCJdIC0+IFwiKSArIFwiW1wiLmNvbmNhdChzZWdtZW50LnJpZ2h0U0UucG9pbnQueCwgXCIsIFwiKS5jb25jYXQoc2VnbWVudC5yaWdodFNFLnBvaW50LnksIFwiXSBcIikgKyAnaW4gU3dlZXBMaW5lIHRyZWUuIFBsZWFzZSBzdWJtaXQgYSBidWcgcmVwb3J0LicpO1xuICAgICAgICB2YXIgcHJldk5vZGUgPSBub2RlO1xuICAgICAgICB2YXIgbmV4dE5vZGUgPSBub2RlO1xuICAgICAgICB2YXIgcHJldlNlZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgdmFyIG5leHRTZWcgPSB1bmRlZmluZWQ7IC8vIHNraXAgY29uc3VtZWQgc2VnbWVudHMgc3RpbGwgaW4gdHJlZVxuXG4gICAgICAgIHdoaWxlIChwcmV2U2VnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBwcmV2Tm9kZSA9IHRoaXMudHJlZS5wcmV2KHByZXZOb2RlKTtcbiAgICAgICAgICBpZiAocHJldk5vZGUgPT09IG51bGwpIHByZXZTZWcgPSBudWxsO2Vsc2UgaWYgKHByZXZOb2RlLmtleS5jb25zdW1lZEJ5ID09PSB1bmRlZmluZWQpIHByZXZTZWcgPSBwcmV2Tm9kZS5rZXk7XG4gICAgICAgIH0gLy8gc2tpcCBjb25zdW1lZCBzZWdtZW50cyBzdGlsbCBpbiB0cmVlXG5cblxuICAgICAgICB3aGlsZSAobmV4dFNlZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgbmV4dE5vZGUgPSB0aGlzLnRyZWUubmV4dChuZXh0Tm9kZSk7XG4gICAgICAgICAgaWYgKG5leHROb2RlID09PSBudWxsKSBuZXh0U2VnID0gbnVsbDtlbHNlIGlmIChuZXh0Tm9kZS5rZXkuY29uc3VtZWRCeSA9PT0gdW5kZWZpbmVkKSBuZXh0U2VnID0gbmV4dE5vZGUua2V5O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LmlzTGVmdCkge1xuICAgICAgICAgIC8vIENoZWNrIGZvciBpbnRlcnNlY3Rpb25zIGFnYWluc3QgdGhlIHByZXZpb3VzIHNlZ21lbnQgaW4gdGhlIHN3ZWVwIGxpbmVcbiAgICAgICAgICB2YXIgcHJldk15U3BsaXR0ZXIgPSBudWxsO1xuXG4gICAgICAgICAgaWYgKHByZXZTZWcpIHtcbiAgICAgICAgICAgIHZhciBwcmV2SW50ZXIgPSBwcmV2U2VnLmdldEludGVyc2VjdGlvbihzZWdtZW50KTtcblxuICAgICAgICAgICAgaWYgKHByZXZJbnRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoIXNlZ21lbnQuaXNBbkVuZHBvaW50KHByZXZJbnRlcikpIHByZXZNeVNwbGl0dGVyID0gcHJldkludGVyO1xuXG4gICAgICAgICAgICAgIGlmICghcHJldlNlZy5pc0FuRW5kcG9pbnQocHJldkludGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdFdmVudHNGcm9tU3BsaXQgPSB0aGlzLl9zcGxpdFNhZmVseShwcmV2U2VnLCBwcmV2SW50ZXIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBuZXdFdmVudHNGcm9tU3BsaXQubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBuZXdFdmVudHMucHVzaChuZXdFdmVudHNGcm9tU3BsaXRbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gLy8gQ2hlY2sgZm9yIGludGVyc2VjdGlvbnMgYWdhaW5zdCB0aGUgbmV4dCBzZWdtZW50IGluIHRoZSBzd2VlcCBsaW5lXG5cblxuICAgICAgICAgIHZhciBuZXh0TXlTcGxpdHRlciA9IG51bGw7XG5cbiAgICAgICAgICBpZiAobmV4dFNlZykge1xuICAgICAgICAgICAgdmFyIG5leHRJbnRlciA9IG5leHRTZWcuZ2V0SW50ZXJzZWN0aW9uKHNlZ21lbnQpO1xuXG4gICAgICAgICAgICBpZiAobmV4dEludGVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGlmICghc2VnbWVudC5pc0FuRW5kcG9pbnQobmV4dEludGVyKSkgbmV4dE15U3BsaXR0ZXIgPSBuZXh0SW50ZXI7XG5cbiAgICAgICAgICAgICAgaWYgKCFuZXh0U2VnLmlzQW5FbmRwb2ludChuZXh0SW50ZXIpKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9uZXdFdmVudHNGcm9tU3BsaXQgPSB0aGlzLl9zcGxpdFNhZmVseShuZXh0U2VnLCBuZXh0SW50ZXIpO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfaU1heCA9IF9uZXdFdmVudHNGcm9tU3BsaXQubGVuZ3RoOyBfaSA8IF9pTWF4OyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgICBuZXdFdmVudHMucHVzaChfbmV3RXZlbnRzRnJvbVNwbGl0W19pXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAvLyBGb3Igc2ltcGxpY2l0eSwgZXZlbiBpZiB3ZSBmaW5kIG1vcmUgdGhhbiBvbmUgaW50ZXJzZWN0aW9uIHdlIG9ubHlcbiAgICAgICAgICAvLyBzcGlsdCBvbiB0aGUgJ2VhcmxpZXN0JyAoc3dlZXAtbGluZSBzdHlsZSkgb2YgdGhlIGludGVyc2VjdGlvbnMuXG4gICAgICAgICAgLy8gVGhlIG90aGVyIGludGVyc2VjdGlvbiB3aWxsIGJlIGhhbmRsZWQgaW4gYSBmdXR1cmUgcHJvY2VzcygpLlxuXG5cbiAgICAgICAgICBpZiAocHJldk15U3BsaXR0ZXIgIT09IG51bGwgfHwgbmV4dE15U3BsaXR0ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBteVNwbGl0dGVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChwcmV2TXlTcGxpdHRlciA9PT0gbnVsbCkgbXlTcGxpdHRlciA9IG5leHRNeVNwbGl0dGVyO2Vsc2UgaWYgKG5leHRNeVNwbGl0dGVyID09PSBudWxsKSBteVNwbGl0dGVyID0gcHJldk15U3BsaXR0ZXI7ZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBjbXBTcGxpdHRlcnMgPSBTd2VlcEV2ZW50LmNvbXBhcmVQb2ludHMocHJldk15U3BsaXR0ZXIsIG5leHRNeVNwbGl0dGVyKTtcbiAgICAgICAgICAgICAgbXlTcGxpdHRlciA9IGNtcFNwbGl0dGVycyA8PSAwID8gcHJldk15U3BsaXR0ZXIgOiBuZXh0TXlTcGxpdHRlcjtcbiAgICAgICAgICAgIH0gLy8gUm91bmRpbmcgZXJyb3JzIGNhbiBjYXVzZSBjaGFuZ2VzIGluIG9yZGVyaW5nLFxuICAgICAgICAgICAgLy8gc28gcmVtb3ZlIGFmZWN0ZWQgc2VnbWVudHMgYW5kIHJpZ2h0IHN3ZWVwIGV2ZW50cyBiZWZvcmUgc3BsaXR0aW5nXG5cbiAgICAgICAgICAgIHRoaXMucXVldWUucmVtb3ZlKHNlZ21lbnQucmlnaHRTRSk7XG4gICAgICAgICAgICBuZXdFdmVudHMucHVzaChzZWdtZW50LnJpZ2h0U0UpO1xuXG4gICAgICAgICAgICB2YXIgX25ld0V2ZW50c0Zyb21TcGxpdDIgPSBzZWdtZW50LnNwbGl0KG15U3BsaXR0ZXIpO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwLCBfaU1heDIgPSBfbmV3RXZlbnRzRnJvbVNwbGl0Mi5sZW5ndGg7IF9pMiA8IF9pTWF4MjsgX2kyKyspIHtcbiAgICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goX25ld0V2ZW50c0Zyb21TcGxpdDJbX2kyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5ld0V2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBXZSBmb3VuZCBzb21lIGludGVyc2VjdGlvbnMsIHNvIHJlLWRvIHRoZSBjdXJyZW50IGV2ZW50IHRvXG4gICAgICAgICAgICAvLyBtYWtlIHN1cmUgc3dlZXAgbGluZSBvcmRlcmluZyBpcyB0b3RhbGx5IGNvbnNpc3RlbnQgZm9yIGxhdGVyXG4gICAgICAgICAgICAvLyB1c2Ugd2l0aCB0aGUgc2VnbWVudCAncHJldicgcG9pbnRlcnNcbiAgICAgICAgICAgIHRoaXMudHJlZS5yZW1vdmUoc2VnbWVudCk7XG4gICAgICAgICAgICBuZXdFdmVudHMucHVzaChldmVudCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGRvbmUgd2l0aCBsZWZ0IGV2ZW50XG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgICAgICAgICBzZWdtZW50LnByZXYgPSBwcmV2U2VnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBldmVudC5pc1JpZ2h0XG4gICAgICAgICAgLy8gc2luY2Ugd2UncmUgYWJvdXQgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBzd2VlcCBsaW5lLCBjaGVjayBmb3JcbiAgICAgICAgICAvLyBpbnRlcnNlY3Rpb25zIGJldHdlZW4gb3VyIHByZXZpb3VzIGFuZCBuZXh0IHNlZ21lbnRzXG4gICAgICAgICAgaWYgKHByZXZTZWcgJiYgbmV4dFNlZykge1xuICAgICAgICAgICAgdmFyIGludGVyID0gcHJldlNlZy5nZXRJbnRlcnNlY3Rpb24obmV4dFNlZyk7XG5cbiAgICAgICAgICAgIGlmIChpbnRlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICBpZiAoIXByZXZTZWcuaXNBbkVuZHBvaW50KGludGVyKSkge1xuICAgICAgICAgICAgICAgIHZhciBfbmV3RXZlbnRzRnJvbVNwbGl0MyA9IHRoaXMuX3NwbGl0U2FmZWx5KHByZXZTZWcsIGludGVyKTtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIF9pMyA9IDAsIF9pTWF4MyA9IF9uZXdFdmVudHNGcm9tU3BsaXQzLmxlbmd0aDsgX2kzIDwgX2lNYXgzOyBfaTMrKykge1xuICAgICAgICAgICAgICAgICAgbmV3RXZlbnRzLnB1c2goX25ld0V2ZW50c0Zyb21TcGxpdDNbX2kzXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCFuZXh0U2VnLmlzQW5FbmRwb2ludChpbnRlcikpIHtcbiAgICAgICAgICAgICAgICB2YXIgX25ld0V2ZW50c0Zyb21TcGxpdDQgPSB0aGlzLl9zcGxpdFNhZmVseShuZXh0U2VnLCBpbnRlcik7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfaTQgPSAwLCBfaU1heDQgPSBfbmV3RXZlbnRzRnJvbVNwbGl0NC5sZW5ndGg7IF9pNCA8IF9pTWF4NDsgX2k0KyspIHtcbiAgICAgICAgICAgICAgICAgIG5ld0V2ZW50cy5wdXNoKF9uZXdFdmVudHNGcm9tU3BsaXQ0W19pNF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMudHJlZS5yZW1vdmUoc2VnbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3RXZlbnRzO1xuICAgICAgfVxuICAgICAgLyogU2FmZWx5IHNwbGl0IGEgc2VnbWVudCB0aGF0IGlzIGN1cnJlbnRseSBpbiB0aGUgZGF0YXN0cnVjdHVyZXNcbiAgICAgICAqIElFIC0gYSBzZWdtZW50IG90aGVyIHRoYW4gdGhlIG9uZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyBwcm9jZXNzZWQuICovXG5cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiX3NwbGl0U2FmZWx5XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX3NwbGl0U2FmZWx5KHNlZywgcHQpIHtcbiAgICAgICAgLy8gUm91bmRpbmcgZXJyb3JzIGNhbiBjYXVzZSBjaGFuZ2VzIGluIG9yZGVyaW5nLFxuICAgICAgICAvLyBzbyByZW1vdmUgYWZlY3RlZCBzZWdtZW50cyBhbmQgcmlnaHQgc3dlZXAgZXZlbnRzIGJlZm9yZSBzcGxpdHRpbmdcbiAgICAgICAgLy8gcmVtb3ZlTm9kZSgpIGRvZXNuJ3Qgd29yaywgc28gaGF2ZSByZS1maW5kIHRoZSBzZWdcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3c4ci9zcGxheS10cmVlL3B1bGwvNVxuICAgICAgICB0aGlzLnRyZWUucmVtb3ZlKHNlZyk7XG4gICAgICAgIHZhciByaWdodFNFID0gc2VnLnJpZ2h0U0U7XG4gICAgICAgIHRoaXMucXVldWUucmVtb3ZlKHJpZ2h0U0UpO1xuICAgICAgICB2YXIgbmV3RXZlbnRzID0gc2VnLnNwbGl0KHB0KTtcbiAgICAgICAgbmV3RXZlbnRzLnB1c2gocmlnaHRTRSk7IC8vIHNwbGl0dGluZyBjYW4gdHJpZ2dlciBjb25zdW1wdGlvblxuXG4gICAgICAgIGlmIChzZWcuY29uc3VtZWRCeSA9PT0gdW5kZWZpbmVkKSB0aGlzLnRyZWUuaW5zZXJ0KHNlZyk7XG4gICAgICAgIHJldHVybiBuZXdFdmVudHM7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIFN3ZWVwTGluZTtcbiAgfSgpO1xuXG4gIHZhciBQT0xZR09OX0NMSVBQSU5HX01BWF9RVUVVRV9TSVpFID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52LlBPTFlHT05fQ0xJUFBJTkdfTUFYX1FVRVVFX1NJWkUgfHwgMTAwMDAwMDtcbiAgdmFyIFBPTFlHT05fQ0xJUFBJTkdfTUFYX1NXRUVQTElORV9TRUdNRU5UUyA9IHR5cGVvZiBwcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJiBwcm9jZXNzLmVudi5QT0xZR09OX0NMSVBQSU5HX01BWF9TV0VFUExJTkVfU0VHTUVOVFMgfHwgMTAwMDAwMDtcbiAgdmFyIE9wZXJhdGlvbiA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT3BlcmF0aW9uKCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE9wZXJhdGlvbik7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKE9wZXJhdGlvbiwgW3tcbiAgICAgIGtleTogXCJydW5cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBydW4odHlwZSwgZ2VvbSwgbW9yZUdlb21zKSB7XG4gICAgICAgIG9wZXJhdGlvbi50eXBlID0gdHlwZTtcbiAgICAgICAgcm91bmRlci5yZXNldCgpO1xuICAgICAgICAvKiBDb252ZXJ0IGlucHV0cyB0byBNdWx0aVBvbHkgb2JqZWN0cyAqL1xuXG4gICAgICAgIHZhciBtdWx0aXBvbHlzID0gW25ldyBNdWx0aVBvbHlJbihnZW9tLCB0cnVlKV07XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGlNYXggPSBtb3JlR2VvbXMubGVuZ3RoOyBpIDwgaU1heDsgaSsrKSB7XG4gICAgICAgICAgbXVsdGlwb2x5cy5wdXNoKG5ldyBNdWx0aVBvbHlJbihtb3JlR2VvbXNbaV0sIGZhbHNlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcGVyYXRpb24ubnVtTXVsdGlQb2x5cyA9IG11bHRpcG9seXMubGVuZ3RoO1xuICAgICAgICAvKiBCQm94IG9wdGltaXphdGlvbiBmb3IgZGlmZmVyZW5jZSBvcGVyYXRpb25cbiAgICAgICAgICogSWYgdGhlIGJib3ggb2YgYSBtdWx0aXBvbHlnb24gdGhhdCdzIHBhcnQgb2YgdGhlIGNsaXBwaW5nIGRvZXNuJ3RcbiAgICAgICAgICogaW50ZXJzZWN0IHRoZSBiYm94IG9mIHRoZSBzdWJqZWN0IGF0IGFsbCwgd2UgY2FuIGp1c3QgZHJvcCB0aGF0XG4gICAgICAgICAqIG11bHRpcGxveWdvbi4gKi9cblxuICAgICAgICBpZiAob3BlcmF0aW9uLnR5cGUgPT09ICdkaWZmZXJlbmNlJykge1xuICAgICAgICAgIC8vIGluIHBsYWNlIHJlbW92YWxcbiAgICAgICAgICB2YXIgc3ViamVjdCA9IG11bHRpcG9seXNbMF07XG4gICAgICAgICAgdmFyIF9pID0gMTtcblxuICAgICAgICAgIHdoaWxlIChfaSA8IG11bHRpcG9seXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZ2V0QmJveE92ZXJsYXAobXVsdGlwb2x5c1tfaV0uYmJveCwgc3ViamVjdC5iYm94KSAhPT0gbnVsbCkgX2krKztlbHNlIG11bHRpcG9seXMuc3BsaWNlKF9pLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLyogQkJveCBvcHRpbWl6YXRpb24gZm9yIGludGVyc2VjdGlvbiBvcGVyYXRpb25cbiAgICAgICAgICogSWYgd2UgY2FuIGZpbmQgYW55IHBhaXIgb2YgbXVsdGlwb2x5Z29ucyB3aG9zZSBiYm94IGRvZXMgbm90IG92ZXJsYXAsXG4gICAgICAgICAqIHRoZW4gdGhlIHJlc3VsdCB3aWxsIGJlIGVtcHR5LiAqL1xuXG5cbiAgICAgICAgaWYgKG9wZXJhdGlvbi50eXBlID09PSAnaW50ZXJzZWN0aW9uJykge1xuICAgICAgICAgIC8vIFRPRE86IHRoaXMgaXMgTyhuXjIpIGluIG51bWJlciBvZiBwb2x5Z29ucy4gQnkgc29ydGluZyB0aGUgYmJveGVzLFxuICAgICAgICAgIC8vICAgICAgIGl0IGNvdWxkIGJlIG9wdGltaXplZCB0byBPKG4gKiBsbihuKSlcbiAgICAgICAgICBmb3IgKHZhciBfaTIgPSAwLCBfaU1heCA9IG11bHRpcG9seXMubGVuZ3RoOyBfaTIgPCBfaU1heDsgX2kyKyspIHtcbiAgICAgICAgICAgIHZhciBtcEEgPSBtdWx0aXBvbHlzW19pMl07XG5cbiAgICAgICAgICAgIGZvciAodmFyIGogPSBfaTIgKyAxLCBqTWF4ID0gbXVsdGlwb2x5cy5sZW5ndGg7IGogPCBqTWF4OyBqKyspIHtcbiAgICAgICAgICAgICAgaWYgKGdldEJib3hPdmVybGFwKG1wQS5iYm94LCBtdWx0aXBvbHlzW2pdLmJib3gpID09PSBudWxsKSByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIFB1dCBzZWdtZW50IGVuZHBvaW50cyBpbiBhIHByaW9yaXR5IHF1ZXVlICovXG5cblxuICAgICAgICB2YXIgcXVldWUgPSBuZXcgVHJlZShTd2VlcEV2ZW50LmNvbXBhcmUpO1xuXG4gICAgICAgIGZvciAodmFyIF9pMyA9IDAsIF9pTWF4MiA9IG11bHRpcG9seXMubGVuZ3RoOyBfaTMgPCBfaU1heDI7IF9pMysrKSB7XG4gICAgICAgICAgdmFyIHN3ZWVwRXZlbnRzID0gbXVsdGlwb2x5c1tfaTNdLmdldFN3ZWVwRXZlbnRzKCk7XG5cbiAgICAgICAgICBmb3IgKHZhciBfaiA9IDAsIF9qTWF4ID0gc3dlZXBFdmVudHMubGVuZ3RoOyBfaiA8IF9qTWF4OyBfaisrKSB7XG4gICAgICAgICAgICBxdWV1ZS5pbnNlcnQoc3dlZXBFdmVudHNbX2pdKTtcblxuICAgICAgICAgICAgaWYgKHF1ZXVlLnNpemUgPiBQT0xZR09OX0NMSVBQSU5HX01BWF9RVUVVRV9TSVpFKSB7XG4gICAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGluZmluaXRlIGxvb3AsIGFuIG90aGVyd2lzZSBjb21tb24gbWFuaWZlc3RhdGlvbiBvZiBidWdzXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgbG9vcCB3aGVuIHB1dHRpbmcgc2VnbWVudCBlbmRwb2ludHMgaW4gYSBwcmlvcml0eSBxdWV1ZSAnICsgJyhxdWV1ZSBzaXplIHRvbyBiaWcpLiBQbGVhc2UgZmlsZSBhIGJ1ZyByZXBvcnQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIFBhc3MgdGhlIHN3ZWVwIGxpbmUgb3ZlciB0aG9zZSBlbmRwb2ludHMgKi9cblxuXG4gICAgICAgIHZhciBzd2VlcExpbmUgPSBuZXcgU3dlZXBMaW5lKHF1ZXVlKTtcbiAgICAgICAgdmFyIHByZXZRdWV1ZVNpemUgPSBxdWV1ZS5zaXplO1xuICAgICAgICB2YXIgbm9kZSA9IHF1ZXVlLnBvcCgpO1xuXG4gICAgICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgICAgdmFyIGV2dCA9IG5vZGUua2V5O1xuXG4gICAgICAgICAgaWYgKHF1ZXVlLnNpemUgPT09IHByZXZRdWV1ZVNpemUpIHtcbiAgICAgICAgICAgIC8vIHByZXZlbnRzIGFuIGluZmluaXRlIGxvb3AsIGFuIG90aGVyd2lzZSBjb21tb24gbWFuaWZlc3RhdGlvbiBvZiBidWdzXG4gICAgICAgICAgICB2YXIgc2VnID0gZXZ0LnNlZ21lbnQ7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gcG9wKCkgXCIuY29uY2F0KGV2dC5pc0xlZnQgPyAnbGVmdCcgOiAncmlnaHQnLCBcIiBTd2VlcEV2ZW50IFwiKSArIFwiW1wiLmNvbmNhdChldnQucG9pbnQueCwgXCIsIFwiKS5jb25jYXQoZXZ0LnBvaW50LnksIFwiXSBmcm9tIHNlZ21lbnQgI1wiKS5jb25jYXQoc2VnLmlkLCBcIiBcIikgKyBcIltcIi5jb25jYXQoc2VnLmxlZnRTRS5wb2ludC54LCBcIiwgXCIpLmNvbmNhdChzZWcubGVmdFNFLnBvaW50LnksIFwiXSAtPiBcIikgKyBcIltcIi5jb25jYXQoc2VnLnJpZ2h0U0UucG9pbnQueCwgXCIsIFwiKS5jb25jYXQoc2VnLnJpZ2h0U0UucG9pbnQueSwgXCJdIGZyb20gcXVldWUuIFwiKSArICdQbGVhc2UgZmlsZSBhIGJ1ZyByZXBvcnQuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHF1ZXVlLnNpemUgPiBQT0xZR09OX0NMSVBQSU5HX01BWF9RVUVVRV9TSVpFKSB7XG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBhbiBpbmZpbml0ZSBsb29wLCBhbiBvdGhlcndpc2UgY29tbW9uIG1hbmlmZXN0YXRpb24gb2YgYnVnc1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmZpbml0ZSBsb29wIHdoZW4gcGFzc2luZyBzd2VlcCBsaW5lIG92ZXIgZW5kcG9pbnRzICcgKyAnKHF1ZXVlIHNpemUgdG9vIGJpZykuIFBsZWFzZSBmaWxlIGEgYnVnIHJlcG9ydC4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc3dlZXBMaW5lLnNlZ21lbnRzLmxlbmd0aCA+IFBPTFlHT05fQ0xJUFBJTkdfTUFYX1NXRUVQTElORV9TRUdNRU5UUykge1xuICAgICAgICAgICAgLy8gcHJldmVudHMgYW4gaW5maW5pdGUgbG9vcCwgYW4gb3RoZXJ3aXNlIGNvbW1vbiBtYW5pZmVzdGF0aW9uIG9mIGJ1Z3NcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5maW5pdGUgbG9vcCB3aGVuIHBhc3Npbmcgc3dlZXAgbGluZSBvdmVyIGVuZHBvaW50cyAnICsgJyh0b28gbWFueSBzd2VlcCBsaW5lIHNlZ21lbnRzKS4gUGxlYXNlIGZpbGUgYSBidWcgcmVwb3J0LicpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciBuZXdFdmVudHMgPSBzd2VlcExpbmUucHJvY2VzcyhldnQpO1xuXG4gICAgICAgICAgZm9yICh2YXIgX2k0ID0gMCwgX2lNYXgzID0gbmV3RXZlbnRzLmxlbmd0aDsgX2k0IDwgX2lNYXgzOyBfaTQrKykge1xuICAgICAgICAgICAgdmFyIF9ldnQgPSBuZXdFdmVudHNbX2k0XTtcbiAgICAgICAgICAgIGlmIChfZXZ0LmNvbnN1bWVkQnkgPT09IHVuZGVmaW5lZCkgcXVldWUuaW5zZXJ0KF9ldnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByZXZRdWV1ZVNpemUgPSBxdWV1ZS5zaXplO1xuICAgICAgICAgIG5vZGUgPSBxdWV1ZS5wb3AoKTtcbiAgICAgICAgfSAvLyBmcmVlIHNvbWUgbWVtb3J5IHdlIGRvbid0IG5lZWQgYW55bW9yZVxuXG5cbiAgICAgICAgcm91bmRlci5yZXNldCgpO1xuICAgICAgICAvKiBDb2xsZWN0IGFuZCBjb21waWxlIHNlZ21lbnRzIHdlJ3JlIGtlZXBpbmcgaW50byBhIG11bHRpcG9seWdvbiAqL1xuXG4gICAgICAgIHZhciByaW5nc091dCA9IFJpbmdPdXQuZmFjdG9yeShzd2VlcExpbmUuc2VnbWVudHMpO1xuICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IE11bHRpUG9seU91dChyaW5nc091dCk7XG4gICAgICAgIHJldHVybiByZXN1bHQuZ2V0R2VvbSgpO1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBPcGVyYXRpb247XG4gIH0oKTsgLy8gc2luZ2xldG9uIGF2YWlsYWJsZSBieSBpbXBvcnRcblxuICB2YXIgb3BlcmF0aW9uID0gbmV3IE9wZXJhdGlvbigpO1xuXG4gIHZhciB1bmlvbiA9IGZ1bmN0aW9uIHVuaW9uKGdlb20pIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgbW9yZUdlb21zID0gbmV3IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIG1vcmVHZW9tc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wZXJhdGlvbi5ydW4oJ3VuaW9uJywgZ2VvbSwgbW9yZUdlb21zKTtcbiAgfTtcblxuICB2YXIgaW50ZXJzZWN0aW9uJDEgPSBmdW5jdGlvbiBpbnRlcnNlY3Rpb24oZ2VvbSkge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgbW9yZUdlb21zID0gbmV3IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgIG1vcmVHZW9tc1tfa2V5MiAtIDFdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3BlcmF0aW9uLnJ1bignaW50ZXJzZWN0aW9uJywgZ2VvbSwgbW9yZUdlb21zKTtcbiAgfTtcblxuICB2YXIgeG9yID0gZnVuY3Rpb24geG9yKGdlb20pIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIG1vcmVHZW9tcyA9IG5ldyBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICBtb3JlR2VvbXNbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wZXJhdGlvbi5ydW4oJ3hvcicsIGdlb20sIG1vcmVHZW9tcyk7XG4gIH07XG5cbiAgdmFyIGRpZmZlcmVuY2UgPSBmdW5jdGlvbiBkaWZmZXJlbmNlKHN1YmplY3RHZW9tKSB7XG4gICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBjbGlwcGluZ0dlb21zID0gbmV3IEFycmF5KF9sZW40ID4gMSA/IF9sZW40IC0gMSA6IDApLCBfa2V5NCA9IDE7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgIGNsaXBwaW5nR2VvbXNbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wZXJhdGlvbi5ydW4oJ2RpZmZlcmVuY2UnLCBzdWJqZWN0R2VvbSwgY2xpcHBpbmdHZW9tcyk7XG4gIH07XG5cbiAgdmFyIGluZGV4ID0ge1xuICAgIHVuaW9uOiB1bmlvbixcbiAgICBpbnRlcnNlY3Rpb246IGludGVyc2VjdGlvbiQxLFxuICAgIHhvcjogeG9yLFxuICAgIGRpZmZlcmVuY2U6IGRpZmZlcmVuY2VcbiAgfTtcblxuICByZXR1cm4gaW5kZXg7XG5cbn0pKSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiaW1wb3J0IHsgVUlBY3Rpb25UeXBlcywgV29ya2VyQWN0aW9uVHlwZXMsIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5pbXBvcnQgeyBnZXRTdmdQYXRoRnJvbVN0cm9rZSwgYWRkVmVjdG9ycywgaW50ZXJwb2xhdGVDdWJpY0JlemllciwgZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlLCB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IGdldFN0cm9rZSBmcm9tIFwicGVyZmVjdC1mcmVlaGFuZFwiO1xuaW1wb3J0IHsgY29tcHJlc3NUb1VURjE2LCBkZWNvbXByZXNzRnJvbVVURjE2IH0gZnJvbSBcImx6LXN0cmluZ1wiO1xuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gQ29tbXMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgcGx1Z2luIFVJXG5mdW5jdGlvbiBwb3N0TWVzc2FnZSh7IHR5cGUsIHBheWxvYWQgfSkge1xuICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZSwgcGF5bG9hZCB9KTtcbn1cbi8vIFNhdmUgc29tZSBpbmZvcm1hdGlvbiBhYm91dCB0aGUgbm9kZSB0byBpdHMgcGx1Z2luIGRhdGEuXG5mdW5jdGlvbiBzZXRPcmlnaW5hbE5vZGUobm9kZSkge1xuICAgIGNvbnN0IG9yaWdpbmFsTm9kZSA9IHtcbiAgICAgICAgY2VudGVyOiBnZXRDZW50ZXIobm9kZSksXG4gICAgICAgIHZlY3Rvck5ldHdvcms6IE9iamVjdC5hc3NpZ24oe30sIG5vZGUudmVjdG9yTmV0d29yayksXG4gICAgICAgIHZlY3RvclBhdGhzOiBub2RlLnZlY3RvclBhdGhzLFxuICAgIH07XG4gICAgbm9kZS5zZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiLCBjb21wcmVzc1RvVVRGMTYoSlNPTi5zdHJpbmdpZnkob3JpZ2luYWxOb2RlKSkpO1xuICAgIHJldHVybiBvcmlnaW5hbE5vZGU7XG59XG5mdW5jdGlvbiBkZWNvbXByZXNzUGx1Z2luRGF0YShwbHVnaW5EYXRhKSB7XG4gICAgLy8gRGVjb21wcmVzcyB0aGUgc2F2ZWQgZGF0YSBhbmQgcGFyc2Ugb3V0IHRoZSBvcmlnaW5hbCBub2RlLlxuICAgIGNvbnN0IGRlY29tcHJlc3NlZCA9IGRlY29tcHJlc3NGcm9tVVRGMTYocGx1Z2luRGF0YSk7XG4gICAgaWYgKCFkZWNvbXByZXNzZWQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXCJGb3VuZCBzYXZlZCBkYXRhIGZvciBvcmlnaW5hbCBub2RlIGJ1dCBjb3VsZCBub3QgZGVjb21wcmVzcyBpdDogXCIgK1xuICAgICAgICAgICAgZGVjb21wcmVzc2VkKTtcbiAgICB9XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoZGVjb21wcmVzc2VkKTtcbn1cbi8vIEdldCBhbiBvcmlnaW5hbCBub2RlIGZyb20gYSBub2RlJ3MgcGx1Z2luIGRhdGEuXG5mdW5jdGlvbiBnZXRPcmlnaW5hbE5vZGUoaWQpIHtcbiAgICBsZXQgbm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICBpZiAoIW5vZGUpXG4gICAgICAgIHRocm93IEVycm9yKFwiQ291bGQgbm90IGZpbmQgdGhhdCBub2RlOiBcIiArIGlkKTtcbiAgICBjb25zdCBwbHVnaW5EYXRhID0gbm9kZS5nZXRQbHVnaW5EYXRhKFwicGVyZmVjdF9mcmVlaGFuZFwiKTtcbiAgICAvLyBOb3RoaW5nIG9uIHRoZSBub2RlIOKAlCB3ZSBoYXZlbid0IG1vZGlmaWVkIGl0LlxuICAgIGlmICghcGx1Z2luRGF0YSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gZGVjb21wcmVzc1BsdWdpbkRhdGEocGx1Z2luRGF0YSk7XG59XG4vKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tIE5vZGVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuLy8gR2V0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgVmVjdG9yIG5vZGVzIGZvciB0aGUgVUkuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZE5vZGVzKHVwZGF0ZUNlbnRlciA9IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5maWx0ZXIoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBcIlZFQ1RPUlwiKS5tYXAoKG5vZGUpID0+IHtcbiAgICAgICAgY29uc3QgcGx1Z2luRGF0YSA9IG5vZGUuZ2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIik7XG4gICAgICAgIGlmIChwbHVnaW5EYXRhICYmIHVwZGF0ZUNlbnRlcikge1xuICAgICAgICAgICAgY29uc3QgY2VudGVyID0gZ2V0Q2VudGVyKG5vZGUpO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxOb2RlID0gZGVjb21wcmVzc1BsdWdpbkRhdGEocGx1Z2luRGF0YSk7XG4gICAgICAgICAgICBpZiAoIShjZW50ZXIueCA9PT0gb3JpZ2luYWxOb2RlLmNlbnRlci54ICYmXG4gICAgICAgICAgICAgICAgY2VudGVyLnkgPT09IG9yaWdpbmFsTm9kZS5jZW50ZXIueSkpIHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbE5vZGUuY2VudGVyID0gY2VudGVyO1xuICAgICAgICAgICAgICAgIG5vZGUuc2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIiwgY29tcHJlc3NUb1VURjE2KEpTT04uc3RyaW5naWZ5KG9yaWdpbmFsTm9kZSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaWQ6IG5vZGUuaWQsXG4gICAgICAgICAgICBuYW1lOiBub2RlLm5hbWUsXG4gICAgICAgICAgICB0eXBlOiBub2RlLnR5cGUsXG4gICAgICAgICAgICBjYW5SZXNldDogISFwbHVnaW5EYXRhLFxuICAgICAgICB9O1xuICAgIH0pO1xufVxuLy8gR2V0dGhlIGN1cnJlbnRseSBzZWxlY3RlZCBWZWN0b3Igbm9kZXMgYXMgYW4gYXJyYXkgb2YgSWRzLlxuZnVuY3Rpb24gZ2V0U2VsZWN0ZWROb2RlSWRzKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKCh7IGlkIH0pID0+IGlkKTtcbn1cbi8vIEZpbmQgdGhlIGNlbnRlciBvZiBhIG5vZGUuXG5mdW5jdGlvbiBnZXRDZW50ZXIobm9kZSkge1xuICAgIGxldCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IG5vZGU7XG4gICAgcmV0dXJuIHsgeDogeCArIHdpZHRoIC8gMiwgeTogeSArIGhlaWdodCAvIDIgfTtcbn1cbi8vIE1vdmUgYSBub2RlIHRvIGEgY2VudGVyLlxuZnVuY3Rpb24gbW92ZU5vZGVUb0NlbnRlcihub2RlLCBjZW50ZXIpIHtcbiAgICBjb25zdCB7IHg6IHgwLCB5OiB5MCB9ID0gZ2V0Q2VudGVyKG5vZGUpO1xuICAgIGNvbnN0IHsgeDogeDEsIHk6IHkxIH0gPSBjZW50ZXI7XG4gICAgbm9kZS54ID0gbm9kZS54ICsgeDEgLSB4MDtcbiAgICBub2RlLnkgPSBub2RlLnkgKyB5MSAtIHkwO1xufVxuLy8gWm9vbSB0aGUgRmlnbWEgdmlld3BvcnQgdG8gYSBub2RlLlxuZnVuY3Rpb24gem9vbVRvTm9kZShpZCkge1xuICAgIGNvbnN0IG5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gU2VsZWN0aW9uIC0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIERlc2VsZWN0cyBhIEZpZ21hIG5vZGVcbmZ1bmN0aW9uIGRlc2VsZWN0Tm9kZShpZCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBzZWxlY3Rpb24uZmlsdGVyKChub2RlKSA9PiBub2RlLmlkICE9PSBpZCk7XG59XG4vLyBTZW5kIHRoZSBjdXJyZW50IHNlbGVjdGlvbiB0byB0aGUgVUkgc3RhdGVcbmZ1bmN0aW9uIHNlbmRJbml0aWFsU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuRk9VTkRfU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG5mdW5jdGlvbiBzZW5kU2VsZWN0ZWROb2Rlcyh1cGRhdGVDZW50ZXIgPSB0cnVlKSB7XG4gICAgY29uc3Qgc2VsZWN0ZWROb2RlcyA9IGdldFNlbGVjdGVkTm9kZXModXBkYXRlQ2VudGVyKTtcbiAgICBwb3N0TWVzc2FnZSh7XG4gICAgICAgIHR5cGU6IFdvcmtlckFjdGlvblR5cGVzLlNFTEVDVEVEX05PREVTLFxuICAgICAgICBwYXlsb2FkOiBzZWxlY3RlZE5vZGVzLFxuICAgIH0pO1xufVxuLyogLS0tLS0tLS0tLS0tLS0gQ2hhbmdpbmcgVmVjdG9yTm9kZXMgLS0tLS0tLS0tLS0tLS0gKi9cbi8vIE51bWJlciBvZiBuZXcgbm9kZXMgdG8gaW5zZXJ0XG5jb25zdCBTUExJVCA9IDU7XG4vLyBTb21lIGJhc2ljIGVhc2luZyBmdW5jdGlvbnNcbmNvbnN0IEVBU0lOR1MgPSB7XG4gICAgbGluZWFyOiAodCkgPT4gdCxcbiAgICBlYXNlSW46ICh0KSA9PiB0ICogdCxcbiAgICBlYXNlT3V0OiAodCkgPT4gdCAqICgyIC0gdCksXG4gICAgZWFzZUluT3V0OiAodCkgPT4gKHQgPCAwLjUgPyAyICogdCAqIHQgOiAtMSArICg0IC0gMiAqIHQpICogdCksXG59O1xuLy8gQ29tcHV0ZSBhIHN0cm9rZSBiYXNlZCBvbiB0aGUgdmVjdG9yIGFuZCBhcHBseSBpdCB0byB0aGUgdmVjdG9yJ3MgcGF0aCBkYXRhLlxuZnVuY3Rpb24gYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKG5vZGVJZHMsIHsgb3B0aW9ucywgZWFzaW5nID0gXCJsaW5lYXJcIiwgY2xpcCwgfSwgcmVzdHJpY3RUb0tub3duTm9kZXMgPSBmYWxzZSkge1xuICAgIGZvciAobGV0IGlkIG9mIG5vZGVJZHMpIHtcbiAgICAgICAgLy8gR2V0IHRoZSBub2RlIHRoYXQgd2Ugd2FudCB0byBjaGFuZ2VcbiAgICAgICAgY29uc3Qgbm9kZVRvQ2hhbmdlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIW5vZGVUb0NoYW5nZSkge1xuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEdldCB0aGUgb3JpZ2luYWwgbm9kZVxuICAgICAgICBsZXQgb3JpZ2luYWxOb2RlID0gZ2V0T3JpZ2luYWxOb2RlKG5vZGVUb0NoYW5nZS5pZCk7XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGtub3cgdGhpcyBub2RlLi4uXG4gICAgICAgIGlmICghb3JpZ2luYWxOb2RlKSB7XG4gICAgICAgICAgICAvLyBCYWlsIGlmIHdlJ3JlIHVwZGF0aW5nIG5vZGVzXG4gICAgICAgICAgICBpZiAocmVzdHJpY3RUb0tub3duTm9kZXMpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgb3JpZ2luYWwgbm9kZSBhbmQgY29udGludWVcbiAgICAgICAgICAgIG9yaWdpbmFsTm9kZSA9IHNldE9yaWdpbmFsTm9kZShub2RlVG9DaGFuZ2UpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEludGVycG9sYXRlIG5ldyBwb2ludHMgYWxvbmcgdGhlIHZlY3RvcidzIGN1cnZlXG4gICAgICAgIGNvbnN0IHB0cyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBzZWdtZW50IG9mIG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnNlZ21lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwMCA9IG9yaWdpbmFsTm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuc3RhcnRdO1xuICAgICAgICAgICAgY29uc3QgcDMgPSBvcmlnaW5hbE5vZGUudmVjdG9yTmV0d29yay52ZXJ0aWNlc1tzZWdtZW50LmVuZF07XG4gICAgICAgICAgICBjb25zdCBwMSA9IGFkZFZlY3RvcnMocDAsIHNlZ21lbnQudGFuZ2VudFN0YXJ0KTtcbiAgICAgICAgICAgIGNvbnN0IHAyID0gYWRkVmVjdG9ycyhwMywgc2VnbWVudC50YW5nZW50RW5kKTtcbiAgICAgICAgICAgIGNvbnN0IGludGVycG9sYXRvciA9IGludGVycG9sYXRlQ3ViaWNCZXppZXIocDAsIHAxLCBwMiwgcDMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBTUExJVDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgcHRzLnB1c2goaW50ZXJwb2xhdG9yKGkgLyBTUExJVCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhIG5ldyBzdHJva2UgdXNpbmcgcGVyZmVjdC1mcmVlaGFuZFxuICAgICAgICBjb25zdCBzdHJva2UgPSBnZXRTdHJva2UocHRzLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpLCB7IGVhc2luZzogRUFTSU5HU1tlYXNpbmddIH0pKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFNldCBzdHJva2UgdG8gdmVjdG9yIHBhdGhzXG4gICAgICAgICAgICBub2RlVG9DaGFuZ2UudmVjdG9yUGF0aHMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aW5kaW5nUnVsZTogXCJOT05aRVJPXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGNsaXBcbiAgICAgICAgICAgICAgICAgICAgICAgID8gZ2V0RmxhdFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIDogZ2V0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkNvdWxkIG5vdCBhcHBseSBzdHJva2VcIiwgZS5tZXNzYWdlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkanVzdCB0aGUgcG9zaXRpb24gb2YgdGhlIG5vZGUgc28gdGhhdCBpdHMgY2VudGVyIGRvZXMgbm90IGNoYW5nZVxuICAgICAgICBtb3ZlTm9kZVRvQ2VudGVyKG5vZGVUb0NoYW5nZSwgb3JpZ2luYWxOb2RlLmNlbnRlcik7XG4gICAgfVxuICAgIHNlbmRTZWxlY3RlZE5vZGVzKGZhbHNlKTtcbn1cbi8vIFJlc2V0IHRoZSBub2RlIHRvIGl0cyBvcmlnaW5hbCBwYXRoIGRhdGEsIHVzaW5nIGRhdGEgZnJvbSBvdXIgY2FjaGUgYW5kIHRoZW4gZGVsZXRlIHRoZSBub2RlLlxuZnVuY3Rpb24gcmVzZXRWZWN0b3JOb2RlcygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiBnZXRTZWxlY3RlZE5vZGVJZHMoKSkge1xuICAgICAgICBjb25zdCBvcmlnaW5hbE5vZGUgPSBnZXRPcmlnaW5hbE5vZGUoaWQpO1xuICAgICAgICAvLyBXZSBoYXZlbid0IG1vZGlmaWVkIHRoaXMgbm9kZS5cbiAgICAgICAgaWYgKCFvcmlnaW5hbE5vZGUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgIGlmICghY3VycmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDb3VsZCBub3QgZmluZCB0aGF0IG5vZGU6IFwiICsgaWQpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudE5vZGUudmVjdG9yUGF0aHMgPSBvcmlnaW5hbE5vZGUudmVjdG9yUGF0aHM7XG4gICAgICAgIGN1cnJlbnROb2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIFwiXCIpO1xuICAgICAgICBzZW5kU2VsZWN0ZWROb2RlcyhmYWxzZSk7XG4gICAgfVxufVxuLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEtpY2tvZmYgLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbi8vIExpc3RlbiB0byBtZXNzYWdlcyByZWNlaXZlZCBmcm9tIHRoZSBwbHVnaW4gVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICh7IHR5cGUsIHBheWxvYWQgfSkge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuQ0xPU0U6XG4gICAgICAgICAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5aT09NX1RPX05PREU6XG4gICAgICAgICAgICB6b29tVG9Ob2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5ERVNFTEVDVF9OT0RFOlxuICAgICAgICAgICAgZGVzZWxlY3ROb2RlKHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5SRVNFVF9OT0RFUzpcbiAgICAgICAgICAgIHJlc2V0VmVjdG9yTm9kZXMoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFVJQWN0aW9uVHlwZXMuVFJBTlNGT1JNX05PREVTOlxuICAgICAgICAgICAgYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKGdldFNlbGVjdGVkTm9kZUlkcygpLCBwYXlsb2FkLCBmYWxzZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlVQREFURURfT1BUSU9OUzpcbiAgICAgICAgICAgIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2RlcyhnZXRTZWxlY3RlZE5vZGVJZHMoKSwgcGF5bG9hZCwgdHJ1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59O1xuLy8gTGlzdGVuIGZvciBzZWxlY3Rpb24gY2hhbmdlc1xuZmlnbWEub24oXCJzZWxlY3Rpb25jaGFuZ2VcIiwgc2VuZFNlbGVjdGVkTm9kZXMpO1xuLy8gU2hvdyB0aGUgcGx1Z2luIGludGVyZmFjZVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogNDIwIH0pO1xuLy8gU2VuZCB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gdGhlIFVJXG5zZW5kSW5pdGlhbFNlbGVjdGVkTm9kZXMoKTtcbiIsIi8vIFVJIGFjdGlvbnNcbmV4cG9ydCB2YXIgVUlBY3Rpb25UeXBlcztcbihmdW5jdGlvbiAoVUlBY3Rpb25UeXBlcykge1xuICAgIFVJQWN0aW9uVHlwZXNbXCJDTE9TRVwiXSA9IFwiQ0xPU0VcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiWk9PTV9UT19OT0RFXCJdID0gXCJaT09NX1RPX05PREVcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiREVTRUxFQ1RfTk9ERVwiXSA9IFwiREVTRUxFQ1RfTk9ERVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJUUkFOU0ZPUk1fTk9ERVNcIl0gPSBcIlRSQU5TRk9STV9OT0RFU1wiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJSRVNFVF9OT0RFU1wiXSA9IFwiUkVTRVRfTk9ERVNcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiVVBEQVRFRF9PUFRJT05TXCJdID0gXCJVUERBVEVEX09QVElPTlNcIjtcbn0pKFVJQWN0aW9uVHlwZXMgfHwgKFVJQWN0aW9uVHlwZXMgPSB7fSkpO1xuLy8gV29ya2VyIGFjdGlvbnNcbmV4cG9ydCB2YXIgV29ya2VyQWN0aW9uVHlwZXM7XG4oZnVuY3Rpb24gKFdvcmtlckFjdGlvblR5cGVzKSB7XG4gICAgV29ya2VyQWN0aW9uVHlwZXNbXCJTRUxFQ1RFRF9OT0RFU1wiXSA9IFwiU0VMRUNURURfTk9ERVNcIjtcbiAgICBXb3JrZXJBY3Rpb25UeXBlc1tcIkZPVU5EX1NFTEVDVEVEX05PREVTXCJdID0gXCJGT1VORF9TRUxFQ1RFRF9OT0RFU1wiO1xufSkoV29ya2VyQWN0aW9uVHlwZXMgfHwgKFdvcmtlckFjdGlvblR5cGVzID0ge30pKTtcbiIsImltcG9ydCBwb2x5Z29uQ2xpcHBpbmcgZnJvbSBcInBvbHlnb24tY2xpcHBpbmdcIjtcbmNvbnN0IHsgcG93IH0gPSBNYXRoO1xuZXhwb3J0IGZ1bmN0aW9uIGN1YmljQmV6aWVyKHR4LCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIEluc3BpcmVkIGJ5IERvbiBMYW5jYXN0ZXIncyB0d28gYXJ0aWNsZXNcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vZ2xpYi9jdWJlbWF0aC5wZGZcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vdGV4dC9iZXptYXRoLmh0bWxcbiAgICAvLyBTZXQgcDAgYW5kIHAxIHBvaW50XG4gICAgbGV0IHgwID0gMCwgeTAgPSAwLCB4MyA9IDEsIHkzID0gMSwgXG4gICAgLy8gQ29udmVydCB0aGUgY29vcmRpbmF0ZXMgdG8gZXF1YXRpb24gc3BhY2VcbiAgICBBID0geDMgLSAzICogeDIgKyAzICogeDEgLSB4MCwgQiA9IDMgKiB4MiAtIDYgKiB4MSArIDMgKiB4MCwgQyA9IDMgKiB4MSAtIDMgKiB4MCwgRCA9IHgwLCBFID0geTMgLSAzICogeTIgKyAzICogeTEgLSB5MCwgRiA9IDMgKiB5MiAtIDYgKiB5MSArIDMgKiB5MCwgRyA9IDMgKiB5MSAtIDMgKiB5MCwgSCA9IHkwLCBcbiAgICAvLyBWYXJpYWJsZXMgZm9yIHRoZSBsb29wIGJlbG93XG4gICAgdCA9IHR4LCBpdGVyYXRpb25zID0gNSwgaSwgc2xvcGUsIHgsIHk7XG4gICAgLy8gTG9vcCB0aHJvdWdoIGEgZmV3IHRpbWVzIHRvIGdldCBhIG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZSwgYWNjb3JkaW5nIHRvIHRoZSBOZXd0b24tUmFwaHNvbiBtZXRob2RcbiAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05ld3RvbidzX21ldGhvZFxuICAgIGZvciAoaSA9IDA7IGkgPCBpdGVyYXRpb25zOyBpKyspIHtcbiAgICAgICAgLy8gVGhlIGN1cnZlJ3MgeCBlcXVhdGlvbiBmb3IgdGhlIGN1cnJlbnQgdGltZSB2YWx1ZVxuICAgICAgICB4ID0gQSAqIHQgKiB0ICogdCArIEIgKiB0ICogdCArIEMgKiB0ICsgRDtcbiAgICAgICAgLy8gVGhlIHNsb3BlIHdlIHdhbnQgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGRlcml2YXRlIG9mIHhcbiAgICAgICAgc2xvcGUgPSAxIC8gKDMgKiBBICogdCAqIHQgKyAyICogQiAqIHQgKyBDKTtcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IGVzdGltYXRlZCB0aW1lIHZhbHVlLCB3aGljaCB3aWxsIGJlIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgb25lIGJlZm9yZVxuICAgICAgICB0IC09ICh4IC0gdHgpICogc2xvcGU7XG4gICAgICAgIHQgPSB0ID4gMSA/IDEgOiB0IDwgMCA/IDAgOiB0O1xuICAgIH1cbiAgICAvLyBGaW5kIHRoZSB5IHZhbHVlIHRocm91Z2ggdGhlIGN1cnZlJ3MgeSBlcXVhdGlvbiwgd2l0aCB0aGUgbm93IG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZVxuICAgIHkgPSBNYXRoLmFicyhFICogdCAqIHQgKiB0ICsgRiAqIHQgKiB0ICsgRyAqIHQgKiBIKTtcbiAgICByZXR1cm4geTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb2ludHNBbG9uZ0N1YmljQmV6aWVyKHB0Q291bnQsIHB4VG9sZXJhbmNlLCBBeCwgQXksIEJ4LCBCeSwgQ3gsIEN5LCBEeCwgRHkpIHtcbiAgICBsZXQgZGVsdGFCQXggPSBCeCAtIEF4O1xuICAgIGxldCBkZWx0YUNCeCA9IEN4IC0gQng7XG4gICAgbGV0IGRlbHRhREN4ID0gRHggLSBDeDtcbiAgICBsZXQgZGVsdGFCQXkgPSBCeSAtIEF5O1xuICAgIGxldCBkZWx0YUNCeSA9IEN5IC0gQnk7XG4gICAgbGV0IGRlbHRhREN5ID0gRHkgLSBDeTtcbiAgICBsZXQgYXgsIGF5LCBieCwgYnksIGN4LCBjeTtcbiAgICBsZXQgbGFzdFggPSAtMTAwMDA7XG4gICAgbGV0IGxhc3RZID0gLTEwMDAwO1xuICAgIGxldCBwdHMgPSBbeyB4OiBBeCwgeTogQXkgfV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwdENvdW50OyBpKyspIHtcbiAgICAgICAgbGV0IHQgPSBpIC8gcHRDb3VudDtcbiAgICAgICAgYXggPSBBeCArIGRlbHRhQkF4ICogdDtcbiAgICAgICAgYnggPSBCeCArIGRlbHRhQ0J4ICogdDtcbiAgICAgICAgY3ggPSBDeCArIGRlbHRhREN4ICogdDtcbiAgICAgICAgYXggKz0gKGJ4IC0gYXgpICogdDtcbiAgICAgICAgYnggKz0gKGN4IC0gYngpICogdDtcbiAgICAgICAgYXkgPSBBeSArIGRlbHRhQkF5ICogdDtcbiAgICAgICAgYnkgPSBCeSArIGRlbHRhQ0J5ICogdDtcbiAgICAgICAgY3kgPSBDeSArIGRlbHRhREN5ICogdDtcbiAgICAgICAgYXkgKz0gKGJ5IC0gYXkpICogdDtcbiAgICAgICAgYnkgKz0gKGN5IC0gYnkpICogdDtcbiAgICAgICAgY29uc3QgeCA9IGF4ICsgKGJ4IC0gYXgpICogdDtcbiAgICAgICAgY29uc3QgeSA9IGF5ICsgKGJ5IC0gYXkpICogdDtcbiAgICAgICAgY29uc3QgZHggPSB4IC0gbGFzdFg7XG4gICAgICAgIGNvbnN0IGR5ID0geSAtIGxhc3RZO1xuICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPiBweFRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcHRzLnB1c2goeyB4OiB4LCB5OiB5IH0pO1xuICAgICAgICAgICAgbGFzdFggPSB4O1xuICAgICAgICAgICAgbGFzdFkgPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHB0cy5wdXNoKHsgeDogRHgsIHk6IER5IH0pO1xuICAgIHJldHVybiBwdHM7XG59XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgYzAsIGMxLCBwMSkge1xuICAgIC8vIDAgPD0gdCA8PSAxXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludGVycG9sYXRvcih0KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwb3coMSAtIHQsIDMpICogcDAueCArXG4gICAgICAgICAgICAgICAgMyAqIHBvdygxIC0gdCwgMikgKiB0ICogYzAueCArXG4gICAgICAgICAgICAgICAgMyAqICgxIC0gdCkgKiBwb3codCwgMikgKiBjMS54ICtcbiAgICAgICAgICAgICAgICBwb3codCwgMykgKiBwMS54LFxuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueSArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueSxcbiAgICAgICAgXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFZlY3RvcnMoYSwgYikge1xuICAgIGlmICghYilcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgcmV0dXJuIHsgeDogYS54ICsgYi54LCB5OiBhLnkgKyBiLnkgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpIHtcbiAgICBpZiAoc3Ryb2tlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgY29uc3QgZCA9IFtdO1xuICAgIGxldCBbcDAsIHAxXSA9IHN0cm9rZTtcbiAgICBkLnB1c2goXCJNXCIsIHAwWzBdLCBwMFsxXSk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzdHJva2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZC5wdXNoKFwiUVwiLCBwMFswXSwgcDBbMV0sIChwMFswXSArIHAxWzBdKSAvIDIsIChwMFsxXSArIHAxWzFdKSAvIDIpO1xuICAgICAgICBwMCA9IHAxO1xuICAgICAgICBwMSA9IHN0cm9rZVtpXTtcbiAgICB9XG4gICAgZC5wdXNoKFwiWlwiKTtcbiAgICByZXR1cm4gZC5qb2luKFwiIFwiKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRGbGF0U3ZnUGF0aEZyb21TdHJva2Uoc3Ryb2tlKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcG9seSA9IHBvbHlnb25DbGlwcGluZy51bmlvbihbc3Ryb2tlXSk7XG4gICAgICAgIGNvbnN0IGQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgZmFjZSBvZiBwb2x5KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBwb2ludHMgb2YgZmFjZSkge1xuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKHBvaW50c1swXSk7XG4gICAgICAgICAgICAgICAgZC5wdXNoKGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHBvaW50cykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGQucHVzaChcIlpcIik7XG4gICAgICAgIHJldHVybiBkLmpvaW4oXCIgXCIpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiQ291bGQgbm90IGNsaXAgcGF0aC5cIik7XG4gICAgICAgIHJldHVybiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=