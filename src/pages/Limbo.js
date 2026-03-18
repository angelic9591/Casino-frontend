import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Limbo() {
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(2);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setBalance(user.balance);
  }, []);

  const handlePlay = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('Login first');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/limbo/play',
        {
          userId: user._id,
          betAmount: Number(bet),
          target: Number(target),
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
        <h1 className="text-4xl mb-6">🔥 Limbo</h1>

        {/* Balance */}
        <div className="mb-4 bg-gray-800 px-4 py-2 rounded">
          Balance: ${balance.toFixed(2)}
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
          className="mb-4 px-4 py-2 bg-gray-800 rounded"
        />

        {/* Play */}
        <button
          onClick={handlePlay}
          className="bg-purple-600 px-6 py-2 rounded"
        >
          Play 🔥
        </button>

        {/* Result */}
        {result && (
          <div className="mt-6 text-center">
            <p className="text-xl">Result: {result}x</p>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}