import { createState } from "@state-designer/react"
import { UIActionTypes, UIAction, NodeInfo } from "../types"

function postMessage({ type, payload }: UIAction): void {
  parent.postMessage({ pluginMessage: { type, payload } }, "*")
}

const defaultOptions = {
  size: 32,
  streamline: 0.5,
  smoothing: 0.5,
  thinning: 0.75,
  easing: "linear",
  clip: true,
}

// This is the UI's global state machine. Events from the UI are sent here
// and components in the UI subscribe to its changes.
const state = createState({
  data: {
    selectedNodes: [] as NodeInfo[],
    options: defaultOptions,
  },
  on: {
    CLOSED_PLUGIN: "closePlugin",
    CHANGED_OPTION: "setOption",
    RESET_OPTION: ["setOptionToDefault", "setOption"],
  },
  initial: "selectingNodes",
  states: {
    selectingNodes: {
      on: {
        OPENED_DOCS: { to: "readingDocs" },
      },
      states: {
        nodes: {
          on: {
            SELECTED_NODES: "setSelectedNodes",
            DESELECTED_NODE: "deselectNode",
            ZOOMED_TO_NODE: "zoomToNode",
            FOUND_SELECTED_NODES: [
              {
                do: "setSelectedNodes",
              },
              {
                if: "hasSelectedNodes",
                to: "hasNodesSelected",
              },
            ],
          },
          initial: {
            if: "hasSelectedNodes",
            to: "hasNodesSelected",
            else: { to: "noNodesSelected" },
          },
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
    // Nodes
    setSelectedNodes(data, payload: NodeInfo[]) {
      data.selectedNodes = payload
    },
    zoomToNode(data, id) {
      postMessage({ type: UIActionTypes.ZOOM_TO_NODE, payload: id })
    },
    deselectNode(data, id) {
      postMessage({ type: UIActionTypes.DESELECT_NODE, payload: id })
    },
    // Plugin
    closePlugin(data) {
      postMessage({ type: UIActionTypes.CLOSE })
    },
    resetSelectedNodes() {
      postMessage({
        type: UIActionTypes.RESET_NODES,
      })
    },
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
  },
})

// Forward messages sent from the plugin controller to the state
window.onmessage = (event: any) => {
  const { type, payload } = event.data.pluginMessage
  state.send(type, payload)
}

export default state

// state.onUpdate((d) => console.log(d.active))

// This bit right here needs a .env file ------------------------

// const app = firebase.initializeApp(fbconfig)

// firebase.auth().onAuthStateChanged((user) => {
//   state.send("AUTHENTICATION_CHANGED", user)
// })
