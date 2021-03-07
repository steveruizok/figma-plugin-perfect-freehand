import * as React from "react"
import { useStateDesigner } from "@state-designer/react"
import state from "../../state"
import { styled } from "../theme"
import * as Icons from "../assets/icons"

import FooterLinks from "../components/footer-links"
import { Text, Button, Stack } from "../components/shared"

export const Layout = styled.div({
  display: "grid",
  gridTemplateRows: "auto minmax(0, 1fr) auto auto",
  px: "$2",
  pt: "$0",
  pb: "$2",
  gridGap: "$1",
  height: "100%",
  maxHeight: "100%",
})

export default function Selecting() {
  const local = useStateDesigner(state)

  return (
    <Layout>
      <Stack direction="vertical" alignment="center" distribution="center">
        {local.isIn("noNodesSelected") && (
          <Text align="center">
            Select <b>vector nodes</b> and then click <b>Apply</b>.
          </Text>
        )}
      </Stack>
      <SelectedList items={local.data.selectedNodes} />
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

const ListContainer = styled.ul({
  height: "100%",
  overflowY: "scroll",
  mr: "-$1", // Making room for scrollbar
  pr: "$1",
  pl: 0,
  my: 0,
  listStyleType: "none",
})

const ItemRow = styled.li({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) min-content",
  alignItems: "center",
  gridGap: "$0",
  overflow: "hidden",
})

const ZoomButton = styled.button({
  outline: "none",
  cursor: "pointer",
  bg: "transparent",
  border: "none",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  p: 0,
  m: 0,
  ml: "4px",
  "& > *:not(:first-child)": {
    ml: "$0",
  },
})

const IconButton = styled.button({
  outline: "none",
  cursor: "pointer",
  bg: "transparent",
  borderRadius: "$0",
  border: "none",
  height: 32,
  width: 32,
  mr: "2px",
  "&:hover": {
    bg: "$hover",
  },
})

function SelectedList({ items }: { items: SceneNode[] }) {
  return (
    <ListContainer>
      {items.map((item) => (
        <SelectedItem key={item.id} {...item} />
      ))}
    </ListContainer>
  )
}

function SelectedItem({ id, name, type }: SceneNode) {
  const Icon =
    type === "FRAME"
      ? Icons.Frame
      : type === "INSTANCE"
      ? Icons.Instance
      : Icons.Component

  return (
    <ItemRow>
      <ZoomButton
        title="Zoom into View"
        onClick={() => state.send("ZOOMED_TO_NODE", id)}
      >
        <Icon onClick={() => state.send("ZOOMED_TO_NODE", id)} />
        <Text variant="selection" highlight={false ? "primary" : "none"}>
          {name}
        </Text>
      </ZoomButton>
      <IconButton
        title="Deselect"
        onClick={() => state.send("DESELECTED_NODE", id)}
      >
        <Icons.Close />
      </IconButton>
    </ItemRow>
  )
}
