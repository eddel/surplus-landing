import { NextResponse } from "next/server";
import { appendWaitlistRow } from "@/lib/googleSheets";

type WaitlistPayload = {
  name?: string;
  business?: string;
  location?: string;
  phone?: string;
  type?: "vendor" | "buyer";
  timestamp?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as WaitlistPayload;
    const normalizedType = payload.type === "vendor" ? "Vendor" : "Buyer";
    const detail =
      normalizedType === "Vendor" ? payload.business ?? "" : payload.location ?? "";

    await appendWaitlistRow({
      timestamp: payload.timestamp ?? new Date().toISOString(),
      name: payload.name ?? "",
      detail,
      phone: payload.phone ?? "",
      type: normalizedType
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
