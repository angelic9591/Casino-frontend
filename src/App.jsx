// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Home from './pages/Home';
import Crash from './pages/Crash';
import Dice from './pages/Dice';
import { useState, useEffect } from 'react';
import Limbo from './pages/Limbo';
import CoinFlip from './pages/CoinFlip';

function App() {
   const [balance, setBalance] = useState(0);
   useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setBalance(user.balance || 0);
    }
  }, []);
  return (
    <Router>
      <Navbar balance={balance} setBalance={setBalance} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<Games />} />
        <Route path="/crash" element={<Crash />} />
        <Route path="/dice" element={<Dice />} />
        <Route path="/limbo" element={<Limbo />} />
        <Route path="/coin" element={<CoinFlip />} />
      </Routes>
    </Router>
  );
}

export default App;