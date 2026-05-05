import { NextResponse } from "next/server";
import { requireAuth } from "../middleware/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// GET - Retrieve all users or single user by ID (PROTECTED - admin only)
// Query params: id (optional) - Can pass ?id=1 to get specific user
export async function GET(request: Request) {
  try {
    // Require authentication with admin role
    const auth = await requireAuth("admin");
    if (!("id" in auth)) return auth; // auth returned a NextResponse error

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Get user by ID if provided
    if (id) {
      const parsedId = parseInt(id, 10);
      if (isNaN(parsedId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({
        where: { id: parsedId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          gender: true,
          birthDate: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          // IMPORTANT: Password NOT included
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ data: user, message: "User found" }, { status: 200 });
    }

    // Return all users (without passwords)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // IMPORTANT: Password NOT included
      },
    });
    return NextResponse.json({ data: users, message: "All users retrieved" }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/users] Erreur:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new user (PROTECTED - admin only)
// Body: { firstName: string, lastName: string, email: string, password: string, role?: string }
export async function POST(request: Request) {
  try {
    const auth = await requireAuth("admin");
    if (!("id" in auth)) return auth;

    const body = await request.json();
    const { firstName, lastName, email, password, role } = body;

    // Validate required fields
    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "firstName, email and password are required" }, { status: 400 });
    }

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    // Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object via prisma
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || "",
        email,
        password: hashedPassword, // NOW HASHED!
        role: role || "user",
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        // Password NOT returned
      },
    });

    return NextResponse.json({ data: newUser, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/users] Erreur:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
