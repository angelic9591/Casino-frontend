import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Dice() {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(50);
  const [type, setType] = useState('under');

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');

  const [balance, setBalance] = useState(0);

  // ✅ Load balance on page load
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setBalance(user.balance || 0);
    }
  }, []);

  const handlePlay = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Please login');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/dice/play',
        {
          userId: user._id,
          betAmount: Number(bet),
          target: Number(target),
          type,
        }
      );

      // 🎲 result
      setResult(res.data.roll);
      setMessage(res.data.message);

      // 💰 update balance
      setBalance(res.data.balance);

      // 🔄 sync localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, balance: res.data.balance })
      );

    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-4xl mb-6">🎲 Dice Game</h1>

        {/* 💰 Balance Display */}
        <div className="mb-4 text-lg bg-gray-800 px-4 py-2 rounded">
          Balance: <span className="text-green-400">${balance.toFixed(2)}</span>
        </div>

        {/* Bet */}
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
          className="mb-2 px-4 py-2 bg-gray-800 rounded"
        />

        {/* Target */}
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="mb-2 px-4 py-2 bg-gray-800 rounded"
        />

        {/* Type */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mb-4 px-4 py-2 bg-gray-800 rounded"
        >
          <option value="under">Roll Under</option>
          <option value="over">Roll Over</option>
        </select>

        {/* Play */}
        <button
          onClick={handlePlay}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Roll 🎲
        </button>

        {/* Result */}
        {result !== null && (
          <div className="mt-6 text-center">
            <p className="text-xl">Result: {result}</p>
            <p className="mt-2">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}