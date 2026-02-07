import type { StatsCache, CostAnalysis } from "../types.js";
import { MODEL_PRICING } from "../config.js";

const DEFAULT_PRICING = MODEL_PRICING["claude-sonnet-4-20250514"];

function pricingFor(model: string) {
  return MODEL_PRICING[model] ?? DEFAULT_PRICING;
}

export function analyzeCosts(stats: StatsCache): CostAnalysis {
  const costByModel: CostAnalysis["costByModel"] = {};
  const tokensByModel: CostAnalysis["tokensByModel"] = {};
  const totalTokens = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  let totalCost = 0;

  for (const [model, usage] of Object.entries(stats.modelUsage)) {
    const p = pricingFor(model);
    const input = (usage.inputTokens / 1_000_000) * p.input;
    const cacheRead = (usage.cacheReadInputTokens / 1_000_000) * p.cacheRead;
    const cacheWrite =
      (usage.cacheCreationInputTokens / 1_000_000) * p.cacheWrite;
    const output = (usage.outputTokens / 1_000_000) * p.output;
    const total = input + cacheRead + cacheWrite + output;

    costByModel[model] = { input, cacheRead, cacheWrite, output, total };
    tokensByModel[model] = {
      input: usage.inputTokens,
      output: usage.outputTokens,
      cacheRead: usage.cacheReadInputTokens,
      cacheWrite: usage.cacheCreationInputTokens,
    };

    totalTokens.input += usage.inputTokens;
    totalTokens.output += usage.outputTokens;
    totalTokens.cacheRead += usage.cacheReadInputTokens;
    totalTokens.cacheWrite += usage.cacheCreationInputTokens;
    totalCost += total;
  }

  // Daily cost from dailyModelTokens (tokensByModel values are output tokens)
  const dailyCost: Array<{ date: string; cost: number }> = stats.dailyModelTokens.map(
    (day) => {
      let dayCost = 0;
      for (const [model, tokens] of Object.entries(day.tokensByModel)) {
        const p = pricingFor(model);
        dayCost += (tokens / 1_000_000) * p.output;
      }
      return { date: day.date, cost: dayCost };
    }
  );

  return { totalCost, costByModel, dailyCost, totalTokens, tokensByModel };
}
