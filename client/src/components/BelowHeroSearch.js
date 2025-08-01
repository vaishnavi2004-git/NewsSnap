import React from 'react';
import './Header.css';

function BelowHeroSearch({ search, setSearch, setCategory }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    setCategory(''); // Search is prioritized if filled
  };
  return (
    <form onSubmit={handleSubmit} className="header-search" style={{ justifyContent: 'left', marginLeft: '10px'}}>
      <input
        type="text"
        border="rgb(0, 35, 140) 10px"
        placeholder="⌕ Search news with keywords.."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="header-search-input"
        style={{ minWidth: '1350px' }}
      />
      <button type="submit" className="header-search-btn" style={{ background:'rgb(0, 35, 140)',color:'#fff',border:'none',borderRadius:'5px',padding:'5px 10px',cursor:'pointer',height:'35px',marginLeft:'15px',width:'120px'}}>Search</button>
    </form>
  );
}

export default BelowHeroSearch;
