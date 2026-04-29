const SHEET_RANGE = 'Ruang Bestari Website Applications!A:M'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive'

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
      scope: `${SHEETS_SCOPE} ${DRIVE_SCOPE}`,
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

const getFormValue = (formData, field) => {
  const value = formData.get(field)

  return typeof value === 'string' ? value : ''
}

const uploadDocument = async (file, accessToken, env) => {
  if (!env.GOOGLE_DRIVE_FOLDER_ID) {
    throw new Error('Missing Google Drive folder configuration.')
  }

  const metadata = {
    name: `${Date.now()}-${file.name}`,
    parents: [env.GOOGLE_DRIVE_FOLDER_ID]
  }

  const delimiter = 'ruang-bestari-upload-boundary'
  const metadataPart = JSON.stringify(metadata)
  const fileBuffer = await file.arrayBuffer()

  const bodyParts = [
    new TextEncoder().encode(`--${delimiter}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadataPart}\r\n`),
    new TextEncoder().encode(`--${delimiter}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`),
    fileBuffer,
    new TextEncoder().encode(`\r\n--${delimiter}--`)
  ]

  const uploadResponse = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${delimiter}`
      },
      body: new Blob(bodyParts)
    }
  )

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()

    throw new Error(`Unable to upload ${file.name}: ${errorText}`)
  }

  return uploadResponse.json()
}

const handleApply = async (request, env) => {
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405)
  }

  try {
    const contentType = request.headers.get('Content-Type') ?? ''
    const formData = contentType.includes('multipart/form-data') ? await request.formData() : null

    const payload = formData
      ? {
          fullName: getFormValue(formData, 'fullName'),
          phone: getFormValue(formData, 'phone'),
          email: getFormValue(formData, 'email'),
          company: getFormValue(formData, 'company'),
          loanAmount: getFormValue(formData, 'loanAmount'),
          businessType: getFormValue(formData, 'businessType'),
          message: getFormValue(formData, 'message'),
          sourceUrl: getFormValue(formData, 'sourceUrl')
        }
      : await request.json()

    const missingField = requiredFields.find(field => !payload[field])

    if (missingField) {
      return jsonResponse({ ok: false, error: `Missing ${missingField}.` }, 400)
    }

    const accessToken = await getAccessToken(env)

    const documents = formData
      ? formData.getAll('documents').filter(document => document instanceof File && document.size > 0)
      : []

    const uploadedDocuments = []

    for (const document of documents) {
      uploadedDocuments.push(await uploadDocument(document, accessToken, env))
    }

    const documentLinks = uploadedDocuments.map(document => document.webViewLink).join('\n')

    const uploadStatus =
      documents.length > 0
        ? `Uploaded ${uploadedDocuments.length} document${uploadedDocuments.length === 1 ? '' : 's'}`
        : 'No documents'

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
            documentLinks,
            uploadStatus,
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
