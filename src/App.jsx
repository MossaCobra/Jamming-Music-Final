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
  const [userPlaylist, setUserPlaylist] = useState([]);


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


    // Add a track to the user's playlist
    const addToPlaylist = (track) => {
      setUserPlaylist((prevPlaylist) => [...prevPlaylist, track]);
    };

    // Remove a track from the user's playlist
    const removeFromPlaylist = (trackToRemove) => {
      setUserPlaylist(prev => prev.filter(track => track.id !== trackToRemove.id));
    };
    


  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar search={setSearchTerm} setIsSearching={setIsSearching} />
      <div className="main-content">
        <Tracklist tracks={tracks} addToPlaylist={addToPlaylist} />
        <Playlist tracks={userPlaylist} removeFromPlaylist={removeFromPlaylist}/>
      </div>
    </>
  );
}

export default App;
