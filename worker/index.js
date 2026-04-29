const SHEET_RANGE = 'Ruang Bestari Website Applications!A:K'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

const requiredFields = ['fullName', 'phone', 'email']

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  })

const base64UrlEncode = value =>
  btoa(value)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const arrayBufferToBase64Url = buffer => {
  let binary = ''
  const bytes = new Uint8Array(buffer)

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return base64UrlEncode(binary)
}

const createJwt = async env => {
  const now = Math.floor(Date.now() / 1000)
  const privateKey = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')

  const pemBody = privateKey
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')

  const keyBuffer = Uint8Array.from(atob(pemBody), character => character.charCodeAt(0))

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256'
    },
    false,
    ['sign']
  )

  const header = base64UrlEncode(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))

  const payload = base64UrlEncode(
    JSON.stringify({
      iss: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      scope: SHEETS_SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now
    })
  )

  const unsignedToken = `${header}.${payload}`

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  )

  return `${unsignedToken}.${arrayBufferToBase64Url(signature)}`
}

const getAccessToken = async env => {
  const assertion = await createJwt(env)

  const tokenResponse = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion
    })
  })

  if (!tokenResponse.ok) {
    throw new Error('Unable to authenticate with Google.')
  }

  const tokenData = await tokenResponse.json()

  return tokenData.access_token
}

const handleApply = async (request, env) => {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405)
  }

  try {
    const payload = await request.json()
    const missingField = requiredFields.find(field => !payload[field])

    if (missingField) {
      return jsonResponse({ ok: false, error: `Missing ${missingField}.` }, 400)
    }

    const accessToken = await getAccessToken(env)
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(SHEET_RANGE)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`

    const sheetResponse = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [
          [
            new Date().toISOString(),
            payload.fullName ?? '',
            payload.phone ?? '',
            payload.email ?? '',
            payload.company ?? '',
            payload.loanAmount ?? '',
            payload.businessType ?? '',
            payload.message ?? '',
            payload.sourceUrl ?? '',
            'New',
            ''
          ]
        ]
      })
    })

    if (!sheetResponse.ok) {
      throw new Error('Unable to write to Google Sheet.')
    }

    return jsonResponse({ ok: true })
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Submission failed.'
      },
      500
    )
  }
}

export default {
  fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/apply') {
      return handleApply(request, env)
    }

    return env.ASSETS.fetch(request)
  }
}
