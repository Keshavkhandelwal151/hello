import { auth } from "@/lib/auth";
import prisma from "@/lib/db"; // Pointing to your singleton instance
import HomeClient from "./HomeClient";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // 1. Get the session using the new Auth.js v5 'auth()' function
  const session = await auth();

  // 2. If no session, redirect to login or show a message
  if (!session || !session.user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p>Please log in to continue with your test practice.</p>
      </div>
    );
  }

  // 3. Fetch Preset Question Papers
  const presetQPs = await prisma.questionPaper.findMany({
    where: { is_preset: true },
    include: {
      tagQps: { 
        include: { 
          tag: true 
        } 
      },
      _count: { 
        select: { 
          testSessions: true, 
          questions: true 
        } 
      },
    },
    orderBy: { created_at: "desc" },
  });

  // 4. Fetch Question Papers the current user has already attempted
  const attempted = await prisma.testSession.findMany({
    where: { user_id: session.user.id }, // NextAuth v5 uses session.user.id
    select: { qp_id: true },
  });

  const attemptedIds = new Set(attempted.map((a) => a.qp_id));

  // 5. Filter for recommendations (Papers not yet attempted)
  const recommended = presetQPs
    .filter((qp) => !attemptedIds.has(qp.id))
    .slice(0, 3);

  return (
    <HomeClient
      userName={session.user.name ?? "User"}
      // We use JSON.parse/stringify to ensure Date objects are serialized correctly for the Client Component
      presetQPs={JSON.parse(JSON.stringify(presetQPs))}
      recommended={JSON.parse(JSON.stringify(recommended))}
    />
  );
}