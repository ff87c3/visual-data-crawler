import React, { useEffect } from "react";

import "./style.scss";

import ScrapeForm from "./components/ScrapeForm";
import CloseButton from "./components/CloseButton";
import Loader from "./components/Loader";
import WordsContainer from "./components/WordsContainer";
import Transition from "./components/Transition";
import Info from "./components/Info";
import ButtonsContainer from "./components/ButtonsContainer";

function App() {
  useEffect(() => {
    const loader = document.getElementById("loader") as HTMLElement;
    const container = document.querySelector("#words-container") as HTMLElement;
    const wordCountTag: HTMLElement | null = document.getElementById(
      "wordCount"
    ) as HTMLElement;
    const wordFrequency = document.getElementById(
      "wordFrequency"
    ) as HTMLElement;
    // const input = document.querySelector("#url");
    const urlElement = document.getElementById("url") as HTMLInputElement;
    const info = document.getElementById("info") as HTMLElement;
    const openClose = document.getElementById("toggleOpenClose") as HTMLElement;
    const sortingWordsButton = document.getElementById(
      "wordsModeButton"
    ) as HTMLElement;
    const viewportWidth: number = window.innerWidth;
    const viewportHeight: number = window.innerHeight;
    const wordCountContainer = document.getElementById(
      "wordCountContainer"
    ) as HTMLElement;
    const inputForm = document.getElementById("scrapeForm") as HTMLElement;
    const soundToggleButton = document.getElementById(
      "soundToggleButton"
    ) as HTMLElement;

    let isOpen: boolean = true;
    let isSoundEnabled: boolean = false;

    // Function to handle speaking text
    function speak(text: string) {
      window.speechSynthesis.cancel();
      if (isSoundEnabled) {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.8;

        window.speechSynthesis.speak(utterance);
      }
    }

    // Toggle sound function
    function toggleSound() {
      isSoundEnabled = !isSoundEnabled;
      if (soundToggleButton) {
        soundToggleButton.style.textDecoration = isSoundEnabled
          ? "none"
          : "line-through";
      }

      if (!isSoundEnabled) {
        window.speechSynthesis.cancel();
      }
    }
    if (soundToggleButton) {
      soundToggleButton.addEventListener("click", toggleSound);
    }

    toggleSound();

    ////////////
    openClose?.addEventListener("click", () => {
      if (isOpen) {
        if (openClose && wordCountContainer && inputForm) {
          openClose.innerHTML = "⟳";
          wordCountContainer.style.opacity = "0";
          inputForm.style.opacity = "0";
        }
        isOpen = false;
      } else {
        if (openClose && wordCountContainer && inputForm) {
          openClose.innerHTML = "X";
          wordCountContainer.style.opacity = "1";
          inputForm.style.opacity = "1";
        }
        isOpen = true;
      }
    });
    ////////

    if (inputForm) {
      inputForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let url = urlElement.value;

        info!.style.display = "none";
        container!.innerHTML = "";
        urlElement!.value = "";
        wordCountTag!.style.display = "none";
        loader!.style.display = "block";
        wordFrequency!.style.display = "none";
        loader!.textContent = "fetching words";

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
            const wordsArrayWithoutSignsLowerCase = wordsArray.map(
              (word: string) =>
                word.replace(/[.:,...)(;&*?/_©<>-]/, "").toLowerCase()
            );

            type WordsObject = {
              [key: string]: number;
            };

            const wordsObject: WordsObject = {};

            wordCountTag!.style.display = "block";
            wordCountTag!.innerHTML = wordCount.toString();
            container!.innerHTML = "";
            loader!.style.display = "none";
            soundToggleButton!.style.display = "block";
            sortingWordsButton!.style.display = "block";
            openClose!.style.display = "block";

            wordsArrayWithoutSignsLowerCase.forEach((word: string) => {
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
              "on",
              "at",
              "it",
              "as",
              "with",
              "for",
              "is",
              "that",
              "you",
              "we",
              "he",
              "she",
              "it",
              "they",
              "will",
              "i",
              "me",
              "him",
              "her",
              "us",
              "them",
              "my",
              "mine",
              "your",
              "yours",
              "his",
              "hers",
              "its",
              "our",
              "ours",
              "their",
              "theirs",
              "this",
              "that",
              "these",
              "those",
              "which",
              "who",
              "whom",
              "what",
              "when",
              "why",
              "how",
              "all",
              "any",
              "both",
              "each",
              "few",
              "more",
              "most",
              "other",
              "some",
              "such",
              "no",
              "nor",
              "not",
              "only",
              "own",
              "same",
              "so",
              "than",
              "too",
              "very",
              "s",
              "t",
              "can",
              "will",
              "just",
              "don",
              "should",
              "now",
              "ve",
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
              "at",
              "from",
              "for",
              "about",
              "like",
              "over",
              "after",
              "into",
              "through",
              "before",
              "same",
              "over",
              "under",
              "between",
              "only",
              "after",
              "into",
              "through",
              "before",
              "same",
              "over",
              "under",
              "between",
              "only",
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
            const sortedObject: Record<string, any> = {};

            for (let [key, value] of sortedFrequenciesArray) {
              sortedObject[key] = value;
            }

            // sorting alphqbetically

            const sortedAlphabeticallyArray =
              Object.entries(wordsObject).sort();

            const sortedObjectAlphabetically: Record<string, any> = {};

            for (let [key, value] of sortedAlphabeticallyArray) {
              sortedObjectAlphabetically[key] = value;
            }

            sortingWordsButton!.addEventListener("click", toggleWordsMode);

            function toggleWordsMode() {
              if (stopSortingWordsFlag) {
                sortingWords();
              } else {
                randomWords();
              }
            }

            let stopRandomWordsFlag: boolean;
            function stopRandomWords() {
              stopRandomWordsFlag = true;
            }

            let stopSortingWordsFlag: boolean;
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

                  wordCountTag!.innerHTML = wordCount.toString();
                  wordCount++;

                  container.appendChild(spanTag);

                  requestAnimationFrame(() => {
                    spanTag.style.opacity = "1";
                  });

                  spanTag.addEventListener("mouseover", () => {
                    wordFrequency.style.display = "block";
                    wordFrequency.innerHTML = wordsObject[word].toString();
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

                  wordCountTag!.innerHTML = wordCount.toString();
                  wordCount++;

                  container.appendChild(spanTag);

                  requestAnimationFrame(() => {
                    spanTag.style.opacity = "1";
                  });

                  spanTag.addEventListener("mouseover", () => {
                    wordFrequency.style.display = "block";
                    wordFrequency.innerHTML = wordsObject[word].toString();

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
    }
  }, []);

  return (
    <>
      <ScrapeForm />
      <CloseButton />
      <Loader />
      <WordsContainer />
      <ButtonsContainer />
      <Transition />
      <Info />
    </>
  );
}

export default App;
