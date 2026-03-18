// src/pages/Games.js
import { useEffect, useState } from 'react';
import axios from '../services/api';
import { isLoggedIn } from '../utils/auth';
import LoginRegisterModal from '../components/LoginRegisterModal';

export default function Games() {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     const fetchGames = async () => {
//       const res = await axios.get('/games');
//       setGames(res.data);
//     };
//     fetchGames();
//   }, []);

//   const handlePlay = () => {
//     if (!isLoggedIn()) {
//       setShowModal(true);
//       return;
//     }
//     alert('Game Started!'); // Replace with actual game logic
//   };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {games.map(game => (
          <div key={game._id} className="bg-gray-800 text-white rounded-xl p-4 shadow-md flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
              <p className="mb-2">Min Bet: ${game.minBet}</p>
              <p>Type: {game.type}</p>
            </div>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-md transition"
            //   onClick={handlePlay}
            >
              Play
            </button>
          </div>
        ))}
      </div>
      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </div>
  );
}