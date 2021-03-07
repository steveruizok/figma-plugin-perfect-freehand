import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "../../state"
import { styled } from "../theme"

import { Button, Stack } from "../components/shared"

export default function FooterLinks({
  signedIn = true,
  children,
}: {
  signedIn?: boolean
  children?: React.ReactNode
}) {
  return (
    <Stack
      direction="horizontal"
      distribution={children || signedIn ? "between" : "end"}
    >
      {children}
      <Button variant="detail">Perfect Freehand</Button>
      <Button variant="detail" onClick={() => state.send("OPENED_DOCS")}>
        Guide
      </Button>
    </Stack>
  )
}
