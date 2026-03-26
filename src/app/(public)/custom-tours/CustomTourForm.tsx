"use client";

import { useState } from "react";

const TOUR_OPTIONS = [
  { value: "", label: "Select a tour" },
  { value: "Historic Center Tour", label: "Historic Center Tour — $200 group rate" },
  { value: "Roma + Condesa Tour", label: "Roma + Condesa Tour — $200 group rate" },
  { value: "Reforma + Juarez Tour", label: "Reforma + Juarez Tour — $200 group rate" },
  { value: "Coyoacan Tour", label: "Coyoacan Tour — $200 group rate" },
  { value: "Chapultepec Day", label: "Chapultepec Day — $500 group rate" },
  { value: "Teotihuacan Tour", label: "Teotihuacan Tour — $1000 group rate" },
  { value: "Polanco Tour", label: "Polanco Tour — $200 group rate" },
  { value: "Custom Experience", label: "Custom Experience — tell us what you want" },
];

const GROUP_OPTIONS = [
  { value: "", label: "Select group size" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5", label: "5 people" },
  { value: "6", label: "6 people" },
  { value: "7", label: "7 people" },
  { value: "8", label: "8 people" },
  { value: "9", label: "9 people" },
  { value: "10", label: "10 people" },
];

export default function CustomTourForm() {
  const [form, setForm] = useState({ name: "", email: "", tour: "", groupSize: "", date: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const next = { ...errors };
      delete next[e.target.name];
      setErrors(next);
    }
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email is required";
    if (!form.tour) errs.tour = "Select a tour";
    if (!form.groupSize) errs.groupSize = "Select group size";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) { setErrors(v); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          phone: "N/A",
          preferred_date: form.date || null,
          group_size: Number(form.groupSize),
          interests: form.tour,
          notes: form.notes,
        }),
      });
      if (res.ok) setSubmitted(true);
      else setErrors({ _form: "Something went wrong. Please try again." });
    } catch {
      setErrors({ _form: "Network error." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-8">
        <span className="material-symbols-outlined text-[#4cbb17] text-5xl mb-3">check_circle</span>
        <h3 className="font-heading font-bold text-xl text-[#1c1b1b] mb-2">Request Sent</h3>
        <p className="text-[#78716c] text-sm max-w-sm">We&apos;ll confirm availability and get back to you within 24 hours.</p>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm text-[#1c1b1b] placeholder:text-gray-400 focus:border-[#4cbb17] focus:outline-none";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors._form && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">{errors._form}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className={inputClass} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={inputClass} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Tour *</label>
        <select name="tour" value={form.tour} onChange={handleChange} className={inputClass}>
          {TOUR_OPTIONS.map((o) => <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>)}
        </select>
        {errors.tour && <p className="text-red-500 text-xs mt-1">{errors.tour}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Group Size *</label>
          <select name="groupSize" value={form.groupSize} onChange={handleChange} className={inputClass}>
            {GROUP_OPTIONS.map((o) => <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>)}
          </select>
          {errors.groupSize && <p className="text-red-500 text-xs mt-1">{errors.groupSize}</p>}
        </div>
        <div>
          <label className={labelClass}>Preferred Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Anything we should know..." className={`${inputClass} resize-none`} />
      </div>

      <button type="submit" disabled={submitting} className="w-full bg-[#4cbb17] text-[#1c1b1b] rounded-full py-3 font-heading font-bold text-sm hover:bg-[#3a960e] transition-colors disabled:opacity-50">
        {submitting ? "Sending..." : "Request Private Tour"}
      </button>
    </form>
  );
}
