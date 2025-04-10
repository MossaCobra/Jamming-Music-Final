import React from 'react';

const clientId = import.meta.env.VITE_CLIENT_ID;
const secretClientId = import.meta.env.VITE_SECRET_CLIENT_ID;

const getToken = async () => {
  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secretClientId}`
    }
  );

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
};

const searchTracks = async (searchTerm) => {
  try {
    const accessToken = await getToken();  // Fetch the token
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
    console.log(trackData)
    return trackData.tracks.items;
  } catch (error) {
    throw new Error('Error fetching tracks: ' + error.message);
  }
};


export default searchTracks;
