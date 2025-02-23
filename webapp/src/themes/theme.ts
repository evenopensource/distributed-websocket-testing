import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#FFFFFF",
    },
    text: {
      primary: "#0E1524",
      secondary: "#666E7D",
    },
    action: {
      disabled: "#979FAD",
    },
    divider: "#DFE3EB",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h6: {
      fontWeight: 600,
      fontSize: "16px",
      lineHeight: "16px",
      letterSpacing: "0px",
      color: "#0E1524",
    },
    body1: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "16px",
      letterSpacing: "0px",
      color: "#0E1524",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "20px",
      letterSpacing: "0%",
      color: "#666E7D",
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "18px",
      letterSpacing: "0%",
      color: "#666E7D",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "&::placeholder": {
            color: "#979FAD",
            fontWeight: 400,
            fontSize: "14px",
            lineHeight: "16px",
          }
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          padding: "8px 16px",
          gap: "4px",
        },
        contained: {
          background: "linear-gradient(180deg, #6E9AF9 -75.83%, #2160EB 100%)",
          boxShadow: `
            0px -1px 2px 0px #1C3EAF80 inset,
            0px 0px 0.5px 0px #FFFFFF70 inset,
            0px 1px 2px 0px #0E15240F
          `,
        },
        outlined: {
          border: "1px solid #CED3EA",
          boxShadow: `
            0px 0px 0.5px 0px #FFFFFF70 inset,
            0px 1px 2px 0px #0E15240F
          `,
        },
      },
    },
    // MuiCssBaseline: {
    //   styleOverrides: {
    //     body: {
    //       backgroundColor: '#ffffff',
    //     },
    //   },
    // },
  },
});

export default theme;
