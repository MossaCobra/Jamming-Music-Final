import React from 'react';
import '../styles/Music.css';

function PlaylistTrack({ name, artist, album, onRemove }) {
  return (
    <div className="track">
      <div className="track-details">
        <img src={album.images[0].url} alt={`${name} album cover`} />
        <div>
          <h3>{name}</h3>
          <p>Artist: {artist}</p>
          <p>Album: {album.name}</p>
          <button onClick={onRemove}>Remove</button>
        </div>
      </div>
    </div>
  );
}

export default PlaylistTrack;
