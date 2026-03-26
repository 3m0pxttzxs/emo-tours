import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import type { Tour } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

async function getTours(): Promise<Tour[]> {
  const { data, error } = await supabaseAdmin
    .from("tours")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
  return data as Tour[];
}

export default async function AdminToursPage() {
  const tours = await getTours();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Tours
        </h1>
        <Button href="/admin/tours/new" size="sm">
          + New Tour
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ebe7e7]">
              <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Title
              </th>
              <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Type
              </th>
              <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Price
              </th>
              <th className="text-center px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Status
              </th>
              <th className="text-center px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Featured
              </th>
              <th className="text-right px-6 py-4 font-bold text-xs uppercase tracking-wider text-[#78716c]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className="border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#f5f0ee]/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-[#1c1b1b]">
                  {tour.title}
                </td>
                <td className="px-6 py-4">
                  <Badge
                    text={tour.type}
                    variant={
                      tour.type === "shared"
                        ? "info"
                        : tour.type === "private"
                        ? "warning"
                        : "default"
                    }
                  />
                </td>
                <td className="px-6 py-4 text-[#1c1b1b]">
                  ${tour.base_price}
                </td>
                <td className="px-6 py-4 text-center">
                  {(() => {
                    const status = !tour.active
                      ? { label: "Inactive", style: "bg-gray-100 text-gray-600 border-gray-300" }
                      : !tour.published
                      ? { label: "Coming Soon", style: "bg-yellow-100 text-yellow-800 border-yellow-300" }
                      : { label: "Live", style: "bg-green-100 text-green-800 border-green-300" };
                    return (
                      <span className={`inline-block rounded-full text-xs font-bold px-3 py-1 border ${status.style}`}>
                        {status.label}
                      </span>
                    );
                  })()}
                </td>
                <td className="px-6 py-4 text-center">
                  {tour.featured && (
                    <span className="inline-block h-3 w-3 rounded-full bg-[#4cbb17]" title="Featured" />
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/tours/${tour.id}`}
                    className="text-[#4CBB17] hover:underline font-medium text-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {tours.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[#78716c]"
                >
                  No tours yet. Create your first tour!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
