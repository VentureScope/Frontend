import React from "react";

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
    <div className="w-full rounded-[32px] border border-slate-100 bg-white p-6 md:p-10 shadow-sm">
      {/* Header Section */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[28px] md:text-[30px] font-extrabold tracking-tight text-[#0f172a]">
            Market Forecast FR5.5
          </h2>
          <p className="text-[15px] font-medium text-slate-400">
            AI-predicted talent demand trendline for Q3/Q4 2024
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-[#f1f5f9] p-1.5 self-start md:self-auto">
          <button className="rounded-full bg-[#e1ebff] px-5 py-1.5 text-[13px] font-bold text-[#1d59db] shadow-sm transition-all">
            Quarterly
          </button>
          <button className="px-5 py-1.5 text-[13px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
            Yearly
          </button>
        </div>
      </div>

      {/* Histogram Chart Section - No gaps between bars */}
      <div className="relative w-full overflow-x-auto pb-4">
        <div className="min-w-[680px] md:min-w-full">
          <div className="relative w-full" style={{ minHeight: "360px" }}>
            {/* Background Y-axis grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {[0, 25, 50, 75, 100].map((tick) => (
                <div
                  key={tick}
                  className="absolute w-full border-t border-slate-100"
                  style={{ top: `${100 - tick}%` }}
                >
                  <span className="absolute -left-6 -translate-y-1/2 text-[10px] font-mono text-slate-300 bg-white/70 px-1 rounded">
                    {tick}%
                  </span>
                </div>
              ))}
              <div
                className="absolute w-full border-t border-slate-200"
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
                          ? "text-[#b0002d]"
                          : "text-slate-500"
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
                            className="absolute top-0 left-0 w-full h-[3px] pointer-events-none"
                            style={{
                              background:
                                "repeating-linear-gradient(90deg, #b0002d, #b0002d 6px, transparent 6px, transparent 12px)",
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
                          ? "text-[#b0002d]"
                          : "text-slate-400"
                      }`}
                    >
                      {item.month}
                    </div>

                    {/* AI Forecast label above JUN bar */}
                    {item.month === "JUN" && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                        <span className="text-[10px] font-black tracking-widest text-[#b0002d] uppercase bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
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
      <div className="w-full h-px bg-slate-200 mt-1" />

      {/* Legend / Footer */}
      <div className="flex flex-wrap justify-between items-center mt-6 pt-4 border-t border-slate-50 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#E5EEFF]"></div>
            <span>Past actual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[#F2D8DD]"></div>
            <span>AI Forecast</span>
            <div className="w-4 h-px bg-[#b0002d] border-t border-dashed border-[#b0002d] ml-1"></div>
            <span className="text-[10px] text-[#b0002d] ml-0.5">
              dashed edge
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-300 mt-2 sm:mt-0">
          * AI confidence interval: Q3/Q4 upward trend
        </div>
      </div>
    </div>
  );
};

export default MarketForecastChart;
