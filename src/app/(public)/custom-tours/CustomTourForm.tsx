"use client";

import { useState } from "react";

const INTEREST_OPTIONS = [
  "Architecture",
  "Gastronomy",
  "Contemporary Art",
  "Local Markets",
  "History",
];

const GROUP_SIZE_OPTIONS = [
  { value: "", label: "Select group size" },
  { value: "1-2", label: "1-2" },
  { value: "3-5", label: "3-5" },
  { value: "6+", label: "6+" },
];

interface FormData {
  name: string;
  email: string;
  interests: string[];
  dateRange: string;
  groupSize: string;
  notes: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  interests: [],
  dateRange: "",
  groupSize: "",
  notes: "",
};

export default function CustomTourForm() {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
    // Clear interest error on change
    if (errors.interests) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.interests;
        return next;
      });
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email";
    }
    if (form.interests.length === 0)
      errs.interests = "Select at least one interest";
    if (!form.groupSize) errs.groupSize = "Group size is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      // Map groupSize to a numeric value for the API
      const groupSizeMap: Record<string, number> = {
        "1-2": 2,
        "3-5": 5,
        "6+": 6,
      };

      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.name,
          email: form.email,
          phone: "N/A", // Phone not in this form design
          preferred_date: form.dateRange || null,
          group_size: groupSizeMap[form.groupSize] ?? 1,
          interests: form.interests.join(", "),
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ _form: "Something went wrong. Please try again." });
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setErrors({ _form: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <span className="material-symbols-outlined text-[#4CBB17] text-6xl mb-4">
          check_circle
        </span>
        <h3 className="font-heading font-bold text-2xl text-[#1c1b1b] mb-2">
          Inquiry Sent!
        </h3>
        <p className="text-[#78716c] max-w-sm">
          Thank you for your interest. Our team will review your request and get
          back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors._form && (
        <p className="text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3">
          {errors._form}
        </p>
      )}

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Name"
          name="name"
          type="text"
          placeholder="Your full name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          required
        />
      </div>

      {/* Interests — chip selector */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2">
          Interests <span className="text-red-500 ml-1">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const selected = form.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm font-heading font-bold transition-colors ${
                  selected
                    ? "bg-[#4CBB17] text-white"
                    : "bg-white border border-[#ebe7e7] text-[#78716c] hover:border-[#4CBB17] hover:text-[#4CBB17]"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
        {errors.interests && (
          <p className="mt-1 text-red-500 text-xs">{errors.interests}</p>
        )}
      </div>

      {/* Date Range + Group Size row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Date Range"
          name="dateRange"
          type="text"
          placeholder="e.g. Dec 15-20, 2025"
          value={form.dateRange}
          onChange={handleChange}
          error={errors.dateRange}
        />
        <div>
          <label
            htmlFor="groupSize"
            className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2"
          >
            Group Size <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="groupSize"
            name="groupSize"
            value={form.groupSize}
            onChange={handleChange}
            className={`w-full bg-white border rounded-xl py-4 px-5 text-sm focus:border-[#4cbb17] focus:ring-0 outline-none transition-colors appearance-none ${
              errors.groupSize ? "border-red-500" : "border-[#ebe7e7]/20"
            }`}
          >
            {GROUP_SIZE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={!opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.groupSize && (
            <p className="mt-1 text-red-500 text-xs">{errors.groupSize}</p>
          )}
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label
          htmlFor="notes"
          className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2"
        >
          Additional Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          placeholder="Anything else you'd like us to know..."
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="w-full bg-white border border-[#ebe7e7]/20 rounded-xl py-4 px-5 text-sm focus:border-[#4cbb17] focus:ring-0 outline-none transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#4CBB17] text-[#1c1b1b] rounded-full py-4 font-heading font-bold text-base hover:bg-[#3a960e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}

/* ── Inline Field component ── */
function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-white border rounded-xl py-4 px-5 text-sm focus:border-[#4cbb17] focus:ring-0 outline-none transition-colors ${
          error ? "border-red-500" : "border-[#ebe7e7]/20"
        }`}
      />
      {error && <p className="mt-1 text-red-500 text-xs">{error}</p>}
    </div>
  );
}
