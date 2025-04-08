import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import searchTracks from './components/Spotify';

function App() {
  const [tracks, setTracks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false); 

  // Trigger the API call when the user presses the button
  useEffect(() => {
    const fetchTracks = async () => {
      if (isSearching && searchTerm) {
        const track = await searchTracks(searchTerm);
        setTracks(track);
      }
    };
    fetchTracks();
  }, [isSearching, searchTerm]); // listen for button click and searchTerm change


  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar search={setSearchTerm} setIsSearching={setIsSearching} />
      <Tracklist tracks={tracks} />
      <Playlist />
    </>
  );
}

export default App;
