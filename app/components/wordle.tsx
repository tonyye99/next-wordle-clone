"use client";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import dictionary from "../data/dictionary.json";
import targetWords from "../data/targetWords.json";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ITiles {
  text: string | undefined;
  state: string | undefined;
  flip: boolean;
  dance: boolean;
  shake: boolean;
  index: number;
}

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

export default function Wordle() {
  const initialTargetWord =
    targetWords[Math.floor(Math.random() * targetWords.length)];
  const initialTiles: ITiles[] = Array.from({ length: 30 }, (_, index) => ({
    text: "",
    state: "",
    flip: false,
    dance: false,
    shake: false,
    index: index % 5,
  }));

  const initialKeyboard = [
    {
      text: "Q",
      state: "",
      code: "q",
    },
    {
      text: "W",
      state: "",
      code: "w",
    },
    {
      text: "E",
      state: "",
      code: "e",
    },
    {
      text: "R",
      state: "",
      code: "r",
    },
    {
      text: "T",
      state: "",
      code: "t",
    },
    {
      text: "Y",
      state: "",
      code: "y",
    },
    {
      text: "U",
      state: "",
      code: "u",
    },
    {
      text: "I",
      state: "",
      code: "i",
    },
    {
      text: "O",
      state: "",
      code: "o",
    },
    {
      text: "P",
      state: "",
      code: "p",
    },
    {
      text: "",
      state: "",
    },
    {
      text: "A",
      state: "",
      code: "a",
    },
    {
      text: "S",
      state: "",
      code: "s",
    },
    {
      text: "D",
      state: "",
      code: "d",
    },
    {
      text: "F",
      state: "",
      code: "f",
    },
    {
      text: "G",
      state: "",
      code: "g",
    },
    {
      text: "H",
      state: "",
      code: "h",
    },
    {
      text: "J",
      state: "",
      code: "j",
    },
    {
      text: "K",
      state: "",
      code: "k",
    },
    {
      text: "L",
      state: "",
      code: "l",
    },
    {
      text: "",
      state: "",
    },
    {
      text: "Enter",
      state: "",
      isLarge: true,
      code: "Enter",
    },
    {
      text: "Z",
      state: "",
      code: "z",
    },
    {
      text: "X",
      state: "",
      code: "x",
    },
    {
      text: "C",
      state: "",
      code: "c",
    },
    {
      text: "V",
      state: "",
      code: "v",
    },
    {
      text: "B",
      state: "",
      code: "b",
    },
    {
      text: "N",
      state: "",
      code: "n",
    },
    {
      text: "M",
      state: "",
      code: "m",
    },
    {
      text: "DEL",
      state: "",
      isLarge: true,
      code: "Delete",
    },
  ];

  const [tiles, setTiles] = useState<ITiles[]>(initialTiles);
  const [keyboard, setKeyboard] = useState(initialKeyboard);
  const [guessWord, setGuessWord] = useState("");
  const [targetWord, setTargetWord] = useState(initialTargetWord);
  const [activeTiles, setActiveTiles] = useState<ITiles[]>([]);
  const [hasOver, setHasOver] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
  });

  useEffect(() => {
    let activeTiles = tiles.filter((tile) => tile.state === "active");

    function pressKey(key: string) {
      const index = tiles.findIndex((tile) => tile.text === "");

      if (activeTiles.length === WORD_LENGTH || index === -1) return;

      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles];
        updatedTiles[index].text = key;
        updatedTiles[index].state = "active";
        return updatedTiles;
      });
    }

    function shakeTiles() {
      activeTiles.forEach((activeTile) => {
        const index = tiles.findIndex((tile) => tile === activeTile);
        if (index !== -1) {
          setTiles((prevTiles) => {
            const updatedTiles = [...prevTiles];
            updatedTiles[index].shake = true;
            return updatedTiles;
          });
        }
      });
    }

    function deleteKey() {
      const lastTile = activeTiles[activeTiles.length - 1];
      const index = tiles.findIndex((tile) => tile === lastTile);
      if (index === -1) return;
      setTiles((prevTiles) => {
        const updatedTiles = [...prevTiles];
        updatedTiles[index].text = "";
        updatedTiles[index].state = "";
        return updatedTiles;
      });
    }

    function filpTile() {
      activeTiles.forEach((activeTile, tileIndex) => {
        const index = tiles.findIndex((tile) => tile === activeTile);
        if (index !== -1) {
          setTimeout(
            () => {
              setTiles((prevTiles) => {
                const updatedTiles = [...prevTiles];
                updatedTiles[index].flip = true;
                return updatedTiles;
              });
            },
            (tileIndex * FLIP_ANIMATION_DURATION) / 2,
          );
        }
      });
    }

    function submitGuess() {
      if (activeTiles.length !== WORD_LENGTH) {
        setAlert({
          message: "Oops! Please add more words",
        });
        shakeTiles();
        return;
      }
      setActiveTiles(activeTiles);

      const guessWord = activeTiles
        .reduce((word, tile) => {
          return word + "" + tile.text;
        }, "")
        .trim();

      setGuessWord(guessWord);

      if (!dictionary.includes(guessWord)) {
        shakeTiles();
        setAlert({
          message: "Oops! The word is not in our list.",
        });
        return;
      }

      filpTile();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey) return;

      if (hasOver) return;

      if (e.key.match(/^[a-z]$/)) {
        pressKey(e.key);
        return;
      }
      if (e.key === "Enter") {
        submitGuess();
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        deleteKey();
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tiles, activeTiles, hasOver, targetWord]);

  function handleAnimationEnd(index: number) {
    setTiles((prevTiles) => {
      const updatedTiles = [...prevTiles];
      updatedTiles[index].shake = false;
      return updatedTiles;
    });
  }

  function handleTransitionEnd(index: number) {
    const letter = tiles[index].text;
    let updatedState = "";
    setTiles((prevTiles) => {
      const updatedTiles = [...prevTiles];
      updatedTiles[index].flip = false;
      if (targetWord[updatedTiles[index].index] === updatedTiles[index].text) {
        updatedTiles[index].state = "correct";
        updatedState = "correct";
      } else if (targetWord.includes(updatedTiles[index].text!)) {
        updatedTiles[index].state = "wrong-location";
        updatedState = "wrong-location";
      } else {
        updatedTiles[index].state = "wrong";
        updatedState = "wrong";
      }

      if (updatedTiles[index].index === WORD_LENGTH - 1) {
        winOrlose();
      }
      return updatedTiles;
    });

    const keyboardIndex = keyboard.findIndex(
      (key) => key.text.toLowerCase() === letter,
    );
    if (keyboardIndex === -1) return;
    setKeyboard((prev) => {
      const updatedKeyboard = [...prev];
      updatedKeyboard[keyboardIndex].state = updatedState;
      return updatedKeyboard;
    });
  }

  function winOrlose() {
    if (guessWord === targetWord) {
      activeTiles.forEach((activeTile: any, aIndex: number) => {
        const index = tiles.findIndex((tile) => tile === activeTile);
        setTimeout(
          () => {
            setTiles((prevTiles) => {
              const updatedTiles = [...prevTiles];
              updatedTiles[index].dance = true;
              return updatedTiles;
            });
          },
          (aIndex * DANCE_ANIMATION_DURATION) / 5,
        );
      });
      setAlert({
        message: "Congrats! You won!",
      });
      setHasOver(true);
      return;
    }

    const remainingTiles = tiles.filter((tile) => tile.text === "");
    if (remainingTiles.length === 0) {
      setAlert({
        message: `You Lost! The word is ${targetWord}`,
      });
      setHasOver(true);
    }
  }

  useEffect(() => {
    if (alert && !hasOver) {
      const timeout = setTimeout(() => setAlert({ message: "" }), 2000);
      return () => clearTimeout(timeout);
    }
  }, [alert, hasOver]);

  function generateTargetWord() {
    const word = targetWords[Math.floor(Math.random() * targetWords.length)];
    setTargetWord(word);
  }

  return (
    <>
      <div className="flex flex-col flex-1 gap-5 items-center justify-start">
        <div className="h-24 flex flex-col items-center gap-4">
          {alert.message && (
            <Alert className="flex items-center">
              <AlertTitle>{alert.message}</AlertTitle>
            </Alert>
          )}
          {hasOver && (
            <div>
              <Button
                onClick={() => {
                  setTiles(initialTiles);
                  setKeyboard(initialKeyboard);
                  setHasOver(false);
                  generateTargetWord();
                  setAlert({ message: "" });
                }}
              >
                Play again
              </Button>
            </div>
          )}
        </div>
        <div className="grid justify-center grid-cols-[repeat(5,3.7em)] grid-rows-[repeat(6,3.7em)] gap-2">
          {tiles.map((tile: any, index: number) => (
            <div
              key={index}
              className={cn("tile", {
                "animate-shake": tile.shake,
                "animate-dance": tile.dance,
                "[transform:rotateX(90deg)]": tile.flip,
                "bg-[hsl(240,2%,23%)]": tile.state === "wrong",
                "bg-[hsl(49,51%,47%)]": tile.state === "wrong-location",
                "bg-[hsl(115,29%,43%)]": tile.state === "correct",
                "border-[hsl(200,1%,34%)]": tile.state === "active",
              })}
              onAnimationEnd={() => handleAnimationEnd(index)}
              onTransitionEnd={() => handleTransitionEnd(index)}
            >
              {tile.text}
            </div>
          ))}
        </div>

        <div className="mt-7">
          <div className="keyboard">
            {keyboard.map((key, index) => {
              if (!key.text) {
                return <div key={index}></div>;
              } else {
                return (
                  <button
                    className={cn("key", {
                      large: key.isLarge,
                      correct: key.state === "correct",
                      wrong: key.state === "wrong",
                      "wrong-location": key.state === "wrong-location",
                    })}
                    id={key.text}
                    key={key.text}
                    onClick={() => {
                      const event = new KeyboardEvent("keydown", {
                        key: key.code,
                        code: key.code,
                        bubbles: true,
                      });
                      document.getElementById(key.text)?.dispatchEvent(event);
                    }}
                  >
                    {key.text}
                  </button>
                );
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}
