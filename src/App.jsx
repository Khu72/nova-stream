import './App.css'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import Movie from './pages/MovieDetail';
import WatchMovie from './pages/WatchMovie';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function App() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        if (location.pathname !== '/' && location.pathname !== '/register') {
          navigate('/', { replace: true });
        }
      } else {
        if (location.pathname === '/') {
          navigate('/home', { replace: true })
        }
      }
    })
    return () => unsubscribe();
  }, [auth, navigate])

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/search/:query" element={<Search />} />
      <Route path="/movie/:id" element={<Movie />} />
      <Route path="/watch/:id" element={<WatchMovie />} />
    </Routes>
  );
}

export default App;
