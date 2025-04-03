import React from 'react'

function SearchBar({ search }) {
  
  function handleSearch(event) {
    event.preventDefault();
    search();
  }

  return (
    <>
      <input
        type="text"
        placeholder="Search for a track"
        onChange={(e) => search(e.target.value)} 
      />
      <button onClick={handleSearch}>Search</button>
    </>
  )
}

export default SearchBar;
