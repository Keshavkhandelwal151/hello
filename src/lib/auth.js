import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github" // or your chosen provider
export function createSession(userId) {
  const token = "keshu" // or JWT or uuid

  return token   // ✅ VERY IMPORTANT
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  

})