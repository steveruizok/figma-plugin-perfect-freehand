import * as React from "react"
import state from "../state"
import { styled } from "../theme"

import { Button } from "../components/shared"

export default function FooterLinks() {
  return (
    <Container>
      <Button variant="detail" onClick={() => state.send("RESET_NODES")}>
        Reset Nodes
      </Button>
      <Button variant="detail" onClick={() => state.send("OPENED_DOCS")}>
        Guide
      </Button>
    </Container>
  )
}

const Container = styled.div({
  pt: "$0",
  px: "$2",
  display: "flex",
  justifyContent: "space-between",
})
