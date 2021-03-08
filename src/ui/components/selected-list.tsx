import * as React from "react"
import state from "../state"
import { styled } from "../theme"
import * as Icons from "../assets/icons"

import { Text } from "../components/shared"

export default function SelectedList({ items }: { items: SceneNode[] }) {
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
        title="Click to Zoom"
        onClick={() => state.send("ZOOMED_TO_NODE", id)}
      >
        <Icon onClick={() => state.send("ZOOMED_TO_NODE", id)} />
        <Text variant="selection" highlight={false ? "primary" : "none"}>
          {name}
        </Text>
      </ZoomButton>
      <IconButton
        data-hidey={true}
        title="Deselect"
        onClick={() => state.send("DESELECTED_NODE", id)}
      >
        <Icons.Close />
      </IconButton>
    </ItemRow>
  )
}

const ListContainer = styled.ul({
  height: "100%",
  overflowY: "scroll",
  ml: 0,
  my: 0,
  pl: 0,
  py: "$0",
  listStyleType: "none",
})

const ItemRow = styled.li({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) min-content",
  alignItems: "center",
  gridGap: "$0",
  pl: "$2",
  pr: "$1",
  overflow: "hidden",
  "& > *[data-hidey=true]": {
    visibility: "hidden",
  },
  "&:hover > *[data-hidey=true]": {
    visibility: "visible",
  },
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
  height: "100%",
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
