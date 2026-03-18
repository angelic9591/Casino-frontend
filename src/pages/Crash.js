import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { isLoggedIn } from '../utils/auth';
import LoginRegisterModal from '../components/LoginRegisterModal';
import axios from 'axios';

const socket = io('http://localhost:5000');

export default function Crash() {
  const [multiplier, setMultiplier] = useState(1);
  const [crashed, setCrashed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const [lostAlertShown, setLostAlertShown] = useState(false);

  const [betAmount, setBetAmount] = useState(10);
  const [balance, setBalance] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      setBalance(user.balance || 0);
    }
  }, []);

  useEffect(() => {
    // 🔥 CRASH UPDATE
    socket.on('crash:update', (data) => {
      setMultiplier(parseFloat(data.multiplier));
      setCrashed(false);
    });

    // 💥 CRASH EVENT
    socket.on('crash:crash', (data) => {
      setMultiplier(parseFloat(data.multiplier));
      setCrashed(true);
      setGameRunning(false);

      setLostAlertShown((prev) => {
        if (!cashedOut && !prev) {
          alert('You lost! 💥');
          return true;
        }
        return prev;
      });
    });

    // 💰 BET PLACED
    socket.on('bet:placed', (data) => {
      setBalance(data.balance);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, balance: data.balance })
        );
      }
    });

    // 🏆 CASHOUT SUCCESS
    socket.on('cashout:success', (data) => {
      alert(`You won ${data.winAmount.toFixed(2)} 💰`);
      setBalance(data.balance);

      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.setItem(
          'user',
          JSON.stringify({ ...user, balance: data.balance })
        );
      }

      setCashedOut(true);
      setGameRunning(false);
    });

    // ❌ LOST EVENT
    socket.on('bet:lost', () => {
      setLostAlertShown((prev) => {
        if (!prev) {
          alert('You lost! 💥');
          return true;
        }
        return prev;
      });
    });

    // ⚠️ ERROR
    socket.on('bet:error', (err) => {
      alert(err.message);
    });

    // 🧹 CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off('crash:update');
      socket.off('crash:crash');
      socket.off('bet:placed');
      socket.off('cashout:success');
      socket.off('bet:lost');
      socket.off('bet:error');
    };
  }, []); // ✅ RUN ONLY ONCE

  const handleStart = () => {
    const userData = localStorage.getItem('user');
    console.log(userData);
    if (!isLoggedIn() || !userData) {
        setShowModal(true);
        return;
    }

    socket.emit('crash:bet', {
        userId: user._id,
        amount: betAmount,
  });

  socket.emit('crash:start');

  setCashedOut(false);
  setCrashed(false);
  setLostAlertShown(false);
  setGameRunning(true);
};

  const handleCashOut = () => {
    socket.emit('crash:cashout');
  };

  return (
    <div className="p-8 flex flex-col items-center text-white">
      <h1 className="text-4xl font-bold mb-6">Crash Game 🚀</h1>

      <div className="bg-gray-900 w-full max-w-xl h-64 rounded-xl flex flex-col justify-center items-center shadow-lg">
        <h2 className={`text-5xl font-bold ${crashed ? 'text-red-500' : 'text-green-400 animate-pulse'}`}>
          {multiplier.toFixed(2)}x
        </h2>
        {crashed && <p className="text-red-400 mt-2">💥 Crashed!</p>}
      </div>

      <div className="mt-4 text-lg">
        Balance: ${balance.toFixed(2)}
      </div>

      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        className="mt-2 px-4 py-2 rounded bg-gray-800 text-white"
      />

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleStart}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
          disabled={gameRunning}
        >
          Start
        </button>

        <button
          onClick={handleCashOut}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
          disabled={!gameRunning}
        >
          Cash Out
        </button>
      </div>

      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}