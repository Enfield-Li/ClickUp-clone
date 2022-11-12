import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useColorMode } from "@chakra-ui/react";
import {
  darkCardHoverBG,
  darkNavBG,
  darkText,
  lightMainBG,
  lightText,
} from "../../globalTheme";

type Props = { children: React.ReactNode };

export default function MaterialTheme({ children }: Props) {
  const { colorMode } = useColorMode();

  const theme = createTheme({
    components: {
      MuiCalendarOrClockPicker: {
        styleOverrides: {
          root: {
            backgroundColor: colorMode === "dark" ? darkCardHoverBG : "white",
            color: colorMode === "dark" ? darkText : lightText,
            width: "250px",
            overflow: "hidden",
          },
        },
      },

      MuiPickerStaticWrapper: {
        styleOverrides: {
          content: {
            backgroundColor: "green",
            width: "250px",
            height: "250px",
            overflow: "hidden",
          },
          root: {
            width: "250px",
            overflow: "hidden",
          },
        },
      },

      MuiCalendarPicker: {
        styleOverrides: {
          root: {
            width: "250px",
            margin: 0,
            overflow: "hidden",
          },
        },
      },

      //   Header
      MuiPickersCalendarHeader: {
        styleOverrides: {
          root: {
            fontsize: "15px",
          },
          label: {
            width: "100px",
            fontsize: "10px",
          },
          switchViewButton: {
            m: "0",
            width: "20px",
            height: "20px",
            fontsize: "10px",
            color: colorMode === "dark" ? darkText : lightText,
            "&:hover": {
              backgroundColor: colorMode === "dark" ? darkNavBG : lightMainBG,
            },
          },
        },
      },
      MuiPickersArrowSwitcher: {
        styleOverrides: {
          root: {
            width: "70px",
          },
          button: {
            color: colorMode === "dark" ? darkText : lightText,
            "&:hover": {
              backgroundColor: colorMode === "dark" ? darkNavBG : lightMainBG,
            },
          },
        },
      },
      MuiPickersFadeTransitionGroup: {
        styleOverrides: {
          root: {
            fontSize: "13px",
            marginRight: 0,
          },
        },
      },

      //   day picker
      MuiDayPicker: {
        styleOverrides: {
          weekDayLabel: {
            width: "25px",
            color: colorMode === "dark" ? darkText : lightText,
          },
        },
      },

      MuiPickersDay: {
        styleOverrides: {
          root: {
            width: "25px",
            height: "25px",
            color: colorMode === "dark" ? darkText : lightText,
            backgroundColor: colorMode === "dark" ? darkCardHoverBG : "white",
            "&:hover": {
              backgroundColor: colorMode === "dark" ? darkNavBG : lightMainBG,
            },
          },
        },
      },

      MuiYearPicker: {
        styleOverrides: {
          root: {
            width: "250px",
            height: "200px",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
