import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import Tracklist from './components/Tracklist';
import Playlist from './components/Playlist';
import { searchTracks } from './components/Spotify';

function App() {
  const [track, setTrack] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 

  // Trigger the API call whenever the searchTerm changes
  useEffect(() => {
    const fetchTracks = async () => {
      if (searchTerm) { 
        const tracks = await searchTracks(searchTerm); 
        setTrack(tracks); 
      }
    };
    fetchTracks(); 
  }, [searchTerm]);

  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar search={setSearchTerm} />
      <Tracklist tracks={track} />
      <Playlist />
    </>
  );
}

export default App;
