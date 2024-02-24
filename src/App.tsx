import React from "react";

import "./style.css";
import ScrapeForm from "./components/ScrapeForm";
import CloseButton from "./components/CloseButton";
import Loader from "./components/Loader";
import WordsContainer from "./components/WordsContainer";
import Transition from "./components/Transition";
import Info from "./components/Info";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  return (
    <div className="App">
      <ScrapeForm />
      <CloseButton />
      <Loader />
      <WordsContainer />
      <ButtonsContainer />
      <Transition />
      <Info />
    </div>
  );
}

export default App;
