import { describe, expect, it } from "vitest";
import {
  buildForecastChartPoints,
  buildFutureRoleForecastBars,
  deriveTrendingCareersFromForecasts,
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

describe("deriveTrendingCareersFromForecasts", () => {
  it("ranks roles by average projected postings and excludes Other", () => {
    const rows: JobForecast[] = [
      {
        normalized_title: "Systems Administrator",
        forecast_date: "2026-06",
        predicted_count: 26.21,
        lower_bound: 17,
        upper_bound: 35,
      },
      {
        normalized_title: "Systems Administrator",
        forecast_date: "2026-11",
        predicted_count: 22.69,
        lower_bound: 13,
        upper_bound: 31,
      },
      {
        normalized_title: "QA Engineer",
        forecast_date: "2026-06",
        predicted_count: 6.45,
        lower_bound: 4,
        upper_bound: 8,
      },
      {
        normalized_title: "QA Engineer",
        forecast_date: "2026-11",
        predicted_count: 2.8,
        lower_bound: 1,
        upper_bound: 4,
      },
      {
        normalized_title: "Other",
        forecast_date: "2026-06",
        predicted_count: 10,
        lower_bound: 5,
        upper_bound: 15,
      },
      {
        normalized_title: "Other",
        forecast_date: "2026-11",
        predicted_count: 20,
        lower_bound: 10,
        upper_bound: 30,
      },
    ];

    const ranked = deriveTrendingCareersFromForecasts(rows, 2);
    expect(ranked).toHaveLength(2);
    expect(ranked[0].name).toBe("Systems Administrator");
    expect(ranked[0].job_count).toBeGreaterThan(ranked[1].job_count);
    expect(ranked[1].name).toBe("QA Engineer");
  });
});

describe("buildFutureRoleForecastBars", () => {
  it("includes monthly breakdown and ranks by average postings", () => {
    const rows: JobForecast[] = [
      {
        normalized_title: "Systems Administrator",
        forecast_date: "2026-06",
        predicted_count: 26,
        lower_bound: 17,
        upper_bound: 35,
      },
      {
        normalized_title: "Systems Administrator",
        forecast_date: "2026-11",
        predicted_count: 22,
        lower_bound: 13,
        upper_bound: 31,
      },
      {
        normalized_title: "QA Engineer",
        forecast_date: "2026-06",
        predicted_count: 6,
        lower_bound: 4,
        upper_bound: 8,
      },
      {
        normalized_title: "QA Engineer",
        forecast_date: "2026-11",
        predicted_count: 2,
        lower_bound: 1,
        upper_bound: 4,
      },
    ];

    const bars = buildFutureRoleForecastBars(rows);
    expect(bars[0].name).toBe("Systems Administrator");
    expect(bars[0].rank).toBe(1);
    expect(bars[0].monthlyPostings).toHaveLength(2);
    expect(bars[0].projectedPosts).toBe(24);
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
