import React from 'react';

function SearchBar({ search }) {
  return (
    <>
      <input
        type="text"
        placeholder="Search for a track"
        onChange={(e) => search(e.target.value)} // Update searchTerm in App.js as the user types
      />
    </>
  );
}

export default SearchBar;
