import { NextRequest, NextResponse } from "next/server";

import jwks from "../../../../jwks.json";

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(jwks);
  } catch (error) {
    return new NextResponse(JSON.stringify("error"), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
