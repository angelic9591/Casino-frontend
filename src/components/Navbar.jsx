// src/components/Navbar.js
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginRegisterModal from './LoginRegisterModal';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const linkClass = (path) =>
    `hover:text-blue-400 transition ${
      location.pathname === path ? 'text-blue-500 font-semibold' : ''
    }`;

  return (
    <>
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-500">
          🎰 Casino
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={linkClass('/')}>Home</Link>
          <Link to="/games" className={linkClass('/games')}>Games</Link>
          <Link to="/crash" className={linkClass('/crash')}>Crash</Link>
          {isLoggedIn && (
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Modal */}
      {showModal && <LoginRegisterModal onClose={() => setShowModal(false)} />}
    </>
  );
}