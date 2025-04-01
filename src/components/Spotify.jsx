import React, { useState } from 'react'

const clientId = 'your-client-id'
const secretClientId = 'your-client-secret'


export const searchTracks = async (searchTerm) => {
  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token', 
    {
      method: 'POST',
      headers: "Content-Type: application/x-www-form-urlencoded",
      body: "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
    }
  );
}

export default searchTracks
