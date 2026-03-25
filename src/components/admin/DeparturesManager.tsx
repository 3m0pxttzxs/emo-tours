"use client";

import { useState } from "react";
import type { Tour, Departure } from "@/types";
import Badge from "@/components/ui/Badge";

interface DepartureWithTour extends Departure {
  tours: { title: string } | null;
}

interface Props {
  initialDepartures: DepartureWithTour[];
  tours: Pick<Tour, "id" | "title">[];
}

export default function DeparturesManager({ initialDepartures, tours }: Props) {
  const [departures, setDepartures] = useState<DepartureWithTour[]>(initialDepartures);
  const [filterTourId, setFilterTourId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New departure form state
  const [form, setForm] = useState({
    tour_id: "",
    date: "",
    time: "",
    capacity: 12,
  });

  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Departure>>({});

  const filtered = filterTourId
    ? departures.filter((d) => d.tour_id === filterTourId)
    : departures;

  async function fetchDepartures() {
    const res = await fetch("/api/departures");
    if (res.ok) {
      const data = await res.json();
      setDepartures(data);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/departures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ tour_id: "", date: "", time: "", capacity: 12 });
        setShowForm(false);
        await fetchDepartures();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/departures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setEditingId(null);
        setEditForm({});
        await fetchDepartures();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDuplicate(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/departures/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate" }),
      });
      if (res.ok) {
        await fetchDepartures();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: string, field: "hidden" | "sold_out", current: boolean) {
    setLoading(true);
    try {
      const res = await fetch(`/api/departures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (res.ok) {
        await fetchDepartures();
      }
    } finally {
      setLoading(false);
    }
  }

  function startEdit(dep: DepartureWithTour) {
    setEditingId(dep.id);
    setEditForm({
      date: dep.date,
      time: dep.time,
      capacity: dep.capacity,
      spots_left: dep.spots_left,
      active: dep.active,
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-[#1c1b1b]">
          Departures
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#4cbb17] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#3a960e] transition-colors"
        >
          {showForm ? "Cancel" : "+ New Departure"}
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterTourId}
          onChange={(e) => setFilterTourId(e.target.value)}
          className="bg-white border border-[#ebe7e7] rounded-xl py-2.5 px-4 text-sm focus:border-[#4cbb17] outline-none"
        >
          <option value="">All Tours</option>
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* New Departure Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">
              Tour *
            </label>
            <select
              required
              value={form.tour_id}
              onChange={(e) => setForm({ ...form, tour_id: e.target.value })}
              className="w-full bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-sm focus:border-[#4cbb17] outline-none"
            >
              <option value="">Select tour</option>
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-sm focus:border-[#4cbb17] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">
              Time *
            </label>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-sm focus:border-[#4cbb17] outline-none"
            />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#78716c] mb-1">
                Capacity *
              </label>
              <input
                type="number"
                required
                min={1}
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: Number(e.target.value) })
                }
                className="w-full bg-white border border-[#ebe7e7] rounded-lg py-2 px-3 text-sm focus:border-[#4cbb17] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4cbb17] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#3a960e] transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#ebe7e7]">
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Tour</th>
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Date</th>
              <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Time</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Capacity</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Spots Left</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Sold Out</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Active</th>
              <th className="text-center px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Hidden</th>
              <th className="text-right px-4 py-3 font-bold text-xs uppercase tracking-wider text-[#78716c]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dep) => (
              <tr
                key={dep.id}
                className="border-b border-[#ebe7e7] last:border-b-0 hover:bg-[#f5f0ee]/50 transition-colors"
              >
                {editingId === dep.id ? (
                  <>
                    <td className="px-4 py-3 font-medium text-[#1c1b1b]">
                      {dep.tours?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={editForm.date ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="border border-[#ebe7e7] rounded px-2 py-1 text-sm w-32 focus:border-[#4cbb17] outline-none"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={editForm.time ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="border border-[#ebe7e7] rounded px-2 py-1 text-sm w-24 focus:border-[#4cbb17] outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={1}
                        value={editForm.capacity ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                        className="border border-[#ebe7e7] rounded px-2 py-1 text-sm w-16 text-center focus:border-[#4cbb17] outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={0}
                        value={editForm.spots_left ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, spots_left: Number(e.target.value) })}
                        className="border border-[#ebe7e7] rounded px-2 py-1 text-sm w-16 text-center focus:border-[#4cbb17] outline-none"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge text={dep.sold_out ? "Yes" : "No"} variant={dep.sold_out ? "error" : "default"} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.active ?? false}
                          onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[#4cbb17] after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full relative" />
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge text={dep.hidden ? "Yes" : "No"} variant={dep.hidden ? "warning" : "default"} />
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(dep.id)}
                        disabled={loading}
                        className="text-[#4cbb17] hover:underline font-medium text-sm disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditForm({}); }}
                        className="text-[#78716c] hover:underline text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-medium text-[#1c1b1b]">
                      {dep.tours?.title ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#1c1b1b]">{dep.date}</td>
                    <td className="px-4 py-3 text-[#1c1b1b]">{dep.time}</td>
                    <td className="px-4 py-3 text-center">{dep.capacity}</td>
                    <td className="px-4 py-3 text-center">{dep.spots_left}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(dep.id, "sold_out", dep.sold_out)}
                        disabled={loading}
                        className="disabled:opacity-50"
                      >
                        <Badge
                          text={dep.sold_out ? "Yes" : "No"}
                          variant={dep.sold_out ? "error" : "default"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        text={dep.active ? "Yes" : "No"}
                        variant={dep.active ? "success" : "error"}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(dep.id, "hidden", dep.hidden)}
                        disabled={loading}
                        className="disabled:opacity-50"
                      >
                        <Badge
                          text={dep.hidden ? "Yes" : "No"}
                          variant={dep.hidden ? "warning" : "default"}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => startEdit(dep)}
                        className="text-[#4cbb17] hover:underline font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(dep.id)}
                        disabled={loading}
                        className="text-blue-600 hover:underline text-sm disabled:opacity-50"
                      >
                        Duplicate
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-[#78716c]">
                  No departures found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
