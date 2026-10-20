import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "APParchar API",
    timestamp: new Date().toISOString(),
  });
}
