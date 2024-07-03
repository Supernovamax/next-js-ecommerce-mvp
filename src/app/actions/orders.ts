"use server"

import db from "@/db/db"

export async function userOrderExists(email: string, productId: string) {
  return (
    (await db.digitalOrder.findFirst({
      where: { user: { email }, productId },
      select: { id: true },
    })) != null
  )
}
