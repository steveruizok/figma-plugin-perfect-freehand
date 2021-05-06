import {
  UIActionTypes,
  UIAction,
  WorkerActionTypes,
  WorkerAction,
  NodeInfo,
} from "../types"
import {
  getSvgPathFromStroke,
  addVectors,
  interpolateCubicBezier,
} from "../utils"
import getStroke, { StrokeOptions } from "perfect-freehand"
import { compressToUTF16, decompressFromUTF16 } from "lz-string"

/* ----------------------- Comms ----------------------- */

// Sends a message to the plugin UI
function postMessage({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload })
}

/* ------------------- Original Nodes ------------------ */

// We need to store copies of original nodes (their vector networks and vertices)
// so that we can restore the line after applying the effect. In order to stay
// within memory limits, we compress the data before saving it as pluginData.

interface OriginalNode {
  vectorNetwork: VectorNetwork
  vectorPaths: VectorPaths
  center: { x: number; y: number }
}

// Save some information about the node to its plugin data.
function setOriginalNode(node: VectorNode): OriginalNode {
  const originalNode: OriginalNode = {
    center: getCenter(node),
    vectorNetwork: { ...node.vectorNetwork },
    vectorPaths: node.vectorPaths,
  }

  node.setPluginData(
    "perfect_freehand",
    compressToUTF16(JSON.stringify(originalNode))
  )

  return originalNode
}

function decompressPluginData(pluginData: string) {
  // Decompress the saved data and parse out the original node.
  const decompressed = decompressFromUTF16(pluginData)

  if (!decompressed) {
    throw Error(
      "Found saved data for original node but could not decompress it: " +
        decompressed
    )
  }

  return JSON.parse(decompressed) as OriginalNode
}

// Get an original node from a node's plugin data.
function getOriginalNode(id: string): OriginalNode | undefined {
  let node = figma.getNodeById(id) as VectorNode

  if (!node) throw Error("Could not find that node: " + id)

  const pluginData = node.getPluginData("perfect_freehand")

  // Nothing on the node — we haven't modified it.
  if (!pluginData) return undefined

  return decompressPluginData(pluginData)
}

/* ---------------------- Nodes --------------------- */

// Get the currently selected Vector nodes for the UI.
function getSelectedNodes(updateCenter = false): NodeInfo[] {
  return (figma.currentPage.selection.filter(
    ({ type }) => type === "VECTOR"
  ) as VectorNode[]).map((node: VectorNode) => {
    const pluginData = node.getPluginData("perfect_freehand")

    if (pluginData && updateCenter) {
      const center = getCenter(node)
      const originalNode = decompressPluginData(pluginData)
      if (
        !(
          center.x === originalNode.center.x &&
          center.y === originalNode.center.y
        )
      ) {
        originalNode.center = center

        node.setPluginData(
          "perfect_freehand",
          compressToUTF16(JSON.stringify(originalNode))
        )
      }
    }

    return {
      id: node.id,
      name: node.name,
      type: node.type,
      canReset: !!pluginData,
    }
  })
}

// Getthe currently selected Vector nodes as an array of Ids.
function getSelectedNodeIds() {
  return (figma.currentPage.selection.filter(
    ({ type }) => type === "VECTOR"
  ) as VectorNode[]).map(({ id }) => id)
}

// Find the center of a node.
function getCenter(node: VectorNode) {
  let { x, y, width, height } = node
  return { x: x + width / 2, y: y + height / 2 }
}

// Move a node to a center.
function moveNodeToCenter(node: VectorNode, center: { x: number; y: number }) {
  const { x: x0, y: y0 } = getCenter(node)
  const { x: x1, y: y1 } = center

  node.x = node.x + x1 - x0
  node.y = node.y + y1 - y0
}

// Zoom the Figma viewport to a node.
function zoomToNode(id: string) {
  const node = figma.getNodeById(id)

  if (!node) {
    console.error("Could not find that node: " + id)
    return
  }

  figma.viewport.scrollAndZoomIntoView([node])
}

/* -------------------- Selection ------------------- */

// Deselect a Figma node.
function deselectNode(id: string) {
  const selection = figma.currentPage.selection
  figma.currentPage.selection = selection.filter((node) => node.id !== id)
}

// Send the current selection to the UI state.
function sendSelectedNodes(updateCenter = true) {
  const selectedNodes = getSelectedNodes(updateCenter)

  postMessage({
    type: WorkerActionTypes.SELECTED_NODES,
    payload: selectedNodes,
  })
}

/* -------------- Changing VectorNodes -------------- */

// Number of new nodes to insert
const SPLIT = 5

// Some basic easing functions
const EASINGS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

// Compute a stroke based on the vector and apply it to the vector's path data.
function applyPerfectFreehandToVectorNodes(
  nodeIds: string[],
  {
    options,
    easing = "linear",
    clip,
  }: {
    options: StrokeOptions
    easing: keyof typeof EASINGS
    clip: boolean
  },
  restrictToKnownNodes = false
) {
  for (let id of nodeIds) {
    // Get the node that we want to change
    const nodeToChange = figma.getNodeById(id) as VectorNode

    if (!nodeToChange) {
      throw Error("Could not find that node: " + id)
    }

    // Get the original node
    let originalNode = getOriginalNode(nodeToChange.id)

    // If we don't know this node...
    if (!originalNode) {
      // Bail if we're updating nodes
      if (restrictToKnownNodes) continue
      // Create a new original node and continue
      originalNode = setOriginalNode(nodeToChange)
    }

    // Interpolate new points along the vector's curve
    const pts: number[][] = []

    for (let segment of originalNode.vectorNetwork.segments) {
      const p0 = originalNode.vectorNetwork.vertices[segment.start]
      const p3 = originalNode.vectorNetwork.vertices[segment.end]

      const p1 = addVectors(p0, segment.tangentStart)
      const p2 = addVectors(p3, segment.tangentEnd)

      const interpolator = interpolateCubicBezier(p0, p1, p2, p3)

      for (let i = 0; i < SPLIT; i++) {
        pts.push(interpolator(i / SPLIT))
      }
    }

    // Create a new stroke using perfect-freehand

    const stroke = getStroke(pts, {
      ...options,
      easing: EASINGS[easing],
      last: true,
    })

    try {
      // Set stroke to vector paths
      nodeToChange.vectorPaths = [
        {
          windingRule: "NONZERO",
          data: getSvgPathFromStroke(stroke),
        },
      ]
    } catch (e) {
      console.error("Could not apply stroke", e.message)
      continue
    }

    // Adjust the position of the node so that its center does not change
    moveNodeToCenter(nodeToChange, originalNode.center)
  }

  sendSelectedNodes(false)
}

// Reset the node to its original path data, using data from our cache and then delete the node.
function resetVectorNodes() {
  for (let id of getSelectedNodeIds()) {
    const originalNode = getOriginalNode(id)

    // We haven't modified this node.
    if (!originalNode) continue

    const currentNode = figma.getNodeById(id) as VectorNode

    if (!currentNode) {
      console.error("Could not find that node: " + id)
      continue
    }

    currentNode.vectorPaths = originalNode.vectorPaths

    currentNode.setPluginData("perfect_freehand", "")

    sendSelectedNodes(false)
  }
}

/* --------------------- Kickoff -------------------- */

// Listen to messages received from the plugin UI
figma.ui.onmessage = function ({ type, payload }: UIAction): void {
  switch (type) {
    case UIActionTypes.CLOSE:
      figma.closePlugin()
      break
    case UIActionTypes.ZOOM_TO_NODE:
      zoomToNode(payload)
      break
    case UIActionTypes.DESELECT_NODE:
      deselectNode(payload)
      break
    case UIActionTypes.RESET_NODES:
      resetVectorNodes()
      break
    case UIActionTypes.TRANSFORM_NODES:
      applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, false)
      break
    case UIActionTypes.UPDATED_OPTIONS:
      applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, true)
      break
  }
}

// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes)

// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 480 })

// Send the current selection to the UI
sendSelectedNodes()
