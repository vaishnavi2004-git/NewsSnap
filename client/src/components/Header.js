import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const categories = [
  { label: 'Top', value: 'top' },
  { label: 'Technology', value: 'technology' },
  { label: 'Education', value: 'education' },
  { label: 'Sports', value: 'sports' },
  { label: 'Business', value: 'business' },
];

function Header({
  category, setCategory,
  search, setSearch,
  user, onLogout
}) {
  const navigate = useNavigate();
  const [showAccount, setShowAccount] = useState(false);

  const handleCategoryClick = (cat) => {
    if (cat === 'top') {
      setCategory('all'); // 'all' means aggregate all news
    } else {
      setCategory(cat);
    }
    setSearch('');
    navigate('/');
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCategory(''); // Search is prioritized if filled
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={()=>{setCategory('all'); setSearch(''); navigate('/')}}>☆ NewsSnap</div>
      <nav className="header-nav">
        <Link
          // className={category === 'all' ? "header-btn-active" : "header-btn"}
          onClick={()=>handleCategoryClick('all')}
        >Home</Link>
        {categories.slice(1).map(cat => (
          <Link
            key={cat.value}
            // className={category === cat.value ? "header-btn-active" : "header-btn"}
            onClick={()=>handleCategoryClick(cat.value)}
          >{cat.label}</Link>
        ))}
        <form onSubmit={handleSearchSubmit} className="header-search">
          <input
            type="text"
            placeholder="⌕ Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="header-search-input"
          />
          <button type="submit" className="header-search-btn">Search</button>
        </form>
        <Link to="/contact" className="header-link">Contact Us</Link>
        <Link to="/saved" className="header-link">Saved</Link>
        {user ? (
          <div className="header-account">
            <span className="header-account-toggle" onClick={()=>setShowAccount(v=>!v)}>
              Account ▼
            </span>
            {showAccount && (
              <div className="header-account-dropdown">
              }}>
                <div><b>User:</b> {user.email}</div>
                <button onClick={onLogout} style={{marginTop:'10px',background:'#1976d2',color:'#fff',border:'none',borderRadius:'5px',padding:'5px 10px',cursor:'pointer'}}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{color:'#fff',textDecoration:'none',marginLeft:'10px'}}>Login</Link>
        )}
      </nav>
    </header>
  );
}
export default Header;