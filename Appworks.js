import React, { useEffect } from "react";

import "./style.css";

import ScrapeForm from "./components/ScrapeForm";
import CloseButton from "./components/CloseButton";
import Loader from "./components/Loader";
import WordsContainer from "./components/WordsContainer";
import Transition from "./components/Transition";
import Info from "./components/Info";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  useEffect(() => {
    let selectedVoice = null;

    function populateVoices() {
      const voices = speechSynthesis.getVoices();
      selectedVoice = voices.find(
        (voice) => voice.name === "Google UK English Female"
      );
    }

    speechSynthesis.onvoiceschanged = populateVoices;

    populateVoices();

    /////////

    const soundToggleButton = document.getElementById("soundToggleButton");

    // This variable tracks if the sound is allowed to play
    let isSoundEnabled = false;

    // Function to handle speaking text
    function speak(text) {
      window.speechSynthesis.cancel();
      if (isSoundEnabled) {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.8;

        window.speechSynthesis.speak(utterance);

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }
    }

    // Toggle sound function
    function toggleSound() {
      isSoundEnabled = !isSoundEnabled;
      soundToggleButton.style.textDecoration = isSoundEnabled
        ? "none"
        : "line-through";
      if (!isSoundEnabled) {
        window.speechSynthesis.cancel();
      }
    }

    soundToggleButton.addEventListener("click", toggleSound);

    toggleSound();

    ////////////

    const loader = document.getElementById("loader");
    const container = document.querySelector("#words-container");
    const wordCountTag = document.getElementById("wordCount");
    const wordFrequency = document.getElementById("wordFrequency");
    const input = document.querySelector("#url");
    const info = document.getElementById("info");
    const openClose = document.getElementById("toggleOpenClose");
    const sortingWordsButton = document.getElementById("wordsModeButton");
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const wordCountContainer = document.getElementById("wordCountContainer");
    const inputForm = document.getElementById("scrapeForm");

    let isOpen = true;

    openClose.addEventListener("click", () => {
      if (isOpen) {
        openClose.innerHTML = "⟳";
        wordCountContainer.style.opacity = 0;
        inputForm.style.opacity = 0;
        isOpen = false;
      } else {
        openClose.innerHTML = "X";
        wordCountContainer.style.opacity = 1;
        inputForm.style.opacity = 1;
        isOpen = true;
      }
    });

    ////////

    document
      .getElementById("scrapeForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();

        let url = document.getElementById("url").value;

        info.style.display = "none";
        container.innerHTML = "";
        input.value = "";
        wordCountTag.style.display = "none";
        loader.style.display = "block";
        wordFrequency.style.display = "none";
        loader.textContent = "fetching words";

        if (!url.startsWith("https://") && !url.startsWith("http://")) {
          url = "https://" + url;
        }

        fetch("./api/serverless", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            let wordCount = 0;

            const text = data.text || "invalid URL, try another one";
            const rawArray = text.split(/\s+/);
            const wordsArray = rawArray;
            const wordsArrayWithoutSignsLowerCase = wordsArray.map((word) =>
              word.replace(/[\.:,...)(;&*?/_©<>-]/, "").toLowerCase()
            );
            const wordsObject = {};

            wordCountTag.style.display = "block";
            wordCountTag.innerHTML = wordCount;
            container.innerHTML = "";
            loader.style.display = "none";
            soundToggleButton.style.display = "block";
            sortingWordsButton.style.display = "block";
            openClose.style.display = "block";

            wordsArrayWithoutSignsLowerCase.forEach((word) => {
              if (wordsObject.hasOwnProperty(word)) {
                wordsObject[word] += 1;
              } else {
                wordsObject[word] = 1;
              }
            });

            const keysToRemove = [
              "the",
              "in",
              "a",
              "of",
              "by",
              "is",
              "and",
              "or",
              "but",
              "because",
              "so",
              "unless",
              "until",
              "with",
              "to",
              "on",
            ];

            keysToRemove.forEach((keyToRemove) => {
              if (wordsObject.hasOwnProperty(keyToRemove)) {
                delete wordsObject[keyToRemove];
              }
            });

            // sorting frequencies

            const sortedFrequenciesArray = Object.entries(wordsObject).sort(
              (a, b) => b[1] - a[1]
            );
            //const sortedFrequenciesArray = Object.entries(wordsObject).sort((a, b) => a[1] - b[1]);
            const sortedObject = {};

            for (let [key, value] of sortedFrequenciesArray) {
              sortedObject[key] = value;
            }

            // sorting alphqbetically

            const sortedAlphabeticallyArray =
              Object.entries(wordsObject).sort();

            const sortedObjectAlphabetically = {};

            for (let [key, value] of sortedAlphabeticallyArray) {
              sortedObjectAlphabetically[key] = value;
            }

            sortingWordsButton.addEventListener("click", toggleWordsMode);

            function toggleWordsMode() {
              if (stopSortingWordsFlag) {
                sortingWords();
              } else {
                randomWords();
              }
            }

            let stopRandomWordsFlag;
            function stopRandomWords() {
              stopRandomWordsFlag = true;
            }

            let stopSortingWordsFlag;
            function stopSortingWords() {
              stopSortingWordsFlag = true;
            }

            // random words
            function randomWords() {
              stopSortingWords();

              stopRandomWordsFlag = false;

              sortingWordsButton.innerHTML = "sort";

              wordCount = 0;

              container.innerHTML = "";
              container.style.flexDirection = "unset";
              container.style.overflow = "hidden";
              container.style.alignItems = "unset";

              Object.keys(wordsObject).forEach((word, index) => {
                if (stopRandomWordsFlag) return;

                setTimeout(() => {
                  if (stopRandomWordsFlag) return;

                  const spanTag = document.createElement("span");
                  const randomTop = Math.floor(
                    Math.random() * (viewportHeight - spanTag.clientHeight)
                  );
                  const randomLeft = Math.floor(
                    Math.random() * (viewportWidth - spanTag.clientWidth)
                  );

                  spanTag.textContent = word;
                  spanTag.className = "word draggable";

                  if (window.innerWidth < 768) {
                    spanTag.style.fontSize = `${wordsObject[word] * 10}vw`;
                  } else {
                    spanTag.style.fontSize = `${wordsObject[word] * 2}vw`;
                  }

                  spanTag.style.top = `${randomTop}px`;
                  spanTag.style.left = `${randomLeft}px`;

                  wordCountTag.innerHTML = wordCount;
                  wordCount++;

                  container.appendChild(spanTag);

                  requestAnimationFrame(() => {
                    spanTag.style.opacity = "1";
                  });

                  spanTag.addEventListener("mouseover", () => {
                    wordFrequency.style.display = "block";
                    wordFrequency.innerHTML = wordsObject[word];
                    const text = spanTag.textContent || spanTag.innerText;
                    speak(text);
                  });
                }, 50 * index);
              });
            }

            randomWords();

            function sortingWords() {
              stopSortingWordsFlag = false;

              stopRandomWords();

              sortingWordsButton.innerHTML = "mix";
              wordCount = 0;

              container.innerHTML = "";
              container.style.flexDirection = "column";
              container.style.overflow = "auto";
              container.style.alignItems = "flex-wrap";

              Object.keys(sortedObjectAlphabetically).forEach((word, index) => {
                if (stopSortingWordsFlag) return;

                // Scroll to the bottom of the page
                // window.scrollTo(0, document.body.scrollHeight);

                setTimeout(() => {
                  if (stopSortingWordsFlag) return;

                  const spanTag = document.createElement("span");

                  spanTag.textContent = word;
                  spanTag.className = "word-sorted";

                  if (window.innerWidth < 768) {
                    spanTag.style.fontSize = `${wordsObject[word] * 10}vw`;
                  } else {
                    spanTag.style.fontSize = `${wordsObject[word] * 2}vw`;
                  }

                  wordCountTag.innerHTML = wordCount;
                  wordCount++;

                  container.appendChild(spanTag);

                  requestAnimationFrame(() => {
                    spanTag.style.opacity = "1";
                  });

                  spanTag.addEventListener("mouseover", () => {
                    wordFrequency.style.display = "block";
                    wordFrequency.innerHTML = wordsObject[word];

                    const text = spanTag.textContent || spanTag.innerText;
                    speak(text);
                  });
                }, 50 * index);
              });
            }
          })
          .catch((error) => {
            loader.textContent = "invalid url, try another one";
            console.error("Error:", error);
          });
      });
  }, []);

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
