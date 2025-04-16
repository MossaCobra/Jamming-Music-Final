import React, { useState } from 'react';

function SearchBar({ search, setIsSearching }) {
  const [inputValue, setInputValue] = useState('');

  const handleSearchClick = (e) => {
    e.preventDefault();
    search(inputValue);
    setIsSearching(true);
  };


  return (
    <div className="search-bar">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)} 
        placeholder="Search for a track"
      />
      <button onClick={handleSearchClick}>Search</button>
    </div>
  );
}

export default SearchBar;
