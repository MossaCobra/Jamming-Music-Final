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

  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      if (isSearching && searchTerm) {
        const track = await searchTracks(searchTerm);
        setTracks(track);
      }
    };
    fetchTracks();
  }, [isSearching, searchTerm]);

  const addToPlaylist = (track) => {
    const isTrackInPlaylist = userPlaylist.some(existingTrack => existingTrack.id === track.id);
    
    if (!isTrackInPlaylist) {
      setUserPlaylist((prevPlaylist) => [...prevPlaylist, track]);
    } else {
      alert("This track is already in your playlist!");
    }
  };
  

  const removeFromPlaylist = (trackToRemove) => {
    setUserPlaylist(prev => prev.filter(track => track.id !== trackToRemove.id));
  };

  const handleInputChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSavePlaylist = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    console.log('Saving playlist:', playlistName, userPlaylist);
    setShowModal(false);
    setPlaylistName('');
  };

  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar search={setSearchTerm} setIsSearching={setIsSearching} />
      <div className="main-content">
        <div className="search-results">
          <h2>Search Results:</h2>
          <Tracklist tracks={tracks} addToPlaylist={addToPlaylist} />
        </div>
        <div className="playlist">
          <h2>Your Playlist:</h2>
          <Playlist tracks={userPlaylist} removeFromPlaylist={removeFromPlaylist} />
          {userPlaylist.length > 0 && (
            <button className="button" onClick={handleSavePlaylist}>Save Playlist</button>
          )}
        </div>
      </div>
      

      {/*Modal for saving playlist*/}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Enter Playlist Name</h3>
            <input
              type="text"
              value={playlistName}
              onChange={handleInputChange}
              placeholder="Playlist name"
            />
            <div className="modal-buttons">
              <button className="button" onClick={handleSubmit}>Save</button>
              <button className="button button-remove" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
