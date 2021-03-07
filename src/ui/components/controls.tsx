import * as React from "react"
import Label from "./label"
import state from "../../state"
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
          <Text>{options.size}</Text>
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
          <Text>{options.thinning}</Text>
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
          <Text>{options.smoothing}</Text>
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
          <Text>{options.streamline}</Text>
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
    </ControlsContainer>
  )
}

const LabelContainer = styled.div({
  display: "flex",
  justifyContent: "space-between",
})

const ControlsContainer = styled.div({
  display: "grid",
  gap: "$0",
  input: { width: "100%" },
})
