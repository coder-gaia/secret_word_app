import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { wordsList } from "../src/data/words";
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = () => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  };

  const startGame = useCallback(() => {
    //clear all letters
    clearLetterStates();

    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("").map((l) => l.toLowerCase());

    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);
    setGameStage(stages[1].name);
    clearLetterStates();
  });

  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((currentGuessedLetters) => [
        ...currentGuessedLetters,
        normalizeLetter,
      ]);
    } else {
      setWrongLetters((currentWrongLetters) => [
        ...currentWrongLetters,
        normalizeLetter,
      ]);
      setGuesses((currentGuesses) => currentGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //checks win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((currentScore) => (currentScore += 100));

      //restarts with new word
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //checks if guesses had ended
  useEffect(() => {
    if (guesses <= 0) {
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
    clearLetterStates();
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
