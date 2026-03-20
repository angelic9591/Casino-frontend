import { useState, useEffect } from 'react';

export default function FairPanel({ serverSeedHash, seed }) {

  // 🔥 manual verify inputs
  const [clientSeed, setClientSeed] = useState('');

  useEffect(() => {
    generateNewSeed();
  }, []);

  const generateNewSeed = () => {
    const newSeed = Math.random().toString(36).substring(2, 12);
    localStorage.setItem("clientSeed", newSeed);
    setClientSeed(newSeed);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-5 rounded-xl shadow-lg text-sm mt-6">

      {/* HEADER */}
      <h2 className="text-lg font-bold text-blue-400 mb-4 text-center">
        🔐 Provably Fair
      </h2>

      {/* CURRENT INFO */}
      <div className="bg-gray-800 p-3 rounded-lg mb-4">
        <p className="text-gray-400 text-xs mb-1">Server Hash</p>
        <p className="break-all text-xs">{serverSeedHash}</p>

        <p className="text-gray-400 text-xs mt-2">Client Seed</p>
        <div className="flex gap-2 mt-1">
          <input
            value={clientSeed}
            onChange={(e) => localStorage.setItem("clientSeed", e.target.value)}
            className="flex-1 px-2 py-1 bg-gray-700 rounded text-xs"
          />
          <button
            onClick={generateNewSeed}
            className="bg-blue-600 px-2 rounded text-xs"
          >
            New
          </button>
        </div>
        <p className="mt-2 text-green-400 break-all text-xs">
          ServerSeed:  {seed}
        </p> 
      </div>
    </div>
  );
}