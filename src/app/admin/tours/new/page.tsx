import TourForm from "@/components/admin/TourForm";

export default function NewTourPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-[#1c1b1b] mb-8">
        Create New Tour
      </h1>
      <TourForm mode="create" />
    </div>
  );
}
