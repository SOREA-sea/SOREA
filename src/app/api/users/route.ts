import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Retrieve all users or single user by ID
// Query params: id (optional) - Can pass ?id=1 to get specific user
export async function GET(request: Request) {
  try {
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
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ data: user, message: "User found" }, { status: 200 });
    }

    // Return all users
    const users = await prisma.user.findMany();
    return NextResponse.json({ data: users, message: "All users retrieved" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Create new user
// Body: { firstName: string, lastName: string, email: string, role?: string, password?: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, role, password } = body;

    // Validate required fields
    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "firstName, email and password are required" }, { status: 400 });
    }

    // Create new user object via prisma
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || "",
        email,
        password, // Warning: In production, password should be hashed!
        role: role || "user",
        isActive: true,
      }
    });

    return NextResponse.json({ data: newUser, message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
