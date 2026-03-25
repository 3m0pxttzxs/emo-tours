import { supabaseAdmin } from "@/lib/supabase/server";
import DeparturesManager from "@/components/admin/DeparturesManager";

async function getDepartures() {
  const { data, error } = await supabaseAdmin
    .from("departures")
    .select("*, tours(title)")
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) {
    console.error("Error fetching departures:", error);
    return [];
  }
  return data;
}

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
  const [departures, tours] = await Promise.all([getDepartures(), getTours()]);

  return <DeparturesManager initialDepartures={departures} tours={tours} />;
}
