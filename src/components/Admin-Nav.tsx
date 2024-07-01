"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();


  const routes = [
    {
      href: `/admin`,
      label: 'Overview',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}`,
    },
    {
      href: `/subaccount/${params.subaccountId}/setup/${params.storeId}/billboards`,
      label: 'Billboards',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/billboards`,
    },
    {
      href: `/subaccount/${params.subaccountId}/setup/${params.storeId}/categories`,
      label: 'Categories',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/categories`,
    },
    {
      href: `/subaccount/${params.subaccountId}/setup/${params.storeId}/sizes`,
      label: 'Sizes',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/sizes`,
    },
    {
      href: `/subaccount/${params.subaccountId}/setup/${params.storeId}/colors`,
      label: 'Colors',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/colors`,
    },
    {
      href: `/admin/products`,
      label: 'Products',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/products`,
    },
    {
      href: `/admin/orders`,
      label: 'Orders',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/orders`,
    },
    {
      href: `/subaccount/${params.subaccountId}/setup/${params.storeId}/settings`,
      label: 'Settings',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
};