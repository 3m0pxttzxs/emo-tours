"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/ui/FormField";
import Button from "@/components/ui/Button";
import type { Tour, FaqItem, TourType } from "@/types";

interface TourFormProps {
  tour?: Tour;
  mode: "create" | "edit";
}

interface FormData {
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  area: string;
  duration: string;
  meeting_point: string;
  language: string;
  type: TourType;
  base_price: number;
  price_label: string;
  capacity_default: number;
  active: boolean;
  published: boolean;
  featured: boolean;
  highlights: string[];
  included_items: string[];
  faq_items: FaqItem[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function TourForm({ tour, mode }: TourFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    title: tour?.title ?? "",
    slug: tour?.slug ?? "",
    short_description: tour?.short_description ?? "",
    full_description: tour?.full_description ?? "",
    cover_image: tour?.cover_image ?? "",
    area: tour?.area ?? "",
    duration: tour?.duration ?? "",
    meeting_point: tour?.meeting_point ?? "",
    language: tour?.language ?? "Español",
    type: tour?.type ?? "shared",
    base_price: tour?.base_price ?? 0,
    price_label: tour?.price_label ?? "por persona",
    capacity_default: tour?.capacity_default ?? 12,
    active: tour?.active ?? true,
    published: tour?.published ?? false,
    featured: tour?.featured ?? false,
    highlights: tour?.highlights ?? [],
    included_items: tour?.included_items ?? [],
    faq_items: tour?.faq_items ?? [],
  });

  const [highlightsText, setHighlightsText] = useState(
    form.highlights.join("\n")
  );
  const [includedText, setIncludedText] = useState(
    form.included_items.join("\n")
  );

  const updateField = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const title = e.target.value;
    updateField("title", title);
    if (mode === "create") {
      updateField("slug", generateSlug(title));
    }
  };

  const addFaqItem = () => {
    setForm((prev) => ({
      ...prev,
      faq_items: [...prev.faq_items, { question: "", answer: "" }],
    }));
  };

  const removeFaqItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      faq_items: prev.faq_items.filter((_, i) => i !== index),
    }));
  };

  const updateFaqItem = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      faq_items: prev.faq_items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const highlights = highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const included_items = includedText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = { ...form, highlights, included_items };

    try {
      const url =
        mode === "create" ? "/api/tours" : `/api/tours/${tour?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar el tour");
      }

      router.push("/admin/tours");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!tour) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tours/${tour.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
      if (!res.ok) throw new Error("Error al desactivar");
      router.push("/admin/tours");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-heading font-bold text-[#1c1b1b] mb-4">
          Basic Info
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Title"
            name="title"
            required
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Tour name"
          />
          <FormField
            label="Slug"
            name="slug"
            required
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
            placeholder="tour-slug"
          />
          <div className="md:col-span-2">
            <FormField
              label="Short Description"
              name="short_description"
              type="textarea"
              required
              rows={2}
              value={form.short_description}
              onChange={(e) => updateField("short_description", e.target.value)}
              placeholder="Brief description for cards"
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              label="Full Description"
              name="full_description"
              type="textarea"
              rows={5}
              value={form.full_description}
              onChange={(e) => updateField("full_description", e.target.value)}
              placeholder="Detailed tour description"
            />
          </div>
          <FormField
            label="Cover Image URL"
            name="cover_image"
            value={form.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
            placeholder="https://..."
          />
          <FormField
            label="Type"
            name="type"
            type="select"
            value={form.type}
            onChange={(e) => updateField("type", e.target.value)}
            options={[
              { value: "shared", label: "Shared" },
              { value: "private", label: "Private" },
              { value: "custom", label: "Custom" },
            ]}
          />
        </div>
      </section>

      {/* Details */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-heading font-bold text-[#1c1b1b] mb-4">
          Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Area"
            name="area"
            value={form.area}
            onChange={(e) => updateField("area", e.target.value)}
            placeholder="e.g. Centro Histórico"
          />
          <FormField
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={(e) => updateField("duration", e.target.value)}
            placeholder="e.g. 3 hours"
          />
          <FormField
            label="Meeting Point"
            name="meeting_point"
            value={form.meeting_point}
            onChange={(e) => updateField("meeting_point", e.target.value)}
            placeholder="e.g. Zócalo, CDMX"
          />
          <FormField
            label="Language"
            name="language"
            value={form.language}
            onChange={(e) => updateField("language", e.target.value)}
            placeholder="e.g. Español"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-heading font-bold text-[#1c1b1b] mb-4">
          Pricing & Capacity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Base Price"
            name="base_price"
            type="number"
            required
            value={form.base_price}
            onChange={(e) => updateField("base_price", Number(e.target.value))}
            placeholder="0"
          />
          <FormField
            label="Price Label"
            name="price_label"
            value={form.price_label}
            onChange={(e) => updateField("price_label", e.target.value)}
            placeholder="por persona"
          />
          <FormField
            label="Default Capacity"
            name="capacity_default"
            type="number"
            value={form.capacity_default}
            onChange={(e) =>
              updateField("capacity_default", Number(e.target.value))
            }
            placeholder="12"
          />
        </div>
      </section>

      {/* Toggles */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-heading font-bold text-[#1c1b1b] mb-4">
          Visibility
        </h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#4CBB17] focus:ring-[#4CBB17]"
            />
            <span className="text-sm font-medium text-[#1c1b1b]">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => updateField("published", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#4CBB17] focus:ring-[#4CBB17]"
            />
            <span className="text-sm font-medium text-[#1c1b1b]">
              Published
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#4CBB17] focus:ring-[#4CBB17]"
            />
            <span className="text-sm font-medium text-[#1c1b1b]">
              Featured
            </span>
          </label>
        </div>
      </section>

      {/* Highlights & Included Items */}
      <section className="bg-white rounded-xl p-6">
        <h2 className="text-lg font-heading font-bold text-[#1c1b1b] mb-4">
          Highlights & Included Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2">
              Highlights (one per line)
            </label>
            <textarea
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              rows={5}
              className="w-full bg-white border border-[#ebe7e7]/20 rounded-xl py-4 px-5 text-sm focus:border-[#4cbb17] focus:ring-0 outline-none transition-colors resize-none"
              placeholder={"Visit the Zócalo\nExplore Templo Mayor\nTaste local food"}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2">
              Included Items (one per line)
            </label>
            <textarea
              value={includedText}
              onChange={(e) => setIncludedText(e.target.value)}
              rows={5}
              className="w-full bg-white border border-[#ebe7e7]/20 rounded-xl py-4 px-5 text-sm focus:border-[#4cbb17] focus:ring-0 outline-none transition-colors resize-none"
              placeholder={"Professional guide\nBottled water\nSnacks"}
            />
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="bg-white rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-[#1c1b1b]">
            FAQ Items
          </h2>
          <button
            type="button"
            onClick={addFaqItem}
            className="text-sm font-medium text-[#4CBB17] hover:underline"
          >
            + Add FAQ
          </button>
        </div>
        {form.faq_items.length === 0 && (
          <p className="text-sm text-[#78716c]">No FAQ items yet.</p>
        )}
        <div className="space-y-4">
          {form.faq_items.map((faq, index) => (
            <div
              key={index}
              className="border border-[#ebe7e7] rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-[#78716c] uppercase">
                  FAQ #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFaqItem(index)}
                  className="text-red-500 hover:text-red-700 text-xs font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <FormField
                  label="Question"
                  name={`faq_question_${index}`}
                  value={faq.question}
                  onChange={(e) =>
                    updateFaqItem(index, "question", e.target.value)
                  }
                  placeholder="What is the question?"
                />
                <FormField
                  label="Answer"
                  name={`faq_answer_${index}`}
                  type="textarea"
                  rows={2}
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaqItem(index, "answer", e.target.value)
                  }
                  placeholder="The answer..."
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create Tour" : "Save Changes"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/tours")}
        >
          Cancel
        </Button>
        {mode === "edit" && tour?.active && (
          <Button
            variant="ghost"
            onClick={handleDeactivate}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            Deactivate Tour
          </Button>
        )}
      </div>
    </form>
  );
}
