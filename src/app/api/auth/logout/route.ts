import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE, ADMIN_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });

  response.cookies.set({
    name: CUSTOMER_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: ADMIN_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "avantika_session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  response.cookies.set({
    name: "avantika_admin_session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}

