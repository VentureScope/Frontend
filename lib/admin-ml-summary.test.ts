import { describe, expect, it } from "vitest";
import { buildMlRunDetail, splitMlRunSummaryParts } from "@/lib/admin-ml-summary";

describe("buildMlRunDetail", () => {
  it("builds summary from VentureScope list item fields", () => {
    const result = buildMlRunDetail({
      run_id: "run-abc",
      dag_id: "ml_training_dag",
      model_type: "xgboost",
      status: "awaiting_review",
      accuracy: 0.87,
      f1_score: 0.82,
      auc_roc: 0.91,
      record_count: 4200,
      months_covered: 18,
      model_size_bytes: 2_500_000,
      staging_pkl_key: "staging/models/run-abc.pkl",
      created_at: "2026-05-20T10:00:00Z",
    });

    expect(result.has_summary).toBe(true);
    expect(result.shortSummary).toContain("Accuracy");
    expect(result.shortSummary).toContain("87");
    expect(result.detail.some((s) => s.title === "Performance")).toBe(true);
    expect(result.detail.some((s) => s.title === "Training data")).toBe(true);
  });

  it("uses metrics_summary when provided by API", () => {
    const result = buildMlRunDetail({
      run_id: "1",
      metrics_summary: "Strong val accuracy on holdout set",
    });
    expect(result.has_summary).toBe(true);
    expect(result.shortSummary).toBe("Strong val accuracy on holdout set");
  });

  it("has no viewable summary when only bare run metadata exists", () => {
    const result = buildMlRunDetail({
      run_id: "1",
      status: "training",
      model_type: "xgboost",
    });
    expect(result.has_summary).toBe(false);
    expect(result.detail.some((s) => s.title === "Run")).toBe(true);
  });
});

describe("splitMlRunSummaryParts", () => {
  it("splits on middle dot separator", () => {
    expect(splitMlRunSummaryParts("accuracy: 91% · loss: 0.08")).toEqual([
      "accuracy: 91%",
      "loss: 0.08",
    ]);
  });
});
