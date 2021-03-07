import * as React from "react"
import * as ReactDOM from "react-dom"
import firebase from "firebase/app"
import "firebase/auth"

import { useStateDesigner } from "@state-designer/react"
import state from "../state"

import "./ui.css"

import Selecting from "./routes/selecting"
import Docs from "./routes/docs"

import { styled } from "./theme"

const Wrapper = styled.div({
  position: "relative",
  width: "100%",
  overflow: "hidden",
  height: "100%",
  maxHeight: "100%",
})

function App() {
  const local = useStateDesigner(state)

  React.useEffect(() => {
    return () => {
      // Important! Leaving this out might be causing a
      // memory leak when using modd for hot reload in dev.
      state.send("CLOSED_PLUGIN")
    }
  }, [])

  return (
    <main>
      <Wrapper>
        {local.whenIn({
          selectingNodes: <Selecting />,
          readingDocs: <Docs />,
        })}
      </Wrapper>
    </main>
  )
}

ReactDOM.render(<App />, document.getElementById("react-page"))
