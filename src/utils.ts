// import polygonClipping from "polygon-clipping"

const { pow } = Math

export function cubicBezier(
  tx: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  // Inspired by Don Lancaster's two articles
  // http://www.tinaja.com/glib/cubemath.pdf
  // http://www.tinaja.com/text/bezmath.html

  // Set p0 and p1 point
  let x0 = 0,
    y0 = 0,
    x3 = 1,
    y3 = 1,
    // Convert the coordinates to equation space
    A = x3 - 3 * x2 + 3 * x1 - x0,
    B = 3 * x2 - 6 * x1 + 3 * x0,
    C = 3 * x1 - 3 * x0,
    D = x0,
    E = y3 - 3 * y2 + 3 * y1 - y0,
    F = 3 * y2 - 6 * y1 + 3 * y0,
    G = 3 * y1 - 3 * y0,
    H = y0,
    // Variables for the loop below
    t = tx,
    iterations = 5,
    i: number,
    slope: number,
    x: number,
    y: number

  // Loop through a few times to get a more accurate time value, according to the Newton-Raphson method
  // http://en.wikipedia.org/wiki/Newton's_method
  for (i = 0; i < iterations; i++) {
    // The curve's x equation for the current time value
    x = A * t * t * t + B * t * t + C * t + D

    // The slope we want is the inverse of the derivate of x
    slope = 1 / (3 * A * t * t + 2 * B * t + C)

    // Get the next estimated time value, which will be more accurate than the one before
    t -= (x - tx) * slope
    t = t > 1 ? 1 : t < 0 ? 0 : t
  }

  // Find the y value through the curve's y equation, with the now more accurate time value
  y = Math.abs(E * t * t * t + F * t * t + G * t * H)

  return y
}

export function getPointsAlongCubicBezier(
  ptCount: number,
  pxTolerance: number,
  Ax: number,
  Ay: number,
  Bx: number,
  By: number,
  Cx: number,
  Cy: number,
  Dx: number,
  Dy: number
) {
  let deltaBAx = Bx - Ax
  let deltaCBx = Cx - Bx
  let deltaDCx = Dx - Cx
  let deltaBAy = By - Ay
  let deltaCBy = Cy - By
  let deltaDCy = Dy - Cy
  let ax, ay, bx, by, cx, cy
  let lastX = -10000
  let lastY = -10000
  let pts = [{ x: Ax, y: Ay }]
  for (let i = 1; i < ptCount; i++) {
    let t = i / ptCount
    ax = Ax + deltaBAx * t
    bx = Bx + deltaCBx * t
    cx = Cx + deltaDCx * t
    ax += (bx - ax) * t
    bx += (cx - bx) * t
    ay = Ay + deltaBAy * t
    by = By + deltaCBy * t
    cy = Cy + deltaDCy * t
    ay += (by - ay) * t
    by += (cy - by) * t
    const x = ax + (bx - ax) * t
    const y = ay + (by - ay) * t
    const dx = x - lastX
    const dy = y - lastY
    if (dx * dx + dy * dy > pxTolerance) {
      pts.push({ x: x, y: y })
      lastX = x
      lastY = y
    }
  }
  pts.push({ x: Dx, y: Dy })
  return pts
}

export function interpolateCubicBezier(
  p0: { x: number; y: number },
  c0: { x: number; y: number },
  c1: { x: number; y: number },
  p1: { x: number; y: number }
) {
  // 0 <= t <= 1
  return function interpolator(t: number) {
    return [
      pow(1 - t, 3) * p0.x +
        3 * pow(1 - t, 2) * t * c0.x +
        3 * (1 - t) * pow(t, 2) * c1.x +
        pow(t, 3) * p1.x,
      pow(1 - t, 3) * p0.y +
        3 * pow(1 - t, 2) * t * c0.y +
        3 * (1 - t) * pow(t, 2) * c1.y +
        pow(t, 3) * p1.y,
    ]
  }
}

export function addVectors(
  a: { x: number; y: number },
  b?: { x: number; y: number }
) {
  if (!b) return a
  return { x: a.x + b.x, y: a.y + b.y }
}

export function getSvgPathFromStroke(stroke: number[][]) {
  if (stroke.length === 0) return ""
  const d = []
  let [p0, p1] = stroke
  d.push("M", p0[0], p0[1])
  for (let i = 1; i < stroke.length; i++) {
    d.push("Q", p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2)
    p0 = p1
    p1 = stroke[i]
  }
  d.push("Z")
  return d.join(" ")
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
