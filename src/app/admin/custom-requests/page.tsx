import { supabaseAdmin } from "@/lib/supabase/server";
import CustomRequestsManager from "@/components/admin/CustomRequestsManager";

async function getCustomRequests() {
  const { data, error } = await supabaseAdmin
    .from("custom_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching custom requests:", error);
    return [];
  }
  return data;
}

export default async function AdminCustomRequestsPage() {
  const requests = await getCustomRequests();

  return <CustomRequestsManager initialRequests={requests} />;
}
