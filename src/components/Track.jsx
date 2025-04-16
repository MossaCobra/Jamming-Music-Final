import React from 'react';
import '../styles/Music.css';  

function Track({ name, artist, album, onAdd }) {
  return (
    <div className="track">
      <div className="track-details">
        <img src={album.images[0].url} alt={`${name} album cover`} />
        <div className='track-info'>
          <h3>{name}</h3>
          <p>Artist: {artist}</p>
          <p>Album: {album.name}</p>
          <button className='button' onClick={onAdd}>Add to Playlist</button>
        </div>
      </div>
    </div>
  );
}

export default Track;
