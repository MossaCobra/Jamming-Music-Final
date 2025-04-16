import React from 'react';
import PlaylistTrack from './PlaylistTrack';

function Playlist({ tracks, removeFromPlaylist }) {
  return (
    <div className="tracklist">
      {tracks.map((track, index) => (
        <PlaylistTrack
          key={index}
          name={track.name}
          artist={track.artists[0].name}
          album={track.album}
          onRemove={() => removeFromPlaylist(track)}
        />
      ))}
    </div>
  );
}

export default Playlist;
