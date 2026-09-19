const clientId = import.meta.env.VITE_CLIENT_ID;
// Use the current origin rather than a fixed env var, so the OAuth popup
// always redirects back to whichever deploy (production, preview, local)
// the app is actually running on. That origin must be registered as an
// allowed redirect URI in the Spotify app dashboard.
const redirectUri = window.location.origin;
const scopes = 'playlist-modify-private playlist-modify-public';
const CODE_VERIFIER_STORAGE_KEY = 'spotify_code_verifier';

// Token caching to avoid multiple popups
let cachedAccessToken = null;
let tokenExpiryTime = null;

// PKCE helpers (Spotify requires the Authorization Code with PKCE flow;
// the implicit grant flow it used before now redirects back with
// "response_type must be code" instead of a token).
const generateCodeVerifier = (length = 128) => {
  const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(randomValues, (value) => possibleChars[value % possibleChars.length]).join('');
};

const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Exchange an authorization code for an access token via the Netlify
// function, which talks to Spotify's token endpoint.
const exchangeCodeForToken = async (code, codeVerifier) => {
  const response = await fetch('/.netlify/functions/spotify-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, codeVerifier, redirectUri }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to exchange authorization code');
  }

  return data;
};

// Get access token using the Authorization Code with PKCE flow, with caching
const getAccessToken = async () => {
  // Check if we have a valid cached token
  if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return cachedAccessToken;
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier);

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  return new Promise((resolve, reject) => {
    const popup = window.open(authUrl, 'Spotify Login', 'width=500,height=600');

    const interval = setInterval(() => {
      (async () => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            reject(new Error('Popup closed by user'));
            return;
          }

          // Check if the popup has redirected back with the authorization code
          const popupUrl = new URL(popup.location.href);
          const error = popupUrl.searchParams.get('error');
          const code = popupUrl.searchParams.get('code');

          if (error) {
            clearInterval(interval);
            popup.close();
            reject(new Error(`Spotify authorization failed: ${error}`));
            return;
          }

          if (code) {
            clearInterval(interval);
            popup.close();

            const storedVerifier = sessionStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
            sessionStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);

            const { access_token, expires_in } = await exchangeCodeForToken(code, storedVerifier);

            // Cache the token and set expiry time
            cachedAccessToken = access_token;
            tokenExpiryTime = Date.now() + (parseInt(expires_in) * 1000) - 60000; // 1 minute buffer

            resolve(access_token);
          }
        } catch {
          // Ignore cross-origin errors until the popup redirects to the same origin
        }
      })();
    }, 1000);
  });
};

// Search tracks using cached token or prompt for authentication
const searchTracks = async (searchTerm) => {
  try {
    let accessToken;
    
    // Check if we have a cached token
    if (cachedAccessToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
      accessToken = cachedAccessToken;
    } else {
      // No cached token, get one through authentication
      accessToken = await getAccessToken();
    }
    
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

// Open login popup and handle authentication (reuse the getAccessToken function)
const openLoginPopup = () => {
  return getAccessToken();
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