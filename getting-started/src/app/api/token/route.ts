import { NextRequest, NextResponse } from "next/server";

import jose from "node-jose";
import fs from "fs";
import ms from "ms";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  try {
    if (!userId) throw new Error("no userId found");

    const ks = fs.readFileSync("jwks.json");
    const keyStore = await jose.JWK.asKeyStore(ks.toString());
    const [key1, key2] = keyStore.all({ use: "sig" });

    const opt = {
      compact: true,
      jwk: key1,
      fields: { typ: "jwt" },
    };
    const payload = JSON.stringify({
      sub: userId,
      exp: Math.floor((Date.now() + ms("1w")) / 1000),
      iat: Math.floor(Date.now() / 1000),
    });
    const token = await jose.JWS.createSign(opt, key1).update(payload).final();

    return NextResponse.json(token);
  } catch (error) {
    return new NextResponse(JSON.stringify("error"), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
