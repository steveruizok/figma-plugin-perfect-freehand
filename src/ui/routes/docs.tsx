import * as React from "react"
import state from "../../state"
import { styled } from "../theme"

import FooterLinks from "../components/footer-links"
import { Instructions, Text, Button, Stack, Logo } from "../components/shared"

export const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "minmax(0, 1fr)",
  gridAutoRows: "min-content",
  px: "$2",
  pt: "$0",
  pb: "$2",
  gridGap: "$1",
  height: "100%",
  maxHeight: "100%",
})

export default function Docs() {
  return (
    <Layout>
      <Instructions variant="text">
        <Text variant="strong">About this Plugin</Text>
        <Text>...</Text>
      </Instructions>
      <Button onClick={() => state.send("RETURNED")}>Back</Button>
      <FooterLinks />
    </Layout>
  )
}
