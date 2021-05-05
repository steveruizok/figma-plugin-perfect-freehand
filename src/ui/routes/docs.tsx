import * as React from "react"
import state from "../state"
import { styled } from "../theme"
import { Button } from "../components/shared"

const VERSION = "9"

export default function Docs() {
  return (
    <Layout>
      <Instructions>
        <h2>About this Plugin</h2>
        <p>
          You can use this plugin to turn vector lines into freehand strokes.
        </p>
        <ul>
          <li>
            <a href="#quickstart">Quickstart</a>
          </li>
          <li>
            <a href="#options">Options</a>
          </li>
          <li>
            <a href="#tips">Tips</a>
          </li>
          <li>
            <a href="#feedback-and-contribution">Feedback & Contribution</a>
          </li>
        </ul>
        <h2 id="quickstart">Quickstart</h2>
        <ol>
          <li>
            Select the <b>Pencil Tool</b> (Shift + P).
          </li>
          <li>Draw or write something on the canvas.</li>
          <li>Select your pencil lines.</li>
          <li>
            In this plugin, click the <b>Apply</b> button.
          </li>
        </ol>
        <p>
          To revert a stroke to its original shape, click the <b>Reset</b>{" "}
          button.
        </p>
        <h2 id="options">Options</h2>
        <p>
          You can use the plugin's options to change the appearance of a mark.
          See the <b>Options</b> section below for more information on each
          option.
        </p>
        <dl>
          <dt>Size</dt>
          <dd>Sets the base width for the stroke.</dd>
          <dt>Thinning</dt>
          <dd>Sets the effect of pressure on the stroke's width.</dd>
          <dt>Smoothing</dt>
          <dd>
            Reduces the overall number of points. A higher value will produce a
            smoother stroke.
          </dd>
          <dt>Streamline</dt>
          <dd>Increases the stability of the stroke.</dd>
          {/* <dt>Clip</dt>
          <dd>Will flatten the stroke into an outline polygon.</dd> */}
        </dl>
        <h2 id="tips">Tips</h2>
        <p>
          You can continue adjusting a stroke's options after applying the
          effect.
        </p>
        <p>
          Setting a negative <b>Thinning</b> value will cause the stroke to
          become thicker at minimum pressure.
        </p>
        <p>To create a "flat" stroke, intersect the stroke with a rectangle.</p>
        <p>
          In general, areas with more vector nodes will result in greater
          pressure and so a thicker stroke, while areas with less detail will
          result in less simulated pressure and a thinner stroke. To force a
          mark to be thicker, try adding extra nodes yourself.
        </p>
        <p>
          If you'd like a better drawing experience—including real stylus
          pressure as well as better simulated pressure—try{" "}
          <a
            href="https://perfect-freehand-example.vercel.app"
            target="_blank"
            rel="noopener"
          >
            this link
          </a>
          , a demo for the{" "}
          <a
            href="https://github.com/steveruizok/perfect-freehand"
            target="_blank"
            rel="noopener"
          >
            perfect-freehand
          </a>{" "}
          library used by this plugin. You can copy your drawing from there and
          paste it into Figma.
        </p>
        <h2 id="feedback-and-contribution">Feedback & Contribution</h2>
        <p>
          If you would like to reach the author, you can tweet me at{" "}
          <a
            href="https://twitter.com/steveruizok"
            target="_blank"
            rel="noopener"
          >
            @steveruizok
          </a>
          .
        </p>
        <p>
          The source code for this plugin is available{" "}
          <a
            href="https://github.com/steveruizok/figma-plugin-perfect-freehand/issues/new"
            target="_blank"
            rel="noopener"
          >
            on Github
          </a>
          . If you would like to contribute to the project's code, that's the
          best place to start.
        </p>
        <p>
          If you think you've found a bug in the plugin, please create an issue{" "}
          <a
            href="https://github.com/steveruizok/figma-plugin-perfect-freehand/issues/new"
            target="_blank"
            rel="noopener"
          >
            here
          </a>
          .
        </p>
        <p>
          If you have ideas about how to make the plugin better, or for any
          other concern not mentioned above, post on the{" "}
          <a
            href="https://github.com/steveruizok/figma-plugin-perfect-freehand/discussions"
            target="_blank"
            rel="noopener"
          >
            Discussions board
          </a>
          .
        </p>
        <p>Verison {VERSION}</p>
        <Scrim />
      </Instructions>
      <Button onClick={() => state.send("RETURNED")}>Back</Button>
      <FooterContainer>
        <Button
          as="a"
          target="_black"
          rel="noopener"
          variant="detail"
          href="https://github.com/steveruizok/figma-plugin-perfect-freehand"
        >
          Github
        </Button>
        <Button
          as="a"
          target="_black"
          rel="noopener"
          variant="detail"
          href="https://twitter.com/steveruizok"
        >
          @steveruizok
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
  position: "relative",
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  gridRow: "span 2",
  height: "100%",
  gap: "$1",
  gridAutoRows: "min-content",
  pt: "$2",
  px: "$2",
  fontSize: "$2",
  lineHeight: 1.3,
  overflowY: "auto",
  "& h2": { py: 0, my: 0, scrollMarginTop: "16px" },
  "& h3": { py: 0, my: 0 },
  "& p": { py: 0, my: 0 },
  "& ul": { py: 0, my: 0, pl: "$2" },
  "& ol": { py: 0, my: 0, pl: "$2" },
  "& li": { pb: "$0", my: 0, pl: 0 },
  "& dl": { py: 0, my: 0 },
  "& dt": { fontWeight: "bold" },
  "& dd": { pt: 2, pb: "$1", pl: 0, ml: 0 },
  "& a": { color: "$accent", fontWeight: 500 },
  variants: {
    variant: {
      text: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
      },
    },
  },
  "& input[type=range]::-webkit-slider-runnable-track": {
    background: "red",
  },
})

const Scrim = styled.div({
  position: "sticky",
  bottom: 0,
  left: 0,
  height: 32,
  width: "100%",
  background:
    "linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
})

const FooterContainer = styled.div({
  pt: "$0",
  px: "$2",
  display: "flex",
  justifyContent: "space-between",
  a: {
    textDecoration: "none",
  },
})
