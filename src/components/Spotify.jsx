import React, { useState } from 'react'

const clientId = 'your-client-id'
const secretClientId = 'your-client-secret'


const getToken = async () => {
  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token', 
    {
      method: 'POST',
      headers: "Content-Type: application/x-www-form-urlencoded",
      body: "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
    }
  );

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

const searchTracks = async (searchTerm) => {
  const accessToken = await getToken();

  const trackResponse = await fetch(
    `https://api.spotify.com/v1/search?q=track%3A${encodeURIComponent(searchTerm)}&type=track`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const trackData = await trackResponse.json();
  return trackData;
}

export default searchTracks;
