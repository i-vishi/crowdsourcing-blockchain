import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#435abf",
    },
    secondary: {
      main: "#177d9c",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#efefef",
    },
  },
  spacing: 8,
});

export default theme;
