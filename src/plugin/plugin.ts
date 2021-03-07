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
} from "../utils"
import getStroke from "perfect-freehand"

// Sends a message to the plugin UI
function postMessage({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload })
}

// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedNodes() {
  const vectorNodes = figma.currentPage.selection.filter(
    ({ type }) => type === "VECTOR"
  ) as VectorNode[]

  return vectorNodes.map(({ id, name, type, vectorNetwork }: VectorNode) => ({
    id,
    name,
    type,
    vectorNetwork,
  }))
}

// Zooms the Figma viewport to a node
function zoomToNode(id: string) {
  const node = figma.getNodeById(id)
  if (!node) return

  figma.viewport.scrollAndZoomIntoView([node])
}

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

const SPLIT = 10

function applyPerfectFreehandToVectorNodes() {
  const selectedNodes = getSelectedNodes()

  for (let { id } of selectedNodes) {
    const node = figma.getNodeById(id) as VectorNode

    const pts: number[][] = []
    console.log(node.vectorNetwork)

    for (let segment of node.vectorNetwork.segments) {
      const p0 = node.vectorNetwork.vertices[segment.start]
      const p3 = node.vectorNetwork.vertices[segment.end]

      const p1 = addVectors(p0, segment.tangentStart)
      const p2 = addVectors(p3, segment.tangentEnd)

      const interpolator = interpolateCubicBezier(p0, p1, p2, p3)

      for (let i = 0; i < SPLIT; i++) {
        pts.push(interpolator(i / SPLIT))
      }
    }

    const stroke = getStroke(pts, {
      size: 32,
      easing: (t) => t * t * t,
      streamline: 0.5,
      smoothing: 0.5,
      thinning: 0.75,
    })

    node.vectorPaths = [
      {
        windingRule: "NONZERO",
        data: getSvgPathFromStroke(stroke),
      },
    ]
  }

  postMessage({
    type: WorkerActionTypes.SELECTED_NODES,
    payload: selectedNodes,
  })
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
    case UIActionTypes.TRANSFORM_NODE:
      applyPerfectFreehandToVectorNodes()
      break
  }
}

// --- Messages from Figma --------------------------------------------

// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes)

// --- Kickoff --------------------------------------------------------

// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 360 })

// Send the current selection to the UI
sendInitialSelectedNodes()
