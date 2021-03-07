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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/plugin.ts");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/plugin/plugin.ts":
/*!******************************!*\
  !*** ./src/plugin/plugin.ts ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ "./src/types.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");
/* harmony import */ var perfect_freehand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! perfect-freehand */ "./node_modules/perfect-freehand/dist/perfect-freehand.esm.js");



const SPLIT = 10;
const EASINGS = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => t * (2 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};
const previousNodes = {};
// Sends a message to the plugin UI
function postMessage({ type, payload }) {
    figma.ui.postMessage({ type, payload });
}
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
// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedAppliedNodeIds() {
    return getSelectedNodeIds().filter((id) => previousNodes[id] !== undefined);
}
// Zooms the Figma viewport to a node
function zoomToNode(id) {
    const node = figma.getNodeById(id);
    if (!node)
        return;
    figma.viewport.scrollAndZoomIntoView([node]);
}
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
function setInitialNodes(nodeIds) {
    for (let id of nodeIds) {
        if (previousNodes[id] === undefined) {
            const realNode = figma.getNodeById(id);
            if (!realNode)
                continue;
            const originalNode = realNode.getPluginData("perfect_freehand");
            if (originalNode) {
                previousNodes[id] = JSON.parse(originalNode);
            }
        }
    }
}
function sendSelectedNodes() {
    const selectedNodes = getSelectedNodes();
    setInitialNodes(selectedNodes.map((n) => n.id));
    postMessage({
        type: _types__WEBPACK_IMPORTED_MODULE_0__["WorkerActionTypes"].SELECTED_NODES,
        payload: selectedNodes,
    });
}
function resetVectorNodes(nodeIds) {
    setInitialNodes(nodeIds);
    for (let id of nodeIds) {
        const node = figma.getNodeById(id);
        if (!node)
            continue;
        const prev = previousNodes[id];
        node.vectorPaths = prev.vectorPaths;
        node.x = prev.x;
        node.y = prev.y;
    }
}
function applyPerfectFreehandToVectorNodes(nodeIds, { options, easing, }) {
    for (let id of nodeIds) {
        let node;
        if (previousNodes[id]) {
            node = previousNodes[id];
        }
        else {
            node = figma.getNodeById(id);
            previousNodes[id] = Object.assign(Object.assign({}, node), { x: node.x, y: node.y, width: node.width, height: node.height, vectorNetwork: Object.assign({}, node.vectorNetwork), vectorPaths: node.vectorPaths });
        }
        let { x, y, width, height } = node;
        // Create a copy of the original
        const pts = [];
        for (let segment of node.vectorNetwork.segments) {
            const p0 = node.vectorNetwork.vertices[segment.start];
            const p3 = node.vectorNetwork.vertices[segment.end];
            const p1 = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addVectors"])(p0, segment.tangentStart);
            const p2 = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["addVectors"])(p3, segment.tangentEnd);
            const interpolator = Object(_utils__WEBPACK_IMPORTED_MODULE_1__["interpolateCubicBezier"])(p0, p1, p2, p3);
            for (let i = 0; i < SPLIT; i++) {
                pts.push(interpolator(i / SPLIT));
            }
        }
        const stroke = Object(perfect_freehand__WEBPACK_IMPORTED_MODULE_2__["default"])(pts, Object.assign(Object.assign({}, options), { easing: EASINGS[easing] }));
        const applyNode = figma.getNodeById(id);
        if (applyNode && applyNode.type === "VECTOR") {
            applyNode.setPluginData("perfect_freehand", JSON.stringify(previousNodes[id]));
            applyNode.vectorPaths = [
                {
                    windingRule: "NONZERO",
                    data: Object(_utils__WEBPACK_IMPORTED_MODULE_1__["getSvgPathFromStroke"])(stroke),
                },
            ];
            applyNode.x = x + width / 2 - applyNode.width / 2;
            applyNode.y = y + height / 2 - applyNode.height / 2;
        }
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
            applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload);
            break;
        case _types__WEBPACK_IMPORTED_MODULE_0__["UIActionTypes"].UPDATED_OPTIONS:
            applyPerfectFreehandToVectorNodes(getSelectedAppliedNodeIds(), payload);
            break;
    }
};
// --- Messages from Figma --------------------------------------------
// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes);
// --- Kickoff --------------------------------------------------------
// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 400 });
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
/*! exports provided: cubicBezier, getPointsAlongCubicBezier, interpolateCubicBezier, addVectors, getSvgPathFromStroke */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cubicBezier", function() { return cubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPointsAlongCubicBezier", function() { return getPointsAlongCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateCubicBezier", function() { return interpolateCubicBezier; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addVectors", function() { return addVectors; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSvgPathFromStroke", function() { return getSvgPathFromStroke; });
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3BlcmZlY3QtZnJlZWhhbmQvZGlzdC9wZXJmZWN0LWZyZWVoYW5kLmVzbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGx1Z2luL3BsdWdpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvdHlwZXMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztB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QUFDQTtBQUNBO0FBQ0EsQ0FBQyw4Q0FBOEM7Ozs7Ozs7Ozs7Ozs7QUNmL0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBTyxNQUFNO0FBQ047QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnQkFBZ0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsZUFBZTtBQUMvQixtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixhQUFhO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxlQUFlO0FBQzdCO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BsdWdpbi9wbHVnaW4udHNcIik7XG4iLCJ2YXIgaHlwb3QgPSBNYXRoLmh5cG90LFxuICAgIGNvcyA9IE1hdGguY29zLFxuICAgIG1heCA9IE1hdGgubWF4LFxuICAgIG1pbiA9IE1hdGgubWluLFxuICAgIHNpbiA9IE1hdGguc2luLFxuICAgIGF0YW4yID0gTWF0aC5hdGFuMixcbiAgICBQSSA9IE1hdGguUEksXG4gICAgUEkyID0gUEkgKiAyO1xuZnVuY3Rpb24gbGVycCh5MSwgeTIsIG11KSB7XG4gIHJldHVybiB5MSAqICgxIC0gbXUpICsgeTIgKiBtdTtcbn1cbmZ1bmN0aW9uIHByb2plY3RQb2ludChwMCwgYSwgZCkge1xuICByZXR1cm4gW2NvcyhhKSAqIGQgKyBwMFswXSwgc2luKGEpICogZCArIHAwWzFdXTtcbn1cblxuZnVuY3Rpb24gc2hvcnRBbmdsZURpc3QoYTAsIGExKSB7XG4gIHZhciBtYXggPSBQSTI7XG4gIHZhciBkYSA9IChhMSAtIGEwKSAlIG1heDtcbiAgcmV0dXJuIDIgKiBkYSAlIG1heCAtIGRhO1xufVxuXG5mdW5jdGlvbiBnZXRBbmdsZURlbHRhKGEwLCBhMSkge1xuICByZXR1cm4gc2hvcnRBbmdsZURpc3QoYTAsIGExKTtcbn1cbmZ1bmN0aW9uIGxlcnBBbmdsZXMoYTAsIGExLCB0KSB7XG4gIHJldHVybiBhMCArIHNob3J0QW5nbGVEaXN0KGEwLCBhMSkgKiB0O1xufVxuZnVuY3Rpb24gZ2V0UG9pbnRCZXR3ZWVuKHAwLCBwMSwgZCkge1xuICBpZiAoZCA9PT0gdm9pZCAwKSB7XG4gICAgZCA9IDAuNTtcbiAgfVxuXG4gIHJldHVybiBbcDBbMF0gKyAocDFbMF0gLSBwMFswXSkgKiBkLCBwMFsxXSArIChwMVsxXSAtIHAwWzFdKSAqIGRdO1xufVxuZnVuY3Rpb24gZ2V0QW5nbGUocDAsIHAxKSB7XG4gIHJldHVybiBhdGFuMihwMVsxXSAtIHAwWzFdLCBwMVswXSAtIHAwWzBdKTtcbn1cbmZ1bmN0aW9uIGdldERpc3RhbmNlKHAwLCBwMSkge1xuICByZXR1cm4gaHlwb3QocDFbMV0gLSBwMFsxXSwgcDFbMF0gLSBwMFswXSk7XG59XG5mdW5jdGlvbiBjbGFtcChuLCBhLCBiKSB7XG4gIHJldHVybiBtYXgoYSwgbWluKGIsIG4pKTtcbn1cbmZ1bmN0aW9uIHRvUG9pbnRzQXJyYXkocG9pbnRzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHBvaW50c1swXSkpIHtcbiAgICByZXR1cm4gcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHggPSBfcmVmWzBdLFxuICAgICAgICAgIHkgPSBfcmVmWzFdLFxuICAgICAgICAgIF9yZWYkID0gX3JlZlsyXSxcbiAgICAgICAgICBwcmVzc3VyZSA9IF9yZWYkID09PSB2b2lkIDAgPyAwLjUgOiBfcmVmJDtcbiAgICAgIHJldHVybiBbeCwgeSwgcHJlc3N1cmVdO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwb2ludHMubWFwKGZ1bmN0aW9uIChfcmVmMikge1xuICAgICAgdmFyIHggPSBfcmVmMi54LFxuICAgICAgICAgIHkgPSBfcmVmMi55LFxuICAgICAgICAgIF9yZWYyJHByZXNzdXJlID0gX3JlZjIucHJlc3N1cmUsXG4gICAgICAgICAgcHJlc3N1cmUgPSBfcmVmMiRwcmVzc3VyZSA9PT0gdm9pZCAwID8gMC41IDogX3JlZjIkcHJlc3N1cmU7XG4gICAgICByZXR1cm4gW3gsIHksIHByZXNzdXJlXTtcbiAgICB9KTtcbiAgfVxufVxuXG52YXIgYWJzID0gTWF0aC5hYnMsXG4gICAgbWluJDEgPSBNYXRoLm1pbixcbiAgICBQSSQxID0gTWF0aC5QSSxcbiAgICBUQVUgPSBQSSQxIC8gMixcbiAgICBTSEFSUCA9IFRBVSxcbiAgICBEVUxMID0gU0hBUlAgLyAyO1xuXG5mdW5jdGlvbiBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgcHJlc3N1cmUpIHtcbiAgaWYgKHByZXNzdXJlID09PSB2b2lkIDApIHtcbiAgICBwcmVzc3VyZSA9IDAuNTtcbiAgfVxuXG4gIGlmICh0aGlubmluZyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gc2l6ZSAvIDI7XG4gIHByZXNzdXJlID0gY2xhbXAoZWFzaW5nKHByZXNzdXJlKSwgMCwgMSk7XG4gIHJldHVybiAodGhpbm5pbmcgPCAwID8gbGVycChzaXplLCBzaXplICsgc2l6ZSAqIGNsYW1wKHRoaW5uaW5nLCAtMC45NSwgLTAuMDUpLCBwcmVzc3VyZSkgOiBsZXJwKHNpemUgLSBzaXplICogY2xhbXAodGhpbm5pbmcsIDAuMDUsIDAuOTUpLCBzaXplLCBwcmVzc3VyZSkpIC8gMjtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBwb2ludHMgZm9yIGEgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gc3RyZWFtbGluZSBIb3cgbXVjaCB0byBzdHJlYW1saW5lIHRoZSBzdHJva2UuXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGdldFN0cm9rZVBvaW50cyhwb2ludHMsIHN0cmVhbWxpbmUpIHtcbiAgaWYgKHN0cmVhbWxpbmUgPT09IHZvaWQgMCkge1xuICAgIHN0cmVhbWxpbmUgPSAwLjU7XG4gIH1cblxuICB2YXIgcHRzID0gdG9Qb2ludHNBcnJheShwb2ludHMpO1xuICBpZiAocHRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuICBwdHNbMF0gPSBbcHRzWzBdWzBdLCBwdHNbMF1bMV0sIHB0c1swXVsyXSB8fCAwLjUsIDAsIDAsIDBdO1xuXG4gIGZvciAodmFyIGkgPSAxLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzWzBdOyBpIDwgcHRzLmxlbmd0aDsgaSsrLCBjdXJyID0gcHRzW2ldLCBwcmV2ID0gcHRzW2kgLSAxXSkge1xuICAgIGN1cnJbMF0gPSBsZXJwKHByZXZbMF0sIGN1cnJbMF0sIDEgLSBzdHJlYW1saW5lKTtcbiAgICBjdXJyWzFdID0gbGVycChwcmV2WzFdLCBjdXJyWzFdLCAxIC0gc3RyZWFtbGluZSk7XG4gICAgY3VyclszXSA9IGdldEFuZ2xlKGN1cnIsIHByZXYpO1xuICAgIGN1cnJbNF0gPSBnZXREaXN0YW5jZShjdXJyLCBwcmV2KTtcbiAgICBjdXJyWzVdID0gcHJldls1XSArIGN1cnJbNF07XG4gIH1cblxuICByZXR1cm4gcHRzO1xufVxuLyoqXHJcbiAqICMjIGdldFN0cm9rZU91dGxpbmVQb2ludHNcclxuICogQGRlc2NyaXB0aW9uIEdldCBhbiBhcnJheSBvZiBwb2ludHMgKGFzIGBbeCwgeV1gKSByZXByZXNlbnRpbmcgdGhlIG91dGxpbmUgb2YgYSBzdHJva2UuXHJcbiAqIEBwYXJhbSBwb2ludHMgQW4gYXJyYXkgb2YgcG9pbnRzIChhcyBgW3gsIHksIHByZXNzdXJlXWAgb3IgYHt4LCB5LCBwcmVzc3VyZX1gKS4gUHJlc3N1cmUgaXMgb3B0aW9uYWwuXHJcbiAqIEBwYXJhbSBvcHRpb25zIEFuIChvcHRpb25hbCkgb2JqZWN0IHdpdGggb3B0aW9ucy5cclxuICogQHBhcmFtIG9wdGlvbnMuc2l6ZVx0VGhlIGJhc2Ugc2l6ZSAoZGlhbWV0ZXIpIG9mIHRoZSBzdHJva2UuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnRoaW5uaW5nIFRoZSBlZmZlY3Qgb2YgcHJlc3N1cmUgb24gdGhlIHN0cm9rZSdzIHNpemUuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNtb290aGluZ1x0SG93IG11Y2ggdG8gc29mdGVuIHRoZSBzdHJva2UncyBlZGdlcy5cclxuICogQHBhcmFtIG9wdGlvbnMuZWFzaW5nXHRBbiBlYXNpbmcgZnVuY3Rpb24gdG8gYXBwbHkgdG8gZWFjaCBwb2ludCdzIHByZXNzdXJlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2VPdXRsaW5lUG9pbnRzKHBvaW50cywgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHNpemUgPSBfb3B0aW9ucy5zaXplLFxuICAgICAgc2l6ZSA9IF9vcHRpb25zJHNpemUgPT09IHZvaWQgMCA/IDggOiBfb3B0aW9ucyRzaXplLFxuICAgICAgX29wdGlvbnMkdGhpbm5pbmcgPSBfb3B0aW9ucy50aGlubmluZyxcbiAgICAgIHRoaW5uaW5nID0gX29wdGlvbnMkdGhpbm5pbmcgPT09IHZvaWQgMCA/IDAuNSA6IF9vcHRpb25zJHRoaW5uaW5nLFxuICAgICAgX29wdGlvbnMkc21vb3RoaW5nID0gX29wdGlvbnMuc21vb3RoaW5nLFxuICAgICAgc21vb3RoaW5nID0gX29wdGlvbnMkc21vb3RoaW5nID09PSB2b2lkIDAgPyAwLjUgOiBfb3B0aW9ucyRzbW9vdGhpbmcsXG4gICAgICBfb3B0aW9ucyRzaW11bGF0ZVByZXMgPSBfb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlLFxuICAgICAgc2ltdWxhdGVQcmVzc3VyZSA9IF9vcHRpb25zJHNpbXVsYXRlUHJlcyA9PT0gdm9pZCAwID8gdHJ1ZSA6IF9vcHRpb25zJHNpbXVsYXRlUHJlcyxcbiAgICAgIF9vcHRpb25zJGVhc2luZyA9IF9vcHRpb25zLmVhc2luZyxcbiAgICAgIGVhc2luZyA9IF9vcHRpb25zJGVhc2luZyA9PT0gdm9pZCAwID8gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdDtcbiAgfSA6IF9vcHRpb25zJGVhc2luZztcbiAgdmFyIGxlbiA9IHBvaW50cy5sZW5ndGgsXG4gICAgICB0b3RhbExlbmd0aCA9IHBvaW50c1tsZW4gLSAxXVs1XSxcbiAgICAgIC8vIFRoZSB0b3RhbCBsZW5ndGggb2YgdGhlIGxpbmVcbiAgbWluRGlzdCA9IHNpemUgKiBzbW9vdGhpbmcsXG4gICAgICAvLyBUaGUgbWluaW11bSBkaXN0YW5jZSBmb3IgbWVhc3VyZW1lbnRzXG4gIGxlZnRQdHMgPSBbXSxcbiAgICAgIC8vIE91ciBjb2xsZWN0ZWQgbGVmdCBhbmQgcmlnaHQgcG9pbnRzXG4gIHJpZ2h0UHRzID0gW107XG4gIHZhciBwbCA9IHBvaW50c1swXSxcbiAgICAgIC8vIFByZXZpb3VzIGxlZnQgYW5kIHJpZ2h0IHBvaW50c1xuICBwciA9IHBvaW50c1swXSxcbiAgICAgIHRsID0gcGwsXG4gICAgICAvLyBQb2ludHMgdG8gdGVzdCBkaXN0YW5jZSBmcm9tXG4gIHRyID0gcHIsXG4gICAgICBwYSA9IHByWzNdLFxuICAgICAgcHAgPSAwLFxuICAgICAgLy8gUHJldmlvdXMgKG1heWJlIHNpbXVsYXRlZCkgcHJlc3N1cmVcbiAgciA9IHNpemUgLyAyLFxuICAgICAgLy8gVGhlIGN1cnJlbnQgcG9pbnQgcmFkaXVzXG4gIF9zaG9ydCA9IHRydWU7IC8vIFdoZXRoZXIgdGhlIGxpbmUgaXMgZHJhd24gZmFyIGVub3VnaFxuICAvLyBXZSBjYW4ndCBkbyBhbnl0aGluZyB3aXRoIGFuIGVtcHR5IGFycmF5LlxuXG4gIGlmIChsZW4gPT09IDApIHtcbiAgICByZXR1cm4gW107XG4gIH0gLy8gSWYgdGhlIHBvaW50IGlzIG9ubHkgb25lIHBvaW50IGxvbmcsIGRyYXcgdHdvIGNhcHMgYXQgZWl0aGVyIGVuZC5cblxuXG4gIGlmIChsZW4gPT09IDEgfHwgdG90YWxMZW5ndGggPD0gNCkge1xuICAgIHZhciBmaXJzdCA9IHBvaW50c1swXSxcbiAgICAgICAgbGFzdCA9IHBvaW50c1tsZW4gLSAxXSxcbiAgICAgICAgYW5nbGUgPSBnZXRBbmdsZShmaXJzdCwgbGFzdCk7XG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIHIgPSBnZXRTdHJva2VSYWRpdXMoc2l6ZSwgdGhpbm5pbmcsIGVhc2luZywgbGFzdFsyXSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgdCA9IDAsIHN0ZXAgPSAwLjE7IHQgPD0gMTsgdCArPSBzdGVwKSB7XG4gICAgICB0bCA9IHByb2plY3RQb2ludChmaXJzdCwgYW5nbGUgKyBQSSQxICsgVEFVIC0gdCAqIFBJJDEsIHIpO1xuICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobGFzdCwgYW5nbGUgKyBUQVUgLSB0ICogUEkkMSwgcik7XG4gICAgICBsZWZ0UHRzLnB1c2godGwpO1xuICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRQdHMuY29uY2F0KHJpZ2h0UHRzKTtcbiAgfSAvLyBGb3IgYSBwb2ludCB3aXRoIG1vcmUgdGhhbiBvbmUgcG9pbnQsIGNyZWF0ZSBhbiBvdXRsaW5lIHNoYXBlLlxuXG5cbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBwcmV2ID0gcG9pbnRzW2kgLSAxXTtcbiAgICB2YXIgX3BvaW50cyRpID0gcG9pbnRzW2ldLFxuICAgICAgICB4ID0gX3BvaW50cyRpWzBdLFxuICAgICAgICB5ID0gX3BvaW50cyRpWzFdLFxuICAgICAgICBwcmVzc3VyZSA9IF9wb2ludHMkaVsyXSxcbiAgICAgICAgX2FuZ2xlID0gX3BvaW50cyRpWzNdLFxuICAgICAgICBkaXN0YW5jZSA9IF9wb2ludHMkaVs0XSxcbiAgICAgICAgY2xlbiA9IF9wb2ludHMkaVs1XTsgLy8gMS5cbiAgICAvLyBDYWxjdWxhdGUgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAodGhpbm5pbmcpIHtcbiAgICAgIGlmIChzaW11bGF0ZVByZXNzdXJlKSB7XG4gICAgICAgIC8vIFNpbXVsYXRlIHByZXNzdXJlIGJ5IGFjY2VsbGVyYXRpbmcgdGhlIHJlcG9ydGVkIHByZXNzdXJlLlxuICAgICAgICB2YXIgcnAgPSBtaW4kMSgxIC0gZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgdmFyIHNwID0gbWluJDEoZGlzdGFuY2UgLyBzaXplLCAxKTtcbiAgICAgICAgcHJlc3N1cmUgPSBtaW4kMSgxLCBwcCArIChycCAtIHBwKSAqIChzcCAvIDIpKTtcbiAgICAgIH0gLy8gQ29tcHV0ZSB0aGUgc3Ryb2tlIHJhZGl1cyBiYXNlZCBvbiB0aGUgcHJlc3N1cmUsIGVhc2luZyBhbmQgdGhpbm5pbmcuXG5cblxuICAgICAgciA9IGdldFN0cm9rZVJhZGl1cyhzaXplLCB0aGlubmluZywgZWFzaW5nLCBwcmVzc3VyZSk7XG4gICAgfSAvLyAyLlxuICAgIC8vIERyYXcgYSBjYXAgb25jZSB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cblxuXG4gICAgaWYgKF9zaG9ydCkge1xuICAgICAgaWYgKGNsZW4gPCBzaXplIC8gNCkgY29udGludWU7IC8vIFRoZSBmaXJzdCBwb2ludCBhZnRlciB3ZSd2ZSByZWFjaGVkIHRoZSBtaW5pbXVtIGxlbmd0aC5cbiAgICAgIC8vIERyYXcgYSBjYXAgYXQgdGhlIGZpcnN0IHBvaW50IGFuZ2xlZCB0b3dhcmQgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICAgIF9zaG9ydCA9IGZhbHNlO1xuXG4gICAgICBmb3IgKHZhciBfdCA9IDAsIF9zdGVwID0gMC4xOyBfdCA8PSAxOyBfdCArPSBfc3RlcCkge1xuICAgICAgICB0bCA9IHByb2plY3RQb2ludChwb2ludHNbMF0sIF9hbmdsZSArIFRBVSAtIF90ICogUEkkMSwgcik7XG4gICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICB9XG5cbiAgICAgIHRyID0gcHJvamVjdFBvaW50KHBvaW50c1swXSwgX2FuZ2xlICsgVEFVLCByKTtcbiAgICAgIHJpZ2h0UHRzLnB1c2godHIpO1xuICAgIH1cblxuICAgIF9hbmdsZSA9IGxlcnBBbmdsZXMocGEsIF9hbmdsZSwgMC43NSk7IC8vIDMuXG4gICAgLy8gQWRkIHBvaW50cyBmb3IgdGhlIGN1cnJlbnQgcG9pbnQuXG5cbiAgICBpZiAoaSA9PT0gbGVuIC0gMSkge1xuICAgICAgLy8gVGhlIGxhc3QgcG9pbnQgaW4gdGhlIGxpbmUuXG4gICAgICAvLyBBZGQgcG9pbnRzIGZvciBhbiBlbmQgY2FwLlxuICAgICAgZm9yICh2YXIgX3QyID0gMCwgX3N0ZXAyID0gMC4xOyBfdDIgPD0gMTsgX3QyICs9IF9zdGVwMikge1xuICAgICAgICByaWdodFB0cy5wdXNoKHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSArIF90MiAqIFBJJDEsIHIpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmluZCB0aGUgZGVsdGEgYmV0d2VlbiB0aGUgY3VycmVudCBhbmQgcHJldmlvdXMgYW5nbGUuXG4gICAgICB2YXIgZGVsdGEgPSBnZXRBbmdsZURlbHRhKHByZXZbM10sIF9hbmdsZSksXG4gICAgICAgICAgYWJzRGVsdGEgPSBhYnMoZGVsdGEpO1xuXG4gICAgICBpZiAoYWJzRGVsdGEgPiBTSEFSUCAmJiBjbGVuID4gcikge1xuICAgICAgICAvLyBBIHNoYXJwIGNvcm5lci5cbiAgICAgICAgLy8gUHJvamVjdCBwb2ludHMgKGxlZnQgYW5kIHJpZ2h0KSBmb3IgYSBjYXAuXG4gICAgICAgIHZhciBtaWQgPSBnZXRQb2ludEJldHdlZW4ocHJldiwgW3gsIHldKTtcblxuICAgICAgICBmb3IgKHZhciBfdDMgPSAwLCBfc3RlcDMgPSAwLjI1OyBfdDMgPD0gMTsgX3QzICs9IF9zdGVwMykge1xuICAgICAgICAgIHRsID0gcHJvamVjdFBvaW50KG1pZCwgcGEgLSBUQVUgKyBfdDMgKiAtUEkkMSwgcik7XG4gICAgICAgICAgdHIgPSBwcm9qZWN0UG9pbnQobWlkLCBwYSArIFRBVSArIF90MyAqIFBJJDEsIHIpO1xuICAgICAgICAgIGxlZnRQdHMucHVzaCh0bCk7XG4gICAgICAgICAgcmlnaHRQdHMucHVzaCh0cik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEEgcmVndWxhciBwb2ludC5cbiAgICAgICAgLy8gQWRkIHByb2plY3RlZCBwb2ludHMgbGVmdCBhbmQgcmlnaHQsIGlmIGZhciBlbm91Z2ggYXdheS5cbiAgICAgICAgcGwgPSBwcm9qZWN0UG9pbnQoW3gsIHldLCBfYW5nbGUgLSBUQVUsIHIpO1xuICAgICAgICBwciA9IHByb2plY3RQb2ludChbeCwgeV0sIF9hbmdsZSArIFRBVSwgcik7XG5cbiAgICAgICAgaWYgKGFic0RlbHRhID4gRFVMTCB8fCBnZXREaXN0YW5jZShwbCwgdGwpID4gbWluRGlzdCkge1xuICAgICAgICAgIGxlZnRQdHMucHVzaChnZXRQb2ludEJldHdlZW4odGwsIHBsKSk7XG4gICAgICAgICAgdGwgPSBwbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhYnNEZWx0YSA+IERVTEwgfHwgZ2V0RGlzdGFuY2UocHIsIHRyKSA+IG1pbkRpc3QpIHtcbiAgICAgICAgICByaWdodFB0cy5wdXNoKGdldFBvaW50QmV0d2Vlbih0ciwgcHIpKTtcbiAgICAgICAgICB0ciA9IHByO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHBwID0gcHJlc3N1cmU7XG4gICAgICBwYSA9IF9hbmdsZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGVmdFB0cy5jb25jYXQocmlnaHRQdHMucmV2ZXJzZSgpKTtcbn1cbi8qKlxyXG4gKiAjIyBnZXRTdHJva2VcclxuICogQGRlc2NyaXB0aW9uIFJldHVybnMgYSBzdHJva2UgYXMgYW4gYXJyYXkgb2YgcG9pbnRzLlxyXG4gKiBAcGFyYW0gcG9pbnRzIEFuIGFycmF5IG9mIHBvaW50cyAoYXMgYFt4LCB5LCBwcmVzc3VyZV1gIG9yIGB7eCwgeSwgcHJlc3N1cmV9YCkuIFByZXNzdXJlIGlzIG9wdGlvbmFsLlxyXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiAob3B0aW9uYWwpIG9iamVjdCB3aXRoIG9wdGlvbnMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnNpemVcdFRoZSBiYXNlIHNpemUgKGRpYW1ldGVyKSBvZiB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy50aGlubmluZyBUaGUgZWZmZWN0IG9mIHByZXNzdXJlIG9uIHRoZSBzdHJva2UncyBzaXplLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zbW9vdGhpbmdcdEhvdyBtdWNoIHRvIHNvZnRlbiB0aGUgc3Ryb2tlJ3MgZWRnZXMuXHJcbiAqIEBwYXJhbSBvcHRpb25zLnN0cmVhbWxpbmUgSG93IG11Y2ggdG8gc3RyZWFtbGluZSB0aGUgc3Ryb2tlLlxyXG4gKiBAcGFyYW0gb3B0aW9ucy5zaW11bGF0ZVByZXNzdXJlIFdoZXRoZXIgdG8gc2ltdWxhdGUgcHJlc3N1cmUgYmFzZWQgb24gdmVsb2NpdHkuXHJcbiAqL1xuXG5mdW5jdGlvbiBnZXRTdHJva2UocG9pbnRzLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICByZXR1cm4gZ2V0U3Ryb2tlT3V0bGluZVBvaW50cyhnZXRTdHJva2VQb2ludHMocG9pbnRzLCBvcHRpb25zLnN0cmVhbWxpbmUpLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U3Ryb2tlO1xuZXhwb3J0IHsgZ2V0U3Ryb2tlT3V0bGluZVBvaW50cywgZ2V0U3Ryb2tlUG9pbnRzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wZXJmZWN0LWZyZWVoYW5kLmVzbS5qcy5tYXBcbiIsImltcG9ydCB7IFVJQWN0aW9uVHlwZXMsIFdvcmtlckFjdGlvblR5cGVzLCB9IGZyb20gXCIuLi90eXBlc1wiO1xuaW1wb3J0IHsgZ2V0U3ZnUGF0aEZyb21TdHJva2UsIGFkZFZlY3RvcnMsIGludGVycG9sYXRlQ3ViaWNCZXppZXIsIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgZ2V0U3Ryb2tlIGZyb20gXCJwZXJmZWN0LWZyZWVoYW5kXCI7XG5jb25zdCBTUExJVCA9IDEwO1xuY29uc3QgRUFTSU5HUyA9IHtcbiAgICBsaW5lYXI6ICh0KSA9PiB0LFxuICAgIGVhc2VJbjogKHQpID0+IHQgKiB0LFxuICAgIGVhc2VPdXQ6ICh0KSA9PiB0ICogKDIgLSB0KSxcbiAgICBlYXNlSW5PdXQ6ICh0KSA9PiAodCA8IDAuNSA/IDIgKiB0ICogdCA6IC0xICsgKDQgLSAyICogdCkgKiB0KSxcbn07XG5jb25zdCBwcmV2aW91c05vZGVzID0ge307XG4vLyBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHBsdWdpbiBVSVxuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoeyB0eXBlLCBwYXlsb2FkIH0pIHtcbiAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGUsIHBheWxvYWQgfSk7XG59XG4vLyBHZXQgYWxsIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgRmlnbWEgbm9kZXMsIGZpbHRlcmVkXG4vLyB3aXRoIHRoZSBwcm92aWRlZCBhcnJheSBvZiBOb2RlVHlwZXMuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZE5vZGVzKCkge1xuICAgIHJldHVybiBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24uZmlsdGVyKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gXCJWRUNUT1JcIikubWFwKCh7IGlkLCBuYW1lLCB0eXBlIH0pID0+ICh7XG4gICAgICAgIGlkLFxuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlLFxuICAgIH0pKTtcbn1cbi8vIEdldCBhbGwgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBGaWdtYSBub2RlcywgZmlsdGVyZWRcbi8vIHdpdGggdGhlIHByb3ZpZGVkIGFycmF5IG9mIE5vZGVUeXBlcy5cbmZ1bmN0aW9uIGdldFNlbGVjdGVkTm9kZUlkcygpIHtcbiAgICByZXR1cm4gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmZpbHRlcigoeyB0eXBlIH0pID0+IHR5cGUgPT09IFwiVkVDVE9SXCIpLm1hcCgoeyBpZCB9KSA9PiBpZCk7XG59XG4vLyBHZXQgYWxsIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgRmlnbWEgbm9kZXMsIGZpbHRlcmVkXG4vLyB3aXRoIHRoZSBwcm92aWRlZCBhcnJheSBvZiBOb2RlVHlwZXMuXG5mdW5jdGlvbiBnZXRTZWxlY3RlZEFwcGxpZWROb2RlSWRzKCkge1xuICAgIHJldHVybiBnZXRTZWxlY3RlZE5vZGVJZHMoKS5maWx0ZXIoKGlkKSA9PiBwcmV2aW91c05vZGVzW2lkXSAhPT0gdW5kZWZpbmVkKTtcbn1cbi8vIFpvb21zIHRoZSBGaWdtYSB2aWV3cG9ydCB0byBhIG5vZGVcbmZ1bmN0aW9uIHpvb21Ub05vZGUoaWQpIHtcbiAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgIGlmICghbm9kZSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhbbm9kZV0pO1xufVxuLy8gRGVzZWxlY3RzIGEgRmlnbWEgbm9kZVxuZnVuY3Rpb24gZGVzZWxlY3ROb2RlKGlkKSB7XG4gICAgY29uc3Qgc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5maWx0ZXIoKG5vZGUpID0+IG5vZGUuaWQgIT09IGlkKTtcbn1cbi8vIFNlbmQgdGhlIGN1cnJlbnQgc2VsZWN0aW9uIHRvIHRoZSBVSSBzdGF0ZVxuZnVuY3Rpb24gc2VuZEluaXRpYWxTZWxlY3RlZE5vZGVzKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkTm9kZXMgPSBnZXRTZWxlY3RlZE5vZGVzKCk7XG4gICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICB0eXBlOiBXb3JrZXJBY3Rpb25UeXBlcy5GT1VORF9TRUxFQ1RFRF9OT0RFUyxcbiAgICAgICAgcGF5bG9hZDogc2VsZWN0ZWROb2RlcyxcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHNldEluaXRpYWxOb2Rlcyhub2RlSWRzKSB7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICBpZiAocHJldmlvdXNOb2Rlc1tpZF0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcmVhbE5vZGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgICAgICBpZiAoIXJlYWxOb2RlKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxOb2RlID0gcmVhbE5vZGUuZ2V0UGx1Z2luRGF0YShcInBlcmZlY3RfZnJlZWhhbmRcIik7XG4gICAgICAgICAgICBpZiAob3JpZ2luYWxOb2RlKSB7XG4gICAgICAgICAgICAgICAgcHJldmlvdXNOb2Rlc1tpZF0gPSBKU09OLnBhcnNlKG9yaWdpbmFsTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzZW5kU2VsZWN0ZWROb2RlcygpIHtcbiAgICBjb25zdCBzZWxlY3RlZE5vZGVzID0gZ2V0U2VsZWN0ZWROb2RlcygpO1xuICAgIHNldEluaXRpYWxOb2RlcyhzZWxlY3RlZE5vZGVzLm1hcCgobikgPT4gbi5pZCkpO1xuICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgdHlwZTogV29ya2VyQWN0aW9uVHlwZXMuU0VMRUNURURfTk9ERVMsXG4gICAgICAgIHBheWxvYWQ6IHNlbGVjdGVkTm9kZXMsXG4gICAgfSk7XG59XG5mdW5jdGlvbiByZXNldFZlY3Rvck5vZGVzKG5vZGVJZHMpIHtcbiAgICBzZXRJbml0aWFsTm9kZXMobm9kZUlkcyk7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICBpZiAoIW5vZGUpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgcHJldiA9IHByZXZpb3VzTm9kZXNbaWRdO1xuICAgICAgICBub2RlLnZlY3RvclBhdGhzID0gcHJldi52ZWN0b3JQYXRocztcbiAgICAgICAgbm9kZS54ID0gcHJldi54O1xuICAgICAgICBub2RlLnkgPSBwcmV2Lnk7XG4gICAgfVxufVxuZnVuY3Rpb24gYXBwbHlQZXJmZWN0RnJlZWhhbmRUb1ZlY3Rvck5vZGVzKG5vZGVJZHMsIHsgb3B0aW9ucywgZWFzaW5nLCB9KSB7XG4gICAgZm9yIChsZXQgaWQgb2Ygbm9kZUlkcykge1xuICAgICAgICBsZXQgbm9kZTtcbiAgICAgICAgaWYgKHByZXZpb3VzTm9kZXNbaWRdKSB7XG4gICAgICAgICAgICBub2RlID0gcHJldmlvdXNOb2Rlc1tpZF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQoaWQpO1xuICAgICAgICAgICAgcHJldmlvdXNOb2Rlc1tpZF0gPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG5vZGUpLCB7IHg6IG5vZGUueCwgeTogbm9kZS55LCB3aWR0aDogbm9kZS53aWR0aCwgaGVpZ2h0OiBub2RlLmhlaWdodCwgdmVjdG9yTmV0d29yazogT2JqZWN0LmFzc2lnbih7fSwgbm9kZS52ZWN0b3JOZXR3b3JrKSwgdmVjdG9yUGF0aHM6IG5vZGUudmVjdG9yUGF0aHMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHsgeCwgeSwgd2lkdGgsIGhlaWdodCB9ID0gbm9kZTtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgb3JpZ2luYWxcbiAgICAgICAgY29uc3QgcHRzID0gW107XG4gICAgICAgIGZvciAobGV0IHNlZ21lbnQgb2Ygbm9kZS52ZWN0b3JOZXR3b3JrLnNlZ21lbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBwMCA9IG5vZGUudmVjdG9yTmV0d29yay52ZXJ0aWNlc1tzZWdtZW50LnN0YXJ0XTtcbiAgICAgICAgICAgIGNvbnN0IHAzID0gbm9kZS52ZWN0b3JOZXR3b3JrLnZlcnRpY2VzW3NlZ21lbnQuZW5kXTtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gYWRkVmVjdG9ycyhwMCwgc2VnbWVudC50YW5nZW50U3RhcnQpO1xuICAgICAgICAgICAgY29uc3QgcDIgPSBhZGRWZWN0b3JzKHAzLCBzZWdtZW50LnRhbmdlbnRFbmQpO1xuICAgICAgICAgICAgY29uc3QgaW50ZXJwb2xhdG9yID0gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgcDEsIHAyLCBwMyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFNQTElUOyBpKyspIHtcbiAgICAgICAgICAgICAgICBwdHMucHVzaChpbnRlcnBvbGF0b3IoaSAvIFNQTElUKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3Ryb2tlID0gZ2V0U3Ryb2tlKHB0cywgT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKSwgeyBlYXNpbmc6IEVBU0lOR1NbZWFzaW5nXSB9KSk7XG4gICAgICAgIGNvbnN0IGFwcGx5Tm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICAgICAgaWYgKGFwcGx5Tm9kZSAmJiBhcHBseU5vZGUudHlwZSA9PT0gXCJWRUNUT1JcIikge1xuICAgICAgICAgICAgYXBwbHlOb2RlLnNldFBsdWdpbkRhdGEoXCJwZXJmZWN0X2ZyZWVoYW5kXCIsIEpTT04uc3RyaW5naWZ5KHByZXZpb3VzTm9kZXNbaWRdKSk7XG4gICAgICAgICAgICBhcHBseU5vZGUudmVjdG9yUGF0aHMgPSBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB3aW5kaW5nUnVsZTogXCJOT05aRVJPXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IGdldFN2Z1BhdGhGcm9tU3Ryb2tlKHN0cm9rZSksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICBhcHBseU5vZGUueCA9IHggKyB3aWR0aCAvIDIgLSBhcHBseU5vZGUud2lkdGggLyAyO1xuICAgICAgICAgICAgYXBwbHlOb2RlLnkgPSB5ICsgaGVpZ2h0IC8gMiAtIGFwcGx5Tm9kZS5oZWlnaHQgLyAyO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8gLS0tIE1lc3NhZ2VzIGZyb20gdGhlIFVJIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTGlzdGVuIHRvIG1lc3NhZ2VzIHJlY2VpdmVkIGZyb20gdGhlIHBsdWdpbiBVSSAoc3JjL3VpL3VpLnRzKVxuZmlnbWEudWkub25tZXNzYWdlID0gZnVuY3Rpb24gKHsgdHlwZSwgcGF5bG9hZCB9KSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgVUlBY3Rpb25UeXBlcy5DTE9TRTpcbiAgICAgICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlpPT01fVE9fTk9ERTpcbiAgICAgICAgICAgIHpvb21Ub05vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLkRFU0VMRUNUX05PREU6XG4gICAgICAgICAgICBkZXNlbGVjdE5vZGUocGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlJFU0VUX05PREVTOlxuICAgICAgICAgICAgcmVzZXRWZWN0b3JOb2RlcyhnZXRTZWxlY3RlZE5vZGVJZHMoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlRSQU5TRk9STV9OT0RFUzpcbiAgICAgICAgICAgIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2RlcyhnZXRTZWxlY3RlZE5vZGVJZHMoKSwgcGF5bG9hZCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBVSUFjdGlvblR5cGVzLlVQREFURURfT1BUSU9OUzpcbiAgICAgICAgICAgIGFwcGx5UGVyZmVjdEZyZWVoYW5kVG9WZWN0b3JOb2RlcyhnZXRTZWxlY3RlZEFwcGxpZWROb2RlSWRzKCksIHBheWxvYWQpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufTtcbi8vIC0tLSBNZXNzYWdlcyBmcm9tIEZpZ21hIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBMaXN0ZW4gZm9yIHNlbGVjdGlvbiBjaGFuZ2VzXG5maWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCBzZW5kU2VsZWN0ZWROb2Rlcyk7XG4vLyAtLS0gS2lja29mZiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2hvdyB0aGUgcGx1Z2luIGludGVyZmFjZVxuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogNDAwIH0pO1xuLy8gU2VuZCB0aGUgY3VycmVudCBzZWxlY3Rpb24gdG8gdGhlIFVJXG5zZW5kSW5pdGlhbFNlbGVjdGVkTm9kZXMoKTtcbiIsIi8vIFVJIGFjdGlvbnNcbmV4cG9ydCB2YXIgVUlBY3Rpb25UeXBlcztcbihmdW5jdGlvbiAoVUlBY3Rpb25UeXBlcykge1xuICAgIFVJQWN0aW9uVHlwZXNbXCJDTE9TRVwiXSA9IFwiQ0xPU0VcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiWk9PTV9UT19OT0RFXCJdID0gXCJaT09NX1RPX05PREVcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiREVTRUxFQ1RfTk9ERVwiXSA9IFwiREVTRUxFQ1RfTk9ERVwiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJUUkFOU0ZPUk1fTk9ERVNcIl0gPSBcIlRSQU5TRk9STV9OT0RFU1wiO1xuICAgIFVJQWN0aW9uVHlwZXNbXCJSRVNFVF9OT0RFU1wiXSA9IFwiUkVTRVRfTk9ERVNcIjtcbiAgICBVSUFjdGlvblR5cGVzW1wiVVBEQVRFRF9PUFRJT05TXCJdID0gXCJVUERBVEVEX09QVElPTlNcIjtcbn0pKFVJQWN0aW9uVHlwZXMgfHwgKFVJQWN0aW9uVHlwZXMgPSB7fSkpO1xuLy8gV29ya2VyIGFjdGlvbnNcbmV4cG9ydCB2YXIgV29ya2VyQWN0aW9uVHlwZXM7XG4oZnVuY3Rpb24gKFdvcmtlckFjdGlvblR5cGVzKSB7XG4gICAgV29ya2VyQWN0aW9uVHlwZXNbXCJTRUxFQ1RFRF9OT0RFU1wiXSA9IFwiU0VMRUNURURfTk9ERVNcIjtcbiAgICBXb3JrZXJBY3Rpb25UeXBlc1tcIkZPVU5EX1NFTEVDVEVEX05PREVTXCJdID0gXCJGT1VORF9TRUxFQ1RFRF9OT0RFU1wiO1xufSkoV29ya2VyQWN0aW9uVHlwZXMgfHwgKFdvcmtlckFjdGlvblR5cGVzID0ge30pKTtcbiIsImNvbnN0IHsgcG93IH0gPSBNYXRoO1xuZXhwb3J0IGZ1bmN0aW9uIGN1YmljQmV6aWVyKHR4LCB4MSwgeTEsIHgyLCB5Mikge1xuICAgIC8vIEluc3BpcmVkIGJ5IERvbiBMYW5jYXN0ZXIncyB0d28gYXJ0aWNsZXNcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vZ2xpYi9jdWJlbWF0aC5wZGZcbiAgICAvLyBodHRwOi8vd3d3LnRpbmFqYS5jb20vdGV4dC9iZXptYXRoLmh0bWxcbiAgICAvLyBTZXQgcDAgYW5kIHAxIHBvaW50XG4gICAgbGV0IHgwID0gMCwgeTAgPSAwLCB4MyA9IDEsIHkzID0gMSwgXG4gICAgLy8gQ29udmVydCB0aGUgY29vcmRpbmF0ZXMgdG8gZXF1YXRpb24gc3BhY2VcbiAgICBBID0geDMgLSAzICogeDIgKyAzICogeDEgLSB4MCwgQiA9IDMgKiB4MiAtIDYgKiB4MSArIDMgKiB4MCwgQyA9IDMgKiB4MSAtIDMgKiB4MCwgRCA9IHgwLCBFID0geTMgLSAzICogeTIgKyAzICogeTEgLSB5MCwgRiA9IDMgKiB5MiAtIDYgKiB5MSArIDMgKiB5MCwgRyA9IDMgKiB5MSAtIDMgKiB5MCwgSCA9IHkwLCBcbiAgICAvLyBWYXJpYWJsZXMgZm9yIHRoZSBsb29wIGJlbG93XG4gICAgdCA9IHR4LCBpdGVyYXRpb25zID0gNSwgaSwgc2xvcGUsIHgsIHk7XG4gICAgLy8gTG9vcCB0aHJvdWdoIGEgZmV3IHRpbWVzIHRvIGdldCBhIG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZSwgYWNjb3JkaW5nIHRvIHRoZSBOZXd0b24tUmFwaHNvbiBtZXRob2RcbiAgICAvLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05ld3RvbidzX21ldGhvZFxuICAgIGZvciAoaSA9IDA7IGkgPCBpdGVyYXRpb25zOyBpKyspIHtcbiAgICAgICAgLy8gVGhlIGN1cnZlJ3MgeCBlcXVhdGlvbiBmb3IgdGhlIGN1cnJlbnQgdGltZSB2YWx1ZVxuICAgICAgICB4ID0gQSAqIHQgKiB0ICogdCArIEIgKiB0ICogdCArIEMgKiB0ICsgRDtcbiAgICAgICAgLy8gVGhlIHNsb3BlIHdlIHdhbnQgaXMgdGhlIGludmVyc2Ugb2YgdGhlIGRlcml2YXRlIG9mIHhcbiAgICAgICAgc2xvcGUgPSAxIC8gKDMgKiBBICogdCAqIHQgKyAyICogQiAqIHQgKyBDKTtcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IGVzdGltYXRlZCB0aW1lIHZhbHVlLCB3aGljaCB3aWxsIGJlIG1vcmUgYWNjdXJhdGUgdGhhbiB0aGUgb25lIGJlZm9yZVxuICAgICAgICB0IC09ICh4IC0gdHgpICogc2xvcGU7XG4gICAgICAgIHQgPSB0ID4gMSA/IDEgOiB0IDwgMCA/IDAgOiB0O1xuICAgIH1cbiAgICAvLyBGaW5kIHRoZSB5IHZhbHVlIHRocm91Z2ggdGhlIGN1cnZlJ3MgeSBlcXVhdGlvbiwgd2l0aCB0aGUgbm93IG1vcmUgYWNjdXJhdGUgdGltZSB2YWx1ZVxuICAgIHkgPSBNYXRoLmFicyhFICogdCAqIHQgKiB0ICsgRiAqIHQgKiB0ICsgRyAqIHQgKiBIKTtcbiAgICByZXR1cm4geTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRQb2ludHNBbG9uZ0N1YmljQmV6aWVyKHB0Q291bnQsIHB4VG9sZXJhbmNlLCBBeCwgQXksIEJ4LCBCeSwgQ3gsIEN5LCBEeCwgRHkpIHtcbiAgICBsZXQgZGVsdGFCQXggPSBCeCAtIEF4O1xuICAgIGxldCBkZWx0YUNCeCA9IEN4IC0gQng7XG4gICAgbGV0IGRlbHRhREN4ID0gRHggLSBDeDtcbiAgICBsZXQgZGVsdGFCQXkgPSBCeSAtIEF5O1xuICAgIGxldCBkZWx0YUNCeSA9IEN5IC0gQnk7XG4gICAgbGV0IGRlbHRhREN5ID0gRHkgLSBDeTtcbiAgICBsZXQgYXgsIGF5LCBieCwgYnksIGN4LCBjeTtcbiAgICBsZXQgbGFzdFggPSAtMTAwMDA7XG4gICAgbGV0IGxhc3RZID0gLTEwMDAwO1xuICAgIGxldCBwdHMgPSBbeyB4OiBBeCwgeTogQXkgfV07XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwdENvdW50OyBpKyspIHtcbiAgICAgICAgbGV0IHQgPSBpIC8gcHRDb3VudDtcbiAgICAgICAgYXggPSBBeCArIGRlbHRhQkF4ICogdDtcbiAgICAgICAgYnggPSBCeCArIGRlbHRhQ0J4ICogdDtcbiAgICAgICAgY3ggPSBDeCArIGRlbHRhREN4ICogdDtcbiAgICAgICAgYXggKz0gKGJ4IC0gYXgpICogdDtcbiAgICAgICAgYnggKz0gKGN4IC0gYngpICogdDtcbiAgICAgICAgYXkgPSBBeSArIGRlbHRhQkF5ICogdDtcbiAgICAgICAgYnkgPSBCeSArIGRlbHRhQ0J5ICogdDtcbiAgICAgICAgY3kgPSBDeSArIGRlbHRhREN5ICogdDtcbiAgICAgICAgYXkgKz0gKGJ5IC0gYXkpICogdDtcbiAgICAgICAgYnkgKz0gKGN5IC0gYnkpICogdDtcbiAgICAgICAgY29uc3QgeCA9IGF4ICsgKGJ4IC0gYXgpICogdDtcbiAgICAgICAgY29uc3QgeSA9IGF5ICsgKGJ5IC0gYXkpICogdDtcbiAgICAgICAgY29uc3QgZHggPSB4IC0gbGFzdFg7XG4gICAgICAgIGNvbnN0IGR5ID0geSAtIGxhc3RZO1xuICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPiBweFRvbGVyYW5jZSkge1xuICAgICAgICAgICAgcHRzLnB1c2goeyB4OiB4LCB5OiB5IH0pO1xuICAgICAgICAgICAgbGFzdFggPSB4O1xuICAgICAgICAgICAgbGFzdFkgPSB5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHB0cy5wdXNoKHsgeDogRHgsIHk6IER5IH0pO1xuICAgIHJldHVybiBwdHM7XG59XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJwb2xhdGVDdWJpY0JlemllcihwMCwgYzAsIGMxLCBwMSkge1xuICAgIC8vIDAgPD0gdCA8PSAxXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludGVycG9sYXRvcih0KSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwb3coMSAtIHQsIDMpICogcDAueCArXG4gICAgICAgICAgICAgICAgMyAqIHBvdygxIC0gdCwgMikgKiB0ICogYzAueCArXG4gICAgICAgICAgICAgICAgMyAqICgxIC0gdCkgKiBwb3codCwgMikgKiBjMS54ICtcbiAgICAgICAgICAgICAgICBwb3codCwgMykgKiBwMS54LFxuICAgICAgICAgICAgcG93KDEgLSB0LCAzKSAqIHAwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiBwb3coMSAtIHQsIDIpICogdCAqIGMwLnkgK1xuICAgICAgICAgICAgICAgIDMgKiAoMSAtIHQpICogcG93KHQsIDIpICogYzEueSArXG4gICAgICAgICAgICAgICAgcG93KHQsIDMpICogcDEueSxcbiAgICAgICAgXTtcbiAgICB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFZlY3RvcnMoYSwgYikge1xuICAgIGlmICghYilcbiAgICAgICAgcmV0dXJuIGE7XG4gICAgcmV0dXJuIHsgeDogYS54ICsgYi54LCB5OiBhLnkgKyBiLnkgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdmdQYXRoRnJvbVN0cm9rZShzdHJva2UpIHtcbiAgICBpZiAoc3Ryb2tlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgY29uc3QgZCA9IFtdO1xuICAgIGxldCBbcDAsIHAxXSA9IHN0cm9rZTtcbiAgICBkLnB1c2goXCJNXCIsIHAwWzBdLCBwMFsxXSk7XG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBzdHJva2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZC5wdXNoKFwiUVwiLCBwMFswXSwgcDBbMV0sIChwMFswXSArIHAxWzBdKSAvIDIsIChwMFsxXSArIHAxWzFdKSAvIDIpO1xuICAgICAgICBwMCA9IHAxO1xuICAgICAgICBwMSA9IHN0cm9rZVtpXTtcbiAgICB9XG4gICAgZC5wdXNoKFwiWlwiKTtcbiAgICByZXR1cm4gZC5qb2luKFwiIFwiKTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=