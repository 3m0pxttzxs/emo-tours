"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Tours", href: "/admin/tours", icon: "tour" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Departures", href: "/admin/departures", icon: "calendar_month" },
      { label: "Private Requests", href: "/admin/custom-requests", icon: "contact_mail" },
      { label: "Bookings", href: "/admin/bookings", icon: "confirmation_number" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Reviews", href: "/admin/reviews", icon: "rate_review" },
      { label: "Generate Review Link", href: "/admin/reviews/generate", icon: "add_link" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Don't render sidebar for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#1c1b1b] text-white flex flex-col z-50">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="EMO Tours" width={32} height={32} className="h-8 w-auto" />
            <span className="text-[10px] font-medium bg-[#4CBB17] text-white px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {navGroups.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && (
                <div className="mx-3 my-2 border-t border-white/[0.06]" />
              )}
              <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive(item.href)
                        ? "border-l-2 border-[#4CBB17] bg-white/[0.04] text-[#4CBB17] ml-0 pl-[10px]"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white/90"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/70 transition-colors w-full disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>
            {loggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 bg-[#fafaf9] min-h-screen p-8">
        {children}
      </main>
    </div>
  );
}
