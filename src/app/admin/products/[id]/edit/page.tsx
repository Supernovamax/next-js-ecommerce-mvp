import db from "@/db/db"
import { PageHeader } from "../../../_components/PageHeader"
import { DigitalProductForm } from "../../_components/ProductForm"

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const product = await db.digitalProduct.findUnique({ where: { id } })

  return (
    <>
      <PageHeader>Edit Product</PageHeader>
      <DigitalProductForm digitalproduct={product} />
    </>
  )
}
