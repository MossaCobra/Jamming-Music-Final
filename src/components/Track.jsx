import React from 'react';

function Track({ name, artist, album, preview_url }) {
  return (
    <div className="track">
      <h3>{name}</h3>
      <p>Artist: {artist}</p>
      <p>Album: {album}</p>
      {preview_url && <audio controls><source src={preview_url} type="audio/mpeg" /></audio>}
    </div>
  );
}

export default Track;
