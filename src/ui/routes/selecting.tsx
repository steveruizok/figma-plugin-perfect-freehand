import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "../../state"
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
            Select <b>vector nodes</b> and then click <b>Apply</b>.
          </Text>
        </Instructions>
      )}
      <SelectedList items={local.data.selectedNodes} />
      <hr />
      <Controls />
      <Button
        disabled={!state.can("TRANSFORMED_NODES")}
        onClick={() => state.send("TRANSFORMED_NODES")}
      >
        Apply
      </Button>
      <FooterLinks />
    </Layout>
  )
}

const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "1fr auto auto auto",
  px: "$2",
  pt: "$0",
  pb: "$2",
  gridGap: "$1",
  height: "100%",
  maxHeight: "100%",
  "& hr": {
    height: 1,
    opacity: 0.2,
    width: "calc(100%+32px)",
    mx: "-$2",
  },
})

const Instructions = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gridRow: "span 2",
  "& > *:not(:first-child)": {
    mt: "$2",
  },
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
