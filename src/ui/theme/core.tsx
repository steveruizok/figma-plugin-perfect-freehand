import { createStyled } from "@stitches/react"
import utils from "./utils"

const { styled, css } = createStyled({
  tokens: {
    colors: {
      $text: "#000000",
      $bg: "#ffffff",
      $highlight: "#00a3ff",
      $figma: "#00A2FF",
      $hover: "rgba(144, 144, 144, .08)",
      $accent: "#00a3ff",
      $primaryFill: "rgba(0,0,0,1)",
      $secondaryFill: "rgba(0,0,0,.4)",
      $tertiaryFill: "rgba(0,0,0,.3)",
      $quaternaryFill: "rgba(0,0,0, .07)",
      $secondaryBg: "#FFFFFF",
      $primaryGray: "rgba(174, 174, 178, 1)",
      $secondaryGray: "rgba(209, 209, 214, 1)",
      $locked: "#BBBBC0",
      $dash: "rgba(209, 209, 214, .5)",
      $backDrop: "rgba(0, 0, 0, .5)",
      $border: "rgba(142, 142, 147, .3)",
      $warn: "#FF4568",
    },
    lineHeights: {
      $ui: "1",
      $body: "1.62",
      $code: "1.5",
    },
    space: {
      $0: "8px",
      $1: "16px",
      $2: "24px",
      $3: "32px",
      $4: "40px",
      $5: "48px",
      $6: "64px",
      $7: "80px",
      $8: "96px",
      $9: "128px",
    },
    fontSizes: {
      $detail: "11px",
      $body: "12px",
      $title: "16px",
    },
    fontWeights: {
      $detail: "500",
      $body: "400",
      $strong: "600",
    },
    radii: {
      $0: "4px",
      $1: "8px",
      $2: "16px",
    },
    fonts: {
      $body: "'Inter', system-ui, sans-serif",
      $ui: "'Inter', system-ui, sans-serif",
      $heading: '"Inter", system-ui, sans-serif',
      $display: '"Inter", system-ui, sans-serif',
      $monospace: "Menlo, monospace",
    },
  },
  utils,
})

const lightTheme = css.theme({})

const darkTheme = css.theme({
  colors: {
    $text: "rgba(255, 255, 255, 1)",
    $bg: "#050505",
    $primaryFill: "rgba(255, 255, 255, 1)",
    $secondaryFill: "rgba(255, 255, 255, .5)",
    $tertiaryFill: "rgba(255, 255, 255, .3)",
    $quaternaryFill: "rgba(255, 255, 255, .1)",
    $secondaryBg: "#19191B",
    $primaryGray: "rgba(72, 72, 74, 1)",
    $secondaryGray: "rgba(44, 44, 46, 1)",
  },
})

css.global({
  "html, *": {
    boxSizing: "border-box",
  },
  body: {
    margin: 0,
    fontFamily: "$body",
    fontSize: "$body",
    fontWeight: "$body",
    color: "$text",
  },
})

export { styled, css, lightTheme, darkTheme }
