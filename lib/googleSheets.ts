import { google } from "googleapis";

export type WaitlistRow = {
  timestamp: string;
  name: string;
  detail: string;
  phone: string;
  type: "Vendor" | "Buyer";
};

export async function appendWaitlistRow(row: WaitlistRow) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = process.env.GOOGLE_SHEET_RANGE ?? "'Surplus Waitlist'!A:E";

  if (!spreadsheetId) {
    throw new Error("Google Sheets environment variables are not configured");
  }

  const credentials = getGoogleCredentials();

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[row.timestamp, row.name, row.detail, row.phone, row.type]]
    }
  });
}

function getGoogleCredentials() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (key) {
    return normalizeCredentials(parseServiceAccountKey(key));
  }

  if (clientEmail && privateKey) {
    return normalizeCredentials({
      client_email: clientEmail,
      private_key: privateKey
    });
  }

  throw new Error("Google Sheets environment variables are not configured");
}

function parseServiceAccountKey(key: string) {
  try {
    return JSON.parse(key);
  } catch {
    try {
      return JSON.parse(Buffer.from(key, "base64").toString("utf8"));
    } catch {
      throw new Error("Google service account key is not valid JSON or base64 JSON");
    }
  }
}

function normalizeCredentials(credentials: Record<string, unknown>) {
  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  return credentials;
}
