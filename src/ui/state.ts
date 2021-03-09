import { createState } from "@state-designer/react"
import { UIActionTypes, UIAction, NodeInfo } from "../types"

const defaultOptions = {
  size: 32,
  streamline: 0.5,
  smoothing: 0.5,
  thinning: 0.75,
  easing: "linear",
  clip: true,
}

// This is the UI's global state machine. Events from the UI
// are sent here. Components in the UI subscribe to its changes.
const state = createState({
  data: {
    selectedNodes: [] as NodeInfo[],
    options: defaultOptions,
  },
  on: { CLOSED_PLUGIN: "closePlugin" },
  initial: "selectingNodes",
  states: {
    selectingNodes: {
      on: {
        RESET_OPTION: ["setOptionToDefault", "setOption"],
        CHANGED_OPTION: "setOption",
        OPENED_DOCS: { to: "readingDocs" },
        SELECTED_NODES: "setSelectedNodes",
        DESELECTED_NODE: "deselectNode",
        ZOOMED_TO_NODE: "zoomToNode",
      },
      initial: "hasNodesSelected",
      states: {
        noNodesSelected: {
          on: {
            SELECTED_NODES: {
              if: "hasSelectedNodes",
              to: "hasNodesSelected",
            },
          },
        },
        hasNodesSelected: {
          on: {
            SELECTED_NODES: {
              unless: "hasSelectedNodes",
              to: "noNodesSelected",
            },
            TRANSFORMED_NODES: "transformSelectedNodes",
            RESET_NODES: {
              if: "hasResetableNodes",
              do: "resetSelectedNodes",
            },
          },
        },
      },
    },
    readingDocs: {
      on: {
        RETURNED: {
          to: "selectingNodes.restore",
        },
      },
    },
  },
  conditions: {
    hasSelectedNodes(data) {
      return data.selectedNodes.length > 0
    },
    hasResetableNodes(data) {
      return data.selectedNodes.some((node) => node.canReset)
    },
  },
  actions: {
    // Slection
    setSelectedNodes(data, payload: NodeInfo[]) {
      data.selectedNodes = payload
    },
    zoomToNode(data, id) {
      postMessage({ type: UIActionTypes.ZOOM_TO_NODE, payload: id })
    },
    deselectNode(data, id) {
      postMessage({ type: UIActionTypes.DESELECT_NODE, payload: id })
    },
    // Transforms
    transformSelectedNodes(data) {
      postMessage({
        type: UIActionTypes.TRANSFORM_NODES,
        payload: {
          options: { ...data.options },
          easing: data.options.easing,
          clip: data.options.clip,
        },
      })
    },
    resetSelectedNodes() {
      postMessage({
        type: UIActionTypes.RESET_NODES,
      })
    },
    // Options
    setOption(data, payload) {
      data.options = { ...data.options, ...payload }
      postMessage({
        type: UIActionTypes.UPDATED_OPTIONS,
        payload: {
          options: { ...data.options },
          easing: data.options.easing,
          clip: data.options.clip,
        },
      })
    },
    setOptionToDefault(data, payload: keyof typeof defaultOptions) {
      data.options = {
        ...data.options,
        [payload]: defaultOptions[payload],
      }
    },
    // Plugin
    closePlugin() {
      postMessage({ type: UIActionTypes.CLOSE })
    },
  },
})

function postMessage({ type, payload }: UIAction): void {
  parent.postMessage({ pluginMessage: { type, payload } }, "*")
}

// Forward messages sent from the plugin controller to the state
window.onmessage = (event: any) => {
  const { type, payload } = event.data.pluginMessage
  state.send(type, payload)
}

export default state

// state.onUpdate((d) => console.log(d.active))
