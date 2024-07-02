import db from "@/db/db";
import { PageHeader } from "../../_components/PageHeader"
import { DigitalProductForm, PhysicalProductForm } from "../_components/ProductForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ProductPage = async ({
  params
}: {
  params: { productId: string, }
}) => {

  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    }
  });

  const categories = await db.category.findMany({
    select: {
      id: true,
      billboardId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  const sizes = await db.size.findMany({
    select: {
      id: true,
      name: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  const colors = await db.color.findMany({
    select: {
      id: true,
      name: true,
      value: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  return (
    <Tabs
      defaultValue="view"
      className="w-full"
    >
      <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PageHeader>Products</PageHeader>
        <div>
          <TabsTrigger value="view">Physical Products</TabsTrigger>
          <TabsTrigger value="settings">Digital Products</TabsTrigger>
        </div>
      </TabsList>
      <TabsContent value="view">
        <PhysicalProductForm 
          categories={categories} 
          colors={colors}
          sizes={sizes}
          initialData={product} />
      </TabsContent>
      <TabsContent value="settings">
        <>
          <PageHeader>Digital Product</PageHeader>
          <DigitalProductForm />
        </>
      </TabsContent>
    </Tabs>
  )
}

export default ProductPage;