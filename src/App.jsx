import React, { useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import Tracklist from './components/Tracklist'
import Playlist from './components/Playlist'


function App() {
  const [track, setTrack] = useState([]);

  function addTrack(track) {
    setTrack(prevTracks => [...prevTracks, track]);
  }

  return (
    <>
      <h1>Jamming Music</h1>
      <SearchBar />
      <Tracklist />
      <Playlist />
    </>
  )
}

export default App
