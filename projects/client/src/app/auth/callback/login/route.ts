import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  debugger;
  const code = req.nextUrl.searchParams.get("code"); // The token received from OIDC

  // if we're coming from a cancel on the consent interaction, just redirect to the home page
  if (!code) {
    return NextResponse.redirect(process.env.KEVCHAT_FRONT_DOOR_URL as string);
  }

  try {
    const response = await fetch(process.env.KEVCHAT_IDP_OIDC_TOKEN_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        client_id: 'kevchat-app',
        redirect_uri: process.env
          .KEVCHAT_CLIENT_AUTH_LOGIN_CALLBACK_URL as string,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(
        `Error from token endpoint: ${data.error} - ${data.error_description || 'No description provided'}`,
      );
    }

    (await cookies()).set({
      name: 'kevchat_access_token',
      value: data.access_token,
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'none',
      maxAge: 3600,
      domain: '.kev.chat',
    });

    // Redirect to the app after successful login
    return NextResponse.redirect(process.env.KEVCHAT_CLIENT_URL as string);
  } catch (error) {
    // TODO: create error page for user w instructions
    console.error("Error in login callback:", error);

    return NextResponse.json(
      { message: "Failed to exchange authorization code" },
      { status: 500 }
    );
  }
}
