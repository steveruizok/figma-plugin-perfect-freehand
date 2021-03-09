import {
  UIActionTypes,
  UIAction,
  WorkerActionTypes,
  WorkerAction,
} from "../types"
import {
  getSvgPathFromStroke,
  addVectors,
  interpolateCubicBezier,
  getFlatSvgPathFromStroke,
} from "../utils"
import getStroke, { StrokeOptions } from "perfect-freehand"
import { compressToUTF16, decompressFromUTF16 } from "lz-string"

const SPLIT = 5
const EASINGS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

/* ---------------------- Comms ---------------------- */

// Sends a message to the plugin UI
function postMessage({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload })
}

/* -------------------- Selection ------------------- */

// Deselects a Figma node
function deselectNode(id: string) {
  const selection = figma.currentPage.selection
  figma.currentPage.selection = selection.filter((node) => node.id !== id)
}

// Send the current selection to the UI state
function sendInitialSelectedNodes() {
  const selectedNodes = getSelectedNodes()

  postMessage({
    type: WorkerActionTypes.FOUND_SELECTED_NODES,
    payload: selectedNodes,
  })
}

function sendSelectedNodes() {
  const selectedNodes = getSelectedNodes()

  postMessage({
    type: WorkerActionTypes.SELECTED_NODES,
    payload: selectedNodes,
  })
}

/* ------------------- Local Cache ------------------ */

// We need to store copies of original nodes (their vector networks and vertices)
// so that we can restore the line after applying the effect. In order to stay
// within memory limits, we store nodes as a compressed string. We're sacrificing
// a little performance for a 80% size reduction.

interface OriginalNode {
  id: string
  vectorNetwork: VectorNetwork
  vectorPaths: VectorPaths
  center: { x: number; y: number }
}

const originalNodes: Record<string, string> = {}

function setOriginalNode(node: VectorNode): OriginalNode {
  const originalNode: OriginalNode = {
    ...node,
    center: getCenter(node),
    vectorNetwork: { ...node.vectorNetwork },
    vectorPaths: node.vectorPaths,
  }

  originalNodes[node.id] = compressToUTF16(JSON.stringify(originalNode))
  node.setPluginData("perfect_freehand", originalNodes[node.id])

  return originalNode
}

function getOriginalNode(id: string): OriginalNode | undefined {
  if (!originalNodes[id]) {
    // We don't have the node in the local cache.
    // Maybe it has data from a previous session?

    let node = figma.getNodeById(id) as VectorNode

    if (!node) {
      throw Error("Could not find that node: " + id)
    }

    const pluginData = node.getPluginData("perfect_freehand")

    if (!pluginData) {
      // Nothing local, nothing saved — we've never modified this node.
      return undefined
    }

    // Restore saved plugin data to the local cache.
    originalNodes[id] = pluginData
  }

  // Decompress the saved data and parse out the original node.
  const decompressed = decompressFromUTF16(originalNodes[id])

  if (!decompressed) {
    throw Error(
      "Found saved data for original node but could not decompress it: " +
        decompressed
    )
  }

  return JSON.parse(decompressed) as OriginalNode
}

/* ---------------------- Nodes --------------------- */

// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedNodes() {
  return (figma.currentPage.selection.filter(
    ({ type }) => type === "VECTOR"
  ) as VectorNode[]).map(({ id, name, type }: VectorNode) => ({
    id,
    name,
    type,
  }))
}

// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedNodeIds() {
  return (figma.currentPage.selection.filter(
    ({ type }) => type === "VECTOR"
  ) as VectorNode[]).map(({ id }) => id)
}

function getCenter(node: VectorNode) {
  let { x, y, width, height } = node
  return { x: x + width / 2, y: y + height / 2 }
}

function moveNodeToCenter(node: VectorNode, center: { x: number; y: number }) {
  const { x: x0, y: y0 } = getCenter(node)
  const { x: x1, y: y1 } = center

  node.x = node.x + x1 - x0
  node.y = node.y + y1 - y0
}

// Zooms the Figma viewport to a node
function zoomToNode(id: string) {
  const node = figma.getNodeById(id)
  if (!node) return

  figma.viewport.scrollAndZoomIntoView([node])
}

/* -------------- Changing VectorNodes -------------- */

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
    })

    try {
      // Set stroke to vector paths
      nodeToChange.vectorPaths = [
        {
          windingRule: "NONZERO",
          data: clip
            ? getFlatSvgPathFromStroke(stroke)
            : getSvgPathFromStroke(stroke),
        },
      ]
    } catch (e) {
      console.error("Could not apply stroke", e.message)
      continue
    }

    // Adjust the position of the node so that its center does not change
    moveNodeToCenter(nodeToChange, originalNode.center)
  }
}

// Reset the node to its original path data, using data from our cache and then delete the node.
function resetVectorNodes(nodeIds: string[]) {
  for (let id of nodeIds) {
    const originalNode = getOriginalNode(id)

    // We haven't modified this node.
    if (!originalNode) {
      return
    }

    const currentNode = figma.getNodeById(id) as VectorNode

    if (!currentNode) {
      throw Error("Could not find that node: " + id)
    }

    currentNode.vectorPaths = originalNode.vectorPaths

    delete originalNodes[id]
    currentNode.setPluginData("perfect_freehand", "")
    // TODO: If a user has moved a node themselves, this will move it back to its original place.
    // node.x = originalNode.x
    // node.y = originalNode.y
  }
}

// --- Messages from the UI ---------------------------------------

// Listen to messages received from the plugin UI (src/ui/ui.ts)
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
      resetVectorNodes(getSelectedNodeIds())
      break
    case UIActionTypes.TRANSFORM_NODES:
      applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, false)
      break
    case UIActionTypes.UPDATED_OPTIONS:
      applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload, true)
      break
  }
}

// --- Messages from Figma --------------------------------------------

// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes)

// --- Kickoff --------------------------------------------------------

// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 420 })

// Send the current selection to the UI
sendInitialSelectedNodes()
