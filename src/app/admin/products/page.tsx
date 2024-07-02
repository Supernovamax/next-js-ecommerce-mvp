import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from "@/components/ui/button"
import { PageHeader } from "../_components/PageHeader"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { CheckCircle2, MoreVertical, Plus, XCircle } from "lucide-react"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/ProductActions"
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./_components/client";
import { ProductColumn } from "./_components/columns";
import { format } from 'util'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    // select:{
    //   id: true
    // },
    include: {
      category: true,
      size: true,
      color: true,
    },
    
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item: { id: any; name: any; isFeatured: any; isArchived: any; price: { toNumber: () => number | bigint; }; category: { name: any; }; size: { name: any; }; color: { value: any; }; createdAt: number | Date; }) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

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
        <>
          <ProductsClient data={formattedProducts} />
        </>
      </TabsContent>
      <TabsContent value="settings">
        <>
          <div className="flex justify-between items-center gap-4 mb-6">
            <Heading title={`Digital Products (${products.length})`} description="Manage digital products for your store" />
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />Add New
              </Link>
            </Button>
            
          </div>
          <Separator />
          <DigitalProductsTable />
        </>
      </TabsContent>
    </Tabs>
    
  )
}

async function DigitalProductsTable() {
  const products = await db.digitalProduct.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  })

  if (products.length === 0) return <p>No products found</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map(product => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailableForPurchase ? (
                <>
                  <span className="sr-only">Available</span>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <span className="sr-only">Unavailable</span>
                  <XCircle className="stroke-destructive" />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.priceInCents / 100)}</TableCell>
            <TableCell>{formatNumber(product._count.orders)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <a download href={`/admin/products/${product.id}/download`}>
                      Download
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <ActiveToggleDropdownItem
                    id={product.id}
                    isAvailableForPurchase={product.isAvailableForPurchase}
                  />
                  <DropdownMenuSeparator />
                  <DeleteDropdownItem
                    id={product.id}
                    disabled={product._count.orders > 0}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
