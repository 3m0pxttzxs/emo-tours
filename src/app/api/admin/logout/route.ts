import { NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/admin-session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;

  if (token) {
    destroySession(token);
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
