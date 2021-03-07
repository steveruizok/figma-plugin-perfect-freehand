import { styled } from "../theme"
import * as React from "react"
import * as _Label from "@radix-ui/react-label"

export default function Label(props: _Label.LabelOwnProps) {
  return <StyledLabel {...props} />
}

const StyledLabel = styled(_Label.Root, {
  fontSize: "$0",
  fontFamily: "system-ui",
})
