import * as React from "react"
import Label from "./label"
import state from "../state"
import { Text } from "./shared"
import { styled } from "../theme"
import { useSelector } from "@state-designer/react/"

export default function Controls() {
  const options = useSelector(state, (state) => state.data.options)

  return (
    <ControlsContainer>
      <div>
        <LabelContainer>
          <Label>Size</Label>
          <Text>{options.size}px</Text>
        </LabelContainer>
        <input
          type="range"
          min={0}
          max={128}
          step={1}
          value={options.size}
          onChange={({ currentTarget: { value } }) =>
            state.send("CHANGED_OPTION", { size: Number(value) })
          }
        />
      </div>
      <div>
        <LabelContainer>
          <Label>Thinning</Label>
          <Text>{Math.round(options.thinning * 100)}%</Text>
        </LabelContainer>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={options.thinning}
          onChange={({ currentTarget: { value } }) =>
            state.send("CHANGED_OPTION", { thinning: Number(value) })
          }
        />
      </div>
      <div>
        <LabelContainer>
          <Label>Smoothing</Label>
          <Text>{Math.round(options.smoothing * 100)}%</Text>
        </LabelContainer>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={options.smoothing}
          onChange={({ currentTarget: { value } }) =>
            state.send("CHANGED_OPTION", { smoothing: Number(value) })
          }
        />
      </div>
      <div>
        <LabelContainer>
          <Label>Streamline</Label>
          <Text>{Math.round(options.streamline * 100)}%</Text>
        </LabelContainer>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={options.streamline}
          onChange={({ currentTarget: { value } }) =>
            state.send("CHANGED_OPTION", { streamline: Number(value) })
          }
        />
      </div>
      <div>
        <LabelContainer>
          <Label>Clip</Label>
          <input
            type="checkbox"
            checked={options.clip}
            onChange={({ currentTarget: { checked } }) =>
              state.send("CHANGED_OPTION", { clip: Boolean(checked) })
            }
          />
        </LabelContainer>
      </div>
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div({
  display: "grid",
  gap: "$0",
  input: { width: "100%" },
  "input[type=checkbox]": {
    width: "auto",
  },
  borderTop: "1px solid #E5E5E5",
  pt: "$1",
  px: "$2",
})

const LabelContainer = styled.div({
  display: "flex",
  justifyContent: "space-between",
})
