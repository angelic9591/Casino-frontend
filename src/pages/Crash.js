import { useEffect, useState } from 'react';
import { useRef } from 'react';

import axios from 'axios';
import { io } from 'socket.io-client';
import { isLoggedIn } from '../utils/auth';
import LoginRegisterModal from '../components/LoginRegisterModal';
import FairPanel from '../components/FairPanel';

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
  const [nonce, setNonce] = useState(0);
  const [serverSeedHash, setServerSeedHash] = useState('');
  const [seed, setSeed] = useState('');

  const cashedOutRef = useRef(false);
  const lostAlertRef = useRef(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      const user = JSON.parse(userData);
      setBalance(user.balance || 0);
    }
    const fetchData = async () => {
        const res = await axios.post(
        `http://localhost:5000/api/seed/get`
        );
        setServerSeedHash(res.data.seed);
    };
    fetchData();
    setNonce(1);
  }, []);


  useEffect(() => {
    cashedOutRef.current = cashedOut;
    lostAlertRef.current = lostAlertShown;
  }, [cashedOut, lostAlertShown]);


  useEffect(() => {
    socket.on('crash:update', (data) => {
      setMultiplier(parseFloat(data.multiplier));
      setCrashed(false);
    });

    socket.on('crash:crash', (data) => {
      setMultiplier(parseFloat(data.multiplier));
      setCrashed(true);
      setGameRunning(false);
      
      setNonce(nonce => nonce + 1);
      setServerSeedHash(data.hash);
      setSeed(data.serverSeed);

      // ✅ use refs instead of state
      if (!cashedOutRef.current && !lostAlertRef.current) {
        alert('You lost! 💥');
        lostAlertRef.current = true;
        setLostAlertShown(true);
      }
    });

    socket.on('bet:placed', (data) => {
      setBalance(data.balance);
    });

    socket.on('cashout:success', (data) => {
      alert(`You won ${data.winAmount.toFixed(2)} 💰`);
      setBalance(data.balance);
      setCashedOut(true);
      setGameRunning(false);
    });

    socket.on('bet:lost', () => {
      if (!lostAlertRef.current) {
        alert('You lost! 💥');
        lostAlertRef.current = true;
        setLostAlertShown(true);
      }
    });

    socket.on('bet:error', (err) => {
      alert(err.message);
    });

    return () => {
      socket.off('crash:update');
      socket.off('crash:crash');
      socket.off('bet:placed');
      socket.off('cashout:success');
      socket.off('bet:lost');
      socket.off('bet:error');
    };
  }, []);


  const handleStart = () => {
    const userData = localStorage.getItem('user');
    if (!isLoggedIn() || !userData) {
        setShowModal(true);
        return;
    }
  setLostAlertShown(false);
  lostAlertRef.current = false;
  setCashedOut(false);
  cashedOutRef.current = false;

    socket.emit('crash:bet', {
        userId: user._id,
        amount: betAmount,
        
  });

  socket.emit('crash:start',{
    clinetSeed: localStorage.getItem("clientSeed"),
    nonce: nonce
  });

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
      <FairPanel nonce = {nonce} serverSeedHash = {serverSeedHash} seed = {seed} />

      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}