// src/components/LoginRegisterModal.js
import { useState } from 'react';
import axios from '../services/api';

export default function LoginRegisterModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user)); // ✅ REQUIRED
        console.log(res.data.user);
      } else {
        await axios.post('/auth/register', { username, email, password });
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
      onClose();
    } catch (err) {
      console.log(err.response); // 👈 ADD THIS
      alert(err.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-96 relative shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 mt-2 transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-3 text-sm">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}