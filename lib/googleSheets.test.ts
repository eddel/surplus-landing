import { beforeEach, describe, expect, it, vi } from "vitest";

const append = vi.fn();
const GoogleAuth = vi.fn();

vi.mock("googleapis", () => ({
  google: {
    auth: {
      GoogleAuth
    },
    sheets: vi.fn(() => ({
      spreadsheets: {
        values: {
          append
        }
      }
    }))
  }
}));

describe("appendWaitlistRow", () => {
  beforeEach(() => {
    append.mockReset();
    GoogleAuth.mockReset();
    vi.unstubAllEnvs();
  });

  it("normalizes escaped service account private key newlines from environment variables", async () => {
    vi.stubEnv(
      "GOOGLE_SERVICE_ACCOUNT_KEY",
      JSON.stringify({
        client_email: "surplus@example.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\\nabc123\\n-----END PRIVATE KEY-----\\n"
      })
    );
    vi.stubEnv("GOOGLE_SHEET_ID", "sheet-id");
    append.mockResolvedValue(undefined);

    const { appendWaitlistRow } = await import("./googleSheets");

    await appendWaitlistRow({
      timestamp: "2026-06-24T08:00:00.000Z",
      name: "Ada Okafor",
      detail: "Bakery - Yaba, Lagos",
      phone: "08012345678",
      type: "Vendor"
    });

    expect(GoogleAuth).toHaveBeenCalledWith({
      credentials: {
        client_email: "surplus@example.iam.gserviceaccount.com",
        private_key: "-----BEGIN PRIVATE KEY-----\nabc123\n-----END PRIVATE KEY-----\n"
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
  });
});
