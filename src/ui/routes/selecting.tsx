import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "../state"
import { styled } from "../theme"

import Controls from "../components/controls"
import SelectedList from "../components/selected-list"
import FooterLinks from "../components/footer-links"
import { Text, Button, Stack } from "../components/shared"

export default function Selecting() {
  const local = useStateDesigner(state)

  return (
    <Layout>
      {local.isIn("noNodesSelected") && (
        <Instructions>
          <Text align="center">
            Select a <b>vector node</b> to begin.
          </Text>
        </Instructions>
      )}
      <SelectedList items={local.data.selectedNodes} />
      <Controls />
      <Button
        disabled={!state.can("TRANSFORMED_NODES")}
        onClick={() => state.send("TRANSFORMED_NODES")}
      >
        Apply
      </Button>
      <FooterContainer>
        <Button
          variant="detailHl"
          disabled={local.isIn("noNodesSelected")}
          onClick={() => state.send("RESET_NODES")}
        >
          Reset Nodes
        </Button>
        <Button variant="detail" onClick={() => state.send("OPENED_DOCS")}>
          Guide
        </Button>
      </FooterContainer>
    </Layout>
  )
}

const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "1fr auto auto auto",
  pb: "$2",
  height: "100%",
  maxHeight: "100%",
  gridGap: 0,
  "& > button": {
    mx: "$2",
    mt: "$1",
    mb: "$1",
  },
})

const Instructions = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gridRow: "span 2",
  pt: "$1",
  height: "100%",
  variants: {
    variant: {
      text: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflowY: "scroll",
      },
    },
  },
})

const FooterContainer = styled.div({
  pt: "$0",
  px: "$2",
  display: "flex",
  justifyContent: "space-between",
})
