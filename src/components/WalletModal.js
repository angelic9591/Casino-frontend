import { useState } from 'react';
import axios from 'axios';

export default function WalletModal({ onClose, balance, setBalance }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('demo');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      alert('Enter valid amount');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      alert('User not found, login again');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        'http://localhost:5000/api/wallet/deposit',
        {
          userId: user._id,
          amount: amt,
        }
      );

      // ✅ Update balance from backend
      setBalance(res.data.balance);

      // ✅ Update localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ ...user, balance: res.data.balance })
      );

      alert('Deposit successful 💰');

      onClose();
      setAmount('');

    } catch (err) {
      alert(err.response?.data?.message || 'Error depositing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          💰 Wallet
        </h2>

        {/* TYPE */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded"
          >
            <option value="demo">Demo</option>
            <option value="live">Live (soon)</option>
          </select>
        </div>

        {/* AMOUNT */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-400">Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 rounded text-white"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between gap-2">
          <button
            onClick={handleDeposit}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 py-2 rounded-lg"
          >
            {loading ? 'Processing...' : 'Deposit'}
          </button>

          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}