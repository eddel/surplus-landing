import { google } from "googleapis";

export type WaitlistRow = {
  timestamp: string;
  name: string;
  detail: string;
  phone: string;
  type: "Vendor" | "Buyer";
};

export async function appendWaitlistRow(row: WaitlistRow) {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!key || !spreadsheetId) {
    throw new Error("Google Sheets environment variables are not configured");
  }

  const credentials = JSON.parse(key);
  if (typeof credentials.private_key === "string") {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Surplus Waitlist!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[row.timestamp, row.name, row.detail, row.phone, row.type]]
    }
  });
}
