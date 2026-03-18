import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CoinFlip() {
  const [bet, setBet] = useState(10);
  const [choice, setChoice] = useState('heads');
  const [result, setResult] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setBalance(user.balance);
  }, []);

  const handleFlip = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Login first');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/coin/flip',
        {
          userId: user._id,
          betAmount: Number(bet),
          choice,
        }
      );

      setResult(res.data.result);
      setMessage(res.data.message);
      setBalance(res.data.balance);

      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, balance: res.data.balance })
      );

    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">

      <div className="flex flex-col items-center p-8">
        <h1 className="text-4xl mb-6">🎨 Coin Flip</h1>

        {/* Balance */}
        <div className="mb-4 bg-gray-800 px-4 py-2 rounded">
          Balance: ${balance.toFixed(2)}
        </div>

        {/* Bet */}
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="mb-4 px-4 py-2 bg-gray-800 rounded"
        />

        {/* Choice */}
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setChoice('heads')}
            className={`px-4 py-2 rounded ${
              choice === 'heads'
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}
          >
            Heads
          </button>

          <button
            onClick={() => setChoice('tails')}
            className={`px-4 py-2 rounded ${
              choice === 'tails'
                ? 'bg-blue-600'
                : 'bg-gray-700'
            }`}
          >
            Tails
          </button>
        </div>

        {/* Flip */}
        <button
          onClick={handleFlip}
          className="bg-green-600 px-6 py-2 rounded"
        >
          Flip 🎨
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 text-center">
            <p className="text-xl">Result: {result.toUpperCase()}</p>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}