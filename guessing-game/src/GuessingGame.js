import React, { useState } from "react";
import "./App.css";
import winSound from "./song.mp3";
import loseSound from "./song.mp3";

function GuessingGame() {
  const [balance, setBalance] = useState(100); // Initial wallet balance
  const [bid, setBid] = useState("");
  const [guess, setGuess] = useState("");
  const [outcome, setOutcome] = useState(null);
  const [result, setResult] = useState("");
  const [difficulty, setDifficulty] = useState("Select");
  const [range, setRange] = useState([]);

  const [pastPerformance, setPastPerformance] = useState([
    1, 0, 1, 1, 0, 0, 1, 0, 1, 1,
  ]); // Example past performance
  const [overallProfit, setOverallProfit] = useState(0); // Track overall profit or loss

  const difficultyOptions = {
    easy: ["1-50", "50-100"],
    medium: ["1-25", "25-50", "50-75", "75-100"],
    hard: Array.from({ length: 10 }, (_, i) => `${i * 10 + 1}-${(i + 1) * 10}`),
  };

  const handleDifficultyChange = (e) => {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    setRange(difficultyOptions[newDifficulty]);
    setGuess(""); // Reset the guess when difficulty changes
  };

  const handleGuess = () => {
    if (guess === "" || bid === "") {
      alert("Please select a guess and place a bid.");
      return;
    }

    const bidAmount = parseFloat(bid);

    if (bidAmount > balance) {
      alert("Bid amount exceeds current balance.");
      return;
    }

    const randomValue = Math.floor(Math.random() * 100) + 1;
    setOutcome(randomValue);

    const [min, max] = guess.split("-").map(Number);
    const isGuessCorrect = randomValue >= min && randomValue <= max;

    if (isGuessCorrect) {
      // Player wins according to difficulty multiplier
      const winAmount =
        bidAmount *
        (difficulty === "easy" ? 2 : difficulty === "medium" ? 4 : 10);
      setResult(
        `You won! Your balance increased by $${winAmount.toFixed(2)}. 🎉`
      );
      setBalance(balance + winAmount);

      // Update past performance and overall profit
      setPastPerformance([...pastPerformance.slice(1), 1]);
      setOverallProfit(overallProfit + winAmount);

      new Audio(winSound).play();
    } else {
      // Player loses the exact amount they bid
      setResult(
        `You lost! Your balance decreased by $${bidAmount.toFixed(2)}. 😢`
      );
      setBalance(balance - bidAmount);

      // Update past performance and overall profit
      setPastPerformance([...pastPerformance.slice(1), 0]);
      setOverallProfit(overallProfit - bidAmount);

      new Audio(loseSound).play();
    }
  };

  const getVisibleNumbers = (outcome) => {
    const numbers = [];
    for (
      let i = Math.max(1, outcome - 3);
      i <= Math.min(100, outcome + 3);
      i++
    ) {
      numbers.push(i);
    }
    return numbers;
  };

  return (
    <div className="game-container">
      <div className="left-section">
        <h1>Guess the Number!</h1>

        <div className="wallet">
          <h3>Current Balance: ${balance.toFixed(2)}</h3>
        </div>

        <div className="bid-section">
          <input
            type="number"
            placeholder="Place your bid"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            min="1"
            max={balance}
          />
        </div>

        <div className="difficulty-section">
          <p>Select Difficulty Level:</p>
          <select
            value={difficulty}
            placeholder="Choose"
            onChange={handleDifficultyChange}
          >
            <option value="Select" disabled>
              Select
            </option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {range.length > 0 && (
          <div className="range-section">
            <p>Select a Range:</p>
            {range.map((r, index) => (
              <label key={index}>
                <input
                  type="radio"
                  value={r}
                  checked={guess === r}
                  onChange={(e) => setGuess(e.target.value)}
                />
                {r}
              </label>
            ))}
          </div>
        )}

        <button onClick={handleGuess}>Submit Guess</button>
      </div>

      <div className="right-section">
        {outcome !== null && (
          <div>
            <div className="scale">
              <div
                className="pointer"
                style={{
                  left: `calc(${outcome}% - 10px)`,
                  transition: "left 0.5s ease",
                }}
              />
              <div className="numbers">
                {getVisibleNumbers(outcome).map((num) => (
                  <div key={num} className="number">
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <h2>The pointer landed on: {outcome}</h2>
            <h3 className={result.includes("won") ? "won" : "lost"}>
              {result}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuessingGame;
