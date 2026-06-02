"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dispatchMarketPeriodChange,
  MARKET_ANALYTICS_PERIODS,
  marketPeriodDays,
  marketPeriodFromId,
  marketPeriodLabel,
  marketPeriodLookbackPhrase,
  MARKET_PERIOD_CHANGE_EVENT,
  readStoredMarketPeriodId,
  writeStoredMarketPeriodId,
  type MarketPeriodId,
} from "@/lib/market-analytics-period";

export function useMarketAnalyticsPeriod() {
  const [periodId, setPeriodIdState] = useState<MarketPeriodId>(() =>
    readStoredMarketPeriodId(),
  );

  useEffect(() => {
    function onPeriodChange(event: Event) {
      const detail = (event as CustomEvent<MarketPeriodId>).detail;
      if (detail) {
        setPeriodIdState(detail);
        return;
      }
      setPeriodIdState(readStoredMarketPeriodId());
    }

    window.addEventListener(MARKET_PERIOD_CHANGE_EVENT, onPeriodChange);
    return () => {
      window.removeEventListener(MARKET_PERIOD_CHANGE_EVENT, onPeriodChange);
    };
  }, []);

  const setPeriodId = useCallback((id: MarketPeriodId) => {
    setPeriodIdState(id);
    writeStoredMarketPeriodId(id);
    dispatchMarketPeriodChange(id);
  }, []);

  const days = marketPeriodDays(periodId);

  return {
    periodId,
    setPeriodId,
    days,
    label: marketPeriodLabel(periodId),
    lookbackPhrase: marketPeriodLookbackPhrase(days),
    period: marketPeriodFromId(periodId),
    periodOptions: MARKET_ANALYTICS_PERIODS,
  };
}
