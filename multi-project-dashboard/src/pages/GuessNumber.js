import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GuessNumber = () => {
  const [difficulty, setDifficulty] = useState('');
  const [gameId, setGameId] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(null);
  const [hasWon, setHasWon] = useState(false);
  const [attemptsUsed,setAttemptsUsed] = useState()
  const [status, setStatus] = useState("");
  const startGame = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/guess-number/start-game', { difficulty });
      setGameId(response.data.gameId);
      setAttemptsLeft(response.data.attemptsLeft);
      setFeedback(`Game started! You have ${response.data.attemptsLeft} attempts.`);
      setHasWon(false);
    } catch (error) {
      console.error('Error starting game:', error);
      setFeedback('Error starting the game.');
    }
  };

  const makeGuess = async () => {
    if (!guess) return;
    try {
      const response = await axios.post(`http://127.0.0.1:5000/guess-number/guess`, {
        gameId,
        guess: parseInt(guess, 10)
      });
      console.log("resp", response)
      setFeedback(response.data.message);
      setAttemptsLeft(response.data.attempts_left);
      setAttemptsUsed(response.data.attempts_used);
      setStatus(response.data.status);

      if (response.data.result === 'correct') {
        setHasWon(true);
      } else if (response.data.attemptsLeft === 0) {
        setFeedback(`Game over! The correct number was ${response.data.targetNumber}.`);
      }
    } catch (error) {
      console.error('Error making a guess:', error);
      setFeedback('Error making a guess.');
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/guess-number/status');
      const { attempts_left, attempts_used, status } = response.data;
  
      setAttemptsLeft(attempts_left);
      setAttemptsUsed(attempts_used);
      setStatus(status);  // Show "Game in progress" or something else
    } catch (error) {
      console.error('Error fetching game status:', error);
      setFeedback('No game in progress. Start a new game.');
    }
  };
  
  // Call this function when the component mounts or when needed
  useEffect(() => {
    //fetchGameStatus();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Number Guessing Game</h2>

      {gameId === null ? (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <label className="block text-lg font-medium text-gray-700 mb-2">Select Difficulty:</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring focus:ring-blue-200"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Choose...</option>
            <option value="easy">Easy (10 attempts)</option>
            <option value="medium">Medium (7 attempts)</option>
            <option value="hard">Hard (5 attempts)</option>
          </select>
          <button
            onClick={startGame}
            disabled={!difficulty}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <p className="text-gray-700 mb-4">{feedback}</p>
          {hasWon ? (
            <p className="text-green-500 font-bold">Congratulations! You guessed the number correctly!</p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700 mb-2">Your Guess:</label>
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  min="1"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg p-2 text-center focus:ring focus:ring-blue-200"
                />
              </div>
              <button
                onClick={makeGuess}
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600"
              >
                Submit Guess
              </button>
              <p className="text-gray-500 mt-4">Attempts Left: {attemptsLeft}</p>
              <p className="text-gray-500 mt-4">Attempts Used: {attemptsUsed}</p>
              <p className="text-gray-500 mt-4">Status: {status}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GuessNumber;
