import type { CondensedTranscript, SessionFacet, ProjectAnalysis } from "../types.js";

export function getFacetExtractionPrompt(transcript: CondensedTranscript): { system: string; content: string } {
  const system = `You analyze Claude Code session transcripts and extract structured metadata.

Respond with ONLY valid JSON matching this exact schema:
{
  "sessionId": "string",
  "taskType": "bug-fix|feature|refactor|config|exploration|debugging|docs|testing|design",
  "complexity": "trivial|simple|moderate|complex",
  "userBehavior": {
    "providedContext": boolean,
    "iteratedOnSolution": boolean,
    "testedResult": boolean,
    "usedPlanMode": boolean,
    "pastedErrors": boolean,
    "scopeCreep": boolean
  },
  "toolsLeveraged": ["list of Claude Code tools/features used, e.g. Edit, Bash, Read, Glob, Grep, WebSearch, TodoWrite, Task"],
  "outcome": "success|partial|abandoned|unclear",
  "keyTopic": "one-line summary of what the session was about",
  "antiPatterns": ["0-3 things the user did suboptimally"],
  "goodPractices": ["0-3 things the user did well"]
}

Guidelines:
- taskType: infer from the conversation — what was the user trying to accomplish?
- complexity: trivial = single simple change; simple = straightforward task; moderate = multi-step or requires understanding; complex = large scope or tricky debugging
- userBehavior: infer each boolean from conversation patterns
  - providedContext: user gave background info, file paths, or error messages upfront
  - iteratedOnSolution: user refined or adjusted the approach after initial attempt
  - testedResult: user ran tests, checked output, or verified the result
  - usedPlanMode: user explicitly used plan mode or asked for a plan before implementation
  - pastedErrors: user shared error messages or stack traces
  - scopeCreep: task expanded beyond original request during session
- toolsLeveraged: which Claude Code tools/features were used (Edit, Bash, Read, Glob, Grep, WebSearch, etc.)
- outcome: success = task completed; partial = some progress; abandoned = user gave up; unclear = can't determine
- antiPatterns: things like vague prompts, not providing context, not testing, excessive back-and-forth
- goodPractices: things like clear prompts, providing context, testing results, using plan mode

No markdown, no explanation — just the JSON object.`;

  const turns = transcript.turns
    .map((t) => `[${t.role}]: ${t.text}`)
    .join("\n\n");

  const content = `Session ID: ${transcript.sessionId}
Message count: ${transcript.messageCount}

Transcript:
${turns}`;

  return { system, content };
}

export function getSynthesisPrompt(
  facets: SessionFacet[],
  totalSessions: number,
  projects?: ProjectAnalysis[]
): { system: string; content: string } {
  const system = `You are a deeply insightful coding workflow analyst. You synthesize patterns across a user's Claude Code sessions to produce a personalized, narrative assessment of how they use Claude.

You write in 2nd person ("you", "your"). Your tone is like a thoughtful consultant who has been watching over the user's shoulder — specific, direct, and referencing actual project names, technologies, tools, and workflows by name.

Respond with ONLY valid JSON matching this schema:
{
  "atAGlance": {
    "whatsWorking": "3-5 sentence flowing paragraph. Reference specific projects, technologies, and workflows. Highlight the user's strongest patterns.",
    "whatsHindering": "3-5 sentence flowing paragraph. Cover BOTH Claude-side friction (wrong approaches, misunderstandings) AND user-side friction (overscoping, not testing). Be specific about scenarios.",
    "quickWins": "3-5 sentence flowing paragraph. Recommend specific Claude Code features. Use **bold** markdown for feature names (e.g., **custom slash commands**, **hooks**, **headless mode**). Tie each suggestion to a concrete pattern you observed.",
    "ambitiousWorkflows": "3-5 sentence flowing paragraph. Forward-looking suggestions for more autonomous workflows. Reference the user's actual projects and how they could evolve."
  },
  "impressiveThings": [
    { "title": "short title", "detail": "2-3 sentences", "evidence": "specific example from the data" }
  ],
  "whereThingsGoWrong": [
    { "title": "short title", "detail": "2-3 sentences", "suggestion": "concrete actionable fix" }
  ],
  "featuresToTry": [
    { "title": "feature name", "detail": "why this would help, based on their patterns", "howToUse": "concrete usage example" }
  ]
}

Key guidelines:
- Each array should have 4-6 items
- The "At a Glance" paragraphs should be rich, narrative, flowing prose — NOT bullet points
- Reference specific project names, technologies (React Native, Firebase, etc.), and task types
- Bold important feature names in quickWins with **markdown**
- Be deeply personalized. Generic advice like "write better prompts" is useless. Instead: "Your Expenses app sessions show a pattern of..."
- For whatsHindering, distinguish between what Claude gets wrong vs what the user could do differently
- For quickWins, only suggest Claude Code features that actually exist: hooks, headless mode, custom slash commands, /compact, plan mode, CLAUDE.md, MCP servers, vim mode, etc.
- For ambitiousWorkflows, imagine how the user's existing patterns could be automated further

No markdown outside the **bold** syntax in quickWins. No explanation outside the JSON.`;

  // Build enriched context from facets
  const keyTopics = facets.map((f) => f.keyTopic).filter(Boolean);
  const taskTypeCounts: Record<string, number> = {};
  const toolCounts: Record<string, number> = {};
  const outcomeCounts: Record<string, number> = {};
  const complexityCounts: Record<string, number> = {};
  let behaviorSums = {
    providedContext: 0, iteratedOnSolution: 0, testedResult: 0,
    usedPlanMode: 0, pastedErrors: 0, scopeCreep: 0,
  };

  for (const f of facets) {
    taskTypeCounts[f.taskType] = (taskTypeCounts[f.taskType] || 0) + 1;
    outcomeCounts[f.outcome] = (outcomeCounts[f.outcome] || 0) + 1;
    complexityCounts[f.complexity] = (complexityCounts[f.complexity] || 0) + 1;
    for (const t of f.toolsLeveraged) {
      toolCounts[t] = (toolCounts[t] || 0) + 1;
    }
    if (f.userBehavior) {
      for (const [k, v] of Object.entries(f.userBehavior)) {
        if (v) behaviorSums[k as keyof typeof behaviorSums]++;
      }
    }
  }

  const allAntiPatterns = facets.flatMap((f) => f.antiPatterns).filter(Boolean);
  const allGoodPractices = facets.flatMap((f) => f.goodPractices).filter(Boolean);

  // Count anti-pattern frequency
  const antiPatternCounts: Record<string, number> = {};
  for (const ap of allAntiPatterns) {
    antiPatternCounts[ap] = (antiPatternCounts[ap] || 0) + 1;
  }
  const topAntiPatterns = Object.entries(antiPatternCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([p, c]) => `${p} (${c}x)`);

  const goodPracticeCounts: Record<string, number> = {};
  for (const gp of allGoodPractices) {
    goodPracticeCounts[gp] = (goodPracticeCounts[gp] || 0) + 1;
  }
  const topGoodPractices = Object.entries(goodPracticeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([p, c]) => `${p} (${c}x)`);

  // Project info
  const projectInfo = projects
    ? projects
        .sort((a, b) => b.sessionCount - a.sessionCount)
        .slice(0, 15)
        .map((p) => `${p.name}: ${p.sessionCount} sessions, ${p.messageCount} messages`)
        .join("\n")
    : "";

  const content = `Analyzed ${facets.length} of ${totalSessions} total sessions.

## Projects (by usage):
${projectInfo || "Not available"}

## Task type distribution:
${Object.entries(taskTypeCounts).sort(([, a], [, b]) => b - a).map(([t, c]) => `${t}: ${c}`).join(", ")}

## Complexity distribution:
${Object.entries(complexityCounts).sort(([, a], [, b]) => b - a).map(([t, c]) => `${t}: ${c}`).join(", ")}

## Outcome distribution:
${Object.entries(outcomeCounts).sort(([, a], [, b]) => b - a).map(([t, c]) => `${t}: ${c}`).join(", ")}

## Tool usage frequency:
${Object.entries(toolCounts).sort(([, a], [, b]) => b - a).map(([t, c]) => `${t}: ${c}`).join(", ")}

## User behaviors (count of sessions exhibiting):
- Provided context upfront: ${behaviorSums.providedContext}/${facets.length}
- Iterated on solution: ${behaviorSums.iteratedOnSolution}/${facets.length}
- Tested result: ${behaviorSums.testedResult}/${facets.length}
- Used plan mode: ${behaviorSums.usedPlanMode}/${facets.length}
- Pasted errors: ${behaviorSums.pastedErrors}/${facets.length}
- Scope creep: ${behaviorSums.scopeCreep}/${facets.length}

## Top recurring anti-patterns:
${topAntiPatterns.join("\n")}

## Top recurring good practices:
${topGoodPractices.join("\n")}

## Key topics (sample of what sessions were about):
${keyTopics.slice(0, 40).join("\n")}`;

  return { system, content };
}
