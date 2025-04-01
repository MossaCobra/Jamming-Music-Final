import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SearchBar from './components/Playlist'
import Tracklist from './components/Playlist'
import Playlist from './components/Playlist'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SearchBar />
      <Tracklist />
      <Playlist />
    </>
  )
}

export default App
