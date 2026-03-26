import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

/**
 * Unit tests for tours API integration with departure generation
 * Validates: Requirements 6.1, 6.2, 6.3
 */

// --- Mocks ---

// Mock supabaseAdmin with chainable query builder
const mockFrom = vi.fn();

const supabaseAdmin = { from: mockFrom };

vi.mock("@/lib/supabase/server", () => ({
  supabaseAdmin,
}));

// Mock departure generation functions
const mockGenerateDeparturesForTour = vi.fn();
const mockRegenerateDepartures = vi.fn();

vi.mock("@/lib/departures/generate", () => ({
  generateDeparturesForTour: (...args: unknown[]) =>
    mockGenerateDeparturesForTour(...args),
  regenerateDepartures: (...args: unknown[]) =>
    mockRegenerateDepartures(...args),
}));

// --- Helpers ---

function makePostRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/tours", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

function makePutRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost:3000/api/tours/tour-123", {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

const baseTourBody = {
  title: "Test Tour",
  short_description: "A test tour",
  type: "walking",
  base_price: 500,
  capacity_default: 10,
};

const fakeTour = {
  id: "tour-123",
  title: "Test Tour",
  slug: "test-tour",
  short_description: "A test tour",
  type: "walking",
  base_price: 500,
  capacity_default: 10,
  weekday: null,
  departure_time: null,
  active: true,
};

// --- Tests ---

describe("POST /api/tours — departure generation integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns departures_created when weekday and departure_time are provided", async () => {
    // Mock supabase insert chain: from('tours').insert(...).select().single()
    mockFrom.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: { ...fakeTour, weekday: 3, departure_time: "10:00" },
              error: null,
            }),
        }),
      }),
    }));

    mockGenerateDeparturesForTour.mockResolvedValue({ created: 12 });

    const { POST } = await import("../../tours/route");

    const req = makePostRequest({
      ...baseTourBody,
      weekday: 3,
      departure_time: "10:00",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.departures_created).toBe(12);
    expect(mockGenerateDeparturesForTour).toHaveBeenCalledWith(
      "tour-123",
      3,
      "10:00",
      10
    );
  });

  it("omits departure generation when weekday is null", async () => {
    mockFrom.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: { ...fakeTour, weekday: null, departure_time: "10:00" },
              error: null,
            }),
        }),
      }),
    }));

    const { POST } = await import("../../tours/route");

    const req = makePostRequest({
      ...baseTourBody,
      departure_time: "10:00",
      // weekday not provided → null
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.departures_created).toBeUndefined();
    expect(mockGenerateDeparturesForTour).not.toHaveBeenCalled();
  });

  it("returns warning when departure generation fails", async () => {
    mockFrom.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: { ...fakeTour, weekday: 1, departure_time: "09:00" },
              error: null,
            }),
        }),
      }),
    }));

    mockGenerateDeparturesForTour.mockRejectedValue(
      new Error("DB connection failed")
    );

    const { POST } = await import("../../tours/route");

    const req = makePostRequest({
      ...baseTourBody,
      weekday: 1,
      departure_time: "09:00",
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.warning).toBeDefined();
    expect(json.id).toBe("tour-123");
    expect(json.departures_created).toBeUndefined();
  });
});


describe("PUT /api/tours/:id — departure regeneration integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns departures_deleted and departures_created when weekday changes", async () => {
    const previousTour = { ...fakeTour, weekday: 1, departure_time: "10:00" };
    const updatedTour = { ...fakeTour, weekday: 3, departure_time: "10:00" };

    let callCount = 0;
    mockFrom.mockImplementation(() => ({
      // First call: select previous tour; Second call: update
      select: () => ({
        eq: () => ({
          single: () => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve({ data: previousTour, error: null });
            }
            return Promise.resolve({ data: updatedTour, error: null });
          },
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({ data: updatedTour, error: null }),
          }),
        }),
      }),
    }));

    mockRegenerateDepartures.mockResolvedValue({ deleted: 8, created: 12 });

    const { PUT } = await import("../../tours/[id]/route");

    const req = makePutRequest({ ...baseTourBody, weekday: 3, departure_time: "10:00" });
    const res = await PUT(req, { params: Promise.resolve({ id: "tour-123" }) });
    const json = await res.json();

    expect(json.departures_deleted).toBe(8);
    expect(json.departures_created).toBe(12);
    expect(mockRegenerateDepartures).toHaveBeenCalledWith(
      "tour-123",
      3,
      "10:00",
      10
    );
  });

  it("does not regenerate when weekday and departure_time are unchanged", async () => {
    const existingTour = { ...fakeTour, weekday: 2, departure_time: "14:00" };

    mockFrom.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: existingTour, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({ data: existingTour, error: null }),
          }),
        }),
      }),
    }));

    const { PUT } = await import("../../tours/[id]/route");

    const req = makePutRequest({
      ...baseTourBody,
      weekday: 2,
      departure_time: "14:00",
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "tour-123" }) });
    const json = await res.json();

    expect(json.departures_deleted).toBeUndefined();
    expect(json.departures_created).toBeUndefined();
    expect(mockRegenerateDepartures).not.toHaveBeenCalled();
  });

  it("returns warning when regeneration fails", async () => {
    const previousTour = { ...fakeTour, weekday: 1, departure_time: "10:00" };
    const updatedTour = { ...fakeTour, weekday: 5, departure_time: "11:00" };

    mockFrom.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: previousTour, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({ data: updatedTour, error: null }),
          }),
        }),
      }),
    }));

    mockRegenerateDepartures.mockRejectedValue(new Error("DB error"));

    const { PUT } = await import("../../tours/[id]/route");

    const req = makePutRequest({
      ...baseTourBody,
      weekday: 5,
      departure_time: "11:00",
    });
    const res = await PUT(req, { params: Promise.resolve({ id: "tour-123" }) });
    const json = await res.json();

    expect(json.warning).toBeDefined();
    expect(json.id).toBe("tour-123");
    expect(json.departures_deleted).toBeUndefined();
    expect(json.departures_created).toBeUndefined();
  });
});
