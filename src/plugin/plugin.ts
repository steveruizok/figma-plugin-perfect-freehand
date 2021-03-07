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
import getStroke, { StrokeOptions } from "perfect-freehand"

const SPLIT = 10
const EASINGS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
}

const previousNodes: Record<string, VectorNode> = {}

// Sends a message to the plugin UI
function postMessage({ type, payload }: WorkerAction): void {
  figma.ui.postMessage({ type, payload })
}

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
// Get all of the currently selected Figma nodes, filtered
// with the provided array of NodeTypes.
function getSelectedAppliedNodeIds() {
  return getSelectedNodeIds().filter((id) => previousNodes[id] !== undefined)
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

function setInitialNodes(nodeIds: string[]) {
  for (let id of nodeIds) {
    if (previousNodes[id] === undefined) {
      const realNode = figma.getNodeById(id)
      if (!realNode) continue
      const originalNode = realNode.getPluginData("perfect_freehand")
      if (originalNode) {
        previousNodes[id] = JSON.parse(originalNode)
      }
    }
  }
}

function sendSelectedNodes() {
  const selectedNodes = getSelectedNodes()
  setInitialNodes(selectedNodes.map((n) => n.id))

  postMessage({
    type: WorkerActionTypes.SELECTED_NODES,
    payload: selectedNodes,
  })
}

function resetVectorNodes(nodeIds: string[]) {
  setInitialNodes(nodeIds)

  for (let id of nodeIds) {
    const node = figma.getNodeById(id) as VectorNode
    if (!node) continue
    const prev = previousNodes[id]
    node.vectorPaths = prev.vectorPaths
    node.x = prev.x
    node.y = prev.y
  }
}

function applyPerfectFreehandToVectorNodes(
  nodeIds: string[],
  {
    options,
    easing,
  }: {
    options: StrokeOptions
    easing: keyof typeof EASINGS
  }
) {
  for (let id of nodeIds) {
    let node: VectorNode

    if (previousNodes[id]) {
      node = previousNodes[id]
    } else {
      node = figma.getNodeById(id) as VectorNode
      previousNodes[id] = {
        ...node,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        vectorNetwork: { ...node.vectorNetwork },
        vectorPaths: node.vectorPaths,
      }
    }

    let { x, y, width, height } = node

    // Create a copy of the original

    const pts: number[][] = []

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
      ...options,
      easing: EASINGS[easing],
    })

    const applyNode = figma.getNodeById(id)

    if (applyNode && applyNode.type === "VECTOR") {
      applyNode.setPluginData(
        "perfect_freehand",
        JSON.stringify(previousNodes[id])
      )

      applyNode.vectorPaths = [
        {
          windingRule: "NONZERO",
          data: getSvgPathFromStroke(stroke),
        },
      ]
      applyNode.x = x + width / 2 - applyNode.width / 2
      applyNode.y = y + height / 2 - applyNode.height / 2
    }
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
      applyPerfectFreehandToVectorNodes(getSelectedNodeIds(), payload)
      break
    case UIActionTypes.UPDATED_OPTIONS:
      applyPerfectFreehandToVectorNodes(getSelectedAppliedNodeIds(), payload)
      break
  }
}

// --- Messages from Figma --------------------------------------------

// Listen for selection changes
figma.on("selectionchange", sendSelectedNodes)

// --- Kickoff --------------------------------------------------------

// Show the plugin interface
figma.showUI(__html__, { width: 320, height: 400 })

// Send the current selection to the UI
sendInitialSelectedNodes()
