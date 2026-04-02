"use server"

import prisma from "@/lib/db";

export async function createUserAction(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password, // Note: In a real app, hash this first!
      },
    });
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: "Email already exists or database error" };
  }
}