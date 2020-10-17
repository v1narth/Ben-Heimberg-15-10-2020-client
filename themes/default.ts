import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6353ec",
    },
    secondary: {
      main: "#ff5896",
    },
    error: {
      main: red.A400,
    },
    success: {
      main: "#A4FFAD",
    },
    background: {
      default: "#fff",
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        borderRadius: 0,
        backgroundColor: "#f1f1f1",
        padding: ".5em 2.75em",
      },
    },
    MuiFilledInput: {
      input: {
        background: "#FFF",
      },
      inputMultiline: {
        background: "#FFF",
      },
      multiline: {
        background: "#FFF",
        "&:hover, &:focus": {
          background: "#FFF",
        },
      },
      root: {
        background: "#FFF",
        "&&&:before, &&&:after": {
          borderBottom: "none",
        },
        boxShadow: "1px 1px 5px 0 rgba(0,0,0, .06)",
        border: "1px solid #DEDEDE",
      },
    },
  },
});

export default theme;
