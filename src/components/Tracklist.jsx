import React from 'react'
import Track from './Track'

function Tracklist( {tracks} ) {
  return (
    <>
      <div className="tracklist">
        {tracks.map((track, index) => (
          <Track
            key={index}
            name={track.name}
            artist={track.artists}
            album={track.album}
            preview_url={track.preview_url}
          />
        ))}
      </div>
    </>
  )
}

export default Tracklist
