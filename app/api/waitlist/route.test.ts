import { beforeEach, describe, expect, it, vi } from "vitest";

const appendWaitlistRow = vi.fn();

vi.mock("@/lib/googleSheets", () => ({
  appendWaitlistRow
}));

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    appendWaitlistRow.mockReset();
  });

  it("appends vendor submissions with business in the shared details column", async () => {
    appendWaitlistRow.mockResolvedValue(undefined);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Okafor",
          business: "Bakery",
          phone: "08012345678",
          type: "vendor",
          timestamp: "2026-06-24T08:00:00.000Z"
        })
      })
    );

    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.status).toBe(200);
    expect(appendWaitlistRow).toHaveBeenCalledWith({
      timestamp: "2026-06-24T08:00:00.000Z",
      name: "Ada Okafor",
      detail: "Bakery",
      phone: "08012345678",
      type: "Vendor"
    });
  });

  it("appends buyer submissions with location in the shared details column", async () => {
    appendWaitlistRow.mockResolvedValue(undefined);
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        body: JSON.stringify({
          name: "Tunde",
          location: "Yaba, Lagos",
          phone: "08087654321",
          type: "buyer",
          timestamp: "2026-06-24T08:00:00.000Z"
        })
      })
    );

    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.status).toBe(200);
    expect(appendWaitlistRow).toHaveBeenCalledWith({
      timestamp: "2026-06-24T08:00:00.000Z",
      name: "Tunde",
      detail: "Yaba, Lagos",
      phone: "08087654321",
      type: "Buyer"
    });
  });

  it("returns a 500 payload without clearing frontend data when Sheets append fails", async () => {
    appendWaitlistRow.mockRejectedValue(new Error("Sheets unavailable"));
    const { POST } = await import("./route");

    const response = await POST(
      new Request("http://localhost/api/waitlist", {
        method: "POST",
        body: JSON.stringify({
          name: "Ada Okafor",
          business: "Bakery",
          phone: "08012345678",
          type: "vendor",
          timestamp: "2026-06-24T08:00:00.000Z"
        })
      })
    );

    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Sheets unavailable"
    });
    expect(response.status).toBe(500);
  });
});
