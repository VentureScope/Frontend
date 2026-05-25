import { describe, expect, it } from "vitest";
import {
  buildForecastChartPoints,
  formatForecastMonth,
  pickDefaultForecastRole,
} from "@/lib/job-market-insights";
import type { JobForecast, JobMatch, TrendingCareer } from "@/types/jobs";

describe("formatForecastMonth", () => {
  it("formats YYYY-MM as short month label", () => {
    expect(formatForecastMonth("2026-06")).toMatch(/Jun/i);
  });
});

describe("buildForecastChartPoints", () => {
  it("sorts by forecast_date ascending", () => {
    const rows: JobForecast[] = [
      {
        normalized_title: "Software Engineer",
        forecast_date: "2026-08",
        predicted_count: 1.46,
        lower_bound: 1.21,
        upper_bound: 1.71,
      },
      {
        normalized_title: "Software Engineer",
        forecast_date: "2026-06",
        predicted_count: 1.49,
        lower_bound: 1.23,
        upper_bound: 1.75,
      },
    ];
    const points = buildForecastChartPoints(rows);
    expect(points[0].forecast_date).toBe("2026-06");
    expect(points[1].forecast_date).toBe("2026-08");
    expect(points[0].predicted).toBe(1.49);
  });
});

describe("pickDefaultForecastRole", () => {
  it("prefers profile match when it appears in trending roles", () => {
    const trending: TrendingCareer[] = [
      { name: "Data Scientist", job_count: 10, company_count: 2 },
      { name: "Software Engineer", job_count: 20, company_count: 5 },
    ];
    const matches: JobMatch[] = [
      {
        id: "1",
        job_title: "SE",
        company_name: "Co",
        normalized_title: "Software Engineer",
      },
    ];
    expect(pickDefaultForecastRole(trending, matches, "data")).toBe(
      "Software Engineer",
    );
  });

  it("returns empty string when trending list is empty", () => {
    expect(pickDefaultForecastRole([], [], null)).toBe("");
  });

  it("falls back to first trending role when no preference matches", () => {
    const trending: TrendingCareer[] = [
      { name: "Product Manager", job_count: 5, company_count: 1 },
    ];
    expect(pickDefaultForecastRole(trending, [], "design")).toBe(
      "Product Manager",
    );
  });
});
