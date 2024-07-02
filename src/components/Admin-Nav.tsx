"use client";

import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

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
      active: pathname === `/admin`,
    },
    {
      href: `/admin/billboards`,
      label: 'Billboards',
      active: pathname === `/admin/billboards`,
    },
    {
      href: `/admin/categories`,
      label: 'Categories',
      active: pathname === `/admin/categories`,
    },
    {
      href: `/admin/sizes`,
      label: 'Sizes',
      active: pathname === `/admin/sizes`,
    },
    {
      href: `/admin/colors`,
      label: 'Colors',
      active: pathname === `/admin/colors`,
    },
    {
      href: `/admin/products`,
      label: 'Products',
      active: pathname === `/admin/products`,
    },
    {
      href: `/admin/orders`,
      label: 'Orders',
      active: pathname === `/subaccount/${params.subaccountId}/setup/${params.storeId}/orders`,
    },
    {
      href: `/admin/users`,
      label: 'Customers',
      active: pathname === `/admin/users`,
    },
  ]

  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
        <aside className="flex items-center gap-2">
            <span className="text-xl font-bold"> Inspire.</span>
        </aside>
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
        <aside className="flex gap-2 items-center">
            <ModeToggle />
      </aside>
    </div>
    
)};