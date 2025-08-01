import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Hero from './components/Hero';
import NewsFeed from './components/NewsFeed';
import BelowHeroSearch from './components/BelowHeroSearch';
import SavedStories from './components/SavedStories';
import Login from './components/Login';
import Register from './components/Register';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';

function App() {
  const [category, setCategory] = useState('top');
  const [search, setSearch] = useState('');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    try {
      const [, payload] = token.split('.');
      setUser(JSON.parse(atob(payload)));
    } catch {
      setUser(null);
    }
  };

  return (
    <Router>
      <Header
        category={category}
        setCategory={setCategory}
        search={search}
        setSearch={setSearch}
        user={user}
        onLogout={handleLogout}
      />
      <Hero />
      <BelowHeroSearch
        search={search}
        setSearch={setSearch}
        setCategory={setCategory}
      />
      <Routes>
        <Route path="/" element={
          <NewsFeed
            category={category}
            search={search}
          />
        } />
        <Route path="/saved" element={<SavedStories />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;