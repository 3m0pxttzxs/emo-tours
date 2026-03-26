import { supabaseAdmin } from "@/lib/supabase/server";
import Link from "next/link";

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    toursRes,
    departuresRes,
    bookingsRes,
    customRequestsRes,
    revenueRes,
    monthlyRevenueRes,
    totalReviewsRes,
    pendingReviewsRes,
  ] = await Promise.all([
    supabaseAdmin
      .from("tours")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("departures")
      .select("*", { count: "exact", head: true })
      .eq("active", true)
      .eq("sold_out", false),
    supabaseAdmin
      .from("bookings")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("custom_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabaseAdmin
      .from("bookings")
      .select("total")
      .eq("status", "confirmed"),
    supabaseAdmin
      .from("bookings")
      .select("total")
      .eq("status", "confirmed")
      .gte("created_at", startOfMonth),
    supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  const totalRevenue = (revenueRes.data ?? []).reduce(
    (sum: number, b: { total: number }) => sum + (b.total || 0),
    0
  );
  const monthlyRevenue = (monthlyRevenueRes.data ?? []).reduce(
    (sum: number, b: { total: number }) => sum + (b.total || 0),
    0
  );

  const revenueCards: StatCard[] = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: "payments",
      color: "text-emerald-600",
    },
    {
      label: "Revenue This Month",
      value: formatCurrency(monthlyRevenue),
      icon: "trending_up",
      color: "text-emerald-600",
    },
  ];

  const operationCards: StatCard[] = [
    {
      label: "Total Tours",
      value: toursRes.count ?? 0,
      icon: "tour",
    },
    {
      label: "Active Departures",
      value: departuresRes.count ?? 0,
      icon: "event_available",
    },
    {
      label: "Total Bookings",
      value: bookingsRes.count ?? 0,
      icon: "confirmation_number",
    },
    {
      label: "Pending Private Requests",
      value: customRequestsRes.count ?? 0,
      icon: "pending_actions",
    },
  ];

  const engagementCards: StatCard[] = [
    {
      label: "Total Reviews",
      value: totalReviewsRes.count ?? 0,
      icon: "rate_review",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsRes.count ?? 0,
      icon: "hourglass_top",
    },
  ];

  return { revenueCards, operationCards, engagementCards };
}

const quickActions = [
  { label: "Generate Review Link", href: "/admin/reviews/generate", icon: "add_link" },
  { label: "View Bookings", href: "/admin/bookings", icon: "confirmation_number" },
  { label: "Manage Tours", href: "/admin/tours", icon: "tour" },
];

export default async function AdminDashboard() {
  const { revenueCards, operationCards, engagementCards } = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-[#1c1b1b] mb-6">
        Dashboard
      </h1>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="inline-flex items-center gap-2 bg-white border border-[#ebe7e7] rounded-lg px-4 py-2 text-xs font-medium text-[#1c1b1b] hover:border-[#4CBB17] hover:text-[#4CBB17] transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">{action.icon}</span>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Revenue Section */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#78716c] mb-3">Revenue</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {revenueCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-emerald-400"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`material-symbols-outlined text-[24px] ${stat.color || "text-[#4CBB17]"}`}
              >
                {stat.icon}
              </span>
              <span className="text-xs font-body font-medium text-[#78716c]">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-heading font-bold text-[#1c1b1b]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Operations Section */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#78716c] mb-3">Operations</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {operationCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#4CBB17] text-[24px]">
                {stat.icon}
              </span>
              <span className="text-xs font-body font-medium text-[#78716c]">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-heading font-bold text-[#1c1b1b]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Engagement Section */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#78716c] mb-3">Engagement</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {engagementCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#4CBB17] text-[24px]">
                {stat.icon}
              </span>
              <span className="text-xs font-body font-medium text-[#78716c]">
                {stat.label}
              </span>
            </div>
            <p className="text-3xl font-heading font-bold text-[#1c1b1b]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
