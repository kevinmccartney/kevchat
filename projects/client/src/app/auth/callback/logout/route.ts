import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // clear the access token cookie
    (await cookies()).set({
      name: "kevchat_access_token",
      value: "",
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      domain: ".kev.chat",
      secure: true,
      sameSite: "none",
    });

    return NextResponse.redirect(process.env.KEVCHAT_FRONT_DOOR_URL as string);
  } catch (error) {
    console.error("Error in logout callback:", error);

    // TODO: create error page for user w instructions
    return NextResponse.json(
      { message: "Failed to exchange authorization code" },
      { status: 500 }
    );
  }
}
