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
          onDoubleClick={() => state.send("RESET_OPTION", "size")}
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
          onDoubleClick={() => state.send("RESET_OPTION", "thinning")}
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
          onDoubleClick={() => state.send("RESET_OPTION", "smoothing")}
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
          onDoubleClick={() => state.send("RESET_OPTION", "streamline")}
        />
      </div>
      <DoubleRow>
        <LabelContainer>
          <Label>Easing</Label>
          <select
            value={options.easing}
            onChange={({ currentTarget: { value } }) =>
              state.send("CHANGED_OPTION", { easing: value })
            }
          >
            <option value="linear">Linear</option>
            <option value="easeIn">Ease In</option>
            <option value="easeOut">Ease Out</option>
            <option value="easeInOut">Ease In Out</option>
          </select>
        </LabelContainer>
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
      </DoubleRow>
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div({
  display: "grid",
  gap: "$0",
  input: { width: "100%" },
  "input[type=checkbox]": {
    width: "auto",
    ml: 10,
  },
  "& select": {
    ml: 10,
    width: "100%",
    fontSize: "12px",
    fontWeight: 400,
    height: "100%",
    pt: "3px",
    pb: "1px",
    border: "1px solid #E5E5E5",
    borderRadius: "4px",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  borderTop: "1px solid #E5E5E5",
  pt: "$1",
  px: "$2",
})

const LabelContainer = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

const DoubleRow = styled.div({
  display: "grid",
  gridTemplateColumns: "1fr min-content",
  gap: "$1",
  alignItems: "center",
})
