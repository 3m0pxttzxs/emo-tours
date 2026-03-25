import { supabaseAdmin } from "@/lib/supabase/server";

interface StatCard {
  label: string;
  value: number;
  icon: string;
}

async function getStats(): Promise<StatCard[]> {
  const [toursRes, departuresRes, bookingsRes, customRequestsRes] =
    await Promise.all([
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
    ]);

  return [
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
      label: "Pending Custom Requests",
      value: customRequestsRes.count ?? 0,
      icon: "pending_actions",
    },
  ];
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-[#1c1b1b] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#4CBB17] text-[28px]">
                {stat.icon}
              </span>
              <span className="text-sm font-medium text-[#1c1b1b]/60">
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
