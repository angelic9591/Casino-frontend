// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import Home from './pages/Home';
import Crash from './pages/Crash';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games" element={<Games />} />
        <Route path="/crash" element={<Crash />} />
      </Routes>
    </Router>
  );
}

export default App;