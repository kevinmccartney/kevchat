"use server";

import { NextResponse } from "next/server";
import { CONFIG } from "../config";

export async function GET() {
  const response = NextResponse.redirect(CONFIG.logoutUrl as string);
  const epoch = new Date("Thu, 01 Jan 1970 00:00:00");
  // TODO: I'm pretty sure I need to set the nonce to expired, but not 100% sure
  response.cookies
    .set("AWSELBAuthSessionCookie-0", "", {
      maxAge: -1,
      expires: epoch,
      path: "/",
    })
    .set("AWSELBAuthSessionCookie-1", "", {
      maxAge: -1,
      expires: epoch,
      path: "/",
    })
    .set("AWSALBAuthNonce", "", {
      maxAge: -1,
      expires: epoch,
      path: "/",
    });

  return response;
}
