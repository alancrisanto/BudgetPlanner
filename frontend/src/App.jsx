import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;