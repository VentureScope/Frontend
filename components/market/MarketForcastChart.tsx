import React from "react";

const FORECAST_COLOR = "var(--secondary)";

const MarketForecastChart = () => {
  const data = [
    { month: "JAN", percent: 42, color: "#E5EEFF", type: "past" },
    { month: "FEB", percent: 55, color: "#D1E2FB", type: "past" },
    { month: "MAR", percent: 48, color: "#B8D0F7", type: "past" },
    { month: "APR", percent: 65, color: "#A1BFF3", type: "past" },
    { month: "MAY", percent: 75, color: "#8BAEF0", type: "past" },
    { month: "JUN", percent: 80, color: "#D994A4", type: "forecast" },
    { month: "JUL", percent: 86, color: "#F2D8DD", type: "forecast" },
    { month: "AUG", percent: 92, color: "#F6E4E8", type: "forecast" },
  ];

  const maxPercent = 100;

  return (
    <div className="w-full rounded-lg sm:rounded-xl border border-border bg-card p-4 sm:p-6 md:p-10 shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 md:mb-12 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-[28px] md:text-[30px] font-extrabold tracking-tight text-foreground">
            Market Forecast FR5.5
          </h2>
          <p className="text-sm sm:text-[15px] font-medium text-muted-foreground">
            AI-predicted talent demand trendline for Q3/Q4 2024
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-muted p-1 sm:p-1.5 self-start md:self-auto shrink-0 w-fit">
          <button className="rounded-lg bg-muted px-4 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-[13px] font-bold text-primary shadow-sm transition-all whitespace-nowrap">
            Quarterly
          </button>
          <button className="px-4 sm:px-5 py-1 sm:py-1.5 text-xs sm:text-[13px] font-bold text-muted-foreground hover:text-muted-foreground transition-colors whitespace-nowrap">
            Yearly
          </button>
        </div>
      </div>

      {/* Histogram Chart Section - No gaps between bars */}
      <div className="relative w-full overflow-x-auto pb-4 hide-scrollbar">
        <div className="min-w-125 md:min-w-full pl-6 pr-2">
          <div className="relative w-full" style={{ minHeight: "360px" }}>
            {/* Background Y-axis grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[0, 25, 50, 75, 100].map((tick) => (
                <div
                  key={tick}
                  className="absolute w-full border-t border-border"
                  style={{ top: `${100 - tick}%` }}
                >
                  <span className="absolute -left-6 -translate-y-1/2 text-[10px] font-mono text-muted-foreground/50 bg-card/70 px-1 rounded">
                    {tick}%
                  </span>
                </div>
              ))}
              <div
                className="absolute w-full border-t border-border"
                style={{ top: "100%" }}
              />
            </div>

            {/* Histogram bars container - flex with no gaps */}
            <div className="relative z-10 flex items-end h-full pt-8 pb-2">
              {data.map((item, idx) => {
                const barHeight = (item.percent / maxPercent) * 100;
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end relative group"
                    style={{ minWidth: "0" }}
                  >
                    {/* Percentage value on top of bar */}
                    <div
                      className={`text-[11px] font-bold mb-2 transition-opacity opacity-0 group-hover:opacity-100 ${
                        item.type === "forecast"
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                      style={{ opacity: 1 }}
                    >
                      {item.percent}%
                    </div>

                    {/* Bar container */}
                    <div
                      className="relative w-full flex justify-center"
                      style={{ height: "220px" }}
                    >
                      {/* The vertical bar - full width with no gaps */}
                      <div
                        className="w-full transition-all duration-700 ease-out relative"
                        style={{
                          height: `${barHeight}%`,
                          backgroundColor: item.color,
                          alignSelf: "flex-end",
                          borderTopLeftRadius: idx === 0 ? "8px" : "0",
                          borderTopRightRadius:
                            idx === data.length - 1 ? "8px" : "0",
                        }}
                      >
                        {/* Dashed top edge for forecast bars */}
                        {item.type === "forecast" && (
                          <div
                            className="absolute top-0 left-0 w-full h-0.75 pointer-events-none"
                            style={{
                              background:
                                `repeating-linear-gradient(90deg, ${FORECAST_COLOR}, ${FORECAST_COLOR} 6px, transparent 6px, transparent 12px)`,
                              borderTopLeftRadius: idx === 0 ? "8px" : "0",
                              borderTopRightRadius:
                                idx === data.length - 1 ? "8px" : "0",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Month label */}
                    <div
                      className={`mt-3 text-[11px] font-bold tracking-wide uppercase ${
                        item.type === "forecast"
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.month}
                    </div>

                    {/* AI Forecast label above JUN bar */}
                    {item.month === "JUN" && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                        <span className="rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-secondary shadow-sm">
                          AI Forecast
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* X-axis baseline */}
      <div className="mt-1 h-px w-full bg-border" />

      {/* Legend / Footer */}
      <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#E5EEFF]"></div>
            <span>Past actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#F2D8DD]"></div>
            <span>AI Forecast</span>
            <div className="ml-1 h-px w-4 border-t border-dashed border-secondary" />
            <span className="ml-0.5 text-[10px] text-secondary">
              dashed edge
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground/50 mt-2 sm:mt-0">
          * AI confidence interval: Q3/Q4 upward trend
        </div>
      </div>
    </div>
  );
};

export default MarketForecastChart;
