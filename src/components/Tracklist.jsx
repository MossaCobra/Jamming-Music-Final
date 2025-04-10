import React from 'react'
import Track from './Track'

function Tracklist({ tracks }) {
  return (
    <div className="tracklist">
      {tracks.map((track, index) => (
        <Track
          key={index}
          name={track.name}
          artist={track.artists[0].name}
          album={track.album}
          image={track.album.images}
        />
      ))}
    </div>
  );
}

export default Tracklist;
