import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { signToken, CUSTOMER_COOKIE, ADMIN_COOKIE } from "@/lib/auth/session";

/**
 * Handles Google OAuth / One-Tap / Button authentication
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, avatar, isAdminLogin } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Google account profile (email and name) is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists or create
    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Create new customer account via Google
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name.trim(),
          avatar: avatar || null,
          role: isAdminLogin ? "ADMIN" : "CUSTOMER",
          emailVerified: new Date(),
        },
      });
    }

    // Check if admin login was requested but user is not admin
    if (isAdminLogin && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Access Denied: This Google account does not possess administrator privileges." },
        { status: 403 }
      );
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    // Set customer cookie
    response.cookies.set({
      name: CUSTOMER_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // If admin, set admin cookie
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      response.cookies.set({
        name: ADMIN_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error: any) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate with Google. Please try again." },
      { status: 500 }
    );
  }
}

