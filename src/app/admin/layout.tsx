import { MainNav } from "@/components/Admin-Nav"
import { Nav, NavLink } from "@/components/Nav"
import { Separator } from "@/components/ui/separator"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <MainNav className="mx-6 p-4"/>
      <div className="container my-6 mt-24">{children}</div>
    </>
  )
}
