import { styled } from "../theme"
import * as _Slider from "@radix-ui/react-slider"
import * as React from "react"

interface SliderProps extends _Slider.SliderOwnProps {}

export default function Slider(props: SliderProps) {
  return (
    <StyledSlider {...props}>
      <StyledTrack>
        <StyledRange />
      </StyledTrack>
      <StyledThumb />
    </StyledSlider>
  )
}

const StyledSlider = styled(_Slider.Root, {
  position: "relative",
  display: "flex",
  alignItems: "center",
  userSelect: "none",
  touchAction: "none",
  height: 16,
})

const StyledTrack = styled(_Slider.Track, {
  backgroundColor: "gainsboro",
  position: "relative",
  flexGrow: 1,
  height: 2,
})

const StyledRange = styled(_Slider.Range, {
  position: "absolute",
  backgroundColor: "dodgerblue",
  borderRadius: "9999px",
  height: "100%",
})

const StyledThumb = styled(_Slider.Thumb, {
  display: "block",
  width: 16,
  height: 16,
  backgroundColor: "white",
  border: "1px solid lightgray",
  borderRadius: "20px",
  ":focus": {
    outline: "none",
    borderColor: "dodgerblue",
  },
})
