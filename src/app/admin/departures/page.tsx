import { supabaseAdmin } from "@/lib/supabase/server";
import DepartureCalendar from "@/components/admin/DepartureCalendar";

async function getTours() {
  const { data, error } = await supabaseAdmin
    .from("tours")
    .select("id, title")
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
  return data;
}

export default async function AdminDeparturesPage() {
  const tours = await getTours();

  return <DepartureCalendar tours={tours} />;
}
