"use server"

import db from "@/db/db"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const fileSchema = z.instanceof(File, { message: "Required" })
const imageSchema = fileSchema.refine(
  file => file.size === 0 || file.type.startsWith("image/")
)

const addSchema = z.object({
  label: z.string().min(1),
  imageUrl: imageSchema.refine(file => file.size > 0, "Required"),
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data


  await fs.mkdir("public/products", { recursive: true })
  const imagePath = `/products/${crypto.randomUUID()}-${data.imageUrl.name}`
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.imageUrl.arrayBuffer())
  )

  await db.billboard.create({
    data: {
      label: data.label,
      imageUrl: imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
})

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data
  const billboard = await db.billboard.findUnique({ where: { id } })

  if (billboard == null) return notFound()

  let imagePath = billboard.imageUrl
  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${billboard.imageUrl}`)
    imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    )
  }

  await db.billboard.update({
    where: { id },
    data: {
      label: data.label,
      imageUrl:  imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")

  redirect("/admin/products")
}



export async function deleteProduct(id: string) {
  const billboard = await db.billboard.delete({ where: { id } })

  if (billboard == null) return notFound()

  await fs.unlink(`public${billboard.imageUrl}`)

  revalidatePath("/")
  revalidatePath("/billboards")
}
