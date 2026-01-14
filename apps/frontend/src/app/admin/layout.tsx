
import Link from "next/link";
import { Users, Shield, LayoutDashboard } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard /> },
    { name: "Users", href: "/admin/users", icon: <Users /> },
    { name: "Disputes", href: "/admin/disputes", icon: <Shield /> },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link href={item.href} className="flex items-center p-2 rounded hover:bg-gray-700">
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
