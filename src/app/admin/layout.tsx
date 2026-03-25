"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Tours", href: "/admin/tours", icon: "tour" },
  { label: "Departures", href: "/admin/departures", icon: "event" },
  { label: "Bookings", href: "/admin/bookings", icon: "confirmation_number" },
  {
    label: "Custom Requests",
    href: "/admin/custom-requests",
    icon: "contact_mail",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1c1b1b] text-white flex flex-col z-50">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="text-xl font-heading font-bold tracking-tight">
              EMO TOURS
            </span>
            <span className="text-xs font-medium bg-[#4CBB17] text-white px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-white/10 text-[#4CBB17]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 bg-[#f5f0ee] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
