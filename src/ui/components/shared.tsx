import { styled } from "../theme"

export const Stack = styled.div({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  "& input[disabled] + label": {
    opacity: 0.4,
  },
  '& [data-fadey="true"]': {
    opacity: 0.4,
  },
  '&:hover [data-fadey="true"]': {
    opacity: 1,
  },
  '& [data-hidey="true"]': {
    visibility: "hidden",
  },
  '&:hover [data-hidey="true"]': {
    visibility: "visible",
  },
  variants: {
    alignment: {
      start: {
        justifyContent: "flex-start",
      },
      end: {
        justifyContent: "flex-end",
      },
      center: {
        justifyContent: "center",
      },
    },
    distribution: {
      start: {
        justifyContent: "flex-start",
      },
      end: {
        justifyContent: "flex-end",
      },
      center: {
        justifyContent: "center",
      },
      between: {
        justifyContent: "space-between",
      },
      around: {
        justifyContent: "space-around",
      },
    },
    gap: {
      cozyVertical: {
        "& > *:not(:first-child)": {
          mt: "$1",
        },
      },
      wideVertical: {
        "& > *:not(:first-child)": {
          mt: "$2",
        },
      },
    },
    direction: {
      vertical: {
        flexDirection: "column",
        "& > *:not(:first-child)": {
          mt: "$0",
        },
      },
      verticalReverse: {
        flexDirection: "column-reverse",
        "& > *:not(:first-child)": {
          mb: "$0",
        },
      },
      horizontal: {
        flexDirection: "row",
        "& > *:not(:first-child)": {
          ml: "$0",
        },
      },
      horizontalReverse: {
        flexDirection: "row-reverse",
        "& > *:not(:first-child)": {
          mr: "$0",
        },
      },
    },
  },
})

export const Instructions = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
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

export const Text = styled.p({
  fontSize: "$body",
  fontWeight: "$body",
  lineHeight: "$body",
  m: 0,
  p: 0,
  variants: {
    variant: {
      strong: {
        fontWeight: "$strong",
      },
      detail: {
        fontSize: "$detail",
        lineHeight: "$ui",
        color: "$secondaryFill",
      },
      selection: {
        maxWidth: "100%",
        textAlign: "left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    align: {
      center: {
        textAlign: "center",
      },
      left: {
        textAlign: "left",
      },
      right: {
        textAlign: "right",
      },
    },
    highlight: {
      none: {},
      primary: {
        color: "$accent",
      },
      secondary: {
        color: "$primaryGray",
      },
    },
  },
})

export const Button = styled.button({
  cursor: "pointer",
  display: "block",
  py: "$1",
  textAlign: "center",
  fontSize: "$body",
  fontWeight: "$strong",
  lineHeight: "$ui",
  borderRadius: "$0",
  bg: "$accent",
  color: "$bg",
  outline: "none",
  border: "none",
  "& > *:not(:first-child)": {
    ml: "$0",
  },
  "&:active": {
    filter: "brightness(.95)",
  },
  "&:disabled": {
    filter: "saturate(0%) opacity(40%)",
  },
  variants: {
    variant: {
      detail: {
        bg: "transparent",
        py: "$0",
        my: "-$0",
        px: "$0",
        mx: "-$0",
        fontSize: "$detail",
        lineHeight: "$ui",
        color: "$secondaryFill",
        "&:hover": {
          bg: "$hover",
          color: "$text",
        },
      },
      row: {
        bg: "transparent",
        py: 0,
        px: 0,
        opacity: 0.8,
        "&:hover": {
          opacity: 1,
        },
      },
    },
  },
})

export const Logo = styled.img({
  height: 32,
  mb: "$0",
})

export const Icon = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  size: 24,
})

export const Label = styled.label({
  cursor: "pointer",
})

export const Input = styled.input({
  cursor: "pointer",
  display: "block",
  py: "$1",
  px: "$1",
  fontSize: "$body",
  fontWeight: "$body",
  lineHeight: "$ui",
  borderRadius: "$0",
  bg: "$quaternaryFill",
  outline: "none",
  border: "none",
  color: "$text",
  "&:active": {
    filter: "brightness(.95)",
  },
  "&:disabled": {
    filter: "saturate(0%) opacity(40%)",
  },
})
