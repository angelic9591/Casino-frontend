import { useState, useEffect } from 'react';
import axios from 'axios';
import FairPanel from '../components/FairPanel';

export default function HiLo() {
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(10);
  const [current, setCurrent] = useState(null);
  const [message, setMessage] = useState('');
  const [nonce, setNonce] = useState(0);
  const [serverSeedHash, setServerSeedHash] = useState('');
  const [seed, setSeed] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setBalance(user.balance);
    const fetchData = async () => {
        const res = await axios.post(
        `http://localhost:5000/api/seed/get`
        );
        setServerSeedHash(res.data.seed);
    };
    fetchData();
    setNonce(1);
  }, []);

  const startGame = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await axios.post(
      'http://localhost:5000/api/hilo/start',
      {
        userId: user._id,
        betAmount: Number(bet),
      }
    );

    setCurrent(res.data.current);
    setBalance(res.data.balance);
    setMessage('');
  };

  const makeGuess = async (guess) => {
    const user = JSON.parse(localStorage.getItem('user'));

    const res = await axios.post(
      'http://localhost:5000/api/hilo/guess',
      {
        userId: user._id,
        current,
        guess,
        betAmount: Number(bet),
        clinetSeed: localStorage.getItem("clientSeed"),
        nonce: nonce
      }
    );
      
    setNonce(nonce + 1);
    setServerSeedHash(res.data.hash);
    setSeed(res.data.serverSeed);

    setCurrent(res.data.next);
    setBalance(res.data.balance);

    if (res.data.win) {
      setMessage(`Win! +${res.data.payout}`);
    } else {
      setMessage('Lost ❌');
      setCurrent(null);
    }

    localStorage.setItem(
      'user',
      JSON.stringify({ ...user, balance: res.data.balance })
    );
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">

      <div className="flex flex-col items-center p-8">
        <h1 className="text-4xl mb-6">📈 Hi-Lo</h1>

        <div className="mb-4">
          Balance: ${balance.toFixed(2)}
        </div>

        {!current ? (
          <>
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
              className="mb-4 px-4 py-2 bg-gray-800 rounded"
            />

            <button
              onClick={startGame}
              className="bg-blue-600 px-6 py-2 rounded"
            >
              Start Game
            </button>
          </>
        ) : (
          <>
            <div className="text-3xl mb-4">{current}</div>

            <div className="flex gap-4">
              <button
                onClick={() => makeGuess('higher')}
                className="bg-green-600 px-6 py-2 rounded"
              >
                Higher
              </button>

              <button
                onClick={() => makeGuess('lower')}
                className="bg-red-600 px-6 py-2 rounded"
              >
                Lower
              </button>
            </div>
          </>
        )}

        {message && <p className="mt-4">{message}</p>}
      </div>
      
      <FairPanel nonce = {nonce} serverSeedHash = {serverSeedHash} seed = {seed} />
    </div>
  );
}