import React from "react";
import {
  ChakraProvider,
  ColorModeScript,
  localStorageManager,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import theme from "../theme";
import { AppProvider } from "../context/AppContext";

const Providers = ({ children }) => {
  return (
    <ChakraProvider theme={theme} colorModeManager={localStorageManager}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AppProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </AppProvider>
    </ChakraProvider>
  );
};

export default Providers;
