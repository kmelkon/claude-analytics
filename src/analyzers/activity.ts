import type { StatsCache, ActivityAnalysis } from "../types.js";

export function analyzeActivity(stats: StatsCache): ActivityAnalysis {
  const dailyMap = new Map(stats.dailyActivity.map((d) => [d.date, d]));

  // Build heatmap for full date range
  const start = new Date(stats.firstSessionDate);
  const end = new Date(stats.lastComputedDate);
  const heatmapData: Array<{ date: string; count: number }> = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    heatmapData.push({ date: key, count: dailyMap.get(key)?.messageCount ?? 0 });
  }

  // Streaks (consecutive days with activity)
  let longest = 0;
  let current = 0;
  let currentStart = "";
  let longestStart = "";
  let tempStart = "";

  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].count > 0) {
      // found last active day, scan forward from there
      // Reset and scan chronologically
      break;
    }
  }

  for (const entry of heatmapData) {
    if (entry.count > 0) {
      if (current === 0) tempStart = entry.date;
      current++;
      if (current > longest) {
        longest = current;
        longestStart = tempStart;
      }
    } else {
      current = 0;
    }
  }

  // Current streak: consecutive days ending at last active day
  let currentStreak = 0;
  let currentStreakStart = "";
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i].count > 0) {
      currentStreak++;
      currentStreakStart = heatmapData[i].date;
    } else if (currentStreak > 0) {
      break;
    }
  }

  // Weekday distribution (0=Sun, 6=Sat)
  const weekdayDistribution = new Array(7).fill(0);
  for (const entry of stats.dailyActivity) {
    const dow = new Date(entry.date + "T00:00:00").getDay();
    weekdayDistribution[dow] += entry.messageCount;
  }

  // Hour distribution
  const hourDistribution = new Array(24).fill(0);
  for (let h = 0; h < 24; h++) {
    hourDistribution[h] = stats.hourCounts[String(h)] ?? 0;
  }

  const totalDays = heatmapData.length;
  const activeDays = heatmapData.filter((d) => d.count > 0).length;

  let totalMessages = 0;
  let totalSessions = 0;
  let totalToolCalls = 0;
  let peakDay = { date: "", count: 0 };

  for (const d of stats.dailyActivity) {
    totalMessages += d.messageCount;
    totalSessions += d.sessionCount;
    totalToolCalls += d.toolCallCount;
    if (d.messageCount > peakDay.count) {
      peakDay = { date: d.date, count: d.messageCount };
    }
  }

  return {
    heatmapData,
    streaks: {
      current: currentStreak,
      longest,
      currentStart: currentStreakStart,
    },
    weekdayDistribution,
    hourDistribution,
    totalDays,
    activeDays,
    avgMessagesPerActiveDay: activeDays > 0 ? totalMessages / activeDays : 0,
    peakDay,
    totalMessages,
    totalSessions,
    totalToolCalls,
  };
}
