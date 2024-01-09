import React from "react";
import Weather from "./components/Weather";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
const App = () => {
  return (
    <>
      <ChakraProvider>
        <Weather />
      </ChakraProvider>
    </>
  );
};

export default App;
