// UI actions
export enum UIActionTypes {
  CLOSE = "CLOSE",
  ZOOM_TO_NODE = "ZOOM_TO_NODE",
  DESELECT_NODE = "DESELECT_NODE",
  TRANSFORM_NODES = "TRANSFORM_NODES",
  RESET_NODES = "RESET_NODES",
  UPDATED_OPTIONS = "UPDATED_OPTIONS",
}

export interface UIAction {
  type: UIActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

// Worker actions
export enum WorkerActionTypes {
  SELECTED_NODES = "SELECTED_NODES",
  FOUND_SELECTED_NODES = "FOUND_SELECTED_NODES",
}

export interface WorkerAction {
  type: WorkerActionTypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
}

export interface NodeInfo {
  id: string
  type: string
  name: string
  canReset: boolean
}
