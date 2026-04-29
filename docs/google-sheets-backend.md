# Google Sheets Backend

This project uses a Cloudflare Worker endpoint to save website application form submissions into Google Sheets.

## Live Resources

- Website: https://shadcn.locust-crm08.workers.dev/
- Form endpoint: https://shadcn.locust-crm08.workers.dev/api/apply
- Google Sheet: https://docs.google.com/spreadsheets/d/11cTtjkNy5cXBxityjR6w5jTqZa7Kgx3EdJN-hu-DJMc

## Data Flow

```txt
Application form
-> POST /api/apply
-> Cloudflare Worker
-> Google Sheets API
-> Ruang Bestari Website Applications sheet
```

The frontend form lives in:

```txt
src/components/blocks/application-form-section/application-form-section.tsx
```

The active Cloudflare Worker handler lives in:

```txt
worker/index.js
```

The Worker deployment config lives in:

```txt
wrangler.jsonc
```

## Google Sheet Columns

The backend appends rows using this column order:

```txt
Timestamp
Full Name
Phone
Email
Company
Loan Amount
Business Type
Financing Purpose
Source URL
Status
Document Links
Document Upload Status
Notes
```

`Financing Purpose` is the message typed by the website visitor.

`Notes` is for internal team follow-up notes. It has a dropdown in Google Sheets, but it also allows custom typed notes.

## Document Uploads

The form uploads supporting documents to a private Google Drive folder and saves the file links in Google Sheets.

```txt
Visitor selects documents
-> POST multipart form data to /api/apply
-> Cloudflare Worker uploads files to a private Google Drive folder
-> Worker appends Google Drive file links to the Google Sheet
-> only approved team members with Drive access can open the files
```

Do not make uploaded document links public. IC, SSM, EPF, bank statements, and utility bills should remain private to the business team.

When document upload support is implemented, add one or more sheet columns such as:

```txt
Document Links
Document Upload Status
```

The Google Drive folder must be shared with the service account as `Editor`, and shared only with approved internal users who need to review applications.

## Required Cloudflare Secrets

The Worker needs these secrets configured in Cloudflare:

```txt
GOOGLE_SHEET_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_DRIVE_FOLDER_ID
```

Do not commit the service account JSON file or private key to GitHub.

Current sheet ID:

```txt
11cTtjkNy5cXBxityjR6w5jTqZa7Kgx3EdJN-hu-DJMc
```

Current service account email:

```txt
website-sheet-writer@ruang-bestari-website-backend.iam.gserviceaccount.com
```

The Google Sheet must be shared with the service account email as `Editor`.

The private document upload folder must also be shared with the service account email as `Editor`.

## Deploy

GitHub contains the source code, but the active Cloudflare Worker is deployed with Wrangler.

From the project root:

```powershell
$env:CLOUDFLARE_API_TOKEN="paste_cloudflare_token_here"
pnpm run build
pnpm dlx wrangler deploy
```

The Cloudflare API token must have permission to edit Workers scripts for the account.

## Test

Opening the endpoint in a browser sends a `GET` request:

```txt
https://shadcn.locust-crm08.workers.dev/api/apply
```

Expected result:

```json
{"ok":false,"error":"Method not allowed."}
```

That response is good. It means the route exists and is waiting for a form `POST`.

To test a full submission, submit the live application form and confirm a new row appears in the Google Sheet.

## Troubleshooting

If `/api/apply` shows the website 404 page, the Worker route is not deployed.

If form submission fails, check:

- Cloudflare secrets are present on the `shadcn` Worker.
- `GOOGLE_PRIVATE_KEY` includes the full private key.
- The Google Sheet is shared with the service account as `Editor`.
- The Google Drive upload folder is shared with the service account as `Editor`.
- Google Sheets API is enabled in the Google Cloud project.
- Google Drive API is enabled in the Google Cloud project.

If Wrangler says a secret binding is already in use, the secret already exists on the Worker.
