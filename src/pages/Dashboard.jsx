// src/pages/Dashboard.js
import { useEffect, useState } from 'react';
import axios from '../services/api';

export default function Dashboard() {
  const [wallet, setWallet] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/users/me');
        setWallet(res.data.wallet);
      } catch {
        setWallet(0);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md w-64">
        <h2 className="text-xl mb-2">Wallet Balance</h2>
        <p className="text-2xl font-semibold">${wallet}</p>
      </div>
    </div>
  );
}