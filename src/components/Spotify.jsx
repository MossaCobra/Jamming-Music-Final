const clientId = import.meta.env.VITE_CLIENT_ID;
const secretClientId = import.meta.env.VITE_SECRET_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI;
const scopes = 'playlist-modify-private playlist-modify-public';

// Fetch the token from Spotify API
const getToken = async () => {
  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secretClientId}`,
    }
  );

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

// Fetch tracks from Spotify API after fetching the token
const searchTracks = async (searchTerm) => {
  try {
    const accessToken = await getToken();
    const trackResponse = await fetch(
      `https://api.spotify.com/v1/search?q=track%3A${encodeURIComponent(searchTerm)}&type=track`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const trackData = await trackResponse.json();
    
     // Show each title in the main content
    const titles = document.querySelectorAll('.main-content h2');
    titles.forEach(title => {
      title.style.display = 'block';
    });

    console.log(trackData)
    return trackData.tracks.items;
  } catch (error) {
    throw new Error('Error fetching tracks: ' + error.message);
  }
};

// Get user ID from Spotify API
const getUserId = async (accessToken) => {
  try {
    const userResponse = await fetch(
      'https://api.spotify.com/v1/me',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const userData = await userResponse.json();
    return userData.id;
  } catch (error) {
    throw new Error('Error fetching user ID: ' + error.message);
  }
};

// Create a playlist and add tracks
const createPlaylistAndAddTracks = async (userId, playlistName, trackUris, accessToken) => {
  try {
    // Step 1: Create a new playlist
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: playlistName,
          public: false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      throw new Error('Failed to create playlist');
    }

    const playlistData = await createPlaylistResponse.json();
    const playlistId = playlistData.id;

    // Step 2: Add tracks to the new playlist
    const addTrackResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: trackUris,
        }),
      }
    );

    return addTrackResponse.ok;
  } catch (error) {
    throw new Error('Error creating playlist or adding tracks: ' + error.message);
  }
};

// Open login popup and handle authentication
const openLoginPopup = () => {
  return new Promise((resolve, reject) => {
    const popup = window.open(
      `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`,
      'Spotify Login',
      'width=500,height=600'
    );

    const interval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(interval);
          reject(new Error('Popup closed by user'));
        }

        // Check if the popup URL contains the access token
        const popupUrl = popup.location.href;
        if (popupUrl.includes('access_token')) {
          const accessToken = new URLSearchParams(popupUrl.split('#')[1]).get('access_token');
          popup.close();
          clearInterval(interval);
          resolve(accessToken);
        }
      } catch (error) {
        // Ignore cross-origin errors until the popup redirects to the same origin
      }
    }, 1000);
  });
};

// Save playlist
const savePlaylist = async (playlistName, tracks) => {
  try {
    const accessToken = await openLoginPopup();
    const userId = await getUserId(accessToken);
    const trackUris = tracks.map((track) => track.uri); 
    const success = await createPlaylistAndAddTracks(userId, playlistName, trackUris, accessToken);
    if (success) {
      console.log('Playlist saved successfully!');
    } else {
      throw new Error('Failed to save playlist');
    }
  } catch (error) {
    console.error('Error saving playlist:', error.message);
    throw error;
  }
};

const Spotify = {
  searchTracks,
  getUserId,
  createPlaylistAndAddTracks,
  openLoginPopup,
  savePlaylist,
};

export default Spotify;