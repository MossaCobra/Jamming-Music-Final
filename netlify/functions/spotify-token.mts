import type { Config } from '@netlify/functions'

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

export default async (req: Request) => {
  const clientId = Netlify.env.get('VITE_CLIENT_ID')
  if (!clientId) {
    return Response.json({ error: 'Spotify client ID is not configured' }, { status: 500 })
  }

  const { code, codeVerifier, redirectUri } = await req.json()
  if (!code || !codeVerifier || !redirectUri) {
    return Response.json({ error: 'Missing code, codeVerifier, or redirectUri' }, { status: 400 })
  }

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  })

  const data = await tokenResponse.json()

  if (!tokenResponse.ok) {
    return Response.json(
      { error: data.error_description || 'Failed to exchange authorization code' },
      { status: tokenResponse.status },
    )
  }

  return Response.json({
    access_token: data.access_token,
    expires_in: data.expires_in,
  })
}

export const config: Config = {
  method: 'POST',
}
