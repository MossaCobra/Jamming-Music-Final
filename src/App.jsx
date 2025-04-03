import React, { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import Tracklist from './components/Tracklist'
import Playlist from './components/Playlist'
import { searchTracks } from './components/Spotify'


function App() {
  const [track, setTrack] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState('');

  const handleSearch = async () => {
    if (searchTerm) {
      const tracks = await searchTracks(searchTerm);
      setTrack(tracks);
    }
  }

  function addTrack(track) {
    setTrack(prevTracks => [...prevTracks, track]);
  }

  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar search={setSearchTerm} />
      <Tracklist />
      <Playlist />
    </>
  )
}

export default App
