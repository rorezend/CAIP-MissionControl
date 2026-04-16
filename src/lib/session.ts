import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Get the authenticated Prisma user from the current session.
 * Returns null if not authenticated or user not found in DB.
 */
export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
  });
}
